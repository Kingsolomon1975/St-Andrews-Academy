const loginForm = document.getElementById("login-form");
const errorMsg = document.getElementById("error-msg");

// Simulated username and password
const USER = "admin";
const PASS = "1234";

loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === USER && password === PASS) {
    // Redirect to the main app
    window.location.href = "index.html";
  } else {
    errorMsg.textContent = "❌ Invalid username or password";
  }
});
const savedPassword = localStorage.getItem("password") || "school123";
if (username === "admin" && password === savedPassword) {
  // success
}
