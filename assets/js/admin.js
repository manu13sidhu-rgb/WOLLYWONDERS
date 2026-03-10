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
    latestOrders: WWUI.qs("#latestOrders")
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

