# Anime Book Library

![Anime Book Library Logo](./assets/images/logo.svg)

A beautifully designed, GitHub-hosted static website that showcases anime-style books as visually appealing cards categorized by genre. Each card opens a page rendered from a markdown file. The content (books) and the frontend (website) are separated into different branches, making it easy for contributors to add stories just by committing `.md` files to the correct folder.

## 🌟 Features

- **Modern, Anime-Inspired Design**: Light/dark toggle, soft gradients, anime-like typography and illustrations
- **Responsive Layout**: Works on all devices from mobile to desktop
- **Category-Based Organization**: Browse books by genre (Action, Romance, Fantasy, etc.)
- **Dynamic Content Loading**: Fetches and renders markdown content using GitHub API
- **Contributor-Friendly**: Add new stories without touching the frontend code
- **Markdown Support**: Full markdown rendering with frontmatter for metadata

## 🚀 Live Demo

Visit the live site: [Anime Book Library](https://atrajit-sarkar.github.io/AnimeBook)

## 🏗️ Project Structure

The project uses a two-branch structure:

- **`main` branch**: Contains the website code (HTML, CSS, JavaScript)
- **`content` branch**: Contains all the stories as markdown (`.md`) files

### Main Branch Structure

```
.
├── index.html              # Main HTML file
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   ├── app.js             # Core application logic
│   ├── router.js          # Client-side routing
│   └── theme.js           # Theme switching functionality
├── assets/
│   └── images/            # SVG illustrations and icons
├── CONTRIBUTING.md        # Contribution guidelines
└── README.md              # Project documentation
```

### Content Branch Structure

```
content/
├── action/
│   └── my-story.md
├── romance/
│   └── love-in-tokyo.md
├── fantasy/
│   └── dragon-quest.md
└── ...
```

## 🛠️ Technology Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Markdown Renderer**: [marked.js](https://marked.js.org/)
- **YAML Parser**: [js-yaml](https://github.com/nodeca/js-yaml)
- **Hosting**: GitHub Pages
- **Content Management**: GitHub API

## 🚀 Getting Started

### Prerequisites

- Git
- A web browser
- A GitHub account (for contributing)

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/atrajit-sarkar/AnimeBook.git
cd AnimeBook
```

2. Open `index.html` in your browser or use a local server:

```bash
# Using Python
python -m http.server

# Using Node.js
npx serve
```

3. To work with content, switch to the content branch:

```bash
git checkout content
```

## 📝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed instructions.

### Quick Start for Contributors

1. Fork the repository
2. Switch to the `content` branch
3. Add your story as a markdown file in the appropriate category folder
4. Submit a pull request

## 📚 Adding a Story

Stories are written in Markdown with frontmatter:

```markdown
---
title: "My Awesome Story"
author: "Your Name"
cover: "https://example.com/image.jpg"
description: "A short description of your story"
---

# My Awesome Story

Once upon a time...
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for more detailed formatting guidelines.

## 🎨 Customization

### Changing the Theme Colors

Edit the CSS variables in `css/style.css`:

```css
:root {
    --primary-color: #8e44ad;
    --secondary-color: #3498db;
    /* ... other variables ... */
}
```

### Adding New Categories

1. Create a new folder in the `content` branch
2. Update the category filters in the UI (they're dynamically generated)

## 📱 Progressive Web App

To enable PWA features:

1. Add a `manifest.json` file
2. Implement a service worker
3. Add appropriate icons

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Font Awesome](https://fontawesome.com/) for icons
- [Google Fonts](https://fonts.google.com/) for typography
- [marked.js](https://marked.js.org/) for Markdown parsing
- [js-yaml](https://github.com/nodeca/js-yaml) for YAML parsing

---

Built with ❤️ by [Atrajit Sarkar]