<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
      <h1 class="text-3xl font-bold text-blue-700 text-center mb-4">Anuncie no Roteiro Ibiapaba</h1>
      <p class="text-center text-gray-600 mb-6">
        Quer divulgar seu negócio? Entre em contato conosco e anuncie no nosso site!
      </p>

      <form action="https://formsubmit.co/roteiroibiapaba@gmail.com" method="POST" class="space-y-4">
            <input type="hidden" name="_captcha" value="false">

            <div>
                <label>Seu Nome</label>
                <input name="nome" required class="mt-1 block w-full rounded border-gray-300 shadow-sm" />
            </div>
            <div>
                <label>E-mail</label>
                <input name="email" type="email" required class="mt-1 block w-full rounded border-gray-300 shadow-sm" />
            </div>
            <div>
                <label>Mensagem</label>
                <textarea name="mensagem" rows="5" required class="mt-1 block w-full rounded border-gray-300 shadow-sm"></textarea>
            </div>

            <button type="submit" class="w-full bg-blue-600 text-white py-2 px-4 rounded font-semibold transition">
                Enviar Mensagem
            </button>
        </form>


    </div>
  </div>
</template>

