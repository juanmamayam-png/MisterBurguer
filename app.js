/* ==========================================================
   MISTER BURGER — Sistema POS  |  app.js  v3
   Novedades:
     - Navbar público para clientes (Menú / Nosotros / Contacto)
     - Estado del local: Abierto / Cerrado (visible para todos)
     - Jefe puede abrir/cerrar el local con registro de inversiones
     - Reporte diario: inversión vs ventas vs ganancia por jornada
     - Historial de jornadas persistido en localStorage
========================================================== */
'use strict';

/* ==========================================================
   1. DATOS FIJOS
========================================================== */
const USERS = [
  { id:1, username:'mesero', password:'1234',  role:'waiter', name:'Carlos M.' },
  { id:2, username:'jefe',   password:'admin', role:'boss',   name:'Jefe Admin' },
  { id:3, username:'maria',  password:'1234',  role:'waiter', name:'María G.'   },
];

const CAT_EMOJI = {
  'Hamburguesas':'🍔','Especiales':'🥩','Hot Dog':'🌭',
  'Bebidas':'🥤','Infantil':'🍟','Entradas':'🥗',
};

const DEFAULT_PRODUCTS = [
  { id:1,  name:'Clásica',              cost:6000,  price:15000, cat:'Hamburguesas', emoji:'🍔', status:'active', desc:'Pan artesanal, queso, 150g carne 100% res, tomate, cebolla y lechuga' },
  { id:2,  name:'Tocineta',             cost:7500,  price:17500, cat:'Hamburguesas', emoji:'🥓', status:'active', desc:'Pan artesanal, queso, 150g carne 100% res, tocineta ahumada, tomate, cebolla y lechuga' },
  { id:3,  name:'Mexicana',             cost:8000,  price:18500, cat:'Hamburguesas', emoji:'🌶️',status:'active', desc:'Pan artesanal, queso, 150g carne, jalapeños, salsa de guacamole, tomate, cebolla y lechuga' },
  { id:4,  name:'Vaquera',              cost:9500,  price:21500, cat:'Hamburguesas', emoji:'🤠', status:'active', desc:'Pan artesanal, queso, 150g carne 100% res, costilla ahumada a la plancha, tomate, cebolla y lechuga' },
  { id:5,  name:'Campesina',            cost:10000, price:22000, cat:'Hamburguesas', emoji:'🌽', status:'active', desc:'Pan artesanal, queso, 150g res maduro, huevo frito, chorizo, tocineta ahumada, maíz tierno, tomate, cebolla y lechuga' },
  { id:6,  name:'Criolla',              cost:9000,  price:20500, cat:'Hamburguesas', emoji:'🥚', status:'active', desc:'Pan artesanal, queso, 150g carne 100% res, tocineta ahumada, huevo frito, maíz tierno, tomate, cebolla y lechuga' },
  { id:7,  name:'Cheddar',              cost:7000,  price:16000, cat:'Hamburguesas', emoji:'🧀', status:'active', desc:'Pan artesanal, queso, 150g carne 100% res, queso cheddar, tomate, cebolla y lechuga' },
  { id:8,  name:'Ranchera',             cost:8500,  price:19000, cat:'Hamburguesas', emoji:'🔥', status:'active', desc:'Pan artesanal, queso, 150g carne 100% res, tocineta, chorizo, tomate, cebolla y lechuga' },
  { id:9,  name:'Paisa',                cost:9000,  price:20000, cat:'Hamburguesas', emoji:'🫓', status:'active', desc:'Arepa paisa, queso, 150g carne 100% res, huevo frito, chorizo, pimentón, cebolla, maíz tierno y tomate' },
  { id:10, name:'Callejera',            cost:9000,  price:20000, cat:'Hamburguesas', emoji:'🌆', status:'active', desc:'Pan artesanal, doble queso, 150g carne 100% res, tocineta ahumada, cebolla con salsa rosada, ripio de papa con tomate y lechuga' },
  { id:11, name:'Hawaiana',             cost:8000,  price:17500, cat:'Hamburguesas', emoji:'🍍', status:'active', desc:'Pan artesanal, queso, 150g carne 100% res, piña melada, tomate, cebolla y lechuga' },
  { id:12, name:'Tentación',            cost:9500,  price:21000, cat:'Hamburguesas', emoji:'🍌', status:'active', desc:'Plátano maduro, doble porción de queso, tocineta, carne 150g, huevo frito, tomate, cebolla, lechuga y salsa dulce maíz' },
  { id:13, name:'Trifásica',            cost:13000, price:27000, cat:'Hamburguesas', emoji:'🏆', status:'active', desc:'Pan artesanal, triple carne (res, cerdo, pollo), triple queso crema, tomate, cebolla y lechuga' },
  { id:14, name:'Marinera',             cost:10000, price:21500, cat:'Hamburguesas', emoji:'🦐', status:'active', desc:'Pan artesanal, queso, 150g carne 100% res, camarones salteados con salsa especial, tomate, cebolla y lechuga' },
  { id:15, name:'Extrema Queso',        cost:11000, price:25000, cat:'Hamburguesas', emoji:'🫕', status:'active', desc:'Pan artesanal, queso, 150g carne 100% res, tocineta ahumada, queso cheddar fundido, doble crema, tomate, cebolla y lechuga' },
  { id:16, name:'Jumanji',              cost:10000, price:22000, cat:'Hamburguesas', emoji:'🦁', status:'active', desc:'Pan artesanal, queso crema y cheddar, doble carne 100% res, doble porción de tocineta ahumada, sin vegetales' },
  { id:17, name:'Mister Burger',        cost:12000, price:25000, cat:'Hamburguesas', emoji:'⭐', status:'active', desc:'Pan artesanal, doble queso, doble carne 100% res, tocineta ahumada, chorizo, huevo frito, maíz tierno, tomate, cebolla y lechuga' },
  { id:18, name:'Caqueteña',            cost:12000, price:25000, cat:'Hamburguesas', emoji:'🌿', status:'active', desc:'Plátano, doble queso, 150g carne 100% res, pollo apanado, tocineta ahumada, chorizo, huevo frito, maíz tierno, tomate, cebolla y lechuga' },
  { id:19, name:'Ropa Vieja',           cost:9500,  price:21500, cat:'Hamburguesas', emoji:'🥘', status:'active', desc:'Pan artesanal, queso, 150g carne 100% res, carne desmechada bañada en salsa bolonesa, tomate, cebolla y lechuga' },
  { id:20, name:'Crunch',               cost:9000,  price:20500, cat:'Hamburguesas', emoji:'🍗', status:'active', desc:'Pan artesanal, queso, doble carne pollo apanado, tomate, cebolla y lechuga' },
  { id:21, name:'Parrillada',           cost:15000, price:32000, cat:'Especiales',   emoji:'🥩', status:'active', desc:'Lomo fino de res, pechuga, lomo de cerdo, chorizo, patacón, papas a la francesa y ensalada' },
  { id:22, name:'Pechuga a la Plancha', cost:16000, price:35000, cat:'Especiales',   emoji:'🍖', status:'active', desc:'Acompañamiento de papas a la francesa, ensalada. 2 opciones para el plato' },
  { id:23, name:'Baby Beef',            cost:20000, price:42000, cat:'Especiales',   emoji:'🥗', status:'active', desc:'Lomo fino con papas a la francesa, pataconas, tocineta y ensalada' },
  { id:24, name:'Patacón',              cost:14000, price:32000, cat:'Especiales',   emoji:'🫔', status:'active', desc:'Lomo fino de res, pechuga, lomo de cerdo, chorizo, patacón, maíz tierno, queso gratinado, ripio de papa y huevos de codorniz' },
  { id:25, name:'Maicito',              cost:14000, price:32000, cat:'Especiales',   emoji:'🌽', status:'active', desc:'Carne mixta, pollo, lomo fino de res, lomo de cerdo, cebolla grillé, papas a la francesa, 2 yucas, queso gratinado, maíz tierno' },
  { id:26, name:'Chicharronuda',        cost:19000, price:42000, cat:'Especiales',   emoji:'🥓', status:'active', desc:'Porción de costilla con chicharrón, patacón, papas a la francesa y ensalada' },
  { id:27, name:'Costillas BBQ',        cost:14000, price:32000, cat:'Especiales',   emoji:'🍖', status:'active', desc:'Costillitas bañadas en salsa BBQ, papas a la francesa, patacón y ensalada' },
  { id:28, name:'Burrito',              cost:11000, price:25000, cat:'Especiales',   emoji:'🌯', status:'active', desc:'Tortilla de trigo, queso, trozos de lomo fino, pechuga y lomo de cerdo, salsas y verduras' },
  { id:29, name:'Alitas BBQ',           cost:10000, price:23000, cat:'Especiales',   emoji:'🍗', status:'active', desc:'Alas de pollo bañadas en salsa BBQ, papas a la francesa y ensalada' },
  { id:30, name:'Punta de Anca',        cost:20000, price:43000, cat:'Especiales',   emoji:'🥩', status:'active', desc:'Corte fino de picaña a la plancha, papas a la francesa, yuquitas y ensalada' },
  { id:31, name:'Ensalada Mister',      cost:9000,  price:22000, cat:'Especiales',   emoji:'🥗', status:'active', desc:'Trocitos de pollo, piña, huevos de codorniz, patacón, queso, lechuga, maíz tierno' },
  { id:32, name:'Lomo de Cerdo',        cost:19000, price:43000, cat:'Especiales',   emoji:'🐷', status:'active', desc:'Cerdo a la plancha, papas a la francesa y ensalada' },
  { id:33, name:'Churrasco',            cost:19000, price:43000, cat:'Especiales',   emoji:'🥩', status:'active', desc:'Lomo ancho a la plancha, chimichurri, papas a la francesa y ensalada' },
  { id:34, name:'Bistec a Caballo',     cost:19000, price:43000, cat:'Especiales',   emoji:'🍳', status:'active', desc:'Lomo de res a la plancha con hogao, papas a la francesa, 2 huevos fritos y ensalada' },
  { id:35, name:'Hot Dog Sencillo',     cost:4500,  price:12500, cat:'Hot Dog',      emoji:'🌭', status:'active', desc:'Pan, salchicha, queso, papa ripio' },
  { id:36, name:'Hot Dog Hawaiano',     cost:5500,  price:14000, cat:'Hot Dog',      emoji:'🍍', status:'active', desc:'Con melao de piña' },
  { id:37, name:'Hot Dog Especial',     cost:6000,  price:15000, cat:'Hot Dog',      emoji:'🌭', status:'active', desc:'Con tocineta y cebolla grillé' },
  { id:38, name:'Hot Dog Mexicano',     cost:6000,  price:15000, cat:'Hot Dog',      emoji:'🌶️',status:'active', desc:'Con jalapeños y salsa guacamole' },
  { id:39, name:'Hot Dog Mister',       cost:7500,  price:18500, cat:'Hot Dog',      emoji:'⭐', status:'active', desc:'Con tocineta, chorizo, maíz, huevos de codorniz' },
  { id:40, name:'Limonada Natural',     cost:2000,  price:6000,  cat:'Bebidas',      emoji:'🍋', status:'active', desc:'Fresca y natural' },
  { id:41, name:'Limonada de Coco',     cost:4000,  price:11000, cat:'Bebidas',      emoji:'🥥', status:'active', desc:'Refrescante con coco' },
  { id:42, name:'Limonada Yerbabuena',  cost:4000,  price:11000, cat:'Bebidas',      emoji:'🌿', status:'active', desc:'Con hierbabuena fresca' },
  { id:43, name:'Mandarinada',          cost:4000,  price:11000, cat:'Bebidas',      emoji:'🍊', status:'active', desc:'Jugo natural de mandarina' },
  { id:44, name:'Naranjada',            cost:4000,  price:11000, cat:'Bebidas',      emoji:'🍊', status:'active', desc:'Jugo natural de naranja' },
  { id:45, name:'Piña Colada',          cost:4500,  price:12000, cat:'Bebidas',      emoji:'🍹', status:'active', desc:'Piña colada tropical' },
  { id:46, name:'Cerveza Nacional',     cost:3000,  price:6000,  cat:'Bebidas',      emoji:'🍺', status:'active', desc:'Fría y refrescante' },
  { id:47, name:'Jugo Amazónico Arazá', cost:4000,  price:11000, cat:'Bebidas',      emoji:'🍹', status:'active', desc:'Exótico jugo amazónico' },
  { id:48, name:'Hot Dog Kids',         cost:7000,  price:18500, cat:'Infantil',     emoji:'🌭', status:'active', desc:'Mini perro americano, papitas a la francesa, jugo hit o pony mini y nucita' },
  { id:49, name:'Burger Kids',          cost:7000,  price:18500, cat:'Infantil',     emoji:'🍔', status:'active', desc:'Hamburguesa mini, papitas a la francesa, jugo hit o pony mini y nucita' },
  { id:50, name:'Nuggets Kids',         cost:6000,  price:16500, cat:'Infantil',     emoji:'🍗', status:'active', desc:'Nuggets de pollo, papitas a la francesa, jugo hit o pony mini y nucita' },
  { id:51, name:'Papitas Cheddar',      cost:6000,  price:16500, cat:'Infantil',     emoji:'🧀', status:'active', desc:'Trocitos de tocineta, papitas con queso cheddar, jugo hit o pony mini y nucita' },
  { id:52, name:'Patacones con Hogao',  cost:2500,  price:7000,  cat:'Entradas',     emoji:'🫓', status:'active', desc:'Patacones con hogao casero' },
  { id:53, name:'Arepas con Hogao',     cost:2500,  price:7000,  cat:'Entradas',     emoji:'🫓', status:'active', desc:'Arepas tradicionales con hogao' },
  { id:54, name:'Papas Criollas',       cost:2500,  price:7000,  cat:'Entradas',     emoji:'🥔', status:'active', desc:'Papas criollas fritas' },
  { id:55, name:'Aritos de Cebolla',    cost:3000,  price:8000,  cat:'Entradas',     emoji:'🧅', status:'active', desc:'Anillos de cebolla fritos' },
  { id:56, name:'Deditos',              cost:2500,  price:7000,  cat:'Entradas',     emoji:'🧆', status:'active', desc:'Deditos de queso fritos' },
  { id:57, name:'Yuquitas',             cost:2500,  price:7000,  cat:'Entradas',     emoji:'🌿', status:'active', desc:'Yuca frita crujiente' },
];

