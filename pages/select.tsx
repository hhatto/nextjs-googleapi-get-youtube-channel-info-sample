import { useEffect } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useRecoilState } from 'recoil'
import { authState, youtubeState, YouTube } from 'state/auth'
import styles from '../styles/Home.module.css'
import { RegisterInfoCard } from 'components/RegisterInfoCard'

const SelectPage: NextPage = () => {
  const router = useRouter()
  const [auth] = useRecoilState(authState)
  const [youtubeInfos] = useRecoilState(youtubeState)

  useEffect(() => {
    if (auth.email === '') {
      router.push('/')
    }
  }, [auth, router])

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h3>Please select the information you wish to register</h3>
        {youtubeInfos.map((y: YouTube, index: number) => {
          return <RegisterInfoCard index={index} email={auth.email} youtubeInfo={y} key={index} />
        })}
      </main>
    </div>
  )
}

export default SelectPage
