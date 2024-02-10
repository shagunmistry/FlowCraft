import React, { FC } from 'react'
import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
  getSimpleBezierPath,
  getSmoothStepPath,
  getStraightPath,
} from 'reactflow'

const CustomEdge: FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: '#f4f4f4',
          strokeWidth: 5,
        }}
        interactionWidth={10}
      />
      <EdgeLabelRenderer>
        {data && data.label && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              background: '#f4f4f4',
              padding: 10,
              borderRadius: 5,
              fontSize: 15,
              fontWeight: 700,
              border: 'none',
            }}
            className="nodrag nopan"
          >
            {data.label}
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  )
}

export default CustomEdge
