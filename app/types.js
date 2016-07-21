import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { Record } from 'immutable'

export const Point = Record({
  x: 0,
  y: 0,
})
Point.propTypes = ImmutablePropTypes.recordOf({
  x: React.PropTypes.number.isRequired,
  y: React.PropTypes.number.isRequired,
})

// export const Star = Record({
//   color: 'black',
//   point: Point(),
// })
// Star.propTypes = ImmutablePropTypes.recordOf({
//   color: React.PropTypes.string.isRequired,
//   point: Point.propTypes.isRequired,
// })
