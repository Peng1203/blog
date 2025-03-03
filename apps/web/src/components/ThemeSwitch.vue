<template>
  <div class="components">
    <!-- 组件所有元素 -->
    <div class="main-button">
      <!-- 按钮主体(圆) -->
      <div class="moon"></div>
      <div class="moon"></div>
      <div class="moon"></div>
      <!-- 月亮上的陨石坑 -->
    </div>
    <div class="daytime-backgrond"></div>
    <div class="daytime-backgrond"></div>
    <div class="daytime-backgrond"></div>
    <!-- 按钮底层的三个虚影 -->
    <div class="cloud">
      <!-- 所有的云 -->
      <div class="cloud-son"></div>
      <div class="cloud-son"></div>
      <div class="cloud-son"></div>
      <div class="cloud-son"></div>
      <div class="cloud-son"></div>
      <div class="cloud-son"></div>
    </div>
    <div class="cloud-light cloud-float">
      <!-- 云的虚影 -->
      <div class="cloud-son"></div>
      <div class="cloud-son"></div>
      <div class="cloud-son"></div>
      <div class="cloud-son"></div>
      <div class="cloud-son"></div>
      <div class="cloud-son"></div>
    </div>
    <div class="stars">
      <!-- 所有星星，每一个星星由四个div拼合而成 -->
      <div class="star big">
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
      </div>
      <div class="star big">
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
      </div>
      <div class="star medium">
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
      </div>
      <div class="star medium">
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
      </div>
      <div class="star medium">
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
      </div>
      <div class="star small">
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
      </div>
      <div class="star small">
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
      </div>
      <div class="star small">
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
      </div>
      <div class="star small">
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
      </div>
      <div class="star small">
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
      </div>
      <div class="star small">
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
        <div class="star-son"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useStore } from '@/stores'

const { themeModel } = storeToRefs(useStore())

const LOCAL_KEY = 'theme_model'

const isDark = computed<boolean>(() => themeModel.value === 'dark')
const isLight = computed<boolean>(() => themeModel.value === 'light')

document.documentElement.className = themeModel.value

const handleToggleTheme = (e: PointerEvent) => {
  themeModel.value = isDark.value ? 'light' : 'dark'
  localStorage.setItem(LOCAL_KEY, themeModel.value)
  setHTMLThemeAttr(themeModel.value, e)
}

const setHTMLThemeAttr = (val: string, pointerEvent?: PointerEvent) => {
  const HTML = document.documentElement as HTMLElement

  /**
   * ViewTransition API 只有 Chrome 和 Edge 以及部分浏览器才支持 并不是 标注的API
   */

  // @ts-ignore
  if (document?.startViewTransition && pointerEvent) {
    const x = pointerEvent.clientX
    const y = pointerEvent.clientY

    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

    // @ts-ignore
    const transition = document.startViewTransition(() => (HTML.className = val))

    transition.ready.then(() => {
      const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
      document.documentElement.animate(
        {
          clipPath: isDark.value ? clipPath : [...clipPath].reverse()
        },
        {
          duration: 400,
          easing: 'ease-in',
          pseudoElement: isDark.value
            ? '::view-transition-new(root)'
            : '::view-transition-old(root)'
        }
      )
    })
  } else {
    HTML.className = val
  }
}

