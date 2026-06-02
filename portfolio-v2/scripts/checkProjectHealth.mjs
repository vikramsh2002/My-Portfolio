import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, "../public");
const projectsDataPath = resolve(__dirname, "../src/projects.json");
const summaryPath = resolve(__dirname, "../project-health-summary.md");
const shouldFix = process.argv.includes("--fix");
const skipNetwork = process.argv.includes("--skip-network");
const timeoutMs = Number(process.env.PROJECT_HEALTH_TIMEOUT_MS || 12000);
const userAgent = "Mozilla/5.0 (compatible; PortfolioProjectHealth/1.0; +https://github.com/vikramsh2002/My-Portfolio)";

const projects = JSON.parse(readFileSync(projectsDataPath, "utf8"));
const fixes = [];
const reviewNotes = [];
const warnings = [];
const checkedLinks = [];
let changed = false;

if (!Array.isArray(projects)) {
  throw new Error("projects.json must contain a project array.");
}

const updatedProjects = [];

for (const [projectIndex, rawProject] of projects.entries()) {
  const project = normalizeProject(rawProject);
  const projectName = project.title || `Project ${projectIndex + 1}`;

  if (JSON.stringify(project) !== JSON.stringify(rawProject)) {
    changed = true;
    fixes.push(`Normalized spacing, tags, or link metadata for "${projectName}".`);
  }

  validateRequiredText(project, projectName);
  validateImage(project, projectName);

  const linkResult = await cleanAndCheckLinks(project, projectName);
  project.links = linkResult.links;

  if (!project.links.length) {
    reviewNotes.push(`"${projectName}" has no usable project links after cleanup.`);
  }

  updatedProjects.push(project);
}

if (!shouldFix && changed) {
  reviewNotes.push(
    "Project data has automatic cleanup suggestions. Run `npm run project:health:fix` and commit the result."
  );
}

if (shouldFix && changed) {
  writeFileSync(projectsDataPath, `${JSON.stringify(updatedProjects, null, 2)}\n`, "utf8");
}

const status = reviewNotes.length ? "needs_review" : changed ? "fixed" : "clean";
writeSummary({ status });
writeOutput("status", status);
writeOutput("changed", String(Boolean(shouldFix && changed)));
writeOutput("fix_count", String(fixes.length));
writeOutput("review_count", String(reviewNotes.length));
writeOutput("warning_count", String(warnings.length));
writeOutput("summary_path", summaryPath);

function normalizeProject(project) {
  const normalized = {
    ...project,
    title: clean(project.title),
    subtitle: clean(project.subtitle),
    image: clean(project.image),
    description: clean(project.description),
    impact: clean(project.impact),
    tags: normalizeTags(project.tags),
    links: normalizeLinks(project.links),
  };

  if (Object.hasOwn(project, "featured")) {
    normalized.featured = Boolean(project.featured);
  }

  return normalized;
}

function validateRequiredText(project, projectName) {
  for (const field of ["title", "subtitle", "description", "impact"]) {
    if (!project[field]) {
      reviewNotes.push(`"${projectName}" is missing required field: ${field}.`);
    }
  }

  if (!project.tags.length) {
    reviewNotes.push(`"${projectName}" is missing tags.`);
  }
}

function validateImage(project, projectName) {
  if (!project.image) {
    reviewNotes.push(`"${projectName}" is missing a project image.`);
    return;
  }

  if (/^https?:\/\//i.test(project.image)) {
    reviewNotes.push(`"${projectName}" uses a remote image. Move it into public/images/Projects for stable builds.`);
    return;
  }

  const imagePath = resolve(publicDir, project.image);
  if (!existsSync(imagePath)) {
    reviewNotes.push(`"${projectName}" references a missing image: ${project.image}.`);
  }
}

async function cleanAndCheckLinks(project, projectName) {
  const seenLinks = new Set();
  const keptLinks = [];

  for (const link of project.links) {
    const normalizedHref = normalizeHref(link.href);

    if (!normalizedHref) {
      changed = true;
      fixes.push(`Removed an empty link from "${projectName}".`);
      continue;
    }

    if (seenLinks.has(normalizedHref)) {
      changed = true;
      fixes.push(`Removed duplicate "${link.label}" link from "${projectName}".`);
      continue;
    }

    seenLinks.add(normalizedHref);

    if (!/^https?:\/\//i.test(link.href)) {
      reviewNotes.push(`"${projectName}" has a non-web project link that needs review: ${link.href}.`);
      keptLinks.push(link);
      continue;
    }

    if (!skipNetwork) {
      const check = await checkUrl(link.href);
      checkedLinks.push({ projectName, label: link.label, href: link.href, ...check });

      if (check.status === "dead") {
        const remainingLinkCount = project.links.filter((candidate) => normalizeHref(candidate.href)).length - 1;
        const importantSourceLink = isSourceLink(link);

        if (shouldFix && !importantSourceLink && remainingLinkCount > 0) {
          changed = true;
          fixes.push(`Removed dead "${link.label}" link from "${projectName}": ${link.href}`);
          continue;
        }

        reviewNotes.push(
          `"${projectName}" has a dead ${importantSourceLink ? "source" : "project"} link that needs review: ${link.href} (${check.reason}).`
        );
      } else if (check.status === "blocked") {
        warnings.push(
          `"${projectName}" ${link.label} link could not be fully checked in this environment: ${link.href} (${check.reason}).`
        );
      } else if (check.status === "transient") {
        warnings.push(
          `"${projectName}" ${link.label} link had a transient check issue: ${link.href} (${check.reason}).`
        );
      }
    }

    keptLinks.push(link);
  }

  return { links: keptLinks };
}

