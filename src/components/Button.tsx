import { ButtonHTMLAttributes } from 'react'
import classnames from 'classnames'

import '../styles/button.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean
  isPrimary?: boolean
  isSecondary?: boolean
  isDefault?: boolean
}

export function Button({
  isOutlined = false,
  isPrimary = false,
  isSecondary = false,
  isDefault = false,
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
      )}
      {...props}
    >
      {props.children}
    </button>
  )
}