onMounted(() => {
  const $ = (s: string) => {
    let dom = document.querySelectorAll(s)
    return (dom.length == 1 ? dom[0] : dom) as any
  }
  let mainButton = $('.main-button') //获取按钮主体
  let daytimeBackgrond = $('.daytime-backgrond') //获取按钮背后的虚影
  let cloud = $('.cloud') //获取云层
  let cloudLight = $('.cloud-light') //获取云层虚影
  let components = $('.components') //获取最外层元素
  let moon = $('.moon') //获取陨石坑
  let stars = $('.stars') //获取所有星星
  let isMoved = isLight.value //按钮状态，判断是否白天黑夜,默认为 true白天 false黑夜
  let isClicked = false // 新变量，用于跟踪是否刚刚发生了鼠标点击事件

  // 更新按钮样式
  const changeBtnStyle = () => {
    if (isMoved) {
      //白天按钮样式
      mainButton.style.transform = 'translateX(0)' //水平平移距离为0px
      mainButton.style.backgroundColor = 'rgba(255, 195, 35,1)' //按钮主体的背景颜色变为黄色(太阳)
      // 盒子阴影
      mainButton.style.boxShadow =
        '3px 3px 5px rgba(0, 0, 0, 0.5), inset  -3px -5px 3px -3px rgba(0, 0, 0, 0.5), inset  4px 5px 2px -2px rgba(255, 230, 80,1)'
      //云朵上升-云朵显示
      daytimeBackgrond[0].style.transform = 'translateX(0)'
      daytimeBackgrond[1].style.transform = 'translateX(0)'
      daytimeBackgrond[2].style.transform = 'translateX(0)'
      cloud.style.transform = 'translateY(10px)'
      cloudLight.style.transform = 'translateY(10px)'
      components.style.backgroundColor = 'rgba(70, 133, 192,1)'
      //月亮陨石坑完全透明-隐藏
      moon[0].style.opacity = '0'
      moon[1].style.opacity = '0'
      moon[2].style.opacity = '0'
      //星星上升-星星隐藏
      stars.style.transform = 'translateY(-125px)'
      stars.style.opacity = '0'
      //网页背景颜色变为浅色
    } else {
      //黑夜按钮样式
      mainButton.style.transform = 'translateX(110px)' //水平平移距离为110px
      mainButton.style.backgroundColor = 'rgba(195, 200,210,1)' //按钮主体的背景颜色变为黄色(月亮)
      // 盒子阴影
      mainButton.style.boxShadow =
        '3px 3px 5px rgba(0, 0, 0, 0.5), inset  -3px -5px 3px -3px rgba(0, 0, 0, 0.5), inset  4px 5px 2px -2px rgba(255, 255, 210,1)'
      //云朵下降-云朵隐藏
      daytimeBackgrond[0].style.transform = 'translateX(110px)'
      daytimeBackgrond[1].style.transform = 'translateX(80px)'
      daytimeBackgrond[2].style.transform = 'translateX(50px)'
      cloud.style.transform = 'translateY(80px)'
      cloudLight.style.transform = 'translateY(80px)'
      components.style.backgroundColor = 'rgba(25,30,50,1)'
      //月亮陨石坑完全不透明-显示
      moon[0].style.opacity = '1'
      moon[1].style.opacity = '1'
      moon[2].style.opacity = '1'
      //星星下降-星星显示
      stars.style.transform = 'translateY(-62.5px)'
      stars.style.opacity = '1'
      //网页背景颜色变为深色
    }
  }

  components.addEventListener('click', (e: PointerEvent) => {
    changeBtnStyle()
    // 检测鼠标是否点击,默认已经点击
    isClicked = true
    // 计时器，当0.5秒后，点击状态变成非点击
    setTimeout(function () {
      isClicked = false
    }, 500)
    isMoved = !isMoved

    handleToggleTheme(e)
    e.stopPropagation()
  })

  // 当鼠标挪入按钮时，按钮移动事件
  mainButton.addEventListener('mousemove', function () {
    // 当按钮为点击状态时，退出
    if (isClicked) return

    if (isMoved) {
      // 当黑夜状态时，鼠标挪入按钮
      // 按钮和背后的虚影向左平移10像素
      mainButton.style.transform = 'translateX(100px)'
      daytimeBackgrond[0].style.transform = 'translateX(100px)'
      daytimeBackgrond[1].style.transform = 'translateX(73px)'
      daytimeBackgrond[2].style.transform = 'translateX(46px)'
    } else {
      // 当白天状态时，鼠标挪入按钮
      // 按钮和背后的虚影向右平移10像素
      mainButton.style.transform = 'translateX(10px)'
      daytimeBackgrond[0].style.transform = 'translateX(10px)'
      daytimeBackgrond[1].style.transform = 'translateX(7px)'
      daytimeBackgrond[2].style.transform = 'translateX(4px)'
    }
  })

  // 当鼠标挪出按钮时，按钮移动事件
  mainButton.addEventListener('mouseout', function () {
    // 当按钮为点击状态时，退出
    if (isClicked) {
      return
    }
    if (isMoved) {
      // 当黑夜状态时，鼠标挪出按钮
      // 按钮和背后的虚影向右平移10像素
      mainButton.style.transform = 'translateX(110px)'
      daytimeBackgrond[0].style.transform = 'translateX(110px)'
      daytimeBackgrond[1].style.transform = 'translateX(80px)'
      daytimeBackgrond[2].style.transform = 'translateX(50px)'
    } else {
      // 当白天状态时，鼠标挪出按钮
      // 按钮和背后的虚影向左平移10像素
      mainButton.style.transform = 'translateX(0px)'
      daytimeBackgrond[0].style.transform = 'translateX(0px)'
      daytimeBackgrond[1].style.transform = 'translateX(0px)'
      daytimeBackgrond[2].style.transform = 'translateX(0px)'
    }
  })

  // 星星闪烁js交互部分
  // 获取所有星星元素，并随机排序星星数组
  let starArray = [...$('.star')].sort(() => 0.5 - Math.random())

  // 定义缩放动画时长和暂停时间
  const twinkleDuration = 0.5 // 缩放动画时长（秒）
  const pauseDuration = 2 // 暂停时间（秒）

  function twinkleStars() {
    starArray.forEach((star, index) => {
      setTimeout(
        () => {
          star.classList.add('twinkle')
          setTimeout(() => {
            star.classList.remove('twinkle')
            if (index === starArray.length - 1) {
              setTimeout(twinkleStars, pauseDuration * 1000) // 在每次调用之间添加 2 秒的间隔
            }
          }, twinkleDuration * 1000)
        },
        index * (twinkleDuration + pauseDuration) * 1000
      )
    })
  }

  twinkleStars() // 第一次调用函数开始闪烁

  // 云层浮动动画效果
  // 定义一个获取随机方向的函数，随机选择移动距离'2px'或'-2px'
  const getRandomDirection = () => {
    const directions = ['2px', '-2px']
    return directions[Math.floor(Math.random() * directions.length)]
  }

  // 定义一个将元素移动到随机方向的函数
  const moveElementRandomly = (element: HTMLDivElement) => {
    const randomDirectionX = getRandomDirection() // 获取随机的X方向
    const randomDirectionY = getRandomDirection() // 获取随机的Y方向
    element.style.transform = `translate(${randomDirectionX}, ${randomDirectionY})` // 将随机方向应用到元素的transform属性
  }

  // 在文档加载完成后执行以下代码
  document.addEventListener('DOMContentLoaded', () => {
    const cloudSons = document.querySelectorAll('.cloud-son') // 选择所有的.cloud-son元素

    // 每秒钟执行一次以下代码
    setInterval(() => {
      // @ts-ignore
      cloudSons.forEach(moveElementRandomly) // 将每一个.cloud-son元素移动到随机方向
    }, 1000)
  })

  // mainButton?.click()
  ;(() => {
    changeBtnStyle()
    // 检测鼠标是否点击,默认已经点击
    isClicked = true
    // 计时器，当0.5秒后，点击状态变成非点击
    setTimeout(function () {
      isClicked = false
    }, 500)
    isMoved = !isMoved
  })()
  // changeBtnStyle()
})
</script>

