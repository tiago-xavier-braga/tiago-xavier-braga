const COLS = 10;
const ROWS = 16;

const PALETTE = [
  [220, 195, 155],
  [200, 170, 120],
  [215, 185, 140],
  [235, 215, 180],
  [205, 178, 138],
  [190, 158, 108],
  [184, 92, 56],
  [74, 103, 65],
  [196, 144, 42],
];

function randomColor() {
  const rng = Math.random();
  if (rng > 0.93) return PALETTE[6];
  if (rng > 0.89) return PALETTE[7];
  if (rng > 0.85) return PALETTE[8];
  return PALETTE[Math.floor(Math.random() * 6)];
}

function buildPoints(W, H) {
  const pts = [];
  for (let r = 0; r <= ROWS; r++) {
    for (let c = 0; c <= COLS; c++) {
      const onEdge = r === 0 || r === ROWS || c === 0 || c === COLS;
      const jx = onEdge ? 0 : (Math.random() - 0.5) * (W / COLS) * 0.60;
      const jy = onEdge ? 0 : (Math.random() - 0.5) * (H / ROWS) * 0.60;
      pts.push([
        Math.max(0, Math.min(W, (c / COLS) * W + jx)),
        Math.max(0, Math.min(H, (r / ROWS) * H + jy)),
      ]);
    }
  }
  return pts;
}

function buildTriangles(pts) {
  const tris = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const tl = r * (COLS + 1) + c;
      const tr = tl + 1;
      const bl = tl + (COLS + 1);
      const br = bl + 1;
      tris.push([tl, tr, br], [tl, br, bl]);
    }
  }
  return tris;
}

function renderSVG(W, H, pts, tris) {
  const polygons = tris.map(([a, b, c]) => {
    const col = randomColor();
    const alpha = (0.10 + Math.random() * 0.10).toFixed(2);
    const sAlpha = (alpha * 0.4).toFixed(2);
    const [ax, ay] = pts[a];
    const [bx, by] = pts[b];
    const [cx, cy] = pts[c];
    return `<polygon points="${ax.toFixed(1)},${ay.toFixed(1)} ${bx.toFixed(1)},${by.toFixed(1)} ${cx.toFixed(1)},${cy.toFixed(1)}" fill="rgba(${col},${alpha})" stroke="rgba(${col},${sAlpha})" stroke-width="0.6"/>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" style="position:absolute;top:0;left:0;width:100%;height:${H}px" aria-hidden="true">${polygons.join('')}</svg>`;
}

export function buildBackground() {
  const el = document.getElementById('poly-bg');
  if (!el) return;
  const W = window.innerWidth;
  const H = Math.max(document.body.scrollHeight, window.innerHeight);
  const pts = buildPoints(W, H);
  const tris = buildTriangles(pts);
  el.innerHTML = renderSVG(W, H, pts, tris);
}