function buildDefaultTables() {
  const t = [];
  for (let i = 1; i <= 14; i++) t.push({ id:i,    num:i,    floor:1, status:'free' });
  for (let i = 1; i <= 23; i++) t.push({ id:i+14, num:i,    floor:2, status:'free' });
  return t;
}

/* ==========================================================
   2. ESTADO GLOBAL
========================================================== */
let state = {
  currentUser:     null,
  products:        [],
  tables:          [],
  orders:          [],        // { id, tableId, waiterId, createdAt, status, dayId?, paidAt?, payMethod?, totalPaid? }
  orderItems:      [],        // { id, orderId, productId, qty, price, cost, notes, status }
  selectedTable:   null,
  activeOrderId:   null,
  selectedFloor:   1,
  nextId:          { product:100, order:1, item:1, day:1 },
  moveTableTarget: null,
  addQty:          1,
  addPid:          null,
  paymentOrderId:  null,
  // ── JORNADAS ──
  // { id, date, openedAt, closedAt?, openNotes?, closeNotes?,
  //   investments:[{desc, amount}], status:'open'|'closed' }
  workDays:        [],
  currentDayId:    null,      // id de la jornada abierta actualmente
  // UI temporal
  tempInvestments: [],        // filas del modal de apertura
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
    localStorage.setItem('mb_workDays',   JSON.stringify(state.workDays));
    localStorage.setItem('mb_currentDayId', JSON.stringify(state.currentDayId));
  } catch(e) { console.warn('[MB] localStorage error:', e); }
}

function loadState() {
  try {
    state.products    = JSON.parse(localStorage.getItem('mb_products'))     || [...DEFAULT_PRODUCTS];
    state.orders      = JSON.parse(localStorage.getItem('mb_orders'))       || [];
    state.orderItems  = JSON.parse(localStorage.getItem('mb_orderItems'))   || [];
    state.nextId      = JSON.parse(localStorage.getItem('mb_nextId'))       || { product:100, order:1, item:1, day:1 };
    state.workDays    = JSON.parse(localStorage.getItem('mb_workDays'))     || [];
    state.currentDayId= JSON.parse(localStorage.getItem('mb_currentDayId'))|| null;

    // Mesas con migración
    let saved = JSON.parse(localStorage.getItem('mb_tables'));
    if (!saved || saved.length < 37 || saved[0].floor === undefined) {
      const fresh = buildDefaultTables();
      if (saved) saved.forEach(o => { const t=fresh.find(x=>x.id===o.id); if(t) t.status=o.status; });
      state.tables = fresh;
    } else {
      state.tables = saved;
    }

    // Migración: agregar cost a productos sin él
    state.products.forEach(p => { if (p.cost === undefined) p.cost = Math.floor(p.price * 0.45); });
    saveState();
  } catch(e) {
    console.warn('[MB] loadState reset:', e);
    state.products  = [...DEFAULT_PRODUCTS];
    state.tables    = buildDefaultTables();
    state.orders    = [];
    state.orderItems= [];
    state.workDays  = [];
    state.currentDayId = null;
  }
}

/* ==========================================================
   4. NOTIFICACIONES
========================================================== */
function notify(msg, type = 'default') {
  const icons = { success:'fa-circle-check', error:'fa-circle-exclamation', info:'fa-circle-info', default:'fa-bell' };
  const el = document.createElement('div');
  el.className = `notif ${type}`;
  el.innerHTML = `<i class="fa-solid ${icons[type]||'fa-bell'}"></i>${msg}`;
  document.getElementById('notifications').appendChild(el);
  setTimeout(() => { el.style.animation = 'notifOut 0.3s ease forwards'; setTimeout(()=>el.remove(),300); }, 3200);
}

