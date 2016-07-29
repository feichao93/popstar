import React from 'react'
import { Range, List, Map } from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { SIZE, GRID_SIZE, COLORS, SELECTED_COLORS } from './constants'
import { Point } from './types'
import { click } from './actions'
import getGameState from './getGameState'

const styles = {
  width: GRID_SIZE,
  height: GRID_SIZE,
  position: 'absolute',
  left: 0,
  top: 0,
  border: '1px solid #424242',
}

@connect(s => getGameState(s).toObject(), { click })
export default class Board extends React.Component {
  static propTypes = {
    selectedGroup: ImmutablePropTypes.setOf(Point.propTypes.isRequired).isRequired,
    stars: ImmutablePropTypes.mapOf(React.PropTypes.string),
    click: React.PropTypes.func.isRequired,
  }

  render() {
    const { selectedGroup, stars } = this.props
    return (
      <div
        style={{
          position: 'absolute',
          left: GRID_SIZE,
          top: GRID_SIZE,
          WebkitUserSelect: 'none',
          userSelect: 'none',
          cursor: 'default',
        }}
      >
        <Grids />
        <Coordinates />
        <div>
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
        <SelectedGroupBorder selectedGroup={selectedGroup} />
      </div>
    )
  }
}

function getBorder(lines) {
  const map = Map().withMutations(m => {
    lines.forEach(line => m.update(line, old => (old || 0) + 1))
  })
  return map.filter(count => count === 1).keySeq().toList()
}

const HLine = ({ x, y }) => (
  <div
    style={{
      height: 4,
      width: GRID_SIZE,
      position: 'absolute',
      left: 0,
      top: 0,
      background: 'linear-gradient(90deg, #cc7655 22%, #1fc8db 52%, #3a4776 75%)',
      borderRadius: '2px',
      transform: `translate(${GRID_SIZE * x}px, ${GRID_SIZE * (SIZE - y) - 1}px)`,
    }}
  />
)

const VLine = ({ x, y }) => (
  <div
    style={{
      height: GRID_SIZE,
      width: 4,
      position: 'absolute',
      left: 0,
      top: 0,
      background: 'linear-gradient(0, #cc7655 22%, #1fc8db 52%, #3a4776 75%)',
      borderRadius: '2px',
      transform: `translate(${GRID_SIZE * x - 1}px, ${GRID_SIZE * (SIZE - 1 - y)}px)`,
    }}
  />
)

HLine.propTypes = VLine.propTypes = {
  x: React.PropTypes.number.isRequired,
  y: React.PropTypes.number.isRequired,
}

const SelectedGroupBorder = ({ selectedGroup }) => {
  const hls = getBorder(selectedGroup.toList().flatMap(({ x, y }) => List([
    List([x, y]),
    List([x, y + 1]),
  ])))
  const vls = getBorder(selectedGroup.toList().flatMap(({ x, y }) => List([
    List([x, y]),
    List([x + 1, y]),
  ])))
  return (
    <div>
      {hls.map((hline, index) => <HLine key={index} x={hline.get(0)} y={hline.get(1)} />).toArray()}
      {vls.map((vline, index) => <VLine key={index} x={vline.get(0)} y={vline.get(1)} />).toArray()}
    </div>
  )
}

SelectedGroupBorder.propTypes = {
  selectedGroup: ImmutablePropTypes.setOf(Point.propTypes.isRequired).isRequired,
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
  <div>
    {Range(0, SIZE * SIZE).map(index =>
      <div
        key={index}
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
