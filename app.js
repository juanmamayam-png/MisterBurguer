/* ==========================================================
   MISTER BURGER — Sistema POS  |  app.js  v2
   Novedades:
     - Barra de búsqueda global en navbar
     - 2 pisos: Piso 1 (14 mesas) y Piso 2 (23 mesas)
     - Estados de mesa: free | occupied | pending_payment
     - Solo el Jefe puede confirmar pago y liberar mesa
     - Modal de pago con método, cambio y resumen detallado
========================================================== */

'use strict';

/* ==========================================================
   1. DATOS FIJOS
========================================================== */

const USERS = [
  { id: 1, username: 'mesero', password: '1234',  role: 'waiter', name: 'Carlos M.' },
  { id: 2, username: 'jefe',   password: 'admin', role: 'boss',   name: 'Jefe Admin' },
  { id: 3, username: 'maria',  password: '1234',  role: 'waiter', name: 'María G.' },
];

const CAT_EMOJI = {
  'Hamburguesas': '🍔', 'Especiales': '🥩', 'Hot Dog': '🌭',
  'Bebidas': '🥤', 'Infantil': '🍟', 'Entradas': '🥗',
};

const DEFAULT_PRODUCTS = [
  { id:1,  name:'Clásica',              desc:'Pan artesanal, queso, 150g carne 100% res, tomate, cebolla y lechuga',                                                                 price:15000, cat:'Hamburguesas', emoji:'🍔', status:'active' },
  { id:2,  name:'Tocineta',             desc:'Pan artesanal, queso, 150g carne 100% res, tocineta ahumada, tomate, cebolla y lechuga',                                               price:17500, cat:'Hamburguesas', emoji:'🥓', status:'active' },
  { id:3,  name:'Mexicana',             desc:'Pan artesanal, queso, 150g carne, jalapeños, salsa de guacamole, tomate, cebolla y lechuga',                                           price:18500, cat:'Hamburguesas', emoji:'🌶️', status:'active' },
  { id:4,  name:'Vaquera',              desc:'Pan artesanal, queso, 150g carne 100% res, costilla ahumada a la plancha, tomate, cebolla y lechuga',                                  price:21500, cat:'Hamburguesas', emoji:'🤠', status:'active' },
  { id:5,  name:'Campesina',            desc:'Pan artesanal, queso, 150g res maduro, huevo frito, chorizo, tocineta ahumada, maíz tierno, tomate, cebolla y lechuga',               price:22000, cat:'Hamburguesas', emoji:'🌽', status:'active' },
  { id:6,  name:'Criolla',              desc:'Pan artesanal, queso, 150g carne 100% res, tocineta ahumada, huevo frito, maíz tierno, tomate, cebolla y lechuga',                    price:20500, cat:'Hamburguesas', emoji:'🥚', status:'active' },
  { id:7,  name:'Cheddar',              desc:'Pan artesanal, queso, 150g carne 100% res, queso cheddar, tomate, cebolla y lechuga',                                                 price:16000, cat:'Hamburguesas', emoji:'🧀', status:'active' },
  { id:8,  name:'Ranchera',             desc:'Pan artesanal, queso, 150g carne 100% res, tocineta, chorizo, tomate, cebolla y lechuga',                                             price:19000, cat:'Hamburguesas', emoji:'🔥', status:'active' },
  { id:9,  name:'Paisa',                desc:'Arepa paisa, queso, 150g carne 100% res, huevo frito, chorizo, pimentón, cebolla, maíz tierno y tomate',                              price:20000, cat:'Hamburguesas', emoji:'🫓', status:'active' },
  { id:10, name:'Callejera',            desc:'Pan artesanal, doble queso, 150g carne 100% res, tocineta ahumada, cebolla con salsa rosada, ripio de papa con tomate y lechuga',     price:20000, cat:'Hamburguesas', emoji:'🌆', status:'active' },
  { id:11, name:'Hawaiana',             desc:'Pan artesanal, queso, 150g carne 100% res, piña melada, tomate, cebolla y lechuga',                                                   price:17500, cat:'Hamburguesas', emoji:'🍍', status:'active' },
  { id:12, name:'Tentación',            desc:'Plátano maduro, doble porción de queso, tocineta, carne 150g, huevo frito, tomate, cebolla, lechuga y salsa dulce maíz',              price:21000, cat:'Hamburguesas', emoji:'🍌', status:'active' },
  { id:13, name:'Trifásica',            desc:'Pan artesanal, triple carne (res, cerdo, pollo), triple queso crema, tomate, cebolla y lechuga',                                      price:27000, cat:'Hamburguesas', emoji:'🏆', status:'active' },
  { id:14, name:'Marinera',             desc:'Pan artesanal, queso, 150g carne 100% res, camarones salteados con salsa especial, tomate, cebolla y lechuga',                        price:21500, cat:'Hamburguesas', emoji:'🦐', status:'active' },
  { id:15, name:'Extrema Queso',        desc:'Pan artesanal, queso, 150g carne 100% res, tocineta ahumada, queso cheddar fundido, doble crema, tomate, cebolla y lechuga',          price:25000, cat:'Hamburguesas', emoji:'🫕', status:'active' },
  { id:16, name:'Jumanji',              desc:'Pan artesanal, queso crema y cheddar, doble carne 100% res, doble porción de tocineta ahumada, sin vegetales',                        price:22000, cat:'Hamburguesas', emoji:'🦁', status:'active' },
  { id:17, name:'Mister Burger',        desc:'Pan artesanal, doble queso, doble carne 100% res, tocineta ahumada, chorizo, huevo frito, maíz tierno, tomate, cebolla y lechuga',   price:25000, cat:'Hamburguesas', emoji:'⭐', status:'active' },
  { id:18, name:'Caqueteña',            desc:'Plátano, doble queso, 150g carne 100% res, pollo apanado, tocineta ahumada, chorizo, huevo frito, maíz tierno, tomate, cebolla y lechuga', price:25000, cat:'Hamburguesas', emoji:'🌿', status:'active' },
  { id:19, name:'Ropa Vieja',           desc:'Pan artesanal, queso, 150g carne 100% res, carne desmechada bañada en salsa bolonesa, tomate, cebolla y lechuga',                    price:21500, cat:'Hamburguesas', emoji:'🥘', status:'active' },
  { id:20, name:'Crunch',               desc:'Pan artesanal, queso, doble carne pollo apanado, tomate, cebolla y lechuga',                                                          price:20500, cat:'Hamburguesas', emoji:'🍗', status:'active' },
  { id:21, name:'Parrillada',           desc:'Lomo fino de res, pechuga, lomo de cerdo, chorizo, patacón, papas a la francesa y ensalada',                                          price:32000, cat:'Especiales',   emoji:'🥩', status:'active' },
  { id:22, name:'Pechuga a la Plancha', desc:'Acompañamiento de papas a la francesa, ensalada. 2 opciones para el plato',                                                           price:35000, cat:'Especiales',   emoji:'🍖', status:'active' },
  { id:23, name:'Baby Beef',            desc:'Lomo fino con papas a la francesa, pataconas, tocineta y ensalada',                                                                   price:42000, cat:'Especiales',   emoji:'🥗', status:'active' },
  { id:24, name:'Patacón',              desc:'Lomo fino de res, pechuga, lomo de cerdo, chorizo, patacón, maíz tierno, queso gratinado, ripio de papa y huevos de codorniz',       price:32000, cat:'Especiales',   emoji:'🫔', status:'active' },
  { id:25, name:'Maicito',              desc:'Carne mixta, pollo, lomo fino de res, lomo de cerdo, cebolla grillé, papas a la francesa, 2 yucas, queso gratinado, maíz tierno',    price:32000, cat:'Especiales',   emoji:'🌽', status:'active' },
  { id:26, name:'Chicharronuda',        desc:'Porción de costilla con chicharrón, patacón, papas a la francesa y ensalada',                                                         price:42000, cat:'Especiales',   emoji:'🥓', status:'active' },
  { id:27, name:'Costillas BBQ',        desc:'Costillitas bañadas en salsa BBQ, papas a la francesa, patacón y ensalada',                                                           price:32000, cat:'Especiales',   emoji:'🍖', status:'active' },
  { id:28, name:'Burrito',              desc:'Tortilla de trigo, queso, trozos de lomo fino, pechuga y lomo de cerdo, salsas y verduras',                                           price:25000, cat:'Especiales',   emoji:'🌯', status:'active' },
  { id:29, name:'Alitas BBQ',           desc:'Alas de pollo bañadas en salsa BBQ, papas a la francesa y ensalada',                                                                 price:23000, cat:'Especiales',   emoji:'🍗', status:'active' },
  { id:30, name:'Punta de Anca',        desc:'Corte fino de picaña a la plancha, papas a la francesa, yuquitas y ensalada',                                                        price:43000, cat:'Especiales',   emoji:'🥩', status:'active' },
  { id:31, name:'Ensalada Mister',      desc:'Trocitos de pollo, piña, huevos de codorniz, patacón, queso, lechuga, maíz tierno',                                                  price:22000, cat:'Especiales',   emoji:'🥗', status:'active' },
  { id:32, name:'Lomo de Cerdo',        desc:'Cerdo a la plancha, papas a la francesa y ensalada',                                                                                 price:43000, cat:'Especiales',   emoji:'🐷', status:'active' },
  { id:33, name:'Churrasco',            desc:'Lomo ancho a la plancha, chimichurri, papas a la francesa y ensalada',                                                               price:43000, cat:'Especiales',   emoji:'🥩', status:'active' },
  { id:34, name:'Bistec a Caballo',     desc:'Lomo de res a la plancha con hogao, papas a la francesa, 2 huevos fritos y ensalada',                                               price:43000, cat:'Especiales',   emoji:'🍳', status:'active' },
  { id:35, name:'Hot Dog Sencillo',     desc:'Pan, salchicha, queso, papa ripio',                                                                                                  price:12500, cat:'Hot Dog',       emoji:'🌭', status:'active' },
  { id:36, name:'Hot Dog Hawaiano',     desc:'Con melao de piña',                                                                                                                  price:14000, cat:'Hot Dog',       emoji:'🍍', status:'active' },
  { id:37, name:'Hot Dog Especial',     desc:'Con tocineta y cebolla grillé',                                                                                                      price:15000, cat:'Hot Dog',       emoji:'🌭', status:'active' },
  { id:38, name:'Hot Dog Mexicano',     desc:'Con jalapeños y salsa guacamole',                                                                                                    price:15000, cat:'Hot Dog',       emoji:'🌶️', status:'active' },
  { id:39, name:'Hot Dog Mister',       desc:'Con tocineta, chorizo, maíz, huevos de codorniz',                                                                                   price:18500, cat:'Hot Dog',       emoji:'⭐', status:'active' },
  { id:40, name:'Limonada Natural',     desc:'Fresca y natural',                                                                                                                   price:6000,  cat:'Bebidas',       emoji:'🍋', status:'active' },
  { id:41, name:'Limonada de Coco',     desc:'Refrescante con coco',                                                                                                               price:11000, cat:'Bebidas',       emoji:'🥥', status:'active' },
  { id:42, name:'Limonada Yerbabuena',  desc:'Con hierbabuena fresca',                                                                                                             price:11000, cat:'Bebidas',       emoji:'🌿', status:'active' },
  { id:43, name:'Mandarinada',          desc:'Jugo natural de mandarina',                                                                                                          price:11000, cat:'Bebidas',       emoji:'🍊', status:'active' },
  { id:44, name:'Naranjada',            desc:'Jugo natural de naranja',                                                                                                            price:11000, cat:'Bebidas',       emoji:'🍊', status:'active' },
  { id:45, name:'Piña Colada',          desc:'Piña colada tropical',                                                                                                               price:12000, cat:'Bebidas',       emoji:'🍹', status:'active' },
  { id:46, name:'Cerveza Nacional',     desc:'Fría y refrescante',                                                                                                                 price:6000,  cat:'Bebidas',       emoji:'🍺', status:'active' },
  { id:47, name:'Jugo Amazónico Arazá', desc:'Exótico jugo amazónico',                                                                                                            price:11000, cat:'Bebidas',       emoji:'🍹', status:'active' },
  { id:48, name:'Hot Dog Kids',         desc:'Mini perro americano, papitas a la francesa, jugo hit o pony mini y nucita',                                                        price:18500, cat:'Infantil',      emoji:'🌭', status:'active' },
  { id:49, name:'Burger Kids',          desc:'Hamburguesa mini, papitas a la francesa, jugo hit o pony mini y nucita',                                                            price:18500, cat:'Infantil',      emoji:'🍔', status:'active' },
  { id:50, name:'Nuggets Kids',         desc:'Nuggets de pollo, papitas a la francesa, jugo hit o pony mini y nucita',                                                            price:16500, cat:'Infantil',      emoji:'🍗', status:'active' },
  { id:51, name:'Papitas Cheddar',      desc:'Trocitos de tocineta, papitas con queso cheddar, jugo hit o pony mini y nucita',                                                    price:16500, cat:'Infantil',      emoji:'🧀', status:'active' },
  { id:52, name:'Patacones con Hogao',  desc:'Patacones con hogao casero',                                                                                                        price:7000,  cat:'Entradas',      emoji:'🫓', status:'active' },
  { id:53, name:'Arepas con Hogao',     desc:'Arepas tradicionales con hogao',                                                                                                    price:7000,  cat:'Entradas',      emoji:'🫓', status:'active' },
  { id:54, name:'Papas Criollas',       desc:'Papas criollas fritas',                                                                                                             price:7000,  cat:'Entradas',      emoji:'🥔', status:'active' },
  { id:55, name:'Aritos de Cebolla',    desc:'Anillos de cebolla fritos',                                                                                                         price:8000,  cat:'Entradas',      emoji:'🧅', status:'active' },
  { id:56, name:'Deditos',              desc:'Deditos de queso fritos',                                                                                                           price:7000,  cat:'Entradas',      emoji:'🧆', status:'active' },
  { id:57, name:'Yuquitas',             desc:'Yuca frita crujiente',                                                                                                              price:7000,  cat:'Entradas',      emoji:'🌿', status:'active' },
];

