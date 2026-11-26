// main.js — Router dan interaksi situs.
//
// Rute hash: #/ (beranda), #/ekonomi, #/penduduk, #/sosial, #/provinsi,
// #/sumber. Tahun terpilih disimpan di memori dan disorot pada grafik.
// Halaman provinsi: pencarian langsung, pengurutan, detail per baris,
// dan unduh CSV yang dibuat di peramban (tanpa jaringan).

import { YEARS } from "./data.js";
import { PROVINCES, density } from "./provinces.js";
import {
  renderDashboard, renderEconomy, renderPopulation, renderSocial,
  renderProvinces, renderSources,
} from "./views.js";

const view = document.getElementById("view");
const navLinks = [...document.querySelectorAll(".nav-link")];

let year = 2024;
const provinceState = { query: "", sortKey: "population", sortDir: "desc", selected: null };

const ROUTES = {
  "": renderDashboard,
  ekonomi: renderEconomy,
  penduduk: renderPopulation,
  sosial: renderSocial,
  provinsi: renderProvinces,
  sumber: renderSources,
};

function currentRoute() {
  const hash = location.hash.replace(/^#\/?/, "");
  const [path, query] = hash.split("?");
  const params = new URLSearchParams(query || "");
  return { path, params };
}

function render() {
  const { path, params } = currentRoute();
  if (path === "provinsi") {
    if (params.get("cari")) provinceState.query = params.get("cari");
    view.innerHTML = renderProvinces(provinceState);
    wireProvinces();
  } else if (ROUTES[path]) {
    view.innerHTML = ROUTES[path](year);
    wireYearPickers();
  } else {
    view.innerHTML = renderDashboard(year);
    wireYearPickers();
  }
  navLinks.forEach((a) => {
    const target = a.getAttribute("href").replace(/^#\/?/, "");
    a.classList.toggle("active", target === path || (target === "" && path === ""));
    if (a.classList.contains("active")) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
  window.scrollTo({ top: 0 });
}

function wireYearPickers() {
  view.querySelectorAll("[data-year-select]").forEach((select) => {
    select.addEventListener("change", () => {
      const y = Number(select.value);
      if (YEARS.includes(y)) {
        year = y;
        render();
      }
    });
  });
}

function wireProvinces() {
  const search = document.getElementById("province-search");
  const sort = document.getElementById("province-sort");
  const csvBtn = document.getElementById("download-csv");
  const closeBtn = document.getElementById("close-detail");

  if (search) {
    search.addEventListener("input", () => {
      provinceState.query = search.value;
      const pos = search.selectionStart;
      render();
      const next = document.getElementById("province-search");
      if (next) {
        next.focus();
        next.setSelectionRange(pos, pos);
      }
    });
  }
  if (sort) {
    sort.addEventListener("change", () => {
      const [key, dir] = sort.value.split("-");
      provinceState.sortKey = key;
      provinceState.sortDir = dir;
      render();
    });
  }
  view.querySelectorAll("#province-table tbody tr[data-province]").forEach((row) => {
    const pick = () => {
      provinceState.selected = row.getAttribute("data-province");
      render();
      const detail = document.getElementById("province-detail");
      if (detail) detail.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    row.addEventListener("click", pick);
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        pick();
      }
    });
  });
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      provinceState.selected = null;
      render();
    });
  }
  if (csvBtn) csvBtn.addEventListener("click", downloadCsv);
}

function downloadCsv() {
  const header = "Provinsi;Ibu kota;Kepulauan;Penduduk 2024 (juta);Kemiskinan Sep 2024 (%);IPM 2024;Kepadatan (jiwa/km2)\n";
  const lines = PROVINCES.map((p) => [
    p.name, p.capital, p.island,
    String(p.population).replace(".", ","),
    String(p.poverty).replace(".", ","),
    String(p.hdi).replace(".", ","),
    density(p),
  ].join(";")).join("\n");
  const blob = new Blob(["\uFEFF" + header + lines], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "provinsi-indonesia-2024.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

window.addEventListener("hashchange", render);
render();
