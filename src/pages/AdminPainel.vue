<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
    <div class="max-w-7xl mx-auto">
      <!-- Cabeçalho do Painel -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-3xl font-extrabold text-blue-950">Painel de Gestão de Atrativos</h1>
            <span class="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Administrador
            </span>
          </div>
          <p class="text-gray-500 text-sm mt-1">
            Cadastre, edite fotos e gerencie todos os pontos turísticos da Serra da Ibiapaba
          </p>
        </div>

        <button
          @click="openCreateModal"
          class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition flex items-center gap-2 text-sm"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Novo Atrativo Turístico
        </button>
      </div>

      <!-- Métricas / Cards de Resumo -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div
          @click="selectStatusFilter('')"
          class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:border-blue-400 transition"
          :class="!selectedStatus ? 'ring-2 ring-blue-500' : ''"
        >
          <p class="text-xs text-gray-500 font-semibold uppercase">Total de Atrativos</p>
          <p class="text-3xl font-bold text-blue-950 mt-1">{{ statsData.total_atrativos || totalSpots }}</p>
        </div>

        <div
          @click="selectStatusFilter('pendente')"
          class="bg-amber-50 p-5 rounded-2xl border border-amber-200 shadow-sm cursor-pointer hover:border-amber-400 transition relative"
          :class="selectedStatus === 'pendente' ? 'ring-2 ring-amber-500' : ''"
        >
          <span v-if="statsData.total_pendentes > 0" class="absolute top-3 right-3 flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
          </span>
          <p class="text-xs text-amber-800 font-bold uppercase">🟡 Pendentes de Aprovação</p>
          <p class="text-3xl font-extrabold text-amber-900 mt-1">{{ statsData.total_pendentes || 0 }}</p>
        </div>

        <div
          @click="selectStatusFilter('aprovado')"
          class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:border-emerald-400 transition"
          :class="selectedStatus === 'aprovado' ? 'ring-2 ring-emerald-500' : ''"
        >
          <p class="text-xs text-gray-500 font-semibold uppercase">Publicados (Aprovados)</p>
          <p class="text-3xl font-bold text-emerald-600 mt-1">{{ statsData.total_aprovados || 0 }}</p>
        </div>

        <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <p class="text-xs text-gray-500 font-semibold uppercase">Cidades Atendidas</p>
          <p class="text-3xl font-bold text-blue-600 mt-1">{{ cidadesList.length }}</p>
        </div>
      </div>

      <!-- Abas Rápidas de Moderação -->
      <div class="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <button
          @click="setMainTab('spots', '')"
          class="px-4 py-2 rounded-xl text-xs font-bold transition shrink-0"
          :class="mainTab === 'spots' && !selectedStatus ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'"
        >
          Todos os Atrativos ({{ statsData.total_atrativos || totalSpots }})
        </button>
        <button
          @click="setMainTab('spots', 'pendente')"
          class="px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5"
          :class="mainTab === 'spots' && selectedStatus === 'pendente' ? 'bg-amber-600 text-white shadow-sm' : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-200'"
        >
          <span>🟡</span>
          <span>Atrativos Pendentes ({{ statsData.total_pendentes || 0 }})</span>
        </button>
        <button
          @click="setMainTab('photos')"
          class="px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5 relative"
          :class="mainTab === 'photos' ? 'bg-purple-600 text-white shadow-sm' : 'bg-white text-purple-800 hover:bg-purple-50 border border-purple-200'"
        >
          <span>📸</span>
          <span>Fotos da Comunidade ({{ statsData.total_fotos_pendentes || 0 }} pendentes)</span>
          <span v-if="statsData.total_fotos_pendentes > 0" class="w-2 h-2 rounded-full bg-amber-400 animate-ping ml-1"></span>
        </button>
        <button
          @click="setMainTab('spots', 'aprovado')"
          class="px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5"
          :class="mainTab === 'spots' && selectedStatus === 'aprovado' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-200'"
        >
          <span>✅</span>
          <span>Aprovados ({{ statsData.total_aprovados || 0 }})</span>
        </button>
        <button
          @click="setMainTab('spots', 'rejeitado')"
          class="px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5"
          :class="mainTab === 'spots' && selectedStatus === 'rejeitado' ? 'bg-red-600 text-white shadow-sm' : 'bg-white text-red-800 hover:bg-red-50 border border-red-200'"
        >
          <span>❌</span>
          <span>Rejeitados ({{ statsData.total_rejeitados || 0 }})</span>
        </button>
        <button
          @click="setMainTab('users')"
          class="px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5"
          :class="mainTab === 'users' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-indigo-800 hover:bg-indigo-50 border border-indigo-200'"
        >
          <span>👥</span>
          <span>Usuários Cadastrados ({{ users.length }})</span>
        </button>
        <button
          @click="setMainTab('reviews')"
          class="px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5"
          :class="mainTab === 'reviews' ? 'bg-pink-600 text-white shadow-sm' : 'bg-white text-pink-800 hover:bg-pink-50 border border-pink-200'"
        >
          <span>⭐</span>
          <span>Moderação de Avaliações</span>
        </button>
        <button
          @click="setMainTab('dashboard')"
          class="px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5"
          :class="mainTab === 'dashboard' ? 'bg-sky-600 text-white shadow-sm' : 'bg-white text-sky-800 hover:bg-sky-50 border border-sky-200'"
        >
          <span>📊</span>
          <span>Dashboard Visual</span>
        </button>
      </div>

      <!-- ABA DE FOTOS DA COMUNIDADE (MODERAÇÃO DE IMAGENS) -->
      <div v-if="mainTab === 'photos'" class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-12">
        <div class="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 flex-wrap gap-3">
          <div>
            <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span>📸</span>
              <span>Moderação de Fotos da Comunidade</span>
            </h2>
            <p class="text-xs text-gray-500 mt-0.5">
              Revise e aprove fotos reais enviadas por turistas para galerias de pontos turísticos existentes.
            </p>
          </div>
          <button
            @click="fetchPendingImages"
            class="text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 px-3.5 py-2 rounded-xl transition flex items-center gap-1"
          >
            <span>🔄</span>
            <span>Atualizar Fotos</span>
          </button>
        </div>

        <div v-if="loadingPhotos" class="flex flex-col items-center justify-center py-16">
          <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-600"></div>
          <p class="mt-3 text-xs text-gray-400">Carregando fotos pendentes...</p>
        </div>

        <div v-else-if="pendingImages.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="p in pendingImages"
            :key="p.id"
            class="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              <div class="relative h-48 bg-gray-200">
                <img :src="getImageUrl(p.imagem)" :alt="p.descricao || 'Foto pendente'" class="w-full h-full object-cover" />
                <span class="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
                  🟡 Aguardando Aprovação
                </span>
              </div>

              <div class="p-4">
                <div class="mb-2">
                  <span class="text-[11px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-md inline-block">
                    📍 {{ p.ponto_turistico_nome }} ({{ p.ponto_turistico_cidade }})
                  </span>
                </div>
                <p v-if="p.descricao" class="text-xs text-gray-800 font-medium line-clamp-2 italic mb-2">
                  "{{ p.descricao }}"
                </p>
                <div class="text-[11px] text-gray-400 space-y-0.5">
                  <p>Enviada por: <strong class="text-gray-600">{{ p.enviado_por_nome || p.enviado_por_email || 'Visitante' }}</strong></p>
                </div>
              </div>
            </div>

            <div class="p-4 pt-2 border-t border-gray-200/60 flex items-center gap-2">
              <button
                @click="approveCommunityPhoto(p)"
                class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl text-xs shadow-sm transition flex items-center justify-center gap-1"
              >
                <span>✓</span>
                <span>Aprovar Foto</span>
              </button>
              <button
                @click="rejectCommunityPhoto(p)"
                class="bg-red-50 hover:bg-red-100 text-red-700 font-bold py-2 px-3 rounded-xl text-xs transition"
                title="Excluir Foto"
              >
                ✕ Excluir
              </button>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-16 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
          <div class="text-4xl mb-2">✨📸</div>
          <h4 class="text-base font-bold text-gray-800">Nenhuma foto pendente de moderação</h4>
          <p class="text-xs text-gray-400 mt-1">Todas as fotos enviadas pelos visitantes já foram revisadas e publicadas!</p>
        </div>
      </div>

      <!-- ABA DE GESTÃO DE USUÁRIOS -->
      <div v-if="mainTab === 'users'" class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-12">
        <div class="p-6 sm:p-8 border-b border-gray-100">
          <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>👥</span>
            <span>Usuários Cadastrados</span>
          </h2>
          <p class="text-xs text-gray-500 mt-0.5">
            Visualize todos os usuários registrados, incluindo nível de acesso e geração de roteiros IA.
          </p>
        </div>

        <div v-if="loadingUsers" class="flex flex-col items-center justify-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p class="mt-4 text-gray-500 text-sm font-medium">Carregando usuários...</p>
        </div>

        <div v-else-if="users.length" class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100 text-xs uppercase font-bold text-gray-500 tracking-wider">
                <th class="py-4 px-6">Usuário</th>
                <th class="py-4 px-6">E-mail</th>
                <th class="py-4 px-6">Nível de Acesso</th>
                <th class="py-4 px-6">Roteiros Hoje</th>
                <th class="py-4 px-6 text-right">Cadastrado em</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-sm text-gray-700">
              <tr v-for="u in users" :key="u.id" class="hover:bg-indigo-50/40 transition">
                <td class="py-4 px-6">
                  <div class="flex items-center gap-3">
                    <img
                      :src="u.foto || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'"
                      alt="Foto"
                      class="w-10 h-10 rounded-full object-cover border border-gray-200 bg-gray-100 shrink-0"
                    />
                    <span class="font-bold text-gray-900 block truncate max-w-xs">{{ u.nome || 'Usuário' }}</span>
                  </div>
                </td>
                <td class="py-4 px-6 font-medium text-gray-600">{{ u.email }}</td>
                <td class="py-4 px-6">
                  <span
                    class="text-xs font-semibold px-2.5 py-1 rounded-lg inline-block"
                    :class="(u.is_staff || u.is_superuser) ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-700'"
                  >
                    {{ (u.is_staff || u.is_superuser) ? 'Administrador' : 'Comum' }}
                  </span>
                </td>
                <td class="py-4 px-6">
                  <div class="flex items-center gap-2">
                    <span class="font-bold text-gray-800">{{ u.rotas_geradas_hoje || 0 }}</span>
                    <span class="text-xs text-gray-400">/ 2 max</span>
                  </div>
                </td>
                <td class="py-4 px-6 text-right text-gray-500 text-xs">
                  {{ new Date(u.data_criacao).toLocaleDateString('pt-BR') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ABA DE AVALIAÇÕES -->
      <div v-if="mainTab === 'reviews'" class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-12">
        <div class="p-6 sm:p-8 border-b border-gray-100">
          <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>⭐</span>
            <span>Moderação de Avaliações</span>
          </h2>
          <p class="text-xs text-gray-500 mt-0.5">Visualize e exclua comentários ou dicas inadequadas postadas pelos turistas.</p>
        </div>
        <div v-if="loadingReviews" class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
        </div>
        <div v-else-if="reviews.length" class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100 text-xs uppercase font-bold text-gray-500 tracking-wider">
                <th class="py-4 px-6">Usuário</th>
                <th class="py-4 px-6">Atrativo</th>
                <th class="py-4 px-6">Avaliação / Dica</th>
                <th class="py-4 px-6 text-center">Nota</th>
                <th class="py-4 px-6 text-right">Ação</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-sm text-gray-700">
              <tr v-for="r in reviews" :key="r.id" class="hover:bg-pink-50/40 transition">
                <td class="py-4 px-6 font-medium">{{ r.usuario_nome }}<br><span class="text-xs text-gray-400">{{ r.usuario_email }}</span></td>
                <td class="py-4 px-6"><span class="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-1 rounded">{{ r.ponto_turistico_nome }}</span></td>
                <td class="py-4 px-6 max-w-xs">
                  <p class="font-semibold text-gray-800 text-xs mb-1">"{{ r.comentario }}"</p>
                  <p v-if="r.dica" class="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">💡 {{ r.dica }}</p>
                </td>
                <td class="py-4 px-6 text-center font-bold text-amber-500">{{ r.nota }} ⭐</td>
                <td class="py-4 px-6 text-right">
                  <button @click="deleteReview(r)" class="text-red-500 hover:text-red-700 text-xs font-bold px-3 py-1.5 border border-red-200 rounded-lg hover:bg-red-50 transition">Excluir</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center py-16 text-gray-400">Nenhuma avaliação encontrada.</div>
      </div>

      <!-- ABA DASHBOARD -->
      <div v-if="mainTab === 'dashboard'" class="mb-12">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Atrativos por Categoria</h3>
            <div class="h-64 relative w-full">
              <Doughnut v-if="spots.length" :data="chartDataCategories" :options="chartOptions" />
              <div v-else class="flex items-center justify-center h-full text-gray-400 text-sm">Carregando dados...</div>
            </div>
          </div>
          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <h3 class="text-lg font-bold text-gray-800 mb-4">Atrativos por Cidade</h3>
            <div class="h-64 relative w-full">
              <Bar v-if="spots.length" :data="chartDataCities" :options="chartOptions" />
              <div v-else class="flex items-center justify-center h-full text-gray-400 text-sm">Carregando dados...</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ABA DE GESTÃO DE ATRATIVOS -->
      <div v-if="mainTab === 'spots'">
        <!-- Filtros e Barra de Pesquisa -->
        <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-600 uppercase mb-1">Buscar por nome ou descrição</label>
              <input
                v-model="searchTerm"
                @input="debouncedSearch"
                type="text"
                placeholder="Ex: Ubajara, Bica, Cachoeira..."
                class="w-full rounded-xl border border-gray-200 p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-600 uppercase mb-1">Filtrar por Cidade</label>
              <select
                v-model="selectedCity"
                @change="onFilterChange"
                class="w-full rounded-xl border border-gray-200 p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Todas as Cidades</option>
                <option v-for="c in cidadesList" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-600 uppercase mb-1">Filtrar por Categoria</label>
              <select
                v-model="selectedCategory"
                @change="onFilterChange"
                class="w-full rounded-xl border border-gray-200 p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="">Todas as Categorias</option>
                <option v-for="cat in categoriasList" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-600 uppercase mb-1">Itens por Página</label>
              <select
                v-model="pageSize"
                @change="onPageSizeChange"
                class="w-full rounded-xl border border-gray-200 p-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option :value="10">10 itens por página</option>
                <option :value="20">20 itens por página</option>
                <option :value="50">50 itens por página</option>
                <option :value="100">100 itens (Ver todos)</option>
              </select>
            </div>
          </div>
        </div>

      <!-- Tabela de Atrativos -->
      <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-12">
        <div v-if="loading" class="flex flex-col items-center justify-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-500 text-sm font-medium">Carregando atrativos...</p>
        </div>

        <div v-else-if="spots.length" class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50 border-b border-gray-100 text-xs uppercase font-bold text-gray-500 tracking-wider">
                <th class="py-4 px-6">Atrativo</th>
                <th class="py-4 px-6">Cidade</th>
                <th class="py-4 px-6">Categoria</th>
                <th class="py-4 px-6">Status</th>
                <th class="py-4 px-6">Autor / Fotos</th>
                <th class="py-4 px-6 text-right">Ações de Moderação</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-sm text-gray-700">
              <tr v-for="s in spots" :key="s.id" class="hover:bg-blue-50/40 transition">
                <td class="py-4 px-6">
                  <div class="flex items-center gap-3">
                    <img
                      :src="getImageUrl(s.imagens?.[0]?.imagem, 'https://placehold.co/100x100?text=Sem+Foto')"
                      alt="Foto"
                      class="w-12 h-12 rounded-xl object-cover border border-gray-200 bg-gray-100 shrink-0"
                    />
                    <div>
                      <span class="font-bold text-gray-900 block truncate max-w-xs">{{ s.nome }}</span>
                      <span class="text-xs text-gray-400 font-mono">{{ s.latitude }}, {{ s.longitude }}</span>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-6 font-medium text-gray-800">{{ s.cidade }}</td>
                <td class="py-4 px-6">
                  <span
                    class="text-xs font-semibold px-2.5 py-1 rounded-lg inline-block"
                    :class="categoryBadge(s.categoria)"
                  >
                    {{ s.categoria_display || s.categoria }}
                  </span>
                </td>
                <td class="py-4 px-6">
                  <span
                    class="text-xs px-2.5 py-1 rounded-full inline-block"
                    :class="statusBadge(s.status)"
                  >
                    {{ s.status === 'pendente' ? '🟡 Pendente' : s.status === 'rejeitado' ? '❌ Rejeitado' : '✅ Aprovado' }}
                  </span>
                </td>
                <td class="py-4 px-6 text-xs text-gray-500">
                  <p class="font-semibold text-gray-800 truncate max-w-[140px]">
                    {{ s.criado_por_nome || s.criado_por_email || 'Equipe Oficial' }}
                  </p>
                  <p class="text-gray-400">{{ s.imagens?.length || 0 }} foto(s)</p>
                </td>
                <td class="py-4 px-6 text-right space-x-1">
                  <!-- Botões de Aprovação Rápida se estiver pendente -->
                  <template v-if="s.status === 'pendente'">
                    <button
                      @click="approveSpot(s)"
                      class="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
                      title="Aprovar e Publicar no Guia"
                    >
                      ✓ Aprovar
                    </button>
                    <button
                      @click="rejectSpot(s)"
                      class="px-2.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 rounded-xl text-xs font-bold transition"
                      title="Rejeitar Sugestão"
                    >
                      ✕ Rejeitar
                    </button>
                  </template>

                  <button
                    @click="openImagesModal(s)"
                    class="p-2 text-purple-600 hover:bg-purple-50 rounded-xl transition"
                    title="Gerenciar Fotos"
                  >
                    📸
                  </button>
                  <button
                    @click="openEditModal(s)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition"
                    title="Editar Informações"
                  >
                    ✏️
                  </button>
                  <button
                    @click="confirmDeleteSpot(s)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-xl transition"
                    title="Excluir Atrativo"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- BARRA DE PAGINAÇÃO COMPLETA -->
          <div class="px-6 py-4 bg-gray-50/80 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div class="text-xs text-gray-500 font-medium">
              Mostrando <strong class="text-gray-800">{{ showingFrom }}</strong> a <strong class="text-gray-800">{{ showingTo }}</strong> de <strong class="text-gray-800">{{ totalSpots }}</strong> atrativos
              <span v-if="totalPages > 1" class="text-gray-400 ml-1">(Página {{ currentPage }} de {{ totalPages }})</span>
            </div>

            <div v-if="totalPages > 1" class="flex items-center gap-1.5 flex-wrap justify-center">
              <!-- Botão Anterior -->
              <button
                @click="goToPage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                ← Anterior
              </button>

              <!-- Números das Páginas -->
              <button
                v-for="p in visiblePages"
                :key="p"
                @click="p !== '...' && goToPage(p)"
                :disabled="p === '...'"
                class="min-w-[32px] h-8 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center"
                :class="p === currentPage ? 'bg-blue-600 text-white shadow-sm' : p === '...' ? 'text-gray-400 cursor-default' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'"
              >
                {{ p }}
              </button>

              <!-- Botão Próximo -->
              <button
                @click="goToPage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Próximo →
              </button>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-16 text-gray-500">
          <p class="text-lg font-bold">Nenhum ponto turístico encontrado</p>
          <p class="text-sm text-gray-400 mt-1">Tente ajustar os filtros ou cadastre um novo atrativo.</p>
        </div>
      </div>
    </div>
  </div>

    <!-- MODAL DE CRIAÇÃO / EDIÇÃO DE ATRATIVO -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
    >
      <div class="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center pb-4 mb-6 border-b border-gray-100">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ isEditing ? 'Editar Atrativo Turístico' : 'Cadastrar Novo Atrativo' }}
          </h2>
          <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600 text-2xl font-bold">
            ✕
          </button>
        </div>

        <form @submit.prevent="saveSpot" class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Nome do Atrativo *</label>
            <input
              v-model="formSpot.nome"
              type="text"
              required
              placeholder="Ex: Mirante do Céu"
              class="w-full rounded-xl border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Cidade *</label>
              <select
                v-model="formSpot.cidade"
                @change="onCityChange"
                required
                class="w-full rounded-xl border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option v-for="c in cidadesList" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Categoria *</label>
              <select
                v-model="formSpot.categoria"
                required
                class="w-full rounded-xl border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option v-for="cat in categoriasList" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
              </select>
            </div>

            <div v-if="isEditing">
              <label class="block text-sm font-semibold text-gray-700 mb-1">Status (Visibilidade) *</label>
              <select
                v-model="formSpot.status"
                required
                class="w-full rounded-xl border border-gray-300 p-2.5 text-sm font-semibold focus:ring-2 focus:ring-blue-500 bg-white"
                :class="formSpot.status === 'aprovado' ? 'text-emerald-700' : 'text-red-700'"
              >
                <option value="aprovado">🟢 Ativo (Aprovado)</option>
                <option value="rejeitado">🔴 Inativo (Rejeitado/Desativado)</option>
                <option value="pendente">🟡 Pendente (Revisão)</option>
              </select>
            </div>
          </div>

          <!-- MAPA INTERATIVO PARA AJUSTAR PINO DE LOCALIZAÇÃO -->
          <div class="pt-2">
            <div class="flex justify-between items-center mb-1.5">
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                📍 Posição no Mapa (Clique ou arraste o pino para ajustar o local exato)
              </label>
              <span class="text-[11px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                GPS Interativo
              </span>
            </div>
            <div
              id="admin-map"
              class="w-full h-60 rounded-2xl border border-gray-300 overflow-hidden shadow-inner relative z-0"
            ></div>
            <p class="text-[11px] text-gray-500 mt-1.5">
              💡 Arraste o marcador ou clique em qualquer ponto do mapa para atualizar as coordenadas automaticamente.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Latitude (Decimal) *</label>
              <input
                v-model="formSpot.latitude"
                @input="updateMarkerFromInputs"
                type="text"
                required
                placeholder="Ex: -3.582000"
                class="w-full rounded-xl border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1">Longitude (Decimal) *</label>
              <input
                v-model="formSpot.longitude"
                @input="updateMarkerFromInputs"
                type="text"
                required
                placeholder="Ex: -41.115000"
                class="w-full rounded-xl border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Descrição Completa *</label>
            <textarea
              v-model="formSpot.descricao"
              rows="4"
              required
              placeholder="Descreva a história, acessibilidade, trilhas e atrações do local..."
              class="w-full rounded-xl border border-gray-300 p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              @click="showEditModal = false"
              class="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition shadow-sm"
            >
              <span v-if="saving">Salvando...</span>
              <span v-else>{{ isEditing ? 'Salvar Alterações' : 'Criar Atrativo' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL DE GERENCIAMENTO DE FOTOS -->
    <div
      v-if="showImagesModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
    >
      <div class="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center pb-4 mb-6 border-b border-gray-100">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Fotos: {{ activeSpot?.nome }}</h2>
            <p class="text-xs text-gray-500">{{ activeSpot?.cidade }}</p>
          </div>
          <button @click="showImagesModal = false" class="text-gray-400 hover:text-gray-600 text-2xl font-bold">
            ✕
          </button>
        </div>

        <!-- Upload de Nova Imagem -->
        <div class="bg-blue-50/50 border border-dashed border-blue-300 rounded-2xl p-6 text-center mb-6">
          <input
            type="file"
            ref="fileInput"
            @change="handleFileUpload"
            accept="image/*"
            class="hidden"
            id="file-upload"
          />
          <label for="file-upload" class="cursor-pointer flex flex-col items-center">
            <span class="text-3xl mb-2">📸</span>
            <span class="text-sm font-bold text-blue-900">Adicionar Nova Foto</span>
            <span class="text-xs text-blue-600 mt-1">Clique para selecionar imagem JPEG, PNG ou WebP</span>
          </label>
          <div v-if="uploading" class="mt-3 text-xs font-bold text-blue-700 animate-pulse">
            Enviando foto para o servidor...
          </div>
        </div>

        <!-- Galeria de Fotos Atuais -->
        <div v-if="activeSpot?.imagens?.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="img in activeSpot.imagens"
            :key="img.id"
            class="relative rounded-2xl overflow-hidden border border-gray-200 group bg-gray-100 flex flex-col"
          >
            <div class="relative h-36">
              <img :src="getImageUrl(img.imagem)" alt="Foto" class="w-full h-full object-cover" />
              <!-- Status Badge -->
              <span
                class="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full shadow"
                :class="img.status === 'pendente' ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white'"
              >
                {{ img.status === 'pendente' ? '🟡 Pendente' : '✅ Aprovada' }}
              </span>

              <!-- Excluir Imagem -->
              <button
                @click="deleteImage(img.id)"
                class="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs shadow-md transition"
                title="Excluir Imagem"
              >
                🗑️
              </button>
            </div>

            <div class="p-3 bg-white flex flex-col justify-between flex-1">
              <p class="text-xs text-gray-700 truncate font-medium">
                {{ img.descricao || 'Foto do atrativo' }}
              </p>
              <p v-if="img.enviado_por_nome || img.enviado_por_email" class="text-[10px] text-gray-400 mt-1 truncate">
                Enviada por: {{ img.enviado_por_nome || img.enviado_por_email }}
              </p>

              <!-- Botão de Aprovação se Pendente -->
              <div v-if="img.status === 'pendente'" class="mt-2 pt-2 border-t border-gray-100 flex justify-end">
                <button
                  @click="approveImage(img.id)"
                  class="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 px-3 rounded-xl transition shadow-sm flex items-center justify-center gap-1"
                >
                  <span>✓</span>
                  <span>Aprovar Foto</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8 text-gray-400 text-sm">
          Nenhuma foto vinculada a este atrativo.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import spotsService from '../services/spotsService'
import { apiPrivate } from '../services/api'
import { getImageUrl } from '../utils/imageHelper'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'
import { Bar, Doughnut } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

// Corrige ícone padrão do Leaflet no Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const router = useRouter()
const authStore = useAuthStore()

const CITY_COORDS = {
  'Ubajara': [-3.8547, -40.9239],
  'Viçosa do Ceará': [-3.5658, -41.0928],
  'Tianguá': [-3.7319, -40.9917],
  'São Benedito': [-4.0475, -40.8653],
  'Guaraciaba do Norte': [-4.1672, -40.7486],
  'Ibiapina': [-3.9236, -40.8953],
  'Ipu': [-4.3217, -40.7108],
  'Carnaubal': [-4.1650, -40.9422],
  'Croatá': [-4.3800, -40.8800],
}

let mapInstance = null
let markerInstance = null

const spots = ref([])
const totalSpots = ref(0)
const statsData = ref({})
const loading = ref(true)
const saving = ref(false)
const uploading = ref(false)

const searchTerm = ref('')
const selectedCity = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const showEditModal = ref(false)
const showImagesModal = ref(false)
const isEditing = ref(false)
const activeSpot = ref(null)

const totalPages = computed(() => Math.ceil(totalSpots.value / pageSize.value) || 1)

const showingFrom = computed(() => {
  if (totalSpots.value === 0) return 0
  return (currentPage.value - 1) * pageSize.value + 1
})

const showingTo = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalSpots.value)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const cur = currentPage.value
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  if (cur <= 4) {
    return [1, 2, 3, 4, 5, '...', total]
  }
  if (cur >= total - 3) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  }
  return [1, '...', cur - 1, cur, cur + 1, '...', total]
})

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  fetchSpots()
}

