// Importações do Firebase
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'

// 🔐 Configurações do Firebase do seu projeto
const firebaseConfig = {
  apiKey: "AIzaSyAKkXvED-Ls2mCa89kfj1hwcnCrLblMIaU",
  authDomain: "roteiroibiapaba-b8aea.firebaseapp.com",
  projectId: "roteiroibiapaba-b8aea",
  storageBucket: "roteiroibiapaba-b8aea.appspot.com",
  messagingSenderId: "641564520217",
  appId: "1:1234567890:web:321abc456def7890", // você pode obter esse valor também na tela de configurações
}

// Inicializa o Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

// Exporta o que será usado no login
export { auth, provider, signInWithPopup }
