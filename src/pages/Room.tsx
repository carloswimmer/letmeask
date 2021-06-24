import React, { FormEvent, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'
import { useAuth, User } from '../hooks/auth'
import { database } from '../services/firebase'

import '../styles/room.scss'

type QuestionData = {
  id: string
  content: string
  author: {
    name: string
    avatar: string
  }
  isHighlighted: boolean
  isAnswer: boolean
}

type FirebaseQuestions = Record<string, Omit<QuestionData, 'id'>>

type RoomParams = {
  id: string
}

export const Room = () => {
  const [newQuestion, setNewQuestion] = useState('')
  const [questions, setQuestions] = useState<QuestionData[]>([])
  const [title, setTitle] = useState('')
  const { user } = useAuth()
  const params = useParams<RoomParams>()
  const roomId = params.id

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`)
    roomRef.on('value', room => {
      const databaseRoom = room.val()
      const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}

      const parsedQuestions = Object.entries(firebaseQuestions).map(
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighlighted: value.isHighlighted,
            isAnswer: value.isAnswer,
          }
        },
      )

      setTitle(databaseRoom.title)
      setQuestions(parsedQuestions)
    })
  }, [roomId])

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
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que vc quer perguntar?"
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            {user ? <SignedUser user={user} /> : <SignInAdvise />}
            <Button type="submit" disabled={!user}>
              Enviar pergunta
            </Button>
          </div>
        </form>

        {questions &&
          questions.map(({ id, content, author }) => (
            <div key={id}>
              <Question
                text={content}
                avatar={author.avatar}
                author={author.name}
              />
            </div>
          ))}
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