/** Genera 37 mesas: 14 en Piso 1, 23 en Piso 2 */
function buildDefaultTables() {
  const tables = [];
  for (let i = 1; i <= 14; i++)  tables.push({ id: i,      num: i,      floor: 1, status: 'free' });
  for (let i = 1; i <= 23; i++)  tables.push({ id: i + 14, num: i,      floor: 2, status: 'free' });
  return tables;
}
const DEFAULT_TABLES = buildDefaultTables();


/* ==========================================================
   2. ESTADO GLOBAL
========================================================== */
let state = {
  currentUser:     null,
  products:        [],
  tables:          [],
  // orders: { id, tableId, waiterId, createdAt, status, paidAt?, payMethod?, totalPaid? }
  // status: 'active' | 'pending_payment' | 'paid'
  orders:          [],
  // orderItems: { id, orderId, productId, qty, price, notes, status }
  // status: 'active' | 'cancelled'
  orderItems:      [],
  selectedTable:   null,
  activeOrderId:   null,
  selectedFloor:   1,
  nextId:          { product: 100, order: 1, item: 1 },
  moveTableTarget: null,
  addQty:          1,
  addPid:          null,
  paymentOrderId:  null,
};


/* ==========================================================
   3. PERSISTENCIA
========================================================== */
function saveState() {
  try {
    localStorage.setItem('mb_products',   JSON.stringify(state.products));
    localStorage.setItem('mb_tables',     JSON.stringify(state.tables));
    localStorage.setItem('mb_orders',     JSON.stringify(state.orders));
    localStorage.setItem('mb_orderItems', JSON.stringify(state.orderItems));
    localStorage.setItem('mb_nextId',     JSON.stringify(state.nextId));
  } catch (e) { console.warn('[MB] localStorage error:', e); }
}

