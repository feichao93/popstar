import { Range, Map, Set, fromJS } from 'immutable'
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
    // 注意: downMap[x]数组中的元素数量总是比y大1
    downMap[x] = [0]
    Range(0, SIZE).forEach(y => {
      const point = Point({ x, y })
      // downMap[x][y]恰好是数组downMap[x]中的最后一个元素
      downMap[x].push(downMap[x][y] + (stars.has(point) ? 0 : 1))
    })
  })

  // left数组用来记录每一列应该向左平移的距离
  const left = [0]
  Range(0, SIZE).forEach(x => {
    // 注意: left数组中的元素数量总是比x大1
    if (stars.some((color, point) => point.x === x)) { // 至少有一个点在该列上
      left.push(left[x])
    } else {
      left.push(left[x] + 1)
    }
  })

  return stars.mapKeys(point => {
    const { x, y } = point
    return Point({ x: x - left[x], y: y - downMap[x][y] })
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

export function findGroup(stars, points, anchor) {
  const color = stars.get(anchor)
  let result = Set()
  let newAdd = Set([anchor])
  let next
  while (true) { // eslint-disable-line no-constant-condition
    next = newAdd.flatMap(around)
      .filter(p => ( // eslint-disable-line no-loop-func
        points.has(p)
        && stars.get(p) === color
        && !result.has(p))
        && !newAdd.has(p)
      )

    result = result.union(newAdd)
    newAdd = next
    if (next.size === 0) {
      break
    }
  }
  return result
}

/** 对stars进行分组 */
export function groupAllStars(stars) {
  const groups = Set().asMutable()
  let pointsToTraverse = stars.keySeq().toSet()
  while (pointsToTraverse.size > 0) {
    const anchor = pointsToTraverse.first()
    const group = findGroup(stars, pointsToTraverse, anchor)
    groups.add(group)
    pointsToTraverse = pointsToTraverse.subtract(group)
  }
  return groups.asImmutable()
}

export function isGameover(stars) {
  let pointsToTraverse = stars.keySeq().toSet()
  while (pointsToTraverse.size > 0) {
    const anchor = pointsToTraverse.first()
    const group = findGroup(stars, pointsToTraverse, anchor)
    if (group.size > 1) {
      return false
    }
    pointsToTraverse = pointsToTraverse.subtract(group)
  }
  return true
}

export function asSnapshotString(score, stars) {
  return `{\n  "score": ${score},\n  "stars": [\n${Range(0, SIZE).reverse()
    .map(y => `    "${Range(0, SIZE).map(x => stars.get(Point({ x, y }), 'O')).join('')}"`)
    .join(',\n')}\n  ]\n}`
}

function hasValidStarsAttr(object) {
  return typeof object.stars === 'object'
    && object.stars.length === SIZE
    && object.stars.every(string =>
      typeof string === 'string'
      && string.length === SIZE
      && string.match(/^[GBPRYO]+$/)
    )
}

export function parserJson(jsonString) {
  let object
  try {
    object = JSON.parse(jsonString)
  } catch (e) {
    return '请输入合法的json'
  }
  if (!(typeof object.score === 'number' && object.score >= 0)) {
    return '请输入合法的score字段'
  }
  if (!hasValidStarsAttr(object)) {
    return '请输入合法的stars字段'
  }
  return {
    score: object.score,
    stars: Map().withMutations(m => {
      fromJS(object.stars).forEach((string, rowIndex) => {
        for (let x = 0; x < string.length; x++) {
          const char = string[x]
          if (COLORS[char]) {
            m.set(Point({ x, y: SIZE - 1 - rowIndex }), char)
          }
        }
      })
    }),
  }
}
