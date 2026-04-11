/* ═══════════════════════════════════════════════
   MISTER BURGER POS · app.js  v5
   Nuevas funciones:
   · Usuario "cocina" con vista de pedidos por llegada
     separando Comida vs Bebidas, con temporizador
   · Panel de mesas unificado (jefe y mesero iguales)
     — al seleccionar una mesa la pantalla NO hace scroll,
       el pedido aparece en un panel lateral integrado
   · Sidebar colapsable con overlay en móvil
   · Responsividad completa
═══════════════════════════════════════════════ */
'use strict';

/* ─────────────────────────────────────────────
   CONSTANTES DE BASE DE DATOS
───────────────────────────────────────────── */
const DB_KEYS={users:'mb4_users',products:'mb4_products',tables:'mb4_tables',orders:'mb4_orders',items:'mb4_items',days:'mb4_days',trans:'mb4_transactions',seq:'mb4_sequences',session:'mb4_session'};

const DEFAULT_USERS=[
  {id:1,username:'mesero',password:'1234', role:'waiter', name:'Carlos M.',  active:true,createdAt:'2024-01-01'},
  {id:2,username:'jefe',  password:'admin',role:'boss',   name:'Jefe Admin', active:true,createdAt:'2024-01-01'},
  {id:3,username:'maria', password:'1234', role:'waiter', name:'María G.',   active:true,createdAt:'2024-01-01'},
  {id:4,username:'cocina',password:'1234', role:'kitchen',name:'Cocina',     active:true,createdAt:'2024-01-01'},
];

const CAT_EMOJI={Hamburguesas:'🍔',Especiales:'🥩','Hot Dog':'🌭',Bebidas:'🥤',Infantil:'🍟',Entradas:'🥗'};
/* Categorías que van a cocina (comida) vs barra (bebidas) */
const DRINK_CATS=['Bebidas'];
const FOOD_CATS =['Hamburguesas','Especiales','Hot Dog','Infantil','Entradas'];

const DEFAULT_PRODUCTS=[
  {id:1, name:'Clásica',         cost:6000, price:15000,cat:'Hamburguesas',emoji:'🍔',image:null,status:'active',desc:'Pan artesanal, queso, 150g carne 100% res, tomate, cebolla y lechuga'},
  {id:2, name:'Tocineta',        cost:7500, price:17500,cat:'Hamburguesas',emoji:'🥓',image:null,status:'active',desc:'Pan artesanal, queso, 150g carne 100% res, tocineta ahumada, tomate, cebolla y lechuga'},
  {id:3, name:'Mexicana',        cost:8000, price:18500,cat:'Hamburguesas',emoji:'🌶️',image:null,status:'active',desc:'Pan artesanal, queso, 150g carne, jalapeños, salsa de guacamole, tomate, cebolla y lechuga'},
  {id:4, name:'Vaquera',         cost:9500, price:21500,cat:'Hamburguesas',emoji:'🤠',image:null,status:'active',desc:'Pan artesanal, queso, 150g carne 100% res, costilla ahumada a la plancha'},
  {id:5, name:'Campesina',       cost:10000,price:22000,cat:'Hamburguesas',emoji:'🌽',image:null,status:'active',desc:'Pan artesanal, queso, 150g res maduro, huevo frito, chorizo, tocineta ahumada, maíz tierno'},
  {id:6, name:'Criolla',         cost:9000, price:20500,cat:'Hamburguesas',emoji:'🥚',image:null,status:'active',desc:'Pan artesanal, queso, 150g carne 100% res, tocineta ahumada, huevo frito, maíz tierno'},
  {id:7, name:'Cheddar',         cost:7000, price:16000,cat:'Hamburguesas',emoji:'🧀',image:null,status:'active',desc:'Pan artesanal, queso, 150g carne 100% res, queso cheddar, tomate, cebolla y lechuga'},
  {id:8, name:'Ranchera',        cost:8500, price:19000,cat:'Hamburguesas',emoji:'🔥',image:null,status:'active',desc:'Pan artesanal, queso, 150g carne 100% res, tocineta, chorizo, tomate, cebolla y lechuga'},
  {id:9, name:'Paisa',           cost:9000, price:20000,cat:'Hamburguesas',emoji:'🫓',image:null,status:'active',desc:'Arepa paisa, queso, 150g carne 100% res, huevo frito, chorizo, pimentón, cebolla, maíz tierno y tomate'},
  {id:10,name:'Callejera',       cost:9000, price:20000,cat:'Hamburguesas',emoji:'🌆',image:null,status:'active',desc:'Pan artesanal, doble queso, 150g carne 100% res, tocineta ahumada, cebolla con salsa rosada'},
  {id:11,name:'Hawaiana',        cost:8000, price:17500,cat:'Hamburguesas',emoji:'🍍',image:null,status:'active',desc:'Pan artesanal, queso, 150g carne 100% res, piña melada, tomate, cebolla y lechuga'},
  {id:12,name:'Tentación',       cost:9500, price:21000,cat:'Hamburguesas',emoji:'🍌',image:null,status:'active',desc:'Plátano maduro, doble queso, tocineta, carne 150g, huevo frito, lechuga y salsa dulce maíz'},
  {id:13,name:'Trifásica',       cost:13000,price:27000,cat:'Hamburguesas',emoji:'🏆',image:null,status:'active',desc:'Pan artesanal, triple carne (res, cerdo, pollo), triple queso crema, tomate, cebolla y lechuga'},
  {id:14,name:'Marinera',        cost:10000,price:21500,cat:'Hamburguesas',emoji:'🦐',image:null,status:'active',desc:'Pan artesanal, queso, 150g carne 100% res, camarones salteados con salsa especial'},
  {id:15,name:'Extrema Queso',   cost:11000,price:25000,cat:'Hamburguesas',emoji:'🫕',image:null,status:'active',desc:'Pan artesanal, queso, 150g carne 100% res, tocineta ahumada, queso cheddar fundido, doble crema'},
  {id:16,name:'Jumanji',         cost:10000,price:22000,cat:'Hamburguesas',emoji:'🦁',image:null,status:'active',desc:'Pan artesanal, queso crema y cheddar, doble carne 100% res, doble porción de tocineta ahumada, sin vegetales'},
  {id:17,name:'Mister Burger',   cost:12000,price:25000,cat:'Hamburguesas',emoji:'⭐',image:null,status:'active',desc:'Pan artesanal, doble queso, doble carne 100% res, tocineta ahumada, chorizo, huevo frito, maíz tierno'},
  {id:18,name:'Caqueteña',       cost:12000,price:25000,cat:'Hamburguesas',emoji:'🌿',image:null,status:'active',desc:'Plátano, doble queso, 150g carne 100% res, pollo apanado, tocineta ahumada, chorizo, huevo frito'},
  {id:19,name:'Ropa Vieja',      cost:9500, price:21500,cat:'Hamburguesas',emoji:'🥘',image:null,status:'active',desc:'Pan artesanal, queso, 150g carne 100% res, carne desmechada bañada en salsa bolonesa'},
  {id:20,name:'Crunch',          cost:9000, price:20500,cat:'Hamburguesas',emoji:'🍗',image:null,status:'active',desc:'Pan artesanal, queso, doble carne pollo apanado, tomate, cebolla y lechuga'},
  {id:21,name:'Parrillada',      cost:15000,price:32000,cat:'Especiales',emoji:'🥩',image:null,status:'active',desc:'Lomo fino de res, pechuga, lomo de cerdo, chorizo, patacón, papas a la francesa y ensalada'},
  {id:22,name:'Pechuga Plancha', cost:16000,price:35000,cat:'Especiales',emoji:'🍖',image:null,status:'active',desc:'Acompañamiento de papas a la francesa, ensalada. 2 opciones para el plato'},
  {id:23,name:'Baby Beef',       cost:20000,price:42000,cat:'Especiales',emoji:'🥗',image:null,status:'active',desc:'Lomo fino con papas a la francesa, pataconas, tocineta y ensalada'},
  {id:24,name:'Patacón Especial',cost:14000,price:32000,cat:'Especiales',emoji:'🫔',image:null,status:'active',desc:'Lomo fino de res, pechuga, lomo de cerdo, chorizo, patacón, maíz tierno, queso gratinado'},
  {id:25,name:'Maicito',         cost:14000,price:32000,cat:'Especiales',emoji:'🌽',image:null,status:'active',desc:'Carne mixta, pollo, lomo fino de res, lomo de cerdo, cebolla grillé, papas a la francesa, 2 yucas'},
  {id:26,name:'Chicharronuda',   cost:19000,price:42000,cat:'Especiales',emoji:'🥓',image:null,status:'active',desc:'Porción de costilla con chicharrón, patacón, papas a la francesa y ensalada'},
  {id:27,name:'Costillas BBQ',   cost:14000,price:32000,cat:'Especiales',emoji:'🍖',image:null,status:'active',desc:'Costillitas bañadas en salsa BBQ, papas a la francesa, patacón y ensalada'},
  {id:28,name:'Burrito',         cost:11000,price:25000,cat:'Especiales',emoji:'🌯',image:null,status:'active',desc:'Tortilla de trigo, queso, trozos de lomo fino, pechuga y lomo de cerdo, salsas y verduras'},
  {id:29,name:'Alitas BBQ',      cost:10000,price:23000,cat:'Especiales',emoji:'🍗',image:null,status:'active',desc:'Alas de pollo bañadas en salsa BBQ, papas a la francesa y ensalada'},
  {id:30,name:'Punta de Anca',   cost:20000,price:43000,cat:'Especiales',emoji:'🥩',image:null,status:'active',desc:'Corte fino de picaña a la plancha, papas a la francesa, yuquitas y ensalada'},
  {id:31,name:'Ensalada Mister', cost:9000, price:22000,cat:'Especiales',emoji:'🥗',image:null,status:'active',desc:'Trocitos de pollo, piña, huevos de codorniz, patacón, queso, lechuga, maíz tierno'},
  {id:32,name:'Lomo de Cerdo',   cost:19000,price:43000,cat:'Especiales',emoji:'🐷',image:null,status:'active',desc:'Cerdo a la plancha, papas a la francesa y ensalada'},
  {id:33,name:'Churrasco',       cost:19000,price:43000,cat:'Especiales',emoji:'🥩',image:null,status:'active',desc:'Lomo ancho a la plancha, chimichurri, papas a la francesa y ensalada'},
  {id:34,name:'Bistec a Caballo',cost:19000,price:43000,cat:'Especiales',emoji:'🍳',image:null,status:'active',desc:'Lomo de res a la plancha con hogao, papas a la francesa, 2 huevos fritos y ensalada'},
  {id:35,name:'Hot Dog Sencillo',cost:4500, price:12500,cat:'Hot Dog',emoji:'🌭',image:null,status:'active',desc:'Pan, salchicha, queso, papa ripio'},
  {id:36,name:'Hot Dog Hawaiano',cost:5500, price:14000,cat:'Hot Dog',emoji:'🍍',image:null,status:'active',desc:'Con melao de piña'},
  {id:37,name:'Hot Dog Especial',cost:6000, price:15000,cat:'Hot Dog',emoji:'🌭',image:null,status:'active',desc:'Con tocineta y cebolla grillé'},
  {id:38,name:'Hot Dog Mexicano',cost:6000, price:15000,cat:'Hot Dog',emoji:'🌶️',image:null,status:'active',desc:'Con jalapeños y salsa guacamole'},
  {id:39,name:'Hot Dog Mister',  cost:7500, price:18500,cat:'Hot Dog',emoji:'⭐',image:null,status:'active',desc:'Con tocineta, chorizo, maíz, huevos de codorniz'},
  {id:40,name:'Limonada Natural',cost:2000, price:6000, cat:'Bebidas',emoji:'🍋',image:null,status:'active',desc:'Fresca y natural'},
  {id:41,name:'Limonada Coco',   cost:4000, price:11000,cat:'Bebidas',emoji:'🥥',image:null,status:'active',desc:'Refrescante con coco'},
  {id:42,name:'Limonada Yerbabuena',cost:4000,price:11000,cat:'Bebidas',emoji:'🌿',image:null,status:'active',desc:'Con hierbabuena fresca'},
  {id:43,name:'Mandarinada',     cost:4000, price:11000,cat:'Bebidas',emoji:'🍊',image:null,status:'active',desc:'Jugo natural de mandarina'},
  {id:44,name:'Naranjada',       cost:4000, price:11000,cat:'Bebidas',emoji:'🍊',image:null,status:'active',desc:'Jugo natural de naranja'},
  {id:45,name:'Piña Colada',     cost:4500, price:12000,cat:'Bebidas',emoji:'🍹',image:null,status:'active',desc:'Piña colada tropical'},
  {id:46,name:'Cerveza Nacional',cost:3000, price:6000, cat:'Bebidas',emoji:'🍺',image:null,status:'active',desc:'Fría y refrescante'},
  {id:47,name:'Jugo Arazá',      cost:4000, price:11000,cat:'Bebidas',emoji:'🍹',image:null,status:'active',desc:'Exótico jugo amazónico de arazá'},
  {id:48,name:'Hot Dog Kids',    cost:7000, price:18500,cat:'Infantil',emoji:'🌭',image:null,status:'active',desc:'Mini perro americano, papitas a la francesa, jugo hit o pony mini y nucita'},
  {id:49,name:'Burger Kids',     cost:7000, price:18500,cat:'Infantil',emoji:'🍔',image:null,status:'active',desc:'Hamburguesa mini, papitas a la francesa, jugo hit o pony mini y nucita'},
  {id:50,name:'Nuggets Kids',    cost:6000, price:16500,cat:'Infantil',emoji:'🍗',image:null,status:'active',desc:'Nuggets de pollo, papitas a la francesa, jugo hit o pony mini y nucita'},
  {id:51,name:'Papitas Cheddar Kids',cost:6000,price:16500,cat:'Infantil',emoji:'🧀',image:null,status:'active',desc:'Trocitos de tocineta, papitas con queso cheddar, jugo hit o pony mini y nucita'},
  {id:52,name:'Patacones Hogao', cost:2500, price:7000, cat:'Entradas',emoji:'🫓',image:null,status:'active',desc:'Patacones con hogao casero'},
  {id:53,name:'Arepas Hogao',    cost:2500, price:7000, cat:'Entradas',emoji:'🫓',image:null,status:'active',desc:'Arepas tradicionales con hogao'},
  {id:54,name:'Papas Criollas',  cost:2500, price:7000, cat:'Entradas',emoji:'🥔',image:null,status:'active',desc:'Papas criollas fritas'},
  {id:55,name:'Aritos Cebolla',  cost:3000, price:8000, cat:'Entradas',emoji:'🧅',image:null,status:'active',desc:'Anillos de cebolla fritos'},
  {id:56,name:'Deditos',         cost:2500, price:7000, cat:'Entradas',emoji:'🧆',image:null,status:'active',desc:'Deditos de queso fritos'},
  {id:57,name:'Yuquitas',        cost:2500, price:7000, cat:'Entradas',emoji:'🌿',image:null,status:'active',desc:'Yuca frita crujiente'},
];

