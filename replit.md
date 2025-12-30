# Lumina Interior Design

AI-powered interior design visualization app that transforms room photos into styled designs using Google's Gemini AI.

## Overview

This is a React + Vite + TypeScript application that allows users to:
- Upload room photos
- Choose design intensity (Subtle, Balanced, or Bold)
- Generate 5 different interior design styles using Gemini AI
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
├── services/            # Business logic and API services
│   ├── geminiService.ts # Gemini AI integration
│   ├── imageUtils.ts    # Image compression and download
│   └── githubService.ts # GitHub upload functionality
├── App.tsx              # Main application component
├── index.tsx            # React entry point
├── types.ts             # TypeScript types and enums
├── index.html           # HTML template
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## Configuration

### Environment Variables
- `GEMINI_API_KEY`: Your Google Gemini API key (required for AI features)

### Tech Stack
- React 19 with TypeScript
- Vite 6 build tool
- Tailwind CSS (via CDN)
- Google Gemini AI (@google/genai)
- Font Awesome icons

## Development

```bash
npm install
npm run dev
```

The development server runs on port 5000 with all hosts allowed for Replit compatibility.

## Design Styles

The app generates designs in 5 styles:
1. Maximalist Bohemian
2. Luxury Art Deco
3. Modern Farmhouse
4. European Classic
5. Contemporary Organic

## Recent Changes

- December 30, 2025: Initial project setup and import from GitHub
