import { createContext, useMemo, useReducer, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import RoleSelection from './pages/RoleSelection.jsx'
import Home from './pages/Home.jsx'
import Admin from './pages/Admin.jsx'
import ProgressBar from './components/ProgressBar.jsx'
import { getInitialState, saveToLocalStorage, clearLocalStorage } from './utils/localStorage.js'

export const AppContext = createContext(null)

function appReducer(state, action) {
  switch (action.type) {
    case 'ADD_TICKET_NUMBER': {
      const { number } = action.payload
      const existingTicket = state.tickets.find(t => t.number === number)
      
      // Validar que no exceda el límite de boletos configurado
      const maxTickets = state.raffleConfig?.totalTickets || 100
      if (state.tickets.length >= maxTickets) {
        return {
          ...state,
          error: `Se ha alcanzado el límite máximo de ${maxTickets} boletos para esta rifa`,
          duplicateNumber: null
        }
      }
      
      // Validar rango de números
      const minNumber = state.raffleConfig?.minTicketNumber || 1
      const maxNumber = state.raffleConfig?.maxTicketNumber || 100
      const numValue = parseInt(number)
      if (numValue < minNumber || numValue > maxNumber) {
        return {
          ...state,
          error: `El número debe estar entre ${String(minNumber).padStart(5, '0')} y ${String(maxNumber).padStart(5, '0')}`,
          duplicateNumber: null
        }
      }
      
      if (existingTicket) {
        return {
          ...state,
          duplicateNumber: number,
          error: null
        }
      }
      
      return {
        ...state,
        tickets: [...state.tickets, {
          id: number,
          number,
          status: 'selected'
        }],
        error: null,
        duplicateNumber: null
      }
    }
    case 'ADD_ALTERNATIVE_TICKET_NUMBER': {
      const { number } = action.payload
      
      // Validar que no exceda el límite de boletos configurado
      const maxTickets = state.raffleConfig?.totalTickets || 100
      if (state.tickets.length >= maxTickets) {
        return {
          ...state,
          error: `Se ha alcanzado el límite máximo de ${maxTickets} boletos para esta rifa`,
          duplicateNumber: null
        }
      }
      
      // Validar rango de números
      const minNumber = state.raffleConfig?.minTicketNumber || 1
      const maxNumber = state.raffleConfig?.maxTicketNumber || 100
      const numValue = parseInt(number)
      if (numValue < minNumber || numValue > maxNumber) {
        return {
          ...state,
          error: `El número debe estar entre ${String(minNumber).padStart(5, '0')} y ${String(maxNumber).padStart(5, '0')}`,
          duplicateNumber: null
        }
      }
      
      return {
        ...state,
        tickets: [...state.tickets, {
          id: number,
          number,
          status: 'selected'
        }],
        duplicateNumber: null
      }
    }
    case 'CLEAR_DUPLICATE_NUMBER': {
      return {
        ...state,
        duplicateNumber: null
      }
    }
    case 'REMOVE_TICKET_NUMBER': {
      return {
        ...state,
        tickets: state.tickets.filter(t => t.number !== action.payload)
      }
    }
    case 'CLEAR_ERROR': {
      return {
        ...state,
        error: action.payload || null
      }
    }
    case 'CONFIRM_PURCHASE': {
      const { buyer, selectedNumbers, orderId: provided } = action.payload
      const orderId = provided || `ORD-${Date.now()}`
      const tickets = state.tickets.map(t => selectedNumbers.includes(t.number) ? { ...t, status: 'sold', buyerName: buyer.fullName } : t)
      const purchase = {
        orderId,
        buyer,
        tickets: [...selectedNumbers],
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
    case 'ADD_ECONOMIC_WINNERS': {
      return { ...state, economicWinners: [...(state.economicWinners || []), ...action.payload] }
    }
    case 'ADD_MAJOR_WINNER': {
      console.log('Reducer ADD_MAJOR_WINNER - Payload recibido:', action.payload)
      console.log('Reducer ADD_MAJOR_WINNER - Ganadores actuales:', state.majorWinners)
      const newWinners = [...(state.majorWinners || []), ...action.payload]
      console.log('Reducer ADD_MAJOR_WINNER - Nuevos ganadores:', newWinners)
      return { ...state, majorWinners: newWinners }
    }
    case 'CLEAR_ALL_WINNERS': {
      return { ...state, economicWinners: [], majorWinners: [] }
    }
    case 'UPDATE_RAFFLE_CONFIG': {
      return { 
        ...state, 
        raffleConfig: { 
          ...state.raffleConfig, 
          ...action.payload 
        } 
      }
    }
    case 'RESET_RAFFLE_CONFIG': {
      return { 
        ...state, 
        raffleConfig: {
          ticketPrice: 10,
          totalTickets: null,
          minTicketNumber: 1,
          maxTicketNumber: 99999
        }
      }
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
                      <div className="d-none d-md-flex">
                        <ProgressBar />
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
                      <div className="d-none d-md-flex">
                        <ProgressBar />
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
