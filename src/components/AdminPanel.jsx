import { useContext, useMemo, useState } from 'react'
import { AppContext } from '../App.jsx'
import EconomicDraw from './EconomicDraw.jsx'
import MajorDraw from './MajorDraw.jsx'

export default function AdminPanel() {
  const { state, dispatch } = useContext(AppContext)
  const [winner, setWinner] = useState(null)
  const [showConfig, setShowConfig] = useState(false)
  const [configForm, setConfigForm] = useState({
    ticketPrice: state.raffleConfig?.ticketPrice || 10,
    totalTickets: state.raffleConfig?.totalTickets || '',
    minTicketNumber: state.raffleConfig?.minTicketNumber || 1,
    maxTicketNumber: state.raffleConfig?.maxTicketNumber || 99999
  })

  const soldTickets = useMemo(() => 
    state.tickets
      .filter(t => t.status === 'sold')
      .sort((a, b) => parseInt(a.number) - parseInt(b.number)), 
    [state.tickets]
  )

  const stats = {
    total: state.tickets.length,
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

  const handleConfigChange = (field, value) => {
    setConfigForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSaveConfig = () => {
    // Validaciones
    if (configForm.ticketPrice < 1) {
      alert('El precio del boleto debe ser mayor a 0')
      return
    }
    
    if (configForm.totalTickets && (configForm.totalTickets < 1 || configForm.totalTickets > 99999)) {
      alert('La cantidad de boletos debe estar entre 1 y 99999')
      return
    }
    
    if (configForm.minTicketNumber < 1 || configForm.minTicketNumber > 99999) {
      alert('El número mínimo debe estar entre 1 y 99999')
      return
    }
    
    if (configForm.maxTicketNumber < 1 || configForm.maxTicketNumber > 99999) {
      alert('El número máximo debe estar entre 1 y 99999')
      return
    }
    
    if (configForm.minTicketNumber >= configForm.maxTicketNumber) {
      alert('El número mínimo debe ser menor al número máximo')
      return
    }

    // Guardar configuración
    dispatch({
      type: 'UPDATE_RAFFLE_CONFIG',
      payload: {
        ticketPrice: Number(configForm.ticketPrice),
        totalTickets: configForm.totalTickets ? Number(configForm.totalTickets) : null,
        minTicketNumber: Number(configForm.minTicketNumber),
        maxTicketNumber: Number(configForm.maxTicketNumber)
      }
    })

    setShowConfig(false)
    alert('✅ Configuración guardada exitosamente!')
  }

  const handleResetConfig = () => {
    if (window.confirm('¿Estás seguro de que quieres resetear la configuración a los valores por defecto?')) {
      dispatch({ type: 'RESET_RAFFLE_CONFIG' })
      setConfigForm({
        ticketPrice: 10,
        totalTickets: '',
        minTicketNumber: 1,
        maxTicketNumber: 99999
      })
      alert('✅ Configuración reseteada a los valores por defecto!')
    }
  }

  return (
    <div>
      {/* Estadísticas */}
      <div className="row g-2 g-md-4 mb-3 mb-md-5">
        <div className="col-6 col-sm-6 col-md-3">
          <div className="glass rounded-3 rounded-md-4 p-2 p-md-4 text-center hover-lift animate-fade-in">
            <div className="fs-1 mb-2 mb-md-3">📊</div>
            <div className="small text-uppercase fw-bold text-white-50 mb-1 mb-md-2">Total</div>
            <div className="h4 h-md-display-4 fw-bold text-gradient">{stats.total}</div>
            <div className="small text-white-50 mt-1 mt-md-2 d-none d-sm-block">Boletos totales</div>
          </div>
        </div>
        <div className="col-6 col-sm-6 col-md-3">
          <div className="glass rounded-3 rounded-md-4 p-2 p-md-4 text-center hover-lift animate-fade-in" style={{animationDelay: '0.1s'}}>
            <div className="fs-1 mb-2 mb-md-3">🎫</div>
            <div className="small text-uppercase fw-bold text-white-50 mb-1 mb-md-2">Disponibles</div>
            <div className="h4 h-md-display-4 fw-bold text-gradient">{stats.available}</div>
            <div className="small text-white-50 mt-1 mt-md-2 d-none d-sm-block">Boletos disponibles</div>
          </div>
        </div>
        <div className="col-6 col-sm-6 col-md-3">
          <div className="glass rounded-3 rounded-md-4 p-2 p-md-4 text-center hover-lift animate-fade-in" style={{animationDelay: '0.2s'}}>
            <div className="fs-1 mb-2 mb-md-3">⏳</div>
            <div className="small text-uppercase fw-bold text-white-50 mb-1 mb-md-2">Seleccionados</div>
            <div className="h4 h-md-display-4 fw-bold text-gradient">{stats.selected}</div>
            <div className="small text-white-50 mt-1 mt-md-2 d-none d-sm-block">En proceso de compra</div>
          </div>
        </div>
        <div className="col-6 col-sm-6 col-md-3">
          <div className="glass rounded-3 rounded-md-4 p-2 p-md-4 text-center hover-lift animate-fade-in" style={{animationDelay: '0.3s'}}>
            <div className="fs-1 mb-2 mb-md-3">✅</div>
            <div className="small text-uppercase fw-bold text-white-50 mb-1 mb-md-2">Vendidos</div>
            <div className="h4 h-md-display-4 fw-bold text-gradient">{stats.sold}</div>
            <div className="small text-white-50 mt-1 mt-md-2 d-none d-sm-block">Boletos vendidos</div>
          </div>
        </div>
      </div>

      {/* Configuración de la Rifa */}
      <div className="glass rounded-3 rounded-md-4 p-3 p-md-4 mb-4 hover-lift animate-fade-in">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="text-white fw-bold mb-0">
            <i className="fas fa-cog me-2"></i>Configuración de la Rifa
          </h6>
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="btn btn-outline-light btn-sm rounded-pill px-3 py-2"
          >
            <i className={`fas fa-${showConfig ? 'times' : 'edit'} me-1`}></i>
            {showConfig ? 'Cancelar' : 'Configurar'}
          </button>
        </div>

        {!showConfig ? (
          <div className="row g-3">
            <div className="col-6 col-md-3">
              <div className="glass-dark rounded-3 p-3 text-center">
                <div className="fs-4 mb-2">💰</div>
                <div className="small text-white-50">Precio por Boleto</div>
                <div className="h5 fw-bold text-white">${state.raffleConfig?.ticketPrice || 10}</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="glass-dark rounded-3 p-3 text-center">
                <div className="fs-4 mb-2">🎫</div>
                <div className="small text-white-50">Cantidad Total</div>
                <div className="h5 fw-bold text-white">
                  {state.raffleConfig?.totalTickets ? state.raffleConfig.totalTickets : 'Automático'}
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="glass-dark rounded-3 p-3 text-center">
                <div className="fs-4 mb-2">🔢</div>
                <div className="small text-white-50">Rango de Números</div>
                <div className="h6 fw-bold text-white">
                  {state.raffleConfig?.minTicketNumber || 1} - {state.raffleConfig?.maxTicketNumber || 99999}
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="glass-dark rounded-3 p-3 text-center">
                <div className="fs-4 mb-2">📊</div>
                <div className="small text-white-50">Estado</div>
                <div className="h6 fw-bold text-success">Configurado</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-dark rounded-3 p-4">
            <h6 className="text-white fw-bold mb-4">⚙️ Configurar Parámetros de la Rifa</h6>
            
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label text-white fw-semibold">
                  <i className="fas fa-dollar-sign me-1"></i>Precio por Boleto
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-dark text-white border-secondary">$</span>
                  <input
                    type="number"
                    className="form-control bg-dark text-white border-secondary"
                    value={configForm.ticketPrice}
                    onChange={(e) => handleConfigChange('ticketPrice', e.target.value)}
                    min="1"
                    step="0.01"
                    placeholder="10.00"
                  />
                </div>
                <div className="form-text text-white-50">Precio en dólares por cada boleto</div>
              </div>

              <div className="col-md-6">
                <label className="form-label text-white fw-semibold">
                  <i className="fas fa-ticket-alt me-1"></i>Cantidad Total de Boletos
                </label>
                <input
                  type="number"
                  className="form-control bg-dark text-white border-secondary"
                  value={configForm.totalTickets}
                  onChange={(e) => handleConfigChange('totalTickets', e.target.value)}
                  min="1"
                  max="99999"
                  placeholder="Dejar vacío para automático (1-99999)"
                />
                <div className="form-text text-white-50">
                  Dejar vacío para permitir cualquier cantidad entre el rango configurado
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label text-white fw-semibold">
                  <i className="fas fa-sort-numeric-down me-1"></i>Número Mínimo
                </label>
                <input
                  type="number"
                  className="form-control bg-dark text-white border-secondary"
                  value={configForm.minTicketNumber}
                  onChange={(e) => handleConfigChange('minTicketNumber', e.target.value)}
                  min="1"
                  max="99999"
                  placeholder="1"
                />
                <div className="form-text text-white-50">Número de boleto más bajo permitido</div>
              </div>

              <div className="col-md-6">
                <label className="form-label text-white fw-semibold">
                  <i className="fas fa-sort-numeric-up me-1"></i>Número Máximo
                </label>
                <input
                  type="number"
                  className="form-control bg-dark text-white border-secondary"
                  value={configForm.maxTicketNumber}
                  onChange={(e) => handleConfigChange('maxTicketNumber', e.target.value)}
                  min="1"
                  max="99999"
                  placeholder="99999"
                />
                <div className="form-text text-white-50">Número de boleto más alto permitido</div>
              </div>
            </div>

            <div className="d-flex gap-3 mt-4">
              <button
                onClick={handleSaveConfig}
                className="btn btn-success rounded-pill px-4 py-2 fw-bold"
              >
                <i className="fas fa-save me-2"></i>Guardar Configuración
              </button>
              <button
                onClick={handleResetConfig}
                className="btn btn-warning rounded-pill px-4 py-2 fw-bold"
              >
                <i className="fas fa-undo me-2"></i>Resetear
              </button>
              <button
                onClick={() => setShowConfig(false)}
                className="btn btn-outline-light rounded-pill px-4 py-2 fw-bold"
              >
                <i className="fas fa-times me-2"></i>Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Información Detallada de Boletos */}
      <div className="glass rounded-3 rounded-md-4 p-3 p-md-4 mb-4 hover-lift animate-fade-in">
        <h6 className="text-white fw-bold mb-3">
          <i className="fas fa-chart-pie me-2"></i>Información Detallada de Boletos
        </h6>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="glass-dark rounded-3 p-3">
              <h6 className="text-white fw-semibold mb-3">📈 Distribución de Boletos</h6>
              <div className="space-y-2">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-white-50 small">Disponibles:</span>
                  <div className="d-flex align-items-center gap-2">
                    <div className="progress" style={{width: '100px', height: '8px'}}>
                      <div 
                        className="progress-bar bg-info" 
                        style={{width: `${stats.total > 0 ? (stats.available / stats.total) * 100 : 0}%`}}
                      ></div>
                    </div>
                    <span className="text-white fw-bold small">{stats.available}/{stats.total}</span>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-white-50 small">Seleccionados:</span>
                  <div className="d-flex align-items-center gap-2">
                    <div className="progress" style={{width: '100px', height: '8px'}}>
                      <div 
                        className="progress-bar bg-warning" 
                        style={{width: `${stats.total > 0 ? (stats.selected / stats.total) * 100 : 0}%`}}
                      ></div>
                    </div>
                    <span className="text-white fw-bold small">{stats.selected}/{stats.total}</span>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-white-50 small">Vendidos:</span>
                  <div className="d-flex align-items-center gap-2">
                    <div className="progress" style={{width: '100px', height: '8px'}}>
                      <div 
                        className="progress-bar bg-success" 
                        style={{width: `${stats.total > 0 ? (stats.sold / stats.total) * 100 : 0}%`}}
                      ></div>
                    </div>
                    <span className="text-white fw-bold small">{stats.sold}/{stats.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="glass-dark rounded-3 p-3">
              <h6 className="text-white fw-semibold mb-3">📊 Estadísticas de Ventas</h6>
              <div className="space-y-2">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-white-50 small">Tasa de venta:</span>
                  <span className="text-white fw-bold">
                    {stats.total > 0 ? ((stats.sold / stats.total) * 100).toFixed(1) : 0}%
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-white-50 small">Boletos en proceso:</span>
                  <span className="text-warning fw-bold">{stats.selected}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-white-50 small">Capacidad restante:</span>
                  <span className="text-info fw-bold">{100 - stats.total}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-white-50 small">Ingresos estimados:</span>
                  <span className="text-success fw-bold">${stats.sold * (state.raffleConfig?.ticketPrice || 10)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sorteos */}
      <div className="row g-4 mb-4">
        <div className="col-12">
          <h6 className="text-white fw-bold mb-3">
            <i className="fas fa-dice me-2"></i>Sistema de Sorteos
          </h6>
        </div>
        <div className="col-md-6">
          <EconomicDraw />
        </div>
        <div className="col-md-6">
          <MajorDraw />
        </div>
      </div>
      
      {/* Botones de Control */}
      <div className="text-center mb-5">
        <div className="row g-3 justify-content-center">
          <div className="col-12 col-sm-6 col-md-4">
            <button 
              onClick={() => {
                // Crear datos de prueba
                const testEconomicWinners = [{
                  id: 'test-eco-1',
                  ticketNumber: '12345',
                  buyerName: 'Juan Pérez',
                  prizeAmount: 100,
                  drawDate: new Date().toISOString(),
                  type: 'economic'
                }]
                
                const testMajorWinners = [{
                  id: 'test-major-1',
                  ticketNumber: '67890',
                  buyerName: 'María García',
                  prizeDescription: 'Camioneta Toyota Hilux 2024',
                  drawDate: new Date().toISOString(),
                  type: 'major'
                }, {
                  id: 'test-major-2',
                  ticketNumber: '11111',
                  buyerName: 'Carlos López',
                  prizeDescription: 'Casa de 3 habitaciones',
                  drawDate: new Date().toISOString(),
                  type: 'major'
                }]
                
                dispatch({ type: 'ADD_ECONOMIC_WINNERS', payload: testEconomicWinners })
                dispatch({ type: 'ADD_MAJOR_WINNER', payload: testMajorWinners })
              }}
              className="btn btn-lg btn-outline-info border-2 rounded-pill px-3 px-md-4 py-2 py-md-3 fw-bold hover-lift w-100"
              style={{minHeight: '50px'}}
            >
              <i className="fas fa-flask me-2"></i>
              <span className="d-none d-sm-inline">Datos de Prueba</span>
              <span className="d-sm-none">Prueba</span>
            </button>
          </div>
          <div className="col-12 col-sm-6 col-md-4">
            <button 
              onClick={() => {
                if (window.confirm('¿Estás seguro de que quieres limpiar todos los ganadores? Esto eliminará todos los registros de sorteos.')) {
                  dispatch({ type: 'CLEAR_ALL_WINNERS' })
                }
              }}
              className="btn btn-lg btn-outline-warning border-2 rounded-pill px-3 px-md-4 py-2 py-md-3 fw-bold hover-lift w-100"
              style={{minHeight: '50px'}}
            >
              <i className="fas fa-trophy me-2"></i>
              <span className="d-none d-sm-inline">Limpiar Ganadores</span>
              <span className="d-sm-none">Limpiar</span>
            </button>
          </div>
          <div className="col-12 col-sm-12 col-md-4">
            <button 
              onClick={() => {
                if (window.confirm('¿Estás seguro de que quieres resetear toda la aplicación? Esto eliminará todos los datos guardados.')) {
                  dispatch({ type: 'RESET_APPLICATION' })
                }
              }}
              className="btn btn-lg btn-outline-light border-2 rounded-pill px-3 px-md-4 py-2 py-md-3 fw-bold hover-lift w-100"
              style={{minHeight: '50px'}}
            >
              <i className="fas fa-trash-alt me-2"></i>
              <span className="d-none d-sm-inline">Reset App</span>
              <span className="d-sm-none">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Resumen de Boletos */}
      <div className="glass rounded-4 p-4 mb-4 hover-lift animate-fade-in">
        <div className="text-center mb-4">
          <div className="fs-1 mb-3">🎯</div>
          <h3 className="h4 fw-bold text-white mb-2">Resumen de Boletos</h3>
          <p className="text-white-50">Información general sobre el estado de los boletos</p>
        </div>
        
        <div className="row g-3">
          <div className="col-md-4">
            <div className="glass-dark rounded-3 p-3 text-center">
              <div className="fs-2 mb-2">🎫</div>
              <div className="h5 fw-bold text-white mb-1">Total de Boletos</div>
              <div className="display-6 fw-bold text-gradient">{stats.total}</div>
              <div className="small text-white-50">de 100 máximo</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="glass-dark rounded-3 p-3 text-center">
              <div className="fs-2 mb-2">📈</div>
              <div className="h5 fw-bold text-white mb-1">Progreso de Venta</div>
              <div className="display-6 fw-bold text-gradient">
                {stats.total > 0 ? ((stats.sold / stats.total) * 100).toFixed(1) : 0}%
              </div>
              <div className="small text-white-50">{stats.sold} vendidos</div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="glass-dark rounded-3 p-3 text-center">
              <div className="fs-2 mb-2">💰</div>
              <div className="h5 fw-bold text-white mb-1">Ingresos</div>
              <div className="display-6 fw-bold text-gradient">${stats.sold * (state.raffleConfig?.ticketPrice || 10)}</div>
              <div className="small text-white-50">Recaudado</div>
            </div>
          </div>
        </div>
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
              const purchase = state.purchases.find(p => p.tickets.includes(t.number))
              return (
                <div key={t.id} className="col-md-6 col-lg-4">
                  <div className="glass-dark rounded-3 p-3 d-flex align-items-center justify-content-between hover-lift" 
                       style={{animationDelay: `${index * 0.05}s`}}>
                    <div className="d-flex align-items-center gap-3">
                      <div className="fs-4">🎫</div>
                      <div>
                        <div className="fw-bold font-monospace text-white">#{t.number}</div>
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
