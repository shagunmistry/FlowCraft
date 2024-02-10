'use client'

import dynamic from 'next/dynamic'

import {
  Editor,
  createTLStore,
  defaultShapeUtils,
  parseTldrawJsonFile,
} from '@tldraw/tldraw'

import '@tldraw/tldraw/tldraw.css'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import ErrorDialog from '../ErrorDialog'
import { WhiteboardContext } from '@/lib/Contexts/WhiteboardContext'
import { useAssistant } from './UserPrompt'
import { CompletionCommandsAssistant } from './CompletionCommandsAssistant'

const Tldraw = dynamic(async () => (await import('@tldraw/tldraw')).Tldraw, {
  ssr: false,
})

// const components: TLEditorComponents = {
//   InFrontOfTheCanvas: () => {
//     const assistant = useMemo(() => new CompletionCommandsAssistant(), [])
//     return <UserPrompt assistant={assistant} />
//   },
// }

export default function ({ inputJson }: { inputJson: string }) {
  const [openErrorDialog, setOpenErrorDialog] = useState<boolean>(false)

  const editorRef = useRef<Editor | null>(null)

  const whiteboardContext = useContext(WhiteboardContext)
  const assistant = useMemo(() => new CompletionCommandsAssistant(), [])

  // const inputStore = useMemo(() => {
  //   try {
  //     console.log('We are in useMemo', JSON.parse(inputJson).records)
  //     const parsed = parseTldrawJsonFile({
  //       json: inputJson,
  //       schema: createTLStore({ shapeUtils: defaultShapeUtils }).schema,
  //     })

  //     if (!parsed.ok) {
  //       throw new Error(`File parse error: ${JSON.stringify(parsed.error)}`)
  //     }

  //     console.log('editorRef.current: ', editorRef.current)

  //     if (editorRef.current) {
  //       editorRef.current.zoomToFit()
  //     }

  //     console.log('parsed.value: ', parsed.value)

  //     return parsed.value
  //   } catch (e) {
  //     setOpenErrorDialog(true)

  //     console.log('Error: ', e)
  //     return createTLStore({ shapeUtils: defaultShapeUtils })
  //   }
  // }, [inputJson])

  useEffect(() => {
    editorRef.current?.zoomToFit()
  }, [inputJson])

  const handleClick = () => {
    console.log('Editor: ', editorRef.current?.store.getSnapshot())
    console.log('Records: ', editorRef.current?.store.allRecords())
  }

  const handleClear = () => {
    if (editorRef.current) {
      const ids = Array.from(
        editorRef.current.getCurrentPageShapeIds().values(),
      )
      editorRef.current.deleteShapes(ids)
    }
  }

  return (
    <div className="mt-12 h-screen w-full rounded-xl">
      <button className="bg-blue-500 p-2 text-white" onClick={handleClear}>
        Clear
      </button>
      <Tldraw
        autoFocus={false}
        // store={inputStore}
        onMount={(editor) => {
          console.log('Editor has mounted')
          editorRef.current = editor

          whiteboardContext.setEditorRef(editor)

          // Zoom to fit the diagram
          editor?.zoomToFit({ duration: 200 })

          editor?.user.updateUserPreferences({
            isDarkMode: true,
            isSnapMode: true,
          })
        }}
        // components={components}
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