function loadState() {
  try {
    state.products   = JSON.parse(localStorage.getItem('mb_products'))   || [...DEFAULT_PRODUCTS];
    state.orders     = JSON.parse(localStorage.getItem('mb_orders'))     || [];
    state.orderItems = JSON.parse(localStorage.getItem('mb_orderItems')) || [];
    state.nextId     = JSON.parse(localStorage.getItem('mb_nextId'))     || { product: 100, order: 1, item: 1 };

    // Cargar mesas y migrar si hace falta
    let savedTables = JSON.parse(localStorage.getItem('mb_tables'));
    if (!savedTables || savedTables.length < 37 || savedTables[0].floor === undefined) {
      // Migración: regenerar con 37 mesas y 2 pisos
      const fresh = buildDefaultTables();
      if (savedTables) {
        savedTables.forEach(old => {
          const t = fresh.find(x => x.id === old.id);
          if (t) t.status = old.status;
        });
      }
      state.tables = fresh;
      saveState();
    } else {
      state.tables = savedTables;
    }
  } catch (e) {
    console.warn('[MB] loadState error, resetting:', e);
    state.products   = [...DEFAULT_PRODUCTS];
    state.tables     = buildDefaultTables();
    state.orders     = [];
    state.orderItems = [];
  }
}


/* ==========================================================
   4. NOTIFICACIONES TOAST
========================================================== */
function notify(msg, type = 'default') {
  const icons = { success:'fa-circle-check', error:'fa-circle-exclamation', info:'fa-circle-info', default:'fa-bell' };
  const el = document.createElement('div');
  el.className = `notif ${type}`;
  el.innerHTML = `<i class="fa-solid ${icons[type] || icons.default}"></i>${msg}`;
  document.getElementById('notifications').appendChild(el);
  setTimeout(() => {
    el.style.animation = 'notifOut 0.3s ease forwards';
    setTimeout(() => el.remove(), 300);
  }, 3000);
}


/* ==========================================================
   5. NAVEGACIÓN
========================================================== */
function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const t = document.getElementById('view-' + name);
  if (t) t.classList.add('active');
  updateNavbar();
}

function goHome() {
  if (!state.currentUser)                     showView('menu');
  else if (state.currentUser.role === 'boss') showView('boss');
  else                                         showView('waiter');
}

function updateNavbar() {
  const area       = document.getElementById('nav-user-area');
  const searchWrap = document.getElementById('nav-search-wrap');
  if (state.currentUser) {
    const isBoss = state.currentUser.role === 'boss';
    area.innerHTML = `
      <div class="nav-user">
        <div class="avatar">${state.currentUser.name[0]}</div>
        <span>${state.currentUser.name}</span>
        <span class="badge ${isBoss ? 'badge-orange' : 'badge-blue'}">${isBoss ? 'Jefe' : 'Mesero'}</span>
        <button class="btn btn-secondary btn-sm" onclick="logout()">
          <i class="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>`;
    if (searchWrap) searchWrap.classList.remove('hidden');
  } else {
    area.innerHTML = `
      <button class="btn btn-outline btn-sm" onclick="showView('login')">
        <i class="fa-solid fa-right-to-bracket"></i> Login
      </button>`;
    if (searchWrap) searchWrap.classList.add('hidden');
  }
}


/* ==========================================================
   6. BÚSQUEDA GLOBAL
========================================================== */
function globalSearch(query) {
  const dd = document.getElementById('search-dropdown');
  if (!query || query.trim().length < 2) { dd.classList.add('hidden'); return; }
  const q = query.toLowerCase();

  const products = state.products.filter(p =>
    p.status === 'active' &&
    (p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q))
  ).slice(0, 6);

  const tables = state.tables.filter(t =>
    String(t.num).includes(q) || `piso ${t.floor}`.includes(q) || `mesa ${t.num}`.includes(q)
  ).slice(0, 5);

  let html = '';

  if (products.length) {
    html += `<div class="search-group-title"><i class="fa-solid fa-burger"></i> Productos</div>`;
    html += products.map(p => `
      <div class="search-result-item" onmousedown="searchSelectProduct(${p.id})">
        <span class="sr-emoji">${p.emoji}</span>
        <div class="sr-info">
          <div class="sr-name">${p.name}</div>
          <div class="sr-sub">${p.cat}</div>
        </div>
        <span class="sr-price">${fmtPrice(p.price)}</span>
      </div>`).join('');
  }

  if (tables.length) {
    html += `<div class="search-group-title"><i class="fa-solid fa-table-cells"></i> Mesas</div>`;
    html += tables.map(t => {
      const ord = getOrderForTable(t.id);
      const icon = t.status === 'free' ? '🟢' : t.status === 'pending_payment' ? '💛' : '🔴';
      return `
        <div class="search-result-item" onmousedown="searchSelectTable(${t.id})">
          <span class="sr-emoji">${icon}</span>
          <div class="sr-info">
            <div class="sr-name">Mesa ${t.num} — Piso ${t.floor}</div>
            <div class="sr-sub">${tableStatusLabel(t)}${ord ? ' · ' + fmtPrice(orderTotal(ord.id)) : ''}</div>
          </div>
        </div>`;
    }).join('');
  }

  if (!html) html = `<div class="search-no-results"><i class="fa-solid fa-magnifying-glass"></i> Sin resultados para "${query}"</div>`;

  dd.innerHTML = html;
  dd.classList.remove('hidden');
}

function openSearchDropdown() {
  const val = document.getElementById('global-search').value;
  if (val && val.trim().length >= 2) globalSearch(val);
}
function closeSearchDropdown() {
  setTimeout(() => {
    const dd = document.getElementById('search-dropdown');
    if (dd) dd.classList.add('hidden');
  }, 150);
}
function searchSelectProduct(pid) {
  document.getElementById('global-search').value = '';
  document.getElementById('search-dropdown').classList.add('hidden');
  if (state.activeOrderId) openAddProduct(pid);
  else { notify('Selecciona una mesa para agregar productos', 'info'); }
}
function searchSelectTable(tableId) {
  document.getElementById('global-search').value = '';
  document.getElementById('search-dropdown').classList.add('hidden');
  if (!state.currentUser) { notify('Inicia sesión primero', 'error'); return; }
  const t = state.tables.find(x => x.id === tableId);
  if (!t) return;
  state.selectedFloor = t.floor;
  if (state.currentUser.role === 'boss') { showView('boss'); bossSelectTable(tableId); }
  else                                    { showView('waiter'); selectTableWaiter(tableId); }
}


