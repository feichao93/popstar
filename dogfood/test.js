console.log('1')

// setTimeout(() => console.log('2'), 0)
console.log(2)

console.time('p')
for (let i = 0; i < 10000000; i++) {
  if (i % 1000000 === 0) {
    console.log('tick')
  }
  const a = i * i
}
console.timeEnd('p')
