/* ===========================
   SIMPLE AUTH (VARIABLE)
   =========================== */
const ADMIN_ID = "admin";
const ADMIN_PASS = "12345";

/* ===========================
   STORAGE (sama dengan index.js)
   =========================== */
const STORAGE_KEY = "dash_site_v100";
const AUTH_KEY = "dash_admin_authed";

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
      sideLeftBg: "",
      sideRightBg: "",
      mainBannerBg: "",
      btnLogin: {label:"Login", url:"#"},
      btnPromo: {label:"Promo", url:"#"},
      btnRtp: {label:"RTP / Data", url:"#"},
      rightBanners: [
        {img:"", url:"#"},
        {img:"", url:"#"},
        {img:"", url:"#"}
      ],
      sliders: [],
      homeBanners: []
    },
    links: {
      login:"#",
      daftar:"#",
      telegram:"#",
      livechat:"#",
      promo:"#",
      rtp:"#",
      panduan:"#"
    }
  },
  tabs: [
    {key:"result", label:"Result", title:"DATA RESULT", active:true},
    {key:"prediksi", label:"Prediksi", title:"PREDIKSI", active:false},
    {key:"paito", label:"Paito", title:"DATA", active:false},
    {key:"info", label:"Buku Mimpi", title:"INFO", active:false}
  ],
  markets: [
    {id:"brunei", name:"BRUNEI", logo:"https://via.placeholder.com/240x120.png?text=BRUNEI", number:"2148", date:"Result: Jumat, 20-02-2026", liveUrl:"#", detailUrl:"#", historyUrl:"#", closeTime:"06:30", resultTime:"07:00", desc:""}
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
  data.site.hero.sliders = Array.isArray(data.site.hero.sliders) ? data.site.hero.sliders : [];
  data.site.hero.homeBanners = Array.isArray(data.site.hero.homeBanners) ? data.site.hero.homeBanners : [];
  data.site.links = data.site.links && typeof data.site.links === "object" ? data.site.links : deepClone(defaultData.site.links);
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
function saveData(d){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
}

function $(id){ return document.getElementById(id); }
function esc(s){
  return String(s ?? "")
    .replaceAll("&","&amp;").replaceAll("<","&lt;")
    .replaceAll(">","&gt;").replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

/* ===========================
   LOGIN PAGE
   =========================== */
(function initLogin(){
  const form = document.getElementById("loginForm");
  if(!form) return;

  const msg = $("loginMsg");
  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const u = $("inUser").value.trim();
    const p = $("inPass").value;

    if(u === ADMIN_ID && p === ADMIN_PASS){
      localStorage.setItem(AUTH_KEY, "1");
      msg.className = "msg ok";
      msg.textContent = "Login sukses ✅";
      location.href = "admin.html";
    }else{
      msg.className = "msg err";
      msg.textContent = "ID / Password salah ❌";
    }
  });
})();

/* ===========================
   ADMIN PANEL
   =========================== */
