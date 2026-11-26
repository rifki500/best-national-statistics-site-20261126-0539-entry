// views.js — Semua halaman situs, dirender dari data.js dan provinces.js.
//
// Setiap halaman mengembalikan HTML lengkap untuk <main>. Angka selalu
// disertai sumber dan tahun; grafik digambar oleh charts.js. Halaman
// provinsi memakai tabel yang bisa dicari dan diurutkan (logika di main.js).

import {
  YEARS, POPULATION, GDP_GROWTH, GDP_NOMINAL_IDR, GDP_PER_CAPITA_USD,
  INFLATION, POVERTY, UNEMPLOYMENT, HDI, GINI, EXPORTS, IMPORTS,
  SECTORS_2024, AGE_GROUPS_2024, EXPORT_DESTINATIONS_2024,
  HEADLINE_2024, RELEASES, valueInYear, changeInPoints,
} from "./data.js";
import { PROVINCES, density, poorPeople, hdiCategory, sortProvinces } from "./provinces.js";
import { lineChart, barChart, donutChart, meterBar } from "./charts.js";

function sourceTag(text) {
  return `<p class="source">Sumber: ${text}</p>`;
}

function yearOptions(selected) {
  return YEARS.map((y) => `<option value="${y}"${y === selected ? " selected" : ""}>${y}</option>`).join("");
}

function kpiCard(k) {
  return `<a class="kpi" href="${k.route}">
    <span class="kpi-label">${k.label}</span>
    <span class="kpi-value">${k.value}</span>
    <span class="kpi-note">${k.note}</span>
    <span class="kpi-change">${k.change}</span>
    <span class="kpi-source">Sumber: ${k.source}</span>
  </a>`;
}

function yearPicker(id, selected, label) {
  return `<label class="year-picker">${label}
    <select id="${id}" data-year-select>${yearOptions(selected)}</select>
  </label>`;
}

// ---------- Beranda ----------
export function renderDashboard(year) {
  const pop = valueInYear(POPULATION, year);
  const growth = valueInYear(GDP_GROWTH, year);
  const pov = valueInYear(POVERTY, year);
  const cards = HEADLINE_2024.map(kpiCard).join("");
  const topPop = sortProvinces(PROVINCES, "population", "desc").slice(0, 5);
  const rows = topPop.map((p, i) => `<tr><td>${i + 1}</td><td><a href="#/provinsi?cari=${encodeURIComponent(p.name)}">${p.name}</a></td><td class="num">${p.population.toLocaleString("id-ID")} jt</td><td class="num">${p.hdi.toLocaleString("id-ID")}</td></tr>`).join("");
  const releases = RELEASES.map((r) => `<li><span class="rel-date">${r.date}</span><span class="rel-title">${r.title}</span><span class="rel-source">${r.source}</span></li>`).join("");

  return `
  <section class="hero">
    <p class="eyebrow">Portal Statistik Nasional &middot; Data resmi, terbuka, tanpa login</p>
    <h1>Indonesia dalam angka</h1>
    <p class="lede">Penduduk, ekonomi, kemiskinan, dan pembangunan manusia — dirangkum dari
    publikasi resmi Badan Pusat Statistik (BPS) dan Bank Dunia, dengan sumber dan
    tahun pada setiap angka. Pilih tahun untuk melihat angka tahun itu.</p>
    <div class="hero-tools">${yearPicker("year-dash", year, "Tahun data:")}</div>
    <p class="year-readout" id="year-readout">Tahun ${year}: penduduk <strong>${pop.toLocaleString("id-ID")} juta jiwa</strong> &middot;
    ekonomi tumbuh <strong>${growth.toLocaleString("id-ID")}%</strong> &middot;
    penduduk miskin <strong>${pov.toLocaleString("id-ID")}%</strong>.</p>
  </section>

  <section class="kpi-grid" aria-label="Indikator utama 2024">${cards}</section>

  <section class="grid-2">
    <article class="card">
      <h2>Pertumbuhan penduduk 2015–2024</h2>
      <p class="card-sub">Juta jiwa, pertengahan tahun</p>
      ${lineChart({ years: YEARS, values: POPULATION, highlightYear: year, decimals: 1 })}
      ${sourceTag("BPS, 2024. Penduduk 2024: 281,6 juta jiwa — terbanyak keempat di dunia.")}
    </article>
    <article class="card">
      <h2>Pertumbuhan ekonomi 2015–2024</h2>
      <p class="card-sub">Persen, PDB harga konstan (y-on-y)</p>
      ${lineChart({ years: YEARS, values: GDP_GROWTH, highlightYear: year, decimals: 2 })}
      ${sourceTag("BPS, 2024. Kontraksi 2020 (−2,07%) adalah dampak pandemi COVID-19.")}
    </article>
  </section>

  <section class="grid-2">
    <article class="card">
      <h2>Provinsi terpadat</h2>
      <p class="card-sub">Lima provinsi dengan penduduk terbanyak, 2024</p>
      <table class="table"><thead><tr><th>#</th><th>Provinsi</th><th class="num">Penduduk</th><th class="num">IPM</th></tr></thead>
      <tbody>${rows}</tbody></table>
      <p><a class="btn" href="#/provinsi">Jelajahi 38 provinsi &rarr;</a></p>
      ${sourceTag("BPS, 2024. Jawa Barat, Jawa Timur, dan Jawa Tengah menampung 46% penduduk Indonesia.")}
    </article>
    <article class="card">
      <h2>Rilis resmi terbaru</h2>
      <p class="card-sub">Berita Resmi Statistik yang dirujuk situs ini</p>
      <ul class="releases">${releases}</ul>
      <p><a class="btn" href="#/sumber">Semua sumber &amp; metodologi &rarr;</a></p>
    </article>
  </section>`;
}

