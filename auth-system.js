document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const authBtn = document.getElementById("authBtn");
  const switchLink = document.getElementById("switchLink");
  const formTitle = document.getElementById("form-title");
  const switchText = document.getElementById("switchText");

  let mode = "signup";

  switchLink.addEventListener("click", () => {
    if (mode === "signup") {
      mode = "login";
      formTitle.textContent = "Login to Account";
      nameInput.style.display = "none";
      authBtn.textContent = "Login";
      switchText.innerHTML = `Don't have an account? <a href="#" id="switchLink">Sign up</a>`;
    } else {
      mode = "signup";
      formTitle.textContent = "Create Account";
      nameInput.style.display = "block";
      authBtn.textContent = "Sign Up";
      switchText.innerHTML = `Already have an account? <a href="#" id="switchLink">Login here</a>`;
    }
  });

  authBtn.addEventListener("click", () => {
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value.trim();
    if (!email || !password) { alert("Please fill in all required fields."); return; }
    let users = JSON.parse(localStorage.getItem("users") || "{}");

    if (mode === "signup") {
      if (users[email]) { alert("Email already registered. Please login."); return; }
      const name = nameInput.value.trim();
      if (!name) { alert("Please enter your full name."); return; }
      users[email] = { name, password, usage: 0, upgraded: false };
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", email);
      alert("Account created successfully!");
      window.location.href = "88-resume.html";
    } else {
      if (!users[email] || users[email].password !== password) { alert("Invalid login credentials."); return; }
      localStorage.setItem("currentUser", email);
      alert("Welcome back!");
      window.location.href = "88-resume.html";
    }
  });
});
