import React, { FormEvent, useState } from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'

import { database } from '../services/firebase'

import logoImg from '../assets/images/logo.svg'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'
import { useAuth, User } from '../hooks/auth'
import { useRoom } from '../hooks/room'

import '../styles/room.scss'

type RoomParams = {
  id: string
}

export const AdminRoom = () => {
  const [newQuestion, setNewQuestion] = useState('')
  const { user } = useAuth()
  const params = useParams<RoomParams>()
  const roomId = params.id
  const { questions, title } = useRoom(roomId)

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault()

    if (newQuestion.trim() === '') {
      return
    }

    if (!user) {
      toast.error('You must be logged in')
      return
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswer: false,
    }

    await database.ref(`rooms/${roomId}/questions`).push(question)
    setNewQuestion('')
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Logo Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions &&
            questions.map(({ id, content, author }) => (
              <Question key={id} content={content} author={author} />
            ))}
        </div>
      </main>
    </div>
  )
}

function SignInAdvise() {
  return (
    <span>
      Para enviar uma pergunta, <button>faça seu login</button>.
    </span>
  )
}

function SignedUser({ user }: { user: User }) {
  return (
    <div className="user-info">
      <img src={user.avatar} alt={user.name} />
      <span>{user.name}</span>
    </div>
  )
}