// ---------- Ekonomi ----------
export function renderEconomy(year) {
  const growth = valueInYear(GDP_GROWTH, year);
  const gdp = valueInYear(GDP_NOMINAL_IDR, year);
  const perCap = valueInYear(GDP_PER_CAPITA_USD, year);
  const inf = valueInYear(INFLATION, year);
  const tpt = valueInYear(UNEMPLOYMENT, year);
  const surplus = +(EXPORTS[YEARS.indexOf(year)] - IMPORTS[YEARS.indexOf(year)]).toFixed(1);
  const sectorRows = SECTORS_2024.map((s, i) => `<li><span class="dot" style="background:${["#0f4c4a", "#2a7f7a", "#e8a33d", "#c96f2e", "#7fae9d", "#d9c9a3", "#5b6b68"][i]}"></span>${s.name}<strong>${s.value.toLocaleString("id-ID")}%</strong></li>`).join("");
  const destRows = EXPORT_DESTINATIONS_2024.map((d) => `<li>${d.country}${meterBar(d.share)}<strong>${d.share}%</strong></li>`).join("");

  return `
  <section class="page-head">
    <h1>Ekonomi</h1>
    <p class="lede">PDB, pertumbuhan, inflasi, perdagangan, dan ketenagakerjaan Indonesia 2015–2024.</p>
    <div class="hero-tools">${yearPicker("year-eko", year, "Tahun data:")}</div>
  </section>

  <section class="stat-strip" aria-label="Angka ekonomi tahun terpilih">
    <div class="stat"><span class="stat-label">PDB ${year}</span><strong>Rp${gdp.toLocaleString("id-ID")} T</strong><span>Harga berlaku — BPS</span></div>
    <div class="stat"><span class="stat-label">Pertumbuhan ${year}</span><strong>${growth.toLocaleString("id-ID")}%</strong><span>y-on-y — BPS</span></div>
    <div class="stat"><span class="stat-label">PDB per kapita ${year}</span><strong>US$${perCap.toLocaleString("id-ID")}</strong><span>Bank Dunia</span></div>
    <div class="stat"><span class="stat-label">Inflasi ${year}</span><strong>${inf.toLocaleString("id-ID")}%</strong><span>Desember y-on-y — BPS</span></div>
    <div class="stat"><span class="stat-label">Pengangguran ${year}</span><strong>${tpt.toLocaleString("id-ID")}%</strong><span>Agustus — BPS</span></div>
    <div class="stat"><span class="stat-label">Surplus dagang ${year}</span><strong>US$${surplus.toLocaleString("id-ID")} Miliar</strong><span>Ekspor − impor — BPS</span></div>
  </section>

  <section class="grid-2">
    <article class="card">
      <h2>Pertumbuhan ekonomi 2015–2024</h2>
      <p class="card-sub">Persen, PDB harga konstan</p>
      ${lineChart({ years: YEARS, values: GDP_GROWTH, highlightYear: year, decimals: 2 })}
      ${sourceTag("BPS, 2024. Ekonomi tumbuh 5,03% pada 2024, melambat tipis dari 5,05% pada 2023.")}
    </article>
    <article class="card">
      <h2>Inflasi 2015–2024</h2>
      <p class="card-sub">Persen y-on-y, Desember</p>
      ${lineChart({ years: YEARS, values: INFLATION, highlightYear: year, decimals: 2 })}
      ${sourceTag("BPS, 2024. Lonjakan 2022 (5,51%) mengikuti kenaikan harga BBM bersubsidi.")}
    </article>
  </section>

  <section class="grid-2">
    <article class="card">
      <h2>Ekspor vs impor 2015–2024</h2>
      <p class="card-sub">Miliar dolar AS</p>
      ${barChart({ years: YEARS, series: [
        { label: "Ekspor", values: EXPORTS, color: "#0f4c4a" },
        { label: "Impor", values: IMPORTS, color: "#e8a33d" },
      ], decimals: 0 })}
      <p class="legend"><span><i style="background:#0f4c4a"></i>Ekspor</span><span><i style="background:#e8a33d"></i>Impor</span></p>
      ${sourceTag("BPS, 2024. Ekspor 2024: US$264,7 miliar; impor: US$233,7 miliar; surplus US$31,0 miliar.")}
    </article>
    <article class="card">
      <h2>Struktur PDB 2024</h2>
      <p class="card-sub">Pangsa menurut lapangan usaha</p>
      <div class="donut-wrap">${donutChart({ items: SECTORS_2024 })}
      <ul class="legend-list">${sectorRows}</ul></div>
      ${sourceTag("BPS, 2024 (dibulatkan). Industri pengolahan tetap penyumbang terbesar PDB.")}
    </article>
  </section>

  <section class="card">
    <h2>Ke mana ekspor Indonesia pergi? (2024)</h2>
    <p class="card-sub">Pangsa tujuan ekspor, persen — sekitar</p>
    <ul class="meter-list">${destRows}</ul>
    ${sourceTag("BPS, 2024. Tiongkok menyerap hampir seperempat ekspor Indonesia.")}
    <p class="note">Cara membaca: PDB per kapita 2024 sekitar Rp78,6 juta (BPS) atau US$4.960
    (Bank Dunia). Garis kemiskinan September 2024: Rp595.242 per kapita per bulan (BPS).</p>
  </section>`;
}

