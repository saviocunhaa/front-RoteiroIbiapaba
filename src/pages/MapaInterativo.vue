<template>
  <div class="flex flex-col h-[calc(100vh-68px)] bg-gray-100 overflow-hidden relative">
    <!-- BARRA SUPERIOR DE FILTROS & AÇÕES RÁPIDAS -->
    <div class="bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 py-3 z-20 shadow-sm flex flex-col md:flex-row justify-between items-center gap-3">
      <div class="flex items-center gap-3 w-full md:w-auto">
        <div class="flex items-center gap-2">
          <span class="text-2xl">🗺️</span>
          <div>
            <h1 class="text-lg font-bold text-blue-950 leading-tight">Mapa Turístico da Ibiapaba</h1>
            <span class="text-xs text-gray-500 font-medium">
              {{ filteredSpots.length }} de {{ allSpots.length }} destinos exibidos
            </span>
          </div>
        </div>

        <button
          @click="toggleSidebar"
          class="md:hidden ml-auto p-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-700 flex items-center gap-1"
        >
          <span>{{ sidebarOpen ? 'Fechar Lista' : 'Ver Lista' }}</span>
          <span>📋</span>
        </button>
      </div>

      <!-- Filtros Rápidos -->
      <div class="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
        <!-- Busca -->
        <div class="relative shrink-0 w-44 sm:w-56">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar atrativo..."
            class="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <span class="absolute left-2.5 top-2 text-xs text-gray-400">🔍</span>
        </div>

        <!-- Seletor de Cidade -->
        <select
          v-model="selectedCity"
          class="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none shrink-0"
        >
          <option value="">Todas as Cidades ({{ allSpots.length }})</option>
          <option v-for="c in cidadesList" :key="c" :value="c">{{ c }}</option>
        </select>

        <!-- Seletor de Categoria -->
        <select
          v-model="selectedCategory"
          class="bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none shrink-0"
        >
          <option value="">Todas as Categorias</option>
          <option v-for="cat in categoriasList" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
        </select>

        <!-- Botão Minha Localização GPS -->
        <button
          @click="getUserLocation"
          :disabled="locating"
          class="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0"
          title="Ver minha localização no mapa"
        >
          <span v-if="locating" class="animate-spin text-xs">⏳</span>
          <span v-else>📍</span>
          <span class="hidden sm:inline">Meu GPS</span>
        </button>
      </div>
    </div>

    <!-- CORPO: MAPA + BARRA LATERAL -->
    <div class="flex-1 flex relative overflow-hidden">
      <!-- BARRA LATERAL DE ATRATIVOS -->
      <div
        class="bg-white border-r border-gray-200 z-10 transition-all duration-300 flex flex-col absolute md:static inset-y-0 left-0 shadow-lg md:shadow-none"
        :class="sidebarOpen ? 'w-80 md:w-96 translate-x-0' : '-translate-x-full md:translate-x-0 md:w-96'"
      >
        <div class="p-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
          <span class="text-xs font-bold text-gray-600 uppercase tracking-wider">
            Destinos Encontrados ({{ filteredSpots.length }})
          </span>
          <span class="text-[11px] text-gray-400">Clique para focar no mapa</span>
        </div>

        <div class="flex-1 overflow-y-auto divide-y divide-gray-100 p-2 space-y-1">
          <div
            v-for="s in filteredSpots"
            :key="s.id"
            @click="focusOnSpot(s)"
            class="p-3 rounded-2xl hover:bg-blue-50/60 cursor-pointer transition flex items-center gap-3 group border border-transparent hover:border-blue-100"
            :class="activeSpot?.id === s.id ? 'bg-blue-50 border-blue-300 shadow-sm' : ''"
          >
            <img
              :src="getImageUrl(s.imagens?.[0]?.imagem, 'https://placehold.co/100x100?text=Sem+Foto')"
              alt="Foto"
              class="w-14 h-14 rounded-xl object-cover border border-gray-200 bg-gray-100 shrink-0 group-hover:scale-105 transition"
            />

            <div class="flex-1 min-w-0">
              <h4 class="font-bold text-sm text-gray-900 truncate group-hover:text-blue-600 transition">
                {{ s.nome }}
              </h4>
              <p class="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <span>📍 {{ s.cidade }}</span>
                <span class="text-gray-300">•</span>
                <span class="text-amber-600 font-semibold">★ {{ s.media_avaliacoes > 0 ? s.media_avaliacoes.toFixed(1) : 'Novo' }}</span>
              </p>
              <span
                class="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md"
                :class="categoryBadge(s.categoria)"
              >
                {{ s.categoria_display || s.categoria }}
              </span>
            </div>

            <span class="text-gray-300 group-hover:text-blue-600 text-sm font-bold">→</span>
          </div>

          <div v-if="filteredSpots.length === 0" class="text-center py-12 text-gray-400 text-xs">
            Nenhum atrativo encontrado com os filtros selecionados.
          </div>
        </div>
      </div>

      <!-- CONTAINER DO MAPA LEAFLET -->
      <div id="full-map" class="flex-1 h-full w-full relative z-0"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import spotsService from '../services/spotsService'
