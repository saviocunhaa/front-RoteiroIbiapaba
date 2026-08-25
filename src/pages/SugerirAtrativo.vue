<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
    <div class="max-w-4xl mx-auto">
      <!-- CABEÇALHO -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase px-4 py-1.5 rounded-full mb-3 shadow-sm">
          <span>💡</span>
          <span>Colabore com a Comunidade</span>
        </div>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-blue-950">Cadastrar Novo Ponto Turístico</h1>
        <p class="text-gray-600 text-xs sm:text-sm max-w-xl mx-auto mt-1 leading-relaxed">
          Conhece uma cachoeira escondida, mirante, casario histórico ou café serrano que ainda não está no mapa? Envie fotos e informações para ajudar outros viajantes.
        </p>
      </div>

      <!-- TELA DE SUCESSO -->
      <div
        v-if="submittedSuccess"
        class="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-100 shadow-sm text-center"
      >
        <div class="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-sm">
          ✓
        </div>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">Sugestão Enviada com Sucesso!</h2>
        <p class="text-gray-600 text-sm max-w-lg mx-auto mb-8 leading-relaxed">
          Obrigado por colaborar com o turismo da Serra da Ibiapaba! Seu atrativo <strong>"{{ submittedSpotName }}"</strong> foi recebido pela nossa equipe e passará por uma rápida moderação antes de ser publicado no catálogo oficial e no mapa.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <router-link
            to="/explorar"
            class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl text-xs sm:text-sm transition shadow-md"
          >
            Explorar Atrativos
          </router-link>
          <button
            @click="resetForm"
            class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-3 rounded-2xl text-xs sm:text-sm transition"
          >
            Cadastrar Outro Ponto
          </button>
        </div>
      </div>

      <!-- FORMULÁRIO DE CADASTRO -->
      <div v-else class="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-10">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Nome do Atrativo -->
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Nome do Ponto Turístico *
            </label>
            <input
              v-model="form.nome"
              type="text"
              required
              placeholder="Ex: Cachoeira das Sete Quedas, Mirante do Pôr do Sol..."
              class="w-full rounded-2xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
            />
          </div>

          <!-- Cidade e Categoria -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Cidade na Serra *
              </label>
              <select
                v-model="form.cidade"
                @change="onCityChange"
                required
                class="w-full rounded-2xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
              >
                <option v-for="c in cidadesList" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Categoria *
              </label>
              <select
                v-model="form.categoria"
                required
                class="w-full rounded-2xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
              >
                <option v-for="cat in categoriasList" :key="cat.value" :value="cat.value">
                  {{ cat.icon }} {{ cat.label }}
                </option>
              </select>
            </div>
          </div>

          <!-- MAPA INTERATIVO PARA SELECIONAR LOCALIZAÇÃO -->
          <div class="pt-2">
            <div class="flex justify-between items-center mb-2">
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                📍 Posição no Mapa (Clique ou arraste para marcar o ponto exato)
              </label>
              <span class="text-[11px] bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded-full">
                Pino GPS
              </span>
            </div>
            <div
              id="suggest-map"
              class="w-full h-64 sm:h-72 rounded-2xl border border-gray-200 overflow-hidden shadow-inner relative z-0"
            ></div>
            <p class="text-[11px] text-gray-500 mt-1.5">
              💡 Arraste o marcador até a entrada do atrativo ou trilha. As coordenadas serão preenchidas automaticamente.
            </p>
          </div>

          <!-- Coordenadas -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Latitude (Decimal) *
              </label>
              <input
                v-model="form.latitude"
                @input="updateMarkerFromInputs"
                type="text"
                required
                class="w-full rounded-2xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Longitude (Decimal) *
              </label>
              <input
                v-model="form.longitude"
                @input="updateMarkerFromInputs"
                type="text"
                required
                class="w-full rounded-2xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
              />
            </div>
          </div>

          <!-- Descrição Detalhada -->
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Descrição e Dicas de Visitação *
            </label>
            <textarea
              v-model="form.descricao"
              rows="4"
              required
              placeholder="Descreva a atração, como chegar, nível de dificuldade da trilha, melhor horário para visitação, se cobra taxa, etc."
              class="w-full rounded-2xl border border-gray-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
            ></textarea>
          </div>

          <!-- Upload de Fotos -->
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Fotos do Ponto Turístico (Opcional, mas recomendado)
            </label>
            <div class="border-2 border-dashed border-gray-200 hover:border-blue-400 rounded-2xl p-6 text-center transition bg-gray-50/50">
              <input
                type="file"
                multiple
                accept="image/*"
                @change="handleFileChange"
                id="file-upload"
                class="hidden"
              />
              <label for="file-upload" class="cursor-pointer block">
                <span class="text-3xl block mb-2">📸</span>
                <span class="text-xs font-bold text-blue-600 hover:underline block">
                  Clique aqui para selecionar fotos do seu dispositivo
                </span>
                <span class="text-[11px] text-gray-400 mt-1 block">
                  PNG, JPG ou WEBP (Você pode selecionar várias fotos)
                </span>
              </label>
            </div>

            <!-- Preview das Imagens Selecionadas -->
            <div v-if="previewImages.length > 0" class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div
                v-for="(img, idx) in previewImages"
                :key="idx"
                class="relative h-24 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 group"
              >
                <img :src="img.url" alt="Preview" class="w-full h-full object-cover" />
                <button
                  type="button"
                  @click="removeSelectedFile(idx)"
                  class="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full text-[10px] opacity-90 hover:opacity-100 transition shadow"
                  title="Remover foto"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <!-- Botão de Envio -->
          <div class="pt-4 border-t border-gray-100 flex items-center justify-between">
            <span class="text-xs text-gray-500">
              🛡️ Todas as sugestões passam por moderação da equipe.
            </span>

            <button
              type="submit"
              :disabled="submitting"
              class="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-bold px-8 py-3.5 rounded-2xl text-sm shadow-md hover:shadow-lg transition transform active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              <span v-if="submitting" class="animate-spin text-xs">⏳</span>
              <span v-else>🚀</span>
              <span>{{ submitting ? 'Enviando Sugestão...' : 'Enviar para Moderação' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import spotsService from '../services/spotsService'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Corrige ícone padrão do Leaflet no Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const router = useRouter()
const authStore = useAuthStore()

const submitting = ref(false)
const submittedSuccess = ref(false)
const submittedSpotName = ref('')
const selectedFiles = ref([])
const previewImages = ref([])

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

const cidadesList = [
  'Ubajara',
  'Viçosa do Ceará',
  'Tianguá',
  'São Benedito',
  'Guaraciaba do Norte',
  'Ibiapina',
  'Ipu',
  'Carnaubal',
  'Croatá',
]

const categoriasList = [
  { value: 'natural', label: 'Atração Natural', icon: '🌿' },
  { value: 'historical', label: 'Ponto Histórico', icon: '🏛️' },
  { value: 'cultural', label: 'Cultura & Arte', icon: '🎭' },
  { value: 'adventure', label: 'Trilhas & Aventura', icon: '🧗' },
  { value: 'religious', label: 'Religioso', icon: '⛪' },
  { value: 'gastronomic', label: 'Gastronomia', icon: '☕' },
  { value: 'other', label: 'Outro', icon: '📍' },
]

const form = ref({
  nome: '',
  cidade: 'Ubajara',
  categoria: 'natural',
  latitude: '-3.854700',
  longitude: '-40.923900',
  descricao: '',
})

let mapInstance = null
let markerInstance = null

const initMap = () => {
  nextTick(() => {
    const container = document.getElementById('suggest-map')
    if (!container) return

    let lat = parseFloat(form.value.latitude)
    let lng = parseFloat(form.value.longitude)

    if (mapInstance) {
      mapInstance.remove()
      mapInstance = null
    }

    mapInstance = L.map('suggest-map').setView([lat, lng], 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap | Roteiro Ibiapaba',
    }).addTo(mapInstance)

    markerInstance = L.marker([lat, lng], { draggable: true }).addTo(mapInstance)
    markerInstance.bindPopup('<b>Posição do Atrativo</b><br>Arraste para ajustar o local exato.').openPopup()

    markerInstance.on('dragend', (e) => {
      const pos = e.target.getLatLng()
      form.value.latitude = pos.lat.toFixed(6)
      form.value.longitude = pos.lng.toFixed(6)
    })

    mapInstance.on('click', (e) => {
      const { lat: clickLat, lng: clickLng } = e.latlng
      form.value.latitude = clickLat.toFixed(6)
      form.value.longitude = clickLng.toFixed(6)
      markerInstance.setLatLng([clickLat, clickLng])
      mapInstance.panTo([clickLat, clickLng])
    })

    setTimeout(() => {
      if (mapInstance) mapInstance.invalidateSize()
    }, 200)
  })
}

const onCityChange = () => {
  const coords = CITY_COORDS[form.value.cidade]
  if (coords && mapInstance && markerInstance) {
    form.value.latitude = coords[0].toFixed(6)
    form.value.longitude = coords[1].toFixed(6)
    markerInstance.setLatLng(coords)
    mapInstance.setView(coords, 13)
  }
}

const updateMarkerFromInputs = () => {
  const lat = parseFloat(form.value.latitude)
  const lng = parseFloat(form.value.longitude)
  if (!isNaN(lat) && !isNaN(lng) && mapInstance && markerInstance) {
    markerInstance.setLatLng([lat, lng])
    mapInstance.panTo([lat, lng])
  }
}

const handleFileChange = (e) => {
  const files = Array.from(e.target.files || [])
  files.forEach((file) => {
    selectedFiles.value.push(file)
    previewImages.value.push({
      file,
      url: URL.createObjectURL(file),
    })
  })
}

const removeSelectedFile = (idx) => {
  selectedFiles.value.splice(idx, 1)
  previewImages.value.splice(idx, 1)
}

const handleSubmit = async () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'Login', query: { redirect: '/sugerir-atrativo' } })
    return
  }

  submitting.value = true
  try {
    const formData = new FormData()
    formData.append('nome', form.value.nome)
    formData.append('cidade', form.value.cidade)
    formData.append('categoria', form.value.categoria)
    formData.append('latitude', form.value.latitude)
    formData.append('longitude', form.value.longitude)
    formData.append('descricao', form.value.descricao)

    selectedFiles.value.forEach((file) => {
      formData.append('imagens', file)
    })

    await spotsService.suggestSpot(formData)
    submittedSpotName.value = form.value.nome
    submittedSuccess.value = true
  } catch (err) {
    console.error('Erro ao enviar sugestão:', err)
    alert(err.response?.data?.detail || 'Erro ao enviar sugestão. Verifique os dados.')
  } finally {
    submitting.value = false
  }
}

const resetForm = () => {
  submittedSuccess.value = false
  form.value = {
    nome: '',
    cidade: 'Ubajara',
    categoria: 'natural',
    latitude: '-3.854700',
    longitude: '-40.923900',
    descricao: '',
  }
  selectedFiles.value = []
  previewImages.value = []
  initMap()
}

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'Login', query: { redirect: '/sugerir-atrativo' } })
    return
  }
  initMap()
})
</script>
