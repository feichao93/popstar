export const SELECT = 'SELECT'

export const POP = 'POP'

// 选中某个位置的星星
export const select = point => ({ type: SELECT, point })

// 消除选中的星星
export const pop = () => ({ type: POP })

export const click = point => (dispatch, getState) => {
  dispatch({ type: SELECT, point })
}