function buildTables(){
  const t=[];
  for(let i=1;i<=14;i++) t.push({id:i,num:i,floor:1,status:'free'});
  for(let i=1;i<=23;i++) t.push({id:i+14,num:i,floor:2,status:'free'});
  return t;
}

/* ─────────────────────────────────────────────
   DB LAYER — localStorage como base de datos
───────────────────────────────────────────── */
const DB={
  get(k){try{return JSON.parse(localStorage.getItem(k))||null}catch{return null}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){console.warn('[MB]',e)}},
  seq(k){const s=this.get(DB_KEYS.seq)||{};s[k]=(s[k]||0)+1;this.set(DB_KEYS.seq,s);return s[k]},
  /* Users */
  getUsers(){return this.get(DB_KEYS.users)||DEFAULT_USERS},
  findUser(u,p){return this.getUsers().find(x=>x.username===u&&x.password===p&&x.active)},
  saveUsers(a){this.set(DB_KEYS.users,a)},
  /* Products */
  getProducts(){return this.get(DB_KEYS.products)||DEFAULT_PRODUCTS},
  saveProducts(a){this.set(DB_KEYS.products,a)},
  upsertProduct(p){const a=this.getProducts();const i=a.findIndex(x=>x.id===p.id);if(i>=0)a[i]={...a[i],...p};else a.push({id:this.seq('product'),...p});this.saveProducts(a)},
  deleteProduct(id){this.saveProducts(this.getProducts().filter(p=>p.id!==id))},
  /* Tables */
  getTables(){
    const t=this.get(DB_KEYS.tables);
    if(!t||t.length<37||t[0].floor===undefined){const f=buildTables();if(t)t.forEach(o=>{const x=f.find(y=>y.id===o.id);if(x)x.status=o.status});this.saveTables(f);return f}
    return t;
  },
  saveTables(a){this.set(DB_KEYS.tables,a)},
  updateTableStatus(id,s){const a=this.getTables();const x=a.find(y=>y.id===id);if(x){x.status=s;this.saveTables(a)}},
  /* Orders */
  getOrders(){return this.get(DB_KEYS.orders)||[]},
  saveOrders(a){this.set(DB_KEYS.orders,a)},
  createOrder(o){const a=this.getOrders();const id=this.seq('order');a.push({id,...o});this.saveOrders(a);return id},
  updateOrder(id,p){const a=this.getOrders();const i=a.findIndex(x=>x.id===id);if(i>=0)a[i]={...a[i],...p};this.saveOrders(a)},
  getActiveOrder(tid){return this.getOrders().find(o=>o.tableId===tid&&(o.status==='active'||o.status==='pending'))},
  /* Items */
  getItems(){return this.get(DB_KEYS.items)||[]},
  saveItems(a){this.set(DB_KEYS.items,a)},
  addItem(it){const a=this.getItems();const id=this.seq('item');a.push({id,...it});this.saveItems(a);return id},
  updateItem(id,p){const a=this.getItems();const i=a.findIndex(x=>x.id===id);if(i>=0)a[i]={...a[i],...p};this.saveItems(a)},
  orderItems(oid){return this.getItems().filter(i=>i.orderId===oid)},
  /* Days */
  getDays(){return this.get(DB_KEYS.days)||[]},
  saveDays(a){this.set(DB_KEYS.days,a)},
  getCurrentDay(){return this.getDays().find(d=>d.status==='open')||null},
  createDay(d){const a=this.getDays();const id=this.seq('day');a.push({id,...d});this.saveDays(a);return id},
  updateDay(id,p){const a=this.getDays();const i=a.findIndex(x=>x.id===id);if(i>=0)a[i]={...a[i],...p};this.saveDays(a)},
  /* Transactions */
  getTransactions(){return this.get(DB_KEYS.trans)||[]},
  addTransaction(t){const a=this.getTransactions();const id=this.seq('trans');a.push({id,...t});this.set(DB_KEYS.trans,a);return id},
  /* Session */
  getSession(){return this.get(DB_KEYS.session)},
  setSession(u){this.set(DB_KEYS.session,u)},
  clearSession(){localStorage.removeItem(DB_KEYS.session)},
};

/* ─────────────────────────────────────────────
   STATE
───────────────────────────────────────────── */
const S={
  user:null, selectedTable:null, activeOrder:null,
  floor:1, moveTarget:null, addPid:null, addQty:1,
  payOid:null, tempInv:[], payOid:null,
  kitchTab:'food', kitchSound:true, kitchTimer:null,
  knownOrders:[], // IDs conocidos por cocina para detectar nuevos
};

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const $=id=>document.getElementById(id);
const fmtCOP=n=>'$'+Number(n||0).toLocaleString('es-CO');
const fmtTime=iso=>iso?new Date(iso).toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit'}):'—';
const fmtDate=iso=>iso?new Date(iso).toLocaleDateString('es-CO',{weekday:'long',year:'numeric',month:'long',day:'numeric'}):'—';
function getCatClass(c){return({'Hamburguesas':'cc-hamburguesas','Especiales':'cc-especiales','Hot Dog':'cc-hot-dog','Bebidas':'cc-bebidas','Infantil':'cc-infantil','Entradas':'cc-entradas'}[c]||'cc-entradas')}
function orderTotal(oid){return DB.orderItems(oid).filter(i=>i.status==='active').reduce((s,i)=>s+i.price*i.qty,0)}
function orderCost(oid){return DB.orderItems(oid).filter(i=>i.status==='active').reduce((s,i)=>s+(i.cost||0)*i.qty,0)}
function elapsed(iso){const m=Math.floor((Date.now()-new Date(iso))/60000);return m}
function elapsedStr(iso){const m=elapsed(iso);return m<60?`${m}m`:`${Math.floor(m/60)}h ${m%60}m`}
function timerClass(iso){const m=elapsed(iso);return m<10?'ok':m<20?'warn':'late'}

/* ─────────────────────────────────────────────
   TOASTS
───────────────────────────────────────────── */
function toast(msg,type='default'){
  const icons={success:'fa-circle-check',error:'fa-circle-exclamation',info:'fa-circle-info',warning:'fa-triangle-exclamation',default:'fa-bell'};
  const el=document.createElement('div');
  el.className=`toast ${type}`;
  el.innerHTML=`<i class="fa-solid ${icons[type]||'fa-bell'}"></i><span>${msg}</span>`;
  $('toasts').appendChild(el);
  setTimeout(()=>{el.style.animation='toastOut .3s ease forwards';setTimeout(()=>el.remove(),300)},3200);
}

/* ─────────────────────────────────────────────
   APP ROUTING
───────────────────────────────────────────── */
function showApp(which){
  ['client','staff','login','kitchen'].forEach(a=>{
    const el=$(`app-${a}`);if(el)el.classList.toggle('hidden',a!==which);
  });
}
function showLogin(){showApp('login')}

