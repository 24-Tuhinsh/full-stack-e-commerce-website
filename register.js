const form = document.getElementById('register-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try{
    const res = await fetch('http://localhost:5000/api/auth/register', { // ✅ Full backend URL
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if(res.ok){
      alert('Registration successful. Please login.');
      window.location.href = 'login.html';
    } else {
      alert(data.message || 'Registration failed');
    }
  } catch(err){
    console.error(err);
    alert('Server error');
  }
});
