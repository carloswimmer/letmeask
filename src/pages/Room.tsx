import React, { FormEvent, useState } from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'

import { database } from '../services/firebase'

import logoImg from '../assets/images/logo.svg'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'
import { LikeIcon } from '../components/LikeIcon'
import { useAuth, User } from '../hooks/auth'
import { useRoom } from '../hooks/room'

import '../styles/room.scss'

type RoomParams = {
  id: string
}

export const Room = () => {
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

  async function handleLikeQuestion(
    questionId: string,
    likeId: string | undefined,
  ) {
    if (likeId) {
      await database
        .ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`)
        .remove()

      return
    }
    await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
      authorId: user?.id,
    })
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

        <div className="question-list">
          {questions &&
            questions.map(({ id, content, author, likeCount, likeId }) => (
              <Question key={id} content={content} author={author}>
                <button
                  className={`like-button ${likeId ? 'liked' : ''}`}
                  type="button"
                  aria-label="Marcar como gostei"
                  onClick={() => handleLikeQuestion(id, likeId)}
                >
                  {likeCount > 0 && <span>{likeCount}</span>}
                  <LikeIcon color={likeId ? 'purple-icon' : 'gray-icon'} />
                </button>
              </Question>
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
