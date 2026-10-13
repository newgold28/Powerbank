import { execSync } from "node:child_process";
import { readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SRC = "/Users/paschal/Downloads/abi";
const OUT_DIR = join(process.cwd(), "public/images/portfolio");

const isImage = (f) => /\.(jpe?g|png|webp)$/i.test(f);
const srcFiles = readdirSync(SRC).filter(isImage).sort();

const manifest = {};

let i = 0;
for (const file of srcFiles) {
  i += 1;
  const src = join(SRC, file);
  const name = `portfolio-${String(i).padStart(2, "0")}.jpg`;
  const out = join(OUT_DIR, name);
  execSync(
    `sips -Z 1600 -s format jpeg -s formatOptions 78 "${src}" --out "${out}"`,
    { stdio: "ignore" }
  );
  manifest[name] = file;
  console.log(name, "<-", file);
}

writeFileSync(join(OUT_DIR, "_manifest.json"), JSON.stringify(manifest, null, 2));
console.log(`\nProcessed ${i} images. Manifest written.`);