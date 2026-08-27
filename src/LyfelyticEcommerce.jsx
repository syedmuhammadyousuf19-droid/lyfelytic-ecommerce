import { useLayoutEffect } from 'react';
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  ShoppingCart, LogOut, Plus, Trash2, Menu, X, Package, Home,
  Upload, ArrowLeft, ChevronLeft, ChevronRight, Star, Heart,
  Search, Filter, Edit2, Check, BarChart2, ClipboardList, Bell
} from 'lucide-react';
import { supabase } from './supabaseClient';

const CATEGORIES = ['All', 'General', 'Kitchen', 'Bedroom', 'Bathroom', 'Office', 'Outdoor', 'Electronics', 'Fashion', 'Kids'];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,800&family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body, #root { height: 100%; }
  body { font-family: 'Manrope', sans-serif; }
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
  html { scroll-behavior: smooth; background: #050608; }
  body { background: #050608; color: var(--ink); overflow-x: hidden; }
  button, input, select, textarea { font-family: 'Manrope', sans-serif; }
  .lyfelytic-container { min-height: 100vh; background: #050608; position: relative; isolation: isolate; }
  .lyfelytic-container::after {
    content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 999;
    background: radial-gradient(320px circle at var(--mx) var(--my), rgba(25,191,255,0.075), transparent 70%);
    mix-blend-mode: screen; opacity: .8;
  }
  .lyfelytic-header {
    background: rgba(4,6,9,.78); border-bottom: 1px solid rgba(255,255,255,.075);
    backdrop-filter: blur(22px); padding: 16px 28px; position: sticky; top: 0; z-index: 200;
  }
  .header-content { max-width: 1400px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; position: relative; min-height: 38px; }
  .brand { position: absolute; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 12px; pointer-events: none; }
  .brand svg { display: none; }
  .brand h1 {
    font-family: 'Space Grotesk', sans-serif; font-size: 24px; letter-spacing: .12em; text-transform: uppercase;
    background: linear-gradient(180deg,#fff,#8bdfff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .brand p { display: none !important; }
  .nav-buttons { margin-left: auto; display: none; gap: 6px; align-items: center; }
  @media (min-width: 900px) { .nav-buttons { display: flex; } }
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
  .mobile-menu-btn { background: none; border: none; color: #fff; cursor: pointer; display: flex; align-items: center; }
  @media (min-width: 900px) { .mobile-menu-btn { display: none; } }
  .mobile-menu {
    display: none; position: absolute; top: 65px; left: 0; right: 0;
    background: rgba(5,7,11,.96); backdrop-filter: blur(20px); flex-direction: column; gap: 8px;
    padding: 12px; border-bottom: 1px solid rgba(255,255,255,.08);
  }
  .mobile-menu.open { display: flex; }
  @media (min-width: 900px) { .mobile-menu { display: none !important; } }
  .mobile-menu-btn-item {
    padding: 12px; background: rgba(255,255,255,.045); border: 1px solid rgba(255,255,255,.09);
    color: #dce5f0; border-radius: 14px; cursor: pointer; font-weight: 600; display: flex; align-items: center; gap: 8px;
  }

  /* Hero */
  .hero-cinematic {
    min-height: 690px; padding: 78px 5vw 62px;
    background: radial-gradient(650px 520px at 76% 50%, rgba(0,150,255,.22), transparent 64%),
                radial-gradient(430px 300px at 18% 25%, rgba(0,78,150,.12), transparent 70%),
                linear-gradient(180deg,#06080c,#050608);
    position: relative; overflow: hidden; display: flex; align-items: center;
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
  .hero-title { font-family: 'Space Grotesk', sans-serif; font-size: clamp(48px,6.2vw,88px); line-height: .98; letter-spacing: -.055em; color: #f8fbff; margin: 18px 0 24px; text-wrap: balance; }
  .hero-accent { color: transparent; background: linear-gradient(100deg,#fff,#67dcff 45%,#278fff); -webkit-background-clip: text; background-clip: text; }
  .hero-sub { color: #8c9aac; max-width: 510px; font-size: 15px; line-height: 1.75; margin: 0 0 30px; }
  .hero-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 18px; }
  .hero-primary-btn { display: inline-flex; align-items: center; gap: 8px; border-radius: 999px; padding: 13px 22px; color: #050608; font-weight: 800; background: #fff; cursor: pointer; border: 0; box-shadow: 0 12px 38px rgba(255,255,255,.10); transition: .3s ease; }
  .hero-primary-btn:hover { background: #dff7ff; box-shadow: 0 16px 46px rgba(28,192,255,.22); transform: translateY(-2px); }
  .hero-trust { color: #6e7c8e; font-size: 12px; display: inline-flex; align-items: center; gap: 8px; }
  .hero-trust-dot, .hero-live-dot { width: 7px; height: 7px; border-radius: 50%; background: #2bceff; box-shadow: 0 0 14px #2bceff; display: inline-block; }
  .hero-reference-stage { min-height: 530px; position: relative; display: flex; align-items: center; justify-content: center; isolation: isolate; }
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
  .hero-scroll-hint { position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); color: #617085; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; display: flex; align-items: center; gap: 8px; z-index: 2; }
  .hero-scroll-hint span { width: 28px; height: 1px; background: linear-gradient(90deg,transparent,#38cfff); }

  /* Category showcase */
  .category-showcase { max-width: 1400px; margin: 0 auto; padding: 82px 5vw 70px; background: #050608; }
  .category-showcase-head { display: block; text-align: center; margin-bottom: 32px; }
  .section-kicker { color: #53d5ff; font-size: 10px; font-weight: 800; letter-spacing: 2.2px; text-transform: uppercase; }
  .category-showcase-head h2, .section-title h2 { font-family: 'Space Grotesk', sans-serif; color: #f3f7fc; font-size: clamp(30px,4vw,48px); letter-spacing: -.04em; margin-top: 7px; }
  .category-showcase-head p { margin: 10px auto 0; color: #69778a; max-width: 340px; font-size: 13px; line-height: 1.6; }
  .category-showcase-grid { display: grid; grid-template-columns: repeat(4,1fr); grid-auto-rows: 330px; gap: 10px; }
  .category-showcase-card { position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,.08); border-radius: 2px; background: #0a0f15; cursor: pointer; text-align: left; min-width: 0; }
  .category-showcase-card img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: .58; transform: scale(1.02); transition: transform .8s cubic-bezier(.2,.8,.2,1), filter .6s; filter: brightness(.68) saturate(1.15); }
  .category-showcase-card:hover img { transform: scale(1.12); filter: brightness(.9) saturate(1.25); }
  .category-card-overlay { position: absolute; inset: 0; background: linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.82)); }
  .category-card-content { position: absolute; left: 22px; right: 22px; bottom: 20px; display: grid; grid-template-columns: 1fr auto; align-items: end; z-index: 2; }
  .category-card-content small { grid-column: 1/-1; color: #48d4ff; font-size: 9px; letter-spacing: 2px; margin-bottom: 6px; }
  .category-card-content strong { color: #fff; font-family: 'Space Grotesk', sans-serif; font-size: 24px; letter-spacing: -.03em; }
  .category-card-content em { display: flex; align-items: center; gap: 3px; color: #a9b7c7; font-style: normal; font-size: 10px; opacity: 0; transform: translateX(-5px); transition: .3s; }
  .category-showcase-card:hover .category-card-content em { opacity: 1; transform: translateX(0); }

  /* Search + Filters */
  .search-bar-wrapper { max-width: 1400px; margin: 0 auto; padding: 0 5vw 10px; background: #050608; }
  .search-bar { display: flex; align-items: center; gap: 10px; background: #090d12; border: 1px solid rgba(255,255,255,.08); border-radius: 999px; padding: 12px 18px; }
  .search-bar:focus-within { border-color: rgba(35,199,255,.45); box-shadow: 0 0 0 3px rgba(35,199,255,.07), 0 0 35px rgba(35,199,255,.06); }
  .search-bar input { flex: 1; background: none; border: none; outline: none; color: #eaf4ff; font-size: 14px; }
  .search-bar input::placeholder { color: #5d6b7f; }
  .filter-bar { max-width: 1400px; margin: 0 auto; padding: 10px 5vw 20px; background: #050608; display: flex; gap: 12px; flex-wrap: wrap; align-items: center; justify-content: space-between; }
  .category-chips { display: flex; gap: 7px; flex-wrap: wrap; flex: 1; overflow-x: auto; scrollbar-width: none; }
  .category-chips::-webkit-scrollbar { display: none; }
  .chip { padding: 8px 16px; border-radius: 999px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: 1px solid rgba(255,255,255,.08); background: transparent; color: #718095; white-space: nowrap; flex-shrink: 0; }
  .chip.active, .chip:hover { color: #fff; background: rgba(36,201,255,.09); border-color: rgba(36,201,255,.35); }
  .filter-selects { display: flex; gap: 10px; flex-wrap: wrap; }
  .filter-select { padding: 8px 14px; border-radius: 999px; font-size: 12px; font-weight: 600; background: #090d12; border: 1px solid rgba(255,255,255,.08); color: #aeb9c8; cursor: pointer; outline: none; }

  /* Product Catalog */
  .main-content { max-width: 1400px; margin: 0 auto; padding: 50px 28px 90px; background: #050608; }
  .section-title { text-align: center; margin-bottom: 24px; }
  .products-section-title { display: flex; justify-content: space-between; align-items: end; padding-top: 70px; text-align: left; }
  .products-section-title p { color: #69778a; }
  .products-container { display: grid; grid-template-columns: 1fr; gap: 18px; }
  .products-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .product-card { background: #090e14; border: 1px solid rgba(255,255,255,.075); border-radius: 3px; overflow: hidden; transition: all 0.3s ease; cursor: pointer; position: relative; }
  .product-card:hover { border-color: rgba(39,200,255,.35); transform: translateY(-7px); box-shadow: 0 25px 55px rgba(0,0,0,.55), 0 0 30px rgba(25,178,255,.07); }
  .product-image { width: 100%; height: 280px; background: #070b10; overflow: hidden; position: relative; }
  .product-image img { width: 100%; height: 100%; object-fit: contain; padding: 16px; transition: transform .7s cubic-bezier(.2,.8,.2,1), filter .5s; display: block; }
  .product-card:hover .product-image img { transform: scale(1.08); filter: brightness(1.08); }
  .out-of-stock { position: absolute; inset: 0; background: rgba(18,24,21,0.75); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 14px; }
  .stock-low-badge { position: absolute; top: 10px; left: 10px; background: #ee4770; color: white; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; font-family: 'Space Grotesk', monospace; text-transform: uppercase; }
  .wishlist-btn { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,.55); border: 1px solid rgba(255,255,255,.14); border-radius: 50%; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; z-index: 5; }
  .wishlist-btn:hover { background: rgba(30,194,255,.20); border-color: #36cfff; }
  .wishlist-btn.active { background: #19bfff; border-color: #19bfff; }
  .multi-img-badge { position: absolute; bottom: 10px; right: 10px; background: rgba(4,8,14,.72); border: 1px solid rgba(255,255,255,.08); color: white; border-radius: 12px; padding: 4px 10px; font-size: 11px; font-family: 'Space Grotesk', monospace; }
  .product-info { padding: 17px; background: #090e14; }
  .product-category-tag { font-size: 9px; font-weight: 700; color: #43cfff; font-family: 'Space Grotesk', monospace; text-transform: uppercase; margin-bottom: 6px; }
  .product-name { font-size: 16px; font-weight: 700; color: #eef4fb; margin-bottom: 4px; font-family: 'Space Grotesk', sans-serif; }
  .product-description { color: #748195; font-size: 12px; margin-bottom: 8px; line-height: 1.4; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .product-price { position: relative; display: inline-flex; align-items: center; font-family: 'Space Grotesk', monospace; font-weight: 700; font-size: 17px; color: #5bd8ff; margin-bottom: 6px; }
  .product-stock { color: #58687d; font-size: 11px; margin-bottom: 10px; font-weight: 600; }
  .view-details-btn { width: 100%; padding: 8px; background: transparent; color: #a9b6c5; border: 1px solid rgba(255,255,255,.10); border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 13px; margin-bottom: 8px; }
  .view-details-btn:hover { color: #fff; border-color: rgba(39,200,255,.35); background: rgba(39,200,255,.06); }
  .add-to-cart-btn { width: 100%; padding: 10px; background: #fff; color: #050608; border: 0; border-radius: 10px; font-weight: 700; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 13px; }
  .add-to-cart-btn:hover:not(:disabled) { background: #bdefff; }
  .add-to-cart-btn:disabled { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.3); cursor: not-allowed; }

  /* Cart Sidebar */
  .cart-sidebar { background: rgba(12,17,26,.76); border: 1px solid rgba(255,255,255,.09); border-radius: 20px; padding: 16px; box-shadow: 0 20px 55px rgba(0,0,0,.34); backdrop-filter: blur(18px); }
  .cart-title { font-size: 16px; font-weight: 700; color: #f2f7ff; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .cart-empty { text-align: center; color: #68768a; padding: 24px 0; font-size: 14px; }
  .cart-items { max-height: 280px; overflow-y: auto; margin-bottom: 16px; }
  .cart-item { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid rgba(255,255,255,.07); padding-bottom: 10px; margin-bottom: 10px; font-size: 13px; }
  .cart-item-name { font-weight: 600; color: #dce6f2; }
  .cart-item-price { color: #68768a; font-weight: 700; font-size: 12px; }
  .remove-btn { background: none; border: none; color: #ff5e75; cursor: pointer; font-size: 16px; margin-left: 8px; }
  .cart-total { border-top: 1px solid rgba(255,255,255,.08); padding-top: 10px; margin-bottom: 12px; }
  .total-price { font-size: 17px; font-weight: 700; color: #fff; }
  .checkout-btn { width: 100%; padding: 12px; background: linear-gradient(135deg,#0caee9,#236fff); color: white; border: 0; border-radius: 11px; font-weight: 700; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 13px; }

  /* Modals */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); z-index: 500; display: flex; align-items: center; justify-content: center; padding: 16px; }
  .modal { background: #0a0f16; border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 28px; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; }
  .modal-title { font-size: 21px; font-weight: 700; color: #fff; margin-bottom: 24px; display: flex; align-items: center; gap: 10px; }
  .modal-input { width: 100%; padding: 12px 14px; background: #070b10; border: 1.5px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; font-size: 13px; margin-bottom: 12px; outline: none; }
  .modal-input:focus { border-color: #24c9ff; box-shadow: 0 0 0 3px rgba(36,201,255,0.15); }
  .modal-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .modal-order-summary { background: #070b10; border-radius: 12px; padding: 16px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.08); }
  .modal-order-item { display: flex; justify-content: space-between; font-size: 13px; color: #8794a6; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .modal-total { display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; color: #24c9ff; margin-top: 12px; }
  .modal-btns { display: flex; gap: 12px; }
  .modal-cancel { flex: 1; padding: 12px; background: transparent; color: #8794a6; border: 1.5px solid rgba(255,255,255,0.1); border-radius: 8px; font-weight: 600; cursor: pointer; }
  .modal-confirm { flex: 1.5; padding: 12px; background: #24bfff; color: #050608; border: 0; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; }

  /* Product Page Detail */
  .product-page { max-width: 1400px; margin: 0 auto; background: #050608; min-height: 100vh; padding-bottom: 100px; color: #f5f8fc; }
  .product-page-back { display: flex; align-items: center; gap: 8px; background: #050608; padding: 14px 16px; border: none; cursor: pointer; width: 100%; font-size: 15px; font-weight: 600; color: #6edcff; border-bottom: 1px solid rgba(255,255,255,.07); }
  .gallery-wrapper { background: #070b10; position: relative; overflow: hidden; width: 100%; }
  .gallery-main { position: relative; width: 100%; height: 520px; overflow: hidden; }
  .gallery-slides { display: flex; height: 100%; width: 100%; transition: transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94); }
  .gallery-slide { min-width: 100%; max-width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at 50% 50%,rgba(17,126,190,.18),transparent 58%),#070b10; flex-shrink: 0; }
  .gallery-slide img { max-width: 100%; max-height: 100%; object-fit: contain; padding: 28px; filter: drop-shadow(0 35px 35px rgba(0,0,0,.65)); }
  .gallery-arrow { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,.06); border: 1.5px solid rgba(255,255,255,.12); border-radius: 50%; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10; color: #fff; }
  .gallery-arrow-left { left: 10px; }
  .gallery-arrow-right { right: 10px; }
  .gallery-dots { display: flex; justify-content: center; gap: 6px; padding: 12px 0 8px; background: #070b10; }
  .gallery-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.2); border: none; cursor: pointer; }
  .gallery-dot.active { background: #24c9ff; width: 24px; border-radius: 4px; }
  .gallery-thumbs { display: flex; gap: 8px; padding: 12px 16px; background: #070b10; overflow-x: auto; border-bottom: 1px solid rgba(255,255,255,.07); }
  .gallery-thumb { flex-shrink: 0; width: 60px; height: 60px; border-radius: 8px; overflow: hidden; border: 2px solid rgba(255,255,255,.08); cursor: pointer; background: #0b1118; }
  .gallery-thumb.active { border-color: #2bcaff; box-shadow: 0 0 0 1px #2bcaff; }
  .gallery-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .product-details-card { background: #070b10; padding: 38px 5vw; }
  .product-page-price { font-size: 30px; font-weight: 800; color: #62dcff; font-family: 'Space Grotesk', monospace; margin-bottom: 4px; }
  .product-page-name { font-size: clamp(26px,4vw,48px); font-weight: 700; font-family: 'Space Grotesk', sans-serif; color: #f7faff; margin-bottom: 10px; }
  .product-page-rating { display: flex; align-items: center; gap: 6px; margin-bottom: 12px; }
  .stars { display: flex; gap: 2px; }
  .rating-text { font-size: 13px; color: #8795a7; }
  .product-page-badges { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
  .badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; font-family: 'Space Grotesk', monospace; background: rgba(255,255,255,.045); color: #b8c6d5; border: 1px solid rgba(255,255,255,.09); }
  .product-page-divider { height: 1px; background: rgba(255,255,255,.08); margin: 14px 0; }
  .product-page-desc-title { font-size: 11px; font-weight: 700; color: #5e7085; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px; }
  .product-page-desc { font-size: 14px; color: #8795a7; line-height: 1.7; }
  .product-page-bottom { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 1400px; background: rgba(5,7,11,0.96); backdrop-filter: blur(20px); border-top: 1px solid rgba(255,255,255,0.08); padding: 12px 16px; display: flex; gap: 10px; z-index: 200; }
  .btn-whatsapp { flex: 1; padding: 13px; background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.18); border-radius: 10px; font-weight: 700; font-size: 14px; cursor: pointer; }
  .btn-add-cart { flex: 1; padding: 13px; background: #fff; color: #050608; border: 1px solid #fff; border-radius: 10px; font-weight: 700; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; }

  /* Reviews & Related */
  .related-section, .reviews-section { background: #070b10; border-top: 1px solid rgba(255,255,255,.06); padding: 24px 5vw; }
  .related-title, .reviews-title { font-size: 18px; font-weight: 700; color: #eef4fb; margin-bottom: 14px; font-family: 'Space Grotesk', sans-serif; }
  .related-grid { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; }
  .related-card { flex: 0 0 140px; background: #0b1118; border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,.08); cursor: pointer; }
  .related-img { width: 100%; height: 100px; object-fit: cover; background: #0d1219; }
  .related-info { padding: 8px; }
  .related-name { font-size: 12px; font-weight: 600; color: #eef4fb; }
  .related-price { font-size: 12px; color: #24c9ff; font-weight: 700; }
  .review-card { background: #0b1118; border-radius: 10px; padding: 14px; margin-bottom: 12px; border: 1px solid rgba(255,255,255,.08); }
  .review-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
  .review-name { font-weight: 600; color: #eef4fb; font-size: 14px; }
  .review-comment { font-size: 13px; color: #7e8da1; }
  .add-review-form { background: #0b1118; border-radius: 10px; padding: 16px; border: 1px solid rgba(255,255,255,.08); margin-top: 16px; }
  .review-stars-input { display: flex; gap: 6px; margin-bottom: 10px; }
  .review-star-btn { background: none; border: none; cursor: pointer; }

  /* Admin Dashboard Styles */
  .admin-panel { background: #0a0f16; border-radius: 14px; padding: 20px; border: 1px solid rgba(255,255,255,0.08); }
  .admin-title { font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
  .admin-tabs { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
  .admin-tab { padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid rgba(255,255,255,0.08); color: #8794a6; background: #070b10; }
  .admin-tab.active { background: rgba(36,201,255,0.15); border-color: #24c9ff; color: #24c9ff; }
  .add-product-form { background: #070b10; border-radius: 12px; padding: 18px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.08); }
  .form-title { font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
  .form-full { grid-column: 1 / -1; }
  .form-input { padding: 10px 12px; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; font-size: 13px; width: 100%; background: #0a0f16; color: #fff; outline: none; }
  .image-upload-area { border: 2px dashed rgba(255,255,255,0.15); border-radius: 8px; padding: 20px; text-align: center; cursor: pointer; background: #0a0f16; display: block; }
  .image-upload-area input { display: none; }
  .upload-text { font-size: 13px; color: #8794a6; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .upload-hint { font-size: 11px; color: #586678; margin-top: 4px; }
  .image-preview { margin-top: 14px; display: flex; flex-wrap: wrap; gap: 10px; }
  .preview-item { position: relative; width: 80px; height: 80px; }
  .preview-item img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; border: 2px solid rgba(255,255,255,0.1); }
  .remove-image-btn { position: absolute; top: -8px; right: -8px; background: #ff5e75; color: white; border: none; border-radius: 50%; width: 22px; height: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px; }
  .submit-btn { background: #24c9ff; color: #050608; padding: 11px 24px; border: 0; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 14px; }
  .products-management-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
  .product-management-card { background: #070b10; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px; }
  .product-management-image { width: 100%; height: 160px; background: #0a0f16; border-radius: 8px; margin-bottom: 10px; overflow: hidden; }
  .product-management-image img { width: 100%; height: 100%; object-fit: cover; }
  .admin-card-actions { display: flex; gap: 8px; margin-top: 10px; }
  .edit-btn, .delete-btn { flex: 1; padding: 8px; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px; font-size: 12px; border: 0; }
  .edit-btn { background: rgba(36,201,255,0.15); color: #24c9ff; }
  .delete-btn { background: rgba(255,94,117,0.15); color: #ff5e75; }

  .orders-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .orders-table th { text-align: left; padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.08); color: #586678; font-size: 11px; text-transform: uppercase; font-family: 'Space Grotesk', monospace; }
  .orders-table td { padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.08); color: #8794a6; vertical-align: top; }
  .order-status-select { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; border: none; cursor: pointer; outline: none; }
  .status-pending { background: rgba(245,166,35,0.15); color: #f5a623; }
  .status-shipped { background: rgba(36,201,255,0.15); color: #24c9ff; }
  .status-delivered { background: rgba(34,197,94,0.15); color: #22c55e; }
  .status-cancelled { background: rgba(255,94,117,0.15); color: #ff5e75; }

  .dashboard-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px; }
  .stat-card { background: #070b10; border-radius: 12px; padding: 16px; border: 1px solid rgba(255,255,255,0.08); }
  .stat-label { font-size: 11px; color: #586678; text-transform: uppercase; margin-bottom: 6px; font-family: 'Space Grotesk', monospace; }
  .stat-value { font-size: 24px; font-weight: 700; color: #fff; font-family: 'Space Grotesk', monospace; }

  .footer { background: #030508; border-top: 1px solid rgba(255,255,255,.08); color: #738095; padding: 45px 20px; text-align: center; }
  .footer p { margin: 6px 0; font-size: 13px; }

  @media (min-width: 900px) {
    .product-page { display: grid; grid-template-columns: 1.15fr .85fr; align-items: start; min-height: calc(100vh - 70px); }
    .product-page-back { grid-column: 1 / -1; }
    .gallery-wrapper { position: sticky; top: 75px; min-height: calc(100vh - 75px); }
    .gallery-main { height: 600px; }
    .product-details-card { min-height: 600px; padding: 70px 5vw 60px 40px; margin: 0; display: flex; flex-direction: column; justify-content: center; }
    .related-section, .reviews-section, .product-page-bottom { grid-column: 1 / -1; }
  }

  @media (max-width: 899px) {
    .hero-cinematic-inner { grid-template-columns: 1fr; gap: 10px; }
    .hero-reference-stage { min-height: 390px; }
    .hero-product-collage { height: 390px; }
    .hero-collage-1 { width: 250px; height: 250px; left: 8%; top: 6%; }
    .hero-collage-2 { width: 170px; height: 170px; right: 2%; top: 0; }
    .hero-collage-3 { width: 185px; height: 185px; right: 8%; bottom: 0; }
    .category-showcase-grid { grid-template-columns: repeat(2,1fr); grid-auto-rows: 250px; }
    .products-grid { grid-template-columns: repeat(2,1fr); }
    .dashboard-grid { grid-template-columns: repeat(2,1fr); }
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
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.set(0, 1.2, 9);

    function sizeRenderer() {
      const w = stickyEl.clientWidth, h = stickyEl.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    sizeRenderer();
    window.addEventListener('resize', sizeRenderer);

    // Lights
    scene.add(new THREE.AmbientLight(0xbfe9ff, 0.65));
    const key = new THREE.DirectionalLight(0xffffff, 1.3);
    key.position.set(4, 8, 5);
    scene.add(key);

    const tealLight = new THREE.PointLight(0x24c9ff, 1.6, 25);
    tealLight.position.set(-4, 2, 4);
    scene.add(tealLight);

    const coralLight = new THREE.PointLight(0xff6b4a, 0.9, 25);
    coralLight.position.set(4, -1, -2);
    scene.add(coralLight);

    const rootRig = new THREE.Group();
    scene.add(rootRig);
    rootRig.position.y = -0.2;

    // ── 1. THE MAKEUP KIT (BOX + HINGED LID) ──
    const kitGroup = new THREE.Group();
    rootRig.add(kitGroup);

    // Box Base
    const boxBase = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 0.5, 2.4),
      new THREE.MeshStandardMaterial({ color: 0x090d14, roughness: 0.3, metalness: 0.6 })
    );
    boxBase.position.y = -0.25;

    const boxInner = new THREE.Mesh(
      new THREE.BoxGeometry(3.4, 0.45, 2.2),
      new THREE.MeshStandardMaterial({ color: 0x16202e, roughness: 0.5, metalness: 0.2 })
    );
    boxInner.position.y = -0.2;

    const trim = new THREE.Mesh(
      new THREE.BoxGeometry(3.64, 0.06, 2.44),
      new THREE.MeshStandardMaterial({ color: 0x24c9ff, roughness: 0.2, metalness: 0.85 })
    );
    trim.position.y = 0.01;
    kitGroup.add(boxBase, boxInner, trim);

    // Hinged Lid
    const lidHinge = new THREE.Group();
    lidHinge.position.set(0, 0.02, -1.2);
    const lidMesh = new THREE.Mesh(
      new THREE.BoxGeometry(3.62, 0.1, 2.42),
      new THREE.MeshStandardMaterial({ color: 0x0c121c, roughness: 0.25, metalness: 0.7 })
    );
    lidMesh.position.set(0, 0.05, 1.2);

    const mirror = new THREE.Mesh(
      new THREE.PlaneGeometry(3.2, 2.0),
      new THREE.MeshStandardMaterial({ color: 0xa9dcff, roughness: 0.05, metalness: 0.95 })
    );
    mirror.position.set(0, 0.01, 1.2);
    mirror.rotation.x = Math.PI / 2;

    lidHinge.add(lidMesh, mirror);
    kitGroup.add(lidHinge);

    // ── 2. MAKEUP ITEMS ──
    const items = [];
    function registerItem(mesh, finalPos, finalRot, startPos) {
      mesh.position.copy(startPos);
      mesh.scale.set(0.01, 0.01, 0.01);
      mesh.userData = { finalPos, finalRot, startPos };
      rootRig.add(mesh);
      items.push(mesh);
      return mesh;
    }

    // Lipstick
    const lipGroup = new THREE.Group();
    lipGroup.add(
      new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.22, 1.1, 32),
        new THREE.MeshStandardMaterial({ color: 0x111318, roughness: 0.25, metalness: 0.6 })
      )
    );
    const lipBullet = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.2, 0.5, 32),
      new THREE.MeshStandardMaterial({ color: 0xff6b4a, roughness: 0.35, metalness: 0.1 })
    );
    lipBullet.position.y = 0.75;
    lipGroup.add(lipBullet);
    registerItem(lipGroup, new THREE.Vector3(-2.2, -0.3, 1.1), new THREE.Vector3(0, 0.4, 0), new THREE.Vector3(-0.6, -0.1, 0));

    // Compact Powder
    const compactGroup = new THREE.Group();
    const compactBaseMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.75, 0.75, 0.18, 48),
      new THREE.MeshStandardMaterial({ color: 0x0d1219, roughness: 0.3, metalness: 0.4 })
    );
    const compactRimMesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.75, 0.025, 16, 48),
      new THREE.MeshStandardMaterial({ color: 0x24c9ff, roughness: 0.15, metalness: 0.85 })
    );
    compactRimMesh.rotation.x = Math.PI / 2;
    compactRimMesh.position.y = 0.09;
    compactGroup.add(compactBaseMesh, compactRimMesh);
    registerItem(compactGroup, new THREE.Vector3(-0.75, -0.7, 1.2), new THREE.Vector3(0.2, 0, 0), new THREE.Vector3(0, -0.1, 0));

    // Perfume Bottle
    const perfumeGroup = new THREE.Group();
    const bottleBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.95, 0.4),
      new THREE.MeshPhysicalMaterial({
        color: 0x19bfff, roughness: 0.08, transmission: 0.6,
        thickness: 0.6, metalness: 0, ior: 1.3
      })
    );
    const bottleCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 0.3, 24),
      new THREE.MeshStandardMaterial({ color: 0x0a0d12, roughness: 0.3, metalness: 0.8 })
    );
    bottleCap.position.y = 0.62;
    perfumeGroup.add(bottleBody, bottleCap);
    registerItem(perfumeGroup, new THREE.Vector3(2.2, -0.25, 0.9), new THREE.Vector3(0, -0.35, 0), new THREE.Vector3(0.7, -0.1, 0));

    // Brush
    const brushGroup = new THREE.Group();
    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.07, 1.5, 20),
      new THREE.MeshStandardMaterial({ color: 0x0a0d12, roughness: 0.35, metalness: 0.4 })
    );
    const ferrule = new THREE.Mesh(
      new THREE.CylinderGeometry(0.085, 0.085, 0.18, 20),
      new THREE.MeshStandardMaterial({ color: 0x24c9ff, roughness: 0.2, metalness: 0.8 })
    );
    ferrule.position.y = 0.75;
    const bristles = new THREE.Mesh(
      new THREE.ConeGeometry(0.2, 0.48, 24),
      new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.85 })
    );
    bristles.position.y = 1.05;
    brushGroup.add(handle, ferrule, bristles);
    registerItem(brushGroup, new THREE.Vector3(0.85, 0.2, 1.3), new THREE.Vector3(0.1, 0.2, -0.35), new THREE.Vector3(0.3, -0.1, 0.2));

    // Scroll interpolation
    let ticking = false;
    function getProgress() {
      const rect = stageEl.getBoundingClientRect();
      const total = stageEl.offsetHeight - stickyEl.clientHeight;
      if (total <= 0) return 0;
      return Math.min(1, Math.max(0, -rect.top / total));
    }

    function smooth(t) {
      return t * t * (3 - 2 * t);
    }

    function applyProgress(p) {
      // 1. Box Falling (0.0 -> 0.3)
      const pDrop = Math.min(1, Math.max(0, p / 0.3));
      const eDrop = smooth(pDrop);
      kitGroup.position.y = THREE.MathUtils.lerp(5.5, -0.7, eDrop);
      kitGroup.position.z = THREE.MathUtils.lerp(-3.0, 0, eDrop);
      kitGroup.rotation.x = THREE.MathUtils.lerp(0.5, 0.18, eDrop);
      kitGroup.rotation.y = THREE.MathUtils.lerp(-0.4, 0, eDrop);

      // 2. Box Lid Opening (0.28 -> 0.55)
      const pLid = Math.min(1, Math.max(0, (p - 0.28) / 0.27));
      const eLid = smooth(pLid);
      lidHinge.rotation.x = THREE.MathUtils.lerp(0, -1.9, eLid);

      // 3. Items popping out & standing in position (0.50 -> 0.95)
      items.forEach((item, idx) => {
        const itemDelay = 0.50 + idx * 0.07;
        const pItem = Math.min(1, Math.max(0, (p - itemDelay) / 0.35));
        const eItem = smooth(pItem);

        // Arc upwards then down into position
        const arcY = Math.sin(eItem * Math.PI) * 1.5;
        item.position.x = THREE.MathUtils.lerp(item.userData.startPos.x, item.userData.finalPos.x, eItem);
        item.position.y = THREE.MathUtils.lerp(item.userData.startPos.y, item.userData.finalPos.y, eItem) + arcY;
        item.position.z = THREE.MathUtils.lerp(item.userData.startPos.z, item.userData.finalPos.z, eItem);

        // Scale up from 0
        const scaleVal = THREE.MathUtils.lerp(0.01, 1, eItem);
        item.scale.set(scaleVal, scaleVal, scaleVal);

        // Stand up rotation
        item.rotation.x = THREE.MathUtils.lerp(Math.PI / 2, item.userData.finalRot.x, eItem);
        item.rotation.y = THREE.MathUtils.lerp(0, item.userData.finalRot.y, eItem);
        item.rotation.z = THREE.MathUtils.lerp(0, item.userData.finalRot.z, eItem);
      });

      // Camera dynamic panning
      camera.position.z = THREE.MathUtils.lerp(9.5, 7.2, smooth(p));
      camera.position.y = THREE.MathUtils.lerp(1.8, 0.4, smooth(p));
      rootRig.rotation.y = THREE.MathUtils.lerp(-0.35, 0.25, smooth(p));

      // Synchronize text captions
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
      dotsRef.current.forEach((dot, i) => {
        if (dot) dot.classList.toggle('spstage-dot-active', i === activeIdx);
      });
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          applyProgress(getProgress());
          ticking = false;
        });
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    applyProgress(0);

    let raf;
    function animate() {
      raf = requestAnimationFrame(animate);
      if (!reduceMotion) rootRig.rotation.y += 0.0005;
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
    <section ref={stageRef} style={{ position: 'relative', height: '400vh' }}>
      <style>{`
        .spstage-sticky{position:sticky;top:0;height:100svh;min-height:600px;overflow:hidden;
          background:radial-gradient(ellipse at 50% 30%, rgba(36,201,255,0.13), transparent 60%),
          linear-gradient(180deg, #05070b 0%, #090d14 100%);}
        .spstage-canvas{position:absolute;inset:0;z-index:1;width:100%;height:100%;display:block;}
        .spstage-scene{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;
          align-items:center;justify-content:center;text-align:center;padding:0 6vw;
          opacity:0;transition:opacity .35s ease, transform .35s ease;will-change:opacity,transform;}
        .spstage-eyebrow{font-family:'Space Grotesk',sans-serif;font-size:11px;letter-spacing:2px;
          text-transform:uppercase;color:#54d8ff;margin-bottom:16px;}
        .spstage-title{font-family:'Space Grotesk',sans-serif;font-size:clamp(32px,5.5vw,64px);
          line-height:1.05;letter-spacing:-.03em;color:#f7f9fc;margin-bottom:14px;text-wrap:balance;}
        .spstage-body{font-family:'Manrope',sans-serif;color:#8c9aac;font-size:15px;line-height:1.7;
          max-width:460px;}
        .spstage-progress{position:absolute;left:50%;bottom:34px;transform:translateX(-50%);
          display:flex;gap:8px;z-index:3;}
        .spstage-dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.22);
          transition:all .3s ease;}
        .spstage-dot-active{background:#24c9ff;width:22px;border-radius:4px;
          box-shadow:0 0 12px rgba(36,201,255,.6);}
        .spstage-hint{position:absolute;top:26px;left:50%;transform:translateX(-50%);
          color:#617085;font-size:10px;letter-spacing:2px;text-transform:uppercase;z-index:3;}
      `}</style>
      <div ref={stickyRef} className="spstage-sticky">
        <canvas ref={canvasRef} className="spstage-canvas" />
        <div className="spstage-hint">Scroll down to unbox</div>
        {SCENES.map((s, i) => (
          <div
            key={i}
            ref={(el) => (sceneElsRef.current[i] = el)}
            className="spstage-scene"
          >
            {s.eyebrow && <div className="spstage-eyebrow">{s.eyebrow}</div>}
            <h2 className="spstage-title">{s.title}</h2>
            {s.body && <p className="spstage-body">{s.body}</p>}
          </div>
        ))}
        <div className="spstage-progress">
          {SCENES.map((_, i) => (
            <span key={i} ref={(el) => (dotsRef.current[i] = el)} className="spstage-dot" />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── SCROLL REVEAL WRAPPER ─── */
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
      <div className="gallery-wrapper">
        <div className="gallery-main" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <div className="gallery-slides" style={{ transform: `translateX(-${current * 100}%)` }}>
            {images.map((img, i) => (
              <div className="gallery-slide" key={i}>
                <img src={img} alt={`${product.name} ${i + 1}`} />
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
          <div className="gallery-thumbs">{images.map((img, i) => <div key={i} className={`gallery-thumb ${i === current ? 'active' : ''}`} onClick={() => goTo(i)}><img src={img} alt="" /></div>)}</div>
        )}
      </div>

      <div className="product-details-card">
        <div className="product-page-price">Rs. {product.price}</div>
        <div className="product-page-name">{product.name}</div>
        {product.category && <div style={{ fontSize: 12, color: '#24c9ff', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1, fontFamily: "'Space Grotesk', monospace" }}>{product.category}</div>}
        <div className="product-page-rating">
          <div className="stars">
            {[1,2,3,4,5].map(s => <Star key={s} size={15} fill={s <= Math.round(avgRating || 4) ? '#f5a623' : 'none'} color={s <= Math.round(avgRating || 4) ? '#f5a623' : '#586678'} />)}
          </div>
          <span className="rating-text">{avgRating || '4.0'} · {reviews.length} reviews · Stock: {product.stock}</span>
        </div>
        <div className="product-page-badges">
          <span className="badge">💵 Cash on Delivery</span>
          {product.stock > 0 ? <span className="badge">✅ Available</span> : <span className="badge" style={{ color: '#ff5e75' }}>❌ Out of Stock</span>}
          {product.stock > 0 && product.stock <= 5 && <span className="badge" style={{ color: '#ff6b4a' }}>🔥 Only {product.stock} left!</span>}
          <span className="badge">🚚 Free Delivery</span>
        </div>
        <div className="product-page-divider" />
        <div className="product-page-desc-title">Product Details</div>
        <div className="product-page-desc">{product.description || 'No description provided.'}</div>
      </div>

      {related.length > 0 && (
        <div className="related-section">
          <div className="related-title">You may also like</div>
          <div className="related-grid">
            {related.map(p => (
              <div key={p.id} className="related-card" onClick={() => onBack()}>
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

      <div className="reviews-section">
        <div className="reviews-title">⭐ Customer Reviews</div>
        {reviews.map(r => (
          <div key={r.id} className="review-card">
            <div className="review-header">
              <div>
                <div className="review-name">{r.customer_name}</div>
                <div className="stars" style={{ marginTop: 4 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={13} fill={s <= r.rating ? '#f5a623' : 'none'} color={s <= r.rating ? '#f5a623' : '#586678'} />)}
                </div>
              </div>
              <div style={{ fontSize: 11, color: '#586678' }}>{new Date(r.created_at).toLocaleDateString()}</div>
            </div>
            {r.comment && <div className="review-comment">{r.comment}</div>}
          </div>
        ))}
        <div className="add-review-form">
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Leave a Review</div>
          <div className="review-stars-input">
            {[1,2,3,4,5].map(s => (
              <button key={s} type="button" className="review-star-btn"
                onMouseEnter={() => setHoverStar(s)}
                onMouseLeave={() => setHoverStar(0)}
                onClick={() => setNewReview({ ...newReview, rating: s })}
              >
                <Star size={20} fill={s <= (hoverStar || newReview.rating) ? '#f5a623' : 'none'} color={s <= (hoverStar || newReview.rating) ? '#f5a623' : '#586678'} />
              </button>
            ))}
          </div>
          <input className="modal-input" placeholder="Your name" value={newReview.name} onChange={e => setNewReview({ ...newReview, name: e.target.value })} style={{ marginBottom: 10 }} />
          <textarea className="modal-input" placeholder="Your review (optional)" value={newReview.comment} onChange={e => setNewReview({ ...newReview, comment: e.target.value })} style={{ resize: 'vertical', minHeight: 60 }} />
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
    if (!error && data) {
      setResetMode(data.reset_mode || 'manual');
      setResetAt(data.reset_at || null);
    }
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true });
    if (!error && data && data.length > 0) setCategories(data.map(c => c.name));
  };

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchOrders();
      fetchResetSettings();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    const timer = setInterval(() => setDashboardNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, [isAdmin]);

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
    const inUse = products.some(p => p.category === name);
    if (inUse && !confirm(`"${name}" is used by products. Delete anyway?`)) return;
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
    if (error) { alert('Failed to place order.'); return; }
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
    if (!error) {
      setResetAt(now);
      setDashboardNow(Date.now());
      alert('Dashboard reset successfully!');
    }
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
            <textarea className="modal-input" placeholder="Description" value={editingProduct.description} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} />
            <label className="image-upload-area" style={{ marginBottom: 12 }}>
              <input type="file" accept="image/*" multiple onChange={e => handleImagesUpload(e, true)} />
              <div className="upload-text"><Upload size={18} /> Add more images</div>
            </label>
            {editingProduct.images?.length > 0 && (
              <div className="image-preview" style={{ marginBottom: 14 }}>
                {editingProduct.images.map((img, idx) => (
                  <div key={idx} className="preview-item">
                    <img src={img} alt="" />
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

      {/* 3D Makeup Unboxing Stage */}
      {!isAdmin && view === 'shop' && (
        <ScrollProductStage />
      )}

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
                <button className="hero-primary-btn" onClick={() => window.scrollTo({ top: 900, behavior: 'smooth' })}>Shop Now <ChevronRight size={17} /></button>
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
                <div className="hero-product-placeholder"><Package size={68} color="#36caff" /></div>
              )}
              <div className="hero-stage-caption">
                <span className="hero-live-dot"></span>
                <strong>Daily essentials</strong>
                <small>Delivered to your door</small>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Shop by Category */}
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
            {categories.slice(0, 4).map((cat, index) => {
              const categoryProduct = products.find(p => p.category === cat);
              return (
                <button key={cat} className="category-showcase-card" onClick={() => { setSelectedCategory(cat); window.scrollTo({ top: 1100, behavior: 'smooth' }); }}>
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
            <div className="section-title products-section-title">
              <div>
                <span className="section-kicker">THE COLLECTION</span>
                <h2>Featured essentials</h2>
              </div>
              <p>{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} available</p>
            </div>
            <div className="products-container">
              <div>
                {loading && <p style={{ textAlign: 'center', padding: 20, color: '#8794a6' }}>Loading products...</p>}
                {!loading && filteredProducts.length === 0 && <p style={{ textAlign: 'center', padding: 20, color: '#586678' }}>No products found.</p>}
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
            </div>
          </div>
        )}

        {/* Admin View */}
        {isAdmin && (
          <div className="admin-panel">
            <div className="admin-title"><Package size={22} /> Admin Panel</div>
            <div className="admin-tabs">
              <button className={`admin-tab ${adminTab === 'products' ? 'active' : ''}`} onClick={() => setAdminTab('products')}><Package size={15} /> Products</button>
              <button className={`admin-tab ${adminTab === 'orders' ? 'active' : ''}`} onClick={() => setAdminTab('orders')}><ClipboardList size={15} /> Orders {pendingOrders > 0 && <span style={{ background: '#24bfff', color: '#050608', borderRadius: 20, padding: '1px 7px', fontSize: 11 }}>{pendingOrders}</span>}</button>
              <button className={`admin-tab ${adminTab === 'dashboard' ? 'active' : ''}`} onClick={() => setAdminTab('dashboard')}><BarChart2 size={15} /> Dashboard</button>
              <button className={`admin-tab ${adminTab === 'categories' ? 'active' : ''}`} onClick={() => setAdminTab('categories')}><Filter size={15} /> Categories</button>
            </div>

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
                      <textarea placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} className="form-input form-full" />
                    </div>
                    <label className="image-upload-area" style={{ marginBottom: 12 }}>
                      <input type="file" accept="image/*" multiple onChange={handleImagesUpload} disabled={newProduct.images.length >= 8} />
                      <div className="upload-text"><Upload size={18} />{newProduct.images.length === 0 ? 'Upload images (select multiple)' : `Add more (${newProduct.images.length}/8)`}</div>
                      <div className="upload-hint">First image = main photo · Max 8</div>
                    </label>
                    {newProduct.images?.length > 0 && (
                      <div className="image-preview">
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
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{product.name}</div>
                      <div style={{ color: '#24c9ff', fontWeight: 700, margin: '4px 0' }}>Rs.{product.price}</div>
                      <div style={{ fontSize: 12, color: '#586678' }}>Stock: {product.stock} · {product.category}</div>
                      <div className="admin-card-actions">
                        <button className="edit-btn" onClick={() => setEditingProduct({ ...product, images: product.images || [product.image] })}><Edit2 size={13} /> Edit</button>
                        <button className="delete-btn" onClick={() => handleDeleteProduct(product.id)}><Trash2 size={13} /> Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {adminTab === 'orders' && (
              <div className="orders-section">
                <table className="orders-table">
                  <thead>
                    <tr><th>Customer</th><th>Items</th><th>Total</th><th>City</th><th>Date</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td><div style={{ color: '#fff', fontWeight: 600 }}>{order.customer_name}</div><div style={{ fontSize: 11 }}>{order.customer_phone}</div></td>
                        <td>{order.items?.map(i => i.name).join(', ')}</td>
                        <td style={{ color: '#24c9ff', fontWeight: 700 }}>Rs.{order.total_price}</td>
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
            )}

            {adminTab === 'dashboard' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700 }}>Dashboard Reset Settings</div>
                    <div style={{ color: '#586678', fontSize: 12 }}>{resetMode === 'daily' ? 'Stats reset daily' : resetMode === 'monthly' ? 'Stats reset monthly' : `Stats since ${resetAt ? new Date(resetAt).toLocaleString() : 'beginning'}`}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <select className="filter-select" value={resetMode} onChange={(e) => handleResetModeChange(e.target.value)}>
                      <option value="manual">Manual Reset</option>
                      <option value="daily">Reset Daily</option>
                      <option value="monthly">Reset Monthly</option>
                    </select>
                    <button className="submit-btn" onClick={handleResetDashboard} disabled={resetLoading}>{resetLoading ? 'Resetting...' : 'Reset Now'}</button>
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
                  <div className="form-title"><Plus size={16} /> Add Category</div>
                  <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: 10 }}>
                    <input type="text" placeholder="Category name" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="form-input" style={{ flex: 1 }} />
                    <button type="submit" className="submit-btn" disabled={savingCategory}>{savingCategory ? 'Saving...' : 'Add'}</button>
                  </form>
                </div>
                <div className="products-management-grid">
                  {categories.map(cat => (
                    <div key={cat} className="product-management-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div><div style={{ color: '#fff', fontWeight: 600 }}>{cat}</div><div style={{ fontSize: 12, color: '#586678' }}>{products.filter(p => p.category === cat).length} products</div></div>
                      <button className="delete-btn" style={{ flex: 'none', padding: '6px 12px' }} onClick={() => handleDeleteCategory(cat)}><Trash2 size={13} /></button>
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
}  .hero-accent { color: transparent; background: linear-gradient(100deg,#fff,#67dcff 45%,#278fff); -webkit-background-clip: text; background-clip: text; }
  .hero-sub { color: #8c9aac; max-width: 510px; font-size: 15px; line-height: 1.75; margin: 0 0 30px; }
  .hero-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 18px; }
  .hero-primary-btn { display: inline-flex; align-items: center; gap: 8px; border-radius: 999px; padding: 13px 22px; color: #050608; font-weight: 800; background: #fff; cursor: pointer; border: 0; box-shadow: 0 12px 38px rgba(255,255,255,.10); transition: .3s ease; }
  .hero-primary-btn:hover { background: #dff7ff; box-shadow: 0 16px 46px rgba(28,192,255,.22); transform: translateY(-2px); }
  .hero-trust { color: #6e7c8e; font-size: 12px; display: inline-flex; align-items: center; gap: 8px; }
  .hero-trust-dot, .hero-live-dot { width: 7px; height: 7px; border-radius: 50%; background: #2bceff; box-shadow: 0 0 14px #2bceff; display: inline-block; }
  .hero-reference-stage { min-height: 530px; position: relative; display: flex; align-items: center; justify-content: center; isolation: isolate; }
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
  .hero-scroll-hint { position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); color: #617085; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; display: flex; align-items: center; gap: 8px; z-index: 2; }
  .hero-scroll-hint span { width: 28px; height: 1px; background: linear-gradient(90deg,transparent,#38cfff); }

  /* Category showcase */
  .category-showcase { max-width: 1400px; margin: 0 auto; padding: 82px 5vw 70px; background: #050608; }
  .category-showcase-head { display: block; text-align: center; margin-bottom: 32px; }
  .section-kicker { color: #53d5ff; font-size: 10px; font-weight: 800; letter-spacing: 2.2px; text-transform: uppercase; }
  .category-showcase-head h2, .section-title h2 { font-family: 'Space Grotesk', sans-serif; color: #f3f7fc; font-size: clamp(30px,4vw,48px); letter-spacing: -.04em; margin-top: 7px; }
  .category-showcase-head p { margin: 10px auto 0; color: #69778a; max-width: 340px; font-size: 13px; line-height: 1.6; }
  .category-showcase-grid { display: grid; grid-template-columns: repeat(4,1fr); grid-auto-rows: 330px; gap: 10px; }
  .category-showcase-card { position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,.08); border-radius: 2px; background: #0a0f15; cursor: pointer; text-align: left; min-width: 0; }
  .category-showcase-card img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: .58; transform: scale(1.02); transition: transform .8s cubic-bezier(.2,.8,.2,1), filter .6s; filter: brightness(.68) saturate(1.15); }
  .category-showcase-card:hover img { transform: scale(1.12); filter: brightness(.9) saturate(1.25); }
  .category-card-overlay { position: absolute; inset: 0; background: linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.82)); }
  .category-card-content { position: absolute; left: 22px; right: 22px; bottom: 20px; display: grid; grid-template-columns: 1fr auto; align-items: end; z-index: 2; }
  .category-card-content small { grid-column: 1/-1; color: #48d4ff; font-size: 9px; letter-spacing: 2px; margin-bottom: 6px; }
  .category-card-content strong { color: #fff; font-family: 'Space Grotesk', sans-serif; font-size: 24px; letter-spacing: -.03em; }
  .category-card-content em { display: flex; align-items: center; gap: 3px; color: #a9b7c7; font-style: normal; font-size: 10px; opacity: 0; transform: translateX(-5px); transition: .3s; }
  .category-showcase-card:hover .category-card-content em { opacity: 1; transform: translateX(0); }

  /* Search + Filters */
  .search-bar-wrapper { max-width: 1400px; margin: 0 auto; padding: 0 5vw 10px; background: #050608; }
  .search-bar { display: flex; align-items: center; gap: 10px; background: #090d12; border: 1px solid rgba(255,255,255,.08); border-radius: 999px; padding: 12px 18px; }
  .search-bar:focus-within { border-color: rgba(35,199,255,.45); box-shadow: 0 0 0 3px rgba(35,199,255,.07), 0 0 35px rgba(35,199,255,.06); }
  .search-bar input { flex: 1; background: none; border: none; outline: none; color: #eaf4ff; font-size: 14px; }
  .search-bar input::placeholder { color: #5d6b7f; }
  .filter-bar { max-width: 1400px; margin: 0 auto; padding: 10px 5vw 20px; background: #050608; display: flex; gap: 12px; flex-wrap: wrap; align-items: center; justify-content: space-between; }
  .category-chips { display: flex; gap: 7px; flex-wrap: wrap; flex: 1; overflow-x: auto; scrollbar-width: none; }
  .category-chips::-webkit-scrollbar { display: none; }
  .chip { padding: 8px 16px; border-radius: 999px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: 1px solid rgba(255,255,255,.08); background: transparent; color: #718095; white-space: nowrap; flex-shrink: 0; }
  .chip.active, .chip:hover { color: #fff; background: rgba(36,201,255,.09); border-color: rgba(36,201,255,.35); }
  .filter-selects { display: flex; gap: 10px; flex-wrap: wrap; }
  .filter-select { padding: 8px 14px; border-radius: 999px; font-size: 12px; font-weight: 600; background: #090d12; border: 1px solid rgba(255,255,255,.08); color: #aeb9c8; cursor: pointer; outline: none; }

  /* Product Catalog */
  .main-content { max-width: 1400px; margin: 0 auto; padding: 50px 28px 90px; background: #050608; }
  .section-title { text-align: center; margin-bottom: 24px; }
  .products-section-title { display: flex; justify-content: space-between; align-items: end; padding-top: 70px; text-align: left; }
  .products-section-title p { color: #69778a; }
  .products-container { display: grid; grid-template-columns: 1fr; gap: 18px; }
  .products-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .product-card { background: #090e14; border: 1px solid rgba(255,255,255,.075); border-radius: 3px; overflow: hidden; transition: all 0.3s ease; cursor: pointer; position: relative; }
  .product-card:hover { border-color: rgba(39,200,255,.35); transform: translateY(-7px); box-shadow: 0 25px 55px rgba(0,0,0,.55), 0 0 30px rgba(25,178,255,.07); }
  .product-image { width: 100%; height: 280px; background: #070b10; overflow: hidden; position: relative; }
  .product-image img { width: 100%; height: 100%; object-fit: contain; padding: 16px; transition: transform .7s cubic-bezier(.2,.8,.2,1), filter .5s; display: block; }
  .product-card:hover .product-image img { transform: scale(1.08); filter: brightness(1.08); }
  .out-of-stock { position: absolute; inset: 0; background: rgba(18,24,21,0.75); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 14px; }
  .stock-low-badge { position: absolute; top: 10px; left: 10px; background: #ee4770; color: white; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; font-family: 'Space Grotesk', monospace; text-transform: uppercase; }
  .wishlist-btn { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,.55); border: 1px solid rgba(255,255,255,.14); border-radius: 50%; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; z-index: 5; }
  .wishlist-btn:hover { background: rgba(30,194,255,.20); border-color: #36cfff; }
  .wishlist-btn.active { background: #19bfff; border-color: #19bfff; }
  .multi-img-badge { position: absolute; bottom: 10px; right: 10px; background: rgba(4,8,14,.72); border: 1px solid rgba(255,255,255,.08); color: white; border-radius: 12px; padding: 4px 10px; font-size: 11px; font-family: 'Space Grotesk', monospace; }
  .product-info { padding: 17px; background: #090e14; }
  .product-category-tag { font-size: 9px; font-weight: 700; color: #43cfff; font-family: 'Space Grotesk', monospace; text-transform: uppercase; margin-bottom: 6px; }
  .product-name { font-size: 16px; font-weight: 700; color: #eef4fb; margin-bottom: 4px; font-family: 'Space Grotesk', sans-serif; }
  .product-description { color: #748195; font-size: 12px; margin-bottom: 8px; line-height: 1.4; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
  .product-price { position: relative; display: inline-flex; align-items: center; font-family: 'Space Grotesk', monospace; font-weight: 700; font-size: 17px; color: #5bd8ff; margin-bottom: 6px; }
  .product-stock { color: #58687d; font-size: 11px; margin-bottom: 10px; font-weight: 600; }
  .view-details-btn { width: 100%; padding: 8px; background: transparent; color: #a9b6c5; border: 1px solid rgba(255,255,255,.10); border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 13px; margin-bottom: 8px; }
  .view-details-btn:hover { color: #fff; border-color: rgba(39,200,255,.35); background: rgba(39,200,255,.06); }
  .add-to-cart-btn { width: 100%; padding: 10px; background: #fff; color: #050608; border: 0; border-radius: 10px; font-weight: 700; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 13px; }
  .add-to-cart-btn:hover:not(:disabled) { background: #bdefff; }
  .add-to-cart-btn:disabled { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.3); cursor: not-allowed; }

  /* Cart Sidebar */
  .cart-sidebar { background: rgba(12,17,26,.76); border: 1px solid rgba(255,255,255,.09); border-radius: 20px; padding: 16px; box-shadow: 0 20px 55px rgba(0,0,0,.34); backdrop-filter: blur(18px); }
  .cart-title { font-size: 16px; font-weight: 700; color: #f2f7ff; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .cart-empty { text-align: center; color: #68768a; padding: 24px 0; font-size: 14px; }
  .cart-items { max-height: 280px; overflow-y: auto; margin-bottom: 16px; }
  .cart-item { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid rgba(255,255,255,.07); padding-bottom: 10px; margin-bottom: 10px; font-size: 13px; }
  .cart-item-name { font-weight: 600; color: #dce6f2; }
  .cart-item-price { color: #68768a; font-weight: 700; font-size: 12px; }
  .remove-btn { background: none; border: none; color: #ff5e75; cursor: pointer; font-size: 16px; margin-left: 8px; }
  .cart-total { border-top: 1px solid rgba(255,255,255,.08); padding-top: 10px; margin-bottom: 12px; }
  .total-price { font-size: 17px; font-weight: 700; color: #fff; }
  .checkout-btn { width: 100%; padding: 12px; background: linear-gradient(135deg,#0caee9,#236fff); color: white; border: 0; border-radius: 11px; font-weight: 700; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 6px; font-size: 13px; }

  /* Modals */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(8px); z-index: 500; display: flex; align-items: center; justify-content: center; padding: 16px; }
  .modal { background: #0a0f16; border: 1px solid rgba(255,255,255,0.12); border-radius: 16px; padding: 28px; width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; }
  .modal-title { font-size: 21px; font-weight: 700; color: #fff; margin-bottom: 24px; display: flex; align-items: center; gap: 10px; }
  .modal-input { width: 100%; padding: 12px 14px; background: #070b10; border: 1.5px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; font-size: 13px; margin-bottom: 12px; outline: none; }
  .modal-input:focus { border-color: #24c9ff; box-shadow: 0 0 0 3px rgba(36,201,255,0.15); }
  .modal-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .modal-order-summary { background: #070b10; border-radius: 12px; padding: 16px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.08); }
  .modal-order-item { display: flex; justify-content: space-between; font-size: 13px; color: #8794a6; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .modal-total { display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; color: #24c9ff; margin-top: 12px; }
  .modal-btns { display: flex; gap: 12px; }
  .modal-cancel { flex: 1; padding: 12px; background: transparent; color: #8794a6; border: 1.5px solid rgba(255,255,255,0.1); border-radius: 8px; font-weight: 600; cursor: pointer; }
  .modal-confirm { flex: 1.5; padding: 12px; background: #24bfff; color: #050608; border: 0; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; }

  /* Product Page Detail */
  .product-page { max-width: 1400px; margin: 0 auto; background: #050608; min-height: 100vh; padding-bottom: 100px; color: #f5f8fc; }
  .product-page-back { display: flex; align-items: center; gap: 8px; background: #050608; padding: 14px 16px; border: none; cursor: pointer; width: 100%; font-size: 15px; font-weight: 600; color: #6edcff; border-bottom: 1px solid rgba(255,255,255,.07); }
  .gallery-wrapper { background: #070b10; position: relative; overflow: hidden; width: 100%; }
  .gallery-main { position: relative; width: 100%; height: 520px; overflow: hidden; }
  .gallery-slides { display: flex; height: 100%; width: 100%; transition: transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94); }
  .gallery-slide { min-width: 100%; max-width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: radial-gradient(circle at 50% 50%,rgba(17,126,190,.18),transparent 58%),#070b10; flex-shrink: 0; }
  .gallery-slide img { max-width: 100%; max-height: 100%; object-fit: contain; padding: 28px; filter: drop-shadow(0 35px 35px rgba(0,0,0,.65)); }
  .gallery-arrow { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,.06); border: 1.5px solid rgba(255,255,255,.12); border-radius: 50%; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10; color: #fff; }
  .gallery-arrow-left { left: 10px; }
  .gallery-arrow-right { right: 10px; }
  .gallery-dots { display: flex; justify-content: center; gap: 6px; padding: 12px 0 8px; background: #070b10; }
  .gallery-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.2); border: none; cursor: pointer; }
  .gallery-dot.active { background: #24c9ff; width: 24px; border-radius: 4px; }
  .gallery-thumbs { display: flex; gap: 8px; padding: 12px 16px; background: #070b10; overflow-x: auto; border-bottom: 1px solid rgba(255,255,255,.07); }
  .gallery-thumb { flex-shrink: 0; width: 60px; height: 60px; border-radius: 8px; overflow: hidden; border: 2px solid rgba(255,255,255,.08); cursor: pointer; background: #0b1118; }
  .gallery-thumb.active { border-color: #2bcaff; box-shadow: 0 0 0 1px #2bcaff; }
  .gallery-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .product-details-card { background: #070b10; padding: 38px 5vw; }
  .product-page-price { font-size: 30px; font-weight: 800; color: #62dcff; font-family: 'Space Grotesk', monospace; margin-bottom: 4px; }
  .product-page-name { font-size: clamp(26px,4vw,48px); font-weight: 700; font-family: 'Space Grotesk', sans-serif; color: #f7faff; margin-bottom: 10px; }
  .product-page-rating { display: flex; align-items: center; gap: 6px; margin-bottom: 12px; }
  .stars { display: flex; gap: 2px; }
  .rating-text { font-size: 13px; color: #8795a7; }
  .product-page-badges { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
  .badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; font-family: 'Space Grotesk', monospace; background: rgba(255,255,255,.045); color: #b8c6d5; border: 1px solid rgba(255,255,255,.09); }
  .product-page-divider { height: 1px; background: rgba(255,255,255,.08); margin: 14px 0; }
  .product-page-desc-title { font-size: 11px; font-weight: 700; color: #5e7085; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px; }
  .product-page-desc { font-size: 14px; color: #8795a7; line-height: 1.7; }
  .product-page-bottom { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 1400px; background: rgba(5,7,11,0.96); backdrop-filter: blur(20px); border-top: 1px solid rgba(255,255,255,0.08); padding: 12px 16px; display: flex; gap: 10px; z-index: 200; }
  .btn-whatsapp { flex: 1; padding: 13px; background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.18); border-radius: 10px; font-weight: 700; font-size: 14px; cursor: pointer; }
  .btn-add-cart { flex: 1; padding: 13px; background: #fff; color: #050608; border: 1px solid #fff; border-radius: 10px; font-weight: 700; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; }

  /* Reviews & Related */
  .related-section, .reviews-section { background: #070b10; border-top: 1px solid rgba(255,255,255,.06); padding: 24px 5vw; }
  .related-title, .reviews-title { font-size: 18px; font-weight: 700; color: #eef4fb; margin-bottom: 14px; font-family: 'Space Grotesk', sans-serif; }
  .related-grid { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; }
  .related-card { flex: 0 0 140px; background: #0b1118; border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,.08); cursor: pointer; }
  .related-img { width: 100%; height: 100px; object-fit: cover; background: #0d1219; }
  .related-info { padding: 8px; }
  .related-name { font-size: 12px; font-weight: 600; color: #eef4fb; }
  .related-price { font-size: 12px; color: #24c9ff; font-weight: 700; }
  .review-card { background: #0b1118; border-radius: 10px; padding: 14px; margin-bottom: 12px; border: 1px solid rgba(255,255,255,.08); }
  .review-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
  .review-name { font-weight: 600; color: #eef4fb; font-size: 14px; }
  .review-comment { font-size: 13px; color: #7e8da1; }
  .add-review-form { background: #0b1118; border-radius: 10px; padding: 16px; border: 1px solid rgba(255,255,255,.08); margin-top: 16px; }
  .review-stars-input { display: flex; gap: 6px; margin-bottom: 10px; }
  .review-star-btn { background: none; border: none; cursor: pointer; }

  /* Admin Dashboard Styles */
  .admin-panel { background: #0a0f16; border-radius: 14px; padding: 20px; border: 1px solid rgba(255,255,255,0.08); }
  .admin-title { font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
  .admin-tabs { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
  .admin-tab { padding: 8px 18px; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid rgba(255,255,255,0.08); color: #8794a6; background: #070b10; }
  .admin-tab.active { background: rgba(36,201,255,0.15); border-color: #24c9ff; color: #24c9ff; }
  .add-product-form { background: #070b10; border-radius: 12px; padding: 18px; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.08); }
  .form-title { font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
  .form-full { grid-column: 1 / -1; }
  .form-input { padding: 10px 12px; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; font-size: 13px; width: 100%; background: #0a0f16; color: #fff; outline: none; }
  .image-upload-area { border: 2px dashed rgba(255,255,255,0.15); border-radius: 8px; padding: 20px; text-align: center; cursor: pointer; background: #0a0f16; display: block; }
  .image-upload-area input { display: none; }
  .upload-text { font-size: 13px; color: #8794a6; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .upload-hint { font-size: 11px; color: #586678; margin-top: 4px; }
  .image-preview { margin-top: 14px; display: flex; flex-wrap: wrap; gap: 10px; }
  .preview-item { position: relative; width: 80px; height: 80px; }
  .preview-item img { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; border: 2px solid rgba(255,255,255,0.1); }
  .remove-image-btn { position: absolute; top: -8px; right: -8px; background: #ff5e75; color: white; border: none; border-radius: 50%; width: 22px; height: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px; }
  .submit-btn { background: #24c9ff; color: #050608; padding: 11px 24px; border: 0; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 14px; }
  .products-management-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
  .product-management-card { background: #070b10; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px; }
  .product-management-image { width: 100%; height: 160px; background: #0a0f16; border-radius: 8px; margin-bottom: 10px; overflow: hidden; }
  .product-management-image img { width: 100%; height: 100%; object-fit: cover; }
  .admin-card-actions { display: flex; gap: 8px; margin-top: 10px; }
  .edit-btn, .delete-btn { flex: 1; padding: 8px; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 5px; font-size: 12px; border: 0; }
  .edit-btn { background: rgba(36,201,255,0.15); color: #24c9ff; }
  .delete-btn { background: rgba(255,94,117,0.15); color: #ff5e75; }

  .orders-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .orders-table th { text-align: left; padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.08); color: #586678; font-size: 11px; text-transform: uppercase; font-family: 'Space Grotesk', monospace; }
  .orders-table td { padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.08); color: #8794a6; vertical-align: top; }
  .order-status-select { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; border: none; cursor: pointer; outline: none; }
  .status-pending { background: rgba(245,166,35,0.15); color: #f5a623; }
  .status-shipped { background: rgba(36,201,255,0.15); color: #24c9ff; }
  .status-delivered { background: rgba(34,197,94,0.15); color: #22c55e; }
  .status-cancelled { background: rgba(255,94,117,0.15); color: #ff5e75; }

  .dashboard-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px; }
  .stat-card { background: #070b10; border-radius: 12px; padding: 16px; border: 1px solid rgba(255,255,255,0.08); }
  .stat-label { font-size: 11px; color: #586678; text-transform: uppercase; margin-bottom: 6px; font-family: 'Space Grotesk', monospace; }
  .stat-value { font-size: 24px; font-weight: 700; color: #fff; font-family: 'Space Grotesk', monospace; }

  .footer { background: #030508; border-top: 1px solid rgba(255,255,255,.08); color: #738095; padding: 45px 20px; text-align: center; }
  .footer p { margin: 6px 0; font-size: 13px; }

  /* Desktop Two Column Split */
  @media (min-width: 900px) {
    .product-page { display: grid; grid-template-columns: 1.15fr .85fr; align-items: start; min-height: calc(100vh - 70px); }
    .product-page-back { grid-column: 1 / -1; }
    .gallery-wrapper { position: sticky; top: 75px; min-height: calc(100vh - 75px); }
    .gallery-main { height: 600px; }
    .product-details-card { min-height: 600px; padding: 70px 5vw 60px 40px; margin: 0; display: flex; flex-direction: column; justify-content: center; }
    .related-section, .reviews-section, .product-page-bottom { grid-column: 1 / -1; }
  }

  @media (max-width: 899px) {
    .hero-cinematic-inner { grid-template-columns: 1fr; gap: 10px; }
    .hero-reference-stage { min-height: 390px; }
    .hero-product-collage { height: 390px; }
    .hero-collage-1 { width: 250px; height: 250px; left: 8%; top: 6%; }
    .hero-collage-2 { width: 170px; height: 170px; right: 2%; top: 0; }
    .hero-collage-3 { width: 185px; height: 185px; right: 8%; bottom: 0; }
    .category-showcase-grid { grid-template-columns: repeat(2,1fr); grid-auto-rows: 250px; }
    .products-grid { grid-template-columns: repeat(2,1fr); }
    .dashboard-grid { grid-template-columns: repeat(2,1fr); }
  }
`;

/* ─── SCROLL-DRIVEN 3D MAKEUP STAGE ─── */
const SCENES = [
  { eyebrow: 'THE COLLECTION · MADE FOR DAILY LIFE', title: 'Beauty, assembled.', body: '' },
  { eyebrow: '', title: 'Every piece, considered.', body: 'From lip to finish — curated essentials that hold up to daily use.' },
  { eyebrow: '', title: 'Cash on delivery. Always.', body: 'Shop with confidence — pay only when it arrives at your door.' },
  { eyebrow: '', title: 'Your daily edit awaits.', body: 'Explore the full collection below.' }
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
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.set(0, 0.2, 8.5);

    function sizeRenderer() {
      const w = stickyEl.clientWidth, h = stickyEl.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    sizeRenderer();
    window.addEventListener('resize', sizeRenderer);

    scene.add(new THREE.AmbientLight(0xbfe9ff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.15);
    key.position.set(4, 6, 5);
    scene.add(key);
    const tealLight = new THREE.PointLight(0x24c9ff, 1.4, 24);
    tealLight.position.set(-3.5, 1.5, 4);
    scene.add(tealLight);
    const coralLight = new THREE.PointLight(0xff6b4a, 0.65, 24);
    coralLight.position.set(3.5, -1.5, -3);
    scene.add(coralLight);

    const rig = new THREE.Group();
    scene.add(rig);
    rig.rotation.x = 0.06;
    rig.scale.setScalar(1.15);

    const items = [];
    function addItem(mesh, finalPos, finalRotY = 0, upFrom) {
      const scatterX = finalPos.x + (Math.random() - 0.5) * 4.2;
      const scatterY = finalPos.y + (upFrom ?? 2.8 + Math.random() * 1.4);
      const scatterZ = finalPos.z + (Math.random() - 0.5) * 3.2;
      mesh.position.set(scatterX, scatterY, scatterZ);
      mesh.rotation.y = (Math.random() - 0.5) * Math.PI;
      mesh.userData = { finalPos, finalRotY, scatterX, scatterY, scatterZ, startRotY: mesh.rotation.y };

      mesh.traverse((child) => {
        if (child.isMesh) {
          child.material = child.material.clone();
          child.material.transparent = true;
          child.material.opacity = 0;
        }
      });
      rig.add(mesh);
      items.push(mesh);
      return mesh;
    }

    function setOpacity(mesh, v) {
      mesh.traverse((child) => {
        if (child.isMesh) child.material.opacity = v;
      });
    }

    // 1. Lipstick
    const lipGroup = new THREE.Group();
    lipGroup.add(
      new THREE.Mesh(
        new THREE.CylinderGeometry(0.26, 0.26, 1.25, 32),
        new THREE.MeshStandardMaterial({ color: 0x111318, roughness: 0.25, metalness: 0.6 })
      )
    );
    const lipBullet = new THREE.Mesh(
      new THREE.CylinderGeometry(0.19, 0.23, 0.55, 32),
      new THREE.MeshStandardMaterial({ color: 0xff6b4a, roughness: 0.35, metalness: 0.1 })
    );
    lipBullet.position.y = 0.88;
    lipGroup.add(lipBullet);
    addItem(lipGroup, new THREE.Vector3(-2.05, -0.1, 0.5), 0.35);

    // 2. Compact Powder
    const compactGroup = new THREE.Group();
    const compactBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.9, 0.9, 0.2, 48),
      new THREE.MeshStandardMaterial({ color: 0x0d1219, roughness: 0.3, metalness: 0.4 })
    );
    const compactRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.9, 0.028, 16, 48),
      new THREE.MeshStandardMaterial({ color: 0x24c9ff, roughness: 0.15, metalness: 0.85 })
    );
    compactRim.rotation.x = Math.PI / 2;
    compactRim.position.y = 0.1;
    compactGroup.add(compactBase, compactRim);
    addItem(compactGroup, new THREE.Vector3(0.5, -0.55, -0.6), 0);

    // 3. Perfume Bottle
    const perfumeGroup = new THREE.Group();
    const bottleBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.68, 1.05, 0.4),
      new THREE.MeshPhysicalMaterial({
        color: 0x19bfff, roughness: 0.08, transmission: 0.55,
        thickness: 0.6, metalness: 0, ior: 1.3
      })
    );
    const bottleCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.17, 0.17, 0.32, 24),
      new THREE.MeshStandardMaterial({ color: 0x0a0d12, roughness: 0.3, metalness: 0.7 })
    );
    bottleCap.position.y = 0.68;
    perfumeGroup.add(bottleBody, bottleCap);
    addItem(perfumeGroup, new THREE.Vector3(1.95, 0.05, 0.35), -0.22);

    // 4. Makeup Brush
    const brushGroup = new THREE.Group();
    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.075, 1.55, 20),
      new THREE.MeshStandardMaterial({ color: 0x0a0d12, roughness: 0.35, metalness: 0.4 })
    );
    const ferrule = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 0.18, 20),
      new THREE.MeshStandardMaterial({ color: 0x24c9ff, roughness: 0.2, metalness: 0.8 })
    );
    ferrule.position.y = 0.78;
    const bristles = new THREE.Mesh(
      new THREE.ConeGeometry(0.21, 0.5, 24),
      new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.85 })
    );
    bristles.position.y = 1.1;
    brushGroup.add(handle, ferrule, bristles);
    brushGroup.rotation.z = 0.45;
    addItem(brushGroup, new THREE.Vector3(-0.55, 1.05, -0.85), 0.55, 3.4);

    let ticking = false;
    function getProgress() {
      const wrapper = stageEl;
      const rect = wrapper.getBoundingClientRect();
      const total = wrapper.offsetHeight - stickyEl.clientHeight;
      if (total <= 0) return 0;
      return Math.min(1, Math.max(0, -rect.top / total));
    }

    function ease(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    const sceneCount = SCENES.length;

    function applyProgress(p) {
      const e = ease(p);

      items.forEach((mesh, i) => {
        const local = Math.min(1, Math.max(0, (e - i * 0.05) / 0.65));
        const { finalPos, finalRotY, scatterX, scatterY, scatterZ, startRotY } = mesh.userData;
        mesh.position.x = THREE.MathUtils.lerp(scatterX, finalPos.x, local);
        mesh.position.y = THREE.MathUtils.lerp(scatterY, finalPos.y, local);
        mesh.position.z = THREE.MathUtils.lerp(scatterZ, finalPos.z, local);
        mesh.rotation.y = THREE.MathUtils.lerp(startRotY, finalRotY, local);
        setOpacity(mesh, local);
      });

      rig.rotation.y = THREE.MathUtils.lerp(-0.5, 0.35, e);
      camera.position.z = THREE.MathUtils.lerp(9.5, 6.8, e);
      camera.position.y = THREE.MathUtils.lerp(0.4, 0, e);

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
      dotsRef.current.forEach((dot, i) => {
        if (dot) dot.classList.toggle('spstage-dot-active', i === activeIdx);
      });
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          applyProgress(getProgress());
          ticking = false;
        });
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    applyProgress(0);

    let raf;
    function animate() {
      raf = requestAnimationFrame(animate);
      if (!reduceMotion) rig.rotation.y += 0.0008;
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
    <section ref={stageRef} style={{ position: 'relative', height: '380vh' }}>
      <style>{`
        .spstage-sticky{position:sticky;top:0;height:100svh;min-height:600px;overflow:hidden;
          background:radial-gradient(ellipse at 50% 30%, rgba(36,201,255,0.13), transparent 60%),
          linear-gradient(180deg, #05070b 0%, #090d14 100%);}
        .spstage-canvas{position:absolute;inset:0;z-index:1;width:100%;height:100%;display:block;}
        .spstage-scene{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;
          align-items:center;justify-content:center;text-align:center;padding:0 6vw;
          opacity:0;transition:opacity .35s ease, transform .35s ease;will-change:opacity,transform;}
        .spstage-eyebrow{font-family:'Space Grotesk',sans-serif;font-size:11px;letter-spacing:2px;
          text-transform:uppercase;color:#54d8ff;margin-bottom:16px;}
        .spstage-title{font-family:'Space Grotesk',sans-serif;font-size:clamp(32px,5.5vw,64px);
          line-height:1.05;letter-spacing:-.03em;color:#f7f9fc;margin-bottom:14px;text-wrap:balance;}
        .spstage-body{font-family:'Manrope',sans-serif;color:#8c9aac;font-size:15px;line-height:1.7;
          max-width:460px;}
        .spstage-progress{position:absolute;left:50%;bottom:34px;transform:translateX(-50%);
          display:flex;gap:8px;z-index:3;}
        .spstage-dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.22);
          transition:all .3s ease;}
        .spstage-dot-active{background:#24c9ff;width:22px;border-radius:4px;
          box-shadow:0 0 12px rgba(36,201,255,.6);}
        .spstage-hint{position:absolute;top:26px;left:50%;transform:translateX(-50%);
          color:#617085;font-size:10px;letter-spacing:2px;text-transform:uppercase;z-index:3;}
      `}</style>
      <div ref={stickyRef} className="spstage-sticky">
        <canvas ref={canvasRef} className="spstage-canvas" />
        <div className="spstage-hint">Scroll</div>
        {SCENES.map((s, i) => (
          <div
            key={i}
            ref={(el) => (sceneElsRef.current[i] = el)}
            className="spstage-scene"
          >
            {s.eyebrow && <div className="spstage-eyebrow">{s.eyebrow}</div>}
            <h2 className="spstage-title">{s.title}</h2>
            {s.body && <p className="spstage-body">{s.body}</p>}
          </div>
        ))}
        <div className="spstage-progress">
          {SCENES.map((_, i) => (
            <span key={i} ref={(el) => (dotsRef.current[i] = el)} className="spstage-dot" />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── SCROLL REVEAL WRAPPER ─── */
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
      <div className="gallery-wrapper">
        <div className="gallery-main" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <div className="gallery-slides" style={{ transform: `translateX(-${current * 100}%)` }}>
            {images.map((img, i) => (
              <div className="gallery-slide" key={i}>
                <img src={img} alt={`${product.name} ${i + 1}`} />
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
          <div className="gallery-thumbs">{images.map((img, i) => <div key={i} className={`gallery-thumb ${i === current ? 'active' : ''}`} onClick={() => goTo(i)}><img src={img} alt="" /></div>)}</div>
        )}
      </div>

      <div className="product-details-card">
        <div className="product-page-price">Rs. {product.price}</div>
        <div className="product-page-name">{product.name}</div>
        {product.category && <div style={{ fontSize: 12, color: '#24c9ff', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1, fontFamily: "'Space Grotesk', monospace" }}>{product.category}</div>}
        <div className="product-page-rating">
          <div className="stars">
            {[1,2,3,4,5].map(s => <Star key={s} size={15} fill={s <= Math.round(avgRating || 4) ? '#f5a623' : 'none'} color={s <= Math.round(avgRating || 4) ? '#f5a623' : '#586678'} />)}
          </div>
          <span className="rating-text">{avgRating || '4.0'} · {reviews.length} reviews · Stock: {product.stock}</span>
        </div>
        <div className="product-page-badges">
          <span className="badge">💵 Cash on Delivery</span>
          {product.stock > 0 ? <span className="badge">✅ Available</span> : <span className="badge" style={{ color: '#ff5e75' }}>❌ Out of Stock</span>}
          {product.stock > 0 && product.stock <= 5 && <span className="badge" style={{ color: '#ff6b4a' }}>🔥 Only {product.stock} left!</span>}
          <span className="badge">🚚 Free Delivery</span>
        </div>
        <div className="product-page-divider" />
        <div className="product-page-desc-title">Product Details</div>
        <div className="product-page-desc">{product.description || 'No description provided.'}</div>
      </div>

      {related.length > 0 && (
        <div className="related-section">
          <div className="related-title">You may also like</div>
          <div className="related-grid">
            {related.map(p => (
              <div key={p.id} className="related-card" onClick={() => onBack()}>
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

      <div className="reviews-section">
        <div className="reviews-title">⭐ Customer Reviews</div>
        {reviews.map(r => (
          <div key={r.id} className="review-card">
            <div className="review-header">
              <div>
                <div className="review-name">{r.customer_name}</div>
                <div className="stars" style={{ marginTop: 4 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={13} fill={s <= r.rating ? '#f5a623' : 'none'} color={s <= r.rating ? '#f5a623' : '#586678'} />)}
                </div>
              </div>
              <div style={{ fontSize: 11, color: '#586678' }}>{new Date(r.created_at).toLocaleDateString()}</div>
            </div>
            {r.comment && <div className="review-comment">{r.comment}</div>}
          </div>
        ))}
        <div className="add-review-form">
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Leave a Review</div>
          <div className="review-stars-input">
            {[1,2,3,4,5].map(s => (
              <button key={s} type="button" className="review-star-btn"
                onMouseEnter={() => setHoverStar(s)}
                onMouseLeave={() => setHoverStar(0)}
                onClick={() => setNewReview({ ...newReview, rating: s })}
              >
                <Star size={20} fill={s <= (hoverStar || newReview.rating) ? '#f5a623' : 'none'} color={s <= (hoverStar || newReview.rating) ? '#f5a623' : '#586678'} />
              </button>
            ))}
          </div>
          <input className="modal-input" placeholder="Your name" value={newReview.name} onChange={e => setNewReview({ ...newReview, name: e.target.value })} style={{ marginBottom: 10 }} />
          <textarea className="modal-input" placeholder="Your review (optional)" value={newReview.comment} onChange={e => setNewReview({ ...newReview, comment: e.target.value })} style={{ resize: 'vertical', minHeight: 60 }} />
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
    if (!error && data) {
      setResetMode(data.reset_mode || 'manual');
      setResetAt(data.reset_at || null);
    }
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true });
    if (!error && data && data.length > 0) setCategories(data.map(c => c.name));
  };

  useEffect(() => { fetchProducts(); fetchCategories(); }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchOrders();
      fetchResetSettings();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    const timer = setInterval(() => setDashboardNow(Date.now()), 60000);
    return () => clearInterval(timer);
  }, [isAdmin]);

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
    const inUse = products.some(p => p.category === name);
    if (inUse && !confirm(`"${name}" is used by products. Delete anyway?`)) return;
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
    if (error) { alert('Failed to place order.'); return; }
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
    if (!error) {
      setResetAt(now);
      setDashboardNow(Date.now());
      alert('Dashboard reset successfully!');
    }
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
            <textarea className="modal-input" placeholder="Description" value={editingProduct.description} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} />
            <label className="image-upload-area" style={{ marginBottom: 12 }}>
              <input type="file" accept="image/*" multiple onChange={e => handleImagesUpload(e, true)} />
              <div className="upload-text"><Upload size={18} /> Add more images</div>
            </label>
            {editingProduct.images?.length > 0 && (
              <div className="image-preview" style={{ marginBottom: 14 }}>
                {editingProduct.images.map((img, idx) => (
                  <div key={idx} className="preview-item">
                    <img src={img} alt="" />
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

      {/* 3D Scroll Stage — Plays before hero in shop view */}
      {!isAdmin && view === 'shop' && (
        <ScrollProductStage />
      )}

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
                <button className="hero-primary-btn" onClick={() => window.scrollTo({ top: 900, behavior: 'smooth' })}>Shop Now <ChevronRight size={17} /></button>
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
                <div className="hero-product-placeholder"><Package size={68} color="#36caff" /></div>
              )}
              <div className="hero-stage-caption">
                <span className="hero-live-dot"></span>
                <strong>Daily essentials</strong>
                <small>Delivered to your door</small>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Shop by Category */}
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
            {categories.slice(0, 4).map((cat, index) => {
              const categoryProduct = products.find(p => p.category === cat);
              return (
                <button key={cat} className="category-showcase-card" onClick={() => { setSelectedCategory(cat); window.scrollTo({ top: 1100, behavior: 'smooth' }); }}>
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
            <div className="section-title products-section-title">
              <div>
                <span className="section-kicker">THE COLLECTION</span>
                <h2>Featured essentials</h2>
              </div>
              <p>{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} available</p>
            </div>
            <div className="products-container">
              <div>
                {loading && <p style={{ textAlign: 'center', padding: 20, color: '#8794a6' }}>Loading products...</p>}
                {!loading && filteredProducts.length === 0 && <p style={{ textAlign: 'center', padding: 20, color: '#586678' }}>No products found.</p>}
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
            </div>
          </div>
        )}

        {/* Admin View */}
        {isAdmin && (
          <div className="admin-panel">
            <div className="admin-title"><Package size={22} /> Admin Panel</div>
            <div className="admin-tabs">
              <button className={`admin-tab ${adminTab === 'products' ? 'active' : ''}`} onClick={() => setAdminTab('products')}><Package size={15} /> Products</button>
              <button className={`admin-tab ${adminTab === 'orders' ? 'active' : ''}`} onClick={() => setAdminTab('orders')}><ClipboardList size={15} /> Orders {pendingOrders > 0 && <span style={{ background: '#24bfff', color: '#050608', borderRadius: 20, padding: '1px 7px', fontSize: 11 }}>{pendingOrders}</span>}</button>
              <button className={`admin-tab ${adminTab === 'dashboard' ? 'active' : ''}`} onClick={() => setAdminTab('dashboard')}><BarChart2 size={15} /> Dashboard</button>
              <button className={`admin-tab ${adminTab === 'categories' ? 'active' : ''}`} onClick={() => setAdminTab('categories')}><Filter size={15} /> Categories</button>
            </div>

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
                      <textarea placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} className="form-input form-full" />
                    </div>
                    <label className="image-upload-area" style={{ marginBottom: 12 }}>
                      <input type="file" accept="image/*" multiple onChange={handleImagesUpload} disabled={newProduct.images.length >= 8} />
                      <div className="upload-text"><Upload size={18} />{newProduct.images.length === 0 ? 'Upload images (select multiple)' : `Add more (${newProduct.images.length}/8)`}</div>
                      <div className="upload-hint">First image = main photo · Max 8</div>
                    </label>
                    {newProduct.images.length > 0 && (
                      <div className="image-preview">
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
                      <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{product.name}</div>
                      <div style={{ color: '#24c9ff', fontWeight: 700, margin: '4px 0' }}>Rs.{product.price}</div>
                      <div style={{ fontSize: 12, color: '#586678' }}>Stock: {product.stock} · {product.category}</div>
                      <div className="admin-card-actions">
                        <button className="edit-btn" onClick={() => setEditingProduct({ ...product, images: product.images || [product.image] })}><Edit2 size={13} /> Edit</button>
                        <button className="delete-btn" onClick={() => handleDeleteProduct(product.id)}><Trash2 size={13} /> Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {adminTab === 'orders' && (
              <div className="orders-section">
                <table className="orders-table">
                  <thead>
                    <tr><th>Customer</th><th>Items</th><th>Total</th><th>City</th><th>Date</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td><div style={{ color: '#fff', fontWeight: 600 }}>{order.customer_name}</div><div style={{ fontSize: 11 }}>{order.customer_phone}</div></td>
                        <td>{order.items?.map(i => i.name).join(', ')}</td>
                        <td style={{ color: '#24c9ff', fontWeight: 700 }}>Rs.{order.total_price}</td>
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
            )}

            {adminTab === 'dashboard' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700 }}>Dashboard Reset Settings</div>
                    <div style={{ color: '#586678', fontSize: 12 }}>{resetMode === 'daily' ? 'Stats reset daily' : resetMode === 'monthly' ? 'Stats reset monthly' : `Stats since ${resetAt ? new Date(resetAt).toLocaleString() : 'beginning'}`}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <select className="filter-select" value={resetMode} onChange={(e) => handleResetModeChange(e.target.value)}>
                      <option value="manual">Manual Reset</option>
                      <option value="daily">Reset Daily</option>
                      <option value="monthly">Reset Monthly</option>
                    </select>
                    <button className="submit-btn" onClick={handleResetDashboard} disabled={resetLoading}>{resetLoading ? 'Resetting...' : 'Reset Now'}</button>
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
                  <div className="form-title"><Plus size={16} /> Add Category</div>
                  <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: 10 }}>
                    <input type="text" placeholder="Category name" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="form-input" style={{ flex: 1 }} />
                    <button type="submit" className="submit-btn" disabled={savingCategory}>{savingCategory ? 'Saving...' : 'Add'}</button>
                  </form>
                </div>
                <div className="products-management-grid">
                  {categories.map(cat => (
                    <div key={cat} className="product-management-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div><div style={{ color: '#fff', fontWeight: 600 }}>{cat}</div><div style={{ fontSize: 12, color: '#586678' }}>{products.filter(p => p.category === cat).length} products</div></div>
                      <button className="delete-btn" style={{ flex: 'none', padding: '6px 12px' }} onClick={() => handleDeleteCategory(cat)}><Trash2 size={13} /></button>
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
