import { Map, Set } from 'immutable'
import { spawnStars, getScore, arrangeStars, isGameover, getBonus } from './common'
import { SELECT, POP, RESTART } from './actions'

const intitalState = Map({
  score: 0,
  stars: spawnStars(),
  selectedGroup: Set(),
  gameover: false, // 用于标记游戏是否结束
})

export default function reducer(state = intitalState, action) {
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
        s.set('gameover', true)
          .update('score', score => score + getBonus(updatedStars.size))
      }
    })
  } else if (action.type === RESTART) {
    return state.set('score', 0)
      .set('stars', action.stars)
      .set('selectedGroup', Set())
      .set('gameover', false)
  }
  return state
}