/* ─────────────────────────────────────────────
   INIT
───────────────────────────────────────────── */
window.addEventListener('DOMContentLoaded',()=>{
  // Seed defaults if first time
  if(!DB.get(DB_KEYS.products))DB.saveProducts(DEFAULT_PRODUCTS);
  if(!DB.get(DB_KEYS.users))DB.saveUsers(DEFAULT_USERS);
  else{
    const users=DB.getUsers();
    if(!users.find(u=>u.role==='kitchen')){
      users.push({id:4,username:'cocina',password:'1234',role:'kitchen',name:'Cocina',active:true,createdAt:'2024-01-01'});
      DB.saveUsers(users);
    }
  }

  // ── Restaurar sesión SOLO si el usuario marcó "Recordarme" ──
  // Sin "Recordarme": la sesión vive en sessionStorage (se borra al cerrar la pestaña).
  // Con "Recordarme": la sesión se guarda en localStorage y persiste entre recargas.
  let saved = null;
  try { saved = JSON.parse(sessionStorage.getItem('mb4_sess_temp')); } catch(e){}
  if(!saved){ try { saved = DB.getSession(); } catch(e){} }

  if(saved){
    // Verificar que el usuario todavía exista y esté activo
    const valid = DB.getUsers().find(u=>u.id===saved.id&&u.active);
    if(valid){ S.user={...saved,...valid}; bootUser(); }
    else{
      // Usuario fue desactivado o eliminado — limpiar sesión y mostrar menú
      DB.clearSession();
      sessionStorage.removeItem('mb4_sess_temp');
      showApp('client'); renderClientMenu();
    }
  } else {
    // Sin sesión guardada → siempre mostrar menú público primero
    showApp('client');
    renderClientMenu();
  }

  updateLocalBadges();
  setTimeout(()=>{$('splash').classList.add('out');setTimeout(()=>{$('splash').style.display='none'},500)},2000);
});

function bootUser(){
  if(S.user.role==='kitchen'){bootKitchen();}
  else{showApp('staff');renderStaffNav();renderStaffProfile();updateStaffUser();updateLocalBadges();if(S.user.role==='boss')staffSection('dashboard');else staffSection('tables');}
}

/* ─────────────────────────────────────────────
   AUTH
───────────────────────────────────────────── */
function doLogin(){
  const u=$('l-user').value.trim(),p=$('l-pass').value.trim();
  const user=DB.findUser(u,p);
  if(!user){toast('Usuario o contraseña incorrectos','error');return;}
  S.user=user;
  const remember=$('l-remember')?.checked;
  if(remember){
    // "Recordarme" activado: persistir en localStorage entre sesiones
    DB.setSession(user);
  } else {
    // Sin "Recordarme": solo dura mientras la pestaña esté abierta
    DB.clearSession(); // limpiar cualquier sesión persistida anterior
    try{ sessionStorage.setItem('mb4_sess_temp', JSON.stringify(user)); }catch(e){}
  }
  toast(`Bienvenido, ${user.name} 👋`,'success');
  bootUser();
}
function logout(){
  if(S.kitchTimer){clearInterval(S.kitchTimer);S.kitchTimer=null;}
  S.user=null;S.selectedTable=null;S.activeOrder=null;
  DB.clearSession();
  try{ sessionStorage.removeItem('mb4_sess_temp'); }catch(e){}
  toast('Sesión cerrada','info');
  showApp('client');renderClientMenu();updateLocalBadges();
}

/* ─────────────────────────────────────────────
   STAFF NAV
───────────────────────────────────────────── */
const WAITER_NAV=[
  {label:'Operación'},
  {id:'tables', icon:'fa-table-cells',  text:'Mesas'},
  {id:'order',  icon:'fa-receipt',      text:'Pedido Activo'},
  {label:'Consulta'},
  {id:'menuview',icon:'fa-utensils',   text:'Ver Menú'},
];
const BOSS_NAV=[
  {label:'Dashboard'},
  {id:'dashboard',icon:'fa-chart-pie',   text:'Resumen'},
  {label:'Operación'},
  {id:'tables',   icon:'fa-table-cells', text:'Todas las Mesas'},
  {id:'orders',   icon:'fa-list-check',  text:'Todos los Pedidos'},
  {label:'Administración'},
  {id:'products', icon:'fa-box',         text:'Productos'},
  {id:'users',    icon:'fa-users',       text:'Usuarios'},
  {id:'reports',  icon:'fa-chart-line',  text:'Reporte Diario'},
  {label:'Local',isBottom:true},
  {id:'local',    icon:'fa-store',       text:'Abrir/Cerrar Local',dynamic:true},
];

function renderStaffNav(){
  const nav=$('st-nav');if(!nav)return;
  const items=S.user.role==='boss'?BOSS_NAV:WAITER_NAV;
  nav.innerHTML=items.map(item=>{
    if(item.label)return`<div class="st-nav__label">${item.label}</div>`;
    const isLocal=item.dynamic;
    const lbl=isLocal&&DB.getCurrentDay()?'Cerrar Local':item.text;
    return`<button class="st-nav__item${isLocal?' '+(DB.getCurrentDay()?'local-open':''):''}" id="nav-${item.id}" onclick="navClick('${item.id}')"><i class="fa-solid ${item.icon}"></i><span>${lbl}</span></button>`;
  }).join('');
}
function navClick(id){
  const m={dashboard:()=>staffSection('dashboard'),tables:()=>staffSection('tables'),order:()=>staffSection('order'),orders:()=>staffSection('orders'),menuview:()=>staffSection('menuview'),products:()=>staffSection('products'),users:()=>staffSection('users'),reports:()=>staffSection('reports'),local:()=>toggleLocal()};
  if(m[id])m[id]();
  // Close mobile sidebar after click
  if(window.innerWidth<=900)closeSidebarMobile();
}
function setActiveNav(id){
  document.querySelectorAll('.st-nav__item').forEach(el=>el.classList.toggle('active',el.id===`nav-${id}`));
}
function renderStaffProfile(){
  const p=$('st-profile');if(!p)return;
  const u=S.user;
  p.innerHTML=`<div class="sp-av">${u.name[0]}</div><div><div class="sp-name">${u.name}</div><div class="sp-role">${{boss:'Jefe / Admin',waiter:'Mesero',kitchen:'Cocina'}[u.role]||u.role}</div></div>`;
}
function updateStaffUser(){
  const el=$('st-user');if(!el||!S.user)return;
  el.innerHTML=`<div class="av">${S.user.name[0]}</div><span class="badge ${S.user.role==='boss'?'badge-acc':S.user.role==='kitchen'?'badge-green':'badge-blue'}">${{boss:'Jefe',waiter:'Mesero',kitchen:'Cocina'}[S.user.role]||S.user.role}</span>`;
}

/* Sidebar toggle */
let _sbCollapsed=false;
function toggleSidebar(){
  const sb=$('st-sidebar'),sc=$('st-content');
  if(window.innerWidth<=900){
    const isOpen=sb.classList.toggle('mobile-open');
    $('sb-overlay').classList.toggle('hidden',!isOpen);
  }else{
    _sbCollapsed=!_sbCollapsed;
    sb.classList.toggle('collapsed',_sbCollapsed);
    sc.classList.toggle('expanded',_sbCollapsed);
  }
}
function closeSidebarMobile(){
  $('st-sidebar')?.classList.remove('mobile-open');
  $('sb-overlay')?.classList.add('hidden');
}

/* ─────────────────────────────────────────────
   STAFF SEARCH
───────────────────────────────────────────── */
function staffSearch(q){
  const drop=$('ss-drop');if(!drop)return;
  if(!q||q.length<2){drop.classList.add('hidden');return;}
  const qL=q.toLowerCase();
  const prods=DB.getProducts().filter(p=>p.status==='active'&&(p.name.toLowerCase().includes(qL)||p.cat.toLowerCase().includes(qL))).slice(0,6);
  const tables=DB.getTables().filter(t=>String(t.num).includes(q)||`piso ${t.floor}`.includes(qL)).slice(0,5);
  let html='';
  if(prods.length){html+=`<div class="ss-group"><i class="fa-solid fa-burger"></i> Productos</div>`;html+=prods.map(p=>`<div class="ss-item" onmousedown="ssPickProd(${p.id})"><span class="ss-em">${p.image?`<img src="${p.image}" style="width:24px;height:24px;object-fit:cover;border-radius:4px">`:p.emoji}</span><div class="ss-txt"><div class="ss-name">${p.name}</div><div class="ss-sub">${p.cat}</div></div><span class="ss-val">${fmtCOP(p.price)}</span></div>`).join('');}
  if(tables.length){html+=`<div class="ss-group"><i class="fa-solid fa-table-cells"></i> Mesas</div>`;html+=tables.map(t=>{const o=DB.getActiveOrder(t.id);const ic={free:'🟢',occupied:'🔴',pending:'💛'}[t.status]||'⚪';return`<div class="ss-item" onmousedown="ssPickTable(${t.id})"><span class="ss-em">${ic}</span><div class="ss-txt"><div class="ss-name">Mesa ${t.num} · Piso ${t.floor}</div><div class="ss-sub">${{free:'Libre',occupied:'Ocupada',pending:'Pago pendiente'}[t.status]||t.status}${o?' · '+fmtCOP(orderTotal(o.id)):''}</div></div></div>`;}).join('');}
  if(!html)html=`<div class="ss-empty"><i class="fa-solid fa-magnifying-glass"></i> Sin resultados</div>`;
  drop.innerHTML=html;drop.classList.remove('hidden');
}
function openSSearch(){const v=$('st-search')?.value;if(v&&v.length>=2)staffSearch(v);}
function closeSSearch(){setTimeout(()=>$('ss-drop')?.classList.add('hidden'),200);}
function ssPickProd(pid){$('st-search').value='';$('ss-drop').classList.add('hidden');if(S.activeOrder)openAdd(pid);else toast('Selecciona una mesa para agregar productos','info');}
function ssPickTable(tid){$('st-search').value='';$('ss-drop').classList.add('hidden');S.floor=DB.getTables().find(t=>t.id===tid)?.floor||1;if(S.user.role==='boss'){staffSection('tables');setTimeout(()=>pickTable(tid),50);}else{staffSection('tables');setTimeout(()=>pickTable(tid),50);}}

/* ─────────────────────────────────────────────
   LOCAL STATUS
───────────────────────────────────────────── */
function updateLocalBadges(){
  const open=!!DB.getCurrentDay();
  const cls=open?'status-pill open':'status-pill closed';
  const html=open?`<span class="dot"></span><span>Abierto</span>`:`<span class="dot"></span><span>Cerrado</span>`;
  ['cn-status','st-status','kitch-status'].forEach(id=>{const el=$(id);if(el){el.className=cls;el.innerHTML=html;}});
  const stxt=$('st-status-txt');if(stxt)stxt.textContent=open?'Abierto':'Cerrado';
  const cb=$('closed-banner');if(cb)cb.classList.toggle('hidden',open);
  const lb=$('nav-local');if(lb){lb.className=`st-nav__item ${open?'local-open':''}`;lb.querySelector('span').textContent=open?'Cerrar Local':'Abrir Local';}
}
function toggleLocal(){if(DB.getCurrentDay())openCloseDayModal();else openOpenModal();}

