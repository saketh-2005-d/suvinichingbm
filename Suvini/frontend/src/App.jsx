import { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "suvini.clothing@gmail.com";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "surekhasravan";

function getImageUrl(image) {
  if (!image) return "https://via.placeholder.com/320x380?text=No+Image";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  const apiOrigin = new URL(API_BASE).origin;
  return `${apiOrigin}${image}`;
}

async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, options);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }
  return response.json();
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

  const wishlistByClothId = useMemo(
    () => new Set(wishlist.map((item) => item.clothId)),
    [wishlist],
  );

  const categories = useMemo(() => {
    const values = products.map((p) => p.category).filter(Boolean);
    return Array.from(new Set(values)).sort();
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const bySearch = product.name?.toLowerCase().includes(search.toLowerCase());
      const byCategory = !category || product.category === category;
      return bySearch && byCategory;
    });
  }, [products, search, category]);

  const selectedWishlistItems = useMemo(() => {
    return wishlist
      .map((item) => ({ ...item, clothDetails: products.find((p) => p.id === item.clothId) }))
      .filter((item) => item.clothDetails);
  }, [wishlist, products]);

  async function loadData() {
    try {
      setLoading(true);
      setError("");
      const [productsData, wishlistData] = await Promise.all([
        apiFetch("/clothes"),
        apiFetch("/wishlist/details/all"),
      ]);
      setProducts(productsData);
      setWishlist(wishlistData);
    } catch (err) {
      setError("Failed to load products. Check backend deployment and CORS settings.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function toggleWishlist(productId) {
    try {
      if (wishlistByClothId.has(productId)) {
        await apiFetch(`/wishlist/cloth/${productId}`, { method: "DELETE" });
      } else {
        await apiFetch("/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clothId: productId }),
        });
      }
      await loadData();
    } catch (err) {
      alert("Could not update wishlist");
    }
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

    const payload = {
      customerName: orderName,
      phone: orderPhone,
      items: selectedWishlistItems.map((item) => ({
        id: item.clothDetails.id,
        name: item.clothDetails.name,
        price: item.clothDetails.price,
        size: item.clothDetails.size,
        color: item.clothDetails.color,
        image: item.clothDetails.image,
      })),
      totalAmount: selectedWishlistItems.reduce(
        (sum, item) => sum + Number(item.clothDetails.price || 0),
        0,
      ),
    };

    try {
      const response = await apiFetch("/whatsapp/send-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      window.open(response.link, "_blank");
    } catch (err) {
      alert("Failed to create WhatsApp order link.");
    }
  }

  return (
    <div className="page">
      <header className="hero">
        <div className="hero-inner">
          <p className="chip">Suvini Clothing</p>
          <h1>Modern Indianwear, Ready to Order</h1>
          <p>
            Fresh catalog, quick WhatsApp checkout, and a smooth mobile-first shopping
            experience.
          </p>
          <a className="ghost-link" href="/admin">
            Open Admin Panel
          </a>
        </div>
      </header>

      <section className="toolbar card">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by product name"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </section>

      {loading ? <p className="status">Loading products...</p> : null}
      {error ? <p className="status error">{error}</p> : null}

      <section className="grid">
        {filtered.map((product) => {
          const inWishlist = wishlistByClothId.has(product.id);
          const soldOut = product.stock === "Sold Out";
          return (
            <article className="product card" key={product.id}>
              <img src={getImageUrl(product.image)} alt={product.name} />
              <div className="product-body">
                <h3>{product.name}</h3>
                <p className="muted">{product.category || "General"}</p>
                <p className="price">Rs {product.price}</p>
                <p className={`stock ${soldOut ? "out" : "in"}`}>
                  {product.stock || "In Stock"}
                </p>
                <div className="actions">
                  <button onClick={() => setSelected(product)} className="btn secondary">
                    Details
                  </button>
                  <button
                    className="btn"
                    disabled={soldOut}
                    onClick={() => toggleWishlist(product.id)}
                  >
                    {inWishlist ? "Remove" : "Wishlist"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="wishlist card">
        <h2>Wishlist Checkout</h2>
        <p className="muted">Items in wishlist: {selectedWishlistItems.length}</p>
        <div className="order-row">
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
            Order on WhatsApp
          </button>
        </div>
      </section>

      {selected ? (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal card" onClick={(e) => e.stopPropagation()}>
            <img src={getImageUrl(selected.image)} alt={selected.name} />
            <h3>{selected.name}</h3>
            <p>{selected.description || "Premium quality piece from Suvini."}</p>
            <p className="muted">
              Size: {selected.size || "All"} | Color: {selected.color || "Various"}
            </p>
            <button className="btn" onClick={() => setSelected(null)}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    size: "",
    color: "",
    category: "",
    stock: "In Stock",
  });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");

  async function loadProducts() {
    const data = await apiFetch("/clothes");
    setProducts(data);
  }

  useEffect(() => {
    if (loggedIn) {
      loadProducts().catch(() => setMessage("Failed to load products"));
    }
  }, [loggedIn]);

  function login(e) {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      setMessage("");
      return;
    }
    setMessage("Invalid admin credentials");
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      size: product.size || "",
      color: product.color || "",
      category: product.category || "",
      stock: product.stock || "In Stock",
    });
    setImageFile(null);
  }

  async function saveProduct(e) {
    e.preventDefault();
    setMessage("");

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
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
        size: "",
        color: "",
        category: "",
        stock: "In Stock",
      });
      setImageFile(null);
      setEditingId("");
      setMessage("Saved successfully");
      await loadProducts();
    } catch (err) {
      setMessage("Failed to save product");
    }
  }

  async function removeProduct(id) {
    const yes = window.confirm("Delete this product?");
    if (!yes) return;

    try {
      await apiFetch(`/clothes/${id}`, { method: "DELETE" });
      setMessage("Deleted successfully");
      await loadProducts();
    } catch (err) {
      setMessage("Delete failed");
    }
  }

  if (!loggedIn) {
    return (
      <div className="page admin-login-wrap">
        <form className="card admin-login" onSubmit={login}>
          <h2>Admin Login</h2>
          <p className="muted">Use credentials from frontend env variables.</p>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
          <button className="btn" type="submit">
            Login
          </button>
          <a className="ghost-link" href="/">
            Back to Shop
          </a>
          {message ? <p className="status error">{message}</p> : null}
        </form>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="hero admin-hero">
        <div className="hero-inner">
          <p className="chip">Admin</p>
          <h1>Catalog Control Center</h1>
          <p>Manage products, prices, stock status, and Cloudinary images.</p>
          <a className="ghost-link" href="/">
            View Shop
          </a>
        </div>
      </header>

      <section className="card admin-form-wrap">
        <h2>{editingId ? "Edit Product" : "Add Product"}</h2>
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
            value={form.category}
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            placeholder="Category"
          />
          <input
            value={form.size}
            onChange={(e) => setForm((p) => ({ ...p, size: e.target.value }))}
            placeholder="Size"
          />
          <input
            value={form.color}
            onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
            placeholder="Color"
          />
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
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Description"
          />
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
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
                    size: "",
                    color: "",
                    category: "",
                    stock: "In Stock",
                  });
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
        {products.map((product) => (
          <article className="product card" key={product.id}>
            <img src={getImageUrl(product.image)} alt={product.name} />
            <div className="product-body">
              <h3>{product.name}</h3>
              <p className="muted">Rs {product.price}</p>
              <p className={`stock ${product.stock === "Sold Out" ? "out" : "in"}`}>
                {product.stock || "In Stock"}
              </p>
              <div className="actions">
                <button className="btn secondary" onClick={() => startEdit(product)}>
                  Edit
                </button>
                <button className="btn" onClick={() => removeProduct(product.id)}>
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

export default function App() {
  const isAdmin = window.location.pathname.startsWith("/admin");
  return isAdmin ? <AdminPage /> : <ShopPage />;
}
