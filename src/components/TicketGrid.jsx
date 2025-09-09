import { useContext, useMemo } from 'react'
import { AppContext } from '../App.jsx'

export default function TicketGrid({ onMinSelectionInvalid }) {
  const { state, dispatch } = useContext(AppContext)

  const handleToggle = (id, status) => {
    if (status === 'sold') return
    dispatch({ type: 'TOGGLE_SELECT', payload: id })
  }

  const selectedCount = useMemo(() => state.tickets.filter(t => t.status === 'selected').length, [state.tickets])

  if (onMinSelectionInvalid) onMinSelectionInvalid(selectedCount < 6)

  return (
    <div>
      <div className="d-flex flex-wrap align-items-center justify-content-center gap-2 gap-md-4 mb-3 mb-md-4">
        <div className="d-flex align-items-center gap-1 gap-md-2 px-2 px-md-3 py-1 py-md-2 rounded-pill glass-dark text-white">
          <div className="w-2 w-md-3 h-2 h-md-3 rounded-circle bg-success animate-glow"></div>
          <span className="small fw-medium">Disponible</span>
        </div>
        <div className="d-flex align-items-center gap-1 gap-md-2 px-2 px-md-3 py-1 py-md-2 rounded-pill glass-dark text-white">
          <div className="w-2 w-md-3 h-2 h-md-3 rounded-circle bg-warning animate-pulse-custom"></div>
          <span className="small fw-medium">Seleccionado</span>
        </div>
        <div className="d-flex align-items-center gap-1 gap-md-2 px-2 px-md-3 py-1 py-md-2 rounded-pill glass-dark text-white">
          <div className="w-2 w-md-3 h-2 h-md-3 rounded-circle bg-danger"></div>
          <span className="small fw-medium">Vendido</span>
        </div>
      </div>
      <div className="row g-1 g-sm-2 g-md-3">
        {state.tickets.map((ticket, index) => {
          const base = 'btn fw-bold font-monospace d-flex align-items-center justify-content-center position-relative overflow-hidden'
          const color = ticket.status === 'sold'
            ? 'bg-danger text-white'
            : ticket.status === 'selected'
              ? 'bg-warning text-dark'
              : 'bg-success text-white'

          return (
            <div key={ticket.id} className="col-3 col-sm-2 col-md-2 col-lg-1 col-xl-1 col-xxl-1">
              <button
                type="button"
                className={`${base} ${color} w-100 border-0 hover-lift`}
                style={{
                  aspectRatio: '3/2',
                  minHeight: window.innerWidth < 576 ? '45px' : '60px',
                  animationDelay: `${index * 0.01}s`
                }}
                onClick={() => handleToggle(ticket.id, ticket.status)}
                aria-label={`Boleto ${ticket.number} ${ticket.status}`}
                disabled={ticket.status === 'sold'}
              >
                <div className="position-relative z-2">
                  <div className="small opacity-75" style={{fontSize: window.innerWidth < 576 ? '0.7rem' : '0.875rem'}}>
                    #{ticket.number}
                  </div>
                </div>
                {ticket.status === 'available' && (
                  <div className="position-absolute top-0 start-0 w-100 h-100 opacity-10" 
                       style={{
                         background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)'
                       }}>
                  </div>
                )}
                {ticket.status === 'selected' && (
                  <div className="position-absolute top-0 start-0 w-100 h-100 animate-pulse-custom" 
                       style={{
                         background: 'linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 75%, rgba(255,255,255,0.2) 75%)',
                         backgroundSize: '10px 10px'
                       }}>
                  </div>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