/* ==========================================================
   5. NAVEGACIÓN
========================================================== */
function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const t = document.getElementById('view-' + name);
  if (t) t.classList.add('active');
  // Sincronizar links del cliente si es vista pública
  if (['menu','about','contact'].includes(name)) {
    document.querySelectorAll('.cn-link').forEach(l => l.classList.remove('active'));
  }
  updateNavbars();
}

function goHome() {
  if (!state.currentUser)                     showView('menu');
  else if (state.currentUser.role === 'boss') showView('boss');
  else                                         showView('waiter');
}

/** Muestra el nav correcto según si hay sesión */
function updateNavbars() {
  const clientNav = document.getElementById('client-navbar');
  const staffNav  = document.getElementById('staff-navbar');

  if (state.currentUser) {
    clientNav.classList.add('hidden');
    staffNav.classList.remove('hidden');
    updateStaffNavbar();
  } else {
    staffNav.classList.add('hidden');
    clientNav.classList.remove('hidden');
  }
  updateLocalStatusBadge();
}

function updateStaffNavbar() {
  const area = document.getElementById('nav-user-area');
  if (!area) return;
  const isBoss = state.currentUser.role === 'boss';
  area.innerHTML = `
    <div class="nav-user">
      <div class="avatar">${state.currentUser.name[0]}</div>
      <span>${state.currentUser.name}</span>
      <span class="badge ${isBoss?'badge-orange':'badge-blue'}">${isBoss?'Jefe':'Mesero'}</span>
      <button class="btn btn-secondary btn-sm" onclick="logout()">
        <i class="fa-solid fa-right-from-bracket"></i>
      </button>
    </div>`;
}

/** Actualiza el badge de estado del local en ambos navbars */
function updateLocalStatusBadge() {
  const isOpen = !!state.currentDayId;
  const html = isOpen
    ? `<i class="fa-solid fa-circle"></i> <span>Abierto</span>`
    : `<i class="fa-solid fa-circle"></i> <span>Cerrado</span>`;
  const cls = isOpen ? 'local-badge local-open' : 'local-badge local-closed';

  ['local-status-badge','local-status-staff'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.className = cls; el.innerHTML = html; }
  });

  // Banner en vista menú público
  const banner = document.getElementById('local-closed-banner');
  if (banner) { if (!isOpen) banner.classList.remove('hidden'); else banner.classList.add('hidden'); }

  // Botón sidebar jefe
  const btn  = document.getElementById('local-toggle-btn');
  const text = document.getElementById('local-toggle-text');
  if (btn && text) {
    if (isOpen) {
      btn.className = 'sidebar-nav-item local-closed-btn';
      text.textContent = 'Cerrar Local';
    } else {
      btn.className = 'sidebar-nav-item local-open-btn';
      text.textContent = 'Abrir Local';
    }
  }
}

/* Navegación cliente */
function clientNav(view, el) {
  document.querySelectorAll('.cn-link').forEach(l => l.classList.remove('active'));
  if (el) el.classList.add('active');
  showView(view);
}

