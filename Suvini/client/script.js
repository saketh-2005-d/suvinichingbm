// API Configuration
// Automatically uses the current domain in production (Vercel) and local dev.
const ORIGIN_BASE = window.location.origin;
const API_BASE = `${ORIGIN_BASE}/api`;
const IMAGE_BASE = ORIGIN_BASE;

let allProducts = [];
let allWishlist = [];
let currentProduct = null;

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  loadWishlist();
  initializeParallaxScroll();
  initializeSidebar();
});

// Sidebar Functions
function initializeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  // Close sidebar when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".sidebar") && !e.target.closest(".sidebar-toggle")) {
      closeSidebar();
    }
  });
}

function openSidebar() {
  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  sidebar.classList.add("active");
  sidebarOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const sidebarOverlay = document.getElementById("sidebarOverlay");

  sidebar.classList.remove("active");
  sidebarOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

// Mobile Menu Toggle - Deprecated (keeping for compatibility)
function toggleMobileMenu() {
  openSidebar();
}

// Close Mobile Menu - Deprecated (keeping for compatibility)
function closeMobileMenu() {
  closeSidebar();
}

// Parallax Scroll Effect
function initializeParallaxScroll() {
  const heroLogoWrapper = document.querySelector(".hero-logo-wrapper");
  if (!heroLogoWrapper) return;

  window.addEventListener("scroll", () => {
    const scrollY = window.pageYOffset;
    const heroElement = document.querySelector(".hero");
    const heroBottom = heroElement.offsetTop + heroElement.offsetHeight;

    // Apply parallax only while in hero section
    if (scrollY < heroBottom) {
      const parallaxOffset = scrollY * 0.5; // 50% of scroll speed
      heroLogoWrapper.style.transform = `translate(-50%, calc(-50% + ${parallaxOffset}px))`;
    }
  });
}

// Load all products
async function loadProducts() {
  try {
    const response = await fetch(`${API_BASE}/clothes`);
    allProducts = await response.json();
    displayProducts(allProducts);
  } catch (error) {
    console.error("Error loading products:", error);
    document.getElementById("productsGrid").innerHTML =
      '<div class="loading">Failed to load products. Please try again in a moment.</div>';
  }
}

// Display products
function displayProducts(products) {
  const grid = document.getElementById("productsGrid");

  if (products.length === 0) {
    grid.innerHTML = '<div class="loading">No products found</div>';
    return;
  }

  grid.innerHTML = products
    .map((product) => {
      const stockClass = product.stock
        ? product.stock.toLowerCase().replace(/\\s+/g, "-")
        : "in-stock";
      const stockText = product.stock || "In Stock";
      const isOutOfStock = product.stock === "Sold Out";

      return `
          <div class="product-card ${isOutOfStock ? "out-of-stock" : ""}" onclick="${!isOutOfStock ? `openProductModal('${product.id}')` : ""}">
            <img src="${IMAGE_BASE}${product.image}" alt="${product.name}" 
                 onerror="this.src='https://via.placeholder.com/260x300?text=No+Image'">
            <div class="product-info-below">
              <h4 class="product-name-label">${product.name}</h4>
              <div class="product-price-label">₹${product.price}</div>
            </div>
            <div class="stock-badge stock-${stockClass}">${stockText}</div>
            ${isOutOfStock ? '<div class="sold-out-overlay">Sold Out</div>' : ""}
            <div class="product-card-content">
              <p class="product-category">${product.category}</p>
              <p>${product.description ? product.description.substring(0, 50) + "..." : ""}</p>
            </div>
          </div>
        `;
    })
    .join("");
}

// Filter products
function filterProducts() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const category = document.getElementById("categoryFilter").value;

  const filtered = allProducts.filter((product) => {
    const matchName = product.name.toLowerCase().includes(searchTerm);
    const matchCategory = !category || product.category === category;
    return matchName && matchCategory;
  });

  displayProducts(filtered);
}

// Filter by category
function filterByCategory(category) {
  document.getElementById("categoryFilter").value = category;
  filterProducts();
  scrollToSection("products-section");
}