const mainTab = ref('spots')
const loadingPhotos = ref(false)
const pendingImages = ref([])

const users = ref([])
const loadingUsers = ref(false)

const reviews = ref([])
const loadingReviews = ref(false)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
}

const chartDataCategories = computed(() => {
  const map = {}
  spots.value.forEach(s => {
    map[s.categoria_display] = (map[s.categoria_display] || 0) + 1
  })
  return {
    labels: Object.keys(map),
    datasets: [{
      backgroundColor: ['#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#3b82f6', '#ec4899', '#6b7280'],
      data: Object.values(map)
    }]
  }
})

const chartDataCities = computed(() => {
  const map = {}
  spots.value.forEach(s => {
    map[s.cidade] = (map[s.cidade] || 0) + 1
  })
  return {
    labels: Object.keys(map),
    datasets: [{
      label: 'Atrativos',
      backgroundColor: '#3b82f6',
      data: Object.values(map)
    }]
  }
})

const fetchUsers = async () => {
  loadingUsers.value = true
  try {
    const response = await apiPrivate.get('auth/users/')
    users.value = response.data || []
  } catch (err) {
    console.error('Erro ao buscar usuários:', err)
  } finally {
    loadingUsers.value = false
  }
}

const setMainTab = (tab, statusVal = '') => {
  mainTab.value = tab
  if (tab === 'spots') {
    selectedStatus.value = statusVal
    currentPage.value = 1
    fetchSpots()
  } else if (tab === 'photos') {
    fetchPendingImages()
  } else if (tab === 'users') {
    fetchUsers()
  } else if (tab === 'reviews') {
    fetchReviews()
  } else if (tab === 'dashboard') {
    fetchSpots()
  }
}

