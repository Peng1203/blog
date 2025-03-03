import { App } from 'vue'

const DISTANCE = 100

// 元素 动画 映射
const map = new WeakMap()

const ob = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const animation = map.get(entry.target)
      if (animation) animation.play()
      // 动画播放一次后移除
      ob.unobserve(entry.target)
    }
  })
})

export function slideIn(app: App) {
  app.directive('slide-in', {
    mounted(el: HTMLElement, binding: any) {
      const animation = el.animate(
        [
          {
            transform: `translateY(${DISTANCE}px)`,
            opacity: 0.5,
          },
          {
            transform: `translateY(0)`,
            opacity: 1,
          },
        ],
        {
          duration: binding.value || 300,
          easing: 'ease-in-out',
          fill: 'forwards',
        }
      )

      animation.pause()

      map.set(el, animation)
      ob.observe(el)
    },
    unmounted(el: HTMLElement) {
      ob.unobserve(el)
    },
  })
}
