'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Wand2, Image as ImageIcon, Loader2, AlertCircle, Download, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  AIProvider,
  StylePreset,
  STYLE_PRESETS,
  PROVIDER_CONFIGS,
  GeneratedImage,
  AIProviderStatus,
} from '../types/ai-integration';

interface AIImageGeneratorProps {
  onClose: () => void;
  onImageGenerated?: (imageUrl: string, applyTo: 'page' | 'wheel') => void;
}

export function AIImageGenerator({ onClose, onImageGenerated }: AIImageGeneratorProps) {
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>('openai-dalle');
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<StylePreset>('gaming');
  const [imageSize, setImageSize] = useState<'512x512' | '1024x1024'>('1024x1024');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [providerStatus, setProviderStatus] = useState<Record<AIProvider, AIProviderStatus>>({
    'google-imagen': { isAuthenticated: false },
    'openai-dalle': { isAuthenticated: false, apiKeySet: false },
    'stability-ai': { isAuthenticated: false, apiKeySet: false },
    'local': { isAuthenticated: true },
  });

  // API Keys stored in sessionStorage (cleared on browser close)
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [stabilityApiKey, setStabilityApiKey] = useState('');
  const [googleClientId, setGoogleClientId] = useState('');

  // Load stored credentials from sessionStorage on mount
  useEffect(() => {
    const storedOpenAI = sessionStorage.getItem('ai_openai_key');
    const storedStability = sessionStorage.getItem('ai_stability_key');
    const storedGoogleToken = sessionStorage.getItem('ai_google_token');
    const storedGoogleClientId = sessionStorage.getItem('ai_google_client_id');

    if (storedOpenAI) {
      setOpenaiApiKey(storedOpenAI);
      setProviderStatus(prev => ({
        ...prev,
        'openai-dalle': { isAuthenticated: true, apiKeySet: true }
      }));
    }

    if (storedStability) {
      setStabilityApiKey(storedStability);
      setProviderStatus(prev => ({
        ...prev,
        'stability-ai': { isAuthenticated: true, apiKeySet: true }
      }));
    }

    if (storedGoogleToken) {
      setProviderStatus(prev => ({
        ...prev,
        'google-imagen': { isAuthenticated: true }
      }));
    }

    if (storedGoogleClientId) {
      setGoogleClientId(storedGoogleClientId);
    }
  }, []);

  // Save API key to sessionStorage
  const saveApiKey = (provider: AIProvider, key: string) => {
    if (!key.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }

    if (provider === 'openai-dalle') {
      sessionStorage.setItem('ai_openai_key', key);
      setOpenaiApiKey(key);
      setProviderStatus(prev => ({
        ...prev,
        'openai-dalle': { isAuthenticated: true, apiKeySet: true }
      }));
      toast.success('OpenAI API key saved for this session');
    } else if (provider === 'stability-ai') {
      sessionStorage.setItem('ai_stability_key', key);
      setStabilityApiKey(key);
      setProviderStatus(prev => ({
        ...prev,
        'stability-ai': { isAuthenticated: true, apiKeySet: true }
      }));
      toast.success('Stability AI API key saved for this session');
    }
  };

  // Clear API key
  const clearApiKey = (provider: AIProvider) => {
    if (provider === 'openai-dalle') {
      sessionStorage.removeItem('ai_openai_key');
      setOpenaiApiKey('');
      setProviderStatus(prev => ({
        ...prev,
        'openai-dalle': { isAuthenticated: false, apiKeySet: false }
      }));
      toast.success('OpenAI API key cleared');
    } else if (provider === 'stability-ai') {
      sessionStorage.removeItem('ai_stability_key');
      setStabilityApiKey('');
      setProviderStatus(prev => ({
        ...prev,
        'stability-ai': { isAuthenticated: false, apiKeySet: false }
      }));
      toast.success('Stability AI API key cleared');
    } else if (provider === 'google-imagen') {
      sessionStorage.removeItem('ai_google_token');
      setProviderStatus(prev => ({
        ...prev,
        'google-imagen': { isAuthenticated: false }
      }));
      toast.success('Google OAuth token cleared');
    }
  };

  // Google OAuth login (client-side)
  const handleGoogleLogin = () => {
    if (!googleClientId.trim()) {
      toast.error('Please enter your Google OAuth Client ID first');
      return;
    }

    sessionStorage.setItem('ai_google_client_id', googleClientId);

    const redirectUri = window.location.origin + window.location.pathname;
    const scopes = PROVIDER_CONFIGS['google-imagen'].scopes.join(' ');
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(googleClientId)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=token&` +
      `scope=${encodeURIComponent(scopes)}`;

    // Open OAuth in popup
    const popup = window.open(authUrl, 'Google OAuth', 'width=600,height=700');

    // Listen for OAuth callback
    const checkPopup = setInterval(() => {
      try {
        if (popup?.closed) {
          clearInterval(checkPopup);
        }

        const hash = popup?.location.hash;
        if (hash && hash.includes('access_token')) {
          const params = new URLSearchParams(hash.substring(1));
          const token = params.get('access_token');

          if (token) {
            sessionStorage.setItem('ai_google_token', token);
            setProviderStatus(prev => ({
              ...prev,
              'google-imagen': { isAuthenticated: true }
            }));
            toast.success('Google authentication successful!');
            popup?.close();
            clearInterval(checkPopup);
          }
        }
      } catch (e) {
        // Cross-origin errors are expected
      }
    }, 500);
  };

  // Generate image based on provider
  const generateImage = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    const provider = selectedProvider;
    const config = PROVIDER_CONFIGS[provider];

    // Check authentication
    if (provider === 'openai-dalle' && !openaiApiKey) {
      toast.error('Please set your OpenAI API key first');
      return;
    }

    if (provider === 'stability-ai' && !stabilityApiKey) {
      toast.error('Please set your Stability AI API key first');
      return;
    }

    if (provider === 'google-imagen' && !providerStatus['google-imagen'].isAuthenticated) {
      toast.error('Please authenticate with Google first');
      return;
    }

    setIsGenerating(true);
    const fullPrompt = `${prompt}. Style: ${STYLE_PRESETS[selectedStyle]}`;

    try {
      let imageUrl = '';

      if (provider === 'openai-dalle') {
        // OpenAI DALL-E API
        const response = await fetch('https://api.openai.com/v1/images/generations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiApiKey}`,
          },
          body: JSON.stringify({
            model: 'dall-e-3',
            prompt: fullPrompt,
            n: 1,
            size: imageSize,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || 'Failed to generate image');
        }

        const data = await response.json();
        imageUrl = data.data[0].url;

      } else if (provider === 'stability-ai') {
        // Stability AI API
        const [width, height] = imageSize.split('x').map(Number);
        const response = await fetch(config.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${stabilityApiKey}`,
          },
          body: JSON.stringify({
            text_prompts: [{ text: fullPrompt }],
            cfg_scale: 7,
            height,
            width,
            samples: 1,
            steps: 30,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate image with Stability AI');
        }

        const data = await response.json();
        // Convert base64 to blob URL
        const base64Image = data.artifacts[0].base64;
        const blob = await fetch(`data:image/png;base64,${base64Image}`).then(r => r.blob());
        imageUrl = URL.createObjectURL(blob);

      } else if (provider === 'google-imagen') {
        // Google Imagen API
        const token = sessionStorage.getItem('ai_google_token');
        const response = await fetch(config.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            instances: [{ prompt: fullPrompt }],
            parameters: {
              sampleCount: 1,
            },
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate image with Google Imagen');
        }

        const data = await response.json();
        imageUrl = data.predictions[0].bytesBase64Encoded;
        // Convert to blob URL
        const blob = await fetch(`data:image/png;base64,${imageUrl}`).then(r => r.blob());
        imageUrl = URL.createObjectURL(blob);

      } else if (provider === 'local') {
        // Local Stable Diffusion (Automatic1111 API)
        const [width, height] = imageSize.split('x').map(Number);
        const response = await fetch(config.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: fullPrompt,
            negative_prompt: 'blurry, low quality',
            steps: 20,
            width,
            height,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate image with local model. Make sure Automatic1111 is running.');
        }

        const data = await response.json();
        const base64Image = data.images[0];
        const blob = await fetch(`data:image/png;base64,${base64Image}`).then(r => r.blob());
        imageUrl = URL.createObjectURL(blob);
      }

      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt,
        provider,
        timestamp: Date.now(),
        style: selectedStyle,
      };

      setGeneratedImage(newImage);
      toast.success('Image generated successfully!');

    } catch (error) {
      console.error('Image generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate image');
      setProviderStatus(prev => ({
        ...prev,
        [provider]: { ...prev[provider], lastError: error instanceof Error ? error.message : 'Unknown error' }
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyImage = (target: 'page' | 'wheel') => {
    if (!generatedImage) return;

    onImageGenerated?.(generatedImage.url, target);
    toast.success(`Image applied to ${target} background!`);
  };

  const downloadImage = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-generated-${generatedImage.id}.png`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Image downloaded!');
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  const providerConfig = PROVIDER_CONFIGS[selectedProvider];
  const isAuthenticated = providerStatus[selectedProvider].isAuthenticated;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Wand2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              AI Image Generator
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Security Warning */}
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-1">
                  Security Notice
                </h4>
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  API keys are stored in sessionStorage and will be cleared when you close your browser.
                  Never share your API keys. All requests are made client-side from your browser.
                </p>
              </div>
            </div>
          </div>

          {/* Provider Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              AI Provider
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(PROVIDER_CONFIGS) as AIProvider[]).map((provider) => {
                const config = PROVIDER_CONFIGS[provider];
                const status = providerStatus[provider];

                return (
                  <button
                    key={provider}
                    onClick={() => setSelectedProvider(provider)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedProvider === provider
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {config.name}
                      </span>
                      {status.isAuthenticated && (
                        <Check className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 text-left">
                      {config.requiresOAuth ? 'OAuth Required' : config.requiresApiKey ? 'API Key Required' : 'No Auth'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Authentication Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Authentication
            </h3>

            {selectedProvider === 'openai-dalle' && (
              <div className="space-y-3">
                {!isAuthenticated ? (
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={openaiApiKey}
                      onChange={(e) => setOpenaiApiKey(e.target.value)}
                      placeholder="Enter your OpenAI API key (sk-...)"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                               focus:ring-2 focus:ring-purple-500 focus:border-transparent
                               dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      onClick={() => saveApiKey('openai-dalle', openaiApiKey)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700
                               transition-colors"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20
                                rounded-lg border border-green-200 dark:border-green-800">
                    <span className="text-sm text-green-800 dark:text-green-200">
                      API key is set
                    </span>
                    <button
                      onClick={() => clearApiKey('openai-dalle')}
                      className="text-sm text-red-600 dark:text-red-400 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Get your API key from{' '}
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    OpenAI Platform
                  </a>
                </p>
              </div>
            )}

            {selectedProvider === 'stability-ai' && (
              <div className="space-y-3">
                {!isAuthenticated ? (
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={stabilityApiKey}
                      onChange={(e) => setStabilityApiKey(e.target.value)}
                      placeholder="Enter your Stability AI API key"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                               focus:ring-2 focus:ring-purple-500 focus:border-transparent
                               dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      onClick={() => saveApiKey('stability-ai', stabilityApiKey)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700
                               transition-colors"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20
                                rounded-lg border border-green-200 dark:border-green-800">
                    <span className="text-sm text-green-800 dark:text-green-200">
                      API key is set
                    </span>
                    <button
                      onClick={() => clearApiKey('stability-ai')}
                      className="text-sm text-red-600 dark:text-red-400 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Get your API key from{' '}
                  <a
                    href="https://platform.stability.ai/account/keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    Stability AI Platform
                  </a>
                </p>
              </div>
            )}

            {selectedProvider === 'google-imagen' && (
              <div className="space-y-3">
                {!isAuthenticated ? (
                  <>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={googleClientId}
                        onChange={(e) => setGoogleClientId(e.target.value)}
                        placeholder="Enter your Google OAuth Client ID"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                                 focus:ring-2 focus:ring-purple-500 focus:border-transparent
                                 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        onClick={handleGoogleLogin}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                                 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Sign in with Google
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Setup OAuth at{' '}
                      <a
                        href="https://console.cloud.google.com/apis/credentials"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 dark:text-purple-400 hover:underline"
                      >
                        Google Cloud Console
                      </a>
                    </p>
                  </>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20
                                rounded-lg border border-green-200 dark:border-green-800">
                    <span className="text-sm text-green-800 dark:text-green-200">
                      Authenticated with Google
                    </span>
                    <button
                      onClick={() => clearApiKey('google-imagen')}
                      className="text-sm text-red-600 dark:text-red-400 hover:underline"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {selectedProvider === 'local' && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Local model requires Automatic1111 WebUI running at http://localhost:7860
                </p>
              </div>
            )}
          </div>

          {/* Prompt Input */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Image Prompt
            </h3>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate... (e.g., 'A spinning wheel in a fantasy game with magical effects')"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg
                       focus:ring-2 focus:ring-purple-500 focus:border-transparent
                       dark:bg-gray-700 dark:text-white resize-none"
            />
          </div>

          {/* Style Presets */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Style Preset
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(Object.keys(STYLE_PRESETS) as StylePreset[]).map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedStyle === style
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {style.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Image Size */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Image Size
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => setImageSize('512x512')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  imageSize === '512x512'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                512x512
              </button>
              <button
                onClick={() => setImageSize('1024x1024')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                  imageSize === '1024x1024'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                1024x1024
              </button>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateImage}
            disabled={isGenerating || !isAuthenticated || !prompt.trim()}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white
                     rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700
                     transition-all disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Generate Image
              </>
            )}
          </button>

          {/* Generated Image Preview */}
          {generatedImage && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Generated Image
              </h3>
              <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
                <img
                  src={generatedImage.url}
                  alt={generatedImage.prompt}
                  className="w-full h-auto"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleApplyImage('page')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                           transition-colors flex items-center justify-center gap-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  Page BG
                </button>
                <button
                  onClick={() => handleApplyImage('wheel')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700
                           transition-colors flex items-center justify-center gap-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  Wheel BG
                </button>
                <button
                  onClick={downloadImage}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700
                           transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