const fetchReviews = async () => {
  loadingReviews.value = true
  try {
    const data = await spotsService.getAllReviews()
    reviews.value = data || []
  } catch (err) {
    console.error('Erro ao buscar avaliações:', err)
  } finally {
    loadingReviews.value = false
  }
}

const deleteReview = async (review) => {
  if (!confirm(`Deseja excluir permanentemente a avaliação de ${review.usuario_nome}?`)) return
  try {
    await spotsService.deleteReview(review.id)
    await fetchReviews()
  } catch (err) {
    console.error('Erro ao excluir avaliação:', err)
    alert('Erro ao excluir avaliação.')
  }
}

const fetchPendingImages = async () => {
  loadingPhotos.value = true
  try {
    const data = await spotsService.getPendingImages()
    pendingImages.value = data || []
    await fetchStats()
  } catch (err) {
    console.error('Erro ao buscar fotos pendentes:', err)
  } finally {
    loadingPhotos.value = false
  }
}

const approveCommunityPhoto = async (photo) => {
  try {
    await spotsService.approveImage(photo.ponto_turistico_id, photo.id)
    await fetchPendingImages()
    await fetchStats()
  } catch (err) {
    console.error('Erro ao aprovar foto:', err)
    alert('Erro ao aprovar foto.')
  }
}

