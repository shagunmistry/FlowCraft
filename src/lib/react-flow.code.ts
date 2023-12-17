export const ReactFlowExamples = {
  customNodes: {
    nodesCode: `[
        {
          id: '1',
          type: 'input',
          data: { label: 'An input node' },
          position: { x: 0, y: 50 },
          sourcePosition: 'right',
        },
        {
          id: '2',
          type: 'selectorNode',
          data: { onChange: onChange, color: initBgColor },
          style: { border: '1px solid #777', padding: 10 },
          position: { x: 300, y: 50 },
        },
        {
          id: '3',
          type: 'output',
          data: { label: 'Output A' },
          position: { x: 650, y: 25 },
          targetPosition: 'left',
        },
        {
          id: '4',
          type: 'output',
          data: { label: 'Output B' },
          position: { x: 650, y: 100 },
          targetPosition: 'left',
        },
      ]`,
    edgesCode: `[
        {
          id: 'e1-2',
          source: '1',
          target: '2',
          animated: true,
          style: { stroke: '#fff' },
        },
        {
          id: 'e2a-3',
          source: '2',
          target: '3',
          sourceHandle: 'a',
          animated: true,
          style: { stroke: '#fff' },
        },
        {
          id: 'e2b-4',
          source: '2',
          target: '4',
          sourceHandle: 'b',
          animated: true,
          style: { stroke: '#fff' },
        },
      ]`,
  },
  customEdges: {
    nodesCode: `[
        {
          id: 'button-1',
          type: 'input',
          data: { label: 'Button Edge 1' },
          position: { x: 125, y: 0 },
        },
        { id: 'button-2', data: { label: 'Button Edge 2' }, position: { x: 125, y: 200 } },
        {
          id: 'bi-1',
          data: { label: 'Bi Directional 1' },
          position: { x: 0, y: 300 },
          type: 'bidirectional',
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        },
        {
          id: 'bi-2',
          data: { label: 'Bi Directional 2' },
          position: { x: 250, y: 300 },
          type: 'bidirectional',
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        },
        {
          id: 'self-1',
          data: { label: 'Self Connecting' },
          position: { x: 125, y: 500 },
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
        },
      ]`,
    edgesCode: `[
        {
          id: 'edge-button',
          source: 'button-1',
          target: 'button-2',
          type: 'buttonedge',
        },
        {
          id: 'edge-bi-1',
          source: 'bi-1',
          target: 'bi-2',
          type: 'bidirectional',
          sourceHandle: 'right',
          targetHandle: 'left',
          markerEnd: { type: MarkerType.ArrowClosed },
        },
        {
          id: 'edge-bi-2',
          source: 'bi-2',
          target: 'bi-1',
          type: 'bidirectional',
          sourceHandle: 'left',
          targetHandle: 'right',
          markerEnd: { type: MarkerType.ArrowClosed },
        },
        {
          id: 'edge-self',
          source: 'self-1',
          target: 'self-1',
          type: 'selfconnecting',
          markerEnd: { type: MarkerType.Arrow },
        },
      ]`,
  },
  differentEdgeTypes: {
    nodesCode: `[
        {
          id: '1',
          data: { label: 'choose' },
          position: {
            x: 0,
            y: 0,
          },
        },
        {
          id: '2',
          data: { label: 'your' },
          position: {
            x: 100,
            y: 100,
          },
        },
        {
          id: '3',
          data: { label: 'desired' },
          position: {
            x: 0,
            y: 200,
          },
        },
        {
          id: '4',
          data: { label: 'edge' },
          position: {
            x: 100,
            y: 300,
          },
        },
        {
          id: '5',
          data: { label: 'type' },
          position: {
            x: 0,
            y: 400,
          },
        },
      ]`,
    edgesCode: `[
        {
          type: 'straight',
          source: '1',
          target: '2',
          id: '1',
          label: 'straight',
        },
        {
          type: 'step',
          source: '2',
          target: '3',
          id: '2',
          label: 'step',
        },
        {
          type: 'smoothstep',
          source: '3',
          target: '4',
          id: '3',
          label: 'smoothstep',
        },
        {
          type: 'bezier',
          source: '4',
          target: '5',
          id: '4',
          label: 'bezier',
        },
      ]`,
  },
  forTeachersMitochondria: {
    nodes: [
      {
        id: 'mitochondria',
        data: {
          label: 'Mitochondria',
        },
        position: {
          x: 250,
          y: -50,
        },
        width: 150,
        height: 40,
        selected: false,
        positionAbsolute: {
          x: 250,
          y: -50,
        },
        dragging: false,
      },
      {
        id: 'cellPhysiology',
        data: {
          label: 'Cell Physiology',
        },
        position: {
          x: 100,
          y: 100,
        },
        width: 150,
        height: 40,
        selected: false,
        positionAbsolute: {
          x: 100,
          y: 100,
        },
        dragging: false,
      },
      {
        id: 'pathology',
        data: {
          label: 'Pathology',
        },
        position: {
          x: 400,
          y: 75,
        },
        width: 150,
        height: 40,
        selected: false,
        positionAbsolute: {
          x: 400,
          y: 75,
        },
        dragging: false,
      },
      {
        id: 'atpSynthesis',
        data: {
          label: 'ATP Synthesis',
        },
        position: {
          x: -25,
          y: 250,
        },
        width: 150,
        height: 40,
        selected: false,
        positionAbsolute: {
          x: -25,
          y: 250,
        },
        dragging: false,
      },
      {
        id: 'caHomeostasis',
        data: {
          label: 'Ca2+ Homeostasis',
        },
        position: {
          x: 175,
          y: 250,
        },
        width: 150,
        height: 40,
        selected: false,
        positionAbsolute: {
          x: 175,
          y: 250,
        },
        dragging: false,
      },
      {
        id: 'metabolicPathways',
        data: {
          label: 'Metabolic Pathways',
        },
        position: {
          x: 375,
          y: 250,
        },
        width: 150,
        height: 40,
        selected: false,
        positionAbsolute: {
          x: 375,
          y: 250,
        },
        dragging: false,
      },
      {
        id: 'radicalProduction',
        data: {
          label: 'Radical Production',
        },
        position: {
          x: 550,
          y: 250,
        },
        width: 150,
        height: 40,
        selected: true,
        positionAbsolute: {
          x: 550,
          y: 250,
        },
        dragging: false,
      },
    ],
    edges: [
      {
        id: 'e1',
        source: 'mitochondria',
        target: 'cellPhysiology',
        label: 'Impacts',
      },
      {
        id: 'e2',
        source: 'mitochondria',
        target: 'pathology',
        label: 'Impacts',
      },
      {
        id: 'e3',
        source: 'cellPhysiology',
        target: 'atpSynthesis',
        label: 'Involved in',
      },
      {
        id: 'e4',
        source: 'cellPhysiology',
        target: 'caHomeostasis',
        label: 'Involved in',
      },
      {
        id: 'e5',
        source: 'pathology',
        target: 'metabolicPathways',
        label: 'Involved in',
      },
      {
        id: 'e6',
        source: 'pathology',
        target: 'radicalProduction',
        label: 'Involved in',
      },
    ],
  },
}

