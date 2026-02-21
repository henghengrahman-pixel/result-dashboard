const STORAGE_KEY = "dash_site_v100";

const defaultData = {
  site: {
    brandTitle: "Rupiah Toto",
    brandSub: "Result • Data • Info",
    brandLogoUrl: "https://via.placeholder.com/80x80.png?text=RT",
    whatsappText: "WHATSAPP",
    whatsappUrl: "https://wa.me/6280000000000",
    footerText: "Copyright © 2026 Dashboard.",
    marqueeText: "SELAMAT DATANG DI DASHBOARD • INFO TERBARU • DATA TERUPDATE •",
    topLinks: [
      {label:"Download Aplikasi", url:"#"},
      {label:"Daftar Jadi Member", url:"#"},
      {label:"Telegram", url:"#"},
      {label:"Livechat", url:"#"}
    ],
    navMenu: [
      {label:"HOME", url:"#", active:true},
      {label:"LIVE DATA", url:"#"},
      {label:"ARTIKEL", url:"#"},
      {label:"TOOLS", url:"#", pill:{text:"HOT", type:"hot"}},
      {label:"DATA RESULT", url:"#", pill:{text:"NEW", type:"new"}},
      {label:"PROMO", url:"#", pill:{text:"HOT", type:"hot"}},
      {label:"PANDUAN", url:"#"}
    ],
    hero: {
      sideLeftBg: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=60",
      sideRightBg: "https://images.unsplash.com/photo-1520975958225-3f61d86f7b75?auto=format&fit=crop&w=1200&q=60",
      mainBannerBg: "https://images.unsplash.com/photo-1520975958225-3f61d86f7b75?auto=format&fit=crop&w=1400&q=60",
      btnLogin: {label:"Login", url:"#"},
      btnPromo: {label:"Promo", url:"#"},
      btnRtp: {label:"RTP / Data", url:"#"},
      rightBanners: [
        {img:"https://via.placeholder.com/800x220.png?text=FREEBET", url:"#"},
        {img:"https://via.placeholder.com/800x220.png?text=TURNOVER", url:"#"},
        {img:"https://via.placeholder.com/800x220.png?text=MAHJONG", url:"#"}
      ],
      // schema admin (fallback)
      backgroundUrl: "",
      sliders: [],
      homeBanners: []
    }
  },
  tabs: [
    {key:"result", label:"Result", title:"DATA RESULT", active:true},
    {key:"prediksi", label:"Prediksi", title:"PREDIKSI", active:false},
    {key:"paito", label:"Paito", title:"DATA", active:false},
    {key:"info", label:"Buku Mimpi", title:"INFO", active:false}
  ],
  markets: [
    {id:"brunei", name:"BRUNEI", logo:"https://via.placeholder.com/240x120.png?text=BRUNEI", number:"2148", date:"Result: Jumat, 20-02-2026", liveUrl:"#", detailUrl:"#", historyUrl:"#", closeTime:"06:30", resultTime:"07:00", desc:""},
    {id:"california", name:"CALIFORNIA", logo:"https://via.placeholder.com/240x120.png?text=CALIFORNIA", number:"2911", date:"Result: Jumat, 20-02-2026", liveUrl:"#", detailUrl:"#", historyUrl:"#", closeTime:"07:30", resultTime:"08:00", desc:""},
    {id:"cambodia", name:"CAMBODIA", logo:"https://via.placeholder.com/240x120.png?text=CAMBODIA", number:"0498", date:"Result: Jumat, 20-02-2026", liveUrl:"#", detailUrl:"#", historyUrl:"#", closeTime:"08:30", resultTime:"09:00", desc:""},
    {id:"carolina-day", name:"CAROLINA-DAY", logo:"https://via.placeholder.com/240x120.png?text=CAROLINA-DAY", number:"2296", date:"Result: Jumat, 20-02-2026", liveUrl:"#", detailUrl:"#", historyUrl:"#", closeTime:"10:30", resultTime:"11:00", desc:""}
  ],
  results: []
};

function deepClone(x){ return JSON.parse(JSON.stringify(x)); }

