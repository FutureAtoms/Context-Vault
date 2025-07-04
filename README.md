# Context Vault

AI Development Memory System - Securely store and manage prompts, memories, and workspace instructions across all your AI coding assistants.

![Context Vault](https://img.shields.io/badge/version-1.0.0-amber)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- 📝 **Multi-Type Storage**: Store prompts, memories, and workspace instructions
- 🤖 **15+ AI IDEs Supported**: Cursor, Claude Code, Windsurf, GitHub Copilot, and more
- 🔍 **Smart Search & Filter**: Find content quickly by type, IDE, or keywords
- 📱 **Cross-Platform**: Works on desktop, mobile, and tablets
- 💾 **Local Storage**: All data stored securely in your browser
- 📤 **Import/Export**: Backup and share your collection
- ✏️ **Full CRUD**: Create, read, update, and delete functionality

## Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ffutureatoms%2Fcontext-vault)

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/futureatoms/context-vault.git
cd context-vault
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000)

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment Options

### Vercel (Recommended - Fastest)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Deploy with zero configuration

### Netlify

1. Push your code to GitHub
2. Import the project in [Netlify](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `dist`

### GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json:
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

3. Deploy:
```bash
npm run deploy
```

## Technology Stack

- **React 18** - UI Framework
- **Vite** - Build tool for fast development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Author

Created by [@futureatoms](https://github.com/futureatoms)