/* ==========================================================
   7. AUTENTICACIÓN
========================================================== */
function doLogin() {
  const username = document.getElementById('login-user').value.trim();
  const password = document.getElementById('login-pass').value.trim();
  const user = USERS.find(u => u.username === username && u.password === password);
  if (!user) { notify('Usuario o contraseña incorrectos', 'error'); return; }
  state.currentUser = user;
  notify(`Bienvenido, ${user.name}! 👋`, 'success');
  if (user.role === 'boss') { showView('boss'); bossSection('dashboard'); }
  else                       { showView('waiter'); waiterSection('tables'); }
}

function logout() {
  state.currentUser  = null;
  state.selectedTable = null;
  state.activeOrderId = null;
  notify('Sesión cerrada', 'info');
  showView('menu');
}


/* ==========================================================
   8. HELPERS
========================================================== */
function fmtPrice(p) { return '$' + Number(p).toLocaleString('es-CO'); }
function genId(key)  { return ++state.nextId[key]; }

function getCatClass(cat) {
  return { 'Hamburguesas':'cat-hamburguesas','Especiales':'cat-especiales','Hot Dog':'cat-hot-dog',
           'Bebidas':'cat-bebidas','Infantil':'cat-infantil','Entradas':'cat-entradas' }[cat] || 'cat-entradas';
}

/** Pedido activo o pendiente de pago para una mesa */
function getOrderForTable(tableId) {
  return state.orders.find(o => o.tableId === tableId && (o.status === 'active' || o.status === 'pending_payment'));
}
function getOrderItems(orderId)  { return state.orderItems.filter(i => i.orderId === orderId); }
function orderTotal(orderId)     {
  return state.orderItems.filter(i => i.orderId === orderId && i.status === 'active')
                          .reduce((sum, i) => sum + i.price * i.qty, 0);
}
function tableStatusLabel(t)     {
  return { free:'Libre', occupied:'Ocupada', pending_payment:'Pago pendiente' }[t.status] || t.status;
}
function tableCardClass(t, sel)  {
  const s = { free:'free', occupied:'occupied', pending_payment:'pending-payment' }[t.status] || 'free';
  return `table-card ${s}${sel ? ' selected' : ''}`;
}
function tableIcon(t) {
  return { free:'🟢', occupied:'🍽️', pending_payment:'💛' }[t.status] || '🟢';
}


/* ==========================================================
   9. MENÚ PÚBLICO
========================================================== */
let menuFilter = 'all';

function renderPublicMenu(filter) {
  menuFilter = filter || menuFilter;
  const grid   = document.getElementById('menu-grid');
  const ctaBar = document.getElementById('menu-cta');
  grid.innerHTML = state.products.filter(p =>
    p.status === 'active' && (menuFilter === 'all' || p.cat === menuFilter)
  ).map(p => `
    <div class="product-card">
      <div class="prod-img">
        <span style="font-size:72px">${p.emoji}</span>
        <span class="prod-cat ${getCatClass(p.cat)}">${p.cat}</span>
      </div>
      <div class="prod-body">
        <div class="prod-name">${p.name}</div>
        <div class="prod-desc">${p.desc}</div>
        <div class="prod-price">${fmtPrice(p.price)}</div>
      </div>
    </div>`).join('');
  if (state.currentUser) ctaBar.classList.add('hidden');
  else                    ctaBar.classList.remove('hidden');
}

function filterMenu(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderPublicMenu(cat);
}


/* ==========================================================
   10. PANEL MESERO
========================================================== */
function waiterSection(sec) {
  document.querySelectorAll('#waiter-sidebar .sidebar-nav-item').forEach(i => i.classList.remove('active'));
  if (event && event.target) { const it = event.target.closest('.sidebar-nav-item'); if (it) it.classList.add('active'); }
  const content = document.getElementById('waiter-content');
  if      (sec === 'tables')       renderWaiterTables(content);
  else if (sec === 'order')        renderActiveOrder(content);
  else if (sec === 'menu-preview') renderMenuPreview(content);
}

function renderWaiterTables(container) {
  const myTableIds = state.orders
    .filter(o => o.waiterId === state.currentUser.id && (o.status === 'active' || o.status === 'pending_payment'))
    .map(o => o.tableId);
  container.innerHTML = `
    <div class="panel-header">
      <h2>Mis Mesas</h2>
      <p>Selecciona una mesa para ver o crear un pedido · 🟢 Libre &nbsp; 🔴 Ocupada &nbsp; 💛 Pago pendiente</p>
    </div>
    ${renderFloorTabs('waiter')}
    ${renderFloorTables(myTableIds, false)}`;
}

/** Tabs de pisos */
function renderFloorTabs(ctx) {
  const count = (fl) => state.tables.filter(t => t.floor === fl && t.status !== 'free').length;
  const total = (fl) => state.tables.filter(t => t.floor === fl).length;
  return `
    <div class="floor-tabs">
      <button class="floor-tab ${state.selectedFloor===1?'active':''}" onclick="switchFloor(1,'${ctx}')">
        <i class="fa-solid fa-1"></i> Piso 1
        <span class="floor-count">${count(1)}/${total(1)}</span>
      </button>
      <button class="floor-tab ${state.selectedFloor===2?'active':''}" onclick="switchFloor(2,'${ctx}')">
        <i class="fa-solid fa-2"></i> Piso 2
        <span class="floor-count">${count(2)}/${total(2)}</span>
      </button>
    </div>`;
}

/** Grid de mesas del piso activo */
function renderFloorTables(myTableIds, isBoss) {
  const tables = state.tables.filter(t => t.floor === state.selectedFloor);
  return `
    <div class="floor-section-label">
      <h3><i class="fa-solid fa-building"></i> Piso ${state.selectedFloor}</h3>
    </div>
    <div class="tables-grid">
      ${tables.map(t => {
        const ord   = getOrderForTable(t.id);
        const total = ord ? orderTotal(ord.id) : 0;
        const isMine = myTableIds.includes(t.id);
        return `
          <div class="${tableCardClass(t, state.selectedTable === t.id)}"
               onclick="${isBoss ? `bossSelectTable(${t.id})` : `selectTableWaiter(${t.id})`}">
            <div class="table-icon">${tableIcon(t)}</div>
            <div class="table-num">${t.num}</div>
            <div class="table-status">
              ${t.status==='pending_payment' ? 'Pago pendiente'
                : t.status==='occupied' ? (isMine && !isBoss ? 'Mi pedido' : 'Ocupada')
                : 'Libre'}
            </div>
            ${ord ? `<div class="table-total">${fmtPrice(total)}</div>` : ''}
          </div>`;
      }).join('')}
    </div>`;
}

function switchFloor(floor, ctx) {
  state.selectedFloor = floor;
  if (ctx === 'waiter') waiterSection('tables');
  else                   bossSection('tables');
}

function selectTableWaiter(tableId) {
  const ord = getOrderForTable(tableId);
  if (ord && ord.status === 'pending_payment') {
    notify('Mesa en espera de pago — Solo el Jefe puede cobrarla y liberarla', 'error'); return;
  }
  if (ord && ord.waiterId !== state.currentUser.id) {
    notify('Esta mesa tiene un pedido de otro mesero', 'error'); return;
  }
  state.selectedTable = tableId;
  state.activeOrderId = ord ? ord.id : null;
  notify(`Mesa ${state.tables.find(t=>t.id===tableId)?.num} seleccionada`, 'info');
  renderOrderPanel(document.getElementById('waiter-content'), false);
}

