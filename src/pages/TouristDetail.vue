<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
    <div class="max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-500 font-medium">Carregando detalhes do atrativo...</p>
      </div>

      <div v-else-if="spot.id">
        <!-- Breadcrumbs -->
        <div class="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-6 flex-wrap">
          <router-link to="/" class="hover:text-blue-600 transition">Início</router-link>
          <span>/</span>
          <router-link to="/explorar" class="hover:text-blue-600 transition">Explorar</router-link>
          <span>/</span>
          <router-link :to="`/explorar?cidade=${spot.cidade}`" class="hover:text-blue-600 transition">{{ spot.cidade }}</router-link>
          <span>/</span>
          <span class="text-gray-900 font-bold truncate">{{ spot.nome }}</span>
        </div>

        <!-- Imagem Principal -->
        <div
          @click="openLightbox(0)"
          class="relative mb-8 rounded-3xl overflow-hidden shadow-lg border border-gray-100 cursor-pointer group"
          title="Clique para ver fotos em tela cheia"
        >
          <img
            :src="mainImage"
            :alt="spot.nome"
            class="w-full h-[340px] md:h-[500px] object-cover group-hover:scale-105 transition duration-500"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></div>

          <!-- Overlay de clique para ampliar -->
          <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center pointer-events-none">
            <span class="bg-black/70 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 transform group-hover:scale-105 transition">
              <span>🔍</span>
              <span>Clique para ver galeria em tela cheia</span>
            </span>
          </div>

          <div class="absolute top-4 right-4 flex space-x-2 z-10">
            <button
              @click.stop="toggleFavorite"
              class="p-3.5 rounded-full backdrop-blur-md shadow-lg transition transform active:scale-90 hover:scale-110"
              :class="isFavorited ? 'bg-red-500 text-white shadow-red-500/50' : 'bg-white/90 text-gray-700 hover:bg-white'"
              :title="isFavorited ? 'Remover dos favoritos' : 'Salvar nos favoritos'"
            >
              <svg
                class="w-6 h-6"
                :class="isFavorited ? 'fill-current' : 'fill-none'"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
          <div class="absolute bottom-4 left-4 bg-black/65 backdrop-blur-md text-white text-xs uppercase px-3.5 py-1.5 rounded-xl font-bold tracking-wider z-10">
            {{ spot.categoria_display || spot.categoria || 'Turismo' }}
          </div>
        </div>

        <!-- Nome, Localização e Avaliação -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div class="flex items-center gap-3 flex-wrap">
              <h1 class="text-3xl md:text-4xl font-bold text-blue-950">{{ spot.nome }}</h1>
              
              <!-- Badge de Avaliação -->
              <div class="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                <span class="text-amber-500">★</span>
                <span>{{ reviewsData.media > 0 ? reviewsData.media.toFixed(1) : 'Novo' }}</span>
                <span class="text-xs text-amber-700 font-normal">({{ reviewsData.total }} {{ reviewsData.total === 1 ? 'avaliação' : 'avaliações' }})</span>
              </div>
            </div>

            <p class="text-gray-500 flex items-center gap-1.5 mt-2 text-sm font-medium">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ spot.cidade }} - Serra da Ibiapaba, Ceará
            </p>
          </div>

          <div class="flex items-center gap-2 flex-wrap">
            <!-- Botão de Favorito -->
            <button
              @click="toggleFavorite"
              class="font-medium px-4 py-2 rounded-xl text-sm transition flex items-center gap-2 border shadow-sm transform active:scale-95"
              :class="isFavorited ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'"
            >
              <span>{{ isFavorited ? '❤️ Salvo nos Favoritos' : '🤍 Salvar nos Favoritos' }}</span>
            </button>

            <!-- Botão de Enviar Fotos da Comunidade -->
            <button
              @click="openPhotoModal"
              class="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium px-4 py-2 rounded-xl text-sm transition flex items-center gap-1.5 border border-emerald-200 shadow-sm transform active:scale-95"
            >
              <span>📸</span>
              <span>Enviar Fotos</span>
            </button>

            <a
              v-if="spot.latitude && spot.longitude"
              :href="`https://www.google.com/maps?q=${spot.latitude},${spot.longitude}`"
              target="_blank"
              rel="noopener noreferrer"
              class="bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium px-4 py-2 rounded-xl text-sm transition flex items-center gap-2 border border-blue-100 shadow-sm"
            >
              <span>Ver no Google Maps</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Widget de Clima em Tempo Real na Cidade -->
        <div v-if="spot.cidade" class="mb-8">
          <WeatherWidget :city="spot.cidade" compact />
        </div>

        <!-- Descrição -->
        <div class="prose max-w-none text-gray-700 leading-relaxed mb-10">
          <p class="text-base md:text-lg whitespace-pre-line">{{ spot.descricao }}</p>
        </div>

        <!-- Galeria de Imagens com Swiper -->
        <div class="my-10 pt-8 border-t border-gray-100">
          <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <h2 class="text-xl font-bold text-gray-900">Galeria de Fotos</h2>
              <p class="text-xs text-gray-500">Fotos oficiais e enviadas por viajantes da comunidade</p>
            </div>
            <button
              @click="openPhotoModal"
              class="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-1.5 rounded-xl border border-emerald-200 transition flex items-center gap-1.5"
            >
              <span>📸</span>
              <span>Adicionar sua Foto</span>
            </button>
          </div>

          <div v-if="spot.imagens?.length > 1">
            <Swiper
              :modules="[Navigation, Pagination]"
              :space-between="16"
              :slides-per-view="1"
              :breakpoints="{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }"
              navigation
              pagination
              class="rounded-2xl"
            >
              <SwiperSlide
                v-for="(img, index) in spot.imagens"
                :key="index"
                @click="openLightbox(index)"
                class="overflow-hidden rounded-xl bg-gray-100 cursor-pointer group relative shadow-sm"
                title="Clique para ver em tela cheia"
              >
                <img
                  :src="getImageUrl(img.imagem)"
                  :alt="img.descricao || spot.nome"
                  class="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
                />
                <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-200 flex items-center justify-center pointer-events-none">
                  <span class="bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-md">
                    <span>🔍</span>
                    <span>Ampliar</span>
                  </span>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
          <div
            v-else-if="spot.imagens?.length === 1"
            @click="openLightbox(0)"
            class="rounded-2xl overflow-hidden max-h-96 cursor-pointer group relative shadow-sm"
            title="Clique para ver em tela cheia"
          >
            <img :src="getImageUrl(spot.imagens[0].imagem)" :alt="spot.nome" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
            <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition duration-200 flex items-center justify-center pointer-events-none">
              <span class="bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-md">
                <span>🔍</span>
                <span>Ampliar Foto</span>
              </span>
            </div>
          </div>
        </div>

        <!-- SEÇÃO DE AVALIAÇÕES E DICAS DA COMUNIDADE -->
        <div class="mt-12 pt-8 border-t border-gray-100">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Avaliações e Dicas de Viajantes</h2>
              <p class="text-sm text-gray-500">Experiências reais compartilhadas por quem já visitou este atrativo</p>
            </div>

            <!-- Resumo de Estrelas -->
            <div class="flex items-center gap-3 bg-blue-50/70 p-3 rounded-2xl border border-blue-100">
              <span class="text-3xl font-extrabold text-blue-900">{{ reviewsData.media > 0 ? reviewsData.media.toFixed(1) : '-' }}</span>
              <div>
                <div class="flex text-amber-400 text-base">
                  <span v-for="star in 5" :key="star">
                    {{ star <= Math.round(reviewsData.media) ? '★' : '☆' }}
                  </span>
                </div>
                <span class="text-xs text-gray-500">{{ reviewsData.total }} {{ reviewsData.total === 1 ? 'avaliação' : 'avaliações' }}</span>
              </div>
            </div>
          </div>

          <!-- Formulário de Avaliação (Usuário Logado) -->
          <div v-if="authStore.isAuthenticated" class="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl p-6 mb-8 border border-gray-200 shadow-sm">
            <h3 class="font-bold text-gray-900 text-lg mb-2">Deixe sua avaliação ou dica</h3>
            <p class="text-xs text-gray-500 mb-4">Ajude outros viajantes a planejarem o melhor passeio pela Ibiapaba</p>

            <form @submit.prevent="submitReview" class="space-y-4">
              <!-- Seletor de Estrelas Interativo -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Sua nota:</label>
                <div class="flex items-center gap-1.5">
                  <button
                    type="button"
                    v-for="star in 5"
                    :key="star"
                    @mouseover="hoverRating = star"
                    @mouseleave="hoverRating = 0"
                    @click="newReview.nota = star"
                    class="text-3xl transition-transform hover:scale-125 focus:outline-none"
                    :class="(hoverRating || newReview.nota) >= star ? 'text-amber-400' : 'text-gray-300'"
                    :title="`${star} estrelas`"
                  >
                    ★
                  </button>
                  <span class="text-sm font-medium text-gray-600 ml-2">
                    {{ newReview.nota ? `${newReview.nota} de 5 estrelas` : 'Selecione uma nota' }}
                  </span>
                </div>
              </div>

              <!-- Relato / Comentário -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">Seu relato / experiência:</label>
                <textarea
                  v-model="newReview.comentario"
                  rows="3"
                  required
                  placeholder="Conte como foi sua visita, trilha, banho de cachoeira ou atendimento..."
                  class="w-full rounded-xl border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>

              <!-- Dica do Viajante (Opcional) -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-1">
                  💡 Sua melhor dica para quem for visitar (opcional):
                </label>
                <input
                  v-model="newReview.dica"
                  type="text"
                  placeholder="Ex: Vá pela manhã cedo; leve repelente e sapatilha para pedras."
                  class="w-full rounded-xl border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div class="flex items-center justify-between pt-2">
                <div class="flex gap-3">
                  <button
                    type="submit"
                    :disabled="submittingReview || !newReview.nota || !newReview.comentario.trim()"
                    class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition shadow-sm"
                  >
                    <span v-if="submittingReview">Enviando...</span>
                    <span v-else>{{ userHasReview ? 'Atualizar Avaliação' : 'Publicar Avaliação' }}</span>
                  </button>

                  <button
                    v-if="userHasReview"
                    type="button"
                    @click="deleteUserReview"
                    :disabled="submittingReview"
                    class="text-red-600 hover:text-red-700 font-medium px-4 py-2.5 rounded-xl text-sm hover:bg-red-50 transition"
                  >
                    Excluir minha avaliação
                  </button>
                </div>

                <span v-if="reviewSuccessMsg" class="text-sm text-green-600 font-medium animate-fade-in">
                  {{ reviewSuccessMsg }}
                </span>
              </div>
            </form>
          </div>

          <!-- Convite para Login se não autenticado -->
          <div v-else class="bg-blue-50 rounded-2xl p-6 mb-8 text-center border border-blue-100">
            <h3 class="font-bold text-blue-900 text-base">Já visitou este lugar?</h3>
            <p class="text-sm text-blue-700 mt-1 mb-4">Entre na sua conta para deixar sua avaliação com estrelas e dicas úteis para a comunidade.</p>
            <router-link
              :to="`/login?redirect=${route.fullPath}`"
              class="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm transition"
            >
              Fazer login para avaliar
            </router-link>
          </div>

          <!-- Lista de Avaliações -->
          <div v-if="reviewsData.results?.length" class="space-y-4">
            <div
              v-for="item in reviewsData.results"
              :key="item.id"
              class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"
            >
              <div class="flex justify-between items-start mb-3">
                <div class="flex items-center gap-3">
                  <img
                    :src="item.usuario_foto || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'"
                    alt="Foto do usuário"
                    class="w-10 h-10 rounded-full object-cover bg-gray-100 border border-gray-200"
                  />
                  <div>
                    <h4 class="font-bold text-gray-900 text-sm">{{ item.usuario_nome }}</h4>
                    <span class="text-xs text-gray-400">{{ formatDate(item.data_criacao) }}</span>
                  </div>
                </div>

                <div class="flex text-amber-400 text-sm">
                  <span v-for="star in 5" :key="star">
                    {{ star <= item.nota ? '★' : '☆' }}
                  </span>
                </div>
              </div>

              <p class="text-sm text-gray-700 leading-relaxed mb-3 whitespace-pre-line">
                {{ item.comentario }}
              </p>

              <!-- Caixa de Dica de Viajante -->
              <div v-if="item.dica" class="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
                <span class="text-base shrink-0">💡</span>
                <div>
                  <strong class="font-semibold text-amber-950">Dica do Viajante:</strong> {{ item.dica }}
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-10 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p class="text-sm">Ainda não há avaliações para este atrativo.</p>
            <p class="text-xs text-gray-400 mt-1">Seja o primeiro a compartilhar sua experiência e dicas!</p>
          </div>
        </div>

        <!-- Sugestões de Outros Atrativos -->
        <div v-if="sugestoes.length" class="mt-12 pt-8 border-t border-gray-100">
          <h2 class="text-xl font-bold mb-6 text-gray-900">Você também pode gostar:</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="item in sugestoes"
              :key="item.id"
              class="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-md transition cursor-pointer border border-gray-100 group"
              @click="goToSpot(item.id)"
            >
              <img
                :src="getImageUrl(item.imagens?.[0]?.imagem, 'https://placehold.co/600x300?text=Sem+Imagem')"
                class="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
                :alt="item.nome"
              />
              <div class="p-4">
                <div class="flex items-center justify-between">
                  <h3 class="font-bold text-blue-900 truncate">{{ item.nome }}</h3>
                  <span v-if="item.media_avaliacoes > 0" class="text-xs font-bold text-amber-600 flex items-center gap-0.5">
                    ★ {{ item.media_avaliacoes.toFixed(1) }}
                  </span>
                </div>
                <p class="text-xs text-gray-500 mt-1">{{ item.cidade }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de Envio de Fotos da Comunidade -->
      <div
        v-if="showPhotoModal"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
          <!-- Fechar -->
          <button
            @click="closePhotoModal"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition"
          >
            ✕
          </button>

          <div class="text-center mb-6">
            <div class="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-2xl mx-auto mb-2">
              📸
            </div>
            <h3 class="text-xl font-bold text-gray-900">Enviar Fotos de {{ spot.nome }}</h3>
            <p class="text-xs text-gray-500 mt-1">
              Compartilhe seus registros reais com outros viajantes. As fotos passam por uma rápida moderação da equipe antes de serem publicadas.
            </p>
          </div>

          <!-- Alerta de Sucesso -->
          <div
            v-if="photoSuccessMsg"
            class="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-semibold text-center mb-4 leading-relaxed"
          >
            {{ photoSuccessMsg }}
          </div>

          <form v-else @submit.prevent="submitPhotoContribution" class="space-y-4">
            <!-- Input de Fotos -->
            <div class="border-2 border-dashed border-gray-200 hover:border-emerald-500 rounded-2xl p-6 text-center transition bg-gray-50/50">
              <input
                type="file"
                multiple
                accept="image/*"
                @change="handlePhotoSelect"
                id="modal-photo-upload"
                class="hidden"
              />
              <label for="modal-photo-upload" class="cursor-pointer block">
                <span class="text-3xl block mb-2">🌄</span>
                <span class="text-xs font-bold text-emerald-700 hover:underline block">
                  Escolher fotos do dispositivo
                </span>
                <span class="text-[11px] text-gray-400 mt-1 block">
                  PNG, JPG ou WEBP (Pode selecionar mais de uma)
                </span>
              </label>
            </div>

            <!-- Previews -->
            <div v-if="photoPreviews.length > 0" class="grid grid-cols-3 gap-2 mt-3">
              <div
                v-for="(p, idx) in photoPreviews"
                :key="idx"
                class="relative h-20 rounded-xl overflow-hidden border border-gray-200 bg-gray-100"
              >
                <img :src="p.url" alt="Preview" class="w-full h-full object-cover" />
                <button
                  type="button"
                  @click="removePhotoPreview(idx)"
                  class="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-[9px] shadow"
                >
                  ✕
                </button>
              </div>
            </div>

            <!-- Descrição / Legenda Opcional -->
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">
                Legenda ou Dica da Foto (Opcional)
              </label>
              <input
                v-model="photoCaption"
                type="text"
                placeholder="Ex: Foto tirada no mirante ao pôr do sol..."
                class="w-full rounded-xl border border-gray-200 p-2.5 text-xs bg-gray-50/50 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div class="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                @click="closePhotoModal"
                class="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="uploadingPhoto || photoFiles.length === 0"
                class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition disabled:opacity-50 flex items-center gap-1.5"
              >
                <span v-if="uploadingPhoto">⏳ Enviando...</span>
                <span v-else>🚀 Enviar Fotos</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Erro ou Não Encontrado -->
      <div v-else class="text-center py-16">
        <h3 class="text-lg font-bold text-gray-800">Atrativo não encontrado</h3>
        <router-link to="/explorar" class="text-blue-600 text-sm hover:underline mt-2 inline-block">
          Voltar para a lista de pontos turísticos
        </router-link>
      </div>
    </div>

    <!-- MODAL LIGHTBOX EM TELA CHEIA (GALERIA INTERATIVA) -->
    <Teleport to="body">
      <div
        v-if="lightboxOpen"
        class="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-6 animate-fade-in select-none"
        @click.self="closeLightbox"
      >
        <!-- Barra Superior: Contador, Nome e Fechar -->
        <div class="flex justify-between items-center text-white z-10">
          <div class="flex items-center gap-3">
            <span class="text-xs font-bold bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/10">
              📷 {{ currentLightboxIndex + 1 }} de {{ lightboxImages.length }}
            </span>
            <span class="text-sm font-semibold text-gray-200 hidden sm:inline">{{ spot.nome }}</span>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="closeLightbox"
              class="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition text-xs font-bold backdrop-blur-md border border-white/10 flex items-center gap-1"
              title="Fechar (Esc)"
            >
              <span>✕</span>
              <span>Fechar</span>
            </button>
          </div>
        </div>

        <!-- Centro: Imagem Grande & Setas de Navegação -->
        <div class="flex-1 flex items-center justify-center relative my-3">
          <!-- Botão Anterior -->
          <button
            v-if="lightboxImages.length > 1"
            @click="prevLightbox"
            class="absolute left-2 md:left-6 z-10 p-3 md:p-4 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/15 transition transform hover:scale-110 active:scale-95 shadow-2xl text-2xl leading-none"
            title="Foto anterior (Seta Esquerda)"
          >
            ‹
          </button>

          <!-- Imagem Principal Ampliada -->
          <div class="max-w-5xl max-h-[75vh] flex flex-col items-center justify-center relative">
            <img
              :src="getImageUrl(currentLightboxImage?.imagem)"
              :alt="currentLightboxImage?.descricao || spot.nome"
              class="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl transition duration-300 transform select-none"
            />
            <div
              v-if="currentLightboxImage?.descricao || currentLightboxImage?.enviado_por_nome"
              class="text-white/90 text-center text-xs md:text-sm mt-3 bg-black/70 px-4 py-2 rounded-xl backdrop-blur-sm max-w-2xl border border-white/10"
            >
              <p v-if="currentLightboxImage?.descricao" class="font-medium">"{{ currentLightboxImage.descricao }}"</p>
              <p v-if="currentLightboxImage?.enviado_por_nome" class="text-[11px] text-gray-400 mt-0.5">
                Foto por: {{ currentLightboxImage.enviado_por_nome }}
              </p>
            </div>
          </div>

          <!-- Botão Próximo -->
          <button
            v-if="lightboxImages.length > 1"
            @click="nextLightbox"
            class="absolute right-2 md:right-6 z-10 p-3 md:p-4 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/15 transition transform hover:scale-110 active:scale-95 shadow-2xl text-2xl leading-none"
            title="Próxima foto (Seta Direita)"
          >
            ›
          </button>
        </div>

        <!-- Barra Inferior: Fita de Miniaturas -->
        <div v-if="lightboxImages.length > 1" class="flex justify-center items-center gap-2 overflow-x-auto py-2 z-10 max-w-2xl mx-auto px-4">
          <button
            v-for="(img, idx) in lightboxImages"
            :key="idx"
            @click="currentLightboxIndex = idx"
            class="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden border-2 transition shrink-0 transform"
            :class="currentLightboxIndex === idx ? 'border-white scale-110 shadow-lg ring-2 ring-blue-500' : 'border-transparent opacity-40 hover:opacity-100'"
          >
            <img :src="getImageUrl(img.imagem)" alt="Miniatura" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useFavoritesStore } from '../stores/favorites'
