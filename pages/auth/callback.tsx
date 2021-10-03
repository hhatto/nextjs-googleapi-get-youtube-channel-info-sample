import { useEffect, useState } from 'react'
import useSWR from 'swr'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import DefaultErrorPage from 'next/error'
import { useRecoilState } from 'recoil'
import { authState, youtubeState } from 'state/auth'
import { db, createInvitation } from 'firebaseClient'

const SCOPE_YOUTUBE = 'https://www.googleapis.com/auth/youtube.readonly'
const SCOPE_EMAIL = 'https://www.googleapis.com/auth/userinfo.email'

const AuthCallback: NextPage = () => {
  const router = useRouter()
  const [isVerify, setIsVerify] = useState(false)
  const [auth, setAuth] = useRecoilState(authState)
  const [youtube, setYoutube] = useRecoilState(youtubeState)
  const path = useRouter().asPath
  const queryString = path.split('#')[1]
  const urlParams = new URLSearchParams(queryString)
  const accessToken = urlParams.get('access_token')
  const scope = urlParams.get('scope')

  const swrOptions = {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    focusThrottleInterval: 0,
  }
  const { data: verifyData } = useSWR(
    accessToken ? 'google/verify' : null,
    () => {
      const verifyUrl = `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
      return fetch(verifyUrl).then((res: any) => {
        return res.json().then((value: any) => {
          const email = value.email
          if (value.audience !== process.env.NEXT_PUBLIC_CLIENT_ID) {
            throw new Error('invalid audience')
          }
          setIsVerify(true)
          return { email }
        })
      })
    },
    swrOptions
  )
  const { data: youtubeData } = useSWR(
    accessToken ? 'youtube/dataapi' : null,
    () => {
      const youtubeDataApiUrl = `https://www.googleapis.com/youtube/v3/channels?part=id,snippet,brandingSettings,statistics&mine=true&access_token=${accessToken}`
      return fetch(youtubeDataApiUrl).then((res: any) => {
        const data = res.json()
        return data.then((value: any) => {
          console.log(value.items[0])
          const channelId = value.items[0].id
          const videoCount = value.items[0].statistics.videoCount
          const viewCount = value.items[0].statistics.viewCount
          const keywords = value.items[0].brandingSettings.channel.keywords
          const title = value.items[0].snippet.title
          const description = value.items[0].snippet.description
          return { channelId, videoCount, viewCount, keywords, title, description }
        })
      })
    },
    swrOptions
  )

  useEffect(() => {
    if (!accessToken) {
      return
    }
    if (!verifyData || !youtubeData) {
      return
    }
    if (!isVerify) {
      return
    }
    setAuth({ email: verifyData.email || '', accessToken })
    setYoutube({ ...youtubeData })
    createInvitation(db, verifyData.email, youtubeData)
    router.push('/')
  }, [accessToken, setAuth, setYoutube, isVerify, router, verifyData, youtubeData])

  if (scope) {
    let haveYoutubeScope = false
    let haveEmailScope = false
    scope.split(' ').forEach((s: string) => {
      if (s === SCOPE_EMAIL) {
        haveEmailScope = true
      }
      if (s === SCOPE_YOUTUBE) {
        haveYoutubeScope = true
      }
    })
    if (!haveYoutubeScope || !haveEmailScope) {
      return <DefaultErrorPage statusCode={401} />
    }
  }

  return (
    <div>
      <p>waiting...</p>
    </div>
  )
}

export default AuthCallback
