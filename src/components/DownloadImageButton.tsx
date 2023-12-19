import React from 'react'
import {
  Panel,
  useReactFlow,
  getRectOfNodes,
  getTransformForBounds,
} from 'reactflow'
import { toPng } from 'html-to-image'
import { downloadImage } from '@/lib/utils'
import { track } from '@vercel/analytics'
import { ArrowDownCircleIcon } from '@heroicons/react/24/outline'

const imageWidth = 1024
const imageHeight = 768

function DownloadButton() {
  const { getNodes } = useReactFlow()
  const onClick = () => {
    // we calculate a transform for the nodes so that all nodes are visible
    // we then overwrite the transform of the `.react-flow__viewport` element
    // with the style option of the html-to-image library

    if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') {
      track('download', {
        type: 'image',
      })
    }

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
        className="inline-flex items-center gap-x-1.5 rounded-xl bg-pink-500 px-2.5 px-4 py-1.5 py-2 text-sm font-bold font-semibold text-white text-white shadow-sm hover:bg-indigo-500 hover:bg-pink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={onClick}
      >
        <ArrowDownCircleIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
        Download Image
      </button>
    </Panel>
  )
}

export default DownloadButton