import spotsService from '../services/spotsService'
import reviewsService from '../services/reviewsService'
import WeatherWidget from '../components/WeatherWidget.vue'
import { getImageUrl } from '../utils/imageHelper'

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const favoritesStore = useFavoritesStore()

const spot = ref({})
const sugestoes = ref([])
const loading = ref(true)

// Envio de Fotos da Comunidade
const showPhotoModal = ref(false)
const photoFiles = ref([])
const photoPreviews = ref([])
const photoCaption = ref('')
const uploadingPhoto = ref(false)
const photoSuccessMsg = ref('')

const openPhotoModal = () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'Login', query: { redirect: route.fullPath } })
    return
  }
  photoFiles.value = []
  photoPreviews.value = []
  photoCaption.value = ''
  photoSuccessMsg.value = ''
  showPhotoModal.value = true
}

const closePhotoModal = () => {
  showPhotoModal.value = false
}

const handlePhotoSelect = (e) => {
  const files = Array.from(e.target.files || [])
  files.forEach((file) => {
    photoFiles.value.push(file)
    photoPreviews.value.push({
      file,
      url: URL.createObjectURL(file),
    })
  })
}

const removePhotoPreview = (idx) => {
  photoFiles.value.splice(idx, 1)
  photoPreviews.value.splice(idx, 1)
}

