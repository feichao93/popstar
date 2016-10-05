import React from 'react'
import hoistStatic from 'hoist-non-react-statics'
import { getDisplayName } from './common'

const storeType = React.PropTypes.object

export class Provider extends React.Component {
  static propTypes = {
    store: storeType.isRequired,
    children: React.PropTypes.node.isRequired,
  }

  static childContextTypes = {
    store: storeType,
  }

  getChildContext() {
    return { store: this.props.store }
  }

  render() {
    return React.Children.only(this.props.children)
  }
}

// eslint-disable-next-line no-unused-vars
const defaultMapStateToProps = storeState => ({})

const defaultMapDispatchToProps = dispatch => ({ dispatch })

function transformMapDispatchToProps(map) {
  if (typeof map === 'function') {
    return map
  }
  if (typeof map === 'object') {
    return (dispatch) => {
      const result = {}
      for (const key of Object.keys(map)) {
        result[key] = (...args) => dispatch(map[key](...args))
      }
      return result
    }
  }
  throw new Error('mapDispatchToProps must be a function or a object')
}

export function connect(mapStateToProps = defaultMapStateToProps,
                        mapDispatchToProps = defaultMapDispatchToProps) {
  const mapd2p = transformMapDispatchToProps(mapDispatchToProps)

  return function (Component) {
    // eslint-disable-next-line react/no-multi-comp
    class Connect extends React.Component {
      static displayName = `Connect(${getDisplayName(Component)})`

      static contextTypes = {
        store: storeType,
      }

      constructor(props, context) {
        super(props, context)
        this.store = context.store
        this.state = { storeState: this.store.getState() }
      }

      componentDidMount() {
        this.unsubscribe = this.store.subscribe(this.handleStoreChange)
      }

      componentWillUnmount() {
        this.unsubscribe()
      }

      handleStoreChange = () => {
        const newState = this.store.getState()
        this.setState({ storeState: newState })
      }

      render() {
        const { storeState } = this.state
        const ownProps = this.props

        const storeProps = mapStateToProps(storeState, ownProps)
        const dispatchProps = mapd2p(this.store.dispatch)

        const finalProps = Object.assign({},
          ownProps, storeProps, dispatchProps)

        return React.createElement(Component, finalProps)
      }
    }

    return hoistStatic(Connect, Component)
  }
}
