document.addEventListener("DOMContentLoaded", () => {
  WWUI.initBase();

  const session = WWUI.guardSession(["admin"]);
  if (!session) {
    return;
  }

  const products = WWData.getProducts();
  const orders = WWData.getOrders();
  const hero = WWData.getHero();

  const productCount = products.length;
  const orderCount = orders.length;
  const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const customers = new Set(orders.map((order) => (order.customerEmail || "").toLowerCase())).size;

  const avgOrder = orderCount ? revenue / orderCount : 0;

  const mappings = [
    ["#dashProducts", productCount],
    ["#dashOrders", orderCount],
    ["#dashCustomers", customers],
    ["#dashRevenue", WWUI.currency(revenue)],
    ["#dashAvgOrder", WWUI.currency(avgOrder)]
  ];

  mappings.forEach(([selector, value]) => {
    const node = WWUI.qs(selector);
    if (node) node.textContent = String(value);
  });

  const heroPreview = WWUI.qs("#heroPreview");
  if (heroPreview) {
    heroPreview.innerHTML = `
      <div class="badge">${hero.badge}</div>
      <h3 style="margin-top:12px;font-family:var(--font-display);font-size:1.9rem;line-height:1.1;">${hero.line1}<br>${hero.line2}</h3>
      <p style="margin-top:10px;color:#5f7196;line-height:1.65;">${hero.sub}</p>
      <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap;">
        <span class="chip is-active">${hero.cta}</span>
        <span class="chip">${hero.cta2}</span>
      </div>
    `;
  }

  const chart = WWUI.qs("#trendChart");
  if (chart) {
    chart.innerHTML = "";

    const daily = {};
    const now = new Date();

    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      daily[key] = 0;
    }

    orders.forEach((order) => {
      const key = (order.createdAt || "").slice(0, 10);
      if (key in daily) {
        daily[key] += Number(order.total || 0);
      }
    });

    const values = Object.values(daily);
    const max = Math.max(1, ...values);
    Object.entries(daily).forEach(([key, value]) => {
      const bar = document.createElement("div");
      bar.className = "chart-bar";
      bar.dataset.label = new Date(key).toLocaleDateString(undefined, { weekday: "short" });
      bar.style.height = `${Math.max(14, (value / max) * 120)}px`;
      bar.title = `${key}: ${WWUI.currency(value)}`;
      chart.appendChild(bar);
    });
  }

  const line = WWUI.qs("#insightLine");
  if (line) {
    if (!orders.length) {
      line.textContent = "No orders yet. Launch a campaign and track conversions here.";
    } else {
      const topCategory = products
        .map((product) => ({
          cat: product.cat,
          value: Number(product.price || 0) * Number(product.stock || 0)
        }))
        .sort((a, b) => b.value - a.value)[0]?.cat || "Knit Caps";
      line.textContent = `Top inventory value category: ${topCategory}. Avg order is ${WWUI.currency(avgOrder)} this week.`;
    }
  }
});