const rejectCommunityPhoto = async (photo) => {
  if (!confirm('Deseja realmente excluir/rejeitar esta foto enviada pela comunidade?')) return
  try {
    await spotsService.deleteImage(photo.ponto_turistico_id, photo.id)
    await fetchPendingImages()
    await fetchStats()
  } catch (err) {
    console.error('Erro ao rejeitar foto:', err)
    alert('Erro ao excluir foto.')
  }
}

const selectStatusFilter = (statusVal) => {
  selectedStatus.value = statusVal
  currentPage.value = 1
  fetchSpots()
}

const onFilterChange = () => {
  currentPage.value = 1
  fetchSpots()
}

const onPageSizeChange = () => {
  currentPage.value = 1
  fetchSpots()
}

const formSpot = ref({
  id: null,
  nome: '',
  cidade: 'Viçosa do Ceará',
  categoria: 'natural',
  latitude: '-3.565000',
  longitude: '-41.085000',
  descricao: '',
  status: 'aprovado',
})

const cidadesList = [
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

const categoriasList = [
  { value: 'natural', label: 'Atração Natural' },
  { value: 'historical', label: 'Ponto Histórico' },
  { value: 'cultural', label: 'Atração Cultural' },
  { value: 'adventure', label: 'Aventura' },
  { value: 'religious', label: 'Religioso' },
  { value: 'gastronomic', label: 'Gastronômico' },
  { value: 'other', label: 'Outro' },
]

const totalNatural = computed(() => spots.value.filter((s) => s.categoria === 'natural').length)
const totalCultural = computed(() => spots.value.filter((s) => ['cultural', 'historical', 'religious'].includes(s.categoria)).length)

const categoryBadge = (cat) => {
  const map = {
    natural: 'bg-green-100 text-green-800',
    historical: 'bg-amber-100 text-amber-800',
    cultural: 'bg-purple-100 text-purple-800',
    adventure: 'bg-red-100 text-red-800',
    religious: 'bg-blue-100 text-blue-800',
    gastronomic: 'bg-orange-100 text-orange-800',
    other: 'bg-gray-100 text-gray-800',
  }
  return map[cat] || 'bg-gray-100 text-gray-800'
}

const statusBadge = (st) => {
  if (st === 'pendente') return 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
  if (st === 'rejeitado') return 'bg-red-100 text-red-800 font-semibold'
  return 'bg-emerald-100 text-emerald-800 font-semibold'
}

let searchTimeout = null
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchSpots()
  }, 300)
}

