// Reads the repo and works out progress from what exists. No checkboxes to tick:
// the work IS the update. Writes tracker/data.js (works when index.html is opened
// straight from disk) and tracker/progress.json (for the Saturday check-in).
//
// A step counts as done when:
//   design   weeks/<folder>/design.md exists and no longer contains "<!-- todo"
//   build    weeks/<folder>/src/ has at least one real file
//   break    weeks/<folder>/break-it.md exists and no longer contains "<!-- todo"
//   post     weeks/<folder>/post/index.md has `published: true` in its front matter
//   minimum  weeks/<folder>/README.md has `minimum: true` in its front matter
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const plan = JSON.parse(fs.readFileSync(path.join(root, "plan.json"), "utf8"));
const SITE = "https://buildwithvibs.in/blog/";

const read = (p) => { try { return fs.readFileSync(p, "utf8"); } catch { return null; } };
const filled = (p) => { const s = read(p); return s !== null && !/<!--\s*todo/i.test(s); };
function frontMatter(text) {
  const m = text && text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const out = {};
  if (!m) return out;
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([\w-]+):\s*(.*)$/);
    if (kv) out[kv[1]] = kv[2].replace(/^["']|["']$/g, "").trim();
  }
  return out;
}
function hasFiles(dir) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return false; }
  return entries.some((e) => e.name !== ".gitkeep" && !e.name.startsWith(".") &&
    (e.isFile() || (e.isDirectory() && e.name !== "node_modules" && hasFiles(path.join(dir, e.name)))));
}
function whatBroke(text) {
  if (!text) return "";
  const m = text.match(/##\s*What broke\s*\r?\n+([^\n#][^\n]*)/i);
  return m ? m[1].replace(/<!--.*?-->/g, "").trim() : "";
}

const weeks = {};
for (const w of plan) {
  if (w.rest) continue;
  const dir = path.join(root, "weeks", w.folder);
  const exists = fs.existsSync(dir);
  const post = frontMatter(read(path.join(dir, "post", "index.md")));
  const readme = frontMatter(read(path.join(dir, "README.md")));
  const published = /^true$/i.test(post.published || "");
  weeks[w.id] = {
    started: exists,
    design: exists && filled(path.join(dir, "design.md")),
    build: exists && hasFiles(path.join(dir, "src")),
    break: exists && filled(path.join(dir, "break-it.md")),
    post: published,
    minimum: /^true$/i.test(readme.minimum || ""),
    postUrl: published && post.slug ? SITE + post.slug : "",
    note: whatBroke(read(path.join(dir, "break-it.md"))),
  };
}

const ideas = [];
const ideasText = read(path.join(root, "ideas.md")) || "";
for (const line of ideasText.split(/\r?\n/)) {
  const m = line.match(/^\s*[-*]\s+\*\*(.+?)\*\*\s*(?:[—–:-]\s*(.*))?$/);
  if (m) ideas.push({ title: m[1].trim(), scenario: (m[2] || "").trim() });
}

const data = { generatedAt: new Date().toISOString(), plan, weeks, ideas };
const outDir = path.join(root, "tracker");
fs.writeFileSync(path.join(outDir, "progress.json"), JSON.stringify(data, null, 2));
fs.writeFileSync(path.join(outDir, "data.js"), "window.TRACKER = " + JSON.stringify(data) + ";\n");

const done = Object.values(weeks).filter((x) => x.post || x.minimum).length;
console.log(`Tracker updated: ${done} week(s) shipped, ${ideas.length} idea(s). Open tracker/index.html`);
