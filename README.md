# Design Context Pro

A comprehensive Figma plugin and web application for adding rich context and documentation to design systems, directly integrated into your design workflow.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Overview

Design Context Pro helps design teams bridge the gap between design and documentation by allowing designers to add context, guidelines, and usage information directly within Figma. The plugin syncs seamlessly with a web app where teams can browse, search, and explore their design system documentation.

### Key Features

- **🎨 Figma Plugin**: Add context directly to design components within Figma
- **🌐 Web Application**: Browse and search your design system documentation
- **🔄 Real-time Sync**: Keep documentation in sync between Figma and the web
- **📝 Rich Documentation**: Add descriptions, usage guidelines, properties, examples, and more
- **🏷️ Tag System**: Organize components with tags for easy discovery
- **🔍 Search**: Powerful search across all documented components
- **👥 Collaboration**: Share design system knowledge across your team

## Project Structure

```
design-context-pro/
├── figma-plugin/          # Figma plugin source code
│   ├── src/
│   │   ├── code.ts        # Main plugin logic
│   │   ├── ui.tsx         # React-based UI
│   │   └── types.ts       # TypeScript definitions
│   ├── ui/
│   │   └── ui.html        # Plugin UI template
│   ├── manifest.json      # Figma plugin manifest
│   └── package.json
│
└── web-app/               # Web application
    ├── client/            # React frontend
    │   ├── src/
    │   │   ├── components/
    │   │   ├── pages/
    │   │   ├── services/
    │   │   └── types/
    │   └── package.json
    │
    └── server/            # Node.js backend API
        ├── src/
        │   ├── controllers/
        │   ├── models/
        │   ├── routes/
        │   ├── middleware/
        │   └── index.ts
        └── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Figma Desktop App (for plugin development)
- Git

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/design-context-pro.git
cd design-context-pro
```

#### 2. Install Figma Plugin Dependencies

```bash
cd figma-plugin
npm install
npm run build
```

#### 3. Install Web App Dependencies

```bash
# Install client dependencies
cd ../web-app/client
npm install

# Install server dependencies
cd ../server
npm install
```

### Running the Application

#### Start the Backend Server

```bash
cd web-app/server
npm run dev
```

The API server will start on `http://localhost:5000`

#### Start the Frontend

```bash
cd web-app/client
npm run dev
```

The web app will start on `http://localhost:3000`

#### Load the Figma Plugin

1. Open Figma Desktop App
2. Go to **Plugins** → **Development** → **Import plugin from manifest**
3. Navigate to the `figma-plugin` directory and select `manifest.json`
4. Run the plugin from **Plugins** → **Development** → **Design Context Pro**

## Usage

### Setting Up API Key

1. Open the web app at `http://localhost:3000`
2. Click **"Generate API Key"**
3. Copy the generated API key

### Using the Figma Plugin

1. Open your Figma file with design system components
2. Run **Design Context Pro** from the Plugins menu
3. Select a component in Figma
4. Click on the **"Edit"** tab in the plugin
5. Fill in the context information:
   - **Title**: Component name
   - **Description**: What the component does
   - **Usage Guidelines**: When and how to use it
6. Click **"Create Context"** or **"Update Context"**
7. Switch to the **"All Contexts"** tab
8. Paste your API key and click **"Sync to Server"**

### Viewing Documentation on the Web

1. Navigate to `http://localhost:3000`
2. Browse your synced design systems
3. Search for specific components
4. Filter by tags
5. View detailed documentation for each component

## API Documentation

### Endpoints

#### Authentication

- `POST /api/auth/api-key` - Generate a new API key

#### Projects

- `GET /api/projects` - Get all projects
- `GET /api/projects/:fileKey` - Get a specific project
- `GET /api/projects/:fileKey/contexts` - Get all contexts for a project
- `GET /api/projects/:fileKey/contexts/:contextId` - Get a specific context
- `POST /api/sync` - Sync contexts from Figma (requires API key)

#### Search

- `GET /api/search?q=query` - Search across all contexts

### Authentication

Most endpoints support optional authentication. The `/sync` endpoint requires authentication via Bearer token:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -X POST http://localhost:5000/api/sync \
     -d '{"fileKey": "abc123", "contexts": [...]}'
```

## Development

### Building for Production

#### Figma Plugin

```bash
cd figma-plugin
npm run build
```

The built files will be in the `dist/` directory.

#### Web Application

```bash
# Build frontend
cd web-app/client
npm run build

# Build backend
cd ../server
npm run build
npm start
```

### Technology Stack

**Figma Plugin:**
- TypeScript
- React
- Figma Plugin API
- esbuild

**Frontend:**
- React 18
- TypeScript
- React Router
- Vite
- Axios

**Backend:**
- Node.js
- Express
- TypeScript
- File-based data storage (easily upgradeable to MongoDB/PostgreSQL)

## Features in Detail

### Context Management

Each component can have:
- **Title & Description**: Basic information about the component
- **Usage Guidelines**: When and how to use the component
- **Properties**: Document props/variants with types and descriptions
- **Examples**: Real-world usage examples
- **Guidelines**: Best practices and design guidelines
- **Tags**: Categorization for easy filtering

### Sync Mechanism

The plugin stores context data in Figma's plugin data storage. When you sync:
1. Plugin collects all context data from the current file
2. Sends it to the backend via API
3. Backend stores and indexes the data
4. Web app displays the latest synced data

## Roadmap

- [ ] MongoDB/PostgreSQL integration
- [ ] User authentication and team workspaces
- [ ] Version history for documentation
- [ ] Visual previews from Figma
- [ ] Export to Markdown/HTML
- [ ] Comments and discussions
- [ ] Design tokens integration
- [ ] Figma variables documentation
- [ ] AI-assisted documentation generation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by [zeroheight](https://zeroheight.com/) and other design documentation tools
- Built with the [Figma Plugin API](https://www.figma.com/plugin-docs/)
- Special thanks to the Figma and design systems communities

## Support

For questions, issues, or feature requests, please open an issue on GitHub.

---

**Made with ❤️ for designers and developers**