const fetchStats = async () => {
  try {
    const data = await spotsService.getStats()
    statsData.value = data
  } catch (err) {
    console.warn('Erro ao carregar estatísticas:', err)
  }
}

const fetchSpots = async () => {
  loading.value = true
  try {
    const params = {
      page: currentPage.value,
      page_size: pageSize.value,
      search: searchTerm.value,
      cidade: selectedCity.value,
      categoria: selectedCategory.value,
    }
    if (selectedStatus.value) {
      params.status = selectedStatus.value
    }
    const data = await spotsService.getSpots(params)
    spots.value = data.results || data || []
    totalSpots.value = data.count || spots.value.length
    await fetchStats()
  } catch (err) {
    console.error('Erro ao listar atrativos:', err)
  } finally {
    loading.value = false
  }
}

const approveSpot = async (spot) => {
  if (!confirm(`Deseja aprovar e publicar "${spot.nome}" no catálogo público?`)) return
  try {
    await spotsService.approveSpot(spot.id)
    await fetchSpots()
  } catch (err) {
    console.error('Erro ao aprovar atrativo:', err)
    alert(err.response?.data?.detail || 'Erro ao aprovar atrativo.')
  }
}

const rejectSpot = async (spot) => {
  const motivo = prompt(`Informe o motivo da rejeição de "${spot.nome}" (opcional):`, 'Informações insuficientes ou fora dos critérios')
  if (motivo === null) return

  try {
    await spotsService.rejectSpot(spot.id, motivo)
    await fetchSpots()
  } catch (err) {
    console.error('Erro ao rejeitar atrativo:', err)
    alert(err.response?.data?.detail || 'Erro ao rejeitar atrativo.')
  }
}

