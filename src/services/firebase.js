// Configuração e inicialização do Firebase usando variáveis de ambiente
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAKkXvED-Ls2mCa89kfj1hwcnCrLblMIaU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "roteiroibiapaba-b8aea.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "roteiroibiapaba-b8aea",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "roteiroibiapaba-b8aea.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "641564520217",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:641564520217:web:321abc456def7890",
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { auth, provider, signInWithPopup }
