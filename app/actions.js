import { Set } from 'immutable'
import { spawnStars, findGroup } from './common'

export const SELECT = 'SELECT'
export const POP = 'POP'
export const RESTART = 'RESTART'

export const restart = startCondition => dispatch => {
  const stars = (startCondition && startCondition.stars) || spawnStars()
  const score = (startCondition && startCondition.score) || 0
  dispatch({ type: RESTART, stars, score })
}

// 点击某个位置的星星
export const click = point => (dispatch, getState) => {
  const { stars, selectedGroup } = getState().toObject()
  if (selectedGroup.has(point)) {
    dispatch({ type: POP })
  } else {
    const group = findGroup(stars, stars.keySeq().toSet(), point)
    if (group.size === 1) { // 只有一个星星的group是非法的
      dispatch({ type: SELECT, group: Set() })
    } else {
      dispatch({ type: SELECT, group })
    }
  }
}
