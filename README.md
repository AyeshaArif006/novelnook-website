#  NovelNook

A cozy digital corner for lovers of Urdu and English literature. NovelNook is a fully responsive, multi-page book-discovery website where readers can browse a curated shelf, search and filter by language, view detailed novel info, and get in touch — all built with **vanilla HTML, CSS and JavaScript** (no frameworks, no build step).



---

##  Features

- **Home** — animated hero, a featured-novels slider, category highlights, and a newsletter signup form
- **Novels** — a searchable, filterable, sortable catalog (by language, title, rating) with a detail modal for each book
- **Gallery** — a visual grid of every cover with a lightbox viewer
- **About** — the site's story, mission/values, and an FAQ accordion
- **Contact** — a validated contact form plus a "Follow Along" social card
- **Custom cover art** — every novel has an original, hand-designed SVG cover (no copyrighted artwork used) styled to match the site's literary maroon-and-gold theme
- Fully responsive layout (desktop, tablet, mobile) with a mobile hamburger nav
- Zero dependencies — plain HTML/CSS/JS, works by just opening the files in a browser

---

##  Project Structure

```
novelnook/
├── index.html          # Home page
├── about.html           # About page
├── novels.html           # Novels catalog page
├── gallery.html          # Gallery / lightbox page
├── contact.html          # Contact page
├── css/
│   └── style.css         # All site styling
├── js/
│   ├── data.js            # Shared novel dataset (title, author, rating, cover, etc.)
│   └── script.js          # Navigation, slider, catalog, modal, gallery, form logic
└── images/
    └── covers/            # Original SVG cover art for each novel
```

---

##  Tech Stack

- **HTML5** — semantic markup across 5 pages
- **CSS3** — custom properties (design tokens), Flexbox, Grid, animations
- **Vanilla JavaScript (ES6)** — DOM rendering, search/filter/sort, modal & lightbox logic, form validation

---

##  Getting Started

No build tools or dependencies required.

1. Clone the repo:
```bash
   git clone https://github.com/<your-username>/novelnook.git
```
2. Open `index.html` in your browser — or serve it locally for the best experience:
```bash
   npx serve novelnook
```

---

##  Adding a New Novel

All novel data lives in one place: `js/data.js`. Add a new object to the `NOVELS` array:

```js
{
  id: 10,
  title: "Your Title",
  author: "Author Name",
  lang: "urdu" | "english",
  icon: "📕",
  cover: "images/covers/your-title.svg",
  rating: 4.5,
  tag: "Genre / Category",
  desc: "Short description of the novel."
}
```

The Home slider, Novels grid, Gallery, and modal all render automatically from this dataset.

---

##  Cover Art

Each cover under `images/covers/` is an original SVG design created for this project — not a reproduction of any publisher's actual cover art — styled around a motif drawn from the novel's theme (e.g. a compass for *Bakht*, a kite for *The Kite Runner*, a whirling rose for *The Forty Rules of Love*).

---

##  License

This project was built for educational purposes as part of a Web Technologies assignment. Novel titles, authors, and descriptions are used for illustrative/educational purposes only.
