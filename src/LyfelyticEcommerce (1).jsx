import { useLayoutEffect } from 'react';
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  ShoppingCart, LogOut, Plus, Trash2, Menu, X, Package, Home,
  Upload, ArrowLeft, ChevronLeft, ChevronRight, Star, Heart,
  Search, Filter, Edit2, Check, BarChart2, ClipboardList, Bell, Share2
} from 'lucide-react';
import { supabase } from './supabaseClient';

const CATEGORIES = ['All', 'General', 'Kitchen', 'Bedroom', 'Bathroom', 'Office', 'Outdoor', 'Electronics', 'Fashion', 'Kids'];

// ─── FEATURE 28: RATE LIMITING ───
// Stores the timestamp of the last order attempt in sessionStorage
const ORDER_COOLDOWN_MS = 60000; // 60 seconds

function canPlaceOrder() {
  const last = sessionStorage.getItem('lyf_last_order');
  if (!last) return true;
  return Date.now() - parseInt(last) > ORDER_COOLDOWN_MS;
}

function getRemainingCooldown() {
  const last = sessionStorage.getItem('lyf_last_order');
  if (!last) return 0;
  const remaining = ORDER_COOLDOWN_MS - (Date.now() - parseInt(last));
  return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
}

function markOrderPlaced() {
  sessionStorage.setItem('lyf_last_order', Date.now().toString());
}

