import { Edge, Node } from 'reactflow'

const doAnyNodesOverlap = (nodes: Node[]): Node[] => {
  const overLappingNodes: Node[] = []
  const nodePositions = nodes.map((node) => node.position)
  const nodeWidths = nodes.map((node) => node.width)
  const nodeHeights = nodes.map((node) => node.height)

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    const nodePosition = nodePositions[i]
    const nodeWidth = nodeWidths[i]
    const nodeHeight = nodeHeights[i]

    for (let j = 0; j < nodes.length; j++) {
      if (i === j) {
        continue
      }

      const otherNode = nodes[j]
      const otherNodePosition = nodePositions[j]
      const otherNodeWidth = nodeWidths[j]
      const otherNodeHeight = nodeHeights[j]

      if (
        !otherNodePosition ||
        !otherNodeWidth ||
        !otherNodeHeight ||
        !nodeWidth ||
        !nodeHeight
      ) {
        continue
      }

      if (
        nodePosition.x < otherNodePosition.x + otherNodeWidth &&
        nodePosition.x + nodeWidth > otherNodePosition.x &&
        nodePosition.y < otherNodePosition.y + otherNodeHeight &&
        nodePosition.y + nodeHeight > otherNodePosition.y
      ) {
        overLappingNodes.push(node)
      }
    }
  }

  return overLappingNodes
}

const doAnyEdgesOverlap = (edges: Edge[]): Edge[] => {
  const overlappingEdges: Edge[] = []

  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i]

    for (let j = 0; j < edges.length; j++) {
      if (i === j) {
        continue
      }

      const otherEdge = edges[j]

      if (
        edge.source === otherEdge.source &&
        edge.target === otherEdge.target
      ) {
        overlappingEdges.push(edge)
      }
    }
  }

  return overlappingEdges
}

const doAnyNodesOverlapWithEdges = (nodes: Node[], edges: Edge[]): Node[] => {
  const overlappingNodes: Node[] = []
  const overlappingEdges = doAnyEdgesOverlap(edges)

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]

    for (let j = 0; j < overlappingEdges.length; j++) {
      const edge = overlappingEdges[j]

      if (edge.source === node.id || edge.target === node.id) {
        overlappingNodes.push(node)
      }
    }
  }

  return overlappingNodes
}

export const autoArrangeNodesAndEdges = (
  nodes: Node[],
  edges: Edge[],
): { nodes: Node[]; edges: Edge[] } => {
  const overlappingNodes = doAnyNodesOverlap(nodes)
  const overlappingNodesWithEdges = doAnyNodesOverlapWithEdges(nodes, edges)

  const newNodes = nodes.map((node) => {
    if (overlappingNodes.includes(node)) {
      return {
        ...node,
        position: {
          x: node.position.x + 100,
          y: node.position.y + 100,
        },
      }
    }

    if (overlappingNodesWithEdges.includes(node)) {
      return {
        ...node,
        position: {
          x: node.position.x + 100,
          y: node.position.y + 100,
        },
      }
    }

    return node
  })

  return { nodes: newNodes, edges }
}