import { getImageUrl } from '../utils/imageHelper'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Corrige ícones Leaflet no Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const allSpots = ref([])
const activeSpot = ref(null)
const sidebarOpen = ref(true)
const locating = ref(false)

const searchTerm = ref('')
const selectedCity = ref('')
const selectedCategory = ref('')

let map = null
let markersLayer = null
let userMarker = null

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

const categoryIcons = {
  natural: { icon: '🌿', color: '#16a34a', bg: '#dcfce7', border: '#15803d' },
  historical: { icon: '🏛️', color: '#d97706', bg: '#fef3c7', border: '#b45309' },
  cultural: { icon: '🎭', color: '#9333ea', bg: '#f3e8ff', border: '#7e22ce' },
  adventure: { icon: '🧗', color: '#dc2626', bg: '#fee2e2', border: '#b91c1c' },
  religious: { icon: '⛪', color: '#2563eb', bg: '#dbeafe', border: '#1d4ed8' },
  gastronomic: { icon: '☕', color: '#ea580c', bg: '#ffedd5', border: '#c2410c' },
  other: { icon: '📍', color: '#4b5563', bg: '#f3f4f6', border: '#374151' },
}

const categoryBadge = (cat) => {
  const mapBadge = {
    natural: 'bg-green-100 text-green-800',
    historical: 'bg-amber-100 text-amber-800',
    cultural: 'bg-purple-100 text-purple-800',
    adventure: 'bg-red-100 text-red-800',
    religious: 'bg-blue-100 text-blue-800',
    gastronomic: 'bg-orange-100 text-orange-800',
    other: 'bg-gray-100 text-gray-800',
  }
  return mapBadge[cat] || 'bg-gray-100 text-gray-800'
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
  setTimeout(() => {
    if (map) map.invalidateSize()
  }, 300)
}

const filteredSpots = computed(() => {
  return allSpots.value.filter((s) => {
    const matchesSearch =
      !searchTerm.value ||
      s.nome.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      s.descricao?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      s.cidade.toLowerCase().includes(searchTerm.value.toLowerCase())

    const matchesCity = !selectedCity.value || s.cidade === selectedCity.value
    const matchesCategory = !selectedCategory.value || s.categoria === selectedCategory.value

    return matchesSearch && matchesCity && matchesCategory
  })
})

const createCustomMarker = (category) => {
  const cat = categoryIcons[category] || categoryIcons.other
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background: ${cat.bg};
        border: 2.5px solid ${cat.border};
        color: ${cat.color};
        width: 38px;
        height: 38px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.25);
        cursor: pointer;
        transition: transform 0.2s;
      ">
        <span style="transform: rotate(45deg); font-size: 17px; line-height: 1;">${cat.icon}</span>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
  })
}

