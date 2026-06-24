const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(__dirname, "pdf");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "fondation_01_le_multivers.pdf");

const SOURCES = [
  "06_CHAPTERS/FONDATION_01_PREFACE_RESUME_TABLE_DES_MATIERES.md",
  "06_CHAPTERS/FONDATION_01_LIVRE_01_LE_MULTIVERS_INFINI.md",
  "06_CHAPTERS/FONDATION_01_LIVRE_02_LA_CARTOGRAPHIE_DES_REALITES.md",
  "06_CHAPTERS/FONDATION_01_LIVRE_03_LES_BRANCHES_DE_L_EXISTENCE.md",
  "06_CHAPTERS/FONDATION_01_LIVRE_04_POURQUOI_TOUT_EXISTE_QUELQUE_PART.md",
  "06_CHAPTERS/FONDATION_01_LIVRE_05_LES_LIMITES_DU_POSSIBLE.md",
];

const PAGE = { width: 595.28, height: 841.89 };
const MARGIN = { left: 64, right: 58, top: 72, bottom: 66 };
const TEXT_WIDTH = PAGE.width - MARGIN.left - MARGIN.right;
const COLORS = {
  ink: "0.10 0.10 0.10",
  muted: "0.38 0.38 0.38",
  pale: "0.72 0.72 0.72",
  rule: "0.82 0.82 0.82",
};

function sanitize(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");
}

function readMarkdown() {
  return SOURCES.map((rel) => ({
    source: rel,
    text: sanitize(fs.readFileSync(path.join(ROOT, rel), "utf8")),
  }));
}

function parseBlocks(files) {
  const blocks = [];
  for (const file of files) {
    const lines = file.text.split(/\r?\n/);
    let listItems = [];

    const flushList = () => {
      if (listItems.length) {
        blocks.push({ type: "list", items: listItems, source: file.source });
        listItems = [];
      }
    };

    for (const raw of lines) {
      const line = raw.trim();
      if (!line) {
        flushList();
        continue;
      }

      if (line.startsWith("- ")) {
        listItems.push(line.slice(2).trim());
        continue;
      }

      flushList();
      if (line.startsWith("# ")) {
        blocks.push({ type: "h1", text: line.slice(2).trim(), source: file.source });
      } else if (line.startsWith("## ")) {
        blocks.push({ type: "h2", text: line.slice(3).trim(), source: file.source });
      } else {
        blocks.push({ type: "p", text: line, source: file.source });
      }
    }
    flushList();
  }
  return blocks;
}

function textWidth(text, size) {
  return text.length * size * 0.49;
}

