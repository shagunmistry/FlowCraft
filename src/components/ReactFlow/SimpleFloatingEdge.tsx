import { useCallback, useContext } from 'react'
import {
  useStore,
  BaseEdge,
  EdgeLabelRenderer,
  useReactFlow,
  getSimpleBezierPath,
} from 'reactflow'

import { getEdgeParams } from './Utils'
import { DiagramContext } from '@/lib/Contexts/DiagramContext'
import { TrashIcon } from '@heroicons/react/20/solid'

function FloatingEdge({ id, source, target, markerEnd, style, data }: any) {
  const { setEdges } = useReactFlow()
  const { edges, setEdges: setContextEdges } = useContext(DiagramContext)
  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(source), [source]),
  )
  const targetNode = useStore(
    useCallback((store) => store.nodeInternals.get(target), [target]),
  )

  if (!sourceNode || !targetNode) {
    return null
  }

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode,
  )

  const [edgePath, labelX, labelY] = getSimpleBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  })

  const deleteEdge = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id))

    if (setContextEdges) {
      const newEdges = edges.filter((edge) => edge.id !== id)
      setContextEdges(newEdges)
    }
  }

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          strokeWidth: 2,
          stroke: 'black',
          ...style,
        }}
      />
      {data && data.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              // everything inside EdgeLabelRenderer has no pointer events by default
              // if you have an interactive element, set pointer-events: all
              pointerEvents: 'all',
            }}
            className="nodrag nopan rounded bg-yellow-300 p-2 text-xs font-semibold"
            // onClick={deleteEdge}
          >
            {data.label}
            <button
              onClick={deleteEdge}
              className="absolute right-0 top-0 flex h-6 w-6 -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full bg-red-500 text-white transition-colors duration-200 hover:bg-red-600"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}

export default FloatingEdge
