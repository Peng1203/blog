import { ref } from 'vue'

export function useFormState<T>(formInit: T) {
  const form = ref(formInit)

  const initForm = JSON.parse(JSON.stringify(formInit))

  const handleInitForm = () => (form.value = initForm)

  return {
    form,
    handleInitForm
  }
}
