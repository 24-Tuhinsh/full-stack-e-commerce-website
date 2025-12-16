const ordersList = document.getElementById('orders-list');
const token = localStorage.getItem('userToken');

// Calculate total if backend didn't send it
function calculateTotal(items = []) {
  return items.reduce((sum, item) => sum + (item.price || 0), 0);
}

// Cancel order
async function cancelOrder(orderId) {
  if (!confirm("Are you sure you want to cancel this order?")) return;

  try {
    const res = await fetch(`http://localhost:5000/api/orders/${orderId}/cancel`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    if (res.ok) {
      alert("Order cancelled successfully");
      fetchOrders(); // refresh list
    } else {
      alert(data.message || "Failed to cancel order");
    }
  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

// Fetch orders
async function fetchOrders() {
  if (!token) {
    ordersList.innerHTML = '<tr><td colspan="7">Please login to see orders</td></tr>';
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/orders', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const orders = await res.json();

    if (res.ok) {
      ordersList.innerHTML = '';

      if (orders.length === 0) {
        ordersList.innerHTML = '<tr><td colspan="7">No orders found</td></tr>';
        return;
      }

      orders.forEach(order => {
        const total = order.totalPrice || order.total || calculateTotal(order.items);

        // Show cancel button only if order is not cancelled
        let actionHTML = "—";
        if (order.status !== "Cancelled") {
          actionHTML = `
            <button
              style="
                padding:6px 10px;
                border:1px solid red;
                background:#fff;
                color:red;
                cursor:pointer;
              "
              onclick="cancelOrder('${order._id}')"
            >
              Cancel
            </button>
          `;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${order._id}</td>
          <td>${order.items.map(i => i.name).join(', ')}</td>
          <td>$${total}</td>
          <td>${order.address || 'N/A'}</td>
          <td>${order.phone || 'N/A'}</td>
          <td>${order.status}</td>
          <td>${actionHTML}</td>
        `;
        ordersList.appendChild(tr);
      });
    } else {
      ordersList.innerHTML = '<tr><td colspan="7">Failed to fetch orders</td></tr>';
    }
  } catch (err) {
    console.error(err);
    ordersList.innerHTML = '<tr><td colspan="7">Server error</td></tr>';
  }
}

fetchOrders();
