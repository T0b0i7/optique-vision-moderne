// Usage : node _tools/set-phone.js 22997000000 "+229 97 00 00 00"
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const digits = (process.argv[2] || "").replace(/\D/g, "");
const display = process.argv[3] || "";
if (digits.length < 8 || !display) {
  console.error('Exemple : node _tools/set-phone.js 22997000000 "+229 97 00 00 00"');
  process.exit(1);
}
const files = fs.readdirSync(root).filter((f) => f.endsWith(".html"));
files.push("assets/js/main.js");
let count = 0;
for (const f of files) {
  const p = path.join(root, f);
  const before = fs.readFileSync(p, "utf8");
  const after = before
    .replace(/22901000000/g, digits)
    .replace(/\+229 01 00 00 00 00/g, display)
    .replace(/\+22901000000/g, "+" + digits);
  if (after !== before) {
    fs.writeFileSync(p, after, "utf8");
    count++;
    console.log("✓", f);
  }
}
console.log(count + " fichier(s) mis à jour. Pensez à vérifier les horaires et les liens Maps.");
