import React from 'react'
import answerImg from '../assets/images/answer.svg'

import '../styles/custom-icon.scss'

type IconProps = {
  color: string
  alt: string
}

export const AnswerIcon = ({ color, alt = 'Answer button' }: IconProps) => {
  return <img src={answerImg} alt={alt} className={color} />
}