/* ==========================================================
   6. BÚSQUEDA GLOBAL
========================================================== */
function globalSearch(query) {
  const dd = document.getElementById('search-dropdown');
  if (!query || query.trim().length < 2) { dd.classList.add('hidden'); return; }
  const q = query.toLowerCase();
  const products = state.products.filter(p =>
    p.status==='active' &&
    (p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q) || (p.desc||'').toLowerCase().includes(q))
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
        <div class="sr-info"><div class="sr-name">${p.name}</div><div class="sr-sub">${p.cat}</div></div>
        <span class="sr-price">${fmtPrice(p.price)}</span>
      </div>`).join('');
  }
  if (tables.length) {
    html += `<div class="search-group-title"><i class="fa-solid fa-table-cells"></i> Mesas</div>`;
    html += tables.map(t => {
      const ord = getOrderForTable(t.id);
      const icon = {free:'🟢',occupied:'🔴',pending_payment:'💛'}[t.status]||'🟢';
      return `
        <div class="search-result-item" onmousedown="searchSelectTable(${t.id})">
          <span class="sr-emoji">${icon}</span>
          <div class="sr-info">
            <div class="sr-name">Mesa ${t.num} — Piso ${t.floor}</div>
            <div class="sr-sub">${tableStatusLabel(t)}${ord?' · '+fmtPrice(orderTotal(ord.id)):''}</div>
          </div>
        </div>`;
    }).join('');
  }
  if (!html) html = `<div class="search-no-results"><i class="fa-solid fa-magnifying-glass"></i> Sin resultados</div>`;
  dd.innerHTML = html;
  dd.classList.remove('hidden');
}
function openSearchDropdown()  { const v=document.getElementById('global-search')?.value; if(v&&v.trim().length>=2) globalSearch(v); }
function closeSearchDropdown() { setTimeout(()=>{ const d=document.getElementById('search-dropdown'); if(d) d.classList.add('hidden'); },150); }
function searchSelectProduct(pid) {
  document.getElementById('global-search').value='';
  document.getElementById('search-dropdown').classList.add('hidden');
  if (state.activeOrderId) openAddProduct(pid);
  else notify('Selecciona una mesa para agregar productos','info');
}
function searchSelectTable(tableId) {
  document.getElementById('global-search').value='';
  document.getElementById('search-dropdown').classList.add('hidden');
  if (!state.currentUser) { notify('Inicia sesión primero','error'); return; }
  const t = state.tables.find(x=>x.id===tableId);
  if (!t) return;
  state.selectedFloor = t.floor;
  if (state.currentUser.role==='boss') { showView('boss'); bossSelectTable(tableId); }
  else { showView('waiter'); selectTableWaiter(tableId); }
}

/* ==========================================================
   7. AUTENTICACIÓN
========================================================== */
function doLogin() {
  const u = document.getElementById('login-user').value.trim();
  const p = document.getElementById('login-pass').value.trim();
  const user = USERS.find(x => x.username===u && x.password===p);
  if (!user) { notify('Usuario o contraseña incorrectos','error'); return; }
  state.currentUser = user;
  notify(`Bienvenido, ${user.name}! 👋`,'success');
  if (user.role==='boss') { showView('boss'); bossSection('dashboard'); }
  else                     { showView('waiter'); waiterSection('tables'); }
}
function logout() {
  state.currentUser=null; state.selectedTable=null; state.activeOrderId=null;
  notify('Sesión cerrada','info');
  showView('menu');
}

/* ==========================================================
   8. HELPERS
========================================================== */
function fmtPrice(p) { return '$'+Number(p).toLocaleString('es-CO'); }
function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('es-CO',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
}
function fmtTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit'});
}
function genId(key) { return ++state.nextId[key]; }
function getCatClass(cat) {
  return {'Hamburguesas':'cat-hamburguesas','Especiales':'cat-especiales','Hot Dog':'cat-hot-dog',
          'Bebidas':'cat-bebidas','Infantil':'cat-infantil','Entradas':'cat-entradas'}[cat]||'cat-entradas';
}
function getOrderForTable(tid) {
  return state.orders.find(o=>o.tableId===tid&&(o.status==='active'||o.status==='pending_payment'));
}
function getOrderItems(oid)  { return state.orderItems.filter(i=>i.orderId===oid); }
function orderTotal(oid)     { return state.orderItems.filter(i=>i.orderId===oid&&i.status==='active').reduce((s,i)=>s+i.price*i.qty,0); }
function orderCost(oid)      { return state.orderItems.filter(i=>i.orderId===oid&&i.status==='active').reduce((s,i)=>s+(i.cost||0)*i.qty,0); }
function tableStatusLabel(t) { return{free:'Libre',occupied:'Ocupada',pending_payment:'Pago pendiente'}[t.status]||t.status; }
function tableCardClass(t,sel) {
  const s={free:'free',occupied:'occupied',pending_payment:'pending-payment'}[t.status]||'free';
  return `table-card ${s}${sel?' selected':''}`;
}
function tableIcon(t) { return{free:'🟢',occupied:'🍽️',pending_payment:'💛'}[t.status]||'🟢'; }

/* ==========================================================
   9. MENÚ PÚBLICO
========================================================== */
let menuFilter = 'all';
function renderPublicMenu(filter) {
  menuFilter = filter||menuFilter;
  const grid   = document.getElementById('menu-grid');
  const ctaBar = document.getElementById('menu-cta');
  if (!grid) return;
  grid.innerHTML = state.products.filter(p=>p.status==='active'&&(menuFilter==='all'||p.cat===menuFilter))
    .map(p=>`
      <div class="product-card">
        <div class="prod-img"><span style="font-size:72px">${p.emoji}</span>
          <span class="prod-cat ${getCatClass(p.cat)}">${p.cat}</span></div>
        <div class="prod-body">
          <div class="prod-name">${p.name}</div>
          <div class="prod-desc">${p.desc||''}</div>
          <div class="prod-price">${fmtPrice(p.price)}</div>
        </div>
      </div>`).join('');
  if (ctaBar) { if (state.currentUser) ctaBar.classList.add('hidden'); else ctaBar.classList.remove('hidden'); }
}
function filterMenu(cat,btn) {
  document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderPublicMenu(cat);
}

/* ==========================================================
   10. JORNADAS (ABRIR / CERRAR LOCAL)
========================================================== */

/** Alterna: si está abierto abre modal de cierre, si cerrado abre modal de apertura */
function toggleLocal() {
  if (state.currentDayId) openCloseLocalModal();
  else                     openOpenLocalModal();
}

/* ── ABRIR LOCAL ── */
function openOpenLocalModal() {
  state.tempInvestments = [{ desc:'', amount:'' }];
  renderInvestmentRows();
  document.getElementById('open-notes').value = '';
  recalcInvestTotal();
  document.getElementById('modal-open-local').classList.remove('hidden');
}

function renderInvestmentRows() {
  const container = document.getElementById('open-investments-list');
  if (!container) return;
  container.innerHTML = state.tempInvestments.map((inv, i) => `
    <div class="investment-row" id="inv-row-${i}">
      <input class="form-control" placeholder="Descripción (ej: Carne de res, Pan)"
             value="${inv.desc}" oninput="updateInv(${i},'desc',this.value)">
      <input class="form-control inv-amount" type="number" placeholder="$ Monto"
             value="${inv.amount}" oninput="updateInv(${i},'amount',this.value)">
      <button class="inv-del" onclick="removeInvRow(${i})" title="Eliminar">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>`).join('');
}

function updateInv(i, field, val) {
  state.tempInvestments[i][field] = val;
  recalcInvestTotal();
}
function addInvestmentRow() {
  state.tempInvestments.push({ desc:'', amount:'' });
  renderInvestmentRows();
}
function removeInvRow(i) {
  state.tempInvestments.splice(i, 1);
  if (!state.tempInvestments.length) state.tempInvestments = [{ desc:'', amount:'' }];
  renderInvestmentRows();
  recalcInvestTotal();
}
function recalcInvestTotal() {
  const total = state.tempInvestments.reduce((s,inv) => s + (parseFloat(inv.amount)||0), 0);
  const el = document.getElementById('open-total-invest');
  if (el) el.textContent = fmtPrice(total);
}

function confirmOpenLocal() {
  const investments = state.tempInvestments
    .filter(inv => inv.desc.trim() || parseFloat(inv.amount))
    .map(inv => ({ desc: inv.desc.trim()||'Sin descripción', amount: parseFloat(inv.amount)||0 }));
  const notes = document.getElementById('open-notes').value.trim();
  const id = genId('day');
  const day = {
    id,
    date:       new Date().toLocaleDateString('es-CO'),
    openedAt:   new Date().toISOString(),
    closedAt:   null,
    openNotes:  notes,
    closeNotes: '',
    investments,
    status:     'open',
  };
  state.workDays.push(day);
  state.currentDayId = id;
  saveState();
  closeModal('modal-open-local');
  notify('¡Local abierto! 🏪 Buena jornada','success');
  updateLocalStatusBadge();
  bossSection('dashboard');
}

/* ── CERRAR LOCAL ── */
function openCloseLocalModal() {
  const day = state.workDays.find(d => d.id === state.currentDayId);
  if (!day) return;

  // Verificar si hay pedidos activos o pendientes
  const activeOrders = state.orders.filter(o => o.dayId===state.currentDayId && (o.status==='active'||o.status==='pending_payment'));
  if (activeOrders.length) {
    notify(`Hay ${activeOrders.length} pedido(s) sin cobrar. Ciérralos antes de terminar la jornada.`,'error');
    return;
  }

  const { totalSales, totalCost, totalProfit, paidOrders } = calcDayStats(state.currentDayId);
  const totalInvest = day.investments.reduce((s,i) => s+(i.amount||0), 0);
  const netProfit   = totalProfit - totalInvest;

  document.getElementById('close-local-summary').innerHTML = `
    <div class="close-summary-grid">
      <div class="cs-box invest">
        <div class="cs-label">Inversión del día</div>
        <div class="cs-value">${fmtPrice(totalInvest)}</div>
      </div>
      <div class="cs-box sales">
        <div class="cs-label">Total vendido</div>
        <div class="cs-value">${fmtPrice(totalSales)}</div>
      </div>
      <div class="cs-box">
        <div class="cs-label">Costo producción</div>
        <div class="cs-value" style="color:var(--text-muted)">${fmtPrice(totalCost)}</div>
      </div>
      <div class="cs-box ${netProfit>=0?'profit':'loss'}">
        <div class="cs-label">Ganancia neta</div>
        <div class="cs-value">${fmtPrice(netProfit)}</div>
      </div>
    </div>
    <div style="background:var(--bg-dark);border-radius:8px;padding:12px 16px;font-size:13px;color:var(--text-muted);">
      <strong>${paidOrders}</strong> pedido(s) cobrado(s) durante la jornada ·
      Apertura: <strong>${fmtTime(day.openedAt)}</strong>
    </div>`;

  document.getElementById('close-notes').value = '';
  document.getElementById('modal-close-local').classList.remove('hidden');
}

function confirmCloseLocal() {
  const day = state.workDays.find(d => d.id === state.currentDayId);
  if (!day) return;
  day.closedAt   = new Date().toISOString();
  day.closeNotes = document.getElementById('close-notes').value.trim();
  day.status     = 'closed';
  state.currentDayId = null;
  saveState();
  closeModal('modal-close-local');
  notify('Jornada cerrada 🔒 ¡Hasta mañana!','info');
  updateLocalStatusBadge();
  bossSection('reports');
}

/* ── Calcular estadísticas de una jornada ── */
function calcDayStats(dayId) {
  const dayOrders = state.orders.filter(o => o.dayId===dayId && o.status==='paid');
  const totalSales  = dayOrders.reduce((s,o)=>s+orderTotal(o.id),0);
  const totalCost   = dayOrders.reduce((s,o)=>s+orderCost(o.id),0);
  const totalProfit = totalSales - totalCost;
  return { totalSales, totalCost, totalProfit, paidOrders: dayOrders.length };
}

/* ==========================================================
   11. PANEL MESERO
========================================================== */
function waiterSection(sec) {
  document.querySelectorAll('#waiter-sidebar .sidebar-nav-item').forEach(i=>i.classList.remove('active'));
  if (event?.target) { const it=event.target.closest('.sidebar-nav-item'); if(it) it.classList.add('active'); }
  const content = document.getElementById('waiter-content');
  if      (sec==='tables')       renderWaiterTables(content);
  else if (sec==='order')        renderActiveOrder(content);
  else if (sec==='menu-preview') renderMenuPreview(content);
}

function renderWaiterTables(container) {
  const myIds = state.orders.filter(o=>o.waiterId===state.currentUser.id&&(o.status==='active'||o.status==='pending_payment')).map(o=>o.tableId);
  container.innerHTML = `
    <div class="panel-header">
      <h2>Mis Mesas</h2>
      <p>🟢 Libre &nbsp; 🔴 Ocupada &nbsp; 💛 Pago pendiente</p>
    </div>
    ${renderFloorTabs('waiter')}
    ${renderFloorTables(myIds, false)}`;
}

function renderFloorTabs(ctx) {
  const cnt = fl => state.tables.filter(t=>t.floor===fl&&t.status!=='free').length;
  const tot = fl => state.tables.filter(t=>t.floor===fl).length;
  return `
    <div class="floor-tabs">
      <button class="floor-tab ${state.selectedFloor===1?'active':''}" onclick="switchFloor(1,'${ctx}')">
        <i class="fa-solid fa-1"></i> Piso 1 <span class="floor-count">${cnt(1)}/${tot(1)}</span>
      </button>
      <button class="floor-tab ${state.selectedFloor===2?'active':''}" onclick="switchFloor(2,'${ctx}')">
        <i class="fa-solid fa-2"></i> Piso 2 <span class="floor-count">${cnt(2)}/${tot(2)}</span>
      </button>
    </div>`;
}

function renderFloorTables(myIds, isBoss) {
  const tables = state.tables.filter(t=>t.floor===state.selectedFloor);
  return `
    <div class="floor-section-label"><h3><i class="fa-solid fa-building"></i> Piso ${state.selectedFloor}</h3></div>
    <div class="tables-grid">
      ${tables.map(t => {
        const ord   = getOrderForTable(t.id);
        const total = ord ? orderTotal(ord.id) : 0;
        const mine  = myIds.includes(t.id);
        return `
          <div class="${tableCardClass(t, state.selectedTable===t.id)}"
               onclick="${isBoss?`bossSelectTable(${t.id})`:`selectTableWaiter(${t.id})`}">
            <div class="table-icon">${tableIcon(t)}</div>
            <div class="table-num">${t.num}</div>
            <div class="table-status">
              ${t.status==='pending_payment'?'Pago pendiente':t.status==='occupied'?(mine&&!isBoss?'Mi pedido':'Ocupada'):'Libre'}
            </div>
            ${ord?`<div class="table-total">${fmtPrice(total)}</div>`:''}
          </div>`;
      }).join('')}
    </div>`;
}

function switchFloor(fl, ctx) {
  state.selectedFloor = fl;
  if (ctx==='waiter') waiterSection('tables'); else bossSection('tables');
}

function selectTableWaiter(tableId) {
  const ord = getOrderForTable(tableId);
  if (ord&&ord.status==='pending_payment') { notify('Mesa en espera de pago — Solo el Jefe puede liberarla','error'); return; }
  if (ord&&ord.waiterId!==state.currentUser.id) { notify('Esta mesa tiene un pedido de otro mesero','error'); return; }
  state.selectedTable = tableId;
  state.activeOrderId = ord ? ord.id : null;
  notify(`Mesa ${state.tables.find(t=>t.id===tableId)?.num} seleccionada`,'info');
  renderOrderPanel(document.getElementById('waiter-content'), false);
}

function renderMenuPreview(container) {
  container.innerHTML = `<div class="panel-header"><h2>Menú</h2></div>`;
  const g = document.createElement('div');
  g.className = 'menu-grid';
  g.innerHTML = state.products.filter(p=>p.status==='active').map(p=>`
    <div class="product-card">
      <div class="prod-img"><span style="font-size:72px">${p.emoji}</span>
        <span class="prod-cat ${getCatClass(p.cat)}">${p.cat}</span></div>
      <div class="prod-body">
        <div class="prod-name">${p.name}</div>
        <div class="prod-desc">${p.desc||''}</div>
        <div class="prod-price">${fmtPrice(p.price)}</div>
      </div></div>`).join('');
  container.appendChild(g);
}

function renderActiveOrder(container) {
  if (!state.selectedTable) {
    container.innerHTML = `
      <div class="panel-header"><h2>Pedido Activo</h2></div>
      <div class="card" style="text-align:center;padding:60px;">
        <i class="fa-solid fa-table-cells" style="font-size:48px;color:var(--text-dim)"></i>
        <p style="color:var(--text-muted);margin-top:16px;font-weight:700">Primero selecciona una mesa</p>
      </div>`;
    return;
  }
  renderOrderPanel(container, state.currentUser?.role==='boss');
}

/* ==========================================================
   12. PANEL DE PEDIDO
========================================================== */
function renderOrderPanel(container, isBoss) {
  const tableId  = state.selectedTable;
  const table    = state.tables.find(t=>t.id===tableId);
  const order    = getOrderForTable(tableId);
  const isPending = order&&order.status==='pending_payment';

  container.innerHTML = `
    <div class="panel-header" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
      <div>
        <h2>Mesa ${table?.num||'?'} — Piso ${table?.floor||'?'}</h2>
        <p>${order?`Pedido #${order.id}`:'Sin pedido activo'}
          ${isPending?`<span class="badge badge-yellow" style="margin-left:8px"><i class="fa-solid fa-lock"></i> Pago pendiente</span>`:''}
        </p>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${!order?`<button class="btn btn-success" onclick="createOrder(${tableId})"><i class="fa-solid fa-plus"></i> Nuevo Pedido</button>`:''}
        ${isBoss&&order?`<button class="btn btn-blue btn-sm" onclick="openMoveTable()"><i class="fa-solid fa-arrows-alt"></i> Cambiar Mesa</button>`:''}
        ${order&&!isPending?`<button class="btn btn-danger btn-sm" onclick="requestPayment(${order.id})"><i class="fa-solid fa-money-bill-wave"></i> Solicitar Pago</button>`:''}
        ${isBoss&&isPending?`<button class="btn btn-success btn-sm" onclick="openPaymentModal(${order.id})"><i class="fa-solid fa-circle-check"></i> Cobrar y Liberar</button>`:''}
        <button class="btn btn-secondary btn-sm" onclick="${isBoss?'bossSection(\'tables\')':'waiterSection(\'tables\')'}">
          <i class="fa-solid fa-arrow-left"></i> Volver</button>
      </div>
    </div>
    <div class="order-layout">
      <div class="products-panel">
        <div class="search-bar">
          <input class="form-control" id="prod-search" placeholder="🔍 Buscar producto..."
                 oninput="filterOrderProducts()" ${!order||isPending?'disabled':''}>
          <select class="form-control" id="prod-cat-filter" style="max-width:160px"
                  onchange="filterOrderProducts()" ${!order||isPending?'disabled':''}>
            <option value="">Todas</option>
            <option>Hamburguesas</option><option>Especiales</option><option>Hot Dog</option>
            <option>Bebidas</option><option>Infantil</option><option>Entradas</option>
          </select>
        </div>
        ${isPending?`<div style="padding:40px;text-align:center;color:var(--text-muted)">
          <i class="fa-solid fa-lock" style="font-size:48px;color:#f0c040"></i>
          <p style="margin-top:12px;font-weight:800;font-size:16px">Pedido bloqueado</p>
          <p style="font-size:12px;margin-top:6px">Esperando confirmación de pago por el Jefe</p>
        </div>`:''}
        <div class="order-products-grid" id="order-prods-grid"></div>
      </div>
      <div class="cart-panel">
        <div class="cart-header">
          <h3><i class="fa-solid fa-receipt"></i> Pedido</h3>
          ${order?`<span class="badge ${isPending?'badge-yellow':'badge-orange'}">#${order.id}</span>`:`<span class="badge badge-green">Sin pedido</span>`}
        </div>
        <div class="cart-items" id="cart-items">${renderCartItems(order?.id, isPending)}</div>
        <div class="cart-footer">${renderCartSummary(order?.id)}</div>
      </div>
    </div>`;
  if (!isPending) filterOrderProducts();
}

function filterOrderProducts() {
  const search = (document.getElementById('prod-search')?.value||'').toLowerCase();
  const cat    = document.getElementById('prod-cat-filter')?.value||'';
  const grid   = document.getElementById('order-prods-grid');
  if (!grid) return;
  grid.innerHTML = state.products.filter(p=>
    p.status==='active' && (!cat||p.cat===cat) && (!search||p.name.toLowerCase().includes(search)||p.cat.toLowerCase().includes(search))
  ).map(p=>`
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
    const prod = state.products.find(p=>p.id===item.productId);
    const cancelled = item.status==='cancelled';
    return `
      <div class="cart-item ${cancelled?'cancelled':''}" id="cart-item-${item.id}">
        <span class="ci-emoji">${prod?.emoji||'🍔'}</span>
        <div class="ci-info">
          <div class="ci-name">${prod?.name||'Producto'} ${item.qty>1?`×${item.qty}`:''}</div>
          <div class="ci-price">${fmtPrice(item.price*item.qty)}</div>
          ${item.notes?`<div class="ci-notes">${item.notes}</div>`:''}
          ${cancelled?'<span class="ci-cancelled-badge">Cancelado</span>':''}
        </div>
        ${!locked?(!cancelled
          ?`<button class="ci-cancel-btn" onclick="cancelItem(${item.id})"><i class="fa-solid fa-xmark"></i></button>`
          :`<button class="ci-cancel-btn" onclick="reactivateItem(${item.id})" style="color:var(--green)"><i class="fa-solid fa-rotate-left"></i></button>`)
        :''}
      </div>`;
  }).join('');
}

