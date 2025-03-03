import { ButtonProps } from 'element-plus'

// export interface Props extends Partial<ButtonProps> {
//   process?: () => void
// }

export type Props = Partial<Omit<ButtonProps, 'loading'>> & {}
