document.addEventListener("DOMContentLoaded", () => {
  WWUI.initBase();

  const session = WWUI.guardSession(["admin"]);
  if (!session) {
    return;
  }

  const adminName = WWUI.qs("#adminName");
  if (adminName) adminName.textContent = session.name;

  const state = {
    products: WWData.getProducts(),
    hero: WWData.getHero(),
    landing: WWData.getLanding(),
    editingId: null
  };

  const els = {
    metricProducts: WWUI.qs("#metricProducts"),
    metricAvg: WWUI.qs("#metricAvg"),
    metricOrders: WWUI.qs("#metricOrders"),
    metricRevenue: WWUI.qs("#metricRevenue"),
    salesChart: WWUI.qs("#salesChart"),
    productRows: WWUI.qs("#productRows"),
    addProductBtn: WWUI.qs("#addProductBtn"),
    productModal: WWUI.qs("#productModal"),
    closeProductModal: WWUI.qs("#closeProductModal"),
    productForm: WWUI.qs("#productForm"),
    productModalTitle: WWUI.qs("#productModalTitle"),
    productId: WWUI.qs("#productId"),
    pName: WWUI.qs("#pName"),
    pCat: WWUI.qs("#pCat"),
    pPrice: WWUI.qs("#pPrice"),
    pBadge: WWUI.qs("#pBadge"),
    pEmoji: WWUI.qs("#pEmoji"),
    pColor: WWUI.qs("#pColor"),
    pStock: WWUI.qs("#pStock"),
    pRating: WWUI.qs("#pRating"),
    pReviews: WWUI.qs("#pReviews"),
    pImage: WWUI.qs("#pImage"),
    pImagePicker: WWUI.qs("#pImagePicker"),
    pDesc: WWUI.qs("#pDesc"),
    heroForm: WWUI.qs("#heroForm"),
    hBadge: WWUI.qs("#hBadge"),
    hLine1: WWUI.qs("#hLine1"),
    hLine2: WWUI.qs("#hLine2"),
    hSub: WWUI.qs("#hSub"),
    hCta: WWUI.qs("#hCta"),
    hCta2: WWUI.qs("#hCta2"),
    latestOrders: WWUI.qs("#latestOrders"),
    featTitle: WWUI.qs("#featTitle"),
    featSub: WWUI.qs("#featSub"),
    featureEditors: WWUI.qs("#featureEditors"),
    saveFeatures: WWUI.qs("#saveFeatures"),
    statsEditors: WWUI.qs("#statsEditors"),
    saveStats: WWUI.qs("#saveStats"),
    tickerEditors: WWUI.qs("#tickerEditors"),
    addTicker: WWUI.qs("#addTicker"),
    saveTicker: WWUI.qs("#saveTicker"),
    testimonialsTitle: WWUI.qs("#testimonialsTitle"),
    testimonialEditors: WWUI.qs("#testimonialEditors"),
    addTestimonial: WWUI.qs("#addTestimonial"),
    saveTestimonials: WWUI.qs("#saveTestimonials"),
    footerForm: WWUI.qs("#footerForm"),
    ctaTitle: WWUI.qs("#ctaTitle"),
    ctaSub: WWUI.qs("#ctaSub"),
    footerText: WWUI.qs("#footerText"),
    heroImagePicker: WWUI.qs("#heroImagePicker"),
    saveHeroImage: WWUI.qs("#saveHeroImage"),
    orbitEditors: WWUI.qs("#orbitEditors"),
    addOrbitChip: WWUI.qs("#addOrbitChip"),
    saveOrbitChips: WWUI.qs("#saveOrbitChips"),
    fnLabel: WWUI.qs("#fnLabel"),
    fnValue: WWUI.qs("#fnValue"),
    fnDesc: WWUI.qs("#fnDesc"),
    saveFloatingNote: WWUI.qs("#saveFloatingNote"),
    lkTitle: WWUI.qs("#lkTitle"),
    lkSub: WWUI.qs("#lkSub"),
    lookbookEditors: WWUI.qs("#lookbookEditors"),
    addLookbook: WWUI.qs("#addLookbook"),
    saveLookbook: WWUI.qs("#saveLookbook"),
    storeHeroImagePicker: WWUI.qs("#storeHeroImagePicker"),
    storeHeroCopy: WWUI.qs("#storeHeroCopy"),
    saveStoreHero: WWUI.qs("#saveStoreHero"),
    floatProductEditors: WWUI.qs("#floatProductEditors"),
    addFloatProduct: WWUI.qs("#addFloatProduct"),
    saveFloatProducts: WWUI.qs("#saveFloatProducts"),
    dropRailEditors: WWUI.qs("#dropRailEditors"),
    drTitle: WWUI.qs("#drTitle"),
    drSub: WWUI.qs("#drSub"),
    addDropCard: WWUI.qs("#addDropCard"),
    saveDropRail: WWUI.qs("#saveDropRail")
  };

  function ordersSummary() {
    const orders = WWData.getOrders();
    const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    return {
      count: orders.length,
      revenue,
      latest: orders.slice(0, 6)
    };
  }

  function renderStats() {
    const products = state.products;
    const avg = products.length
      ? products.reduce((sum, p) => sum + Number(p.price || 0), 0) / products.length
      : 0;

    const summary = ordersSummary();

    if (els.metricProducts) els.metricProducts.textContent = String(products.length);
    if (els.metricAvg) els.metricAvg.textContent = WWUI.currency(avg);
    if (els.metricOrders) els.metricOrders.textContent = String(summary.count);
    if (els.metricRevenue) els.metricRevenue.textContent = WWUI.currency(summary.revenue);
  }

  function renderChart() {
    if (!els.salesChart) return;

    const categories = [...new Set(state.products.map((p) => p.cat))].slice(0, 6);
    const values = categories.map((cat) => {
      return state.products
        .filter((p) => p.cat === cat)
        .reduce((sum, p) => sum + Number(p.price || 0), 0);
    });
    const max = Math.max(1, ...values);

    els.salesChart.innerHTML = "";
    categories.forEach((cat, i) => {
      const bar = document.createElement("div");
      bar.className = "chart-bar";
      bar.dataset.label = cat.split(" ")[0];
      bar.style.height = `${Math.max(18, (values[i] / max) * 120)}px`;
      els.salesChart.appendChild(bar);
    });
  }

  function renderProducts() {
    if (!els.productRows) return;

    els.productRows.innerHTML = "";

    if (!state.products.length) {
      const row = document.createElement("tr");
      row.innerHTML = "<td colspan='6'>No products yet.</td>";
      els.productRows.appendChild(row);
      return;
    }

    state.products.forEach((p) => {
      const row = document.createElement("tr");
      const imgThumb = p.image ? '<img src="' + p.image + '" alt="" style="width:36px;height:36px;border-radius:8px;object-fit:cover;vertical-align:middle;margin-right:8px;">' : '';
      row.innerHTML = `
        <td>${imgThumb}<strong>${p.name}</strong><div class="mini">${p.desc || ""}</div></td>
        <td>${p.cat}</td>
        <td>${WWUI.currency(p.price)}</td>
        <td>${p.stock ?? "-"}</td>
        <td>${p.badge || "-"}</td>
        <td>
          <div class="row-actions">
            <button class="icon-btn" type="button" data-edit="${p.id}" title="Edit">E</button>
            <button class="icon-btn" type="button" data-delete="${p.id}" title="Delete">X</button>
          </div>
        </td>
      `;
      els.productRows.appendChild(row);
    });

    WWUI.qsa("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.edit);
        const product = state.products.find((p) => p.id === id);
        if (!product) return;
        openProductModal(product);
      });
    });

    WWUI.qsa("[data-delete]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.delete);
        const product = state.products.find((p) => p.id === id);
        if (!product) return;

        if (!window.confirm(`Delete ${product.name}?`)) {
          return;
        }

        state.products = state.products.filter((item) => item.id !== id);
        WWData.saveProducts(state.products);
        renderAll();
        WWUI.showToast("Product removed.");
      });
    });
  }

  function renderOrders() {
    if (!els.latestOrders) return;

    const summary = ordersSummary();
    els.latestOrders.innerHTML = "";

    if (!summary.latest.length) {
      els.latestOrders.innerHTML = "<p class='mini'>No orders yet.</p>";
      return;
    }

    summary.latest.forEach((order) => {
      const row = document.createElement("div");
      row.className = "kpi";
      row.innerHTML = `
        <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;">
          <strong>${order.id}</strong>
          <span class="mini">${WWUI.formatDate(order.createdAt)}</span>
        </div>
        <div class="mini" style="margin-top:8px;">${order.customerName || "Guest"}  -  ${order.qty || 0} items</div>
        <div style="margin-top:6px;font-weight:800;color:#203a6f;">${WWUI.currency(order.total || 0)}</div>
      `;
      els.latestOrders.appendChild(row);
    });
  }

  function syncHeroForm() {
    if (!els.heroForm) return;
    els.hBadge.value = state.hero.badge || "";
    els.hLine1.value = state.hero.line1 || "";
    els.hLine2.value = state.hero.line2 || "";
    els.hSub.value = state.hero.sub || "";
    els.hCta.value = state.hero.cta || "";
    els.hCta2.value = state.hero.cta2 || "";
  }

  /* ---- Landing page editors ---- */

  function renderFeatureEditors() {
    if (!els.featureEditors) return;
    els.featTitle.value = state.landing.featuresTitle || "";
    els.featSub.value = state.landing.featuresSub || "";
    els.featureEditors.innerHTML = "";
    (state.landing.features || []).forEach((f, i) => {
      const card = document.createElement("div");
      card.className = "kpi";
      card.style.padding = "14px";
      card.innerHTML = `
        <strong style="margin-bottom:8px;display:block;">Card ${i + 1}</strong>
        <div class="checkout-grid">
          <div class="field"><label>Icon text</label><input class="input feat-icon" value="${f.icon || ""}" maxlength="4"></div>
          <div class="field"><label>Title</label><input class="input feat-title" value="${f.title || ""}"></div>
        </div>
        <div class="field" style="margin-top:6px;"><label>Description</label><textarea class="textarea feat-desc">${f.desc || ""}</textarea></div>
      `;
      els.featureEditors.appendChild(card);
    });
  }

  function readFeatures() {
    const cards = WWUI.qsa(".kpi", els.featureEditors);
    return cards.map((card) => ({
      icon: card.querySelector(".feat-icon")?.value.trim() || "W",
      title: card.querySelector(".feat-title")?.value.trim() || "",
      desc: card.querySelector(".feat-desc")?.value.trim() || ""
    }));
  }

  function renderStatsEditors() {
    if (!els.statsEditors) return;
    els.statsEditors.innerHTML = "";
    (state.landing.stats || []).forEach((s, i) => {
      const row = document.createElement("div");
      row.className = "checkout-grid";
      row.innerHTML = `
        <div class="field"><label>Value ${i + 1}</label><input class="input stat-val" type="number" value="${s.value || 0}"></div>
        <div class="field"><label>Label</label><input class="input stat-label" value="${s.label || ""}"></div>
      `;
      els.statsEditors.appendChild(row);
    });
  }

  function readStats() {
    const rows = WWUI.qsa(".checkout-grid", els.statsEditors);
    return rows.map((row) => ({
      value: Number(row.querySelector(".stat-val")?.value) || 0,
      label: row.querySelector(".stat-label")?.value.trim() || ""
    }));
  }

  function renderTickerEditors() {
    if (!els.tickerEditors) return;
    els.tickerEditors.innerHTML = "";
    (state.landing.ticker || []).forEach((msg, i) => {
      const row = document.createElement("div");
      row.style.cssText = "display:flex;gap:8px;align-items:center;";
      row.innerHTML = `
        <input class="input ticker-msg" value="${msg}" style="flex:1;">
        <button class="icon-btn ticker-del" type="button" title="Remove">X</button>
      `;
      row.querySelector(".ticker-del").addEventListener("click", () => {
        state.landing.ticker.splice(i, 1);
        renderTickerEditors();
      });
      els.tickerEditors.appendChild(row);
    });
  }

  function readTicker() {
    return WWUI.qsa(".ticker-msg", els.tickerEditors).map((el) => el.value.trim()).filter(Boolean);
  }

  function renderTestimonialEditors() {
    if (!els.testimonialEditors) return;
    els.testimonialsTitle.value = state.landing.testimonialsTitle || "";
    els.testimonialEditors.innerHTML = "";
    (state.landing.testimonials || []).forEach((t, i) => {
      const card = document.createElement("div");
      card.className = "kpi";
      card.style.padding = "14px";
      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong>Quote ${i + 1}</strong>
          <button class="icon-btn test-del" type="button" title="Remove">X</button>
        </div>
        <div class="field" style="margin-top:8px;"><label>Quote</label><textarea class="textarea test-quote">${t.quote || ""}</textarea></div>
        <div class="field" style="margin-top:6px;"><label>Author</label><input class="input test-author" value="${t.author || ""}"></div>
      `;
      card.querySelector(".test-del").addEventListener("click", () => {
        state.landing.testimonials.splice(i, 1);
        renderTestimonialEditors();
      });
      els.testimonialEditors.appendChild(card);
    });
  }

  function readTestimonials() {
    const cards = WWUI.qsa(".kpi", els.testimonialEditors);
    return cards.map((card) => ({
      quote: card.querySelector(".test-quote")?.value.trim() || "",
      author: card.querySelector(".test-author")?.value.trim() || ""
    })).filter((t) => t.quote);
  }

  function syncFooterForm() {
    if (!els.footerForm) return;
    els.ctaTitle.value = state.landing.ctaTitle || "";
    els.ctaSub.value = state.landing.ctaSub || "";
    els.footerText.value = state.landing.footer || "";
  }

  function renderLandingEditors() {
    renderFeatureEditors();
    renderStatsEditors();
    renderTickerEditors();
    renderTestimonialEditors();
    syncFooterForm();
    renderNewEditors();
  }

  /* ---- Landing editor event handlers ---- */

  els.saveFeatures?.addEventListener("click", () => {
    state.landing.features = readFeatures();
    state.landing.featuresTitle = els.featTitle.value.trim();
    state.landing.featuresSub = els.featSub.value.trim();
    WWData.saveLanding(state.landing);
    WWUI.showToast("Feature boxes saved.");
  });

  els.saveStats?.addEventListener("click", () => {
    state.landing.stats = readStats();
    WWData.saveLanding(state.landing);
    WWUI.showToast("Stats saved.");
  });

  els.addTicker?.addEventListener("click", () => {
    state.landing.ticker = state.landing.ticker || [];
    state.landing.ticker.push("New message");
    renderTickerEditors();
  });

  els.saveTicker?.addEventListener("click", () => {
    state.landing.ticker = readTicker();
    WWData.saveLanding(state.landing);
    WWUI.showToast("Ticker saved.");
  });

  els.addTestimonial?.addEventListener("click", () => {
    state.landing.testimonials = state.landing.testimonials || [];
    state.landing.testimonials.push({ quote: "", author: "" });
    renderTestimonialEditors();
  });

  els.saveTestimonials?.addEventListener("click", () => {
    state.landing.testimonials = readTestimonials();
    state.landing.testimonialsTitle = els.testimonialsTitle.value.trim();
    WWData.saveLanding(state.landing);
    WWUI.showToast("Testimonials saved.");
  });

  els.footerForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    state.landing.ctaTitle = els.ctaTitle.value.trim();
    state.landing.ctaSub = els.ctaSub.value.trim();
    state.landing.footer = els.footerText.value.trim();
    WWData.saveLanding(state.landing);
    WWUI.showToast("Footer & CTA saved.");
  });

  /* ---- Image picker helper (reusable for any section) ---- */
  function renderAllImagePicker(container, selectedImage, onSelect) {
    if (!container) return;
    const images = WWData.ALL_IMAGES;
    container.innerHTML = "";
    images.forEach((src) => {
      const item = document.createElement("div");
      item.className = "image-picker-item" + (src === selectedImage ? " is-active" : "");
      item.innerHTML = '<img src="' + src + '" alt="Image option">';
      item.addEventListener("click", () => {
        WWUI.qsa(".image-picker-item", container).forEach((el) => el.classList.remove("is-active"));
        item.classList.add("is-active");
        if (onSelect) onSelect(src);
      });
      container.appendChild(item);
    });
  }

  /* ---- Landing hero image editor ---- */
  let selectedHeroImage = "";

  function renderHeroImagePicker() {
    selectedHeroImage = state.landing.heroImage || "";
    renderAllImagePicker(els.heroImagePicker, selectedHeroImage, (src) => { selectedHeroImage = src; });
  }

  els.saveHeroImage?.addEventListener("click", () => {
    state.landing.heroImage = selectedHeroImage;
    WWData.saveLanding(state.landing);
    WWUI.showToast("Landing hero image saved.");
  });

  /* ---- Orbit chips editor ---- */
  function renderOrbitEditors() {
    if (!els.orbitEditors) return;
    els.orbitEditors.innerHTML = "";
    (state.landing.orbitChips || []).forEach((chip, i) => {
      const row = document.createElement("div");
      row.style.cssText = "display:flex;gap:8px;align-items:center;";
      row.innerHTML = `
        <input class="input orbit-msg" value="${chip}" style="flex:1;" placeholder="Chip text">
        <button class="icon-btn orbit-del" type="button" title="Remove">X</button>
      `;
      row.querySelector(".orbit-del").addEventListener("click", () => {
        state.landing.orbitChips.splice(i, 1);
        renderOrbitEditors();
      });
      els.orbitEditors.appendChild(row);
    });
  }

  els.addOrbitChip?.addEventListener("click", () => {
    state.landing.orbitChips = state.landing.orbitChips || [];
    state.landing.orbitChips.push("New Chip");
    renderOrbitEditors();
  });

  els.saveOrbitChips?.addEventListener("click", () => {
    state.landing.orbitChips = WWUI.qsa(".orbit-msg", els.orbitEditors).map((el) => el.value.trim()).filter(Boolean);
    WWData.saveLanding(state.landing);
    WWUI.showToast("Orbit chips saved.");
  });

  /* ---- Floating note editor ---- */
  function syncFloatingNote() {
    const note = state.landing.floatingNote || {};
    if (els.fnLabel) els.fnLabel.value = note.label || "";
    if (els.fnValue) els.fnValue.value = note.value || "";
    if (els.fnDesc) els.fnDesc.value = note.desc || "";
  }

  els.saveFloatingNote?.addEventListener("click", () => {
    state.landing.floatingNote = {
      label: els.fnLabel.value.trim(),
      value: els.fnValue.value.trim(),
      desc: els.fnDesc.value.trim()
    };
    WWData.saveLanding(state.landing);
    WWUI.showToast("Floating note saved.");
  });

  /* ---- Lookbook editor ---- */
  function renderLookbookEditors() {
    if (!els.lookbookEditors) return;
    if (els.lkTitle) els.lkTitle.value = state.landing.lookbookTitle || "";
    if (els.lkSub) els.lkSub.value = state.landing.lookbookSub || "";
    els.lookbookEditors.innerHTML = "";
    (state.landing.lookbook || []).forEach((item, i) => {
      const card = document.createElement("div");
      card.className = "kpi";
      card.style.padding = "14px";
      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong>Slide ${i + 1}</strong>
          <button class="icon-btn lk-del" type="button" title="Remove">X</button>
        </div>
        <div class="field" style="margin-top:8px;"><label>Caption</label><input class="input lk-caption" value="${item.caption || ""}"></div>
        <div class="field" style="margin-top:6px;"><label>Image</label></div>
        <div class="lk-picker image-picker-grid" style="margin-top:4px;"></div>
      `;
      card.querySelector(".lk-del").addEventListener("click", () => {
        state.landing.lookbook.splice(i, 1);
        renderLookbookEditors();
      });
      els.lookbookEditors.appendChild(card);
      const picker = card.querySelector(".lk-picker");
      renderAllImagePicker(picker, item.image || "", (src) => {
        state.landing.lookbook[i].image = src;
      });
    });
  }

  els.addLookbook?.addEventListener("click", () => {
    state.landing.lookbook = state.landing.lookbook || [];
    state.landing.lookbook.push({ image: "", caption: "New slide" });
    renderLookbookEditors();
  });

  els.saveLookbook?.addEventListener("click", () => {
    const cards = WWUI.qsa(".kpi", els.lookbookEditors);
    state.landing.lookbook = (state.landing.lookbook || []).map((item, i) => ({
      image: item.image,
      caption: cards[i]?.querySelector(".lk-caption")?.value.trim() || ""
    }));
    state.landing.lookbookTitle = els.lkTitle?.value.trim() || "";
    state.landing.lookbookSub = els.lkSub?.value.trim() || "";
    WWData.saveLanding(state.landing);
    WWUI.showToast("Lookbook saved.");
  });

  /* ---- Store hero image editor ---- */
  let selectedStoreHeroImage = "";

  function renderStoreHeroImagePicker() {
    selectedStoreHeroImage = state.landing.storeHeroImage || "";
    if (els.storeHeroCopy) els.storeHeroCopy.value = state.landing.storeHeroCopy || "";
    renderAllImagePicker(els.storeHeroImagePicker, selectedStoreHeroImage, (src) => { selectedStoreHeroImage = src; });
  }

  els.saveStoreHero?.addEventListener("click", () => {
    state.landing.storeHeroImage = selectedStoreHeroImage;
    state.landing.storeHeroCopy = els.storeHeroCopy?.value.trim() || "";
    WWData.saveLanding(state.landing);
    WWUI.showToast("Store hero saved.");
  });

  /* ---- Floating product cards editor ---- */
  function renderFloatProductEditors() {
    if (!els.floatProductEditors) return;
    els.floatProductEditors.innerHTML = "";
    (state.landing.floatProducts || []).forEach((fp, i) => {
      const card = document.createElement("div");
      card.className = "kpi";
      card.style.padding = "14px";
      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong>Card ${i + 1}</strong>
          <button class="icon-btn fp-del" type="button" title="Remove">X</button>
        </div>
        <div class="field" style="margin-top:8px;"><label>Label</label><input class="input fp-label" value="${fp.label || ""}"></div>
        <div class="field" style="margin-top:6px;"><label>Image</label></div>
        <div class="fp-picker image-picker-grid" style="margin-top:4px;"></div>
      `;
      card.querySelector(".fp-del").addEventListener("click", () => {
        state.landing.floatProducts.splice(i, 1);
        renderFloatProductEditors();
      });
      els.floatProductEditors.appendChild(card);
      const picker = card.querySelector(".fp-picker");
      renderAllImagePicker(picker, fp.image || "", (src) => {
        state.landing.floatProducts[i].image = src;
      });
    });
  }

  els.addFloatProduct?.addEventListener("click", () => {
    state.landing.floatProducts = state.landing.floatProducts || [];
    state.landing.floatProducts.push({ image: "", label: "New Card" });
    renderFloatProductEditors();
  });

  els.saveFloatProducts?.addEventListener("click", () => {
    const cards = WWUI.qsa(".kpi", els.floatProductEditors);
    state.landing.floatProducts = (state.landing.floatProducts || []).map((fp, i) => ({
      image: fp.image,
      label: cards[i]?.querySelector(".fp-label")?.value.trim() || ""
    }));
    WWData.saveLanding(state.landing);
    WWUI.showToast("Floating product cards saved.");
  });

  /* ---- Drop rail editor ---- */
  function renderDropRailEditors() {
    if (!els.dropRailEditors) return;
    if (els.drTitle) els.drTitle.value = state.landing.dropRailTitle || "";
    if (els.drSub) els.drSub.value = state.landing.dropRailSub || "";
    els.dropRailEditors.innerHTML = "";
    (state.landing.dropRail || []).forEach((dr, i) => {
      const card = document.createElement("div");
      card.className = "kpi";
      card.style.padding = "14px";
      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong>Drop ${i + 1}</strong>
          <button class="icon-btn dr-del" type="button" title="Remove">X</button>
        </div>
        <div class="field" style="margin-top:8px;"><label>Label</label><input class="input dr-label" value="${dr.label || ""}"></div>
        <div class="field" style="margin-top:6px;"><label>Image</label></div>
        <div class="dr-picker image-picker-grid" style="margin-top:4px;"></div>
      `;
      card.querySelector(".dr-del").addEventListener("click", () => {
        state.landing.dropRail.splice(i, 1);
        renderDropRailEditors();
      });
      els.dropRailEditors.appendChild(card);
      const picker = card.querySelector(".dr-picker");
      renderAllImagePicker(picker, dr.image || "", (src) => {
        state.landing.dropRail[i].image = src;
      });
    });
  }

  els.addDropCard?.addEventListener("click", () => {
    state.landing.dropRail = state.landing.dropRail || [];
    state.landing.dropRail.push({ image: "", label: "New Drop" });
    renderDropRailEditors();
  });

  els.saveDropRail?.addEventListener("click", () => {
    const cards = WWUI.qsa(".kpi", els.dropRailEditors);
    state.landing.dropRail = (state.landing.dropRail || []).map((dr, i) => ({
      image: dr.image,
      label: cards[i]?.querySelector(".dr-label")?.value.trim() || ""
    }));
    state.landing.dropRailTitle = els.drTitle?.value.trim() || "";
    state.landing.dropRailSub = els.drSub?.value.trim() || "";
    WWData.saveLanding(state.landing);
    WWUI.showToast("Drop rail saved.");
  });

  /* ---- Render all new editors inside renderLandingEditors ---- */

  function renderNewEditors() {
    renderHeroImagePicker();
    renderOrbitEditors();
    syncFloatingNote();
    renderLookbookEditors();
    renderStoreHeroImagePicker();
    renderFloatProductEditors();
    renderDropRailEditors();
  }

  function openProductModal(product = null) {
    state.editingId = product?.id || null;
    if (els.productModalTitle) {
      els.productModalTitle.textContent = product ? "Edit Product" : "Add Product";
    }

    if (els.productId) els.productId.value = product?.id || "";
    if (els.pName) els.pName.value = product?.name || "";
    if (els.pCat) els.pCat.value = product?.cat || "Knit Caps";
    if (els.pPrice) els.pPrice.value = product?.price ?? "";
    if (els.pBadge) els.pBadge.value = product?.badge || "";
    if (els.pEmoji) els.pEmoji.value = product?.emoji || "W";
    const colorValue = product?.color && /^#([0-9A-Fa-f]{3}){1,2}$/.test(product.color) ? product.color : "#eef4ff";
    if (els.pColor) els.pColor.value = colorValue;
    if (els.pStock) els.pStock.value = product?.stock ?? 0;
    if (els.pRating) els.pRating.value = product?.rating ?? 4.8;
    if (els.pReviews) els.pReviews.value = product?.reviews ?? 0;
    if (els.pDesc) els.pDesc.value = product?.desc || "";
    if (els.pImage) els.pImage.value = product?.image || "";

    renderImagePicker(product?.image || "");

    els.productModal?.classList.add("is-open");
  }

  function renderImagePicker(selectedImage) {
    if (!els.pImagePicker) return;

    const images = WWData.PRODUCT_IMAGES;
    els.pImagePicker.innerHTML = "";

    images.forEach((src) => {
      const item = document.createElement("div");
      item.className = "image-picker-item" + (src === selectedImage ? " is-active" : "");
      item.innerHTML = '<img src="' + src + '" alt="Product image option">';
      item.addEventListener("click", () => {
        if (els.pImage) els.pImage.value = src;
        WWUI.qsa(".image-picker-item", els.pImagePicker).forEach((el) => el.classList.remove("is-active"));
        item.classList.add("is-active");
      });
      els.pImagePicker.appendChild(item);
    });
  }

  function closeProductModal() {
    els.productModal?.classList.remove("is-open");
  }

  function renderAll() {
    renderStats();
    renderChart();
    renderProducts();
    renderOrders();
    syncHeroForm();
    renderLandingEditors();
  }

  els.addProductBtn?.addEventListener("click", () => openProductModal());
  els.closeProductModal?.addEventListener("click", closeProductModal);
  els.productModal?.addEventListener("click", (event) => {
    if (event.target === els.productModal) {
      closeProductModal();
    }
  });

  els.productForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const payload = {
      id: state.editingId,
      name: els.pName.value.trim(),
      cat: els.pCat.value,
      price: Number(els.pPrice.value),
      badge: els.pBadge.value.trim(),
      emoji: els.pEmoji.value.trim() || "W",
      color: els.pColor.value,
      stock: Number(els.pStock.value),
      desc: els.pDesc.value.trim(),
      rating: Number(els.pRating?.value) || 4.8,
      reviews: Number(els.pReviews?.value) || 0,
      image: els.pImage?.value || ""
    };

    if (!payload.name || Number.isNaN(payload.price)) {
      WWUI.showToast("Please complete name and price.");
      return;
    }

    if (state.editingId) {
      state.products = state.products.map((p) => (p.id === state.editingId ? { ...p, ...payload } : p));
    } else {
      const maxId = state.products.length ? Math.max(...state.products.map((p) => p.id)) : 0;
      state.products.unshift({ ...payload, id: maxId + 1 });
    }

    WWData.saveProducts(state.products);
    closeProductModal();
    renderAll();
    WWUI.showToast("Product saved.");
  });

  els.heroForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    state.hero = {
      badge: els.hBadge.value.trim(),
      line1: els.hLine1.value.trim(),
      line2: els.hLine2.value.trim(),
      sub: els.hSub.value.trim(),
      cta: els.hCta.value.trim(),
      cta2: els.hCta2.value.trim()
    };

    WWData.saveHero(state.hero);
    WWUI.showToast("Store hero content updated.");
  });

  renderAll();
});

