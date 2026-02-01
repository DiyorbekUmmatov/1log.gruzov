import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const root = path.resolve(__dirname, "..");
const srcSvgPath = path.resolve(root, "src/assets/pwa-icon.svg");
const outDir = path.resolve(root, "public");

const outputs = [
  { file: "pwa-192.png", size: 192, radius: 36 },
  { file: "pwa-512.png", size: 512, radius: 96 },
  { file: "pwa-192-maskable.png", size: 192, radius: 0 },
  { file: "pwa-512-maskable.png", size: 512, radius: 0 },
  { file: "apple-touch-icon.png", size: 180, radius: 0 },
];

function wrapWithMaskablePadding(svg, size, padRatio = 0.1) {
  const pad = Math.round(size * padRatio);
  const inner = size - pad * 2;
  const openEnd = svg.indexOf(">");
  const closeStart = svg.lastIndexOf("</svg>");
  const body =
    openEnd !== -1 && closeStart !== -1 && closeStart > openEnd
      ? svg.slice(openEnd + 1, closeStart)
      : svg;
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1024 1024">
  <rect width="1024" height="1024" fill="#041E90"/>
  <g transform="translate(${(1024 - (1024 * inner) / size) / 2} ${(1024 - (1024 * inner) / size) / 2}) scale(${inner / size})">
    ${body}
  </g>
</svg>`;
}

function applyRoundedRectMask(pngBuffer, size, radius) {
  // Keep simple: for non-maskable icons we can leave square; iOS already rounds.
  // Radius left for future; currently unused to avoid pixel-level ops.
  return pngBuffer;
}

const svgRaw = await readFile(srcSvgPath, "utf8");

await mkdir(outDir, { recursive: true });

for (const o of outputs) {
  const isMaskable = o.file.includes("maskable");
  const svgToRender = isMaskable ? wrapWithMaskablePadding(svgRaw, o.size, 0.12) : svgRaw;

  const resvg = new Resvg(svgToRender, {
    fitTo: { mode: "width", value: o.size },
    background: "transparent",
  });

  const pngData = resvg.render().asPng();
  const finalPng = o.radius ? applyRoundedRectMask(pngData, o.size, o.radius) : pngData;
  const outPath = path.resolve(outDir, o.file);
  await writeFile(outPath, finalPng);
}

console.log("Generated PWA icons in", outDir);
