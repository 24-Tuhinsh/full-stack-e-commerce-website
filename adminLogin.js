// ===== AUTH CHECK (UNCHANGED LOGIC) =====
const token = localStorage.getItem('adminToken');
if (!token) {
  window.location.href = 'login.html';
}

const productList = document.getElementById('product-list');
const form = document.getElementById('add-product-form');
const logoutBtn = document.getElementById('logout-btn');

// ===== LOGOUT (UNCHANGED) =====
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('adminToken');
  window.location.href = 'login.html';
});

// ===== FETCH PRODUCTS (UPDATED: action buttons added) =====
async function fetchProducts() {
  try {
    const res = await fetch('http://localhost:5000/api/admin/products', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const products = await res.json();
    productList.innerHTML = '';

    products.forEach(prod => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${prod.name}</td>
        <td>$${prod.price}</td>
        <td><img src="${prod.image}" width="50" /></td>
        <td>
          <button onclick="editProduct('${prod._id}', '${prod.name}', '${prod.price}', '${prod.image}')">Edit</button>
          <button onclick="deleteProduct('${prod._id}')">Delete</button>
        </td>
      `;
      productList.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    productList.innerHTML =
      '<tr><td colspan="4">Failed to load products</td></tr>';
  }
}

// ===== ADD PRODUCT (UNCHANGED) =====
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const price = document.getElementById('price').value;
  const image = document.getElementById('image').value;

  try {
    const res = await fetch('http://localhost:5000/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, price, image })
    });

    const data = await res.json();

    if (res.ok) {
      alert('Product added');
      form.reset();
      fetchProducts();
    } else {
      alert(data.message || 'Failed to add product');
    }
  } catch (err) {
    console.error(err);
    alert('Server error');
  }
});

// ===== DELETE PRODUCT (NEW) =====
async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;

  try {
    const res = await fetch(
      `http://localhost:5000/api/admin/products/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Delete failed');
      return;
    }

    alert('Product deleted');
    fetchProducts();
  } catch (err) {
    console.error(err);
    alert('Server error');
  }
}

// ===== EDIT PRODUCT (NEW) =====
function editProduct(id, name, price, image) {
  const newName = prompt('Edit product name:', name);
  if (newName === null) return;

  const newPrice = prompt('Edit price:', price);
  if (newPrice === null) return;

  const newImage = prompt('Edit image URL:', image);
  if (newImage === null) return;

  updateProduct(id, newName, newPrice, newImage);
}

// ===== UPDATE PRODUCT API (NEW) =====
async function updateProduct(id, name, price, image) {
  try {
    const res = await fetch(
      `http://localhost:5000/api/admin/products/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, price, image })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Update failed');
      return;
    }

    alert('Product updated');
    fetchProducts();
  } catch (err) {
    console.error(err);
    alert('Server error');
  }
}

fetchProducts();
