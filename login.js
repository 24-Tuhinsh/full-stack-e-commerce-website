const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!email || !password) {
    alert('All fields are required');
    return;
  }

  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Login failed');
      return;
    }

    // ===== STORE TOKEN AND REDIRECT BASED ON ROLE =====
    if (data.user.isAdmin) {
      localStorage.setItem('adminToken', data.token);
      localStorage.removeItem('userToken'); // ensure no user token
      alert('You are an Admin! Redirecting to Admin Dashboard...');
      window.location.href = 'admin/dashboard.html'; // admin page
    } else {
      localStorage.setItem('userToken', data.token);
      localStorage.removeItem('adminToken'); // ensure no admin token
      alert('You are a User! Redirecting to Home page...');
      window.location.href = 'index.html'; // user page
    }

  } catch (err) {
    console.error(err);
    alert('Server error');
  }
});