// ─── FEATURE 33: WHATSAPP SHARE ───
function shareProductOnWhatsApp(product) {
  const url = window.location.href;
  const msg = `🛍️ Check out this product on Lyfelytic!\n\n*${product.name}*\nPrice: Rs.${product.price}\n\n${product.description ? product.description.slice(0, 100) + '...' : ''}\n\n👉 Shop here: ${url}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,800&family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  html {
    scroll-behavior: smooth;
    background: #050608;
    overflow-x: clip;
  }

  body {
    font-family: 'Manrope', sans-serif;
    background: #050608;
    color: #f7f9fc;
    min-height: 100vh;
    overflow-x: clip;
  }
  
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
    --mx: 50vw;
    --my: 35vh;
  }
  
  button, input, select, textarea { font-family: 'Manrope', sans-serif; }
  
  .lyfelytic-container { 
    min-height: 100vh; 
    width: 100%; 
    background: #050608; 
    position: relative; 
    isolation: isolate; 
  }
  
  .lyfelytic-container::after {
    content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 999;
    background: radial-gradient(320px circle at var(--mx) var(--my), rgba(25,191,255,0.075), transparent 70%);
    mix-blend-mode: screen; opacity: .8;
  }
  
  .lyfelytic-header {
    background: rgba(4,6,9,.85); border-bottom: 1px solid rgba(255,255,255,.075);
    backdrop-filter: blur(22px); padding: 14px 20px; position: sticky; top: 0; z-index: 200; width: 100%;
  }
  
  .header-content { 
    max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; 
    align-items: center; position: relative; min-height: 38px; width: 100%; 
  }
  
  .brand { display: flex; align-items: center; gap: 10px; z-index: 2; }
  .brand svg { color: var(--teal); }
  .brand h1 {
    font-family: 'Space Grotesk', sans-serif; font-size: 20px; letter-spacing: .12em; text-transform: uppercase;
    background: linear-gradient(180deg,#fff,#8bdfff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  
  .nav-buttons { display: none; gap: 6px; align-items: center; }
  @media (min-width: 850px) { .nav-buttons { display: flex; } }
  
  .nav-btn {
    background: transparent; border: 0; color: #aab5c4; border-radius: 999px;
    font-size: 11px; letter-spacing: .08em; text-transform: uppercase; padding: 9px 13px;
    cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; gap: 6px; font-weight: 600;
  }
  .nav-btn-shop { color: #fff; background: rgba(255,255,255,.055); }
  .nav-btn-shop:hover { background: rgba(25,191,255,.10); color:#fff; }
  .nav-btn-admin { border: 1px solid rgba(255,255,255,.10); }
  .nav-btn-admin:hover { background: rgba(255,255,255,.06); color:#fff; }
  .nav-btn-exit { color: #ff5e75; border: 1px solid rgba(255,94,117,0.28); }
  .nav-btn-cart { color: #061019; background: #fff; border: 0; box-shadow: 0 0 24px rgba(42,201,255,.18); position: relative; }
  .nav-btn-cart:hover { background: #bdefff; color: #061019; transform: translateY(-1px); }
  
  .cart-badge {
    position: absolute; top: -6px; right: -6px; background: #06101a; color: #fff;
    border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center;
    justify-content: center; font-size: 10px; font-weight: 700;
  }
  
  .mobile-menu-btn { background: none; border: none; color: #fff; cursor: pointer; display: flex; align-items: center; padding: 4px; }
  @media (min-width: 850px) { .mobile-menu-btn { display: none; } }
  
  .mobile-menu {
    display: none; position: absolute; top: 60px; left: 0; right: 0;
    background: rgba(5,7,11,.98); backdrop-filter: blur(20px); flex-direction: column; gap: 8px;
    padding: 14px; border-bottom: 1px solid rgba(255,255,255,.08); z-index: 199;
  }
  .mobile-menu.open { display: flex; }
  @media (min-width: 850px) { .mobile-menu { display: none !important; } }
  
  .mobile-menu-btn-item {
    padding: 12px; background: rgba(255,255,255,.045); border: 1px solid rgba(255,255,255,.09);
    color: #dce5f0; border-radius: 12px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 8px;
    font-size: 14px; width: 100%;
  }

  /* Hero */
  .hero-cinematic {
    min-height: 690px; padding: 78px 5vw 62px;
    background: radial-gradient(650px 520px at 76% 50%, rgba(0,150,255,.22), transparent 64%),
                radial-gradient(430px 300px at 18% 25%, rgba(0,78,150,.12), transparent 70%),
                linear-gradient(180deg,#06080c,#050608);
    position: relative; overflow: hidden; display: flex; align-items: center; width: 100%;
  }
  .hero-cinematic::before {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(90deg,rgba(5,6,8,.96) 0%,rgba(5,6,8,.72) 46%,rgba(5,6,8,.08) 100%);
    pointer-events: none;
  }
  .hero-grid-lines { position: absolute; inset: 0; opacity: .12; background-image: linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px); background-size: 80px 80px; }
  .hero-cinematic-inner { max-width: 1400px; width: 100%; display: grid; grid-template-columns: .9fr 1.1fr; gap: 20px; z-index: 2; margin: 0 auto; align-items: center; }
  .hero-copy { max-width: 620px; }
  .hero-eyebrow { color: #54d8ff; font-size: 11px; letter-spacing: 2px; font-family: 'Space Grotesk', monospace; font-weight: 700; text-transform: uppercase; }
  .hero-title { font-family: 'Space Grotesk', sans-serif; font-size: clamp(40px,6.2vw,88px); line-height: .98; letter-spacing: -.055em; color: #f8fbff; margin: 18px 0 24px; text-wrap: balance; }
  .hero-accent { color: transparent; background: linear-gradient(100deg,#fff,#67dcff 45%,#278fff); -webkit-background-clip: text; background-clip: text; }
  .hero-sub { color: #8c9aac; max-width: 510px; font-size: 15px; line-height: 1.75; margin: 0 0 30px; }
  .hero-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 18px; }
  .hero-primary-btn { display: inline-flex; align-items: center; gap: 8px; border-radius: 999px; padding: 13px 22px; color: #050608; font-weight: 800; background: #fff; cursor: pointer; border: 0; box-shadow: 0 12px 38px rgba(255,255,255,.10); transition: .3s ease; }
  .hero-primary-btn:hover { background: #dff7ff; box-shadow: 0 16px 46px rgba(28,192,255,.22); transform: translateY(-2px); }
  .hero-trust { color: #6e7c8e; font-size: 12px; display: inline-flex; align-items: center; gap: 8px; }
  .hero-trust-dot, .hero-live-dot { width: 7px; height: 7px; border-radius: 50%; background: #2bceff; box-shadow: 0 0 14px #2bceff; display: inline-block; }
  .hero-reference-stage { min-height: 530px; position: relative; display: flex; align-items: center; justify-content: center; isolation: isolate; width: 100%; }
  .hero-stage-glow { position: absolute; width: 520px; height: 360px; border-radius: 50%; background: radial-gradient(ellipse,rgba(20,190,255,.34),rgba(32,85,255,.09) 42%,transparent 72%); filter: blur(18px); }
  .hero-stage-orbit { position: absolute; border-radius: 50%; border: 1px solid rgba(68,211,255,.15); transform: rotate(-18deg); }
  .hero-stage-orbit-one { width: 470px; height: 260px; }
  .hero-stage-orbit-two { width: 560px; height: 320px; transform: rotate(22deg); opacity: .55; }
  .hero-product-collage { position: relative; width: min(700px,100%); height: 510px; transform: perspective(1000px) rotateY(-5deg); }
  .hero-collage-product { position: absolute; border: 0; padding: 16px; cursor: pointer; overflow: hidden; background: linear-gradient(145deg,rgba(255,255,255,.13),rgba(255,255,255,.025)); border: 1px solid rgba(255,255,255,.11); box-shadow: 0 30px 80px rgba(0,0,0,.6), inset 0 0 50px rgba(35,190,255,.06); backdrop-filter: blur(6px); transition: transform .55s cubic-bezier(.2,.8,.2,1), box-shadow .4s; }
  .hero-collage-product img { width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 28px 30px rgba(0,0,0,.55)); }
  .hero-collage-1 { width: 360px; height: 360px; left: 18%; top: 8%; z-index: 3; transform: rotate(-6deg); border-radius: 30px; }
  .hero-collage-2 { width: 245px; height: 245px; right: 4%; top: 2%; z-index: 2; transform: rotate(7deg); border-radius: 20px; }
  .hero-collage-3 { width: 270px; height: 270px; right: 9%; bottom: 3%; z-index: 1; transform: rotate(-8deg); border-radius: 20px; }
  .hero-collage-product:hover { transform: translateY(-16px) rotate(0deg) scale(1.04); z-index: 8; box-shadow: 0 45px 95px rgba(0,0,0,.72), 0 0 55px rgba(28,194,255,.20); }
  .hero-stage-caption { position: absolute; right: 2%; bottom: 3%; z-index: 10; padding: 11px 14px; border-left: 2px solid #2bc9ff; background: rgba(4,7,11,.65); backdrop-filter: blur(12px); display: grid; grid-template-columns: auto 1fr; column-gap: 8px; box-shadow: 0 15px 40px rgba(0,0,0,.35); }
  .hero-stage-caption strong { font-size: 12px; color: #edf7ff; }
  .hero-stage-caption small { grid-column: 2; color: #718095; font-size: 10px; margin-top: 2px; }

  /* Category showcase */
  .category-showcase { max-width: 1400px; margin: 0 auto; padding: 82px 5vw 70px; background: #050608; width: 100%; }
  .category-showcase-head { display: block; text-align: center; margin-bottom: 32px; }
  .section-kicker { color: #53d5ff; font-size: 10px; font-weight: 800; letter-spacing: 2.2px; text-transform: uppercase; }
  .category-showcase-head h2, .section-title h2 { font-family: 'Space Grotesk', sans-serif; color: #f3f7fc; font-size: clamp(26px,4vw,48px); letter-spacing: -.04em; margin-top: 7px; }
  .category-showcase-head p { margin: 10px auto 0; color: #69778a; max-width: 340px; font-size: 13px; line-height: 1.6; }
  .category-showcase-grid { display: grid; grid-template-columns: repeat(4,1fr); grid-auto-rows: 330px; gap: 10px; }
  .category-showcase-card { position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,.08); border-radius: 4px; background: #0a0f15; cursor: pointer; text-align: left; min-width: 0; }
  .category-showcase-card img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: .58; transform: scale(1.02); transition: transform .8s cubic-bezier(.2,.8,.2,1), filter .6s; filter: brightness(.68) saturate(1.15); }
  .category-showcase-card:hover img { transform: scale(1.12); filter: brightness(.9) saturate(1.25); }
  .category-card-overlay { position: absolute; inset: 0; background: linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.82)); }
  .category-card-content { position: absolute; left: 22px; right: 22px; bottom: 20px; display: grid; grid-template-columns: 1fr auto; align-items: end; z-index: 2; }
  .category-card-content small { grid-column: 1/-1; color: #48d4ff; font-size: 9px; letter-spacing: 2px; margin-bottom: 6px; }
  .category-card-content strong { color: #fff; font-family: 'Space Grotesk', sans-serif; font-size: 22px; letter-spacing: -.03em; }
  .category-card-content em { display: flex; align-items: center; gap: 3px; color: #a9b7c7; font-style: normal; font-size: 10px; opacity: 0; transform: translateX(-5px); transition: .3s; }
  .category-showcase-card:hover .category-card-content em { opacity: 1; transform: translateX(0); }

  /* Search + Filters */
  .search-bar-wrapper { max-width: 1400px; margin: 0 auto; padding: 0 5vw 10px; background: #050608; width: 100%; }
  .search-bar { display: flex; align-items: center; gap: 10px; background: #090d12; border: 1px solid rgba(255,255,255,.08); border-radius: 999px; padding: 12px 18px; width: 100%; }
  .search-bar:focus-within { border-color: rgba(35,199,255,.45); box-shadow: 0 0 0 3px rgba(35,199,255,.07), 0 0 35px rgba(35,199,255,.06); }
  .search-bar input { flex: 1; background: none; border: none; outline: none; color: #eaf4ff; font-size: 14px; min-width: 0; }
  .search-bar input::placeholder { color: #5d6b7f; }
  .filter-bar { max-width: 1400px; margin: 0 auto; padding: 10px 5vw 20px; background: #050608; display: flex; gap: 12px; flex-wrap: wrap; align-items: center; justify-content: space-between; width: 100%; }
  .category-chips { display: flex; gap: 7px; flex-wrap: wrap; flex: 1; overflow-x: auto; scrollbar-width: none; }
  .category-chips::-webkit-scrollbar { display: none; }
  .chip { padding: 8px 16px; border-radius: 999px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: 1px solid rgba(255,255,255,.08); background: transparent; color: #718095; white-space: nowrap; flex-shrink: 0; }
  .chip.active, .chip:hover { color: #fff; background: rgba(36,201,255,.09); border-color: rgba(36,201,255,.35); }
  .filter-selects { display: flex; gap: 10px; flex-wrap: wrap; }
  .filter-select { padding: 8px 14px; border-radius: 999px; font-size: 12px; font-weight: 600; background: #090d12; border: 1px solid rgba(255,255,255,.08); color: #aeb9c8; cursor: pointer; outline: none; }

  /* Product Catalog */
  .main-content { max-width: 1400px; margin: 0 auto; padding: 40px 5vw 80px; background: #050608; width: 100%; }
  .section-title { text-align: center; margin-bottom: 24px; }
  .products-section-title { display: flex; justify-content: space-between; align-items: end; padding-top: 50px; text-align: left; }
  .products-section-title p { color: #69778a; }
  .products-container { display: grid; grid-template-columns: 1fr; gap: 18px; width: 100%; }
  .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; width: 100%; }
  .product-card { background: #090e14; border: 1px solid rgba(255,255,255,.075); border-radius: 6px; overflow: hidden; transition: all 0.3s ease; cursor: pointer; position: relative; }
  .product-card:hover { border-color: rgba(39,200,255,.35); transform: translateY(-4px); box-shadow: 0 20px 45px rgba(0,0,0,.55), 0 0 25px rgba(25,178,255,.07); }
  .product-image { width: 100%; height: 240px; background: #070b10; overflow: hidden; position: relative; }
  .product-image img { width: 100%; height: 100%; object-fit: contain; padding: 14px; transition: transform .6s cubic-bezier(.2,.8,.2,1), filter .4s; display: block; }
  .product-card:hover .product-image img { transform: scale(1.06); filter: brightness(1.08); }
  .out-of-stock { position: absolute; inset: 0; background: rgba(18,24,21,0.75); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 14px; }
  .stock-low-badge { position: absolute; top: 10px; left: 10px; background: #ee4770; color: white; padding: 4px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; font-family: 'Space Grotesk', monospace; text-transform: uppercase; }
  .wishlist-btn { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,.55); border: 1px solid rgba(255,255,255,.14); border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; z-index: 5; }
  .wishlist-btn:hover { background: rgba(30,194,255,.20); border-color: #36cfff; }
  .wishlist-btn.active { background: #19bfff; border-color: #19bfff; }
  .multi-img-badge { position: absolute; bottom: 10px; right: 10px; background: rgba(4,8,14,.72); border: 1px solid rgba(255,255,255,.08); color: white; border-radius: 10px; padding: 3px 8px; font-size: 10px; font-family: 'Space Grotesk', monospace; }
  .product-info { padding: 14px; background: #090e14; }
  .product-category-tag { font-size: 9px; font-weight: 700; color: #43cfff; font-family: 'Space Grotesk', monospace; text-transform: uppercase; margin-bottom: 4px; }
  .product-name { font-size: 15px; font-weight: 700; color: #eef4fb; margin-bottom: 4px; font-family: 'Space Grotesk', sans-serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .product-description { color: #748195; font-size: 12px; margin-bottom: 8px; line-height: 1.4; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .product-price { position: relative; display: inline-flex; align-items: center; font-family: 'Space Grotesk', monospace; font-weight: 700; font-size: 16px; color: #5bd8ff; margin-bottom: 6px; }
  .product-stock { color: #586678; font-size: 11px; margin-bottom: 8px; font-weight: 600; }
  .view-details-btn { width: 100%; padding: 8px; background: transparent; color: #a9b6c5; border: 1px solid rgba(255,255,255,.10); border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 12px; margin-bottom: 6px; }
  .view-details-btn:hover { color: #fff; border-color: rgba(39,200,255,.35); background: rgba(39,200,255,.06); }
  .add-to-cart-btn { width: 100%; padding: 9px; background: #fff; color: #050608; border: 0; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 12px; }
  .add-to-cart-btn:hover:not(:disabled) { background: #bdefff; }
  .add-to-cart-btn:disabled { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.3); cursor: not-allowed; }

  /* FEATURE 33: WhatsApp Share Button */
  .whatsapp-share-btn {
    width: 100%; padding: 8px; background: rgba(37,211,102,0.12); color: #25d366;
    border: 1px solid rgba(37,211,102,0.3); border-radius: 8px; font-weight: 600;
    cursor: pointer; transition: all 0.2s; font-size: 12px; margin-bottom: 6px;
    display: flex; align-items: center; justify-content: center; gap: 6px;
  }
  .whatsapp-share-btn:hover { background: rgba(37,211,102,0.22); border-color: rgba(37,211,102,0.6); }

  /* Admin Panel */
  .admin-panel { 
    background: #0a0f16; border-radius: 14px; padding: 20px; 
    border: 1px solid rgba(255,255,255,0.08); width: 100%; max-width: 100%; overflow: hidden;
  }
  .admin-title { font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 18px; display: flex; align-items: center; gap: 8px; }
  .admin-tabs { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; width: 100%; }
  .admin-tab { padding: 8px 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1px solid rgba(255,255,255,0.08); color: #8794a6; background: #070b10; }
  .admin-tab.active { background: rgba(36,201,255,0.15); border-color: #24c9ff; color: #24c9ff; }
  
  .add-product-form { background: #070b10; border-radius: 12px; padding: 18px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.08); width: 100%; }
  .form-title { font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; width: 100%; }
  @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }
  .form-full { grid-column: 1 / -1; }
  .form-input { padding: 10px 12px; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; font-size: 13px; width: 100%; background: #0a0f16; color: #fff; outline: none; }
  
  .image-upload-area { border: 2px dashed rgba(255,255,255,0.15); border-radius: 8px; padding: 16px; text-align: center; cursor: pointer; background: #0a0f16; display: block; width: 100%; }
  .image-upload-area input { display: none; }
  .upload-text { font-size: 13px; color: #8794a6; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .upload-hint { font-size: 11px; color: #586678; margin-top: 4px; }
  .image-preview { margin-top: 14px; display: flex; flex-wrap: wrap; gap: 10px; }
  .preview-item { position: relative; width: 70px; height: 70px; }
  .preview-item img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; border: 2px solid rgba(255,255,255,0.1); }
  .remove-image-btn { position: absolute; top: -6px; right: -6px; background: #ff5e75; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 11px; }
  .submit-btn { background: #24c9ff; color: #050608; padding: 10px 20px; border: 0; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 13px; }

  .products-management-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; width: 100%; }
  .product-management-card { background: #070b10; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px; }
  .product-management-image { width: 100%; height: 140px; background: #0a0f16; border-radius: 6px; margin-bottom: 8px; overflow: hidden; }
  .product-management-image img { width: 100%; height: 100%; object-fit: cover; }
  .admin-card-actions { display: flex; gap: 8px; margin-top: 10px; }
  .edit-btn, .delete-btn { flex: 1; padding: 7px; border-radius: 6px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px; font-size: 11px; border: 0; }
  .edit-btn { background: rgba(36,201,255,0.15); color: #24c9ff; }
  .delete-btn { background: rgba(255,94,117,0.15); color: #ff5e75; }

  /* Orders View */
  .orders-section { background: #070b10; border-radius: 12px; padding: 16px; border: 1px solid rgba(255,255,255,0.08); width: 100%; }
  .orders-desktop-container { width: 100%; overflow-x: auto; display: none; }
  @media (min-width: 768px) { .orders-desktop-container { display: block; } }
  
  .orders-table { width: 100%; border-collapse: collapse; font-size: 12px; white-space: nowrap; }
  .orders-table th { text-align: left; padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.08); color: #586678; font-size: 11px; text-transform: uppercase; font-family: 'Space Grotesk', monospace; }
  .orders-table td { padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.08); color: #8794a6; vertical-align: middle; }
  
  /* FEATURE 24: Order # badge */
  .order-number-badge {
    display: inline-block; background: rgba(36,201,255,0.12); color: #24c9ff;
    border: 1px solid rgba(36,201,255,0.25); border-radius: 6px; padding: 2px 8px;
    font-size: 11px; font-weight: 700; font-family: 'Space Grotesk', monospace;
  }

  .orders-mobile-list { display: flex; flex-direction: column; gap: 10px; width: 100%; }
  @media (min-width: 768px) { .orders-mobile-list { display: none; } }
  
  .order-mobile-card {
    background: #0a0f16; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px;
    display: flex; flex-direction: column; gap: 8px; width: 100%;
  }
  .order-card-header { display: flex; justify-content: space-between; align-items: flex-start; }
  .order-card-title { color: #fff; font-weight: 700; font-size: 14px; }
  .order-card-price { color: #24c9ff; font-weight: 700; font-family: 'Space Grotesk', monospace; font-size: 14px; }
  .order-card-details { font-size: 12px; color: #8794a6; line-height: 1.4; }
  
  .order-status-select { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; border: none; cursor: pointer; outline: none; }
  .status-pending { background: rgba(245,166,35,0.15); color: #f5a623; }
  .status-shipped { background: rgba(36,201,255,0.15); color: #24c9ff; }
  .status-delivered { background: rgba(34,197,94,0.15); color: #22c55e; }
  .status-cancelled { background: rgba(255,94,117,0.15); color: #ff5e75; }

  .dashboard-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 20px; width: 100%; }
  .stat-card { background: #070b10; border-radius: 12px; padding: 14px; border: 1px solid rgba(255,255,255,0.08); }
  .stat-label { font-size: 10px; color: #586678; text-transform: uppercase; margin-bottom: 4px; font-family: 'Space Grotesk', monospace; }
  .stat-value { font-size: 20px; font-weight: 700; color: #fff; font-family: 'Space Grotesk', monospace; }

  /* FEATURE 28: Rate limit toast */
  .rate-limit-toast {
    position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
    background: #1a0a10; border: 1px solid rgba(255,94,117,0.4); color: #ff5e75;
    padding: 12px 20px; border-radius: 12px; font-size: 13px; font-weight: 600;
    z-index: 9999; display: flex; align-items: center; gap: 8px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.5); white-space: nowrap;
    animation: slideUp 0.3s ease;
  }
  @keyframes slideUp {
    from { transform: translateX(-50%) translateY(20px); opacity: 0; }
    to { transform: translateX(-50%) translateY(0); opacity: 1; }
  }

  .footer { background: #030508; border-top: 1px solid rgba(255,255,255,.08); color: #738095; padding: 35px 20px; text-align: center; width: 100%; }
  .footer p { margin: 6px 0; font-size: 12px; }

  @media (max-width: 899px) {
    .hero-cinematic-inner { grid-template-columns: 1fr; gap: 10px; }
    .hero-reference-stage { min-height: 390px; }
    .hero-product-collage { height: 390px; }
    .hero-collage-1 { width: 250px; height: 250px; left: 8%; top: 6%; }
    .hero-collage-2 { width: 170px; height: 170px; right: 2%; top: 0; }
    .hero-collage-3 { width: 185px; height: 185px; right: 8%; bottom: 0; }
    .category-showcase-grid { grid-template-columns: repeat(2,1fr); grid-auto-rows: 240px; }
  }
`;

/* ─── MAKEUP BOX UNBOXING 3D STAGE ─── */
const SCENES = [
  { eyebrow: 'THE UNBOXING EXPERIENCE', title: 'Beauty, Unboxed.', body: 'Watch the curated kit land and open with precision.' },
  { eyebrow: 'PRECISION CRAFTED', title: 'Every Piece, Revealed.', body: 'Essentials emerge and align into your personalized vanity display.' },
  { eyebrow: 'CASH ON DELIVERY', title: 'Arrives at Your Door.', body: 'Pay with complete peace of mind when it reaches you.' },
  { eyebrow: 'READY TO EXPLORE', title: 'Your Daily Edit Awaits.', body: 'Scroll down to shop the full collection.' }
];

function ScrollProductStage() {
  const canvasRef = useRef(null);
  const stickyRef = useRef(null);
  const stageRef = useRef(null);
  const dotsRef = useRef([]);
  const sceneElsRef = useRef([]);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = canvasRef.current;
    const stickyEl = stickyRef.current;
    const stageEl = stageRef.current;
    if (!canvas || !stickyEl || !stageEl) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const rootRig = new THREE.Group();
    scene.add(rootRig);

    function sizeRenderer() {
      const w = stickyEl.clientWidth;
      const h = stickyEl.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      const isMobile = w < 768;
      const isNarrow = w < 440;
      const scale = isNarrow ? 0.68 : isMobile ? 0.78 : 1.05;
      rootRig.scale.set(scale, scale, scale);
      camera.position.set(0, isMobile ? 0.45 : 0.85, isNarrow ? 9.6 : isMobile ? 9.0 : 8.2);
      camera.updateProjectionMatrix();
    }
    sizeRenderer();
    window.addEventListener('resize', sizeRenderer);

    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);
    const keySpot = new THREE.SpotLight(0xffffff, 3.2, 30, Math.PI / 4, 0.4, 1.2);
    keySpot.position.set(3.5, 9, 6);
    keySpot.castShadow = true;
    keySpot.shadow.mapSize.width = 1024;
    keySpot.shadow.mapSize.height = 1024;
    keySpot.shadow.bias = -0.0008;
    scene.add(keySpot);
    const tealRim = new THREE.PointLight(0x24c9ff, 3.0, 20);
    tealRim.position.set(-5, 2.5, 3.5);
    scene.add(tealRim);
    const coralRim = new THREE.PointLight(0xff6b4a, 2.2, 20);
    coralRim.position.set(5, -1, -2);
    scene.add(coralRim);
    const warmFill = new THREE.DirectionalLight(0xffedd5, 1.0);
    warmFill.position.set(-3, -2, 5);
    scene.add(warmFill);

    const goldMat = new THREE.MeshStandardMaterial({ color: 0xdfb76c, roughness: 0.18, metalness: 0.94 });
    const obsidianMat = new THREE.MeshPhysicalMaterial({ color: 0x080c14, roughness: 0.28, metalness: 0.35, clearcoat: 0.85, clearcoatRoughness: 0.12 });

    const shadowPlate = new THREE.Mesh(new THREE.CircleGeometry(3.6, 64), new THREE.ShadowMaterial({ opacity: 0.35 }));
    shadowPlate.rotation.x = -Math.PI / 2;
    shadowPlate.position.y = -1.15;
    shadowPlate.receiveShadow = true;
    rootRig.add(shadowPlate);

    const kitGroup = new THREE.Group();
    rootRig.add(kitGroup);

    const boxBase = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.45, 2.2), obsidianMat);
    boxBase.position.y = -0.25;
    boxBase.castShadow = true;
    boxBase.receiveShadow = true;
    const velvetCushion = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.4, 2.0), new THREE.MeshStandardMaterial({ color: 0x0f1724, roughness: 0.85, metalness: 0.05 }));
    velvetCushion.position.y = -0.19;
    const goldBorder = new THREE.Mesh(new THREE.BoxGeometry(3.24, 0.05, 2.24), goldMat);
    goldBorder.position.y = 0.01;
    kitGroup.add(boxBase, velvetCushion, goldBorder);

    const lidHinge = new THREE.Group();
    lidHinge.position.set(0, 0.02, -1.1);
    const lidMesh = new THREE.Mesh(new THREE.BoxGeometry(3.22, 0.08, 2.22), obsidianMat);
    lidMesh.position.set(0, 0.04, 1.1);
    lidMesh.castShadow = true;
    const lidGoldTrim = new THREE.Mesh(new THREE.BoxGeometry(3.24, 0.02, 2.24), goldMat);
    lidGoldTrim.position.set(0, 0.08, 1.1);
    const mirrorGlass = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 1.8), new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.02, metalness: 0.98, clearcoat: 1.0, clearcoatRoughness: 0.05 }));
    mirrorGlass.position.set(0, 0.01, 1.1);
    mirrorGlass.rotation.x = Math.PI / 2;
    lidHinge.add(lidMesh, lidGoldTrim, mirrorGlass);
    kitGroup.add(lidHinge);

    const items = [];
    function registerItem(mesh, finalPos, finalRot, startPos) {
      mesh.position.copy(startPos);
      mesh.scale.set(0.001, 0.001, 0.001);
      mesh.userData = { finalPos, finalRot, startPos };
      mesh.traverse((c) => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
      rootRig.add(mesh);
      items.push(mesh);
      return mesh;
    }

    const lipGroup = new THREE.Group();
    const lipBaseTube = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.75, 48), obsidianMat);
    const lipGoldChamber = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.45, 48), goldMat);
    lipGoldChamber.position.y = 0.5;
    const lipBulletGeom = new THREE.CylinderGeometry(0.18, 0.19, 0.55, 48);
    const pos = lipBulletGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) { if (pos.getY(i) > 0.15) pos.setY(i, pos.getY(i) - (pos.getX(i) + 0.18) * 0.45); }
    lipBulletGeom.computeVertexNormals();
    const lipWaxMat = new THREE.MeshPhysicalMaterial({ color: 0xeb3b5a, roughness: 0.32, metalness: 0.05, clearcoat: 0.6, clearcoatRoughness: 0.2 });
    const lipBulletMesh = new THREE.Mesh(lipBulletGeom, lipWaxMat);
    lipBulletMesh.position.y = 0.9;
    lipGroup.add(lipBaseTube, lipGoldChamber, lipBulletMesh);
    registerItem(lipGroup, new THREE.Vector3(-1.45, -0.35, 1.05), new THREE.Vector3(0.05, 0.35, 0), new THREE.Vector3(-0.4, -0.1, 0));

    const compactGroup = new THREE.Group();
    const compactCase = new THREE.Mesh(new THREE.CylinderGeometry(0.72, 0.72, 0.16, 64), obsidianMat);
    const compactGoldRing = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.024, 24, 64), goldMat);
    compactGoldRing.rotation.x = Math.PI / 2;
    compactGoldRing.position.y = 0.08;
    const powderTextureMat = new THREE.MeshStandardMaterial({ color: 0xe6c5a8, roughness: 0.88, metalness: 0.02 });
    const powderPan = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 0.05, 48), powderTextureMat);
    powderPan.position.y = 0.09;
    compactGroup.add(compactCase, compactGoldRing, powderPan);
    registerItem(compactGroup, new THREE.Vector3(-0.48, -0.72, 1.25), new THREE.Vector3(0.28, 0.05, 0), new THREE.Vector3(0, -0.1, 0));

    const perfumeGroup = new THREE.Group();
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x76ddff, roughness: 0.06, transmission: 0.88, thickness: 1.1, ior: 1.52, clearcoat: 1.0, clearcoatRoughness: 0.04 });
    const bottleBody = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.92, 0.42), glassMat);
    const perfumeLiquid = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.72, 0.32), new THREE.MeshStandardMaterial({ color: 0x19bfff, roughness: 0.2, metalness: 0.1, transparent: true, opacity: 0.75 }));
    perfumeLiquid.position.y = -0.06;
    const goldNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.14, 32), goldMat);
    goldNeck.position.y = 0.52;
    const goldCap = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.3, 32), obsidianMat);
    goldCap.position.y = 0.72;
    perfumeGroup.add(bottleBody, perfumeLiquid, goldNeck, goldCap);
    registerItem(perfumeGroup, new THREE.Vector3(1.42, -0.32, 0.95), new THREE.Vector3(0, -0.35, 0), new THREE.Vector3(0.5, -0.1, 0));

    const brushGroup = new THREE.Group();
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x12161f, roughness: 0.3, metalness: 0.2 });
    const brushHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.065, 1.4, 32), handleMat);
    const brushFerrule = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.24, 32), goldMat);
    brushFerrule.position.y = 0.72;
    const bristleMat = new THREE.MeshStandardMaterial({ color: 0x1c1e24, roughness: 0.92, metalness: 0.0 });
    const bristles = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.45, 32), bristleMat);
    bristles.position.y = 1.04;
    brushGroup.add(brushHandle, brushFerrule, bristles);
    registerItem(brushGroup, new THREE.Vector3(0.52, 0.08, 1.15), new THREE.Vector3(0.15, 0.18, -0.35), new THREE.Vector3(0.2, -0.1, 0.1));

    let ticking = false;
    function getProgress() {
      const rect = stageEl.getBoundingClientRect();
      const total = stageEl.offsetHeight - stickyEl.clientHeight;
      if (total <= 0) return 0;
      return Math.min(1, Math.max(0, -rect.top / total));
    }
    function smooth(t) { return t * t * (3 - 2 * t); }
    function applyProgress(p) {
      const pDrop = Math.min(1, Math.max(0, p / 0.32));
      const eDrop = smooth(pDrop);
      kitGroup.position.y = THREE.MathUtils.lerp(5.2, -0.65, eDrop);
      kitGroup.position.z = THREE.MathUtils.lerp(-2.2, 0, eDrop);
      kitGroup.rotation.x = THREE.MathUtils.lerp(0.45, 0.14, eDrop);
      const pLid = Math.min(1, Math.max(0, (p - 0.28) / 0.30));
      const eLid = smooth(pLid);
      lidHinge.rotation.x = THREE.MathUtils.lerp(0, -1.95, eLid);
      items.forEach((item, idx) => {
        const itemDelay = 0.48 + idx * 0.07;
        const pItem = Math.min(1, Math.max(0, (p - itemDelay) / 0.38));
        const eItem = smooth(pItem);
        const arcY = Math.sin(eItem * Math.PI) * 1.4;
        item.position.x = THREE.MathUtils.lerp(item.userData.startPos.x, item.userData.finalPos.x, eItem);
        item.position.y = THREE.MathUtils.lerp(item.userData.startPos.y, item.userData.finalPos.y, eItem) + arcY;
        item.position.z = THREE.MathUtils.lerp(item.userData.startPos.z, item.userData.finalPos.z, eItem);
        const scaleVal = THREE.MathUtils.lerp(0.001, 1, eItem);
        item.scale.set(scaleVal, scaleVal, scaleVal);
        item.rotation.x = THREE.MathUtils.lerp(Math.PI / 2, item.userData.finalRot.x, eItem);
        item.rotation.y = THREE.MathUtils.lerp(0, item.userData.finalRot.y, eItem);
        item.rotation.z = THREE.MathUtils.lerp(0, item.userData.finalRot.z, eItem);
      });
      rootRig.rotation.y = THREE.MathUtils.lerp(-0.25, 0.2, smooth(p));
      const sceneCount = SCENES.length;
      const segment = 1 / sceneCount;
      const activeIdx = Math.min(sceneCount - 1, Math.floor(p / segment));
      sceneElsRef.current.forEach((el, i) => {
        if (!el) return;
        const localP = Math.min(1, Math.max(0, (p - i * segment) / segment));
        const fade = localP < 0.15 ? localP / 0.15 : localP > 0.85 ? (1 - localP) / 0.15 : 1;
        const visible = i === activeIdx;
        el.style.opacity = visible ? String(Math.max(0, Math.min(1, fade))) : '0';
        el.style.pointerEvents = 'none';
        el.style.transform = `translateY(${visible ? 0 : 12}px)`;
      });
      dotsRef.current.forEach((dot, i) => { if (dot) dot.classList.toggle('spstage-dot-active', i === activeIdx); });
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(() => { applyProgress(getProgress()); ticking = false; }); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    applyProgress(getProgress());

    let raf;
    function animate() {
      raf = requestAnimationFrame(animate);
      if (!reduceMotion) rootRig.rotation.y += 0.0004;
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', sizeRenderer);
      window.removeEventListener('scroll', onScroll);
      renderer.dispose();
    };
  }, []);

  return (
    <section ref={stageRef} style={{ position: 'relative', height: '420vh', width: '100%' }}>
      <style>{`
        .spstage-sticky { position: sticky; top: 0; height: 100svh; min-height: 600px; overflow: hidden; background: radial-gradient(ellipse at 50% 35%, rgba(36,201,255,0.14), transparent 65%), linear-gradient(180deg, #05070b 0%, #090d14 100%); width: 100%; }
        .spstage-canvas { position: absolute; inset: 0; z-index: 1; width: 100%; height: 100%; display: block; }
        .spstage-scene { position: absolute; top: 12%; left: 0; right: 0; z-index: 2; display: flex; flex-direction: column; align-items: center; text-align: center; padding: 0 6vw; opacity: 0; transition: opacity .35s ease, transform .35s ease; will-change: opacity, transform; }
        .spstage-eyebrow { font-family: 'Space Grotesk', sans-serif; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #54d8ff; margin-bottom: 12px; }
        .spstage-title { font-family: 'Space Grotesk', sans-serif; font-size: clamp(26px, 4.8vw, 56px); line-height: 1.05; letter-spacing: -.03em; color: #f7f9fc; margin-bottom: 10px; text-wrap: balance; }
        .spstage-body { font-family: 'Manrope', sans-serif; color: #8c9aac; font-size: 14px; line-height: 1.6; max-width: 440px; }
        .spstage-progress { position: absolute; left: 50%; bottom: 28px; transform: translateX(-50%); display: flex; gap: 8px; z-index: 3; }
        .spstage-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,.22); transition: all .3s ease; }
        .spstage-dot-active { background: #24c9ff; width: 22px; border-radius: 4px; box-shadow: 0 0 12px rgba(36,201,255,.6); }
        .spstage-hint { position: absolute; top: 18px; left: 50%; transform: translateX(-50%); color: #617085; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; z-index: 3; }
      `}</style>
      <div ref={stickyRef} className="spstage-sticky">
        <canvas ref={canvasRef} className="spstage-canvas" />
        <div className="spstage-hint">Scroll down to unbox</div>
        {SCENES.map((s, i) => (
          <div key={i} ref={(el) => (sceneElsRef.current[i] = el)} className="spstage-scene">
            {s.eyebrow && <div className="spstage-eyebrow">{s.eyebrow}</div>}
            <h2 className="spstage-title">{s.title}</h2>
            {s.body && <p className="spstage-body">{s.body}</p>}
          </div>
        ))}
        <div className="spstage-progress">
          {SCENES.map((_, i) => (<span key={i} ref={(el) => (dotsRef.current[i] = el)} className="spstage-dot" />))}
        </div>
      </div>
    </section>
  );
}

