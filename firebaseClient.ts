import { initializeApp } from 'firebase/app'
import { Firestore, DocumentData, getFirestore, collection, addDoc, getDocs } from 'firebase/firestore/lite'
import { YouTube } from 'state/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)

export const createInvitation = async (db: Firestore, email: string, youtubeInfo: YouTube) => {
  const invitationsCol = collection(db, 'invitations')
  const data = {
    email,
    channelId: youtubeInfo.channelId,
    videoCount: youtubeInfo.videoCount,
    viewCount: youtubeInfo.viewCount,
    keywords: youtubeInfo.keywords || '',
    title: youtubeInfo.title,
    description: youtubeInfo.description || '',
  }
  const docRef = await addDoc(invitationsCol, data)
  return docRef
}
