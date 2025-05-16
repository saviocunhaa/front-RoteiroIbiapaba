<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-xl text-center">
      <h1 class="text-3xl font-bold text-green-600 mb-4">Mensagem enviada com sucesso!</h1>
      <p class="text-gray-700 mb-6">
        Agradecemos o seu contato. Em breve, entraremos em contato com você sobre o seu anúncio no Roteiro Ibiapaba.
      </p>

      <router-link
        to="/"
        class="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-full transition"
      >
        Voltar para a Home
      </router-link>
    </div>
  </div>
</template>
