<template>
  <div
    class="min-h-screen flex flex-col items-center justify-start bg-gray-100 p-4 md:p-6 bg-cover bg-center"
    :style="{ backgroundImage: `url(${bgForm})` }"
  >
    <div class="bg-white p-6 md:p-8 rounded-3xl shadow-xl w-full max-w-3xl mb-8 border border-gray-100 animate-fade-in">
      <div class="text-center mb-6">
        <span class="text-xs font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-100">
          ✨ Inteligência Artificial Especializada
        </span>
        <h1 class="text-3xl md:text-4xl font-extrabold text-blue-950 mt-2">Planeje sua Viagem na Ibiapaba</h1>
        <p class="text-sm text-gray-500 mt-1 max-w-lg mx-auto">
          Selecione a cidade da Serra e a quantidade de dias para criar seu roteiro otimizado sob medida.
        </p>
      </div>

      <form @submit.prevent="handleGenerateItinerary" class="space-y-6">
        <!-- CIDADE DA SERRA (SELEÇÃO FECHADA) -->
        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase mb-2">
            📍 Cidade de Destino na Serra da Ibiapaba *
          </label>
          <select
            v-model="cidade"
            required
            class="w-full rounded-2xl border border-gray-300 p-3.5 text-sm font-semibold bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 transition text-gray-900 cursor-pointer shadow-xs"
          >
            <option value="" disabled>Selecione a cidade na serra...</option>
            <option v-for="c in CIDADES_IBIAPABA" :key="c.value" :value="c.value">
              {{ c.label }}
            </option>
          </select>
        </div>

        <!-- DURAÇÃO DA VIAGEM (CAIXAS RÁPIDAS COM DIAS) -->
        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase mb-2">
            🗓️ Quantos dias de viagem? *
          </label>
          <div class="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            <button
              v-for="d in [1, 2, 3, 4, 5, 6]"
              :key="d"
              type="button"
              @click="dias = d"
              class="py-3 px-2 rounded-2xl text-xs font-bold transition text-center border transform active:scale-95 flex flex-col items-center justify-center gap-0.5"
              :class="dias === d
                ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300 scale-102 font-extrabold'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200 font-medium'"
            >
              <span class="text-sm font-black">{{ d < 6 ? d : '6+' }}</span>
              <span class="text-[10px] uppercase opacity-90">{{ d === 1 ? 'Dia' : 'Dias' }}</span>
            </button>
          </div>
          <p class="text-[11px] text-gray-500 mt-2 pl-1 font-medium">
            {{ dias === 1 ? '⚡ Ideal para um bate e volta express' : dias === 2 ? '🌿 Ideal para um fim de semana acolhedor' : dias === 3 ? '✨ Ideal para feriados prolongados' : dias <= 5 ? '🎒 Roteiro aprofundado com trilhas e cafés' : '🏔️ Imersão completa por toda a Serra da Ibiapaba (6+ dias)' }}
          </p>
        </div>

        <!-- 1. CHIPS DE INTERESSES RÁPIDOS (SELEÇÃO VISUAL COM EMOJIS) -->
        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase mb-2">
            🏷️ Quais experiências você busca? (Selecione uma ou mais)
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="chip in AVAILABLE_CHIPS"
              :key="chip.id"
              type="button"
              @click="toggleChip(chip)"
              class="px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border transform active:scale-95 select-none"
              :class="isChipSelected(chip)
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-102'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'"
            >
              <span>{{ chip.label }}</span>
              <span v-if="isChipSelected(chip)" class="text-xs font-bold">✓</span>
            </button>
          </div>

          <!-- Campo Opcional para Detalhes Extras -->
          <div class="mt-3">
            <input
              v-model="customInteresses"
              type="text"
              placeholder="Outro interesse específico? (Ex: fondue no frio, fotografia, comprar cachaça envelhecida...)"
              class="w-full rounded-xl border border-gray-200 p-2.5 text-xs focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
            />
          </div>
        </div>

        <!-- RITMO DA VIAGEM & HOSPEDAGEM -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <!-- Ritmo -->
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1.5">⚡ Ritmo da Viagem</label>
            <div class="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                @click="ritmo = 'relaxante'"
                class="p-2.5 rounded-xl text-xs font-semibold border text-center transition"
                :class="ritmo === 'relaxante' ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold ring-1 ring-emerald-500' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'"
              >
                🌿 Relaxante
              </button>
              <button
                type="button"
                @click="ritmo = 'equilibrado'"
                class="p-2.5 rounded-xl text-xs font-semibold border text-center transition"
                :class="ritmo === 'equilibrado' ? 'bg-blue-50 border-blue-500 text-blue-800 font-bold ring-1 ring-blue-500' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'"
              >
                ⚖️ Equilibrado
              </button>
              <button
                type="button"
                @click="ritmo = 'intenso'"
                class="p-2.5 rounded-xl text-xs font-semibold border text-center transition"
                :class="ritmo === 'intenso' ? 'bg-purple-50 border-purple-500 text-purple-800 font-bold ring-1 ring-purple-500' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'"
              >
                🚀 Intenso
              </button>
            </div>
          </div>

          <!-- Hospedagem -->
          <div>
            <Select
              v-model="hospedagem"
              :options="cityList"
              label="Cidade Onde Vai Dormir (Opcional)"
              placeholder="Selecione onde vai se hospedar"
            />
          </div>
        </div>

        <!-- Crianças, Carro e Acessibilidade -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="flex items-center space-x-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
            <input
              v-model="comCriancas"
              type="checkbox"
              id="criancas"
              class="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
            />
            <label for="criancas" class="text-xs font-bold text-gray-700 cursor-pointer">
              👶 Crianças / idosos?
            </label>
          </div>

          <div class="flex items-center space-x-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
            <input
              v-model="acessibilidade"
              type="checkbox"
              id="acessibilidade"
              class="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
            />
            <label for="acessibilidade" class="text-xs font-bold text-gray-700 cursor-pointer">
              ♿ Acessibilidade?
            </label>
          </div>

          <div class="flex items-center space-x-3 bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
            <input
              v-model="carroProprio"
              type="checkbox"
              id="carro"
              class="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
            />
            <label for="carro" class="text-xs font-bold text-gray-700 cursor-pointer">
              🚗 Carro / alugado?
            </label>
          </div>
        </div>

        <!-- Limite Diário de IA -->
        <div v-if="authStore.user?.email && !authStore.isAdmin" class="flex items-center justify-between p-3.5 bg-blue-50/50 rounded-2xl border border-blue-100">
          <span class="text-xs font-bold text-blue-900">Limite Diário de Inteligência Artificial:</span>
          <span class="text-xs font-black px-2.5 py-1 rounded-xl" :class="authStore.user?.rotas_geradas_hoje >= 2 ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'">
            {{ authStore.user?.rotas_geradas_hoje || 0 }} / 2 roteiros
          </span>
        </div>
        
        <div v-if="authStore.user?.rotas_geradas_hoje >= 2 && !authStore.isAdmin" class="p-3 bg-red-50 text-red-700 text-xs font-semibold text-center rounded-xl border border-red-100 mb-2">
          Você atingiu o limite de roteiros gratuitos por hoje. Volte amanhã! 🌟
        </div>

        <!-- Botão Gerar -->
        <Button
          type="submit"
          full
          :disabled="loading || !cidade || (authStore.user?.rotas_geradas_hoje >= 2 && !authStore.isAdmin)"
          class="!py-3.5 !text-base font-bold shadow-lg transform active:scale-98 disabled:opacity-50"
        >
          <span v-if="loading" class="flex items-center justify-center gap-2">
            <span class="animate-spin">⏳</span>
            <span>Montando seu Roteiro Inteligente com IA...</span>
          </span>
          <span v-else class="flex items-center justify-center gap-2">
            <span>✨ Gerar Roteiro Personalizado</span>
          </span>
        </Button>

        <div v-if="error" class="p-3.5 bg-red-50 text-red-700 text-xs font-semibold text-center rounded-xl border border-red-100">
          {{ error }}
        </div>
      </form>
    </div>

    <!-- Indicador de Carregamento -->
    <div v-if="loading" class="flex flex-col items-center justify-center my-12 bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100 animate-pulse">
      <div class="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-600 mb-4"></div>
      <h3 class="text-lg font-bold text-gray-800">Montando o seu itinerário ideal...</h3>
      <p class="text-xs text-gray-500 mt-1 leading-relaxed">
        Consultando atrações em {{ cidade || 'toda a Serra' }}, calculando horários de abertura e melhores rotas.
      </p>
    </div>

    <!-- Exibição do Roteiro Gerado -->
    <div
      v-else-if="roteiro"
      class="bg-white p-6 md:p-10 rounded-3xl shadow-xl w-full max-w-4xl border border-gray-100 mb-12 animate-fade-in"
    >
      <!-- BARRA DE AÇÕES DO ROTEIRO: SALVAR NO PERFIL, PDF, WHATSAPP, IMPRIMIR, COPIAR -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 mb-8 border-b border-gray-100 gap-4">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            ✨ Roteiro Personalizado Pronto
          </span>
          <h2 class="text-2xl md:text-3xl font-extrabold text-blue-950 mt-1">
            {{ cidade ? `Viagem para ${cidade}` : 'Viagem pela Serra da Ibiapaba' }}
          </h2>
          <p class="text-xs text-gray-500 mt-0.5">Gerado por Inteligência Artificial com base em atrativos reais</p>
        </div>

        <div class="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <!-- 5. BOTÃO SALVAR NO MEU PERFIL -->
          <button
            @click="saveItineraryToProfile"
            :disabled="savingItinerary || itinerarySaved"
            class="flex-1 sm:flex-initial py-2.5 px-4 rounded-xl text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5"
            :class="itinerarySaved ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-blue-600 hover:bg-blue-700 text-white'"
            title="Salvar este roteiro na sua conta para acessar quando quiser"
          >
            <span v-if="savingItinerary">⏳ Salvando...</span>
            <span v-else-if="itinerarySaved">✅ Salvo no Perfil</span>
            <span v-else>💾 Salvar no Perfil</span>
          </button>

          <!-- Botão WhatsApp -->
          <button
            @click="shareWhatsApp"
            class="flex-1 sm:flex-initial bg-[#25D366] hover:bg-[#20bd5a] text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-sm hover:shadow transition flex items-center justify-center gap-2"
            title="Compartilhar roteiro formatado no WhatsApp"
          >
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>WhatsApp</span>
          </button>

          <!-- Botão Baixar PDF -->
          <button
            @click="downloadPDF"
            :disabled="isGeneratingPDF"
            class="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-sm hover:shadow transition flex items-center justify-center gap-2 disabled:opacity-60"
            title="Salvar arquivo PDF diagramado"
          >
            <span v-if="isGeneratingPDF" class="animate-spin text-xs">⏳</span>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>{{ isGeneratingPDF ? 'Gerando...' : 'PDF' }}</span>
          </button>

          <!-- Botão Copiar Texto -->
          <button
            @click="copyRoteiroText"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            title="Copiar texto do roteiro"
          >
            <span>{{ copied ? '✅ Copiado' : '📋 Copiar' }}</span>
          </button>
        </div>
      </div>

      <!-- CONTEÚDO PRINCIPAL DO ROTEIRO (FORMATADO PARA WEB & PDF) -->
      <div id="roteiro-content" class="space-y-8 text-gray-800 bg-white">
        <!-- Cabeçalho Oficial do PDF/Documento com Contenção de Quebra -->
        <div class="p-6 md:p-8 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 overflow-hidden max-w-full">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xl">🏔️</span>
              <span class="font-extrabold text-xs tracking-wider uppercase text-blue-200">Guia Turístico Roteiro Ibiapaba</span>
            </div>
            <h1 class="text-2xl md:text-3xl font-black truncate">
              {{ cidade || 'Serra da Ibiapaba' }} - {{ dias === 6 ? '6+ Dias' : `${dias} ${dias === 1 ? 'Dia' : 'Dias'}` }}
            </h1>
            <p class="text-xs text-blue-100 mt-1 line-clamp-2">
              Roteiro inteligente gerado com base em atrativos locais, rotas otimizadas e preferências personalizadas.
            </p>
          </div>

          <div class="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs space-y-1.5 w-full md:max-w-xs shrink-0 break-words">
            <p><strong>🗓️ Duração:</strong> {{ dias === 6 ? '6+ dias' : `${dias} ${dias === 1 ? 'dia' : 'dias'}` }}</p>
            <p v-if="combinedInteresses" class="line-clamp-2">
              <strong>🎒 Estilo:</strong> {{ combinedInteresses }}
            </p>
            <p><strong>⚡ Ritmo:</strong> {{ ritmoCapitalized }}</p>
            <p><strong>🚗 Transporte:</strong> {{ carroProprio ? 'Carro Próprio' : 'Transporte Local' }}</p>
            <p><strong>👶 Com Crianças:</strong> {{ comCriancas ? 'Sim' : 'Não' }}</p>
          </div>
        </div>

        <!-- 4. MINI-MAPA DA ROTA DO ROTEIRO (LEAFLET MAP) -->
        <div
          v-if="matchedSpotsInItinerary.length > 0"
          id="itinerary-map-section"
          data-html2canvas-ignore="true"
          class="border border-blue-200 rounded-3xl p-5 bg-blue-50/40 shadow-sm relative overflow-hidden"
          style="page-break-inside: avoid;"
        >
          <div class="flex justify-between items-center mb-3">
            <div>
              <h3 class="text-base font-bold text-blue-950 flex items-center gap-2">
                <span>🗺️</span>
                <span>Mapa da Rota da Viagem</span>
              </h3>
              <p class="text-xs text-gray-500">
                Atrativos identificados no seu roteiro traçados em ordem sugerida de visitação.
              </p>
            </div>
            <span class="text-xs bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full">
              📍 {{ matchedSpotsInItinerary.length }} destinos no mapa
            </span>
          </div>

          <!-- Container do Mapa com altura fixa e contenção de bordas -->
          <div
            id="itinerary-map"
            class="w-full rounded-2xl border border-blue-200 shadow-inner relative"
          ></div>
        </div>

        <!-- Mensagem de Saudação da IA -->
        <div v-if="roteiro.saudacao" class="text-base text-blue-950 font-medium bg-blue-50/70 p-5 rounded-2xl border border-blue-100/80 leading-relaxed">
          {{ roteiro.saudacao }}
        </div>

        <!-- Recomendações e Informações Práticas -->
        <div v-if="roteiro.consideracoes_iniciais" class="bg-gray-50/80 p-6 rounded-2xl border border-gray-200">
          <h3 class="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span class="text-lg">🎒</span> Informações Práticas & Dicas de Viagem
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-700">
            <div v-if="roteiro.consideracoes_iniciais.clima" class="p-3 bg-white rounded-xl border border-gray-100">
              <strong class="text-blue-900 block font-bold mb-1">🌤️ Clima na Serra</strong>
              {{ roteiro.consideracoes_iniciais.clima }}
            </div>
            <div v-if="roteiro.consideracoes_iniciais.roupas" class="p-3 bg-white rounded-xl border border-gray-100">
              <strong class="text-blue-900 block font-bold mb-1">👟 Vestimenta Sugerida</strong>
              {{ roteiro.consideracoes_iniciais.roupas }}
            </div>
            <div v-if="roteiro.consideracoes_iniciais.transporte" class="p-3 bg-white rounded-xl border border-gray-100">
              <strong class="text-blue-900 block font-bold mb-1">🚗 Deslocamento & Rotas</strong>
              {{ roteiro.consideracoes_iniciais.transporte }}
            </div>
            <div v-if="roteiro.consideracoes_iniciais.alimentacao" class="p-3 bg-white rounded-xl border border-gray-100">
              <strong class="text-blue-900 block font-bold mb-1">☕ Gastronomia Local</strong>
              {{ roteiro.consideracoes_iniciais.alimentacao }}
            </div>
          </div>
        </div>

        <!-- Cronograma dos Dias -->
        <div v-if="roteiro.dias && roteiro.dias.length" class="space-y-6">
          <div
            v-for="(dia, index) in roteiro.dias"
            :key="index"
            class="border border-blue-100/80 rounded-2xl p-6 shadow-sm bg-white"
            style="page-break-inside: avoid;"
          >
            <!-- Título do Dia -->
            <div class="flex items-center gap-3 pb-3 border-b border-gray-100 mb-4">
              <span class="bg-blue-600 text-white text-xs font-extrabold px-3 py-1.5 rounded-lg shadow-sm">
                {{ dia.dia || `Dia ${index + 1}` }}
              </span>
              <h4 class="text-base md:text-lg font-bold text-blue-950">{{ dia.titulo }}</h4>
            </div>

            <!-- Lista de Atividades com 3. ATRATIVOS CLICÁVEIS COM LINKS -->
            <ul class="space-y-4 pl-1">
              <li
                v-for="(atividade, idx) in dia.atividades"
                :key="idx"
                class="flex items-start gap-3.5 text-xs sm:text-sm text-gray-700"
              >
                <span class="font-mono font-bold bg-blue-50 text-blue-800 border border-blue-100 px-2.5 py-1 rounded-lg text-xs shrink-0 mt-0.5 shadow-xs">
                  {{ atividade.hora }}
                </span>
                <div class="flex-1">
                  <p class="leading-relaxed font-medium text-gray-800">{{ atividade.descricao }}</p>
                  
                  <p v-if="atividade.dica" class="text-[11px] text-amber-700 mt-1 italic">
                    💡 Dica: {{ atividade.dica }}
                  </p>

                  <!-- 3. MINI CARD COM LINK DIRETO PARA O ATRATIVO QUANDO RECONHECIDO -->
                  <div
                    v-if="getMatchedSpot(atividade)"
                    class="mt-2.5 inline-flex items-center gap-3 p-2 bg-blue-50/80 border border-blue-200 rounded-xl hover:bg-blue-100/80 transition group"
                  >
                    <img
                      :src="getImageUrl(getMatchedSpot(atividade).imagens?.[0]?.imagem, 'https://placehold.co/80x80?text=Foto')"
                      alt="Foto"
                      class="w-10 h-10 rounded-lg object-cover border border-blue-200"
                    />
                    <div class="text-left pr-2">
                      <router-link
                        :to="`/pontos/${getMatchedSpot(atividade).id}`"
                        class="text-xs font-bold text-blue-900 group-hover:text-blue-600 flex items-center gap-1 hover:underline"
                        target="_blank"
                      >
                        <span>📍 {{ getMatchedSpot(atividade).nome }}</span>
                        <span class="text-blue-500 font-bold">↗</span>
                      </router-link>
                      <p class="text-[10px] text-gray-500">
                        {{ getMatchedSpot(atividade).cidade }} • ★ {{ getMatchedSpot(atividade).media_avaliacoes > 0 ? getMatchedSpot(atividade).media_avaliacoes.toFixed(1) : 'Novo' }}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            </ul>

            <p v-if="dia.resumo" class="mt-4 pt-3 border-t border-dashed border-gray-100 text-xs text-gray-500 italic">
              <strong>Resumo do dia:</strong> {{ dia.resumo }}
            </p>
          </div>
        </div>

        <!-- Dicas e Mau Tempo -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2" style="page-break-inside: avoid;">
          <div v-if="roteiro.alternativas_mau_tempo?.length" class="bg-amber-50/80 p-5 rounded-2xl border border-amber-200/80">
            <h4 class="font-bold text-amber-900 text-sm mb-2 flex items-center gap-1.5">
              <span>🌧️</span> Em caso de chuva / mau tempo
            </h4>
            <ul class="list-disc pl-5 space-y-1.5 text-xs text-amber-800">
              <li v-for="(item, idx) in roteiro.alternativas_mau_tempo" :key="idx">{{ item }}</li>
            </ul>
          </div>

          <div v-if="roteiro.dicas_adicionais?.length" class="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-200/80">
            <h4 class="font-bold text-emerald-900 text-sm mb-2 flex items-center gap-1.5">
              <span>💡</span> Dicas dos Moradores e Guias Locais
            </h4>
            <ul class="list-disc pl-5 space-y-1.5 text-xs text-emerald-800">
              <li v-for="(item, idx) in roteiro.dicas_adicionais" :key="idx">{{ item }}</li>
            </ul>
          </div>
        </div>

        <!-- Mensagem Final -->
        <div v-if="roteiro.mensagem_final" class="text-center font-bold text-blue-900 pt-4 text-sm" style="page-break-inside: avoid;">
          {{ roteiro.mensagem_final }}
        </div>

        <!-- Rodapé Oficial do PDF -->
        <div class="pt-6 mt-6 border-t border-gray-200 text-center text-[10px] text-gray-400 space-y-1">
          <p class="font-bold text-gray-500 uppercase tracking-wider">
            Roteiro Ibiapaba • Guia Turístico Inteligente da Serra da Ibiapaba
          </p>
          <p>Acesse o mapa interativo e fotos oficiais em: https://roteiroibiapaba.com.br</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import itineraryService from '../services/itineraryService'
