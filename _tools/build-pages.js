const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const shell = fs.readFileSync(path.join(root, "index.html"), "utf8");
const open = '<main id="main">', close = "</main>";
const prefix = shell.slice(0, shell.indexOf(open));
const suffix = shell.slice(shell.indexOf(close) + close.length);
const pages = [
  ["catalogue.html", "catalogue", "Catalogue — Optique Vision Moderne | Cotonou", "Montures de vue et solaires à Cotonou : femme, homme, mixte. Demandez le prix sur WhatsApp et réservez votre essayage."],
  ["services.html", "services", "Nos services — Optique Vision Moderne | Cotonou", "Verres sur ordonnance, ajustage offert, nettoyage aux ultrasons et service après-vente dans nos deux agences à Cotonou."],
  ["agences.html", "agences", "Nos agences à Cotonou — Optique Vision Moderne", "Cadjèhoun (Vla's Plazza) et Steinmetz (face MTN) : horaires, itinéraires Google Maps et contacts directs."],
  ["rendez-vous.html", "rendez-vous", "Prendre rendez-vous — Optique Vision Moderne", "Réservez un créneau d'essayage ou de conseil dans l'une de nos deux agences à Cotonou. Confirmation par WhatsApp."]
];
pages.forEach(([file, page, title, desc]) => {
  const main = fs.readFileSync(path.join(__dirname, "pages", file), "utf8");
  let p = prefix
    .replace(/<title>[\s\S]*?<\/title>/, "<title>" + title + "</title>")
    .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="' + desc + '">')
    .replace(/<meta property="og:title" content="[^"]*">/, '<meta property="og:title" content="' + title + '">')
    .replace(/<meta property="og:description" content="[^"]*">/, '<meta property="og:description" content="' + desc + '">')
    .replace(/<body data-page="home">/, '<body data-page="' + page + '">')
    .replace('<header class="site-header">', '<header class="site-header is-solid">');
  fs.writeFileSync(path.join(root, file), p + "\n" + main + suffix);
  console.log("✓", file);
});