function renderMenuPreview(container) {
  container.innerHTML = `<div class="panel-header"><h2>Menú</h2><p>Vista de referencia</p></div>`;
  const grid = document.createElement('div');
  grid.className = 'menu-grid';
  grid.innerHTML = state.products.filter(p => p.status === 'active').map(p => `
    <div class="product-card">
      <div class="prod-img"><span style="font-size:72px">${p.emoji}</span>
        <span class="prod-cat ${getCatClass(p.cat)}">${p.cat}</span></div>
      <div class="prod-body">
        <div class="prod-name">${p.name}</div>
        <div class="prod-desc">${p.desc}</div>
        <div class="prod-price">${fmtPrice(p.price)}</div>
      </div></div>`).join('');
  container.appendChild(grid);
}

function renderActiveOrder(container) {
  if (!state.selectedTable) {
    container.innerHTML = `
      <div class="panel-header"><h2>Pedido Activo</h2></div>
      <div class="card" style="text-align:center;padding:60px;">
        <i class="fa-solid fa-table-cells" style="font-size:48px;color:var(--text-dim);"></i>
        <p style="color:var(--text-muted);margin-top:16px;font-weight:700;">Primero selecciona una mesa</p>
      </div>`;
    return;
  }
  renderOrderPanel(container, state.currentUser && state.currentUser.role === 'boss');
}