import spotsService from '../services/spotsService'
import { getImageUrl } from '../utils/imageHelper'
import html2pdf from 'html2pdf.js'
import bgForm from '../assets/fundo-formulario.png'
import Select from '../components/UI/Select.vue'
import Button from '../components/UI/Button.vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Corrige ícones padrão do Leaflet no Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const router = useRouter()
const authStore = useAuthStore()

// CIDADES OFICIAIS DA SERRA DA IBIAPABA
const CIDADES_IBIAPABA = [
  { value: 'Serra da Ibiapaba', label: '🏔️ Toda a Serra da Ibiapaba (Circuito Completo)' },
  { value: 'Viçosa do Ceará', label: 'Viçosa do Ceará (Patrimônio Histórico & Cachaça)' },
  { value: 'Ubajara', label: 'Ubajara (Parque Nacional, Gruta & Teleférico)' },
  { value: 'Tianguá', label: 'Tianguá (Mirantes & Cafeterias)' },
  { value: 'São Benedito', label: 'São Benedito (Flores Tropicais & Santuário)' },
  { value: 'Ipu', label: 'Ipu (Bica do Ipu & Mirantes)' },
  { value: 'Guaraciaba do Norte', label: 'Guaraciaba do Norte (Clima Frio & Agroecologia)' },
  { value: 'Ibiapina', label: 'Ibiapina (Cachoeiras & Turismo Rural)' },
  { value: 'Carnaubal', label: 'Carnaubal (Trilhas & Mirantes Naturais)' },
  { value: 'Croatá', label: 'Croatá (Ecoturismo & Paisagens)' },
]

