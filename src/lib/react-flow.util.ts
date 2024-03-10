import CustomInputBoxNode from '@/components/ReactFlow/CustomInputBoxNode'
import { ConnectionLineType, Edge, EdgeTypes, Node } from 'reactflow'
import SimpleFloatingEdge from '@/components/ReactFlow/SimpleFloatingEdge'

export const defaultEdgeOptions = {
  animated: true,
  type: ConnectionLineType.Step,
}

export const nodeTypes = {
  customNode: CustomInputBoxNode,
}

export const edgeTypes: EdgeTypes = {
  floating: SimpleFloatingEdge,
}

export const defaultViewport = { x: 0, y: 0, zoom: 1.5 }
