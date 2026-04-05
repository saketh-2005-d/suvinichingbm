import { useEffect, useMemo, useState } from "react";
import logoImage from "./assets/suvini-logo-transparent.png";

const normalizeApiBase = (baseUrl) => {
  if (!baseUrl) {
    return "";
  }

  const trimmed = baseUrl.trim().replace(/\/+$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

const isLocalHost = (hostname) => {
  return (
    hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1"
  );
};

const CONFIGURED_API_BASE = normalizeApiBase(import.meta.env.VITE_API_BASE_URL);
const API_BASE = (() => {
  if (typeof window === "undefined") {
    return CONFIGURED_API_BASE || "/api";
  }

  if (!CONFIGURED_API_BASE) {
    return "/api";
  }

  if (isLocalHost(window.location.hostname)) {
    try {
      const configuredHost = new URL(
        CONFIGURED_API_BASE,
        window.location.origin,
      ).hostname;
      if (isLocalHost(configuredHost)) {
        return "/api";
      }
    } catch {
      return "/api";
    }
  }

  return CONFIGURED_API_BASE;
})();
const LOCAL_API_FALLBACK = "http://localhost:5000/api";
const ADMIN_USERNAME =
  import.meta.env.VITE_ADMIN_USERNAME ||
  import.meta.env.VITE_ADMIN_EMAIL ||
  "suviniadmin";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "surekhasravan";
const USING_DEFAULT_ADMIN_CREDENTIALS =
  !import.meta.env.VITE_ADMIN_USERNAME &&
  !import.meta.env.VITE_ADMIN_EMAIL &&
  !import.meta.env.VITE_ADMIN_PASSWORD;
const WEBSITE_LOGIN_REQUIRED =
  String(
    import.meta.env.VITE_WEBSITE_LOGIN_REQUIRED ||
      import.meta.env.VITE_CLIENT_LOGIN_REQUIRED ||
      "true",
  ).toLowerCase() === "true";
const WEBSITE_SESSION_KEY = "suviniWebsiteSession";
const ADMIN_SESSION_KEY = "suviniAdminSession";
const WEBSITE_LOGIN_PATH = "/login";
const ORDER_EMAIL =
  import.meta.env.VITE_ORDER_EMAIL ||
  import.meta.env.VITE_ADMIN_EMAIL ||
  "suvini.clothing@gmail.com";
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "7349757596";
const DEFAULT_CATEGORY_OPTIONS = [
  "Cotton",
  "Pattu",
  "Jamdhani",
  "Fancy",
  "Dresses",
];
const CUSTOM_CATEGORY_OPTION = "__custom__";

function normalizeEntityId(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

function getCategorySelectionValue(category) {
  const normalized = String(category || "")
    .trim()
    .toLowerCase();
  if (!normalized) {
    return DEFAULT_CATEGORY_OPTIONS[0];
  }

  const predefined = DEFAULT_CATEGORY_OPTIONS.find(
    (item) => item.toLowerCase() === normalized,
  );
  return predefined || CUSTOM_CATEGORY_OPTION;
}

function getCategoryIcon(category) {
  const iconMap = {
    cotton: "🧵",
    pattu: "✨",
    jamdhani: "🌸",
    fancy: "💎",
    dresses: "👗",
  };

  const normalized = String(category || "")
    .trim()
    .toLowerCase();

  return iconMap[normalized] || "🛍️";
}

function normalizeColorOptions(colorValue) {
  if (Array.isArray(colorValue)) {
    return Array.from(
      new Set(
        colorValue.map((color) => String(color || "").trim()).filter(Boolean),
      ),
    );
  }

  const raw = String(colorValue || "").trim();
  if (!raw) {
    return [];
  }

  return Array.from(
    new Set(
      raw
        .split(",")
        .map((color) => color.trim())
        .filter(Boolean),
    ),
  );
}

function getColorText(colorValue, fallbackText) {
  const colors = normalizeColorOptions(colorValue);
  if (colors.length === 0) {
    return fallbackText;
  }

  return colors.join(", ");
}

function getColorCircleValue(color) {
  const normalized = String(color || "").trim();
  if (!normalized) {
    return "linear-gradient(145deg, #f6e8b6, #3c56aa)";
  }

  return normalized;
}

function getPriceDetails(item) {
  const actualPrice = Number(item?.price || 0);
  const offerPrice = Number(item?.offerPrice || 0);
  const hasOffer =
    Number.isFinite(actualPrice) &&
    actualPrice > 0 &&
    Number.isFinite(offerPrice) &&
    offerPrice > 0 &&
    offerPrice < actualPrice;

  const finalPrice = hasOffer ? offerPrice : actualPrice;
  const offerPercent = hasOffer
    ? Math.round(((actualPrice - offerPrice) / actualPrice) * 100)
    : 0;

  return { actualPrice, offerPrice, hasOffer, finalPrice, offerPercent };
}

function formatPrice(value) {
  const numeric = Number(value);
  return new Intl.NumberFormat("en-IN").format(
    Number.isFinite(numeric) ? numeric : 0,
  );
}

function createOrderPayload(orderName, orderPhone, selectedWishlistItems) {
  return {
    customerName: orderName,
    phone: orderPhone,
    items: selectedWishlistItems.map((item) => ({
      id: item.clothDetails.id,
      name: item.clothDetails.name,
      price: getPriceDetails(item.clothDetails).finalPrice,
      actualPrice: getPriceDetails(item.clothDetails).actualPrice,
      offerPrice: getPriceDetails(item.clothDetails).offerPrice,
      offerPercent: getPriceDetails(item.clothDetails).offerPercent,
      size: item.clothDetails.size,
      color: getColorText(item.clothDetails.color, "-"),
      image: item.clothDetails.image,
    })),
    totalAmount: selectedWishlistItems.reduce(
      (sum, item) =>
        sum + Number(getPriceDetails(item.clothDetails).finalPrice || 0),
      0,
    ),
  };
}

function buildWhatsAppLinkFromOrder(payload) {
  const safeItems = payload.items || [];
  const itemLines = safeItems.flatMap((item, index) => {
    const offerTag = item.offerPercent ? ` | ${item.offerPercent}% OFF` : "";
    const details = [
      `${index + 1}. ${item.name} | Rs ${item.price}${offerTag} | Size: ${item.size || "-"} | Color: ${item.color || "-"}`,
    ];

    if (item.image) {
      details.push(`   Image: ${getImageUrl(item.image)}`);
    }

    return details;
  });

  const lines = [
    "Namaste!",
    "",
    `My name is ${payload.customerName}. I would like to place an order.`,
    `Contact: ${payload.phone}`,
    "",
    "Items:",
    ...itemLines,
    "",
    `Total Amount: Rs ${payload.totalAmount}`,
  ];

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

function readClientSession() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(WEBSITE_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveClientSession(session) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(WEBSITE_SESSION_KEY, JSON.stringify(session));
}

function clearClientSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(WEBSITE_SESSION_KEY);
}

function createClientSession(username) {
  const normalizedUsername = username.trim().toLowerCase();
  return {
    username: normalizedUsername,
    name: normalizedUsername || "Customer",
    loggedInAt: new Date().toISOString(),
  };
}

function isValidClientLogin(username, password) {
  return username.trim() !== "" && password.trim() !== "";
}

function readAdminSession() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(ADMIN_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveAdminSession(session) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

function clearAdminSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ADMIN_SESSION_KEY);
}

function createAdminSession(username) {
  const normalizedUsername = username.trim().toLowerCase();
  return {
    username: normalizedUsername,
    loggedInAt: new Date().toISOString(),
  };
}

function isValidAdminLogin(username, password) {
  return (
    username.trim().toLowerCase() === ADMIN_USERNAME.trim().toLowerCase() &&
    password.trim() === ADMIN_PASSWORD.trim()
  );
}

function getImageUrl(image) {
  if (!image) return "https://via.placeholder.com/320x380?text=No+Image";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  const apiOrigin = new URL(API_BASE, window.location.origin).origin;
  return `${apiOrigin}${image}`;
}

async function parseErrorMessage(response) {
  const contentType = response.headers.get("content-type") || "";
  let message = `Request failed (${response.status})`;

  if (contentType.includes("application/json")) {
    const data = await response.json();
    message = data.error || data.message || message;
  } else if (contentType.includes("text/html")) {
    const text = await response.text();
    if (/cors|not allowed by cors/i.test(text)) {
      message = "Request blocked by CORS. Restart backend and try again.";
    } else {
      message = `Server returned HTML error (${response.status})`;
    }
  } else {
    const text = await response.text();
    if (/^\s*<!doctype html|^\s*<html/i.test(text)) {
      message = `Server returned HTML error (${response.status})`;
    } else {
      message = text || message;
    }
  }

  return message;
}

async function fetchLocalFallback(path, options = {}) {
  const fallbackResponse = await fetch(`${LOCAL_API_FALLBACK}${path}`, options);
  if (!fallbackResponse.ok) {
    throw new Error(await parseErrorMessage(fallbackResponse));
  }

  return fallbackResponse.json();
}

async function apiFetch(path, options = {}) {
  const canUseLocalFallback =
    API_BASE === "/api" &&
    typeof window !== "undefined" &&
    isLocalHost(window.location.hostname);

  try {
    const response = await fetch(`${API_BASE}${path}`, options);
    if (!response.ok) {
      if (canUseLocalFallback) {
        try {
          return await fetchLocalFallback(path, options);
        } catch {
          // Continue and throw the original response message.
        }
      }

      throw new Error(await parseErrorMessage(response));
    }

    return response.json();
  } catch (err) {
    if (canUseLocalFallback) {
      try {
        return await fetchLocalFallback(path, options);
      } catch {
        // Throw the actionable error below.
      }
    }

    if (err instanceof TypeError) {
      throw new Error(
        "Cannot reach API. Ensure backend is running and try again.",
      );
    }

    throw err;
  }
}

function ShopPage() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState(null);
  const [orderName, setOrderName] = useState("");
  const [orderPhone, setOrderPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clientSession, setClientSession] = useState(() => readClientSession());
  const [selectedWishlistIds, setSelectedWishlistIds] = useState([]);
  const [currentHash, setCurrentHash] = useState(() =>
    typeof window === "undefined" ? "" : window.location.hash,
  );

  const wishlistByClothId = useMemo(
    () => new Set(wishlist.map((item) => item.clothId)),
    [wishlist],
  );

  const categories = useMemo(() => {
    const categoryMap = new Map(
      DEFAULT_CATEGORY_OPTIONS.map((item) => [item.toLowerCase(), item]),
    );

    products
      .map((p) => String(p.category || "").trim())
      .filter(Boolean)
      .forEach((item) => {
        const key = item.toLowerCase();
        if (!categoryMap.has(key)) {
          categoryMap.set(key, item);
        }
      });

    return Array.from(categoryMap.values());
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const bySearch = product.name
        ?.toLowerCase()
        .includes(search.toLowerCase());
      const byCategory = !category || product.category === category;
      return bySearch && byCategory;
    });
  }, [products, search, category]);

  const selectedWishlistItems = useMemo(() => {
    return wishlist
      .map((item) => ({
        ...item,
        clothId: normalizeEntityId(item.clothId),
        clothDetails: products.find(
          (p) => p.id === normalizeEntityId(item.clothId),
        ),
      }))
      .filter((item) => item.clothDetails);
  }, [wishlist, products]);

  const orderableWishlistItems = useMemo(() => {
    return selectedWishlistItems.filter((item) =>
      selectedWishlistIds.includes(item.clothId),
    );
  }, [selectedWishlistItems, selectedWishlistIds]);

  const allWishlistSelected =
    selectedWishlistItems.length > 0 &&
    orderableWishlistItems.length === selectedWishlistItems.length;

  const wishlistTotal = useMemo(() => {
    return orderableWishlistItems.reduce(
      (sum, item) =>
        sum + Number(getPriceDetails(item.clothDetails).finalPrice || 0),
      0,
    );
  }, [orderableWishlistItems]);

  const latestProducts = useMemo(() => {
    return [...products]
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime(),
      )
      .slice(0, 4);
  }, [products]);

  const selectedPriceDetails = useMemo(() => {
    if (!selected) {
      return null;
    }

    return getPriceDetails(selected);
  }, [selected]);

  const isCheckoutView = currentHash === "#checkout";

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [productsData, wishlistData] = await Promise.all([
        apiFetch("/clothes"),
        apiFetch("/wishlist/details/all"),
      ]);
      const normalizedProducts = (productsData || []).map((product) => ({
        ...product,
        id: normalizeEntityId(product.id || product._id),
      }));
      const normalizedWishlist = (wishlistData || []).map((item) => ({
        ...item,
        clothId: normalizeEntityId(item.clothId),
      }));

      setProducts(normalizedProducts);
      setWishlist(normalizedWishlist);
    } catch (err) {
      setError(err.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const availableIds = Array.from(
      new Set(selectedWishlistItems.map((item) => item.clothId)),
    );

    setSelectedWishlistIds((prev) => {
      if (availableIds.length === 0) {
        return [];
      }

      const kept = prev.filter((id) => availableIds.includes(id));
      if (kept.length > 0 || prev.length > 0) {
        return kept;
      }

      return availableIds;
    });
  }, [selectedWishlistItems]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const syncHash = () => setCurrentHash(window.location.hash);
    window.addEventListener("hashchange", syncHash);
    syncHash();

    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (clientSession) {
      saveClientSession(clientSession);
      if (!orderName) {
        setOrderName(clientSession.name || "");
      }
    } else {
      clearClientSession();
    }
  }, [clientSession]);

  useEffect(() => {
    if (
      WEBSITE_LOGIN_REQUIRED &&
      !clientSession &&
      typeof window !== "undefined" &&
      !window.location.pathname.startsWith(WEBSITE_LOGIN_PATH)
    ) {
      window.location.replace(WEBSITE_LOGIN_PATH);
    }
  }, [clientSession]);

  async function toggleWishlist(productId) {
    const normalizedProductId = normalizeEntityId(productId);
    if (!normalizedProductId) {
      alert("Invalid product ID. Please refresh and try again.");
      return;
    }

    try {
      if (wishlistByClothId.has(normalizedProductId)) {
        await apiFetch(`/wishlist/cloth/${normalizedProductId}`, {
          method: "DELETE",
        });
      } else {
        await apiFetch("/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clothId: normalizedProductId }),
        });
      }
      await loadData();
    } catch (err) {
      if (
        typeof err?.message === "string" &&
        err.message.toLowerCase().includes("already in wishlist")
      ) {
        await loadData();
        return;
      }

      alert(err?.message || "Could not update wishlist");
    }
  }

  function toggleWishlistSelection(clothId) {
    const normalizedClothId = normalizeEntityId(clothId);
    if (!normalizedClothId) {
      return;
    }

    setSelectedWishlistIds((prev) =>
      prev.includes(normalizedClothId)
        ? prev.filter((id) => id !== normalizedClothId)
        : [...prev, normalizedClothId],
    );
  }

  function toggleSelectAllWishlist() {
    if (allWishlistSelected) {
      setSelectedWishlistIds([]);
      return;
    }

    setSelectedWishlistIds(selectedWishlistItems.map((item) => item.clothId));
  }

  async function sendOrderToWhatsApp() {
    if (!orderName.trim() || !orderPhone.trim()) {
      alert("Please enter your name and phone number.");
      return;
    }

    if (selectedWishlistItems.length === 0) {
      alert("Your wishlist is empty.");
      return;
    }

    if (orderableWishlistItems.length === 0) {
      alert("Select at least one wishlist item to order.");
      return;
    }

    const payload = createOrderPayload(
      orderName,
      orderPhone,
      orderableWishlistItems,
    );

    try {
      const response = await apiFetch("/whatsapp/send-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      window.open(response.link, "_blank");
    } catch (err) {
      const fallbackLink = buildWhatsAppLinkFromOrder(payload);
      const opened = window.open(fallbackLink, "_blank");
      if (!opened) {
        window.location.href = fallbackLink;
      }
    }
  }

  function sendOrderToEmail() {
    if (!orderName.trim() || !orderPhone.trim()) {
      alert("Please enter your name and phone number.");
      return;
    }

    if (selectedWishlistItems.length === 0) {
      alert("Your wishlist is empty.");
      return;
    }

    if (orderableWishlistItems.length === 0) {
      alert("Select at least one wishlist item to order.");
      return;
    }

    const payload = createOrderPayload(
      orderName,
      orderPhone,
      orderableWishlistItems,
    );
    const lines = [
      `Hello Suvini Clothing,`,
      "",
      "I would like to place an order.",
      `Customer Name: ${payload.customerName}`,
      `Phone: ${payload.phone}`,
      "",
      "Selected Items:",
      ...payload.items.map((item, idx) => {
        const offerTag = item.offerPercent
          ? ` | ${item.offerPercent}% OFF`
          : "";
        return `${idx + 1}. ${item.name} | Price: Rs ${item.price}${offerTag} | Size: ${item.size || "-"} | Color: ${item.color || "-"}`;
      }),
      "",
      `Total Amount: Rs ${payload.totalAmount}`,
    ];

    const subject = encodeURIComponent("Order Request - Suvini Clothing");
    const body = encodeURIComponent(lines.join("\n"));
    window.location.href = `mailto:${ORDER_EMAIL}?subject=${subject}&body=${body}`;
  }

  function scrollToCollection() {
    const section = document.getElementById("collection");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleClientLogout() {
    setClientSession(null);
    if (typeof window !== "undefined") {
      window.location.replace(WEBSITE_LOGIN_PATH);
    }
  }

  if (WEBSITE_LOGIN_REQUIRED && !clientSession) {
    return (
      <div className="page client-auth-wrap">
        <section className="card client-auth">
          <p className="chip soft">Redirecting</p>
          <h2>Taking You to Website Login</h2>
          <p className="muted">Website login is required for this store.</p>
          <a className="btn" href={WEBSITE_LOGIN_PATH}>
            Go to Login
          </a>
        </section>
      </div>
    );
  }

  return (
    <div className="page storefront">
      <div className="announcement-bar">
        <p>
          Royal Edit Live • Hand-finished festive silhouettes • Concierge
          support on WhatsApp
        </p>
      </div>

      <header className="store-nav card">
        <div className="brand-mark">
          <img
            src={logoImage}
            alt="Suvini Clothing logo"
            className="brand-logo"
          />
        </div>
        <nav>
          <a href="#collection">Shop</a>
          <a href="#latest">New In</a>
          <a href="#checkout">Checkout</a>
        </nav>
        <div className="store-nav-actions">
          {WEBSITE_LOGIN_REQUIRED && clientSession ? (
            <span className="customer-chip">Hi, {clientSession.name}</span>
          ) : null}
          <button className="wishlist-pill" onClick={scrollToCollection}>
            Wishlist {selectedWishlistItems.length}
          </button>
          {WEBSITE_LOGIN_REQUIRED && clientSession ? (
            <button className="btn secondary" onClick={handleClientLogout}>
              Logout
            </button>
          ) : null}
        </div>
      </header>

      <section className="hero hero-shop">
        <div className="hero-copy hero-copy-brand">
          <h1>Suvini Clothing</h1>
          <p>
            Step into timeless elegance with handpicked sarees and festive
            ethnic wear crafted for modern celebrations. From graceful pattu to
            everyday cotton classics, discover pieces that feel luxurious,
            effortless, and uniquely yours.
          </p>
          <div className="hero-actions">
            <button className="btn" onClick={scrollToCollection}>
              Shop Collection
            </button>
            <a className="btn secondary" href="#checkout">
              Quick Checkout
            </a>
          </div>
        </div>
      </section>

      <section className="category-strip" id="categories">
        <div className="section-head">
          <h2>Categories</h2>
          <p>Tap a category to filter products instantly.</p>
        </div>

        <div className="category-cards">
          {categories.slice(0, 6).map((cat) => (
            <button
              key={cat}
              className={`category-card ${category === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              <span className="category-thumb" aria-hidden="true">
                <span className="category-icon">{getCategoryIcon(cat)}</span>
              </span>
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="latest-strip" id="latest">
        <div className="section-head">
          <h2>New Arrivals</h2>
          <p>Just landed pieces ready to be added to your wishlist.</p>
        </div>
        <div className="latest-grid">
          {latestProducts.map((product) => {
            const priceDetails = getPriceDetails(product);
            return (
              <article
                key={product.id}
                className="latest-card card"
                onClick={() => setSelected(product)}
              >
                <img src={getImageUrl(product.image)} alt={product.name} />
                <div>
                  <h4>{product.name}</h4>
                  <div className="price-block muted">
                    <span className="price-current">
                      Rs {formatPrice(priceDetails.finalPrice)}
                    </span>
                    {priceDetails.hasOffer ? (
                      <>
                        <span className="price-old">
                          Rs {formatPrice(priceDetails.actualPrice)}
                        </span>
                        <span className="offer-badge">
                          {priceDetails.offerPercent}% OFF
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section id="collection" className="collection-wrap">
        {!isCheckoutView ? (
          <>
            <div className="section-head">
              <h2>Shop Collection</h2>
              <p>
                Filter by category, inspect details, and save favorites for
                checkout.
              </p>
            </div>

            <section className="toolbar card">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product name"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </section>

            <section className="quick-cats">
              <button
                className={`chip-btn ${category === "" ? "active" : ""}`}
                onClick={() => setCategory("")}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`chip-btn ${category === cat ? "active" : ""}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </section>

            {loading ? <p className="status">Loading products...</p> : null}
            {error ? <p className="status error">{error}</p> : null}

            <p className="results-note">Showing {filtered.length} products</p>
          </>
        ) : null}

        <div className="collection-commerce" id="checkout">
          {!isCheckoutView ? (
            <div className="products-column">
              <section className="grid product-grid">
                {filtered.length === 0 ? (
                  <div className="empty-state card">
                    <h3>No products found</h3>
                    <p className="muted">
                      Try another search or clear category filters to see more
                      products.
                    </p>
                  </div>
                ) : null}
                {filtered.map((product) => {
                  const inWishlist = wishlistByClothId.has(product.id);
                  const soldOut = product.stock === "Sold Out";
                  const priceDetails = getPriceDetails(product);
                  const productColors = normalizeColorOptions(product.color);
                  return (
                    <article className="product card" key={product.id}>
                      <div className="product-media">
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                        />
                        <span className={`stock-tag ${soldOut ? "out" : "in"}`}>
                          {product.stock || "In Stock"}
                        </span>
                      </div>
                      <div className="product-body">
                        <p className="muted product-category">
                          {product.category || "General"}
                        </p>
                        <h3>{product.name}</h3>
                        <div className="price-block">
                          <span className="price-current">
                            Rs {formatPrice(priceDetails.finalPrice)}
                          </span>
                          {priceDetails.hasOffer ? (
                            <>
                              <span className="price-old">
                                Rs {formatPrice(priceDetails.actualPrice)}
                              </span>
                              <span className="offer-badge">
                                {priceDetails.offerPercent}% OFF
                              </span>
                            </>
                          ) : null}
                        </div>
                        <div className="color-row">
                          <span className="color-dots">
                            {(productColors.length > 0
                              ? productColors
                              : [""]
                            ).map((colorOption, idx) => (
                              <span
                                key={`${product.id}-color-${idx}`}
                                className="color-dot"
                                style={{
                                  background: getColorCircleValue(colorOption),
                                }}
                              />
                            ))}
                          </span>
                          <span className="muted">
                            {getColorText(product.color, "Color not specified")}
                          </span>
                        </div>
                        <div className="actions">
                          <button
                            onClick={() => setSelected(product)}
                            className="btn secondary"
                          >
                            Details
                          </button>
                          <button
                            className="btn"
                            disabled={soldOut}
                            onClick={() =>
                              toggleWishlist(product.id || product._id)
                            }
                          >
                            {inWishlist
                              ? "Remove from Wishlist"
                              : "Add to Wishlist"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </section>
            </div>
          ) : null}

          <aside className="wishlist card checkout-panel">
            <div className="section-head compact">
              <h2>Wishlist Checkout</h2>
              <p>
                Shortlist your pieces and place your order via WhatsApp or
                Email.
              </p>
            </div>
            <div className="checkout-meta">
              <p className="muted">
                Selected: {orderableWishlistItems.length} /
                {selectedWishlistItems.length}
              </p>
              <p className="checkout-total">
                Total: Rs {formatPrice(wishlistTotal)}
              </p>
            </div>
            {selectedWishlistItems.length > 0 ? (
              <>
                <div className="wishlist-select-row">
                  <label>
                    <input
                      type="checkbox"
                      checked={allWishlistSelected}
                      onChange={toggleSelectAllWishlist}
                    />
                    Select All Items
                  </label>
                  <span className="muted">
                    Choose products to include in order
                  </span>
                </div>
                <div className="wishlist-list">
                  {selectedWishlistItems.map((item) => {
                    const isSelected = selectedWishlistIds.includes(
                      item.clothId,
                    );
                    const itemKey = item._id || item.id || item.clothId;
                    const priceDetails = getPriceDetails(item.clothDetails);
                    return (
                      <div
                        key={itemKey}
                        className={`wishlist-item ${isSelected ? "selected" : ""}`}
                      >
                        <label className="wishlist-item-select">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() =>
                              toggleWishlistSelection(item.clothId)
                            }
                          />
                        </label>
                        <img
                          src={getImageUrl(item.clothDetails.image)}
                          alt={item.clothDetails.name}
                        />
                        <div>
                          <p className="wishlist-name">
                            {item.clothDetails.name}
                          </p>
                          <div className="price-block muted">
                            <span className="price-current">
                              Rs {formatPrice(priceDetails.finalPrice)}
                            </span>
                            {priceDetails.hasOffer ? (
                              <>
                                <span className="price-old">
                                  Rs {formatPrice(priceDetails.actualPrice)}
                                </span>
                                <span className="offer-badge">
                                  {priceDetails.offerPercent}% OFF
                                </span>
                              </>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="muted">
                Your wishlist is empty. Add items to continue.
              </p>
            )}
            <div className="order-row order-row-stack">
              <input
                value={orderName}
                onChange={(e) => setOrderName(e.target.value)}
                placeholder="Your name"
              />
              <input
                value={orderPhone}
                onChange={(e) => setOrderPhone(e.target.value)}
                placeholder="Phone number"
              />
              <button className="btn" onClick={sendOrderToWhatsApp}>
                DM to Order (WhatsApp)
              </button>
              <button className="btn secondary" onClick={sendOrderToEmail}>
                Order by Email
              </button>
            </div>
          </aside>
        </div>
      </section>

      {selected ? (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal card" onClick={(e) => e.stopPropagation()}>
            <img src={getImageUrl(selected.image)} alt={selected.name} />
            <h3>{selected.name}</h3>
            {selectedPriceDetails ? (
              <div className="price-block">
                <span className="price-current">
                  Rs {formatPrice(selectedPriceDetails.finalPrice)}
                </span>
                {selectedPriceDetails.hasOffer ? (
                  <>
                    <span className="price-old">
                      Rs {formatPrice(selectedPriceDetails.actualPrice)}
                    </span>
                    <span className="offer-badge">
                      {selectedPriceDetails.offerPercent}% OFF
                    </span>
                  </>
                ) : null}
              </div>
            ) : null}
            <p>
              {selected.description || "Premium quality piece from Suvini."}
            </p>
            <p className="muted">Size: {selected.size || "All"}</p>
            <div className="color-row">
              <span className="color-dots">
                {(normalizeColorOptions(selected.color).length > 0
                  ? normalizeColorOptions(selected.color)
                  : [""]
                ).map((colorOption, idx) => (
                  <span
                    key={`selected-color-${idx}`}
                    className="color-dot"
                    style={{ background: getColorCircleValue(colorOption) }}
                  />
                ))}
              </span>
              <span className="muted">
                {getColorText(selected.color, "Various colors")}
              </span>
            </div>
            <div className="actions modal-actions">
              <button
                className="btn secondary"
                disabled={selected.stock === "Sold Out"}
                onClick={() => toggleWishlist(selected.id || selected._id)}
              >
                {wishlistByClothId.has(
                  normalizeEntityId(selected.id || selected._id),
                )
                  ? "Remove from Wishlist"
                  : "Add to Wishlist"}
              </button>
              <button className="btn" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ClientLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (readAdminSession()) {
      window.location.replace("/admin");
    }
  }, []);

  function handleClientLogin(event) {
    event.preventDefault();
    setError("");

    if (!username.trim() || !password) {
      setError("Enter username and password to continue.");
      return;
    }

    if (isValidAdminLogin(username, password)) {
      saveAdminSession(createAdminSession(username));
      clearClientSession();
      window.location.replace("/admin");
      return;
    }

    if (!isValidClientLogin(username, password)) {
      setError("Invalid website credentials.");
      return;
    }

    saveClientSession(createClientSession(username));
    window.location.replace("/");
  }

  return (
    <div className="page client-auth-wrap">
      <section className="card client-auth">
        <p className="chip soft">Welcome</p>
        <h2>Sign In to Continue</h2>
        <form onSubmit={handleClientLogin} className="client-auth-form">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            type="text"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
          />
          <button className="btn" type="submit">
            Continue
          </button>
        </form>
        {error ? <p className="status error">{error}</p> : null}
      </section>
    </div>
  );
}

function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(() => Boolean(readAdminSession()));
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    offerPrice: "",
    size: "",
    color: "",
    category: DEFAULT_CATEGORY_OPTIONS[0],
    stock: "In Stock",
  });
  const [categoryChoice, setCategoryChoice] = useState(
    DEFAULT_CATEGORY_OPTIONS[0],
  );
  const [customCategoryLabel, setCustomCategoryLabel] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");

  async function loadProducts() {
    const data = await apiFetch("/clothes");
    const normalized = (data || []).map((product) => ({
      ...product,
      id: normalizeEntityId(product.id || product._id),
    }));
    setProducts(normalized);
  }

  useEffect(() => {
    if (loggedIn) {
      loadProducts().catch((err) =>
        setMessage(err.message || "Failed to load products"),
      );
    }
  }, [loggedIn]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!loggedIn) {
      window.location.replace(WEBSITE_LOGIN_PATH);
    }
  }, [loggedIn]);

  function handleAdminLogout() {
    clearAdminSession();
    setLoggedIn(false);
    window.location.replace(WEBSITE_LOGIN_PATH);
  }

  function startEdit(product) {
    setEditingId(normalizeEntityId(product.id || product._id));
    const incomingCategory = product.category || "";
    const selectionValue = getCategorySelectionValue(incomingCategory);
    setCategoryChoice(selectionValue);
    setCustomCategoryLabel(
      selectionValue === CUSTOM_CATEGORY_OPTION ? incomingCategory : "",
    );
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      offerPrice: product.offerPrice ?? "",
      size: product.size || "",
      color: normalizeColorOptions(product.color).join(", "),
      category: incomingCategory || DEFAULT_CATEGORY_OPTIONS[0],
      stock: product.stock || "In Stock",
    });
    setImageFile(null);
  }

  async function saveProduct(e) {
    e.preventDefault();
    setMessage("");

    try {
      const normalizedCategory = String(form.category || "").trim();
      if (!normalizedCategory) {
        setMessage("Please select a category or add a custom label");
        return;
      }

      const payloadForm = {
        ...form,
        offerPrice: String(form.offerPrice || "").trim(),
        color: normalizeColorOptions(form.color).join(", "),
        category: normalizedCategory,
      };

      if (payloadForm.offerPrice !== "") {
        const parsedPrice = Number(payloadForm.price);
        const parsedOfferPrice = Number(payloadForm.offerPrice);
        if (
          !Number.isFinite(parsedOfferPrice) ||
          parsedOfferPrice <= 0 ||
          parsedOfferPrice >= parsedPrice
        ) {
          setMessage("Offer price must be lower than the regular price");
          return;
        }
      }

      const formData = new FormData();
      Object.entries(payloadForm).forEach(([key, value]) =>
        formData.append(key, value),
      );
      if (imageFile) formData.append("image", imageFile);

      if (!editingId && !imageFile) {
        setMessage("Please select an image for a new product");
        return;
      }

      const endpoint = editingId ? `/clothes/${editingId}` : "/clothes";
      const method = editingId ? "PUT" : "POST";

      await apiFetch(endpoint, {
        method,
        body: formData,
      });

      setForm({
        name: "",
        description: "",
        price: "",
        offerPrice: "",
        size: "",
        color: "",
        category: DEFAULT_CATEGORY_OPTIONS[0],
        stock: "In Stock",
      });
      setCategoryChoice(DEFAULT_CATEGORY_OPTIONS[0]);
      setCustomCategoryLabel("");
      setImageFile(null);
      setEditingId("");
      setMessage("Saved successfully");
      await loadProducts();
    } catch (err) {
      setMessage(err.message || "Failed to save product");
    }
  }

  async function removeProduct(id) {
    const yes = window.confirm("Delete this product?");
    if (!yes) return;

    const productId = normalizeEntityId(id);
    if (!productId) {
      setMessage("Invalid product id. Please refresh and try again.");
      return;
    }

    try {
      await apiFetch(`/clothes/${productId}`, { method: "DELETE" });
      setMessage("Deleted successfully");
      await loadProducts();
    } catch (err) {
      setMessage(err.message || "Delete failed");
    }
  }

  if (!loggedIn) return null;

  return (
    <div className="page">
      <header className="hero admin-hero">
        <div className="hero-inner">
          <p className="chip">Admin</p>
          <h1>Catalog Control Center</h1>
          <p>Manage products, prices, stock status, and Cloudinary images.</p>
          <div className="actions">
            <a className="ghost-link" href="/">
              View Shop
            </a>
            <button className="btn secondary" onClick={handleAdminLogout}>
              Logout Admin
            </button>
          </div>
        </div>
      </header>

      <section className="card admin-form-wrap">
        <h2>{editingId ? "Edit Product" : "Add Product"}</h2>
        <p className="muted admin-form-note">
          Upload premium imagery and keep every listing polished for the luxury
          storefront.
        </p>
        <form className="admin-form" onSubmit={saveProduct}>
          <input
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Name"
            required
          />
          <input
            value={form.price}
            onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
            placeholder="Price"
            type="number"
            required
          />
          <input
            value={form.offerPrice}
            onChange={(e) =>
              setForm((p) => ({ ...p, offerPrice: e.target.value }))
            }
            placeholder="Offer Price (optional)"
            type="number"
            min="0"
          />
          <select
            value={categoryChoice}
            onChange={(e) => {
              const selectedCategory = e.target.value;
              setCategoryChoice(selectedCategory);

              if (selectedCategory === CUSTOM_CATEGORY_OPTION) {
                setForm((p) => ({ ...p, category: customCategoryLabel }));
                return;
              }

              setForm((p) => ({ ...p, category: selectedCategory }));
            }}
            required
          >
            {DEFAULT_CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
            <option value={CUSTOM_CATEGORY_OPTION}>Custom Label</option>
          </select>
          {categoryChoice === CUSTOM_CATEGORY_OPTION ? (
            <input
              value={customCategoryLabel}
              onChange={(e) => {
                setCustomCategoryLabel(e.target.value);
                setForm((p) => ({ ...p, category: e.target.value }));
              }}
              placeholder="Custom category label"
              required
            />
          ) : null}
          <input
            value={form.size}
            onChange={(e) => setForm((p) => ({ ...p, size: e.target.value }))}
            placeholder="Size"
          />
          <div className="color-field">
            <input
              value={form.color}
              onChange={(e) =>
                setForm((p) => ({ ...p, color: e.target.value }))
              }
              placeholder="Colors (comma separated, e.g. red, #1E3A8A, navy)"
            />
            <span className="color-dots color-dots-lg">
              {(normalizeColorOptions(form.color).length > 0
                ? normalizeColorOptions(form.color)
                : [""]
              ).map((colorOption, idx) => (
                <span
                  key={`form-color-${idx}`}
                  className="color-dot color-dot-lg"
                  style={{ background: getColorCircleValue(colorOption) }}
                />
              ))}
            </span>
          </div>
          <select
            value={form.stock}
            onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))}
          >
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Sold Out">Sold Out</option>
          </select>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm((p) => ({ ...p, description: e.target.value }))
            }
            placeholder="Description"
          />
          <p className="muted offer-preview">
            {(() => {
              const details = getPriceDetails(form);
              if (!details.hasOffer) {
                return "Add an offer price to show discount percent.";
              }

              return `Offer preview: Rs ${formatPrice(details.finalPrice)} (${details.offerPercent}% OFF)`;
            })()}
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
          <div className="actions">
            <button className="btn" type="submit">
              {editingId ? "Update" : "Add Product"}
            </button>
            {editingId ? (
              <button
                type="button"
                className="btn secondary"
                onClick={() => {
                  setEditingId("");
                  setImageFile(null);
                  setForm({
                    name: "",
                    description: "",
                    price: "",
                    offerPrice: "",
                    size: "",
                    color: "",
                    category: DEFAULT_CATEGORY_OPTIONS[0],
                    stock: "In Stock",
                  });
                  setCategoryChoice(DEFAULT_CATEGORY_OPTIONS[0]);
                  setCustomCategoryLabel("");
                }}
              >
                Cancel
              </button>
            ) : null}
          </div>
        </form>
        {message ? <p className="status">{message}</p> : null}
      </section>

      <section className="grid admin-grid">
        {products.map((product) => {
          const priceDetails = getPriceDetails(product);
          const productColors = normalizeColorOptions(product.color);
          return (
            <article className="product card" key={product.id}>
              <img src={getImageUrl(product.image)} alt={product.name} />
              <div className="product-body">
                <h3>{product.name}</h3>
                <div className="price-block muted">
                  <span className="price-current">
                    Rs {formatPrice(priceDetails.finalPrice)}
                  </span>
                  {priceDetails.hasOffer ? (
                    <>
                      <span className="price-old">
                        Rs {formatPrice(priceDetails.actualPrice)}
                      </span>
                      <span className="offer-badge">
                        {priceDetails.offerPercent}% OFF
                      </span>
                    </>
                  ) : null}
                </div>
                <div className="color-row">
                  <span className="color-dots">
                    {(productColors.length > 0 ? productColors : [""]).map(
                      (colorOption, idx) => (
                        <span
                          key={`${product.id}-admin-color-${idx}`}
                          className="color-dot"
                          style={{
                            background: getColorCircleValue(colorOption),
                          }}
                        />
                      ),
                    )}
                  </span>
                  <span className="muted">
                    {getColorText(product.color, "No color")}
                  </span>
                </div>
                <p
                  className={`stock ${product.stock === "Sold Out" ? "out" : "in"}`}
                >
                  {product.stock || "In Stock"}
                </p>
                <div className="actions">
                  <button
                    className="btn secondary"
                    onClick={() => startEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn"
                    onClick={() => removeProduct(product.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

export default function App() {
  const isClientLogin = window.location.pathname.startsWith(WEBSITE_LOGIN_PATH);
  const isAdmin = window.location.pathname.startsWith("/admin");
  if (isAdmin) {
    if (!readAdminSession()) {
      return <ClientLoginPage />;
    }

    return <AdminPage />;
  }

  if (isClientLogin) {
    return <ClientLoginPage />;
  }

  return <ShopPage />;
}
