import { Editor } from '@tldraw/tldraw'
import { createContext } from 'react'

export const WhiteboardContext = createContext<{
  input: string
  setInput: (input: string) => void
  editorRef: Editor | null
  setEditorRef: (editorRef: Editor) => void
  controls: any
  setControls: (controls: any) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}>({
  input: '',
  setInput: () => {},
  editorRef: null,
  setEditorRef: () => {},
  controls: null,
  setControls: () => {},
  loading: false,
  setLoading: () => {},
})