<style scoped lang="scss">
.components {
  // --con-w: 90px;
  // --con-h: 35px;
  // --m-btn-w: 27.5px;
  // --m-btn-h: 27.5px;

  --con-w: 180px;
  --con-h: 70px;
  --m-btn-w: 55px;
  --m-btn-h: 55px;
  // position: fixed; /* 固定定位 */
  // top: 50%;
  // left: 50%;
  // margin-left: -90px;
  // margin-top: -35px; /* 按钮在页面中居中 */
  width: var(--con-w);
  height: var(--con-h);
  margin: 0 -45px 0 -20px;
  background-color: rgba(70, 133, 192, 1); /* 按钮背景颜色 */
  border-radius: 100px;
  box-shadow: inset 0 0 5px 3px rgba(0, 0, 0, 0.5); /* 按钮的内阴影,实现立体感 */
  overflow: hidden;
  transition: 0.7s;
  transition-timing-function: cubic-bezier(0, 0.5, 1, 1); /* 过渡时间贝塞尔曲线,实现非线性动画 */
  transform: scale(0.5);
  cursor: pointer;

  /* 主要按钮样式 */
  .main-button {
    margin: 7.5px 0 0 7.5px;
    width: var(--m-btn-w);
    height: var(--m-btn-h);
    background-color: rgba(255, 195, 35, 1);
    border-radius: 50%;
    box-shadow:
      3px 3px 5px rgba(0, 0, 0, 0.5),
      inset -3px -5px 3px -3px rgba(0, 0, 0, 0.5),
      inset 4px 5px 2px -2px rgba(255, 230, 80, 1);
    cursor: pointer;
    transition: 1s;
    transition-timing-function: cubic-bezier(0.56, 1.35, 0.52, 1); /* 加入回弹动画 */
  }

  /* 陨石坑样式 */
  .moon {
    position: absolute;
    background-color: rgba(150, 160, 180, 1);
    box-shadow: inset 0px 0px 1px 1px rgba(0, 0, 0, 0.3);
    border-radius: 50%;
    transition: 0.5s;
    opacity: 0;
  }

  $moon-craters: (
    (7.5px, 25px, 12.5px, 12.5px),
    (20px, 7.5px, 20px, 20px),
    (32.5px, 32.5px, 12.5px, 12.5px)
  );

  /* 第一个陨石坑 */
  .moon:nth-child(1) {
    top: 7.5px;
    left: 25px;
    width: 12.5px;
    height: 12.5px;
  }

  /* 第二个陨石坑 */
  .moon:nth-child(2) {
    top: 20px;
    left: 7.5px;
    width: 20px;
    height: 20px;
  }

  /* 第三个陨石坑 */
  .moon:nth-child(3) {
    top: 32.5px;
    left: 32.5px;
    width: 12.5px;
    height: 12.5px;
  }

  /* 按钮背后的虚影 */
  .daytime-backgrond {
    position: absolute;
    border-radius: 50%;
    transition: 1s;
    transition-timing-function: cubic-bezier(0.56, 1.35, 0.52, 1); /* 加入回弹动画 */
  }

  /* 按钮背后的第一个虚影 */
  .daytime-backgrond:nth-child(2) {
    top: -20px;
    left: -20px;
    width: 110px;
    height: 110px;
    background-color: rgba(255, 255, 255, 0.2);
    z-index: -2;
  }

  /* 按钮背后的第二个虚影 */
  .daytime-backgrond:nth-child(3) {
    top: -32.5px;
    left: -17.5px;
    width: 135px;
    height: 135px;
    background-color: rgba(255, 255, 255, 0.1);
    z-index: -3;
  }

  /* 按钮背后的第三个虚影 */
  .daytime-backgrond:nth-child(4) {
    top: -45px;
    left: -15px;
    width: 160px;
    height: 160px;
    background-color: rgba(255, 255, 255, 0.05);
    z-index: -4;
  }

  /* 云和云层虚影的初始位置 */
  .cloud,
  .cloud-light {
    transform: translateY(10px);
    transition: 1s;
    transition-timing-function: cubic-bezier(0.56, 1.35, 0.52, 1); /* 加入回弹动画 */
  }

  /* 云和虚影统一样式 */
  .cloud-son {
    position: absolute;
    background-color: #fff;
    border-radius: 50%;
    z-index: -1;
    transition-property: transform;
    transition-duration: 6s; /* 云层浮动动画效果，过渡时间6s */
  }

  /* 云和虚影由6个圆形组成，第1个圆形和第7个圆形大小相同 */
  .cloud-son:nth-child(6n + 1) {
    right: -20px;
    bottom: 10px;
    width: 50px;
    height: 50px;
  }

  /* 云和虚影由6个圆形组成，第2个圆形和第8个圆形大小相同 */
  .cloud-son:nth-child(6n + 2) {
    right: -10px;
    bottom: -25px;
    width: 60px;
    height: 60px;
  }

  /* 云和虚影由6个圆形组成，第3个圆形和第9个圆形大小相同 */
  .cloud-son:nth-child(6n + 3) {
    right: 20px;
    bottom: -40px;
    width: 60px;
    height: 60px;
  }

  /* 云和虚影由6个圆形组成，第4个圆形和第10个圆形大小相同 */
  .cloud-son:nth-child(6n + 4) {
    right: 50px;
    bottom: -35px;
    width: 60px;
    height: 60px;
  }

  /* 云和虚影由6个圆形组成，第5个圆形和第11个圆形大小相同 */
  .cloud-son:nth-child(6n + 5) {
    right: 75px;
    bottom: -60px;
    width: 75px;
    height: 75px;
  }

  /* 云和虚影由6个圆形组成，第6个圆形和第12个圆形大小相同 */
  .cloud-son:nth-child(6n + 6) {
    right: 110px;
    bottom: -50px;
    width: 60px;
    height: 60px;
  }

  /* 云层在-2层 */
  .cloud {
    z-index: -2;
  }

  /* 云层虚影在云层下方,并且整体上移,逆时针旋转5度 */
  .cloud-light {
    position: absolute;
    right: 0px;
    bottom: 25px;
    opacity: 0.5;
    z-index: -3;
    /*transform: rotate(-5deg);*/
  }

  /* 所有星星样式 */
  .stars {
    transform: translateY(-125px);
    z-index: -2;
    transition: 1s;
    transition-timing-function: cubic-bezier(0.56, 1.35, 0.52, 1); /* 加入回弹动画 */
  }

  /* 大星星的宽高 */
  .big {
    --size: 7.5px;
  }

  /* 中星星的宽高 */
  .medium {
    --size: 5px;
  }

  /* 小星星的宽高 */
  .small {
    --size: 3px;
  }

  /* 星星绝对定位 */
  .star {
    position: absolute;
    width: calc(2 * var(--size));
    height: calc(2 * var(--size));
  }

  /* 所有星星的位置 */
  .star:nth-child(1) {
    top: 10px;
    left: 40px;
  }

  .star:nth-child(2) {
    top: 20px;
    left: 95px;
  }

  .star:nth-child(3) {
    top: 20px;
    left: 20px;
  }

  .star:nth-child(4) {
    top: 35px;
    left: 50px;
  }

  .star:nth-child(5) {
    top: 50px;
    left: 80px;
  }

  .star:nth-child(6) {
    top: 50px;
    left: 20px;
  }

  .star:nth-child(7) {
    top: 40px;
    left: 27.5px;
  }

  .star:nth-child(8) {
    top: 55px;
    left: 45px;
  }

  .star:nth-child(9) {
    top: 20px;
    left: 75px;
  }

  .star:nth-child(10) {
    top: 32.5px;
    left: 67.5px;
  }

  .star:nth-child(11) {
    top: 40px;
    left: 95px;
  }

  /* 每一个星星由四个div向左浮动,拼合而成 */
  .star-son {
    float: left;
  }

  .star-son:nth-child(1) {
    --pos: left 0;
  }

  .star-son:nth-child(2) {
    --pos: right 0;
  }

  .star-son:nth-child(3) {
    --pos: 0 bottom;
  }

  .star-son:nth-child(4) {
    --pos: right bottom;
  }

  /* 星星样式 */
  .star-son {
    width: var(--size);
    height: var(--size);
    background-image: radial-gradient(
      circle var(--size) at var(--pos),
      transparent var(--size),
      #fff
    );
  }

  /* 将星星闪烁动画应用于所有的star元素 */
  .star {
    transform: scale(1);
    transition: transform 0.5s;
  }

  /* 添加星星闪烁动画 */
  .twinkle {
    transform: scale(0);
  }
}
</style>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

/* 进入dark模式和退出dark模式时，两个图像的位置顺序正好相反 */
[class='dark']::view-transition-old(root) {
  z-index: 10000;
}

[class='dark']::view-transition-new(root) {
  z-index: 99999;
}

::view-transition-old(root) {
  z-index: 99999;
}

::view-transition-new(root) {
  z-index: 10000;
}
</style>