/* ─────────────────────────────────────────────
   SECTIONS ROUTER
───────────────────────────────────────────── */
function staffSection(sec){
  setActiveNav(sec);
  const c=$('st-content');if(!c)return;
  // Clear selected table when navigating away from tables/order
  if(!['tables','order'].includes(sec)){S.selectedTable=null;S.activeOrder=null;}
  switch(sec){
    case 'dashboard':renderDashboard(c);break;
    case 'tables':   renderTables(c);break;
    case 'order':    renderOrderSection(c);break;
    case 'orders':   renderAllOrders(c);break;
    case 'menuview': renderMenuView(c);break;
    case 'products': renderProducts(c);break;
    case 'users':    renderUsers(c);break;
    case 'reports':  renderReports(c);break;
  }
}

/* ─────────────────────────────────────────────
   CLIENT
───────────────────────────────────────────── */
let _mFilter='all',_mSearch='';
function filterMenu(cat,btn,search){
  if(cat!==null)_mFilter=cat;
  if(search!==undefined)_mSearch=search;
  if(btn){document.querySelectorAll('.mf').forEach(b=>b.classList.remove('active'));btn.classList.add('active');}
  renderClientMenu();
}
function clientNav(page,btn){
  document.querySelectorAll('.c-page').forEach(p=>p.classList.remove('active'));
  const el=$(`cp-${page}`);if(el)el.classList.add('active');
  document.querySelectorAll('.cn__link').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
  if(page==='menu')renderClientMenu();
}
function toggleMob(){$('mob-menu')?.classList.toggle('hidden');}
function renderClientMenu(){
  const grid=$('menu-grid');if(!grid)return;
  const products=DB.getProducts().filter(p=>{
    if(p.status!=='active')return false;
    if(_mFilter!=='all'&&p.cat!==_mFilter)return false;
    if(_mSearch){const q=_mSearch.toLowerCase();if(!p.name.toLowerCase().includes(q)&&!p.cat.toLowerCase().includes(q))return false;}
    return true;
  });
  grid.innerHTML=products.map((p,i)=>`
    <div class="pc" style="animation-delay:${Math.min(i,8)*.05}s">
      <div class="pc__img">
        ${p.image?`<img src="${p.image}" alt="${p.name}" loading="lazy">`:`<div class="pc__img-emoji">${p.emoji}</div>`}
        <span class="pc__cat ${getCatClass(p.cat)}">${p.cat}</span>
      </div>
      <div class="pc__body">
        <div class="pc__name">${p.name}</div>
        <div class="pc__desc">${p.desc||''}</div>
        <div class="pc__footer">
          <span class="pc__price">${fmtCOP(p.price)}</span>
          <span class="pc__combo">Combo +$10.000</span>
        </div>
      </div>
    </div>`).join('');
}

/* ─────────────────────────────────────────────
   FLOOR TABS
───────────────────────────────────────────── */
function floorTabsHTML(ctx){
  const c1=DB.getTables().filter(t=>t.floor===1&&t.status!=='free').length;
  const c2=DB.getTables().filter(t=>t.floor===2&&t.status!=='free').length;
  return`<div class="floor-tabs">
    <button class="ft ${S.floor===1?'active':''}" onclick="switchFloor(1,'${ctx}')"><i class="fa-solid fa-1"></i>Piso 1 <span class="fc">${c1}/14</span></button>
    <button class="ft ${S.floor===2?'active':''}" onclick="switchFloor(2,'${ctx}')"><i class="fa-solid fa-2"></i>Piso 2 <span class="fc">${c2}/23</span></button>
  </div>`;
}
function switchFloor(f,ctx){S.floor=f;staffSection(ctx);}

/* ─────────────────────────────────────────────
   TABLES — unified layout for boss & waiter
   Two-column split: table grid LEFT, order panel RIGHT
───────────────────────────────────────────── */
function renderTables(c){
  const isBoss=S.user.role==='boss';
  const myOids=DB.getOrders().filter(o=>o.waiterId===S.user.id&&(o.status==='active'||o.status==='pending')).map(o=>o.tableId);
  const tables=DB.getTables().filter(t=>t.floor===S.floor);

  c.innerHTML=`
    <div class="ph-row">
      <div class="ph">
        <h2>${isBoss?'Todas las Mesas':'Mis Mesas'}</h2>
        <p>🟢 Libre · 🔴 Ocupada · 💛 Pago pendiente — Selecciona una mesa para ver o crear el pedido</p>
      </div>
    </div>

    <!-- Two-panel layout: tables left, order right -->
    <div class="tables-order-layout">

      <!-- LEFT: floor tabs + grid -->
      <div class="tables-panel">
        ${floorTabsHTML('tables')}
        <div class="floor-label"><h3><i class="fa-solid fa-building"></i> Piso ${S.floor}</h3></div>
        <div class="tables-grid" id="tables-grid">
          ${tables.map(t=>{
            const o=DB.getActiveOrder(t.id);
            const total=o?orderTotal(o.id):0;
            const mine=myOids.includes(t.id);
            const statusTxt=t.status==='pending'?'Cobro pend.':t.status==='occupied'?(mine&&!isBoss?'Mi pedido':'Ocupada'):'Libre';
            return`<div class="table-card ${t.status} ${S.selectedTable===t.id?'selected':''}" onclick="pickTable(${t.id})">
              <div class="tc-icon">${{free:'🟢',occupied:'🍽️',pending:'💛'}[t.status]||'⚪'}</div>
              <div class="tc-num">${t.num}</div>
              <div class="tc-status">${statusTxt}</div>
              ${o?`<div class="tc-total">${fmtCOP(total)}</div>`:''}
            </div>`;
          }).join('')}
        </div>
      </div>

      <!-- RIGHT: order panel (shown when a table is selected) -->
      <div class="order-side-panel" id="order-side-panel">
        ${S.selectedTable
          ? renderOrderPanelHTML(S.selectedTable,isBoss)
          : `<div class="order-side-empty"><i class="fa-solid fa-hand-pointer"></i><p>Selecciona una mesa<br>para ver su pedido</p></div>`}
      </div>

    </div>`;
}

