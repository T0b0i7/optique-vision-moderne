const fs = require("fs");
const path = require("path");
const products = require("./products");
const kicker = p => (p.cat === "vue" ? "Monture " : "Solaire ") + p.gl.toLowerCase() + " · " + p.shape;
const card = p => `          <article class="product-card" data-product data-id="${p.id}" data-name="${p.name}" data-kicker="${kicker(p)}" data-cat="${p.cat}" data-gender="${p.gender}" data-gender-label="${p.gl}" data-shape="${p.shape}" data-material="${p.material}" data-desc="${p.desc}" data-reveal>
            <div class="product-media">
              <img src="assets/img/${p.id}.jpg" alt="${p.alt}" width="600" height="400" loading="lazy">
              <span class="product-tag${p.cat === "solaire" ? " product-tag--sun" : ""}">${p.cat === "vue" ? "Vue" : "Solaire"}</span>
              <button class="product-quick" type="button" data-modal>Aperçu</button>
            </div>
            <div class="product-body">
              <p class="product-kicker">${p.gl} · ${p.shape}</p>
              <h3>${p.name}</h3>
              <p class="product-material">${p.material}</p>
              <div class="product-actions">
                <a class="product-wa" data-wa="Bonjour Optique Vision Moderne, je suis intéressé(e) par le modèle ${p.name}. Pouvez-vous me confirmer le prix et la disponibilité ?" href="https://wa.me/22901000000">Demander le prix <svg aria-hidden="true"><use href="#i-arrow"/></svg></a>
                <button class="product-more" type="button" data-modal>Détails</button>
              </div>
            </div>
          </article>`;
fs.writeFileSync(path.join(__dirname, "pages", "cards.html"), products.map(card).join("\n") + "\n");
console.log("✓", products.length, "cartes");