const submitPhotoContribution = async () => {
  if (!photoFiles.value.length) return

  uploadingPhoto.value = true
  try {
    const formData = new FormData()
    if (photoFiles.value.length === 1) {
      formData.append('imagem', photoFiles.value[0])
    } else {
      photoFiles.value.forEach((file) => {
        formData.append('imagens', file)
      })
    }
    if (photoCaption.value.trim()) {
      formData.append('descricao', photoCaption.value.trim())
    }

    await spotsService.contributePhoto(spot.value.id, formData)
    photoSuccessMsg.value = 'Foto enviada com sucesso! Ela foi recebida pela nossa equipe de moderação e em breve estará na galeria oficial deste atrativo.'
    setTimeout(() => {
      closePhotoModal()
    }, 4000)
  } catch (err) {
    console.error('Erro ao enviar fotos:', err)
    alert(err.response?.data?.detail || 'Erro ao enviar fotos. Tente novamente.')
  } finally {
    uploadingPhoto.value = false
  }
}

const isFavorited = computed(() => favoritesStore.isFavorited(spot.value.id))

const toggleFavorite = async () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'Login', query: { redirect: route.fullPath } })
    return
  }
  await favoritesStore.toggleFavorite(spot.value.id)
}

// Avaliações
const reviewsData = ref({ media: 0, total: 0, results: [] })
const hoverRating = ref(0)
const submittingReview = ref(false)
const reviewSuccessMsg = ref('')
const newReview = ref({
  nota: 5,
  comentario: '',
  dica: '',
})