function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(entry.target); } }); }, { threshold: 0.15 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─── PRODUCT DETAIL PAGE — OPTION C MAGAZINE LAYOUT ─── */
function ProductPage({ product, onBack, onAddToCart, allProducts }) {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [product?.id]);

  const images = (product.images && product.images.length > 0) ? product.images : (product.image ? [product.image] : []);
  const [current, setCurrent] = useState(0);
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const [hoverStar, setHoverStar] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const touchStartX = useRef(null);

  useEffect(() => {
    supabase.from('reviews').select('*').eq('product_id', product.id).order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setReviews(data); });
    const wl = JSON.parse(localStorage.getItem('lyf_wishlist') || '[]');
    setWishlisted(wl.includes(product.id));
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
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleToggleWishlist = () => {
    const wl = JSON.parse(localStorage.getItem('lyf_wishlist') || '[]');
    const updated = wishlisted ? wl.filter(id => id !== product.id) : [...wl, product.id];
    localStorage.setItem('lyf_wishlist', JSON.stringify(updated));
    setWishlisted(!wishlisted);
  };

  const handleWhatsAppOrder = () => {
    const msg = `Hi! I want to order:\n\n*${product.name}*\nPrice: Rs.${product.price}\nQty: ${qty}\nTotal: Rs.${product.price * qty}\n\nPlease confirm availability and delivery details.`;
    window.open(`https://wa.me/923442035118?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) onAddToCart(product);
    onBack();
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.name.trim()) { alert('Please enter your name'); return; }
    const { data, error } = await supabase.from('reviews').insert([{
      id: Date.now(), product_id: product.id,
      customer_name: newReview.name, rating: newReview.rating,
      comment: newReview.comment, created_at: new Date().toISOString()
    }]).select();
    if (!error && data) { setReviews([data[0], ...reviews]); setNewReview({ name: '', rating: 5, comment: '' }); }
  };

  const related = allProducts.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);

  const ppStyles = `
    .pp-wrap { width: 100%; max-width: 1100px; margin: 0 auto; padding: 0 5vw 80px; }
    .pp-topbar { display: flex; align-items: center; justify-content: space-between; padding: 14px 0 20px; }
    .pp-back { background: transparent; border: 0; color: #24c9ff; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; }
    .pp-topbar-actions { display: flex; gap: 8px; }
    .pp-icon-btn { width: 36px; height: 36px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); background: #0b1016; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
    .pp-icon-btn:hover { border-color: rgba(36,201,255,0.4); background: rgba(36,201,255,0.08); }
    .pp-icon-btn.wishlisted { background: #19bfff; border-color: #19bfff; }

    .pp-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 28px; }
    @media (max-width: 720px) { .pp-grid { grid-template-columns: 1fr; } }

    /* LEFT: Image column */
    .pp-img-main { background: #090e14; border-radius: 14px; overflow: hidden; position: relative; height: 400px; border: 1px solid rgba(255,255,255,0.07); cursor: zoom-in; }
    .pp-img-main img { width: 100%; height: 100%; object-fit: contain; padding: 24px; transition: transform 0.5s ease; }
    .pp-img-main:hover img { transform: scale(1.05); }
    .pp-img-nav { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.55); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
    .pp-img-nav:hover { background: rgba(36,201,255,0.25); }
    .pp-img-nav-left { left: 10px; }
    .pp-img-nav-right { right: 10px; }
    .pp-stock-badge { position: absolute; top: 12px; left: 12px; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; font-family: 'Space Grotesk', monospace; }
    .pp-badge-low { background: #ee4770; color: white; }
    .pp-badge-out { background: rgba(255,255,255,0.1); color: #8794a6; }
    .pp-thumb-strip { display: flex; gap: 8px; margin-top: 10px; overflow-x: auto; scrollbar-width: none; }
    .pp-thumb-strip::-webkit-scrollbar { display: none; }
    .pp-thumb { width: 60px; height: 60px; flex-shrink: 0; border-radius: 8px; border: 1.5px solid rgba(255,255,255,0.08); background: #090e14; overflow: hidden; cursor: pointer; transition: all 0.2s; }
    .pp-thumb img { width: 100%; height: 100%; object-fit: contain; padding: 6px; }
    .pp-thumb.active { border-color: #24c9ff; box-shadow: 0 0 0 2px rgba(36,201,255,0.2); }
    .pp-thumb:hover { border-color: rgba(36,201,255,0.5); }

    /* RIGHT: Info column */
    .pp-info { display: flex; flex-direction: column; gap: 18px; }
    .pp-cat-tag { font-size: 10px; font-weight: 700; color: #43cfff; font-family: 'Space Grotesk', monospace; text-transform: uppercase; letter-spacing: 1.5px; }
    .pp-name { font-size: 24px; font-weight: 700; color: #f0f6ff; font-family: 'Space Grotesk', sans-serif; line-height: 1.25; }
    .pp-rating-row { display: flex; align-items: center; gap: 8px; }
    .pp-stars { display: flex; gap: 2px; }
    .pp-star { color: #f5a623; font-size: 14px; }
    .pp-review-count { font-size: 12px; color: #586678; }

    .pp-price-box { background: #070b10; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 16px; }
    .pp-price { font-size: 32px; font-weight: 700; color: #24c9ff; font-family: 'Space Grotesk', monospace; }
    .pp-cod-badge { display: inline-flex; align-items: center; gap: 6px; margin-top: 8px; background: rgba(34,197,94,0.12); color: #22c55e; border: 1px solid rgba(34,197,94,0.25); border-radius: 20px; padding: 4px 12px; font-size: 12px; font-weight: 600; }

    .pp-info-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .pp-info-card { background: #070b10; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 10px 12px; }
    .pp-info-card-label { font-size: 10px; color: #586678; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; font-family: 'Space Grotesk', monospace; }
    .pp-info-card-value { font-size: 13px; font-weight: 600; color: #eef4fb; }

    .pp-desc { font-size: 13px; color: #8794a6; line-height: 1.75; }

    .pp-delivery-strip { display: flex; align-items: center; gap: 10px; background: #070b10; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 12px 14px; font-size: 13px; color: #8794a6; }
    .pp-delivery-strip strong { color: #eef4fb; }

    .pp-qty-row { display: flex; align-items: center; gap: 14px; }
    .pp-qty-label { font-size: 13px; color: #8794a6; font-weight: 600; }
    .pp-qty-controls { display: flex; align-items: center; gap: 10px; background: #070b10; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 4px 8px; }
    .pp-qty-btn { background: none; border: none; color: #8794a6; cursor: pointer; font-size: 18px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 6px; transition: all 0.2s; font-weight: 700; }
    .pp-qty-btn:hover:not(:disabled) { background: rgba(255,255,255,0.07); color: #fff; }
    .pp-qty-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    .pp-qty-num { font-size: 15px; font-weight: 700; color: #fff; min-width: 24px; text-align: center; font-family: 'Space Grotesk', monospace; }
    .pp-qty-total { font-size: 13px; color: #586678; }
    .pp-qty-total span { color: #24c9ff; font-weight: 700; }

    .pp-btn-cart { width: 100%; padding: 13px; background: #fff; color: #050608; border: 0; border-radius: 10px; font-weight: 700; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; }
    .pp-btn-cart:hover:not(:disabled) { background: #bdefff; }
    .pp-btn-cart:disabled { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.3); cursor: not-allowed; }
    .pp-btn-wa { width: 100%; padding: 12px; background: rgba(37,211,102,0.12); color: #25d366; border: 1px solid rgba(37,211,102,0.3); border-radius: 10px; font-weight: 700; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; }
    .pp-btn-wa:hover { background: rgba(37,211,102,0.22); }
    .pp-btn-share { width: 100%; padding: 10px; background: transparent; color: #8794a6; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; font-weight: 600; font-size: 13px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s; }
    .pp-btn-share:hover { color: #25d366; border-color: rgba(37,211,102,0.3); }

    /* Reviews */
    .pp-reviews { margin-top: 40px; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.07); }
    .pp-reviews-title { font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 20px; font-family: 'Space Grotesk', sans-serif; }
    .pp-review-card { background: #070b10; border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 14px; margin-bottom: 10px; }
    .pp-review-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
    .pp-review-name { font-size: 13px; font-weight: 700; color: #eef4fb; }
    .pp-review-date { font-size: 11px; color: #586678; }
    .pp-review-comment { font-size: 13px; color: #8794a6; line-height: 1.6; }
    .pp-review-form { background: #070b10; border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 18px; margin-top: 16px; }
    .pp-review-form-title { font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 14px; }
    .pp-star-picker { display: flex; gap: 6px; margin-bottom: 12px; }
    .pp-star-pick { background: none; border: none; font-size: 22px; cursor: pointer; transition: transform 0.1s; color: #586678; }
    .pp-star-pick:hover, .pp-star-pick.selected { color: #f5a623; transform: scale(1.2); }

    /* Related */
    .pp-related { margin-top: 40px; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.07); }
    .pp-related-title { font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 16px; font-family: 'Space Grotesk', sans-serif; }
    .pp-related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
    .pp-related-card { background: #090e14; border: 1px solid rgba(255,255,255,0.075); border-radius: 10px; overflow: hidden; cursor: pointer; transition: all 0.25s; }
    .pp-related-card:hover { border-color: rgba(39,200,255,0.35); transform: translateY(-3px); }
    .pp-related-img { height: 120px; background: #070b10; overflow: hidden; }
    .pp-related-img img { width: 100%; height: 100%; object-fit: contain; padding: 10px; }
    .pp-related-info { padding: 10px; }
    .pp-related-name { font-size: 12px; font-weight: 700; color: #eef4fb; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 3px; }
    .pp-related-price { font-size: 13px; font-weight: 700; color: #24c9ff; font-family: 'Space Grotesk', monospace; }
  `;

  const renderStars = (rating) => {
    return [1,2,3,4,5].map(i => (
      <span key={i} className="pp-star">{i <= Math.round(rating) ? '★' : '☆'}</span>
    ));
  };

  return (
    <div className="lyfelytic-container" style={{ minHeight: '100vh' }}>
      <style>{ppStyles}</style>
      <div className="pp-wrap">
        {/* Top bar */}
        <div className="pp-topbar">
          <button className="pp-back" onClick={onBack}>
            <ArrowLeft size={17} /> Back to Shop
          </button>
          <div className="pp-topbar-actions">
            <button className={`pp-icon-btn ${wishlisted ? 'wishlisted' : ''}`} onClick={handleToggleWishlist} title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
              <Heart size={16} fill={wishlisted ? 'white' : 'none'} color="white" />
            </button>
            <button className="pp-icon-btn" onClick={() => shareProductOnWhatsApp(product)} title="Share on WhatsApp">
              <Share2 size={16} color="white" />
            </button>
          </div>
        </div>

        {/* Main two-column grid */}
        <div className="pp-grid">

          {/* LEFT — Image column */}
          <div>
            <div className="pp-img-main" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
              <img src={images[current] || ''} alt={product.name} />
              {isLowStock && <div className="pp-stock-badge pp-badge-low">🔥 Only {product.stock} left!</div>}
              {isOutOfStock && <div className="pp-stock-badge pp-badge-out">Out of stock</div>}
              {images.length > 1 && (
                <>
                  <button className="pp-img-nav pp-img-nav-left" onClick={() => goTo(current - 1)} disabled={current === 0}>
                    <ChevronLeft size={16} />
                  </button>
                  <button className="pp-img-nav pp-img-nav-right" onClick={() => goTo(current + 1)} disabled={current === images.length - 1}>
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="pp-thumb-strip">
                {images.map((img, i) => (
                  <div key={i} className={`pp-thumb ${i === current ? 'active' : ''}`} onClick={() => goTo(i)}>
                    <img src={img} alt="" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Info column */}
          <div className="pp-info">
            <div>
              {product.category && <div className="pp-cat-tag">{product.category}</div>}
              <h1 className="pp-name" style={{ marginTop: 6 }}>{product.name}</h1>
            </div>

            {/* Rating */}
            {reviews.length > 0 && (
              <div className="pp-rating-row">
                <div className="pp-stars">{renderStars(avgRating)}</div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#eef4fb' }}>{avgRating}</span>
                <span className="pp-review-count">· {reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
              </div>
            )}

            {/* Price + COD */}
            <div className="pp-price-box">
              <div className="pp-price">Rs. {product.price}</div>
              <div className="pp-cod-badge">
                <Check size={13} /> Cash on Delivery
              </div>
            </div>

            {/* Spec cards */}
            <div className="pp-info-cards">
              <div className="pp-info-card">
                <div className="pp-info-card-label">Category</div>
                <div className="pp-info-card-value">{product.category || 'General'}</div>
              </div>
              <div className="pp-info-card">
                <div className="pp-info-card-label">Stock</div>
                <div className="pp-info-card-value" style={{ color: isOutOfStock ? '#ff5e75' : isLowStock ? '#f5a623' : '#22c55e' }}>
                  {isOutOfStock ? 'Out of stock' : isLowStock ? `${product.stock} left` : 'In stock'}
                </div>
              </div>
              <div className="pp-info-card">
                <div className="pp-info-card-label">Delivery</div>
                <div className="pp-info-card-value">3–5 days</div>
              </div>
              <div className="pp-info-card">
                <div className="pp-info-card-label">Payment</div>
                <div className="pp-info-card-value">COD only</div>
              </div>
            </div>

            {/* Description */}
            <p className="pp-desc">{product.description || 'No description provided.'}</p>

            {/* Delivery strip */}
            <div className="pp-delivery-strip">
              <Package size={18} color="#24c9ff" />
              <span>Free delivery · Arrives in <strong>3–5 working days</strong></span>
            </div>

            {/* Qty selector */}
            {!isOutOfStock && (
              <div className="pp-qty-row">
                <span className="pp-qty-label">Qty</span>
                <div className="pp-qty-controls">
                  <button className="pp-qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))} disabled={qty <= 1}>−</button>
                  <span className="pp-qty-num">{qty}</span>
                  <button className="pp-qty-btn" onClick={() => setQty(q => Math.min(product.stock, q + 1))} disabled={qty >= product.stock}>+</button>
                </div>
                {qty > 1 && <span className="pp-qty-total">Total: <span>Rs. {product.price * qty}</span></span>}
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="pp-btn-cart" onClick={handleAddToCart} disabled={isOutOfStock}>
                <ShoppingCart size={16} /> {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button className="pp-btn-wa" onClick={handleWhatsAppOrder}>
                <span style={{ fontSize: 16 }}>📱</span> Order via WhatsApp
              </button>
              <button className="pp-btn-share" onClick={() => shareProductOnWhatsApp(product)}>
                <Share2 size={14} /> Share this product on WhatsApp
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="pp-related">
            <div className="pp-related-title">You might also like</div>
            <div className="pp-related-grid">
              {related.map(p => (
                <div key={p.id} className="pp-related-card" onClick={() => { window.scrollTo({ top: 0, behavior: 'instant' }); onBack(); setTimeout(() => {}, 10); }}>
                  <div className="pp-related-img">
                    <img src={p.images?.[0] || p.image || ''} alt={p.name} />
                  </div>
                  <div className="pp-related-info">
                    <div className="pp-related-name">{p.name}</div>
                    <div className="pp-related-price">Rs. {p.price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="pp-reviews">
          <div className="pp-reviews-title">Customer Reviews {reviews.length > 0 && `(${reviews.length})`}</div>
          {reviews.length === 0 && (
            <p style={{ color: '#586678', fontSize: 13, marginBottom: 16 }}>No reviews yet. Be the first to leave one!</p>
          )}
          {reviews.map(r => (
            <div key={r.id} className="pp-review-card">
              <div className="pp-review-header">
                <div>
                  <div className="pp-review-name">{r.customer_name}</div>
                  <div style={{ display: 'flex', gap: 2, marginTop: 2 }}>{renderStars(r.rating)}</div>
                </div>
                <div className="pp-review-date">{new Date(r.created_at).toLocaleDateString()}</div>
              </div>
              {r.comment && <div className="pp-review-comment">{r.comment}</div>}
            </div>
          ))}

          {/* Review form */}
          <div className="pp-review-form">
            <div className="pp-review-form-title">Leave a Review</div>
            <form onSubmit={handleSubmitReview}>
              <input
                className="form-input" style={{ marginBottom: 10 }}
                placeholder="Your name"
                value={newReview.name}
                onChange={e => setNewReview({ ...newReview, name: e.target.value })}
              />
              <div className="pp-star-picker">
                {[1,2,3,4,5].map(s => (
                  <button
                    key={s} type="button"
                    className={`pp-star-pick ${s <= (hoverStar || newReview.rating) ? 'selected' : ''}`}
                    onMouseEnter={() => setHoverStar(s)}
                    onMouseLeave={() => setHoverStar(0)}
                    onClick={() => setNewReview({ ...newReview, rating: s })}
                  >★</button>
                ))}
              </div>
              <textarea
                className="form-input" style={{ marginBottom: 12, resize: 'vertical', minHeight: 70 }}
                placeholder="Share your experience (optional)"
                value={newReview.comment}
                onChange={e => setNewReview({ ...newReview, comment: e.target.value })}
              />
              <button type="submit" className="submit-btn">Submit Review</button>
            </form>
          </div>
        </div>
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

  // FEATURE 28: Rate limit toast state
  const [rateLimitMsg, setRateLimitMsg] = useState('');
  const [cooldownSecs, setCooldownSecs] = useState(0);

  const productsSectionRef = useRef(null);

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
  const [view, setView] = useState('shop');
  const [adminTab, setAdminTab] = useState('products');

  const [resetMode, setResetMode] = useState('manual');
  const [resetAt, setResetAt] = useState(null);
  const [resetLoading, setResetLoading] = useState(false);
  const [dashboardNow, setDashboardNow] = useState(Date.now());

  const [showCheckout, setShowCheckout] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [categories, setCategories] = useState(CATEGORIES.filter(c => c !== 'All'));
  const [newCategoryName, setNewCategoryName] = useState('');
  const [savingCategory, setSavingCategory] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', stock: '', category: 'General', images: [] });
  const [checkoutForm, setCheckoutForm] = useState({ name: '', phone: '', email: '', address: '', city: '' });

  // FEATURE 28: Countdown ticker for rate limit
  useEffect(() => {
    if (cooldownSecs <= 0) return;
    const timer = setInterval(() => {
      const remaining = getRemainingCooldown();
      setCooldownSecs(remaining);
      if (remaining <= 0) { setRateLimitMsg(''); clearInterval(timer); }
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSecs]);

  useEffect(() => {
    const move = (e) => {
      const root = document.documentElement;
      root.style.setProperty('--mouse-x', `${e.clientX}px`);
      root.style.setProperty('--mouse-y', `${e.clientY}px`);
      root.style.setProperty('--mx', `${e.clientX}px`);
      root.style.setProperty('--my', `${e.clientY}px`);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (data) setProducts(data);
    setLoading(false);
  };

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) setOrders(data);
  };

  const fetchResetSettings = async () => {
    const { data, error } = await supabase.from('dashboard_settings').select('reset_mode, reset_at').eq('id', 1).single();
    if (!error && data) { setResetMode(data.reset_mode || 'manual'); setResetAt(data.reset_at || null); }
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true });
    if (!error && data && data.length > 0) setCategories(data.map(c => c.name));
  };

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);
  useEffect(() => { if (isAdmin) { fetchOrders(); fetchResetSettings(); } }, [isAdmin]);
  useEffect(() => { if (!isAdmin) return; const timer = setInterval(() => setDashboardNow(Date.now()), 60000); return () => clearInterval(timer); }, [isAdmin]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const name = newCategoryName.trim();
    if (!name) return;
    if (categories.some(c => c.toLowerCase() === name.toLowerCase())) { alert('That category already exists'); return; }
    setSavingCategory(true);
    const { error } = await supabase.from('categories').insert([{ name }]);
    setSavingCategory(false);
    if (error) { alert('Failed to add category.'); return; }
    setCategories(prev => [...prev, name].sort((a, b) => a.localeCompare(b)));
    setNewCategoryName('');
  };

  const handleDeleteCategory = async (name) => {
    const inUse = products.some(p => p.category?.toLowerCase() === name.toLowerCase());
    if (inUse && !confirm(`"${name}" is used by products. Delete anyway?`)) return;
    if (!inUse && !confirm(`Delete category "${name}"?`)) return;
    const { error } = await supabase.from('categories').delete().eq('name', name);
    if (error) { alert('Failed to delete category'); return; }
    setCategories(prev => prev.filter(c => c.toLowerCase() !== name.toLowerCase()));
  };

  const selectCategoryAndScroll = (cat) => {
    setSelectedCategory(cat);
    setSearchQuery('');
    setTimeout(() => { if (productsSectionRef.current) productsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
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

  const filteredProducts = products.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'All' || p.category?.toLowerCase() === selectedCategory.toLowerCase();
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

  // FEATURE 28: Rate-limited order placement
  const handlePlaceOrder = async () => {
    const { name, phone, address, city } = checkoutForm;
    if (!name || !phone || !address || !city) { alert('Please fill all required fields'); return; }

    // Check rate limit
    if (!canPlaceOrder()) {
      const secs = getRemainingCooldown();
      setCooldownSecs(secs);
      setRateLimitMsg(`⏳ Please wait ${secs}s before placing another order.`);
      return;
    }

    const items = cart.map(i => ({ id: i.id, name: i.name, price: i.price }));
    const { error } = await supabase.from('orders').insert([{
      id: Date.now(), customer_name: name, customer_phone: phone,
      customer_email: checkoutForm.email, customer_address: address,
      customer_city: city, items, total_price: totalPrice,
      status: 'Pending', created_at: new Date().toISOString()
    }]);
    if (error) { alert('Failed to place order.'); return; }

    // Mark the order timestamp for rate limiting
    markOrderPlaced();

    const itemsList = cart.map(i => `• ${i.name} – Rs.${i.price}`).join('\n');
    const msg = `🛍️ New Order!\n\nCustomer: ${name}\nPhone: ${phone}\nCity: ${city}\nAddress: ${address}\n\nItems:\n${itemsList}\n\n*Total: Rs.${totalPrice}*`;
    window.open(`https://wa.me/923442035118?text=${encodeURIComponent(msg)}`, '_blank');
    setCart([]); setShowCheckout(false);
    setCheckoutForm({ name: '', phone: '', email: '', address: '', city: '' });
    alert('✅ Order placed successfully!');
  };

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

  const handleResetDashboard = async () => {
    if (!confirm('Reset dashboard statistics now?')) return;
    setResetLoading(true);
    const now = new Date().toISOString();
    const { error } = await supabase.from('dashboard_settings').update({ reset_at: now, updated_at: now }).eq('id', 1);
    if (!error) { setResetAt(now); setDashboardNow(Date.now()); alert('Dashboard reset successfully!'); }
    setResetLoading(false);
  };

  const handleResetModeChange = async (mode) => {
    const now = new Date().toISOString();
    setResetMode(mode);
    const { error } = await supabase.from('dashboard_settings').update({ reset_mode: mode, reset_at: now, updated_at: now }).eq('id', 1);
    if (error) { setResetMode(resetMode); return; }
    setResetAt(now);
    setDashboardNow(Date.now());
  };

  const dashboardPeriodStart = (() => {
    const now = new Date(dashboardNow);
    if (resetMode === 'daily') return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (resetMode === 'monthly') return new Date(now.getFullYear(), now.getMonth(), 1);
    return resetAt ? new Date(resetAt) : new Date(0);
  })();

  const periodOrders = orders.filter(o => o.created_at && new Date(o.created_at) >= dashboardPeriodStart);
  const totalRevenue = periodOrders.filter(o => o.status === 'Delivered').reduce((s, o) => s + (Number(o.total_price) || 0), 0);
  const pendingOrders = periodOrders.filter(o => o.status === 'Pending').length;
  const bestSelling = products.map(p => ({ ...p, orderCount: periodOrders.filter(o => o.items?.some(i => i.id === p.id)).length })).sort((a, b) => b.orderCount - a.orderCount).slice(0, 5);

  // FEATURE 24: Generate order number from index
  const getOrderNumber = (index) => `#${String(orders.length - index).padStart(3, '0')}`;

  const handleAdminClick = () => {
    const pw = prompt('Admin password:');
    if (pw === 'lyfelytic2024') { setIsAdmin(true); setMobileMenuOpen(false); }
    else if (pw !== null) alert('Wrong password!');
  };

  if (selectedProduct) {
    return (
      <>
        <style>{styles}</style>
        {/* Sticky header stays visible on product page */}
        <header className="lyfelytic-header">
          <div className="header-content">
            <div className="brand"><Package size={22} /><h1>Lyfelytic</h1></div>
            <div className="nav-buttons">
              <button onClick={() => setSelectedProduct(null)} className="nav-btn nav-btn-shop"><Home size={15} /> Shop</button>
              <button className="nav-btn nav-btn-cart" onClick={() => cart.length && setShowCheckout(true)}>
                <ShoppingCart size={15} /> Cart {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
              </button>
            </div>
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
          <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
            <button onClick={() => { setSelectedProduct(null); setMobileMenuOpen(false); }} className="mobile-menu-btn-item"><Home size={16} /> Shop</button>
            <button onClick={() => { cart.length && setShowCheckout(true); setMobileMenuOpen(false); }} className="mobile-menu-btn-item"><ShoppingCart size={16} /> Cart ({cart.length})</button>
          </div>
        </header>
        <ProductPage product={selectedProduct} onBack={() => setSelectedProduct(null)} onAddToCart={addToCart} allProducts={products} />
        {showCheckout && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={e => e.target === e.currentTarget && setShowCheckout(false)}>
            <div style={{ background: '#0a0f16', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: 24, width: '100%', maxWidth: 440, maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><ClipboardList size={20} /> Complete Order</div>
              <div style={{ background: '#070b10', padding: 14, borderRadius: 8, marginBottom: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
                {cart.map((item, i) => (<div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#8794a6', padding: '4px 0' }}><span>{item.name}</span><span>Rs. {item.price}</span></div>))}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, color: '#24c9ff', marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.08)' }}><span>Total</span><span>Rs. {totalPrice}</span></div>
              </div>
              <input className="form-input" style={{ marginBottom: 10 }} placeholder="Full Name *" value={checkoutForm.name} onChange={e => setCheckoutForm({ ...checkoutForm, name: e.target.value })} />
              <input className="form-input" style={{ marginBottom: 10 }} placeholder="Phone Number *" value={checkoutForm.phone} onChange={e => setCheckoutForm({ ...checkoutForm, phone: e.target.value })} />
              <input className="form-input" style={{ marginBottom: 10 }} placeholder="City *" value={checkoutForm.city} onChange={e => setCheckoutForm({ ...checkoutForm, city: e.target.value })} />
              <input className="form-input" style={{ marginBottom: 16 }} placeholder="Delivery Address *" value={checkoutForm.address} onChange={e => setCheckoutForm({ ...checkoutForm, address: e.target.value })} />
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setShowCheckout(false)} style={{ flex: 1, padding: 10, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#8794a6', borderRadius: 8, cursor: 'pointer' }}>Cancel</button>
                <button onClick={handlePlaceOrder} style={{ flex: 1.5, padding: 10, background: '#24c9ff', border: 0, color: '#050608', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Confirm Order</button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="lyfelytic-container">
      <style>{styles}</style>

      {/* FEATURE 28: Rate Limit Toast */}
      {rateLimitMsg && (
        <div className="rate-limit-toast">
          ⏳ Please wait {cooldownSecs}s before placing another order.
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={e => e.target === e.currentTarget && setShowCheckout(false)}>
          <div style={{ background: '#0a0f16', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: 24, width: '100%', maxWidth: 440, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><ClipboardList size={20} /> Complete Order</div>
            <div style={{ background: '#070b10', padding: 14, borderRadius: 8, marginBottom: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
              {cart.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#8794a6', padding: '4px 0' }}>
                  <span>{item.name}</span><span>Rs. {item.price}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, color: '#24c9ff', marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <span>Total</span><span>Rs. {totalPrice}</span>
              </div>
            </div>
            <input className="form-input" style={{ marginBottom: 10 }} placeholder="Full Name *" value={checkoutForm.name} onChange={e => setCheckoutForm({ ...checkoutForm, name: e.target.value })} />
            <input className="form-input" style={{ marginBottom: 10 }} placeholder="Phone Number *" value={checkoutForm.phone} onChange={e => setCheckoutForm({ ...checkoutForm, phone: e.target.value })} />
            <input className="form-input" style={{ marginBottom: 10 }} placeholder="City *" value={checkoutForm.city} onChange={e => setCheckoutForm({ ...checkoutForm, city: e.target.value })} />
            <input className="form-input" style={{ marginBottom: 16 }} placeholder="Delivery Address *" value={checkoutForm.address} onChange={e => setCheckoutForm({ ...checkoutForm, address: e.target.value })} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowCheckout(false)} style={{ flex: 1, padding: 10, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#8794a6', borderRadius: 8, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handlePlaceOrder} style={{ flex: 1.5, padding: 10, background: '#24c9ff', border: 0, color: '#050608', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Confirm Order</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} onClick={e => e.target === e.currentTarget && setEditingProduct(null)}>
          <div style={{ background: '#0a0f16', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: 24, width: '100%', maxWidth: 440, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 16 }}><Edit2 size={18} /> Edit Product</div>
            <input className="form-input" style={{ marginBottom: 10 }} placeholder="Name" value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} />
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <input className="form-input" type="number" placeholder="Price" value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value })} />
              <input className="form-input" type="number" placeholder="Stock" value={editingProduct.stock} onChange={e => setEditingProduct({ ...editingProduct, stock: e.target.value })} />
            </div>
            <select className="form-input" style={{ marginBottom: 10 }} value={editingProduct.category} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            <textarea className="form-input" style={{ marginBottom: 14, resize: 'vertical', minHeight: 70 }} placeholder="Description" value={editingProduct.description} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setEditingProduct(null)} style={{ flex: 1, padding: 10, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#8794a6', borderRadius: 8, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSaveEdit} style={{ flex: 1.5, padding: 10, background: '#24c9ff', border: 0, color: '#050608', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="lyfelytic-header">
        <div className="header-content">
          <div className="brand"><Package size={22} /><h1>Lyfelytic</h1></div>
          <div className="nav-buttons">
            {!isAdmin && (
              <>
                <button onClick={() => { setView('shop'); setIsAdmin(false); }} className="nav-btn nav-btn-shop"><Home size={15} /> Shop</button>
                <button onClick={() => setView('wishlist')} className="nav-btn">
                  <Heart size={15} fill={wishlist.length ? 'white' : 'none'} color={wishlist.length ? 'white' : 'var(--ink-soft)'} /> {wishlist.length > 0 && wishlist.length}
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
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
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

      {!isAdmin && view === 'shop' && <ScrollProductStage />}

      {/* Hero Section */}
      {!isAdmin && view === 'shop' && (
        <section className="hero hero-cinematic">
          <div className="hero-grid-lines"></div>
          <div className="hero-cinematic-inner">
            <div className="hero-copy">
              <span className="hero-eyebrow">CASH ON DELIVERY · FREE SHIPPING</span>
              <h1 className="hero-title">Everything you need,<br /><span className="hero-accent">every single day.</span></h1>
              <p className="hero-sub">Shop daily life accessories — from beauty to home essentials — delivered right to your door. No card needed, pay on arrival.</p>
              <div className="hero-actions">
                <button className="hero-primary-btn" onClick={() => selectCategoryAndScroll('All')}>Shop Now <ChevronRight size={17} /></button>
                <span className="hero-trust"><span className="hero-trust-dot"></span> Premium products · Fast delivery</span>
              </div>
            </div>
            <div className="hero-reference-stage">
              <div className="hero-stage-glow"></div>
              <div className="hero-stage-orbit hero-stage-orbit-one"></div>
              <div className="hero-stage-orbit hero-stage-orbit-two"></div>
              {products.length > 0 ? (
                <div className="hero-product-collage">
                  {products.slice(0, 3).map((product, i) => (
                    <button key={product.id} className={`hero-collage-product hero-collage-${i + 1}`} onClick={() => openProduct(product)}>
                      <img src={getThumb(product)} alt={product.name} />
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ color: '#36caff' }}><Package size={60} /></div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Shop by Category */}
      {!isAdmin && view === 'shop' && (
        <section className="category-showcase">
          <div className="category-showcase-head">
            <div><span className="section-kicker">CURATED FOR YOU</span><h2>Shop by Category</h2></div>
            <p>Explore the collection by the way you live.</p>
          </div>
          <div className="category-showcase-grid">
            {categories.slice(0, 4).map((cat, index) => {
              const categoryProduct = products.find(p => p.category?.toLowerCase() === cat.toLowerCase());
              return (
                <button key={cat} className="category-showcase-card" onClick={() => selectCategoryAndScroll(cat)}>
                  {categoryProduct && <img src={getThumb(categoryProduct)} alt="" />}
                  <span className="category-card-overlay"></span>
                  <span className="category-card-content"><small>0{index + 1}</small><strong>{cat}</strong><em>Explore <ChevronRight size={14} /></em></span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Search & Filter */}
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
              {['All', ...categories].map(cat => (
                <button key={cat} className={`chip ${selectedCategory.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`} onClick={() => selectCategoryAndScroll(cat)}>{cat}</button>
              ))}
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
        {/* Wishlist View */}
        {!isAdmin && view === 'wishlist' && (
          <div>
            <div className="section-title">
              <h2>Your Wishlist</h2>
              <p>{wishlistProducts.length} saved item{wishlistProducts.length !== 1 ? 's' : ''}</p>
            </div>
            {wishlistProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#586678' }}>
                <Heart size={48} />
                <h3 style={{ margin: '16px 0 8px', color: '#fff' }}>Your wishlist is empty</h3>
                <button className="submit-btn" onClick={() => setView('shop')}>Browse Products</button>
              </div>
            ) : (
              <div className="products-grid">
                {wishlistProducts.map((product, i) => (
                  <Reveal key={product.id} delay={(i % 6) * 60}>
                    <div className="product-card">
                      <div className="product-image" onClick={() => openProduct(product)}>
                        <img src={getThumb(product)} alt={product.name} />
                        <button className="wishlist-btn active" onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }}><Heart size={16} fill="white" color="white" /></button>
                      </div>
                      <div className="product-info">
                        <div className="product-name">{product.name}</div>
                        <div className="product-price">Rs.{product.price}</div>
                        {/* FEATURE 33: WhatsApp Share on Wishlist Card */}
                        <button className="whatsapp-share-btn" onClick={e => { e.stopPropagation(); shareProductOnWhatsApp(product); }}>
                          <Share2 size={13} /> Share on WhatsApp
                        </button>
                        <button className="add-to-cart-btn" onClick={() => addToCart(product)} disabled={product.stock === 0}><ShoppingCart size={14} /> Add to Cart</button>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Shop View */}
        {!isAdmin && view === 'shop' && (
          <div>
            <div ref={productsSectionRef} className="section-title products-section-title" style={{ scrollMarginTop: '90px' }}>
              <div>
                <span className="section-kicker">THE COLLECTION</span>
                <h2>{selectedCategory === 'All' ? 'Featured essentials' : `${selectedCategory} Collection`}</h2>
              </div>
              <p>{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} available</p>
            </div>
            <div className="products-container">
              <div>
                {loading && <p style={{ textAlign: 'center', padding: 20, color: '#8794a6' }}>Loading products...</p>}
                {!loading && filteredProducts.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <p style={{ color: '#8794a6', marginBottom: 12 }}>No products found in "{selectedCategory}".</p>
                    <button className="submit-btn" onClick={() => selectCategoryAndScroll('All')}>View All Products</button>
                  </div>
                )}
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
                          {/* FEATURE 33: WhatsApp Share on Product Card */}
                          <button className="whatsapp-share-btn" onClick={e => { e.stopPropagation(); shareProductOnWhatsApp(product); }}>
                            <Share2 size={13} /> Share on WhatsApp
                          </button>
                          <button className="add-to-cart-btn" onClick={() => addToCart(product)} disabled={product.stock === 0}><ShoppingCart size={14} /> Add to Cart</button>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin View */}
        {isAdmin && (
          <div className="admin-panel">
            <div className="admin-title"><Package size={20} /> Admin Dashboard</div>
            <div className="admin-tabs">
              <button className={`admin-tab ${adminTab === 'products' ? 'active' : ''}`} onClick={() => setAdminTab('products')}><Package size={14} /> Products</button>
              <button className={`admin-tab ${adminTab === 'orders' ? 'active' : ''}`} onClick={() => setAdminTab('orders')}><ClipboardList size={14} /> Orders {pendingOrders > 0 && <span style={{ background: '#24bfff', color: '#050608', borderRadius: 20, padding: '1px 6px', fontSize: 10 }}>{pendingOrders}</span>}</button>
              <button className={`admin-tab ${adminTab === 'dashboard' ? 'active' : ''}`} onClick={() => setAdminTab('dashboard')}><BarChart2 size={14} /> Analytics</button>
              <button className={`admin-tab ${adminTab === 'categories' ? 'active' : ''}`} onClick={() => setAdminTab('categories')}><Filter size={14} /> Categories</button>
            </div>

            {adminTab === 'products' && (
              <>
                <div className="add-product-form">
                  <div className="form-title"><Plus size={15} /> Add New Product</div>
                  <form onSubmit={handleAddProduct}>
                    <div className="form-grid">
                      <input type="text" placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="form-input" required />
                      <input type="number" placeholder="Price (Rs.)" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} className="form-input" required />
                      <input type="number" placeholder="Stock" value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} className="form-input" required />
                      <select className="form-input" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}>
                        {categories.map(c => <option key={c}>{c}</option>)}
                      </select>
                      <textarea placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} className="form-input form-full" />
                    </div>
                    <label className="image-upload-area" style={{ marginBottom: 12 }}>
                      <input type="file" accept="image/*" multiple onChange={handleImagesUpload} disabled={newProduct.images.length >= 8} />
                      <div className="upload-text"><Upload size={16} />{newProduct.images.length === 0 ? 'Upload images (select multiple)' : `Add more (${newProduct.images.length}/8)`}</div>
                      <div className="upload-hint">First image = main photo · Max 8</div>
                    </label>
                    {newProduct.images?.length > 0 && (
                      <div className="image-preview" style={{ marginBottom: 12 }}>
                        {newProduct.images.map((img, idx) => (
                          <div key={idx} className="preview-item">
                            <img src={img} alt="" />
                            <button type="button" className="remove-image-btn" onClick={() => setNewProduct(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}>✕</button>
                          </div>
                        ))}
                      </div>
                    )}
                    <button type="submit" className="submit-btn" disabled={uploading}>{uploading ? 'Saving...' : 'Add Product'}</button>
                  </form>
                </div>
                <div className="products-management-grid">
                  {products.map(product => (
                    <div key={product.id} className="product-management-card">
                      <div className="product-management-image"><img src={getThumb(product)} alt={product.name} /></div>
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</div>
                      <div style={{ color: '#24c9ff', fontWeight: 700, margin: '2px 0', fontSize: 13 }}>Rs.{product.price}</div>
                      <div style={{ fontSize: 11, color: '#586678' }}>Stock: {product.stock} · {product.category}</div>
                      <div className="admin-card-actions">
                        <button className="edit-btn" onClick={() => setEditingProduct({ ...product, images: product.images || [product.image] })}><Edit2 size={12} /> Edit</button>
                        <button className="delete-btn" onClick={() => handleDeleteProduct(product.id)}><Trash2 size={12} /> Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {adminTab === 'orders' && (
              <div className="orders-section">
                {/* FEATURE 24: Order count header */}
                <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Customer Orders ({orders.length})</span>
                  <span style={{ fontSize: 11, color: '#586678' }}>{pendingOrders} pending</span>
                </div>

                {/* Desktop Table — FEATURE 24: Added Order # column */}
                <div className="orders-desktop-container">
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>City</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, index) => (
                        <tr key={order.id}>
                          {/* FEATURE 24: Order number badge */}
                          <td><span className="order-number-badge">{getOrderNumber(index)}</span></td>
                          <td>
                            <div style={{ color: '#fff', fontWeight: 600 }}>{order.customer_name}</div>
                            <div style={{ fontSize: 11, color: '#586678' }}>{order.customer_phone}</div>
                          </td>
                          <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {order.items?.map(i => i.name).join(', ')}
                          </td>
                          <td style={{ color: '#24c9ff', fontWeight: 700, fontFamily: "'Space Grotesk', monospace" }}>Rs.{order.total_price}</td>
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
                </div>

                {/* Mobile Cards — FEATURE 24: Added order number */}
                <div className="orders-mobile-list">
                  {orders.map((order, index) => (
                    <div key={order.id} className="order-mobile-card">
                      <div className="order-card-header">
                        <div>
                          {/* FEATURE 24: Order number on mobile */}
                          <span className="order-number-badge" style={{ marginBottom: 4, display: 'inline-block' }}>{getOrderNumber(index)}</span>
                          <div className="order-card-title" style={{ marginTop: 4 }}>{order.customer_name}</div>
                          <div style={{ fontSize: 11, color: '#586678' }}>{order.customer_phone} · {order.customer_city}</div>
                        </div>
                        <div className="order-card-price">Rs.{order.total_price}</div>
                      </div>
                      <div className="order-card-details">
                        <strong style={{ color: '#dce0e8' }}>Items:</strong> {order.items?.map(i => i.name).join(', ')}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4, paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <span style={{ fontSize: 11, color: '#586678' }}>{new Date(order.created_at).toLocaleDateString()}</span>
                        <select className={`order-status-select ${getStatusClass(order.status)}`} value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value)}>
                          <option>Pending</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>

                {orders.length === 0 && <div style={{ textAlign: 'center', padding: 24, color: '#586678', fontSize: 13 }}>No orders recorded yet.</div>}
              </div>
            )}

            {adminTab === 'dashboard' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>Dashboard Reset Settings</div>
                    <div style={{ color: '#586678', fontSize: 11 }}>{resetMode === 'daily' ? 'Stats reset daily' : resetMode === 'monthly' ? 'Stats reset monthly' : `Stats since ${resetAt ? new Date(resetAt).toLocaleString() : 'beginning'}`}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <select className="filter-select" style={{ fontSize: 11 }} value={resetMode} onChange={(e) => handleResetModeChange(e.target.value)}>
                      <option value="manual">Manual Reset</option>
                      <option value="daily">Reset Daily</option>
                      <option value="monthly">Reset Monthly</option>
                    </select>
                    <button className="submit-btn" style={{ padding: '6px 12px', fontSize: 11 }} onClick={handleResetDashboard} disabled={resetLoading}>{resetLoading ? 'Resetting...' : 'Reset Now'}</button>
                  </div>
                </div>
                <div className="dashboard-grid">
                  <div className="stat-card"><div className="stat-label">Total Orders</div><div className="stat-value">{periodOrders.length}</div></div>
                  <div className="stat-card"><div className="stat-label">Revenue</div><div className="stat-value" style={{ color: '#24c9ff' }}>Rs.{totalRevenue.toLocaleString()}</div></div>
                  <div className="stat-card"><div className="stat-label">Pending</div><div className="stat-value" style={{ color: '#ff6b4a' }}>{pendingOrders}</div></div>
                  <div className="stat-card"><div className="stat-label">Products</div><div className="stat-value" style={{ color: '#22c55e' }}>{products.length}</div></div>
                </div>
              </div>
            )}

            {adminTab === 'categories' && (
              <div>
                <div className="add-product-form">
                  <div className="form-title"><Plus size={15} /> Add Category</div>
                  <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <input type="text" placeholder="Category name" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="form-input" style={{ flex: 1, minWidth: 160 }} />
                    <button type="submit" className="submit-btn" disabled={savingCategory}>{savingCategory ? 'Saving...' : 'Add'}</button>
                  </form>
                </div>
                <div className="products-management-grid">
                  {categories.map(cat => (
                    <div key={cat} className="product-management-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>{cat}</div>
                        <div style={{ fontSize: 11, color: '#586678' }}>{products.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length} products</div>
                      </div>
                      <button className="delete-btn" style={{ flex: 'none', padding: '6px 10px' }} onClick={() => handleDeleteCategory(cat)}><Trash2 size={12} /></button>
                    </div>
                  ))}
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
        <p style={{ marginTop: 10, color: '#586678' }}>© 2026 Lyfelytic. All rights reserved.</p>
      </footer>
    </div>
  );
}
