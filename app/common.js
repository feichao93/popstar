import { Range, Map, Set } from 'immutable'
import { SIZE, COLORS } from './constants'
import { Point } from './types'

export function getScore(n) {
  return 5 * n * n
}

export function arrangeStars(stars) {
  const downMap = {}
  Range(0, SIZE).forEach(x => {
    // downMap[x]数组中的元素数量总是比y大1
    // downMap[x]用来记录一列中y坐标对应的星星应当掉落的距离
    downMap[x] = [0]
    Range(0, SIZE).forEach(y => {
      const point = Point({ x, y })
      // downMap[y]恰好是数组中的最后一个元素
      downMap[x].push(downMap[x][y] + (stars.has(point) ? 0 : 1))
    })
  })
  return stars.mapKeys(point => {
    if (downMap[point.x][point.y] > 0) {
      // console.log(String(point), '-->', String(point.update('y', y => y - downMap[point.x][y])))
      return point.update('y', y => y - downMap[point.x][y])
    }
    return point
  })
  // todo 还要处理向左并拢的操作
}

function getRandomColor() {
  const colors = Object.keys(COLORS)
  return colors[Math.floor(Math.random() * colors.length)]
}

export function spawnStars() {
  return Map().withMutations(m => {
    Range(0, SIZE * SIZE).forEach(index => {
      const point = Point({ x: index % SIZE, y: Math.floor(index / SIZE) })
      m.set(point, getRandomColor())
    })
  })
}

const around = point => Set([
  point.update('x', x => x + 1),
  point.update('x', x => x - 1),
  point.update('y', y => y + 1),
  point.update('y', y => y - 1),
])

export function groupStars(stars) {
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
    while (true) {
      // console.log('dirty-next:', String(newAdd.flatMap(around)))
      next = newAdd.flatMap(around).filter(point => (
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
