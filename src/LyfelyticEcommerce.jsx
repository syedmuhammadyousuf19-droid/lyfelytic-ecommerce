import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingCart, LogOut, Plus, Trash2, Menu, X, Package, Home,
  Upload, ArrowLeft, ChevronLeft, ChevronRight, Star, Heart,
  Search, Filter, Edit2, Check, BarChart2, ClipboardList, Bell
} from 'lucide-react';
import { supabase } from './supabaseClient';

const CATEGORIES = ['All', 'General', 'Kitchen', 'Bedroom', 'Bathroom', 'Office', 'Outdoor', 'Electronics', 'Fashion', 'Kids'];
// 📝 TO ADD/REMOVE CATEGORIES: Edit the CATEGORIES array above
// Example: ['All', 'Jewelry', 'Rings', 'Necklaces', 'Bracelets', 'Earrings']

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body, #root { height: 100%; }
  body { font-family: 'Inter', sans-serif; }

  :root {
    --bg:       #faf8f4;
    --bg2:      #f5f1ed;
    --bg3:      #f0ebe5;
    --card:     #faf8f4;
    --border:   rgba(139, 125, 107, 0.25);
    --accent:   #9d8b5f;
    --accent2:  #b8956f;
    --text:     #3a3a3a;
    --text-md:  #6b6b6b;
    --text-lt:  #999999;
    --shadow:   rgba(139, 125, 107, 0.2);
    --glass:    rgba(157, 139, 95, 0.18);
    --glass-b:  rgba(157, 139, 95, 0.28);
  }

  .lyfelytic-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #faf8f4 0%, #f5f1ed 50%, #f0ebe5 100%);
  }

  /* ── HEADER ── */
  .lyfelytic-header {
    background: rgba(250, 248, 244, 0.92);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    color: #3a3a3a; padding: 14px 20px;
    position: sticky; top: 0; z-index: 200;
  }
  .header-content { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
  .header-content svg { color: #3a3a3a; stroke: currentColor; }
  .brand { display: flex; align-items: center; gap: 12px; flex: 1; }
  .brand h1 { font-size: 22px; font-weight: 700; font-family: 'Playfair Display', serif; background: linear-gradient(135deg, #3a3a3a, #a89968); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .brand p { color: var(--text-md); font-size: 12px; display: none; }
  @media (min-width: 768px) { .brand p { display: block; } }

  .nav-buttons { display: none; gap: 8px; }
  @media (min-width: 768px) { .nav-buttons { display: flex; } }

  .nav-btn {
    padding: 9px 16px; border-radius: 8px; font-weight: 600;
    cursor: pointer; transition: all 0.25s; display: flex;
    align-items: center; gap: 6px; color: #ffffff; font-size: 13px;
    white-space: nowrap; backdrop-filter: blur(6px);
  }
  .nav-btn-shop { background: #b8956f; border: 1px solid #9d8b5f; }
  .nav-btn-shop:hover { background: #a08560; }
  .nav-btn-admin { background: #9b8db8; border: 1px solid #7d6fa0; }
  .nav-btn-admin:hover { background: #8a7ca8; }
  .nav-btn-exit { background: #c1896d; border: 1px solid #a87056; }
  .nav-btn-exit:hover { background: #b0765a; }
  .nav-btn-cart { background: #d4936f; border: 1px solid #b8805f; position: relative; }
  .nav-btn-cart:hover { background: #c2865e; }
  .cart-badge {
    position: absolute; top: -8px; right: -8px;
    background: var(--accent); color: white; border-radius: 50%;
    width: 20px; height: 20px; display: flex; align-items: center;
    justify-content: center; font-size: 11px; font-weight: 700;
  }

  .mobile-menu-btn { background: none; border: none; color: #3a3a3a; cursor: pointer; display: flex; align-items: center; }
  @media (min-width: 768px) { .mobile-menu-btn { display: none; } }

  .mobile-menu {
    display: none; position: absolute; top: 65px; left: 0; right: 0;
    background: rgba(250, 248, 244, 0.97); backdrop-filter: blur(20px);
    flex-direction: column; gap: 8px; padding: 12px;
    border-bottom: 1px solid var(--border);
  }
  .mobile-menu.open { display: flex; }
  @media (min-width: 768px) { .mobile-menu { display: none !important; } }
  .mobile-menu-btn-item {
    padding: 12px; background: #d4936f; border: 1px solid #b8805f;
    color: white; border-radius: 8px; cursor: pointer; font-weight: 600;
    display: flex; align-items: center; gap: 8px; backdrop-filter: blur(6px);
    transition: background 0.2s;
  }
  .mobile-menu-btn-item:hover { background: #c2865e; }

  /* ── SEARCH BAR ── */
  .search-bar-wrapper {
    max-width: 1200px; margin: 20px auto 0; padding: 0 16px;
  }
  .search-bar {
    display: flex; align-items: center; gap: 10px;
    background: var(--card); border: 1px solid var(--border);
    border-radius: 12px; padding: 10px 16px;
    transition: border-color 0.2s;
  }
  .search-bar:focus-within { border-color: var(--accent2); }
  .search-bar input {
    flex: 1; background: none; border: none; outline: none;
    color: var(--text); font-size: 14px; font-family: inherit;
  }
  .search-bar input::placeholder { color: var(--text-lt); }

  /* ── FILTER BAR ── */
  .filter-bar {
    max-width: 1200px; margin: 18px auto 0; padding: 0 16px;
    display: flex; gap: 12px; flex-wrap: wrap; align-items: center; justify-content: space-between;
  }
  @media (max-width: 768px) {
    .filter-bar {
      flex-direction: column; align-items: stretch; gap: 12px;
    }
  }

  /* ── CATEGORY CHIPS ── */
  .category-chips { 
    display: flex; gap: 8px; flex-wrap: wrap; flex: 1; 
    overflow-x: auto; padding-bottom: 4px; scroll-behavior: smooth;
    scrollbar-width: none; -ms-overflow-style: none;
  }
  .category-chips::-webkit-scrollbar { display: none; }
  @media (max-width: 768px) {
    .category-chips { 
      overflow-x: auto; flex-wrap: nowrap; width: 100%;
      padding-right: 16px; margin-right: -16px;
    }
  }

  .chip {
    padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600;
    cursor: pointer; transition: all 0.25s; border: 1.5px solid #c1b5a3;
    background: white; color: var(--text); white-space: nowrap;
    flex-shrink: 0; box-shadow: 0 2px 4px rgba(139, 125, 107, 0.08);
  }
  .chip:hover { background: #f5f1ed; border-color: var(--accent2); }
  .chip.active { 
    background: var(--accent); border-color: var(--accent); color: white; 
    box-shadow: 0 4px 12px rgba(157, 139, 95, 0.25);
  }
  .chip.active:hover { background: #8a7850; }

  /* ── FILTER SELECTS ── */
  .filter-selects { 
    display: flex; gap: 10px; flex-wrap: wrap;
  }
  @media (max-width: 768px) {
    .filter-selects { 
      width: 100%; gap: 8px;
    }
    .filter-select { flex: 1; min-width: 140px; }
  }

  .filter-select {
    padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 600;
    background: white; border: 1.5px solid #c1b5a3;
    color: var(--text); cursor: pointer; font-family: inherit; outline: none;
    transition: all 0.2s; box-shadow: 0 2px 4px rgba(139, 125, 107, 0.08);
  }
  .filter-select:hover { border-color: var(--accent2); background: #f5f1ed; }
  .filter-select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(157, 139, 95, 0.1); }
  .filter-select option { background: white; color: var(--text); padding: 8px; }

  /* ── MAIN ── */
  .main-content { max-width: 1200px; margin: 24px auto; padding: 0 16px; margin-bottom: 40px; }
  .section-title { text-align: center; margin-bottom: 32px; }
  .section-title h2 { font-size: 28px; font-weight: 700; font-family: 'Playfair Display', serif; color: var(--text); margin-bottom: 8px; letter-spacing: -0.5px; }
  .section-title p { color: var(--text-md); font-size: 14px; font-weight: 500; }

  /* ── PRODUCT GRID ── */
  .products-container { display: grid; grid-template-columns: 1fr 300px; gap: 20px; }
  @media (max-width: 1024px) { .products-container { grid-template-columns: 1fr; } }
  .products-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
  @media (max-width: 768px) { 
    .products-grid { display: flex; flex-wrap: nowrap; overflow-x: auto; gap: 12px; scroll-behavior: smooth; padding-right: 16px; margin-right: -16px; -webkit-overflow-scrolling: touch; }
    .products-grid::-webkit-scrollbar { display: none; }
    .products-grid { scrollbar-width: none; -ms-overflow-style: none; }
  }

  /* ── HORIZONTAL SCROLLABLE SECTIONS (Mobile) ── */
  .scroll-section {
    display: flex; gap: 12px; overflow-x: auto; padding-bottom: 6px; padding-right: 16px; margin-right: -16px;
    scroll-behavior: smooth; overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .scroll-section::-webkit-scrollbar { display: none; }

  .product-card {
    background: var(--card); border-radius: 14px; overflow: hidden;
    border: 1px solid var(--border); transition: all 0.3s; cursor: pointer;
    position: relative; flex-shrink: 0;
  }
  @media (max-width: 768px) {
    .product-card { width: 160px; max-width: 160px; flex: 0 0 160px; }
  }
  .product-card:hover { transform: translateY(-4px); border-color: var(--accent2); box-shadow: 0 8px 20px var(--shadow); }

  .product-image { width: 100%; height: 200px; background: var(--bg3); overflow: hidden; position: relative; }
  @media (max-width: 768px) { .product-image { height: 160px; } }
  .product-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; display: block; }
  .product-card:hover .product-image img { transform: scale(1.04); }

  .out-of-stock {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.65); display: flex; align-items: center;
    justify-content: center; color: white; font-weight: 700; font-size: 14px;
  }

  /* Stock low badge */
  .stock-low-badge {
    position: absolute; top: 10px; left: 10px;
    background: var(--accent); color: white;
    padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;
    backdrop-filter: blur(8px);
    text-transform: uppercase; letter-spacing: 0.5px;
  }

  /* Wishlist heart */
  .wishlist-btn {
    position: absolute; top: 10px; right: 10px;
    background: rgba(250, 248, 244, 0.9); border: 1px solid var(--border); border-radius: 50%;
    width: 38px; height: 38px; display: flex; align-items: center;
    justify-content: center; cursor: pointer; backdrop-filter: blur(8px);
    transition: all 0.2s; z-index: 5;
  }
  .wishlist-btn:hover { background: rgba(250, 248, 244, 0.98); transform: scale(1.1); border-color: var(--accent); }
  .wishlist-btn.active { background: var(--accent); border-color: var(--accent); }

  .multi-img-badge {
    position: absolute; bottom: 10px; right: 10px;
    background: rgba(58, 58, 58, 0.85); color: white;
    border-radius: 12px; padding: 4px 10px; font-size: 11px;
    backdrop-filter: blur(8px); font-weight: 600;
  }

  .product-info { padding: 14px; background: var(--card); }
  .product-category-tag {
    font-size: 9px; font-weight: 700; color: var(--accent);
    text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px;
  }
  .product-name { font-size: 15px; font-weight: 600; color: var(--text); margin-bottom: 4px; line-height: 1.3; }
  .product-description { color: var(--text-md); font-size: 12px; margin-bottom: 8px; line-height: 1.4; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .product-price { font-size: 18px; font-weight: 700; color: var(--accent); margin-bottom: 4px; }
  .product-stock { color: var(--text-lt); font-size: 11px; margin-bottom: 10px; font-weight: 500; }

  .product-rating-row { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; }
  .stars-sm { display: flex; gap: 1px; }
  .rating-count { font-size: 11px; color: var(--text-lt); }

  .view-details-btn {
    width: 100%; padding: 8px;
    background: #e8dfd5; color: var(--text);
    border: 1px solid var(--border); border-radius: 8px;
    font-weight: 600; cursor: pointer; transition: all 0.25s;
    font-size: 13px; margin-bottom: 8px; backdrop-filter: blur(4px);
  }
  .view-details-btn:hover { background: #ddd6cc; border-color: var(--accent2); }

  .add-to-cart-btn {
    width: 100%; padding: 10px;
    background: var(--accent); color: white;
    border: 1px solid var(--accent); border-radius: 8px;
    font-weight: 600; cursor: pointer; transition: all 0.25s;
    display: flex; align-items: center; justify-content: center;
    gap: 6px; font-size: 13px; backdrop-filter: blur(4px);
  }
  .add-to-cart-btn:hover:not(:disabled) { background: #8a7850; transform: translateY(-2px); box-shadow: 0 4px 12px var(--shadow); }
  .add-to-cart-btn:disabled { background: #e8dfd5; color: var(--text-lt); border-color: var(--border); cursor: not-allowed; }

  /* ── CART ── */
  .cart-sidebar {
    background: var(--card); border-radius: 14px; padding: 16px;
    border: 1px solid var(--border); position: sticky; top: 90px; height: fit-content;
  }
  @media (max-width: 1024px) { .cart-sidebar { position: static; } }
  .cart-title { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .cart-empty { text-align: center; color: var(--text-lt); padding: 24px 0; font-size: 14px; }
  .cart-items { max-height: 280px; overflow-y: auto; margin-bottom: 16px; }
  .cart-item { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--border); padding-bottom: 10px; margin-bottom: 10px; font-size: 13px; }
  .cart-item-name { font-weight: 600; color: var(--text); }
  .cart-item-price { color: var(--accent); font-weight: 700; font-size: 12px; }
  .remove-btn { background: none; border: none; color: var(--accent); cursor: pointer; font-size: 16px; margin-left: 8px; }
  .cart-total { border-top: 1px solid var(--border); padding-top: 10px; margin-bottom: 12px; }
  .total-price { font-size: 16px; font-weight: 700; color: var(--text); }

  .checkout-btn {
    width: 100%; padding: 12px;
    background: var(--accent); color: white;
    border: 1px solid var(--accent); border-radius: 8px;
    font-weight: 700; cursor: pointer; transition: all 0.25s;
    display: flex; align-items: center; justify-content: center;
    gap: 6px; font-size: 13px; backdrop-filter: blur(4px);
  }
  .checkout-btn:hover { background: #8a7850; transform: translateY(-2px); box-shadow: 0 4px 12px var(--shadow); }

  /* ── CHECKOUT MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5);
    backdrop-filter: blur(8px); z-index: 500;
    display: flex; align-items: center; justify-content: center; padding: 16px;
  }
  .modal {
    background: white; border: 1px solid var(--border);
    border-radius: 16px; padding: 28px; width: 100%; max-width: 500px;
    max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(139, 125, 107, 0.2);
  }
  @media (max-width: 768px) { .modal { padding: 20px; max-width: 100%; } }

  .modal-title { font-size: 22px; font-weight: 700; font-family: 'Playfair Display', serif; color: var(--text); margin-bottom: 24px; display: flex; align-items: center; gap: 10px; }
  
  .modal-input {
    width: 100%; padding: 12px 14px; background: white;
    border: 1.5px solid #c1b5a3; border-radius: 8px;
    color: var(--text); font-size: 13px; font-family: inherit;
    margin-bottom: 12px; outline: none; transition: all 0.2s;
  }
  .modal-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(157, 139, 95, 0.1); background: #faf8f4; }
  .modal-input::placeholder { color: var(--text-lt); }
  
  .modal-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  @media (max-width: 480px) { .modal-row { grid-template-columns: 1fr; } }

  .modal-order-summary { background: #f5f1ed; border-radius: 12px; padding: 16px; margin-bottom: 20px; border: 1px solid var(--border); }
  .modal-order-item { display: flex; justify-content: space-between; font-size: 13px; color: var(--text-md); padding: 8px 0; border-bottom: 1px solid var(--border); }
  .modal-order-item:last-child { border: none; padding-bottom: 0; }
  .modal-total { display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; color: var(--accent); margin-top: 12px; }
  
  .modal-btns { display: flex; gap: 12px; }
  @media (max-width: 480px) { .modal-btns { flex-direction: column; } }

  .modal-cancel {
    flex: 1; padding: 12px; background: white; color: var(--text);
    border: 1.5px solid #c1b5a3; border-radius: 8px; font-weight: 600;
    cursor: pointer; font-family: inherit; transition: all 0.2s;
  }
  .modal-cancel:hover { background: #f5f1ed; border-color: var(--accent2); }

  .modal-confirm {
    flex: 1.5; padding: 12px; background: var(--accent); color: white;
    border: 1px solid var(--accent); border-radius: 8px; font-weight: 700;
    cursor: pointer; font-family: inherit; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .modal-confirm:hover { background: #8a7850; transform: translateY(-2px); box-shadow: 0 4px 12px var(--shadow); }

  /* ── PRODUCT DETAIL PAGE ── */
  .product-page {
    background: var(--bg); min-height: 100vh; padding-bottom: 100px;
    max-width: 680px; margin: 0 auto;
    box-shadow: 0 0 60px rgba(0,0,0,0.4);
  }
  .product-page-back {
    display: flex; align-items: center; gap: 8px;
    background: white; padding: 14px 16px;
    border: none; cursor: pointer; width: 100%;
    font-size: 15px; font-weight: 600; color: var(--accent);
    border-bottom: 1px solid var(--border); transition: all 0.2s;
  }
  .product-page-back:hover { background: #f5f1ed; }

  .gallery-wrapper { background: #f5f1ed; position: relative; overflow: hidden; }
  .gallery-main { position: relative; width: 100%; height: 300px; overflow: hidden; touch-action: pan-y; }
  @media (min-width: 768px) { .gallery-main { height: 420px; } }
  .gallery-slides { display: flex; height: 100%; transition: transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94); }
  .gallery-slide { min-width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: white; flex-shrink: 0; }
  .gallery-slide img { width: 100%; height: 100%; object-fit: contain; padding: 16px; }
  
  .gallery-arrow {
    position: absolute; top: 50%; transform: translateY(-50%);
    background: white; border: 1.5px solid var(--border);
    border-radius: 50%; width: 42px; height: 42px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; backdrop-filter: blur(8px); z-index: 10; color: var(--text); transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(139, 125, 107, 0.15);
  }
  .gallery-arrow:hover { background: #f5f1ed; border-color: var(--accent); }
  .gallery-arrow-left { left: 10px; }
  .gallery-arrow-right { right: 10px; }
  .gallery-arrow-hidden { opacity: 0; pointer-events: none; }
  
  .gallery-dots { display: flex; justify-content: center; gap: 6px; padding: 12px 0 8px; background: white; }
  .gallery-dot { width: 8px; height: 8px; border-radius: 50%; background: #e0d8cc; border: none; cursor: pointer; transition: all 0.25s; padding: 0; }
  .gallery-dot.active { background: var(--accent); width: 24px; border-radius: 4px; }
  
  .gallery-thumbs { display: flex; gap: 8px; padding: 12px 16px; background: white; overflow-x: auto; border-bottom: 1px solid var(--border); scrollbar-width: none; -webkit-overflow-scrolling: touch; }
  .gallery-thumbs::-webkit-scrollbar { display: none; }
  .gallery-thumb { flex-shrink: 0; width: 60px; height: 60px; border-radius: 8px; overflow: hidden; border: 2px solid transparent; cursor: pointer; transition: all 0.2s; background: #f5f1ed; }
  .gallery-thumb:hover { border-color: var(--accent2); }
  .gallery-thumb.active { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent); }
  .gallery-thumb img { width: 100%; height: 100%; object-fit: cover; }

  .product-details-card { background: var(--bg2); margin-top: 8px; padding: 18px 16px; }
  .product-page-price { font-size: 28px; font-weight: 800; color: var(--accent); margin-bottom: 4px; }
  .product-page-name { font-size: 18px; font-weight: 700; font-family: 'Playfair Display', serif; color: var(--text); line-height: 1.4; margin-bottom: 10px; }
  .product-page-rating { display: flex; align-items: center; gap: 6px; margin-bottom: 12px; }
  .stars { display: flex; gap: 2px; }
  .rating-text { font-size: 13px; color: var(--text-md); }
  .product-page-badges { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
  .badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  .badge-cod { background: rgba(124,106,247,0.15); color: #a89ff7; border: 1px solid rgba(124,106,247,0.3); }
  .badge-stock { background: rgba(34,197,94,0.12); color: #4ade80; border: 1px solid rgba(34,197,94,0.25); }
  .badge-oos { background: rgba(233,69,96,0.12); color: #f87171; border: 1px solid rgba(233,69,96,0.25); }
  .product-page-divider { height: 1px; background: var(--border); margin: 14px 0; }
  .product-page-desc-title { font-size: 11px; font-weight: 700; color: var(--text-lt); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px; }
  .product-page-desc { font-size: 14px; color: var(--text-md); line-height: 1.7; }

  .product-page-bottom {
    position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 100%; max-width: 680px;
    background: rgba(15,15,26,0.95); backdrop-filter: blur(20px);
    border-top: 1px solid var(--border); padding: 12px 16px;
    padding-bottom: calc(12px + env(safe-area-inset-bottom));
    display: flex; gap: 10px; z-index: 200;
  }
  .btn-whatsapp {
    flex: 1; padding: 13px; background: rgba(255,255,255,0.08);
    color: white; border: 1px solid rgba(255,255,255,0.15); border-radius: 10px;
    font-weight: 700; font-size: 14px; cursor: pointer; backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;
  }
  .btn-whatsapp:hover { background: rgba(255,255,255,0.15); }
  .btn-add-cart {
    flex: 1; padding: 13px; background: rgba(233,69,96,0.85);
    color: white; border: 1px solid rgba(233,69,96,0.5); border-radius: 10px;
    font-weight: 700; font-size: 14px; cursor: pointer; backdrop-filter: blur(6px);
    display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;
  }
  .btn-add-cart:hover:not(:disabled) { background: rgba(233,69,96,0.98); }
  .btn-add-cart:disabled { background: var(--glass); border-color: var(--border); color: var(--text-lt); cursor: not-allowed; }

  /* ── REVIEWS ── */
  .reviews-section { background: var(--bg2); margin-top: 8px; padding: 18px 16px; }
  .reviews-title { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 16px; font-family: 'Playfair Display', serif; }
  .review-card { background: var(--card); border-radius: 10px; padding: 14px; margin-bottom: 12px; border: 1px solid var(--border); }
  .review-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; }
  .review-name { font-weight: 600; color: var(--text); font-size: 14px; }
  .review-date { font-size: 11px; color: var(--text-lt); }
  .review-comment { font-size: 13px; color: var(--text-md); line-height: 1.5; margin-top: 6px; }
  .add-review-form { background: var(--card); border-radius: 10px; padding: 14px; border: 1px solid var(--border); margin-top: 16px; }
  .review-stars-input { display: flex; gap: 6px; margin-bottom: 10px; }
  .review-star-btn { background: none; border: none; cursor: pointer; font-size: 22px; transition: transform 0.15s; }
  .review-star-btn:hover { transform: scale(1.2); }

  /* ── RELATED PRODUCTS ── */
  .related-section { background: var(--bg2); margin-top: 8px; padding: 18px 16px; }
  .related-title { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 14px; }
  .related-grid { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; -webkit-overflow-scrolling: touch; }
  .related-grid::-webkit-scrollbar { height: 3px; }
  .related-grid::-webkit-scrollbar-thumb { background: var(--text-lt); border-radius: 2px; }
  .related-card { flex-shrink: 0; width: 130px; max-width: 130px; flex: 0 0 130px; background: var(--card); border-radius: 10px; overflow: hidden; border: 1px solid var(--border); cursor: pointer; transition: all 0.2s; }
  .related-card:hover { border-color: rgba(124,106,247,0.4); transform: translateY(-2px); }
  .related-img { width: 100%; height: 90px; object-fit: cover; background: var(--bg3); display: block; }
  .related-info { padding: 8px; }
  .related-name { font-size: 12px; font-weight: 600; color: var(--text); margin-bottom: 2px; }
  .related-price { font-size: 12px; color: var(--accent); font-weight: 700; }

  /* ── WISHLIST PAGE ── */
  .wishlist-empty { text-align: center; padding: 60px 20px; color: var(--text-lt); }
  .wishlist-empty h3 { font-size: 20px; font-weight: 700; color: var(--text-md); margin-bottom: 8px; margin-top: 16px; }

  /* ── ADMIN ── */
  .admin-panel { background: var(--card); border-radius: 14px; padding: 20px; border: 1px solid var(--border); }
  @media (max-width: 768px) { .admin-panel { padding: 14px; } }
  .admin-title { font-size: 22px; font-weight: 700; font-family: 'Playfair Display', serif; color: var(--text); margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }

  .admin-tabs { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
  .admin-tab {
    padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 600;
    cursor: pointer; border: 1px solid var(--border); color: var(--text-md);
    background: var(--glass); transition: all 0.2s; display: flex; align-items: center; gap: 6px;
  }
  .admin-tab.active { background: rgba(124,106,247,0.25); border-color: rgba(124,106,247,0.5); color: #a89ff7; }
  .admin-tab:hover:not(.active) { background: var(--glass-b); color: var(--text); }

  .add-product-form { background: var(--bg2); border-radius: 12px; padding: 18px; margin-bottom: 20px; border: 1px solid var(--border); }
  .form-title { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
  @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }
  .form-full { grid-column: 1 / -1; }
  .form-input {
    padding: 10px 12px; border: 1px solid var(--border); border-radius: 8px;
    font-size: 13px; font-family: inherit; width: 100%;
    background: var(--card); color: var(--text); outline: none; transition: border-color 0.2s;
  }
  .form-input:focus { border-color: var(--accent2); }
  .form-input::placeholder { color: var(--text-lt); }
  .form-textarea { resize: vertical; min-height: 70px; }

  .image-upload-area {
    border: 2px dashed var(--border); border-radius: 8px; padding: 20px;
    text-align: center; cursor: pointer; transition: all 0.25s;
    background: var(--card); display: block;
  }
  .image-upload-area:hover { border-color: var(--accent2); background: rgba(124,106,247,0.06); }
  .image-upload-area input { display: none; }
  .upload-text { font-size: 13px; color: var(--text-md); display: flex; align-items: center; justify-content: center; gap: 8px; }
  .upload-hint { font-size: 11px; color: var(--text-lt); margin-top: 4px; }

  .image-preview { margin-top: 14px; display: flex; flex-wrap: wrap; gap: 10px; }
  .preview-item { position: relative; width: 80px; height: 80px; }
  .preview-item img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; border: 2px solid var(--border); }
  .preview-item.primary img { border-color: var(--accent); }
  .preview-primary-badge { position: absolute; bottom: -2px; left: 0; right: 0; background: var(--accent); color: white; font-size: 9px; font-weight: 700; text-align: center; padding: 2px; border-radius: 0 0 6px 6px; }
  .remove-image-btn { position: absolute; top: -8px; right: -8px; background: var(--accent); color: white; border: none; border-radius: 50%; width: 22px; height: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; }

  .submit-btn {
    background: rgba(124,106,247,0.8); color: white;
    padding: 11px 24px; border: 1px solid rgba(124,106,247,0.5);
    border-radius: 8px; font-weight: 700; cursor: pointer;
    font-size: 14px; margin-top: 4px; backdrop-filter: blur(4px);
    transition: all 0.25s; font-family: inherit;
  }
  .submit-btn:hover { background: rgba(124,106,247,0.96); transform: translateY(-1px); }
  .submit-btn:disabled { background: var(--glass); border-color: var(--border); color: var(--text-lt); cursor: not-allowed; transform: none; }

  .products-management { margin-top: 4px; }
  .management-title { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 14px; }
  .products-management-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  @media (max-width: 768px) { .products-management-grid { grid-template-columns: 1fr; } }

  .product-management-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 12px; transition: all 0.2s; }
  .product-management-card:hover { border-color: rgba(124,106,247,0.3); }
  .product-management-image { width: 100%; height: 110px; background: var(--bg3); border-radius: 8px; margin-bottom: 10px; overflow: hidden; }
  .product-management-image img { width: 100%; height: 100%; object-fit: cover; }
  .product-management-img-count { font-size: 11px; color: var(--text-lt); margin-bottom: 5px; }
  .admin-card-actions { display: flex; gap: 8px; margin-top: 10px; }
  .edit-btn {
    flex: 1; padding: 9px; background: rgba(124,106,247,0.2);
    color: #a89ff7; border: 1px solid rgba(124,106,247,0.3);
    border-radius: 8px; font-weight: 600; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    gap: 5px; font-size: 12px; transition: all 0.2s; font-family: inherit;
  }
  .edit-btn:hover { background: rgba(124,106,247,0.35); }
  .delete-btn {
    flex: 1; padding: 9px; background: rgba(233,69,96,0.2);
    color: #f87171; border: 1px solid rgba(233,69,96,0.3);
    border-radius: 8px; font-weight: 600; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    gap: 5px; font-size: 12px; transition: all 0.2s; font-family: inherit;
  }
  .delete-btn:hover { background: rgba(233,69,96,0.35); }

  /* ── ORDERS TABLE ── */
  .orders-section { background: var(--bg2); border-radius: 12px; padding: 18px; border: 1px solid var(--border); }
  .orders-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .orders-table th { text-align: left; padding: 10px 12px; border-bottom: 1px solid var(--border); color: var(--text-lt); font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
  .orders-table td { padding: 12px; border-bottom: 1px solid var(--border); color: var(--text-md); vertical-align: top; }
  .orders-table tr:last-child td { border: none; }
  .order-status-select {
    padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700;
    border: none; cursor: pointer; font-family: inherit; outline: none;
  }
  .status-pending { background: rgba(234,179,8,0.15); color: #facc15; border: 1px solid rgba(234,179,8,0.3); }
  .status-shipped { background: rgba(124,106,247,0.15); color: #a89ff7; border: 1px solid rgba(124,106,247,0.3); }
  .status-delivered { background: rgba(34,197,94,0.12); color: #4ade80; border: 1px solid rgba(34,197,94,0.25); }
  .status-cancelled { background: rgba(233,69,96,0.12); color: #f87171; border: 1px solid rgba(233,69,96,0.25); }
  .orders-mobile-card { background: var(--card); border-radius: 10px; padding: 14px; border: 1px solid var(--border); margin-bottom: 10px; }
  @media (min-width: 768px) { .orders-mobile-card { display: none; } }
  .orders-desktop { overflow-x: auto; }
  @media (max-width: 767px) { .orders-desktop { display: none; } }

  /* ── DASHBOARD ── */
  .dashboard-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 20px; }
  @media (min-width: 768px) { .dashboard-grid { grid-template-columns: repeat(4, 1fr); } }
  .stat-card { background: var(--bg2); border-radius: 12px; padding: 16px; border: 1px solid var(--border); }
  .stat-label { font-size: 11px; color: var(--text-lt); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
  .stat-value { font-size: 24px; font-weight: 700; color: var(--text); }
  .stat-sub { font-size: 12px; color: var(--text-lt); margin-top: 4px; }
  .stat-accent { color: var(--accent); }
  .stat-green { color: #4ade80; }
  .stat-purple { color: #a89ff7; }

  .top-products { background: var(--bg2); border-radius: 12px; padding: 16px; border: 1px solid var(--border); }
  .top-product-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 13px; }
  .top-product-row:last-child { border: none; }

  /* ── FOOTER ── */
  .footer { background: #f0ebe5; color: var(--text-md); text-align: center; padding: 32px 20px; border-top: 1px solid var(--border); }
  .footer p { margin: 6px 0; font-size: 13px; font-weight: 500; }

  /* ── EDIT MODAL ── */
  .edit-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(6px); z-index: 600; display: flex; align-items: center; justify-content: center; padding: 16px; }
  .edit-modal { background: var(--bg2); border: 1px solid var(--border); border-radius: 16px; padding: 24px; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; }

  /* scrollbar */
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--text-lt); border-radius: 3px; }
`;

/* ─── PRODUCT DETAIL PAGE ─── */
function ProductPage({ product, onBack, onAddToCart, allProducts }) {
  const images = (product.images && product.images.length > 0) ? product.images : (product.image ? [product.image] : []);
  const [current, setCurrent] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const [hoverStar, setHoverStar] = useState(0);
  const touchStartX = useRef(null);

  useEffect(() => {
    supabase.from('reviews').select('*').eq('product_id', product.id).order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setReviews(data); });
  }, [product.id]);

  const goTo = (idx) => { if (idx >= 0 && idx < images.length) setCurrent(idx); };
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (!touchStartX.current) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? goTo(current + 1) : goTo(current - 1);
    touchStartX.current = null;
  };

  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.name.trim()) { alert('Please enter your name'); return; }
    const { data, error } = await supabase.from('reviews').insert([{
      id: Date.now(), product_id: product.id,
      customer_name: newReview.name, rating: newReview.rating,
      comment: newReview.comment, created_at: new Date().toISOString()
    }]).select();
    if (!error && data) {
      setReviews([data[0], ...reviews]);
      setNewReview({ name: '', rating: 5, comment: '' });
    }
  };

  const handleWhatsApp = () => {
    const msg = `Hi! I want to order:\n\n*${product.name}*\nPrice: Rs.${product.price}\n\nPlease confirm availability and delivery details.`;
    window.open(`https://wa.me/923442035118?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const related = allProducts.filter(p => p.id !== product.id && p.category === product.category).slice(0, 6);

  return (
    <div className="product-page">
      <button className="product-page-back" onClick={onBack}>
        <ArrowLeft size={20} /> Back to Shop
      </button>

      <div className="gallery-wrapper">
        <div className="gallery-main" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <div className="gallery-slides" style={{ transform: `translateX(-${current * 100}%)` }}>
            {images.map((img, i) => (
              <div className="gallery-slide" key={i}><img src={img} alt={`${product.name} ${i + 1}`} /></div>
            ))}
          </div>
          <button className={`gallery-arrow gallery-arrow-left ${current === 0 ? 'gallery-arrow-hidden' : ''}`} onClick={() => goTo(current - 1)}><ChevronLeft size={20} /></button>
          <button className={`gallery-arrow gallery-arrow-right ${current === images.length - 1 ? 'gallery-arrow-hidden' : ''}`} onClick={() => goTo(current + 1)}><ChevronRight size={20} /></button>
          {images.length > 1 && (
            <div style={{ position: 'absolute', bottom: 10, right: 12, background: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: 20, padding: '3px 10px', fontSize: 12 }}>
              {current + 1} / {images.length}
            </div>
          )}
        </div>
        {images.length > 1 && (
          <div className="gallery-dots">{images.map((_, i) => <button key={i} className={`gallery-dot ${i === current ? 'active' : ''}`} onClick={() => goTo(i)} />)}</div>
        )}
        {images.length > 1 && (
          <div className="gallery-thumbs">{images.map((img, i) => <div key={i} className={`gallery-thumb ${i === current ? 'active' : ''}`} onClick={() => goTo(i)}><img src={img} alt="" /></div>)}</div>
        )}
      </div>

      <div className="product-details-card">
        <div className="product-page-price">Rs. {product.price}</div>
        <div className="product-page-name">{product.name}</div>
        {product.category && <div style={{ fontSize: 12, color: '#a89ff7', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>{product.category}</div>}

        <div className="product-page-rating">
          <div className="stars">
            {[1,2,3,4,5].map(s => <Star key={s} size={15} fill={s <= Math.round(avgRating || 4) ? '#f59e0b' : 'none'} color={s <= Math.round(avgRating || 4) ? '#f59e0b' : '#4b5563'} />)}
          </div>
          <span className="rating-text">{avgRating || '4.0'} · {reviews.length} reviews · Stock: {product.stock}</span>
        </div>

        <div className="product-page-badges">
          <span className="badge badge-cod">💵 Cash on Delivery</span>
          {product.stock > 0 ? <span className="badge badge-stock">✅ Available</span> : <span className="badge badge-oos">❌ Out of Stock</span>}
          {product.stock > 0 && product.stock <= 5 && <span className="badge" style={{ background: 'rgba(233,69,96,0.15)', color: '#f87171', border: '1px solid rgba(233,69,96,0.3)' }}>🔥 Only {product.stock} left!</span>}
          <span className="badge" style={{ background: 'rgba(255,255,255,0.06)', color: '#b0b0c0', border: '1px solid rgba(255,255,255,0.1)' }}>🚚 Free Delivery</span>
        </div>

        <div className="product-page-divider" />
        <div className="product-page-desc-title">Product Details</div>
        <div className="product-page-desc">{product.description || 'No description provided.'}</div>
        <div className="product-page-divider" />
        <div style={{ fontSize: 13, color: 'var(--text-md)', lineHeight: 1.9 }}>
          <div>📦 <b style={{ color: 'var(--text)' }}>Payment:</b> Cash on Delivery (COD)</div>
          <div>📱 <b style={{ color: 'var(--text)' }}>Order via:</b> WhatsApp – 03442035118</div>
          <div>🔄 <b style={{ color: 'var(--text)' }}>Returns:</b> Easy returns accepted</div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="related-section">
          <div className="related-title">You may also like</div>
          <div className="related-grid">
            {related.map(p => (
              <div key={p.id} className="related-card" onClick={() => { onBack(); setTimeout(() => {}, 50); }}>
                <img className="related-img" src={p.images?.[0] || p.image || ''} alt={p.name} />
                <div className="related-info">
                  <div className="related-name">{p.name}</div>
                  <div className="related-price">Rs. {p.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="reviews-section">
        <div className="reviews-title">⭐ Customer Reviews</div>
        {reviews.map(r => (
          <div key={r.id} className="review-card">
            <div className="review-header">
              <div>
                <div className="review-name">{r.customer_name}</div>
                <div className="stars" style={{ marginTop: 4 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={13} fill={s <= r.rating ? '#f59e0b' : 'none'} color={s <= r.rating ? '#f59e0b' : '#4b5563'} />)}
                </div>
              </div>
              <div className="review-date">{new Date(r.created_at).toLocaleDateString()}</div>
            </div>
            {r.comment && <div className="review-comment">{r.comment}</div>}
          </div>
        ))}
        {reviews.length === 0 && <div style={{ color: 'var(--text-lt)', fontSize: 13, marginBottom: 16 }}>No reviews yet. Be the first!</div>}

        <div className="add-review-form">
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Leave a Review</div>
          <div className="review-stars-input">
            {[1,2,3,4,5].map(s => (
              <button key={s} type="button" className="review-star-btn"
                onMouseEnter={() => setHoverStar(s)}
                onMouseLeave={() => setHoverStar(0)}
                onClick={() => setNewReview({ ...newReview, rating: s })}
              >
                <Star size={20} fill={s <= (hoverStar || newReview.rating) ? '#f59e0b' : 'none'} color={s <= (hoverStar || newReview.rating) ? '#f59e0b' : '#4b5563'} />
              </button>
            ))}
          </div>
          <input className="modal-input" placeholder="Your name" value={newReview.name} onChange={e => setNewReview({ ...newReview, name: e.target.value })} style={{ marginBottom: 10 }} />
          <textarea className="modal-input form-textarea" placeholder="Your review (optional)" value={newReview.comment} onChange={e => setNewReview({ ...newReview, comment: e.target.value })} style={{ resize: 'vertical', minHeight: 60 }} />
          <button className="submit-btn" onClick={handleSubmitReview} style={{ marginTop: 8 }}>Submit Review</button>
        </div>
      </div>

      <div className="product-page-bottom">
        <button className="btn-whatsapp" onClick={handleWhatsApp}>📱 WhatsApp</button>
        <button className="btn-add-cart" onClick={() => { onAddToCart(product); onBack(); }} disabled={product.stock === 0}>
          <ShoppingCart size={16} /> Add to Cart
        </button>
      </div>
    </div>
  );
}

/* ─── MAIN APP ─── */
export default function LyfelyticEcommerce() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem('lyf_wishlist') || '[]'));
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [view, setView] = useState('shop'); // shop | wishlist
  const [adminTab, setAdminTab] = useState('products'); // products | orders | dashboard | categories
  const [showCheckout, setShowCheckout] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Categories (dynamic, admin-managed)
  const [categories, setCategories] = useState(CATEGORIES.filter(c => c !== 'All'));
  const [newCategoryName, setNewCategoryName] = useState('');
  const [savingCategory, setSavingCategory] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', stock: '', category: 'General', images: [] });
  const [checkoutForm, setCheckoutForm] = useState({ name: '', phone: '', email: '', address: '', city: '' });

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  };

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) setOrders(data);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true });
    // If the categories table doesn't exist yet (or is empty), fall back to the built-in list
    if (!error && data && data.length > 0) setCategories(data.map(c => c.name));
  };

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);
  useEffect(() => { if (isAdmin) fetchOrders(); }, [isAdmin]);

  // Add a category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    const name = newCategoryName.trim();
    if (!name) return;
    if (categories.some(c => c.toLowerCase() === name.toLowerCase())) { alert('That category already exists'); return; }
    setSavingCategory(true);
    const { error } = await supabase.from('categories').insert([{ name }]);
    setSavingCategory(false);
    if (error) { alert('Failed to add category. Make sure the "categories" table exists in Supabase.'); return; }
    setCategories(prev => [...prev, name].sort((a, b) => a.localeCompare(b)));
    setNewCategoryName('');
  };

  // Delete a category
  const handleDeleteCategory = async (name) => {
    const inUse = products.some(p => p.category === name);
    if (inUse && !confirm(`"${name}" is used by ${products.filter(p => p.category === name).length} product(s). Delete it anyway? Those products will keep the old category value until edited.`)) return;
    if (!inUse && !confirm(`Delete category "${name}"?`)) return;
    const { error } = await supabase.from('categories').delete().eq('name', name);
    if (error) { alert('Failed to delete category'); return; }
    setCategories(prev => prev.filter(c => c !== name));
  };

  const getThumb = (p) => p.images?.[0] || p.image || '';

  const addToCart = (product) => setCart(c => [...c, product]);
  const removeFromCart = (i) => setCart(c => c.filter((_, idx) => idx !== i));
  const totalPrice = cart.reduce((s, i) => s + i.price, 0);

  const toggleWishlist = (id) => {
    const updated = wishlist.includes(id) ? wishlist.filter(w => w !== id) : [...wishlist, id];
    setWishlist(updated);
    localStorage.setItem('lyf_wishlist', JSON.stringify(updated));
  };

  // Filtered products
  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchPrice = priceRange === 'all' ? true :
      priceRange === 'under500' ? p.price < 500 :
      priceRange === '500-1000' ? p.price >= 500 && p.price <= 1000 :
      priceRange === '1000-2000' ? p.price > 1000 && p.price <= 2000 : p.price > 2000;
    return matchSearch && matchCat && matchPrice;
  }).sort((a, b) => {
    if (sortBy === 'newest') return b.id - a.id;
    if (sortBy === 'oldest') return a.id - b.id;
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  // Checkout
  const handlePlaceOrder = async () => {
    const { name, phone, address, city } = checkoutForm;
    if (!name || !phone || !address || !city) { alert('Please fill all required fields'); return; }
    const items = cart.map(i => ({ id: i.id, name: i.name, price: i.price }));
    const { error } = await supabase.from('orders').insert([{
      id: Date.now(), customer_name: name, customer_phone: phone,
      customer_email: checkoutForm.email, customer_address: address,
      customer_city: city, items, total_price: totalPrice,
      status: 'Pending', created_at: new Date().toISOString()
    }]);
    if (error) { alert('Failed to place order. Try again.'); return; }
    // WhatsApp notification
    const itemsList = cart.map(i => `• ${i.name} – Rs.${i.price}`).join('\n');
    const msg = `🛍️ *New Order!*\n\nCustomer: ${name}\nPhone: ${phone}\nCity: ${city}\nAddress: ${address}\n\nItems:\n${itemsList}\n\n*Total: Rs.${totalPrice}*`;
    window.open(`https://wa.me/923442035118?text=${encodeURIComponent(msg)}`, '_blank');
    setCart([]); setShowCheckout(false);
    setCheckoutForm({ name: '', phone: '', email: '', address: '', city: '' });
    alert('✅ Order placed successfully! Admin has been notified via WhatsApp.');
  };

  // Add product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.stock) { alert('Fill name, price, stock'); return; }
    if (newProduct.images.length === 0) { alert('Upload at least one image'); return; }
    setUploading(true);
    const { data, error } = await supabase.from('products').insert([{
      id: Date.now(), name: newProduct.name, price: parseFloat(newProduct.price),
      description: newProduct.description, image: newProduct.images[0],
      images: newProduct.images, stock: parseInt(newProduct.stock),
      category: newProduct.category
    }]).select();
    setUploading(false);
    if (error) { alert('Failed to add product'); return; }
    setProducts(prev => [data[0], ...prev]);
    setNewProduct({ name: '', price: '', description: '', stock: '', category: 'General', images: [] });
    alert('✅ Product added!');
  };

  // Edit product
  const handleSaveEdit = async () => {
    const { error } = await supabase.from('products').update({
      name: editingProduct.name, price: parseFloat(editingProduct.price),
      description: editingProduct.description, stock: parseInt(editingProduct.stock),
      category: editingProduct.category,
      image: editingProduct.images?.[0] || editingProduct.image,
      images: editingProduct.images || [editingProduct.image]
    }).eq('id', editingProduct.id);
    if (error) { alert('Failed to update'); return; }
    setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...editingProduct } : p));
    setEditingProduct(null);
    alert('✅ Product updated!');
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleImagesUpload = (e, isEdit = false) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isEdit) setEditingProduct(prev => ({ ...prev, images: [...(prev.images || []), reader.result] }));
        else setNewProduct(prev => ({ ...prev, images: [...prev.images, reader.result] }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const updateOrderStatus = async (orderId, status) => {
    await supabase.from('orders').update({ status }).eq('id', orderId);
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const getStatusClass = (s) => s === 'Pending' ? 'status-pending' : s === 'Shipped' ? 'status-shipped' : s === 'Delivered' ? 'status-delivered' : 'status-cancelled';

  const totalRevenue = orders.filter(o => o.status === 'Delivered').reduce((s, o) => s + o.total_price, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const bestSelling = products.map(p => ({ ...p, orderCount: orders.filter(o => o.items?.some(i => i.id === p.id)).length })).sort((a, b) => b.orderCount - a.orderCount).slice(0, 5);

  const handleAdminClick = () => {
    const pw = prompt('Admin password:');
    if (pw === 'lyfelytic2024') { setIsAdmin(true); setMobileMenuOpen(false); }
    else if (pw !== null) alert('Wrong password!');
  };

  if (selectedProduct) {
    return (
      <div className="lyfelytic-container">
        <style>{styles}</style>
        <ProductPage product={selectedProduct} onBack={() => setSelectedProduct(null)} onAddToCart={addToCart} allProducts={products} />
      </div>
    );
  }

  return (
    <div className="lyfelytic-container">
      <style>{styles}</style>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowCheckout(false)}>
          <div className="modal">
            <div className="modal-title"><ClipboardList size={22} /> Place Your Order</div>
            <div className="modal-order-summary">
              {cart.map((item, i) => (
                <div key={i} className="modal-order-item">
                  <span>{item.name}</span><span>Rs. {item.price}</span>
                </div>
              ))}
              <div className="modal-total"><span>Total</span><span style={{ color: 'var(--accent)' }}>Rs. {totalPrice}</span></div>
            </div>
            <input className="modal-input" placeholder="Full Name *" value={checkoutForm.name} onChange={e => setCheckoutForm({ ...checkoutForm, name: e.target.value })} />
            <div className="modal-row">
              <input className="modal-input" placeholder="Phone *" value={checkoutForm.phone} onChange={e => setCheckoutForm({ ...checkoutForm, phone: e.target.value })} />
              <input className="modal-input" placeholder="Email (optional)" value={checkoutForm.email} onChange={e => setCheckoutForm({ ...checkoutForm, email: e.target.value })} />
            </div>
            <input className="modal-input" placeholder="Full Address *" value={checkoutForm.address} onChange={e => setCheckoutForm({ ...checkoutForm, address: e.target.value })} />
            <input className="modal-input" placeholder="City *" value={checkoutForm.city} onChange={e => setCheckoutForm({ ...checkoutForm, city: e.target.value })} />
            <div className="modal-btns">
              <button className="modal-cancel" onClick={() => setShowCheckout(false)}>Cancel</button>
              <button className="modal-confirm" onClick={handlePlaceOrder}>📱 Confirm order</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="edit-modal-overlay" onClick={e => e.target === e.currentTarget && setEditingProduct(null)}>
          <div className="edit-modal">
            <div className="modal-title"><Edit2 size={20} /> Edit Product</div>
            <input className="modal-input" placeholder="Name" value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} />
            <div className="modal-row">
              <input className="modal-input" type="number" placeholder="Price" value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value })} />
              <input className="modal-input" type="number" placeholder="Stock" value={editingProduct.stock} onChange={e => setEditingProduct({ ...editingProduct, stock: e.target.value })} />
            </div>
            <select className="modal-input" value={editingProduct.category} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            <textarea className="modal-input" style={{ resize: 'vertical', minHeight: 70 }} placeholder="Description" value={editingProduct.description} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} />
            <label className="image-upload-area" style={{ marginBottom: 12 }}>
              <input type="file" accept="image/*" multiple onChange={e => handleImagesUpload(e, true)} />
              <div className="upload-text"><Upload size={18} /> Add more images</div>
            </label>
            {editingProduct.images?.length > 0 && (
              <div className="image-preview" style={{ marginBottom: 14 }}>
                {editingProduct.images.map((img, idx) => (
                  <div key={idx} className={`preview-item ${idx === 0 ? 'primary' : ''}`}>
                    <img src={img} alt="" />
                    {idx === 0 && <div className="preview-primary-badge">MAIN</div>}
                    <button type="button" className="remove-image-btn" onClick={() => setEditingProduct(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}>✕</button>
                  </div>
                ))}
              </div>
            )}
            <div className="modal-btns">
              <button className="modal-cancel" onClick={() => setEditingProduct(null)}>Cancel</button>
              <button className="modal-confirm" onClick={handleSaveEdit}><Check size={16} /> Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="lyfelytic-header">
        <div className="header-content">
          <div className="brand"><Package size={26} /><div><h1>Lyfelytic</h1><p>Daily Life Accessories</p></div></div>
          <div className="nav-buttons">
            {!isAdmin && (
              <>
                <button onClick={() => { setView('shop'); setIsAdmin(false); }} className="nav-btn nav-btn-shop"><Home size={15} /> Shop</button>
                <button onClick={() => setView('wishlist')} className="nav-btn" style={{ background: wishlist.length ? '#d4936f' : '#ddd6cc', border: '1px solid #c1b5a3', color: wishlist.length ? 'white' : '#3a3a3a' }}>
                  <Heart size={15} fill={wishlist.length ? 'white' : 'none'} color={wishlist.length ? 'white' : '#3a3a3a'} /> {wishlist.length > 0 && wishlist.length}
                </button>
                <button onClick={handleAdminClick} className="nav-btn nav-btn-admin">Admin</button>
                <button className="nav-btn nav-btn-cart" onClick={() => cart.length && setShowCheckout(true)}>
                  <ShoppingCart size={15} /> Cart {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
                </button>
              </>
            )}
            {isAdmin && <button onClick={() => setIsAdmin(false)} className="nav-btn nav-btn-exit"><LogOut size={15} /> Exit Admin</button>}
          </div>
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          {!isAdmin && (
            <>
              <button onClick={() => { setView('shop'); setMobileMenuOpen(false); }} className="mobile-menu-btn-item"><Home size={16} /> Shop</button>
              <button onClick={() => { setView('wishlist'); setMobileMenuOpen(false); }} className="mobile-menu-btn-item"><Heart size={16} /> Wishlist {wishlist.length > 0 && `(${wishlist.length})`}</button>
              <button onClick={handleAdminClick} className="mobile-menu-btn-item">Admin</button>
              <button onClick={() => { cart.length && setShowCheckout(true); setMobileMenuOpen(false); }} className="mobile-menu-btn-item"><ShoppingCart size={16} /> Cart ({cart.length})</button>
            </>
          )}
          {isAdmin && <button onClick={() => { setIsAdmin(false); setMobileMenuOpen(false); }} className="mobile-menu-btn-item"><LogOut size={16} /> Exit Admin</button>}
        </div>
      </header>

      {/* Search & Filters — only in shop view */}
      {!isAdmin && view === 'shop' && (
        <>
          <div className="search-bar-wrapper">
            <div className="search-bar">
              <Search size={18} color="var(--text-lt)" />
              <input placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              {searchQuery && <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: 'var(--text-lt)', cursor: 'pointer' }}><X size={16} /></button>}
            </div>
          </div>
          <div className="filter-bar">
            <div className="category-chips">
              {['All', ...categories].map(cat => <button key={cat} className={`chip ${selectedCategory === cat ? 'active' : ''}`} onClick={() => setSelectedCategory(cat)}>{cat}</button>)}
            </div>
            <div className="filter-selects">
              <select className="filter-select" value={priceRange} onChange={e => setPriceRange(e.target.value)}>
                <option value="all">All Prices</option>
                <option value="under500">Under Rs.500</option>
                <option value="500-1000">Rs.500–1000</option>
                <option value="1000-2000">Rs.1000–2000</option>
                <option value="above2000">Above Rs.2000</option>
              </select>
              <select className="filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price-asc">Price ↑</option>
                <option value="price-desc">Price ↓</option>
              </select>
            </div>
          </div>
        </>
      )}

      <main className="main-content">

        {/* WISHLIST VIEW */}
        {!isAdmin && view === 'wishlist' && (
          <div>
            <div className="section-title">
              <h2>Your Wishlist</h2>
              <p>{wishlistProducts.length} saved item{wishlistProducts.length !== 1 ? 's' : ''}</p>
            </div>
            {wishlistProducts.length === 0 ? (
              <div className="wishlist-empty">
                <Heart size={48} color="var(--text-lt)" />
                <h3>Your wishlist is empty</h3>
                <p>Tap the heart on any product to save it here</p>
                <button className="submit-btn" style={{ marginTop: 16 }} onClick={() => setView('shop')}>Browse Products</button>
              </div>
            ) : (
              <div className="products-grid">
                {wishlistProducts.map(product => (
                  <div key={product.id} className="product-card">
                    <div className="product-image" onClick={() => setSelectedProduct(product)}>
                      <img src={getThumb(product)} alt={product.name} />
                      {product.stock === 0 && <div className="out-of-stock">Out of Stock</div>}
                      {product.stock > 0 && product.stock <= 5 && <div className="stock-low-badge">🔥 Only {product.stock} left!</div>}
                      <button className="wishlist-btn active" onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }}><Heart size={16} fill="white" color="white" /></button>
                    </div>
                    <div className="product-info">
                      <div className="product-name">{product.name}</div>
                      <div className="product-price">Rs.{product.price}</div>
                      <button className="add-to-cart-btn" onClick={() => addToCart(product)} disabled={product.stock === 0}><ShoppingCart size={14} /> Add to Cart</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SHOP VIEW */}
        {!isAdmin && view === 'shop' && (
          <div>
            <div className="section-title">
              <h2>Daily Life Accessories</h2>
              <p>{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found</p>
            </div>
            <div className="products-container">
              <div>
                {loading && <p style={{ textAlign: 'center', padding: 20, color: 'var(--text-md)' }}>Loading products...</p>}
                {!loading && filteredProducts.length === 0 && <p style={{ textAlign: 'center', padding: 20, color: 'var(--text-lt)' }}>No products found. Try a different search or filter.</p>}
                <div className="products-grid">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="product-card">
                      <div className="product-image" onClick={() => setSelectedProduct(product)}>
                        <img src={getThumb(product)} alt={product.name} />
                        {product.stock === 0 && <div className="out-of-stock">Out of Stock</div>}
                        {product.stock > 0 && product.stock <= 5 && <div className="stock-low-badge">🔥 Only {product.stock} left!</div>}
                        <button className={`wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}`} onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }}>
                          <Heart size={15} fill={wishlist.includes(product.id) ? 'white' : 'none'} color="white" />
                        </button>
                        {product.images?.length > 1 && <div className="multi-img-badge">📷 {product.images.length}</div>}
                      </div>
                      <div className="product-info">
                        {product.category && <div className="product-category-tag">{product.category}</div>}
                        <div className="product-name">{product.name}</div>
                        <div className="product-description">{product.description}</div>
                        <div className="product-price">Rs.{product.price}</div>
                        <div className="product-stock">{product.stock} in stock</div>
                        <button className="view-details-btn" onClick={() => setSelectedProduct(product)}>View Details</button>
                        <button className="add-to-cart-btn" onClick={() => addToCart(product)} disabled={product.stock === 0}><ShoppingCart size={14} /> Add to Cart</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Sidebar */}
              <div className="cart-sidebar">
                <div className="cart-title"><ShoppingCart size={17} /> Your Cart</div>
                {cart.length === 0 ? <div className="cart-empty">Your cart is empty</div> : (
                  <>
                    <div className="cart-items">
                      {cart.map((item, i) => (
                        <div key={i} className="cart-item">
                          <div><div className="cart-item-name">{item.name}</div><div className="cart-item-price">Rs.{item.price}</div></div>
                          <button onClick={() => removeFromCart(i)} className="remove-btn">✕</button>
                        </div>
                      ))}
                    </div>
                    <div className="cart-total"><div className="total-price">Total: Rs.{totalPrice}</div></div>
                    <button onClick={() => setShowCheckout(true)} className="checkout-btn">🛍️ Checkout ({cart.length})</button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ADMIN VIEW */}
        {isAdmin && (
          <div className="admin-panel">
            <div className="admin-title"><Package size={22} /> Admin Panel</div>
            <div className="admin-tabs">
              <button className={`admin-tab ${adminTab === 'products' ? 'active' : ''}`} onClick={() => setAdminTab('products')}><Package size={15} /> Products</button>
              <button className={`admin-tab ${adminTab === 'orders' ? 'active' : ''}`} onClick={() => setAdminTab('orders')}><ClipboardList size={15} /> Orders {pendingOrders > 0 && <span style={{ background: 'var(--accent)', color: 'white', borderRadius: 20, padding: '1px 7px', fontSize: 11 }}>{pendingOrders}</span>}</button>
              <button className={`admin-tab ${adminTab === 'dashboard' ? 'active' : ''}`} onClick={() => setAdminTab('dashboard')}><BarChart2 size={15} /> Dashboard</button>
              <button className={`admin-tab ${adminTab === 'categories' ? 'active' : ''}`} onClick={() => setAdminTab('categories')}><Filter size={15} /> Categories</button>
            </div>

            {/* PRODUCTS TAB */}
            {adminTab === 'products' && (
              <>
                <div className="add-product-form">
                  <div className="form-title"><Plus size={16} /> Add New Product</div>
                  <form onSubmit={handleAddProduct}>
                    <div className="form-grid">
                      <input type="text" placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="form-input" required />
                      <input type="number" placeholder="Price (Rs.)" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} className="form-input" required />
                      <input type="number" placeholder="Stock" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} className="form-input" required />
                      <select className="form-input" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                        {categories.map(c => <option key={c}>{c}</option>)}
                      </select>
                      <textarea placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} className="form-input form-textarea form-full" />
                    </div>
                    <div className="form-full" style={{ marginBottom: 12 }}>
                      <label className="image-upload-area">
                        <input type="file" accept="image/*" multiple onChange={handleImagesUpload} disabled={newProduct.images.length >= 8} />
                        <div className="upload-text"><Upload size={18} />{newProduct.images.length === 0 ? 'Upload images (select multiple)' : `Add more (${newProduct.images.length}/8)`}</div>
                        <div className="upload-hint">First image = main photo · Max 8</div>
                      </label>
                      {newProduct.images.length > 0 && (
                        <div className="image-preview">
                          {newProduct.images.map((img, idx) => (
                            <div key={idx} className={`preview-item ${idx === 0 ? 'primary' : ''}`}>
                              <img src={img} alt="" />
                              {idx === 0 && <div className="preview-primary-badge">MAIN</div>}
                              <button type="button" className="remove-image-btn" onClick={() => setNewProduct(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}>✕</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <button type="submit" className="submit-btn" disabled={uploading}>{uploading ? '⏳ Saving...' : '✅ Add Product'}</button>
                  </form>
                </div>

                <div className="products-management">
                  <div className="management-title">All Products ({products.length})</div>
                  <div className="products-management-grid">
                    {products.map(product => (
                      <div key={product.id} className="product-management-card">
                        <div className="product-management-image"><img src={getThumb(product)} alt={product.name} /></div>
                        <div className="product-management-img-count">📷 {product.images?.length || 1} image(s) · {product.category}</div>
                        <div className="product-name" style={{ color: 'var(--text)' }}>{product.name}</div>
                        <div className="product-price" style={{ color: 'var(--accent)', fontSize: 16 }}>Rs.{product.price}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-lt)' }}>Stock: {product.stock}</div>
                        <div className="admin-card-actions">
                          <button className="edit-btn" onClick={() => setEditingProduct({ ...product, images: product.images || [product.image] })}><Edit2 size={13} /> Edit</button>
                          <button className="delete-btn" onClick={() => handleDeleteProduct(product.id)}><Trash2 size={13} /> Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ORDERS TAB */}
            {adminTab === 'orders' && (
              <div className="orders-section">
                <div className="management-title">All Orders ({orders.length})</div>

                {/* Desktop Table */}
                <div className="orders-desktop">
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>Customer</th><th>Items</th><th>Total</th><th>City</th><th>Date</th><th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td><div style={{ color: 'var(--text)', fontWeight: 600 }}>{order.customer_name}</div><div style={{ fontSize: 11 }}>{order.customer_phone}</div></td>
                          <td>{order.items?.map(i => i.name).join(', ')}</td>
                          <td style={{ color: 'var(--accent)', fontWeight: 700 }}>Rs.{order.total_price}</td>
                          <td>{order.customer_city}</td>
                          <td>{new Date(order.created_at).toLocaleDateString()}</td>
                          <td>
                            <select className={`order-status-select ${getStatusClass(order.status)}`} value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value)}>
                              <option>Pending</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {orders.length === 0 && <div style={{ textAlign: 'center', padding: 30, color: 'var(--text-lt)' }}>No orders yet</div>}
                </div>

                {/* Mobile Cards */}
                {orders.map(order => (
                  <div key={order.id} className="orders-mobile-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ fontWeight: 700, color: 'var(--text)' }}>{order.customer_name}</div>
                      <div style={{ color: 'var(--accent)', fontWeight: 700 }}>Rs.{order.total_price}</div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-md)', marginBottom: 4 }}>{order.customer_phone} · {order.customer_city}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-lt)', marginBottom: 10 }}>{order.items?.map(i => i.name).join(', ')}</div>
                    <select className={`order-status-select ${getStatusClass(order.status)}`} value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value)}>
                      <option>Pending</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option>
                    </select>
                  </div>
                ))}
              </div>
            )}

            {/* DASHBOARD TAB */}
            {adminTab === 'dashboard' && (
              <div>
                <div className="dashboard-grid">
                  <div className="stat-card"><div className="stat-label">Total Orders</div><div className="stat-value">{orders.length}</div><div className="stat-sub">All time</div></div>
                  <div className="stat-card"><div className="stat-label">Revenue</div><div className="stat-value stat-accent">Rs.{totalRevenue.toLocaleString()}</div><div className="stat-sub">From delivered</div></div>
                  <div className="stat-card"><div className="stat-label">Pending</div><div className="stat-value stat-purple">{pendingOrders}</div><div className="stat-sub">Need attention</div></div>
                  <div className="stat-card"><div className="stat-label">Products</div><div className="stat-value stat-green">{products.length}</div><div className="stat-sub">In catalogue</div></div>
                </div>

                <div className="top-products">
                  <div className="management-title">🏆 Best Selling Products</div>
                  {bestSelling.map((p, i) => (
                    <div key={p.id} className="top-product-row">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ color: 'var(--text-lt)', fontSize: 13, width: 20 }}>#{i + 1}</div>
                        <div style={{ width: 36, height: 36, borderRadius: 8, overflow: 'hidden', background: 'var(--bg3)' }}>
                          <img src={getThumb(p)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div><div style={{ color: 'var(--text)', fontWeight: 600, fontSize: 13 }}>{p.name}</div><div style={{ color: 'var(--text-lt)', fontSize: 11 }}>Rs.{p.price}</div></div>
                      </div>
                      <div style={{ color: 'var(--accent2)', fontWeight: 700, fontSize: 13 }}>{p.orderCount} orders</div>
                    </div>
                  ))}
                  {bestSelling.length === 0 && <div style={{ color: 'var(--text-lt)', fontSize: 13 }}>No order data yet</div>}
                </div>
              </div>
            )}

            {/* CATEGORIES TAB */}
            {adminTab === 'categories' && (
              <div className="categories-section">
                <div className="add-product-form" style={{ marginBottom: 24 }}>
                  <div className="form-title"><Plus size={16} /> Add New Category</div>
                  <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      placeholder="Category name (e.g. Jewelry)"
                      value={newCategoryName}
                      onChange={e => setNewCategoryName(e.target.value)}
                      className="form-input"
                      style={{ flex: 1, minWidth: 180 }}
                    />
                    <button type="submit" className="submit-btn" disabled={savingCategory} style={{ width: 'auto', padding: '0 20px' }}>
                      {savingCategory ? '⏳ Saving...' : '✅ Add Category'}
                    </button>
                  </form>
                </div>

                <div className="products-management">
                  <div className="management-title">All Categories ({categories.length})</div>
                  {categories.length === 0 && <div style={{ color: 'var(--text-lt)', fontSize: 13 }}>No categories yet — add one above.</div>}
                  <div className="products-management-grid">
                    {categories.map(cat => {
                      const count = products.filter(p => p.category === cat).length;
                      return (
                        <div key={cat} className="product-management-card" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <div className="product-name" style={{ color: 'var(--text)' }}>{cat}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-lt)' }}>{count} product{count === 1 ? '' : 's'}</div>
                          <div className="admin-card-actions">
                            <button className="delete-btn" onClick={() => handleDeleteCategory(cat)}><Trash2 size={13} /> Delete</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>📞 WhatsApp: 03442035118</p>
        <p>💳 Cash on Delivery (COD)</p>
        <p>🚚 Free delivery available</p>
        <p style={{ marginTop: 10, color: 'var(--text-lt)' }}>© 2024 Lyfelytic. All rights reserved.</p>
      </footer>
    </div>
  );
}
