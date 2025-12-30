# Lumina Interior Design

AI-powered interior design visualization app that transforms room photos into styled designs using OpenAI's image generation API.

## Overview

This is a React + Vite + TypeScript application with an Express backend that allows users to:
- Upload room photos
- Choose design intensity (Subtle, Balanced, or Bold)
- Generate 5 different interior design styles using OpenAI's gpt-image-1 model
- Edit and refine designs with natural language instructions
- Download generated designs or upload to GitHub

## Project Structure

```
/
├── components/          # React UI components
│   ├── Header.tsx
│   ├── ImageUploader.tsx
│   ├── DesignGrid.tsx
│   ├── DesignEditor.tsx
│   └── GitHubUploadModal.tsx
├── services/            # Frontend API services
│   ├── geminiService.ts # API calls to backend
│   ├── imageUtils.ts    # Image compression and download
│   └── githubService.ts # GitHub upload functionality
├── server.js            # Express backend for OpenAI API
├── App.tsx              # Main application component
├── index.tsx            # React entry point
├── types.ts             # TypeScript types and enums
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration with API proxy
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## Configuration

### Environment Variables (Auto-configured by Replit AI Integration)
- `AI_INTEGRATIONS_OPENAI_API_KEY`: OpenAI API key (auto-managed)
- `AI_INTEGRATIONS_OPENAI_BASE_URL`: OpenAI API base URL (auto-managed)

### Tech Stack
- React 19 with TypeScript (frontend)
- Express.js (backend API server)
- Vite 6 build tool
- Tailwind CSS (via CDN)
- OpenAI API (gpt-image-1 model)
- Font Awesome icons

## Development

```bash
npm install
npm run dev
```

This runs both the backend server (port 3001) and frontend dev server (port 5000).

## Design Styles

The app generates designs in 5 styles:
1. Maximalist Bohemian
2. Luxury Art Deco
3. Modern Farmhouse
4. European Classic
5. Contemporary Organic

## Recent Changes

- December 30, 2025: Switched from Gemini to OpenAI API for image generation
- December 30, 2025: Added Express backend server for secure API handling
- December 30, 2025: Initial project setup and import from GitHub