function normalize(d){
  const data = (d && typeof d === "object") ? d : deepClone(defaultData);
  data.site = data.site && typeof data.site === "object" ? data.site : deepClone(defaultData.site);
  data.site.topLinks = Array.isArray(data.site.topLinks) ? data.site.topLinks : [];
  data.site.navMenu = Array.isArray(data.site.navMenu) ? data.site.navMenu : [];
  data.site.hero = data.site.hero && typeof data.site.hero === "object" ? data.site.hero : deepClone(defaultData.site.hero);

  const hero = data.site.hero;
  hero.rightBanners = Array.isArray(hero.rightBanners) ? hero.rightBanners : [];
  hero.sliders = Array.isArray(hero.sliders) ? hero.sliders : [];
  hero.homeBanners = Array.isArray(hero.homeBanners) ? hero.homeBanners : [];

  // fallback schema admin -> schema frontend
  const bgFallback = hero.backgroundUrl || "";

  if(!hero.sideLeftBg && bgFallback) hero.sideLeftBg = bgFallback;
  if(!hero.sideRightBg && bgFallback) hero.sideRightBg = bgFallback;

  if(!hero.mainBannerBg){
    const firstSlider = hero.sliders[0]?.img;
    if(firstSlider) hero.mainBannerBg = firstSlider;
    else if(bgFallback) hero.mainBannerBg = bgFallback;
  }

  if(hero.rightBanners.length === 0 && hero.homeBanners.length){
    hero.rightBanners = hero.homeBanners.slice(0,3).map(x=>({ img:x.img, url:x.url }));
  }

  data.tabs = Array.isArray(data.tabs) ? data.tabs : deepClone(defaultData.tabs);
  data.markets = Array.isArray(data.markets) ? data.markets : [];
  data.results = Array.isArray(data.results) ? data.results : [];
  return data;
}

function loadData(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return deepClone(defaultData);
    return normalize(JSON.parse(raw));
  }catch{
    return deepClone(defaultData);
  }
}

const state = { data: loadData(), currentTab:"result" };

function el(id){ return document.getElementById(id); }
function pad4(s){ return String(s ?? "").padStart(4,"0"); }

