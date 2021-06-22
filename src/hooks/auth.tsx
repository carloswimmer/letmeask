import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'

import { auth, firebase } from '../services/firebase'

type User = {
  id: string
  name: string
  avatar: string
}

type AuthContextType = {
  user: User | undefined
  signInWithGoogle(): Promise<void>
}

const AuthContext = createContext({} as AuthContextType)

function AuthProvider({ children }: PropsWithChildren<{}>) {
  const [user, setUser] = useState<User>()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        mountUser(user)
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider()

    const result = await auth.signInWithPopup(provider)
    if (result.user) {
      mountUser(result.user)
    }
  }

  function mountUser(user: firebase.User) {
    const { displayName, photoURL, uid } = user

    if (!displayName || !photoURL) {
      throw new Error('Missing information from Google Account')
    }

    setUser({
      id: uid,
      name: displayName,
      avatar: photoURL,
    })
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => useContext(AuthContext)

export { AuthProvider, useAuth }
