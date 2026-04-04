// API Configuration
// Automatically uses the current domain in production (Vercel) and local dev.
const ORIGIN_BASE = window.location.origin;
const API_BASE = `${ORIGIN_BASE}/api`;
const IMAGE_BASE = ORIGIN_BASE;

// Admin Credentials
const ADMIN_CREDENTIALS = {
  username: "suvini.clothing@gmail.com",
  password: "surekhasravan",
};

let allClothes = [];
let filteredClothes = [];
let currentEditingClothId = null;
let loggedInUser = null;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  // Check if admin has an existing session in localStorage
  const savedSession = localStorage.getItem("adminSession");

  if (savedSession) {
    try {
      const session = JSON.parse(savedSession);
      if (session.username && session.loggedInAt) {
        // Valid session exists - show admin panel
        loggedInUser = session.username;
        // Store in sessionStorage as well for backup
        sessionStorage.setItem("adminSession", JSON.stringify(session));
        console.log(
          "✅ Existing session found - Showing admin panel for:",
          loggedInUser,
        );

        // Hide login, show admin
        const loginPage = document.getElementById("loginPage");
        const adminPanel = document.getElementById("adminPanel");
        if (loginPage) loginPage.style.cssText = "display: none !important;";
        if (adminPanel) adminPanel.style.cssText = "display: flex !important;";

        // Update username display
        const adminUsernameEl = document.getElementById("adminUsername");
        if (adminUsernameEl) {
          adminUsernameEl.textContent = `👤 ${loggedInUser}`;
        }

        // Load admin data
        loadClothes().catch((err) =>
          console.error("Error loading clothes:", err),
        );
        loadWishlistCount().catch((err) =>
          console.error("Error loading wishlist:", err),
        );
        checkBackendStatus().catch((err) =>
          console.error("Error checking backend:", err),
        );

        return; // Exit early - don't show login page
      }
    } catch (err) {
      console.log("Invalid session in localStorage, checking sessionStorage");
      // Try sessionStorage as backup
      const sessionStorageSession = sessionStorage.getItem("adminSession");
      if (sessionStorageSession) {
        try {
          const session = JSON.parse(sessionStorageSession);
          if (session.username) {
            // Found session in sessionStorage - restore to localStorage
            localStorage.setItem("adminSession", JSON.stringify(session));
            loggedInUser = session.username;
            console.log("✅ Session restored from sessionStorage");

            // Hide login, show admin
            const loginPage = document.getElementById("loginPage");
            const adminPanel = document.getElementById("adminPanel");
            if (loginPage)
              loginPage.style.cssText = "display: none !important;";
            if (adminPanel)
              adminPanel.style.cssText = "display: flex !important;";

            // Update username display
            const adminUsernameEl = document.getElementById("adminUsername");
            if (adminUsernameEl) {
              adminUsernameEl.textContent = `👤 ${loggedInUser}`;
            }

            // Load admin data
            loadClothes().catch((err) =>
              console.error("Error loading clothes:", err),
            );
            loadWishlistCount().catch((err) =>
              console.error("Error loading wishlist:", err),
            );
            checkBackendStatus().catch((err) =>
              console.error("Error checking backend:", err),
            );

            return;
          }
        } catch (err2) {
          console.log("Invalid session in sessionStorage");
          sessionStorage.removeItem("adminSession");
        }
      }
    }
  }

  // No valid session - show login page
  console.log("No valid session - Showing login page");
  const usernameInput = document.getElementById("usernameField");
  const passwordInput = document.getElementById("passwordField");
  const errorDiv = document.getElementById("loginError");

  if (usernameInput) usernameInput.value = "";
  if (passwordInput) passwordInput.value = "";
  if (errorDiv) errorDiv.style.display = "none";

  loggedInUser = null;
  showLoginPage();
});

// Check if admin session exists
function checkAdminSession() {
  const savedSession = localStorage.getItem("adminSession");
  if (savedSession) {
    try {
      const session = JSON.parse(savedSession);
      // Check if session is still valid (optional: add expiry time)
      if (session.username && session.loggedInAt) {
        loggedInUser = session.username;
        return true;
      }
    } catch (err) {
      console.log("Invalid session");
    }
  }
  return false;
}

// Show login page
function showLoginPage() {
  const loginPage = document.getElementById("loginPage");
  const adminPanel = document.getElementById("adminPanel");
  if (loginPage) loginPage.style.display = "flex";
  if (adminPanel) adminPanel.style.display = "none";
  loggedInUser = null;

  // Clear any cached session
  localStorage.removeItem("adminSession");

  // Clear form fields (using new field IDs)
  const usernameInput = document.getElementById("usernameField");
  const passwordInput = document.getElementById("passwordField");
  if (usernameInput) usernameInput.value = "";
  if (passwordInput) passwordInput.value = "";
}

