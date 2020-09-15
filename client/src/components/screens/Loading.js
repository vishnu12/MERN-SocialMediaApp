import React from 'react'
import loadingGif from '../../../src/images/gif/loading-arrow.gif'
const Loading = () => {
  return (
    <div className="loading">
      <h4>Loading.....</h4>
      <img src={loadingGif} alt="loadimg"/>
    </div>
  )
}

export default Loading