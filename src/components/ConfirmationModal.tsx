import React from 'react'
import classnames from 'classnames'

import { Button } from './Button'
import '../styles/modal.scss'

type ModalProps = {
  open: boolean
  icon: string
  alt: string
  title: string
  text: string
  confirmTextButton: string
  cancelAction: () => void
  confirmAction: () => void
}

export const ConfirmationModal = ({
  open,
  icon,
  alt,
  title,
  text,
  confirmTextButton,
  cancelAction,
  confirmAction,
}: ModalProps) => {
  return (
    <div className={classnames('modal-component', { 'open-wrapper': open })}>
      <div className={classnames('overlay', { 'open-overlay': open })} />
      <div className={classnames('dialog', { 'open-dialog': open })}>
        <img src={icon} alt={alt} />
        <h1>{title}</h1>
        <p>{text}</p>
        <footer>
          <Button isDefault onClick={cancelAction}>
            Cancelar
          </Button>
          <Button isSecondary onClick={confirmAction}>
            {confirmTextButton}
          </Button>
        </footer>
      </div>
    </div>
  )
}
