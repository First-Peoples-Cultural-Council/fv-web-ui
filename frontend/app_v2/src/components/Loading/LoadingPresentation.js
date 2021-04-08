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
    <div className="m-5">
      <div className="flex justify-center items-center">
        <div className="bg-fv-red w-10 h-10 rounded-full m-8 animate-pulse-blur" />
        <div
          className="bg-fv-orange w-10 h-10 rounded-full m-8 animate-pulse-blur"
          style={{ animationDelay: '0.2s' }}
        />
        <div className="bg-fv-blue w-10 h-10 rounded-full m-8 animate-pulse-blur" style={{ animationDelay: '0.4s' }} />
        <div
          className="bg-fv-turquoise w-10 h-10 rounded-full m-8 animate-pulse-blur"
          style={{ animationDelay: '0.6s' }}
        />
        <div
          className="bg-fv-purple w-10 h-10 rounded-full m-8 animate-pulse-blur"
          style={{ animationDelay: '0.8s' }}
        />
      </div>
      <div className="text-center text-xl font-semibold">Loading...</div>
    </div>
  )
}

export default LoadingPresentation