// ---------- Penduduk ----------
export function renderPopulation(year) {
  const pop = valueInYear(POPULATION, year);
  const prev = valueInYear(POPULATION, year - 1);
  const growthPct = prev ? (((pop - prev) / prev) * 100).toFixed(2) : "–";
  const ageRows = AGE_GROUPS_2024.map((a) => `<li>${a.group}${meterBar(a.value)}<strong>${a.value.toLocaleString("id-ID")}%</strong></li>`).join("");
  const islandRows = [
    { name: "Jawa", share: 55.9, note: "152,7 jt jiwa di 6 provinsi" },
    { name: "Sumatera", share: 21.7, note: "59,2 jt jiwa di 10 provinsi" },
    { name: "Kalimantan", share: 6.1, note: "16,6 jt jiwa di 5 provinsi" },
    { name: "Sulawesi", share: 7.3, note: "19,9 jt jiwa di 6 provinsi" },
    { name: "Bali & Nusa Tenggara", share: 5.3, note: "14,5 jt jiwa di 3 provinsi" },
    { name: "Maluku & Papua", share: 3.7, note: "10,1 jt jiwa di 8 provinsi" },
  ].map((r) => `<li>${r.name}${meterBar(r.share)}<strong>${r.share.toLocaleString("id-ID")}%</strong><span class="meter-note">${r.note}</span></li>`).join("");

  return `
  <section class="page-head">
    <h1>Penduduk</h1>
    <p class="lede">Jumlah, sebaran, dan struktur umur penduduk Indonesia — negara keempat terpadat di dunia.</p>
    <div class="hero-tools">${yearPicker("year-pend", year, "Tahun data:")}</div>
  </section>

  <section class="stat-strip" aria-label="Angka penduduk tahun terpilih">
    <div class="stat"><span class="stat-label">Penduduk ${year}</span><strong>${pop.toLocaleString("id-ID")} jt</strong><span>Pertengahan tahun — BPS</span></div>
    <div class="stat"><span class="stat-label">Tumbuh ${year}</span><strong>${growthPct}%</strong><span>dari tahun sebelumnya</span></div>
    <div class="stat"><span class="stat-label">Kepadatan 2024</span><strong>~145 /km&sup2;</strong><span>Daratan 1,9 jt km&sup2;</span></div>
    <div class="stat"><span class="stat-label">Pulau berpenghuni</span><strong>~6.000</strong><span>dari 17.000+ pulau</span></div>
    <div class="stat"><span class="stat-label">Penduduk kota 2024</span><strong>~58%</strong><span>Perkiraan BPS</span></div>
    <div class="stat"><span class="stat-label">Rasio ketergantungan</span><strong>~44</strong><span>per 100 usia kerja</span></div>
  </section>

  <section class="grid-2">
    <article class="card">
      <h2>Jumlah penduduk 2015–2024</h2>
      <p class="card-sub">Juta jiwa, pertengahan tahun</p>
      ${lineChart({ years: YEARS, values: POPULATION, highlightYear: year, decimals: 1 })}
      ${sourceTag("BPS, 2024. Pertumbuhan penduduk melambat: sekitar 1,0% per tahun pada 2024.")}
    </article>
    <article class="card">
      <h2>Struktur umur 2024</h2>
      <p class="card-sub">Persen penduduk menurut kelompok umur</p>
      <ul class="meter-list">${ageRows}</ul>
      ${sourceTag("BPS, 2024 (perkiraan). Sekitar 69% penduduk berada pada usia kerja 15–64 tahun — bonus demografi.")}
    </article>
  </section>

  <section class="card">
    <h2>Di mana penduduk tinggal? (2024)</h2>
    <p class="card-sub">Pangsa penduduk menurut kepulauan — sekitar</p>
    <ul class="meter-list">${islandRows}</ul>
    ${sourceTag("BPS, 2024 (perkiraan). Lebih dari separuh penduduk tinggal di Pulau Jawa, yang luasnya hanya sekitar 7% daratan Indonesia.")}
    <p class="note">Provinsi terpadat: Jawa Barat (50,4 jt), Jawa Timur (41,8 jt), Jawa Tengah (37,9 jt).
    Provinsi paling jarang: Kalimantan Utara (0,7 jt) dan Papua Selatan (0,6 jt).
    <a href="#/provinsi">Lihat tabel 38 provinsi &rarr;</a></p>
  </section>`;
}

