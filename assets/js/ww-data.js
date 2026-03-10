(() => {
  const KEYS = {
    users: "ww_users",
    session: "ww_session",
    products: "ww_products",
    hero: "ww_hero",
    orders: "ww_orders",
    cart: "ww_cart",
    landing: "ww_landing"
  };

  const PRODUCT_IMAGES = [
    "assets/images/products/2.webp",
    "assets/images/products/3.webp",
    "assets/images/products/4.webp",
    "assets/images/products/5.webp",
    "assets/images/products/7.webp",
    "assets/images/products/8.webp",
    "assets/images/products/9.webp",
    "assets/images/products/10.webp",
    "assets/images/products/11.webp",
    "assets/images/products/12.webp",
    "assets/images/products/13.webp",
    "assets/images/products/14.webp",
    "assets/images/products/15.webp",
    "assets/images/products/IMG_2249.JPG",
    "assets/images/products/IMG_2250.JPG",
    "assets/images/products/IMG_2251.JPG",
    "assets/images/products/IMG_2252.JPG",
    "assets/images/products/IMG_2253.JPG"
  ];

  const DEFAULT_USERS = [
    { id: 1, name: "Wooly Admin", email: "admin@woolywonders.com", password: "woolyadmin", role: "admin" },
    { id: 2, name: "Mia Harper", email: "mia@woolywonders.com", password: "wooly123", role: "customer" }
  ];

  const DEFAULT_PRODUCTS = [
    { id: 1, name: "Nordic Cloud Bonnet", cat: "Knit Caps", price: 29, badge: "new", color: "#e8f2ff", rating: 4.9, reviews: 146, emoji: "CAP", stock: 34, desc: "Ultra-soft merino bonnet for newborn photos and daily warmth.", image: PRODUCT_IMAGES[0] },
    { id: 2, name: "Aurora Booties", cat: "Booties", price: 32, badge: "hot", color: "#fff0ea", rating: 4.8, reviews: 119, emoji: "BOT", stock: 41, desc: "Hand-stitched booties with breathable lining and anti-slip sole.", image: PRODUCT_IMAGES[1] },
    { id: 3, name: "Willow Bow Band", cat: "Headbands", price: 18, badge: "", color: "#f0f8f5", rating: 4.7, reviews: 93, emoji: "BOW", stock: 56, desc: "Stretchable and feather-light headband that does not mark skin.", image: PRODUCT_IMAGES[2] },
    { id: 4, name: "Story Gift Basket", cat: "Gift Sets", price: 72, badge: "save", color: "#eef4ff", rating: 5.0, reviews: 64, emoji: "SET", stock: 22, desc: "Curated wool set with bonnet, mittens, socks, and keepsake card.", image: PRODUCT_IMAGES[3] },
    { id: 5, name: "Snowdrift Mittens", cat: "Mittens", price: 21, badge: "new", color: "#f4f6ff", rating: 4.9, reviews: 80, emoji: "MIT", stock: 49, desc: "Lightweight merino mittens for sensitive baby skin.", image: PRODUCT_IMAGES[4] },
    { id: 6, name: "Pebble Knit Set", cat: "Gift Sets", price: 84, badge: "limited", color: "#fff5eb", rating: 4.8, reviews: 38, emoji: "KIT", stock: 18, desc: "2026 launch set in muted earth tones with premium gift wrap.", image: PRODUCT_IMAGES[5] },
    { id: 7, name: "Funkrafts Cap Pair", cat: "Knit Caps", price: 34, badge: "new", color: "#eef6ff", rating: 4.8, reviews: 57, emoji: "CAP", stock: 28, desc: "Bright twin-tone cap pair for everyday wear.", image: PRODUCT_IMAGES[6] },
    { id: 8, name: "Soft Stripe Sweater", cat: "Sweaters", price: 49, badge: "", color: "#fff1ea", rating: 4.7, reviews: 44, emoji: "SWT", stock: 17, desc: "Lightweight handmade sweater with gentle stretch.", image: PRODUCT_IMAGES[7] },
    { id: 9, name: "Cozy Day Romper", cat: "Rompers", price: 39, badge: "hot", color: "#ecfbf5", rating: 4.9, reviews: 69, emoji: "ROM", stock: 21, desc: "One-piece cozy romper for all-day comfort.", image: PRODUCT_IMAGES[8] },
    { id: 10, name: "Cloud Blue Combo", cat: "Gift Sets", price: 62, badge: "save", color: "#edf2ff", rating: 4.8, reviews: 33, emoji: "SET", stock: 15, desc: "Soft coordinated wool combo for gifting.", image: PRODUCT_IMAGES[9] },
    { id: 11, name: "Pink Spark Bundle", cat: "Gift Sets", price: 65, badge: "new", color: "#fff0f5", rating: 4.9, reviews: 27, emoji: "SET", stock: 14, desc: "Warm pink themed bundle with matching accessories.", image: PRODUCT_IMAGES[10] },
    { id: 12, name: "Winter Comfort Pair", cat: "Booties", price: 28, badge: "", color: "#eef5ff", rating: 4.8, reviews: 52, emoji: "BOT", stock: 31, desc: "Classic bootie pair for cold-weather walks.", image: PRODUCT_IMAGES[11] }
  ];

  const DEFAULT_HERO = {
    badge: "2026 atelier release",
    line1: "Designed for gentle beginnings",
    line2: "Naturally soft, proudly handmade",
    sub: "Breathable wool essentials crafted for newborn comfort and modern nursery style.",
    cta: "Shop the Collection",
    cta2: "See Story"
  };

  const DEFAULT_LANDING = {
    features: [
      { icon: "MW", title: "100% Merino Comfort", desc: "Every piece uses breathable fibers selected for newborn-safe softness and thermal balance." },
      { icon: "FX", title: "Faster Fulfillment", desc: "Smart stock routing keeps dispatch faster and more predictable for urgent gift moments." },
      { icon: "GF", title: "Gift-First Packaging", desc: "Each order includes premium wrap options and custom message cards for memorable unboxing." }
    ],
    featuresTitle: "Premium detail, quiet confidence, and motion that feels alive.",
    featuresSub: "Inspired by modern AI websites and luxury editorial brands, this experience blends clean white surfaces with kinetic depth and soft atmosphere.",
    stats: [
      { value: 4600, label: "Happy Families" },
      { value: 98, label: "Satisfaction %" },
      { value: 42, label: "Artisan Partners" }
    ],
    ticker: [
      "Handcrafted in small batches",
      "Hypoallergenic merino yarns",
      "Global shipping in 4-8 days",
      "4.9 average parent rating",
      "Personalized gift note on request"
    ],
    testimonials: [
      { quote: "The comfort is unreal. Our baby sleeps longer in the merino bonnet than any other cap we tried.", author: "Alyssa - Sydney" },
      { quote: "The motion and layout feel premium. It finally looks like a polished modern brand.", author: "Nia - Melbourne" },
      { quote: "Gift set quality is next-level. We now keep one ready for every baby shower.", author: "Eva - Brisbane" }
    ],
    testimonialsTitle: "What parents say after switching to Wooly Wonders",
    ctaTitle: "Join the launch circle",
    ctaSub: "Get early previews of new drops, limited bundles, and styling inspiration every week.",
    footer: "Crafted with heart for little beginnings."
  };

  function safeParse(raw, fallback) {
    try {
      const value = JSON.parse(raw);
      return value ?? fallback;
    } catch {
      return fallback;
    }
  }

  function ensure(key, fallback) {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(fallback));
    }
  }

  function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function read(key, fallback) {
    return safeParse(localStorage.getItem(key), fallback);
  }

  function normalizeProduct(product, index) {
    const base = DEFAULT_PRODUCTS[index % DEFAULT_PRODUCTS.length];
    const id = Number(product?.id ?? base.id ?? index + 1);
    const image = product?.image || PRODUCT_IMAGES[index % PRODUCT_IMAGES.length];

    return {
      ...base,
      ...product,
      id: Number.isFinite(id) ? id : index + 1,
      name: product?.name || base.name || `Wooly Product ${index + 1}`,
      cat: product?.cat || base.cat || "Knit Caps",
      price: Number(product?.price ?? base.price ?? 0),
      badge: product?.badge || "",
      color: product?.color || base.color || "#eef4ff",
      rating: Number(product?.rating ?? base.rating ?? 4.8),
      reviews: Number(product?.reviews ?? base.reviews ?? 0),
      emoji: product?.emoji || base.emoji || "W",
      stock: Number(product?.stock ?? base.stock ?? 0),
      desc: product?.desc || base.desc || "Hand-finished wool essential.",
      image
    };
  }

  function bootstrap() {
    ensure(KEYS.users, DEFAULT_USERS);
    ensure(KEYS.products, DEFAULT_PRODUCTS);
    ensure(KEYS.hero, DEFAULT_HERO);
    ensure(KEYS.orders, []);
    ensure(KEYS.landing, DEFAULT_LANDING);
  }

  function sanitizeUser(user) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }

  function getUsers() {
    return read(KEYS.users, DEFAULT_USERS);
  }

  function saveUsers(users) {
    save(KEYS.users, users);
  }

  function getProducts() {
    const raw = read(KEYS.products, DEFAULT_PRODUCTS);
    const source = Array.isArray(raw) && raw.length ? raw : DEFAULT_PRODUCTS;
    const normalized = source.map((product, index) => normalizeProduct(product, index));
    save(KEYS.products, normalized);
    return normalized;
  }

  function saveProducts(products) {
    const normalized = (products || []).map((product, index) => normalizeProduct(product, index));
    save(KEYS.products, normalized);
  }

  function getHero() {
    return read(KEYS.hero, DEFAULT_HERO);
  }

  function saveHero(hero) {
    save(KEYS.hero, {
      ...DEFAULT_HERO,
      ...hero
    });
  }

  function getLanding() {
    return read(KEYS.landing, DEFAULT_LANDING);
  }

  function saveLanding(data) {
    save(KEYS.landing, { ...DEFAULT_LANDING, ...data });
  }

  function getOrders() {
    return read(KEYS.orders, []);
  }

  function saveOrders(orders) {
    save(KEYS.orders, orders);
  }

  function addOrder(orderPayload) {
    const orders = getOrders();
    const entry = {
      id: `WW-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      ...orderPayload
    };
    orders.unshift(entry);
    saveOrders(orders);
    return entry;
  }

  function setSession(user) {
    sessionStorage.setItem(KEYS.session, JSON.stringify(sanitizeUser(user)));
  }

  function getSession() {
    return safeParse(sessionStorage.getItem(KEYS.session), null);
  }

  function clearSession() {
    sessionStorage.removeItem(KEYS.session);
  }

  function login(email, password) {
    const users = getUsers();
    const normalized = email.trim().toLowerCase();
    const user = users.find((u) => u.email.toLowerCase() === normalized);

    if (!user) {
      return { ok: false, message: "No account found with that email." };
    }

    if (user.password !== password) {
      return { ok: false, message: "Incorrect password. Please try again." };
    }

    setSession(user);
    return { ok: true, user: sanitizeUser(user) };
  }

  function register(payload) {
    const users = getUsers();
    const email = payload.email.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === email)) {
      return { ok: false, message: "This email is already registered." };
    }

    const nextId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const newUser = {
      id: nextId,
      name: payload.name.trim(),
      email,
      password: payload.password,
      role: "customer"
    };

    users.push(newUser);
    saveUsers(users);
    setSession(newUser);
    return { ok: true, user: sanitizeUser(newUser) };
  }

  bootstrap();

  window.WWData = {
    KEYS,
    PRODUCT_IMAGES,
    DEFAULT_PRODUCTS,
    DEFAULT_HERO,
    DEFAULT_LANDING,
    getUsers,
    saveUsers,
    getProducts,
    saveProducts,
    getHero,
    saveHero,
    getLanding,
    saveLanding,
    getOrders,
    saveOrders,
    addOrder,
    setSession,
    getSession,
    clearSession,
    login,
    register
  };
})();
