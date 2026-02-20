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
      {label:"LIVE DRAW", url:"#"},
      {label:"PREDIKSI", url:"#", pill:{text:"HOT", type:"hot"}},
      {label:"TOOLS", url:"#", pill:{text:"HOT", type:"hot"}},
      {label:"DATA RESULT", url:"#", pill:{text:"NEW", type:"new"}},
      {label:"PROMOSI", url:"#", pill:{text:"HOT", type:"hot"}},
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
      ]
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
  data.site.hero.rightBanners = Array.isArray(data.site.hero.rightBanners) ? data.site.hero.rightBanners : [];
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
  const links = state.data.site.topLinks || [];
  wrap.innerHTML = links.map((x, i)=>`
    <a href="${x.url || "#"}">${escapeHtml(x.label || "")}</a>
    ${i < links.length-1 ? `<span class="sep">|</span>` : ""}
  `).join("");
}

function renderNav(){
  const nav = el("navMenu");
  const items = state.data.site.navMenu || [];
  nav.innerHTML = items.map(it=>{
    const pill = it.pill?.text ? `<span class="pill ${it.pill.type==="new"?"new":"hot"}">${escapeHtml(it.pill.text)}</span>` : "";
    return `<a href="${it.url || "#"}" class="${it.active ? "active":""}">${escapeHtml(it.label || "")}${pill}</a>`;
  }).join("");
}

function applySite(){
  const s = state.data.site;

  el("brandTitle").textContent = s.brandTitle || "Dashboard";
  el("brandSub").textContent = s.brandSub || "";
  el("footerText").textContent = s.footerText || "";

  const logo = el("brandLogo");
  logo.src = s.brandLogoUrl || "";
  logo.onerror = ()=>{ logo.src = "https://via.placeholder.com/80x80.png?text=LOGO"; };

  const wa = el("waBtn");
  wa.textContent = s.whatsappText || "WHATSAPP";
  wa.href = s.whatsappUrl || "#";

  // ✅ SET SIDE BG PAKAI CSS VAR (ini yang bikin mirip)
  const root = document.documentElement;
  root.style.setProperty("--side-left-url", `url("${s.hero?.sideLeftBg || ""}")`);
  root.style.setProperty("--side-right-url", `url("${s.hero?.sideRightBg || ""}")`);

  // main banner
  el("mainBannerImg").style.backgroundImage =
    `linear-gradient(180deg, rgba(0,0,0,.10), rgba(0,0,0,.72)), url("${s.hero?.mainBannerBg || ""}")`;

  // buttons
  el("btnLogin").textContent = s.hero?.btnLogin?.label || "Login";
  el("btnPromo").textContent = s.hero?.btnPromo?.label || "Promo";
  el("btnRtp").textContent = s.hero?.btnRtp?.label || "RTP / Data";
  el("btnLogin").href = s.hero?.btnLogin?.url || "#";
  el("btnPromo").href = s.hero?.btnPromo?.url || "#";
  el("btnRtp").href = s.hero?.btnRtp?.url || "#";

  // right banners
  const rbs = s.hero?.rightBanners || [];
  const ids = ["rb1","rb2","rb3"];
  ids.forEach((id, idx)=>{
    const a = el(id);
    const img = a.querySelector("img");
    const item = rbs[idx] || {img:"https://via.placeholder.com/800x220.png?text=BANNER", url:"#"};
    a.href = item.url || "#";
    img.src = item.img || "";
    img.onerror = ()=>{ img.src = "https://via.placeholder.com/800x220.png?text=BANNER"; };
  });

  // marquee
  const txt = s.marqueeText || "";
  const track = el("marqueeTrack");
  const unit = `<span>${escapeHtml(txt)}</span>`;
  track.innerHTML = unit + unit + unit + unit;

  // ✅ bungkus center content dengan stage (kalau belum)
  const heroWrap = document.querySelector(".hero-wrap .container");
  if(heroWrap && !document.querySelector(".stage")){
    const stage = document.createElement("div");
    stage.className = "stage";
    while(heroWrap.firstChild){
      stage.appendChild(heroWrap.firstChild);
    }
    heroWrap.appendChild(stage);
  }
}