function renderCartSummary(orderId) {
  if (!orderId) return `<div class="cart-summary"><div class="summary-row total"><span>TOTAL</span><span>${fmtPrice(0)}</span></div></div>`;
  const items    = getOrderItems(orderId);
  const active   = items.filter(i=>i.status==='active');
  const cancelled= items.filter(i=>i.status==='cancelled');
  const total    = orderTotal(orderId);
  return `<div class="cart-summary">
    <div class="summary-row"><span>Productos activos</span><span>${active.length}</span></div>
    ${cancelled.length?`<div class="summary-row"><span style="color:var(--red)">Cancelados</span><span style="color:var(--red)">${cancelled.length}</span></div>`:''}
    <div class="summary-row total"><span>TOTAL</span><span>${fmtPrice(total)}</span></div>
  </div>`;
}

function refreshCart(orderId) {
  const order  = state.orders.find(o=>o.id===orderId);
  const locked = order&&order.status==='pending_payment';
  const ciEl=document.getElementById('cart-items'), cfEl=document.querySelector('.cart-footer');
  if (ciEl) ciEl.innerHTML = renderCartItems(orderId, locked);
  if (cfEl) cfEl.innerHTML = renderCartSummary(orderId);
}

/* ==========================================================
   13. GESTIÓN DE PEDIDOS
========================================================== */
function createOrder(tableId) {
  const id = genId('order');
  state.orders.push({
    id, tableId,
    waiterId:  state.currentUser.id,
    createdAt: new Date().toISOString(),
    status:    'active',
    dayId:     state.currentDayId || null,
  });
  const table = state.tables.find(t=>t.id===tableId);
  if (table) table.status = 'occupied';
  state.activeOrderId = id;
  saveState();
  notify('Pedido creado ✅','success');
  const cont = state.currentUser.role==='boss' ? document.getElementById('boss-content') : document.getElementById('waiter-content');
  renderOrderPanel(cont, state.currentUser.role==='boss');
}

