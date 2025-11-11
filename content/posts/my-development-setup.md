---
title: My Development Setup in 2024
date: 2024-04-01
description: A look at the tools, software, and configurations I use for development
tags:
  - tools
  - productivity
  - development
  - setup
---

# My Development Setup in 2024

I often get asked about the tools and setup I use for development. In this post, I'll share my current development environment and the reasoning behind my choices.

## Hardware

### Computer

- **MacBook Pro M1 Pro** (14-inch, 2021)
- 16GB RAM
- 512GB SSD

I switched to Apple Silicon and haven't looked back. The performance and battery life are incredible.

### Peripherals

- **Keyboard**: Keychron K8 Pro (mechanical, hot-swappable)
- **Mouse**: Logitech MX Master 3
- **Monitor**: LG 27" 4K (27UP850-W)
- **Headphones**: Sony WH-1000XM4

## Software

### Editor: VS Code

I use [Visual Studio Code](https://code.visualstudio.com/) as my primary editor. It's fast, extensible, and has excellent TypeScript support.

**Key Extensions**:

- **ESLint**: Linting for JavaScript/TypeScript
- **Prettier**: Code formatting
- **GitLens**: Enhanced Git integration
- **Error Lens**: Inline error highlighting
- **Auto Rename Tag**: Automatically rename paired HTML/XML tags
- **Path Intellisense**: Autocomplete for file paths
- **Thunder Client**: REST API testing
- **Todo Tree**: Highlight TODO comments

**Settings**:

```json
{
  "editor.fontSize": 14,
  "editor.fontFamily": "JetBrains Mono",
  "editor.lineHeight": 1.6,
  "editor.tabSize": 2,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.minimap.enabled": false,
  "workbench.colorTheme": "One Dark Pro",
  "terminal.integrated.fontSize": 13
}
```

### Terminal

I use **iTerm2** with **Zsh** and **Oh My Zsh**:

**Shell Theme**: Powerlevel10k

**Useful Plugins**:

- `git`: Git shortcuts and aliases
- `zsh-autosuggestions`: Command suggestions
- `zsh-syntax-highlighting`: Syntax highlighting in terminal
- `fzf`: Fuzzy finder for files and history

**Aliases**:

```bash
alias g="git"
alias gc="git commit"
alias gp="git push"
alias gs="git status"
alias gd="git diff"
alias ll="ls -lah"
alias ..="cd .."
alias ...="cd ../.."
```

### Version Control

- **Git**: Command-line Git
- **GitHub Desktop**: For when I want a visual diff
- **GitHub CLI (`gh`)**: For quick PR creation and repository management

### Browser

**Primary**: Chrome (for development)

- React Developer Tools
- Redux DevTools
- JSON Formatter
- Wappalyzer
- ColorZilla

**Secondary**: Firefox (for testing)

## Development Tools

### Node.js Ecosystem

- **Node Version Manager (nvm)**: Manage multiple Node.js versions
- **npm**: Package manager (though I also use pnpm for some projects)
- **npx**: Run packages without installing globally

### Database Tools

- **TablePlus**: Beautiful database GUI (supports PostgreSQL, MySQL, SQLite, etc.)
- **Postman**: API development and testing
- **Redis Desktop Manager**: For Redis databases

### Docker

- **Docker Desktop**: Container management
- **Portainer**: Web-based Docker UI

### Design & Assets

- **Figma**: UI/UX design and prototyping
- **ImageOptim**: Image compression
- **ColorSlurp**: Color picker

## Productivity Tools

### Note-Taking & Documentation

- **Obsidian**: Personal knowledge management
- **Notion**: Project planning and documentation
- **Quartz**: Publishing notes to the web (this blog!)

### Task Management

- **Things 3**: Personal task management
- **Linear**: Team project management

### Communication

- **Slack**: Team communication
- **Discord**: Community participation
- **Zoom**: Video calls

### Other Tools

- **Raycast**: Spotlight replacement with extensions
- **Rectangle**: Window management
- **1Password**: Password manager
- **Spotify**: Music while coding

## Configuration Files

I keep my dotfiles in a [GitHub repository](https://github.com/username/dotfiles) for easy setup on new machines.

Key files I version control:

- `.zshrc`: Shell configuration
- `.gitconfig`: Git settings
- `.vimrc`: Vim configuration (for quick edits)
- VS Code `settings.json`
- VS Code `keybindings.json`

## Backup Strategy

**Local**:

- Time Machine to external SSD (hourly)

**Cloud**:

- GitHub for code
- iCloud for documents
- Backblaze for full system backup

## What I'm Considering

Tools I'm evaluating or planning to try:

- **Neovim**: As a potential VS Code replacement
- **Warp**: Modern terminal with AI features
- **Arc Browser**: New approach to browser design
- **Bun**: Alternative JavaScript runtime to Node.js

## Tips for Your Setup

1. **Start Simple**: Don't over-configure initially
2. **Iterate**: Add tools as you find needs
3. **Learn Shortcuts**: Master keyboard shortcuts for your main tools
4. **Automate**: Create scripts for repetitive tasks
5. **Document**: Keep notes on your setup for future reference

## Conclusion

Your development setup should work for _you_. What works for me might not work for you, and that's okay. The key is to find tools that make you productive and happy.

What's your setup like? Let me know what tools you can't live without!
