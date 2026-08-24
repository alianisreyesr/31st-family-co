import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/index.css'

const container = document.getElementById('root')

const tree = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// `npm run build:ssg` deja el HTML ya renderizado dentro de #root: en ese caso
// se hidrata en lugar de volver a construir el DOM desde cero. Con `npm run
// build` (sin prerender) el contenedor llega vacío y se monta normal.
if (container.hasChildNodes()) {
  hydrateRoot(container, tree)
} else {
  createRoot(container).render(tree)
}
