'use client'
import {
  EllipsisHorizontalIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/20/solid'
import React, { memo } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'

export default memo((props: NodeProps) => {
  console.log('------ CustomInputBoxNode', props.sourcePosition)

  const pinNodeToGrid = (id: string) => {
    console.log('pinNodeToGrid', id)
  }

  return (
    <div className="py-2">
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
        className="mx-auto block rounded bg-blue-500 p-1 text-xs font-bold text-white hover:bg-blue-700"
        onClick={() => pinNodeToGrid(props.id)}
      >
        <EllipsisHorizontalIcon className="h-4 w-4" />
      </button>
      <Handle
        type="target"
        position={props.targetPosition || Position.Bottom}
        id="b"
        isConnectable={props.isConnectable}
      />
    </div>
  )
})
