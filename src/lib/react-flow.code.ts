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
    edgescode: `[
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
}
