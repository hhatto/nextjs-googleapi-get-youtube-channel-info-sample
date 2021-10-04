import { useState } from 'react'
import { YouTube } from 'state/auth'
import styles from './styles.module.css'
import { Modal } from './Modal'

interface Props {
  index: number
  email: string
  youtubeInfo: YouTube
}

export const RegisterInfoCard = ({ index, email, youtubeInfo }: Props) => {
  const [openModal, setOpenModal] = useState(false)

  const onClose = () => {
    setOpenModal(false)
  }
  const onClick = () => {
    setOpenModal(true)
  }

  return (
    <div className={styles['register-info-card']} onClick={onClick}>
      <Modal open={openModal} index={index} email={email} youtubeInfo={youtubeInfo} onClose={onClose} />
      <p>Email: {email}</p>
      <p>YouTube Channel ID: {youtubeInfo.channelId}</p>
      <p>YouTube Title: {youtubeInfo.title}</p>
      <p>YouTube Description: {youtubeInfo.description}</p>
      <p>YouTube View Count: {youtubeInfo.viewCount}</p>
      <p>YouTube Video Count: {youtubeInfo.videoCount}</p>
      <p>YouTube Keywords: {youtubeInfo.keywords}</p>
    </div>
  )
}
