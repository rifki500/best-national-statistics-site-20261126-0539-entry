// charts.js — Grafik SVG yang digambar tangan, tanpa pustaka grafik.
//
// Setiap fungsi menerima data deret dan mengembalikan string SVG yang
// mandiri (sumbu, garis, titik, label nilai). Warna mengikuti palet situs:
// teal gelap untuk garis utama, amber untuk sorotan tahun terpilih.

const TEAL = "#0f4c4a";
const TEAL_LIGHT = "#2a7f7a";
const AMBER = "#e8a33d";
const GRID = "#e3ddd0";
const INK = "#22312f";
const MUTED = "#6b7a77";

function fmt(value, decimals = 1) {
  return value.toLocaleString("id-ID", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function niceTicks(min, max, count = 4) {
  const span = max - min || 1;
  const step = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(step)));
  const norm = step / mag;
  const nice = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10;
  const realStep = nice * mag;
  const start = Math.floor(min / realStep) * realStep;
  const ticks = [];
  for (let v = start; v <= max + realStep * 0.001; v += realStep) ticks.push(+v.toFixed(2));
  return ticks;
}

// Grafik garis untuk satu deret tahunan. highlightYear menandai satu titik.
export function lineChart({ years, values, unit = "", highlightYear = null, height = 220, decimals = 1 }) {
  const W = 640, H = height, PL = 52, PR = 14, PT = 14, PB = 30;
  const min = Math.min(...values), max = Math.max(...values);
  const pad = (max - min) * 0.15 || 1;
  const lo = Math.floor(min - pad), hi = Math.ceil(max + pad);
  const x = (i) => PL + (i * (W - PL - PR)) / (years.length - 1);
  const y = (v) => PT + ((hi - v) * (H - PT - PB)) / (hi - lo);
  const ticks = niceTicks(lo, hi);
  let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik garis ${years[0]} sampai ${years[years.length - 1]}" preserveAspectRatio="xMidYMid meet">`;
  for (const t of ticks) {
    svg += `<line x1="${PL}" y1="${y(t)}" x2="${W - PR}" y2="${y(t)}" stroke="${GRID}" stroke-width="1"/>`;
    svg += `<text x="${PL - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="${MUTED}">${fmt(t, decimals)}${unit}</text>`;
  }
  const points = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  svg += `<polyline points="${points}" fill="none" stroke="${TEAL}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
  values.forEach((v, i) => {
    const hot = highlightYear !== null && years[i] === highlightYear;
    svg += `<circle cx="${x(i)}" cy="${y(v)}" r="${hot ? 6 : 3.5}" fill="${hot ? AMBER : "#fff"}" stroke="${hot ? AMBER : TEAL}" stroke-width="2"/>`;
    if (hot) {
      svg += `<text x="${x(i)}" y="${y(v) - 14}" text-anchor="middle" font-size="12" font-weight="700" fill="${INK}">${fmt(v, decimals)}${unit}</text>`;
    }
    if (i % 2 === 0 || i === values.length - 1) {
      svg += `<text x="${x(i)}" y="${H - 8}" text-anchor="middle" font-size="11" fill="${MUTED}">${years[i]}</text>`;
    }
  });
  return svg + "</svg>";
}

// Grafik batang untuk satu deret tahunan (mis. ekspor vs impor: dua deret).
export function barChart({ years, series, unit = "", height = 220, decimals = 0 }) {
  const W = 640, H = height, PL = 52, PR = 14, PT = 18, PB = 30;
  const all = series.flatMap((s) => s.values);
  const max = Math.max(...all);
  const hi = Math.ceil(max * 1.1);
  const groupW = (W - PL - PR) / years.length;
  const barW = Math.min(26, (groupW - 10) / series.length);
  const y = (v) => PT + ((hi - v) * (H - PT - PB)) / hi;
  const ticks = niceTicks(0, hi);
  let svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik batang ${years[0]} sampai ${years[years.length - 1]}" preserveAspectRatio="xMidYMid meet">`;
  for (const t of ticks) {
    svg += `<line x1="${PL}" y1="${y(t)}" x2="${W - PR}" y2="${y(t)}" stroke="${GRID}" stroke-width="1"/>`;
    svg += `<text x="${PL - 8}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="${MUTED}">${fmt(t, decimals)}${unit}</text>`;
  }
  years.forEach((yr, i) => {
    const gx = PL + i * groupW;
    series.forEach((s, j) => {
      const bx = gx + (groupW - series.length * barW) / 2 + j * barW;
      svg += `<rect x="${bx.toFixed(1)}" y="${y(s.values[i]).toFixed(1)}" width="${barW - 2}" height="${(H - PB - y(s.values[i])).toFixed(1)}" rx="3" fill="${s.color}"><title>${s.label} ${yr}: ${fmt(s.values[i], decimals)}${unit}</title></rect>`;
    });
    svg += `<text x="${gx + groupW / 2}" y="${H - 8}" text-anchor="middle" font-size="11" fill="${MUTED}">${yr}</text>`;
  });
  return svg + "</svg>";
}

// Donat untuk komposisi (mis. struktur PDB). Label ditulis di samping.
export function donutChart({ items, size = 200 }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 14, inner = r - 26;
  const total = items.reduce((a, b) => a + b.value, 0);
  const colors = ["#0f4c4a", "#2a7f7a", "#e8a33d", "#c96f2e", "#7fae9d", "#d9c9a3", "#5b6b68"];
  let angle = -Math.PI / 2;
  let svg = `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Diagram donat komposisi" width="${size}" height="${size}">`;
  items.forEach((item, i) => {
    const frac = item.value / total;
    const a0 = angle, a1 = angle + frac * Math.PI * 2;
    angle = a1;
    const large = frac > 0.5 ? 1 : 0;
    const x0 = cx + r * Math.cos(a0), y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const xi1 = cx + inner * Math.cos(a1), yi1 = cy + inner * Math.sin(a1);
    const xi0 = cx + inner * Math.cos(a0), yi0 = cy + inner * Math.sin(a0);
    svg += `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" fill="${colors[i % colors.length]}"><title>${item.name}: ${fmt(item.value)}%</title></path>`;
  });
  svg += `<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="15" font-weight="700" fill="${INK}">100%</text>`;
  svg += `<text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="11" fill="${MUTED}">dari PDB 2024</text>`;
  return svg + "</svg>";
}

// Bilah horizontal sederhana untuk satu nilai terhadap skala 0–100.
export function meterBar(value, max = 100, color = TEAL) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return `<span class="meter" role="img" aria-label="${fmt(value)} persen"><span class="meter-fill" style="width:${pct.toFixed(1)}%;background:${color}"></span></span>`;
}
