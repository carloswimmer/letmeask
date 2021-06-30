import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useHistory, useParams } from 'react-router-dom'

import deleteImg from '../assets/images/delete.svg'
import endDangerIcon from '../assets/images/end-danger.svg'
import deleteDangerIcon from '../assets/images/delete-danger.svg'
import endRoomIcon from '../assets/images/end-room.svg'

import { Button } from '../components/Button'
import { Header } from '../components/Header'
import { RoomCode } from '../components/RoomCode'
import { Question } from '../components/Question'
import { CheckIcon } from '../components/CheckIcon'
import { AnswerIcon } from '../components/AnswerIcon'
import { ConfirmationModal } from '../components/ConfirmationModal'
import { useRoom } from '../hooks/room'

import '../styles/room.scss'
import { database } from '../services/firebase'

type RoomParams = {
  id: string
}

export const AdminRoom = () => {
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)
  const [endModalIsOpen, setEndModalIsOpen] = useState(false)
  const [editedId, setEditedId] = useState('')
  const params = useParams<RoomParams>()
  const roomId = params.id
  const { questions, title } = useRoom(roomId)
  const history = useHistory()

  function cancelAction() {
    setDeleteModalIsOpen(false)
    setEndModalIsOpen(false)
    setEditedId('')
  }

  function handleEndRoom() {
    setEndModalIsOpen(true)
  }

  async function confirmEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    })
    setEndModalIsOpen(false)
    history.push('/')
  }

  function handleDeleteQuestion(questionId: string) {
    setEditedId(questionId)
    setDeleteModalIsOpen(true)
  }

  async function confirmDeleteQuestion() {
    await database.ref(`rooms/${roomId}/questions/${editedId}`).remove()
    setDeleteModalIsOpen(false)
    setEditedId('')
    toast.success('Pergunta excluída com sucesso.')
  }

  async function handleCheckQuestionAsAnswered(
    questionId: string,
    isAnswered: boolean,
  ) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: !isAnswered,
    })
  }

  async function handleHighlighQuestion(
    questionId: string,
    isHighlighted: boolean,
  ) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: !isHighlighted,
    })
  }

  return (
    <div id="page-room">
      <Header>
        <RoomCode code={roomId} />
        <Button isOutlined isRounded onClick={handleEndRoom}>
          <img src={endRoomIcon} alt="Encerrar sala" />
        </Button>
      </Header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions &&
            questions.map(
              ({ id, content, author, isAnswered, isHighlighted }) => (
                <Question
                  key={id}
                  content={content}
                  author={author}
                  isAnswered={isAnswered}
                  isHighlighted={isHighlighted}
                >
                  <button
                    type="button"
                    onClick={() =>
                      handleCheckQuestionAsAnswered(id, isAnswered)
                    }
                  >
                    <CheckIcon
                      color={isAnswered ? 'purple-icon' : 'gray-icon'}
                      alt="Marcar pergunta como respondida"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleHighlighQuestion(id, isHighlighted)}
                  >
                    <AnswerIcon
                      color={
                        isHighlighted && !isAnswered
                          ? 'purple-icon'
                          : 'gray-icon'
                      }
                      alt="Dar destaque à pergunta"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteQuestion(id)}
                  >
                    <img src={deleteImg} alt="Remover pergunta" />
                  </button>
                </Question>
              ),
            )}
        </div>
      </main>

      <ConfirmationModal
        open={deleteModalIsOpen}
        icon={deleteDangerIcon}
        alt="Trash can icon"
        title="Excluir pergunta"
        text="Tem certeza que você deseja excluir essa pergunta?"
        cancelAction={cancelAction}
        confirmAction={confirmDeleteQuestion}
        confirmTextButton="Sim, excluir"
      />

      <ConfirmationModal
        open={endModalIsOpen}
        icon={endDangerIcon}
        alt="Remove icon"
        title="Encerrar sala"
        text="Tem certeza que você deseja encerrar esta sala?"
        cancelAction={cancelAction}
        confirmAction={confirmEndRoom}
        confirmTextButton="Sim, encerrar"
      />
    </div>
  )
}