const initMap = () => {
  nextTick(() => {
    const mapContainer = document.getElementById('admin-map')
    if (!mapContainer) return

    let lat = parseFloat(formSpot.value.latitude)
    let lng = parseFloat(formSpot.value.longitude)

    if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) {
      const cityCoord = CITY_COORDS[formSpot.value.cidade] || [-3.5658, -41.0928]
      lat = cityCoord[0]
      lng = cityCoord[1]
      formSpot.value.latitude = lat.toFixed(6)
      formSpot.value.longitude = lng.toFixed(6)
    }

    if (mapInstance) {
      mapInstance.remove()
      mapInstance = null
    }

    mapInstance = L.map('admin-map').setView([lat, lng], 14)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(mapInstance)

    markerInstance = L.marker([lat, lng], { draggable: true }).addTo(mapInstance)
    markerInstance.bindPopup('<b>Localização do Atrativo</b><br>Arraste para ajustar.').openPopup()

    // Ao arrastar o pino
    markerInstance.on('dragend', (e) => {
      const position = e.target.getLatLng()
      formSpot.value.latitude = position.lat.toFixed(6)
      formSpot.value.longitude = position.lng.toFixed(6)
    })

    // Ao clicar em qualquer local do mapa
    mapInstance.on('click', (e) => {
      const { lat: clickedLat, lng: clickedLng } = e.latlng
      formSpot.value.latitude = clickedLat.toFixed(6)
      formSpot.value.longitude = clickedLng.toFixed(6)
      markerInstance.setLatLng([clickedLat, clickedLng])
      mapInstance.panTo([clickedLat, clickedLng])
    })

    // Força recálculo do tamanho do container após renderização do modal
    setTimeout(() => {
      if (mapInstance) mapInstance.invalidateSize()
    }, 250)
  })
}