const userHasReview = computed(() => {
  if (!authStore.isAuthenticated || !reviewsData.value.results?.length) return false
  return reviewsData.value.results.some((r) => r.usuario_nome === authStore.userName)
})

const mainImage = computed(() => {
  const raw = spot.value.imagens?.[0]?.imagem
  return getImageUrl(raw, 'https://placehold.co/800x500?text=Sem+Imagem')
})

const formatDate = (isoString) => {
  if (!isoString) return ''
  const d = new Date(isoString)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const loadReviews = async (spotId) => {
  try {
    const data = await reviewsService.getReviews(spotId)
    reviewsData.value = data

    // Preenche os campos se o usuário já tiver avaliado
    const existing = data.results?.find((r) => r.usuario_nome === authStore.userName)
    if (existing) {
      newReview.value.nota = existing.nota
      newReview.value.comentario = existing.comentario
      newReview.value.dica = existing.dica || ''
    }
  } catch (err) {
    console.warn('Erro ao carregar avaliações:', err)
  }
}

const submitReview = async () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'Login', query: { redirect: route.fullPath } })
    return
  }

  submittingReview.value = true
  reviewSuccessMsg.value = ''

  try {
    await reviewsService.saveReview(spot.value.id, newReview.value)
    reviewSuccessMsg.value = 'Avaliação publicada com sucesso!'
    await loadReviews(spot.value.id)
    setTimeout(() => {
      reviewSuccessMsg.value = ''
    }, 4000)
  } catch (err) {
    console.error('Erro ao enviar avaliação:', err)
    alert(err.response?.data?.detail || 'Erro ao publicar avaliação.')
  } finally {
    submittingReview.value = false
  }
}

