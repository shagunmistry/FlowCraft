import { Node } from 'reactflow'

export const nodeStyle = {
  style: {
    // background: '#FFD1DC',
    // color: '#00000',
    // border: '1px solid #FF69B4',
    // width: 180,
    // borderRadius: 10,
    // fontSize: 20,
  },
}

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
          markerEnd: { type: 'arrow'Closed },
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
}

export const landingPageCodeExamples: any = {
  teachers: {
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
        dragging: true,
        ...nodeStyle,
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
        dragging: true,
        ...nodeStyle,
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
        dragging: true,
        ...nodeStyle,
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
        dragging: true,
        ...nodeStyle,
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
        dragging: true,
        ...nodeStyle,
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
        dragging: true,
        ...nodeStyle,
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
        dragging: true,
        ...nodeStyle,
      },
    ],
    edges: [
      {
        id: 'e1',
        source: 'mitochondria',
        target: 'cellPhysiology',
        data: { label: 'Impacts' },
        type: 'custom',
      },
      {
        id: 'e2',
        source: 'mitochondria',
        target: 'pathology',
        data: { label: 'Impacts' },
        type: 'custom',
      },
      {
        id: 'e3',
        source: 'cellPhysiology',
        target: 'atpSynthesis',
        data: { label: 'Involved in' },
        type: 'custom',
      },
      {
        id: 'e4',
        source: 'cellPhysiology',
        target: 'caHomeostasis',
        data: { label: 'Involved in' },
        type: 'custom',
      },
      {
        id: 'e5',
        source: 'pathology',
        target: 'metabolicPathways',
        data: { label: 'Involved in' },
        type: 'custom',
      },
      {
        id: 'e6',
        source: 'pathology',
        target: 'radicalProduction',
        data: { label: 'Involved in' },
        type: 'custom',
      },
    ],
  },
  engineers: {
    nodes: [
      {
        id: '1',
        data: {
          label: 'Direct short-term behavioral adaptations',
        },
        position: {
          x: 0,
          y: 75,
        },
        width: 150,
        height: 58,
        selected: false,
        positionAbsolute: {
          x: 0,
          y: 75,
        },
        dragging: true,
        ...nodeStyle,
      },
      {
        id: '2',
        data: {
          label: 'Indirect long-term behavioral adaptations',
        },
        position: {
          x: 350,
          y: 75,
        },
        width: 150,
        height: 58,
        selected: true,
        dragging: true,
        positionAbsolute: {
          x: 350,
          y: 75,
        },
        ...nodeStyle,
      },
      {
        id: '3',
        data: {
          label: 'Changes in travel behavior',
        },
        position: {
          x: 700,
          y: 75,
        },
        width: 150,
        height: 58,
        selected: false,
        positionAbsolute: {
          x: 700,
          y: 75,
        },
        dragging: true,
        ...nodeStyle,
      },
      {
        id: '4',
        data: {
          label: 'Increased situational awareness',
        },
        position: {
          x: -75,
          y: 225,
        },
        width: 150,
        height: 58,
        selected: false,
        positionAbsolute: {
          x: -75,
          y: 225,
        },
        dragging: true,
        ...nodeStyle,
      },
      {
        id: '5',
        data: {
          label: 'Decreased mental and physical workload',
        },
        position: {
          x: 100,
          y: 225,
        },
        width: 150,
        height: 58,
        selected: false,
        positionAbsolute: {
          x: 100,
          y: 225,
        },
        dragging: true,
        ...nodeStyle,
      },
      {
        id: '6',
        data: {
          label: 'Decrease in aggressive driving',
        },
        position: {
          x: 275,
          y: 225,
        },
        width: 150,
        height: 58,
        selected: false,
        positionAbsolute: {
          x: 275,
          y: 225,
        },
        dragging: true,
        ...nodeStyle,
      },
      {
        id: '7',
        data: {
          label: 'Overreliance on Autopilot',
        },
        position: {
          x: 450,
          y: 225,
        },
        width: 150,
        height: 58,
        selected: false,
        positionAbsolute: {
          x: 450,
          y: 225,
        },
        dragging: true,
        ...nodeStyle,
      },
      {
        id: '8',
        data: {
          label: 'More long-distance trips',
        },
        position: {
          x: 800,
          y: 225,
        },
        width: 150,
        height: 58,
        selected: false,
        positionAbsolute: {
          x: 800,
          y: 225,
        },
        dragging: true,
        ...nodeStyle,
      },
      {
        id: '9',
        data: {
          label: 'Route choice with FSD Beta',
        },
        position: {
          x: 625,
          y: 225,
        },
        width: 150,
        height: 58,
        selected: false,
        positionAbsolute: {
          x: 625,
          y: 225,
        },
        dragging: true,
        ...nodeStyle,
      },
    ],
    edges: [
      {
        id: 'e1-4',
        source: '1',
        target: '4',
        animated: true,
        type: 'custom',
      },
      {
        id: 'e1-5',
        source: '1',
        target: '5',
        animated: true,
        type: 'custom',
      },
      {
        id: 'e2-6',
        source: '2',
        target: '6',
        animated: true,
        type: 'custom',
      },
      {
        id: 'e2-7',
        source: '2',
        target: '7',
        animated: true,
        type: 'custom',
      },
      {
        id: 'e3-8',
        source: '3',
        target: '8',
        animated: true,
        type: 'custom',
      },
      {
        id: 'e3-9',
        source: '3',
        target: '9',
        animated: true,
        type: 'custom',
      },
    ],
  },
  students: {
    nodes: [
      {
        id: '1',
        data: {
          label: 'British East India Company',
        },
        position: {
          x: 250,
          y: 50,
        },
        width: 150,
        height: 58,
        ...nodeStyle,
      },
      {
        id: '2',
        data: {
          label: 'Financial problems',
        },
        position: {
          x: 100,
          y: 150,
        },
        width: 150,
        height: 40,
        ...nodeStyle,
      },
      {
        id: '3',
        data: {
          label: "Parliament's authority over colonies",
        },
        position: {
          x: 400,
          y: 150,
        },
        width: 150,
        height: 58,
        ...nodeStyle,
      },
      {
        id: '4',
        data: {
          label: 'Boston Tea Party',
        },
        position: {
          x: 250,
          y: 250,
        },
        width: 150,
        height: 40,
        ...nodeStyle,
      },
      {
        id: '5',
        data: {
          label: 'American Revolution',
        },
        position: {
          x: 100,
          y: 350,
        },
        width: 150,
        height: 40,
        ...nodeStyle,
      },
      {
        id: '6',
        data: {
          label: 'War of Independence',
        },
        position: {
          x: 400,
          y: 350,
        },
        width: 150,
        height: 40,
        ...nodeStyle,
      },
      {
        id: '7',
        data: {
          label: 'End of British colonialization',
        },
        position: {
          x: 250,
          y: 450,
        },
        width: 150,
        height: 58,
        ...nodeStyle,
      },
      {
        id: '8',
        data: {
          label: 'Emergence of the United States',
        },
        position: {
          x: 250,
          y: 550,
        },
        width: 150,
        height: 58,
        ...nodeStyle,
      },
    ],
    edges: [
      {
        id: '1-2',
        source: '1',
        target: '2',
        data: { label: 'leads to' },
        type: 'custom',
      },
      {
        id: '1-3',
        source: '1',
        target: '3',
        data: { label: 'leads to' },
        type: 'custom',
      },
      {
        id: '2-4',
        source: '2',
        target: '4',
        data: { label: 'results in' },
        type: 'custom',
      },
      {
        id: '3-4',
        source: '3',
        target: '4',
        data: { label: 'results in' },
        type: 'custom',
      },
      {
        id: '4-5',
        source: '4',
        target: '5',
        data: { label: 'leads to' },
        type: 'custom',
      },
      {
        id: '4-6',
        source: '4',
        target: '6',
        data: { label: 'leads to' },
        type: 'custom',
      },
      {
        id: '5-7',
        source: '5',
        target: '7',
        data: { label: 'results in' },
        type: 'custom',
      },
      {
        id: '6-7',
        source: '6',
        target: '7',
        data: { label: 'results in' },
        type: 'custom',
      },
      {
        id: '7-8',
        source: '7',
        target: '8',
        data: { label: 'leads to' },
        type: 'custom',
      },
    ],
  },
  healthcare: {
    nodes: [
      {
        id: '1',
        position: {
          x: 50,
          y: 50,
        },
        data: {
          label: 'Cardiac Arrest',
        },
        width: 150,
        height: 40,
        ...nodeStyle,
      },
      {
        id: '2',
        position: {
          x: 50,
          y: 225,
        },
        data: {
          label:
            'Symptoms (Fatigue, Dizziness, Shortness of breath, Nausea, Chest pain, Heart palpitations, Loss of consciousness)',
        },
        width: 150,
        height: 112,
        selected: false,
        positionAbsolute: {
          x: 50,
          y: 225,
        },
        dragging: true,
        ...nodeStyle,
      },
      {
        id: '3',
        position: {
          x: 250,
          y: 275,
        },
        data: {
          label:
            'Causes(Arrhythmia, Enlarged heart, Coronary artery disease, Blood loss, Valvular heart disease, Lack of oxygen, High levels of potassium and magnesium)',
        },
        width: 150,
        height: 166,
        selected: false,
        positionAbsolute: {
          x: 250,
          y: 275,
        },
        dragging: true,
        ...nodeStyle,
      },
      {
        id: '4',
        position: {
          x: 450,
          y: 250,
        },
        data: {
          label:
            'Risk Factors (Alcohol or drug abuse, Family history of heart disease or cardiac arrest, Heart disease, High blood pressure, High cholesterol, Low potassium or magnesium, Obesity, Smoking)',
        },
        width: 150,
        height: 202,
        selected: false,
        positionAbsolute: {
          x: 450,
          y: 250,
        },
        dragging: true,
        ...nodeStyle,
      },
      {
        id: '5',
        position: {
          x: 550,
          y: 125,
        },
        data: {
          label: 'Difference between cardiac arrest and a heart attack',
        },
        width: 150,
        height: 76,
        selected: false,
        positionAbsolute: {
          x: 550,
          y: 125,
        },
        dragging: true,
        ...nodeStyle,
      },
      {
        id: '6',
        position: {
          x: 525,
          y: -150,
        },
        data: {
          label: 'Treatment (CPR, Defibrillator)',
        },
        width: 150,
        height: 58,
        selected: false,
        positionAbsolute: {
          x: 525,
          y: -150,
        },
        dragging: true,
        ...nodeStyle,
      },
      {
        id: '7',
        position: {
          x: 575,
          y: 0,
        },
        data: {
          label: 'Recovery Process',
        },
        width: 150,
        height: 40,
        selected: false,
        positionAbsolute: {
          x: 575,
          y: 0,
        },
        dragging: true,
        ...nodeStyle,
      },
      {
        id: '8',
        position: {
          x: 325,
          y: -250,
        },
        data: {
          label:
            'Prevention (Eating heart-healthy meals, Losing weight, Exercising, Quitting smoking and drug use, Reducing alcohol intake)',
        },
        width: 150,
        height: 148,
        selected: false,
        positionAbsolute: {
          x: 325,
          y: -250,
        },
        dragging: true,
        ...nodeStyle,
      },
    ],
    edges: [
      {
        id: 'e1-2',
        source: '1',
        target: '2',
        animated: true,
        type: 'custom',
        data: { label: 'leads to' },
      },
      {
        id: 'e2-3',
        source: '1',
        target: '3',
        animated: true,
        type: 'custom',
        data: { label: 'caused by' },
      },
      {
        id: 'e3-4',
        source: '1',
        target: '4',
        animated: true,
        type: 'custom',
        data: { label: 'risk factors' },
      },
      {
        id: 'e4-5',
        source: '1',
        target: '5',
        animated: true,
        type: 'custom',
        data: { label: 'distinguished from' },
      },
      {
        id: 'e5-6',
        source: '1',
        target: '6',
        animated: true,
        type: 'custom',
        data: { label: 'treated by' },
      },
      {
        id: 'e6-7',
        source: '1',
        target: '7',
        animated: true,
        type: 'custom',
        data: { label: 'followed by' },
      },
      {
        id: 'e7-8',
        source: '1',
        target: '8',
        animated: true,
        type: 'custom',
        data: { label: 'prevented by' },
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

export const initialNodes: Node[] = [
  {
    id: '1',
    data: {
      label: 'Start',
    },
    position: {
      x: 300,
      y: -150,
    },
    type: 'input',
    width: 180,
    height: 52,
    selected: true,
    positionAbsolute: {
      x: 300,
      y: -150,
    },
    dragging: false,
    ...nodeStyle,
  },
  {
    id: '2',
    data: {
      label: 'Fold the Paper in Half',
    },
    position: {
      x: 300,
      y: 0,
    },
    width: 180,
    height: 82,
    ...nodeStyle,
    type: 'customNode',
  },
  {
    id: '3',
    data: {
      label: 'Unfold the Paper',
    },
    position: {
      x: 300,
      y: 200,
    },
    width: 180,
    height: 52,
    ...nodeStyle,
    type: 'customNode',
  },
  {
    id: '4',
    data: {
      label: 'Fold the Top Corners to the Center',
    },
    position: {
      x: 500,
      y: 50,
    },
    width: 180,
    height: 112,
    ...nodeStyle,
    type: 'customNode',
  },
  {
    id: '5',
    data: {
      label: 'Fold the Top Edges to the Center',
    },
    position: {
      x: 500,
      y: 200,
    },
    width: 180,
    height: 112,
    ...nodeStyle,
    type: 'customNode',
  },
  {
    id: '6',
    data: {
      label: 'Fold the Plane in Half',
    },
    position: {
      x: 850,
      y: 50,
    },
    width: 180,
    height: 82,
    selected: false,
    positionAbsolute: {
      x: 850,
      y: 50,
    },
    dragging: false,
    ...nodeStyle,
    type: 'customNode',
  },
  {
    id: '7',
    data: {
      label: 'Fold the Wings Down',
    },
    position: {
      x: 850,
      y: 225,
    },
    width: 180,
    height: 82,
    selected: false,
    positionAbsolute: {
      x: 850,
      y: 225,
    },
    dragging: false,
    ...nodeStyle,
    type: 'customNode',
  },
  {
    id: '8',
    data: {
      label: 'Finish',
    },
    position: {
      x: 1100,
      y: 100,
    },
    type: 'output',
    width: 180,
    height: 52,
    ...nodeStyle,
  },
]

export const initialEdges = [
  {
    id: '1-2',
    source: '1',
    target: '2',
    type: 'floating',
    data: {
      label: 'Step 1: Get some paper',
    },
  },
  {
    id: '2-3',
    source: '2',
    target: '3',
    type: 'floating',
  },
  {
    id: '3-4',
    source: '3',
    target: '4',
    type: 'floating',
  },
  {
    id: '3-5',
    source: '3',
    target: '5',
    type: 'floating',
  },
  {
    id: '4-6',
    source: '4',
    target: '6',
    type: 'floating',
  },
  {
    id: '5-6',
    source: '5',
    target: '6',
    type: 'floating',
  },
  {
    id: '6-7',
    source: '6',
    target: '7',
    type: 'floating',
  },
  {
    id: '7-8',
    source: '7',
    target: '8',
    type: 'floating',
    data: {
      label: 'Step 8: Enjoy your paper airplane!',
    },
  },
]
