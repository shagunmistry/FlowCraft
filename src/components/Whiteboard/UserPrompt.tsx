import {
  DefaultSpinner,
  Editor,
  stopEventPropagation,
  useEditor,
  useLocalStorageState,
} from '@tldraw/tldraw'
import { useCallback, useContext, useEffect, useState } from 'react'
import { Assistant, Thread } from '../../lib/Assistant'
import { assert } from '../../lib/utils'
import { Spinner } from '../Spinner'
import { WhiteboardContext } from '@/lib/Contexts/WhiteboardContext'
import { commandsPrompt } from './completions-prompt'

export function useAssistant<T>(assistant: Assistant<T>) {
  const context = useContext(WhiteboardContext)
  const [editor, setEditor] = useState<Editor>()
  const [thread, setThread] = useState<Thread<T> | null>(null)

  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!context.editorRef) return
    setEditor(context.editorRef)
  }, [context.editorRef])

  useEffect(() => {
    setIsReady(false)
    let isCancelled = false
    ;(async () => {
      // const systemPrompt =  assistant.getDefaultSystemPrompt()
      const systemPrompt = commandsPrompt
      if (isCancelled) return

      await assistant.setSystemPrompt(systemPrompt)
      if (isCancelled) return

      setIsReady(true)
    })()

    return () => {
      isCancelled = true
    }
  }, [assistant])

  useEffect(() => {
    if (!isReady) {
      setThread(null)
      return
    }

    let isCancelled = false
    ;(async () => {
      const thread = await assistant.createThread(editor as Editor)
      if (isCancelled) return
      setThread(thread)
    })()
    return () => {
      isCancelled = true
    }
  }, [assistant, editor, isReady])

  useEffect(() => {
    if (!thread) return
    return () => {
      thread.cancel()
    }
  }, [thread])

  const start = useCallback(
    async (input: string) => {
      console.log('UserPrompt Input Start: ', input)
      assert(thread)
      console.log('Getting user message')
      const userMessage = thread.getUserMessage(input)
      console.log('User Message: ', userMessage)
      const result = await thread.sendMessage(userMessage)
      console.log('Result: ', result)
      await thread.handleAssistantResponse(result)
    },
    [thread],
  )

  const restart = useCallback(async () => {
    const newThread = await assistant.createThread(editor as Editor)
    setThread(newThread)
  }, [assistant, editor])

  const cancel = useCallback(async () => {
    assert(thread)
    await thread.cancel()
  }, [thread])

  if (!thread || !isReady) return null
  return { start, restart, cancel }
}

// export function UserPrompt<T>({ assistant }: { assistant: Assistant<T> }) {
//   const editor = useEditor()
//   const controls = useAssistant(assistant)

//   const [state, setState] = useState<'ready' | 'waiting'>('ready')
//   const [text, setText] = useLocalStorageState(
//     'prompt-input',
//     'Create a box at the center of the viewport.',
//   )

//   const handleClearButtonClick = useCallback(() => {
//     const ids = Array.from(editor.getCurrentPageShapeIds().values())
//     editor.deleteShapes(ids)
//   }, [editor])

//   return (
//     <div className="mt-27 relative rounded bg-white p-4 shadow">
//       {state === 'waiting' && (
//         <div
//           className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
//           onPointerMove={stopEventPropagation}
//           onPointerDown={stopEventPropagation}
//         >
//           <DefaultSpinner />
//         </div>
//       )}
//       <div
//         className="mt-27 relative rounded bg-white p-4 shadow"
//         onPointerDown={stopEventPropagation}
//       >
//         <textarea
//           className="w-full rounded border p-2"
//           value={text}
//           onChange={(e) => setText(e.currentTarget.value)}
//         />
//         <div className="mt-4 flex justify-between">
//           <div>
//             <button
//               className="rounded bg-blue-500 px-4 py-2 text-white"
//               onClick={handleClearButtonClick}
//             >
//               Clear Canvas
//             </button>
//           </div>
//           <div className="flex items-center">
//             {controls ? (
//               <UserPromptActions
//                 controls={controls}
//                 input={text}
//                 state={state}
//                 onChangeState={setState}
//               />
//             ) : (
//               <div className="pr-3">
//                 <Spinner />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

function UserPromptActions({
  controls,
  input,
  state,
  onChangeState,
}: {
  controls: NonNullable<ReturnType<typeof useAssistant>>
  input: string
  state: 'ready' | 'waiting'
  onChangeState: (state: 'ready' | 'waiting') => void
}) {
  const { start, restart, cancel } = controls

  const handleSendButtonClick = useCallback(async () => {
    if (state === 'waiting') {
      await cancel()
      onChangeState('ready')
      return
    }

    if (state === 'ready') {
      if (!input) return
      onChangeState('waiting')

      // Send the user message to the thread
      await start(input)
      onChangeState('ready')
    }
  }, [cancel, input, onChangeState, start, state])

  const [isRestarting, setIsRestarting] = useState(false)
  const handleRestartButtonClick = useCallback(async () => {
    setIsRestarting(true)
    await restart()
    setIsRestarting(false)
  }, [restart])

  return (
    <>
      <button
        className="tlui-button"
        onClick={isRestarting ? undefined : handleRestartButtonClick}
      >
        {isRestarting ? <Spinner /> : 'New Thread'}
      </button>
      <button
        className="tlui-button tlui-button__primary"
        onClick={handleSendButtonClick}
        style={{ width: 64 }}
      >
        {state === 'ready' ? 'Send' : 'Cancel'}
      </button>
    </>
  )
}
