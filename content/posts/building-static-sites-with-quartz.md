---
title: Building Static Sites with Quartz
date: 2024-03-05
description: Learn how to create a beautiful static site using Quartz v4
tags:
  - quartz
  - static-site
  - markdown
  - web-development
---

# Building Static Sites with Quartz

I recently discovered [Quartz](https://quartz.jzhao.xyz/), a fantastic static site generator that transforms Markdown content into beautiful websites. In this post, I'll share my experience setting it up and why I think it's great for blogs and digital gardens.

## What is Quartz?

Quartz is a batteries-included static site generator built for publishing notes, documentation, and digital gardens. It's built on top of modern web technologies and offers:

- **Fast builds**: Uses esbuild for lightning-fast compilation
- **Beautiful themes**: Comes with a clean, modern design out of the box
- **Obsidian integration**: Works seamlessly with Obsidian for note-taking
- **Extensible**: Easy to customize with plugins and components

## Key Features

### 1. Markdown-First

Write your content in Markdown with support for:

- GitHub Flavored Markdown
- Obsidian-style wikilinks: `[[like this]]`
- Callouts and admonitions
- LaTeX math equations
- Code syntax highlighting

### 2. Interactive Components

Quartz includes several interactive components:

- **Graph View**: Visualize connections between your notes
- **Search**: Full-text search across all content
- **Backlinks**: See which pages link to the current page
- **Table of Contents**: Auto-generated navigation

### 3. Dark Mode

Built-in dark mode support that respects user preferences:

```css
/* Light mode */
--light: #faf8f8;
--dark: #2b2b2b;

/* Dark mode */
--light: #161618;
--dark: #ebebec;
```

## Getting Started

### Installation

```bash
git clone https://github.com/jackyzha0/quartz.git
cd quartz
npm i
npx quartz create
```

### Project Structure

```
quartz/
├── content/           # Your markdown files
├── quartz/           # Core quartz files
├── quartz.config.ts  # Main configuration
└── quartz.layout.ts  # Layout configuration
```

### Configuration

The `quartz.config.ts` file lets you customize:

- Site title and metadata
- Theme colors and fonts
- Plugins and transformers
- Analytics integration

```typescript
const config: QuartzConfig = {
  configuration: {
    pageTitle: "My Blog",
    enableSPA: true,
    enablePopovers: true,
    theme: {
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
      },
    },
  },
  // ... more config
}
```

## Building and Deploying

### Local Development

```bash
npx quartz build --serve
```

This starts a local server at `http://localhost:8080` with hot-reloading.

### Production Build

```bash
npx quartz build
```

The built site is output to the `public/` directory, ready to deploy to:

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- Any static hosting service

## Customization Tips

### 1. Custom Components

Add your own React components in `quartz/components/`:

```typescript
export default (() => {
  const MyComponent: QuartzComponent = ({ fileData, cfg }: QuartzComponentProps) => {
    return <div>Custom content here</div>
  }
  return MyComponent
}) satisfies QuartzComponentConstructor
```

### 2. Layout Customization

Modify `quartz.layout.ts` to change the page layout:

```typescript
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
  ],
  left: [
    Component.PageTitle(),
    Component.Search(),
    Component.Explorer(),
  ],
  right: [
    Component.Graph(),
    Component.TableOfContents(),
  ],
}
```

### 3. Styling

Override CSS variables in custom stylesheets to match your brand.

## Conclusion

Quartz makes it incredibly easy to create a professional-looking blog or digital garden. The combination of simplicity and power makes it perfect for developers who want to focus on writing content rather than building infrastructure.

If you're looking for a modern static site generator with great defaults and room to grow, give Quartz a try!

## Resources

- [Quartz Documentation](https://quartz.jzhao.xyz/)
- [GitHub Repository](https://github.com/jackyzha0/quartz)
- [Discord Community](https://discord.gg/cRFFHYye7t)
