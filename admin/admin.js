const STORAGE_KEY = "dash_site_v100";

function deepClone(x){ return JSON.parse(JSON.stringify(x)); }

const defaultData = (() => {
  // ambil default dari index.js (biar konsisten) -> ditulis ulang minimal di sini
  return {
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
      {id:"carolina-day", name:"CAROLINA-DAY", logo:"https://via.placeholder.com/240x120.png?text=CAROLINA-DAY", number:"2296", date:"Result: Jumat, 20-02-2026", liveUrl:"#", detailUrl:"#", historyUrl:"#", closeTime:"10:30", resultTime:"11:00", desc:""},
      {id:"carolina-eve", name:"CAROLINA-EVE", logo:"https://via.placeholder.com/240x120.png?text=CAROLINA-EVE", number:"9470", date:"Result: Jumat, 20-02-2026", liveUrl:"#", detailUrl:"#", historyUrl:"#", closeTime:"12:30", resultTime:"13:00", desc:""},
      {id:"china", name:"CHINA", logo:"https://via.placeholder.com/240x120.png?text=CHINA", number:"0140", date:"Result: Jumat, 20-02-2026", liveUrl:"#", detailUrl:"#", historyUrl:"#", closeTime:"14:30", resultTime:"15:00", desc:""},
      {id:"dubai", name:"DUBAI", logo:"https://via.placeholder.com/240x120.png?text=DUBAI", number:"5705", date:"Result: Jumat, 20-02-2026", liveUrl:"#", detailUrl:"#", historyUrl:"#", closeTime:"16:30", resultTime:"17:00", desc:""},
      {id:"florida", name:"FLORIDA", logo:"https://via.placeholder.com/240x120.png?text=FLORIDA", number:"3321", date:"Result: Jumat, 20-02-2026", liveUrl:"#", detailUrl:"#", historyUrl:"#", closeTime:"18:30", resultTime:"19:00", desc:""}
    ],
    results: [
      {marketId:"carolina-eve", number:"9470", at:"21 Feb 2026 | 01:00:04"},
      {marketId:"carolina-day", number:"2296", at:"21 Feb 2026 | 01:00:04"}
    ]
  };
})();

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
function saveData(data){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function pretty(x){ return JSON.stringify(x, null, 2); }

const siteJson = document.getElementById("siteJson");
const tabsJson = document.getElementById("tabsJson");
const marketsJson = document.getElementById("marketsJson");
const resultsJson = document.getElementById("resultsJson");
const fullJson = document.getElementById("fullJson");

function refreshUI(){
  const data = loadData();
  siteJson.value = pretty(data.site);
  tabsJson.value = pretty(data.tabs);
  marketsJson.value = pretty(data.markets);
  resultsJson.value = pretty(data.results);
  fullJson.value = pretty(data);
}

function getEdited(){
  const site = JSON.parse(siteJson.value || "{}");
  const tabs = JSON.parse(tabsJson.value || "[]");
  const markets = JSON.parse(marketsJson.value || "[]");
  const results = JSON.parse(resultsJson.value || "[]");
  return normalize({site, tabs, markets, results});
}

document.getElementById("saveBtn").addEventListener("click", ()=>{
  try{
    const data = getEdited();
    saveData(data);
    refreshUI();
    alert("Tersimpan ✅");
  }catch(err){
    alert("JSON error ❌\n\n" + err.message);
  }
});

document.getElementById("resetBtn").addEventListener("click", ()=>{
  saveData(deepClone(defaultData));
  refreshUI();
  alert("Reset default ✅");
});

document.getElementById("refreshBtn").addEventListener("click", refreshUI);

document.getElementById("importBtn").addEventListener("click", ()=>{
  try{
    const data = normalize(JSON.parse(fullJson.value || "{}"));
    saveData(data);
    refreshUI();
    alert("Import berhasil ✅");
  }catch(err){
    alert("Import gagal ❌\n\n" + err.message);
  }
});

/* simple router */
function setPage(page){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("show"));
  document.getElementById(`page-${page}`)?.classList.add("show");

  document.querySelectorAll(".sb-link").forEach(a=>a.classList.remove("active"));
  document.querySelector(`.sb-link[data-page="${page}"]`)?.classList.add("active");

  const titleMap = {site:"Web Settings", markets:"Daftar Pasaran", results:"Result Pasaran", export:"Export / Import"};
  document.getElementById("topTitle").textContent = titleMap[page] || "Admin";
}

function onHash(){
  const page = (location.hash || "#site").replace("#","");
  setPage(page);
}
window.addEventListener("hashchange", onHash);

document.querySelectorAll(".sb-link").forEach(a=>{
  a.addEventListener("click", ()=>{
    const page = a.getAttribute("data-page");
    location.hash = page;
  });
});

refreshUI();
onHash();
