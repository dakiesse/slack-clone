import React from 'react'
import PropTypes from 'prop-types'
import { Progress } from 'semantic-ui-react'

const ProgressBar = ({ uploadState, percentUploaded }) => (
  uploadState && (
    <Progress
      className="progress__bar"
      percent={percentUploaded}
      progress
      indicating
      size="medium"
      inverted
    />
  )
)

ProgressBar.propTypes = {
  uploadState: PropTypes.string.isRequired,
  percentUploaded: PropTypes.number.isRequired,
}

export default ProgressBar
