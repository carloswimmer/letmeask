import React from 'react'
// import toast from 'react-hot-toast'
import { useHistory, useParams } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg'

import { Button } from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'
// import { useAuth, User } from '../hooks/auth'
import { useRoom } from '../hooks/room'

import '../styles/room.scss'
import { database } from '../services/firebase'

type RoomParams = {
  id: string
}

export const AdminRoom = () => {
  // const { user } = useAuth()
  const params = useParams<RoomParams>()
  const roomId = params.id
  const { questions, title } = useRoom(roomId)
  const history = useHistory()

  async function handleEndRoom() {
    if (window.confirm('Are you sure you want to close this room?')) {
      await database.ref(`rooms/${roomId}`).update({
        endedAt: new Date(),
      })
    }

    history.push('/')
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Are you sure you want to delete?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
    }
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Logo Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={handleEndRoom}>
              Encerrar sala
            </Button>
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
              <Question key={id} content={content} author={author}>
                <button type="button" onClick={() => handleDeleteQuestion(id)}>
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            ))}
        </div>
      </main>
    </div>
  )
}
