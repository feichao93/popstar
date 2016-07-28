import React from 'react'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { is } from 'immutable'
import { connect } from 'react-redux'
import { getBonus, asSnapshotString, parserJson, isGameover } from './common'
import { restart, undo, redo } from './actions'
import { GRID_SIZE, SIZE } from './constants'
import getGameState from './getGameState'

function getProps(state) {
  const pointer = state.get('pointer')
  const history = state.get('history')
  return {
    ...getGameState(state).toObject(),
    pointer,
    historySize: history.size,
  }
}

@connect(getProps, { restart, undo, redo })
export default class Controller extends React.Component {
  static propTypes = {
    score: React.PropTypes.number.isRequired,
    stars: ImmutablePropTypes.mapOf(React.PropTypes.string),
    pointer: React.PropTypes.number.isRequired,
    historySize: React.PropTypes.number.isRequired,
    // callbacks
    restart: React.PropTypes.func.isRequired,
    undo: React.PropTypes.func.isRequired,
    redo: React.PropTypes.func.isRequired,
  }

  state = {
    editing: false,
    editingValue: '',
    errorMessage: '',
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.score !== nextProps.score || !is(this.props.stars, nextProps.stars)) {
      this.setState({ editing: false })
    }
  }

  setErrorMessage = errorMessage => {
    this.setState({ errorMessage })
    clearTimeout(this.handle)
    this.handle = setTimeout(() => this.setState({ errorMessage: '' }), 1000)
  }

  startEdit = () => {
    const { score, stars } = this.props
    const editingValue = asSnapshotString(score, stars)
    this.setState({ editing: true, editingValue },
      () => this.refs.input.select())
  }

  edit = event => {
    this.setState({ editingValue: event.target.value })
  }

  cancelEdit = () => this.setState({ editing: false })

  confirmEdit = () => {
    const result = parserJson(this.state.editingValue)
    if (typeof result === 'string') {
      this.setErrorMessage(result)
    } else {
      this.props.restart(result)
    }
  }

  copy = () => {
    this.refs.input.select()
    document.execCommand('copy')
  }

  render() {
    const { score, stars, pointer, historySize } = this.props
    const gameover = isGameover(stars)
    const { editing, editingValue, errorMessage } = this.state
    const bonus = getBonus(stars.size)
    return (
      <div
        style={{
          position: 'absolute',
          left: (SIZE + 2) * GRID_SIZE,
          top: GRID_SIZE,
        }}
      >
        {gameover ? (
          <p style={{ color: 'red' }}>游戏结束
            <span style={{ fontWeight: 700, fontSize: '150%', margin: 20 }}>
              {score}
            </span>
            = {score - bonus} + {bonus}</p>
        ) : (
          <p>当前得分
            <span style={{ fontWeight: 700, fontSize: '150%', margin: 20 }}>
            {score}
            </span>
          </p>
        )}
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <button onClick={this.props.undo} disabled={!(pointer > 0)}>上一步</button>
            <span style={{ margin: 10 }}>{pointer + 1} / {historySize}</span>
            <button onClick={this.props.redo} disabled={!(pointer < historySize - 1)}>下一步</button>
          </div>
          <button onClick={() => this.props.restart()}>重新开始</button>
        </div>
        <textarea
          ref="input"
          readOnly={!editing}
          rows="6"
          style={{
            width: 300,
            maxWidth: 300,
            height: 15 * (SIZE + 5),
            maxHeight: 15 * (SIZE + 5),
            marginTop: 30,
            fontFamily: 'monospace',
          }}
          value={editing ? editingValue : asSnapshotString(score, stars)}
          onChange={editing ? this.edit : null}
        />
        <div style={{ display: 'flex' }}>
          {editing ? (
            <div>
              <button onClick={this.confirmEdit}>confirm</button>
              <button onClick={this.cancelEdit}>cancel</button>
            </div>
          ) : (
            <button onClick={this.startEdit}>edit</button>
          )}
          <button onClick={this.copy} style={{ marginLeft: 'auto' }}>copy snapshot</button>
        </div>
        <p style={{ color: 'red' }}>{errorMessage}</p>
      </div>
    )
  }
}
