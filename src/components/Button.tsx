import { ButtonHTMLAttributes } from 'react'
import classnames from 'classnames'

import '../styles/button.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean
  isPrimary?: boolean
  isSecondary?: boolean
  isDefault?: boolean
  isRounded?: boolean
}

export function Button({
  isOutlined = false,
  isPrimary = false,
  isSecondary = false,
  isDefault = false,
  isRounded = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={classnames(
        'button',
        { outlined: isOutlined },
        { primary: isPrimary },
        { secondary: isSecondary },
        { default: isDefault },
        { rounded: isRounded },
      )}
      {...props}
    >
      {props.children}
    </button>
  )
}