function requestPayment(orderId) {
  if (!confirm('¿Marcar como listo para cobrar?\nLa mesa quedará bloqueada hasta que el Jefe confirme el pago.')) return;
  const order = state.orders.find(o=>o.id===orderId);
  if (!order) return;
  order.status = 'pending_payment';
  const table = state.tables.find(t=>t.id===order.tableId);
  if (table) table.status = 'pending_payment';
  state.selectedTable = null; state.activeOrderId = null;
  saveState();
  notify('Pedido enviado a cobro 💛','info');
  if (state.currentUser.role==='boss') bossSection('tables'); else waiterSection('tables');
}

/* ==========================================================
   14. MODAL DE PAGO
========================================================== */
function openPaymentModal(orderId) {
  if (state.currentUser?.role !== 'boss') { notify('Solo el Jefe puede confirmar pagos','error'); return; }
  state.paymentOrderId = orderId;
  const order = state.orders.find(o=>o.id===orderId);
  const table = state.tables.find(t=>t.id===order.tableId);
  const items = getOrderItems(orderId);
  const total = orderTotal(orderId);
  document.getElementById('payment-summary').innerHTML = `
    <div class="ps-table">Mesa ${table?.num} — Piso ${table?.floor} · Pedido #${orderId}</div>
    <div class="ps-items">
      ${items.map(i=>{const p=state.products.find(x=>x.id===i.productId);
        return `<div class="ps-item ${i.status==='cancelled'?'cancelled':''}">
          <span>${p?.emoji||''} ${p?.name||'?'} ×${i.qty}</span><span>${fmtPrice(i.price*i.qty)}</span>
        </div>`;}).join('')}
    </div>
    <div class="ps-total"><span>TOTAL A COBRAR</span><span>${fmtPrice(total)}</span></div>`;
  document.getElementById('payment-received').value = '';
  document.getElementById('payment-change').classList.add('hidden');
  document.getElementById('payment-method').value = 'efectivo';
  document.getElementById('modal-payment').classList.remove('hidden');
}

function calcChange() {
  const total    = orderTotal(state.paymentOrderId||0);
  const received = parseFloat(document.getElementById('payment-received').value)||0;
  const el = document.getElementById('payment-change');
  if (received >= total) { el.textContent = `💵 Cambio: ${fmtPrice(received-total)}`; el.classList.remove('hidden'); }
  else el.classList.add('hidden');
}

function confirmPayment() {
  const orderId = state.paymentOrderId;
  if (!orderId) return;
  const order  = state.orders.find(o=>o.id===orderId);
  const table  = state.tables.find(t=>t.id===order.tableId);
  const method = document.getElementById('payment-method').value;
  order.status    = 'paid';
  order.paidAt    = new Date().toISOString();
  order.payMethod = method;
  order.totalPaid = orderTotal(orderId);
  table.status    = 'free';
  state.selectedTable=null; state.activeOrderId=null; state.paymentOrderId=null;
  saveState();
  closeModal('modal-payment');
  notify(`✅ Pago confirmado — Mesa ${table.num} (Piso ${table.floor}) liberada`,'success');
  bossSection('tables');
}

/* ==========================================================
   15. AGREGAR PRODUCTO AL PEDIDO
========================================================== */
function openAddProduct(pid) {
  if (!state.activeOrderId) { notify('Primero crea un pedido para esta mesa','error'); return; }
  const prod = state.products.find(p=>p.id===pid);
  if (!prod) return;
  state.addPid=pid; state.addQty=1;
  document.getElementById('modal-qty-title').textContent = prod.name;
  document.getElementById('modal-qty-emoji').textContent = prod.emoji;
  document.getElementById('modal-qty-desc').textContent  = prod.desc||'';
  document.getElementById('modal-qty-price').textContent = fmtPrice(prod.price);
  document.getElementById('modal-qty-val').textContent   = '1';
  document.getElementById('modal-qty-notes').value       = '';
  document.getElementById('modal-qty-pid').value         = pid;
  document.getElementById('modal-qty').classList.remove('hidden');
}
function changeQty(d) { state.addQty=Math.max(1,(state.addQty||1)+d); document.getElementById('modal-qty-val').textContent=state.addQty; }
function confirmAddToOrder() {
  const pid   = parseInt(document.getElementById('modal-qty-pid').value);
  const qty   = state.addQty||1;
  const notes = document.getElementById('modal-qty-notes').value.trim();
  const prod  = state.products.find(p=>p.id===pid);
  if (!prod||!state.activeOrderId) return;
  state.orderItems.push({ id:genId('item'), orderId:state.activeOrderId, productId:pid, qty, price:prod.price, cost:prod.cost||0, notes, status:'active' });
  saveState(); closeModal('modal-qty');
  notify(`${prod.emoji} ${prod.name} agregado`,'success');
  refreshCart(state.activeOrderId);
}
function cancelItem(itemId) {
  const item = state.orderItems.find(i=>i.id===itemId); if (!item) return;
  item.status='cancelled'; saveState();
  notify(`${state.products.find(p=>p.id===item.productId)?.name||'Producto'} cancelado`,'error');
  refreshCart(state.activeOrderId||item.orderId);
}
function reactivateItem(itemId) {
  const item = state.orderItems.find(i=>i.id===itemId); if (!item) return;
  item.status='active'; saveState();
  notify(`${state.products.find(p=>p.id===item.productId)?.name||'Producto'} reactivado`,'success');
  refreshCart(state.activeOrderId||item.orderId);
}

/* ==========================================================
   16. CAMBIO DE MESA
========================================================== */
function openMoveTable() {
  state.moveTableTarget=null;
  const grid = document.getElementById('move-tables-grid');
  const renderSm = fl => {
    const tbs = state.tables.filter(t=>t.floor===fl&&t.id!==state.selectedTable);
    return `<div style="font-size:11px;font-weight:800;text-transform:uppercase;color:var(--text-dim);margin:10px 0 6px">
      <i class="fa-solid fa-${fl}"></i> Piso ${fl}</div>
      <div class="tables-grid-sm" style="margin-top:0">
        ${tbs.map(t=>{const has=!!getOrderForTable(t.id);
          return `<div class="table-sm ${has?'occupied':''}" onclick="selectMoveTarget(${t.id},this)">
            <div class="ts-num">${t.num}</div><div class="ts-status">${has?'Ocupada':'Libre'}</div>
          </div>`;}).join('')}
      </div>`;
  };
  grid.innerHTML = renderSm(1)+renderSm(2);
  document.getElementById('modal-move').classList.remove('hidden');
}
function selectMoveTarget(tid,el) {
  document.querySelectorAll('.table-sm').forEach(t=>t.classList.remove('selected'));
  el.classList.add('selected'); state.moveTableTarget=tid;
}
function confirmMoveTable() {
  if (!state.moveTableTarget) { notify('Selecciona una mesa destino','error'); return; }
  if (getOrderForTable(state.moveTableTarget)) { notify('La mesa destino ya tiene un pedido','error'); return; }
  const order=getOrderForTable(state.selectedTable); if (!order) return;
  const oldT=state.tables.find(t=>t.id===state.selectedTable);
  const newT=state.tables.find(t=>t.id===state.moveTableTarget);
  oldT.status='free'; newT.status=order.status==='pending_payment'?'pending_payment':'occupied';
  order.tableId=state.moveTableTarget; state.selectedTable=state.moveTableTarget; state.selectedFloor=newT.floor;
  saveState(); closeModal('modal-move');
  notify(`Pedido movido a Mesa ${newT.num} — Piso ${newT.floor} ✅`,'success');
  bossSection('tables');
}

/* ==========================================================
   17. PANEL JEFE
========================================================== */
function bossSection(sec) {
  document.querySelectorAll('#boss-sidebar .sidebar-nav-item').forEach(i=>i.classList.remove('active'));
  if (event?.target) { const it=event.target.closest('.sidebar-nav-item'); if(it) it.classList.add('active'); }
  const content = document.getElementById('boss-content');
  if      (sec==='dashboard') renderDashboard(content);
  else if (sec==='tables')    renderBossTables(content);
  else if (sec==='orders')    renderAllOrders(content);
  else if (sec==='products')  renderProductAdmin(content);
  else if (sec==='reports')   renderReports(content);
}

