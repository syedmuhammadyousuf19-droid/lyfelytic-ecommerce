import { useLayoutEffect } from 'react';
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
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,800&family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body, #root { height: 100%; }
  body { font-family: 'Manrope', sans-serif; }

  :root {
    --bg:        #ffffff;
    --bg2:       #f4f6f4;
    --bg3:       #eaede9;
    --card:      #ffffff;
    --border:    rgba(18, 24, 21, 0.12);
    --ink:       #121815;
    --ink-soft:  #2a322d;
    --slate:     #5b6660;
    --slate-lt:  #8b948e;

    --teal:       #0e5f52;
    --teal-dark:  #0a473d;
    --teal-lt:    rgba(14, 95, 82, 0.09);
    --teal-lt2:   rgba(14, 95, 82, 0.18);

    --coral:      #ff6b4a;
    --coral-dark: #e5502f;
    --coral-lt:   rgba(255, 107, 74, 0.12);

    --gold:       #f5a623;
    --danger:     #e5484d;
    --danger-lt:  rgba(229, 72, 77, 0.12);

    --accent:   var(--teal);
    --accent2:  var(--coral);
    --shadow:   rgba(18, 24, 21, 0.10);
    --shadow-lg: rgba(18, 24, 21, 0.18);
    --glass:    rgba(14, 95, 82, 0.10);
    --glass-b:  rgba(14, 95, 82, 0.20);
  }

  .lyfelytic-container {
    min-height: 100vh;
    background: var(--bg);
  }

  /* ── HEADER ── */
  .lyfelytic-header {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border);
    color: var(--ink); padding: 14px 20px;
    position: sticky; top: 0; z-index: 200;
  }
  .header-content { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
  .header-content svg { color: var(--ink); stroke: currentColor; }
  .brand { display: flex; align-items: center; gap: 12px; flex: 1; }
  .brand svg { color: var(--teal); }
  .brand h1 { font-size: 22px; font-weight: 700; font-family: 'Fraunces', serif; background: linear-gradient(135deg, var(--teal), var(--coral)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .brand p { color: var(--slate); font-size: 12px; display: none; font-family: 'Space Grotesk', monospace; letter-spacing: 0.3px; }
  @media (min-width: 768px) { .brand p { display: block; } }

  .nav-buttons { display: none; gap: 6px; align-items: center; }
  @media (min-width: 768px) { .nav-buttons { display: flex; } }

  .nav-btn {
    padding: 9px 16px; border-radius: 8px; font-weight: 600;
    cursor: pointer; transition: all 0.2s ease; display: flex;
    align-items: center; gap: 6px; font-size: 13px;
    white-space: nowrap; background: transparent; border: 1px solid transparent;
    color: var(--ink-soft); font-family: 'Manrope', sans-serif;
  }
  .nav-btn-shop { color: var(--teal); }
  .nav-btn-shop:hover { background: var(--teal-lt); }
  .nav-btn-admin { color: var(--slate); border: 1px solid var(--border); }
  .nav-btn-admin:hover { background: var(--bg2); color: var(--ink); }
  .nav-btn-exit { color: var(--danger); border: 1px solid rgba(229,72,77,0.28); }
  .nav-btn-exit:hover { background: var(--danger-lt); }
  .nav-btn-cart {
    background: var(--coral); color: #ffffff; border: 1px solid var(--coral-dark);
    box-shadow: 0 3px 10px rgba(255,107,74,0.28); position: relative;
  }
  .nav-btn-cart:hover { background: var(--coral-dark); transform: translateY(-1px); }
  .cart-badge {
    position: absolute; top: -8px; right: -8px;
    background: var(--ink); color: white; border-radius: 50%;
    width: 20px; height: 20px; display: flex; align-items: center;
    justify-content: center; font-size: 11px; font-weight: 700;
    font-family: 'Space Grotesk', monospace;
    animation: badgePulse 0.35s ease;
  }
  @keyframes badgePulse { 0% { transform: scale(0.4); } 60% { transform: scale(1.18); } 100% { transform: scale(1); } }

  .mobile-menu-btn { background: none; border: none; color: var(--ink); cursor: pointer; display: flex; align-items: center; }
  @media (min-width: 768px) { .mobile-menu-btn { display: none; } }

  .mobile-menu {
    display: none; position: absolute; top: 65px; left: 0; right: 0;
    background: rgba(255, 255, 255, 0.97); backdrop-filter: blur(20px);
    flex-direction: column; gap: 8px; padding: 12px;
    border-bottom: 1px solid var(--border);
  }
  .mobile-menu.open { display: flex; }
  @media (min-width: 768px) { .mobile-menu { display: none !important; } }
  .mobile-menu-btn-item {
    padding: 12px; background: var(--bg2); border: 1px solid var(--border);
    color: var(--ink); border-radius: 8px; cursor: pointer; font-weight: 600;
    display: flex; align-items: center; gap: 8px;
    transition: all 0.2s ease; font-family: 'Manrope', sans-serif;
  }
  .mobile-menu-btn-item:hover { background: var(--teal-lt); border-color: var(--teal); color: var(--teal); }

  /* ── HERO ── */
  .hero { position: relative; overflow: hidden; padding: 52px 20px 36px; text-align: center; background: var(--bg2); border-bottom: 1px solid var(--border); }
  .hero-glow {
    position: absolute; top: -130px; left: 50%; width: 560px; height: 340px;
    transform: translateX(-50%); pointer-events: none;
    background: radial-gradient(closest-side, rgba(14,95,82,0.18), transparent 72%);
    filter: blur(6px);
    animation: heroDrift 16s ease-in-out infinite;
  }
  @keyframes heroDrift {
    0%, 100% { transform: translateX(-54%) translateY(0); }
    50% { transform: translateX(-46%) translateY(20px); }
  }
  .hero-inner { position: relative; max-width: 640px; margin: 0 auto; }
  .hero-eyebrow {
    display: inline-block; font-family: 'Space Grotesk', monospace; font-size: 11px; font-weight: 700;
    letter-spacing: 1.5px; text-transform: uppercase; color: var(--teal);
    background: var(--teal-lt); padding: 6px 14px; border-radius: 20px; margin-bottom: 18px;
    opacity: 0; animation: heroFadeUp 0.6s ease forwards;
  }
  .hero-title {
    font-family: 'Fraunces', serif; font-weight: 700; font-size: 32px; line-height: 1.15;
    color: var(--ink); margin-bottom: 14px;
    opacity: 0; animation: heroFadeUp 0.6s ease 0.1s forwards;
  }
  @media (min-width: 768px) { .hero-title { font-size: 46px; } }
  .hero-accent { color: var(--coral); }
  .hero-sub {
    color: var(--slate); font-size: 15px; line-height: 1.65; max-width: 480px; margin: 0 auto 22px;
    opacity: 0; animation: heroFadeUp 0.6s ease 0.2s forwards;
  }
  .hero-badges {
    display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;
    opacity: 0; animation: heroFadeUp 0.6s ease 0.3s forwards;
  }
  .hero-badge {
    font-size: 12px; font-weight: 600; color: var(--ink-soft); background: var(--card);
    border: 1px solid var(--border); padding: 7px 14px; border-radius: 20px; box-shadow: 0 2px 6px var(--shadow);
  }
  @keyframes heroFadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  @media (prefers-reduced-motion: reduce) {
    .hero-glow { animation: none; }
    .hero-eyebrow, .hero-title, .hero-sub, .hero-badges { animation: none; opacity: 1; }
  }

  /* ── SCROLL REVEAL ── */
  .reveal { opacity: 0; transform: translateY(18px); transition: opacity 0.55s ease, transform 0.55s ease; }
  .reveal-visible { opacity: 1; transform: translateY(0); }
  @media (prefers-reduced-motion: reduce) {
    .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
  }

  /* ── TACTILE PRESS FEEDBACK ── */
  .add-to-cart-btn:active:not(:disabled), .checkout-btn:active, .view-details-btn:active,
  .chip:active, .submit-btn:active:not(:disabled), .modal-confirm:active, .btn-whatsapp:active,
  .btn-add-cart:active:not(:disabled), .nav-btn:active, .edit-btn:active, .delete-btn:active,
  .mobile-menu-btn-item:active {
    transform: scale(0.97);
  }

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
  .search-bar:focus-within { border-color: var(--teal); box-shadow: 0 0 0 3px var(--teal-lt); }
  .search-bar input {
    flex: 1; background: none; border: none; outline: none;
    color: var(--text); font-size: 14px; font-family: inherit;
  }
  .search-bar input::placeholder { color: var(--slate-lt); }

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
    cursor: pointer; transition: all 0.2s ease; border: 1.5px solid var(--border);
    background: white; color: var(--ink-soft); white-space: nowrap;
    flex-shrink: 0; box-shadow: 0 2px 4px var(--shadow); font-family: 'Manrope', sans-serif;
  }
  .chip:hover { background: var(--teal-lt); border-color: var(--teal); color: var(--teal); }
  .chip.active { 
    background: var(--teal); border-color: var(--teal); color: white; 
    box-shadow: 0 4px 12px var(--teal-lt2);
  }
  .chip.active:hover { background: var(--teal-dark); }

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
    background: white; border: 1.5px solid var(--border);
    color: var(--ink-soft); cursor: pointer; font-family: 'Manrope', sans-serif; outline: none;
    transition: all 0.2s; box-shadow: 0 2px 4px var(--shadow);
  }
  .filter-select:hover { border-color: var(--teal); background: var(--teal-lt); }
  .filter-select:focus { border-color: var(--teal); box-shadow: 0 0 0 3px var(--teal-lt); }
  .filter-select option { background: white; color: var(--ink); padding: 8px; }

  /* ── MAIN ── */
  .main-content { max-width: 1200px; margin: 24px auto; padding: 0 16px; margin-bottom: 40px; }
  .section-title { text-align: center; margin-bottom: 32px; }
  .section-title h2 { font-size: 26px; font-weight: 700; font-family: 'Fraunces', serif; color: var(--ink); margin-bottom: 8px; letter-spacing: -0.3px; }
  .section-title p { color: var(--slate); font-size: 13px; font-weight: 600; font-family: 'Space Grotesk', monospace; letter-spacing: 0.3px; }

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
    border: 1px solid var(--border); transition: all 0.3s ease; cursor: pointer;
    position: relative; flex-shrink: 0;
  }
  @media (max-width: 768px) {
    .product-card { width: 160px; max-width: 160px; flex: 0 0 160px; }
  }
  .product-card:hover { transform: translateY(-4px); border-color: var(--teal); box-shadow: 0 10px 24px var(--shadow-lg); }

  .product-image { width: 100%; height: 200px; background: var(--bg3); overflow: hidden; position: relative; }
  @media (max-width: 768px) { .product-image { height: 160px; } }
  .product-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; display: block; }
  .product-card:hover .product-image img { transform: scale(1.04); }

  .out-of-stock {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(18,24,21,0.65); display: flex; align-items: center;
    justify-content: center; color: white; font-weight: 700; font-size: 14px;
  }

  /* Stock low badge */
  .stock-low-badge {
    position: absolute; top: 10px; left: 10px;
    background: var(--coral); color: white;
    padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700;
    font-family: 'Space Grotesk', monospace;
    text-transform: uppercase; letter-spacing: 0.5px;
    box-shadow: 0 2px 8px rgba(255,107,74,0.35);
  }

  /* Wishlist heart */
  .wishlist-btn {
    position: absolute; top: 10px; right: 10px;
    background: rgba(255, 255, 255, 0.92); border: 1px solid var(--border); border-radius: 50%;
    width: 38px; height: 38px; display: flex; align-items: center;
    justify-content: center; cursor: pointer;
    transition: all 0.2s ease; z-index: 5;
  }
  .wishlist-btn:hover { background: #ffffff; transform: scale(1.1); border-color: var(--coral); }
  .wishlist-btn.active { background: var(--coral); border-color: var(--coral-dark); }

  .multi-img-badge {
    position: absolute; bottom: 10px; right: 10px;
    background: rgba(18, 24, 21, 0.8); color: white;
    border-radius: 12px; padding: 4px 10px; font-size: 11px;
    font-family: 'Space Grotesk', monospace; font-weight: 600;
  }

  .product-info { padding: 14px; background: var(--card); }
  .product-category-tag {
    font-size: 9px; font-weight: 700; color: var(--teal); font-family: 'Space Grotesk', monospace;
    text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px;
  }
  .product-name { font-size: 15px; font-weight: 700; color: var(--ink); margin-bottom: 4px; line-height: 1.3; }
  .product-description { color: var(--slate); font-size: 12px; margin-bottom: 8px; line-height: 1.4; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }

  .product-price {
    position: relative; display: inline-flex; align-items: center;
    font-family: 'Space Grotesk', monospace; font-weight: 700; font-size: 17px;
    color: var(--teal-dark); background: var(--teal-lt);
    padding: 3px 10px 3px 18px; border-radius: 4px 10px 10px 4px; margin-bottom: 6px;
  }
  .product-price::before {
    content: ''; position: absolute; left: 6px; top: 50%; transform: translateY(-50%);
    width: 4px; height: 4px; border-radius: 50%; background: var(--card);
  }
  .product-stock { color: var(--slate-lt); font-size: 11px; margin-bottom: 10px; font-weight: 600; font-family: 'Space Grotesk', monospace; }

  .product-rating-row { display: flex; align-items: center; gap: 6px; margin-bottom: 10px; }
  .stars-sm { display: flex; gap: 1px; }
  .rating-count { font-size: 11px; color: var(--slate-lt); }

  .view-details-btn {
    width: 100%; padding: 8px;
    background: var(--bg2); color: var(--ink-soft);
    border: 1px solid var(--border); border-radius: 8px;
    font-weight: 600; cursor: pointer; transition: all 0.2s ease;
    font-size: 13px; margin-bottom: 8px; font-family: 'Manrope', sans-serif;
  }
  .view-details-btn:hover { background: var(--bg3); border-color: var(--teal); color: var(--teal); }

  .add-to-cart-btn {
    width: 100%; padding: 10px;
    background: var(--teal); color: white;
    border: 1px solid var(--teal-dark); border-radius: 8px;
    font-weight: 700; cursor: pointer; transition: all 0.2s ease;
    display: flex; align-items: center; justify-content: center;
    gap: 6px; font-size: 13px; font-family: 'Manrope', sans-serif;
  }
  .add-to-cart-btn:hover:not(:disabled) { background: var(--teal-dark); transform: translateY(-2px); box-shadow: 0 4px 12px var(--teal-lt2); }
  .add-to-cart-btn:disabled { background: var(--bg2); color: var(--slate-lt); border-color: var(--border); cursor: not-allowed; }

  /* ── CART ── */
  .cart-sidebar {
    background: var(--card); border-radius: 14px; padding: 16px;
    border: 1px solid var(--border); position: sticky; top: 90px; height: fit-content;
  }
  @media (max-width: 1024px) { .cart-sidebar { position: static; } }
  .cart-title { font-size: 16px; font-weight: 700; color: var(--ink); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; font-family: 'Fraunces', serif; }
  .cart-empty { text-align: center; color: var(--slate-lt); padding: 24px 0; font-size: 14px; }
  .cart-items { max-height: 280px; overflow-y: auto; margin-bottom: 16px; }
  .cart-item { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--border); padding-bottom: 10px; margin-bottom: 10px; font-size: 13px; }
  .cart-item-name { font-weight: 600; color: var(--ink); }
  .cart-item-price { color: var(--teal-dark); font-weight: 700; font-size: 12px; font-family: 'Space Grotesk', monospace; }
  .remove-btn { background: none; border: none; color: var(--danger); cursor: pointer; font-size: 16px; margin-left: 8px; }
  .cart-total { border-top: 1px solid var(--border); padding-top: 10px; margin-bottom: 12px; }
  .total-price { font-size: 17px; font-weight: 700; color: var(--ink); font-family: 'Space Grotesk', monospace; }

  .checkout-btn {
    width: 100%; padding: 12px;
    background: var(--teal); color: white;
    border: 1px solid var(--teal-dark); border-radius: 8px;
    font-weight: 700; cursor: pointer; transition: all 0.2s ease;
    display: flex; align-items: center; justify-content: center;
    gap: 6px; font-size: 13px; font-family: 'Manrope', sans-serif;
  }
  .checkout-btn:hover { background: var(--teal-dark); transform: translateY(-2px); box-shadow: 0 4px 12px var(--teal-lt2); }

  /* ── CHECKOUT MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(18,24,21,0.5);
    backdrop-filter: blur(8px); z-index: 500;
    display: flex; align-items: center; justify-content: center; padding: 16px;
  }
  .modal {
    background: white; border: 1px solid var(--border);
    border-radius: 16px; padding: 28px; width: 100%; max-width: 500px;
    max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px var(--shadow-lg);
  }
  @media (max-width: 768px) { .modal { padding: 20px; max-width: 100%; } }

  .modal-title { font-size: 21px; font-weight: 700; font-family: 'Fraunces', serif; color: var(--ink); margin-bottom: 24px; display: flex; align-items: center; gap: 10px; }
  
  .modal-input {
    width: 100%; padding: 12px 14px; background: white;
    border: 1.5px solid var(--border); border-radius: 8px;
    color: var(--ink); font-size: 13px; font-family: 'Manrope', sans-serif;
    margin-bottom: 12px; outline: none; transition: all 0.2s;
  }
  .modal-input:focus { border-color: var(--teal); box-shadow: 0 0 0 3px var(--teal-lt); background: white; }
  .modal-input::placeholder { color: var(--slate-lt); }
  
  .modal-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  @media (max-width: 480px) { .modal-row { grid-template-columns: 1fr; } }

  .modal-order-summary { background: var(--bg2); border-radius: 12px; padding: 16px; margin-bottom: 20px; border: 1px solid var(--border); }
  .modal-order-item { display: flex; justify-content: space-between; font-size: 13px; color: var(--slate); padding: 8px 0; border-bottom: 1px solid var(--border); }
  .modal-order-item:last-child { border: none; padding-bottom: 0; }
  .modal-total { display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; color: var(--teal-dark); margin-top: 12px; font-family: 'Space Grotesk', monospace; }
  
  .modal-btns { display: flex; gap: 12px; }
  @media (max-width: 480px) { .modal-btns { flex-direction: column; } }

  .modal-cancel {
    flex: 1; padding: 12px; background: white; color: var(--ink-soft);
    border: 1.5px solid var(--border); border-radius: 8px; font-weight: 600;
    cursor: pointer; font-family: 'Manrope', sans-serif; transition: all 0.2s;
  }
  .modal-cancel:hover { background: var(--bg2); border-color: var(--slate-lt); }

  .modal-confirm {
    flex: 1.5; padding: 12px; background: var(--coral); color: white;
    border: 1px solid var(--coral-dark); border-radius: 8px; font-weight: 700;
    cursor: pointer; font-family: 'Manrope', sans-serif; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .modal-confirm:hover { background: var(--coral-dark); transform: translateY(-2px); box-shadow: 0 4px 12px var(--coral-lt); }

  /* ── PRODUCT DETAIL PAGE ── */
  .product-page {
    background: var(--bg); min-height: 100vh; padding-bottom: 100px;
    max-width: 680px; margin: 0 auto;
    box-shadow: 0 0 60px rgba(18,24,21,0.25);
  }
  .product-page-back {
    display: flex; align-items: center; gap: 8px;
    background: white; padding: 14px 16px;
    border: none; cursor: pointer; width: 100%;
    font-size: 15px; font-weight: 600; color: var(--teal);
    border-bottom: 1px solid var(--border); transition: all 0.2s; font-family: 'Manrope', sans-serif;
  }
  .product-page-back:hover { background: var(--teal-lt); }

  .gallery-wrapper { background: var(--bg2); position: relative; overflow: hidden; width: 100%; }
  .gallery-main { position: relative; width: 100%; height: 300px; overflow: hidden; touch-action: pan-y; }
  @media (min-width: 768px) { .gallery-main { height: 420px; } }
  .gallery-slides { display: flex; height: 100%; width: 100%; transition: transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94); }
  .gallery-slide { min-width: 100%; max-width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: white; flex-shrink: 0; overflow: hidden; }
  .gallery-slide img { width: 100%; height: 100%; max-width: 100%; max-height: 100%; object-fit: contain; padding: 16px; box-sizing: border-box; display: block; }
  
  .gallery-arrow {
    position: absolute; top: 50%; transform: translateY(-50%);
    background: white; border: 1.5px solid var(--border);
    border-radius: 50%; width: 42px; height: 42px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; z-index: 10; color: var(--ink); transition: all 0.2s;
    box-shadow: 0 2px 8px var(--shadow);
  }
  .gallery-arrow:hover { background: var(--teal-lt); border-color: var(--teal); color: var(--teal); }
  .gallery-arrow-left { left: 10px; }
  .gallery-arrow-right { right: 10px; }
  .gallery-arrow-hidden { opacity: 0; pointer-events: none; }
  
  .gallery-dots { display: flex; justify-content: center; gap: 6px; padding: 12px 0 8px; background: white; }
  .gallery-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--bg3); border: none; cursor: pointer; transition: all 0.25s; padding: 0; }
  .gallery-dot.active { background: var(--teal); width: 24px; border-radius: 4px; }
  
  .gallery-thumbs { display: flex; gap: 8px; padding: 12px 16px; background: white; overflow-x: auto; border-bottom: 1px solid var(--border); scrollbar-width: none; -webkit-overflow-scrolling: touch; }
  .gallery-thumbs::-webkit-scrollbar { display: none; }
  .gallery-thumb { flex-shrink: 0; width: 60px; height: 60px; border-radius: 8px; overflow: hidden; border: 2px solid transparent; cursor: pointer; transition: all 0.2s; background: var(--bg2); }
  .gallery-thumb:hover { border-color: var(--teal); }
  .gallery-thumb.active { border-color: var(--teal); box-shadow: 0 0 0 1px var(--teal); }
  .gallery-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }

  .product-details-card { background: var(--bg2); margin-top: 8px; padding: 18px 16px; }
  .product-page-price { font-size: 30px; font-weight: 800; color: var(--teal-dark); margin-bottom: 4px; font-family: 'Space Grotesk', monospace; }
  .product-page-name { font-size: 18px; font-weight: 700; font-family: 'Fraunces', serif; color: var(--ink); line-height: 1.4; margin-bottom: 10px; }
  .product-page-rating { display: flex; align-items: center; gap: 6px; margin-bottom: 12px; }
  .stars { display: flex; gap: 2px; }
  .rating-text { font-size: 13px; color: var(--slate); }
  .product-page-badges { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
  .badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; font-family: 'Space Grotesk', monospace; }
  .badge-cod { background: var(--teal-lt); color: var(--teal-dark); border: 1px solid var(--teal-lt2); }
  .badge-stock { background: rgba(34,197,94,0.12); color: #1a8a4c; border: 1px solid rgba(34,197,94,0.3); }
  .badge-oos { background: var(--danger-lt); color: var(--danger); border: 1px solid rgba(229,72,77,0.3); }
  .product-page-divider { height: 1px; background: var(--border); margin: 14px 0; }
  .product-page-desc-title { font-size: 11px; font-weight: 700; color: var(--slate-lt); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px; font-family: 'Space Grotesk', monospace; }
  .product-page-desc { font-size: 14px; color: var(--slate); line-height: 1.7; }

  .product-page-bottom {
    position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
    width: 100%; max-width: 680px;
    background: rgba(18,24,21,0.96); backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255,255,255,0.08); padding: 12px 16px;
    padding-bottom: calc(12px + env(safe-area-inset-bottom));
    display: flex; gap: 10px; z-index: 200;
  }
  .btn-whatsapp {
    flex: 1; padding: 13px; background: rgba(255,255,255,0.1);
    color: white; border: 1px solid rgba(255,255,255,0.18); border-radius: 10px;
    font-weight: 700; font-size: 14px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s; font-family: 'Manrope', sans-serif;
  }
  .btn-whatsapp:hover { background: rgba(255,255,255,0.18); }
  .btn-add-cart {
    flex: 1; padding: 13px; background: var(--coral);
    color: white; border: 1px solid var(--coral-dark); border-radius: 10px;
    font-weight: 700; font-size: 14px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s; font-family: 'Manrope', sans-serif;
  }
  .btn-add-cart:hover:not(:disabled) { background: var(--coral-dark); }
  .btn-add-cart:disabled { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.1); color: rgba(255,255,255,0.4); cursor: not-allowed; }

  /* ── REVIEWS ── */
  .reviews-section { background: var(--bg2); margin-top: 8px; padding: 18px 16px; }
  .reviews-title { font-size: 16px; font-weight: 700; color: var(--ink); margin-bottom: 16px; font-family: 'Fraunces', serif; }
  .review-card { background: var(--card); border-radius: 10px; padding: 14px; margin-bottom: 12px; border: 1px solid var(--border); }
  .review-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; }
  .review-name { font-weight: 600; color: var(--ink); font-size: 14px; }
  .review-date { font-size: 11px; color: var(--slate-lt); }
  .review-comment { font-size: 13px; color: var(--slate); line-height: 1.5; margin-top: 6px; }
  .add-review-form { background: var(--card); border-radius: 10px; padding: 14px; border: 1px solid var(--border); margin-top: 16px; }
  .review-stars-input { display: flex; gap: 6px; margin-bottom: 10px; }
  .review-star-btn { background: none; border: none; cursor: pointer; font-size: 22px; transition: transform 0.15s; }
  .review-star-btn:hover { transform: scale(1.2); }

  /* ── RELATED PRODUCTS ── */
  .related-section { background: var(--bg2); margin-top: 8px; padding: 18px 16px; }
  .related-title { font-size: 15px; font-weight: 700; color: var(--ink); margin-bottom: 14px; font-family: 'Fraunces', serif; }
  .related-grid { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; -webkit-overflow-scrolling: touch; }
  .related-grid::-webkit-scrollbar { height: 3px; }
  .related-grid::-webkit-scrollbar-thumb { background: var(--slate-lt); border-radius: 2px; }
  .related-card { flex-shrink: 0; width: 130px; max-width: 130px; flex: 0 0 130px; background: var(--card); border-radius: 10px; overflow: hidden; border: 1px solid var(--border); cursor: pointer; transition: all 0.2s; }
  .related-card:hover { border-color: var(--teal); transform: translateY(-2px); }
  .related-img { width: 100%; height: 90px; object-fit: cover; background: var(--bg3); display: block; }
  .related-info { padding: 8px; }
  .related-name { font-size: 12px; font-weight: 600; color: var(--ink); margin-bottom: 2px; }
  .related-price { font-size: 12px; color: var(--teal-dark); font-weight: 700; font-family: 'Space Grotesk', monospace; }

  /* ── WISHLIST PAGE ── */
  .wishlist-empty { text-align: center; padding: 60px 20px; color: var(--slate-lt); }
  .wishlist-empty h3 { font-size: 20px; font-weight: 700; color: var(--slate); margin-bottom: 8px; margin-top: 16px; font-family: 'Fraunces', serif; }

  /* ── ADMIN ── */
  .admin-panel { background: var(--card); border-radius: 14px; padding: 20px; border: 1px solid var(--border); }
  @media (max-width: 768px) { .admin-panel { padding: 14px; } }
  .admin-title { font-size: 22px; font-weight: 700; font-family: 'Fraunces', serif; color: var(--ink); margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }

  .admin-tabs { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
  .admin-tab {
    padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 600;
    cursor: pointer; border: 1px solid var(--border); color: var(--slate);
    background: var(--bg2); transition: all 0.2s; display: flex; align-items: center; gap: 6px; font-family: 'Manrope', sans-serif;
  }
  .admin-tab.active { background: var(--teal-lt2); border-color: var(--teal); color: var(--teal-dark); }
  .admin-tab:hover:not(.active) { background: var(--bg3); color: var(--ink); }

  .add-product-form { background: var(--bg2); border-radius: 12px; padding: 18px; margin-bottom: 20px; border: 1px solid var(--border); }
  .form-title { font-size: 15px; font-weight: 700; color: var(--ink); margin-bottom: 14px; display: flex; align-items: center; gap: 8px; font-family: 'Fraunces', serif; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
  @media (max-width: 768px) { .form-grid { grid-template-columns: 1fr; } }
  .form-full { grid-column: 1 / -1; }
  .form-input {
    padding: 10px 12px; border: 1px solid var(--border); border-radius: 8px;
    font-size: 13px; font-family: 'Manrope', sans-serif; width: 100%;
    background: var(--card); color: var(--ink); outline: none; transition: border-color 0.2s;
  }
  .form-input:focus { border-color: var(--teal); box-shadow: 0 0 0 3px var(--teal-lt); }
  .form-input::placeholder { color: var(--slate-lt); }
  .form-textarea { resize: vertical; min-height: 70px; }

  .image-upload-area {
    border: 2px dashed var(--border); border-radius: 8px; padding: 20px;
    text-align: center; cursor: pointer; transition: all 0.25s;
    background: var(--card); display: block;
  }
  .image-upload-area:hover { border-color: var(--teal); background: var(--teal-lt); }
  .image-upload-area input { display: none; }
  .upload-text { font-size: 13px; color: var(--slate); display: flex; align-items: center; justify-content: center; gap: 8px; }
  .upload-hint { font-size: 11px; color: var(--slate-lt); margin-top: 4px; }

  .image-preview { margin-top: 14px; display: flex; flex-wrap: wrap; gap: 10px; }
  .preview-item { position: relative; width: 80px; height: 80px; }
  .preview-item img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; border: 2px solid var(--border); display: block; }
  .preview-item.primary img { border-color: var(--teal); }
  .preview-primary-badge { position: absolute; bottom: -2px; left: 0; right: 0; background: var(--teal); color: white; font-size: 9px; font-weight: 700; text-align: center; padding: 2px; border-radius: 0 0 6px 6px; font-family: 'Space Grotesk', monospace; }
  .remove-image-btn { position: absolute; top: -8px; right: -8px; background: var(--danger); color: white; border: none; border-radius: 50%; width: 22px; height: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; }

  .submit-btn {
    background: var(--teal); color: white;
    padding: 11px 24px; border: 1px solid var(--teal-dark);
    border-radius: 8px; font-weight: 700; cursor: pointer;
    font-size: 14px; margin-top: 4px;
    transition: all 0.2s ease; font-family: 'Manrope', sans-serif;
  }
  .submit-btn:hover { background: var(--teal-dark); transform: translateY(-1px); box-shadow: 0 4px 12px var(--teal-lt2); }
  .submit-btn:disabled { background: var(--bg2); border-color: var(--border); color: var(--slate-lt); cursor: not-allowed; transform: none; box-shadow: none; }

  .products-management { margin-top: 4px; }
  .management-title { font-size: 15px; font-weight: 700; color: var(--ink); margin-bottom: 14px; font-family: 'Fraunces', serif; }
  .products-management-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  @media (max-width: 768px) { .products-management-grid { grid-template-columns: 1fr; } }

  .product-management-card { background: var(--bg2); border: 1px solid var(--border); border-radius: 12px; padding: 12px; transition: all 0.2s; }
  .product-management-card:hover { border-color: var(--teal); }
  .product-management-image { width: 100%; height: 110px; background: var(--bg3); border-radius: 8px; margin-bottom: 10px; overflow: hidden; }
  .product-management-image img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .product-management-img-count { font-size: 11px; color: var(--slate-lt); margin-bottom: 5px; font-family: 'Space Grotesk', monospace; }
  .admin-card-actions { display: flex; gap: 8px; margin-top: 10px; }
  .edit-btn {
    flex: 1; padding: 9px; background: var(--teal-lt);
    color: var(--teal-dark); border: 1px solid var(--teal-lt2);
    border-radius: 8px; font-weight: 600; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    gap: 5px; font-size: 12px; transition: all 0.2s; font-family: 'Manrope', sans-serif;
  }
  .edit-btn:hover { background: var(--teal-lt2); }
  .delete-btn {
    flex: 1; padding: 9px; background: var(--danger-lt);
    color: var(--danger); border: 1px solid rgba(229,72,77,0.3);
    border-radius: 8px; font-weight: 600; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    gap: 5px; font-size: 12px; transition: all 0.2s; font-family: 'Manrope', sans-serif;
  }
  .delete-btn:hover { background: rgba(229,72,77,0.22); }

  /* ── ORDERS TABLE ── */
  .orders-section { background: var(--bg2); border-radius: 12px; padding: 18px; border: 1px solid var(--border); }
  .orders-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .orders-table th { text-align: left; padding: 10px 12px; border-bottom: 1px solid var(--border); color: var(--slate-lt); font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Space Grotesk', monospace; }
  .orders-table td { padding: 12px; border-bottom: 1px solid var(--border); color: var(--slate); vertical-align: top; }
  .orders-table tr:last-child td { border: none; }
  .order-status-select {
    padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700;
    border: none; cursor: pointer; font-family: 'Space Grotesk', monospace; outline: none;
  }
  .status-pending { background: rgba(245,166,35,0.15); color: #b5730a; border: 1px solid rgba(245,166,35,0.35); }
  .status-shipped { background: var(--teal-lt2); color: var(--teal-dark); border: 1px solid rgba(14,95,82,0.35); }
  .status-delivered { background: rgba(34,197,94,0.14); color: #1a8a4c; border: 1px solid rgba(34,197,94,0.3); }
  .status-cancelled { background: var(--danger-lt); color: var(--danger); border: 1px solid rgba(229,72,77,0.3); }
  .orders-mobile-card { background: var(--card); border-radius: 10px; padding: 14px; border: 1px solid var(--border); margin-bottom: 10px; }
  @media (min-width: 768px) { .orders-mobile-card { display: none; } }
  .orders-desktop { overflow-x: auto; }
  @media (max-width: 767px) { .orders-desktop { display: none; } }

  /* ── DASHBOARD ── */
  .dashboard-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 20px; }
  @media (min-width: 768px) { .dashboard-grid { grid-template-columns: repeat(4, 1fr); } }
  .stat-card { background: var(--bg2); border-radius: 12px; padding: 16px; border: 1px solid var(--border); }
  .stat-label { font-size: 11px; color: var(--slate-lt); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; font-family: 'Space Grotesk', monospace; }
  .stat-value { font-size: 24px; font-weight: 700; color: var(--ink); font-family: 'Space Grotesk', monospace; }
  .stat-sub { font-size: 12px; color: var(--slate-lt); margin-top: 4px; }
  .stat-accent { color: var(--teal-dark); }
  .stat-green { color: #1a8a4c; }
  .stat-purple { color: var(--coral-dark); }

  .top-products { background: var(--bg2); border-radius: 12px; padding: 16px; border: 1px solid var(--border); }
  .top-product-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border); font-size: 13px; }
  .top-product-row:last-child { border: none; }

  /* ── FOOTER ── */
  .footer { background: var(--bg2); color: var(--slate); text-align: center; padding: 32px 20px; border-top: 1px solid var(--border); }
  .footer p { margin: 6px 0; font-size: 13px; font-weight: 500; }

  /* ── EDIT MODAL ── */
  .edit-modal-overlay { position: fixed; inset: 0; background: rgba(18,24,21,0.75); backdrop-filter: blur(6px); z-index: 600; display: flex; align-items: center; justify-content: center; padding: 16px; }
  .edit-modal { background: var(--bg2); border: 1px solid var(--border); border-radius: 16px; padding: 24px; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; }

  /* scrollbar */
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--slate-lt); border-radius: 3px; }
  /* ═══════════════════════════════════════════════════════════════════
     LYFELYTIC CINEMATIC THEME — reference-inspired visual overhaul
     Keeps the existing Supabase/cart/admin functionality intact.
     ═══════════════════════════════════════════════════════════════════ */
  :root {
    --bg: #05070b;
    --bg2: #090d14;
    --bg3: #101722;
    --card: rgba(14, 19, 29, 0.78);
    --border: rgba(255,255,255,0.10);
    --ink: #f5f8ff;
    --ink-soft: #cbd4e2;
    --slate: #8e9aab;
    --slate-lt: #657185;
    --teal: #19bfff;
    --teal-dark: #0785c4;
    --teal-lt: rgba(25,191,255,0.12);
    --teal-lt2: rgba(25,191,255,0.22);
    --coral: #27bfff;
    --coral-dark: #008ed1;
    --coral-lt: rgba(39,191,255,0.12);
    --gold: #a9dcff;
    --danger: #ff5e75;
    --danger-lt: rgba(255,94,117,0.12);
    --accent: #19bfff;
    --accent2: #7b61ff;
    --shadow: rgba(0,0,0,0.35);
    --shadow-lg: rgba(0,0,0,0.62);
    --glass: rgba(255,255,255,0.055);
    --glass-b: rgba(255,255,255,0.13);
    --mx: 50vw;
    --my: 35vh;
  }

  html { scroll-behavior: smooth; background: #05070b; }
  body { background: #05070b; color: var(--ink); overflow-x: hidden; }
  button, input, select, textarea { font-family: 'Manrope', sans-serif; }
  .lyfelytic-container { min-height: 100vh; background: #05070b; position: relative; isolation: isolate; }
  .lyfelytic-container::after {
    content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 999;
    background: radial-gradient(320px circle at var(--mx) var(--my), rgba(25,191,255,0.075), transparent 70%);
    mix-blend-mode: screen; opacity: .8;
  }

  /* Header */
  .lyfelytic-header {
    background: rgba(5,7,11,0.66); backdrop-filter: blur(24px) saturate(150%);
    -webkit-backdrop-filter: blur(24px) saturate(150%); border-bottom: 1px solid rgba(255,255,255,0.08);
    color: var(--ink); padding: 15px 20px; position: sticky; top: 0; z-index: 200;
  }
  .header-content { max-width: 1320px; }
  .brand { gap: 12px; }
  .brand h1 { font-family: 'Space Grotesk', sans-serif; font-size: 21px; letter-spacing: .14em; text-transform: uppercase; background: linear-gradient(110deg,#fff 10%,#55d4ff 55%,#8a7dff); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .brand p { color: #68778b; letter-spacing: .08em; }
  .brand svg { color: #25c5ff; filter: drop-shadow(0 0 9px rgba(25,191,255,.6)); }
  .nav-btn { border-radius: 999px; color: #aeb9c8; border-color: transparent; }
  .nav-btn-shop { color: #fff; background: rgba(255,255,255,.055); }
  .nav-btn-shop:hover { background: rgba(25,191,255,.10); color:#fff; }
  .nav-btn-admin { border-color: rgba(255,255,255,.10); }
  .nav-btn-admin:hover { background: rgba(255,255,255,.06); color:#fff; }
  .nav-btn-cart { background: linear-gradient(135deg,#10b7f3,#1269ff); border: 1px solid rgba(108,220,255,.35); box-shadow: 0 8px 28px rgba(0,140,255,.22); }
  .nav-btn-cart:hover { background: linear-gradient(135deg,#36c8ff,#347bff); transform: translateY(-2px); }
  .cart-badge { background:#fff; color:#06101a; }
  .mobile-menu { background: rgba(5,7,11,.96); border-bottom-color: rgba(255,255,255,.08); }
  .mobile-menu-btn { color:#fff; }
  .mobile-menu-btn-item { background:rgba(255,255,255,.045); border-color:rgba(255,255,255,.09); color:#dce5f0; border-radius:14px; }
  .mobile-menu-btn-item:hover { background:rgba(25,191,255,.10); border-color:rgba(25,191,255,.35); color:#fff; }

  /* Hero */
  .hero-cinematic {
    min-height: min(760px, calc(100vh - 72px)); padding: 80px 28px 58px; text-align:left;
    display:flex; align-items:center; background:
      radial-gradient(700px 480px at 78% 48%, rgba(0,132,255,.20), transparent 62%),
      radial-gradient(500px 380px at 18% 20%, rgba(90,64,255,.13), transparent 65%),
      #05070b; border-bottom:1px solid rgba(255,255,255,.07);
  }
  .hero-cinematic::before { content:''; position:absolute; inset:0; background:linear-gradient(90deg,rgba(5,7,11,.95) 0%,rgba(5,7,11,.74) 42%,rgba(5,7,11,.08) 100%); pointer-events:none; }
  .hero-grid-lines { position:absolute; inset:0; opacity:.24; background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px); background-size:70px 70px; mask-image:linear-gradient(to bottom,black,transparent 90%); }
  .hero-noise { position:absolute; inset:0; opacity:.035; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.45'/%3E%3C/svg%3E"); }
  .hero-orb { position:absolute; border-radius:50%; filter:blur(2px); pointer-events:none; }
  .hero-orb-one { width:420px;height:420px;right:2%;top:9%;background:radial-gradient(circle,rgba(19,176,255,.18),transparent 68%);animation:orbFloat 9s ease-in-out infinite; }
  .hero-orb-two { width:250px;height:250px;right:30%;bottom:4%;background:radial-gradient(circle,rgba(113,77,255,.12),transparent 70%);animation:orbFloat 12s ease-in-out infinite reverse; }
  @keyframes orbFloat { 0%,100%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(-18px,-24px,0) scale(1.06)} }
  .hero-cinematic-inner { max-width:1320px; width:100%; display:grid; grid-template-columns:minmax(0,1fr) minmax(400px,.85fr); align-items:center; gap:50px; z-index:2; }
  .hero-copy { max-width:680px; }
  .hero-eyebrow { color:#6edcff; background:rgba(25,191,255,.08); border:1px solid rgba(25,191,255,.20); box-shadow:0 0 30px rgba(25,191,255,.06); border-radius:999px; padding:8px 14px; letter-spacing:2px; }
  .hero-title { font-family:'Space Grotesk',sans-serif; font-size:clamp(48px,6.2vw,88px); line-height:.98; letter-spacing:-.055em; color:#f8fbff; margin:18px 0 24px; text-wrap:balance; }
  .hero-accent { color:transparent; background:linear-gradient(100deg,#fff 0%,#4ed4ff 38%,#7184ff 82%); -webkit-background-clip:text; background-clip:text; }
  .hero-sub { max-width:560px; color:#94a2b5; font-size:16px; line-height:1.75; margin:0 0 30px; }
  .hero-actions { display:flex; align-items:center; flex-wrap:wrap; gap:18px; }
  .hero-primary-btn { display:inline-flex; align-items:center; gap:8px; border:1px solid rgba(104,219,255,.38); border-radius:999px; padding:13px 20px; color:#fff; font-weight:800; background:linear-gradient(135deg,#0caee9,#246eff); box-shadow:0 14px 38px rgba(0,139,255,.22); cursor:pointer; transition:.3s ease; }
  .hero-primary-btn:hover { transform:translateY(-3px); box-shadow:0 18px 48px rgba(0,139,255,.34); }
  .hero-trust { color:#7f8da0; font-size:12px; display:inline-flex; align-items:center; gap:8px; }
  .hero-trust-dot,.hero-live-dot { width:7px;height:7px;border-radius:50%;background:#2bceff;box-shadow:0 0 14px #2bceff;display:inline-block;animation:livePulse 1.8s ease-in-out infinite; }
  @keyframes livePulse {50%{box-shadow:0 0 22px #2bceff;transform:scale(1.15)}}
  .hero-visual { min-height:500px; position:relative; display:flex; align-items:center; justify-content:center; perspective:1000px; }
  .hero-visual-ring { position:absolute; width:min(520px,90%); aspect-ratio:1; border-radius:50%; border:1px solid rgba(25,191,255,.14); box-shadow:0 0 80px rgba(25,191,255,.08),inset 0 0 80px rgba(25,191,255,.05); animation:ringSpin 20s linear infinite; }
  .hero-visual-ring::after { content:''; position:absolute; width:9px;height:9px;border-radius:50%;background:#5bddff;top:12%;right:17%;box-shadow:0 0 22px #5bddff; }
  @keyframes ringSpin {to{transform:rotate(360deg)}}
  .hero-visual-glow { position:absolute; width:65%; aspect-ratio:1; border-radius:50%; background:radial-gradient(circle,rgba(20,183,255,.26),rgba(70,83,255,.08) 38%,transparent 70%); filter:blur(12px); animation:productGlow 4.5s ease-in-out infinite; }
  @keyframes productGlow {50%{transform:scale(1.08);opacity:.82}}
  .hero-product { position:relative; z-index:2; width:min(430px,82%); aspect-ratio:1/1; border:0; background:linear-gradient(145deg,rgba(255,255,255,.10),rgba(255,255,255,.025)); border-radius:34px; padding:20px; cursor:pointer; transform:rotate(-3deg); box-shadow:0 40px 90px rgba(0,0,0,.62),0 0 0 1px rgba(255,255,255,.08),inset 0 0 60px rgba(25,191,255,.06); transition:.5s cubic-bezier(.2,.8,.2,1); backdrop-filter:blur(8px); }
  .hero-product:hover { transform:rotate(0) translateY(-12px) scale(1.025); box-shadow:0 55px 110px rgba(0,0,0,.72),0 0 70px rgba(25,191,255,.18),0 0 0 1px rgba(92,214,255,.22); }
  .hero-product img { width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 28px 30px rgba(0,0,0,.55)); animation:productFloat 5s ease-in-out infinite; }
  @keyframes productFloat {50%{transform:translateY(-10px) scale(1.015)}}
  .hero-product-placeholder { display:flex;align-items:center;justify-content:center;color:#36caff; }
  .hero-floating-card { position:absolute; z-index:4; min-width:170px; padding:12px 15px; border-radius:16px; background:rgba(10,15,23,.72); border:1px solid rgba(255,255,255,.11); box-shadow:0 20px 50px rgba(0,0,0,.4); backdrop-filter:blur(16px); display:grid; grid-template-columns:auto 1fr; column-gap:9px; align-items:center; animation:cardFloat 5s ease-in-out infinite; }
  .hero-floating-card span { grid-row:span 2; color:#5edcff;font-size:11px;font-weight:800; }
  .hero-floating-card strong { color:#edf6ff;font-size:12px; }
  .hero-floating-card small { color:#728198;font-size:10px;margin-top:2px; }
  .hero-floating-card-top { top:12%; right:0; }
  .hero-floating-card-bottom { bottom:11%; left:2%; animation-delay:-2s; }
  @keyframes cardFloat {50%{transform:translateY(-9px)}}
  .hero-scroll-hint { position:absolute; bottom:24px; left:50%; transform:translateX(-50%); color:#617085; font-size:10px; text-transform:uppercase; letter-spacing:2px; display:flex;align-items:center;gap:8px; z-index:2; }
  .hero-scroll-hint span { width:28px;height:1px;background:linear-gradient(90deg,transparent,#38cfff); }

  /* Category showcase */
  .category-showcase { max-width:1320px; margin:0 auto; padding:100px 28px 56px; }
  .category-showcase-head { display:flex; justify-content:space-between; align-items:end; gap:30px; margin-bottom:28px; }
  .section-kicker { color:#53d5ff; font-size:10px; font-weight:800; letter-spacing:2.2px; text-transform:uppercase; }
  .category-showcase-head h2,.section-title h2 { font-family:'Space Grotesk',sans-serif; color:#f3f7fc; font-size:clamp(30px,4vw,48px); letter-spacing:-.04em; margin-top:7px; }
  .category-showcase-head p { color:#77859a; max-width:340px; font-size:13px; line-height:1.6; }
  .category-showcase-grid { display:grid; grid-template-columns:repeat(12,1fr); grid-auto-rows:190px; gap:12px; }
  .category-showcase-card { position:relative; overflow:hidden; border:1px solid rgba(255,255,255,.09); border-radius:22px; background:#0b1018; cursor:pointer; text-align:left; min-width:0; }
  .category-showcase-card:nth-child(1),.category-showcase-card:nth-child(4) { grid-column:span 5; }
  .category-showcase-card:nth-child(2),.category-showcase-card:nth-child(3),.category-showcase-card:nth-child(5),.category-showcase-card:nth-child(6) { grid-column:span 3.5; }
  .category-showcase-card img { position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.58;transform:scale(1.04);transition:.65s cubic-bezier(.2,.8,.2,1); }
  .category-showcase-card:hover img { transform:scale(1.13); opacity:.78; }
  .category-card-overlay { position:absolute;inset:0;background:linear-gradient(180deg,rgba(4,7,11,.08),rgba(4,7,11,.88)); }
  .category-showcase-card::after { content:'';position:absolute;inset:0;border-radius:22px;box-shadow:inset 0 0 0 1px transparent;transition:.35s; }
  .category-showcase-card:hover::after { box-shadow:inset 0 0 0 1px rgba(52,205,255,.45),0 0 35px rgba(25,191,255,.08); }
  .category-card-content { position:absolute;left:18px;right:18px;bottom:16px;display:grid;grid-template-columns:1fr auto;align-items:end;z-index:2; }
  .category-card-content small { grid-column:1/-1;color:#67d9ff;font-size:9px;letter-spacing:2px;margin-bottom:6px; }
  .category-card-content strong { color:#fff;font-family:'Space Grotesk',sans-serif;font-size:22px;letter-spacing:-.02em; }
  .category-card-content em { display:flex;align-items:center;gap:3px;color:#9eabba;font-style:normal;font-size:10px;opacity:0;transform:translateX(-5px);transition:.3s; }
  .category-showcase-card:hover .category-card-content em { opacity:1;transform:translateX(0); }

  /* Search + filters */
  .search-bar-wrapper { max-width:1320px; margin:25px auto 0; padding:0 28px; }
  .search-bar { background:rgba(255,255,255,.045); border:1px solid rgba(255,255,255,.10); border-radius:999px; padding:12px 18px; backdrop-filter:blur(16px); }
  .search-bar:focus-within { border-color:rgba(25,191,255,.5); box-shadow:0 0 0 4px rgba(25,191,255,.07),0 0 30px rgba(25,191,255,.08); }
  .search-bar input { color:#eaf4ff; }
  .search-bar input::placeholder { color:#5d6b7f; }
  .filter-bar { max-width:1320px; margin:15px auto 0; padding:0 28px; }
  .category-chips { gap:7px; }
  .chip { background:rgba(255,255,255,.035); border:1px solid rgba(255,255,255,.08); color:#7f8da0; border-radius:999px; }
  .chip:hover { color:#fff; background:rgba(25,191,255,.07); border-color:rgba(25,191,255,.25); }
  .chip.active { color:#fff; background:linear-gradient(135deg,rgba(25,191,255,.20),rgba(91,90,255,.16)); border-color:rgba(25,191,255,.38); box-shadow:0 0 18px rgba(25,191,255,.07); }
  .filter-select { background:#0c121b; border-color:rgba(255,255,255,.09); color:#aab7c7; border-radius:12px; }

  /* Main/product collection */
  .main-content { max-width:1320px; margin:0 auto; padding:50px 28px 90px; }
  .section-title { color:#fff; border-bottom:0; margin-bottom:24px; }
  .products-section-title { display:flex; justify-content:space-between; align-items:end; }
  .products-section-title p { color:#637186; }
  .products-container { grid-template-columns:1fr 290px; gap:18px; }
  .products-grid { grid-template-columns:repeat(3,1fr); gap:14px; }
  .product-card { background:linear-gradient(145deg,rgba(18,25,37,.92),rgba(8,12,18,.96)); border:1px solid rgba(255,255,255,.08); border-radius:20px; box-shadow:0 15px 50px rgba(0,0,0,.22); }
  .product-card:hover { transform:translateY(-7px); border-color:rgba(34,194,255,.30); box-shadow:0 25px 70px rgba(0,0,0,.48),0 0 30px rgba(25,191,255,.08); }
  .product-image { height:280px; background:radial-gradient(circle at 50% 40%,rgba(31,111,165,.24),transparent 55%),#0a0f17; }
  .product-image img { object-fit:contain; padding:16px; transition:transform .65s cubic-bezier(.2,.8,.2,1),filter .65s; }
  .product-card:hover .product-image img { transform:scale(1.08) translateY(-3px); filter:drop-shadow(0 20px 28px rgba(0,0,0,.5)); }
  .wishlist-btn { background:rgba(5,8,13,.72); border-color:rgba(255,255,255,.12); }
  .wishlist-btn:hover { background:rgba(25,191,255,.15); border-color:rgba(25,191,255,.4); }
  .wishlist-btn.active { background:#168ed1; border-color:#42cfff; }
  .multi-img-badge { background:rgba(4,8,14,.72); border:1px solid rgba(255,255,255,.08); }
  .product-info { background:transparent; padding:17px; }
  .product-category-tag { color:#55d7ff; }
  .product-name { color:#f3f7fb; font-family:'Space Grotesk',sans-serif; font-size:16px; }
  .product-description { color:#77859a; }
  .product-price { color:#fff; font-family:'Space Grotesk',sans-serif; }
  .product-stock { color:#58687d; }
  .view-details-btn { background:rgba(255,255,255,.045); border-color:rgba(255,255,255,.09); color:#aab7c7; border-radius:10px; }
  .view-details-btn:hover { background:rgba(25,191,255,.08); color:#fff; border-color:rgba(25,191,255,.28); }
  .add-to-cart-btn { background:linear-gradient(135deg,#0caee9,#236fff); border-color:rgba(105,220,255,.35); border-radius:10px; box-shadow:0 8px 22px rgba(0,139,255,.15); }
  .add-to-cart-btn:hover:not(:disabled) { background:linear-gradient(135deg,#35c8ff,#3b7dff); }
  .stock-low-badge { background:#ee4770; box-shadow:0 2px 14px rgba(238,71,112,.24); }

  /* Cart */
  .cart-sidebar { background:rgba(12,17,26,.76); border:1px solid rgba(255,255,255,.09); border-radius:20px; box-shadow:0 20px 55px rgba(0,0,0,.34); backdrop-filter:blur(18px); }
  .cart-title { color:#f2f7ff; }
  .cart-empty,.cart-item-price { color:#68768a; }
  .cart-item { border-bottom-color:rgba(255,255,255,.07); }
  .cart-item-name { color:#dce6f2; }
  .cart-total { border-top-color:rgba(255,255,255,.08); }
  .total-price { color:#fff; }
  .checkout-btn { background:linear-gradient(135deg,#0caee9,#236fff); border-radius:11px; }

  /* Footer */
  .footer { background:#030508; border-top:1px solid rgba(255,255,255,.08); color:#738095; padding:45px 20px; }

  /* Responsive cinematic layout */
  @media (max-width:1024px) {
    .hero-cinematic-inner { grid-template-columns:1fr .8fr; gap:20px; }
    .hero-visual { min-height:420px; }
    .products-grid { grid-template-columns:repeat(2,1fr); }
    .category-showcase-card:nth-child(n) { grid-column:span 4; }
  }
  @media (max-width:768px) {
    .lyfelytic-container::after { display:none; }
    .hero-cinematic { min-height:calc(100svh - 66px); padding:65px 18px 50px; text-align:center; }
    .hero-cinematic::before { background:linear-gradient(180deg,rgba(5,7,11,.92),rgba(5,7,11,.55) 45%,rgba(5,7,11,.92)); }
    .hero-cinematic-inner { grid-template-columns:1fr; gap:5px; }
    .hero-copy { max-width:none; }
    .hero-eyebrow { font-size:8px; letter-spacing:1.5px; }
    .hero-title { font-size:clamp(44px,13vw,62px); margin-top:17px; }
    .hero-sub { font-size:13px; max-width:430px; margin:0 auto 22px; }
    .hero-actions { justify-content:center; }
    .hero-trust { width:100%; justify-content:center; }
    .hero-visual { min-height:330px; margin-top:-5px; }
    .hero-product { width:min(290px,74vw); border-radius:26px; }
    .hero-visual-ring { width:min(360px,94vw); }
    .hero-floating-card { min-width:145px; padding:10px 11px; }
    .hero-floating-card-top { top:4%; right:0; }
    .hero-floating-card-bottom { bottom:4%; left:0; }
    .hero-scroll-hint { display:none; }
    .category-showcase { padding:70px 18px 40px; }
    .category-showcase-head { display:block; margin-bottom:20px; }
    .category-showcase-head p { margin-top:10px; }
    .category-showcase-grid { display:flex; overflow-x:auto; gap:10px; padding-bottom:5px; scrollbar-width:none; }
    .category-showcase-grid::-webkit-scrollbar { display:none; }
    .category-showcase-card,.category-showcase-card:nth-child(n) { flex:0 0 76vw; height:250px; }
    .category-card-content strong { font-size:24px; }
    .search-bar-wrapper,.filter-bar { padding:0 18px; }
    .filter-bar { margin-top:12px; }
    .main-content { padding:35px 18px 65px; }
    .products-container { display:block; }
    .cart-sidebar { margin-top:18px; }
    .products-grid { display:flex; flex-wrap:nowrap; overflow-x:auto; gap:12px; padding:4px 2px 15px; margin:0 -2px; scrollbar-width:none; }
    .products-grid::-webkit-scrollbar { display:none; }
    .product-card { width:82vw; max-width:310px; flex:0 0 82vw; }
    .product-image { height:260px; }
    .products-section-title { display:block; }
    .products-section-title p { margin-top:7px; }
  }
  @media (prefers-reduced-motion:reduce) {
    .hero-orb-one,.hero-orb-two,.hero-visual-ring,.hero-visual-glow,.hero-product img,.hero-floating-card,.hero-trust-dot,.hero-live-dot { animation:none!important; }
  }

  /* scrollbar */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: #05070b; }
  ::-webkit-scrollbar-thumb { background: #243245; border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: #31506b; }

  /* =========================================================
     REFERENCE MATCH V2 — dark tech store / cinematic Shopify
     ========================================================= */
  :root {
    --bg: #050608;
    --bg2: #080b10;
    --bg3: #0d1219;
    --card: #0b1016;
    --border: rgba(255,255,255,.09);
    --ink: #f7f9fc;
    --ink-soft: #d8e0ea;
    --slate: #8794a6;
    --slate-lt: #586678;
    --teal: #24c9ff;
    --teal-dark: #0a9ed0;
    --teal-lt: rgba(36,201,255,.09);
    --teal-lt2: rgba(36,201,255,.18);
    --coral: #24bfff;
    --coral-dark: #138be0;
    --coral-lt: rgba(36,191,255,.10);
    --shadow: rgba(0,0,0,.35);
    --shadow-lg: rgba(0,0,0,.65);
  }

  body {
    background: #050608;
    color: #f7f9fc;
    overflow-x: hidden;
  }
  .lyfelytic-container {
    background:
      radial-gradient(500px 350px at var(--mouse-x, 80%) var(--mouse-y, 15%), rgba(19,174,255,.055), transparent 65%),
      #050608;
  }

  /* Header — minimal, centered-brand look */
  .lyfelytic-header {
    background: rgba(4,6,9,.78);
    border-bottom: 1px solid rgba(255,255,255,.075);
    backdrop-filter: blur(22px);
    padding: 16px 28px;
  }
  .header-content { max-width: 1400px; position: relative; min-height: 38px; }
  .brand {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    justify-content: center;
    pointer-events: none;
  }
  .brand svg { display:none; }
  .brand h1 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 24px;
    letter-spacing: .12em;
    text-transform: uppercase;
    background: linear-gradient(180deg,#fff,#8bdfff);
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
  }
  .brand p { display:none !important; }
  .nav-buttons { margin-left:auto; }
  .nav-btn {
    background:transparent;
    border:0;
    color:#aab5c4;
    border-radius:999px;
    font-size:11px;
    letter-spacing:.08em;
    text-transform:uppercase;
    padding:9px 13px;
  }
  .nav-btn-shop { color:#fff; background:rgba(255,255,255,.055); }
  .nav-btn-cart {
    color:#061019;
    background:#fff;
    border:0;
    box-shadow:0 0 24px rgba(42,201,255,.18);
  }
  .nav-btn-cart:hover { background:#bdefff; color:#061019; }
  .mobile-menu-btn { color:#fff; }

  /* Hero — closely follows the reference composition */
  .hero-cinematic {
    min-height: 690px;
    padding: 78px 5vw 62px;
    background:
      radial-gradient(650px 520px at 76% 50%, rgba(0,150,255,.22), transparent 64%),
      radial-gradient(430px 300px at 18% 25%, rgba(0,78,150,.12), transparent 70%),
      linear-gradient(180deg,#06080c,#050608);
    border-bottom:0;
  }
  .hero-cinematic::before {
    background: linear-gradient(90deg,rgba(5,6,8,.96) 0%,rgba(5,6,8,.72) 46%,rgba(5,6,8,.08) 100%);
  }
  .hero-grid-lines { opacity:.12; background-size:80px 80px; }
  .hero-cinematic-inner {
    max-width:1400px;
    grid-template-columns: .9fr 1.1fr;
    gap:20px;
  }
  .hero-copy { max-width:620px; }
  .hero-eyebrow {
    background:transparent;
    border:0;
    box-shadow:none;
    padding:0;
    color:#54d8ff;
    font-size:11px;
    letter-spacing:2px;
  }
  .hero-title {
    font-family:'Space Grotesk',sans-serif;
    font-size:clamp(52px,6.5vw,92px);
    line-height:.94;
    letter-spacing:-.055em;
    margin:18px 0 24px;
    text-shadow:0 0 40px rgba(255,255,255,.04);
  }
  .hero-accent {
    background:linear-gradient(100deg,#fff,#67dcff 45%,#278fff);
    -webkit-background-clip:text;
    background-clip:text;
  }
  .hero-sub {
    color:#8c9aac;
    max-width:510px;
    font-size:15px;
  }
  .hero-primary-btn {
    background:#fff;
    color:#050608;
    border:0;
    box-shadow:0 12px 38px rgba(255,255,255,.10);
    padding:13px 22px;
  }
  .hero-primary-btn:hover { background:#dff7ff; box-shadow:0 16px 46px rgba(28,192,255,.22); }
  .hero-trust { color:#6e7c8e; }

  /* Product collage — more like the floating gadget imagery in the reference */
  .hero-reference-stage {
    min-height:530px;
    isolation:isolate;
  }
  .hero-visual-ring,
  .hero-floating-card { display:none; }
  .hero-stage-glow {
    position:absolute;
    width:520px;
    height:360px;
    border-radius:50%;
    background:radial-gradient(ellipse,rgba(20,190,255,.34),rgba(32,85,255,.09) 42%,transparent 72%);
    filter:blur(18px);
    animation:referenceGlow 5s ease-in-out infinite;
  }
  @keyframes referenceGlow {
    50% { transform:scale(1.08) translateY(-8px); opacity:.82; }
  }
  .hero-stage-orbit {
    position:absolute;
    border-radius:50%;
    border:1px solid rgba(68,211,255,.15);
    transform:rotate(-18deg);
  }
  .hero-stage-orbit-one { width:470px;height:260px; }
  .hero-stage-orbit-two { width:560px;height:320px; transform:rotate(22deg); opacity:.55; }
  .hero-product-collage {
    position:relative;
    width:min(700px,100%);
    height:510px;
    transform:perspective(1000px) rotateY(-5deg);
  }
  .hero-collage-product {
    position:absolute;
    border:0;
    padding:16px;
    cursor:pointer;
    overflow:hidden;
    background:linear-gradient(145deg,rgba(255,255,255,.13),rgba(255,255,255,.025));
    border:1px solid rgba(255,255,255,.11);
    box-shadow:0 30px 80px rgba(0,0,0,.6), inset 0 0 50px rgba(35,190,255,.06);
    backdrop-filter:blur(6px);
    transition:transform .55s cubic-bezier(.2,.8,.2,1),box-shadow .4s;
  }
  .hero-collage-product img {
    width:100%;height:100%;object-fit:contain;
    filter:drop-shadow(0 28px 30px rgba(0,0,0,.55));
    animation:referenceFloat 5s ease-in-out infinite;
  }
  .hero-collage-1 { width:360px;height:360px;left:18%;top:8%;z-index:3;transform:rotate(-6deg);border-radius:30px; }
  .hero-collage-2 { width:245px;height:245px;right:4%;top:2%;z-index:2;transform:rotate(7deg); }
  .hero-collage-3 { width:270px;height:270px;right:9%;bottom:3%;z-index:1;transform:rotate(-8deg); }
  .hero-collage-2 img { animation-delay:-1.4s; }
  .hero-collage-3 img { animation-delay:-2.5s; }
  .hero-collage-product:hover {
    transform:translateY(-16px) rotate(0deg) scale(1.04);
    z-index:8;
    box-shadow:0 45px 95px rgba(0,0,0,.72),0 0 55px rgba(28,194,255,.20);
  }
  @keyframes referenceFloat {
    50% { transform:translateY(-11px) rotate(1deg); }
  }
  .hero-stage-caption {
    position:absolute;
    right:2%;
    bottom:3%;
    z-index:10;
    padding:11px 14px;
    border-left:2px solid #2bc9ff;
    background:rgba(4,7,11,.65);
    backdrop-filter:blur(12px);
    display:grid;
    grid-template-columns:auto 1fr;
    column-gap:8px;
    box-shadow:0 15px 40px rgba(0,0,0,.35);
  }
  .hero-stage-caption strong { font-size:12px;color:#edf7ff; }
  .hero-stage-caption small { grid-column:2;color:#718095;font-size:10px;margin-top:2px; }
  .hero-stage-caption .hero-live-dot { grid-row:span 2; margin-top:5px; }

  /* Category section — four cinematic tiles */
  .category-showcase {
    max-width:1400px;
    padding:82px 5vw 70px;
    background:#050608;
  }
  .category-showcase-head {
    display:block;
    text-align:center;
    margin-bottom:32px;
  }
  .category-showcase-head h2 {
    font-size:clamp(30px,4vw,48px);
    margin-top:8px;
  }
  .category-showcase-head p {
    margin:10px auto 0;
    color:#69778a;
  }
  .category-showcase-grid {
    grid-template-columns:repeat(4,1fr);
    grid-auto-rows:330px;
    gap:10px;
  }
  .category-showcase-card {
    min-width:0;
    border-radius:2px;
    background:#0a0f15;
    border:1px solid rgba(255,255,255,.08);
  }
  .category-showcase-card img {
    transform:scale(1.02);
    transition:transform .8s cubic-bezier(.2,.8,.2,1),filter .6s;
    filter:brightness(.68) saturate(1.15);
  }
  .category-showcase-card:hover img { transform:scale(1.12); filter:brightness(.9) saturate(1.25); }
  .category-card-overlay {
    background:linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.82));
  }
  .category-card-content {
    left:22px;right:22px;bottom:20px;
  }
  .category-card-content small { color:#48d4ff; }
  .category-card-content strong {
    font-family:'Space Grotesk',sans-serif;
    font-size:24px;
    letter-spacing:-.03em;
  }
  .category-card-content em { color:#a9b7c7; }

  /* Search/filter area — understated like the reference */
  .search-bar-wrapper { max-width:1400px;margin:0 auto;padding:0 5vw 10px;background:#050608; }
  .search-bar {
    background:#090d12;
    border:1px solid rgba(255,255,255,.08);
    border-radius:999px;
    padding:12px 18px;
  }
  .search-bar:focus-within { border-color:rgba(35,199,255,.45); box-shadow:0 0 0 3px rgba(35,199,255,.07),0 0 35px rgba(35,199,255,.06); }
  .filter-bar {
    max-width:1400px;margin:0 auto;padding:10px 5vw 20px;background:#050608;
  }
  .chip {
    background:transparent;color:#718095;border-color:rgba(255,255,255,.08);
    border-radius:999px;
  }
  .chip.active,.chip:hover { color:#fff;background:rgba(36,201,255,.09);border-color:rgba(36,201,255,.35); }
  .filter-select { background:#090d12;color:#aeb9c8;border-color:rgba(255,255,255,.08);border-radius:999px; }

  /* Product collection */
  .main-content { max-width:1400px;background:#050608; }
  .products-section-title { padding-top:70px; }
  .section-title h2 { color:#f5f8fc; }
  .section-title p { color:#69778a; }
  .products-container { grid-template-columns:1fr; }
  .products-grid { gap:14px; }
  .product-card {
    background:#090e14;
    border:1px solid rgba(255,255,255,.075);
    border-radius:3px;
    box-shadow:none;
  }
  .product-card:hover {
    border-color:rgba(39,200,255,.35);
    transform:translateY(-7px);
    box-shadow:0 25px 55px rgba(0,0,0,.55),0 0 30px rgba(25,178,255,.07);
  }
  .product-image { background:#070b10; }
  .product-image img { transition:transform .7s cubic-bezier(.2,.8,.2,1),filter .5s; }
  .product-card:hover .product-image img { transform:scale(1.08); filter:brightness(1.08); }
  .product-info { background:#090e14; }
  .product-name { color:#eef4fb; }
  .product-description { color:#748195; }
  .product-price { color:#5bd8ff; }
  .product-category-tag { color:#43cfff; }
  .view-details-btn {
    background:transparent !important;color:#a9b6c5 !important;border-color:rgba(255,255,255,.10) !important;
  }
  .view-details-btn:hover { color:#fff !important;border-color:rgba(39,200,255,.35) !important;background:rgba(39,200,255,.06) !important; }
  .add-to-cart-btn { background:#fff !important;color:#050608 !important;border:0 !important; }
  .add-to-cart-btn:hover:not(:disabled) { background:#bdefff !important; }
  .wishlist-btn { background:rgba(0,0,0,.55);border-color:rgba(255,255,255,.14); }
  .wishlist-btn:hover { background:rgba(30,194,255,.20);border-color:#36cfff; }
  .wishlist-btn.active { background:#19bfff;border-color:#19bfff; }

  /* Product detail — dark split-screen like the reference product page */
  .product-page {
    max-width:1400px;
    background:#050608;
    box-shadow:none;
    color:#f5f8fc;
  }
  .product-page-back {
    background:#050608;
    color:#6edcff;
    border-bottom:1px solid rgba(255,255,255,.07);
    max-width:1400px;
    margin:auto;
  }
  .gallery-wrapper { background:#070b10; }
  .gallery-main { height:520px; }
  .gallery-slide { background:radial-gradient(circle at 50% 50%,rgba(17,126,190,.18),transparent 58%),#070b10; }
  .gallery-slide img { padding:28px; filter:drop-shadow(0 35px 35px rgba(0,0,0,.65)); }
  .gallery-arrow { background:rgba(255,255,255,.06);border-color:rgba(255,255,255,.12);color:#fff; }
  .gallery-dots,.gallery-thumbs { background:#070b10;border-color:rgba(255,255,255,.07); }
  .gallery-thumb { background:#0b1118;border-color:rgba(255,255,255,.08); }
  .gallery-thumb.active { border-color:#2bcaff;box-shadow:0 0 0 1px #2bcaff; }
  .product-details-card { background:#070b10;padding:38px 5vw; }
  .product-page-price { color:#62dcff; }
  .product-page-name { color:#f7faff;font-family:'Space Grotesk',sans-serif;font-size:clamp(26px,4vw,48px); }
  .rating-text,.product-page-desc { color:#8795a7; }
  .product-page-divider { background:rgba(255,255,255,.08); }
  .product-page-desc-title { color:#5e7085; }
  .badge { background:rgba(255,255,255,.045) !important;color:#b8c6d5 !important;border-color:rgba(255,255,255,.09) !important; }
  .btn-add-cart { background:#fff;color:#050608;border-color:#fff; }
  .btn-add-cart:hover:not(:disabled) { background:#bdefff; }
  .related-section,.reviews-section { background:#070b10;border-color:rgba(255,255,255,.06); }
  .related-title,.reviews-title,.review-name { color:#eef4fb; }
  .review-card,.add-review-form { background:#0b1118;border-color:rgba(255,255,255,.08); }
  .review-comment { color:#7e8da1; }

  /* Desktop product page becomes a real two-column presentation */
  @media (min-width: 900px) {
    .product-page {
      display:grid;
      grid-template-columns:1.15fr .85fr;
      align-items:start;
      min-height:calc(100vh - 70px);
    }
    .product-page-back { grid-column:1 / -1; }
    .gallery-wrapper { position:sticky;top:75px;min-height:calc(100vh - 75px); }
    .gallery-main { height:600px; }
    .product-details-card { min-height:600px;padding:70px 5vw 60px 40px;margin:0;display:flex;flex-direction:column;justify-content:center; }
    .related-section,.reviews-section,.product-page-bottom { grid-column:1 / -1; }
    .product-page-bottom { max-width:1400px; }
  }

  @media (max-width: 899px) {
    .brand { position:static; transform:none; margin:auto; }
    .nav-buttons { display:none; }
    .hero-cinematic { min-height:760px;padding:62px 20px 50px;text-align:center; }
    .hero-cinematic-inner { grid-template-columns:1fr;gap:10px; }
    .hero-copy { margin:auto; }
    .hero-actions { justify-content:center; }
    .hero-reference-stage { min-height:390px; }
    .hero-product-collage { height:390px; }
    .hero-collage-1 { width:250px;height:250px;left:8%;top:6%; }
    .hero-collage-2 { width:170px;height:170px;right:2%;top:0; }
    .hero-collage-3 { width:185px;height:185px;right:8%;bottom:0; }
    .hero-stage-caption { right:0;bottom:0; }
    .category-showcase { padding:65px 16px 45px; }
    .category-showcase-grid { grid-template-columns:repeat(2,1fr);grid-auto-rows:250px; }
    .category-card-content strong { font-size:19px; }
  }

`;

/* ─── SCROLL-TRIGGERED REVEAL WRAPPER ─── */
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ─── PRODUCT DETAIL PAGE ─── */
function ProductPage({ product, onBack, onAddToCart, allProducts }) {
  // Always start the product-details screen at the top.
  // React is switching views in the same document, so the browser otherwise
  // preserves the previous shop-page scroll position (often near Reviews).
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [product?.id]);
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

      {/*
        The gallery below carries inline fallback styles (in addition to the
        CSS classes) on the wrapper, slide track, individual slides, and the
        <img> itself. This guarantees the gallery is always height-constrained
        and clipped even on first paint, before the external <style> block has
        finished loading/applying.
      */}
      <div className="gallery-wrapper" style={{ position: 'relative', overflow: 'hidden', width: '100%' }}>
        <div
          className="gallery-main"
          style={{ position: 'relative', width: '100%', height: 300, overflow: 'hidden' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="gallery-slides"
            style={{
              display: 'flex',
              height: '100%',
              width: '100%',
              transform: `translateX(-${current * 100}%)`
            }}
          >
            {images.map((img, i) => (
              <div
                className="gallery-slide"
                key={i}
                style={{
                  minWidth: '100%',
                  maxWidth: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  overflow: 'hidden',
                  background: '#fff'
                }}
              >
                <img
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            ))}
          </div>
          <button className={`gallery-arrow gallery-arrow-left ${current === 0 ? 'gallery-arrow-hidden' : ''}`} onClick={() => goTo(current - 1)}><ChevronLeft size={20} /></button>
          <button className={`gallery-arrow gallery-arrow-right ${current === images.length - 1 ? 'gallery-arrow-hidden' : ''}`} onClick={() => goTo(current + 1)}><ChevronRight size={20} /></button>
          {images.length > 1 && (
            <div style={{ position: 'absolute', bottom: 10, right: 12, background: 'rgba(18,24,21,0.7)', color: 'white', borderRadius: 20, padding: '3px 10px', fontSize: 12 }}>
              {current + 1} / {images.length}
            </div>
          )}
        </div>
        {images.length > 1 && (
          <div className="gallery-dots">{images.map((_, i) => <button key={i} className={`gallery-dot ${i === current ? 'active' : ''}`} onClick={() => goTo(i)} />)}</div>
        )}
        {images.length > 1 && (
          <div className="gallery-thumbs">{images.map((img, i) => <div key={i} className={`gallery-thumb ${i === current ? 'active' : ''}`} onClick={() => goTo(i)}><img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /></div>)}</div>
        )}
      </div>

      <div className="product-details-card">
        <div className="product-page-price">Rs. {product.price}</div>
        <div className="product-page-name">{product.name}</div>
        {product.category && <div style={{ fontSize: 12, color: '#0e5f52', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1, fontFamily: "'Space Grotesk', monospace" }}>{product.category}</div>}

        <div className="product-page-rating">
          <div className="stars">
            {[1,2,3,4,5].map(s => <Star key={s} size={15} fill={s <= Math.round(avgRating || 4) ? '#f5a623' : 'none'} color={s <= Math.round(avgRating || 4) ? '#f5a623' : '#c7ccc9'} />)}
          </div>
          <span className="rating-text">{avgRating || '4.0'} · {reviews.length} reviews · Stock: {product.stock}</span>
        </div>

        <div className="product-page-badges">
          <span className="badge badge-cod">💵 Cash on Delivery</span>
          {product.stock > 0 ? <span className="badge badge-stock">✅ Available</span> : <span className="badge badge-oos">❌ Out of Stock</span>}
          {product.stock > 0 && product.stock <= 5 && <span className="badge" style={{ background: 'rgba(255,107,74,0.14)', color: '#e5502f', border: '1px solid rgba(255,107,74,0.3)' }}>🔥 Only {product.stock} left!</span>}
          <span className="badge" style={{ background: 'var(--bg3)', color: 'var(--slate)', border: '1px solid var(--border)' }}>🚚 Free Delivery</span>
        </div>

        <div className="product-page-divider" />
        <div className="product-page-desc-title">Product Details</div>
        <div className="product-page-desc">{product.description || 'No description provided.'}</div>
        <div className="product-page-divider" />
        <div style={{ fontSize: 13, color: 'var(--slate)', lineHeight: 1.9 }}>
          <div>📦 <b style={{ color: 'var(--ink)' }}>Payment:</b> Cash on Delivery (COD)</div>
          <div>📱 <b style={{ color: 'var(--ink)' }}>Order via:</b> WhatsApp – 03442035118</div>
          <div>🔄 <b style={{ color: 'var(--ink)' }}>Returns:</b> Easy returns accepted</div>
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
                  {[1,2,3,4,5].map(s => <Star key={s} size={13} fill={s <= r.rating ? '#f5a623' : 'none'} color={s <= r.rating ? '#f5a623' : '#c7ccc9'} />)}
                </div>
              </div>
              <div className="review-date">{new Date(r.created_at).toLocaleDateString()}</div>
            </div>
            {r.comment && <div className="review-comment">{r.comment}</div>}
          </div>
        ))}
        {reviews.length === 0 && <div style={{ color: 'var(--slate-lt)', fontSize: 13, marginBottom: 16 }}>No reviews yet. Be the first!</div>}

        <div className="add-review-form">
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginBottom: 12 }}>Leave a Review</div>
          <div className="review-stars-input">
            {[1,2,3,4,5].map(s => (
              <button key={s} type="button" className="review-star-btn"
                onMouseEnter={() => setHoverStar(s)}
                onMouseLeave={() => setHoverStar(0)}
                onClick={() => setNewReview({ ...newReview, rating: s })}
              >
                <Star size={20} fill={s <= (hoverStar || newReview.rating) ? '#f5a623' : 'none'} color={s <= (hoverStar || newReview.rating) ? '#f5a623' : '#c7ccc9'} />
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
  const openProduct = (product) => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setSelectedProduct(product);
  };
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
  useEffect(() => {
    const move = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);


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

  // Premium cursor glow used by the new visual theme
  useEffect(() => {
    const root = document.documentElement;
    const move = (e) => {
      root.style.setProperty('--mx', `${e.clientX}px`);
      root.style.setProperty('--my', `${e.clientY}px`);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

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
              <div className="modal-total"><span>Total</span><span>Rs. {totalPrice}</span></div>
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
                <button
                  onClick={() => setView('wishlist')}
                  className="nav-btn"
                  style={{
                    background: wishlist.length ? 'var(--coral)' : 'transparent',
                    border: wishlist.length ? '1px solid var(--coral-dark)' : '1px solid var(--border)',
                    color: wishlist.length ? '#ffffff' : 'var(--ink-soft)'
                  }}
                >
                  <Heart size={15} fill={wishlist.length ? 'white' : 'none'} color={wishlist.length ? 'white' : 'var(--ink-soft)'} /> {wishlist.length > 0 && wishlist.length}
                </button>
                <button onClick={handleAdminClick} className="nav-btn nav-btn-admin">Admin</button>
                <button className="nav-btn nav-btn-cart" onClick={() => cart.length && setShowCheckout(true)}>
                  <ShoppingCart size={15} /> Cart {cart.length > 0 && <span className="cart-badge" key={cart.length}>{cart.length}</span>}
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

      {/* Cinematic Hero — shop view only */}
      {!isAdmin && view === 'shop' && (
        <section className="hero hero-cinematic">
          <div className="hero-noise" aria-hidden="true"></div>
          <div className="hero-orb hero-orb-one" aria-hidden="true"></div>
          <div className="hero-orb hero-orb-two" aria-hidden="true"></div>
          <div className="hero-grid-lines" aria-hidden="true"></div>
          <div className="hero-inner hero-cinematic-inner">
            <div className="hero-copy">
              <span className="hero-eyebrow">INNOVATIONS AT YOUR FINGERTIPS</span>
              <h1 className="hero-title">Next-Gen Tech<br /><span className="hero-accent">Just for You</span></h1>
              <p className="hero-sub">Discover smart gadgets, accessories and everyday essentials built to make life simpler, smarter and more connected.</p>
              <div className="hero-actions">
                <button className="hero-primary-btn" onClick={() => window.scrollTo({ top: 650, behavior: 'smooth' })}>Shop Now <ChevronRight size={17} /></button>
                <span className="hero-trust"><span className="hero-trust-dot"></span> Premium products · Fast delivery</span>
              </div>
            </div>

            <div className="hero-visual hero-reference-stage" aria-label="Featured products">
              <div className="hero-stage-glow"></div>
              <div className="hero-stage-orbit hero-stage-orbit-one"></div>
              <div className="hero-stage-orbit hero-stage-orbit-two"></div>
              {products.length > 0 ? (
                <div className="hero-product-collage">
                  {products.slice(0, 3).map((product, i) => (
                    <button
                      key={product.id}
                      className={`hero-collage-product hero-collage-${i + 1}`}
                      onClick={() => openProduct(product)}
                      aria-label={`View ${product.name}`}
                    >
                      <img src={getThumb(product)} alt={product.name} />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="hero-product hero-product-placeholder"><Package size={68} /></div>
              )}
              <div className="hero-stage-caption">
                <span className="hero-live-dot"></span>
                <strong>Curated tech</strong>
                <small>Designed for your everyday</small>
              </div>
            </div>
          </div>
          <div className="hero-scroll-hint"><span></span> Scroll to discover</div>
        </section>
      )}

      {/* Shop by Category — visual section inspired by the reference */}
      {!isAdmin && view === 'shop' && (
        <section className="category-showcase">
          <div className="category-showcase-head">
            <div>
              <span className="section-kicker">CURATED FOR YOU</span>
              <h2>Shop by Category</h2>
            </div>
            <p>Explore the collection by the way you live.</p>
          </div>
          <div className="category-showcase-grid">
            {categories.slice(0, 6).map((cat, index) => {
              const categoryProduct = products.find(p => p.category === cat);
              return (
                <button
                  key={cat}
                  className={`category-showcase-card category-card-${index + 1}`}
                  onClick={() => { setSelectedCategory(cat); window.scrollTo({ top: 980, behavior: 'smooth' }); }}
                >
                  {categoryProduct && <img src={getThumb(categoryProduct)} alt="" />}
                  <span className="category-card-overlay"></span>
                  <span className="category-card-content"><small>0{index + 1}</small><strong>{cat}</strong><em>Explore <ChevronRight size={14} /></em></span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Search & Filters — only in shop view */}
      {!isAdmin && view === 'shop' && (
        <>
          <div className="search-bar-wrapper">
            <div className="search-bar">
              <Search size={18} color="var(--slate-lt)" />
              <input placeholder="Search products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              {searchQuery && <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: 'var(--slate-lt)', cursor: 'pointer' }}><X size={16} /></button>}
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
                <Heart size={48} color="var(--slate-lt)" />
                <h3>Your wishlist is empty</h3>
                <p>Tap the heart on any product to save it here</p>
                <button className="submit-btn" style={{ marginTop: 16 }} onClick={() => setView('shop')}>Browse Products</button>
              </div>
            ) : (
              <div className="products-grid">
                {wishlistProducts.map((product, i) => (
                  <Reveal key={product.id} delay={(i % 6) * 60}>
                    <div className="product-card">
                      <div className="product-image" onClick={() => openProduct(product)}>
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
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SHOP VIEW */}
        {!isAdmin && view === 'shop' && (
          <div>
            <div className="section-title products-section-title">
              <div>
                <span className="section-kicker">THE COLLECTION</span>
                <h2>Featured essentials</h2>
              </div>
              <p>{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} available</p>
            </div>
            <div className="products-container">
              <div>
                {loading && <p style={{ textAlign: 'center', padding: 20, color: 'var(--slate)' }}>Loading products...</p>}
                {!loading && filteredProducts.length === 0 && <p style={{ textAlign: 'center', padding: 20, color: 'var(--slate-lt)' }}>No products found. Try a different search or filter.</p>}
                <div className="products-grid">
                  {filteredProducts.map((product, i) => (
                    <Reveal key={product.id} delay={(i % 6) * 60}>
                      <div className="product-card">
                        <div className="product-image" onClick={() => openProduct(product)}>
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
                          <button className="view-details-btn" onClick={() => openProduct(product)}>View Details</button>
                          <button className="add-to-cart-btn" onClick={() => addToCart(product)} disabled={product.stock === 0}><ShoppingCart size={14} /> Add to Cart</button>
                        </div>
                      </div>
                    </Reveal>
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
              <button className={`admin-tab ${adminTab === 'orders' ? 'active' : ''}`} onClick={() => setAdminTab('orders')}><ClipboardList size={15} /> Orders {pendingOrders > 0 && <span style={{ background: 'var(--coral)', color: 'white', borderRadius: 20, padding: '1px 7px', fontSize: 11 }}>{pendingOrders}</span>}</button>
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
                        <div className="product-name" style={{ color: 'var(--ink)' }}>{product.name}</div>
                        <div className="product-price" style={{ fontSize: 16 }}>Rs.{product.price}</div>
                        <div style={{ fontSize: 12, color: 'var(--slate-lt)' }}>Stock: {product.stock}</div>
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
                          <td><div style={{ color: 'var(--ink)', fontWeight: 600 }}>{order.customer_name}</div><div style={{ fontSize: 11 }}>{order.customer_phone}</div></td>
                          <td>{order.items?.map(i => i.name).join(', ')}</td>
                          <td style={{ color: 'var(--teal-dark)', fontWeight: 700, fontFamily: "'Space Grotesk', monospace" }}>Rs.{order.total_price}</td>
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
                  {orders.length === 0 && <div style={{ textAlign: 'center', padding: 30, color: 'var(--slate-lt)' }}>No orders yet</div>}
                </div>

                {/* Mobile Cards */}
                {orders.map(order => (
                  <div key={order.id} className="orders-mobile-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ fontWeight: 700, color: 'var(--ink)' }}>{order.customer_name}</div>
                      <div style={{ color: 'var(--teal-dark)', fontWeight: 700, fontFamily: "'Space Grotesk', monospace" }}>Rs.{order.total_price}</div>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--slate)', marginBottom: 4 }}>{order.customer_phone} · {order.customer_city}</div>
                    <div style={{ fontSize: 12, color: 'var(--slate-lt)', marginBottom: 10 }}>{order.items?.map(i => i.name).join(', ')}</div>
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
                        <div style={{ color: 'var(--slate-lt)', fontSize: 13, width: 20, fontFamily: "'Space Grotesk', monospace" }}>#{i + 1}</div>
                        <div style={{ width: 36, height: 36, borderRadius: 8, overflow: 'hidden', background: 'var(--bg3)' }}>
                          <img src={getThumb(p)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div><div style={{ color: 'var(--ink)', fontWeight: 600, fontSize: 13 }}>{p.name}</div><div style={{ color: 'var(--slate-lt)', fontSize: 11 }}>Rs.{p.price}</div></div>
                      </div>
                      <div style={{ color: 'var(--coral-dark)', fontWeight: 700, fontSize: 13, fontFamily: "'Space Grotesk', monospace" }}>{p.orderCount} orders</div>
                    </div>
                  ))}
                  {bestSelling.length === 0 && <div style={{ color: 'var(--slate-lt)', fontSize: 13 }}>No order data yet</div>}
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
                  {categories.length === 0 && <div style={{ color: 'var(--slate-lt)', fontSize: 13 }}>No categories yet — add one above.</div>}
                  <div className="products-management-grid">
                    {categories.map(cat => {
                      const count = products.filter(p => p.category === cat).length;
                      return (
                        <div key={cat} className="product-management-card" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <div className="product-name" style={{ color: 'var(--ink)' }}>{cat}</div>
                          <div style={{ fontSize: 12, color: 'var(--slate-lt)' }}>{count} product{count === 1 ? '' : 's'}</div>
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
        <p style={{ marginTop: 10, color: 'var(--slate-lt)' }}>© 2024 Lyfelytic. All rights reserved.</p>
      </footer>
    </div>
  );
}