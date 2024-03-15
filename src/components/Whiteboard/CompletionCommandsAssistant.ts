import { Editor } from '@tldraw/tldraw'
import { Assistant, Thread } from '@/lib/Assistant'
import { fetchText } from '@/lib/fetchText'
import { ChatCompletionStream } from 'openai/lib/ChatCompletionStream.mjs'

import OpenAI from 'openai'

import { commandsPrompt } from './completions-prompt'
import { assert, sampleProcess } from '@/lib/utils'
import { EditorDriverApi } from './EditorDriverApi'
import { getUserMessage } from './getUserMessage'

const apiKey = process.env.OPENAI_API_KEY ?? null

if (!apiKey) {
  throw Error(
    `Error: OpenAI API key not found, please create an API Key in the OpenAI platform and add it as .env.OPENAI_API_KEY`,
  )
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  dangerouslyAllowBrowser: true,
})

export class CompletionCommandsAssistant
  implements Assistant<ChatCompletionStream>
{
  constructor() {}

  systemPrompt: string = commandsPrompt

  // getDefaultSystemPrompt(): Promise<string> {
  //   return fetchText(commandsPrompt)
  // }

  async setSystemPrompt(prompt: string) {
    this.systemPrompt = prompt
  }

  async createThread(editor: Editor) {
    const systemPrompt = this.systemPrompt
    return new CompletionCommandsThread(systemPrompt, editor)
  }
}

export class CompletionCommandsThread implements Thread<ChatCompletionStream> {
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]

  constructor(
    systemPrompt: string,
    readonly editor: Editor,
  ) {
    this.messages = [
      {
        role: 'system',
        content: systemPrompt,
      },
    ]
  }

  getUserMessage(input: string) {
    return getUserMessage(this.editor, input)
  }

  currentStream: ChatCompletionStream | null = null

  async sendMessage(userMessage: string) {
    if (this.currentStream) {
      this.currentStream.abort()
      this.currentStream = null
    }

    this.messages.push({
      role: 'user',
      content: userMessage,
    })

    const stream = openai.beta.chat.completions.stream({
      model: 'gpt-4-0125-preview',
      messages: this.messages,
    })

    this.currentStream = stream

    return stream
  }

  async cancel() {
    if (this.currentStream) {
      this.currentStream.abort()
      this.currentStream = null
    }
  }

  async handleAssistantResponse(stream: ChatCompletionStream, input: string) {
    assert(this.currentStream === stream)

    const api = new EditorDriverApi(this.editor)

    return new Promise<void>((resolve, reject) => {
      // Fake the response for now
      // setTimeout(() => {
      //   api.processSnapshot(sampleProcess, true)
      //   api.complete()
      //   resolve()
      // }, 3000)

      stream.on('content', (_delta, snapshot) => {
        if (stream.aborted) return

        console.log('-- Processing snapshot --')
        // api.processSnapshot(snapshot, true)
      })

      stream.on('finalContent', (snapshot) => {
        if (stream.aborted) return

        console.log('-- Processing final snapshot --', snapshot)
        fetch('/api/save-to-db', {
          method: 'POST',
          body: JSON.stringify({
            snapshot,
            title: input,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
        api.processSnapshot(snapshot, true)
        api.complete()

        console.log('Adding assistant message to the editor')
        resolve()
      })

      stream.on('abort', () => {
        reject(new Error('Stream aborted'))
      })

      stream.on('error', (err) => {
        console.error(err)
        reject(err)
      })

      stream.on('end', () => {
        resolve()
      })
    })
  }
}
