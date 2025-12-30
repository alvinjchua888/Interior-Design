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
│   ├── Header.tsx              # App header with logo and reset button
│   ├── ImageUploader.tsx       # Initial upload screen with intensity selector
│   ├── DesignGrid.tsx          # Grid display of 5 generated design variations
│   ├── DesignEditor.tsx        # Single design editing interface
│   └── GitHubUploadModal.tsx   # Modal for uploading designs to GitHub
├── services/            # Frontend API services
│   ├── geminiService.ts        # API calls to backend for generation/editing
│   ├── imageUtils.ts           # Image compression and download utilities
│   └── githubService.ts        # GitHub upload functionality
├── server.js            # Express backend for OpenAI API integration
├── App.tsx              # Main application component with state management
├── index.tsx            # React entry point
├── types.ts             # TypeScript types and enums
├── index.html           # HTML template with Tailwind CSS
├── vite.config.ts       # Vite configuration with API proxy
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies and scripts
└── .replit_integration_files/  # Replit AI integration utilities (unused)
```

## Core Components

### `App.tsx`
Main application component managing the entire app state machine:
- **State Management**: Uses `AppState` enum (IDLE, GENERATING_INITIAL, SELECTING_DESIGN, EDITING_DESIGN, UPDATING_DESIGN)
- **Design Generation**: Orchestrates sequential generation of 5 styles using `generateInteriorDesign`
- **Image Compression**: Compresses uploads via `compressImage` before sending to API
- **Error Handling**: Displays user-friendly error messages on API failures
- **Modal Management**: Controls `GitHubUploadModal` visibility

### `components/Header.tsx`
Sticky header with:
- Lumina Interior branding with couch icon
- Reset button to return to initial upload state
- Glassmorphic styling with backdrop blur

### `components/ImageUploader.tsx`
Initial screen for photo upload:
- **Intensity Selector**: Toggle between Subtle, Balanced, Bold using `DesignIntensity` enum
- **File Upload**: Drag-and-drop or click to upload (PNG, JPG, WebP)
- **Camera Option**: Direct camera capture button
- **Preview Text**: Dynamic description of selected intensity level

### `components/DesignGrid.tsx`
Displays generated designs in a responsive grid:
- **Design Cards**: Shows all 5 styles from `DESIGN_STYLES` array
- **Loading States**: Animated placeholders for pending generations
- **Action Buttons**: Download, GitHub upload, and select for editing
- **Progress Indicator**: Shows completion count during generation

### `components/DesignEditor.tsx`
Full-screen editor for refining selected design:
- **Natural Language Input**: Text field for edit instructions
- **Image Preview**: Full-size display of current design
- **Action Bar**: Back, New, GitHub, and Save buttons
- **Loading Overlay**: Animated overlay during edit processing
- **Real-time Updates**: Displays edited image immediately after processing

### `components/GitHubUploadModal.tsx`
Modal for uploading designs to GitHub:
- **Form Fields**: Personal access token, repository path, file path
- **Session Storage**: Saves token and repo for convenience
- **Error Handling**: Displays API errors from GitHub
- **Auto-naming**: Generates file names based on style and timestamp

## Services

### `services/geminiService.ts`
Frontend API service for image generation:

#### `generateInteriorDesign(base64Image, style, intensity)`
- Sends base64 image to `/api/generate-design` endpoint
- Includes style (e.g., "Luxury Art Deco") and intensity level
- Returns base64-encoded generated image URL
- Throws errors for failed requests

#### `editDesign(base64Image, editInstructions)`
- Sends current design to `/api/edit-design` endpoint
- Includes natural language instruction
- Returns base64-encoded edited image URL
- Handles edit-specific error responses

### `services/imageUtils.ts`

#### `compressImage(base64Str)`
- Resizes images to max 1280x720 while maintaining aspect ratio
- Converts to JPEG with 80% quality
- Uses HTML5 Canvas API
- Returns compressed base64 string

#### `downloadBase64Image(base64Data, fileName)`
- Creates temporary download link
- Triggers browser download
- Auto-generates filename with style name

### `services/githubService.ts`

#### `uploadImageToGitHub(params)`
- Uploads base64 image to GitHub repository
- Uses GitHub REST API v3
- Parameters: `GitHubUploadParams` interface
- Handles authentication and error responses

## Backend

### `server.js`
Express server handling OpenAI API integration:

#### POST `/api/generate-design`
- Receives: `{ imageBase64, style, intensity }`
- Converts base64 to buffer and creates file via `toFile()`
- Builds intensity-specific prompt:
  - **Subtle**: Minimal staging, light tones, slim furniture
  - **Balanced**: Professional staging, sophisticated furniture, layered textures
  - **Bold**: Maximalist, structural paneling, dramatic lighting, deep colors
- Calls `openai.images.edit()` with gpt-image-1 model
- Returns: `{ imageUrl: "data:image/png;base64,..." }`

#### POST `/api/edit-design`
- Receives: `{ imageBase64, instruction }`
- Maintains high detail and professional aesthetic
- Calls `openai.images.edit()` with custom instruction
- Returns edited image as base64

#### Environment Variables
- `AI_INTEGRATIONS_OPENAI_API_KEY`: Auto-managed by Replit
- `AI_INTEGRATIONS_OPENAI_BASE_URL`: Auto-managed by Replit
- `PORT`: Server port (default: 5000)

## Types

### `types.ts`

#### `AppState` enum
```typescript
IDLE                 // Initial upload screen
GENERATING_INITIAL   // Generating 5 designs
SELECTING_DESIGN     // Grid view of designs
EDITING_DESIGN       // Single design editor
UPDATING_DESIGN      // Applying edits
```

#### `DesignIntensity` enum
```typescript
SUBTLE   // Light staging
BALANCED // Professional staging
BOLD     // Dramatic transformation
```

#### `DesignOption` interface
```typescript
{
  id: string        // Unique identifier
  style: string     // One of DESIGN_STYLES
  imageUrl: string  // Base64 data URL
}
```

#### `GitHubUploadParams` interface
```typescript
{
  token: string    // GitHub personal access token
  repo: string     // Repository path (owner/repo)
  path: string     // File path in repo
  message: string  // Commit message
  content: string  // Base64 image data
}
```

#### `DESIGN_STYLES` constant
```typescript
[
  'Maximalist Bohemian',
  'Luxury Art Deco',
  'Modern Farmhouse',
  'European Classic',
  'Contemporary Organic'
]
```

## Configuration

### `vite.config.ts`
- **Dev Server**: Port 5000, host 0.0.0.0
- **Proxy**: `/api` routes to `http://localhost:3001`
- **Plugins**: React plugin for JSX/TSX
- **Aliases**: `@/` resolves to project root