/** Renders the HTML string for the order side panel */
function renderOrderPanelHTML(tableId,isBoss){
  const t=DB.getTables().find(x=>x.id===tableId);
  const o=DB.getActiveOrder(tableId);
  const isPending=o&&o.status==='pending';
  S.activeOrder=o||null;

  return`
    <div class="order-side-header">
      <div>
        <h3>Mesa ${t?.num||'?'} <span style="font-size:14px;color:var(--text-m)">Piso ${t?.floor||'?'}</span></h3>
        <p style="font-size:12px;color:var(--text-m);margin-top:2px">
          ${o?`Pedido #${o.id}`:' Sin pedido activo'}
          ${isPending?`<span class="badge badge-yellow" style="margin-left:6px"><i class="fa-solid fa-lock"></i> Cobro pendiente</span>`:''}
        </p>
      </div>
      <div style="display:flex;gap:6px;flex-wrap:wrap">
        ${!o?`<button class="pill-btn pill-btn--green pill-btn--sm" onclick="createOrder(${tableId})"><i class="fa-solid fa-plus"></i> Nuevo</button>`:''}
        ${isBoss&&o?`<button class="pill-btn pill-btn--sm" style="background:var(--blue);border-color:var(--blue);color:#fff" onclick="openMoveModal()"><i class="fa-solid fa-arrows-alt"></i></button>`:''}
        ${o&&!isPending?`<button class="pill-btn pill-btn--danger pill-btn--sm" onclick="requestPay(${o.id})"><i class="fa-solid fa-money-bill-wave"></i> Cobrar</button>`:''}
        ${isBoss&&isPending?`<button class="pill-btn pill-btn--green pill-btn--sm" onclick="openPayModal(${o.id})"><i class="fa-solid fa-circle-check"></i> Pagar</button>`:''}
      </div>
    </div>

    <!-- Product search -->
    ${o&&!isPending?`
    <div class="order-search-bar" style="padding:0 0 10px">
      <input class="field-c" id="op-search" placeholder="🔍 Buscar…" oninput="renderOrderProds()" style="flex:1">
      <select class="field-c" id="op-cat" style="max-width:130px" onchange="renderOrderProds()">
        <option value="">Todas</option><option>Hamburguesas</option><option>Especiales</option>
        <option>Hot Dog</option><option>Bebidas</option><option>Infantil</option><option>Entradas</option>
      </select>
    </div>
    <div class="order-prods-grid" id="op-grid" style="margin-bottom:12px;max-height:200px;overflow-y:auto"></div>`
    :isPending?`<div class="locked-state"><i class="fa-solid fa-lock"></i><h4>Bloqueado</h4><p>Esperando cobro por el Jefe</p></div>`:''}

    <!-- Cart -->
    <div class="cart-panel" style="flex:1;min-height:0">
      <div class="cart-head">
        <h3 style="font-size:16px"><i class="fa-solid fa-receipt"></i> Pedido</h3>
        ${o?`<span class="badge badge-acc">#${o.id}</span>`:`<span class="badge badge-green">Nuevo</span>`}
      </div>
      <div class="cart-items" id="cart-items">${renderCartItems(o?.id,isPending)}</div>
      <div class="cart-foot">${renderCartFoot(o?.id)}</div>
    </div>`;
}

/** pickTable — works for both boss and waiter */
function pickTable(tid){
  const isBoss=S.user.role==='boss';
  const o=DB.getActiveOrder(tid);
  if(!isBoss){
    if(o&&o.status==='pending'){toast('Mesa en espera de cobro · Solo el Jefe puede liberarla','error');return;}
    if(o&&o.waiterId!==S.user.id){toast('Esta mesa tiene un pedido de otro mesero','error');return;}
  }
  S.selectedTable=tid;
  S.activeOrder=o||null;
  // Update the table cards to highlight selected
  document.querySelectorAll('.table-card').forEach(el=>el.classList.remove('selected'));
  // Re-render only the order side panel (no full re-render)
  const osp=$('order-side-panel');
  if(osp){osp.innerHTML=renderOrderPanelHTML(tid,isBoss);if(!o||!o.status.includes('pending'))renderOrderProds();}
  // Also update table card selection visually
  const tGrid=$('tables-grid');
  if(tGrid){const cards=tGrid.querySelectorAll('.table-card');const tables=DB.getTables().filter(t=>t.floor===S.floor);tables.forEach((t,i)=>{if(cards[i])cards[i].classList.toggle('selected',t.id===tid);});}
}

/* ─────────────────────────────────────────────
   ORDER SECTION (dedicated page for waiter)
───────────────────────────────────────────── */
function renderOrderSection(c){
  if(!S.selectedTable){
    c.innerHTML=`<div class="ph"><h2>Pedido Activo</h2></div><div style="display:flex;align-items:center;justify-content:center;height:200px;color:var(--text-m);font-size:15px;gap:10px"><i class="fa-solid fa-table-cells"></i> Selecciona primero una mesa en la sección Mesas</div>`;
    return;
  }
  const isBoss=S.user.role==='boss';
  c.innerHTML=`
    <div class="ph-row">
      <div class="ph"><h2>Pedido Activo</h2></div>
      <button class="pill-btn pill-btn--sm" onclick="staffSection('tables')"><i class="fa-solid fa-arrow-left"></i> Volver a Mesas</button>
    </div>
    <div id="order-side-panel" style="display:flex;flex-direction:column;gap:12px">
      ${renderOrderPanelHTML(S.selectedTable,isBoss)}
    </div>`;
  const o=S.activeOrder;
  if(o&&o.status!=='pending')renderOrderProds();
}

/* ─────────────────────────────────────────────
   ORDER PRODUCTS & CART
───────────────────────────────────────────── */
function renderOrderProds(){
  const grid=$('op-grid');if(!grid)return;
  const q=($('op-search')?.value||'').toLowerCase();
  const cat=$('op-cat')?.value||'';
  const prods=DB.getProducts().filter(p=>p.status==='active'&&(!cat||p.cat===cat)&&(!q||p.name.toLowerCase().includes(q)||p.cat.toLowerCase().includes(q)));
  grid.innerHTML=prods.map(p=>p.image?
    `<div class="opc with-img" onclick="openAdd(${p.id})"><img src="${p.image}" alt="${p.name}" loading="lazy"><div class="oi"><div class="on">${p.name}</div><div class="oc">${p.cat}</div><div class="op">${fmtCOP(p.price)}</div></div></div>`
   :`<div class="opc" onclick="openAdd(${p.id})"><span class="oe">${p.emoji}</span><span class="on">${p.name}</span><span class="oc">${p.cat}</span><span class="op">${fmtCOP(p.price)}</span></div>`
  ).join('');
}
function renderCartItems(oid,locked){
  if(!oid)return`<div class="cart-empty"><i class="fa-solid fa-receipt"></i><p>Crea un pedido para empezar</p></div>`;
  const items=DB.orderItems(oid);
  if(!items.length)return`<div class="cart-empty"><i class="fa-solid fa-plus-circle"></i><p>Agrega productos del catálogo</p></div>`;
  return items.map(it=>{
    const p=DB.getProducts().find(x=>x.id===it.productId);
    const c=it.status==='cancelled';
    return`<div class="ci ${c?'cancelled':''}" id="ci-${it.id}">
      ${p?.image?`<img src="${p.image}" style="width:26px;height:26px;border-radius:5px;object-fit:cover;flex-shrink:0">`:`<span class="ci-em">${p?.emoji||'🍔'}</span>`}
      <div class="ci-info">
        <div class="ci-name">${p?.name||'Producto'} ${it.qty>1?`×${it.qty}`:''}</div>
        <div class="ci-price">${fmtCOP(it.price*it.qty)}</div>
        ${it.notes?`<div class="ci-note">${it.notes}</div>`:''}
        ${c?'<span class="ci-cbadge">Cancelado</span>':''}
      </div>
      ${!locked?(!c
        ?`<button class="ci-btn" onclick="cancelItem(${it.id})" title="Cancelar"><i class="fa-solid fa-xmark"></i></button>`
        :`<button class="ci-btn rev" onclick="reviveItem(${it.id})" title="Reactivar"><i class="fa-solid fa-rotate-left"></i></button>`)
      :''}
    </div>`;
  }).join('');
}
function renderCartFoot(oid){
  if(!oid)return`<div class="cr total"><span>TOTAL</span><span>${fmtCOP(0)}</span></div>`;
  const items=DB.orderItems(oid);
  const active=items.filter(i=>i.status==='active');
  const cancelled=items.filter(i=>i.status==='cancelled');
  const total=orderTotal(oid);
  return`
    <div class="cr"><span>Activos</span><span>${active.length}</span></div>
    ${cancelled.length?`<div class="cr"><span style="color:var(--red)">Cancelados</span><span style="color:var(--red)">${cancelled.length}</span></div>`:''}
    <div class="cr total"><span>TOTAL</span><span>${fmtCOP(total)}</span></div>`;
}
function refreshCart(oid){
  const o=DB.getOrders().find(x=>x.id===oid);
  const locked=o&&o.status==='pending';
  const ci=$('cart-items'),cf=document.querySelector('.cart-foot');
  if(ci)ci.innerHTML=renderCartItems(oid,locked);
  if(cf)cf.innerHTML=renderCartFoot(oid);
}

/* ─────────────────────────────────────────────
   ORDER MANAGEMENT
───────────────────────────────────────────── */
function createOrder(tableId){
  const day=DB.getCurrentDay();
  const oid=DB.createOrder({tableId,waiterId:S.user.id,createdAt:new Date().toISOString(),status:'active',dayId:day?.id||null});
  DB.updateTableStatus(tableId,'occupied');
  S.activeOrder=DB.getOrders().find(o=>o.id===oid);
  toast('Pedido creado ✅','success');
  // Refresh the side panel
  const isBoss=S.user.role==='boss';
  const osp=$('order-side-panel');
  if(osp){osp.innerHTML=renderOrderPanelHTML(tableId,isBoss);renderOrderProds();}
  // Update table card
  document.querySelectorAll('.table-card').forEach(el=>{const num=parseInt(el.querySelector('.tc-num')?.textContent);const t=DB.getTables().find(x=>x.num===num&&x.floor===S.floor);if(t&&t.id===tableId){el.classList.add('occupied');el.classList.remove('free');el.querySelector('.tc-status').textContent='Mi pedido';}});
}
function requestPay(oid){
  if(!confirm('¿Marcar como listo para cobrar?\nLa mesa quedará bloqueada hasta que el Jefe confirme el pago.'))return;
  DB.updateOrder(oid,{status:'pending'});
  const o=DB.getOrders().find(x=>x.id===oid);
  DB.updateTableStatus(o.tableId,'pending');
  S.selectedTable=null;S.activeOrder=null;
  toast('Pedido enviado a cobro 💛','info');
  staffSection('tables');
}

/* ─────────────────────────────────────────────
   ADD TO ORDER
───────────────────────────────────────────── */
function openAdd(pid){
  if(!S.activeOrder){toast('Primero crea un pedido','error');return;}
  const p=DB.getProducts().find(x=>x.id===pid);if(!p)return;
  S.addPid=pid;S.addQty=1;
  $('ma-title').textContent=p.name;
  $('ma-vis').innerHTML=p.image?`<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover">`:`<div class="ma-em">${p.emoji}</div>`;
  $('ma-desc').textContent=p.desc||'';
  $('ma-price').textContent=fmtCOP(p.price);
  $('ma-qty').textContent='1';
  $('ma-notes').value='';
  $('ma-pid').value=pid;
  openModal('modal-add');
}
function changeQty(d){S.addQty=Math.max(1,(S.addQty||1)+d);$('ma-qty').textContent=S.addQty;}
function confirmAdd(){
  const pid=parseInt($('ma-pid').value);
  const p=DB.getProducts().find(x=>x.id===pid);if(!p)return;
  DB.addItem({orderId:S.activeOrder.id,productId:pid,qty:S.addQty,price:p.price,cost:p.cost||0,notes:$('ma-notes').value.trim(),status:'active'});
  closeModal('modal-add');
  toast(`${p.emoji} ${p.name} agregado`,'success');
  refreshCart(S.activeOrder.id);
}
function cancelItem(iid){DB.updateItem(iid,{status:'cancelled'});const it=DB.getItems().find(x=>x.id===iid);toast('Ítem cancelado','error');refreshCart(it.orderId);}
function reviveItem(iid){DB.updateItem(iid,{status:'active'});const it=DB.getItems().find(x=>x.id===iid);toast('Ítem reactivado','success');refreshCart(it.orderId);}

/* ─────────────────────────────────────────────
   PAY MODAL
───────────────────────────────────────────── */
function openPayModal(oid){
  if(S.user.role!=='boss'){toast('Solo el Jefe puede confirmar cobros','error');return;}
  S.payOid=oid;
  const o=DB.getOrders().find(x=>x.id===oid);
  const t=DB.getTables().find(x=>x.id===o.tableId);
  const items=DB.orderItems(oid);
  const total=orderTotal(oid);
  $('pay-sum').innerHTML=`<div class="pt-title">Mesa ${t?.num} · Piso ${t?.floor} · Pedido #${oid}</div>
    ${items.map(i=>{const p=DB.getProducts().find(x=>x.id===i.productId);return`<div class="pi ${i.status==='cancelled'?'cancelled':''}"><span>${p?.emoji||''} ${p?.name||'?'} ×${i.qty}</span><span>${fmtCOP(i.price*i.qty)}</span></div>`;}).join('')}
    <div class="ptotal"><span>TOTAL A COBRAR</span><span>${fmtCOP(total)}</span></div>`;
  $('pay-recv').value='';$('pay-change').classList.add('hidden');
  $('pay-meth').value='efectivo';$('pay-oid').value=oid;
  openModal('modal-pay');
}
function calcChange(){
  const total=orderTotal(S.payOid||0);
  const recv=parseFloat($('pay-recv').value)||0;
  const el=$('pay-change');
  if(recv>=total){el.textContent=`💵 Cambio: ${fmtCOP(recv-total)}`;el.classList.remove('hidden');}
  else el.classList.add('hidden');
}
function confirmPay(){
  const oid=parseInt($('pay-oid').value);
  const method=$('pay-meth').value;
  const o=DB.getOrders().find(x=>x.id===oid);
  const t=DB.getTables().find(x=>x.id===o.tableId);
  const total=orderTotal(oid);
  const cost=orderCost(oid);
  DB.updateOrder(oid,{status:'paid',paidAt:new Date().toISOString(),payMethod:method,totalPaid:total});
  DB.updateTableStatus(o.tableId,'free');
  const day=DB.getCurrentDay();
  if(day)DB.addTransaction({type:'income',dayId:day.id,orderId:oid,amount:total,cost,profit:total-cost,method,description:`Pedido #${oid} Mesa ${t?.num} P${t?.floor}`,createdAt:new Date().toISOString()});
  S.selectedTable=null;S.activeOrder=null;S.payOid=null;
  closeModal('modal-pay');
  toast(`✅ Cobro confirmado · Mesa ${t?.num} Piso ${t?.floor} liberada`,'success');
  staffSection('tables');
}

/* ─────────────────────────────────────────────
   MOVE TABLE MODAL
───────────────────────────────────────────── */
function openMoveModal(){
  S.moveTarget=null;
  const renderSm=fl=>`<div class="move-floor"><i class="fa-solid fa-${fl}"></i> Piso ${fl}</div>
    <div class="move-grid-inner">${DB.getTables().filter(t=>t.floor===fl&&t.id!==S.selectedTable).map(t=>{const has=!!DB.getActiveOrder(t.id);return`<div class="mt-sm ${has?'occupied':''}" onclick="pickMoveTarget(${t.id},this)"><div class="mts-n">${t.num}</div><div class="mts-s">${has?'Ocup.':'Libre'}</div></div>`;}).join('')}</div>`;
  $('move-grid').innerHTML=renderSm(1)+renderSm(2);
  openModal('modal-move');
}
function pickMoveTarget(tid,el){document.querySelectorAll('.mt-sm').forEach(x=>x.classList.remove('selected'));el.classList.add('selected');S.moveTarget=tid;}
function confirmMove(){
  if(!S.moveTarget){toast('Selecciona una mesa destino','error');return;}
  if(DB.getActiveOrder(S.moveTarget)){toast('La mesa destino ya tiene un pedido','error');return;}
  const o=DB.getActiveOrder(S.selectedTable);if(!o)return;
  const newT=DB.getTables().find(t=>t.id===S.moveTarget);
  DB.updateTableStatus(S.selectedTable,'free');
  DB.updateTableStatus(S.moveTarget,o.status==='pending'?'pending':'occupied');
  DB.updateOrder(o.id,{tableId:S.moveTarget});
  S.selectedTable=S.moveTarget;S.floor=newT.floor;
  closeModal('modal-move');
  toast(`Pedido movido a Mesa ${newT.num} Piso ${newT.floor} ✅`,'success');
  staffSection('tables');
}

