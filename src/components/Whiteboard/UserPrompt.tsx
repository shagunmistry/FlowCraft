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
    console.log('Setting editor: ', context.editorRef)
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
      context.setLoading(true)
      console.log('Getting user message: ', input, ' Thread: ', thread)
      const userMessage = thread.getUserMessage(input)
      console.log('User Message: ', userMessage)
      const result = await thread.sendMessage(userMessage)
      console.log('Result: ', result)
      await thread.handleAssistantResponse(result)
      context.setLoading(false)
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
