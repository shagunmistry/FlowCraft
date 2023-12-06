'use client'
// @ts-ignore
import factory from 'mxgraph'

declare global {
  interface Window {
    mxBasePath: string
    mxLoadResources: boolean
    mxForceIncludes: boolean
    mxLoadStylesheets: boolean
    mxResourceExtension: string
  }
}

window.mxBasePath = 'assets/mxgraph'
window.mxLoadResources = true
window.mxForceIncludes = false
window.mxLoadStylesheets = true
window.mxResourceExtension = '.txt'

export default factory({
  // not working see https://github.com/jgraph/mxgraph/issues/479
  mxBasePath: 'assets/mxgraph',
})
