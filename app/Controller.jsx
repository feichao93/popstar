import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import { getBonus, asSnapshotString } from './common'
import { restart } from './actions'
import { GRID_SIZE, SIZE } from './constants'

function getProps(state) {
  return state.toObject()
}

@connect(getProps, { restart })
export default class Controller extends React.Component {
  static propTypes = {
    score: React.PropTypes.number.isRequired,
    stars: ImmutablePropTypes.mapOf(React.PropTypes.string),
    gameover: React.PropTypes.bool.isRequired,
    restart: React.PropTypes.func.isRequired,
  }

  copy = () => {
    this.refs.input.select()
    document.execCommand('copy')
  }

  render() {
    const { score, gameover, stars } = this.props
    const bonus = getBonus(stars.size)
    return (
      <div
        style={{
          position: 'absolute',
          left: (SIZE + 2) * GRID_SIZE,
          top: GRID_SIZE,
        }}
      >
        <label>当前得分</label>
        <input type="text" readOnly="readOnly" value={score} />
        <br />
        {gameover ? (
          <p style={{ color: 'red' }}>游戏结束 {score - bonus} + {bonus}</p>
        ) : null}
        <br />
        <div>
          <button onClick={this.props.restart}>重新开始</button>
        </div>
        <textarea
          ref="input"
          readOnly="readOnly"
          rows="6"
          style={{
            width: 300,
            maxWidth: 300,
            height: 15 * (SIZE + 5),
            maxHeight: 15 * (SIZE + 5),
            marginTop: 30,
            fontFamily: 'monospace',
          }}
          value={asSnapshotString(score, stars)}
        />
        <div>
          <button onClick={this.copy}>copy snapshot</button>
        </div>
      </div>
    )
  }
}
