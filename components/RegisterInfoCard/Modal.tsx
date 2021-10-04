import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { registerIndexState } from 'state/auth'
import { db, createInvitation } from 'firebaseClient'
import { YouTube } from 'state/auth'
import styles from './styles.module.css'

interface Props {
  open: boolean
  index: number
  email: string
  youtubeInfo: YouTube
  onClose?: Function
}

export const Modal = ({ open, index, email, youtubeInfo, onClose }: Props) => {
  const router = useRouter()
  const [, setRegisterIndex] = useRecoilState(registerIndexState)
  const onClick = () => {
    createInvitation(db, email, youtubeInfo)
    setRegisterIndex(index)
    router.push('/')
  }
  return open ? (
    <div className={styles.modal} onClick={() => onClose && onClose()}>
      <div className={styles.modalContent}>
        <h3>Reigstration</h3>
        <p>Please enter the required information.</p>
        <div>
          <button onClick={onClick}>Register</button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  )
}