const renderMarkers = () => {
  if (!map || !markersLayer) return
  markersLayer.clearLayers()

  const markers = []

  filteredSpots.value.forEach((spot) => {
    const lat = parseFloat(spot.latitude)
    const lng = parseFloat(spot.longitude)
    if (isNaN(lat) || isNaN(lng)) return

    const marker = L.marker([lat, lng], {
      icon: createCustomMarker(spot.categoria),
      title: spot.nome,
    })

    const photoUrl = getImageUrl(spot.imagens?.[0]?.imagem, 'https://placehold.co/400x200?text=Sem+Foto')
    const ratingText = spot.media_avaliacoes > 0 ? `★ ${spot.media_avaliacoes.toFixed(1)} (${spot.total_avaliacoes})` : 'Novo'

    const popupHtml = `
      <div style="width: 240px; font-family: system-ui, sans-serif;">
        <div style="position: relative; border-radius: 12px; overflow: hidden; height: 120px; background: #e5e7eb; margin-bottom: 8px;">
          <img src="${photoUrl}" alt="${spot.nome}" style="width: 100%; height: 100%; object-fit: cover;" />
          <div style="position: absolute; bottom: 6px; left: 6px; background: rgba(0,0,0,0.65); color: white; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 6px;">
            📍 ${spot.cidade}
          </div>
        </div>
        <h4 style="font-size: 14px; font-weight: bold; color: #0f172a; margin: 0 0 4px 0; line-height: 1.2;">${spot.nome}</h4>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 11px;">
          <span style="color: #d97706; font-weight: bold;">${ratingText}</span>
          <span style="background: #f1f5f9; color: #475569; padding: 2px 6px; border-radius: 4px; font-weight: 600;">${spot.categoria_display || spot.categoria}</span>
        </div>
        <div style="display: flex; gap: 6px;">
          <a href="/pontos/${spot.id}" style="flex: 1; text-align: center; background: #2563eb; color: white; text-decoration: none; padding: 6px 0; border-radius: 8px; font-size: 11px; font-weight: bold;">
            Ver Detalhes
          </a>
          <a href="https://www.google.com/maps?q=${lat},${lng}" target="_blank" rel="noopener noreferrer" style="background: #f1f5f9; color: #1e293b; text-decoration: none; padding: 6px 10px; border-radius: 8px; font-size: 11px; font-weight: bold; display: flex; align-items: center; justify-content: center;">
            🧭 Rota
          </a>
        </div>
      </div>
    `

    marker.bindPopup(popupHtml, {
      maxWidth: 280,
      className: 'ibiapaba-map-popup',
    })

    marker.on('click', () => {
      activeSpot.value = spot
    })

    markersLayer.addLayer(marker)
    markers.push(marker)
  })

  // Ajusta o zoom inicial do mapa para cobrir todos os marcadores se houver filtragem
  if (markers.length > 0 && (selectedCity.value || selectedCategory.value)) {
    const group = L.featureGroup(markers)
    map.fitBounds(group.getBounds().pad(0.15))
  }
}

const focusOnSpot = (spot) => {
  activeSpot.value = spot
  const lat = parseFloat(spot.latitude)
  const lng = parseFloat(spot.longitude)
  if (isNaN(lat) || isNaN(lng) || !map) return

  map.flyTo([lat, lng], 15, { duration: 1.2 })

  // Abre o popup do marcador
  markersLayer.eachLayer((layer) => {
    const pos = layer.getLatLng()
    if (Math.abs(pos.lat - lat) < 0.0001 && Math.abs(pos.lng - lng) < 0.0001) {
      setTimeout(() => layer.openPopup(), 400)
    }
  })
}

const getUserLocation = () => {
  if (!navigator.geolocation) {
    alert('Geolocalização não é suportada pelo seu navegador.')
    return
  }

  locating.value = true
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords
      locating.value = false

      if (userMarker) {
        map.removeLayer(userMarker)
      }

      userMarker = L.circleMarker([latitude, longitude], {
        radius: 9,
        fillColor: '#3b82f6',
        color: '#ffffff',
        weight: 3,
        opacity: 1,
        fillOpacity: 0.9,
      }).addTo(map)

      userMarker.bindPopup('<b>📍 Você está aqui!</b>').openPopup()
      map.flyTo([latitude, longitude], 13, { duration: 1.5 })
    },
    (err) => {
      locating.value = false
      console.warn('Erro GPS:', err)
      alert('Não foi possível obter sua localização exata.')
    },
    { enableHighAccuracy: true, timeout: 10000 }
  )
}

const initFullMap = () => {
  nextTick(() => {
    const container = document.getElementById('full-map')
    if (!container || map) return

    // Centro da Serra da Ibiapaba (entre Ubajara, Tianguá e Viçosa)
    map = L.map('full-map', {
      zoomControl: true,
    }).setView([-3.8547, -40.9239], 10)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap | Roteiro Ibiapaba',
    }).addTo(map)

    markersLayer = L.layerGroup().addTo(map)
    renderMarkers()
  })
}

watch([selectedCity, selectedCategory, searchTerm], () => {
  renderMarkers()
})

onMounted(async () => {
  try {
    const data = await spotsService.getSpots({ page_size: 200 })
    allSpots.value = data.results || data || []
    initFullMap()
  } catch (err) {
    console.error('Erro ao carregar pontos para o mapa:', err)
  }
})
</script>

<style>
.ibiapaba-map-popup .leaflet-popup-content-wrapper {
  border-radius: 18px !important;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
  padding: 4px !important;
}
.ibiapaba-map-popup .leaflet-popup-content {
  margin: 10px !important;
  line-height: 1.4 !important;
}
.custom-map-pin:hover > div {
  transform: rotate(-45deg) scale(1.15) !important;
}
</style>