/* ─────────────────────────────────────────────
   OPEN / CLOSE LOCAL
───────────────────────────────────────────── */
S.tempInv=[{desc:'',amount:''}];
function openOpenModal(){S.tempInv=[{desc:'',amount:''}];renderInvRows();$('open-notes').value='';recalcInv();openModal('modal-open');}
function renderInvRows(){$('inv-rows').innerHTML=S.tempInv.map((inv,i)=>`<div class="inv-row"><input class="field-c" placeholder="Descripción" value="${inv.desc}" oninput="S.tempInv[${i}].desc=this.value"><input class="field-c inv-amt" type="number" placeholder="$ Monto" value="${inv.amount}" oninput="S.tempInv[${i}].amount=this.value;recalcInv()"><button class="inv-del" onclick="removeInv(${i})"><i class="fa-solid fa-trash"></i></button></div>`).join('');}
function addInvRow(){S.tempInv.push({desc:'',amount:''});renderInvRows();}
function removeInv(i){S.tempInv.splice(i,1);if(!S.tempInv.length)S.tempInv=[{desc:'',amount:''}];renderInvRows();recalcInv();}
function recalcInv(){const t=S.tempInv.reduce((s,x)=>s+(parseFloat(x.amount)||0),0);$('inv-total').textContent=fmtCOP(t);}
function confirmOpen(){
  const investments=S.tempInv.filter(x=>x.desc||parseFloat(x.amount)).map(x=>({desc:x.desc||'Sin descripción',amount:parseFloat(x.amount)||0}));
  const notes=$('open-notes').value.trim();
  const did=DB.createDay({date:new Date().toLocaleDateString('es-CO'),openedAt:new Date().toISOString(),closedAt:null,openNotes:notes,closeNotes:'',investments,status:'open'});
  investments.forEach(inv=>DB.addTransaction({type:'expense',dayId:did,amount:inv.amount,cost:0,profit:0,method:'efectivo',description:inv.desc,createdAt:new Date().toISOString()}));
  closeModal('modal-open');toast('¡Local abierto! 🏪 Buena jornada','success');updateLocalBadges();staffSection('dashboard');
}

function openCloseDayModal(){
  const day=DB.getCurrentDay();if(!day)return;
  const active=DB.getOrders().filter(o=>o.dayId===day.id&&(o.status==='active'||o.status==='pending'));
  if(active.length){toast(`${active.length} pedido(s) sin cobrar. Ciérralos antes.`,'error');return;}
  const {sales,cost,profit,paid}=dayStats(day.id);
  const totalInv=day.investments.reduce((s,i)=>s+(i.amount||0),0);
  const net=profit-totalInv;
  $('close-sum').innerHTML=`<div class="cds-grid">
    <div class="cds-box yellow"><div class="cds-l">Inversión</div><div class="cds-v">${fmtCOP(totalInv)}</div></div>
    <div class="cds-box acc"><div class="cds-l">Ventas</div><div class="cds-v">${fmtCOP(sales)}</div></div>
    <div class="cds-box"><div class="cds-l" style="color:var(--text-m)">Costo prod.</div><div class="cds-v" style="color:var(--text-m)">${fmtCOP(cost)}</div></div>
    <div class="cds-box ${net>=0?'green':'red'}"><div class="cds-l">Ganancia neta</div><div class="cds-v">${fmtCOP(net)}</div></div>
  </div>
  <div style="background:var(--bg);border-radius:8px;padding:10px 13px;font-size:12px;color:var(--text-m)">${paid} pedido(s) cobrado(s) · Apertura: ${fmtTime(day.openedAt)}</div>`;
  $('close-notes').value='';openModal('modal-close-day');
}
function confirmClose(){
  const day=DB.getCurrentDay();if(!day)return;
  DB.updateDay(day.id,{closedAt:new Date().toISOString(),closeNotes:$('close-notes').value.trim(),status:'closed'});
  closeModal('modal-close-day');toast('Jornada cerrada 🔒','info');updateLocalBadges();staffSection('reports');
}
function dayStats(dayId){
  const orders=DB.getOrders().filter(o=>o.dayId===dayId&&o.status==='paid');
  const sales=orders.reduce((s,o)=>s+orderTotal(o.id),0);
  const cost=orders.reduce((s,o)=>s+orderCost(o.id),0);
  return{sales,cost,profit:sales-cost,paid:orders.length};
}

/* ─────────────────────────────────────────────
   DASHBOARD
───────────────────────────────────────────── */
function renderDashboard(c){
  const day=DB.getCurrentDay();
  const ds=day?dayStats(day.id):{sales:0,cost:0,profit:0,paid:0};
  const totalInv=day?(day.investments.reduce((s,i)=>s+(i.amount||0),0)):0;
  const net=ds.profit-totalInv;
  const occ=DB.getTables().filter(t=>t.status!=='free').length;
  const pend=DB.getOrders().filter(o=>o.status==='pending');
  const active=DB.getOrders().filter(o=>o.status==='active').length;
  c.innerHTML=`
    <div class="ph"><h2>Dashboard</h2><p>${day?`Jornada abierta · ${fmtTime(day.openedAt)}`:'Sin jornada activa'}</p></div>
    ${!day?`<div class="warn-bar"><p><strong>El local está cerrado.</strong> Abre la jornada para comenzar a operar.</p><button class="pill-btn pill-btn--green" onclick="openOpenModal()"><i class="fa-solid fa-store"></i> Abrir Local</button></div>`:''}
    <div class="stats-row">
      <div class="stat-card"><div class="sc-label">Productos</div><div class="sc-val">${DB.getProducts().filter(p=>p.status==='active').length}</div></div>
      <div class="stat-card"><div class="sc-label">Mesas Ocupadas</div><div class="sc-val">${occ}</div><div class="sc-sub">de 37</div></div>
      <div class="stat-card"><div class="sc-label">Pedidos Activos</div><div class="sc-val">${active}</div></div>
      <div class="stat-card" style="border-color:rgba(240,192,64,.3)"><div class="sc-label" style="color:var(--yellow)">Cobro Pendiente</div><div class="sc-val" style="color:var(--yellow)">${pend.length}</div></div>
      ${day?`<div class="stat-card"><div class="sc-label">Ventas Hoy</div><div class="sc-val" style="font-size:24px">${fmtCOP(ds.sales)}</div></div>
      <div class="stat-card"><div class="sc-label">Ganancia Neta</div><div class="sc-val" style="font-size:24px;color:${net>=0?'var(--green)':'var(--red)'}">${fmtCOP(net)}</div></div>`:''}
    </div>
    ${pend.length?`<div class="pend-box"><h4><i class="fa-solid fa-triangle-exclamation"></i> Mesas esperando cobro</h4><div class="pend-btns">${pend.map(o=>{const t=DB.getTables().find(x=>x.id===o.tableId);return`<button class="pend-btn" onclick="openPayModal(${o.id})"><i class="fa-solid fa-money-bill-wave"></i> Mesa ${t?.num} P${t?.floor} · ${fmtCOP(orderTotal(o.id))}</button>`;}).join('')}</div></div>`:''}
    <div class="ph-row" style="margin-top:6px"><h2 style="font-size:26px">Mesas en vivo</h2></div>
    ${floorTabsHTML('dashboard')}
    <div class="floor-label"><h3><i class="fa-solid fa-building"></i> Piso ${S.floor}</h3></div>
    <div class="tables-grid">${DB.getTables().filter(t=>t.floor===S.floor).map(t=>{const o=DB.getActiveOrder(t.id);const total=o?orderTotal(o.id):0;return`<div class="table-card ${t.status}" onclick="staffSection('tables');setTimeout(()=>pickTable(${t.id}),80)"><div class="tc-icon">${{free:'🟢',occupied:'🍽️',pending:'💛'}[t.status]||'⚪'}</div><div class="tc-num">${t.num}</div><div class="tc-status">${{free:'Libre',occupied:'Ocupada',pending:'Cobro pend.'}[t.status]}</div>${o?`<div class="tc-total">${fmtCOP(total)}</div>`:''}</div>`;}).join('')}</div>`;
}

/* ─────────────────────────────────────────────
   ALL ORDERS
───────────────────────────────────────────── */
function renderAllOrders(c){
  const pend=DB.getOrders().filter(o=>o.status==='pending');
  const active=DB.getOrders().filter(o=>o.status==='active');
  const paid=DB.getOrders().filter(o=>o.status==='paid').slice(-20).reverse();
  const card=o=>{
    const t=DB.getTables().find(x=>x.id===o.tableId);const u=DB.getUsers().find(x=>x.id===o.waiterId);const items=DB.orderItems(o.id);const total=orderTotal(o.id);
    const bmap={active:'badge-green',pending:'badge-yellow',paid:'badge-acc'};const lmap={active:'Activo',pending:'Cobro Pend.',paid:'Cobrado'};
    return`<div class="oc"><div class="oc-head"><h4>Pedido #${o.id} · Mesa ${t?.num||'?'} P${t?.floor||'?'}</h4><div style="display:flex;gap:7px;align-items:center"><span class="badge ${bmap[o.status]||'badge-acc'}">${lmap[o.status]||o.status}</span><span style="font-family:'Bebas Neue',sans-serif;font-size:16px;color:var(--acc)">${fmtCOP(total)}</span>${o.status==='pending'?`<button class="pill-btn pill-btn--green pill-btn--sm" onclick="openPayModal(${o.id})"><i class="fa-solid fa-money-bill-wave"></i> Cobrar</button>`:''}</div></div><div class="oc-meta">${u?.name||'?'} · ${fmtTime(o.createdAt)}${o.payMethod?' · '+o.payMethod:''}</div><div class="oc-items">${items.map(i=>{const p=DB.getProducts().find(x=>x.id===i.productId);return`<span class="oi-chip ${i.status==='cancelled'?'cancelled':''}">${p?.emoji||''} ${p?.name||'?'} ×${i.qty}</span>`;}).join('')}</div></div>`;
  };
  c.innerHTML=`<div class="ph"><h2>Todos los Pedidos</h2></div>
    <h3 style="font-size:20px;color:var(--yellow);margin-bottom:8px"><i class="fa-solid fa-clock"></i> Cobro Pendiente (${pend.length})</h3>${pend.length?pend.map(card).join(''):'<p style="color:var(--text-m);font-size:13px;margin-bottom:16px">Ninguno</p>'}
    <h3 style="font-size:20px;color:var(--acc);margin:16px 0 8px"><i class="fa-solid fa-fire"></i> Activos (${active.length})</h3>${active.length?active.map(card).join(''):'<p style="color:var(--text-m);font-size:13px;margin-bottom:16px">Ninguno</p>'}
    <h3 style="font-size:20px;color:var(--green);margin:16px 0 8px"><i class="fa-solid fa-circle-check"></i> Cobrados</h3>${paid.length?paid.map(card).join(''):'<p style="color:var(--text-m);font-size:13px">Ninguno aún</p>'}`;
}

