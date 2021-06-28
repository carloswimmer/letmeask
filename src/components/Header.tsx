import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import logoImg from '../assets/images/logo.svg'

import '../styles/header.scss'

type HeaderProps = {
  children: ReactNode
}

export const Header = ({ children }: HeaderProps) => {
  return (
    <header>
      <div className="content">
        <Link to="/">
          <img src={logoImg} alt="Logo Letmeask" />
        </Link>
        <div>{children}</div>
      </div>
    </header>
  )
}
