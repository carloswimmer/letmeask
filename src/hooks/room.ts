import { useEffect, useState } from 'react'
import { database } from '../services/firebase'
import { useAuth } from './auth'

type LikeType = {
  authorId: string
}

type FirebaseQuestionType = {
  content: string
  author: {
    name: string
    avatar: string
  }
  isHighlighted: boolean
  isAnswered: boolean
  likes?: Record<string, LikeType>
}

type QuestionType = Omit<FirebaseQuestionType, 'likes'> & {
  id: string
  likeCount: number
  likeId?: string
}

type FirebaseQuestions = Record<string, FirebaseQuestionType>

export const useRoom = (roomId: string) => {
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [title, setTitle] = useState('')
  const [roomAuthor, setRoomAuthor] = useState('')
  const { user } = useAuth()

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
            isAnswered: value.isAnswered,
            likeCount: Object.values(value.likes ?? {}).length,
            likeId: Object.entries(value.likes ?? {}).find(
              ([key, like]) => like.authorId === user?.id,
            )?.[0],
          }
        },
      )

      setTitle(databaseRoom.title)
      setRoomAuthor(databaseRoom.authorId)
      setQuestions(parsedQuestions)
    })

    return () => {
      roomRef.off('value')
    }
  }, [roomId, user?.id])

  return { questions, title, roomAuthor }
}