// Show admin panel
function showAdminPanel() {
  const loginPage = document.getElementById("loginPage");
  const adminPanel = document.getElementById("adminPanel");
  if (loginPage) loginPage.style.display = "none";
  if (adminPanel) adminPanel.style.display = "flex";

  // Update username display
  const adminUsernameEl = document.getElementById("adminUsername");
  if (adminUsernameEl) {
    adminUsernameEl.textContent = `👤 ${loggedInUser}`;
  }

  // Load admin data
  loadClothes();
  loadWishlistCount();
  checkBackendStatus();

  // Image preview
  const clothImageInput = document.getElementById("clothImage");
  if (clothImageInput) {
    clothImageInput.addEventListener("change", previewImage);
  }
}

// Handle login
function handleLogin(event) {
  if (event) {
    event.preventDefault();
  }
  console.clear();
  console.log("=== LOGIN ATTEMPT ===");

  const username = document.getElementById("usernameField").value.trim();
  const password = document.getElementById("passwordField").value.trim();
  const errorDiv = document.getElementById("loginError");

  console.log("Username entered:", username);
  console.log("Expected username:", ADMIN_CREDENTIALS.username);
  console.log(
    "Password entered:",
    password.length > 0 ? "[hidden]" : "[empty]",
  );
  console.log(
    "Expected password:",
    ADMIN_CREDENTIALS.password.length > 0 ? "[hidden]" : "[empty]",
  );

  // Validate credentials
  if (
    username === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password
  ) {
    console.log("✅ LOGIN SUCCESSFUL - Credentials matched!");

    // Store session in both localStorage and sessionStorage for persistence
    const session = {
      username: username,
      loggedInAt: new Date().toISOString(),
    };
    localStorage.setItem("adminSession", JSON.stringify(session));
    sessionStorage.setItem("adminSession", JSON.stringify(session));
    loggedInUser = username;
    console.log("✅ Session stored in localStorage and sessionStorage");
    console.log("✅ loggedInUser set to:", loggedInUser);

    // Hide login page and show admin panel - FORCE WITH ADDITIONAL METHODS
    const loginPage = document.getElementById("loginPage");
    const adminPanel = document.getElementById("adminPanel");

    console.log("DEBUG: loginPage element:", loginPage);
    console.log("DEBUG: adminPanel element:", adminPanel);

    if (loginPage) {
      loginPage.style.cssText =
        "display: none !important; visibility: hidden !important;";
      console.log("✅ Login page hidden");
    }
    if (adminPanel) {
      adminPanel.style.cssText =
        "display: flex !important; visibility: visible !important;";
      console.log("✅ Admin panel displayed");
    }

    // Clear form fields
    document.getElementById("usernameField").value = "";
    document.getElementById("passwordField").value = "";
    if (errorDiv) {
      errorDiv.style.display = "none";
    }
    console.log("✅ Form fields cleared");

    // Update username display immediately
    const adminUsernameEl = document.getElementById("adminUsername");
    if (adminUsernameEl) {
      adminUsernameEl.textContent = `👤 ${loggedInUser}`;
      console.log("✅ Admin username display updated");
    }

    // Load admin data asynchronously (don't wait for it)
    console.log("Loading admin data...");
    try {
      loadClothes().catch((err) =>
        console.error("Error loading clothes:", err),
      );
      loadWishlistCount().catch((err) =>
        console.error("Error loading wishlist:", err),
      );
      checkBackendStatus().catch((err) =>
        console.error("Error checking backend:", err),
      );
    } catch (err) {
      console.error("Error in data loading:", err);
    }

    return false; // Prevent form submission
  } else {
    console.log("❌ LOGIN FAILED - Credentials don't match");
    console.log("Username match:", username === ADMIN_CREDENTIALS.username);
    console.log("Password match:", password === ADMIN_CREDENTIALS.password);

    if (errorDiv) {
      errorDiv.textContent =
        "❌ Invalid username or password. Please try again.";
      errorDiv.style.display = "block";
    }

    return false; // Prevent form submission
  }
}

// Handle logout
function handleLogout() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("adminSession");
    loggedInUser = null;
    showLoginPage();
    console.log("Logged out successfully");
  }
}

