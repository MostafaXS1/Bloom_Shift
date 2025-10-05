import gradio as gr
from transformers import AutoFeatureExtractor, AutoModelForImageClassification
from PIL import Image
import torch
import wikipedia
import requests
from bs4 import BeautifulSoup
import re

# Model setup
MODEL_NAME = "loretyan/vit-base-oxford-flowers-102"
extractor = AutoFeatureExtractor.from_pretrained(MODEL_NAME)
model = AutoModelForImageClassification.from_pretrained(MODEL_NAME)

def get_wikipedia_info(label):
    try:
        page = wikipedia.page(label, auto_suggest=False)
        return f"**[{page.title}]({page.url})**\n\n{page.summary[:400]}...", page
    except:
        results = wikipedia.search(label)
        if results:
            try:
                page = wikipedia.page(results[0])
                return f"**[{page.title}]({page.url})**\n\n{page.summary[:400]}...", page
            except:
                return "No Wikipedia page found.", None
        return "No Wikipedia page found.", None

def get_blooming_period_duckduckgo(plant_name):
    query = f"{plant_name} blooming period"
    url = "https://duckduckgo.com/html/"
    params = {"q": query}
    headers = {"User-Agent": "Mozilla/5.0"}
    try:
        r = requests.get(url, params=params, headers=headers, timeout=8)
        if r.status_code != 200:
            return "No blooming data found."
        soup = BeautifulSoup(r.text, "html.parser")
        snippets = [s.get_text(" ", strip=True) for s in soup.select(".result__snippet")]

        # Regex for month ranges
        month_regex = re.compile(
            r"(January|February|March|April|May|June|July|August|September|October|November|December)"
            r"(?:\s*(?:–|-|to)\s*)"
            r"(January|February|March|April|May|June|July|August|September|October|November|December)",
            re.IGNORECASE
        )

        for snippet in snippets:
            match = month_regex.search(snippet)
            if match:
                return match.group(0)  # e.g., "March to June"

        return snippets[0] if snippets else "No blooming data found."
    except:
        return "No blooming data found."

def get_locations_from_wikipedia(page):
    if not page:
        return "No location data found."
    text = page.content
    # Look for capitalized words that may be places
    possible_locations = re.findall(r"\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\b", text)
    # Filter common words
    blacklist = {"The", "This", "That", "Flower", "Plant", "Bloom", "It", "They"}
    locations = [loc for loc in possible_locations if loc not in blacklist]

    # Deduplicate while preserving order
    seen = set()
    final_locs = []
    for loc in locations:
        if loc not in seen:
            seen.add(loc)
            final_locs.append(loc)

    if not final_locs:
        return "No location data found."

    # Make clickable Google Maps links
    links = [f"[{loc}](https://www.google.com/maps/search/{loc})" for loc in final_locs[:5]]
    return ", ".join(links)

def classify(image):
    inputs = extractor(images=image, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)
        probs = outputs.logits.softmax(-1)[0]

    top_indices = torch.topk(probs, k=3).indices.tolist()
    result_md = []

    for idx in top_indices:
        label = model.config.id2label[idx]
        confidence = round(probs[idx].item() * 100, 2)

        wiki_info, page = get_wikipedia_info(label)
        bloom = get_blooming_period_duckduckgo(label)
        locations = get_locations_from_wikipedia(page)

        result_md.append(
            f"### {label} ({confidence}%)\n\n"
            f"{wiki_info}\n\n"
            f"**Blooming Period:** {bloom}\n\n"
            f"**Likely Locations:** {locations}"
        )

    return "\n\n---\n\n".join(result_md)

demo = gr.Interface(
    fn=classify,
    inputs=gr.Image(type="pil", label="Upload a Flower Image"),
    outputs=gr.Markdown(label="Predictions + Info"),
    title="🌸 Flower Identifier with Blooming & Location Info",
    description="Upload a flower photo and get predictions with Wikipedia info, blooming period (DuckDuckGo search), and location links (Google Maps)."
)

if __name__ == "__main__":
    demo.launch()
