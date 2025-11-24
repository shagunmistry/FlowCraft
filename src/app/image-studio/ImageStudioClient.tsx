'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PhotoIcon, 
  SparklesIcon, 
  ArrowPathIcon,
  CloudArrowUpIcon,
  PencilSquareIcon,
  EyeIcon,
  ShareIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { WandIcon, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { User } from '@supabase/supabase-js';
import Navbar from '@/components/Navbar';

type ImageMode = 'generate' | 'edit';

interface ImageStudioClientProps {
  user: User;
}

export default function ImageStudioClient({ user }: ImageStudioClientProps) {
  const [mode, setMode] = useState<ImageMode>('generate');
  const [prompt, setPrompt] = useState('');
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatios = [
    { label: 'Square (1:1)', value: '1:1' },
    { label: 'Portrait (9:16)', value: '9:16' },
    { label: 'Landscape (16:9)', value: '16:9' },
    { label: 'Story (4:5)', value: '4:5' },
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setInputImage(e.target?.result as string);
        setMode('edit');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    if (mode === 'edit' && !inputImage) {
      toast.error('Please upload an image to edit');
      return;
    }

    setIsGenerating(true);
    try {
      const endpoint = mode === 'generate' ? '/api/generate-image' : '/api/edit-image';
      const requestBody = {
        prompt,
        aspect_ratio: aspectRatio,
        output_format: 'jpg',
        safety_tolerance: 2,
        is_public: false,
        ...(mode === 'edit' && { input_image: inputImage }),
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${mode} image`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setGeneratedImage(data.image_url);
      toast.success(`Image ${mode === 'generate' ? 'generated' : 'edited'} successfully!`);
    } catch (error) {
      toast.error(`Failed to ${mode} image. Please try again.`);
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'flowcraft-generated-image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const clearAll = () => {
    setPrompt('');
    setInputImage(null);
    setGeneratedImage(null);
    setMode('generate');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-red-50">
      {/* Navigation */}
      <Navbar />
      
      {/* Page Header */}
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <SparklesIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-600 bg-clip-text text-transparent mb-2">
              Image Studio
            </h1>
            <p className="text-lg text-gray-600">Generate and edit images with AI</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Control Panel */}
          <div className="space-y-6">
            {/* Mode Selection */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Mode</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMode('generate')}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                    mode === 'generate'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <SparklesIcon className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium">Generate</div>
                  <div className="text-xs opacity-75">Create from text</div>
                </button>
                {/* <button
                  onClick={() => setMode('edit')}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                    mode === 'edit'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <PencilSquareIcon className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium">Edit</div>
                  <div className="text-xs opacity-75">Transform images</div>
                </button> */}
              </div>
            </div>

            {/* Image Upload for Edit Mode */}
            <AnimatePresence>
              {mode === 'edit' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Image</h3>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-red-400 hover:bg-red-50/50 transition-all duration-200"
                  >
                    {inputImage ? (
                      <div className="space-y-3">
                        <img
                          src={inputImage}
                          alt="Uploaded"
                          className="max-w-full max-h-32 mx-auto rounded-xl object-contain"
                        />
                        <p className="text-sm text-gray-600">Click to change image</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <CloudArrowUpIcon className="w-12 h-12 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-lg font-medium text-gray-900">Upload an image</p>
                          <p className="text-sm text-gray-500">PNG, JPG, GIF, or WebP</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Prompt Input */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {mode === 'generate' ? 'Describe your image' : 'How should we edit it?'}
              </h3>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  mode === 'generate'
                    ? 'A serene mountain landscape at sunset with vibrant colors...'
                    : 'Make this a 90s cartoon style, change the background to a beach...'
                }
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Aspect Ratio Selection */}
            {mode === 'generate' && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Aspect Ratio</h3>
                <div className="grid grid-cols-2 gap-3">
                  {aspectRatios.map((ratio) => (
                    <button
                      key={ratio.value}
                      onClick={() => setAspectRatio(ratio.value)}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 text-sm ${
                        aspectRatio === ratio.value
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {ratio.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Generate Button */}
            <motion.button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim() || (mode === 'edit' && !inputImage)}
              className="w-full bg-gradient-to-r from-red-600 to-red-600 text-white py-4 px-6 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center space-x-2">
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <WandIcon className="w-5 h-5" />
                  <span>{mode === 'generate' ? 'Generate Image' : 'Edit Image'}</span>
                </div>
              )}
            </motion.button>

            {/* Clear Button */}
            {(inputImage || generatedImage || prompt) && (
              <button
                onClick={clearAll}
                className="w-full py-3 px-6 border border-gray-300 text-gray-700 rounded-2xl font-medium hover:bg-gray-50 transition-all duration-200"
              >
                <div className="flex items-center justify-center space-x-2">
                  <XMarkIcon className="w-5 h-5" />
                  <span>Clear All</span>
                </div>
              </button>
            )}
          </div>

          {/* Preview Panel */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
              {generatedImage && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleDownload}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  {/* <button
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    title="Share"
                  >
                    <ShareIcon className="w-5 h-5" />
                  </button> */}
                </div>
              )}
            </div>
            
            <div className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="text-center space-y-6"
                  >
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-red-200 rounded-full animate-spin mx-auto">
                        <div className="w-full h-full border-4 border-transparent border-t-red-600 rounded-full"></div>
                      </div>
                      <motion.div
                        className="absolute inset-0 w-20 h-20 mx-auto"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      >
                        <SparklesIcon className="w-8 h-8 text-red-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      </motion.div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-gray-700">
                        {mode === 'generate' ? 'Generating your image...' : 'Editing your image...'}
                      </p>
                      <motion.div
                        className="flex justify-center space-x-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-red-400 rounded-full"
                            animate={{ y: [0, -8, 0] }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              delay: i * 0.2,
                              ease: "easeInOut"
                            }}
                          />
                        ))}
                      </motion.div>
                    </div>
                  </motion.div>
                ) : generatedImage ? (
                  <motion.img
                    key="generated"
                    src={generatedImage}
                    alt="Generated"
                    className="w-full h-full object-contain"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-center space-y-4"
                  >
                    <PhotoIcon className="w-16 h-16 text-gray-300 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-500">Your image will appear here</p>
                      <p className="text-sm text-gray-400">
                        {mode === 'generate' ? 'Enter a prompt to get started' : 'Upload an image and add editing instructions'}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* User Info Banner */}
        <div className="mt-12 bg-gradient-to-r from-red-600 to-red-600 rounded-3xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">AI Image Studio</h3>
          <p className="text-red-100 mb-4">
            Generate and edit unlimited images with our AI-powered studio.
          </p>
        </div>
      </div>
    </div>
  );
}