/* ==========================================================
   11. PANEL DE PEDIDO
========================================================== */
function renderOrderPanel(container, isBoss) {
  const tableId  = state.selectedTable;
  const table    = state.tables.find(t => t.id === tableId);
  const order    = getOrderForTable(tableId);
  const isPending = order && order.status === 'pending_payment';

  container.innerHTML = `
    <div class="panel-header" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
      <div>
        <h2>Mesa ${table?.num || '?'} — Piso ${table?.floor || '?'}</h2>
        <p>
          ${order ? `Pedido #${order.id}` : 'Sin pedido activo'}
          ${isPending ? `<span class="badge badge-yellow" style="margin-left:8px;">
            <i class="fa-solid fa-lock"></i> Pago pendiente</span>` : ''}
        </p>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        ${!order ? `<button class="btn btn-success" onclick="createOrder(${tableId})">
          <i class="fa-solid fa-plus"></i> Nuevo Pedido</button>` : ''}
        ${isBoss && order ? `<button class="btn btn-blue btn-sm" onclick="openMoveTable()">
          <i class="fa-solid fa-arrows-alt"></i> Cambiar Mesa</button>` : ''}
        ${order && !isPending ? `<button class="btn btn-danger btn-sm" onclick="requestPayment(${order.id})">
          <i class="fa-solid fa-money-bill-wave"></i> Solicitar Pago</button>` : ''}
        ${isBoss && isPending ? `<button class="btn btn-success btn-sm" onclick="openPaymentModal(${order.id})">
          <i class="fa-solid fa-circle-check"></i> Cobrar y Liberar</button>` : ''}
        <button class="btn btn-secondary btn-sm"
          onclick="${isBoss ? 'bossSection(\'tables\')' : 'waiterSection(\'tables\')'}">
          <i class="fa-solid fa-arrow-left"></i> Volver</button>
      </div>
    </div>

    <div class="order-layout">
      <div class="products-panel">
        <div class="search-bar">
          <input class="form-control" id="prod-search" placeholder="🔍 Buscar producto..."
                 oninput="filterOrderProducts()" ${!order || isPending ? 'disabled' : ''}>
          <select class="form-control" id="prod-cat-filter" style="max-width:160px;"
                  onchange="filterOrderProducts()" ${!order || isPending ? 'disabled' : ''}>
            <option value="">Todas</option>
            <option>Hamburguesas</option><option>Especiales</option>
            <option>Hot Dog</option><option>Bebidas</option>
            <option>Infantil</option><option>Entradas</option>
          </select>
        </div>
        ${isPending ? `
          <div style="padding:40px;text-align:center;color:var(--text-muted);">
            <i class="fa-solid fa-lock" style="font-size:48px;color:#f0c040;"></i>
            <p style="margin-top:12px;font-weight:800;font-size:16px;">Pedido bloqueado</p>
            <p style="font-size:12px;margin-top:6px;">Esperando confirmación de pago por el Jefe</p>
          </div>` : ''}
        <div class="order-products-grid" id="order-prods-grid"></div>
      </div>

      <div class="cart-panel">
        <div class="cart-header">
          <h3><i class="fa-solid fa-receipt"></i> Pedido</h3>
          ${order ? `<span class="badge ${isPending ? 'badge-yellow' : 'badge-orange'}">#${order.id}</span>`
                  : `<span class="badge badge-green">Sin pedido</span>`}
        </div>
        <div class="cart-items" id="cart-items">${renderCartItems(order?.id, isPending)}</div>
        <div class="cart-footer">${renderCartSummary(order?.id)}</div>
      </div>
    </div>`;

  if (!isPending) filterOrderProducts();
}

function filterOrderProducts() {
  const search = (document.getElementById('prod-search')?.value || '').toLowerCase();
  const cat    = document.getElementById('prod-cat-filter')?.value || '';
  const grid   = document.getElementById('order-prods-grid');
  if (!grid) return;
  grid.innerHTML = state.products.filter(p =>
    p.status === 'active' &&
    (!cat    || p.cat === cat) &&
    (!search || p.name.toLowerCase().includes(search) || p.cat.toLowerCase().includes(search))
  ).map(p => `
    <div class="order-product-card" onclick="openAddProduct(${p.id})">
      <span class="op-emoji">${p.emoji}</span>
      <span class="op-name">${p.name}</span>
      <span class="op-cat">${p.cat}</span>
      <span class="op-price">${fmtPrice(p.price)}</span>
    </div>`).join('');
}

function renderCartItems(orderId, locked) {
  if (!orderId) return `<div class="cart-empty"><i class="fa-solid fa-receipt"></i><p>Crea un pedido para empezar</p></div>`;
  const items = getOrderItems(orderId);
  if (!items.length) return `<div class="cart-empty"><i class="fa-solid fa-plus-circle"></i><p>Selecciona productos del catálogo</p></div>`;
  return items.map(item => {
    const prod = state.products.find(p => p.id === item.productId);
    const cancelled = item.status === 'cancelled';
    return `
      <div class="cart-item ${cancelled ? 'cancelled' : ''}" id="cart-item-${item.id}">
        <span class="ci-emoji">${prod?.emoji || '🍔'}</span>
        <div class="ci-info">
          <div class="ci-name">${prod?.name || 'Producto'} ${item.qty > 1 ? `×${item.qty}` : ''}</div>
          <div class="ci-price">${fmtPrice(item.price * item.qty)}</div>
          ${item.notes ? `<div class="ci-notes">${item.notes}</div>` : ''}
          ${cancelled ? '<span class="ci-cancelled-badge">Cancelado</span>' : ''}
        </div>
        ${!locked ? (!cancelled
          ? `<button class="ci-cancel-btn" onclick="cancelItem(${item.id})"><i class="fa-solid fa-xmark"></i></button>`
          : `<button class="ci-cancel-btn" onclick="reactivateItem(${item.id})" style="color:var(--green)"><i class="fa-solid fa-rotate-left"></i></button>`)
        : ''}
      </div>`;
  }).join('');
}

function renderCartSummary(orderId) {
  if (!orderId) return `<div class="cart-summary"><div class="summary-row total"><span>TOTAL</span><span>${fmtPrice(0)}</span></div></div>`;
  const items     = getOrderItems(orderId);
  const active    = items.filter(i => i.status === 'active');
  const cancelled = items.filter(i => i.status === 'cancelled');
  const total     = orderTotal(orderId);
  return `
    <div class="cart-summary">
      <div class="summary-row"><span>Productos activos</span><span>${active.length}</span></div>
      ${cancelled.length ? `<div class="summary-row"><span style="color:var(--red)">Cancelados</span><span style="color:var(--red)">${cancelled.length}</span></div>` : ''}
      <div class="summary-row total"><span>TOTAL</span><span>${fmtPrice(total)}</span></div>
    </div>`;
}

function refreshCart(orderId) {
  const order  = state.orders.find(o => o.id === orderId);
  const locked = order && order.status === 'pending_payment';
  const ciEl = document.getElementById('cart-items');
  const cfEl = document.querySelector('.cart-footer');
  if (ciEl) ciEl.innerHTML = renderCartItems(orderId, locked);
  if (cfEl) cfEl.innerHTML = renderCartSummary(orderId);
}


/* ==========================================================
   12. GESTIÓN DE PEDIDOS
========================================================== */
function createOrder(tableId) {
  const id = genId('order');
  state.orders.push({ id, tableId, waiterId: state.currentUser.id, createdAt: new Date().toISOString(), status: 'active' });
  const table = state.tables.find(t => t.id === tableId);
  if (table) table.status = 'occupied';
  state.activeOrderId = id;
  saveState();
  notify('Pedido creado ✅', 'success');
  const cont = state.currentUser.role === 'boss' ? document.getElementById('boss-content') : document.getElementById('waiter-content');
  renderOrderPanel(cont, state.currentUser.role === 'boss');
}

/**
 * Marca el pedido como "pendiente de pago".
 * La mesa queda bloqueada (estado pending_payment) hasta que el Jefe cobre.
 */
function requestPayment(orderId) {
  if (!confirm('¿Marcar este pedido como listo para cobrar?\nLa mesa quedará bloqueada hasta que el Jefe confirme el pago.')) return;
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;
  order.status = 'pending_payment';
  const table = state.tables.find(t => t.id === order.tableId);
  if (table) table.status = 'pending_payment';
  state.selectedTable = null;
  state.activeOrderId = null;
  saveState();
  notify('Pedido enviado a cobro 💛 — Esperando al Jefe', 'info');
  if (state.currentUser.role === 'boss') bossSection('tables');
  else                                    waiterSection('tables');
}


/* ==========================================================
   13. MODAL DE PAGO — SOLO JEFE
========================================================== */
function openPaymentModal(orderId) {
  if (state.currentUser?.role !== 'boss') { notify('Solo el Jefe puede confirmar pagos', 'error'); return; }
  state.paymentOrderId = orderId;
  const order = state.orders.find(o => o.id === orderId);
  const table = state.tables.find(t => t.id === order.tableId);
  const items = getOrderItems(orderId);
  const total = orderTotal(orderId);

  document.getElementById('payment-summary').innerHTML = `
    <div class="ps-table">Mesa ${table?.num} — Piso ${table?.floor} · Pedido #${orderId}</div>
    <div class="ps-items">
      ${items.map(i => {
        const p = state.products.find(x => x.id === i.productId);
        return `<div class="ps-item ${i.status==='cancelled'?'cancelled':''}">
          <span>${p?.emoji||''} ${p?.name||'?'} ×${i.qty}</span>
          <span>${fmtPrice(i.price * i.qty)}</span>
        </div>`;
      }).join('')}
    </div>
    <div class="ps-total"><span>TOTAL A COBRAR</span><span>${fmtPrice(total)}</span></div>`;

  document.getElementById('payment-received').value = '';
  document.getElementById('payment-change').classList.add('hidden');
  document.getElementById('payment-method').value = 'efectivo';
  document.getElementById('modal-payment').classList.remove('hidden');
}

function calcChange() {
  const orderId  = state.paymentOrderId;
  if (!orderId) return;
  const total    = orderTotal(orderId);
  const received = parseFloat(document.getElementById('payment-received').value) || 0;
  const changeEl = document.getElementById('payment-change');
  if (received >= total) {
    changeEl.textContent = `💵 Cambio a devolver: ${fmtPrice(received - total)}`;
    changeEl.classList.remove('hidden');
  } else {
    changeEl.classList.add('hidden');
  }
}

function confirmPayment() {
  const orderId = state.paymentOrderId;
  if (!orderId) return;
  const order  = state.orders.find(o => o.id === orderId);
  const table  = state.tables.find(t => t.id === order.tableId);
  const method = document.getElementById('payment-method').value;
  order.status    = 'paid';
  order.paidAt    = new Date().toISOString();
  order.payMethod = method;
  order.totalPaid = orderTotal(orderId);
  table.status    = 'free';          // ← Mesa liberada SOLO aquí
  state.selectedTable  = null;
  state.activeOrderId  = null;
  state.paymentOrderId = null;
  saveState();
  closeModal('modal-payment');
  notify(`✅ Pago confirmado — Mesa ${table.num} (Piso ${table.floor}) LIBERADA`, 'success');
  bossSection('tables');
}


/* ==========================================================
   14. MODAL: AGREGAR PRODUCTO AL PEDIDO
========================================================== */
function openAddProduct(pid) {
  if (!state.activeOrderId) { notify('Primero crea un pedido para esta mesa', 'error'); return; }
  const prod = state.products.find(p => p.id === pid);
  if (!prod) return;
  state.addPid = pid; state.addQty = 1;
  document.getElementById('modal-qty-title').textContent = prod.name;
  document.getElementById('modal-qty-emoji').textContent = prod.emoji;
  document.getElementById('modal-qty-desc').textContent  = prod.desc;
  document.getElementById('modal-qty-price').textContent = fmtPrice(prod.price);
  document.getElementById('modal-qty-val').textContent   = '1';
  document.getElementById('modal-qty-notes').value       = '';
  document.getElementById('modal-qty-pid').value         = pid;
  document.getElementById('modal-qty').classList.remove('hidden');
}
function changeQty(delta) {
  state.addQty = Math.max(1, (state.addQty || 1) + delta);
  document.getElementById('modal-qty-val').textContent = state.addQty;
}
function confirmAddToOrder() {
  const pid   = parseInt(document.getElementById('modal-qty-pid').value);
  const qty   = state.addQty || 1;
  const notes = document.getElementById('modal-qty-notes').value.trim();
  const prod  = state.products.find(p => p.id === pid);
  if (!prod || !state.activeOrderId) return;
  state.orderItems.push({ id: genId('item'), orderId: state.activeOrderId, productId: pid, qty, price: prod.price, notes, status: 'active' });
  saveState();
  closeModal('modal-qty');
  notify(`${prod.emoji} ${prod.name} agregado`, 'success');
  refreshCart(state.activeOrderId);
}
function cancelItem(itemId) {
  const item = state.orderItems.find(i => i.id === itemId);
  if (!item) return;
  item.status = 'cancelled';
  saveState();
  notify(`${state.products.find(p=>p.id===item.productId)?.name||'Producto'} cancelado`, 'error');
  refreshCart(state.activeOrderId || item.orderId);
}
function reactivateItem(itemId) {
  const item = state.orderItems.find(i => i.id === itemId);
  if (!item) return;
  item.status = 'active';
  saveState();
  notify(`${state.products.find(p=>p.id===item.productId)?.name||'Producto'} reactivado`, 'success');
  refreshCart(state.activeOrderId || item.orderId);
}


/* ==========================================================
   15. MODAL: CAMBIO DE MESA
========================================================== */
function openMoveTable() {
  state.moveTableTarget = null;
  const grid = document.getElementById('move-tables-grid');
  const renderFloorSm = (fl) => {
    const tables = state.tables.filter(t => t.floor === fl && t.id !== state.selectedTable);
    return `
      <div style="font-size:11px;font-weight:800;text-transform:uppercase;color:var(--text-dim);margin:10px 0 6px;">
        <i class="fa-solid fa-${fl}"></i> Piso ${fl}
      </div>
      <div class="tables-grid-sm" style="margin-top:0;">
        ${tables.map(t => {
          const has = !!getOrderForTable(t.id);
          return `<div class="table-sm ${has ? 'occupied' : ''}" onclick="selectMoveTarget(${t.id}, this)">
            <div class="ts-num">${t.num}</div>
            <div class="ts-status">${has ? 'Ocupada' : 'Libre'}</div>
          </div>`;
        }).join('')}
      </div>`;
  };
  grid.innerHTML = renderFloorSm(1) + renderFloorSm(2);
  document.getElementById('modal-move').classList.remove('hidden');
}
function selectMoveTarget(tableId, el) {
  document.querySelectorAll('.table-sm').forEach(t => t.classList.remove('selected'));
  el.classList.add('selected');
  state.moveTableTarget = tableId;
}
function confirmMoveTable() {
  if (!state.moveTableTarget) { notify('Selecciona una mesa destino', 'error'); return; }
  if (getOrderForTable(state.moveTableTarget)) { notify('La mesa destino ya tiene un pedido', 'error'); return; }
  const order    = getOrderForTable(state.selectedTable);
  if (!order) return;
  const oldTable = state.tables.find(t => t.id === state.selectedTable);
  const newTable = state.tables.find(t => t.id === state.moveTableTarget);
  oldTable.status = 'free';
  newTable.status = order.status === 'pending_payment' ? 'pending_payment' : 'occupied';
  order.tableId   = state.moveTableTarget;
  state.selectedTable = state.moveTableTarget;
  state.selectedFloor = newTable.floor;
  saveState();
  closeModal('modal-move');
  notify(`Pedido movido a Mesa ${newTable.num} — Piso ${newTable.floor} ✅`, 'success');
  bossSection('tables');
}


/* ==========================================================
   16. PANEL JEFE
========================================================== */
function bossSection(sec) {
  document.querySelectorAll('#boss-sidebar .sidebar-nav-item').forEach(i => i.classList.remove('active'));
  if (event && event.target) { const it = event.target.closest('.sidebar-nav-item'); if (it) it.classList.add('active'); }
  const content = document.getElementById('boss-content');
  if      (sec === 'dashboard') renderDashboard(content);
  else if (sec === 'tables')    renderBossTables(content);
  else if (sec === 'orders')    renderAllOrders(content);
  else if (sec === 'products')  renderProductAdmin(content);
}

function renderDashboard(content) {
  const totalProds    = state.products.filter(p => p.status === 'active').length;
  const occupiedCount = state.tables.filter(t => t.status !== 'free').length;
  const activeCount   = state.orders.filter(o => o.status === 'active').length;
  const pendingCount  = state.orders.filter(o => o.status === 'pending_payment').length;
  const paidRevenue   = state.orders.filter(o => o.status === 'paid')
    .reduce((s, o) => s + state.orderItems.filter(i => i.orderId === o.id && i.status === 'active').reduce((ss, i) => ss + i.price * i.qty, 0), 0);

  const pendingAlerts = state.orders.filter(o => o.status === 'pending_payment').map(o => {
    const t = state.tables.find(x => x.id === o.tableId);
    return `<button class="btn btn-sm" style="background:#f0c040;color:#1a1200;"
              onclick="openPaymentModal(${o.id})">
              <i class="fa-solid fa-money-bill-wave"></i>
              Mesa ${t?.num} Piso ${t?.floor} · ${fmtPrice(orderTotal(o.id))}
            </button>`;
  }).join('');

  content.innerHTML = `
    <div class="panel-header">
      <h2>Dashboard</h2>
      <p>Bienvenido, ${state.currentUser.name}</p>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-label">Productos Activos</div><div class="stat-value">${totalProds}</div><div class="stat-sub">en el menú</div></div>
      <div class="stat-card"><div class="stat-label">Mesas Ocupadas</div><div class="stat-value">${occupiedCount}</div><div class="stat-sub">de ${state.tables.length} totales</div></div>
      <div class="stat-card"><div class="stat-label">Pedidos Activos</div><div class="stat-value">${activeCount}</div><div class="stat-sub">en atención</div></div>
      <div class="stat-card" style="border-color:rgba(240,192,64,0.4)">
        <div class="stat-label" style="color:#f0c040">Pago Pendiente</div>
        <div class="stat-value" style="color:#f0c040">${pendingCount}</div>
        <div class="stat-sub">esperando cobro</div>
      </div>
      <div class="stat-card"><div class="stat-label">Ventas Cobradas</div><div class="stat-value" style="font-size:26px">${fmtPrice(paidRevenue)}</div><div class="stat-sub">sesión actual</div></div>
    </div>
    ${pendingCount > 0 ? `
      <div style="background:rgba(240,192,64,0.08);border:1px solid rgba(240,192,64,0.3);border-radius:var(--radius);padding:16px 20px;margin-bottom:20px;">
        <h3 style="font-size:18px;color:#f0c040;margin-bottom:12px;"><i class="fa-solid fa-triangle-exclamation"></i> Mesas esperando cobro</h3>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">${pendingAlerts}</div>
      </div>` : ''}
    <div class="panel-header" style="margin-top:8px;"><h2 style="font-size:28px">Mesas en vivo</h2></div>
    ${renderFloorTabs('boss')}
    ${renderFloorTables([], true)}`;
}

function renderBossTables(content) {
  content.innerHTML = `
    <div class="panel-header" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
      <div><h2>Todas las Mesas</h2><p>Selecciona una mesa · 💛 = pago pendiente</p></div>
    </div>
    ${renderFloorTabs('boss')}
    ${renderFloorTables([], true)}
    ${state.selectedTable ? '<div id="boss-order-inline" style="margin-top:24px;"></div>' : ''}`;

  if (state.selectedTable) {
    const ord = getOrderForTable(state.selectedTable);
    state.activeOrderId = ord ? ord.id : null;
    renderOrderPanel(document.getElementById('boss-order-inline'), true);
  }
}

function bossSelectTable(tableId) {
  state.selectedTable = tableId;
  const ord = getOrderForTable(tableId);
  state.activeOrderId = ord ? ord.id : null;
  renderBossTables(document.getElementById('boss-content'));
}

function renderAllOrders(content) {
  const active  = state.orders.filter(o => o.status === 'active');
  const pending = state.orders.filter(o => o.status === 'pending_payment');
  const paid    = state.orders.filter(o => o.status === 'paid').slice(-15).reverse();

  const card = (ord) => {
    const t  = state.tables.find(x => x.id === ord.tableId);
    const w  = USERS.find(u => u.id === ord.waiterId);
    const items = getOrderItems(ord.id);
    const total = orderTotal(ord.id);
    const badgeMap = { active:'badge-green', pending_payment:'badge-yellow', paid:'badge-orange' };
    const labelMap = { active:'Activo', pending_payment:'Pago Pendiente', paid:'Cobrado' };
    return `
      <div class="order-card">
        <div class="order-card-header">
          <h4>Pedido #${ord.id} — Mesa ${t?.num||'?'} · Piso ${t?.floor||'?'}</h4>
          <div style="display:flex;gap:8px;align-items:center;">
            <span class="badge ${badgeMap[ord.status]||'badge-orange'}">${labelMap[ord.status]||ord.status}</span>
            <span style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:var(--accent)">${fmtPrice(total)}</span>
            ${ord.status === 'pending_payment' ? `<button class="btn btn-success btn-sm" onclick="openPaymentModal(${ord.id})">
              <i class="fa-solid fa-money-bill-wave"></i> Cobrar</button>` : ''}
          </div>
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;">
          Mesero: ${w?.name||'?'} · ${new Date(ord.createdAt).toLocaleTimeString('es-CO')}
          ${ord.payMethod ? ` · ${ord.payMethod}` : ''}
        </div>
        <div class="order-items-mini">
          ${items.map(i => {
            const p = state.products.find(x => x.id === i.productId);
            return `<span class="order-item-mini ${i.status==='cancelled'?'cancelled':''}">${p?.emoji||''} ${p?.name||'?'} ×${i.qty}</span>`;
          }).join('')}
        </div>
      </div>`;
  };

  content.innerHTML = `
    <div class="panel-header"><h2>Todos los Pedidos</h2><p>Activos, pendientes y cobrados</p></div>
    <h3 style="font-size:22px;margin-bottom:12px;color:#f0c040"><i class="fa-solid fa-clock"></i> Pago Pendiente (${pending.length})</h3>
    <div class="orders-list">${pending.length ? pending.map(card).join('') : '<p style="color:var(--text-muted);font-size:13px">Ninguno</p>'}</div>
    <h3 style="font-size:22px;margin:24px 0 12px;color:var(--accent)"><i class="fa-solid fa-fire"></i> Activos (${active.length})</h3>
    <div class="orders-list">${active.length ? active.map(card).join('') : '<p style="color:var(--text-muted);font-size:13px">Ninguno</p>'}</div>
    <h3 style="font-size:22px;margin:24px 0 12px;color:var(--green)"><i class="fa-solid fa-circle-check"></i> Cobrados recientemente</h3>
    <div class="orders-list">${paid.length ? paid.map(card).join('') : '<p style="color:var(--text-muted);font-size:13px">Ninguno aún</p>'}</div>`;
}


/* ==========================================================
   17. CRUD DE PRODUCTOS
========================================================== */
function renderProductAdmin(content) {
  content.innerHTML = `
    <div class="panel-header"><h2>Gestión de Productos</h2><p>Crea, edita o desactiva productos del menú</p></div>
    <div class="admin-toolbar">
      <button class="btn btn-primary" onclick="openProductModal()"><i class="fa-solid fa-plus"></i> Nuevo Producto</button>
      <input class="form-control" id="admin-search" style="max-width:220px" placeholder="Buscar..." oninput="renderProductTable()">
      <select class="form-control" id="admin-cat" style="max-width:160px" onchange="renderProductTable()">
        <option value="">Todas</option>
        <option>Hamburguesas</option><option>Especiales</option><option>Hot Dog</option>
        <option>Bebidas</option><option>Infantil</option><option>Entradas</option>
      </select>
    </div>
    <div style="overflow-x:auto">
      <table class="admin-products-table">
        <thead><tr><th></th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody id="prod-tbody"></tbody>
      </table>
    </div>`;
  renderProductTable();
}

function renderProductTable() {
  const tbody  = document.getElementById('prod-tbody');
  if (!tbody) return;
  const search = (document.getElementById('admin-search')?.value || '').toLowerCase();
  const cat    = document.getElementById('admin-cat')?.value || '';
  tbody.innerHTML = state.products.filter(p =>
    (!cat || p.cat === cat) && (!search || p.name.toLowerCase().includes(search))
  ).map(p => `
    <tr>
      <td><div class="prod-thumb">${p.emoji}</div></td>
      <td><strong>${p.name}</strong><br><span style="font-size:11px;color:var(--text-muted)">${p.desc.substring(0,60)}…</span></td>
      <td><span class="badge ${getCatClass(p.cat)}">${p.cat}</span></td>
      <td style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:var(--accent)">${fmtPrice(p.price)}</td>
      <td><span class="badge ${p.status==='active'?'badge-green':'badge-red'}">${p.status==='active'?'Activo':'Inactivo'}</span></td>
      <td>
        <div style="display:flex;gap:6px">
          <button class="btn btn-secondary btn-sm btn-icon" onclick="openProductModal(${p.id})" title="Editar"><i class="fa-solid fa-pen"></i></button>
          <button class="btn btn-sm ${p.status==='active'?'btn-danger':'btn-success'}" onclick="toggleProductStatus(${p.id})">
            <i class="fa-solid ${p.status==='active'?'fa-eye-slash':'fa-eye'}"></i></button>
          <button class="btn btn-danger btn-sm btn-icon" onclick="deleteProduct(${p.id})" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>`).join('');
}

function openProductModal(id) {
  const modal = document.getElementById('modal-product');
  if (id) {
    const p = state.products.find(x => x.id === id);
    if (!p) return;
    document.getElementById('modal-prod-title').textContent = 'Editar Producto';
    document.getElementById('prod-name').value    = p.name;
    document.getElementById('prod-desc').value    = p.desc;
    document.getElementById('prod-price').value   = p.price;
    document.getElementById('prod-cat').value     = p.cat;
    document.getElementById('prod-emoji').value   = p.emoji;
    document.getElementById('prod-status').value  = p.status;
    document.getElementById('prod-edit-id').value = p.id;
  } else {
    document.getElementById('modal-prod-title').textContent = 'Nuevo Producto';
    ['prod-name','prod-desc','prod-price','prod-emoji'].forEach(i => document.getElementById(i).value = '');
    document.getElementById('prod-cat').value     = 'Hamburguesas';
    document.getElementById('prod-status').value  = 'active';
    document.getElementById('prod-edit-id').value = '';
  }
  modal.classList.remove('hidden');
}

function saveProduct() {
  const name   = document.getElementById('prod-name').value.trim();
  const desc   = document.getElementById('prod-desc').value.trim();
  const price  = parseFloat(document.getElementById('prod-price').value);
  const cat    = document.getElementById('prod-cat').value;
  const emoji  = document.getElementById('prod-emoji').value.trim() || CAT_EMOJI[cat] || '🍔';
  const status = document.getElementById('prod-status').value;
  const editId = document.getElementById('prod-edit-id').value;
  if (!name || !price) { notify('Nombre y precio son obligatorios', 'error'); return; }
  if (editId) {
    const prod = state.products.find(p => p.id === parseInt(editId));
    if (prod) Object.assign(prod, { name, desc, price, cat, emoji, status });
    notify(`${name} actualizado ✅`, 'success');
  } else {
    state.products.push({ id: genId('product'), name, desc, price, cat, emoji, status });
    notify(`${name} creado ✅`, 'success');
  }
  saveState(); closeModal('modal-product'); renderProductTable();
}

function toggleProductStatus(id) {
  const p = state.products.find(x => x.id === id);
  if (!p) return;
  p.status = p.status === 'active' ? 'inactive' : 'active';
  saveState();
  notify(`${p.name} ${p.status==='active'?'activado':'desactivado'}`, p.status==='active'?'success':'info');
  renderProductTable();
}

function deleteProduct(id) {
  if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return;
  state.products = state.products.filter(p => p.id !== id);
  saveState(); notify('Producto eliminado', 'error'); renderProductTable();
}


/* ==========================================================
   18. MODALES — cerrar
========================================================== */
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', function (e) {
    if (e.target === this) this.classList.add('hidden');
  });
});


/* ==========================================================
   19. INIT
========================================================== */
function init() {
  loadState();
  renderPublicMenu('all');
  updateNavbar();
}

init();
