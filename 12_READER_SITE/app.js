const manuscriptEl = document.querySelector("#manuscript");
const tocEl = document.querySelector("#toc");
const bookList = document.querySelector("#bookList");
const progressLabel = document.querySelector("#progressLabel");
const progressBar = document.querySelector("#progressBar");
const currentChapter = document.querySelector("#currentChapter");
const wordCount = document.querySelector("#wordCount");
const bookTitle = document.querySelector("#bookTitle");
const bookDescription = document.querySelector("#bookDescription");
const sourceLink = document.querySelector("#sourceLink");
const activeBookRail = document.querySelector("#activeBookRail");
const fontRange = document.querySelector("#fontRange");
const themeToggle = document.querySelector("#themeToggle");
const focusToggle = document.querySelector("#focusToggle");
const menuButton = document.querySelector("#menuButton");
const sidebar = document.querySelector("#sidebar");
const BUILD_VERSION = "20260623-f1-complete";

const books = [
  {
    id: "livre-1",
    label: "Livre 1",
    title: "Le Multivers Infini",
    sourcePath: "../06_CHAPTERS/FONDATION_01_LIVRE_01_LE_MULTIVERS_INFINI.md",
    description:
      "Une entree dans la theorie de la resonance multiversielle: le reel comme architecture des possibles, la branche comme trajectoire, et la conscience comme point d'ancrage.",
  },
  {
    id: "livre-2",
    label: "Livre 2",
    title: "La Cartographie des Realites",
    sourcePath: "../06_CHAPTERS/FONDATION_01_LIVRE_02_LA_CARTOGRAPHIE_DES_REALITES.md",
    description:
      "Une methode pour classer les branches, reconnaitre leurs distances, distinguer les realites proches, divergentes, instables, oniriques et temporelles.",
  },
  {
    id: "livre-3",
    label: "Livre 3",
    title: "Les Branches de l'Existence",
    sourcePath: "../06_CHAPTERS/FONDATION_01_LIVRE_03_LES_BRANCHES_DE_L_EXISTENCE.md",
    description:
      "Une exploration de la naissance des branches: differences initiales, bifurcations, coherence interne, trajectoires personnelles et collectives.",
  },
  {
    id: "livre-4",
    label: "Livre 4",
    title: "Pourquoi Tout Existe Quelque Part",
    sourcePath: "../06_CHAPTERS/FONDATION_01_LIVRE_04_POURQUOI_TOUT_EXISTE_QUELQUE_PART.md",
    description:
      "L'argument central de la Fondation 1: pourquoi le possible coherent ne doit pas etre reduit a une simple fiction mentale.",
  },
  {
    id: "livre-5",
    label: "Livre 5",
    title: "Les Limites du Possible",
    sourcePath: "../06_CHAPTERS/FONDATION_01_LIVRE_05_LES_LIMITES_DU_POSSIBLE.md",
    description:
      "La conclusion de la Fondation 1: pourquoi l'infini du multivers n'est pas une permission du n'importe quoi.",
  },
];

let activeBook = books[0];

function versionedPath(path) {
  return `${path}?v=${encodeURIComponent(BUILD_VERSION)}`;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function renderMarkdown(markdown) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  let inList = false;

  for (const line of lines) {
    if (line.startsWith("- ")) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${escapeHtml(line.slice(2))}</li>`);
      continue;
    }

    if (inList) {
      html.push("</ul>");
      inList = false;
    }

    if (line.startsWith("# ")) {
      html.push(`<h1>${escapeHtml(line.slice(2))}</h1>`);
    } else if (line.startsWith("## ")) {
      const title = line.slice(3);
      const id = slugify(title);
      html.push(`<h2 id="${id}">${escapeHtml(title)}</h2>`);
    } else if (line.trim()) {
      html.push(`<p>${escapeHtml(line)}</p>`);
    }
  }

  if (inList) {
    html.push("</ul>");
  }

  return html.join("\n");
}

function buildToc() {
  const headings = [...manuscriptEl.querySelectorAll("h2")].filter((heading) =>
    heading.textContent.startsWith("Chapitre")
  );

  tocEl.innerHTML = headings
    .map((heading, index) => {
      const label = heading.textContent;
      return `<a href="#${heading.id}" data-index="${index}">${escapeHtml(label)}</a>`;
    })
    .join("");
}

function renderBookList() {
  bookList.innerHTML = books
    .map(
      (book) => `
        <button type="button" data-book="${book.id}" class="${book.id === activeBook.id ? "active" : ""}">
          <span>${escapeHtml(book.label)}</span>
          ${escapeHtml(book.title)}
        </button>
      `
    )
    .join("");
}

function updateProgress() {
  const scrollTop = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? Math.min(100, Math.max(0, Math.round((scrollTop / max) * 100))) : 0;
  progressLabel.textContent = `${progress}%`;
  progressBar.style.height = `${progress}%`;

  const chapters = [...manuscriptEl.querySelectorAll("h2")].filter((heading) =>
    heading.textContent.startsWith("Chapitre")
  );
  const active = [...chapters].reverse().find((heading) => heading.getBoundingClientRect().top < 180) || chapters[0];

  if (active) {
    currentChapter.textContent = active.textContent.replace(/^Chapitre\s+\d+\s+-\s+/, "");
    tocEl.querySelectorAll("a").forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === `#${active.id}`);
    });
  }
}

async function loadManuscript() {
  manuscriptEl.innerHTML = '<p class="loading">Chargement du manuscrit...</p>';
  bookTitle.textContent = activeBook.title;
  bookDescription.textContent = activeBook.description;
  sourceLink.href = versionedPath(activeBook.sourcePath);
  activeBookRail.textContent = activeBook.label;
  currentChapter.textContent = "Ouverture";
  renderBookList();

  try {
    const response = await fetch(versionedPath(activeBook.sourcePath), { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const markdown = await response.text();
    manuscriptEl.innerHTML = renderMarkdown(markdown);
    wordCount.textContent = markdown.trim().split(/\s+/).filter(Boolean).length.toLocaleString("fr-FR");
    buildToc();
    updateProgress();
  } catch (error) {
    manuscriptEl.innerHTML = `<p class="error">Impossible de charger le manuscrit depuis ${activeBook.sourcePath}. Lancez le lecteur avec le serveur local ou via GitHub Pages.</p>`;
  }
}

bookList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-book]");
  if (!button) return;

  activeBook = books.find((book) => book.id === button.dataset.book) || activeBook;
  history.replaceState(null, "", `#${activeBook.id}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
  loadManuscript();
});

fontRange.addEventListener("input", () => {
  document.documentElement.style.setProperty("--reader-size", `${fontRange.value}px`);
});

themeToggle.addEventListener("click", () => {
  document.documentElement.classList.toggle("dark");
  themeToggle.textContent = document.documentElement.classList.contains("dark") ? "Theme clair" : "Theme sombre";
});

focusToggle.addEventListener("click", () => {
  document.body.classList.toggle("focus");
  focusToggle.textContent = document.body.classList.contains("focus") ? "Quitter focus" : "Mode focus";
});

menuButton.addEventListener("click", () => {
  const isOpen = sidebar.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

tocEl.addEventListener("click", () => {
  sidebar.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
});

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);

const initialBook = books.find((book) => `#${book.id}` === window.location.hash);
if (initialBook) {
  activeBook = initialBook;
}

loadManuscript();
