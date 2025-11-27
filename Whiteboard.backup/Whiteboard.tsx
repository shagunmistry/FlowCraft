'use client'

import dynamic from 'next/dynamic'

import { Editor, TLEditorComponents } from '@tldraw/tldraw'

import '@tldraw/tldraw/tldraw.css'
import { useContext, useEffect, useRef, useState } from 'react'
import ErrorDialog from '../ErrorDialog'
import { WhiteboardContext } from '@/lib/Contexts/WhiteboardContext'
import { Spinner } from '../Spinner'
import Lottie from 'lottie-react'

const Tldraw = dynamic(async () => (await import('@tldraw/tldraw')).Tldraw, {
  ssr: false,
})

const components: TLEditorComponents = {
  InFrontOfTheCanvas: () => {
    return (
      <div className="absolute left-0 right-0 top-0 flex items-center justify-center">
        <div className="mt-12 h-screen w-full rounded-xl">
          <p className="text-center text-2xl font-bold text-pink-500">
            Please wait while we generate your diagram
          </p>
          <Lottie
            animationData={require('../../lib/LoaderAnimation.json')}
            loop={true}
          />
        </div>
      </div>
    )
  },
}

export default function ({ inputJson }: { inputJson: string }) {
  const [openErrorDialog, setOpenErrorDialog] = useState<boolean>(false)

  const editorRef = useRef<Editor | null>(null)

  const whiteboardContext = useContext(WhiteboardContext)

  useEffect(() => {
    editorRef.current?.zoomToFit()
  }, [inputJson])

  const handleClick = () => {
    console.log('Editor: ', editorRef.current?.store.getSnapshot())
    console.log('Records: ', editorRef.current?.store.allRecords())
  }

  // if (whiteboardContext.loading) {
  //   return (

  //   )
  // }

  return (
    <div className="mt-12 h-screen w-full rounded-xl">
      <Tldraw
        autoFocus={false}
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
        components={whiteboardContext.loading ? components : undefined}
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
