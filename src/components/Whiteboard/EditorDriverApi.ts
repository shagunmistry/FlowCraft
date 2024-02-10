import { Editor } from '@tldraw/tldraw'
import {
  pointerDown,
  pointerMove,
  pointerMoveTo,
  pointerUp,
  selectTool,
} from './functions'

const commands = [
  {
    keyword: 'CREATE',
    description: 'Create a new shape on the canvas.',
    parameters: [
      {
        name: 'shape',
        type: 'string',
        enum: ['rectangle', 'ellipse', 'arrow', 'text'], // Limit to desired shapes
        description: 'The type of shape to create.',
      },
      {
        name: 'x',
        type: 'number',
        description: 'The x coordinate of the shape.',
      },
      {
        name: 'y',
        type: 'number',
        description: 'The y coordinate of the shape.',
      },
      {
        name: 'width',
        type: 'number',
        description: 'The width of the shape. (Optional for certain shapes)',
      },
      {
        name: 'height',
        type: 'number',
        description: 'The height of the shape. (Optional for certain shapes)',
      },
      {
        name: 'label',
        type: 'string',
        description: 'The text label for the shape.',
      },
    ],
  },
] as const

type CapturedCommand = {
  command: (typeof commands)[number]
  parameters: string[]
}

export class EditorDriverApi {
  constructor(public editor: Editor) {
    editor.updateInstanceState({ isToolLocked: true })
  }

  isInSequence = false

  cursor = 0

  snapshot = ''

  // addChunk(chunk: string) {
  //   this.snapshot += chunk
  //   this.processSnapshot(this.snapshot)
  // }

  processSnapshot(snapshot: string, replaceSnapshot = false) {
    if (replaceSnapshot) {
      this.snapshot = snapshot
    }
    console.log('Snapshot length: ', snapshot.length)
    console.log('Processing snapshot: ', snapshot)
    // When we hit START, we should begin capturing commands
    // when we hit END, we should stop capturing commands
    // When we hit a ;, we should ignore everything until we hit a command

    // We want to ignore any comments
    // We want to ignore any other content outside of the START and STOP.

    const capturedCommands: CapturedCommand[] = []

    let state = { name: 'not-capturing' } as
      | {
          name: 'command'
          command: CapturedCommand
        }
      | {
          name: 'not-capturing'
        }
      | {
          name: 'capturing'
        }

    let input = snapshot
    // regex to replace all newlines with spaces
    input = input.replace(/[\r\n]+/g, ' ')
    // replace all semicolons with spaces
    input = input.replace(/;/g, ' ;')
    // replace all multiple spaces with a single space
    input = input.replace(/ +/g, ' ')

    for (const word of input.split(' ')) {
      switch (state.name) {
        case 'not-capturing': {
          if (word === '```sequence') {
            state = { name: 'capturing' }
          }
          break
        }
        case 'capturing': {
          if (word === '```') {
            state = { name: 'not-capturing' }
          } else {
            // Are we at a new keyword?
            const newCommand = commands.find((c) => c.keyword === word)

            if (newCommand) {
              // we've hit a keyword
              state = {
                name: 'command',
                command: { command: newCommand, parameters: [] },
              }
            }
          }
          break
        }
        case 'command': {
          const expectedParameters = state.command.command.parameters
          const capturedParameters = state.command.parameters
          const isTerminator = word === ';'
          if (capturedParameters.length === expectedParameters.length) {
            // We have enough parameters, so the next word should be a ;
            if (isTerminator) {
              // we've hit the end of the command
              if (this.cursor === capturedCommands.length) {
                // execute the command
                this.executeCommand(state.command)
                this.cursor++
              }
              capturedCommands.push(state.command)
            } else {
              throw Error(
                `Command ${state.command.command.keyword} was called with additional parameter: ${word}`,
              )
            }
            state = { name: 'capturing' }
          } else {
            // expect a parameter
            if (isTerminator) {
              // we've hit the end of the command instead of a parameter
              throw Error(
                `Command ${
                  state.command.command.keyword
                } was completed with missing parameter: ${expectedParameters[
                  capturedParameters.length
                ]?.name}}`,
              )
            } else {
              // we've hit the end of the command instead of a parameter
              capturedParameters.push(word)
            }
          }
        }
      }
    }
  }

  complete() {
    console.log('--- COMPLETED ---, now processing snapshot')
    this.processSnapshot(this.snapshot)
    console.log(this.snapshot)
  }

  queue: CapturedCommand[] = []

  async executeCommand(command: CapturedCommand) {
    this.queue.push(command)

    if (this.queue.length === 1) {
      return await this.executeNextInQueue()
    }
  }

  async executeNextInQueue(): Promise<void> {
    const command = this.queue.shift()
    if (!command) return

    const name = command.command.keyword
    const params = command.parameters.map((p, i) => {
      const paramInfo = command.command.parameters[i]
      switch (paramInfo.type) {
        case 'number': {
          return eval(p)
        }
        case 'string': {
          return p
        }
      }
    })

    console.log([name, ...params].join(' '))

    switch (name) {
      // case 'POINTER_DOWN': {
      //   pointerDown(this.editor)
      //   break
      // }
      // case 'POINTER_UP': {
      //   pointerUp(this.editor)
      //   break
      // }
      // case 'POINTER_MOVE': {
      //   const [x, y] = params as [number, number, string]
      //   await pointerMoveTo(this.editor, { x, y })
      //   break
      // }
      // case 'POINTER_DRAG': {
      //   const [x1, y1, x2, y2, _modifiers] = params as [
      //     number,
      //     number,
      //     number,
      //     number,
      //     string,
      //   ]
      //   pointerMove(this.editor, { x: x1, y: y1 })
      //   pointerDown(this.editor)
      //   await pointerMoveTo(this.editor, { x: x2, y: y2 })
      //   pointerUp(this.editor)
      //   break
      // }
      // case 'TOOL': {
      //   const [tool] = params as [string]
      //   selectTool(this.editor, { tool })
      // }
      // case 'LABEL': {
      //   const [label] = params as [string]
      //   // Add label on the current tool
      //   console.log('Adding label: ', label)
      // }
      case 'CREATE': {
        const [shape, x, y, width, height, label] = params as [
          string,
          number,
          number,
          number,
          number,
          string,
        ]
        console.log('Creating shape: ', shape, x, y, width, height, label)
        break
      }
    }

    return await this.executeNextInQueue()
  }
}
