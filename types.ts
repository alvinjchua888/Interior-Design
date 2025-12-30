export enum AppState {
  IDLE = 'IDLE',
  GENERATING_INITIAL = 'GENERATING_INITIAL',
  SELECTING_DESIGN = 'SELECTING_DESIGN',
  EDITING_DESIGN = 'EDITING_DESIGN',
  UPDATING_DESIGN = 'UPDATING_DESIGN'
}

export enum DesignIntensity {
  SUBTLE = 'Subtle',
  BALANCED = 'Balanced',
  BOLD = 'Bold'
}

export interface DesignOption {
  id: string;
  style: string;
  imageUrl: string;
}

export interface GitHubUploadParams {
  token: string;
  repo: string;
  path: string;
  message: string;
  content: string;
}

export const DESIGN_STYLES = [
  'Maximalist Bohemian',
  'Luxury Art Deco',
  'Modern Farmhouse',
  'European Classic',
  'Contemporary Organic'
];
