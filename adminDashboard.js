// ===== AUTH CHECK =====
const token = localStorage.getItem('adminToken');
if (!token) window.location.href = '../login.html';

const productList = document.getElementById('product-list');
const form = document.getElementById('add-product-form');
const logoutBtn = document.getElementById('logout-btn');

// ===== LOGOUT =====
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('adminToken');
  window.location.href = '../login.html';
});

// ===== FETCH PRODUCTS =====
async function fetchProducts() {
  try {
    const res = await fetch('http://localhost:5000/api/admin/products', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Failed to fetch products');

    const products = await res.json();
    productList.innerHTML = '';

    products.forEach(prod => {
      const tr = document.createElement('tr');
      const imgSrc = prod.image || 'https://via.placeholder.com/50';

      // ✅ Include Description column
      tr.innerHTML = `
        <td>${prod.name}</td>
        <td>₹${prod.price}</td>
        <td>${prod.description || 'No description provided'}</td>
        <td><img src="${imgSrc}" width="50"/></td>
        <td></td>
      `;

      // Action buttons
      const tdActions = tr.querySelector('td:last-child');

      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', () => editProduct(prod));

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => deleteProduct(prod._id));

      tdActions.appendChild(editBtn);
      tdActions.appendChild(deleteBtn);

      productList.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    productList.innerHTML =
      '<tr><td colspan="5">Failed to load products</td></tr>';
  }
}

// ===== ADD PRODUCT =====
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const price = parseFloat(document.getElementById('price').value);
  const image = document.getElementById('image').value.trim();
  const description = document.getElementById('description').value.trim();

  if (!name || !price || !image || !description) {
    alert('All fields are required');
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, price, image, description })
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || 'Failed to add product');
      return;
    }

    alert('Product added successfully');
    form.reset();
    fetchProducts();
  } catch (err) {
    console.error(err);
    alert('Server error');
  }
});

// ===== DELETE PRODUCT =====
async function deleteProduct(id) {
  if (!id) return;
  if (!confirm('Are you sure you want to delete this product?')) return;

  try {
    const res = await fetch(
      `http://localhost:5000/api/admin/products/${id}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || 'Delete failed');
      return;
    }

    alert('Product deleted successfully');
    fetchProducts();
  } catch (err) {
    console.error(err);
    alert('Server error');
  }
}

// ===== EDIT PRODUCT =====
async function editProduct(prod) {
  const name = prompt('Edit product name:', prod.name);
  if (name === null) return;

  const priceStr = prompt('Edit price:', prod.price);
  if (priceStr === null) return;
  const price = parseFloat(priceStr);

  const image = prompt('Edit image URL:', prod.image);
  if (image === null) return;

  const description = prompt(
    'Edit description:',
    prod.description || ''
  );
  if (description === null) return;

  try {
    const res = await fetch(
      `http://localhost:5000/api/admin/products/${prod._id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, price, image, description })
      }
    );

    const data = await res.json();
    if (!res.ok) {
      alert(data.message || 'Update failed');
      return;
    }

    alert('Product updated successfully');
    fetchProducts();
  } catch (err) {
    console.error(err);
    alert('Server error');
  }
}

// ===== INITIAL LOAD =====
fetchProducts();
// ===== SEARCH PRODUCTS =====
const searchInput = document.getElementById('search-input');

searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const rows = productList.querySelectorAll('tr');

  rows.forEach(row => {
    const name = row.cells[0].textContent.toLowerCase();
    const description = row.cells[3].textContent.toLowerCase();

    if (name.includes(query) || description.includes(query)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
});

