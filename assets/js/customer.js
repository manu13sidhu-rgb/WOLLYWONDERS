document.addEventListener("DOMContentLoaded", () => {
  WWUI.initBase();

  const session = WWUI.guardSession(["customer"]);
  if (!session) {
    return;
  }

  const orders = WWData.getOrders().filter((order) => {
    return (order.customerEmail || "").toLowerCase() === session.email.toLowerCase();
  });

  const fullNameEl = WWUI.qs("#customerName");
  const emailEl = WWUI.qs("#customerEmail");
  const avatarEl = WWUI.qs("#avatarInitials");

  if (fullNameEl) fullNameEl.textContent = session.name;
  if (emailEl) emailEl.textContent = session.email;
  if (avatarEl) avatarEl.textContent = WWUI.initials(session.name);

  const statOrders = WWUI.qs("#statOrders");
  const statSpend = WWUI.qs("#statSpend");
  const statLast = WWUI.qs("#statLast");

  const totalSpend = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const lastDate = orders[0]?.createdAt;

  if (statOrders) statOrders.textContent = String(orders.length);
  if (statSpend) statSpend.textContent = WWUI.currency(totalSpend);
  if (statLast) statLast.textContent = lastDate ? WWUI.formatDate(lastDate) : "No orders yet";

  const orderList = WWUI.qs("#ordersList");
  if (orderList) {
    orderList.innerHTML = "";

    if (!orders.length) {
      const empty = document.createElement("div");
      empty.className = "panel";
      empty.style.padding = "18px";
      empty.innerHTML = "<strong>No orders yet.</strong><p class='mini' style='margin-top:8px;'>Browse the latest collection and place your first order.</p>";
      orderList.appendChild(empty);
    } else {
      orders.slice(0, 8).forEach((order) => {
        const card = document.createElement("article");
        card.className = "order-card reveal";
        card.innerHTML = `
          <strong>${order.id}</strong>
          <div class="order-meta">
            <span>${WWUI.formatDate(order.createdAt)}</span>
            <span>${order.qty || 0} items</span>
            <span>${order.status || "Paid"}</span>
          </div>
          <p class="mini">${order.items.map((item) => `${item.name} x ${item.qty}`).join("  -  ")}</p>
          <strong>${WWUI.currency(order.total)}</strong>
        `;
        orderList.appendChild(card);
      });
    }
  }

  const profileForm = WWUI.qs("#profileForm");
  profileForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    WWUI.showToast("Profile notes saved locally for this session.");
  });
});