// Switch tabs
function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Remove active class from nav items
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
  });

  // Show selected tab
  const selectedTab = document.getElementById(tabName);
  if (selectedTab) {
    selectedTab.classList.add("active");

    // Add active class to corresponding nav item
    event.target.classList.add("active");

    // Update page title
    const titles = {
      dashboard: "Dashboard",
      clothes: "Manage Women's Clothing",
      "add-cloth": "Add New Women's Cloth",
      settings: "Settings",
    };
    document.getElementById("page-title").textContent =
      titles[tabName] || "Dashboard";

    // Load data if needed
    if (tabName === "clothes") {
      loadClothes();
    } else if (tabName === "dashboard") {
      loadDashboard();
    }
  }
}

// Load all clothes
async function loadClothes() {
  try {
    const response = await fetch(`${API_BASE}/clothes`);
    allClothes = await response.json();
    filteredClothes = [...allClothes];
    displayClothesTable(allClothes);
  } catch (error) {
    console.error("Error loading clothes:", error);
    document.getElementById("clothesTableBody").innerHTML =
      '<tr><td colspan="7" class="error">Failed to load products</td></tr>';
  }
}

// Display clothes in table
function displayClothesTable(clothes) {
  const tbody = document.getElementById("clothesTableBody");

  if (clothes.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="8" class="loading">No products found</td></tr>';
    return;
  }

  tbody.innerHTML = clothes
    .map(
      (cloth) => `
        <tr>
            <td><img src="${IMAGE_BASE}${cloth.image}" alt="${cloth.name}" onerror="this.src='https://via.placeholder.com/50?text=No+Image'"></td>
            <td>${cloth.name}</td>
            <td>${cloth.category || "General"}</td>
            <td>₹${cloth.price}</td>
            <td>${cloth.size || "N/A"}</td>
            <td>${cloth.color || "N/A"}</td>
            <td><span class="stock-badge stock-${cloth.stock?.toLowerCase().replace(/\\s+/g, "-") || "in-stock"}">${cloth.stock || "In Stock"}</span></td>
            <td>
                <button class="btn btn-info btn-sm" onclick="editCloth('${cloth.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteCloth('${cloth.id}')">Delete</button>
            </td>
        </tr>
    `,
    )
    .join("");
}

// Filter clothes
function filterClothes() {
  const searchTerm = document
    .getElementById("clothesSearchInput")
    .value.toLowerCase();
  const category = document.getElementById("clothesCategoryFilter").value;

  filteredClothes = allClothes.filter((cloth) => {
    const matchName = cloth.name.toLowerCase().includes(searchTerm);
    const matchCategory = !category || cloth.category === category;
    return matchName && matchCategory;
  });

  displayClothesTable(filteredClothes);
}

// Edit cloth
async function editCloth(clothId) {
  try {
    const response = await fetch(`${API_BASE}/clothes/${clothId}`);
    const cloth = await response.json();
    currentEditingClothId = clothId;

    // Populate form
    document.getElementById("clothId").value = cloth.id;
    document.getElementById("clothName").value = cloth.name;
    document.getElementById("clothDescription").value = cloth.description || "";
    document.getElementById("clothPrice").value = cloth.price;
    document.getElementById("clothCategory").value = cloth.category || "Cotton";
    document.getElementById("clothSize").value = cloth.size || "";
    document.getElementById("clothColor").value = cloth.color || "";
    document.getElementById("clothStock").value = cloth.stock || "In Stock";

    // Show image preview
    const previewDiv = document.getElementById("imagePreview");
    if (cloth.image) {
      previewDiv.innerHTML = `<img src="${IMAGE_BASE}${cloth.image}" alt="Preview" style="max-width: 100%; border-radius: 4px;">`;
    }

    // Update form
    document.getElementById("formTitle").textContent = "Edit Cloth";
    document.getElementById("submitBtn").textContent = "Update Product";
    document.getElementById("clothImage").removeAttribute("required");

    // Scroll to form
    document.getElementById("add-cloth").scrollIntoView({ behavior: "smooth" });
    switchTab("add-cloth");
  } catch (error) {
    console.error("Error:", error);
    alert("Error loading product details. Please try again.");
  }
}

