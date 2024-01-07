'use client'

import dynamic from 'next/dynamic'

import {
  Editor,
  createTLStore,
  defaultShapeUtils,
  parseTldrawJsonFile,
} from '@tldraw/tldraw'

import '@tldraw/tldraw/tldraw.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import SuccessDialog from '../SuccessDialog'
import ErrorDialog from '../ErrorDialog'

const Tldraw = dynamic(async () => (await import('@tldraw/tldraw')).Tldraw, {
  ssr: false,
})

export default function ({ inputJson }: { inputJson: string }) {
  const [openErrorDialog, setOpenErrorDialog] = useState<boolean>(false)

  const editorRef = useRef<Editor | null>(null)

  const inputStore = useMemo(() => {
    try {
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
    } catch (e) {
      setOpenErrorDialog(true)

      console.log('Error: ', e)
      return createTLStore({ shapeUtils: defaultShapeUtils })
    }
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
          editor?.user.updateUserPreferences({
            isDarkMode: true,
            isSnapMode: true,
          })
        }}
      />
      <ErrorDialog
        title="Error Generating Diagram"
        message="Please try again. If the problem persists, please contact us at smistr61@gmail.com"
        setOpen={setOpenErrorDialog}
        open={openErrorDialog}
      />
    </div>
  )
}
