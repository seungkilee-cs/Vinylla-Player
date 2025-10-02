# Vinylla Player Implementation Roadmap

## Current Capabilities
- **Static playback UI**
  - Neon-styled player console with rotating vinyl animation, tone arm, and playback controls.
  - Displays currently loaded track title, artist, progress bar with current/duration timestamps, and volume control.
- **Audio library and queue**
  - Client-side `library` array in `script.js` provides track metadata and references to local `assets/audio/` files.
  - Playlist pane supports sorting by default order, title, or artist and highlights the active track.
  - Total runtime is calculated dynamically from the library data.
- **Playback controls**
  - Play/pause toggling with visual state sync, previous/next track navigation, shuffle and repeat modes.
  - Five-second skip backward/forward buttons and keyboard shortcuts for playback and volume adjustments.
  - Volume slider persists the last value via `localStorage`.
- **Visual polish**
  - Responsive layout that keeps the full console visible without scroll on standard desktop breakpoints.
  - Console footer chip buttons prepared for future automation actions.
  - Consistent record label sizing and album art display.

## Proposed Enhancements
### 1. Offline Library Management
- **Goal**: Allow users to keep their personal tracks accessible in-browser between sessions.
- **Implementation Plan**:
  - Integrate File System Access API (with fallback to `IndexedDB`) to select and cache audio files locally.
  - Store basic metadata (title, artist, cover art) alongside file handles or blobs.
  - Update initialization flow to load cached tracks before default library.

### 2. Playlist Authoring & Export
- **Goal**: Users curate multiple playlists and share or re-import them.
- **Implementation Plan**:
  - Design a playlist manager UI (create, rename, delete, reorder tracks).
  - Persist playlists in `IndexedDB` or `localStorage` keyed by playlist ID.
  - Provide export/import actions (JSON download/upload) that bundle track metadata and references.

### 3. Metadata Editing Tools
- **Goal**: Empower users to edit track details without modifying source files.
- **Implementation Plan**:
  - Add an “Edit metadata” modal for title, artist, album art, and optional notes.
  - Support drag-and-drop cover uploads stored as data URLs or object URLs.
  - Sync edits back to persisted playlist/library entries.

### 4. Theming & Customization
- **Goal**: Personalize the visual experience.
- **Implementation Plan**:
  - Expose `CSS` custom property presets (e.g., Midnight, Sunset, Retro).
  - Provide a theme editor panel to tweak colors, gradients, and noise overlays with live preview.
  - Persist selected theme per user via `localStorage` and allow export/import of theme JSON.

### 5. Advanced Playback Features
- **Goal**: Enhance the listening experience with more control.
- **Implementation Plan**:
  - Add crossfade and gapless toggles leveraging Web Audio API nodes.
  - Implement playback speed control slider (0.5x–2x) with pitch preservation.
  - Build an equalizer preset system using biquad filters.

### 6. Analytics & Insights
- **Goal**: Surface listening stats locally.
- **Implementation Plan**:
  - Track play counts, last played timestamps, and cumulative listening time per track.
  - Display stats in the queue panel and an optional insights modal.
  - Provide filters/sorting based on play frequency or recency.

### 7. Visualizer Modes
- **Goal**: Offer richer visuals.
- **Implementation Plan**:
  - Use the Web Audio API analyser node to feed spectrum/waveform visualizations.
  - Allow switching between vinyl, spectrum, and minimalist modes.
  - Optimize canvas rendering for performance on lower-end devices.

### 8. Progressive Web App (PWA) Upgrade
- **Goal**: Installable, offline-first experience.
- **Implementation Plan**:
  - Add a `manifest.json` with icons, theme colors, and offline start URL.
  - Implement a service worker caching strategy for static assets and user-added audio (where permitted).
  - Prompt users to install the app and document storage limitations.

### 9. Sharing & Collaboration
- **Goal**: Make playlist sharing frictionless without a backend.
- **Implementation Plan**:
  - Generate shareable bundles (ZIP containing playlist JSON + optional cover art) for manual distribution.
  - Support reading shared bundles via drag-and-drop, merging with existing library.
  - Add conflict resolution UI when imported tracks already exist.
