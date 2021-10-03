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
export const youtubeState = atom<YouTube>({
  key: 'youtube',
  default: { channelId: '', videoCount: 0, viewCount: 0, keywords: '', title: '', description: '' } as YouTube,
})
