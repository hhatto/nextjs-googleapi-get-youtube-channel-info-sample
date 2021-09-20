import { atom } from 'recoil'

export type Auth = {
  email: string
  channelId: string
  accessToken: string
}

export const authState = atom<Auth>({
  key: 'auth',
  default: { email: '', channelId: '', accessToken: '' } as Auth,
})
