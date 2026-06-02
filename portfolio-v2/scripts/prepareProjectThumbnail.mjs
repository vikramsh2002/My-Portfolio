import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, "../public");
const projectImagesDir = resolve(publicDir, "images/Projects");
const responsePath = process.argv[2];
const cardImageUrl = process.env.CARD_IMAGE_URL || "";
const defaultTimeoutMs = Number(process.env.THUMBNAIL_TIMEOUT_MS || 120000);

if (!responsePath) {
  throw new Error("Usage: node prepareProjectThumbnail.mjs <model-response-file>");
}

const responseText = readFileSync(responsePath, "utf8");
const change = parseJsonResponse(responseText);
const project = change.project || {};
const intent = clean(change.intent);
const projectTitle = clean(project.title);
const existingImage = clean(project.image);
const liveUrl = findPreviewUrl(project.links);
let imageStatus = "not_needed";
let imagePath = existingImage;
let imageSource = "";

mkdirSync(projectImagesDir, { recursive: true });

if (!projectTitle) {
  imageStatus = "missing";
} else if (cardImageUrl) {
  const downloaded = await downloadCardImage(cardImageUrl, projectTitle);
  if (downloaded) {
    imageStatus = "downloaded";
    imagePath = downloaded;
    imageSource = cardImageUrl;
  } else {
    imageStatus = "failed";
    imageSource = cardImageUrl;
  }
} else if (intent === "add_project" && liveUrl) {
  const captured = captureLiveScreenshot(liveUrl, projectTitle);
  if (captured) {
    imageStatus = "captured";
    imagePath = captured;
    imageSource = liveUrl;
  } else {
    imageStatus = "failed";
    imageSource = liveUrl;
  }
} else if (hasUsableLocalImage(existingImage)) {
  imageStatus = "existing";
  imageSource = existingImage;
} else {
  if (liveUrl) {
    const captured = captureLiveScreenshot(liveUrl, projectTitle);
    if (captured) {
      imageStatus = "captured";
      imagePath = captured;
      imageSource = liveUrl;
    } else {
      imageStatus = "failed";
      imageSource = liveUrl;
    }
  } else {
    imageStatus = "missing";
  }
}

if (imageStatus === "captured" || imageStatus === "downloaded" || imageStatus === "existing") {
  change.project = {
    ...project,
    image: imagePath,
  };
  writeFileSync(responsePath, `${JSON.stringify(change, null, 2)}\n`, "utf8");
}

writeOutput("image_status", imageStatus);
writeOutput("image_path", imagePath);
writeOutput("image_source", imageSource);

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

function hasUsableLocalImage(image) {
  if (!image || /^https?:\/\//i.test(image)) {
    return false;
  }

  return existsSync(resolve(publicDir, image));
}

async function downloadCardImage(url, title) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return "";
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.startsWith("image/")) {
      return "";
    }

    const extension = extensionFromContentType(contentType) || extensionFromUrl(url) || ".png";
    const imagePath = `images/Projects/${slug(title)}${extension}`;
    const outputPath = resolve(publicDir, imagePath);
    const buffer = Buffer.from(await response.arrayBuffer());
    writeFileSync(outputPath, buffer);
    return imagePath;
  } catch {
    return "";
  }
}

function captureLiveScreenshot(url, title) {
  const chromePath = findChromePath();
  if (!chromePath) {
    return "";
  }

  const imagePath = `images/Projects/${slug(title)}.png`;
  const outputPath = resolve(publicDir, imagePath);
  const args = [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--hide-scrollbars",
    "--window-size=1280,900",
    "--virtual-time-budget=20000",
    `--screenshot=${outputPath}`,
    url,
  ];

  try {
    execFileSync(chromePath, args, {
      stdio: "ignore",
      timeout: defaultTimeoutMs,
    });
    return existsSync(outputPath) ? imagePath : "";
  } catch {
    return "";
  }
}

function findChromePath() {
  const candidates =
    process.platform === "win32"
      ? [
          "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
          "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
          "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
          "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
        ]
      : ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "microsoft-edge"];

  for (const candidate of candidates) {
    if (process.platform === "win32" && existsSync(candidate)) {
      return candidate;
    }

    if (process.platform !== "win32") {
      try {
        execFileSync("which", [candidate], { stdio: "ignore" });
        return candidate;
      } catch {
        // Keep looking.
      }
    }
  }

  return "";
}

function findPreviewUrl(links = []) {
  if (!Array.isArray(links)) {
    return "";
  }

  const usableLinks = links
    .map((link) => ({
      label: clean(link?.label).toLowerCase(),
      href: clean(link?.href),
    }))
    .filter((link) => /^https?:\/\//i.test(link.href) && !link.href.includes("github.com"));

  return (
    usableLinks.find((link) => /live|app|site|demo/.test(link.label))?.href ||
    usableLinks.find((link) => !link.href.includes("linkedin.com"))?.href ||
    usableLinks[0]?.href ||
    ""
  );
}

function extensionFromContentType(contentType) {
  if (contentType.includes("jpeg") || contentType.includes("jpg")) {
    return ".jpg";
  }

  if (contentType.includes("png")) {
    return ".png";
  }

  if (contentType.includes("webp")) {
    return ".webp";
  }

  return "";
}

function extensionFromUrl(url) {
  const extension = extname(new URL(url).pathname).toLowerCase();
  return [".jpg", ".jpeg", ".png", ".webp"].includes(extension) ? extension : "";
}

function clean(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function slug(value) {
  return String(value || "project")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function writeOutput(name, value) {
  if (!process.env.GITHUB_OUTPUT) {
    return;
  }

  writeFileSync(process.env.GITHUB_OUTPUT, `${name}=${value}\n`, { flag: "a" });
}
