import { useCallback, useContext, useState } from 'react'
import {
  useStore,
  getBezierPath,
  BaseEdge,
  EdgeLabelRenderer,
  useReactFlow,
} from 'reactflow'

import { AnimatePresence, motion } from 'framer-motion'
import { getEdgeParams } from './Utils'
import { PencilIcon } from '@heroicons/react/20/solid'
import { DiagramContext } from '@/lib/Contexts/DiagramContext'

function FloatingEdge({ id, source, target, markerEnd, style, data }: any) {
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

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  })

  const deleteEdge = () => {
    console.log('delete edge', id)
    const { setEdges } = useReactFlow()
    const { setEdges: contextSetEdges, edges: _edges } =
      useContext(DiagramContext)

    // remove edge from react-flow
    setEdges((edges) => edges.filter((edge) => edge.id !== id))

    // remove edge from context
    contextSetEdges(_edges.filter((edge) => edge.id !== id))
  }

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />
      {data && data.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
            className="absolute rounded bg-yellow-300 p-2 text-xs font-semibold hover:bg-black shadow-md shadow-yellow-300"
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}

export default FloatingEdge
