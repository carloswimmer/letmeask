import React from 'react'
import checkImg from '../assets/images/check.svg'

import '../styles/custom-icon.scss'

type IconProps = {
  color: string
  alt: string
}

export const CheckIcon = ({ color, alt = 'Check button' }: IconProps) => {
  return <img src={checkImg} alt={alt} className={color} />
}
