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