const cidade = ref('Viçosa do Ceará')
const dias = ref(2)
const ritmo = ref('equilibrado')
const comCriancas = ref(false)
const carroProprio = ref(true)
const acessibilidade = ref(false)
const hospedagem = ref('')
const error = ref('')
const roteiro = ref(null)
const loading = ref(false)
const isGeneratingPDF = ref(false)
const savingItinerary = ref(false)
const itinerarySaved = ref(false)
const copied = ref(false)

// 1. CHIPS DE INTERESSES RÁPIDOS
const AVAILABLE_CHIPS = [
  { id: 'cafes', label: '☕ Cafés Especiais & Docerias', text: 'cafés especiais de sombra e docerias' },
  { id: 'cachacas', label: '🥃 Engenhos & Cachaça', text: 'engenhos tradicionais de cachaça artesanal e licores' },
  { id: 'cachoeiras', label: '🌊 Cachoeiras & Banho', text: 'cachoeiras, bicas e poços naturais' },
  { id: 'trilhas', label: '🥾 Trilhas & Mirantes', text: 'trilhas ecológicas, mirantes e vista panorâmica do vale' },
  { id: 'historia', label: '⛪ História & Casarões', text: 'patrimônio histórico, igrejas coloniais e casarios' },
  { id: 'gastronomia', label: '🍽️ Gastronomia Serrana', text: 'gastronomia serrana e restaurantes acolhedores' },
  { id: 'aventura', label: '🧗 Ecoturismo & Aventura', text: 'aventura, tirolesa, rapel e parques ecológicos' },
  { id: 'flores', label: '🌸 Flores & Sítios', text: 'fazendas de flores tropicais e sítios agroecológicos' },
  { id: 'relax', label: '🧘 Clima Frio & Descanso', text: 'relaxamento, noites frias na serra e contemplação' },
]