### `tsconfig.json`
- **Target**: ES2022
- **Module**: ESNext with bundler resolution
- **JSX**: react-jsx for automatic runtime
- **Paths**: `@/*` alias for imports
- **Types**: Node.js types included

### `package.json`
**Scripts:**
- `npm run dev`: Start backend (port 3001) and Vite dev server (port 5000)
- `npm run server`: Start backend only
- `npm run build`: Production build
- `npm start`: Production server

**Key Dependencies:**
- `react` ^19.2.3
- `openai` ^6.15.0
- `express` ^5.2.1
- `vite` ^6.2.0
- `typescript` ~5.8.2

## Design Styles

The app generates 5 distinct interior design styles:

1. **Maximalist Bohemian**: Eclectic, layered textures, vibrant colors, global influences
2. **Luxury Art Deco**: Geometric patterns, metallic accents, bold symmetry, 1920s glamour
3. **Modern Farmhouse**: Rustic wood, neutral palette, shiplap, industrial fixtures
4. **European Classic**: Traditional elegance, ornate details, rich fabrics, timeless furniture
5. **Contemporary Organic**: Natural materials, clean lines, earth tones, biophilic design

## User Flow

1. **Upload**: User selects intensity (Subtle/Balanced/Bold) and uploads room photo
2. **Generation**: App sequentially generates 5 designs (one per style) with 2-second delays
3. **Selection**: User views grid, can download/upload any design, or select one for editing
4. **Editing**: User enters natural language instructions to refine the selected design
5. **Export**: User can download final design or upload to GitHub repository

## API Integration

### OpenAI gpt-image-1 Model
- **Generation**: `openai.images.edit()` with original room + style prompt
- **Editing**: `openai.images.edit()` with generated design + instruction
- **Rate Limits**: 2-second delay between sequential generations
- **Image Format**: Base64-encoded PNG returned to client

### GitHub API
- **Endpoint**: `https://api.github.com/repos/{owner}/{repo}/contents/{path}`
- **Method**: PUT with base64 content
- **Authentication**: Bearer token from user
- **Response**: Creates/updates file in repository

## Styling

### Tailwind CSS (CDN)
- **Color Scheme**: Dark mode (zinc palette) with blue accents
- **Glassmorphism**: Backdrop blur effects on modals and header
- **Animations**: Spinner, shimmer, fade-in, zoom-in
- **Typography**: Inter font family
- **Responsive**: Mobile-first with sm:, md: breakpoints

### Custom CSS
```css
.glass: rgba(24, 24, 27, 0.8) with backdrop-filter blur
.loader: Spinning border animation
@keyframes shimmer: Loading placeholder effect
```

## Error Handling

- **Image Compression**: Promise rejection on canvas context failure
- **API Errors**: HTTP status errors caught and displayed to user
- **GitHub Upload**: Token/repo validation errors shown in modal
- **Edit Failures**: Alert prompts user to simplify instruction
- **Connection Issues**: Generic error message with restart button

## Development

```bash
# Install dependencies
npm install

# Start development servers (backend + frontend)
npm run dev

# Backend: http://localhost:3001
# Frontend: http://localhost:5000
```

## Production Deployment

```bash
# Build frontend
npm run build

# Start production server
npm start

# Serves static files from dist/ and API routes
```

## Unused Files

The `.replit_integration_files/` directory contains Replit AI integration utilities that are not currently used in this application:
- **Chat integration**: Pre-built chat storage and OpenAI streaming
- **Batch processing**: Rate-limited batch operations with retries
- **Image utilities**: Alternative image generation helpers

These were included by Replit's AI integrations but the app uses custom implementations in `server.js` instead.

## Environment Setup

This app is designed to run on Replit with auto-configured AI integrations:
- OpenAI API key and base URL are automatically provided
- No manual environment variable setup required
- Port 5000 is publicly accessible via Replit webview

## Future Enhancements

- Multiple image upload and batch processing
- Design history and version comparison
- Custom style training with user examples
- Real-time collaboration and sharing
- Export to CAD or 3D modeling formats
