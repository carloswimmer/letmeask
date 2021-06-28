import React from 'react'
import likeImg from '../assets/images/like.svg'

import '../styles/custom-icon.scss'

export const LikeIcon = ({ color }: { color: string }) => {
  return <img src={likeImg} alt="Like button" className={color} />
}
