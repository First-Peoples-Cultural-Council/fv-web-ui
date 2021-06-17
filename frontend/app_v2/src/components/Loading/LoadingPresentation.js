import React from 'react'
/**
 * @summary LoadingPresentation
 * @component
 *
 * @param {object} props
 *
 * @returns {node} jsx markup
 */
function LoadingPresentation() {
  return (
    <div className="mt-72">
      <div className="flex justify-center items-center">
        <div className="bg-song w-10 h-10 rounded-full m-8 animate-pulse-blur" />
        <div className="bg-phrase w-10 h-10 rounded-full m-8 animate-pulse-blur" style={{ animationDelay: '0.2s' }} />
        <div className="bg-story w-10 h-10 rounded-full m-8 animate-pulse-blur" style={{ animationDelay: '0.4s' }} />
        <div className="bg-word w-10 h-10 rounded-full m-8 animate-pulse-blur" style={{ animationDelay: '0.6s' }} />
      </div>
      <div className="text-center text-xl font-semibold">Loading...</div>
    </div>
  )
}

export default LoadingPresentation