/* ── Dashboard ── */
function renderDashboard(content) {
  const totalProds     = state.products.filter(p=>p.status==='active').length;
  const occupiedCount  = state.tables.filter(t=>t.status!=='free').length;
  const activeCount    = state.orders.filter(o=>o.status==='active').length;
  const pendingCount   = state.orders.filter(o=>o.status==='pending_payment').length;
  const day = state.currentDayId ? state.workDays.find(d=>d.id===state.currentDayId) : null;
  const dayStats = day ? calcDayStats(state.currentDayId) : null;

  const pendingAlerts = state.orders.filter(o=>o.status==='pending_payment').map(o=>{
    const t=state.tables.find(x=>x.id===o.tableId);
    return `<button class="btn btn-sm" style="background:#f0c040;color:#1a1200" onclick="openPaymentModal(${o.id})">
      <i class="fa-solid fa-money-bill-wave"></i> Mesa ${t?.num} Piso ${t?.floor} · ${fmtPrice(orderTotal(o.id))}
    </button>`;
  }).join('');

  content.innerHTML = `
    <div class="panel-header">
      <h2>Dashboard</h2>
      <p>${day?`Jornada abierta desde las ${fmtTime(day.openedAt)}`:'Sin jornada activa — Abre el local para comenzar'}</p>
    </div>
    ${!state.currentDayId?`
      <div style="background:rgba(231,76,60,0.08);border:1px solid rgba(231,76,60,0.3);border-radius:var(--radius);padding:20px 24px;margin-bottom:20px;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
        <div style="flex:1"><strong style="color:var(--text)">⚠️ El local está cerrado</strong><br>
        <span style="font-size:13px;color:var(--text-muted)">Abre la jornada desde el botón "Abrir Local" en el menú lateral para comenzar a operar.</span></div>
        <button class="btn btn-success" onclick="openOpenLocalModal()"><i class="fa-solid fa-store"></i> Abrir Local Ahora</button>
      </div>` : ''}
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-label">Productos Activos</div><div class="stat-value">${totalProds}</div></div>
      <div class="stat-card"><div class="stat-label">Mesas Ocupadas</div><div class="stat-value">${occupiedCount}</div><div class="stat-sub">de ${state.tables.length}</div></div>
      <div class="stat-card"><div class="stat-label">Pedidos Activos</div><div class="stat-value">${activeCount}</div></div>
      <div class="stat-card" style="border-color:rgba(240,192,64,0.4)">
        <div class="stat-label" style="color:#f0c040">Pago Pendiente</div>
        <div class="stat-value" style="color:#f0c040">${pendingCount}</div>
      </div>
      ${dayStats?`
      <div class="stat-card"><div class="stat-label">Ventas Hoy</div><div class="stat-value" style="font-size:24px">${fmtPrice(dayStats.totalSales)}</div></div>
      <div class="stat-card"><div class="stat-label">Ganancia Hoy</div>
        <div class="stat-value" style="font-size:24px;color:${dayStats.totalProfit>=0?'var(--green)':'var(--red)'}">
          ${fmtPrice(dayStats.totalProfit)}</div></div>`:''}
    </div>
    ${pendingCount>0?`
      <div style="background:rgba(240,192,64,0.08);border:1px solid rgba(240,192,64,0.3);border-radius:var(--radius);padding:16px 20px;margin-bottom:20px">
        <h3 style="font-size:18px;color:#f0c040;margin-bottom:12px"><i class="fa-solid fa-triangle-exclamation"></i> Mesas esperando cobro</h3>
        <div style="display:flex;gap:10px;flex-wrap:wrap">${pendingAlerts}</div>
      </div>`:''}
    <div class="panel-header" style="margin-top:8px"><h2 style="font-size:28px">Mesas en vivo</h2></div>
    ${renderFloorTabs('boss')}
    ${renderFloorTables([],true)}`;
}

function renderBossTables(content) {
  content.innerHTML = `
    <div class="panel-header"><h2>Todas las Mesas</h2><p>💛 = pago pendiente</p></div>
    ${renderFloorTabs('boss')}
    ${renderFloorTables([],true)}
    ${state.selectedTable?'<div id="boss-order-inline" style="margin-top:24px"></div>':''}`;
  if (state.selectedTable) {
    const ord = getOrderForTable(state.selectedTable);
    state.activeOrderId = ord?ord.id:null;
    renderOrderPanel(document.getElementById('boss-order-inline'), true);
  }
}

function bossSelectTable(tableId) {
  state.selectedTable = tableId;
  const ord = getOrderForTable(tableId);
  state.activeOrderId = ord?ord.id:null;
  renderBossTables(document.getElementById('boss-content'));
}

/* ── Todos los pedidos ── */
function renderAllOrders(content) {
  const active  = state.orders.filter(o=>o.status==='active');
  const pending = state.orders.filter(o=>o.status==='pending_payment');
  const paid    = state.orders.filter(o=>o.status==='paid').slice(-15).reverse();
  const card = ord => {
    const t=state.tables.find(x=>x.id===ord.tableId);
    const w=USERS.find(u=>u.id===ord.waiterId);
    const items=getOrderItems(ord.id);
    const total=orderTotal(ord.id);
    const bm={active:'badge-green',pending_payment:'badge-yellow',paid:'badge-orange'};
    const lm={active:'Activo',pending_payment:'Pago Pendiente',paid:'Cobrado'};
    return `<div class="order-card">
      <div class="order-card-header">
        <h4>Pedido #${ord.id} — Mesa ${t?.num||'?'} · Piso ${t?.floor||'?'}</h4>
        <div style="display:flex;gap:8px;align-items:center">
          <span class="badge ${bm[ord.status]||'badge-orange'}">${lm[ord.status]||ord.status}</span>
          <span style="font-family:'Bebas Neue',sans-serif;font-size:20px;color:var(--accent)">${fmtPrice(total)}</span>
          ${ord.status==='pending_payment'?`<button class="btn btn-success btn-sm" onclick="openPaymentModal(${ord.id})"><i class="fa-solid fa-money-bill-wave"></i> Cobrar</button>`:''}
        </div>
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-bottom:8px">
        ${w?.name||'?'} · ${fmtTime(ord.createdAt)}${ord.payMethod?' · '+ord.payMethod:''}
      </div>
      <div class="order-items-mini">
        ${items.map(i=>{const p=state.products.find(x=>x.id===i.productId);
          return `<span class="order-item-mini ${i.status==='cancelled'?'cancelled':''}">${p?.emoji||''} ${p?.name||'?'} ×${i.qty}</span>`;
        }).join('')}
      </div>
    </div>`;
  };
  content.innerHTML = `
    <div class="panel-header"><h2>Todos los Pedidos</h2></div>
    <h3 style="font-size:22px;margin-bottom:12px;color:#f0c040"><i class="fa-solid fa-clock"></i> Pago Pendiente (${pending.length})</h3>
    <div class="orders-list">${pending.length?pending.map(card).join(''):'<p style="color:var(--text-muted);font-size:13px">Ninguno</p>'}</div>
    <h3 style="font-size:22px;margin:24px 0 12px;color:var(--accent)"><i class="fa-solid fa-fire"></i> Activos (${active.length})</h3>
    <div class="orders-list">${active.length?active.map(card).join(''):'<p style="color:var(--text-muted);font-size:13px">Ninguno</p>'}</div>
    <h3 style="font-size:22px;margin:24px 0 12px;color:var(--green)"><i class="fa-solid fa-circle-check"></i> Cobrados</h3>
    <div class="orders-list">${paid.length?paid.map(card).join(''):'<p style="color:var(--text-muted);font-size:13px">Ninguno aún</p>'}</div>`;
}

