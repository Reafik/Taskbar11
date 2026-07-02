# Architecture Overview

## System Architecture

Design Context Pro consists of three main components that work together:

```
┌─────────────────────────────────────────────────────────────────┐
│                         Figma Desktop                            │
│                                                                   │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              Design Context Pro Plugin                  │    │
│  │                                                          │    │
│  │  ┌──────────────┐        ┌──────────────────────┐     │    │
│  │  │   UI Layer   │◄──────►│  Plugin Code Layer   │     │    │
│  │  │  (React/TS)  │        │   (TypeScript)       │     │    │
│  │  └──────────────┘        └──────────────────────┘     │    │
│  │         │                          │                    │    │
│  │         │                          ▼                    │    │
│  │         │                 ┌─────────────────┐         │    │
│  │         │                 │  Figma Plugin   │         │    │
│  │         │                 │   Data Storage  │         │    │
│  │         │                 └─────────────────┘         │    │
│  └─────────┼───────────────────────┬──────────────────────┘    │
└────────────┼───────────────────────┼───────────────────────────┘
             │                       │
             │                       │ HTTPS API
             │                       │ (Sync Context)
             │                       │
             │                       ▼
┌────────────┼───────────────────────────────────────────────────┐
│            │        Backend Server (Node.js/Express)           │
│            │                                                     │
│            │    ┌─────────────────────────────────────────┐   │
│            │    │         REST API Layer                   │   │
│            │    │  ┌──────────┐  ┌────────────────────┐  │   │
│            │    │  │  Auth    │  │   Project Routes   │  │   │
│            │    │  │  Routes  │  │   Context Routes   │  │   │
│            │    │  └──────────┘  └────────────────────┘  │   │
│            │    └─────────────────────────────────────────┘   │
│            │                      │                             │
│            │                      ▼                             │
│            │    ┌─────────────────────────────────────────┐   │
│            │    │        Controllers Layer                │   │
│            │    │  ┌─────────────┐  ┌──────────────────┐ │   │
│            │    │  │    Auth     │  │     Project      │ │   │
│            │    │  │ Controller  │  │   Controller     │ │   │
│            │    │  └─────────────┘  └──────────────────┘ │   │
│            │    └─────────────────────────────────────────┘   │
│            │                      │                             │
│            │                      ▼                             │
│            │    ┌─────────────────────────────────────────┐   │
│            │    │         Data Store (File-based)         │   │
│            │    │  - projects.json                        │   │
│            │    │  - api-keys.json                        │   │
│            │    └─────────────────────────────────────────┘   │
└────────────┼───────────────────────────────────────────────────┘
             │
             │ HTTP API
             │ (GET Requests)
             │
             ▼
┌─────────────────────────────────────────────────────────────────┐
│              Web Application (React + Vite)                      │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    React Router                           │  │
│  │  ┌──────────┐  ┌────────────┐  ┌──────────────────┐    │  │
│  │  │  Home    │  │  Project   │  │  Context Detail  │    │  │
│  │  │  Page    │  │   Page     │  │      Page        │    │  │
│  │  └──────────┘  └────────────┘  └──────────────────┘    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                      │
│                           ▼                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   API Service Layer                       │  │
│  │                    (Axios Client)                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└───────────────────────────────────────────────────────────────┘
```

## Data Flow

### Creating/Updating Context in Figma

1. User selects a component in Figma
2. User fills out context form in the plugin UI
3. Plugin stores data in Figma's plugin data storage
4. Data is attached to the selected node

### Syncing to Web App

1. User clicks "Sync to Server" in plugin
2. Plugin collects all context data from the file
3. Plugin sends data to backend API with authentication
4. Backend validates API key
5. Backend stores/updates project and contexts
6. Backend responds with success confirmation

### Viewing on Web

1. User opens web app in browser
2. Web app requests projects from backend
3. Backend retrieves and sends project data
4. User browses/searches contexts
5. Web app displays rich documentation

## Key Components

### Figma Plugin

**Technologies:**
- TypeScript
- React (for UI)
- Figma Plugin API
- esbuild (bundler)

**Responsibilities:**
- Provide UI for adding/editing context
- Store context data in Figma files
- Sync context data to backend
- Handle selection changes

### Backend Server

**Technologies:**
- Node.js
- Express
- TypeScript
- File-based storage (JSON)

**Responsibilities:**
- API endpoints for sync and retrieval
- API key management
- Data storage and retrieval
- Search functionality

### Web Application

**Technologies:**
- React 18
- TypeScript
- React Router
- Vite
- Axios

**Responsibilities:**
- Display design system documentation
- Search and filter contexts
- Generate API keys
- Provide browsing interface

## Security

### API Key Authentication

- API keys are generated server-side using UUIDs
- Keys are prefixed with `dcp_` for identification
- Bearer token authentication for sync endpoint
- Optional authentication for read endpoints

### Data Storage

- Currently uses file-based JSON storage
- Can be upgraded to MongoDB/PostgreSQL
- API keys and project data stored separately
- No sensitive user data collected

## Scalability Considerations

### Current Implementation
- File-based storage (suitable for small teams)
- Single server instance
- Synchronous operations

### Future Improvements
- Database integration (MongoDB/PostgreSQL)
- Redis caching
- Horizontal scaling with load balancer
- Queue system for sync operations
- CDN for static assets
- Webhook support for real-time updates

## Development Workflow

1. **Plugin Development**: Changes to plugin require rebuild and reload in Figma
2. **Backend Development**: Hot reload with ts-node-dev
3. **Frontend Development**: Hot module replacement with Vite
4. **Testing**: Each component can be tested independently

## Deployment

### Plugin Deployment
- Build plugin with `npm run build`
- Submit to Figma Community (optional)
- Or distribute manifest.json privately

### Web App Deployment
- Build frontend with `npm run build`
- Deploy static files to CDN/hosting
- Deploy backend to Node.js server
- Configure environment variables
- Set up domain and SSL

## Communication Protocols

### Plugin ↔ Backend
- Protocol: HTTPS
- Format: JSON
- Authentication: Bearer token
- Endpoints: `/api/sync`

### Web App ↔ Backend
- Protocol: HTTP/HTTPS
- Format: JSON
- Authentication: Optional (for public viewing)
- Endpoints: `/api/projects/*`, `/api/search`

### Plugin UI ↔ Plugin Code
- Protocol: postMessage API
- Format: TypeScript interfaces
- Direction: Bidirectional
- Messages: Command/response pattern
