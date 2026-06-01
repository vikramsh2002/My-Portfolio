import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectsDataPath = resolve(__dirname, "../src/projects.json");
const summaryPath = resolve(__dirname, "../portfolio-sync-summary.md");
const defaultProjectImage = "images/Projects/headlines.png";

const responsePath = process.argv[2];

if (!responsePath) {
  throw new Error("Usage: node applyPortfolioProjectUpdate.mjs <model-response-file>");
}

const responseText = readFileSync(responsePath, "utf8");
const change = parseJsonResponse(responseText);
const currentProjects = JSON.parse(readFileSync(projectsDataPath, "utf8"));

if (!Array.isArray(currentProjects)) {
  throw new Error("projects.json must contain a project array.");
}

const normalizedIntent = normalizeIntent(change.intent);
const risk = normalizeRisk(change.risk);
const project = normalizeProject(change.project);
const featurePolicy = normalizeFeaturePolicy(change.featurePolicy);
const reviewNotes = Array.isArray(change.reviewNotes) ? change.reviewNotes.filter(Boolean) : [];
let action = "none";
let changed = false;
let matchedProjectTitle = "";
let updatedProjects = currentProjects;

if (normalizedIntent === "add_project" || normalizedIntent === "update_project") {
  const existingMatch = findExistingProject(currentProjects, change.matchTitle, project);
  const existingIndex = existingMatch.index;

  if (existingIndex >= 0) {
    const existingProject = currentProjects[existingIndex];
    const projectPatch = compactProjectPatch(project);
    matchedProjectTitle = existingProject.title;
    updatedProjects = [...currentProjects];
    updatedProjects[existingIndex] = {
      ...existingProject,
      ...projectPatch,
      image: project.image || existingProject.image || defaultProjectImage,
      featured: Boolean(project.featured || existingProject.featured),
      links: project.links.length ? project.links : existingProject.links,
      tags: project.tags.length ? project.tags : existingProject.tags,
    };
    action = "updated";
    changed = true;
    if (normalizedIntent === "add_project") {
      reviewNotes.unshift(
        `The update looked like a new project, but matched existing project "${existingProject.title}" by ${existingMatch.reason}. Updated the existing card instead.`
      );
    }
  } else if (normalizedIntent === "update_project") {
    action = "needs_review";
    reviewNotes.unshift("The update asked to modify an existing project, but no matching portfolio project was found.");
  } else if (!project.title || !project.description) {
    action = "needs_review";
    reviewNotes.unshift("The model did not provide enough detail to create a new portfolio project safely.");
  } else {
    updatedProjects = [
      {
        ...project,
        image: project.image || defaultProjectImage,
        featured: featurePolicy !== "explicit_unfeatured",
      },
      ...currentProjects,
    ];
    action = "added";
    changed = true;
  }

  if (changed) {
    writeFileSync(projectsDataPath, `${JSON.stringify(updatedProjects, null, 2)}\n`, "utf8");
  }
}

writeSummary({
  action,
  intent: normalizedIntent,
  risk,
  reason: String(change.reason || "").trim(),
  projectTitle: project.title,
  matchedProjectTitle,
  reviewNotes,
  changed,
});

writeOutput("action", action);
writeOutput("intent", normalizedIntent);
writeOutput("risk", risk);
writeOutput("changed", String(changed));
writeOutput("project_title", project.title);
writeOutput("matched_project_title", matchedProjectTitle);
writeOutput("summary_path", summaryPath);

function parseJsonResponse(text) {
  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced) {
      return JSON.parse(fenced[1]);
    }

    const firstBrace = trimmed.indexOf("{");
    const lastBrace = trimmed.lastIndexOf("}");
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
    }
  }

  throw new Error("The model response did not contain valid JSON.");
}

function normalizeIntent(intent) {
  const allowed = new Set(["add_project", "update_project", "ignore", "needs_review"]);
  return allowed.has(intent) ? intent : "needs_review";
}

function normalizeRisk(risk) {
  const allowed = new Set(["low", "medium", "high"]);
  return allowed.has(risk) ? risk : "high";
}

function normalizeFeaturePolicy(featurePolicy) {
  const allowed = new Set(["default_featured", "explicit_featured", "explicit_unfeatured"]);
  return allowed.has(featurePolicy) ? featurePolicy : "default_featured";
}

