import React from 'react'
import {
  Panel,
  useReactFlow,
  getRectOfNodes,
  getTransformForBounds,
} from 'reactflow'
import { toPng } from 'html-to-image'
import { downloadImage } from '@/lib/utils'

const imageWidth = 1024
const imageHeight = 768

function DownloadButton() {
  const { getNodes } = useReactFlow()
  const onClick = () => {
    // we calculate a transform for the nodes so that all nodes are visible
    // we then overwrite the transform of the `.react-flow__viewport` element
    // with the style option of the html-to-image library
    const nodesBounds = getRectOfNodes(getNodes())
    const transform = getTransformForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2,
    )

    const element = document.querySelector(
      '.react-flow__viewport',
    ) as HTMLElement

    toPng(element, {
      backgroundColor: '#1a365d',
      width: imageWidth,
      height: imageHeight,
      style: {
        width: '1024',
        height: '768',
        transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
      },
    }).then(downloadImage)
  }

  return (
    <Panel position="top-right">
      <button
        className="ml-5 rounded bg-pink-500 px-4 py-2 font-bold text-white hover:bg-pink-700"
        onClick={onClick}
      >
        Download Image
      </button>
    </Panel>
  )
}

export default DownloadButton
