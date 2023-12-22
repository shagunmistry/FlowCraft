'use client'

import dynamic from 'next/dynamic'

import {
  Editor,
  TLStore,
  TLStoreWithStatus,
  createShapeId,
  createTLStore,
  defaultShapeUtils,
  parseTldrawJsonFile,
  useEditor,
} from '@tldraw/tldraw'

import '@tldraw/tldraw/tldraw.css'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { scenarios } from './scenarios'
import { DiagramContext } from '@/lib/Contexts/DiagramContext'

// const jsonString = JSON.stringify(scenarios.hey)

const Tldraw = dynamic(async () => (await import('@tldraw/tldraw')).Tldraw, {
  ssr: false,
})

export default function ({ inputJson }: { inputJson: string }) {
  //   console.log('inputJson: ', inputJson)

  const editorRef = useRef<Editor | null>(null)

  const inputStore = useMemo(() => {
    console.log('We are in useMemo', JSON.parse(inputJson).records)
    const parsed = parseTldrawJsonFile({
      json: inputJson,
      schema: createTLStore({ shapeUtils: defaultShapeUtils }).schema,
    })
    if (!parsed.ok) {
      throw new Error(`File parse error: ${JSON.stringify(parsed.error)}`)
    }

    if (editorRef.current) {
      editorRef.current.zoomToFit()
    }

    console.log('parsed.value: ', parsed.value)

    return parsed.value
  }, [inputJson])

  useEffect(() => {
    editorRef.current?.zoomToFit()
  }, [inputJson])

  const handleClick = () => {
    console.log('Editor: ', editorRef.current?.store.getSnapshot())
  }

  return (
    <div className="mt-12 h-screen w-full rounded-xl">
      <button
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        onClick={handleClick}
      >
        Save
      </button>
      <Tldraw
        store={inputStore}
        onMount={(editor) => {
          editorRef.current = editor
        }}
      />
    </div>
  )
}
