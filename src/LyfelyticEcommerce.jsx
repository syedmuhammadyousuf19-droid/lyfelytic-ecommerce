import React, { useState } from 'react';
import { ShoppingCart, LogOut, Plus, Trash2, Menu, X, Package, Home, Upload } from 'lucide-react';

const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .lyfelytic-container {
    min-height: 100vh;
    background: linear-gradient(to bottom right, #f0f9ff, #e0e7ff);
  }

  .lyfelytic-header {
    background: linear-gradient(135deg, #2563eb 0%, #4c1d95 100%);
    color: white;
    padding: 16px 20px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
  }

  .brand h1 {
    font-size: 22px;
    font-weight: bold;
  }

  .brand p {
    color: #e0e7ff;
    font-size: 12px;
    display: none;
  }

  @media (min-width: 768px) {
    .brand p {
      display: block;
      font-size: 14px;
    }
  }

  .nav-buttons {
    display: none;
    gap: 8px;
    flex-wrap: wrap;
  }

  @media (min-width: 768px) {
    .nav-buttons {
      display: flex;
    }
  }

  .nav-btn {
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 6px;
    color: white;
    font-size: 13px;
    white-space: nowrap;
  }

  .nav-btn-shop {
    background: #3b82f6;
  }

  .nav-btn-shop:hover {
    background: #1d4ed8;
    transform: translateY(-2px);
  }

  .nav-btn-admin {
    background: #6366f1;
  }

  .nav-btn-admin:hover {
    background: #4f46e5;
    transform: translateY(-2px);
  }

  .nav-btn-exit {
    background: #ef4444;
  }

  .nav-btn-exit:hover {
    background: #dc2626;
    transform: translateY(-2px);
  }

  .nav-btn-cart {
    background: #eab308;
    color: black;
    position: relative;
  }

  .nav-btn-cart:hover {
    background: #ca8a04;
  }

  .cart-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #dc2626;
    color: white;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: bold;
  }

  .mobile-menu-btn {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 24px;
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (min-width: 768px) {
    .mobile-menu-btn {
      display: none;
    }
  }

  .mobile-menu {
    display: none;
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    background: #1e40af;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    border-top: 2px solid rgba(255,255,255,0.1);
  }

  .mobile-menu.open {
    display: flex;
  }

  @media (min-width: 768px) {
    .mobile-menu {
      display: none !important;
    }
  }

  .mobile-menu-btn-item {
    padding: 12px;
    background: rgba(255,255,255,0.1);
    border: none;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .mobile-menu-btn-item:hover {
    background: rgba(255,255,255,0.2);
  }

  .main-content {
    max-width: 1200px;
    margin: 20px auto;
    padding: 0 16px;
    margin-bottom: 40px;
  }

  .section-title {
    text-align: center;
    margin-bottom: 30px;
  }

  .section-title h2 {
    font-size: 28px;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 8px;
  }

  @media (max-width: 768px) {
    .section-title h2 {
      font-size: 22px;
    }
  }

  .section-title p {
    color: #6b7280;
    font-size: 16px;
  }

  @media (max-width: 768px) {
    .section-title p {
      font-size: 14px;
    }
  }

  .products-container {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 20px;
  }

  @media (max-width: 1024px) {
    .products-container {
      grid-template-columns: 1fr;
    }
  }

  .products-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  @media (max-width: 768px) {
    .products-grid {
      grid-template-columns: 1fr;
    }
  }

  .product-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.15);
  }

  .product-image {
    width: 100%;
    height: 180px;
    background: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    position: relative;
  }

  @media (max-width: 768px) {
    .product-image {
      height: 150px;
    }
  }

  .product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .out-of-stock {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 14px;
  }

  .product-info {
    padding: 16px;
  }

  .product-name {
    font-size: 16px;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 6px;
  }

  .product-description {
    color: #6b7280;
    font-size: 13px;
    margin-bottom: 10px;
    line-height: 1.4;
  }

  .product-price {
    font-size: 20px;
    font-weight: bold;
    color: #2563eb;
    margin-bottom: 4px;
  }

  .product-stock {
    color: #6b7280;
    font-size: 12px;
    margin-bottom: 10px;
  }

  .add-to-cart-btn {
    width: 100%;
    padding: 10px;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 13px;
  }

  .add-to-cart-btn:hover:not(:disabled) {
    background: #1d4ed8;
    transform: translateY(-2px);
  }

  .add-to-cart-btn:disabled {
    background: #d1d5db;
    cursor: not-allowed;
  }

  .cart-sidebar {
    background: white;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    position: sticky;
    top: 90px;
    height: fit-content;
  }

  @media (max-width: 1024px) {
    .cart-sidebar {
      position: static;
    }
  }

  .cart-title {
    font-size: 18px;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .cart-empty {
    text-align: center;
    color: #9ca3af;
    padding: 24px 0;
    font-size: 14px;
  }

  .cart-items {
    max-height: 300px;
    overflow-y: auto;
    margin-bottom: 16px;
  }

  .cart-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 10px;
    margin-bottom: 10px;
    font-size: 13px;
  }

  .cart-item-info {
    flex: 1;
  }

  .cart-item-name {
    font-weight: bold;
    color: #1f2937;
  }

  .cart-item-price {
    color: #2563eb;
    font-weight: bold;
    font-size: 12px;
  }

  .remove-btn {
    background: none;
    border: none;
    color: #ef4444;
    cursor: pointer;
    font-size: 18px;
    padding: 0;
    margin-left: 8px;
  }

  .remove-btn:hover {
    color: #dc2626;
  }

  .cart-total {
    border-top: 2px solid #e5e7eb;
    padding-top: 10px;
    margin-bottom: 10px;
  }

  .total-price {
    font-size: 16px;
    font-weight: bold;
    color: #1f2937;
  }

  .checkout-btn {
    width: 100%;
    padding: 12px;
    background: #22c55e;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 13px;
  }

  .checkout-btn:hover {
    background: #16a34a;
    transform: translateY(-2px);
  }

  .admin-panel {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  }

  @media (max-width: 768px) {
    .admin-panel {
      padding: 16px;
    }
  }

  .admin-title {
    font-size: 24px;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  @media (max-width: 768px) {
    .admin-title {
      font-size: 20px;
      margin-bottom: 16px;
    }
  }

  .add-product-form {
    background: #eff6ff;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
  }

  @media (max-width: 768px) {
    .add-product-form {
      padding: 16px;
      margin-bottom: 16px;
    }
  }

  .form-title {
    font-size: 16px;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 12px;
  }

  @media (max-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr;
      gap: 10px;
    }
  }

  .form-full {
    grid-column: 1 / -1;
  }

  .form-input {
    padding: 10px;
    border: 2px solid #d1d5db;
    border-radius: 8px;
    font-size: 13px;
    transition: all 0.3s ease;
    font-family: inherit;
  }

  .form-input:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  .form-textarea {
    resize: vertical;
    min-height: 70px;
  }

  .image-upload-area {
    border: 2px dashed #d1d5db;
    border-radius: 8px;
    padding: 16px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #f9fafb;
  }

  .image-upload-area:hover {
    border-color: #2563eb;
    background: #f0f9ff;
  }

  .image-upload-area input {
    display: none;
  }

  .upload-text {
    font-size: 13px;
    color: #6b7280;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .image-preview {
    margin-top: 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .preview-item {
    position: relative;
    width: 80px;
    height: 80px;
  }

  .preview-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }

  .remove-image-btn {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }

  .submit-btn {
    background: #22c55e;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 13px;
  }

  .submit-btn:hover {
    background: #16a34a;
    transform: translateY(-2px);
  }

  .products-management {
    margin-top: 24px;
  }

  .management-title {
    font-size: 16px;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 16px;
  }

  .products-management-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  @media (max-width: 768px) {
    .products-management-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }
  }

  .product-management-card {
    background: #f9fafb;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 12px;
    transition: all 0.3s ease;
  }

  .product-management-card:hover {
    border-color: #2563eb;
    background: #f0f9ff;
  }

  .product-management-image {
    width: 100%;
    height: 120px;
    background: #e5e7eb;
    border-radius: 8px;
    margin-bottom: 10px;
    overflow: hidden;
  }

  .product-management-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .delete-btn {
    width: 100%;
    padding: 10px;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 10px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 13px;
  }

  .delete-btn:hover {
    background: #dc2626;
    transform: translateY(-2px);
  }

  .footer {
    background: #1f2937;
    color: white;
    text-align: center;
    padding: 32px 20px;
  }

  .footer p {
    margin: 6px 0;
    font-size: 14px;
  }