function wrapText(text, size, width, indent = 0) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  const maxWidth = width - indent;

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (textWidth(candidate, size) <= maxWidth || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function newPage(kind = "body") {
  return { kind, ops: [] };
}

function addText(page, text, x, y, size, font = "F1", color = COLORS.ink) {
  const escaped = text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
  page.ops.push(`BT /${font} ${size} Tf ${color} rg ${x.toFixed(2)} ${y.toFixed(2)} Td (${escaped}) Tj ET`);
}

function addLine(page, x1, y1, x2, y2, color = COLORS.rule, width = 0.6) {
  page.ops.push(`${color} RG ${width} w ${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l S`);
}

function addCentered(page, text, y, size, font = "F1", color = COLORS.ink) {
  addText(page, text, (PAGE.width - textWidth(text, size)) / 2, y, size, font, color);
}

function ensureSpace(state, amount) {
  if (state.y - amount < MARGIN.bottom) {
    finishBodyPage(state);
    state.pages.push(newPage("body"));
    state.y = PAGE.height - MARGIN.top;
  }
}

function finishBodyPage(state) {
  const page = state.pages[state.pages.length - 1];
  if (!page || page._finished || page.kind !== "body") return;
  const pageNumber = state.pages.length;
  addLine(page, MARGIN.left, 44, PAGE.width - MARGIN.right, 44, COLORS.rule, 0.45);
  addText(page, "Bibliotheque de la Resonance Multiversielle - Fondation 1", MARGIN.left, 28, 8.5, "F1", COLORS.muted);
  addText(page, String(pageNumber), PAGE.width - MARGIN.right - 18, 28, 8.5, "F1", COLORS.muted);
  page._finished = true;
}

function layoutBody(blocks, startPages = []) {
  const state = { pages: [...startPages, newPage("body")], y: PAGE.height - MARGIN.top, toc: [] };

  for (const block of blocks) {
    if (block.type === "h1") {
      if (state.y < PAGE.height - MARGIN.top - 20) {
        finishBodyPage(state);
        state.pages.push(newPage("body"));
        state.y = PAGE.height - MARGIN.top;
      }
      state.toc.push({ level: 1, title: block.text, page: state.pages.length });
      addText(state.pages[state.pages.length - 1], block.text, MARGIN.left, state.y, 22, "F2");
      state.y -= 22;
      addLine(state.pages[state.pages.length - 1], MARGIN.left, state.y, PAGE.width - MARGIN.right, state.y, COLORS.pale, 0.8);
      state.y -= 26;
    } else if (block.type === "h2") {
      ensureSpace(state, 52);
      state.toc.push({ level: 2, title: block.text, page: state.pages.length });
      addText(state.pages[state.pages.length - 1], block.text, MARGIN.left, state.y, 15, "F2");
      state.y -= 18;
    } else if (block.type === "p") {
      const lines = wrapText(block.text, 10.7, TEXT_WIDTH);
      ensureSpace(state, lines.length * 14 + 8);
      for (const line of lines) {
        addText(state.pages[state.pages.length - 1], line, MARGIN.left, state.y, 10.7);
        state.y -= 14;
      }
      state.y -= 5;
    } else if (block.type === "list") {
      const lineHeight = 13.5;
      const wrappedItems = block.items.map((item) => wrapText(item, 10.4, TEXT_WIDTH, 18));
      const needed = wrappedItems.reduce((sum, lines) => sum + lines.length * lineHeight + 4, 0) + 4;
      ensureSpace(state, needed);
      for (const lines of wrappedItems) {
        addText(state.pages[state.pages.length - 1], "-", MARGIN.left + 8, state.y, 10.4);
        lines.forEach((line, index) => {
          addText(state.pages[state.pages.length - 1], line, MARGIN.left + 22, state.y - index * lineHeight, 10.4);
        });
        state.y -= lines.length * lineHeight + 4;
      }
      state.y -= 3;
    }
  }
  finishBodyPage(state);
  return state;
}

function makeTitlePages() {
  const page = newPage("title");
  addCentered(page, "Bibliotheque de la Resonance Multiversielle", 630, 21, "F2");
  addCentered(page, "Fondation 1", 590, 16, "F1", COLORS.muted);
  addCentered(page, "Le Multivers", 560, 30, "F2");
  addLine(page, 150, 520, PAGE.width - 150, 520, COLORS.pale, 1);
  addCentered(page, "L'Architecture des Possibles", 485, 14, "F1", COLORS.muted);
  addCentered(page, "Version ebook PDF - premiere passe", 445, 10.5, "F1", COLORS.muted);
  addCentered(page, "Preface, resume, table des matieres et cinq livres complets", 424, 10.5, "F1", COLORS.muted);
  addCentered(page, "2026-06-24", 105, 9.5, "F1", COLORS.muted);
  return [page];
}

function makeTocPages(toc) {
  const pages = [newPage("toc")];
  let y = PAGE.height - MARGIN.top;
  addText(pages[0], "Table des matieres", MARGIN.left, y, 22, "F2");
  y -= 24;
  addLine(pages[0], MARGIN.left, y, PAGE.width - MARGIN.right, y, COLORS.pale, 0.8);
  y -= 28;

  for (const item of toc) {
    if (item.level > 2) continue;
    const size = item.level === 1 ? 11.5 : 9.5;
    const font = item.level === 1 ? "F2" : "F1";
    const indent = item.level === 1 ? 0 : 18;
    const title = item.title.length > 72 ? `${item.title.slice(0, 69)}...` : item.title;
    if (y < MARGIN.bottom + 22) {
      const current = pages[pages.length - 1];
      addLine(current, MARGIN.left, 44, PAGE.width - MARGIN.right, 44, COLORS.rule, 0.45);
      addText(current, String(pages.length + 1), PAGE.width - MARGIN.right - 18, 28, 8.5, "F1", COLORS.muted);
      pages.push(newPage("toc"));
      y = PAGE.height - MARGIN.top;
    }
    addText(pages[pages.length - 1], title, MARGIN.left + indent, y, size, font);
    addText(pages[pages.length - 1], String(item.page), PAGE.width - MARGIN.right - 24, y, size, "F1", COLORS.muted);
    y -= item.level === 1 ? 18 : 14;
  }

  for (let index = 0; index < pages.length; index += 1) {
    const page = pages[index];
    if (!page._tocFooter) {
      addLine(page, MARGIN.left, 44, PAGE.width - MARGIN.right, 44, COLORS.rule, 0.45);
      addText(page, "Table des matieres", MARGIN.left, 28, 8.5, "F1", COLORS.muted);
      addText(page, String(index + 2), PAGE.width - MARGIN.right - 18, 28, 8.5, "F1", COLORS.muted);
      page._tocFooter = true;
    }
  }
  return pages;
}

function buildPages(blocks) {
  const titlePages = makeTitlePages();
  let body = layoutBody(blocks, titlePages);
  let tocPages = makeTocPages(body.toc);
  body = layoutBody(blocks, [...titlePages, ...tocPages]);
  tocPages = makeTocPages(body.toc);
  body = layoutBody(blocks, [...titlePages, ...tocPages]);
  return body.pages;
}

function pdfObject(content) {
  return `${content}\n`;
}

function buildPdf(pages) {
  const objects = [];
  objects.push(pdfObject("<< /Type /Catalog /Pages 2 0 R >>"));
  const kids = pages.map((_, index) => `${5 + index * 2} 0 R`).join(" ");
  objects.push(pdfObject(`<< /Type /Pages /Kids [${kids}] /Count ${pages.length} >>`));
  objects.push(pdfObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"));
  objects.push(pdfObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"));

  pages.forEach((page, index) => {
    const contentObject = 6 + index * 2;
    objects.push(pdfObject(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE.width} ${PAGE.height}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObject} 0 R >>`));
    const stream = page.ops.join("\n");
    objects.push(pdfObject(`<< /Length ${Buffer.byteLength(stream, "binary")} >>\nstream\n${stream}\nendstream`));
  });

  const chunks = ["%PDF-1.4\n%\xE2\xE3\xCF\xD3\n"];
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(chunks.join(""), "binary"));
    chunks.push(`${index + 1} 0 obj\n${object}endobj\n`);
  });
  const xrefOffset = Buffer.byteLength(chunks.join(""), "binary");
  chunks.push(`xref\n0 ${objects.length + 1}\n`);
  chunks.push("0000000000 65535 f \n");
  offsets.slice(1).forEach((offset) => {
    chunks.push(`${String(offset).padStart(10, "0")} 00000 n \n`);
  });
  chunks.push(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);
  return Buffer.from(chunks.join(""), "binary");
}

function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const files = readMarkdown();
  const blocks = parseBlocks(files);
  const pages = buildPages(blocks);
  fs.writeFileSync(OUTPUT_FILE, buildPdf(pages));
  console.log(`PDF written: ${OUTPUT_FILE}`);
  console.log(`Pages: ${pages.length}`);
}

main();
