import React from 'react'
import { Range } from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { SIZE, GRID_SIZE, COLORS, SELECTED_COLORS } from './constants'
import { Point } from './types'
import { click } from './actions'

const styles = {
  width: GRID_SIZE,
  height: GRID_SIZE,
  position: 'absolute',
  left: 0,
  top: 0,
  border: '1px solid #424242',
}

const getProps = state => state.toObject()

@connect(getProps, { click })
export default class Board extends React.Component {
  static propTypes = {
    selectedGroup: ImmutablePropTypes.setOf(Point.propTypes.isRequired).isRequired,
    stars: ImmutablePropTypes.mapOf(React.PropTypes.string),
    click: React.PropTypes.func.isRequired,
  }

  render() {
    const { selectedGroup, stars } = this.props
    // console.log(String(stars))
    return (
      <div style={{ position: 'absolute', left: GRID_SIZE, top: GRID_SIZE }}>
        <Grids />
        <Coordinates />
        <div className="stars">
          {stars.map((color, point) =>
            <Star
              key={point}
              point={point}
              color={color}
              selected={selectedGroup.has(point)}
              onClick={() => this.props.click(point)}
            />
          ).toArray()}
        </div>
      </div>
    )
  }
}

const Coordinates = () => (
  <div>
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: SIZE * GRID_SIZE,
        display: 'flex',
      }}
    >
      {Range(0, SIZE).map(x =>
        <p
          key={x}
          style={{
            width: GRID_SIZE,
            lineHeight: `${GRID_SIZE}px`,
            margin: 0,
            textAlign: 'center',
          }}
        >
          {x}
        </p>
      ).toArray()}
    </div>
    <div
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {Range(0, SIZE).map(y =>
        <p
          key={y}
          style={{
            width: GRID_SIZE,
            lineHeight: `${GRID_SIZE}px`,
            margin: 0,
            textAlign: 'center',
          }}
        >
          {SIZE - 1 - y}
        </p>
      )}
    </div>
  </div>
)

const Grids = () => (
  <div className="grids">
    {Range(0, SIZE * SIZE).map(index =>
      <div
        key={index}
        className="grid"
        style={{
          transform: `translate(${GRID_SIZE * (index % SIZE)}px,
                  ${GRID_SIZE * (SIZE - 1 - (Math.floor(index / SIZE)))}px)`,
          ...styles,
        }}
      />
    )}
  </div>
)

const Star = ({ point, color, onClick, selected }) => (
  <div
    className="star"
    onClick={onClick}
    style={{
      transform: `translate(${GRID_SIZE * point.x}px, ${GRID_SIZE * (SIZE - 1 - point.y)}px)`,
      background: (selected ? SELECTED_COLORS : COLORS)[color],
      ...styles,
    }}
  />
)

Star.propTypes = {
  point: Point.propTypes.isRequired,
  color: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
  selected: React.PropTypes.bool.isRequired,
}