// Delete cloth
async function deleteCloth(clothId) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    const response = await fetch(`${API_BASE}/clothes/${clothId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Product deleted successfully!");
      loadClothes();
    } else {
      alert("Error deleting product");
    }
  } catch (error) {
    alert("Error: " + error.message);
  }
}

// Submit cloth form
async function submitClothForm(event) {
  event.preventDefault();

  // Ensure session is persisted before starting
  const session = localStorage.getItem("adminSession");
  if (session) {
    sessionStorage.setItem("adminSession", session);
  }

  const clothId = document.getElementById("clothId").value;
  const name = document.getElementById("clothName").value;
  const description = document.getElementById("clothDescription").value;
  const price = document.getElementById("clothPrice").value;
  const category = document.getElementById("clothCategory").value;
  const size = document.getElementById("clothSize").value;
  const color = document.getElementById("clothColor").value;
  const stock = document.getElementById("clothStock").value;
  const imageFile = document.getElementById("clothImage").files[0];

  // Validate required fields
  if (!name || !price) {
    alert("Please fill in all required fields (Name and Price)");
    return false;
  }

  if (!clothId && !imageFile) {
    alert("Please select a product image");
    return false;
  }

  // Prepare form data
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("price", price);
  formData.append("category", category);
  formData.append("size", size);
  formData.append("color", color);
  formData.append("stock", stock);
  if (imageFile) {
    formData.append("image", imageFile);
  }

  try {
    let response;
    const endpoint = clothId
      ? `${API_BASE}/clothes/${clothId}`
      : `${API_BASE}/clothes`;

    if (clothId) {
      response = await fetch(endpoint, {
        method: "PUT",
        body: formData,
      });
    } else {
      response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });
    }

    if (response.ok) {
      alert(
        clothId
          ? "Product updated successfully!"
          : "Product added successfully!",
      );
      resetForm();
      loadClothes();
      // Ensure session persists after successful submission
      const session = JSON.parse(localStorage.getItem("adminSession") || "{}");
      if (session.username) {
        sessionStorage.setItem("adminSession", JSON.stringify(session));
      }
    } else {
      const error = await response.json();
      alert("Error: " + (error.message || "Unknown error"));
    }
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Error submitting form. Make sure backend server is running.");
  }

  return false; // Prevent any form submission
}

// Reset form
function resetForm() {
  document.getElementById("clothForm").reset();
  document.getElementById("clothId").value = "";
  document.getElementById("imagePreview").innerHTML = "";
  document.getElementById("formTitle").textContent = "Add New Women's Cloth";
  document.getElementById("submitBtn").textContent = "Add Product";
  document.getElementById("clothImage").setAttribute("required", "");
  currentEditingClothId = null;
}

// Image preview
function previewImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById("imagePreview").innerHTML =
      `<img src="${e.target.result}" alt="Preview" style="max-width: 100%; border-radius: 4px;">`;
    reader.readAsDataURL(file);
  };
}

// Load dashboard
async function loadDashboard() {
  try {
    // Total products
    const clothesResponse = await fetch(`${API_BASE}/clothes`);
    const clothes = await clothesResponse.json();
    document.getElementById("totalProducts").textContent = clothes.length;

    // Total wishlist
    const wishlistResponse = await fetch(`${API_BASE}/wishlist`);
    const wishlist = await wishlistResponse.json();
    document.getElementById("totalWishlist").textContent = wishlist.length;

    // Recent products
    const recent = clothes.slice(-5).reverse();
    const recentList = document.getElementById("recentProductsList");
    if (recent.length === 0) {
      recentList.innerHTML = "<p>No products yet</p>";
    } else {
      recentList.innerHTML = recent
        .map(
          (cloth) => `
                <div style="padding: 10px; border-bottom: 1px solid #ddd; display: flex; gap: 15px;">
                    <img src="${IMAGE_BASE}${cloth.image}" alt="${cloth.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
                    <div style="flex: 1;">
                        <h4>${cloth.name}</h4>
                        <p style="color: #666; font-size: 13px;">₹${cloth.price} | ${cloth.category}</p>
                    </div>
                </div>
            `,
        )
        .join("");
    }
  } catch (error) {
    console.error("Error loading dashboard:", error);
  }
}

// Load wishlist count
async function loadWishlistCount() {
  try {
    const response = await fetch(`${API_BASE}/wishlist`);
    const wishlist = await response.json();
    document.getElementById("totalWishlist").textContent = wishlist.length;
  } catch (error) {
    console.error("Error loading wishlist count:", error);
  }
}

// Check backend status
async function checkBackendStatus() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    if (response.ok) {
      const statusEl = document.getElementById("backendStatus");
      if (statusEl) {
        statusEl.textContent = "✓ Online";
        statusEl.style.color = "green";
      }
    }
  } catch (error) {
    const statusEl = document.getElementById("backendStatus");
    if (statusEl) {
      statusEl.textContent = "✗ Offline";
      statusEl.style.color = "red";
    }
  }
}

// Export data
function exportClothesData() {
  const dataStr = JSON.stringify(allClothes, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `suvini-clothes-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

async function exportWishlistData() {
  try {
    const response = await fetch(`${API_BASE}/wishlist/details/all`);
    const wishlist = await response.json();
    const dataStr = JSON.stringify(wishlist, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `suvini-wishlist-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    alert("Error exporting wishlist: " + error.message);
  }
}

// Close edit modal
function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}

// Load initial dashboard
window.addEventListener("load", () => {
  loadDashboard();
});
