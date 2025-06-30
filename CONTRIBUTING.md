# Contributing to Anime Book Library

Thank you for your interest in contributing to the Anime Book Library! This guide will help you understand how to add your own anime-style stories to our collection.

## Table of Contents

- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Writing Your Story](#writing-your-story)
- [Formatting Guidelines](#formatting-guidelines)
- [Adding Your Story](#adding-your-story)
- [Pull Request Process](#pull-request-process)
- [Code of Conduct](#code-of-conduct)

## How It Works

The Anime Book Library is designed with a two-branch structure:

1. **`main` branch**: Contains the website code (HTML, CSS, JavaScript)
2. **`content` branch**: Contains all the stories as markdown (`.md`) files

This separation allows contributors to focus solely on adding content without needing to understand or modify the website code.

## Getting Started

### Prerequisites

- A GitHub account
- Basic knowledge of Markdown syntax
- Your story written or ready to write

### Fork and Clone the Repository

1. Fork the repository by clicking the "Fork" button at the top right of the repository page
2. Clone your forked repository to your local machine:

```bash
git clone https://github.com/atrajit-sarkar/AnimeBook.git
cd AnimeBook
```

3. Switch to the `content` branch:

```bash
git checkout content
```

## Writing Your Story

### Story Categories

Place your story in one of the following categories (folders):

- `action/` - Action-packed stories with fighting, adventure, etc.
- `romance/` - Love stories and relationships
- `fantasy/` - Stories with magic, mythical creatures, etc.
- `sci-fi/` - Science fiction stories
- `mystery/` - Detective stories, thrillers, etc.
- `slice-of-life/` - Everyday life stories
- `horror/` - Scary or suspenseful stories

If your story fits multiple categories, choose the one that fits best. If you believe a new category should be added, please suggest it in your pull request.

### File Naming

Name your file using kebab-case (lowercase words separated by hyphens):

```
my-awesome-story.md
```

## Formatting Guidelines

### Frontmatter

Each story should begin with frontmatter - a section at the top of the file enclosed by triple dashes (`---`). This contains metadata about your story:

```markdown
---
title: "My Awesome Story"
author: "Your Name"
cover: "https://example.com/image.jpg"
description: "A short description of your story (max 150 characters)"
---
```

**Frontmatter Fields:**

- `title` (required): The title of your story
- `author` (required): Your name or pseudonym
- `cover` (optional): A URL to an image to use as the cover (must be freely usable or your own work)
- `description` (required): A brief description of your story

### Markdown Formatting

After the frontmatter, write your story using Markdown formatting:

```markdown
# My Awesome Story

## Chapter 1: The Beginning

Once upon a time in a magical land...

### The First Challenge

Our hero faced their first challenge when...

![Optional Image Description](https://example.com/image.jpg)

> "Important quote from a character," said the protagonist.

**Bold text** for emphasis and *italic text* for thoughts.
```

### Markdown Cheat Sheet

- `# Heading 1` - Main title
- `## Heading 2` - Chapter title
- `### Heading 3` - Section title
- `**Bold Text**` - For emphasis
- `*Italic Text*` - For thoughts or emphasis
- `> Quote` - For character dialogue or important quotes
- `![Alt Text](image-url)` - For images
- `[Link Text](url)` - For links
- `---` - Horizontal rule (scene break)

## Adding Your Story

1. Create your story file in the appropriate category folder:

```bash
mkdir -p content/fantasy  # Create the folder if it doesn't exist
touch content/fantasy/my-awesome-story.md
```

2. Write your story following the formatting guidelines

3. Commit your changes:

```bash
git add content/fantasy/my-awesome-story.md
git commit -m "Add 'My Awesome Story' to fantasy category"
```

4. Push to your fork:

```bash
git push origin content
```

## Pull Request Process

1. Go to the original repository on GitHub
2. Click "Pull Request" and then "New Pull Request"
3. Select `content` as both the base and compare branch
4. Fill out the pull request template with information about your story
5. Submit the pull request

### Review Process

Your story will be reviewed for:

- Appropriate content (must adhere to our Code of Conduct)
- Correct formatting
- Originality

We may suggest changes or improvements before merging.

## Code of Conduct

### Acceptable Content

- Original stories (your own work)
- Fan fiction clearly labeled as such (with appropriate disclaimers)
- Content appropriate for a general audience (PG-13 at most)

### Prohibited Content

- Explicit sexual content
- Excessive graphic violence
- Hate speech or discriminatory content
- Plagiarized content
- Content that violates copyright laws

### Community Guidelines

- Be respectful to other contributors
- Provide constructive feedback
- Help maintain a positive and inclusive environment

---

Thank you for contributing to the Anime Book Library! Your stories help build our community and bring joy to readers around the world.

If you have any questions, please open an issue on GitHub or contact the maintainers.