'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PhotoIcon,
  SparklesIcon,
  ArrowPathIcon,
  CloudArrowUpIcon,
  PencilSquareIcon,
  EyeIcon,
  ShareIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { WandIcon, Download } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { User } from '@supabase/supabase-js'
import Navbar from '@/components/Navbar'

type ImageMode = 'generate' | 'edit'

interface ImageStudioClientProps {
  user: User
}

export default function ImageStudioClient({ user }: ImageStudioClientProps) {
  const [mode, setMode] = useState<ImageMode>('generate')
  const [prompt, setPrompt] = useState('')
  const [inputImage, setInputImage] = useState<string | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const aspectRatios = [
    { label: 'Square (1:1)', value: '1:1' },
    { label: 'Portrait (9:16)', value: '9:16' },
    { label: 'Landscape (16:9)', value: '16:9' },
    { label: 'Story (4:5)', value: '4:5' },
  ]

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setInputImage(e.target?.result as string)
        setMode('edit')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    if (mode === 'edit' && !inputImage) {
      toast.error('Please upload an image to edit')
      return
    }

    setIsGenerating(true)
    try {
      const endpoint =
        mode === 'generate' ? '/api/generate-image' : '/api/edit-image'
      const requestBody = {
        prompt,
        aspect_ratio: aspectRatio,
        output_format: 'jpg',
        safety_tolerance: 2,
        is_public: false,
        ...(mode === 'edit' && { input_image: inputImage }),
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${mode} image`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setGeneratedImage(data.image_url)
      toast.success(
        `Image ${mode === 'generate' ? 'generated' : 'edited'} successfully!`,
      )
    } catch (error) {
      toast.error(`Failed to ${mode} image. Please try again.`)
      console.error('Generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a')
      link.href = generatedImage
      link.download = 'flowcraft-generated-image.jpg'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const clearAll = () => {
    setPrompt('')
    setInputImage(null)
    setGeneratedImage(null)
    setMode('generate')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-red-50">
      {/* Navigation */}
      <Navbar />

      {/* Page Header */}
      <div className="pb-8 pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-600">
              <SparklesIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="mb-2 bg-gradient-to-r from-red-600 to-red-600 bg-clip-text text-4xl font-bold text-transparent">
              Image Studio
            </h1>
            <p className="text-lg text-gray-600">Generate images with AI</p>
            <div className="mt-2 flex items-center justify-center space-x-2">
              <PencilSquareIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm italic text-gray-400">
                Edit functionality coming soon
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Control Panel */}
          <div className="space-y-6">
            {/* Mode Selection */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Create Mode
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMode('generate')}
                  className={`rounded-2xl border-2 p-4 transition-all duration-200 ${
                    mode === 'generate'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <SparklesIcon className="mx-auto mb-2 h-6 w-6" />
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
                  className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
                >
                  <h3 className="mb-4 text-lg font-semibold text-gray-900">
                    Upload Image
                  </h3>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 p-8 text-center transition-all duration-200 hover:border-red-400 hover:bg-red-50/50"
                  >
                    {inputImage ? (
                      <div className="space-y-3">
                        <img
                          src={inputImage}
                          alt="Uploaded"
                          className="mx-auto max-h-32 max-w-full rounded-xl object-contain"
                        />
                        <p className="text-sm text-gray-600">
                          Click to change image
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div>
                          <p className="text-lg font-medium text-gray-900">
                            Upload an image
                          </p>
                          <p className="text-sm text-gray-500">
                            PNG, JPG, GIF, or WebP
                          </p>
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
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                {mode === 'generate'
                  ? 'Describe your image'
                  : 'How should we edit it?'}
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
                className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Aspect Ratio Selection */}
            {mode === 'generate' && (
              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Aspect Ratio
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {aspectRatios.map((ratio) => (
                    <button
                      key={ratio.value}
                      onClick={() => setAspectRatio(ratio.value)}
                      className={`rounded-xl border-2 p-3 text-sm transition-all duration-200 ${
                        aspectRatio === ratio.value
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
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
              disabled={
                isGenerating ||
                !prompt.trim() ||
                (mode === 'edit' && !inputImage)
              }
              className="w-full rounded-2xl bg-gradient-to-r from-red-600 to-red-600 px-6 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center space-x-2">
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  <span>Generating...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <WandIcon className="h-5 w-5" />
                  <span>
                    {mode === 'generate' ? 'Generate Image' : 'Edit Image'}
                  </span>
                </div>
              )}
            </motion.button>

            {/* Clear Button */}
            {(inputImage || generatedImage || prompt) && (
              <button
                onClick={clearAll}
                className="w-full rounded-2xl border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50"
              >
                <div className="flex items-center justify-center space-x-2">
                  <XMarkIcon className="h-5 w-5" />
                  <span>Clear All</span>
                </div>
              </button>
            )}
          </div>

          {/* Preview Panel */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
              {generatedImage && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleDownload}
                    className="p-2 text-gray-600 transition-colors hover:text-red-600"
                    title="Download"
                  >
                    <Download className="h-5 w-5" />
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

            <div className="aspect-square flex items-center justify-center overflow-hidden rounded-2xl bg-gray-50">
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6 text-center"
                  >
                    <div className="relative">
                      <div className="mx-auto h-20 w-20 animate-spin rounded-full border-4 border-red-200">
                        <div className="h-full w-full rounded-full border-4 border-transparent border-t-red-600"></div>
                      </div>
                      <motion.div
                        className="absolute inset-0 mx-auto h-20 w-20"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      >
                        <SparklesIcon className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 transform text-red-600" />
                      </motion.div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-gray-700">
                        {mode === 'generate'
                          ? 'Generating your image...'
                          : 'Editing your image...'}
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
                            className="h-2 w-2 rounded-full bg-red-400"
                            animate={{ y: [0, -8, 0] }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              delay: i * 0.2,
                              ease: 'easeInOut',
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
                    className="h-full w-full object-contain"
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
                    className="space-y-4 text-center"
                  >
                    <PhotoIcon className="mx-auto h-16 w-16 text-gray-300" />
                    <div>
                      <p className="text-lg font-medium text-gray-500">
                        Your image will appear here
                      </p>
                      <p className="text-sm text-gray-400">
                        {mode === 'generate'
                          ? 'Enter a prompt to get started'
                          : 'Upload an image and add editing instructions'}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* User Info Banner */}
        <div className="mt-12 rounded-3xl bg-gradient-to-r from-red-600 to-red-600 p-8 text-center text-white">
          <h3 className="mb-2 text-2xl font-bold">AI Image Studio</h3>
          <p className="mb-4 text-red-100">
            Generate and edit unlimited images with our AI-powered studio.
          </p>
        </div>
      </div>
    </div>
  )
}
