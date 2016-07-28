export default function getGameState(state) {
  return state.getIn(['history', state.get('pointer')])
}
