import { useContext, useMemo, useState } from 'react'
import { AppContext } from '../App.jsx'
import AdvancedDraw from './AdvancedDraw.jsx'

export default function AdminPanel() {
  const { state } = useContext(AppContext)
  const [winner, setWinner] = useState(null)

  const soldTickets = useMemo(() => state.tickets.filter(t => t.status === 'sold'), [state.tickets])

  const stats = {
    available: state.tickets.filter(t => t.status === 'available').length,
    selected: state.tickets.filter(t => t.status === 'selected').length,
    sold: soldTickets.length,
  }

  const simulateDraw = () => {
    if (soldTickets.length === 0) {
      setWinner({ ticket: null, buyerName: null, message: 'No hay boletos vendidos para sortear.' })
      return
    }
    const random = Math.floor(Math.random() * soldTickets.length)
    const ticket = soldTickets[random]
    const purchase = state.purchases.find(p => p.tickets.includes(ticket.id))
    setWinner({ ticket: ticket.id, buyerName: purchase?.buyer?.fullName || ticket.buyerName, message: 'Sorteo realizado' })
  }

  return (
    <div>
      {/* Estadísticas */}
      <div className="row g-2 g-md-4 mb-3 mb-md-5">
        <div className="col-4 col-sm-4">
          <div className="glass rounded-3 rounded-md-4 p-2 p-md-4 text-center hover-lift animate-fade-in">
            <div className="fs-1 mb-2 mb-md-3">🎫</div>
            <div className="small text-uppercase fw-bold text-white-50 mb-1 mb-md-2">Disponibles</div>
            <div className="h3 h-md-display-4 fw-bold text-gradient">{stats.available}</div>
            <div className="small text-white-50 mt-1 mt-md-2 d-none d-md-block">Boletos disponibles</div>
          </div>
        </div>
        <div className="col-4 col-sm-4">
          <div className="glass rounded-3 rounded-md-4 p-2 p-md-4 text-center hover-lift animate-fade-in" style={{animationDelay: '0.1s'}}>
            <div className="fs-1 mb-2 mb-md-3">⏳</div>
            <div className="small text-uppercase fw-bold text-white-50 mb-1 mb-md-2">Seleccionados</div>
            <div className="h3 h-md-display-4 fw-bold text-gradient">{stats.selected}</div>
            <div className="small text-white-50 mt-1 mt-md-2 d-none d-md-block">En proceso de compra</div>
          </div>
        </div>
        <div className="col-4 col-sm-4">
          <div className="glass rounded-3 rounded-md-4 p-2 p-md-4 text-center hover-lift animate-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="fs-1 mb-2 mb-md-3">✅</div>
            <div className="small text-uppercase fw-bold text-white-50 mb-1 mb-md-2">Vendidos</div>
            <div className="h3 h-md-display-4 fw-bold text-gradient">{stats.sold}</div>
            <div className="small text-white-50 mt-1 mt-md-2 d-none d-md-block">Boletos vendidos</div>
          </div>
        </div>
      </div>

      {/* Reglas del Sorteo */}
      <div className="glass rounded-3 rounded-md-4 p-3 p-md-4 mb-4 hover-lift animate-fade-in">
        <h6 className="text-white fw-bold mb-3">
          <i className="fas fa-gavel me-2"></i>Reglas del Sorteo
        </h6>
        <div className="row g-3">
          <div className="col-md-4">
            <div className="text-center">
              <div className="fs-1 mb-2">🚗</div>
              <div className="fw-semibold text-white small">Todos los boletos vendidos</div>
              <div className="text-white-50 small">Premio: Camioneta</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-center">
              <div className="fs-1 mb-2">💰</div>
              <div className="fw-semibold text-white small">Boletos parcialmente vendidos</div>
              <div className="text-white-50 small">Premio: $5,000 en efectivo</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-center">
              <div className="fs-1 mb-2">🎯</div>
              <div className="fw-semibold text-white small">Siempre hay ganador</div>
              <div className="text-white-50 small">Número oficial de Lotería Nacional</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sorteo Oficial */}
      <AdvancedDraw />
      
      {/* Botón de Reset */}
      <div className="text-center mb-5">
        <button 
          onClick={() => {
            if (window.confirm('¿Estás seguro de que quieres resetear toda la aplicación? Esto eliminará todos los datos guardados.')) {
              dispatch({ type: 'RESET_APPLICATION' })
            }
          }}
          className="btn btn-lg btn-outline-light border-2 rounded-pill px-4 py-3 fw-bold hover-lift"
          style={{minHeight: '60px'}}
        >
          <i className="fas fa-trash-alt me-2"></i>
          Reset App
        </button>
      </div>

      {/* Lista de boletos vendidos */}
      <div className="glass rounded-4 p-5 hover-lift animate-fade-in">
        <div className="text-center mb-4">
          <div className="fs-1 mb-3">📋</div>
          <h3 className="h4 fw-bold text-white mb-2">Boletos Vendidos</h3>
          <p className="text-white-50">Lista completa de boletos vendidos y sus compradores</p>
        </div>
        
        <div className="row g-3">
          {soldTickets.length === 0 ? (
            <div className="col-12">
              <div className="glass-dark rounded-4 p-5 text-center">
                <div className="fs-1 mb-3">📭</div>
                <div className="h5 fw-bold text-white mb-2">No hay ventas registradas</div>
                <div className="text-white-50">Los boletos vendidos aparecerán aquí</div>
              </div>
            </div>
          ) : (
            soldTickets.map((t, index) => {
              const purchase = state.purchases.find(p => p.tickets.includes(t.id))
              return (
                <div key={t.id} className="col-md-6 col-lg-4">
                  <div className="glass-dark rounded-3 p-3 d-flex align-items-center justify-content-between hover-lift" 
                       style={{animationDelay: `${index * 0.05}s`}}>
                    <div className="d-flex align-items-center gap-3">
                      <div className="fs-4">🎫</div>
                      <div>
                        <div className="fw-bold font-monospace text-white">#{t.id}</div>
                        <div className="small text-white-50">{purchase?.buyer?.fullName || t.buyerName}</div>
                      </div>
                    </div>
                    <div className="badge bg-success">Vendido</div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
