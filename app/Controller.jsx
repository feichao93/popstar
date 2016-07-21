import React from 'react'
import { connect } from 'react-redux'

function getProps(state) {
  return state.toObject()
}

@connect(getProps)
export default class Controller extends React.Component {
  static propTypes = {
    score: React.PropTypes.number.isRequired,
  }

  render() {
    const { score } = this.props
    return (
      <div className="controller">
        <label>当前分数</label>
        <input type="text" readOnly value={score} />
      </div>
    )
  }
}
