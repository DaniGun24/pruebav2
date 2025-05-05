// Calendario.js

// 1) offsets (GMT-5 → local)
const offsetMap = {
  "Argentina": 2,  "Bolivia": 1,  "Canadá": 1,
  "Colombia": 0,   "Costa Rica": 1, "Cuba": 0,
  "Ecuador": 0,    "El Salvador": 1,"Guatemala": 1,
  "Honduras": 1,  "México": 1,    "Paraguay": 2,
  "Perú": 0,       "Panamá": 0,     "Chile": 1,
  "Uruguay": 2,   "Venezuela": 1, "Puerto Rico": 1,
  "República Dominicana": 1, "Canadá Ottawa": 1
};

// 2) franjas base (en GMT-5)
const baseSlots = [
  ["09:00","11:00"],
  ["11:00","11:15"],
  ["11:15","13:00"],
  ["14:00","17:30"],
  ["17:30","18:00"]
];

// elementos
const homeBtn = document.querySelector(".home-btn");
const tzSel   = document.querySelector(".tz-selected");
const tzList  = document.querySelector(".tz-list");
const tzLabel = document.querySelector(".tz-label");
const tzFlag  = document.querySelector(".tz-flag");
const cols    = document.querySelectorAll(".cal-col");
const dots    = document.querySelectorAll(".dot");

// 1) Home
homeBtn.addEventListener("click", ()=> {
  window.location.href = "aula.html";
});

// 2) poblar lista de países (alfabético)
Object.keys(offsetMap).sort().forEach(country => {
  const li = document.createElement("li");
  // bandera
  const img = document.createElement("img");
  img.className = "tz-flag";
  img.src = `Recursos/icons/Banderas/${country}.png`;
  img.onerror = ()=> img.remove();
  li.appendChild(img);
  li.append(country);
  li.addEventListener("click", ()=> selectTZ(country));
  tzList.appendChild(li);
});
tzList.style.maxHeight = "calc(1.5em*10 + 1rem)";

// 3) toggle dropdown
tzSel.addEventListener("click", () => {
  tzList.classList.toggle("hidden");
  tzSel.classList.toggle("open");
});

// 4) seleccionar zona
function selectTZ(country) {
  tzLabel.textContent = country;
  tzFlag.src = `Recursos/icons/Banderas/${country}.png`;
  tzList.classList.add("hidden");
  tzSel.classList.remove("open");
  renderSlots(offsetMap[country] ?? 0);
}

// 5) renderizar franjas con offset manual (GMT-5 → local)
function renderSlots(offset) {
  cols.forEach(col => {
    const ul = col.querySelector(".cal-slots");
    ul.innerHTML = "";
    baseSlots.forEach(pair => {
      let [h1,m1] = pair[0].split(":"), [h2,m2] = pair[1].split(":");

      // minutos totales desde medianoche en GMT-5
      const startMin = +h1*60 + +m1 + offset*60;
      const endMin   = +h2*60 + +m2 + offset*60;

      // función formateo
      const fmt = mins => {
        let h = Math.floor(mins/60), m = mins%60;
        let pm = h>=12;
        h = ((h+11)%12 +1);
        return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')} ${pm?'PM':'AM'}`;
      };

      const li = document.createElement("li");
      li.textContent = `${fmt(startMin)} – ${fmt(endMin)}`;
      ul.appendChild(li);
    });
  });
  updateActiveDot();
}

// 6) dots móvil
let current = 0;
function updateActiveDot() {
  dots.forEach((d,i)=> d.classList.toggle('active', i===current));
}
dots.forEach((d,i)=>{
  d.addEventListener('click', ()=>{
    current = i;
    cols[i].scrollIntoView({behavior:'smooth', inline:'center'});
    updateActiveDot();
  });
});

// 7) init
selectTZ("Colombia");
