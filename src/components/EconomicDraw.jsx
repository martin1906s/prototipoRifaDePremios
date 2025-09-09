import { useContext, useState } from 'react'
import { AppContext } from '../App.jsx'

export default function EconomicDraw() {
  const { state, dispatch } = useContext(AppContext)
  const [showForm, setShowForm] = useState(false)
  const [winnersCount, setWinnersCount] = useState(1)
  const [prizeAmount, setPrizeAmount] = useState(100)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const soldTickets = state.tickets.filter(t => t.status === 'sold')

  const handleDraw = async () => {
    if (soldTickets.length === 0) {
      alert('No hay boletos vendidos para realizar el sorteo')
      return
    }

    if (winnersCount > soldTickets.length) {
      alert(`Solo hay ${soldTickets.length} boletos vendidos. No puedes seleccionar ${winnersCount} ganadores.`)
      return
    }

    setLoading(true)
    setResult(null)

    // Simular proceso de sorteo
    await new Promise(r => setTimeout(r, 2000))

    // Seleccionar ganadores aleatorios
    const shuffled = [...soldTickets].sort(() => 0.5 - Math.random())
    const winners = shuffled.slice(0, winnersCount)

    // Crear datos de ganadores
    const economicWinners = winners.map((winner, index) => {
      const purchase = state.purchases.find(p => p.tickets.includes(winner.number))
      return {
        id: `eco-${Date.now()}-${index}-${Math.random()}`,
        ticketNumber: winner.number,
        buyerName: purchase?.buyer?.fullName || winner.buyerName,
        prizeAmount: prizeAmount,
        drawDate: new Date().toISOString(),
        type: 'economic'
      }
    })

    // Guardar ganadores
    dispatch({ type: 'ADD_ECONOMIC_WINNERS', payload: economicWinners })

    setResult({
      winners: economicWinners,
      totalPrize: prizeAmount * winnersCount
    })

    setLoading(false)
    setShowForm(false)
  }

  const handleReset = () => {
    setWinnersCount(1)
    setPrizeAmount(100)
    setResult(null)
    setShowForm(false)
  }

  return (
    <div className="glass rounded-3 rounded-md-4 p-4 mb-4 hover-lift animate-fade-in">
      <div className="text-center mb-4">
        <div className="fs-1 mb-3">💰</div>
        <h5 className="text-white fw-bold mb-2">Sorteo Económico</h5>
        <p className="text-white-50 small">Sorteo de premios en efectivo</p>
      </div>

      {!showForm && !result && (
        <div className="text-center">
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-lg gradient-primary text-white border-0 rounded-pill px-4 py-3 fw-bold hover-lift"
            disabled={soldTickets.length === 0}
          >
            <i className="fas fa-coins me-2"></i>
            Realizar Sorteo Económico
          </button>
          {soldTickets.length === 0 && (
            <div className="mt-3 text-warning small">
              <i className="fas fa-exclamation-triangle me-1"></i>
              No hay boletos vendidos
            </div>
          )}
        </div>
      )}

      {showForm && !result && (
        <div className="animate-fade-in">
          <div className="row g-3 mb-4">
            <div className="col-md-6">
              <label className="form-label text-white fw-semibold mb-2">
                <i className="fas fa-users me-2"></i>Cantidad de Ganadores
              </label>
              <input
                type="number"
                className="form-control border-0 rounded-pill px-4 py-3"
                style={{background: 'rgba(255,255,255,0.9)', color: '#333'}}
                value={winnersCount}
                onChange={(e) => setWinnersCount(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max={soldTickets.length}
              />
              <div className="text-white-50 small mt-1">
                Máximo: {soldTickets.length} ganadores
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label text-white fw-semibold mb-2">
                <i className="fas fa-dollar-sign me-2"></i>Premio por Ganador ($)
              </label>
              <input
                type="number"
                className="form-control border-0 rounded-pill px-4 py-3"
                style={{background: 'rgba(255,255,255,0.9)', color: '#333'}}
                value={prizeAmount}
                onChange={(e) => setPrizeAmount(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
              />
            </div>
          </div>

          <div className="glass-dark rounded-3 p-3 mb-4">
            <div className="row g-3 text-center">
              <div className="col-4">
                <div className="text-white-50 small">Ganadores</div>
                <div className="fw-bold text-white">{winnersCount}</div>
              </div>
              <div className="col-4">
                <div className="text-white-50 small">Premio Individual</div>
                <div className="fw-bold text-gradient">${prizeAmount}</div>
              </div>
              <div className="col-4">
                <div className="text-white-50 small">Total a Repartir</div>
                <div className="fw-bold text-success">${prizeAmount * winnersCount}</div>
              </div>
            </div>
          </div>

          <div className="d-flex gap-2 justify-content-center">
            <button
              onClick={handleReset}
              className="btn btn-outline-light rounded-pill px-4 py-2"
            >
              <i className="fas fa-times me-2"></i>Cancelar
            </button>
            <button
              onClick={handleDraw}
              disabled={loading}
              className="btn gradient-primary text-white border-0 rounded-pill px-4 py-2 fw-bold"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Realizando Sorteo...
                </>
              ) : (
                <>
                  <i className="fas fa-dice me-2"></i>
                  Realizar Sorteo
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="animate-fade-in">
          <div className="text-center mb-4">
            <div className="fs-1 mb-3">🎉</div>
            <h5 className="text-white fw-bold mb-2">¡Sorteo Realizado!</h5>
            <div className="badge bg-success fs-6 fs-md-5 px-2 px-md-3 py-2 text-wrap">
              ${result.totalPrize} repartidos entre {result.winners.length} ganadores
            </div>
          </div>

          <div className="row g-3">
            {result.winners.map((winner, index) => (
              <div key={winner.id} className="col-md-6">
                <div className="glass-dark rounded-3 p-3 hover-lift">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <div className="fw-bold text-white font-monospace">#{winner.ticketNumber}</div>
                      <div className="text-white-50 small">{winner.buyerName}</div>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold text-success">${winner.prizeAmount}</div>
                      <div className="text-white-50 small">Ganador #{index + 1}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <button
              onClick={handleReset}
              className="btn btn-outline-light rounded-pill px-4 py-2"
            >
              <i className="fas fa-plus me-2"></i>Nuevo Sorteo Económico
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