// Open product modal
async function openProductModal(productId) {
  try {
    const response = await fetch(`${API_BASE}/clothes/${productId}`);
    currentProduct = await response.json();

    document.getElementById("modalImage").src =
      `${IMAGE_BASE}${currentProduct.image}`;
    document.getElementById("modalName").textContent = currentProduct.name;
    document.getElementById("modalCategory").textContent =
      currentProduct.category;
    document.getElementById("modalDescription").textContent =
      currentProduct.description || "Premium quality Women's wear";
    document.getElementById("modalPrice").textContent =
      `₹${currentProduct.price}`;
    document.getElementById("modalSize").textContent =
      currentProduct.size || "All Sizes";
    document.getElementById("modalColor").textContent =
      currentProduct.color || "Various";

    // Display stock status
    const stockBadge = document.getElementById("modalStock");
    const stockStatus = currentProduct.stock || "In Stock";
    const stockClass = currentProduct.stock
      ? currentProduct.stock.toLowerCase().replace(/\s+/g, "-")
      : "in-stock";
    stockBadge.textContent = stockStatus;
    stockBadge.className = `stock-badge stock-${stockClass}`;

    // Disable action buttons if sold out
    const isSoldOut = currentProduct.stock === "Sold Out";
    const actionButtons = document.querySelectorAll(".modal-actions button");
    actionButtons.forEach((btn) => {
      if (isSoldOut && btn.textContent.includes("Order")) {
        btn.disabled = true;
        btn.style.opacity = "0.5";
        btn.style.cursor = "not-allowed";
      } else {
        btn.disabled = false;
        btn.style.opacity = "1";
        btn.style.cursor = "pointer";
      }
    });

    document.getElementById("productModal").style.display = "block";
    document.body.style.overflow = "hidden";
  } catch (error) {
    console.error("Error loading product:", error);
    alert("Error loading product details");
  }
}

// Close modal
function closeModal() {
  document.getElementById("productModal").style.display = "none";
  document.body.style.overflow = "auto";
  currentProduct = null;
}

// Load wishlist
async function loadWishlist() {
  try {
    const response = await fetch(`${API_BASE}/wishlist/details/all`);
    allWishlist = await response.json();
  } catch (error) {
    console.error("Error loading wishlist:", error);
    allWishlist = [];
  }
}

// Check if product in wishlist
function isInWishlist(productId) {
  return allWishlist.some((item) => item.clothId === productId);
}

// Toggle wishlist
let wishlistPopup = null;

function toggleWishlist() {
  if (allWishlist.length === 0) {
    alert("Your wishlist is empty");
    return;
  }

  const wishlistItems = allWishlist
    .map((item) => {
      const product = allProducts.find((p) => p.id === item.clothId);
      return product;
    })
    .filter((p) => p);

  if (wishlistItems.length === 0) {
    alert("Your wishlist is empty");
    return;
  }

  let wishlistHTML = `
    <html>
    <head>
      <title>My Wishlist</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .wishlist-item { display: grid; grid-template-columns: 30px 100px 1fr; gap: 15px; padding: 15px 0; border-bottom: 1px solid #eee; align-items: start; }
        .wishlist-item img { width: 100px; height: 100px; object-fit: cover; border-radius: 4px; }
        .wishlist-item h4 { margin: 0 0 8px 0; }
        .wishlist-item p { margin: 0; }
        .price { color: #666; font-size: 14px; }
        .size-color { color: #999; font-size: 12px; margin-top: 5px; }
        .buttons { padding-top: 20px; display: flex; gap: 10px; justify-content: center; }
        button { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 14px; }
        .select-btn { background: #ddd; color: #333; }
        .order-btn { background: #25D366; color: white; }
        button:hover { opacity: 0.9; }
      </style>
    </head>
    <body>
      <h3>My Wishlist (${wishlistItems.length} items)</h3>
      <div id="wishlistContainer">
  `;

  wishlistHTML += wishlistItems
    .map(
      (item) => `
        <div class="wishlist-item">
          <input type="checkbox" class="wishlist-checkbox" data-product='${JSON.stringify({ id: item.id, name: item.name, price: item.price, size: item.size || "All Sizes", color: item.color || "Various", image: item.image, category: item.category || "" })}'>
          <img src="${IMAGE_BASE}${item.image}" alt="${item.name}">
          <div>
            <h4>${item.name}</h4>
            <p class="price">₹${item.price}</p>
            <p class="size-color">Size: ${item.size || "All Sizes"} | Color: ${item.color || "Various"}</p>
          </div>
        </div>
      `,
    )
    .join("");

  wishlistHTML += `
      </div>
      <div class="buttons">
        <button class="select-btn" onclick="selectAllCheckboxes()">Select All</button>
        <button class="order-btn" onclick="orderFromWishlist()">Order Selected Items</button>
      </div>
      
      <script>
        const API_BASE = "${API_BASE}";
        const IMAGE_BASE = "${IMAGE_BASE}";
        
        function selectAllCheckboxes() {
          const checkboxes = document.querySelectorAll('.wishlist-checkbox');
          const allChecked = Array.from(checkboxes).every(cb => cb.checked);
          checkboxes.forEach(cb => cb.checked = !allChecked);
        }
        
        function orderFromWishlist() {
          const checkboxes = document.querySelectorAll('.wishlist-checkbox:checked');
          if (checkboxes.length === 0) {
            alert('Please select at least one item to order');
            return;
          }
          
          const selectedItems = Array.from(checkboxes).map(cb => JSON.parse(cb.getAttribute('data-product')));
          
          // Create WhatsApp message with product links
          let message = '🙏 *Namaste!*\\n\\n';
          message += 'Hello! I would like to order the following beautiful items from Suvini Clothing:\\n\\n';
          message += '🛍️ *My Selected Items:*\\n─────────────────────\\n';
          
          let totalPrice = 0;
          selectedItems.forEach((item, index) => {
            message += '\\n' + (index + 1) + '. *' + item.name + '*\\n';
            message += '   💵 Price: ₹' + item.price + '\\n';
            if (item.size) message += '   📏 Size: ' + item.size + '\\n';
            if (item.color) message += '   🎨 Color: ' + item.color + '\\n';
            if (item.image) message += '   📸 Product: ' + IMAGE_BASE + item.image + '\\n';
            totalPrice += item.price;
          });
          
          message += '\\n─────────────────────\\n';
          message += '💰 *Total Amount: ₹' + totalPrice + '*\\n\\n';
          message += 'Please confirm availability and provide delivery details. Thank you! 🙏';
          
          // Open WhatsApp
          const whatsappLink = 'https://wa.me/7349757596?text=' + encodeURIComponent(message);
          window.open(whatsappLink, '_blank');
          
          // Close popup
          window.close();
        }
      </script>
    </body>
    </html>
  `;

  wishlistPopup = window.open("", "Wishlist", "width=550,height=700");
  wishlistPopup.document.write(wishlistHTML);
  wishlistPopup.document.close();
}

