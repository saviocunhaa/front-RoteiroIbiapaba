<template>
  <footer class="bg-slate-950 text-white border-t border-slate-900 pt-16 pb-12 px-4 sm:px-6">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
      <!-- Coluna 1: Sobre a Plataforma -->
      <div class="space-y-4">
        <router-link to="/" class="flex items-center gap-2">
          <img
            src="../assets/RoteiroIbiapaba.png"
            alt="Roteiro Ibiapaba"
            class="h-12 w-auto brightness-0 invert"
          />
        </router-link>
        <p class="text-xs text-slate-400 leading-relaxed">
          O guia turístico mais completo da Serra da Ibiapaba, Ceará. Roteiros personalizados com Inteligência Artificial, mapas interativos e 66 atrações catalogadas.
        </p>
        <div class="flex items-center gap-3 text-slate-400 text-xs">
          <span class="inline-flex items-center gap-1 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-emerald-400 font-semibold">
            <span>🌿</span> Ecoturismo Cearense
          </span>
        </div>
      </div>

      <!-- Coluna 2: Navegação Rápida -->
      <div>
        <h4 class="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">Navegação</h4>
        <ul class="space-y-2.5 text-xs text-slate-400">
          <li>
            <router-link to="/" class="hover:text-emerald-400 transition flex items-center gap-1.5">
              <span>🏡</span> Início
            </router-link>
          </li>
          <li>
            <router-link to="/explorar" class="hover:text-emerald-400 transition flex items-center gap-1.5">
              <span>🌿</span> Explorar Destinos
            </router-link>
          </li>
          <li>
            <router-link to="/mapa" class="hover:text-emerald-400 transition flex items-center gap-1.5">
              <span>🗺️</span> Mapa da Serra
            </router-link>
          </li>
          <li>
            <router-link to="/gerar-roteiro" class="hover:text-emerald-400 transition flex items-center gap-1.5">
              <span>✨</span> Roteiro com IA
            </router-link>
          </li>
          <li>
            <router-link to="/perfil" class="hover:text-emerald-400 transition flex items-center gap-1.5">
              <span>❤️</span> Meus Favoritos
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Coluna 3: Cidades da Ibiapaba -->
      <div>
        <h4 class="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">Cidades da Serra</h4>
        <ul class="grid grid-cols-2 gap-2 text-xs text-slate-400">
          <li v-for="c in cidades" :key="c">
            <router-link :to="`/explorar?cidade=${c}`" class="hover:text-emerald-400 transition">
              {{ c }}
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Coluna 4: Contato e Parcerias -->
      <div class="space-y-3">
        <h4 class="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">Contato & Divulgação</h4>
        <p class="text-xs text-slate-400 leading-relaxed">
          Possui uma pousada, restaurante, café de serra ou agência de passeios na Ibiapaba? Anuncie no guia oficial.
        </p>
        <router-link
          to="/contato"
          class="inline-block bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm"
        >
          Divulgue seu Estabelecimento →
        </router-link>
      </div>
    </div>

    <!-- Linha de Copyright -->
    <div class="max-w-7xl mx-auto pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
      <p>&copy; {{ new Date().getFullYear() }} Roteiro Ibiapaba. Todos os direitos reservados.</p>
      <p class="flex items-center gap-1">
        Desenvolvido para valorizar o turismo e a cultura da Serra da Ibiapaba, Ceará ❤️
      </p>
    </div>
  </footer>
</template>

<script setup>
const cidades = [
  'Carnaubal',
  'Croatá',
  'Guaraciaba do Norte',
  'Ibiapina',
  'Ipu',
  'São Benedito',
  'Tianguá',
  'Ubajara',
  'Viçosa do Ceará',
]
</script>