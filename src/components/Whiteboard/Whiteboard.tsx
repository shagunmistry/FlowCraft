'use client'

import dynamic from 'next/dynamic'

import {
  Editor,
  createTLStore,
  defaultShapeUtils,
  parseTldrawJsonFile,
} from '@tldraw/tldraw'

import '@tldraw/tldraw/tldraw.css'
import { useEffect, useMemo, useRef } from 'react'

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

    console.log('editorRef.current: ', editorRef.current)

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
    console.log('Records: ', editorRef.current?.store.allRecords())
  }

  return (
    <div className="mt-12 h-screen w-full rounded-xl">
      <Tldraw
        store={inputStore}
        onMount={(editor) => {
          console.log('Editor has mounted')
          editorRef.current = editor

          // Zoom to fit the diagram
          editor?.zoomToFit({ duration: 200 })
        }}
      />
    </div>
  )
}
