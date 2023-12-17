import { memo } from 'react'
import { Handle, Position } from 'reactflow'

function CustomInputBoxNode(props: any) {
  console.log('CustomInputBoxNode', props)
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={true}
      />
      <div className="input-box-node">
        <div className="input-box-node__title">
          <span>{props.data.label}</span>
        </div>
        <div className="input-box-node__body">
          <input
            type="text"
            defaultValue={props.data.label}
            // onChange={(event) => {
            //   data.value = event.target.value
            // }}
          />
        </div>
      </div>
    </>
  )
}

export default memo(CustomInputBoxNode)
