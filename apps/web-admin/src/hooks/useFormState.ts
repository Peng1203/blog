import { FormItem } from '@/components/Form'
import { ref } from 'vue'

export function useFormState<T>(formInit: T) {
  const form = ref<T>(formInit)

  const formItems = ref<FormItem<T>[]>([])
  const setFormItems = (items: FormItem<T>[]) => (formItems.value = items)

  const initForm = JSON.parse(JSON.stringify(formInit))

  const handleInitForm = () => (form.value = initForm)

  return {
    form,
    formItems,
    setFormItems,
    handleInitForm,
  }
}
