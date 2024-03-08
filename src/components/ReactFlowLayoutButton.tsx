import { Edge, Node, Panel } from 'reactflow'

import ELK from 'elkjs'
import { Dispatch, SetStateAction, useCallback } from 'react'
const elk = new ELK()

const randomLayoutOptions = [
  'box',
  'disco',
  'fixed',
  'force',
  'layered',
  'mrtree',
  'radial',
  'random',
  'rectpacking',
  'sporeCompaction',
  'sporeOverlap',
  'stress',
  'topdownpacking',
]

const useLayoutElements = () => {
  const getLayoutedElements = useCallback(
    (options: any, nodes: any, edges: any, setNodes: any, setLoading: any) => {
      setLoading(true)

      const randomOption =
        randomLayoutOptions[
          Math.floor(Math.random() * randomLayoutOptions.length)
        ]
      console.log('Random option', randomOption)
      const defaultOptions = {
        'elk.algorithm': `org.eclipse.elk.${randomOption}`,
        'elk.layered.spacing.nodeNodeBetweenLayer': 100,
        'elk.spacing.nodeNode': 80,
        'elk.direction': 'RIGHT',
      }

      const layoutOptions = { ...defaultOptions, ...options }
      const graph = {
        id: 'root',
        layoutOptions,
        children: nodes,
        edges: edges,
      }

      console.log('Layouting graph', graph)
      return elk
        .layout(graph)
        .then(({ children }) => {
          console.log('Layouted graph', children)
          if (!children) return null

          children.forEach((child: any) => {
            child.position = { x: child.x, y: child.y }
          })

          setNodes([])
          setTimeout(() => {
            setNodes(children)
            setLoading(false)
          }, 3000)
        })
        .catch((error) => {
          console.error('Error during layout', error)
          setLoading(false)

          return null
        })
    },
    [],
  )

  return { getLayoutedElements }
}

export default function ReactFlowLayoutButton({
  nodes,
  edges,
  setNodes,
  setLoading,
}: {
  nodes: Node[]
  edges: Edge[]
  setNodes: (nodes: Node[]) => void
  setLoading: (loading: boolean) => void
}) {
  const { getLayoutedElements } = useLayoutElements()

  return (
    <Panel position="top-left">
      <button
        type="button"
        className="inline-flex items-center gap-x-1.5 rounded-xl bg-pink-500 px-2.5 px-4 py-1.5 py-2 text-sm font-bold font-semibold text-white text-white shadow-sm hover:bg-indigo-500 hover:bg-pink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={() => {
          getLayoutedElements({}, nodes, edges, setNodes, setLoading)
        }}
      >
        Randomize Layout
      </button>
    </Panel>
  )
}