/* ─────────────────────────────────────────────
   MENU VIEW (staff)
───────────────────────────────────────────── */
function renderMenuView(c){
  c.innerHTML=`<div class="ph"><h2>Menú Completo</h2></div><div class="menu-grid" id="sv-grid"></div>`;
  $('sv-grid').innerHTML=DB.getProducts().filter(p=>p.status==='active').map(p=>`<div class="pc"><div class="pc__img">${p.image?`<img src="${p.image}" alt="${p.name}" loading="lazy">`:`<div class="pc__img-emoji">${p.emoji}</div>`}<span class="pc__cat ${getCatClass(p.cat)}">${p.cat}</span></div><div class="pc__body"><div class="pc__name">${p.name}</div><div class="pc__desc">${p.desc||''}</div><div class="pc__footer"><span class="pc__price">${fmtCOP(p.price)}</span></div></div></div>`).join('');
}

/* ─────────────────────────────────────────────
   PRODUCTS ADMIN
───────────────────────────────────────────── */
function renderProducts(c){
  c.innerHTML=`<div class="ph-row"><div class="ph"><h2>Productos</h2></div><button class="pill-btn pill-btn--accent" onclick="openProdModal()"><i class="fa-solid fa-plus"></i> Nuevo</button></div>
    <div class="admin-tbar"><input class="field-c" id="pt-search" style="max-width:220px" placeholder="Buscar…" oninput="renderProdTable()"><select class="field-c" id="pt-cat" style="max-width:155px" onchange="renderProdTable()"><option value="">Todas</option><option>Hamburguesas</option><option>Especiales</option><option>Hot Dog</option><option>Bebidas</option><option>Infantil</option><option>Entradas</option></select></div>
    <div style="overflow-x:auto"><table class="pt"><thead><tr><th></th><th>Nombre</th><th>Cat.</th><th>Costo</th><th>Precio</th><th>Margen</th><th>Estado</th><th>Acciones</th></tr></thead><tbody id="pt-body"></tbody></table></div>`;
  renderProdTable();
}
function renderProdTable(){
  const body=$('pt-body');if(!body)return;
  const q=($('pt-search')?.value||'').toLowerCase();const cat=$('pt-cat')?.value||'';
  body.innerHTML=DB.getProducts().filter(p=>(!cat||p.cat===cat)&&(!q||p.name.toLowerCase().includes(q))).map(p=>{
    const mg=p.price>0?Math.round(((p.price-(p.cost||0))/p.price)*100):0;
    return`<tr><td>${p.image?`<div class="pt-thumb"><img src="${p.image}" alt="${p.name}"></div>`:`<div class="pt-thumb">${p.emoji}</div>`}</td><td><strong>${p.name}</strong><br><span style="font-size:11px;color:var(--text-m)">${(p.desc||'').substring(0,45)}…</span></td><td><span class="badge ${getCatClass(p.cat)}">${p.cat}</span></td><td style="font-family:'DM Mono',monospace;font-size:12px;color:var(--yellow)">${fmtCOP(p.cost||0)}</td><td style="font-family:'Bebas Neue',sans-serif;font-size:17px;color:var(--acc)">${fmtCOP(p.price)}</td><td><span class="badge ${mg>=40?'badge-green':mg>=20?'badge-acc':'badge-red'}">${mg}%</span></td><td><span class="badge ${p.status==='active'?'badge-green':'badge-red'}">${p.status==='active'?'Activo':'Inactivo'}</span></td><td><div style="display:flex;gap:5px"><button class="pill-btn pill-btn--sm" onclick="openProdModal(${p.id})"><i class="fa-solid fa-pen"></i></button><button class="pill-btn pill-btn--sm ${p.status==='active'?'pill-btn--danger':''}" onclick="toggleProdStatus(${p.id})"><i class="fa-solid ${p.status==='active'?'fa-eye-slash':'fa-eye'}"></i></button><button class="pill-btn pill-btn--sm pill-btn--danger" onclick="deleteProd(${p.id})"><i class="fa-solid fa-trash"></i></button></div></td></tr>`;
  }).join('');
}
function openProdModal(id){
  $('mp-id').value=id||'';$('mp-title').textContent=id?'Editar Producto':'Nuevo Producto';
  if(id){const p=DB.getProducts().find(x=>x.id===id);if(!p)return;$('mp-name').value=p.name;$('mp-desc').value=p.desc||'';$('mp-emoji').value=p.emoji;$('mp-cat').value=p.cat;$('mp-price').value=p.price;$('mp-cost').value=p.cost||0;$('mp-status').value=p.status;$('mp-img').value=p.image||'';setProdImgPrev(p.image,p.emoji);}
  else{['mp-name','mp-desc','mp-emoji','mp-price','mp-cost'].forEach(k=>$(k).value='');$('mp-cat').value='Hamburguesas';$('mp-status').value='active';$('mp-img').value='';setProdImgPrev(null,'🍔');}
  openModal('modal-product');
}
function saveProduct(){
  const name=$('mp-name').value.trim(),price=parseFloat($('mp-price').value),cost=parseFloat($('mp-cost').value)||0;
  if(!name||!price){toast('Nombre y precio obligatorios','error');return;}
  const data={name,desc:$('mp-desc').value.trim(),emoji:$('mp-emoji').value.trim()||CAT_EMOJI[$('mp-cat').value]||'🍔',cat:$('mp-cat').value,price,cost,status:$('mp-status').value,image:$('mp-img').value||null};
  const eid=$('mp-id').value;
  if(eid){DB.upsertProduct({id:parseInt(eid),...data});toast(`${name} actualizado ✅`,'success');}
  else{DB.upsertProduct(data);toast(`${name} creado ✅`,'success');}
  closeModal('modal-product');renderProdTable();
}
function toggleProdStatus(id){const p=DB.getProducts().find(x=>x.id===id);if(!p)return;DB.upsertProduct({...p,status:p.status==='active'?'inactive':'active'});toast(`${p.name} ${p.status==='active'?'desactivado':'activado'}`,p.status==='active'?'info':'success');renderProdTable();}
function deleteProd(id){if(!confirm('¿Eliminar este producto?'))return;DB.deleteProduct(id);toast('Producto eliminado','error');renderProdTable();}
function setProdImgPrev(img,emoji){const prev=$('img-prev'),up=$('img-up');if(img){prev.innerHTML=`<img src="${img}" alt="prev">`;up.classList.add('has-img');}else{prev.innerHTML=`<span style="font-size:44px">${emoji||'🍔'}</span>`;up.classList.remove('has-img');}}
function loadImg(input){
  const file=input.files[0];if(!file)return;
  if(file.size>2*1024*1024){toast('La imagen no debe superar 2 MB','error');input.value='';return;}
  const reader=new FileReader();
  reader.onload=e=>{const img=new Image();img.onload=()=>{const max=800;let w=img.width,h=img.height;if(w>max||h>max){if(w>h){h=Math.round(h*max/w);w=max;}else{w=Math.round(w*max/h);h=max;}}const cv=document.createElement('canvas');cv.width=w;cv.height=h;cv.getContext('2d').drawImage(img,0,0,w,h);const b64=cv.toDataURL('image/jpeg',.82);$('mp-img').value=b64;setProdImgPrev(b64,'🍔');toast('Imagen cargada ✅','success');};img.src=e.target.result;};
  reader.readAsDataURL(file);input.value='';
}
function clearImg(){$('mp-img').value='';setProdImgPrev(null,$('mp-emoji').value||'🍔');toast('Imagen eliminada','info');}

/* ─────────────────────────────────────────────
   USERS ADMIN
───────────────────────────────────────────── */
function renderUsers(c){
  c.innerHTML=`<div class="ph-row"><div class="ph"><h2>Usuarios</h2><p>Credenciales de acceso al sistema</p></div><button class="pill-btn pill-btn--accent" onclick="promptNewUser()"><i class="fa-solid fa-plus"></i> Nuevo</button></div>
    <div style="overflow-x:auto"><table class="pt"><thead><tr><th>Usuario</th><th>Nombre</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>
      ${DB.getUsers().map(u=>`<tr><td><span style="font-family:'DM Mono',monospace;font-size:12px;color:var(--acc)">${u.username}</span></td><td><strong>${u.name}</strong></td><td><span class="badge ${u.role==='boss'?'badge-acc':u.role==='kitchen'?'badge-green':'badge-blue'}">${{boss:'Jefe',waiter:'Mesero',kitchen:'Cocina'}[u.role]||u.role}</span></td><td><span class="badge ${u.active?'badge-green':'badge-red'}">${u.active?'Activo':'Inactivo'}</span></td><td><div style="display:flex;gap:6px"><button class="pill-btn pill-btn--sm" onclick="editUserPass(${u.id})"><i class="fa-solid fa-key"></i> Contraseña</button>${u.id!==S.user.id?`<button class="pill-btn pill-btn--sm ${u.active?'pill-btn--danger':''}" onclick="toggleUser(${u.id})">${u.active?'Desactivar':'Activar'}</button>`:''}</div></td></tr>`).join('')}
    </tbody></table></div>`;
}
function editUserPass(uid){const np=prompt('Nueva contraseña:');if(!np)return;const a=DB.getUsers();const i=a.findIndex(x=>x.id===uid);if(i<0)return;a[i].password=np;DB.saveUsers(a);toast('Contraseña actualizada ✅','success');renderUsers($('st-content'));}
function toggleUser(uid){const a=DB.getUsers();const i=a.findIndex(x=>x.id===uid);if(i<0)return;a[i].active=!a[i].active;DB.saveUsers(a);toast(`Usuario ${a[i].active?'activado':'desactivado'}`,a[i].active?'success':'info');renderUsers($('st-content'));}
function promptNewUser(){
  const name=prompt('Nombre:');if(!name)return;
  const username=prompt('Nombre de acceso (sin espacios):');if(!username)return;
  const password=prompt('Contraseña:');if(!password)return;
  const roleOpt=prompt('Rol (1=Mesero, 2=Jefe, 3=Cocina):');
  const roleMap={'1':'waiter','2':'boss','3':'kitchen'};
  const role=roleMap[roleOpt]||'waiter';
  const a=DB.getUsers();const id=DB.seq('user');
  a.push({id,username,password,role,name,active:true,createdAt:new Date().toISOString()});
  DB.saveUsers(a);toast(`Usuario ${name} creado ✅`,'success');renderUsers($('st-content'));
}

