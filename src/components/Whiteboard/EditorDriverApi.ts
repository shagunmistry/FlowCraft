import { Editor, TLShapeId } from '@tldraw/tldraw'
import {
  pointerDown,
  pointerMove,
  pointerMoveTo,
  pointerUp,
  selectTool,
  waitFrame,
} from './functions'

import { getIdForTlDraw, getRandomId } from '@/lib/utils'

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
  from?: TLShapeId // For arrows
  to?: TLShapeId // For arrows
  id?: TLShapeId
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

  arrowShapesQueue: CapturedCommand[] = []

  processSnapshot(snapshot: string, replaceSnapshot = false) {
    if (replaceSnapshot) {
      this.snapshot = snapshot
    }

    // Preprocess input for consistent parsing
    const processedInput = snapshot
      .replace(/[\r\n]+/g, ' ') // Replace newlines with spaces
      .replace(/;/g, ' ;') // Separate semicolons with spaces
      .replace(/ +/g, ' ') // Normalize multiple spaces
      .trim() // Remove leading/trailing whitespace

    console.log('Processed input:', processedInput)

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

    console.log('Processing sequence:', sequence)

    for (const word of sequence.join(' ').split(' ')) {
      console.log('Processing word:', word, 'with state:', state)
      if (word === ';') {
        state = 'inactive'
      }

      if (word === '```SEQUENCE:END') {
        state = 'sequence-end'
      }

      if (word === '```SEQUENCE:START') {
        state = 'sequence-start'
      }

      switch (state) {
        case 'sequence-start':
          // there might be a comment if the line begins with a // so ignore until we find a command
          if (word === '//') {
            state = 'inactive'
          } else if (word.includes('action:')) {
            currentCommand = {
              action: word.split(':')[1] as ActionType,
              parameters: {},
            }
            state = 'action'
          }
          break
        case 'inactive':
          if (word.includes('action:')) {
            currentCommand = {
              action: word.split(':')[1] as ActionType,
              parameters: {},
            }
            state = 'action'
          }

          if (word === ';') {
            // Push the current command to the queue
            if (currentCommand && !!currentCommand.action) {
              parsedCommands.push(currentCommand)
              currentCommand = undefined
            }
          }
          break
        case 'action':
          if (currentCommand) {
            if (word.includes('shape:')) {
              currentCommand.parameters.shape = word.split(':')[1] as ShapeType
              state = 'create'
            }
          }
          break
        case 'in-label':
          if (currentCommand) {
            currentCommand.parameters.label += ' ' + word.replace('"', '')

            if (word.endsWith('"')) {
              state = 'create'
            }
          }
          break
        case 'create':
          try {
            if (currentCommand) {
              if (word.includes('x:')) {
                currentCommand.parameters.x = parseInt(word.split(':')[1])
              }
              if (word.includes('y:')) {
                currentCommand.parameters.y = parseInt(word.split(':')[1])
              }
              if (word.includes('width:')) {
                currentCommand.parameters.width = parseInt(word.split(':')[1])
              }
              if (word.includes('height:')) {
                currentCommand.parameters.height = parseInt(word.split(':')[1])
              }
              if (word.includes('label:')) {
                if (word.includes('"') && !word.endsWith('"')) {
                  state = 'in-label'
                }
                const label = word.split(':')[1]
                currentCommand.parameters.label = label.replace('"', '')
              }
              if (word.includes('endX:')) {
                currentCommand.parameters.endX = parseInt(word.split(':')[1])
              }
              if (word.includes('endY:')) {
                currentCommand.parameters.endY = parseInt(word.split(':')[1])
              }
              if (word.includes('from:')) {
                currentCommand.parameters.from = getIdForTlDraw(
                  word.split(':')[1],
                )
              }
              if (word.includes('to:')) {
                currentCommand.parameters.to = getIdForTlDraw(
                  word.split(':')[1],
                )
              }
              if (word.includes('id:')) {
                currentCommand.parameters.id = getIdForTlDraw(
                  word.split(':')[1],
                )
              }
            }
          } catch (e) {
            console.log('Error parsing command under the create action', e)
          }
          break
        default:
          break
      }
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
    this.commandQueue.forEach(async (command) => {
      await this.executeCommand(command)
    })

    console.log(
      '--- COMPLETED ---, now processing the arrow queue',
      this.arrowShapesQueue.length,
    )
    this.arrowShapesQueue.forEach(async (command) => {
      await this.executeCommand(command, true)
    })
  }

  async executeCommand(command: CapturedCommand, isArrow: boolean = false) {
    switch (command.action) {
      case 'CREATE':
        const parameters = command.parameters as CreateShapeParameters
        await this.createShape(parameters, isArrow)
        break
      default:
        console.log('Invalid action:', command.action)
        break
    }
  }

  async createShape(
    parameters: CreateShapeParameters,
    isFromArrowQueue: boolean = false,
  ) {
    const { shape, x, y, width, height, label, endX, endY, from, to, id } =
      parameters

    console.log('Creating shape:', parameters)

    /**
     * {
    "parentId": "page:somePage",
    "id": "shape:someId",
    "typeName": "shape"
    "type": "geo",
    "x": 106,
    "y": 294,
    "rotation": 0,
    "index": "a28",
    "opacity": 1,
    "isLocked": false,
    "props": {
        "w": 200,
        "h": 200,
        "geo": "rectangle",
        "color": "black",
        "labelColor": "black",
        "fill": "none",
        "dash": "draw",
        "size": "m",
        "font": "draw",
        "text": "diagram",
        "align": "middle",
        "verticalAlign": "middle",
        "growY": 0,
        "url": ""
    },
    "meta": {},
}
     */

    switch (shape) {
      case 'rectangle':
        this.editor.createShape({
          id: `shape:${getRandomId()}` as any,
          type: 'geo',
          x: x,
          y: y,
          props: {
            h: height,
            w: width,
            geo: 'rectangle',
            color: 'black',
            labelColor: 'black',
            fill: 'none',
            dash: 'draw',
            size: 'm',
            font: 'draw',
            text: label || '',
            align: 'middle',
            verticalAlign: 'middle',
            url: '',
          },
        })
        await waitFrame()
        break
      case 'ellipse':
        this.editor.createShape({
          id: `shape:${getRandomId()}` as any,
          type: 'geo',
          x: x,
          y: y,
          props: {
            h: height,
            w: width,
            geo: 'ellipse',
            color: 'black',
            labelColor: 'black',
            fill: 'none',
            dash: 'draw',
            size: 'm',
            font: 'draw',
            text: label || '',
            align: 'middle',
            verticalAlign: 'middle',
            url: '',
          },
        })
        await waitFrame()
        break
      case 'arrow':
        if (isFromArrowQueue) {
          console.log('Creating arrow from queue:', parameters)
          this.editor.createShape({
            id: id || (`shape:${getRandomId()}` as any),
            type: 'arrow',
            x: x,
            y: y,
            props: {
              dash: 'draw',
              size: 'm',
              fill: 'none',
              color: 'black',
              labelColor: 'black',
              bend: 0,
              start: {
                type: 'binding',
                boundShapeId: from || 'shape:1',
                normalizedAnchor: {
                  x: 0.5,
                  y: 1,
                },
                isPrecise: true,
                isExact: false,
              },
              end: {
                type: 'binding',
                boundShapeId: to || 'shape:2',
                normalizedAnchor: {
                  x: 0.5,
                  y: 0,
                },
                isPrecise: true,
                isExact: false,
              },
              arrowheadStart: 'none',
              arrowheadEnd: 'arrow',
              text: '',
              font: 'draw',
            },
            typeName: 'shape',
          })
          await waitFrame()
        } else {
          this.arrowShapesQueue.push({ action: 'CREATE', parameters })
        }
        break
      default:
        console.log('Invalid shape type:', shape)
        break
    }

    // await waitFrame()
    // // Delay few seconds to allow the shapes to be created
    // await new Promise((resolve) => setTimeout(resolve, 1000))
  }
}
