alert('Welcome ,This is E-Commerce Store which is made by Tuhinsh Sharma S/O of P.K. Sharma ----(K.P.B) ');
console.log('Thanks to Loard Krishna for Every thing');

(async function () {
  // ======================= ELEMENTS =======================
  const productList = document.getElementById('product-list');
  const cartCountElem = document.getElementById('cart-count');
  const userGreeting = document.getElementById('user-greeting');
  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');
  const logoutLink = document.getElementById('logout-link');
  const adminLink = document.getElementById('admin-link');
  const searchInput = document.getElementById('search-input');
  const showDetailsBtn = document.getElementById('show-details-btn');
  const userDetailsContainer = document.getElementById('user-details');
  const userNameElem = document.getElementById('user-name');
  const userEmailElem = document.getElementById('user-email');
  const userRoleElem = document.getElementById('user-role');

  // ======================= LOCAL STORAGE =======================
  const userToken = localStorage.getItem('userToken');
  const adminToken = localStorage.getItem('adminToken');
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // ======================= ADMIN REDIRECT =======================
  if (adminToken && window.location.pathname !== '/admin/dashboard.html') {
    window.location.replace('admin/dashboard.html');
    return;
  }

  // ======================= CART =======================
  function updateCartCount() {
    if (cartCountElem) cartCountElem.textContent = cart.length;
  }
  updateCartCount();

  // ======================= SHOW USER LINKS & GREETING =======================
  async function loadUser() {
    if (!userToken) return;

    if (loginLink) loginLink.style.display = 'none';
    if (registerLink) registerLink.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'inline';

    if (showDetailsBtn) showDetailsBtn.style.display = 'inline';

    try {
      const res = await fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      const user = await res.json();
      if (userGreeting) userGreeting.textContent = `Hello, ${user.name}`;
      if (user.isAdmin && adminLink) adminLink.style.display = 'inline';
    } catch (err) {
      console.error('Failed to fetch user:', err);
    }
  }
  loadUser();

  // ======================= SHOW USER DETAILS =======================
  async function loadUserDetails() {
    if (!userToken) {
      alert("Please login first.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${userToken}` }
      });

      if (!res.ok) throw new Error("Failed to fetch user details");

      const user = await res.json();
      userNameElem.textContent = user.name;
      userEmailElem.textContent = user.email;
      userRoleElem.textContent = user.isAdmin ? "Admin" : "User";
      userDetailsContainer.style.display = "block";
    } catch (err) {
      console.error(err);
      alert("Could not load user details");
    }
  }

  if (showDetailsBtn) {
    showDetailsBtn.addEventListener('click', loadUserDetails);
  }

  // ======================= LOGOUT =======================
  if (logoutLink) {
    logoutLink.addEventListener('click', () => {
      localStorage.removeItem('userToken');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('cart');
      window.location.reload();
    });
  }

  // ======================= FETCH PRODUCTS =======================
  async function fetchProducts() {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      const products = await res.json();
      displayProducts(products);
    } catch (err) {
      console.error(err);
      if (productList) productList.innerHTML = '<p>Failed to load products</p>';
    }
  }

  // ======================= DISPLAY PRODUCTS =======================
  function displayProducts(products) {
    if (!productList) return;
    productList.innerHTML = '';

    products.forEach((prod) => {
      const imgSrc = prod.image || '/assets/images/placeholder.png';
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${imgSrc}" alt="${prod.name}" />
        <h3>${prod.name}</h3>
        <p>Price: ₹${prod.price}</p>
        <a class="view-product-btn" href="description.html?id=${prod._id}">
    View Product
  </a>
        <button>Add to Cart</button>
      `;

      // Add to cart
      card.querySelector('button').addEventListener('click', () => {
        if (!userToken) {
          alert('Please login first');
          return;
        }
        cart.push(prod);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert(`${prod.name} added to cart`);
      });

      productList.appendChild(card);
    });
  }

  // ======================= SEARCH =======================
  if (searchInput && productList) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      Array.from(productList.children).forEach((product) => {
        const nameEl = product.querySelector('h3');
        if (!nameEl) return;
        product.style.display = nameEl.textContent.toLowerCase().includes(query)
          ? ''
          : 'none';
      });
    });
  }

  // ======================= INITIALIZE =======================
  fetchProducts();
})();