/* ─────────────────────────────────────────────
   REPORTS
───────────────────────────────────────────── */
function renderReports(c){
  const days=[...DB.getDays()].reverse();
  const card=day=>{
    const {sales,cost,profit,paid}=dayStats(day.id);
    const totalInv=day.investments.reduce((s,i)=>s+(i.amount||0),0);const net=profit-totalInv;
    const orders=DB.getOrders().filter(o=>o.dayId===day.id&&o.status==='paid');const isOpen=day.status==='open';
    return`<div class="rcard">
      <div class="rcard-head"><div><h4>${fmtDate(day.openedAt)}</h4><span style="font-size:11px;color:var(--text-m)">Apertura: ${fmtTime(day.openedAt)}${day.closedAt?` · Cierre: ${fmtTime(day.closedAt)}`:''}</span></div>
        <div style="display:flex;gap:7px;align-items:center;flex-wrap:wrap"><span class="badge ${isOpen?'badge-green':'badge-acc'}">${isOpen?'🟢 Abierta':'🔒 Cerrada'}</span>${isOpen?`<button class="pill-btn pill-btn--sm pill-btn--danger" onclick="openCloseDayModal()"><i class="fa-solid fa-lock"></i> Cerrar</button>`:''}</div>
      </div>
      <div class="rcard-metrics">
        <div class="rm"><div class="rm-l">Inversión</div><div class="rm-v" style="color:var(--yellow)">${fmtCOP(totalInv)}</div></div>
        <div class="rm"><div class="rm-l">Ventas</div><div class="rm-v" style="color:var(--acc)">${fmtCOP(sales)}</div></div>
        <div class="rm"><div class="rm-l">Costo prod.</div><div class="rm-v" style="color:var(--text-m)">${fmtCOP(cost)}</div></div>
        <div class="rm"><div class="rm-l">Gan. bruta</div><div class="rm-v" style="color:${profit>=0?'var(--green)':'var(--red)'}">${fmtCOP(profit)}</div></div>
        <div class="rm"><div class="rm-l">Gan. neta</div><div class="rm-v" style="color:${net>=0?'var(--green)':'var(--red)'}; font-size:24px">${fmtCOP(net)}</div></div>
        <div class="rm"><div class="rm-l">Pedidos</div><div class="rm-v">${paid}</div></div>
      </div>
      ${day.investments.length?`<div class="rcard-inv"><h5><i class="fa-solid fa-boxes-stacking"></i> Inversiones</h5>${day.investments.map(inv=>`<div class="ri"><span>${inv.desc}</span><span style="color:var(--yellow);font-family:'DM Mono',monospace">${fmtCOP(inv.amount)}</span></div>`).join('')}</div>`:''}
      ${orders.length?`<div class="rcard-orders"><h5><i class="fa-solid fa-list-check"></i> Pedidos cobrados (${orders.length})</h5><div class="ro-chips">${orders.map(o=>{const t=DB.getTables().find(x=>x.id===o.tableId);return`<span class="ro-chip">Mesa ${t?.num||'?'} P${t?.floor||'?'} · ${fmtCOP(orderTotal(o.id))} · ${o.payMethod||'?'}</span>`;}).join('')}</div></div>`:''}
      ${day.openNotes||day.closeNotes?`<div style="padding:9px 18px;border-top:1px solid var(--border);font-size:12px;color:var(--text-m)">${day.openNotes?`📝 Apertura: ${day.openNotes}<br>`:''}${day.closeNotes?`📝 Cierre: ${day.closeNotes}`:''}</div>`:''}
    </div>`;
  };
  c.innerHTML=`<div class="ph-row"><div class="ph"><h2>Reporte Diario</h2><p>Historial de jornadas · Inversión, ventas y ganancias</p></div>${!DB.getCurrentDay()?`<button class="pill-btn pill-btn--green" onclick="openOpenModal()"><i class="fa-solid fa-store"></i> Nueva Jornada</button>`:''}</div>
    ${days.length?`<div class="report-list">${days.map(card).join('')}</div>`:`<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:260px;gap:12px;color:var(--text-m)"><i class="fa-solid fa-chart-line" style="font-size:44px;color:var(--text-dim)"></i><p style="font-size:14px;font-weight:600">No hay jornadas registradas aún</p><button class="pill-btn pill-btn--green" onclick="openOpenModal()"><i class="fa-solid fa-store"></i> Abrir Primera Jornada</button></div>`}`;
}

/* ═══════════════════════════════════════════════
   COCINA APP
   - Solo muestra pedidos activos (status = 'active' | 'pending')
   - Filtra por Comida vs Bebidas
   - Timer desde la creación del pedido
   - Auto-refresh cada 15 segundos
   - Alerta sonora opcional cuando llega un pedido nuevo
═══════════════════════════════════════════════ */
function bootKitchen(){
  showApp('kitchen');
  updateLocalBadges();
  S.knownOrders=DB.getOrders().filter(o=>o.status==='active'||o.status==='pending').map(o=>o.id);
  renderKitchen();
  // Auto-refresh every 12 seconds
  if(S.kitchTimer)clearInterval(S.kitchTimer);
  S.kitchTimer=setInterval(()=>{
    // Check for new orders
    const current=DB.getOrders().filter(o=>o.status==='active'||o.status==='pending').map(o=>o.id);
    const newOnes=current.filter(id=>!S.knownOrders.includes(id));
    if(newOnes.length){
      if(S.kitchSound)playKitchBeep();
      toast(`¡${newOnes.length} pedido(s) nuevo(s)!`,'warning');
    }
    S.knownOrders=current;
    renderKitchen();
  },12000);
}

function kitchTab(tab,btn){
  S.kitchTab=tab;
  document.querySelectorAll('.kitch-tab').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
  renderKitchen();
}

function renderKitchen(){
  const orders=DB.getOrders().filter(o=>o.status==='active'||o.status==='pending').sort((a,b)=>new Date(a.createdAt)-new Date(b.createdAt));
  // Separate food vs drinks
  const isBev=cat=>DRINK_CATS.includes(cat);
  // Build order cards filtered by tab
  const visibleOrders=orders.filter(o=>{
    const items=DB.orderItems(o.id).filter(i=>i.status==='active');
    if(S.kitchTab==='food')return items.some(i=>{const p=DB.getProducts().find(x=>x.id===i.productId);return p&&!isBev(p.cat);});
    else return items.some(i=>{const p=DB.getProducts().find(x=>x.id===i.productId);return p&&isBev(p.cat);});
  });
  // Update counters
  const foodCount=orders.filter(o=>{const items=DB.orderItems(o.id).filter(i=>i.status==='active');return items.some(i=>{const p=DB.getProducts().find(x=>x.id===i.productId);return p&&!isBev(p.cat);});}).length;
  const drinkCount=orders.filter(o=>{const items=DB.orderItems(o.id).filter(i=>i.status==='active');return items.some(i=>{const p=DB.getProducts().find(x=>x.id===i.productId);return p&&isBev(p.cat);});}).length;
  const kc1=$('kc-food');if(kc1)kc1.textContent=foodCount;
  const kc2=$('kc-drinks');if(kc2)kc2.textContent=drinkCount;
  const container=$('kitch-content');if(!container)return;
  if(!visibleOrders.length){
    container.innerHTML=`<div class="kitch-empty"><i class="fa-solid fa-check-circle"></i><h3>Sin pedidos</h3><p>${S.kitchTab==='food'?'No hay platos pendientes':'No hay bebidas pendientes'}</p></div>`;
    return;
  }
  container.innerHTML=`<div class="kitch-grid">${visibleOrders.map(o=>{
    const t=DB.getTables().find(x=>x.id===o.tableId);
    const allItems=DB.orderItems(o.id).filter(i=>i.status==='active');
    const filteredItems=allItems.filter(i=>{const p=DB.getProducts().find(x=>x.id===i.productId);return p&&(S.kitchTab==='food'?!isBev(p.cat):isBev(p.cat));});
    if(!filteredItems.length)return'';
    const mins=elapsed(o.createdAt);const isNew=mins<2;
    return`<div class="ko${isNew?' new-order':''}">
      <div class="ko-head">
        <div><h4>Mesa ${t?.num||'?'} <span style="font-size:14px;color:rgba(62,184,122,.5)">Piso ${t?.floor||'?'}</span></h4>
          <div class="ko-meta">Pedido #${o.id} · ${fmtTime(o.createdAt)}${o.status==='pending'?' · <span style="color:var(--yellow)">Cobro listo</span>':''}</div>
        </div>
        <div class="ko-timer ${timerClass(o.createdAt)}">${elapsedStr(o.createdAt)}</div>
      </div>
      <div class="ko-items">${filteredItems.map(it=>{
        const p=DB.getProducts().find(x=>x.id===it.productId);
        return`<div class="ko-item">
          ${p?.image?`<img src="${p.image}" style="width:36px;height:36px;border-radius:6px;object-fit:cover;flex-shrink:0">`:`<span class="ki-em">${p?.emoji||'🍔'}</span>`}
          <div class="ki-info"><div class="ki-name">${p?.name||'?'}</div>${it.notes?`<div class="ki-notes">${it.notes}</div>`:''}</div>
          <div class="ki-qty">×${it.qty}</div>
        </div>`;
      }).join('')}</div>
    </div>`;
  }).join('')}</div>`;
}

let _kitchSoundEnabled=true;
function toggleKitchSound(){
  _kitchSoundEnabled=!_kitchSoundEnabled;
  const btn=$('kitch-sound-btn');
  if(btn)btn.innerHTML=_kitchSoundEnabled?'<i class="fa-solid fa-bell"></i>':'<i class="fa-solid fa-bell-slash"></i>';
  toast(_kitchSoundEnabled?'Sonido activado':'Sonido desactivado','info');
}
function playKitchBeep(){
  try{
    const ac=new(window.AudioContext||window.webkitAudioContext)();
    const osc=ac.createOscillator();const gain=ac.createGain();
    osc.connect(gain);gain.connect(ac.destination);
    osc.frequency.value=880;osc.type='sine';
    gain.gain.setValueAtTime(.4,ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001,ac.currentTime+.4);
    osc.start(ac.currentTime);osc.stop(ac.currentTime+.4);
  }catch(e){/* audio not available */}
}

/* ─────────────────────────────────────────────
   MODAL HELPERS
───────────────────────────────────────────── */
function openModal(id){$(id)?.classList.remove('hidden');}
function closeModal(id){$(id)?.classList.add('hidden');}
document.addEventListener('click',e=>{if(e.target.classList.contains('modal-wrap'))e.target.classList.add('hidden');});

/* ─────────────────────────────────────────────
   EXTRA CSS FOR TWO-PANEL TABLE LAYOUT
   (injected so it stays in one file)
───────────────────────────────────────────── */
(function injectTableLayoutCSS(){
  const style=document.createElement('style');
  style.textContent=`
    .tables-order-layout{display:grid;grid-template-columns:1fr 360px;gap:18px;align-items:start}
    .tables-panel{min-width:0}
    .order-side-panel{background:var(--bg-1);border:1px solid var(--border);border-radius:14px;padding:16px;display:flex;flex-direction:column;gap:10px;position:sticky;top:calc(var(--bar-h) + 14px);max-height:calc(100vh - var(--bar-h) - 28px);overflow-y:auto}
    .order-side-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:200px;gap:12px;color:var(--text-dim);text-align:center}
    .order-side-empty i{font-size:40px}
    .order-side-empty p{font-size:13px;font-weight:600;line-height:1.5}
    .order-side-header{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap}
    .order-side-header h3{font-size:20px}
    @media(max-width:900px){
      .tables-order-layout{grid-template-columns:1fr}
      .order-side-panel{position:static;max-height:none}
    }
  `;
  document.head.appendChild(style);
})();