const selectedChips = ref(['trilhas', 'cafes', 'gastronomia'])
const customInteresses = ref('')

const toggleChip = (chip) => {
  const idx = selectedChips.value.indexOf(chip.id)
  if (idx > -1) {
    selectedChips.value.splice(idx, 1)
  } else {
    selectedChips.value.push(chip.id)
  }
}

const isChipSelected = (chip) => selectedChips.value.includes(chip.id)

const combinedInteresses = computed(() => {
  const chipTexts = selectedChips.value
    .map((id) => AVAILABLE_CHIPS.find((c) => c.id === id)?.text)
    .filter(Boolean)
  
  if (customInteresses.value.trim()) {
    chipTexts.push(customInteresses.value.trim())
  }
  return chipTexts.join(', ')
})

const ritmoCapitalized = computed(() => {
  const map = {
    relaxante: '🌿 Relaxante',
    equilibrado: '⚖️ Equilibrado',
    intenso: '🚀 Intenso',
  }
  return map[ritmo.value] || '⚖️ Equilibrado'
})

const cityList = [
  'Carnaubal',
  'Croatá',
  'Guaraciaba do Norte',
  'Ibiapina',
  'Ipu',
  'São Benedito',
  'Tianguá',
  'Ubajara',
  'Viçosa do Ceará',
  'Serra',
]