/* ==========================================================
   18. REPORTE DIARIO
========================================================== */
function renderReports(content) {
  const days = [...state.workDays].reverse(); // más reciente primero

  const dayCard = day => {
    const { totalSales, totalCost, totalProfit, paidOrders } = calcDayStats(day.id);
    const totalInvest = day.investments.reduce((s,i)=>s+(i.amount||0),0);
    const netProfit   = totalProfit - totalInvest;
    const dayOrders   = state.orders.filter(o=>o.dayId===day.id&&o.status==='paid');
    const isOpen      = day.status==='open';

    return `
      <div class="report-day-card">
        <div class="rdc-header">
          <div>
            <h4>${fmtDate(day.openedAt)}</h4>
            <span style="font-size:12px;color:var(--text-muted)">
              Apertura: ${fmtTime(day.openedAt)}
              ${day.closedAt?` · Cierre: ${fmtTime(day.closedAt)}`:''}
            </span>
          </div>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
            <span class="rdc-status ${isOpen?'rdc-open':'rdc-closed'}">${isOpen?'🟢 Abierta':'🔒 Cerrada'}</span>
            ${isOpen?`<button class="btn btn-danger btn-sm" onclick="openCloseLocalModal()"><i class="fa-solid fa-lock"></i> Cerrar Jornada</button>`:''}
          </div>
        </div>

        <div class="rdc-metrics">
          <div class="rdc-metric">
            <div class="rm-label">Inversión</div>
            <div class="rm-value" style="color:#f0c040">${fmtPrice(totalInvest)}</div>
          </div>
          <div class="rdc-metric">
            <div class="rm-label">Ventas</div>
            <div class="rm-value" style="color:var(--accent)">${fmtPrice(totalSales)}</div>
          </div>
          <div class="rdc-metric">
            <div class="rm-label">Costo producción</div>
            <div class="rm-value" style="color:var(--text-muted)">${fmtPrice(totalCost)}</div>
          </div>
          <div class="rdc-metric">
            <div class="rm-label">Ganancia bruta</div>
            <div class="rm-value" style="color:${totalProfit>=0?'var(--green)':'var(--red)'}">${fmtPrice(totalProfit)}</div>
          </div>
          <div class="rdc-metric">
            <div class="rm-label">Ganancia neta</div>
            <div class="rm-value" style="color:${netProfit>=0?'var(--green)':'var(--red)'}; font-size:26px">${fmtPrice(netProfit)}</div>
          </div>
          <div class="rdc-metric">
            <div class="rm-label">Pedidos cobrados</div>
            <div class="rm-value" style="color:var(--text)">${paidOrders}</div>
          </div>
        </div>

        ${day.investments.length?`
          <div class="rdc-investments">
            <h5><i class="fa-solid fa-boxes-stacking"></i> Inversiones del día</h5>
            ${day.investments.map(inv=>`
              <div class="rdc-inv-item">
                <span>${inv.desc}</span>
                <span style="color:#f0c040">${fmtPrice(inv.amount)}</span>
              </div>`).join('')}
          </div>`:''}

        ${dayOrders.length?`
          <div class="rdc-orders-mini">
            <h5><i class="fa-solid fa-list-check"></i> Pedidos cobrados (${dayOrders.length})</h5>
            <div class="rdc-orders-wrap">
              ${dayOrders.map(o=>{
                const t=state.tables.find(x=>x.id===o.tableId);
                return `<span class="rdc-order-chip">
                  Mesa ${t?.num||'?'} · ${fmtPrice(orderTotal(o.id))} · ${o.payMethod||'?'}
                </span>`;
              }).join('')}
            </div>
          </div>`:''}

        ${day.openNotes||day.closeNotes?`
          <div style="padding:10px 20px;border-top:1px solid var(--border);font-size:12px;color:var(--text-muted)">
            ${day.openNotes?`<span>📝 Apertura: ${day.openNotes}</span><br>`:''}
            ${day.closeNotes?`<span>📝 Cierre: ${day.closeNotes}</span>`:''}
          </div>`:''}
      </div>`;
  };

  content.innerHTML = `
    <div class="panel-header" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
      <div><h2>Reporte Diario</h2><p>Historial de jornadas — inversión, ventas y ganancias</p></div>
      ${!state.currentDayId?`<button class="btn btn-success" onclick="openOpenLocalModal()"><i class="fa-solid fa-store"></i> Abrir Nueva Jornada</button>`:''}
    </div>
    ${days.length === 0
      ? `<div class="card" style="text-align:center;padding:60px">
           <i class="fa-solid fa-chart-line" style="font-size:48px;color:var(--text-dim)"></i>
           <p style="color:var(--text-muted);margin-top:16px;font-weight:700">No hay jornadas registradas aún</p>
           <p style="color:var(--text-dim);font-size:13px;margin-top:8px">Abre el local para comenzar a registrar tu primera jornada</p>
         </div>`
      : `<div class="report-list">${days.map(dayCard).join('')}</div>`}`;
}

/* ==========================================================
   19. CRUD DE PRODUCTOS
========================================================== */
function renderProductAdmin(content) {
  content.innerHTML = `
    <div class="panel-header"><h2>Gestión de Productos</h2><p>Crea, edita o desactiva productos del menú</p></div>
    <div class="admin-toolbar">
      <button class="btn btn-primary" onclick="openProductModal()"><i class="fa-solid fa-plus"></i> Nuevo Producto</button>
      <input class="form-control" id="admin-search" style="max-width:220px" placeholder="Buscar..." oninput="renderProductTable()">
      <select class="form-control" id="admin-cat" style="max-width:160px" onchange="renderProductTable()">
        <option value="">Todas</option><option>Hamburguesas</option><option>Especiales</option>
        <option>Hot Dog</option><option>Bebidas</option><option>Infantil</option><option>Entradas</option>
      </select>
    </div>
    <div style="overflow-x:auto">
      <table class="admin-products-table">
        <thead><tr><th></th><th>Nombre</th><th>Categoría</th><th>Costo</th><th>Precio</th><th>Margen</th><th>Estado</th><th>Acciones</th></tr></thead>
        <tbody id="prod-tbody"></tbody>
      </table>
    </div>`;
  renderProductTable();
}

function renderProductTable() {
  const tbody = document.getElementById('prod-tbody'); if (!tbody) return;
  const search = (document.getElementById('admin-search')?.value||'').toLowerCase();
  const cat    = document.getElementById('admin-cat')?.value||'';
  tbody.innerHTML = state.products.filter(p=>(!cat||p.cat===cat)&&(!search||p.name.toLowerCase().includes(search)))
    .map(p=>{
      const margin = p.price>0?Math.round(((p.price-(p.cost||0))/p.price)*100):0;
      return `<tr>
        <td><div class="prod-thumb">${p.emoji}</div></td>
        <td><strong>${p.name}</strong><br><span style="font-size:11px;color:var(--text-muted)">${(p.desc||'').substring(0,55)}…</span></td>
        <td><span class="badge ${getCatClass(p.cat)}">${p.cat}</span></td>
        <td style="font-size:13px;color:#f0c040;font-weight:800">${fmtPrice(p.cost||0)}</td>
        <td style="font-family:'Bebas Neue',sans-serif;font-size:18px;color:var(--accent)">${fmtPrice(p.price)}</td>
        <td><span class="badge ${margin>=40?'badge-green':margin>=20?'badge-orange':'badge-red'}">${margin}%</span></td>
        <td><span class="badge ${p.status==='active'?'badge-green':'badge-red'}">${p.status==='active'?'Activo':'Inactivo'}</span></td>
        <td>
          <div style="display:flex;gap:6px">
            <button class="btn btn-secondary btn-sm btn-icon" onclick="openProductModal(${p.id})"><i class="fa-solid fa-pen"></i></button>
            <button class="btn btn-sm ${p.status==='active'?'btn-danger':'btn-success'}" onclick="toggleProductStatus(${p.id})">
              <i class="fa-solid ${p.status==='active'?'fa-eye-slash':'fa-eye'}"></i></button>
            <button class="btn btn-danger btn-sm btn-icon" onclick="deleteProduct(${p.id})"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>`;
    }).join('');
}

function openProductModal(id) {
  const modal = document.getElementById('modal-product');
  if (id) {
    const p = state.products.find(x=>x.id===id); if (!p) return;
    document.getElementById('modal-prod-title').textContent='Editar Producto';
    document.getElementById('prod-name').value   = p.name;
    document.getElementById('prod-desc').value   = p.desc||'';
    document.getElementById('prod-price').value  = p.price;
    document.getElementById('prod-cost').value   = p.cost||0;
    document.getElementById('prod-cat').value    = p.cat;
    document.getElementById('prod-emoji').value  = p.emoji;
    document.getElementById('prod-status').value = p.status;
    document.getElementById('prod-edit-id').value= p.id;
  } else {
    document.getElementById('modal-prod-title').textContent='Nuevo Producto';
    ['prod-name','prod-desc','prod-price','prod-cost','prod-emoji'].forEach(i=>document.getElementById(i).value='');
    document.getElementById('prod-cat').value    = 'Hamburguesas';
    document.getElementById('prod-status').value = 'active';
    document.getElementById('prod-edit-id').value= '';
  }
  modal.classList.remove('hidden');
}

function saveProduct() {
  const name   = document.getElementById('prod-name').value.trim();
  const desc   = document.getElementById('prod-desc').value.trim();
  const price  = parseFloat(document.getElementById('prod-price').value);
  const cost   = parseFloat(document.getElementById('prod-cost').value)||0;
  const cat    = document.getElementById('prod-cat').value;
  const emoji  = document.getElementById('prod-emoji').value.trim()||CAT_EMOJI[cat]||'🍔';
  const status = document.getElementById('prod-status').value;
  const editId = document.getElementById('prod-edit-id').value;
  if (!name||!price) { notify('Nombre y precio son obligatorios','error'); return; }
  if (editId) {
    const p = state.products.find(x=>x.id===parseInt(editId));
    if (p) Object.assign(p, {name,desc,price,cost,cat,emoji,status});
    notify(`${name} actualizado ✅`,'success');
  } else {
    state.products.push({id:genId('product'),name,desc,price,cost,cat,emoji,status});
    notify(`${name} creado ✅`,'success');
  }
  saveState(); closeModal('modal-product'); renderProductTable();
}

function toggleProductStatus(id) {
  const p=state.products.find(x=>x.id===id); if (!p) return;
  p.status=p.status==='active'?'inactive':'active'; saveState();
  notify(`${p.name} ${p.status==='active'?'activado':'desactivado'}`,p.status==='active'?'success':'info');
  renderProductTable();
}
function deleteProduct(id) {
  if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) return;
  state.products=state.products.filter(p=>p.id!==id); saveState();
  notify('Producto eliminado','error'); renderProductTable();
}

/* ==========================================================
   20. MODALES
========================================================== */
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', function(e) { if (e.target===this) this.classList.add('hidden'); });
});

/* ==========================================================
   21. INIT
========================================================== */
function init() {
  loadState();
  renderPublicMenu('all');
  updateNavbars();
}

init();
