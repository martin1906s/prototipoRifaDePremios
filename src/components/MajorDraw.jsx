import { useContext, useState } from 'react'
import { AppContext } from '../App.jsx'

export default function MajorDraw() {
  const { state, dispatch } = useContext(AppContext)
  const [showForm, setShowForm] = useState(false)
  const [prizeDescription, setPrizeDescription] = useState('')
  const [winnersCount, setWinnersCount] = useState(1)
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

    if (!prizeDescription.trim()) {
      alert('Debes describir el premio a sortear')
      return
    }

    setLoading(true)
    setResult(null)

    // Simular proceso de sorteo
    await new Promise(r => setTimeout(r, 3000))

    // Seleccionar ganadores aleatorios
    const shuffled = [...soldTickets].sort(() => 0.5 - Math.random())
    const winners = shuffled.slice(0, winnersCount)

    // Crear datos de ganadores
    const majorWinners = winners.map((winner, index) => {
      const purchase = state.purchases.find(p => p.tickets.includes(winner.number))
      return {
        id: `major-${Date.now()}-${index}-${Math.random()}`,
        ticketNumber: winner.number,
        buyerName: purchase?.buyer?.fullName || winner.buyerName,
        prizeDescription: prizeDescription,
        drawDate: new Date().toISOString(),
        type: 'major'
      }
    })

    // Debug: Verificar ganadores creados
    console.log('Ganadores mayores creados:', majorWinners)
    console.log('Cantidad de ganadores:', majorWinners.length)

    // Guardar ganadores
    dispatch({ type: 'ADD_MAJOR_WINNER', payload: majorWinners })

    setResult({
      winners: majorWinners,
      prizeDescription: prizeDescription
    })

    setLoading(false)
    setShowForm(false)
  }

  const handleReset = () => {
    setPrizeDescription('')
    setWinnersCount(1)
    setResult(null)
    setShowForm(false)
  }

  return (
    <div className="glass rounded-3 rounded-md-4 p-4 mb-4 hover-lift animate-fade-in">
      <div className="text-center mb-4">
        <div className="fs-1 mb-3">🏆</div>
        <h5 className="text-white fw-bold mb-2">Sorteo Mayor</h5>
        <p className="text-white-50 small">Sorteo del premio principal</p>
      </div>

      {!showForm && !result && (
        <div className="text-center">
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-lg btn-outline-warning border-2 rounded-pill px-4 py-3 fw-bold hover-lift"
            disabled={soldTickets.length === 0}
          >
            <i className="fas fa-trophy me-2"></i>
            Realizar Sorteo Mayor
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
            <div className="col-12">
              <label className="form-label text-white fw-semibold mb-2">
                <i className="fas fa-gift me-2"></i>Descripción del Premio
              </label>
              <textarea
                className="form-control border-0 rounded-3 px-4 py-3"
                style={{background: 'rgba(255,255,255,0.9)', color: '#333'}}
                value={prizeDescription}
                onChange={(e) => setPrizeDescription(e.target.value)}
                placeholder="Ej: Camioneta Toyota Hilux 2024, Casa de 3 habitaciones, $50,000 en efectivo..."
                rows="3"
              />
            </div>
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
              <div className="text-center">
                <div className="text-white-50 small">Boletos Vendidos</div>
                <div className="h4 fw-bold text-gradient">{soldTickets.length}</div>
              </div>
            </div>
          </div>

          <div className="glass-dark rounded-3 p-3 mb-4">
            <div className="text-center">
              <div className="text-white-50 small mb-2">Premio a Sortear</div>
              <div className="fw-bold text-warning h5">{prizeDescription || 'Sin descripción'}</div>
              <div className="text-white-50 small mt-2">
                {winnersCount === 1 ? '1 ganador' : `${winnersCount} ganadores`}
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
              disabled={loading || !prizeDescription.trim()}
              className="btn btn-warning text-dark border-0 rounded-pill px-4 py-2 fw-bold"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Realizando Sorteo...
                </>
              ) : (
                <>
                  <i className="fas fa-trophy me-2"></i>
                  Realizar Sorteo Mayor
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className="animate-fade-in">
          <div className="text-center mb-4">
            <div className="fs-1 mb-3">🎊</div>
            <h5 className="text-white fw-bold mb-2">¡Sorteo Mayor Realizado!</h5>
            <div className="badge bg-warning text-dark fs-6 px-3 py-2">
              {result.prizeDescription}
            </div>
          </div>

          <div className="glass-dark rounded-3 p-4 mb-4">
            <div className="text-center mb-3">
              <div className="text-white-50 small">Premio</div>
              <div className="fw-bold text-warning h5">{result.prizeDescription}</div>
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
                      <div className="fw-bold text-warning">🏆 Ganador</div>
                      <div className="text-white-50 small">#{index + 1}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <button
              onClick={handleReset}
              className="btn btn-outline-warning rounded-pill px-4 py-2"
            >
              <i className="fas fa-plus me-2"></i>Nuevo Sorteo Mayor
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