function renderTabs(){
  const wrap = el("tabButtons");
  wrap.innerHTML = (state.data.tabs || []).map(t=>`
    <button class="tab-btn ${t.key===state.currentTab ? "active":""}" data-tab="${t.key}">
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
  sel.innerHTML = `<option value="all">Semua Pasaran</option>`;
  state.data.markets.forEach(m=>{
    const opt = document.createElement("option");
    opt.value = m.id;
    opt.textContent = m.name;
    sel.appendChild(opt);
  });
  sel.addEventListener("change", refreshTab);
}

function renderResultGrid(filter="all"){
  const list = (filter==="all") ? state.data.markets : state.data.markets.filter(m=>m.id===filter);

  return `
    <div class="cards">
      ${list.map(m=>`
        <div class="market-card">
          <div class="m-info" data-detail="${m.id}">i</div>
          <div class="m-top">
            <img src="${escapeAttr(m.logo || "")}" alt="${escapeAttr(m.name)}"
              onerror="this.src='https://via.placeholder.com/240x120.png?text=LOGO'">
          </div>
          <div class="m-name">${escapeHtml(m.name)}</div>
          <div class="m-number">${escapeHtml(pad4(m.number))}</div>
          <div class="m-date">${escapeHtml(m.date || "")}</div>
          <div class="m-actions">
            <a class="m-btn" href="${escapeAttr(m.liveUrl || "#")}" target="_blank" rel="noopener">LIVEDRAW</a>
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
  el("tabTitle").textContent = tab.title || "DATA";

  const filter = el("marketSelect").value || "all";
  const content = el("tabContent");

  if(state.currentTab === "result") content.innerHTML = renderResultGrid(filter);
  else content.innerHTML = `<div class="card" style="padding:14px"><b>${escapeHtml(tab.title||"Info")}</b><div class="smallmuted" style="margin-top:6px">Konten bisa diisi dari Admin.</div></div>`;
}

function openModal(title, html){
  el("modalTitle").textContent = title || "Detail";
  el("modalBody").innerHTML = html || "";
  el("modal").classList.add("show");
}
function closeModal(){ el("modal").classList.remove("show"); }

function bindClicks(){
  document.addEventListener("click", (e)=>{
    const d = e.target.closest("[data-detail]");
    if(d){
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
          <div class="item"><b>Tutup Pasaran</b><div class="mono">${escapeHtml(m.closeTime || "-")}</div></div>
          <div class="item"><b>Result</b><div class="mono">${escapeHtml(m.resultTime || "-")}</div></div>
        </div>
        <div class="item" style="margin-top:12px;border-radius:14px;padding:12px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04)">
          <b>Deskripsi</b>
          <div class="smallmuted" style="margin-top:6px">${escapeHtml(m.desc || "-")}</div>
        </div>
      `);
    }
  });
}

function tickClock(){
  const now = new Date();
  const day = now.toLocaleDateString("id-ID", {weekday:"long"});
  const date = now.toLocaleDateString("id-ID", {day:"2-digit", month:"short", year:"numeric"});
  const time = now.toLocaleTimeString("id-ID");
  el("clockText").textContent = `${day}, ${date} (${time})`;
}

function mount(){
  injectShade();
  renderTopLinks();
  renderNav();
  applySite();
  renderTabs();
  renderMarketSelect();
  refreshTab();

  el("modalClose").addEventListener("click", closeModal);
  el("modal").addEventListener("click",(e)=>{ if(e.target.id==="modal") closeModal(); });

  bindClicks();

  tickClock();
  setInterval(tickClock, 1000);
}
mount();