const onCityChange = () => {
  const coords = CITY_COORDS[formSpot.value.cidade]
  if (coords && mapInstance && markerInstance) {
    formSpot.value.latitude = coords[0].toFixed(6)
    formSpot.value.longitude = coords[1].toFixed(6)
    markerInstance.setLatLng(coords)
    mapInstance.setView(coords, 14)
    setTimeout(() => {
      if (mapInstance) mapInstance.invalidateSize()
    }, 100)
  }
}

const updateMarkerFromInputs = () => {
  const lat = parseFloat(formSpot.value.latitude)
  const lng = parseFloat(formSpot.value.longitude)
  if (!isNaN(lat) && !isNaN(lng) && mapInstance && markerInstance) {
    markerInstance.setLatLng([lat, lng])
    mapInstance.panTo([lat, lng])
  }
}

const openCreateModal = () => {
  isEditing.value = false
  const defaultCity = 'Viçosa do Ceará'
  const defaultCoords = CITY_COORDS[defaultCity] || [-3.5658, -41.0928]
  formSpot.value = {
    id: null,
    nome: '',
    cidade: defaultCity,
    categoria: 'natural',
    latitude: defaultCoords[0].toFixed(6),
    longitude: defaultCoords[1].toFixed(6),
    descricao: '',
    status: 'aprovado',
  }
  showEditModal.value = true
  initMap()
}