async function checkUrl(url) {
  const head = await requestUrl(url, "HEAD");

  if (head.kind === "response" && isHealthyStatus(head.statusCode)) {
    return { status: "ok", reason: `HTTP ${head.statusCode}` };
  }

  if (head.kind === "response" && shouldRetryWithGet(head.statusCode)) {
    const get = await requestUrl(url, "GET");
    return classifyProbe(get);
  }

  return classifyProbe(head);
}

async function requestUrl(url, method) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method,
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": userAgent,
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    return { kind: "response", statusCode: response.status };
  } catch (error) {
    return {
      kind: "error",
      code: error?.cause?.code || error?.code || error?.name || "ERROR",
      message: error?.cause?.message || error?.message || String(error),
    };
  } finally {
    clearTimeout(timeout);
  }
}

function classifyProbe(probe) {
  if (probe.kind === "response") {
    if (isHealthyStatus(probe.statusCode)) {
      return { status: "ok", reason: `HTTP ${probe.statusCode}` };
    }

    if ([401, 403, 418, 429, 999].includes(probe.statusCode)) {
      return { status: "blocked", reason: `HTTP ${probe.statusCode}` };
    }

    if ([404, 410].includes(probe.statusCode)) {
      return { status: "dead", reason: `HTTP ${probe.statusCode}` };
    }

    if (probe.statusCode >= 500) {
      return { status: "transient", reason: `HTTP ${probe.statusCode}` };
    }

    return { status: "blocked", reason: `HTTP ${probe.statusCode}` };
  }

  if (["ENOTFOUND", "ENODATA", "ECONNREFUSED"].includes(probe.code)) {
    return { status: "dead", reason: probe.code };
  }

  if (["AbortError", "ETIMEDOUT", "ECONNRESET", "EAI_AGAIN", "UND_ERR_CONNECT_TIMEOUT"].includes(probe.code)) {
    return { status: "transient", reason: probe.code };
  }

  return { status: "blocked", reason: probe.code };
}

function isHealthyStatus(statusCode) {
  return statusCode >= 200 && statusCode < 400;
}

function shouldRetryWithGet(statusCode) {
  return [401, 403, 405, 418, 429, 999].includes(statusCode) || statusCode >= 500;
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) {
    return [];
  }

  const seen = new Set();
  const normalized = [];

  for (const tag of tags.map(clean).filter(Boolean)) {
    const key = tag.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      normalized.push(tag);
    }
  }

  return normalized.slice(0, 8);
}

function normalizeLinks(links) {
  if (!Array.isArray(links)) {
    return [];
  }

  return links.map((link) => ({
    label: clean(link?.label) || labelForLink(clean(link?.href)),
    href: clean(link?.href),
  }));
}

function labelForLink(href) {
  if (!href) {
    return "Link";
  }

  if (href.includes("github.com")) {
    return "Source";
  }

  if (href.includes("linkedin.com")) {
    return "Demo";
  }

  return "Live app";
}

function isSourceLink(link) {
  return link.label.toLowerCase() === "source" || link.href.includes("github.com");
}

function normalizeHref(href) {
  const cleaned = clean(href);
  if (!cleaned) {
    return "";
  }

  try {
    const url = new URL(cleaned);
    url.hash = "";
    url.searchParams.sort();
    return url.toString().replace(/\/$/, "").toLowerCase();
  } catch {
    return cleaned.replace(/\/$/, "").toLowerCase();
  }
}

function clean(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function writeSummary({ status }) {
  const lines = [
    "# Project Health and Clean up",
    "",
    `- Status: ${status}`,
    `- Projects checked: ${projects.length}`,
    `- Links checked: ${checkedLinks.length}`,
    `- Auto-fixes: ${fixes.length}`,
    `- Needs review: ${reviewNotes.length}`,
    `- Warnings: ${warnings.length}`,
    "",
  ];

  if (fixes.length) {
    lines.push("## Auto-fixes", "", ...fixes.map((fix) => `- ${fix}`), "");
  }

  if (reviewNotes.length) {
    lines.push("## Needs Review", "", ...reviewNotes.map((note) => `- ${note}`), "");
  }

  if (warnings.length) {
    lines.push("## Warnings", "", ...warnings.map((warning) => `- ${warning}`), "");
  }

  if (!fixes.length && !reviewNotes.length && !warnings.length) {
    lines.push("No project data, asset, or link health issues were found.", "");
  }

  writeFileSync(summaryPath, `${lines.join("\n")}\n`, "utf8");
}

function writeOutput(name, value) {
  if (!process.env.GITHUB_OUTPUT) {
    return;
  }

  writeFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`, { flag: "a" });
}
