# 🌴 Roteiro Ibiapaba — Frontend Web

Aplicação web moderna desenvolvida em **Vue 3**, **Vite**, **Pinia** e **Tailwind CSS** para o guia de turismo e roteiros inteligentes da **Serra da Ibiapaba (Ceará)**.

---

## 🚀 Funcionalidades

- **Explorar Atrativos**: Listagem paginada de cachoeiras, mirantes e pontos históricos com filtros em tempo real integrados à API.
- **Roteiro Personalizado com IA**: Interface interativa para geração e download em PDF de roteiros diários sob medida.
- **Autenticação Reativa**: Login, cadastro e login social com Google gerenciados com Pinia e JWT.
- **Área do Usuário & Favoritos**: Painel de perfil com listagem dos atrativos favoritados.
- **Design Responsivo & Acessível**: Estilizado com Tailwind CSS e carrosséis otimizados via Swiper.

---

## 🛠️ Tecnologias Utilizadas

- **Framework:** Vue 3 (Composition API com `<script setup>`)
- **Build Tool:** Vite 6
- **Gerenciamento de Estado:** Pinia 2
- **Estilização:** Tailwind CSS 3.4
- **Roteamento:** Vue Router 4 (com Navigation Guards e Lazy Loading)
- **HTTP Client:** Axios (com interceptor automático para renovação de JWT)
- **Exportação de Documentos:** html2pdf.js
- **Autenticação Social:** Firebase Authentication

---

## 📦 Como Rodar o Projeto

1. Clone o repositório e acesse a pasta:
   ```bash
   git clone https://github.com/saviocunhaa/front-RoteiroIbiapaba.git frontend
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o arquivo `.env`:
   ```bash
   cp .env.example .env
   ```
   *Certifique-se de que `VITE_API_URL` aponta para o backend local (`http://localhost:8000/api/`) ou para o servidor de produção.*

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

5. Acesse no navegador:
   [http://localhost:5173](http://localhost:5173)

---

## 🏗️ Build de Produção

Para gerar o bundle estático otimizado para deploy (Vercel, Netlify, etc.):
```bash
npm run build
```
Para pré-visualizar o build localmente:
```bash
npm run preview
```

---

## 📂 Estrutura de Pastas

```text
src/
├── assets/          # Imagens, ícones e estilos globais CSS
├── components/      # Componentes reutilizáveis (Navbar, Footer, TouristSpotCard, UI)
│   └── UI/          # Componentes base (Button, Input, Select)
├── pages/           # Telas e views da aplicação (Home, Explorar, GerarRoteiro, Login, Perfil, etc.)
├── router/          # Configuração do Vue Router com guards de autenticação
├── services/        # Clientes HTTP e serviços modulares (api, spots, favorites, itinerary, firebase)
├── stores/          # Stores globais do Pinia (auth)
└── utils/           # Funções utilitárias auxiliares
```
