type CallBack = (...args: any[]) => void

class EventBus {
  // 记录监听与触发回调的关系
  events: Record<string, Set<CallBack>> = {}

  on(eventName: string, cb: CallBack) {
    // if (!this.events[eventName]) {
    //   this.events[eventName] = new Set()
    // }
    // this.events[eventName].add(cb)

    // eslint-disable-next-line no-extra-semi
    ;(this.events[eventName] ??= new Set()).add(cb)
  }

  emit(eventName: string, ...args: any[]) {
    this.events[eventName].forEach(cb => cb(...args))
  }

  off(eventName: string, cb: CallBack) {
    this.events[eventName]?.delete(cb)
  }

  once(eventName: string, cb: CallBack) {
    const handler = (...args) => {
      cb(...args)
      this.off(eventName, handler)
    }
    this.on(eventName, handler)
  }
}

// 保持单例
export const bus = new EventBus()