const openEditModal = (spot) => {
  isEditing.value = true
  formSpot.value = {
    id: spot.id,
    nome: spot.nome,
    cidade: spot.cidade,
    categoria: spot.categoria,
    latitude: String(spot.latitude),
    longitude: String(spot.longitude),
    descricao: spot.descricao,
    status: spot.status || 'aprovado',
  }
  showEditModal.value = true
  initMap()
}

const openImagesModal = (spot) => {
  activeSpot.value = spot
  showImagesModal.value = true
}

const saveSpot = async () => {
  saving.value = true
  try {
    if (isEditing.value && formSpot.value.id) {
      await spotsService.updateSpot(formSpot.value.id, formSpot.value)
    } else {
      await spotsService.createSpot(formSpot.value)
    }
    showEditModal.value = false
    await fetchSpots()
  } catch (err) {
    console.error('Erro ao salvar atrativo:', err)
    alert(err.response?.data?.detail || 'Erro ao salvar atrativo. Verifique os dados.')
  } finally {
    saving.value = false
  }
}

const confirmDeleteSpot = async (spot) => {
  if (!confirm(`Deseja realmente excluir "${spot.nome}"? Esta ação não pode ser desfeita.`)) return

  try {
    await spotsService.deleteSpot(spot.id)
    await fetchSpots()
  } catch (err) {
    console.error('Erro ao excluir atrativo:', err)
    alert('Erro ao excluir atrativo.')
  }
}

const handleFileUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file || !activeSpot.value) return

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('imagem', file)
    formData.append('descricao', `Foto de ${activeSpot.value.nome}`)
    formData.append('from_admin_panel', 'true')

    await spotsService.uploadImage(activeSpot.value.id, formData)
    
    // Atualiza detalhes do atrativo ativo
    const updated = await spotsService.getSpotById(activeSpot.value.id)
    activeSpot.value = updated
    await fetchSpots()
  } catch (err) {
    console.error('Erro no upload de foto:', err)
    alert('Falha ao enviar imagem.')
  } finally {
    uploading.value = false
  }
}

const deleteImage = async (imageId) => {
  if (!confirm('Deseja excluir esta foto?')) return

  try {
    await spotsService.deleteImage(activeSpot.value.id, imageId)
    const updated = await spotsService.getSpotById(activeSpot.value.id)
    activeSpot.value = updated
    await fetchSpots()
  } catch (err) {
    console.error('Erro ao remover imagem:', err)
  }
}

const approveImage = async (imageId) => {
  try {
    await spotsService.approveImage(activeSpot.value.id, imageId)
    const updated = await spotsService.getSpotById(activeSpot.value.id)
    activeSpot.value = updated
    await fetchSpots()
  } catch (err) {
    console.error('Erro ao aprovar foto:', err)
    alert('Erro ao aprovar foto.')
  }
}

onMounted(async () => {
  if (authStore.isAuthenticated && !authStore.user.email) {
    await authStore.fetchProfile()
  }
  fetchSpots()
})
</script>
