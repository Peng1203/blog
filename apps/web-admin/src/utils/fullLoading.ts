import { ElLoading } from 'element-plus'

let loading: any = null
export const startFullFoading = (text = 'Loading') => {
  loading = ElLoading.service({
    text,
    lock: true,
    fullscreen: true,
    background: 'rgba(0, 0, 0, 0.7)',
  })
}

export const endFullFoading = () => loading.close()