export const customNodeCodeExample = `
const nodes = ${ReactFlowExamples.customNodes.nodesCode}

const edges = ${ReactFlowExamples.customNodes.edgesCode}

`

export const customEdgeCodeExample = `
const nodes = ${ReactFlowExamples.customEdges.nodesCode}

const edges = ${ReactFlowExamples.customEdges.edgesCode}

`

export const differentEdgeTypesCodeExample = `
const nodes = ${ReactFlowExamples.differentEdgeTypes.nodesCode}

const edges = ${ReactFlowExamples.differentEdgeTypes.edgesCode}

`

export const allCombinedCodeExample = `
Example One:
\`\`\`javascript
${customNodeCodeExample}
\`\`\`

Example Two:
\`\`\`javascript
${customEdgeCodeExample}
\`\`\`

Example Three:
\`\`\`javascript
${differentEdgeTypesCodeExample}
\`\`\
`

// \`\`\`javascript
// const nodes = [
//   {
//     id: 'A',
//     position: { x: 20, y: 20 },
//     data: { label: 'A' },
//   },
//   {
//     id: 'B',
//     position: { x: 100, y: 200 },
//     data: { label: 'B' },
//   },
//   {
//     id: 'C',
//     position: { x: 300, y: 20 },
//     data: { label: 'C' },
//   },
//   {
//     id: 'D',
//     position: { x: 300, y: 170 },
//     data: { label: 'D' },
//   },
//   {
//     id: 'E',
//     position: { x: 250, y: 300 },
//     data: { label: 'E' },
//   },
//   {
//     id: 'F',
//     position: { x: 250, y: 450 },
//     data: { label: 'F' },
//   },
//   {
//     id: 'G',
//     position: { x: 20, y: 450 },
//     data: { label: 'G' },
//   },
// ];

// const edges = [
//   {
//     id: 'A->B',
//     source: 'A',
//     target: 'B',
//     markerEnd: {
//       type: MarkerType.Arrow,
//     },
//     label: 'default arrow',
//   },
//   {
//     id: 'C->D',
//     source: 'C',
//     target: 'D',
//     markerEnd: {
//       type: MarkerType.ArrowClosed,
//     },
//     label: 'default closed arrow',
//   },
//   {
//     id: 'D->E',
//     source: 'D',
//     target: 'E',
//     markerEnd: {
//       type: MarkerType.ArrowClosed,
//     },
//     markerStart: {
//       type: MarkerType.ArrowClosed,
//       orient: 'auto-start-reverse',
//     },
//     label: 'marker start and marker end',
//   },
//   {
//     id: 'E->F',
//     source: 'E',
//     target: 'F',
//     markerEnd: 'logo',
//     label: 'custom marker',
//   },
//   {
//     id: 'B->G',
//     source: 'B',
//     target: 'G',
//     markerEnd: {
//       type: MarkerType.ArrowClosed,
//       width: 20,
//       height: 20,
//       color: '#FF0072',
//     },
//     label: 'marker size and color',
//     style: {
//       strokeWidth: 2,
//       stroke: '#FF0072',
//     },
//   },
// ];
