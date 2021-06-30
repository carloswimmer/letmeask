import React, { ReactNode } from 'react'
import { Link, useHistory } from 'react-router-dom'

import { auth } from '../services/firebase'

import logoImg from '../assets/images/logo.svg'
import powerIcon from '../assets/images/power.svg'

import '../styles/header.scss'
import { Button } from './Button'

type HeaderProps = {
  children: ReactNode
}

export const Header = ({ children }: HeaderProps) => {
  const history = useHistory()

  async function signOut() {
    await auth.signOut()
    history.push('/')
  }

  return (
    <header>
      <div className="content">
        <Link to="/">
          <img src={logoImg} alt="Logo Letmeask" />
        </Link>
        <div>
          {children}
          <Button isOutlined isRounded onClick={signOut}>
            <img src={powerIcon} alt="Fazer logout" />
          </Button>
        </div>
      </div>
    </header>
  )
}
