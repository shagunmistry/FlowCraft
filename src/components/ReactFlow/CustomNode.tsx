'use client'
import React, { memo } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'

export default memo((props: NodeProps) => {
  console.log('------ CustomInputBoxNode', props.sourcePosition)

  return (
    <>
      <Handle
        type="source"
        position={props.sourcePosition || Position.Top}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={props.isConnectable}
      />
      {props.data && props.data.label ? (
        <div className="text-center">{props.data.label}</div>
      ) : null}
      <button
        className="mx-auto rounded bg-blue-500 p-1 text-xs font-bold text-white hover:bg-blue-700"
        onClick={() => console.log('pin')}
      >
        Pin
      </button>
      <Handle
        type="target"
        position={props.targetPosition || Position.Bottom}
        id="b"
        isConnectable={props.isConnectable}
      />
    </>
  )
})
