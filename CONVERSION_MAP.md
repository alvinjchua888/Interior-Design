# Conversion Map: TypeScript → Python

This document maps the conversion from the original React/TypeScript codebase to the new Python/Streamlit implementation.

## Architecture Comparison

### Before (React/TypeScript/Node.js)
```
Interior-Design/
├── components/
│   ├── DesignEditor.tsx
│   ├── DesignGrid.tsx
│   ├── GitHubUploadModal.tsx
│   ├── Header.tsx
│   └── ImageUploader.tsx
├── services/
│   ├── geminiService.ts
│   ├── githubService.ts
│   └── imageUtils.ts
├── App.tsx
├── index.tsx
├── types.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

### After (Python/Streamlit)
```
Interior-Design/
├── app.py                  # Main Streamlit app (combines all components)
├── gemini_service.py       # Gemini AI integration
├── github_service.py       # GitHub API integration
├── image_utils.py          # Image processing utilities
├── validate.py             # Module validation tests
├── requirements.txt        # Python dependencies
├── .env.example           # Environment configuration template
├── QUICKSTART.md          # Quick start guide
└── README.md              # Updated documentation
```

## File-by-File Conversion

### Services Layer

| TypeScript File | → | Python File | Notes |
|----------------|---|-------------|-------|
| `services/geminiService.ts` | → | `gemini_service.py` | Converted Google GenAI SDK calls to Python API |
| `services/githubService.ts` | → | `github_service.py` | Converted fetch API to requests library |
| `services/imageUtils.ts` | → | `image_utils.py` | Converted canvas-based compression to Pillow |

### UI Components

| TypeScript Component | → | Python Implementation | Location |
|---------------------|---|----------------------|----------|
| `components/ImageUploader.tsx` | → | `show_image_uploader()` | `app.py:174-217` |
| `components/DesignGrid.tsx` | → | `show_design_grid()` | `app.py:244-277` |
| `components/DesignEditor.tsx` | → | `show_design_editor()` | `app.py:280-323` |
| `components/GitHubUploadModal.tsx` | → | `show_github_upload_modal()` | `app.py:326-360` |
| `components/Header.tsx` | → | Header section | `app.py:165-171` |
| `App.tsx` | → | `main()` function | `app.py:151-162` |

### Type Definitions

| TypeScript | → | Python | Notes |
|-----------|---|--------|-------|
| `types.ts: AppState enum` | → | Session state strings | Streamlit's session_state |
| `types.ts: DesignIntensity enum` | → | `gemini_service.py: DesignIntensity` | Python class with string constants |
| `types.ts: DesignOption interface` | → | Dictionary with keys: 'id', 'style', 'image_url' | Python dict |
| `types.ts: DESIGN_STYLES array` | → | `app.py: DESIGN_STYLES` | Python list |

### Configuration

| Before | → | After | Notes |
|--------|---|-------|-------|
| `package.json` | → | `requirements.txt` | npm → pip |
| `tsconfig.json` | → | N/A | Not needed for Python |
| `vite.config.ts` | → | N/A | Streamlit handles bundling |
| `.env.local` | → | `.env` | Same concept, Python dotenv |

## Key Technical Changes

### 1. State Management
- **Before**: React hooks (`useState`, `useEffect`)
- **After**: Streamlit session state (`st.session_state`)

### 2. UI Framework
- **Before**: React components with JSX, Tailwind CSS
- **After**: Streamlit widgets with custom CSS via `st.markdown()`

### 3. API Calls
- **Before**: Async/await with fetch API or SDK methods
- **After**: Synchronous calls with requests library and google-generativeai SDK

### 4. Image Processing
- **Before**: Browser Canvas API for compression
- **After**: Pillow (PIL) for server-side image processing

### 5. Routing/Navigation
- **Before**: React component state switching
- **After**: Streamlit page rerun with state management

### 6. Build System
- **Before**: Vite bundler, TypeScript compiler
- **After**: No build step needed, Streamlit runs directly

## Functionality Mapping

### Image Upload Flow
```
Before:
User uploads → FileReader → Canvas → Base64 → Compress → State

After:
User uploads → Pillow → JPEG → Base64 → Session State
```

### Design Generation Flow
```
Before:
Promise.allSettled() → Multiple async calls → Update state on completion

After:
Sequential loop with progress bar → Update session state → Rerun
```

### Design Editing Flow
```
Before:
Input change → setState → Submit → async call → setState with new image

After:
Input → Submit → Spinner → API call → Update session state → Rerun
```

### GitHub Upload Flow
```
Before:
Modal component → Form state → fetch API → Success callback

After:
Form in main flow → Session storage → requests library → Success message
```

## Dependencies Comparison

### Before (Node.js)
- `react` / `react-dom` (19.2.3)
- `@google/genai` (1.34.0)
- `vite` (6.2.0)
- `typescript` (5.8.2)
- `@vitejs/plugin-react` (5.0.0)

### After (Python)
- `streamlit` (1.40.2)
- `google-generativeai` (0.8.3)
- `pillow` (11.0.0)
- `requests` (2.32.3)
- `python-dotenv` (1.0.1)

## Lines of Code Comparison

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Total lines | ~1,100 | ~900 | -18% |
| Service files | ~150 | ~250 | +67% (more explicit) |
| UI code | ~700 | ~450 | -36% (Streamlit simplification) |
| Config files | ~100 | ~50 | -50% |
| Dependencies | 9 direct | 5 direct | -44% |

## Benefits of Python/Streamlit Implementation

1. **Simpler Architecture**: No build step, no bundler, no TypeScript compiler
2. **Faster Development**: Streamlit's hot reload and built-in widgets
3. **Easier Deployment**: Single Python command to run
4. **Better AI Integration**: Native Python support for ML/AI libraries
5. **Reduced Dependencies**: Fewer packages to maintain
6. **Server-Side Processing**: Better control over image processing
7. **Cleaner State Management**: Streamlit's session state is more intuitive

## Preserved Features

✅ All original features maintained:
- Image upload with compression
- Three intensity levels
- Five design style variations
- AI-powered editing
- Download functionality
- GitHub integration
- Responsive UI
- Error handling
- Loading states

## Additional Improvements

1. **Documentation**: Added QUICKSTART.md for better onboarding
2. **Validation**: Created validate.py for testing
3. **Error Messages**: More descriptive error handling
4. **Code Organization**: Clear separation of concerns
5. **Comments**: Better inline documentation
6. **Type Safety**: Python type hints added where appropriate
