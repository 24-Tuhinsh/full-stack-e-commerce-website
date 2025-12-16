

const cartItems = document.getElementById('cart-items');
const checkoutBtn = document.getElementById('checkout-btn');
const totalPriceEl = document.getElementById('total-price');
const addressInput = document.getElementById('address');
const phoneInput = document.getElementById('phone');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
const token = localStorage.getItem('userToken');

// ✅ Display cart items
function displayCart() {
  cartItems.innerHTML = '';
  cart.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${item.name}</td>
      <td>$${item.price}</td>
      <td><button onclick="removeItem(${index})">Remove</button></td>
    `;
    cartItems.appendChild(tr);
  });

  updateTotal();
}

// ✅ Remove item
function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCart();
}

// ✅ Calculate total price (industry standard)
function updateTotal() {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  totalPriceEl.innerText = total;
  return total;
}

// ✅ Checkout
checkoutBtn.addEventListener('click', async () => {
  if (!token) {
    alert('Login first to checkout');
    return;
  }

  if (cart.length === 0) {
    alert('Cart is empty');
    return;
  }

  const address = addressInput.value.trim();
  const phone = phoneInput.value.trim();

  if (!address || !phone) {
    alert('Address and phone number are required');
    return;
  }

  try {
    console.log({
      items: cart,
      address,
      phone,
      totalPrice: updateTotal()
    });

    const res = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        items: cart,
        address,
        phone,
        totalPrice: updateTotal()
      })
    });

    const data = await res.json();

    if (res.ok) {
      alert('Order placed successfully');
      cart = [];
      localStorage.setItem('cart', '[]');
      displayCart();
      addressInput.value = '';
      phoneInput.value = '';
    } else {
      alert(data.message || 'Checkout failed');
    }
  } catch (err) {
    console.error(err);
    alert('Server error');
  }
});

displayCart();
