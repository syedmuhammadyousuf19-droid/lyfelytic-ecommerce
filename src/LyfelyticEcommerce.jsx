import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, LogOut, Plus, Trash2, Menu, X, Package, Home, Upload, ArrowLeft, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { supabase } from './supabaseClient';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body, #root { height: 100%; }
  body { font-family: 'Inter', 'Segoe UI', sans-serif; }

  /* ── THEME TOKENS ── */
  :root {
    --cream:    #f7f3ee;
    --beige:    #ede8df;
    --sand:     #d9cfc2;
    --brown:    #7c5c3e;
    --brown-dk: #5a3e28;
    --terra:    #c0714f;
    --terra-lt: #e8927a;
    --text:     #2e1f10;
    --text-md:  #6b5744;
    --text-lt:  #a08c7a;
    --white:    #ffffff;
    --shadow:   rgba(90,62,40,0.12);
  }

  .lyfelytic-container {
    min-height: 100vh;
    background: var(--cream);
  }

  /* ── HEADER ── */
  .lyfelytic-header {
    background: var(--brown-dk);
    color: var(--white);
    padding: 16px 20px;
    box-shadow: 0 4px 20px var(--shadow);
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
  .brand { display: flex; align-items: center; gap: 12px; flex: 1; }
  .brand h1 { font-size: 22px; font-weight: 700; font-family: 'Playfair Display', serif; letter-spacing: 0.5px; }
  .brand p { color: var(--sand); font-size: 12px; display: none; }
  @media (min-width: 768px) { .brand p { display: block; font-size: 13px; } }

  .nav-buttons { display: none; gap: 8px; flex-wrap: wrap; }
  @media (min-width: 768px) { .nav-buttons { display: flex; } }

  .nav-btn {
    padding: 9px 16px; border: none; border-radius: 6px;
    font-weight: 600; cursor: pointer; transition: all 0.25s ease;
    display: flex; align-items: center; gap: 6px;
    color: var(--white); font-size: 13px; white-space: nowrap;
  }
  .nav-btn-shop { background: rgba(255,255,255,0.15); border: 1.5px solid rgba(255,255,255,0.35); backdrop-filter: blur(6px); }
  .nav-btn-shop:hover { background: rgba(255,255,255,0.28); transform: translateY(-1px); }
  .nav-btn-admin { background: rgba(192,113,79,0.35); border: 1.5px solid rgba(255,255,255,0.3); backdrop-filter: blur(6px); }
  .nav-btn-admin:hover { background: rgba(192,113,79,0.55); transform: translateY(-1px); }
  .nav-btn-exit { background: rgba(139,42,42,0.35); border: 1.5px solid rgba(255,255,255,0.25); backdrop-filter: blur(6px); }
  .nav-btn-exit:hover { background: rgba(139,42,42,0.55); transform: translateY(-1px); }
  .nav-btn-cart { background: rgba(255,255,255,0.2); border: 1.5px solid rgba(255,255,255,0.4); color: var(--white); position: relative; backdrop-filter: blur(6px); }
  .nav-btn-cart:hover { background: rgba(255,255,255,0.32); }
  .cart-badge {
    position: absolute; top: -8px; right: -8px;
    background: var(--brown-dk); color: white; border-radius: 50%;
    width: 22px; height: 22px; display: flex;
    align-items: center; justify-content: center;
    font-size: 11px; font-weight: bold;
  }

  .mobile-menu-btn {
    background: none; border: none; color: white;
    cursor: pointer; font-size: 24px; padding: 5px;
    display: flex; align-items: center; justify-content: center;
  }
  @media (min-width: 768px) { .mobile-menu-btn { display: none; } }

  .mobile-menu {
    display: none; position: absolute; top: 70px; left: 0; right: 0;
    background: var(--brown-dk); flex-direction: column; gap: 8px;
    padding: 12px; border-top: 2px solid rgba(255,255,255,0.1);
  }
  .mobile-menu.open { display: flex; }
  @media (min-width: 768px) { .mobile-menu { display: none !important; } }
  .mobile-menu-btn-item {
    padding: 12px; background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.2); color: white; border-radius: 8px;
    cursor: pointer; font-weight: 600; transition: all 0.25s ease;
    display: flex; align-items: center; gap: 8px;
    backdrop-filter: blur(6px);
  }
  .mobile-menu-btn-item:hover { background: rgba(255,255,255,0.22); }

  /* ── MAIN ── */
  .main-content {
    max-width: 1200px; margin: 20px auto;
    padding: 0 16px; margin-bottom: 40px;
  }
  .section-title { text-align: center; margin-bottom: 30px; }
  .section-title h2 { font-size: 28px; font-weight: 700; font-family: 'Playfair Display', serif; color: var(--text); margin-bottom: 8px; }
  @media (max-width: 768px) { .section-title h2 { font-size: 22px; } }
  .section-title p { color: var(--text-md); font-size: 15px; }

  /* ── SHOP GRID ── */
  .products-container {
    display: grid;
    grid-template-columns: 1fr 280px;
    gap: 20px;
  }
  @media (max-width: 1024px) { .products-container { grid-template-columns: 1fr; } }

  .products-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 768px) { .products-grid { grid-template-columns: 1fr; } }

  .product-card {
    background: var(--white); border-radius: 12px; overflow: hidden;
    box-shadow: 0 2px 12px var(--shadow);
    transition: all 0.3s ease; cursor: pointer;
    border: 1px solid var(--beige);
  }
  .product-card:hover { transform: translateY(-4px); box-shadow: 0 10px 28px var(--shadow); }

  .product-image {
    width: 100%; height: 200px; background: var(--beige);
    display: flex; align-items: center; justify-content: center;
    overflow: hidden; position: relative;
  }
  @media (max-width: 768px) { .product-image { height: 160px; } }
  .product-image img { width: 100%; height: 100%; object-fit: cover; }

  .out-of-stock {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(46,31,16,0.65); display: flex;
    align-items: center; justify-content: center;
    color: white; font-weight: bold; font-size: 14px;
  }

  .product-info { padding: 14px; }
  .product-name { font-size: 15px; font-weight: 600; color: var(--text); margin-bottom: 5px; font-family: 'Playfair Display', serif; }
  .product-description { color: var(--text-md); font-size: 12px; margin-bottom: 10px; line-height: 1.5; }
  .product-price { font-size: 19px; font-weight: 700; color: var(--terra); margin-bottom: 4px; }
  .product-stock { color: var(--text-lt); font-size: 12px; margin-bottom: 10px; }

  .view-details-btn {
    width: 100%; padding: 8px;
    background: rgba(124,92,62,0.08);
    color: var(--brown); border: 1.5px solid rgba(124,92,62,0.35);
    border-radius: 8px; font-weight: 600; cursor: pointer;
    transition: all 0.25s ease; font-size: 13px; margin-bottom: 8px;
    backdrop-filter: blur(4px);
  }
  .view-details-btn:hover { background: rgba(124,92,62,0.18); border-color: var(--brown); }

  .add-to-cart-btn {
    width: 100%; padding: 10px;
    background: rgba(192,113,79,0.85);
    color: white; border: 1.5px solid rgba(192,113,79,0.6);
    border-radius: 8px; font-weight: 600; cursor: pointer;
    transition: all 0.25s ease; backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    gap: 6px; font-size: 13px;
  }
  .add-to-cart-btn:hover:not(:disabled) { background: rgba(168,94,63,0.95); transform: translateY(-1px); }
  .add-to-cart-btn:disabled { background: rgba(217,207,194,0.6); cursor: not-allowed; border-color: var(--sand); }

  /* ── CART SIDEBAR ── */
  .cart-sidebar {
    background: var(--white); border-radius: 12px; padding: 16px;
    box-shadow: 0 2px 12px var(--shadow); border: 1px solid var(--beige);
    position: sticky; top: 90px; height: fit-content;
  }
  @media (max-width: 1024px) { .cart-sidebar { position: static; } }
  .cart-title { font-size: 17px; font-weight: 700; color: var(--text); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; font-family: 'Playfair Display', serif; }
  .cart-empty { text-align: center; color: var(--text-lt); padding: 24px 0; font-size: 14px; }
  .cart-items { max-height: 300px; overflow-y: auto; margin-bottom: 16px; }
  .cart-item {
    display: flex; justify-content: space-between; align-items: flex-start;
    border-bottom: 1px solid var(--beige); padding-bottom: 10px; margin-bottom: 10px; font-size: 13px;
  }
  .cart-item-info { flex: 1; }
  .cart-item-name { font-weight: 600; color: var(--text); }
  .cart-item-price { color: var(--terra); font-weight: 700; font-size: 12px; }
  .remove-btn { background: none; border: none; color: var(--terra); cursor: pointer; font-size: 18px; padding: 0; margin-left: 8px; }
  .remove-btn:hover { color: var(--brown-dk); }
  .cart-total { border-top: 2px solid var(--beige); padding-top: 10px; margin-bottom: 10px; }
  .total-price { font-size: 16px; font-weight: 700; color: var(--text); }
  .checkout-btn {
    width: 100%; padding: 12px;
    background: rgba(124,92,62,0.85);
    color: white; border: 1.5px solid rgba(124,92,62,0.5);
    border-radius: 8px; font-weight: 700; cursor: pointer;
    transition: all 0.25s ease; backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    gap: 6px; font-size: 13px;
  }
  .checkout-btn:hover { background: rgba(90,62,40,0.95); transform: translateY(-1px); }

  /* ══════════════════════════════════════
     DARAZ-STYLE PRODUCT PAGE
  ══════════════════════════════════════ */
  .product-page {
    background: #f5f5f5;
    min-height: 100vh;
    padding-bottom: 100px;
    max-width: 680px;
    margin: 0 auto;
    box-shadow: 0 0 40px rgba(0,0,0,0.08);
  }

  .product-page-back {
    display: flex; align-items: center; gap: 8px;
    background: var(--white); padding: 14px 16px;
    border: none; cursor: pointer; width: 100%;
    font-size: 15px; font-weight: 600; color: var(--brown);
    border-bottom: 1px solid var(--beige);
    transition: background 0.2s;
  }
  .product-page-back:hover { background: var(--cream); }

  /* Gallery */
  .gallery-wrapper {
    background: white;
    position: relative;
    overflow: hidden;
    user-select: none;
  }

  .gallery-main {
    position: relative;
    width: 100%;
    height: 300px;
    overflow: hidden;
    touch-action: pan-y;
  }

  @media (min-width: 768px) {
    .gallery-main {
      height: 380px;
    }
  }

  .gallery-slides {
    display: flex;
    height: 100%;
    transition: transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94);
  }

  .gallery-slide {
    min-width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--beige);
  }

  .gallery-slide img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 8px;
  }

  .gallery-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255,255,255,0.92);
    border: none;
    border-radius: 50%;
    width: 38px; height: 38px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.18);
    z-index: 10;
    transition: background 0.2s;
  }
  .gallery-arrow:hover { background: white; }
  .gallery-arrow-left { left: 10px; }
  .gallery-arrow-right { right: 10px; }
  .gallery-arrow-hidden { opacity: 0; pointer-events: none; }

  /* Dot indicators */
  .gallery-dots {
    display: flex;
    justify-content: center;
    gap: 6px;
    padding: 10px 0 6px;
    background: white;
  }
  .gallery-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--sand);
    border: none;
    cursor: pointer;
    transition: all 0.25s;
    padding: 0;
  }
  .gallery-dot.active {
    background: var(--terra);
    width: 22px;
    border-radius: 4px;
  }

  /* Thumbnails */
  .gallery-thumbs {
    display: flex;
    gap: 8px;
    padding: 10px 16px 14px;
    background: white;
    overflow-x: auto;
    border-bottom: 1px solid #f0f0f0;
  }
  .gallery-thumbs::-webkit-scrollbar { height: 3px; }
  .gallery-thumbs::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 2px; }

  .gallery-thumb {
    flex-shrink: 0;
    width: 60px; height: 60px;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid transparent;
    cursor: pointer;
    transition: border-color 0.2s;
    background: var(--beige);
  }
  .gallery-thumb.active { border-color: var(--terra); }
  .gallery-thumb img { width: 100%; height: 100%; object-fit: cover; }

  /* Product details card */
  .product-details-card {
    background: var(--white);
    margin-top: 8px;
    padding: 18px 16px;
  }

  .product-page-price {
    font-size: 28px;
    font-weight: 800;
    color: var(--terra);
    margin-bottom: 4px;
  }

  .product-page-name {
    font-size: 18px;
    font-weight: 700;
    font-family: 'Playfair Display', serif;
    color: var(--text);
    line-height: 1.4;
    margin-bottom: 10px;
  }

  .product-page-rating {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 12px;
  }
  .stars { display: flex; gap: 2px; }
  .rating-text { font-size: 13px; color: #6b7280; }

  .product-page-badges {
    display: flex; flex-wrap: wrap; gap: 8px;
    margin-bottom: 14px;
  }
  .badge {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
  }
  .badge-cod { background: #fdf3e7; color: var(--brown); }
  .badge-stock { background: #edf7ed; color: #2d6a2d; }
  .badge-oos { background: #fdecea; color: #8b2a2a; }

  .product-page-divider {
    height: 1px;
    background: var(--beige);
    margin: 14px 0;
  }

  .product-page-desc-title {
    font-size: 12px;
    font-weight: 700;
    color: var(--text-lt);
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .product-page-desc {
    font-size: 14px;
    color: var(--text-md);
    line-height: 1.7;
  }

  /* Sticky bottom bar */
  .product-page-bottom {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 680px;
    background: white;
    border-top: 1px solid #e5e7eb;
    padding: 12px 16px;
    display: flex;
    gap: 10px;
    z-index: 200;
    box-shadow: 0 -4px 20px rgba(0,0,0,0.1);
  }

  .btn-whatsapp {
    flex: 1; padding: 13px;
    background: rgba(124,92,62,0.88);
    color: white; border: 1.5px solid rgba(124,92,62,0.5);
    border-radius: 10px; font-weight: 700; font-size: 14px;
    cursor: pointer; backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    gap: 6px; transition: all 0.2s;
  }
  .btn-whatsapp:hover { background: rgba(90,62,40,0.96); }

  .btn-add-cart {
    flex: 1; padding: 13px;
    background: rgba(192,113,79,0.88);
    color: white; border: 1.5px solid rgba(192,113,79,0.5);
    border-radius: 10px; font-weight: 700; font-size: 14px;
    cursor: pointer; backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center;
    gap: 6px; transition: all 0.2s;
  }
  .btn-add-cart:hover:not(:disabled) { background: rgba(168,94,63,0.96); }
  .btn-add-cart:disabled { background: rgba(217,207,194,0.6); border-color: var(--sand); cursor: not-allowed; }

  /* ══════════════════════════════════════
     ADMIN PANEL
  ══════════════════════════════════════ */
  .admin-panel {
    background: var(--white); border-radius: 12px;
    padding: 20px; box-shadow: 0 2px 12px var(--shadow);
    border: 1px solid var(--beige);
  }
  @media (max-width: 768px) { .admin-panel { padding: 16px; } }

  .admin-title {
    font-size: 24px; font-weight: 700; font-family: 'Playfair Display', serif; color: var(--text);
    margin-bottom: 24px; display: flex; align-items: center; gap: 12px;
  }
  @media (max-width: 768px) { .admin-title { font-size: 20px; margin-bottom: 16px; } }

  .add-product-form {
    background: var(--cream); border-radius: 12px;
    padding: 20px; margin-bottom: 24px;
    border: 1px solid var(--beige);
  }
  @media (max-width: 768px) { .add-product-form { padding: 16px; margin-bottom: 16px; } }

  .form-title {
    font-size: 16px; font-weight: 700; color: var(--text);
    margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
  }

  .form-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 12px; margin-bottom: 12px;
  }
  @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; gap: 10px; } }
  .form-full { grid-column: 1 / -1; }

  .form-input {
    padding: 10px; border: 1.5px solid var(--sand);
    border-radius: 8px; font-size: 13px;
    transition: all 0.3s ease; font-family: inherit;
    width: 100%; background: var(--white); color: var(--text);
  }
  .form-input:focus {
    outline: none; border-color: var(--brown);
    box-shadow: 0 0 0 3px rgba(124,92,62,0.12);
  }
  .form-textarea { resize: vertical; min-height: 70px; }

  /* Multi-image upload */
  .image-upload-area {
    border: 2px dashed var(--sand); border-radius: 8px;
    padding: 20px; text-align: center; cursor: pointer;
    transition: all 0.3s ease; background: var(--white);
    display: block;
  }
  .image-upload-area:hover { border-color: var(--brown); background: var(--cream); }
  .image-upload-area input { display: none; }
  .upload-text {
    font-size: 13px; color: var(--text-md);
    display: flex; align-items: center;
    justify-content: center; gap: 8px;
  }
  .upload-hint {
    font-size: 11px; color: var(--text-lt); margin-top: 4px;
  }

  .image-preview {
    margin-top: 14px; display: flex;
    flex-wrap: wrap; gap: 10px;
  }
  .preview-item {
    position: relative;
    width: 80px; height: 80px;
  }
  .preview-item img {
    width: 100%; height: 100%;
    object-fit: cover; border-radius: 8px;
    border: 2px solid #e5e7eb;
  }
  .preview-item.primary img { border-color: #2563eb; }
  .preview-primary-badge {
    position: absolute;
    bottom: -2px; left: 0; right: 0;
    background: var(--terra); color: white;
    font-size: 9px; font-weight: 700;
    text-align: center; padding: 2px;
    border-radius: 0 0 6px 6px;
  }
  .remove-image-btn {
    position: absolute; top: -8px; right: -8px;
    background: var(--brown-dk); color: white;
    border: none; border-radius: 50%;
    width: 22px; height: 22px; cursor: pointer;
    display: flex; align-items: center;
    justify-content: center; font-size: 12px;
    font-weight: bold;
  }

  .submit-btn {
    background: rgba(192,113,79,0.88); color: white;
    padding: 11px 24px; border: 1.5px solid rgba(192,113,79,0.5);
    border-radius: 8px; font-weight: 700;
    cursor: pointer; transition: all 0.25s ease; font-size: 14px;
    margin-top: 4px; backdrop-filter: blur(4px);
  }
  .submit-btn:hover { background: rgba(168,94,63,0.96); transform: translateY(-1px); }
  .submit-btn:disabled { background: rgba(217,207,194,0.6); border-color: var(--sand); cursor: not-allowed; transform: none; }

  /* Admin product cards */
  .products-management { margin-top: 24px; }
  .management-title { font-size: 16px; font-weight: bold; color: #1f2937; margin-bottom: 16px; }

  .products-management-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
  }
  @media (max-width: 768px) { .products-management-grid { grid-template-columns: 1fr; gap: 12px; } }

  .product-management-card {
    background: var(--cream); border: 1.5px solid var(--beige);
    border-radius: 12px; padding: 12px; transition: all 0.25s ease;
  }
  .product-management-card:hover { border-color: var(--brown); background: #f5ede3; }

  .product-management-image {
    width: 100%; height: 120px; background: var(--beige);
    border-radius: 8px; margin-bottom: 10px; overflow: hidden;
  }
  .product-management-image img { width: 100%; height: 100%; object-fit: cover; }
  .product-management-img-count {
    font-size: 11px; color: var(--text-lt); margin-bottom: 6px;
  }

  .delete-btn {
    width: 100%; padding: 10px;
    background: rgba(139,42,42,0.82);
    color: white; border: 1.5px solid rgba(139,42,42,0.4);
    border-radius: 8px; font-weight: 700; cursor: pointer; margin-top: 10px;
    transition: all 0.25s ease; backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    gap: 6px; font-size: 13px;
  }
  .delete-btn:hover { background: rgba(110,31,31,0.96); transform: translateY(-1px); }

  /* FOOTER */
  .footer {
    background: var(--brown-dk); color: var(--sand);
    text-align: center; padding: 32px 20px;
  }
  .footer p { margin: 6px 0; font-size: 14px; }
`;

/* ─────────────────────────────────────────────
   DARAZ-STYLE PRODUCT PAGE COMPONENT
───────────────────────────────────────────── */
function ProductPage({ product, onBack, onAddToCart }) {
  const images = (product.images && product.images.length > 0)
    ? product.images
    : (product.image ? [product.image] : []);

  const [current, setCurrent] = useState(0);
  const touchStartX = useRef(null);

  const goTo = (idx) => {
    if (idx < 0 || idx >= images.length) return;
    setCurrent(idx);
  };

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? goTo(current + 1) : goTo(current - 1);
    touchStartX.current = null;
  };

  const handleWhatsAppOrder = () => {
    const msg = `Hi! I want to order:\n\n*${product.name}*\nPrice: Rs.${product.price}\n\nPlease confirm availability and delivery details. Thank you!`;
    window.open(`https://wa.me/923442035118?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="product-page">
      <button className="product-page-back" onClick={onBack}>
        <ArrowLeft size={20} /> Back to Shop
      </button>

      {/* ── Gallery ── */}
      <div className="gallery-wrapper">
        {/* Main slide area */}
        <div
          className="gallery-main"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="gallery-slides"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {images.map((img, i) => (
              <div className="gallery-slide" key={i}>
                <img src={img} alt={`${product.name} ${i + 1}`} />
              </div>
            ))}
          </div>

          {/* Arrow buttons */}
          <button
            className={`gallery-arrow gallery-arrow-left ${current === 0 ? 'gallery-arrow-hidden' : ''}`}
            onClick={() => goTo(current - 1)}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            className={`gallery-arrow gallery-arrow-right ${current === images.length - 1 ? 'gallery-arrow-hidden' : ''}`}
            onClick={() => goTo(current + 1)}
          >
            <ChevronRight size={20} />
          </button>

          {/* Image counter badge */}
          {images.length > 1 && (
            <div style={{
              position: 'absolute', bottom: 10, right: 12,
              background: 'rgba(0,0,0,0.5)', color: 'white',
              borderRadius: 20, padding: '3px 10px', fontSize: 12
            }}>
              {current + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="gallery-dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`gallery-dot ${i === current ? 'active' : ''}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        )}

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="gallery-thumbs">
            {images.map((img, i) => (
              <div
                key={i}
                className={`gallery-thumb ${i === current ? 'active' : ''}`}
                onClick={() => goTo(i)}
              >
                <img src={img} alt={`thumb ${i + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Product Details ── */}
      <div className="product-details-card">
        <div className="product-page-price">Rs. {product.price}</div>
        <div className="product-page-name">{product.name}</div>

        <div className="product-page-rating">
          <div className="stars">
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={14} fill={s <= 4 ? '#f59e0b' : 'none'} color={s <= 4 ? '#f59e0b' : '#d1d5db'} />
            ))}
          </div>
          <span className="rating-text">4.0 · In Stock: {product.stock}</span>
        </div>

        <div className="product-page-badges">
          <span className="badge badge-cod">💵 Cash on Delivery</span>
          {product.stock > 0
            ? <span className="badge badge-stock">✅ Available</span>
            : <span className="badge badge-oos">❌ Out of Stock</span>
          }
          <span className="badge" style={{ background: '#eff6ff', color: '#1e40af' }}>🚚 Free Delivery</span>
        </div>

        <div className="product-page-divider" />

        <div className="product-page-desc-title">Product Details</div>
        <div className="product-page-desc">
          {product.description || 'No description provided.'}
        </div>

        <div className="product-page-divider" />

        <div style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.8 }}>
          <div>📦 <b>Payment:</b> Cash on Delivery (COD)</div>
          <div>📱 <b>Order via:</b> WhatsApp – 03442035118</div>
          <div>🔄 <b>Returns:</b> Easy returns accepted</div>
        </div>
      </div>

      {/* ── Sticky Bottom Bar ── */}
      <div className="product-page-bottom">
        <button className="btn-whatsapp" onClick={handleWhatsAppOrder}>
          📱 WhatsApp Order
        </button>
        <button
          className="btn-add-cart"
          onClick={() => { onAddToCart(product); onBack(); }}
          disabled={product.stock === 0}
        >
          <ShoppingCart size={16} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function LyfelyticEcommerce() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Failed to fetch products:', error);
      alert('❌ Could not load products. Check your internet connection.');
    } else {
      setProducts(data);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const [cart, setCart] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  // NEW: multi-image state
  const [newProduct, setNewProduct] = useState({
    name: '', price: '', description: '', stock: '',
    images: []   // array of base64 strings
  });

  const addToCart = (product) => setCart([...cart, product]);
  const removeFromCart = (index) => setCart(cart.filter((_, i) => i !== index));

  // Multi-image upload handler
  const handleImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Limit to 8 images total
    const remaining = 8 - newProduct.images.length;
    const toProcess = files.slice(0, remaining);

    toProcess.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({
          ...prev,
          images: [...prev.images, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });

    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const removeImage = (idx) => {
    setNewProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx)
    }));
  };

  // Add Product — saves images array to Supabase
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      alert('❌ Please fill name, price and stock!');
      return;
    }
    if (newProduct.images.length === 0) {
      alert('❌ Please upload at least one product image!');
      return;
    }

    setUploading(true);

    const { data, error } = await supabase
      .from('products')
      .insert([{
        id: Date.now(),
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        description: newProduct.description,
        image: newProduct.images[0],          // keep legacy column = first image
        images: newProduct.images,            // new column = all images
        stock: parseInt(newProduct.stock)
      }])
      .select();

    setUploading(false);

    if (error) {
      console.error('Failed to add product:', error);
      alert('❌ Failed to add product. Please try again.');
      return;
    }

    setProducts([...products, ...data]);
    setNewProduct({ name: '', price: '', description: '', stock: '', images: [] });
    alert('✅ Product added successfully!');
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) { alert('❌ Failed to delete product.'); return; }
    setProducts(products.filter(p => p.id !== id));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = () => {
    if (cart.length === 0) { alert('Your cart is empty!'); return; }
    const orderDetails = cart.map(item => `${item.name} - Rs.${item.price}`).join('\n');
    const message = `Order Request:\n${orderDetails}\n\nTotal: Rs.${totalPrice}\n\nPlease confirm availability and delivery time.`;
    window.open(`https://wa.me/923442035118?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleAdminClick = () => {
    const password = prompt('Enter admin password:');
    if (password === 'lyfelytic2024') { setIsAdmin(true); setMobileMenuOpen(false); }
    else if (password !== null) alert('❌ Wrong password!');
  };

  // Helper: get first image from product (handles both old and new schema)
  const getThumb = (product) => {
    if (product.images && product.images.length > 0) return product.images[0];
    return product.image || '';
  };

  // ── Product Detail View ──
  if (selectedProduct) {
    return (
      <div className="lyfelytic-container">
        <style>{styles}</style>
        <ProductPage
          product={selectedProduct}
          onBack={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      </div>
    );
  }

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
                <button className="nav-btn nav-btn-cart" onClick={handleCheckout}>
                  <ShoppingCart size={16} />
                  Cart
                  {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
                </button>
              </>
            )}
            {isAdmin && (
              <button onClick={() => setIsAdmin(false)} className="nav-btn nav-btn-exit">
                <LogOut size={16} /> Exit Admin
              </button>
            )}
          </div>

          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          {!isAdmin && (
            <>
              <button onClick={() => { setIsAdmin(false); setMobileMenuOpen(false); }} className="mobile-menu-btn-item">
                <Home size={18} /> Shop
              </button>
              <button onClick={handleAdminClick} className="mobile-menu-btn-item">
                Admin
              </button>
              <button onClick={() => { handleCheckout(); setMobileMenuOpen(false); }} className="mobile-menu-btn-item">
                <ShoppingCart size={18} /> Cart {cart.length > 0 && `(${cart.length})`}
              </button>
            </>
          )}
          {isAdmin && (
            <button onClick={() => { setIsAdmin(false); setMobileMenuOpen(false); }} className="mobile-menu-btn-item">
              <LogOut size={18} /> Exit Admin
            </button>
          )}
        </div>
      </header>

      <main className="main-content">

        {/* ── SHOP VIEW ── */}
        {!isAdmin && (
          <div>
            <div className="section-title">
              <h2>Daily Life Accessories</h2>
              <p>Quality products delivered to your doorstep via COD</p>
            </div>

            <div className="products-container">
              <div>
                {loading && <p style={{ textAlign: 'center', padding: '20px' }}>Loading products...</p>}
                <div className="products-grid">
                  {products.map(product => (
                    <div key={product.id} className="product-card">
                      <div
                        className="product-image"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <img src={getThumb(product)} alt={product.name} />
                        {product.stock === 0 && <div className="out-of-stock">Out of Stock</div>}
                        {/* Multi-image badge */}
                        {product.images && product.images.length > 1 && (
                          <div style={{
                            position: 'absolute', top: 8, right: 8,
                            background: 'rgba(0,0,0,0.55)', color: 'white',
                            borderRadius: 12, padding: '2px 8px', fontSize: 11
                          }}>
                            📷 {product.images.length}
                          </div>
                        )}
                      </div>
                      <div className="product-info">
                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-description">{product.description}</p>
                        <p className="product-price">Rs.{product.price}</p>
                        <p className="product-stock">{product.stock} in stock</p>
                        <button
                          className="view-details-btn"
                          onClick={() => setSelectedProduct(product)}
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                          className="add-to-cart-btn"
                        >
                          <ShoppingCart size={16} /> Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Sidebar */}
              <div className="cart-sidebar">
                <div className="cart-title"><ShoppingCart size={18} /> Your Cart</div>
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
                          <button onClick={() => removeFromCart(index)} className="remove-btn">✕</button>
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

        {/* ── ADMIN VIEW ── */}
        {isAdmin && (
          <div className="admin-panel">
            <div className="admin-title"><Package size={24} /> Admin Panel</div>

            <div className="add-product-form">
              <div className="form-title"><Plus size={18} /> Add New Product</div>

              <form onSubmit={handleAddProduct}>
                <div className="form-grid">
                  <input
                    type="text" placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="form-input" required
                  />
                  <input
                    type="number" placeholder="Price (Rs.)"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="form-input" required
                  />
                  <textarea
                    placeholder="Description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="form-input form-textarea form-full"
                  />
                  <input
                    type="number" placeholder="Stock"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="form-input" required
                  />
                </div>

                {/* Multi-image upload */}
                <div className="form-full" style={{ marginBottom: 12 }}>
                  <label className="image-upload-area">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImagesUpload}
                      disabled={newProduct.images.length >= 8}
                    />
                    <div className="upload-text">
                      <Upload size={20} />
                      {newProduct.images.length === 0
                        ? 'Click to upload product images'
                        : `Add more images (${newProduct.images.length}/8 uploaded)`
                      }
                    </div>
                    <div className="upload-hint">
                      Select multiple images at once · First image = main photo · Max 8
                    </div>
                  </label>

                  {newProduct.images.length > 0 && (
                    <div className="image-preview">
                      {newProduct.images.map((img, idx) => (
                        <div key={idx} className={`preview-item ${idx === 0 ? 'primary' : ''}`}>
                          <img src={img} alt={`preview ${idx + 1}`} />
                          {idx === 0 && <div className="preview-primary-badge">MAIN</div>}
                          <button
                            type="button"
                            className="remove-image-btn"
                            onClick={() => removeImage(idx)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button type="submit" className="submit-btn" disabled={uploading}>
                  {uploading ? '⏳ Saving...' : '✅ Add Product'}
                </button>
              </form>
            </div>

            {/* Products Management */}
            <div className="products-management">
              <div className="management-title">
                Manage Products ({products.length})
              </div>
              <div className="products-management-grid">
                {products.map(product => (
                  <div key={product.id} className="product-management-card">
                    <div className="product-management-image">
                      <img src={getThumb(product)} alt={product.name} />
                    </div>
                    <div className="product-management-img-count">
                      📷 {product.images?.length || 1} image{(product.images?.length || 1) !== 1 ? 's' : ''}
                    </div>
                    <h4 className="product-name">{product.name}</h4>
                    <p className="product-price">Rs.{product.price}</p>
                    <p className="product-description">{product.description}</p>
                    <p className="product-stock">Stock: {product.stock}</p>
                    <button onClick={() => handleDeleteProduct(product.id)} className="delete-btn">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>📞 WhatsApp: 03442035118</p>
        <p>💳 Payment: Cash on Delivery (COD)</p>
        <p>🚚 Free delivery available</p>
        <p style={{ marginTop: '12px', color: '#9ca3af' }}>© 2024 Lyfelytic. All rights reserved.</p>
      </footer>
    </div>
  );
}