(function initAdmin(){
  const pageRoot = document.querySelector(".main");
  if(!pageRoot) return;

  if(localStorage.getItem(AUTH_KEY) !== "1"){
    location.href = "login.html";
    return;
  }

  const state = { data: loadData() };

  // Router
  const links = document.querySelectorAll(".sb-link");
  function setPage(name){
    document.querySelectorAll(".page").forEach(p=>p.classList.remove("show"));
    document.getElementById(`page-${name}`)?.classList.add("show");
    links.forEach(a=>a.classList.toggle("active", a.dataset.page===name));
    const titleMap = {
      dashboard:"Dashboard",
      result:"Result Pasaran",
      pasaran:"Daftar Pasaran",
      web:"Web Settings",
      banner:"Banner / Slider",
      links:"Links"
    };
    $("topTitle").textContent = titleMap[name] || "Admin";
  }

  function onHash(){
    const n = (location.hash || "#dashboard").replace("#","");
    setPage(n);
  }
  window.addEventListener("hashchange", onHash);
  onHash();

  // Buttons global
  $("btnLogout").addEventListener("click", ()=>{
    localStorage.removeItem(AUTH_KEY);
    location.href = "login.html";
  });

  $("btnReset").addEventListener("click", ()=>{
    if(!confirm("Reset semua data ke default?")) return;
    state.data = deepClone(defaultData);
    saveData(state.data);
    mountAll();
    alert("Reset OK ✅");
  });

  $("btnSaveAll").addEventListener("click", ()=>{
    saveData(state.data);
    alert("Tersimpan ✅");
  });

  // Mount all UI
  function mountAll(){
    mountDashboard();
    mountResult();
    mountMarkets();
    mountWebSettings();
    mountBanner();
    mountLinks();
  }

  /* ===== DASHBOARD SETTINGS ===== */
  function mountDashboard(){
    $("stMarquee").value = state.data.site.marqueeText || "";
    $("stLogo").value = state.data.site.brandLogoUrl || "";
    $("stBgLeft").value = state.data.site.hero.sideLeftBg || "";
    $("stBgRight").value = state.data.site.hero.sideRightBg || "";
    $("stMainBanner").value = state.data.site.hero.mainBannerBg || "";
    $("stWa").value = state.data.site.whatsappUrl || "";
    $("stFooter").value = state.data.site.footerText || "";

    document.querySelectorAll("[data-save]").forEach(btn=>{
      btn.onclick = ()=>{
        const t = btn.dataset.save;

        if(t==="marquee"){
          state.data.site.marqueeText = $("stMarquee").value.trim();
        }
        if(t==="branding"){
          state.data.site.brandLogoUrl = $("stLogo").value.trim();
          state.data.site.hero.sideLeftBg = $("stBgLeft").value.trim();
          state.data.site.hero.sideRightBg = $("stBgRight").value.trim();
          state.data.site.hero.mainBannerBg = $("stMainBanner").value.trim();
        }
        if(t==="wa"){
          state.data.site.whatsappUrl = $("stWa").value.trim();
        }
        if(t==="footer"){
          state.data.site.footerText = $("stFooter").value.trim();
        }

        saveData(state.data);
        alert("Update ✅");
      };
    });
  }

  /* ===== RESULT PASARAN ===== */
  function mountResult(){
    const sel = $("rsMarket");
    sel.innerHTML = `<option value="">Belum Dipilih</option>` + state.data.markets.map(m=>`
      <option value="${esc(m.id)}">${esc(m.name)}</option>
    `).join("");

    $("btnAddResult").onclick = ()=>{
      const marketId = sel.value;
      const number = $("rsNumber").value.trim();
      const at = $("rsDate").value.trim() || new Date().toLocaleString("id-ID");

      if(!marketId) return alert("Pilih pasaran dulu");
      if(!number) return alert("Isi angka result");

      state.data.results.unshift({ id: cryptoId(), marketId, number, at });

      // update angka di market (biar card depan ikut berubah)
      const m = state.data.markets.find(x=>x.id===marketId);
      if(m){
        m.number = number;
        m.date = "Result: " + at;
      }

      $("rsNumber").value = "";
      $("rsDate").value = "";
      saveData(state.data);
      renderResultTable();
    };

    $("rsSearch").oninput = renderResultTable;
    renderResultTable();
  }

  function renderResultTable(){
    const q = ($("rsSearch").value || "").toLowerCase();
    const tbody = document.querySelector("#rsTable tbody");
    const rows = state.data.results
      .map(r=>{
        const m = state.data.markets.find(x=>x.id===r.marketId);
        const name = m?.name || r.marketId;
        return { r, name, logo: m?.logo || "" };
      })
      .filter(x=> x.name.toLowerCase().includes(q));

    tbody.innerHTML = rows.map(x=>`
      <tr>
        <td>
          <span class="tag">
            <img src="${esc(x.logo)}" onerror="this.style.display='none'">
            <b>${esc(x.name)}</b>
          </span>
        </td>
        <td><input data-edit-num="${esc(x.r.id)}" value="${esc(x.r.number)}" /></td>
        <td>${esc(x.r.at)}</td>
        <td>
          <button class="btn small" data-edit="${esc(x.r.id)}">Edit</button>
          <button class="btn small danger" data-del="${esc(x.r.id)}">Hapus</button>
        </td>
      </tr>
    `).join("");

    tbody.querySelectorAll("[data-edit]").forEach(b=>{
      b.onclick = ()=>{
        const id = b.dataset.edit;
        const input = tbody.querySelector(`[data-edit-num="${CSS.escape(id)}"]`);
        const val = input?.value.trim();
        const item = state.data.results.find(r=>r.id===id);
        if(!item || !val) return;
        item.number = val;

        // ikut update angka market
        const m = state.data.markets.find(x=>x.id===item.marketId);
        if(m){ m.number = val; }

        saveData(state.data);
        alert("Updated ✅");
      };
    });

    tbody.querySelectorAll("[data-del]").forEach(b=>{
      b.onclick = ()=>{
        const id = b.dataset.del;
        state.data.results = state.data.results.filter(r=>r.id!==id);
        saveData(state.data);
        renderResultTable();
      };
    });
  }

  /* ===== DAFTAR PASARAN ===== */
  function mountMarkets(){
    $("btnAddMarket").onclick = ()=>{
      const id = cryptoId();
      state.data.markets.unshift({
        id,
        name:"NEW PASARAN",
        logo:"",
        number:"0000",
        date:"Result: -",
        liveUrl:"#",
        detailUrl:"#",
        historyUrl:"#",
        closeTime:"00:00",
        resultTime:"00:00",
        desc:""
      });
      saveData(state.data);
      renderMarketList();
      mountResult(); // refresh dropdown
    };
    renderMarketList();
  }

  function renderMarketList(){
    const wrap = $("marketList");
    wrap.innerHTML = state.data.markets.map((m, idx)=>`
      <div class="market-block" data-m="${esc(m.id)}">
        <div class="market-head">
          <div class="market-title">
            <img src="${esc(m.logo)}" onerror="this.style.display='none'">
            <span>${idx+1}. ${esc(m.name)}</span>
          </div>
          <button class="btn danger small" data-del-market="${esc(m.id)}">Delete Pasaran</button>
        </div>

        <div class="market-form">
          <div>
            <label>Nama Pasaran</label>
            <input data-f="name" value="${esc(m.name)}" />
          </div>
          <div>
            <label>Link Livedraw</label>
            <input data-f="liveUrl" value="${esc(m.liveUrl)}" />
          </div>
          <div>
            <label>Tutup Pasaran</label>
            <input data-f="closeTime" value="${esc(m.closeTime)}" />
          </div>
          <div>
            <label>Result Pasaran</label>
            <input data-f="resultTime" value="${esc(m.resultTime)}" />
          </div>

          <div>
            <label>Link Gambar (Logo)</label>
            <input data-f="logo" value="${esc(m.logo)}" />
          </div>
          <div>
            <label>Link Detail</label>
            <input data-f="detailUrl" value="${esc(m.detailUrl)}" />
          </div>
          <div>
            <label>Link Result</label>
            <input data-f="historyUrl" value="${esc(m.historyUrl)}" />
          </div>
          <div>
            <label>Angka (terbaru)</label>
            <input data-f="number" value="${esc(m.number)}" />
          </div>

          <div class="market-desc">
            <label>Deskripsi</label>
            <textarea data-f="desc">${esc(m.desc)}</textarea>
          </div>
        </div>

        <div class="row right" style="margin-top:10px">
          <button class="btn small" data-save-market="${esc(m.id)}">Submit</button>
        </div>
      </div>
    `).join("");

    wrap.querySelectorAll("[data-save-market]").forEach(b=>{
      b.onclick = ()=>{
        const id = b.dataset.saveMarket;
        const box = wrap.querySelector(`[data-m="${CSS.escape(id)}"]`);
        const m = state.data.markets.find(x=>x.id===id);
        if(!box || !m) return;

        box.querySelectorAll("[data-f]").forEach(inp=>{
          const k = inp.dataset.f;
          m[k] = (inp.value ?? "").trim();
        });

        m.date = m.date || "Result: -";

        saveData(state.data);
        alert("Saved ✅");
        mountResult(); // refresh dropdown
      };
    });

    wrap.querySelectorAll("[data-del-market]").forEach(b=>{
      b.onclick = ()=>{
        const id = b.dataset.delMarket;
        if(!confirm("Hapus pasaran ini?")) return;
        state.data.markets = state.data.markets.filter(x=>x.id!==id);
        state.data.results = state.data.results.filter(r=>r.marketId!==id);
        saveData(state.data);
        renderMarketList();
        mountResult();
      };
    });
  }

  /* ===== WEB SETTINGS: TOP LINKS + NAV MENU ===== */
  function mountWebSettings(){
    renderTopLinksEditor();
    renderNavMenuEditor();

    $("btnAddTopLink").onclick = ()=>{
      state.data.site.topLinks.push({label:"New Link", url:"#"});
      saveData(state.data);
      renderTopLinksEditor();
    };

    $("btnAddNavLink").onclick = ()=>{
      state.data.site.navMenu.push({label:"NEW", url:"#", active:false});
      saveData(state.data);
      renderNavMenuEditor();
    };
  }

  function renderTopLinksEditor(){
    const wrap = $("topLinksList");
    wrap.innerHTML = state.data.site.topLinks.map((x,i)=>`
      <div class="row" style="margin-bottom:8px">
        <input style="flex:1" data-tl-l="${i}" value="${esc(x.label)}" />
        <input style="flex:2" data-tl-u="${i}" value="${esc(x.url)}" />
        <button class="btn small danger" data-tl-d="${i}">Remove</button>
      </div>
    `).join("");

    wrap.querySelectorAll("[data-tl-d]").forEach(b=>{
      b.onclick = ()=>{
        const i = Number(b.dataset.tlD);
        state.data.site.topLinks.splice(i,1);
        saveData(state.data);
        renderTopLinksEditor();
      };
    });

    wrap.querySelectorAll("input").forEach(inp=>{
      inp.onchange = ()=>{
        const i = Number(inp.dataset.tlL ?? inp.dataset.tlU);
        const item = state.data.site.topLinks[i];
        if(!item) return;
        if(inp.dataset.tlL !== undefined) item.label = inp.value.trim();
        if(inp.dataset.tlU !== undefined) item.url = inp.value.trim();
        saveData(state.data);
      };
    });
  }

  function renderNavMenuEditor(){
    const wrap = $("navLinksList");
    wrap.innerHTML = state.data.site.navMenu.map((x,i)=>`
      <div class="row" style="margin-bottom:8px">
        <input style="flex:1" data-nv-l="${i}" value="${esc(x.label)}" />
        <input style="flex:2" data-nv-u="${i}" value="${esc(x.url)}" />
        <select style="width:120px" data-nv-a="${i}">
          <option value="0">Inactive</option>
          <option value="1" ${x.active ? "selected":""}>Active</option>
        </select>
        <button class="btn small danger" data-nv-d="${i}">Remove</button>
      </div>
    `).join("");

    wrap.querySelectorAll("[data-nv-d]").forEach(b=>{
      b.onclick = ()=>{
        const i = Number(b.dataset.nvD);
        state.data.site.navMenu.splice(i,1);
        saveData(state.data);
        renderNavMenuEditor();
      };
    });

    wrap.querySelectorAll("input,select").forEach(inp=>{
      inp.onchange = ()=>{
        const i = Number(inp.dataset.nvL ?? inp.dataset.nvU ?? inp.dataset.nvA);
        const item = state.data.site.navMenu[i];
        if(!item) return;
        if(inp.dataset.nvL !== undefined) item.label = inp.value.trim();
        if(inp.dataset.nvU !== undefined) item.url = inp.value.trim();
        if(inp.dataset.nvA !== undefined) item.active = inp.value === "1";
        saveData(state.data);
      };
    });
  }

  /* ===== BANNER / SLIDER ===== */
  function mountBanner(){
    $("btnAddSlider").onclick = ()=>{
      const img = $("slImg").value.trim();
      const url = $("slUrl").value.trim() || "#";
      if(!img) return alert("Isi link gambar slider");
      state.data.site.hero.sliders.unshift({id:cryptoId(), img, url});
      $("slImg").value = "";
      $("slUrl").value = "";
      saveData(state.data);
      renderSliderTable();
    };

    $("btnAddBanner").onclick = ()=>{
      const img = $("bnImg").value.trim();
      const url = $("bnUrl").value.trim() || "#";
      if(!img) return alert("Isi link gambar banner");
      state.data.site.hero.homeBanners.unshift({id:cryptoId(), img, url});
      $("bnImg").value = "";
      $("bnUrl").value = "";
      saveData(state.data);
      renderBannerTable();
    };

    renderSliderTable();
    renderBannerTable();
  }

  function renderSliderTable(){
    const tb = document.querySelector("#slTable tbody");
    const list = state.data.site.hero.sliders || [];
    tb.innerHTML = list.map((x,i)=>`
      <tr>
        <td>${i+1}</td>
        <td><a href="${esc(x.img)}" target="_blank" rel="noopener">${esc(x.img)}</a></td>
        <td>${esc(x.url)}</td>
        <td>
          <button class="btn small" data-sl-e="${esc(x.id)}">Edit</button>
          <button class="btn small danger" data-sl-d="${esc(x.id)}">Remove</button>
        </td>
      </tr>
    `).join("");

    tb.querySelectorAll("[data-sl-d]").forEach(b=>{
      b.onclick = ()=>{
        const id = b.dataset.slD;
        state.data.site.hero.sliders = list.filter(s=>s.id!==id);
        saveData(state.data);
        renderSliderTable();
      };
    });

    tb.querySelectorAll("[data-sl-e]").forEach(b=>{
      b.onclick = ()=>{
        const id = b.dataset.slE;
        const item = list.find(s=>s.id===id);
        if(!item) return;
        const img = prompt("Edit link gambar:", item.img) ?? item.img;
        const url = prompt("Edit link tujuan:", item.url) ?? item.url;
        item.img = img.trim();
        item.url = url.trim() || "#";
        saveData(state.data);
        renderSliderTable();
      };
    });
  }

  function renderBannerTable(){
    const tb = document.querySelector("#bnTable tbody");
    const list = state.data.site.hero.homeBanners || [];
    tb.innerHTML = list.map((x,i)=>`
      <tr>
        <td>${i+1}</td>
        <td><a href="${esc(x.img)}" target="_blank" rel="noopener">${esc(x.img)}</a></td>
        <td>${esc(x.url)}</td>
        <td>
          <button class="btn small" data-bn-e="${esc(x.id)}">Edit</button>
          <button class="btn small danger" data-bn-d="${esc(x.id)}">Remove</button>
        </td>
      </tr>
    `).join("");

    tb.querySelectorAll("[data-bn-d]").forEach(b=>{
      b.onclick = ()=>{
        const id = b.dataset.bnD;
        state.data.site.hero.homeBanners = list.filter(s=>s.id!==id);
        saveData(state.data);
        renderBannerTable();
      };
    });

    tb.querySelectorAll("[data-bn-e]").forEach(b=>{
      b.onclick = ()=>{
        const id = b.dataset.bnE;
        const item = list.find(s=>s.id===id);
        if(!item) return;
        const img = prompt("Edit link gambar:", item.img) ?? item.img;
        const url = prompt("Edit link tujuan:", item.url) ?? item.url;
        item.img = img.trim();
        item.url = url.trim() || "#";
        saveData(state.data);
        renderBannerTable();
      };
    });
  }

  /* ===== LINKS ===== */
  function mountLinks(){
    const lk = state.data.site.links;

    $("lkLogin").value = lk.login || "";
    $("lkDaftar").value = lk.daftar || "";
    $("lkTelegram").value = lk.telegram || "";
    $("lkLivechat").value = lk.livechat || "";
    $("lkPromo").value = lk.promo || "";
    $("lkRtp").value = lk.rtp || "";
    $("lkPanduan").value = lk.panduan || "";

    $("btnSaveLinks").onclick = ()=>{
      lk.login = $("lkLogin").value.trim();
      lk.daftar = $("lkDaftar").value.trim();
      lk.telegram = $("lkTelegram").value.trim();
      lk.livechat = $("lkLivechat").value.trim();
      lk.promo = $("lkPromo").value.trim();
      lk.rtp = $("lkRtp").value.trim();
      lk.panduan = $("lkPanduan").value.trim();
      saveData(state.data);

      // sinkron ke tombol di web (optional: simpan ke hero btn)
      state.data.site.hero.btnLogin.url = lk.login || "#";
      state.data.site.hero.btnPromo.url = lk.promo || "#";
      state.data.site.hero.btnRtp.url = lk.rtp || "#";
      saveData(state.data);

      alert("Links saved ✅");
    };
  }

  function cryptoId(){
    return Math.random().toString(16).slice(2) + Date.now().toString(16);
  }

  mountAll();
})();
