import { Map } from 'immutable'
import { spawnStars, groupStars, getScore, arrangeStars } from './common'
import { SELECT, POP } from './actions'

const intitalState = Map({
  score: 0,
  stars: spawnStars(),
  selectedPoint: null,
  gameover: false, // 用于标记游戏是否结束
})

export default function reducer(state = intitalState, action) {
  if (action.type === SELECT) {
    return state.set('selectedPoint', action.point)
  } else if (action.type === POP) {
    const stars = state.get('stars')
    const selectedPoint = state.get('selectedPoint')
    const groups = groupStars(stars)
    const group = groups.find(g => g.has(selectedPoint))
    return state.set('stars', stars.filterNot((color, point) => group.has(point)))
      .update('stars', arrangeStars)
      .set('selectedPoint', null)
      .update('score', score => score + getScore(group.size))
  }
  return state
}