// Toggle product wishlist (add/remove)
async function toggleProductWishlist(productId) {
  if (isInWishlist(productId)) {
    removeFromWishlistByClothId(productId);
  } else {
    addToWishlist(productId);
  }
}

// Add to wishlist
async function addToWishlist(productId) {
  try {
    const response = await fetch(`${API_BASE}/wishlist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clothId: productId }),
    });

    if (response.ok) {
      alert("✨ Added to wishlist!");
      loadWishlist();
      loadProducts();
    } else {
      const error = await response.json();
      alert(error.message || "Error adding to wishlist");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error adding to wishlist: " + error.message);
  }
}

// Remove from wishlist by clothId
async function removeFromWishlistByClothId(clothId) {
  if (!confirm("Remove from wishlist?")) return;

  try {
    const response = await fetch(`${API_BASE}/wishlist/cloth/${clothId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Removed from wishlist");
      loadWishlist();
      loadProducts();
    }
  } catch (error) {
    console.log("Error removing item");
  }
}

// Order product
async function orderProduct(items = null) {
  if (!items) {
    if (!currentProduct) {
      alert("No product selected");
      return;
    }
    items = [currentProduct];
  }

  const productList = items
    .map((item) => `• ${item.name} - ₹${item.price}`)
    .join("\n");

  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

  const customerName = prompt("Enter your full name:");
  if (!customerName) return;

  const phone = prompt("Enter your WhatsApp number (10 digits):");
  if (!phone) return;

  try {
    const response = await fetch(`${API_BASE}/whatsapp/send-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName,
        phone,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          size: item.size || "All Sizes",
          color: item.color || "Various",
          category: item.category || "",
          image: item.image || "",
        })),
        totalAmount,
      }),
    });

    const data = await response.json();
    if (data.success) {
      window.open(data.link, "_blank");
      closeModal();
    } else {
      alert("Error creating order. Please try again.");
    }
  } catch (error) {
    console.error("Order error:", error);
    alert(
      "Error: " +
        error.message +
        "\n\nMake sure the backend server is running!",
    );
  }
}

// Quick WhatsApp Contact for specific product
function quickWhatsappContact() {
  if (!currentProduct) {
    alert("No product selected");
    return;
  }

  const imageUrl = `${IMAGE_BASE}${currentProduct.image}`;
  const productMessage = `Hi! I'm interested in the *${currentProduct.name}* from your collection.%0A%0APrice: ₹${currentProduct.price}%0ACategory: ${currentProduct.category}%0AImage: ${imageUrl}%0A%0ACould you provide more details?`;
  const whatsappLink = `https://wa.me/7349757596?text=${productMessage}`;
  window.open(whatsappLink, "_blank");
}

// Quick Email Contact for specific product
function quickEmailContact() {
  if (!currentProduct) {
    alert("No product selected");
    return;
  }

  const subject = `Inquiry about ${currentProduct.name}`;
  const body = `Hello,

I am interested in the following product from your collection:

Product Name: ${currentProduct.name}
Category: ${currentProduct.category}
Price: ₹${currentProduct.price}
Size: ${currentProduct.size || "All Sizes"}
Color: ${currentProduct.color || "Various"}

${currentProduct.description ? "Description: " + currentProduct.description : ""}

Could you please provide more information about this product?

Thank you!`;

  const mailtoLink = `mailto:suvini.clothing@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoLink;
}

// Share product function
function shareProduct() {
  if (!currentProduct) {
    alert("No product selected");
    return;
  }

  const imageUrl = `${IMAGE_BASE}${currentProduct.image}`;
  const productUrl = window.location.href;
  const shareText = `Check out this amazing ${currentProduct.name} from Suvini Clothing! Price: ₹${currentProduct.price}`;

  // Create share options
  let shareHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 400px;">
      <h3 style="margin-top: 0;">Share "${currentProduct.name}"</h3>
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <button onclick="shareVia('whatsapp')" style="padding: 12px; background: #25D366; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px;">
          📱 Share on WhatsApp
        </button>
        <button onclick="shareVia('facebook')" style="padding: 12px; background: #1877F2; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px;">
          f Share on Facebook
        </button>
        <button onclick="shareVia('twitter')" style="padding: 12px; background: #1DA1F2; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px;">
          𝕏 Share on Twitter
        </button>
        <button onclick="shareVia('email')" style="padding: 12px; background: #EA4335; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px;">
          ✉️ Share via Email
        </button>
        <button onclick="shareVia('copy')" style="padding: 12px; background: #616161; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px;">
          📋 Copy Share Link
        </button>
      </div>
      <p style="margin-top: 15px; color: #999; font-size: 12px;">Product: ${currentProduct.name} | Price: ₹${currentProduct.price}</p>
    </div>
  `;

  const popup = window.open("", "Share", "width=450,height=380");
  popup.document.write(shareHTML);
}

// Share via different platforms
function shareVia(platform) {
  if (!currentProduct) {
    alert("No product selected");
    return;
  }

  const imageUrl = `${IMAGE_BASE}${currentProduct.image}`;
  const shareText = `Check out this amazing ${currentProduct.name} from Suvini Clothing! ✨\n\nPrice: ₹${currentProduct.price}\nCategory: ${currentProduct.category}`;
  const shareUrl = `${window.location.origin}?product=${currentProduct.id}`;

  let link = "";

  switch (platform) {
    case "whatsapp":
      const waMessage = `${shareText}\n\nImage: ${imageUrl}`;
      link = `https://wa.me/?text=${encodeURIComponent(waMessage)}`;
      break;
    case "facebook":
      link = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
      break;
    case "twitter":
      link = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
      break;
    case "email":
      const emailSubject = `Check out: ${currentProduct.name} from Suvini Clothing`;
      const emailBody = `Hi!\n\nI found this amazing product and thought you'd love it!\n\n${shareText}\n\nImage: ${imageUrl}\n\nVisit our store to see more beautiful collections!\n\nBest regards`;
      link = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      break;
    case "copy":
      const fullShareUrl = `${window.location.href.split("?")[0]}?product=${currentProduct.id}`;
      const shareMessage = `${shareText}\n\n${fullShareUrl}`;
      navigator.clipboard
        .writeText(shareMessage)
        .then(() => {
          alert("✅ Share link copied to clipboard!");
        })
        .catch(() => {
          alert("Could not copy link. Please try again.");
        });
      return;
  }

  if (link) {
    window.open(link, "_blank");
  }
}

// Scroll to section
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById("productModal");
  if (event.target === modal) {
    closeModal();
  }
};
