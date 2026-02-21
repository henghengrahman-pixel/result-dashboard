/* =========================
   CONFIG LOGIN (VARIABLE)
========================= */
const ADMIN_ID = "admin";      // GANTI DI SINI
const ADMIN_PASS = "12345";    // GANTI DI SINI

const AUTH_KEY = "dash_admin_login";
const STORAGE_KEY = "dash_site_v100";

/* =========================
   HELPER
========================= */
function $(id){ return document.getElementById(id); }

function loadData(){
  try{
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  }catch{
    return {};
  }
}

function saveData(data){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function ensureStructure(d){
  d.site = d.site || {};
  d.site.hero = d.site.hero || {};
  d.site.links = d.site.links || {};
  d.site.hero.sliders = d.site.hero.sliders || [];
  d.site.hero.homeBanners = d.site.hero.homeBanners || [];
  return d;
}

function cryptoId(){
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

/* =========================
   LOGIN PAGE
========================= */
(function(){
  const form = $("loginForm");
  if(!form) return;

  if(localStorage.getItem(AUTH_KEY) === "1"){
    location.href = "admin.html";
    return;
  }

  form.addEventListener("submit", function(e){
    e.preventDefault();

    const u = $("inUser").value.trim();
    const p = $("inPass").value;

    if(u === ADMIN_ID && p === ADMIN_PASS){
      localStorage.setItem(AUTH_KEY, "1");
      location.href = "admin.html";
    }else{
      $("loginMsg").textContent = "ID / Password salah ❌";
      $("loginMsg").className = "msg err";
    }
  });
})();

/* =========================
   ADMIN PANEL
========================= */
(function(){

  if(!document.getElementById("page-dashboard")) return;

  if(localStorage.getItem(AUTH_KEY) !== "1"){
    location.href = "login.html";
    return;
  }

  let data = ensureStructure(loadData());

  /* =========================
     SIDEBAR MOBILE
  ========================= */
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const hamb = document.getElementById("hamb");

  hamb?.addEventListener("click", ()=>{
    sidebar.classList.toggle("open");
    overlay.classList.toggle("show");
  });

  overlay?.addEventListener("click", ()=>{
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
  });

  /* =========================
     LOGOUT
  ========================= */
  $("btnLogout")?.addEventListener("click", ()=>{
    localStorage.removeItem(AUTH_KEY);
    location.href = "login.html";
  });

  /* =========================
     SAVE DASHBOARD SETTINGS
  ========================= */
  $("btnSaveMarquee")?.addEventListener("click", ()=>{
    data.site.marqueeText = $("stMarquee").value.trim();
    saveData(data);
    alert("Saved ✅");
  });

  $("btnSaveBranding")?.addEventListener("click", ()=>{
    data.site.brandLogoUrl = $("stLogo").value.trim();
    data.site.hero.backgroundUrl = $("stBg").value.trim();
    data.site.hero.mainBannerBg = $("stHeaderPromo").value.trim();
    saveData(data);
    alert("Saved ✅");
  });

  $("btnSaveWa")?.addEventListener("click", ()=>{
    const num = $("stWa").value.replace(/\D/g,"");
    data.site.whatsappUrl = num ? `https://wa.me/${num}` : "";
    saveData(data);
    alert("Saved ✅");
  });

  $("btnSaveFooter")?.addEventListener("click", ()=>{
    data.site.footerText = $("stFooter").value.trim();
    saveData(data);
    alert("Saved ✅");
  });

  $("btnSaveInfo")?.addEventListener("click", ()=>{
    data.site.infoText = $("stInfo").value.trim();
    saveData(data);
    alert("Saved ✅");
  });

  $("btnSaveContact")?.addEventListener("click", ()=>{
    data.site.contactText = $("stContact").value.trim();
    saveData(data);
    alert("Saved ✅");
  });

  $("btnSaveLinks")?.addEventListener("click", ()=>{
    data.site.links.login = $("lkLogin").value.trim();
    data.site.links.daftar = $("lkDaftar").value.trim();
    data.site.links.panduan = $("lkPanduan").value.trim();
    data.site.links.rtp = $("lkRtp").value.trim();
    data.site.links.promo = $("lkPromo").value.trim();
    data.site.links.telegram = $("lkTelegram").value.trim();
    data.site.links.livechat = $("lkLivechat").value.trim();
    saveData(data);
    alert("Saved ✅");
  });

  /* =========================
     SLIDER CRUD
  ========================= */
  function renderSliders(){
    const tbody = $("slTable")?.querySelector("tbody");
    if(!tbody) return;

    tbody.innerHTML = data.site.hero.sliders.map((s,i)=>`
      <tr>
        <td>${i+1}</td>
        <td>${s.img}</td>
        <td><img src="${s.img}" style="max-width:160px"></td>
        <td>
          <button class="btn-mini edit" data-edit="${s.id}">Edit</button>
          <button class="btn-mini remove" data-del="${s.id}">Remove</button>
        </td>
      </tr>
    `).join("");

    tbody.querySelectorAll("[data-del]").forEach(btn=>{
      btn.onclick = ()=>{
        data.site.hero.sliders = data.site.hero.sliders.filter(x=>x.id !== btn.dataset.del);
        saveData(data);
        renderSliders();
      };
    });

    tbody.querySelectorAll("[data-edit]").forEach(btn=>{
      btn.onclick = ()=>{
        const item = data.site.hero.sliders.find(x=>x.id===btn.dataset.edit);
        const newUrl = prompt("Edit link gambar:", item.img);
        if(newUrl){
          item.img = newUrl;
          saveData(data);
          renderSliders();
        }
      };
    });
  }

  $("btnAddSlider")?.addEventListener("click", ()=>{
    const img = $("slImg").value.trim();
    const url = $("slUrl").value.trim() || "#";
    if(!img) return alert("Isi link gambar dulu");
    data.site.hero.sliders.unshift({id:cryptoId(), img, url});
    saveData(data);
    $("slImg").value = "";
    $("slUrl").value = "";
    renderSliders();
  });

  /* =========================
     BANNER CRUD
  ========================= */
  function renderBanners(){
    const tbody = $("bnTable")?.querySelector("tbody");
    if(!tbody) return;

    tbody.innerHTML = data.site.hero.homeBanners.map((b,i)=>`
      <tr>
        <td>${i+1}</td>
        <td>${b.img}</td>
        <td><img src="${b.img}" style="max-width:120px"></td>
        <td>${b.url}</td>
        <td>
          <button class="btn-mini edit" data-edit="${b.id}">Edit</button>
          <button class="btn-mini remove" data-del="${b.id}">Remove</button>
        </td>
      </tr>
    `).join("");

    tbody.querySelectorAll("[data-del]").forEach(btn=>{
      btn.onclick = ()=>{
        data.site.hero.homeBanners = data.site.hero.homeBanners.filter(x=>x.id !== btn.dataset.del);
        saveData(data);
        renderBanners();
      };
    });
  }

  $("btnAddBanner")?.addEventListener("click", ()=>{
    const img = $("bnImg").value.trim();
    const url = $("bnUrl").value.trim() || "#";
    if(!img) return alert("Isi link banner dulu");
    data.site.hero.homeBanners.unshift({id:cryptoId(), img, url});
    saveData(data);
    $("bnImg").value = "";
    $("bnUrl").value = "";
    renderBanners();
  });

  renderSliders();
  renderBanners();

})();
