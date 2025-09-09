import { useContext, useMemo } from 'react'
import { AppContext } from '../App.jsx'

export default function WinnersView() {
  const { state } = useContext(AppContext)

  // Debug: Log del estado para verificar datos
  console.log('Estado completo:', state)
  console.log('Ganadores económicos:', state.economicWinners)
  console.log('Ganadores mayores:', state.majorWinners)

  const allWinners = useMemo(() => {
    const economic = (state.economicWinners || []).map(winner => ({
      ...winner,
      drawType: 'Económico',
      prize: `$${winner.prizeAmount}`,
      icon: '💰'
    }))
    
    const major = (state.majorWinners || []).map(winner => ({
      ...winner,
      drawType: 'Mayor',
      prize: winner.prizeDescription,
      icon: '🏆'
    }))
    
    return [...economic, ...major].sort((a, b) => new Date(b.drawDate) - new Date(a.drawDate))
  }, [state.economicWinners, state.majorWinners])

  const totalEconomicPrize = useMemo(() => {
    return (state.economicWinners || []).reduce((total, winner) => total + winner.prizeAmount, 0)
  }, [state.economicWinners])

  const majorPrizesCount = useMemo(() => {
    return (state.majorWinners || []).length
  }, [state.majorWinners])

  if (allWinners.length === 0) {
    return (
      <div className="glass rounded-3 rounded-md-4 p-5 text-center hover-lift animate-fade-in">
        <div className="fs-1 mb-3">🎯</div>
        <h5 className="text-white fw-bold mb-2">No hay ganadores aún</h5>
        <p className="text-white-50">
          Los ganadores de los sorteos aparecerán aquí una vez que se realicen los sorteos.
        </p>
        <div className="mt-4">
          <div className="d-flex justify-content-center gap-4">
            <div className="text-center">
              <div className="fs-3 mb-2">💰</div>
              <div className="text-white-50 small">Sorteos Económicos</div>
              <div className="fw-bold text-white">$0</div>
            </div>
            <div className="text-center">
              <div className="fs-3 mb-2">🏆</div>
              <div className="text-white-50 small">Sorteos Mayores</div>
              <div className="fw-bold text-white">0</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Resumen de ganadores */}
      <div className="glass rounded-3 rounded-md-4 p-4 mb-4 hover-lift animate-fade-in">
        <div className="text-center mb-4">
          <div className="fs-1 mb-3">🎉</div>
          <h5 className="text-white fw-bold mb-2">¡Felicidades a los Ganadores!</h5>
          <p className="text-white-50">Lista completa de ganadores de todos los sorteos</p>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <div className="glass-dark rounded-3 p-3 text-center">
              <div className="fs-2 mb-2">💰</div>
              <div className="text-white-50 small">Total Repartido en Sorteos Económicos</div>
              <div className="h4 fw-bold text-success">${totalEconomicPrize.toLocaleString()}</div>
              <div className="text-white-50 small">
                {(state.economicWinners || []).length} ganadores
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="glass-dark rounded-3 p-3 text-center">
              <div className="fs-2 mb-2">🏆</div>
              <div className="text-white-50 small">Sorteos Mayores Realizados</div>
              <div className="h4 fw-bold text-warning">{majorPrizesCount}</div>
              <div className="text-white-50 small">
                {(state.majorWinners || []).length} ganadores
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premios Mayores Destacados */}
      {(state.majorWinners || []).length > 0 && (
        <div className="mb-4">
          <div className="text-center mb-3">
            <div className="fs-1 mb-2">👑</div>
            <h5 className="text-warning fw-bold mb-2">Premios Mayores</h5>
            <p className="text-white-50">Los premios más importantes de la rifa</p>
          </div>
          <div className="row g-3">
            {(state.majorWinners || []).map((winner, index) => {
              console.log('Procesando ganador mayor:', winner)
              return (
              <div key={winner.id} className="col-md-6 col-lg-4">
                <div 
                  className="rounded-3 p-4 hover-lift"
                  style={{
                    background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)',
                    boxShadow: '0 8px 32px rgba(255, 215, 0, 0.4)',
                    border: '3px solid #ffd700',
                    animationDelay: `${index * 0.2}s`
                  }}
                >
                  <div className="text-center mb-3">
                    <div className="fs-1 mb-2">🏆</div>
                    <div className="badge bg-dark text-warning fs-6 px-3 py-2 fw-bold">
                      PREMIO MAYOR
                    </div>
                  </div>
                  
                  <div className="text-center mb-3">
                    <div className="text-dark small">Boleto Ganador</div>
                    <div className="fw-bold text-dark font-monospace h4">#{winner.ticketNumber}</div>
                  </div>
                  
                  <div className="text-center mb-3">
                    <div className="text-dark small">Ganador</div>
                    <div className="fw-bold text-dark h6">{winner.buyerName}</div>
                  </div>
                  
                  <div className="text-center mb-3">
                    <div className="text-dark small">Premio</div>
                    <div className="fw-bold text-dark h5">{winner.prizeDescription}</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-dark small">
                      {new Date(winner.drawDate).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Lista de ganadores */}
      <div className="glass rounded-3 rounded-md-4 p-4 hover-lift animate-fade-in">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h6 className="text-white fw-bold mb-0">
            <i className="fas fa-trophy me-2"></i>Todos los Ganadores
          </h6>
          <div className="badge bg-success fs-6 px-3 py-2">
            {allWinners.length} ganador{allWinners.length !== 1 ? 'es' : ''}
          </div>
        </div>

        <div className="row g-3">
          {allWinners.map((winner, index) => (
            <div key={winner.id} className="col-md-6 col-lg-4">
              <div 
                className={`rounded-3 p-3 hover-lift ${
                  winner.drawType === 'Mayor' 
                    ? 'bg-gradient-warning text-dark border border-warning' 
                    : 'glass-dark'
                }`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  ...(winner.drawType === 'Mayor' && {
                    background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%)',
                    boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)',
                    border: '2px solid #ffd700'
                  })
                }}
              >
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div className="fs-3">{winner.icon}</div>
                  <div className={`badge small ${
                    winner.drawType === 'Mayor' 
                      ? 'bg-dark text-warning fw-bold' 
                      : 'bg-primary'
                  }`}>
                    {winner.drawType}
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className={`small ${winner.drawType === 'Mayor' ? 'text-dark' : 'text-white-50'}`}>
                    Boleto Ganador
                  </div>
                  <div className={`fw-bold font-monospace h5 ${
                    winner.drawType === 'Mayor' ? 'text-dark' : 'text-white'
                  }`}>
                    #{winner.ticketNumber}
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className={`small ${winner.drawType === 'Mayor' ? 'text-dark' : 'text-white-50'}`}>
                    Ganador
                  </div>
                  <div className={`fw-bold ${
                    winner.drawType === 'Mayor' ? 'text-dark' : 'text-white'
                  }`}>
                    {winner.buyerName}
                  </div>
                </div>
                
                <div className="mb-3">
                  <div className={`small ${winner.drawType === 'Mayor' ? 'text-dark' : 'text-white-50'}`}>
                    Premio
                  </div>
                  <div className={`fw-bold ${
                    winner.drawType === 'Económico' 
                      ? 'text-success' 
                      : 'text-dark'
                  }`}>
                    {winner.prize}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className={`small ${winner.drawType === 'Mayor' ? 'text-dark' : 'text-white-50'}`}>
                    {new Date(winner.drawDate).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                
                {winner.drawType === 'Mayor' && (
                  <div className="text-center mt-3">
                    <div className="badge bg-dark text-warning fs-6 px-3 py-2">
                      🏆 PREMIO MAYOR 🏆
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mensaje motivacional */}
      <div className="glass rounded-3 rounded-md-4 p-4 text-center hover-lift animate-fade-in">
        <div className="fs-1 mb-3">🎯</div>
        <h6 className="text-white fw-bold mb-2">¿No apareces en la lista?</h6>
        <p className="text-white-50 mb-3">
          ¡No te preocupes! Sigue participando en nuestros sorteos. 
          Cada boleto que compres te da una nueva oportunidad de ganar.
        </p>
        <div className="d-flex justify-content-center gap-2">
          <span className="badge bg-success">Más sorteos próximamente</span>
          <span className="badge bg-warning text-dark">¡Sigue participando!</span>
        </div>
      </div>
    </div>
  )
}
