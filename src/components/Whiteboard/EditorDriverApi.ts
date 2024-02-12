import { Editor } from '@tldraw/tldraw'
import {
  pointerDown,
  pointerMove,
  pointerMoveTo,
  pointerUp,
  selectTool,
} from './functions'

type ShapeType = 'rectangle' | 'ellipse' | 'arrow' | 'circle' | 'square'
type ActionType = 'CREATE'

type CreateShapeParameters = {
  shape: 'rectangle' | 'ellipse' | 'arrow' | 'circle' | 'square'
  x: number
  y: number
  width?: number // Optional for text and arrows
  height?: number // Optional for text and arrows
  label?: string // Optional for arrows
  endX?: number // For arrows
  endY?: number // For arrows
}

type QueuedCommand = {
  command: CapturedCommand
  parameters: CreateShapeParameters | any[] // Adjust for other commands
}

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
      {
        name: 'x2',
        type: 'number',
        description: 'The x coordinate of the end point of the arrow.',
        required: false,
      },
      {
        name: 'y2',
        type: 'number',
        description: 'The y coordinate of the end point of the arrow.',
        required: false,
      },
    ],
  },
] as const

type NestedParameter = string | CapturedCommand

// type CapturedCommand = {
//   action: 'CREATE' // Adjust for other commands
//   parameters: {
//     [key: string]: NestedParameter
//   }
// }

type CapturedCommand = {
  action: ActionType
  parameters: {
    [key: string]: any // Replace "any" with actual parameter types
  }
}

export class EditorDriverApi {
  constructor(public editor: Editor) {
    editor.updateInstanceState({ isToolLocked: true })
  }

  private commandQueue: CapturedCommand[] = []

  isInSequence = false

  cursor = 0

  snapshot = ''

  processSnapshot(snapshot: string, replaceSnapshot = false) {
    if (replaceSnapshot) {
      this.snapshot = snapshot
    }

    console.log('Processing snapshot:', snapshot)

    // Preprocess input for consistent parsing
    const processedInput = snapshot
      .replace(/[\r\n]+/g, ' ') // Replace newlines with spaces
      .replace(/;/g, ' ;') // Separate semicolons with spaces
      .replace(/ +/g, ' ') // Normalize multiple spaces
      .trim() // Remove leading/trailing whitespace

    let currentSequence: string[] = []
    for (const line of processedInput.split('\n')) {
      if (line.startsWith('````SEQUENCE:')) {
        // Start a new sequence
        currentSequence = []
      } else if (line.startsWith('````')) {
        // End of a sequence
        this.processSequence(currentSequence)
        currentSequence = []
      } else {
        // Add line to the current sequence
        currentSequence.push(line)
      }
    }

    // Process any remaining sequence at the end
    if (currentSequence.length > 0) {
      this.processSequence(currentSequence)
    }
  }

  processSequence(sequence: string[]) {
    let state = 'inactive' as
      | 'sequence-start'
      | 'action'
      | 'create'
      | 'sequence-end'
      | 'in-label'
      | 'inactive'
    let currentCommand: CapturedCommand | undefined = undefined
    const parsedCommands: CapturedCommand[] = []

    for (const word of sequence.join(' ').split(' ')) {
      console.log('Processing word:', word)
      switch (state) {
        case 'inactive':
          if (word === '```SEQUENCE:START') {
            state = 'sequence-start'
          }
          break
        case 'action':
          if (word === 'CREATE') {
            state = 'create'
            currentCommand = {
              action: 'CREATE',
              parameters: {} as { [key: string]: NestedParameter },
            }
          } else {
            // Handle unexpected word after action declaration
            throw new Error(`Unexpected word after action: ${word}`)
          }
          break
        case 'in-label':
          if (word === '"') {
            state = 'create'
          } else if (currentCommand) {
            // Append word to label parameter
            currentCommand.parameters.label += ` ${word}`
          }
          break
        case 'create':
          // Extract parameters using regular expressions or string manipulation
          // Replace these examples with your preferred extraction method
          console.log('Current word ----->', word)
          console.log('Current command ----->', currentCommand)
          // It should match "shape" or "shape:" followed by a shape type
          const shapeMatch = word.match(/^(shape):(\w+)$/)

          console.log('Shape match ----->', shapeMatch)

          if (word === ';') {
            state = 'inactive'
            break
          }

          if (shapeMatch && currentCommand) {
            currentCommand.parameters['shape'] = shapeMatch[2]
          } else if (
            /^(x|y|width|height|endX|endY):(\d+)$/.test(word) &&
            currentCommand
          ) {
            // Extract number parameter (convert to number here)
            const match = word.match(/^(x|y|width|height|endX|endY):(\d+)$/)!
            const parameterName = match[1]
            const parameterValue = Number(match[2])
            currentCommand.parameters[parameterName] = parameterValue
          } else if (word.includes('label:"') && currentCommand) {
            // Extract label parameter
            const match = word.match(/^label:"(.+?)"$/)!

            // Handle ending quote in the same word
            if (match && match[1].endsWith('"')) {
              currentCommand.parameters['label'] = match[1].slice(0, -1)
              state = 'create'
            } else {
              currentCommand.parameters['label'] = match[1]
              // Set state to in-label to handle multi-word labels
              state = 'in-label'
            }
          } else {
            // Handle invalid parameter format
            throw new Error(`Invalid parameter format: ${word}`)
          }
          break
        case 'sequence-start':
          if (word === 'action:CREATE') {
            state = 'create'
            currentCommand = {
              action: 'CREATE',
              parameters: {} as { [key: string]: NestedParameter },
            }
          }
          break
        default:
          throw new Error(`Unexpected state: ${state}`)
      }
    }

    // Validate and push the final parsed command
    if (state === 'inactive' && currentCommand && !!currentCommand.action) {
      const validatedParameters = this.validateParameters(
        currentCommand.parameters,
      )

      console.log('Validated parameters:', validatedParameters)
      parsedCommands.push({
        action: currentCommand.action,
        parameters: validatedParameters,
      })
    }

    // Add parsed commands to the queue
    this.commandQueue.push(...parsedCommands)
  }

