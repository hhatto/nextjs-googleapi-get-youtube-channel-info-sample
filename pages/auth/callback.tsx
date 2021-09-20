import { useEffect } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import DefaultErrorPage from 'next/error'
import { useRecoilState } from 'recoil'
import { authState } from 'state/auth'

const SCOPE_YOUTUBE = 'https://www.googleapis.com/auth/youtube.readonly'
const SCOPE_EMAIL = 'https://www.googleapis.com/auth/userinfo.email'

const AuthCallback: NextPage = () => {
  const router = useRouter()
  const [auth, setAuth] = useRecoilState(authState)
  const path = useRouter().asPath
  const queryString = path.split('#')[1]
  const urlParams = new URLSearchParams(queryString)
  const accessToken = urlParams.get('access_token')
  const scope = urlParams.get('scope')

  useEffect(() => {
    if (!accessToken) {
      return
    }
    const verifyUrl = `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`
    const youtubeDataApiUrl = `https://www.googleapis.com/youtube/v3/channels?part=id&mine=true&access_token=${accessToken}`
    fetch(verifyUrl).then((res: Response) => {
      res.json().then((value: any) => {
        const email = value.email
        setAuth({ email: email, accessToken: accessToken, channelId: auth.channelId })
        if (value.audience !== process.env.NEXT_PUBLIC_CLIENT_ID) {
          throw new Error('invalid audience')
        }
      })

      fetch(youtubeDataApiUrl).then((res: Response) => {
        const data = res.json()
        data.then((value: any) => {
          const channelId = value.items[0].id
          setAuth({ email: auth.email, accessToken: auth.accessToken, channelId })
        })
      })

      router.push('/')
    })
  }, [accessToken, auth, setAuth, router])

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
