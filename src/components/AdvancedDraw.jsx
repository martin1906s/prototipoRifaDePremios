import { useContext, useState } from 'react'
import { AppContext } from '../App.jsx'
import { simulateLotteryQuery, validateWinningNumber, generateSRIInvoice } from '../utils/lotteryService.js'

export default function AdvancedDraw() {
  const { state, dispatch } = useContext(AppContext)
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawResult, setDrawResult] = useState(null)
  const [step, setStep] = useState(1) // 1: Consulta, 2: Validación, 3: Resultado

  const soldTickets = state.tickets.filter(t => t.status === 'sold')
  const allTicketsSold = soldTickets.length === 100

  const performDraw = async () => {
    setIsDrawing(true)
    setStep(1)
    
    try {
      // Paso 1: Consultar Lotería Nacional
      setDrawResult({ step: 1, message: 'Consultando número ganador oficial...' })
      const lotteryResult = await simulateLotteryQuery()
      
      setStep(2)
      setDrawResult({ 
        step: 2, 
        message: 'Validando número ganador...',
        lotteryResult 
      })
      
      // Paso 2: Validar número ganador
      const validation = validateWinningNumber(state.tickets, lotteryResult.winningNumber)
      
      setStep(3)
      
      // Paso 3: Generar factura SRI si hay ganador
      let sriInvoice = null
      if (validation.ticket) {
        const purchase = state.purchases.find(p => p.tickets.includes(validation.ticket.id))
        sriInvoice = await generateSRIInvoice({
          amount: purchase.tickets.length * 10,
          buyer: purchase.buyer,
          tickets: purchase.tickets
        })
      }
      
      setDrawResult({
        step: 3,
        lotteryResult,
        validation,
        sriInvoice,
        allTicketsSold,
        prize: allTicketsSold ? 'Camioneta' : 'Premio en Efectivo ($5,000)'
      })
      
    } catch (error) {
      setDrawResult({ 
        step: 3, 
        error: 'Error en el proceso de sorteo',
        details: error.message 
      })
    } finally {
      setIsDrawing(false)
    }
  }

  const resetDraw = () => {
    setDrawResult(null)
    setStep(1)
  }

  return (
    <div className="glass rounded-4 p-5 mb-5 hover-lift animate-slide-in">
      <div className="text-center mb-4">
        <div className="fs-1 mb-3">🎲</div>
        <h2 className="h3 fw-bold text-white mb-2">Sorteo Oficial</h2>
        <p className="text-white-50">
          Sorteo basado en el resultado oficial de la Lotería Nacional
        </p>
      </div>

      {/* Condiciones del Sorteo */}
      <div className="glass-dark rounded-3 p-4 mb-4">
        <h6 className="text-white fw-bold mb-3">
          <i className="fas fa-info-circle me-2"></i>Condiciones del Sorteo
        </h6>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="d-flex align-items-start gap-3">
              <div className="text-success fs-5">✅</div>
              <div>
                <div className="fw-semibold text-white small">Todos los boletos vendidos</div>
                <div className="text-white-50 small">Se sortea la camioneta</div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex align-items-start gap-3">
              <div className="text-warning fs-5">💰</div>
              <div>
                <div className="fw-semibold text-white small">Boletos parcialmente vendidos</div>
                <div className="text-white-50 small">Se sortea premio alternativo ($5,000)</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-top border-white-25">
          <div className="d-flex align-items-center gap-2">
            <div className="text-info fs-5">🎯</div>
            <div className="text-white-50 small">
              <strong className="text-white">Siempre hay un ganador:</strong> El número ganador se obtiene de la Lotería Nacional. 
              Si no hay coincidencia exacta, se aplica la regla del número más cercano.
            </div>
          </div>
        </div>
      </div>

      {/* Estado de la rifa */}
      <div className="glass-dark rounded-3 p-4 mb-4">
        <div className="row g-3 text-center">
          <div className="col-md-4">
            <div className="text-white-50 small">Boletos Vendidos</div>
            <div className="h4 fw-bold text-white">{soldTickets.length}/100</div>
          </div>
          <div className="col-md-4">
            <div className="text-white-50 small">Estado</div>
            <div className="h4 fw-bold text-gradient">
              {allTicketsSold ? 'Completa' : 'Parcial'}
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-white-50 small">Premio</div>
            <div className="h4 fw-bold text-gradient">
              {allTicketsSold ? '🚗 Camioneta' : '💰 $5,000'}
            </div>
          </div>
        </div>
      </div>

      {/* Progreso del sorteo */}
      {isDrawing && (
        <div className="mb-4">
          <div className="d-flex justify-content-between mb-2">
            <span className={`small ${step >= 1 ? 'text-white' : 'text-white-50'}`}>
              <i className="fas fa-search me-1"></i>Consulta Lotería
            </span>
            <span className={`small ${step >= 2 ? 'text-white' : 'text-white-50'}`}>
              <i className="fas fa-check-circle me-1"></i>Validación
            </span>
            <span className={`small ${step >= 3 ? 'text-white' : 'text-white-50'}`}>
              <i className="fas fa-trophy me-1"></i>Resultado
            </span>
          </div>
          <div className="progress" style={{height: '4px'}}>
            <div 
              className="progress-bar gradient-primary" 
              style={{width: `${(step / 3) * 100}%`}}
            ></div>
          </div>
          {drawResult?.message && (
            <div className="text-center mt-3">
              <div className="spinner-border spinner-border-sm me-2" role="status"></div>
              <span className="text-white">{drawResult.message}</span>
            </div>
          )}
        </div>
      )}

      {/* Resultado del sorteo */}
      {drawResult && !isDrawing && (
        <div className="animate-fade-in">
          {drawResult.error ? (
            <div className="glass-dark rounded-3 p-4 text-center">
              <div className="fs-1 mb-3">⚠️</div>
              <h5 className="text-white fw-bold mb-2">Error en el Sorteo</h5>
              <p className="text-white-50">{drawResult.details}</p>
            </div>
          ) : (
            <div className="glass-dark rounded-3 p-4">
              <div className="text-center mb-4">
                <div className="fs-1 mb-3">🎉</div>
                <h4 className="fw-bold text-white mb-2">¡Sorteo Realizado!</h4>
                <div className="badge bg-success fs-6 px-3 py-2">
                  Premio: {drawResult.prize}
                </div>
              </div>

              {/* Número ganador oficial */}
              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <div className="text-center">
                    <div className="text-white-50 small mb-2">Número Oficial</div>
                    <div className="display-4 fw-bold font-monospace text-gradient">
                      {drawResult.lotteryResult.winningNumber}
                    </div>
                    <div className="text-white-50 small">
                      {drawResult.lotteryResult.source}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="text-center">
                    <div className="text-white-50 small mb-2">Fecha del Sorteo</div>
                    <div className="h4 fw-bold text-white">
                      {new Date(drawResult.lotteryResult.drawDate).toLocaleDateString()}
                    </div>
                    <div className="text-white-50 small">
                      Verificado: {drawResult.lotteryResult.verified ? '✅' : '❌'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Resultado de validación */}
              {drawResult.validation.ticket ? (
                <div className="glass rounded-3 p-4 mb-4">
                  <div className="text-center mb-3">
                    <div className="fs-1 mb-2">🏆</div>
                    <h5 className="fw-bold text-white">¡Tenemos un Ganador!</h5>
                    <div className="badge bg-warning text-dark fs-6 px-3 py-2 mb-2">
                      {drawResult.validation.message}
                    </div>
                    <div className="badge bg-success fs-6 px-3 py-2">
                      Premio: {drawResult.prize}
                    </div>
                  </div>
                  
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="text-white-50 small">Boleto Ganador</div>
                      <div className="h4 fw-bold font-monospace text-white">
                        #{drawResult.validation.ticket.number}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="text-white-50 small">Comprador</div>
                      <div className="h4 fw-bold text-white">
                        {drawResult.validation.ticket.buyerName}
                      </div>
                    </div>
                  </div>

                  {/* Factura SRI */}
                  {drawResult.sriInvoice && (
                    <div className="mt-4 p-3 border border-success rounded">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <i className="fas fa-file-invoice text-success"></i>
                        <span className="fw-bold text-white">Factura Autorizada SRI</span>
                      </div>
                      <div className="row g-2 small">
                        <div className="col-6 text-white-50">Número:</div>
                        <div className="col-6 text-white">{drawResult.sriInvoice.invoiceNumber}</div>
                        <div className="col-6 text-white-50">Estado:</div>
                        <div className="col-6 text-success">{drawResult.sriInvoice.status}</div>
                        <div className="col-6 text-white-50">Total:</div>
                        <div className="col-6 text-white">${drawResult.sriInvoice.total}</div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="glass rounded-3 p-4 text-center">
                  <div className="fs-1 mb-3">⚠️</div>
                  <h5 className="fw-bold text-white mb-2">No se puede realizar el sorteo</h5>
                  <p className="text-white-50">
                    {drawResult.validation.message}
                  </p>
                  <div className="mt-3">
                    <div className="badge bg-warning text-dark fs-6 px-3 py-2">
                      Se requiere al menos 1 boleto vendido
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Botones de acción */}
      <div className="text-center">
        {!drawResult && (
          <button 
            onClick={performDraw}
            disabled={isDrawing || soldTickets.length === 0}
            className="btn btn-lg gradient-primary text-white border-0 rounded-pill px-5 py-3 fw-bold hover-lift me-3"
            style={{minHeight: '60px'}}
          >
            {isDrawing ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Realizando Sorteo...
              </>
            ) : (
              <>
                <i className="fas fa-dice me-2"></i>
                Realizar Sorteo Oficial
              </>
            )}
          </button>
        )}
        
        {drawResult && (
          <button 
            onClick={resetDraw}
            className="btn btn-lg btn-outline-light border-2 rounded-pill px-4 py-3 fw-bold hover-lift"
            style={{minHeight: '60px'}}
          >
            <i className="fas fa-redo me-2"></i>
            Nuevo Sorteo
          </button>
        )}
      </div>
    </div>
  )
}
