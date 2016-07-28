import { Map, Set, List } from 'immutable'
import { spawnStars, getScore, arrangeStars, isGameover, getBonus } from './common'
import { SELECT, POP, RESTART, UNDO, REDO } from './actions'

const gameInitialState = Map({
  score: 0,
  stars: spawnStars(),
  selectedGroup: Set(),
})

function gameReducer(state = gameInitialState, action) {
  if (action.type === SELECT) {
    return state.set('selectedGroup', action.group)
  } else if (action.type === POP) {
    const stars = state.get('stars')
    const selectedGroup = state.get('selectedGroup')
    const updatedStars = arrangeStars(stars.filterNot((color, point) => selectedGroup.has(point)))
    return state.withMutations(s => {
      s.set('stars', updatedStars)
        .update('score', score => score + getScore(selectedGroup.size))
        .set('selectedGroup', Set())
      if (isGameover(updatedStars)) { // 如果游戏结束, 要加上bonus分数
        s.update('score', score => score + getBonus(updatedStars.size))
      }
    })
  } else if (action.type === RESTART) {
    return state.set('score', action.score)
      .set('stars', action.stars)
      .set('selectedGroup', Set())
  }
  return state
}

const initialState = Map({
  history: List(),
  pointer: 0,
})

export default function reducer(state = initialState, action) {
  const history = state.get('history')
  const pointer = state.get('pointer')
  if (action.type === UNDO) {
    if (pointer > 0) {
      return state.set('pointer', pointer - 1)
    }
    return state
  }
  if (action.type === REDO) {
    if (pointer < history.size - 1) {
      return state.set('pointer', pointer + 1)
    }
    return state
  }

  const nextGameState = gameReducer(history.get(pointer), action)
  if (action.type === POP) {
    return state.setIn(['history', pointer + 1], nextGameState)
      .set('pointer', pointer + 1)
      .update('history', h => h.setSize(pointer + 2)) // POP之后需要清空已有的redo记录
      .setIn(['history', pointer, 'selectedGroup'], Set()) // 取消选中
  }
  if (action.type === RESTART) {
    return state.set('history', List([nextGameState]))
      .set('pointer', 0)
  }
  return state.setIn(['history', pointer], nextGameState)
}
