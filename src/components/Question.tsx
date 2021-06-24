import React from 'react'

import '../styles/question.scss'

type QuestionProps = {
  text: string
  avatar: string
  author: string
}

export const Question = ({ text, avatar, author }: QuestionProps) => {
  return (
    <div className="question">
      <div>{text}</div>
      <div className="footer">
        <img src={avatar} alt={author} />
        <span>{author}</span>
      </div>
    </div>
  )
}
