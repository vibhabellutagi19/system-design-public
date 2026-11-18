// Usage: npm run week -- w01
// Copies templates/week into weeks/<folder> for that week and fills in its plan.
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const id = (process.argv[2] || "").toLowerCase().replace(/^w(\d)$/, "w0$1");
const plan = JSON.parse(fs.readFileSync(path.join(root, "plan.json"), "utf8"));
const w = plan.find((x) => x.id === id);
if (!w) {
  console.error(`Unknown week "${process.argv[2] || ""}". Use one of: ${plan.filter((x) => !x.rest).map((x) => x.id).join(", ")}`);
  process.exit(1);
}
const dest = path.join(root, "weeks", w.folder);
if (fs.existsSync(dest)) { console.error(`${path.relative(root, dest)} already exists. Nothing changed.`); process.exit(1); }

const slug = w.folder.replace(/^w\d+-/, "");
const fill = (s) => s
  .replaceAll("{{id}}", w.id).replaceAll("{{name}}", w.name).replaceAll("{{tag}}", w.tag)
  .replaceAll("{{scenario}}", w.scenario).replaceAll("{{core}}", w.core).replaceAll("{{breakIt}}", w.breakIt)
  .replaceAll("{{post}}", w.post).replaceAll("{{read}}", w.read).replaceAll("{{slug}}", "sdip-" + slug)
  .replaceAll("{{concepts}}", w.concepts.join(", "))
  .replaceAll("{{date}}", new Date(w.end + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }));

function copy(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copy(s, d); else fs.writeFileSync(d, fill(fs.readFileSync(s, "utf8")));
  }
}
copy(path.join(root, "templates", "week"), dest);
console.log(`Created ${path.relative(root, dest)}. Start with design.md.`);
