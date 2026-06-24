const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

function decodeGlyph(hex) {
  const code = parseInt(hex, 16);
  if (Number.isNaN(code)) return "";
  if (code === 0x0194) return "-";
  if (code === 0x0003) return " ";
  if (code === 0x0070) return "e";
  if (code === 0x0071) return "e";
  if (code === 0x006b) return "a";
  if (code === 0x000a) return "'";
  if (code < 0x0100) {
    const shifted = code + 0x1d;
    if (shifted >= 32 && shifted <= 126) return String.fromCharCode(shifted);
  }
  return "";
}

function extractStreams(buffer) {
  const source = buffer.toString("latin1");
  const streams = [];
  const re = /<<(?:.|\n|\r)*?\/FlateDecode(?:.|\n|\r)*?>>\s*stream\r?\n/g;
  let match;
  while ((match = re.exec(source))) {
    const start = match.index + match[0].length;
    const end = source.indexOf("endstream", start);
    if (end < 0) continue;
    const chunk = buffer.slice(start, end);
    try {
      streams.push(zlib.inflateSync(chunk).toString("latin1"));
    } catch {
      try {
        streams.push(zlib.inflateRawSync(chunk).toString("latin1"));
      } catch {
        // Ignore non-text streams.
      }
    }
  }
  return streams;
}

function extractText(pdfPath) {
  const buffer = fs.readFileSync(pdfPath);
  const streams = extractStreams(buffer);
  const lines = [];
  let current = "";

  for (const stream of streams) {
    const tokens = stream.match(/<([0-9A-Fa-f]{4})>\s*Tj|(-?\d+(?:\.\d+)?)\s+0\s+Td/g) || [];
    for (const token of tokens) {
      const glyph = token.match(/<([0-9A-Fa-f]{4})>\s*Tj/);
      if (glyph) {
        current += decodeGlyph(glyph[1]);
        continue;
      }
      const move = token.match(/(-?\d+(?:\.\d+)?)\s+0\s+Td/);
      if (move && Number(move[1]) > 18 && current && !current.endsWith(" ")) {
        current += " ";
      }
    }
    if (current.trim()) {
      lines.push(current.replace(/\s+/g, " ").trim());
      current = "";
    }
  }

  return lines
    .join("\n")
    .replace(/ +/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function main() {
  const [pdfPath, outputPath] = process.argv.slice(2);
  if (!pdfPath || !outputPath) {
    console.error("Usage: node extract_shifted_pdf_text.js input.pdf output.txt");
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, extractText(pdfPath), "utf8");
  console.log(`Extracted: ${outputPath}`);
}

main();
