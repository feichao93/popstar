const identity = x => x

export function compose(...funcs) {
  if (funcs.length === 0) {
    return identity
  } else if (funcs.length === 1) {
    return funcs[0]
  }
  const lastFunc = funcs[funcs.length - 1]
  const restFuncs = funcs.slice(0, funcs.length - 1)
  return (...args) => {
    const lastValue = lastFunc(...args)
    return restFuncs.reduceRight((composed, f) => f(composed), lastValue)
  }
}

export function getDisplayName(Component) {
  return Component.displayName || Component.name || 'Component'
}
