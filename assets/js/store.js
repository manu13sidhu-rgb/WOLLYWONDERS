document.addEventListener("DOMContentLoaded", () => {
  WWUI.initBase();

  const SIZE_OPTIONS = ["0-3M", "3-6M", "6-12M", "12-18M"];
  const COLOR_OPTIONS = [
    { name: "Ivory", hex: "#f6efe5" },
    { name: "Cloud Blue", hex: "#b5d7f7" },
    { name: "Soft Sage", hex: "#b6cfbc" },
    { name: "Blush Pink", hex: "#e9bdcb" }
  ];

  function normalizeCart(rawCart) {
    if (!Array.isArray(rawCart)) {
      return [];
    }

    return rawCart
      .filter((line) => line && Number.isFinite(Number(line.id)))
      .map((line) => {
        const qty = Math.max(1, Number(line.qty) || 1);
        const price = Number(line.price) || 0;
        const size = line.size || "";
        const color = line.color || "";
        const variantKey = line.variantKey || (size || color ? `${line.id}|${size}|${color}` : String(line.id));

        return {
          id: Number(line.id),
          name: line.name || "Wooly Product",
          price,
          qty,
          size,
          color,
          variantKey
        };
      });
  }

  const session = WWData.getSession();
  const helloName = WWUI.qs("#helloName");
  if (helloName && session) {
    helloName.textContent = `Welcome back, ${session.name.split(" ")[0]}`;
  }

  const hero = WWData.getHero();
  const storeBadge = WWUI.qs("#storeBadge");
  const storeTitle1 = WWUI.qs("#storeTitle1");
  const storeTitle2 = WWUI.qs("#storeTitle2");
  const storeSub = WWUI.qs("#storeSub");
  const storePrimaryCta = WWUI.qs("#storePrimaryCta");

  if (storeBadge) storeBadge.textContent = hero.badge;
  if (storeTitle1) storeTitle1.textContent = hero.line1;
  if (storeTitle2) storeTitle2.textContent = hero.line2;
  if (storeSub) storeSub.textContent = hero.sub;
  if (storePrimaryCta) storePrimaryCta.textContent = hero.cta;

  /* ---- Hydrate store visuals from editable data ---- */
  const landing = WWData.getLanding();

  // Store hero image & copy
  const storeHighlightImg = document.querySelector(".store-highlight img");
  const storeHighlightCopy = document.querySelector(".store-highlight .copy");
  if (storeHighlightImg && landing.storeHeroImage) storeHighlightImg.src = landing.storeHeroImage;
  if (storeHighlightCopy && landing.storeHeroCopy) storeHighlightCopy.textContent = landing.storeHeroCopy;

  // Floating product cards
  const fpClasses = ["fp-a", "fp-b", "fp-c"];
  (landing.floatProducts || []).forEach((fp, i) => {
    if (i >= fpClasses.length) return;
    const el = document.querySelector(".float-product." + fpClasses[i]);
    if (!el) return;
    const img = el.querySelector("img");
    const span = el.querySelector("span");
    if (img && fp.image) img.src = fp.image;
    if (span && fp.label) span.textContent = fp.label;
  });

  // Drop rail
  const dropHead = document.querySelector(".drop-head");
  if (dropHead) {
    const drTitle = dropHead.querySelector(".section-title");
    const drSub = dropHead.querySelector(".mini");
    if (drTitle && landing.dropRailTitle) drTitle.textContent = landing.dropRailTitle;
    if (drSub && landing.dropRailSub) drSub.textContent = landing.dropRailSub;
  }
  const dropTrackEl = document.querySelector("#dropTrack");
  if (dropTrackEl && landing.dropRail && landing.dropRail.length) {
    dropTrackEl.innerHTML = "";
    const items = landing.dropRail;
    // Duplicate for seamless scroll
    [...items, ...items].forEach((dr, idx) => {
      const article = document.createElement("article");
      article.className = "drop-card";
      article.innerHTML = '<img src="' + dr.image + '" alt="drop ' + (idx + 1) + '"><span>' + dr.label + '</span>';
      dropTrackEl.appendChild(article);
    });
  }

  const state = {
    products: WWData.getProducts(),
    cart: normalizeCart(JSON.parse(localStorage.getItem(WWData.KEYS.cart) || "[]")),
    category: "All",
    search: "",
    modalProductId: null,
    modalSize: SIZE_OPTIONS[0],
    modalColor: COLOR_OPTIONS[0].name
  };

  const els = {
    categoryChips: WWUI.qs("#categoryChips"),
    productGrid: WWUI.qs("#productGrid"),
    searchInput: WWUI.qs("#searchInput"),
    resultCount: WWUI.qs("#resultCount"),
    openCart: WWUI.qs("#openCartBtn"),
    closeCart: WWUI.qs("#closeCartBtn"),
    cartDrawer: WWUI.qs("#cartDrawer"),
    cartOverlay: WWUI.qs("#cartOverlay"),
    cartBody: WWUI.qs("#cartBody"),
    cartCount: WWUI.qs("#cartCount"),
    cartSubtotal: WWUI.qs("#cartSubtotal"),
    cartShipping: WWUI.qs("#cartShipping"),
    cartTax: WWUI.qs("#cartTax"),
    cartTotal: WWUI.qs("#cartTotal"),
    btnCheckout: WWUI.qs("#btnCheckout"),
    checkoutModal: WWUI.qs("#checkoutModal"),
    closeCheckout: WWUI.qs("#closeCheckout"),
    checkoutForm: WWUI.qs("#checkoutForm"),
    modalSummary: WWUI.qs("#modalSummary"),
    navAllProducts: WWUI.qs("#navAllProducts"),
    bundleForm: WWUI.qs("#bundleForm"),
    bundleResult: WWUI.qs("#bundleResult"),
    storeHeroCanvas: WWUI.qs("#storeHeroCanvas"),
    storeHeroSection: WWUI.qs(".kinetic-store-hero"),
    dropRail: WWUI.qs("#dropRail"),
    dropTrack: WWUI.qs("#dropTrack"),
    productModal: WWUI.qs("#productModal"),
    closeProductModal: WWUI.qs("#closeProductModal"),
    pmImage: WWUI.qs("#pmImage"),
    pmCategory: WWUI.qs("#pmCategory"),
    pmName: WWUI.qs("#pmName"),
    pmDesc: WWUI.qs("#pmDesc"),
    pmPrice: WWUI.qs("#pmPrice"),
    pmRating: WWUI.qs("#pmRating"),
    pmSizePicker: WWUI.qs("#pmSizePicker"),
    pmColorPicker: WWUI.qs("#pmColorPicker"),
    pmAddToCart: WWUI.qs("#pmAddToCart"),
    pmQuickBuy: WWUI.qs("#pmQuickBuy")
  };

  const categories = ["All", ...new Set(state.products.map((p) => p.cat))];

  function persistCart() {
    localStorage.setItem(WWData.KEYS.cart, JSON.stringify(state.cart));
  }

  function getCartQuantity() {
    return state.cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function getFilteredProducts() {
    const query = state.search.trim().toLowerCase();
    return state.products.filter((p) => {
      const matchCategory = state.category === "All" || p.cat === state.category;
      const matchSearch = !query || p.name.toLowerCase().includes(query) || p.cat.toLowerCase().includes(query) || (p.desc || "").toLowerCase().includes(query);
      return matchCategory && matchSearch;
    });
  }

  function getCartTotals() {
    const subtotal = state.cart.reduce((sum, line) => sum + line.price * line.qty, 0);
    const shipping = subtotal > 120 || subtotal === 0 ? 0 : 8;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
  }

  function lineKeyFromItem(item) {
    return item.variantKey || String(item.id);
  }

  function findProductById(id) {
    return state.products.find((p) => p.id === Number(id));
  }

  function addProductToCart(product, options = {}) {
    if (!product) {
      return;
    }

    const qty = Math.max(1, Number(options.qty) || 1);
    const size = options.size || "";
    const color = options.color || "";
    const variantKey = size || color ? `${product.id}|${size}|${color}` : String(product.id);

    const existing = state.cart.find((line) => lineKeyFromItem(line) === variantKey);
    if (existing) {
      existing.qty += qty;
    } else {
      state.cart.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        qty,
        size,
        color,
        variantKey
      });
    }

    persistCart();
    renderCart();
  }

  function updateCheckoutSummary() {
    const totals = getCartTotals();
    if (els.modalSummary) {
      els.modalSummary.textContent = `${getCartQuantity()} items - ${WWUI.currency(totals.total)}`;
    }
  }

  function runQuickBuy(product, options = {}) {
    addProductToCart(product, { ...options, qty: 1 });
    updateCheckoutSummary();
    setCheckoutOpen(true);
    WWUI.showToast(`${product.name} added. Checkout is ready.`);
  }

  function renderCategories() {
    if (!els.categoryChips) return;

    els.categoryChips.innerHTML = "";
    categories.forEach((category) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `chip ${state.category === category ? "is-active" : ""}`;
      button.textContent = category;
      button.addEventListener("click", () => {
        state.category = category;
        renderCategories();
        renderProducts();
      });
      els.categoryChips.appendChild(button);
    });
  }

  function productCard(product, index = 0) {
    const card = document.createElement("article");
    card.className = "product-card reveal tilt-card card-in";
    card.style.animationDelay = `${Math.min(index * 70, 420)}ms`;

    const coverStyle = `background: radial-gradient(circle at 30% 20%, #ffffff 0%, ${product.color || "#eef4ff"} 85%);`;
    const media = product.image
      ? `<img src="${product.image}" alt="${product.name}" loading="lazy">`
      : `<div aria-hidden="true">${product.emoji || "W"}</div>`;

    const badge = product.badge ? `<span class="product-badge">${product.badge}</span>` : "";

    card.innerHTML = `
      <div class="product-cover" style="${coverStyle}">
        ${badge}
        ${media}
      </div>
      <div class="product-body">
        <div class="product-cat">${product.cat}</div>
        <h3 class="product-name">${product.name}</h3>
        <p class="mini">${product.desc || "Hand-finished wool essential."}</p>
        <div class="product-meta">
          <div>
            <div class="price">${WWUI.currency(product.price)}</div>
            <div class="rating">${product.rating?.toFixed(1) || "4.8"} / 5 - ${product.reviews || 0} reviews</div>
          </div>
          <button class="btn btn-soft" type="button" data-details="${product.id}">Details</button>
        </div>
        <div class="product-sticky-buy">
          <button class="btn btn-outline product-action-btn" type="button" data-add="${product.id}">Add</button>
          <button class="btn btn-primary magnetic product-action-btn quick-buy-btn" type="button" data-quick-buy="${product.id}">Quick Buy</button>
        </div>
      </div>
    `;

    return card;
  }

  function renderProducts() {
    const list = getFilteredProducts();
    if (!els.productGrid) return;

    els.productGrid.innerHTML = "";

    if (!list.length) {
      const empty = document.createElement("div");
      empty.className = "panel";
      empty.style.padding = "22px";
      empty.innerHTML = "<strong>No products found.</strong><p class='mini' style='margin-top:6px;'>Try a different category or search keyword.</p>";
      els.productGrid.appendChild(empty);
    } else {
      list.forEach((product, index) => {
        els.productGrid.appendChild(productCard(product, index));
      });
    }

    if (els.resultCount) {
      els.resultCount.textContent = `${list.length} item${list.length === 1 ? "" : "s"}`;
    }

    WWUI.initBase();
    wireProductButtons();
  }

  function wireProductButtons() {
    WWUI.qsa("[data-add]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const product = findProductById(btn.dataset.add);
        if (!product) return;

        addProductToCart(product);
        WWUI.showToast(`${product.name} added to cart.`);
      });
    });

    WWUI.qsa("[data-quick-buy]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const product = findProductById(btn.dataset.quickBuy);
        if (!product) return;

        runQuickBuy(product, {
          size: SIZE_OPTIONS[0],
          color: COLOR_OPTIONS[0].name
        });
      });
    });

    WWUI.qsa("[data-details]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const product = findProductById(btn.dataset.details);
        if (!product) return;

        openProductModal(product);
      });
    });
  }

  function renderCart() {
    if (!els.cartBody) return;

    els.cartBody.innerHTML = "";
    if (!state.cart.length) {
      const empty = document.createElement("p");
      empty.className = "mini";
      empty.textContent = "Your cart is empty. Add something beautiful for your little one.";
      els.cartBody.appendChild(empty);
    }

    state.cart.forEach((line) => {
      const item = document.createElement("div");
      item.className = "cart-item";
      const key = lineKeyFromItem(line);
      const variantText = [line.size ? `Size ${line.size}` : "", line.color || ""].filter(Boolean).join(" - ");
      item.innerHTML = `
        <div>
          <h4>${line.name}</h4>
          <p>${WWUI.currency(line.price)} each${variantText ? ` - ${variantText}` : ""}</p>
          <div class="qty-row">
            <button type="button" aria-label="Decrease" data-qty="-1" data-key="${key}">-</button>
            <strong>${line.qty}</strong>
            <button type="button" aria-label="Increase" data-qty="1" data-key="${key}">+</button>
          </div>
        </div>
        <div class="line-total">${WWUI.currency(line.qty * line.price)}</div>
      `;
      els.cartBody.appendChild(item);
    });

    WWUI.qsa("[data-qty]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.key || "";
        const delta = Number(btn.dataset.qty);
        const line = state.cart.find((item) => lineKeyFromItem(item) === key);
        if (!line) return;

        line.qty += delta;
        if (line.qty <= 0) {
          state.cart = state.cart.filter((item) => lineKeyFromItem(item) !== key);
        }

        persistCart();
        renderCart();
      });
    });

    const totals = getCartTotals();
    if (els.cartCount) els.cartCount.textContent = String(getCartQuantity());
    if (els.cartSubtotal) els.cartSubtotal.textContent = WWUI.currency(totals.subtotal);
    if (els.cartShipping) els.cartShipping.textContent = totals.shipping ? WWUI.currency(totals.shipping) : "Free";
    if (els.cartTax) els.cartTax.textContent = WWUI.currency(totals.tax);
    if (els.cartTotal) els.cartTotal.textContent = WWUI.currency(totals.total);
  }

  function setCartOpen(open) {
    if (!els.cartDrawer || !els.cartOverlay) return;
    els.cartDrawer.classList.toggle("is-open", open);
    els.cartOverlay.classList.toggle("is-open", open);
  }

  function setCheckoutOpen(open) {
    if (!els.checkoutModal) return;
    els.checkoutModal.classList.toggle("is-open", open);

    if (open) {
      const session = WWData.getSession();
      if (session) {
        const nameInput = WWUI.qs("#coName");
        const emailInput = WWUI.qs("#coEmail");
        if (nameInput && !nameInput.value) nameInput.value = session.name || "";
        if (emailInput && !emailInput.value) emailInput.value = session.email || "";
      }
    }
  }

  function setProductModalOpen(open) {
    if (!els.productModal) {
      return;
    }

    els.productModal.classList.toggle("is-open", open);
    els.productModal.setAttribute("aria-hidden", open ? "false" : "true");

    if (!open) {
      state.modalProductId = null;
    }
  }

  function renderModalPickers() {
    if (!els.pmSizePicker || !els.pmColorPicker) {
      return;
    }

    els.pmSizePicker.innerHTML = SIZE_OPTIONS.map((size) => `
      <button class="pm-size-btn ${state.modalSize === size ? "is-active" : ""}" type="button" data-size="${size}">${size}</button>
    `).join("");

    els.pmColorPicker.innerHTML = COLOR_OPTIONS.map((color) => `
      <button class="pm-color-btn ${state.modalColor === color.name ? "is-active" : ""}" type="button" data-color="${color.name}">
        <span class="pm-swatch" style="--swatch:${color.hex};"></span>
        <span>${color.name}</span>
      </button>
    `).join("");
  }

  function openProductModal(product) {
    if (!product) {
      return;
    }

    state.modalProductId = product.id;
    state.modalSize = SIZE_OPTIONS[0];
    state.modalColor = COLOR_OPTIONS[0].name;

    if (els.pmImage) {
      els.pmImage.src = product.image || "assets/images/products/2.webp";
      els.pmImage.alt = product.name;
    }
    if (els.pmCategory) els.pmCategory.textContent = product.cat;
    if (els.pmName) els.pmName.textContent = product.name;
    if (els.pmDesc) els.pmDesc.textContent = product.desc || "Hand-finished wool essential.";
    if (els.pmPrice) els.pmPrice.textContent = WWUI.currency(product.price);
    if (els.pmRating) els.pmRating.textContent = `${product.rating?.toFixed(1) || "4.8"} / 5 - ${product.reviews || 0} reviews`;

    renderModalPickers();
    setProductModalOpen(true);
  }

  function applyPreferenceFromLanding() {
    const raw = localStorage.getItem("ww_pref");
    if (!raw) {
      return;
    }

    try {
      const pref = JSON.parse(raw);
      if (pref.search) {
        state.search = pref.search;
        if (els.searchInput) {
          els.searchInput.value = pref.search;
        }
      }
      if (pref.category && categories.includes(pref.category)) {
        state.category = pref.category;
      }
      WWUI.showToast(`Applied recommendation: ${pref.category || "All"}`);
    } catch {
      // no-op
    }
  }

  function initDropRail() {
    if (!els.dropRail || !els.dropTrack) return;

    els.dropRail.addEventListener("mouseenter", () => {
      els.dropTrack.style.animationPlayState = "paused";
    });

    els.dropRail.addEventListener("mouseleave", () => {
      els.dropTrack.style.animationPlayState = "running";
    });
  }

  function initBundleBuilder() {
    if (!els.bundleForm || !els.bundleResult) {
      return;
    }

    els.bundleForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const style = WWUI.qs("#bundleStyle")?.value || "";
      const budget = WWUI.qs("#bundleBudget")?.value || "";
      if (!style || !budget) {
        WWUI.showToast("Select style and budget to generate a bundle.");
        return;
      }

      let category = "Knit Caps";
      let search = "soft";
      let priceHint = "Under $40";

      if (style === "minimal") {
        category = "Booties";
        search = "neutral";
      }
      if (style === "playful") {
        category = "Knit Caps";
        search = "color";
      }
      if (style === "premium") {
        category = "Gift Sets";
        search = "gift";
      }

      if (budget === "mid") priceHint = "$40-$70";
      if (budget === "high") priceHint = "$70+";

      if (categories.includes(category)) {
        state.category = category;
      } else {
        state.category = "All";
      }
      state.search = search;

      if (els.searchInput) {
        els.searchInput.value = search;
      }

      renderCategories();
      renderProducts();

      localStorage.setItem("ww_pref", JSON.stringify({ category: state.category, search, style, budget, createdAt: new Date().toISOString() }));

      els.bundleResult.hidden = false;
      els.bundleResult.innerHTML = `
        <strong>Bundle suggestion ready</strong>
        <p class="mini" style="margin-top:8px;">Category: ${state.category} | Search: ${search} | Budget: ${priceHint}</p>
        <a class="btn btn-primary magnetic" style="margin-top:10px;display:inline-flex;" href="#catalog">View Filtered Catalog</a>
      `;

      document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
      WWUI.showToast("Bundle generated.");
    });
  }

  function initStoreHeroCanvas() {
    const canvas = els.storeHeroCanvas;
    const host = els.storeHeroSection;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canvas || !host || reduceMotion) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    let w = 0;
    let h = 0;
    const mouse = { x: -9999, y: -9999 };
    let particles = [];

    function resize() {
      w = host.clientWidth;
      h = host.clientHeight;
      canvas.width = w;
      canvas.height = h;
      const count = w < 740 ? 52 : 96;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.42,
        vy: (Math.random() - 0.5) * 0.42,
        r: Math.random() * 2.8 + 1.2
      }));
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        const dxm = p.x - mouse.x;
        const dym = p.y - mouse.y;
        const dm = Math.hypot(dxm, dym);
        if (dm < 170 && dm > 0) {
          p.vx += (dxm / dm) * 0.018;
          p.vy += (dym / dm) * 0.018;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(38, 118, 236, 0.56)";
        ctx.fill();

        for (let j = i + 1; j < particles.length; j += 1) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d = Math.hypot(dx, dy);
          if (d > 170) continue;
          const alpha = (1 - d / 170) * 0.22;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0, 166, 166, ${alpha.toFixed(3)})`;
          ctx.lineWidth = 1.05;
          ctx.stroke();
        }
      }

      requestAnimationFrame(frame);
    }

    host.addEventListener("pointermove", (event) => {
      const rect = host.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    });

    host.addEventListener("pointerleave", () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    window.addEventListener("resize", resize);
    resize();
    frame();
  }

  els.navAllProducts?.addEventListener("click", (event) => {
    event.preventDefault();
    state.category = "All";
    state.search = "";
    if (els.searchInput) {
      els.searchInput.value = "";
    }
    renderCategories();
    renderProducts();
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  if (els.searchInput) {
    els.searchInput.addEventListener("input", (event) => {
      state.search = event.target.value;
      renderProducts();
    });
  }

  els.openCart?.addEventListener("click", () => setCartOpen(true));
  els.closeCart?.addEventListener("click", () => setCartOpen(false));
  els.cartOverlay?.addEventListener("click", () => {
    setCartOpen(false);
    setCheckoutOpen(false);
  });

  els.btnCheckout?.addEventListener("click", () => {
    if (!state.cart.length) {
      WWUI.showToast("Your cart is empty.");
      return;
    }

    updateCheckoutSummary();
    setCheckoutOpen(true);
  });

  els.closeCheckout?.addEventListener("click", () => setCheckoutOpen(false));

  if (els.checkoutForm) {
    els.checkoutForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!state.cart.length) {
        WWUI.showToast("Your cart is empty.");
        return;
      }

      const formData = new FormData(els.checkoutForm);
      const totals = getCartTotals();
      const order = WWData.addOrder({
        customerName: formData.get("name")?.toString().trim() || "Guest",
        customerEmail: formData.get("email")?.toString().trim() || "guest@example.com",
        phone: formData.get("phone")?.toString().trim() || "",
        address: formData.get("address")?.toString().trim() || "",
        items: state.cart.map((line) => ({ ...line })),
        qty: getCartQuantity(),
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        tax: totals.tax,
        total: totals.total,
        status: "Paid"
      });

      state.cart = [];
      persistCart();
      renderCart();
      els.checkoutForm.reset();
      setCheckoutOpen(false);
      setCartOpen(false);
      WWUI.showToast(`Order ${order.id} placed successfully.`);
    });
  }

  els.closeProductModal?.addEventListener("click", () => setProductModalOpen(false));

  els.productModal?.addEventListener("click", (event) => {
    if (event.target === els.productModal) {
      setProductModalOpen(false);
    }
  });

  els.pmSizePicker?.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-size]");
    if (!btn) return;

    state.modalSize = btn.dataset.size || SIZE_OPTIONS[0];
    renderModalPickers();
  });

  els.pmColorPicker?.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-color]");
    if (!btn) return;

    state.modalColor = btn.dataset.color || COLOR_OPTIONS[0].name;
    renderModalPickers();
  });

  els.pmAddToCart?.addEventListener("click", () => {
    const product = findProductById(state.modalProductId);
    if (!product) return;

    addProductToCart(product, {
      size: state.modalSize,
      color: state.modalColor
    });

    WWUI.showToast(`${product.name} (${state.modalSize}, ${state.modalColor}) added to cart.`);
  });

  els.pmQuickBuy?.addEventListener("click", () => {
    const product = findProductById(state.modalProductId);
    if (!product) return;

    setProductModalOpen(false);
    runQuickBuy(product, {
      size: state.modalSize,
      color: state.modalColor
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (els.productModal?.classList.contains("is-open")) {
      setProductModalOpen(false);
      return;
    }

    if (els.checkoutModal?.classList.contains("is-open")) {
      setCheckoutOpen(false);
      return;
    }

    if (els.cartDrawer?.classList.contains("is-open")) {
      setCartOpen(false);
    }
  });

  applyPreferenceFromLanding();
  renderCategories();
  renderProducts();
  renderCart();
  initDropRail();
  initBundleBuilder();
  initStoreHeroCanvas();
});

