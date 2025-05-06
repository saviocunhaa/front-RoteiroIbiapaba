 const getValidProfilePhoto = () => {
    const storedFoto = localStorage.getItem('foto')
    return storedFoto && storedFoto !== 'null'
      ? storedFoto
      : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
  }

  export default getValidProfilePhoto