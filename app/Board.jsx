import React from 'react'
import { Range, Set } from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { SIZE, GRID_SIZE, COLORS, SELECTED_COLORS } from './constants'
import { Point } from './types'
import { click, pop } from './actions'
import { groupStars } from './common'

const getProps = state => state.toObject()

@connect(getProps, { click, pop })
export default class Board extends React.Component {
  static propTypes = {
    selectedPoint: Point.propTypes,
    stars: ImmutablePropTypes.mapOf(React.PropTypes.string),
    click: React.PropTypes.func.isRequired,
    pop: React.PropTypes.func.isRequired,
  }

  clickPoint = (point, hasSelected) => () => {
    if (hasSelected) {
      this.props.pop()
    } else {
      this.props.click(point)
    }
  }

  render() {
    const { selectedPoint, stars } = this.props
    // console.log(String(stars))
    const groups = groupStars(stars)
    let group = Set()
    if (selectedPoint) {
      group = groups.find(g => g.has(selectedPoint))
    }
    return (
      <div className="board">
        <div className="grids">
          {Range(0, SIZE * SIZE).map(index =>
            <div
              key={index}
              className="grid"
              style={{
                transform: `translate(${GRID_SIZE * (index % SIZE)}px,
                  ${GRID_SIZE * (SIZE - 1 - (Math.floor(index / SIZE)))}px)`,
                width: GRID_SIZE,
                height: GRID_SIZE,
              }}
            />
          )}
        </div>
        <div className="stars">
          {stars.map((color, point) =>
            <Star
              key={point}
              point={point}
              color={color}
              selected={group.has(point)}
              onClick={this.clickPoint(point, group.has(point))}
            />
          ).toArray()}
        </div>
      </div>
    )
  }
}

const Star = ({ point, color, onClick, selected }) => (
  <div
    className="star"
    onClick={onClick}
    style={{
      transform: `translate(${GRID_SIZE * point.x}px, ${GRID_SIZE * (SIZE - 1 - point.y)}px)`,
      background: (selected ? SELECTED_COLORS : COLORS)[color],
      width: GRID_SIZE,
      height: GRID_SIZE,
    }}
  />
)

Star.propTypes = {
  point: Point.propTypes.isRequired,
  color: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
  selected: React.PropTypes.bool.isRequired,
}