  validateParameters(parameters: {
    [key: string]: any
  }): CreateShapeParameters {
    // Validate required parameters for all shapes
    const shape = parameters.shape as ShapeType
    if (
      !shape ||
      !['rectangle', 'ellipse', 'arrow', 'circle'].includes(shape)
    ) {
      throw new Error('Invalid shape type')
    }
    const x = parameters.x as number
    const y = parameters.y as number
    if (typeof x !== 'number' || typeof y !== 'number') {
      throw new Error('Invalid x or y coordinates')
    }

    // Validate optional width and height based on shape type
    let width: number | undefined
    let height: number | undefined
    switch (shape) {
      case 'rectangle':
      case 'ellipse':
        width = parameters.width as number | undefined
        height = parameters.height as number | undefined
        if (!width || !height) {
          throw new Error(
            'Width and height are required for rectangles and ellipses',
          )
        }
        break
      case 'arrow':
      case 'circle':
        width = parameters.width as number | undefined
        height = parameters.height as number | undefined
        break
    }

    // Validate label (optional for all shapes)
    const label = parameters.label as string | undefined

    // Validate endX and endY for arrows
    const endX = parameters.endX as number | undefined
    const endY = parameters.endY as number | undefined
    if (shape === 'arrow' && (!endX || !endY)) {
      throw new Error('endX and endY are required for arrows')
    }

    // Validate start shape reference for arrows (if applicable)
    const startShapeRef = parameters.start as string | undefined
    if (shape === 'arrow' && startShapeRef) {
      throw new Error('Invalid start shape reference')
    }

    // Construct and return the validated CreateShapeParameters object
    return {
      shape,
      x,
      y,
      width,
      height,
      label,
      endX,
      endY,
    }
  }

  complete() {
    console.log(
      '--- COMPLETED ---, now processing the queue',
      this.commandQueue.length,
    )
    // Print out the queue for debugging
    this.commandQueue.forEach((command) => {
      console.log(`Executing command: ${command.action}`, command.parameters)
    })
  }

  // complete() {
  //   console.log('--- COMPLETED ---, now processing snapshot')
  //   this.processSnapshot(this.snapshot)
  //   console.log(this.snapshot)
  // }

  // queue: QueuedCommand[] = []

  // async executeCommand(
  //   command: CapturedCommand,
  //   validatedParameters: CreateShapeParameters,
  // ): Promise<void> {
  //   // No need to store the command and parameters anymore
  //   // as validatedParameters should hold everything needed.

  //   // Extract parameters directly from validatedParameters
  //   const { shape, x, y, width, height, label, endX, endY } =
  //     validatedParameters

  //   // Depending on the command keyword, call the appropriate execution logic
  //   switch (command.command.keyword) {
  //     case 'CREATE':
  //       this.createShape(shape, x, y, width, height, label, endX, endY)
  //       break
  //     // Add cases for other commands (if applicable)
  //     default:
  //       throw new Error(`Unknown command: ${command.command.keyword}`)
  //   }
  // }

  // async executeNextInQueue(): Promise<void> {
  //   const { command, parameters } = this.queue.shift()!
  //   if (!command) return

  //   console.log('Executing command:', command.command.keyword, parameters)

  //   switch (command.command.keyword) {
  //     case 'CREATE': {
  //       const [shape, x, y, width, height, label] = params as [
  //         string,
  //         number,
  //         number,
  //         number,
  //         number,
  //         string,
  //       ]
  //       console.log('Creating shape: ', shape, x, y, width, height, label)
  //       break
  //     }
  //   }

  //   return await this.executeNextInQueue()
  // }
}