// ---------- Sosial: kesehatan & pendidikan ----------
export function renderSocial(year) {
  const pov = valueInYear(POVERTY, year);
  const hdi = valueInYear(HDI, year);
  const gini = valueInYear(GINI, year);
  const povChange = changeInPoints(POVERTY, year);
  const hdiChange = changeInPoints(HDI, year);

  return `
  <section class="page-head">
    <h1>Kesehatan &amp; Pendidikan</h1>
    <p class="lede">Kemiskinan, pembangunan manusia, dan ketimpangan — ukuran kesejahteraan di luar PDB.</p>
    <div class="hero-tools">${yearPicker("year-sos", year, "Tahun data:")}</div>
  </section>

  <section class="stat-strip" aria-label="Angka sosial tahun terpilih">
    <div class="stat"><span class="stat-label">Penduduk miskin ${year}</span><strong>${pov.toLocaleString("id-ID")}%</strong><span>September — BPS${povChange === null ? "" : ` (${povChange > 0 ? "+" : ""}${povChange.toLocaleString("id-ID")} poin)`}</span></div>
    <div class="stat"><span class="stat-label">IPM ${year}</span><strong>${hdi.toLocaleString("id-ID")}</strong><span>Kategori tinggi — BPS${hdiChange === null ? "" : ` (${hdiChange > 0 ? "+" : ""}${hdiChange.toLocaleString("id-ID")} poin)`}</span></div>
    <div class="stat"><span class="stat-label">Rasio Gini ${year}</span><strong>${gini.toLocaleString("id-ID")}</strong><span>September — BPS</span></div>
    <div class="stat"><span class="stat-label">Harapan hidup 2024</span><strong>74,2 thn</strong><span>Sekitar — BPS</span></div>
    <div class="stat"><span class="stat-label">Harapan lama sekolah 2024</span><strong>13,21 thn</strong><span>BPS</span></div>
    <div class="stat"><span class="stat-label">Rata-rata lama sekolah 2024</span><strong>8,85 thn</strong><span>BPS</span></div>
  </section>

  <section class="grid-2">
    <article class="card">
      <h2>Kemiskinan 2015–2024</h2>
      <p class="card-sub">Persen penduduk, September tiap tahun</p>
      ${lineChart({ years: YEARS, values: POVERTY, highlightYear: year, decimals: 2 })}
      ${sourceTag("BPS, 2024. September 2024: 8,57% atau 24,06 juta jiwa — terendah sejak data kemiskinan pertama dirilis 1960. Kota 6,66%, desa 11,34%.")}
    </article>
    <article class="card">
      <h2>IPM 2015–2024</h2>
      <p class="card-sub">Indeks Pembangunan Manusia (0–100)</p>
      ${lineChart({ years: YEARS, values: HDI, highlightYear: year, decimals: 2 })}
      ${sourceTag("BPS, 2024. IPM naik 0,63 poin pada 2024 menjadi 75,02 — naik setiap tahun sejak 2015 kecuali stagnasi 2020.")}
    </article>
  </section>

  <section class="grid-2">
    <article class="card">
      <h2>Apa itu IPM?</h2>
      <p>IPM mengukur tiga dimensi: kesehatan (angka harapan hidup), pendidikan
      (harapan dan rata-rata lama sekolah), dan standar hidup layak (pengeluaran
      per kapita yang disesuaikan). Pada 2024, angka harapan hidup Indonesia
      sekitar 74,2 tahun, harapan lama sekolah 13,21 tahun, dan rata-rata lama
      sekolah 8,85 tahun.</p>
      <p>Provinsi dengan IPM tertinggi: DKI Jakarta (83,0 — sangat tinggi),
      DI Yogyakarta (80,5), dan Kalimantan Timur (78,0). Terendah: Papua
      Pegunungan (60,8) dan Papua Tengah (61,5). Kesenjangan antarprovinsi
      inilah pekerjaan rumah terbesar pembangunan manusia Indonesia.</p>
      ${sourceTag("BPS, Publikasi IPM 2024.")}
    </article>
    <article class="card">
      <h2>Ketimpangan: rasio Gini</h2>
      <p class="card-sub">0 = merata sempurna, 1 = timpang sempurna</p>
      ${lineChart({ years: YEARS, values: GINI, highlightYear: year, decimals: 3 })}
      ${sourceTag("BPS, 2024 (dibulatkan). Gini bertahan di kisaran 0,38 sejak 2019 — ketimpangan menurun perlahan dari 0,40 pada 2015.")}
      <p class="note">Garis kemiskinan September 2024: Rp595.242 per kapita per bulan
      (makanan Rp443.433, 74,5%). Rata-rata rumah tangga miskin beranggotakan 4,71 orang.</p>
    </article>
  </section>`;
}

