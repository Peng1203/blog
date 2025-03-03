import party from 'party-js'

// document.addEventListener('click', (event) => {
//   // 在点击位置触发烟花效果
//   party.sparkles(event, {
//     count: party.variation.range(20, 40), // 控制粒子数量
//     speed: party.variation.range(300, 500) // 控制粒子速度
//   })
// })

document.addEventListener('click', (event) => {
  party.confetti(event, {
    count: party.variation.range(10, 25), // 控制粒子数量
    speed: party.variation.range(300, 500) // 控制粒子速度
  })
})
