import { createContext, useMemo, useReducer, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import RoleSelection from './pages/RoleSelection.jsx'
import Home from './pages/Home.jsx'
import Admin from './pages/Admin.jsx'
import { getInitialState, saveToLocalStorage, clearLocalStorage } from './utils/localStorage.js'

export const AppContext = createContext(null)

function appReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_SELECT': {
      const id = action.payload
      const tickets = state.tickets.map(t => {
        if (t.id !== id) return t
        if (t.status === 'available') return { ...t, status: 'selected' }
        if (t.status === 'selected') return { ...t, status: 'available' }
        return t
      })
      return { ...state, tickets }
    }
    case 'CONFIRM_PURCHASE': {
      const { buyer, selectedIds, orderId: provided } = action.payload
      const orderId = provided || `ORD-${Date.now()}`
      const tickets = state.tickets.map(t => selectedIds.includes(t.id) ? { ...t, status: 'sold', buyerName: buyer.fullName } : t)
      const purchase = {
        orderId,
        buyer,
        tickets: [...selectedIds],
        createdAt: new Date().toISOString(),
      }
      return { ...state, tickets, purchases: [purchase, ...state.purchases] }
    }
    case 'RESET_APPLICATION': {
      clearLocalStorage()
      return getInitialState()
    }
    case 'SAVE_RECEIPT': {
      return { ...state, receipts: [...(state.receipts || []), action.payload] }
    }
    case 'CREATE_RAFFLE': {
      return { ...state, raffles: [...(state.raffles || []), action.payload] }
    }
    default:
      return state
  }
}

export default function App() {
  const [state, dispatch] = useReducer(appReducer, getInitialState())

  // Guardar en localStorage cada vez que el estado cambie
  useEffect(() => {
    saveToLocalStorage(state)
  }, [state])

  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch])

  const available = state.tickets.filter(t => t.status === 'available').length
  const selected = state.tickets.filter(t => t.status === 'selected').length
  const sold = state.tickets.filter(t => t.status === 'sold').length

  return (
    <BrowserRouter>
      <AppContext.Provider value={contextValue}>
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/user" element={
            <div className="min-vh-100 d-flex flex-column">
              <header className="w-100 glass sticky-top animate-fade-in" style={{zIndex: 1000}}>
                <div className="container-fluid px-3 px-md-4 py-3 py-md-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <Link to="/" className="text-decoration-none d-flex align-items-center gap-2 gap-md-3">
                      <div className="fs-1 fs-md-1 animate-pulse-custom">🎟️</div>
                      <div className="d-none d-sm-block">
                        <h1 className="h4 h-md-3 mb-0 text-gradient fw-bold">Rifa de Premios</h1>
                        <small className="text-white-50 d-none d-md-block">¡Tu suerte te espera!</small>
                      </div>
                    </Link>
                    <nav className="d-flex align-items-center gap-2 gap-md-4">
                      <div className="d-none d-md-flex gap-2 gap-lg-3">
                        <div className="d-flex align-items-center gap-1 gap-md-2 px-2 px-md-3 py-1 py-md-2 rounded-pill glass-dark text-white">
                          <div className="w-2 w-md-3 h-2 h-md-3 rounded-circle bg-success animate-glow"></div>
                          <span className="small fw-medium">Disp: <strong>{available}</strong></span>
                        </div>
                        <div className="d-flex align-items-center gap-1 gap-md-2 px-2 px-md-3 py-1 py-md-2 rounded-pill glass-dark text-white">
                          <div className="w-2 w-md-3 h-2 h-md-3 rounded-circle bg-warning animate-pulse-custom"></div>
                          <span className="small fw-medium">Sel: <strong>{selected}</strong></span>
                        </div>
                        <div className="d-flex align-items-center gap-1 gap-md-2 px-2 px-md-3 py-1 py-md-2 rounded-pill glass-dark text-white">
                          <div className="w-2 w-md-3 h-2 h-md-3 rounded-circle bg-danger"></div>
                          <span className="small fw-medium">Vend: <strong>{sold}</strong></span>
                        </div>
                      </div>
                      <Link to="/admin" className="btn btn-light btn-sm px-2 px-md-4 py-1 py-md-2 rounded-pill fw-semibold hover-lift">
                        <i className="fas fa-cog d-none d-md-inline me-2"></i>
                        <span className="d-md-none">⚙️</span>
                        <span className="d-none d-md-inline">Admin</span>
                      </Link>
                    </nav>
                  </div>
                </div>
              </header>
              <main className="flex-grow-1">
                <Home />
              </main>
              <footer className="glass-dark text-center py-4">
                <div className="container">
                  <p className="mb-0 text-white-50">
                    © {new Date().getFullYear()} Rifa de Premios - Desarrollado con ❤️ para tu diversión
                  </p>
                </div>
              </footer>
            </div>
          } />
          <Route path="/admin" element={
            <div className="min-vh-100 d-flex flex-column">
              <header className="w-100 glass sticky-top animate-fade-in" style={{zIndex: 1000}}>
                <div className="container-fluid px-3 px-md-4 py-3 py-md-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <Link to="/" className="text-decoration-none d-flex align-items-center gap-2 gap-md-3">
                      <div className="fs-1 fs-md-1 animate-pulse-custom">🎟️</div>
                      <div className="d-none d-sm-block">
                        <h1 className="h4 h-md-3 mb-0 text-gradient fw-bold">Rifa de Premios</h1>
                        <small className="text-white-50 d-none d-md-block">¡Tu suerte te espera!</small>
                      </div>
                    </Link>
                    <nav className="d-flex align-items-center gap-2 gap-md-4">
                      <div className="d-none d-md-flex gap-2 gap-lg-3">
                        <div className="d-flex align-items-center gap-1 gap-md-2 px-2 px-md-3 py-1 py-md-2 rounded-pill glass-dark text-white">
                          <div className="w-2 w-md-3 h-2 h-md-3 rounded-circle bg-success animate-glow"></div>
                          <span className="small fw-medium">Disp: <strong>{available}</strong></span>
                        </div>
                        <div className="d-flex align-items-center gap-1 gap-md-2 px-2 px-md-3 py-1 py-md-2 rounded-pill glass-dark text-white">
                          <div className="w-2 w-md-3 h-2 h-md-3 rounded-circle bg-warning animate-pulse-custom"></div>
                          <span className="small fw-medium">Sel: <strong>{selected}</strong></span>
                        </div>
                        <div className="d-flex align-items-center gap-1 gap-md-2 px-2 px-md-3 py-1 py-md-2 rounded-pill glass-dark text-white">
                          <div className="w-2 w-md-3 h-2 h-md-3 rounded-circle bg-danger"></div>
                          <span className="small fw-medium">Vend: <strong>{sold}</strong></span>
                        </div>
                      </div>
                      <Link to="/user" className="btn btn-light btn-sm px-2 px-md-4 py-1 py-md-2 rounded-pill fw-semibold hover-lift">
                        <i className="fas fa-user d-none d-md-inline me-2"></i>
                        <span className="d-md-none">👤</span>
                        <span className="d-none d-md-inline">Usuario</span>
                      </Link>
                    </nav>
                  </div>
                </div>
              </header>
              <main className="flex-grow-1">
                <Admin />
              </main>
              <footer className="glass-dark text-center py-4">
                <div className="container">
                  <p className="mb-0 text-white-50">
                    © {new Date().getFullYear()} Rifa de Premios - Desarrollado con ❤️ para tu diversión
                  </p>
                </div>
              </footer>
            </div>
          } />
        </Routes>
      </AppContext.Provider>
    </BrowserRouter>
  )
}
