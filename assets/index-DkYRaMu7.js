// src/main.js
// Module-based main JS. Expects index.html to include this as <script type="module" src="src/main.js"></script>

import { Client } from "@gradio/client";

// === Config ===
const SPACE_NAME = "Mostafa-XS1/Flower_Identifier"; // change if needed
const PREDICT_PATH = "/predict";
const WIKIMEDIA_TEMPLATE = (text) =>
  `https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Sunflower_sky_backdrop.jpg/250px-${encodeURIComponent(
    text
  )}.jpg`;

// Wait for DOM
document.addEventListener("DOMContentLoaded", () => {
  // === DOM ===
  const plantNameInput = document.getElementById("plantName");
  const identifyBtn = document.getElementById("identifyBtn");
  const clearResultBtn = document.getElementById("clearResultBtn");
  const fileInput = document.getElementById("fileInput");
  const dropZone = document.getElementById("dropZone");
  const resultDiv = document.getElementById("result");
  const fileStatus = document.getElementById("fileStatus");

  // === Helpers ===
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  function showHTML(html) {
    resultDiv.innerHTML = html;
  }
  function showSpinner(text = "Identifying…") {
    showHTML(
      `<div class="result-spinner">${escapeHtml(
        text
      )}</div><div class="result-wait">🔄 <em>Waiting for model...</em></div>`
    );
  }
  function errorHTML(msg) {
    showHTML(`<div class="result-error"><strong>Error:</strong> ${escapeHtml(msg)}</div>`);
  }

  // simple structured formatter (falls back if API returns objects/arrays)
  function formatApiStructured(data) {
    try {
      if (Array.isArray(data)) {
        if (data.length === 0) return "<div>No results</div>";
        const first = data[0];
        if (
          first &&
          typeof first === "object" &&
          ("label" in first || "name" in first || "class" in first)
        ) {
          const rows = data
            .map((item) => {
              const label = item.label ?? item.name ?? item.class ?? JSON.stringify(item);
              const score = item.score ?? item.probability ?? item.confidence ?? null;
              return `<li><strong>${escapeHtml(label)}</strong>${
                score != null ? ` — ${(score * 100).toFixed(1)}%` : ""
              }</li>`;
            })
            .join("");
          return `<ul style="padding-left:18px">${rows}</ul>`;
        } else {
          const rows = data.map((d) => `<li>${escapeHtml(String(d))}</li>`).join("");
          return `<ol style="padding-left:18px">${rows}</ol>`;
        }
      } else if (typeof data === "object" && data !== null) {
        if ("label" in data || "score" in data) {
          const label = data.label ?? data.name ?? JSON.stringify(data);
          const score = data.score ?? data.probability ?? data.confidence ?? null;
          return `<div><strong>${escapeHtml(label)}</strong>${
            score != null ? ` — ${(score * 100).toFixed(1)}%` : ""
          }</div>`;
        }
        const keys = Object.keys(data);
        const rows = keys
          .map((k) => `<li><strong>${escapeHtml(k)}</strong>: ${escapeHtml(JSON.stringify(data[k]))}</li>`)
          .join("");
        return `<ul style="padding-left:18px">${rows}</ul>`;
      } else {
        return `<div>${escapeHtml(String(data))}</div>`;
      }
    } catch (e) {
      return `<pre>${escapeHtml(JSON.stringify(data, null, 2))}</pre>`;
    }
  }

  // ---------- Markdown-like parser & renderer (for API string output) ----------
  const linkRegexGlobal = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;

  function parseMarkdownLike(text) {
    const sections = text.split(/\n-{3,}\n/).map((s) => s.trim()).filter(Boolean);
    const out = [];

    for (const section of sections) {
      const lines = section.split(/\n/).map((l) => l.trim()).filter(Boolean);
      const headerLine = lines[0] || "";

      let title = "";
      let confidence = null;
      let wikiText = null;
      let wikiUrl = null;

      const headerMatch = headerLine.match(/#{2,3}\s*([^\(]+?)\s*\((\d+(?:\.\d+)?)%\)/i);
      if (headerMatch) {
        title = headerMatch[1].trim();
        confidence = parseFloat(headerMatch[2]);
        const wikiMatch = headerLine.match(/\*\*\[([^\]]+)\]\((https?:\/\/[^\)]+)\)\*\*/);
        if (wikiMatch) {
          wikiText = wikiMatch[1];
          wikiUrl = wikiMatch[2];
        } else {
          const l = headerLine.match(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/);
          if (l) {
            wikiText = l[1];
            wikiUrl = l[2];
          }
        }
      } else {
        const fallback = headerLine.match(/^(.+?)\s*\((\d+(?:\.\d+)?)%\)/);
        if (fallback) {
          title = fallback[1].trim();
          confidence = parseFloat(fallback[2]);
        } else {
          title = headerLine.split(/\s+/)[0] || headerLine;
        }
      }

      // get bloom
      let bloom = null;
      const bloomMatch = section.match(/\*\*Blooming Period:\*\*\s*([^*]+)/i);
      if (bloomMatch) bloom = bloomMatch[1].trim();

      // locations
      let locations = [];
      const locMatch = section.match(/\*\*Likely Locations:\*\*\s*([\s\S]+)/i);
      if (locMatch) {
        const locText = locMatch[1];
        let m;
        while ((m = linkRegexGlobal.exec(locText)) !== null) {
          locations.push({ text: m[1], url: m[2] });
        }
      } else {
        let m;
        while ((m = linkRegexGlobal.exec(section)) !== null) {
          locations.push({ text: m[1], url: m[2] });
        }
      }

      // description (strip bloom/locations)
      let afterHeader = section.replace(headerLine, "").trim();
      afterHeader = afterHeader.replace(/\*\*Blooming Period:\*\*[\s\S]*/i, "").replace(
        /\*\*Likely Locations:\*\*[\s\S]*/i,
        ""
      ).trim();
      afterHeader = afterHeader.replace(/\*\*\[[^\]]+\]\([^\)]+\)\*\*/, "").trim();
      const description = afterHeader.replace(/\n+/g, " ").trim().slice(0, 600);

      out.push({
        title: title || "",
        confidence,
        wikiText,
        wikiUrl,
        description,
        bloom,
        locations,
      });
    }

    return out;
  }

  function renderPredictions(parsed) {
    if (!parsed || parsed.length === 0) return "<div>No predictions</div>";
    return parsed
      .map((p) => {
        const confBadge =
          p.confidence != null
            ? `<span class="confidence-badge">${(p.confidence).toFixed(2)}%</span>`
            : "";
        const titleHtml = p.wikiUrl
          ? `<a href="${escapeHtml(p.wikiUrl)}" target="_blank" rel="noopener">${escapeHtml(p.title)}</a>`
          : escapeHtml(p.title);
        const descHtml = p.description ? `<p class="result-desc">${escapeHtml(p.description)}</p>` : "";
        const bloomHtml = p.bloom ? `<div class="result-bloom"><strong>Blooming Period:</strong> ${escapeHtml(p.bloom)}</div>` : "";
        const locHtml =
          p.locations && p.locations.length
            ? `<div class="result-locations"><strong>Likely Locations:</strong> ${p.locations
                .map((l) => `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener">${escapeHtml(l.text)}</a>`)
                .join(" · ")}</div>`
            : "";

        return `
          <div class="result-item">
            <div class="result-item-inner">
              <div class="result-title">${titleHtml}${confBadge}</div>
            </div>
            ${descHtml}
            ${bloomHtml}
            ${locHtml}
          </div>
        `;
      })
      .join("");
  }

  // === Gradio client ===
  const clientPromise = Client.connect(SPACE_NAME).catch((err) => {
    console.warn("Gradio client connect failed:", err);
    return Promise.reject(err);
  });

  async function sendImageToModel(imageFileOrBlob) {
    showSpinner();
    try {
      const client = await clientPromise;
      const result = await client.predict(PREDICT_PATH, { image: imageFileOrBlob });
      const data = result?.data ?? result;

      if (typeof data === "string") {
        const parsed = parseMarkdownLike(data);
        showHTML(
          `<div class="result-heading" style="font-weight:700;margin-bottom:8px">Result</div>${renderPredictions(
            parsed
          )}<details class="result-raw" style="margin-top:12px"><summary>Raw output</summary><pre>${escapeHtml(
            data
          )}</pre></details>`
        );
        return;
      }

      if (Array.isArray(data) && data.length === 1 && typeof data[0] === "string") {
        const parsed = parseMarkdownLike(data[0]);
        showHTML(
          `<div class="result-heading" style="font-weight:700;margin-bottom:8px">Result</div>${renderPredictions(
            parsed
          )}<details class="result-raw" style="margin-top:12px"><summary>Raw output</summary><pre>${escapeHtml(
            data[0]
          )}</pre></details>`
        );
        return;
      }

      const pretty = formatApiStructured(data);
      const rawJson = `<details class="result-raw" style="margin-top:12px"><summary>Raw JSON</summary><pre>${escapeHtml(
        JSON.stringify(result, null, 2)
      )}</pre></details>`;
      showHTML(`<div class="result-heading" style="font-weight:700;margin-bottom:8px">Result</div>${pretty}${rawJson}`);
    } catch (err) {
      console.error(err);
      errorHTML(err?.message ?? String(err));
    }
  }

  function previewAndSend(blob, filename) {
    const url = URL.createObjectURL(blob);
    const previewHtml = `
      <div class="result-preview">
        <div class="result-heading" style="font-weight:700;margin-bottom:8px">Preview</div>
        <img class="result-preview-img" src="${url}" alt="preview"/>
        <div class="result-filename"><small>${escapeHtml(filename ?? "uploaded image")}</small></div>
      </div>
    `;
    showHTML(previewHtml);
    const imageFile = new File([blob], filename ?? "image.jpg", { type: blob.type || "image/jpeg" });
    sendImageToModel(imageFile);
  }

  // --- handle text input (fetch wikimedia image and send) ---
  async function handleTextInput() {
    const raw = plantNameInput.value?.trim();
    if (!raw) {
      errorHTML("Please type a plant name first.");
      return;
    }
    const safe = encodeURIComponent(raw);
    const url = WIKIMEDIA_TEMPLATE(raw);
    showSpinner(`Fetching image for \"${raw}\"…`);
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`Image fetch failed (${resp.status}) for URL: ${url}`);
      const blob = await resp.blob();
      previewAndSend(blob, `250px-${safe}.jpg`);
    } catch (err) {
      console.error(err);
      errorHTML(`Couldn't fetch image for \"${raw}\". (${err?.message ?? ""})`);
    }
  }

  function clearResult() {
    resultDiv.innerHTML = "";
    plantNameInput.value = "";
    fileStatus.textContent = "No file chosen";
  }

  function handleFileSelected(file) {
    if (!file) return;
    fileStatus.textContent = file.name;
    previewAndSend(file, file.name);
  }

  // Drag & drop set up on dropZone + allow dropping anywhere
  (function setupDrop() {
    function prevent(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    ["dragenter", "dragover", "dragleave", "drop"].forEach((evt) => {
      dropZone.addEventListener(evt, prevent, false);
      document.addEventListener(evt, prevent, false); // allow drop anywhere in document
    });

    dropZone.addEventListener("dragover", () => dropZone.classList.add("dragover"));
    dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));
    dropZone.addEventListener("drop", (e) => {
      dropZone.classList.remove("dragover");
      const dt = e.dataTransfer;
      if (!dt) return;
      const files = dt.files;
      if (!files || files.length === 0) {
        errorHTML("No file detected in dropped item.");
        return;
      }
      const file = files[0];
      handleFileSelected(file);
    });

    // click -> open file chooser
    dropZone.addEventListener("click", () => fileInput.click());
    dropZone.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") fileInput.click();
    });
  })();

  // --- wire UI events ---
  identifyBtn.addEventListener("click", () => handleTextInput());
  // Enter key triggers identify
  plantNameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleTextInput();
    }
  });

  clearResultBtn.addEventListener("click", () => clearResult());

  fileInput.addEventListener("change", (e) => {
    const f = e.target.files?.[0];
    if (f) handleFileSelected(f);
    e.target.value = "";
  });

  // modal & contact handlers
  window.openModal = () => {
    const m = document.getElementById("howModal");
    if (m) m.setAttribute("aria-hidden", "false");
  };
  window.closeModal = () => {
    const m = document.getElementById("howModal");
    if (m) m.setAttribute("aria-hidden", "true");
  };
  const contactBtn = document.getElementById("contactBtn");
  if (contactBtn) {
    contactBtn.addEventListener("click", () => {
      alert("Contact us at bloomshift@example.com (placeholder)");
    });
  }

  // warm client
  (async function warmClient() {
    try {
      await clientPromise;
      console.log("Gradio client connected to", SPACE_NAME);
    } catch (err) {
      console.warn("Could not connect to Gradio client:", err?.message ?? err);
    }
  })();

  // expose for backward compatibility
  window.handleTextInput = handleTextInput;
  window.clearResult = clearResult;
});
