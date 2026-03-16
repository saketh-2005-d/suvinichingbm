// Forgot Password Form Validation Script

const form = document.getElementById("forgotPasswordForm");
const emailInput = document.getElementById("email");
const emailError = document.getElementById("emailError");
const emailInfo = document.getElementById("emailInfo");
const successMessage = document.getElementById("successMessage");

// Mock database of registered email addresses
// In a real application, this would be verified against an actual database
const registeredEmails = [
  "john@example.com",
  "jane.doe@example.com",
  "user123@gmail.com",
  "admin@bookstore.com",
  "customer@email.com",
  "test@test.com",
];

// Email validation regex pattern
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validation functions
function validateEmail() {
  const email = emailInput.value.trim();
  let isValid = true;
  let errorMessage = "";
  let infoMessage = "";

  // Check if email is empty
  if (email === "") {
    errorMessage = "Email address is required";
    isValid = false;
  }
  // Check if email format is valid
  else if (!emailRegex.test(email)) {
    errorMessage =
      "Please enter a valid email address (e.g., user@example.com)";
    isValid = false;
  }
  // Check if email is registered in the system
  else if (!isEmailRegistered(email)) {
    errorMessage = "No account found with this email address";
    isValid = false;
  } else {
    infoMessage = "Email verified. Reset link will be sent to this address.";
  }

  // Update UI
  if (isValid) {
    emailInput.classList.remove("invalid");
    emailInput.classList.add("valid");
    emailError.classList.remove("show");
    emailInfo.textContent = infoMessage;
    emailInfo.classList.add("show");
  } else {
    emailInput.classList.add("invalid");
    emailInput.classList.remove("valid");
    emailError.textContent = errorMessage;
    emailError.classList.add("show");
    emailInfo.classList.remove("show");
  }

  return isValid;
}

// Check if email is registered in the system
function isEmailRegistered(email) {
  return registeredEmails.some(
    (registeredEmail) => registeredEmail.toLowerCase() === email.toLowerCase(),
  );
}

// Real-time validation on input
emailInput.addEventListener("blur", validateEmail);
emailInput.addEventListener("input", validateEmail);

// Form submission
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Validate email
  const isEmailValid = validateEmail();

  // If valid, show success message
  if (isEmailValid) {
    // Hide error messages
    emailError.classList.remove("show");
    emailInfo.classList.remove("show");

    // Show success message
    successMessage.classList.add("show");

    // Log the request (in real app, send to server)
    console.log("Password Reset Request:", {
      email: emailInput.value,
      timestamp: new Date().toISOString(),
    });

    // Reset form after 3 seconds
    setTimeout(() => {
      form.reset();
      emailInput.classList.remove("valid");
      successMessage.classList.remove("show");
    }, 3000);
  }
});
