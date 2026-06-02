// node generate-icons.js
// Pure-Node PNG generator — no external dependencies required.

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const OUT_DIR = path.join(__dirname, 'icons');
fs.mkdirSync(OUT_DIR, { recursive: true });

// ─── Minimal PNG encoder ────────────────────────────────────────────────────

function crc32(buf) {
  const table = (() => {
    const t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[i] = c;
    }
    return t;
  })();
  let c = 0xffffffff;
  for (const b of buf) c = table[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([typeBytes, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePNG(width, height, rgba) {
  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 2;   // color type: RGB (we'll strip alpha, or use 6 for RGBA)
  ihdr[9] = 6;   // color type: RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;

  // Raw image data (filter byte 0 per scanline)
  const raw = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width * 4)] = 0; // filter type None
    for (let x = 0; x < width; x++) {
      const src = (y * width + x) * 4;
      const dst = y * (1 + width * 4) + 1 + x * 4;
      raw[dst] = rgba[src];
      raw[dst+1] = rgba[src+1];
      raw[dst+2] = rgba[src+2];
      raw[dst+3] = rgba[src+3];
    }
  }

  const compressed = zlib.deflateSync(raw, { level: 9 });

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

// ─── Drawing helpers ────────────────────────────────────────────────────────

function makePixels(size) {
  return new Uint8Array(size * size * 4); // all transparent
}

function setPixel(pixels, size, x, y, r, g, b, a = 255) {
  if (x < 0 || y < 0 || x >= size || y >= size) return;
  const i = (y * size + x) * 4;
  // Alpha-blend over existing pixel
  const srcA = a / 255;
  const dstA = pixels[i+3] / 255;
  const outA = srcA + dstA * (1 - srcA);
  if (outA > 0) {
    pixels[i]   = Math.round((r * srcA + pixels[i]   * dstA * (1 - srcA)) / outA);
    pixels[i+1] = Math.round((g * srcA + pixels[i+1] * dstA * (1 - srcA)) / outA);
    pixels[i+2] = Math.round((b * srcA + pixels[i+2] * dstA * (1 - srcA)) / outA);
    pixels[i+3] = Math.round(outA * 255);
  }
}

function fillRect(pixels, size, x0, y0, w, h, r, g, b, a = 255) {
  for (let y = Math.max(0,y0); y < Math.min(size, y0+h); y++)
    for (let x = Math.max(0,x0); x < Math.min(size, x0+w); x++)
      setPixel(pixels, size, x, y, r, g, b, a);
}

function fillRoundRect(pixels, size, x0, y0, w, h, radius, r, g, b, a = 255) {
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const rx = x - x0, ry = y - y0;
      if (rx < 0 || ry < 0 || rx >= w || ry >= h) continue;
      // Corner check
      let inCorner = false;
      const corners = [
        [radius, radius], [w - radius, radius],
        [radius, h - radius], [w - radius, h - radius]
      ];
      if (rx < radius && ry < radius) {
        const dx = rx - radius, dy = ry - radius;
        if (dx*dx + dy*dy > radius*radius) inCorner = true;
      } else if (rx >= w - radius && ry < radius) {
        const dx = rx - (w-radius), dy = ry - radius;
        if (dx*dx + dy*dy > radius*radius) inCorner = true;
      } else if (rx < radius && ry >= h - radius) {
        const dx = rx - radius, dy = ry - (h-radius);
        if (dx*dx + dy*dy > radius*radius) inCorner = true;
      } else if (rx >= w - radius && ry >= h - radius) {
        const dx = rx - (w-radius), dy = ry - (h-radius);
        if (dx*dx + dy*dy > radius*radius) inCorner = true;
      }
      if (!inCorner) setPixel(pixels, size, x, y, r, g, b, a);
    }
  }
}

function drawHouse(pixels, size, ox, oy, houseSize, r, g, b, a = 255) {
  // Simple house: triangle roof + rectangle body + door
  const cx = ox + houseSize / 2;
  const roofTop = oy;
  const wallTop = oy + houseSize * 0.4;
  const bottom = oy + houseSize;

  // Roof (triangle rasterize)
  for (let y = roofTop; y <= wallTop; y++) {
    const t = (y - roofTop) / (wallTop - roofTop);
    const halfW = (houseSize / 2 + houseSize * 0.08) * t;
    for (let x = Math.round(cx - halfW); x <= Math.round(cx + halfW); x++) {
      setPixel(pixels, size, x, y, r, g, b, a);
    }
  }

  // Wall
  fillRect(pixels, size, Math.round(cx - houseSize/2), wallTop,
    houseSize, bottom - wallTop, r, g, b, a);
}

// ─── Render icons ───────────────────────────────────────────────────────────

const SIZES = [16, 48, 128];

for (const sz of SIZES) {
  const pixels = makePixels(sz);
  const r = Math.round(sz * 0.2);

  // Background: #1a3a5c
  fillRoundRect(pixels, sz, 0, 0, sz, sz, r, 0x1a, 0x3a, 0x5c);

  // House: white, centered
  const pad = Math.round(sz * 0.15);
  drawHouse(pixels, sz, pad, Math.round(sz * 0.12), sz - pad * 2, 255, 255, 255, 230);

  // Door: navy
  const dw = Math.round(sz * 0.18);
  const dh = Math.round(sz * 0.22);
  const dx = Math.round(sz / 2 - dw / 2);
  const dy = Math.round(sz * 0.78 - dh);
  fillRect(pixels, sz, dx, dy, dw, dh, 0x1a, 0x3a, 0x5c);

  // "%" accent in sky-blue (#38bdf8) — only on larger sizes
  if (sz >= 48) {
    // Draw a small circle and slash to approximate %
    const acx = Math.round(sz * 0.78);
    const acy = Math.round(sz * 0.16);
    const cr = Math.round(sz * 0.055);
    for (let y = -cr; y <= cr; y++)
      for (let x = -cr; x <= cr; x++)
        if (x*x + y*y <= cr*cr)
          setPixel(pixels, sz, acx+x, acy+y, 0x38, 0xbd, 0xf8, 220);
  }

  const png = encodePNG(sz, sz, pixels);
  const outPath = path.join(OUT_DIR, `icon${sz}.png`);
  fs.writeFileSync(outPath, png);
  console.log(`✓ icons/icon${sz}.png`);
}
