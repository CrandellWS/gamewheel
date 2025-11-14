export type AIProvider = 'google-imagen' | 'openai-dalle' | 'stability-ai' | 'local';

export interface AIImageConfig {
  provider: AIProvider;
  prompt: string;
  style?: string;
  size?: '512x512' | '1024x1024';
  authenticated: boolean;
}

export interface OAuthConfig {
  clientId: string;
  scopes: string[];
  redirectUri: string;
}

export interface AIProviderStatus {
  isAuthenticated: boolean;
  apiKeySet?: boolean;
  lastError?: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  provider: AIProvider;
  timestamp: number;
  style?: string;
}

export interface AISettings {
  openaiApiKey?: string;
  googleAccessToken?: string;
  stabilityApiKey?: string;
  recentPrompts: string[];
  generatedImages: GeneratedImage[];
}

// Style presets for different providers
export const STYLE_PRESETS = {
  'photo-realistic': 'Photo-realistic, high quality, detailed',
  'artistic': 'Artistic, painterly, creative interpretation',
  'abstract': 'Abstract, geometric, modern art style',
  'gaming': 'Video game art style, vibrant colors, stylized',
  'cartoon': 'Cartoon style, colorful, playful',
  'cyberpunk': 'Cyberpunk, neon lights, futuristic',
  'fantasy': 'Fantasy art, magical, ethereal',
  'minimalist': 'Minimalist, clean, simple design',
} as const;

export type StylePreset = keyof typeof STYLE_PRESETS;

// Provider-specific configurations
export const PROVIDER_CONFIGS = {
  'google-imagen': {
    name: 'Google Imagen',
    requiresOAuth: true,
    requiresApiKey: false,
    scopes: ['https://www.googleapis.com/auth/generative-language'],
    apiEndpoint: 'https://generativelanguage.googleapis.com/v1/models/imagegeneration-001:predict',
  },
  'openai-dalle': {
    name: 'OpenAI DALL-E',
    requiresOAuth: false,
    requiresApiKey: true,
    apiEndpoint: 'https://api.openai.com/v1/images/generations',
  },
  'stability-ai': {
    name: 'Stability AI',
    requiresOAuth: false,
    requiresApiKey: true,
    apiEndpoint: 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
  },
  'local': {
    name: 'Local Model',
    requiresOAuth: false,
    requiresApiKey: false,
    apiEndpoint: 'http://localhost:7860/sdapi/v1/txt2img',
  },
} as const;

// OAuth configuration for Google
export const GOOGLE_OAUTH_CONFIG = {
  clientId: '', // User must configure this
  authEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  scopes: ['https://www.googleapis.com/auth/generative-language'],
};