function normalizeProject(project = {}) {
  const title = clean(project.title);

  return {
    title,
    subtitle: clean(project.subtitle) || "Project update",
    image: clean(project.image),
    description: clean(project.description),
    impact: clean(project.impact),
    tags: normalizeStringArray(project.tags),
    featured: Boolean(project.featured),
    links: normalizeLinks(project.links),
  };
}

function compactProjectPatch(project) {
  return Object.fromEntries(
    Object.entries({
      title: project.title,
      subtitle: project.subtitle,
      image: project.image,
      description: project.description,
      impact: project.impact,
    }).filter(([, value]) => Boolean(value))
  );
}

function normalizeStringArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(clean).filter(Boolean).slice(0, 8);
}

function normalizeLinks(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((link) => ({
      label: clean(link?.label) || labelForLink(clean(link?.href)),
      href: clean(link?.href),
    }))
    .filter((link) => link.href)
    .slice(0, 5);
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

function clean(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function findExistingProject(projects, matchTitle, project) {
  const titleCandidates = [matchTitle, project.title].map(clean).filter(Boolean);

  for (const title of titleCandidates) {
    const target = slug(title);
    if (!target) {
      continue;
    }

    const index = projects.findIndex((existingProject) => slug(existingProject.title) === target);
    if (index >= 0) {
      return { index, reason: "exact title" };
    }
  }

  const projectLinks = new Set(project.links.map((link) => normalizeHref(link.href)).filter(Boolean));
  if (projectLinks.size) {
    const index = projects.findIndex((existingProject) =>
      normalizeLinks(existingProject.links).some((link) => projectLinks.has(normalizeHref(link.href)))
    );
    if (index >= 0) {
      return { index, reason: "matching URL" };
    }
  }

  if (project.title) {
    const index = projects.findIndex((existingProject) => areSimilarTitles(project.title, existingProject.title));
    if (index >= 0) {
      return { index, reason: "similar title" };
    }
  }

  return { index: -1, reason: "" };
}

function slug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

function areSimilarTitles(left, right) {
  const leftSlug = slug(left);
  const rightSlug = slug(right);

  if (!leftSlug || !rightSlug) {
    return false;
  }

  const shorter = leftSlug.length <= rightSlug.length ? leftSlug : rightSlug;
  const longer = leftSlug.length > rightSlug.length ? leftSlug : rightSlug;
  if (shorter.length >= 12 && longer.includes(shorter)) {
    return true;
  }

  const leftTokens = titleTokens(left);
  const rightTokens = titleTokens(right);
  if (!leftTokens.length || !rightTokens.length) {
    return false;
  }

  const intersectionCount = leftTokens.filter((token) => rightTokens.includes(token)).length;
  const unionCount = new Set([...leftTokens, ...rightTokens]).size;
  const containment = intersectionCount / Math.min(leftTokens.length, rightTokens.length);
  const jaccard = intersectionCount / unionCount;

  return containment >= 0.8 || jaccard >= 0.75;
}

function titleTokens(value) {
  const genericTokens = new Set([
    "vrl",
    "app",
    "application",
    "project",
    "system",
    "web",
    "website",
    "engine",
    "tool",
    "platform",
  ]);

  return slug(value)
    .split("-")
    .filter((token) => token.length > 1 && !genericTokens.has(token));
}

function writeSummary({ action, intent, risk, reason, projectTitle, matchedProjectTitle, reviewNotes, changed }) {
  const lines = [
    "# Portfolio Project Sync",
    "",
    `- Action: ${action}`,
    `- Intent: ${intent}`,
    `- Risk: ${risk}`,
    `- Changed portfolio data: ${changed ? "yes" : "no"}`,
    projectTitle ? `- Project: ${projectTitle}` : "",
    matchedProjectTitle ? `- Matched existing project: ${matchedProjectTitle}` : "",
    reason ? `- Reason: ${reason}` : "",
    "",
  ].filter(Boolean);

  if (reviewNotes.length) {
    lines.push("## Review Notes", "", ...reviewNotes.map((note) => `- ${note}`), "");
  }

  lines.push(
    "This PR was generated by the GitHub Models portfolio sync workflow. Please review the content before merging."
  );

  writeFileSync(summaryPath, `${lines.join("\n")}\n`, "utf8");
}

function writeOutput(name, value) {
  if (!process.env.GITHUB_OUTPUT) {
    return;
  }

  writeFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`, { flag: "a" });
}