const deleteUserReview = async () => {
  if (!confirm('Deseja realmente remover sua avaliação?')) return

  submittingReview.value = true
  try {
    await reviewsService.deleteReview(spot.value.id)
    newReview.value = { nota: 5, comentario: '', dica: '' }
    await loadReviews(spot.value.id)
  } catch (err) {
    console.error('Erro ao remover avaliação:', err)
  } finally {
    submittingReview.value = false
  }
}

const fetchSpotData = async () => {
  loading.value = true
  try {
    const spotId = route.params.id
    const data = await spotsService.getSpotById(spotId)
    spot.value = data

    // Sugestões
    const allData = await spotsService.getSpots()
    const list = allData.results || allData || []
    sugestoes.value = list.filter((s) => s.id !== spotId).slice(0, 3)

    await loadReviews(spotId)
  } catch (err) {
    console.error('Erro ao carregar detalhes do ponto:', err)
    spot.value = {}
  } finally {
    loading.value = false
  }
}

const goToSpot = (id) => {
  router.push(`/pontos/${id}`)
}

// Lightbox (Galeria em Tela Cheia)
const lightboxOpen = ref(false)
const currentLightboxIndex = ref(0)

const lightboxImages = computed(() => {
  if (spot.value?.imagens?.length > 0) {
    return spot.value.imagens
  }
  if (mainImage.value) {
    return [{ imagem: mainImage.value, descricao: spot.value?.nome }]
  }
  return []
})

const currentLightboxImage = computed(() => {
  return lightboxImages.value[currentLightboxIndex.value] || lightboxImages.value[0] || {}
})

const openLightbox = (index = 0) => {
  if (lightboxImages.value.length === 0) return
  currentLightboxIndex.value = Math.max(0, Math.min(index, lightboxImages.value.length - 1))
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

const nextLightbox = () => {
  if (lightboxImages.value.length <= 1) return
  if (currentLightboxIndex.value < lightboxImages.value.length - 1) {
    currentLightboxIndex.value++
  } else {
    currentLightboxIndex.value = 0
  }
}

const prevLightbox = () => {
  if (lightboxImages.value.length <= 1) return
  if (currentLightboxIndex.value > 0) {
    currentLightboxIndex.value--
  } else {
    currentLightboxIndex.value = lightboxImages.value.length - 1
  }
}

const handleKeydown = (e) => {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowRight') nextLightbox()
  if (e.key === 'ArrowLeft') prevLightbox()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})

watch(() => route.params.id, fetchSpotData, { immediate: true })
</script>