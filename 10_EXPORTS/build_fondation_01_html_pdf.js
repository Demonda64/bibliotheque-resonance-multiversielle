const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(__dirname, "pdf");
const HTML_FILE = path.join(OUT_DIR, "fondation_01_le_multivers.html");
const PDF_FILE = path.join(OUT_DIR, "fondation_01_le_multivers_chrome.pdf");
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const SOURCES = [
  "06_CHAPTERS/FONDATION_01_PREFACE_RESUME_TABLE_DES_MATIERES.md",
  "06_CHAPTERS/FONDATION_01_LIVRE_01_LE_MULTIVERS_INFINI.md",
  "06_CHAPTERS/FONDATION_01_LIVRE_02_LA_CARTOGRAPHIE_DES_REALITES.md",
  "06_CHAPTERS/FONDATION_01_LIVRE_03_LES_BRANCHES_DE_L_EXISTENCE.md",
  "06_CHAPTERS/FONDATION_01_LIVRE_04_POURQUOI_TOUT_EXISTE_QUELQUE_PART.md",
  "06_CHAPTERS/FONDATION_01_LIVRE_05_LES_LIMITES_DU_POSSIBLE.md",
];

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function mdToHtml(markdown) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      closeList();
      continue;
    }
    if (line.startsWith("- ")) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${escapeHtml(line.slice(2))}</li>`);
      continue;
    }
    closeList();
    if (line.startsWith("# ")) {
      html.push(`<h1 id="${slugify(line.slice(2))}">${escapeHtml(line.slice(2))}</h1>`);
    } else if (line.startsWith("## ")) {
      html.push(`<h2 id="${slugify(line.slice(3))}">${escapeHtml(line.slice(3))}</h2>`);
    } else {
      html.push(`<p>${escapeHtml(line)}</p>`);
    }
  }
  closeList();
  return html.join("\n");
}

function buildHtml() {
  const body = SOURCES.map((source) => {
    const markdown = fs.readFileSync(path.join(ROOT, source), "utf8");
    return `<section class="source">${mdToHtml(markdown)}</section>`;
  }).join("\n");

  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>Fondation 1 - Le Multivers</title>
  <style>
    @page {
      size: A4;
      margin: 22mm 18mm 22mm 20mm;
    }
    * { box-sizing: border-box; }
    html { color: #171717; background: #fff; }
    body {
      margin: 0;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 11.4pt;
      line-height: 1.62;
      hyphens: none;
    }
    .cover {
      height: 240mm;
      display: flex;
      flex-direction: column;
      justify-content: center;
      text-align: center;
      page-break-after: always;
    }
    .cover .kicker {
      font-family: Arial, sans-serif;
      font-size: 10pt;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #666;
      margin-bottom: 12mm;
    }
    .cover h1 {
      font-size: 27pt;
      line-height: 1.12;
      margin: 0 0 10mm;
      page-break-before: auto;
    }
    .cover h2 {
      font-size: 18pt;
      color: #333;
      margin: 0 0 7mm;
      page-break-before: auto;
    }
    .cover .meta {
      font-family: Arial, sans-serif;
      font-size: 10pt;
      color: #666;
      margin-top: 14mm;
    }
    h1 {
      font-size: 23pt;
      line-height: 1.18;
      margin: 0 0 9mm;
      padding-top: 5mm;
      page-break-before: always;
      page-break-after: avoid;
    }
    h2 {
      font-size: 15.5pt;
      line-height: 1.25;
      margin: 9mm 0 4mm;
      page-break-after: avoid;
    }
    p {
      margin: 0 0 4.2mm;
      text-align: justify;
      orphans: 3;
      widows: 3;
    }
    ul {
      margin: 0 0 5mm 7mm;
      padding: 0;
    }
    li {
      margin: 0 0 1.8mm;
      padding-left: 1mm;
    }
    .source {
      page-break-before: auto;
    }
    .source:first-of-type h1 {
      page-break-before: auto;
    }
    .front-note {
      font-family: Arial, sans-serif;
      font-size: 9.5pt;
      color: #555;
      text-align: center;
    }
    @media screen {
      body {
        max-width: 820px;
        margin: 40px auto;
        padding: 0 40px 80px;
        box-shadow: 0 0 0 1px #ddd;
      }
      .cover { height: 900px; }
    }
  </style>
</head>
<body>
  <section class="cover">
    <div class="kicker">Bibliotheque de la Resonance Multiversielle</div>
    <h1>Fondation 1</h1>
    <h2>Le Multivers</h2>
    <p class="front-note">L'Architecture des Possibles</p>
    <p class="meta">Ebook PDF - premiere passe complete<br>Preface, resume, table des matieres et cinq livres</p>
  </section>
  ${body}
</body>
</html>`;
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(HTML_FILE, buildHtml(), "utf8");
  execFileSync(CHROME, [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--print-to-pdf-no-header",
    `--print-to-pdf=${PDF_FILE}`,
    `file:///${HTML_FILE.replace(/\\/g, "/")}`,
  ], { stdio: "inherit" });
  console.log(`HTML written: ${HTML_FILE}`);
  console.log(`PDF written: ${PDF_FILE}`);
}

main();