`;

export default function LyfelyticEcommerce() {
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Wireless Earbuds',
      price: 2499,
      description: 'High-quality wireless earbuds with noise cancellation',
      image: 'https://via.placeholder.com/300x300?text=Wireless+Earbuds',
      stock: 15
    },
    {
      id: 2,
      name: 'Phone Stand',
      price: 599,
      description: 'Adjustable phone stand for all devices',
      image: 'https://via.placeholder.com/300x300?text=Phone+Stand',
      stock: 25
    }
  ]);

  const [cart, setCart] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    stock: ''
  });

  // Add to Cart
  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  // Remove from Cart
  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Product (Admin)
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (newProduct.name && newProduct.price && newProduct.image && newProduct.stock) {
      setProducts([
        ...products,
        {
          id: Date.now(),
          ...newProduct,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock)
        }
      ]);
      setNewProduct({ name: '', price: '', description: '', image: '', stock: '' });
      alert('✅ Product added successfully!');
    } else {
      alert('❌ Please fill all fields and upload an image!');
    }
  };

  // Delete Product (Admin)
  const handleDeleteProduct = (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
      alert('✅ Product deleted successfully!');
    }
  };

  // Calculate Total
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  const whatsappNumber = '03442035118';

  // WhatsApp Order
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    const orderDetails = cart.map(item => `${item.name} - Rs.${item.price}`).join('\n');
    const message = `Order Request:\n${orderDetails}\n\nTotal: Rs.${totalPrice}\n\nPlease confirm availability and delivery time.`;
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Admin Password Check
  const handleAdminClick = () => {
    const password = prompt('Enter admin password:');
    if (password === 'lyfelytic2024') {
      setIsAdmin(true);
      setMobileMenuOpen(false);
    } else if (password !== null) {
      alert('❌ Wrong password!');
    }
  };

  return (
    <div className="lyfelytic-container">
      <style>{styles}</style>

      {/* Header */}
      <header className="lyfelytic-header">
        <div className="header-content">
          <div className="brand">
            <Package size={28} />
            <div>
              <h1>Lyfelytic</h1>
              <p>Daily Life Accessories</p>
            </div>
          </div>

          <div className="nav-buttons">
            {!isAdmin && (
              <>
                <button onClick={() => setIsAdmin(false)} className="nav-btn nav-btn-shop">
                  <Home size={16} /> Shop
                </button>
                <button onClick={handleAdminClick} className="nav-btn nav-btn-admin">
                  Admin
                </button>
                <button className="nav-btn nav-btn-cart">
                  <ShoppingCart size={16} />
                  {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
                </button>
              </>
            )}
            {isAdmin && (
              <button onClick={() => setIsAdmin(false)} className="nav-btn nav-btn-exit">
                <LogOut size={16} /> Exit
              </button>
            )}
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          {!isAdmin && (
            <>
              <button
                onClick={() => {
                  setIsAdmin(false);
                  setMobileMenuOpen(false);
                }}
                className="mobile-menu-btn-item"
              >
                <Home size={18} /> Shop
              </button>
              <button
                onClick={() => {
                  handleAdminClick();
                }}
                className="mobile-menu-btn-item"
              >
                Admin
              </button>
              <button className="mobile-menu-btn-item">
                <ShoppingCart size={18} /> Cart {cart.length > 0 && `(${cart.length})`}
              </button>
            </>
          )}
          {isAdmin && (
            <button
              onClick={() => {
                setIsAdmin(false);
                setMobileMenuOpen(false);
              }}
              className="mobile-menu-btn-item"
            >
              <LogOut size={18} /> Exit Admin
            </button>
          )}
        </div>
      </header>

      <main className="main-content">
        {/* Shop View */}
        {!isAdmin && (
          <div>
            <div className="section-title">
              <h2>Daily Life Accessories</h2>
              <p>Quality products delivered to your doorstep via COD</p>
            </div>

            <div className="products-container">
              {/* Products Grid */}
              <div>
                <div className="products-grid">
                  {products.map(product => (
                    <div key={product.id} className="product-card">
                      <div className="product-image">
                        <img src={product.image} alt={product.name} />
                        {product.stock === 0 && (
                          <div className="out-of-stock">Out of Stock</div>
                        )}
                      </div>
                      <div className="product-info">
                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-description">{product.description}</p>
                        <p className="product-price">Rs.{product.price}</p>
                        <p className="product-stock">{product.stock} in stock</p>
                        <button
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                          className="add-to-cart-btn"
                        >
                          <ShoppingCart size={16} />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Sidebar */}
              <div className="cart-sidebar">
                <div className="cart-title">
                  <ShoppingCart size={18} />
                  Your Cart
                </div>

                {cart.length === 0 ? (
                  <div className="cart-empty">Your cart is empty</div>
                ) : (
                  <>
                    <div className="cart-items">
                      {cart.map((item, index) => (
                        <div key={index} className="cart-item">
                          <div className="cart-item-info">
                            <div className="cart-item-name">{item.name}</div>
                            <div className="cart-item-price">Rs.{item.price}</div>
                          </div>
                          <button onClick={() => removeFromCart(index)} className="remove-btn">
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="cart-total">
                      <div className="total-price">Total: Rs.{totalPrice}</div>
                    </div>

                    <button onClick={handleCheckout} className="checkout-btn">
                      📱 WhatsApp Order
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Admin View */}
        {isAdmin && (
          <div className="admin-panel">
            <div className="admin-title">
              <Package size={24} />
              Admin Panel
            </div>

            {/* Add Product Form */}
            <div className="add-product-form">
              <div className="form-title">
                <Plus size={18} />
                Add New Product
              </div>
              <form onSubmit={handleAddProduct}>
                <div className="form-grid">
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="form-input"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Price (Rs.)"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="form-input"
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="form-input form-textarea form-full"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                {/* Image Upload */}
                <div className="form-full">
                  <label className="image-upload-area">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      required
                    />
                    <div className="upload-text">
                      <Upload size={20} />
                      Click to upload product image
                    </div>
                  </label>

                  {newProduct.image && (
                    <div className="image-preview">
                      <div className="preview-item">
                        <img src={newProduct.image} alt="preview" />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => setNewProduct({ ...newProduct, image: '' })}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button type="submit" className="submit-btn">
                  Add Product
                </button>
              </form>
            </div>

            {/* Products Management */}
            <div className="products-management">
              <div className="management-title">Manage Products</div>
              <div className="products-management-grid">
                {products.map(product => (
                  <div key={product.id} className="product-management-card">
                    <div className="product-management-image">
                      <img src={product.image} alt={product.name} />
                    </div>
                    <h4 className="product-name">{product.name}</h4>
                    <p className="product-price">Rs.{product.price}</p>
                    <p className="product-description">{product.description}</p>
                    <p className="product-stock">Stock: {product.stock}</p>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="delete-btn"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>📞 WhatsApp: 03442035118</p>
        <p>💳 Payment: Cash on Delivery (COD)</p>
        <p>🚚 Free delivery available</p>
        <p style={{ marginTop: '12px', color: '#9ca3af' }}>© 2024 Lyfelytic. All rights reserved.</p>
      </footer>
    </div>
  );
}
