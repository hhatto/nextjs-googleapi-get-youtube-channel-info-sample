import { atom } from 'recoil'

export type Auth = {
  email: string
  accessToken: string
}

export const authState = atom<Auth>({
  key: 'auth',
  default: { email: '', accessToken: '' } as Auth,
})

export type YouTube = {
  channelId: string
  videoCount: number
  viewCount: number
  keywords: string
  title: string
  description: string
}
export const youtubeState = atom<Array<YouTube>>({
  key: 'youtube',
  default: [] as Array<YouTube>,
})

export const registerIndexState = atom<number | undefined>({
  key: 'registerIndex',
  default: undefined,
})
