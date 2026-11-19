/* ==========================================================================
   Optique Vision Moderne — interactions du site
   Dépendances : aucune. JavaScript natif.
   ========================================================================== */

(function () {
  "use strict";

  /* ----------------------------------------------------------------------
     1. Coordonnées de la maison
     ----------------------------------------------------------------------
     ⚠️ À PERSONNALISER : remplacez uniquement les deux valeurs ci-dessous
     par le numéro WhatsApp / téléphone réel de l'opticien.
     Format international, sans espaces ni "+" pour WhatsApp.
     -------------------------------------------------------------------- */
  const CONFIG = {
    whatsapp: "22901000000",
    phone: "+22901000000",
    phoneDisplay: "+229 01 00 00 00 00"
  };

  const waBase = "https://wa.me/" + CONFIG.whatsapp;
  const defaultMessage =
    "Bonjour Optique Vision Moderne, je souhaite des informations sur vos montures et vos services.";

  const $ = (selector, scope) => (scope || document).querySelector(selector);
  const $$ = (selector, scope) =>
    Array.prototype.slice.call((scope || document).querySelectorAll(selector));

  /* ----------------------------------------------------------------------
     2. Liens de contact (téléphone + WhatsApp)
     -------------------------------------------------------------------- */
  function initContactLinks() {
    $$("[data-phone]").forEach(function (link) {
      link.setAttribute("href", "tel:" + CONFIG.phone);
    });

    $$("[data-phone-text]").forEach(function (el) {
      el.textContent = CONFIG.phoneDisplay;
    });

    $$("[data-wa]").forEach(function (link) {
      const message = link.getAttribute("data-wa") || defaultMessage;
      link.setAttribute("href", waBase + "?text=" + encodeURIComponent(message));
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener");
    });
  }

  /* ----------------------------------------------------------------------
     3. En-tête et menu mobile
     -------------------------------------------------------------------- */
  function initHeader() {
    const header = $(".site-header");
    if (!header) return;

    const onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const toggle = $(".nav-toggle");
    const menu = $("#mobileMenu");
    if (!toggle || !menu) return;

    const close = function () {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Ouvrir le menu");
      menu.classList.remove("is-open");
      menu.setAttribute("aria-hidden", "true");
      document.body.classList.remove("is-locked");
      header.classList.remove("is-menu-open");
    };

    const open = function () {
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Fermer le menu");
      menu.classList.add("is-open");
      menu.setAttribute("aria-hidden", "false");
      document.body.classList.add("is-locked");
      header.classList.add("is-menu-open");
    };

    toggle.addEventListener("click", function () {
      if (toggle.getAttribute("aria-expanded") === "true") {
        close();
      } else {
        open();
      }
    });

    $$("a", menu).forEach(function (link) {
      link.addEventListener("click", close);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menu.classList.contains("is-open")) {
        close();
        toggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 1024) close();
    });
  }

  /* ----------------------------------------------------------------------
     4. Apparitions au défilement
     -------------------------------------------------------------------- */
  function initReveals() {
    const items = $$("[data-reveal]");
    if (!items.length) return;

    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ----------------------------------------------------------------------
     5. Navigation active + année
     -------------------------------------------------------------------- */
  function initNavState() {
    const page = document.body.getAttribute("data-page");
    if (page) {
      $$("[data-nav]").forEach(function (link) {
        if (link.getAttribute("data-nav") === page) {
          link.setAttribute("aria-current", "page");
        }
      });
    }

    $$("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ----------------------------------------------------------------------
     6. Catalogue : filtres, recherche, compteur
     -------------------------------------------------------------------- */
  function initCatalogue() {
    const grid = $("#catalogueGrid");
    if (!grid) return;

    const cards = $$("[data-product]", grid);
    const chips = $$("[data-filter-cat]");
    const genderSelect = $("#genderFilter");
    const searchInput = $("#catalogueSearch");
    const count = $("#catalogueCount");
    const empty = $("#catalogueEmpty");
    const reset = $("#catalogueReset");

    const state = {
      cat: "all",
      gender: "all",
      query: ""
    };

    const params = new URLSearchParams(window.location.search);
    const initialCat = params.get("cat");
    if (initialCat === "vue" || initialCat === "solaire") {
      state.cat = initialCat;
      chips.forEach(function (chip) {
        chip.classList.toggle(
          "is-active",
          chip.getAttribute("data-filter-cat") === initialCat
        );
      });
    }

    function normalize(value) {
      return (value || "")
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
    }

    function apply() {
      let visible = 0;
      const query = normalize(state.query);

      cards.forEach(function (card) {
        const cat = card.getAttribute("data-cat");
        const gender = card.getAttribute("data-gender");
        const haystack = normalize(
          [
            card.getAttribute("data-name"),
            card.getAttribute("data-material"),
            card.getAttribute("data-shape"),
            card.getAttribute("data-kicker")
          ].join(" ")
        );

        const matchCat = state.cat === "all" || cat === state.cat;
        const matchGender =
          state.gender === "all" ||
          gender === state.gender ||
          gender === "mixte";
        const matchQuery = !query || haystack.indexOf(query) !== -1;

        const isVisible = matchCat && matchGender && matchQuery;
        card.hidden = !isVisible;
        if (isVisible) visible += 1;
      });

      if (count) {
        count.textContent =
          visible +
          (visible > 1 ? " modèles affichés" : " modèle affiché");
      }
      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        state.cat = chip.getAttribute("data-filter-cat");
        chips.forEach(function (other) {
          other.classList.toggle("is-active", other === chip);
        });
        apply();
      });
    });

    if (genderSelect) {
      genderSelect.addEventListener("change", function () {
        state.gender = genderSelect.value;
        apply();
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        state.query = searchInput.value.trim();
        apply();
      });
    }

    if (reset) {
      reset.addEventListener("click", function () {
        state.cat = "all";
        state.gender = "all";
        state.query = "";
        if (genderSelect) genderSelect.value = "all";
        if (searchInput) searchInput.value = "";
        chips.forEach(function (chip) {
          chip.classList.toggle(
            "is-active",
            chip.getAttribute("data-filter-cat") === "all"
          );
        });
        apply();
      });
    }

    apply();
  }

  /* ----------------------------------------------------------------------
     7. Modale produit
     -------------------------------------------------------------------- */
  function initProductModal() {
    const modal = $("#productModal");
    if (!modal) return;

    const dialog = $(".modal__dialog", modal);
    const media = $("#modalImage");
    const title = $("#modalTitle");
    const kicker = $("#modalKicker");
    const desc = $("#modalDesc");
    const shape = $("#modalShape");
    const material = $("#modalMaterial");
    const gender = $("#modalGender");
    const wa = $("#modalWa");
    let lastFocus = null;

    function fill(card) {
      const data = card.dataset;
      const img = $("img", card);

      if (img) {
        media.src = img.currentSrc || img.src;
        media.alt = img.alt;
      }
      title.textContent = data.name;
      kicker.textContent = data.kicker;
      desc.textContent = data.desc;
      shape.textContent = data.shape;
      material.textContent = data.material;
      gender.textContent = data.genderLabel || "Mixte";
      wa.href =
        waBase +
        "?text=" +
        encodeURIComponent(
          "Bonjour Optique Vision Moderne, je suis intéressé(e) par le modèle " +
            data.name +
            " (" +
            data.kicker.toLowerCase() +
            "). Pouvez-vous me confirmer le prix et la disponibilité en boutique ?"
        );
    }

    function open(card) {
      lastFocus = document.activeElement;
      fill(card);
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("is-locked");
      const closeBtn = $(".modal__close", modal);
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("is-locked");
      if (lastFocus) lastFocus.focus();
    }

    $$("[data-modal]").forEach(function (trigger) {
      trigger.addEventListener("click", function () {
        const card = trigger.closest("[data-product]");
        if (card) open(card);
      });
    });

    $$("[data-close]", modal).forEach(function (el) {
      el.addEventListener("click", close);
    });

    document.addEventListener("keydown", function (event) {
      if (!modal.classList.contains("is-open")) return;
      if (event.key === "Escape") close();
      if (event.key === "Tab" && dialog) {
        const focusable = $$(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
          dialog
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* ----------------------------------------------------------------------
     8. Formulaire de rendez-vous → WhatsApp
     -------------------------------------------------------------------- */
  function initBooking() {
    const form = $("#bookingForm");
    if (!form) return;

    const dateSelect = $("#slotDate");
    const timeSelect = $("#slotTime");
    const status = $("#formStatus");
    const success = $("#bookingSuccess");
    const formWrap = $("#bookingFormWrap");
    const successLink = $("#successWa");
    const again = $("#bookingAgain");
    const agencyRadios = $$('input[name="agency"]', form);

    const params = new URLSearchParams(window.location.search);
    const wantedAgency = params.get("agence");
    if (wantedAgency) {
      agencyRadios.forEach(function (radio) {
        if (radio.value === wantedAgency) radio.checked = true;
      });
    }

    function weekday(date) {
      return new Intl.DateTimeFormat("fr-FR", { weekday: "long" }).format(date);
    }

    function buildDateOptions() {
      if (!dateSelect) return;
      const today = new Date();
      let added = 0;
      let offset = 1;

      while (added < 18 && offset < 40) {
        const date = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + offset
        );
        offset += 1;
        if (date.getDay() === 0) continue; // dimanche fermé

        const value =
          date.getFullYear() +
          "-" +
          String(date.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(date.getDate()).padStart(2, "0");

        const label = new Intl.DateTimeFormat("fr-FR", {
          weekday: "short",
          day: "numeric",
          month: "short"
        }).format(date);

        const option = document.createElement("option");
        option.value = value;
        option.textContent = label.replace(".", "");
        dateSelect.appendChild(option);
        added += 1;
      }
    }

    function buildTimeOptions() {
      if (!timeSelect) return;
      const slots = [
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "12:00",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
        "16:30",
        "17:00",
        "17:30"
      ];
      slots.forEach(function (slot) {
        const option = document.createElement("option");
        option.value = slot;
        option.textContent = slot.replace(":", "h");
        timeSelect.appendChild(option);
      });
    }

    function showError(message) {
      if (!status) return;
      status.textContent = message;
      status.classList.add("is-visible");
    }

    function clearError() {
      if (!status) return;
      status.textContent = "";
      status.classList.remove("is-visible");
    }

    function prettyDate(value) {
      if (!value) return "";
      const parts = value.split("-");
      const date = new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
      );
      return new Intl.DateTimeFormat("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long"
      }).format(date);
    }

    buildDateOptions();
    buildTimeOptions();

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearError();

      if (!form.checkValidity()) {
        form.reportValidity();
        showError("Merci de compléter les champs obligatoires avant d'envoyer.");
        return;
      }

      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const agency =
        data.get("agency") === "steinmetz"
          ? "Steinmetz (face MTN)"
          : "Cadjèhoun (Vla's Plazza)";
      const reason = String(data.get("reason") || "");
      const date = String(data.get("date") || "");
      const time = String(data.get("time") || "");
      const note = String(data.get("message") || "").trim();

      if (date && time) {
        const chosen = new Date(date + "T12:00:00");
        if (chosen.getDay() === 0) {
          showError(
            "Nos agences sont fermées le dimanche. Merci de choisir un autre jour."
          );
          return;
        }
      }

      const lines = [
        "Bonjour Optique Vision Moderne,",
        "",
        "Je souhaite prendre rendez-vous en boutique.",
        "",
        "Nom : " + name,
        "Téléphone : " + phone,
        "Agence : " + agency,
        "Motif : " + reason,
        "Date souhaitée : " + prettyDate(date),
        "Créneau : " + time.replace(":", "h")
      ];

      if (note) {
        lines.push("", "Précision : " + note);
      }

      lines.push(
        "",
        "Merci de me confirmer ce créneau. À très bientôt."
      );

      const url = waBase + "?text=" + encodeURIComponent(lines.join("\n"));

      if (successLink) {
        successLink.href = url;
        successLink.setAttribute("target", "_blank");
        successLink.setAttribute("rel", "noopener");
      }

      const popup = window.open(url, "_blank", "noopener");
      if (!popup) {
        // Le navigateur a bloqué l'ouverture : le bouton de secours reste actif.
      }

      if (formWrap) formWrap.hidden = true;
      if (success) {
        success.classList.add("is-visible");
        const heading = $("h3", success);
        if (heading) {
          heading.setAttribute("tabindex", "-1");
          heading.focus();
        }
      }
      form.reset();
    });

    if (again) {
      again.addEventListener("click", function () {
        if (success) success.classList.remove("is-visible");
        if (formWrap) formWrap.hidden = false;
        clearError();
        const firstField = $("#bookName");
        if (firstField) firstField.focus();
      });
    }
  }

  /* ----------------------------------------------------------------------
     9. Initialisation
     -------------------------------------------------------------------- */
  function init() {
    initContactLinks();
    initHeader();
    initReveals();
    initNavState();
    initCatalogue();
    initProductModal();
    initBooking();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