// Lista de todos os atrativos turísticos cadastrados no sistema
const allRegisteredSpots = ref([])
let itineraryMap = null

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  try {
    const data = await spotsService.getSpots({ page_size: 100 })
    allRegisteredSpots.value = data.results || data || []
  } catch (err) {
    console.warn('Erro ao carregar lista de atrativos para correspondência:', err)
  }
})

// Normaliza texto para correspondência fonética/aproximada
const normalizeStr = (str) => {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

/**
 * 3. Localiza se uma atividade do roteiro menciona um ponto turístico cadastrado no banco.
 */
const getMatchedSpot = (atividade) => {
  if (!atividade || !allRegisteredSpots.value.length) return null
  const desc = normalizeStr(atividade.descricao + ' ' + (atividade.ponto_nome || ''))

  return allRegisteredSpots.value.find((spot) => {
    const spotNome = normalizeStr(spot.nome)
    // Se o nome do atrativo estiver contido na descrição
    if (spotNome.length >= 4 && desc.includes(spotNome)) {
      return true
    }
    // Palavras-chave específicas fortes
    const keywords = spotNome.split(' ').filter((w) => w.length >= 5)
    for (const kw of keywords) {
      if (['mirante', 'parque', 'igreja', 'bica', 'cachoeira', 'sitio', 'engenho'].includes(kw)) continue
      if (desc.includes(kw)) return true
    }
    return false
  })
}

/**
 * 4. Lista todos os pontos turísticos identificados em todo o roteiro para traçar a rota no mapa.
 */
const matchedSpotsInItinerary = computed(() => {
  if (!roteiro.value?.dias) return []
  const found = []
  const ids = new Set()

  roteiro.value.dias.forEach((d) => {
    (d.atividades || []).forEach((a) => {
      const match = getMatchedSpot(a)
      if (match && !ids.has(match.id)) {
        ids.add(match.id)
        found.push(match)
      }
    })
  })

  // Se foram identificados menos de 2 atrativos, inclui os pontos turísticos da cidade selecionada
  if (found.length < 2 && allRegisteredSpots.value.length > 0) {
    const selectedCityNorm = normalizeStr(cidade.value)
    const citySpots = allRegisteredSpots.value.filter((s) => {
      const c = normalizeStr(s.cidade)
      return selectedCityNorm.includes(c) || c.includes(selectedCityNorm)
    })

    citySpots.forEach((s) => {
      if (!ids.has(s.id) && found.length < 6) {
        ids.add(s.id)
        found.push(s)
      }
    })

    // Se ainda for vazio, pega os primeiros pontos da serra
    if (found.length === 0) {
      allRegisteredSpots.value.slice(0, 4).forEach((s) => {
        if (!ids.has(s.id)) {
          ids.add(s.id)
          found.push(s)
        }
      })
    }
  }

  return found
})

/**
 * Renderiza o Mini-Mapa Leaflet conectando os atrativos da viagem em sequência com contenção e redimensionamento seguro.
 */
const renderItineraryMap = () => {
  setTimeout(() => {
    const container = document.getElementById('itinerary-map')
    if (!container) return

    if (itineraryMap) {
      itineraryMap.remove()
      itineraryMap = null
    }

    const spots = matchedSpotsInItinerary.value
    if (spots.length === 0) return

    const first = spots[0]
    const initialLat = parseFloat(first.latitude) || -3.5658
    const initialLng = parseFloat(first.longitude) || -41.0928

    itineraryMap = L.map('itinerary-map', {
      scrollWheelZoom: false,
      attributionControl: false,
    }).setView([initialLat, initialLng], 11)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(itineraryMap)

    const latlngs = []
    const bounds = []

    spots.forEach((spot, idx) => {
      const lat = parseFloat(spot.latitude)
      const lng = parseFloat(spot.longitude)
      if (isNaN(lat) || isNaN(lng)) return

      latlngs.push([lat, lng])
      bounds.push([lat, lng])

      // Marcador numerado estilizado
      const customIcon = L.divIcon({
        className: 'custom-itinerary-pin',
        html: `
          <div style="background: #2563eb; color: #ffffff; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.35);">
            ${idx + 1}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      })

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(itineraryMap)
      
      const photoUrl = getImageUrl(spot.imagens?.[0]?.imagem, 'https://placehold.co/200x100?text=Foto')
      marker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; width: 170px; padding: 2px;">
          <img src="${photoUrl}" style="width: 100%; height: 75px; object-fit: cover; border-radius: 8px; margin-bottom: 6px;" />
          <strong style="font-size: 12px; color: #0f172a; display: block; line-height: 1.2;">${idx + 1}. ${spot.nome}</strong>
          <span style="font-size: 11px; color: #64748b; display: block; margin-top: 2px;">📍 ${spot.cidade}</span>
          <a href="/pontos/${spot.id}" target="_blank" style="display: inline-block; margin-top: 6px; font-size: 11px; font-weight: bold; color: #2563eb; text-decoration: none;">Ver Detalhes ↗</a>
        </div>
      `)
    })

    // Desenha linha de rota conectando os atrativos
    if (latlngs.length > 1) {
      L.polyline(latlngs, {
        color: '#2563eb',
        weight: 3,
        opacity: 0.8,
        dashArray: '6, 8',
      }).addTo(itineraryMap)
    }

    if (bounds.length > 0) {
      itineraryMap.fitBounds(bounds, { padding: [40, 40] })
    }

    // Garante que o Leaflet recalcule as dimensões do container
    setTimeout(() => {
      if (itineraryMap) {
        itineraryMap.invalidateSize()
      }
    }, 300)
  }, 400)
}

const handleGenerateItinerary = async () => {
  loading.value = true
  error.value = ''
  roteiro.value = null
  itinerarySaved.value = false

  try {
    const fullInteresses = `${combinedInteresses.value}. Ritmo: ${ritmo.value}.`
    const data = await itineraryService.generateItinerary({
      cidade: cidade.value,
      dias: dias.value,
      interesses: fullInteresses,
      comCriancas: comCriancas.value,
      carroProprio: carroProprio.value,
      hospedagem: hospedagem.value,
      acessibilidade: acessibilidade.value,
    })
    roteiro.value = data
    renderItineraryMap()
  } catch (err) {
    console.error('Erro na geração do roteiro:', err)
    if (err.response?.status === 401) {
      error.value = 'Sessão expirada. Faça login novamente.'
      router.push('/login')
    } else {
      error.value = err.message || 'Erro ao gerar roteiro. Tente novamente mais tarde.'
    }
  } finally {
    loading.value = false
  }
}

/**
 * 5. SALVA O ROTEIRO NO PERFIL DO USUÁRIO
 */
const saveItineraryToProfile = async () => {
  if (!roteiro.value) return
  savingItinerary.value = true

  try {
    const displayDias = dias.value === 6 ? '6+ Dias' : `${dias.value} ${dias.value === 1 ? 'Dia' : 'Dias'}`
    await itineraryService.saveItinerary({
      titulo: `Roteiro ${cidade.value || 'Serra da Ibiapaba'} (${displayDias})`,
      cidade: cidade.value || 'Serra da Ibiapaba',
      dias: dias.value,
      interesses: combinedInteresses.value,
      dados_roteiro: roteiro.value,
    })
    itinerarySaved.value = true
  } catch (err) {
    console.error('Erro ao salvar roteiro:', err)
    alert(err.response?.data?.detail || 'Erro ao salvar roteiro no seu perfil.')
  } finally {
    savingItinerary.value = false
  }
}

/**
 * Monta o texto puro formatado para o WhatsApp e Área de Transferência.
 */
const buildFormattedItineraryText = () => {
  if (!roteiro.value) return ''

  const r = roteiro.value
  const displayDias = dias.value === 6 ? '6+ dias' : `${dias.value} ${dias.value === 1 ? 'dia' : 'dias'}`

  let text = `🌲 *MEU ROTEIRO NA SERRA DA IBIAPABA* 🌲\n`
  text += `📍 *Destino:* ${cidade.value || 'Serra da Ibiapaba'}\n`
  text += `🗓️ *Duração:* ${displayDias}\n`
  if (combinedInteresses.value) text += `🎒 *Estilo:* ${combinedInteresses.value}\n`
  text += `⚡ *Ritmo:* ${ritmoCapitalized.value}\n`
  text += `🚗 *Transporte:* ${carroProprio.value ? 'Carro Próprio' : 'Transporte Local'}\n\n`

  if (r.saudacao) {
    text += `💬 _"${r.saudacao}"_\n\n`
  }

  if (r.dias && r.dias.length) {
    text += `📅 *CRONOGRAMA DE VIAGEM:*\n`
    r.dias.forEach((d) => {
      text += `\n🔹 *${d.dia || 'Dia'} • ${d.titulo || ''}*\n`
      if (d.atividades && d.atividades.length) {
        d.atividades.forEach((a) => {
          text += `  ⏰ *${a.hora}:* ${a.descricao}\n`
        })
      }
      if (d.resumo) {
        text += `  📝 _Resumo:_ ${d.resumo}\n`
      }
    })
  }

  if (r.dicas_adicionais && r.dicas_adicionais.length) {
    text += `\n💡 *DICAS LOCAIS:*\n`
    r.dicas_adicionais.forEach((dica) => {
      text += `• ${dica}\n`
    })
  }

  if (r.alternativas_mau_tempo && r.alternativas_mau_tempo.length) {
    text += `\n🌧️ *EM CASO DE CHUVA:*\n`
    r.alternativas_mau_tempo.forEach((alt) => {
      text += `• ${alt}\n`
    })
  }

  text += `\n✨ _Roteiro gerado por Inteligência Artificial no Guia Oficial Roteiro Ibiapaba_\n`
  text += `🌐 https://roteiroibiapaba.com.br`

  return text
}

const shareWhatsApp = () => {
  const text = buildFormattedItineraryText()
  const encoded = encodeURIComponent(text)
  const url = `https://api.whatsapp.com/send?text=${encoded}`
  window.open(url, '_blank')
}

const copyRoteiroText = async () => {
  try {
    const text = buildFormattedItineraryText()
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 3000)
  } catch (err) {
    console.error('Erro ao copiar texto:', err)
  }
}

const downloadPDF = () => {
  const element = document.getElementById('roteiro-content')
  if (!element) return

  isGeneratingPDF.value = true

  const filename = `Roteiro_Ibiapaba_${(cidade.value || 'Serra').replace(/\s+/g, '_')}_${dias.value}dias.pdf`

  const opt = {
    margin: [10, 10, 10, 10],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  }

  html2pdf()
    .from(element)
    .set(opt)
    .save()
    .then(() => {
      isGeneratingPDF.value = false
    })
    .catch((err) => {
      console.error('Erro ao gerar PDF:', err)
      isGeneratingPDF.value = false
    })
}
</script>

<style>
#itinerary-map {
  height: 320px !important;
  width: 100% !important;
  position: relative !important;
  border-radius: 16px !important;
  overflow: hidden !important;
  z-index: 1 !important;
}

#itinerary-map .leaflet-pane {
  z-index: 2 !important;
}

#itinerary-map .leaflet-top,
#itinerary-map .leaflet-bottom {
  z-index: 5 !important;
}

.custom-itinerary-pin {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
</style>