// ---------- Provinsi ----------
export function renderProvinces(state) {
  const { query, sortKey, sortDir, selected } = state;
  const q = query.trim().toLowerCase();
  let list = PROVINCES.filter((p) => !q || p.name.toLowerCase().includes(q) || p.capital.toLowerCase().includes(q) || p.island.toLowerCase().includes(q));
  list = sortProvinces(list, sortKey, sortDir);
  const rows = list.map((p) => `<tr data-province="${p.name}" tabindex="0">
    <td>${p.name}</td><td>${p.capital}</td><td>${p.island}</td>
    <td class="num">${p.population.toLocaleString("id-ID")}</td>
    <td class="num">${p.poverty.toLocaleString("id-ID")}%</td>
    <td class="num">${p.hdi.toLocaleString("id-ID")}</td>
    <td class="num">${density(p).toLocaleString("id-ID")}</td></tr>`).join("");
  const sel = selected ? PROVINCES.find((p) => p.name === selected) : null;
  const detail = sel ? `
    <article class="card detail" id="province-detail">
      <h2>${sel.name}</h2>
      <p class="card-sub">Ibu kota: ${sel.capital} &middot; Kepulauan: ${sel.island} &middot; Luas: ${sel.area.toLocaleString("id-ID")} km&sup2;</p>
      <div class="stat-strip">
        <div class="stat"><span class="stat-label">Penduduk 2024</span><strong>${sel.population.toLocaleString("id-ID")} jt</strong><span>BPS</span></div>
        <div class="stat"><span class="stat-label">Kepadatan</span><strong>${density(sel).toLocaleString("id-ID")} /km&sup2;</strong><span>Dihitung dari luas</span></div>
        <div class="stat"><span class="stat-label">Penduduk miskin</span><strong>${sel.poverty.toLocaleString("id-ID")}%</strong><span>~${poorPeople(sel).toLocaleString("id-ID")} jt jiwa, Sep 2024</span></div>
        <div class="stat"><span class="stat-label">IPM 2024</span><strong>${sel.hdi.toLocaleString("id-ID")}</strong><span>Kategori ${hdiCategory(sel.hdi)} — BPS</span></div>
      </div>
      <p>${sel.name} menempati peringkat penduduk ke-${sortProvinces(PROVINCES, "population", "desc").findIndex((p) => p.name === sel.name) + 1} dari 38 provinsi
      dan peringkat IPM ke-${sortProvinces(PROVINCES, "hdi", "desc").findIndex((p) => p.name === sel.name) + 1}.
      ${sel.poverty > 11 ? "Tingkat kemiskinannya di atas rata-rata nasional (8,57%)." : "Tingkat kemiskinannya di bawah rata-rata nasional (8,57%)."}</p>
      <p><button class="btn" id="close-detail" type="button">Tutup detail</button></p>
    </article>` : `<p class="hint">Klik sebuah baris untuk melihat detail provinsi.</p>`;

  return `
  <section class="page-head">
    <h1>38 Provinsi</h1>
    <p class="lede">Bandingkan penduduk, kemiskinan, dan IPM di seluruh provinsi. Klik baris mana pun untuk detailnya.</p>
  </section>

  <section class="card">
    <div class="table-tools">
      <label class="search-box">Cari provinsi, ibu kota, atau kepulauan:
        <input id="province-search" type="search" value="${query.replace(/"/g, "&quot;")}" placeholder="mis. Jawa Barat, Medan, Papua" autocomplete="off">
      </label>
      <label class="sort-box">Urutkan:
        <select id="province-sort">
          <option value="population-desc"${sortKey === "population" && sortDir === "desc" ? " selected" : ""}>Penduduk terbanyak</option>
          <option value="population-asc"${sortKey === "population" && sortDir === "asc" ? " selected" : ""}>Penduduk tersedikit</option>
          <option value="poverty-desc"${sortKey === "poverty" && sortDir === "desc" ? " selected" : ""}>Kemiskinan tertinggi</option>
          <option value="poverty-asc"${sortKey === "poverty" && sortDir === "asc" ? " selected" : ""}>Kemiskinan terendah</option>
          <option value="hdi-desc"${sortKey === "hdi" && sortDir === "desc" ? " selected" : ""}>IPM tertinggi</option>
          <option value="hdi-asc"${sortKey === "hdi" && sortDir === "asc" ? " selected" : ""}>IPM terendah</option>
          <option value="name-asc"${sortKey === "name" ? " selected" : ""}>Nama A–Z</option>
        </select>
      </label>
      <button class="btn" id="download-csv" type="button">Unduh CSV (38 provinsi)</button>
    </div>
    <p class="result-count" id="result-count">${list.length} dari 38 provinsi ditampilkan.</p>
    <div class="table-scroll">
    <table class="table provinces" id="province-table">
      <thead><tr><th>Provinsi</th><th>Ibu kota</th><th>Kepulauan</th><th class="num">Penduduk (jt)</th><th class="num">Miskin (%)</th><th class="num">IPM</th><th class="num">Kepadatan (/km&sup2;)</th></tr></thead>
      <tbody>${rows || `<tr><td colspan="7">Tidak ada provinsi yang cocok dengan “${query.replace(/</g, "&lt;")}”. Coba kata kunci lain.</td></tr>`}</tbody>
    </table>
    </div>
    ${sourceTag("BPS, 2024. Penduduk pertengahan tahun; kemiskinan September 2024; IPM 2024. Angka provinsi dibulatkan — lihat Sumber & Metodologi.")}
  </section>
  ${detail}`;
}

