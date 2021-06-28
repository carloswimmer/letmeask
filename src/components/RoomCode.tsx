import React from 'react'
import copyImg from '../assets/images/copy.svg'

import '../styles/room-code.scss'

type RoomCodeProps = {
  code: string
}

export const RoomCode = ({ code }: RoomCodeProps) => {
  function copyToClipboard() {
    navigator.clipboard.writeText(code)
  }

  return (
    <button className="room-code" onClick={copyToClipboard}>
      <div>
        <img src={copyImg} alt="Copy room code" />
      </div>
      <span>Sala {code}</span>
    </button>
  )
}
