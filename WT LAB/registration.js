// Registration & Login Form Validation Script

const form = document.getElementById("registrationForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

const usernameError = document.getElementById("usernameError");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");
const successMessage = document.getElementById("successMessage");

const loginModeBtn = document.getElementById("loginMode");
const registerModeBtn = document.getElementById("registerMode");
const submitBtn = document.getElementById("submitBtn");
const confirmPasswordGroup = document.getElementById("confirmPasswordGroup");
const usernameGroup = document.getElementById("usernameGroup");
const passwordInfo = document.getElementById("passwordInfo");

let currentMode = "login"; // 'login' or 'register'

// Initialize stored accounts (default demo account)
function initializeAccounts() {
  if (!localStorage.getItem("bookstoreAccounts")) {
    const defaultAccounts = {
      demouser: "Demo@123456",
    };
    localStorage.setItem("bookstoreAccounts", JSON.stringify(defaultAccounts));
  }
}

// Validation functions
function validateUsername() {
  const username = usernameInput.value.trim();
  let isValid = true;
  let errorMessage = "";

  if (username === "") {
    errorMessage = "Username is required";
    isValid = false;
  } else if (username.length < 5) {
    errorMessage = "Username must be at least 5 characters long";
    isValid = false;
  }

  // Update UI
  if (isValid) {
    usernameInput.classList.remove("invalid");
    usernameInput.classList.add("valid");
    usernameError.classList.remove("show");
  } else {
    usernameInput.classList.add("invalid");
    usernameInput.classList.remove("valid");
    usernameError.textContent = errorMessage;
    usernameError.classList.add("show");
  }

  return isValid;
}

function validatePassword() {
  const password = passwordInput.value;
  let isValid = true;
  let errorMessage = "";

  if (password === "") {
    errorMessage = "Password is required";
    isValid = false;
  } else if (password.length < 8) {
    errorMessage = "Password must be at least 8 characters long";
    isValid = false;
  }

  // Update UI
  if (isValid) {
    passwordInput.classList.remove("invalid");
    passwordInput.classList.add("valid");
    passwordError.classList.remove("show");
  } else {
    passwordInput.classList.add("invalid");
    passwordInput.classList.remove("valid");
    passwordError.textContent = errorMessage;
    passwordError.classList.add("show");
  }

  return isValid;
}

function validateConfirmPassword() {
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;
  let isValid = true;
  let errorMessage = "";

  if (confirmPassword === "") {
    errorMessage = "Please confirm your password";
    isValid = false;
  } else if (password !== confirmPassword) {
    errorMessage = "Passwords do not match";
    isValid = false;
  }

  // Update UI
  if (isValid) {
    confirmPasswordInput.classList.remove("invalid");
    confirmPasswordInput.classList.add("valid");
    confirmPasswordError.classList.remove("show");
  } else {
    confirmPasswordInput.classList.add("invalid");
    confirmPasswordInput.classList.remove("valid");
    confirmPasswordError.textContent = errorMessage;
    confirmPasswordError.classList.add("show");
  }

  return isValid;
}

// Mode toggle functions
function switchToLoginMode() {
  currentMode = "login";
  loginModeBtn.classList.add("active");
  registerModeBtn.classList.remove("active");
  confirmPasswordGroup.classList.add("hidden");
  usernameGroup.classList.remove("hidden");
  passwordInfo.textContent = "Minimum 8 characters";
  submitBtn.textContent = "Login to Bookstore";
  form.reset();
  clearAllErrors();
}

function switchToRegisterMode() {
  currentMode = "register";
  registerModeBtn.classList.add("active");
  loginModeBtn.classList.remove("active");
  confirmPasswordGroup.classList.remove("hidden");
  usernameGroup.classList.remove("hidden");
  passwordInfo.textContent = "Must be at least 8 characters";
  submitBtn.textContent = "Create Account";
  form.reset();
  clearAllErrors();
}

function clearAllErrors() {
  usernameInput.classList.remove("valid", "invalid");
  passwordInput.classList.remove("valid", "invalid");
  confirmPasswordInput.classList.remove("valid", "invalid");
  usernameError.classList.remove("show");
  passwordError.classList.remove("show");
  confirmPasswordError.classList.remove("show");
  successMessage.classList.remove("show");
}

// Real-time validation on input
usernameInput.addEventListener("blur", validateUsername);
usernameInput.addEventListener("input", validateUsername);

passwordInput.addEventListener("blur", validatePassword);
passwordInput.addEventListener("input", validatePassword);

confirmPasswordInput.addEventListener("blur", validateConfirmPassword);
confirmPasswordInput.addEventListener("input", validateConfirmPassword);

// Mode toggle listeners
loginModeBtn.addEventListener("click", switchToLoginMode);
registerModeBtn.addEventListener("click", switchToRegisterMode);

// Form submission
form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (currentMode === "login") {
    handleLogin();
  } else {
    handleRegister();
  }
});

function handleLogin() {
  const isUsernameValid = validateUsername();
  const isPasswordValid = validatePassword();

  if (isUsernameValid && isPasswordValid) {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const accounts = JSON.parse(localStorage.getItem("bookstoreAccounts"));

    if (accounts[username] && accounts[username] === password) {
      // Credentials match - save session and redirect
      localStorage.setItem("currentUser", username);
      successMessage.textContent =
        "✓ Login successful! Redirecting to bookstore...";
      successMessage.classList.add("show");

      // Redirect to bookstore after 1 second
      setTimeout(() => {
        window.location.href = "bookstore.html";
      }, 1000);
    } else {
      // Invalid credentials
      usernameError.textContent = "Invalid username or password";
      usernameError.classList.add("show");
      usernameInput.classList.add("invalid");
      usernameInput.classList.remove("valid");
    }
  }
}

function handleRegister() {
  const isUsernameValid = validateUsername();
  const isPasswordValid = validatePassword();
  const isConfirmPasswordValid = validateConfirmPassword();

  if (isUsernameValid && isPasswordValid && isConfirmPasswordValid) {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const accounts = JSON.parse(localStorage.getItem("bookstoreAccounts"));

    if (accounts[username]) {
      // Username already exists
      usernameError.textContent = "Username already exists";
      usernameError.classList.add("show");
      usernameInput.classList.add("invalid");
      usernameInput.classList.remove("valid");
    } else {
      // Save new account
      accounts[username] = password;
      localStorage.setItem("bookstoreAccounts", JSON.stringify(accounts));
      localStorage.setItem("currentUser", username);

      // Show success message
      usernameError.classList.remove("show");
      passwordError.classList.remove("show");
      confirmPasswordError.classList.remove("show");

      successMessage.textContent =
        "✓ Account created successfully! Redirecting to bookstore...";
      successMessage.classList.add("show");

      // Redirect to bookstore after 1.5 seconds
      setTimeout(() => {
        window.location.href = "bookstore.html";
      }, 1500);
    }
  }
}

// Initialize on page load
window.addEventListener("DOMContentLoaded", initializeAccounts);