// ---------- Sumber & metodologi ----------
export function renderSources() {
  const rows = [
    ["Penduduk 2024 (281,6 jt)", "BPS — Proyeksi Penduduk / publikasi Statistik Indonesia 2025", "2024"],
    ["PDB & pertumbuhan (5,03%)", "BPS — Berita Resmi Statistik, 5 Feb 2025", "2024"],
    ["PDB per kapita (US$4.960)", "Bank Dunia, World Development Indicators", "2024"],
    ["Inflasi (1,57%)", "BPS — Berita Resmi Statistik IHK, Des 2024", "2024"],
    ["Kemiskinan (8,57%)", "BPS — Profil Kemiskinan Indonesia, Sep 2024", "Sep 2024"],
    ["Pengangguran (4,91%)", "BPS — Keadaan Ketenagakerjaan, Agu 2024", "Agu 2024"],
    ["IPM (75,02)", "BPS — Indeks Pembangunan Manusia 2024", "2024"],
    ["Ekspor & impor", "BPS — Perkembangan Ekspor dan Impor", "2024"],
    ["Angka per provinsi", "BPS — publikasi provinsi 2024 (dibulatkan ke 1 desimal)", "2024"],
  ].map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("");

  return `
  <section class="page-head">
    <h1>Sumber &amp; Metodologi</h1>
    <p class="lede">Dari mana setiap angka berasal, apa artinya, dan apa yang kami bulatkan.</p>
  </section>

  <section class="card">
    <h2>Daftar sumber</h2>
    <div class="table-scroll">
    <table class="table"><thead><tr><th>Angka</th><th>Sumber</th><th>Tahun</th></tr></thead><tbody>${rows}</tbody></table>
    </div>
    <p>Situs ini <strong>bukan</strong> situs resmi BPS dan tidak berafiliasi dengan BPS atau
    Bank Dunia. Situs ini merangkum angka-angka publikasi mereka untuk dibaca cepat.
    Untuk angka resmi terbaru, kunjungi <strong>bps.go.id</strong> dan
    <strong>data.worldbank.org</strong>.</p>
  </section>

  <section class="grid-2">
    <article class="card">
      <h2>Definisi singkat</h2>
      <dl class="defs">
        <dt>PDB</dt><dd>Nilai seluruh barang dan jasa yang dihasilkan di Indonesia dalam setahun.</dd>
        <dt>Pertumbuhan ekonomi</dt><dd>Perubahan PDB harga konstan dibanding tahun sebelumnya (y-on-y).</dd>
        <dt>Inflasi</dt><dd>Perubahan Indeks Harga Konsumen (IHK) dibanding periode yang sama tahun lalu.</dd>
        <dt>Tingkat kemiskinan</dt><dd>Persen penduduk dengan pengeluaran per kapita di bawah garis kemiskinan BPS (Rp595.242/kapita/bulan, Sep 2024).</dd>
        <dt>TPT</dt><dd>Tingkat Pengangguran Terbuka: persen angkatan kerja yang tidak bekerja dan mencari pekerjaan.</dd>
        <dt>IPM</dt><dd>Indeks Pembangunan Manusia (0–100) dari harapan hidup, pendidikan, dan pengeluaran per kapita.</dd>
        <dt>Rasio Gini</dt><dd>Ukuran ketimpangan pengeluaran: 0 berarti merata sempurna, 1 berarti timpang sempurna.</dd>
      </dl>
    </article>
    <article class="card">
      <h2>Apa yang dibulatkan?</h2>
      <p>Angka nasional memakai nilai rilis BPS persisnya (mis. penduduk 281,6 juta;
      kemiskinan 8,57%; IPM 75,02). Angka <strong>per provinsi</strong> dibulatkan ke
      satu desimal dari publikasi BPS provinsi 2024, dan pangsa menurut kepulauan
      serta tujuan ekspor diberi label “sekitar” karena memakai pembulatan.</p>
      <p>Deret tahunan 2015–2024 memakai rilis September untuk kemiskinan dan Gini,
      Agustus untuk pengangguran, dan Desember (y-on-y) untuk inflasi — sesuai
      jadwal rilis BPS.</p>
      <h2>Cara memakai situs ini</h2>
      <p>Pilih tahun di beranda, Ekonomi, Penduduk, atau Sosial untuk menyorot tahun
      itu pada grafik dan kartu angka. Di halaman Provinsi, cari dan urutkan tabel,
      klik baris untuk detail, atau unduh seluruh tabel sebagai CSV — semua diproses
      di peramban Anda, tanpa mengirim data ke mana pun.</p>
    </article>
  </section>`;
}