function escapeHtml(s){
  return String(s ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}
function escapeAttr(s){ return escapeHtml(s).replaceAll("`","&#096;"); }

function injectShade(){
  if(document.querySelector(".sideShade")) return;
  const div = document.createElement("div");
  div.className = "sideShade";
  document.body.appendChild(div);
}

function renderTopLinks(){
  const wrap = el("topLinks");
  if(!wrap) return;
  const links = state.data.site.topLinks || [];
  wrap.innerHTML = links.map((x, i)=>`
    <a href="${escapeAttr(x.url || "#")}">${escapeHtml(x.label || "")}</a>
    ${i < links.length-1 ? `<span class="sep">|</span>` : ""}
  `).join("");
}

function renderNav(){
  const nav = el("navMenu");
  if(!nav) return;
  const items = state.data.site.navMenu || [];
  nav.innerHTML = items.map(it=>{
    const pill = it.pill?.text ? `<span class="pill ${it.pill.type==="new"?"new":"hot"}">${escapeHtml(it.pill.text)}</span>` : "";
    return `<a href="${escapeAttr(it.url || "#")}" class="${it.active ? "active":""}">${escapeHtml(it.label || "")}${pill}</a>`;
  }).join("");
}

function applySite(){
  const s = state.data.site || {};
  const hero = s.hero || {};

  if(el("brandTitle")) el("brandTitle").textContent = s.brandTitle || "Dashboard";
  if(el("brandSub")) el("brandSub").textContent = s.brandSub || "";
  if(el("footerText")) el("footerText").textContent = s.footerText || "";

  const logo = el("brandLogo");
  if(logo){
    logo.src = s.brandLogoUrl || "";
    logo.onerror = ()=>{ logo.src = "https://via.placeholder.com/80x80.png?text=LOGO"; };
  }

  const wa = el("waBtn");
  if(wa){
    wa.textContent = s.whatsappText || "WHATSAPP";
    wa.href = s.whatsappUrl || "#";
  }

  // fallback admin fields
  const bgFallback = hero.backgroundUrl || "";
  const sliders = Array.isArray(hero.sliders) ? hero.sliders : [];
  const homeBanners = Array.isArray(hero.homeBanners) ? hero.homeBanners : [];

  const sideLeft = hero.sideLeftBg || bgFallback;
  const sideRight = hero.sideRightBg || bgFallback;

  const mainBanner = hero.mainBannerBg || sliders[0]?.img || bgFallback;

  const rightBanners = (Array.isArray(hero.rightBanners) && hero.rightBanners.length)
    ? hero.rightBanners
    : homeBanners.slice(0,3).map(x => ({ img:x.img, url:x.url }));

  // set side BG via CSS var
  const root = document.documentElement;
  root.style.setProperty("--side-left-url", `url("${sideLeft || ""}")`);
  root.style.setProperty("--side-right-url", `url("${sideRight || ""}")`);

  // main banner
  const mb = el("mainBannerImg");
  if(mb){
const bust = (url) => url ? `${url}${url.includes("?") ? "&" : "?"}v=${Date.now()}` : "";
mb.style.backgroundImage =
  `linear-gradient(180deg, rgba(0,0,0,.10), rgba(0,0,0,.72)), url("${bust(mainBanner || "")}")`;
  }

  // buttons
  const bl = el("btnLogin");
  const bp = el("btnPromo");
  const br = el("btnRtp");

  if(bl){ bl.textContent = hero?.btnLogin?.label || "Login"; bl.href = hero?.btnLogin?.url || "#"; }
  if(bp){ bp.textContent = hero?.btnPromo?.label || "Promo"; bp.href = hero?.btnPromo?.url || "#"; }
  if(br){ br.textContent = hero?.btnRtp?.label || "RTP / Data"; br.href = hero?.btnRtp?.url || "#"; }

  // right banners 3 slot
  const ids = ["rb1","rb2","rb3"];
  ids.forEach((id, idx)=>{
    const a = el(id);
    if(!a) return;
    const img = a.querySelector("img");
    const item = rightBanners[idx] || {img:"https://via.placeholder.com/800x220.png?text=BANNER", url:"#"};
    a.href = item.url || "#";
    if(img){
     const bust = (url) => url ? `${url}${url.includes("?") ? "&" : "?"}v=${Date.now()}` : "";
img.src = bust(item.img || "");
      img.onerror = ()=>{ img.src = "https://via.placeholder.com/800x220.png?text=BANNER"; };
    }
  });

  // marquee
  const txt = s.marqueeText || "";
  const track = el("marqueeTrack");
  if(track){
    const unit = `<span>${escapeHtml(txt)}</span>`;
    track.innerHTML = unit + unit + unit + unit;
  }

  // stage wrap (bungkus hanya .center, jangan ganggu .hero-grid)
const center = document.querySelector(".hero-grid .center");
if(center && !center.querySelector(":scope > .stage")){
  const stage = document.createElement("div");
  stage.className = "stage";
  while(center.firstChild){
    stage.appendChild(center.firstChild);
  }
  center.appendChild(stage);
}

function renderTabs(){
  const wrap = el("tabButtons");
  if(!wrap) return;
  wrap.innerHTML = (state.data.tabs || []).map(t=>`
    <button class="tab-btn ${t.key===state.currentTab ? "active":""}" data-tab="${escapeAttr(t.key)}">
      ${escapeHtml(t.label || t.key)}
    </button>
  `).join("");

  wrap.querySelectorAll(".tab-btn").forEach(b=>{
    b.addEventListener("click", ()=>{
      state.currentTab = b.getAttribute("data-tab");
      renderTabs();
      refreshTab();
    });
  });
}

function renderMarketSelect(){
  const sel = el("marketSelect");
  if(!sel) return;

  sel.innerHTML = `<option value="all">Semua Pasaran</option>`;
  state.data.markets.forEach(m=>{
    const opt = document.createElement("option");
    opt.value = m.id;
    opt.textContent = m.name;
    sel.appendChild(opt);
  });

  sel.onchange = refreshTab;
}

function renderResultGrid(filter="all"){
  const list = (filter==="all") ? state.data.markets : state.data.markets.filter(m=>m.id===filter);

  return `
    <div class="cards">
      ${list.map(m=>`
        <div class="market-card">
          <div class="m-info" data-detail="${escapeAttr(m.id)}">i</div>
          <div class="m-top">
            <img src="${escapeAttr(m.logo || "")}" alt="${escapeAttr(m.name)}"
              onerror="this.src='https://via.placeholder.com/240x120.png?text=LOGO'">
          </div>
          <div class="m-name">${escapeHtml(m.name)}</div>
          <div class="m-number">${escapeHtml(pad4(m.number))}</div>
          <div class="m-date">${escapeHtml(m.date || "")}</div>
          <div class="m-actions">
            <a class="m-btn" href="${escapeAttr(m.liveUrl || "#")}" target="_blank" rel="noopener">LIVEDATA</a>
            <a class="m-btn" href="${escapeAttr(m.detailUrl || "#")}" target="_blank" rel="noopener">DETAIL</a>
            <a class="m-btn" href="${escapeAttr(m.historyUrl || "#")}" target="_blank" rel="noopener">RESULT</a>
          </div>
        </div>
      `).join("")}
    </div>
  `;
}

function refreshTab(){
  const tab = state.data.tabs.find(t=>t.key===state.currentTab) || {title:""};
  if(el("tabTitle")) el("tabTitle").textContent = tab.title || "DATA";

  const filter = el("marketSelect")?.value || "all";
  const content = el("tabContent");
  if(!content) return;

  if(state.currentTab === "result") content.innerHTML = renderResultGrid(filter);
  else content.innerHTML = `<div class="card" style="padding:14px"><b>${escapeHtml(tab.title||"Info")}</b><div class="smallmuted" style="margin-top:6px">Konten bisa diisi dari Admin.</div></div>`;
}

function openModal(title, html){
  if(el("modalTitle")) el("modalTitle").textContent = title || "Detail";
  if(el("modalBody")) el("modalBody").innerHTML = html || "";
  el("modal")?.classList.add("show");
}
function closeModal(){ el("modal")?.classList.remove("show"); }

function bindClicks(){
  document.addEventListener("click", (e)=>{
    const d = e.target.closest("[data-detail]");
    if(!d) return;

    const id = d.getAttribute("data-detail");
    const m = state.data.markets.find(x=>x.id===id);
    if(!m) return;

    openModal(m.name, `
      <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <img src="${escapeAttr(m.logo || "")}" alt="${escapeAttr(m.name)}"
          style="width:170px;height:auto;border-radius:14px;border:1px solid rgba(255,255,255,.12)"
          onerror="this.src='https://via.placeholder.com/240x120.png?text=LOGO'">
        <div>
          <div style="font-weight:900;font-size:18px">${escapeHtml(m.name)}</div>
          <div class="smallmuted" style="margin-top:6px">${escapeHtml(m.date || "")}</div>
          <div class="mono" style="margin-top:10px">Angka: ${escapeHtml(pad4(m.number))}</div>
        </div>
      </div>
      <div class="kv">
        <div class="item"><b>Tutup</b><div class="mono">${escapeHtml(m.closeTime || "-")}</div></div>
        <div class="item"><b>Jadwal</b><div class="mono">${escapeHtml(m.resultTime || "-")}</div></div>
      </div>
      <div class="item" style="margin-top:12px;border-radius:14px;padding:12px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04)">
        <b>Deskripsi</b>
        <div class="smallmuted" style="margin-top:6px">${escapeHtml(m.desc || "-")}</div>
      </div>
    `);
  });
}

function tickClock(){
  const now = new Date();
  const day = now.toLocaleDateString("id-ID", {weekday:"long"});
  const date = now.toLocaleDateString("id-ID", {day:"2-digit", month:"short", year:"numeric"});
  const time = now.toLocaleTimeString("id-ID");
  if(el("clockText")) el("clockText").textContent = `${day}, ${date} (${time})`;
}

function reloadAndRender(){
  state.data = loadData();
  renderTopLinks();
  renderNav();
  applySite();
  renderTabs();
  renderMarketSelect();
  refreshTab();
}

function mount(){
  injectShade();
  reloadAndRender();

  el("modalClose")?.addEventListener("click", closeModal);
  el("modal")?.addEventListener("click",(e)=>{ if(e.target.id==="modal") closeModal(); });

  bindClicks();

  tickClock();
  setInterval(tickClock, 1000);
}

// auto update saat admin ubah data (tab lain)
window.addEventListener("storage", (e)=>{
  if(e.key === STORAGE_KEY){
    reloadAndRender();
  }
});

// kadang user balik ke tab ini tanpa trigger storage
document.addEventListener("visibilitychange", ()=>{
  if(!document.hidden) reloadAndRender();
});

mount();
