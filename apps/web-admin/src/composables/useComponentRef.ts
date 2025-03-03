import { ref } from 'vue'

export const useComponentRef = <T extends abstract new (...args: any) => any>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  _comp: T
) => {
  return ref<InstanceType<T>>()
}
