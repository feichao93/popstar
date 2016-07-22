import { Set } from 'immutable'
import { groupAllStars, spawnStars } from './common'

export const SELECT = 'SELECT'
export const POP = 'POP'
export const RESTART = 'RESTART'

export const restart = () => dispatch => {
  const stars = spawnStars()
  dispatch({ type: RESTART, stars })
}

// 点击某个位置的星星
export const click = point => (dispatch, getState) => {
  const { stars, selectedGroup } = getState().toObject()
  if (selectedGroup.has(point)) {
    dispatch({ type: POP })
  } else {
    const groups = groupAllStars(stars)
    const group = groups.find(g => g.has(point))
    if (group.size === 1) { // 只有一个星星的group是非法的
      dispatch({ type: SELECT, group: Set() })
    } else {
      dispatch({ type: SELECT, group })
    }
  }
}
