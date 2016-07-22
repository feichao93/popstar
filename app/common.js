import { Range, Map, Set } from 'immutable'
import { SIZE, COLORS } from './constants'
import { Point } from './types'

export function getBonus(n) {
  return Math.max(0, 20 * SIZE * SIZE - 20 * n * n)
}

export function getScore(n) {
  return 5 * n * n
}

/** 整理星星 */
export function arrangeStars(stars) {
  const downMap = {} // downMap[x]用来记录一列中y坐标对应的星星应当掉落的距离
  Range(0, SIZE).forEach(x => {
    // downMap[x]数组中的元素数量总是比y大1
    downMap[x] = [0]
    Range(0, SIZE).forEach(y => {
      const point = Point({ x, y })
      // downMap[x][y]恰好是数组downMap[x]中的最后一个元素
      downMap[x].push(downMap[x][y] + (stars.has(point) ? 0 : 1))
    })
  })
  // todo 还要处理向左并拢的操作
  // left数组用来记录每一列应该向左平移的距离
  const left = [0]
  Range(0, SIZE).forEach(x => {
    // left数组中的元素数量总是比x大1
    if (stars.some((color, point) => point.x === x)) { // 至少有一个点在该列上
      left.push(left[x])
    } else {
      left.push(left[x] + 1)
    }
  })
  return stars.mapKeys(point => {
    const { x, y } = point
    // if (downMap[x][y] > 0) {
    // console.log(String(point), '-->', String(update('y', y => y - downMap[x][y])))
    // return point.set('y', y - downMap[x][y])
    return Point({ x: x - left[x], y: y - downMap[x][y] })
    // }
    // return point
  })
}

function getRandomColor() {
  const colors = Object.keys(COLORS)
  return colors[Math.floor(Math.random() * colors.length)]
}

/** 随机生成新的星星分布 */
export function spawnStars() {
  return Map().withMutations(m => {
    Range(0, SIZE * SIZE).forEach(index => {
      const point = Point({ x: index % SIZE, y: Math.floor(index / SIZE) })
      m.set(point, getRandomColor())
    })
  })
}

/** 获取与一个点相邻的点集合 */
const around = point => Set([
  point.update('x', x => x + 1),
  point.update('x', x => x - 1),
  point.update('y', y => y + 1),
  point.update('y', y => y - 1),
])

/** 对stars进行分组 */
export function groupAllStars(stars) {
  const groups = Set().asMutable()
  let pointsToTraverse = stars.keySeq().toSet()
  // let j = 0
  while (pointsToTraverse.size > 0) {
    const anchor = pointsToTraverse.first()
    // console.group('anchor:', String(anchor))
    const color = stars.get(anchor)
    let points = Set()
    let newAdd = Set([anchor])
    // console.log('newAdd:', String(newAdd))
    let next
    // let i = 0
    // while (i < SIZE) {
    while (true) { // eslint-disable-line no-constant-condition
      // console.log('dirty-next:', String(newAdd.flatMap(around)))
      next = newAdd.flatMap(around)
        .filter(point => ( // eslint-disable-line no-loop-func
          pointsToTraverse.has(point)
          && stars.get(point) === color
          && !points.has(point))
          && !newAdd.has(point)
        )
      // console.log('next:', String(next))

      points = points.union(newAdd)
      // console.log('---', String(points))
      newAdd = next
      if (next.size === 0) {
        break
      }
    }
    groups.add(points)
    pointsToTraverse = pointsToTraverse.subtract(points)
    // console.log('points:', String(points))
    // console.log(pointsToTraverse.size)
    // console.groupEnd()
  }
  return groups.asImmutable()
}

export function isGameover(stars) {
  const groups = groupAllStars(stars)
  return groups.size === stars.size // todo 可以进行优化
}

/** 根据state得到snapshot */
export function asSnapshot(score, stars) {
  const jsonStars = Range(0, SIZE).reverse().map(y =>
    Range(0, SIZE).map(x => stars.get(Point({ x, y }), 'O')).join(''))
    .toArray()
  return { score, stars: jsonStars }
}

export function asSnapshotString(score, stars) {
  return `{\n  "score": ${score},\n  "stars": [\n${Range(0, SIZE).reverse()
    .map(y => `    "${Range(0, SIZE).map(x => stars.get(Point({ x, y }), 'O')).join('')}"`)
    .join(',\n')}\n  ]\n}`
}
