import { useContext, useState, useEffect } from 'react'
import { AppContext } from '../App.jsx'
import DuplicateNumberModal from './DuplicateNumberModal.jsx'

export default function TicketPackages({ onMinSelectionInvalid }) {
  const { state, dispatch } = useContext(AppContext)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [customNumbers, setCustomNumbers] = useState([])
  const [currentNumber, setCurrentNumber] = useState('')
  const [showNumberInput, setShowNumberInput] = useState(false)
  const [customQuantity, setCustomQuantity] = useState(6)
  const [showQuantityInput, setShowQuantityInput] = useState(false)


  const selectedNumbers = state.tickets.filter(t => t.status === 'selected').map(t => t.number)
  const minRequired = selectedPackage ? 
    (selectedPackage.count === 'custom' ? customQuantity : selectedPackage.count) : 6

  // Usar useEffect para evitar llamar setState durante el render
  useEffect(() => {
    if (onMinSelectionInvalid) {
      onMinSelectionInvalid(selectedNumbers.length < minRequired)
    }
  }, [selectedNumbers.length, minRequired, onMinSelectionInvalid])

  // Verificar si existen los paquetes, si no, usar paquetes por defecto
  const ticketPackages = state.ticketPackages || [
    { id: 'package-6', name: 'Paquete Básico', count: 6, price: 60, description: '6 boletos personalizados' },
    { id: 'package-10', name: 'Paquete Estándar', count: 10, price: 95, description: '10 boletos personalizados' },
    { id: 'package-15', name: 'Paquete Premium', count: 15, price: 135, description: '15 boletos personalizados' },
    { id: 'package-20', name: 'Paquete VIP', count: 20, price: 170, description: '20 boletos personalizados' },
    { id: 'package-custom', name: 'Cantidad Personalizada', count: 'custom', price: 0, description: 'Elige tu cantidad (mín. 6 boletos)' }
  ]

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg)
    setCustomNumbers([])
    // Limpiar números seleccionados al cambiar paquete
    selectedNumbers.forEach(number => {
      dispatch({ type: 'REMOVE_TICKET_NUMBER', payload: number })
    })
    
    if (pkg.count === 'custom') {
      setShowQuantityInput(true)
      setShowNumberInput(false)
    } else {
      setShowQuantityInput(false)
      setShowNumberInput(true)
    }
  }

  const handleNumberSubmit = (e) => {
    e.preventDefault()
    if (currentNumber.length === 5 && /^\d{5}$/.test(currentNumber) && currentNumber !== '00000') {
      dispatch({ type: 'ADD_TICKET_NUMBER', payload: { number: currentNumber } })
      setCurrentNumber('')
    }
  }

  const handleRemoveNumber = (number) => {
    dispatch({ type: 'REMOVE_TICKET_NUMBER', payload: number })
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const handleAlternativeNumberSelect = (number) => {
    dispatch({ type: 'ADD_ALTERNATIVE_TICKET_NUMBER', payload: { number } })
    setCurrentNumber('')
  }

  const handleCloseDuplicateModal = () => {
    dispatch({ type: 'CLEAR_DUPLICATE_NUMBER' })
  }

  const handleQuantityConfirm = () => {
    if (customQuantity >= 6) {
      setShowQuantityInput(false)
      setShowNumberInput(true)
    }
  }

  const calculatePrice = (quantity) => {
    if (quantity <= 6) return quantity * 10
    if (quantity <= 10) return quantity * 9.5
    if (quantity <= 15) return quantity * 9
    return quantity * 8.5
  }

  return (
    <div>
      {/* Selección de Paquetes */}
      {!showNumberInput && !showQuantityInput && (
        <div className="mb-4">
          <h6 className="text-white fw-bold mb-3">
            <i className="fas fa-gift me-2"></i>Selecciona tu paquete de boletos
          </h6>
          <div className="row g-3">
            {ticketPackages.map((pkg) => (
              <div key={pkg.id} className="col-md-6 col-lg-3">
                <div 
                  className={`glass rounded-3 p-3 text-center hover-lift cursor-pointer ${selectedPackage?.id === pkg.id ? 'animate-glow' : ''}`}
                  onClick={() => handlePackageSelect(pkg)}
                  style={{ cursor: 'pointer', minHeight: '150px' }}
                >
                  <div className="fs-1 mb-2">🎫</div>
                  <h6 className="fw-bold text-white mb-2">{pkg.name}</h6>
                  <div className="h4 fw-bold text-gradient mb-2">{pkg.count} boletos</div>
                  <div className="h5 fw-bold text-white mb-2">${pkg.price}</div>
                  <div className="small text-white-50">{pkg.description}</div>
                  <div className="mt-2">
                    <span className="badge bg-success">${(pkg.price / pkg.count).toFixed(1)} por boleto</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input de cantidad personalizada */}
      {showQuantityInput && selectedPackage && (
        <div className="glass rounded-3 p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="text-white fw-bold mb-0">
              <i className="fas fa-calculator me-2"></i>Cantidad Personalizada
            </h6>
            <button
              type="button"
              className="btn btn-sm btn-outline-light"
              onClick={() => {
                setShowQuantityInput(false)
                setSelectedPackage(null)
                selectedNumbers.forEach(number => {
                  dispatch({ type: 'REMOVE_TICKET_NUMBER', payload: number })
                })
              }}
            >
              <i className="fas fa-arrow-left me-1"></i>Volver
            </button>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-8">
              <label className="form-label text-white fw-semibold mb-2">Cantidad de boletos (mínimo 6)</label>
              <div className="input-group">
                <input
                  type="number"
                  className="form-control border-0 rounded-pill px-4 py-3"
                  style={{background: 'rgba(255,255,255,0.9)', color: '#333'}}
                  value={customQuantity}
                  onChange={(e) => setCustomQuantity(Math.max(6, parseInt(e.target.value) || 6))}
                  min="6"
                  max="100"
                />
                <button
                  type="button"
                  className="btn gradient-primary text-white border-0 rounded-pill px-4"
                  onClick={handleQuantityConfirm}
                  disabled={customQuantity < 6}
                >
                  <i className="fas fa-check"></i>
                </button>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <div className="text-white-50 small">Precio Total</div>
                <div className="h4 fw-bold text-gradient">${calculatePrice(customQuantity)}</div>
                <div className="text-white-50 small">${(calculatePrice(customQuantity) / customQuantity).toFixed(1)} por boleto</div>
              </div>
            </div>
          </div>

          <div className="glass-dark rounded-3 p-3">
            <div className="row g-3 text-center">
              <div className="col-4">
                <div className="text-white-50 small">Cantidad</div>
                <div className="fw-bold text-white">{customQuantity} boletos</div>
              </div>
              <div className="col-4">
                <div className="text-white-50 small">Precio por Boleto</div>
                <div className="fw-bold text-gradient">${(calculatePrice(customQuantity) / customQuantity).toFixed(1)}</div>
              </div>
              <div className="col-4">
                <div className="text-white-50 small">Descuento</div>
                <div className="fw-bold text-white">
                  {customQuantity >= 20 ? '15%' : customQuantity >= 15 ? '10%' : customQuantity >= 10 ? '5%' : '0%'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input de números personalizados */}
      {showNumberInput && selectedPackage && (
        <div className="glass rounded-3 p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="text-white fw-bold mb-0">
              <i className="fas fa-edit me-2"></i>Ingresa tus números de 5 dígitos
            </h6>
            <button
              type="button"
              className="btn btn-sm btn-outline-light"
              onClick={() => {
                setShowNumberInput(false)
                setSelectedPackage(null)
                selectedNumbers.forEach(number => {
                  dispatch({ type: 'REMOVE_TICKET_NUMBER', payload: number })
                })
              }}
            >
              <i className="fas fa-arrow-left me-1"></i>Cambiar paquete
            </button>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-8">
              <form onSubmit={handleNumberSubmit}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control border-0 rounded-pill px-4 py-3"
                    style={{background: 'rgba(255,255,255,0.9)', color: '#333'}}
                    value={currentNumber}
                    onChange={(e) => setCurrentNumber(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    placeholder="Ingresa un número de 5 dígitos (ej: 12345, desde 00001)"
                    maxLength="5"
                  />
                  <button
                    type="submit"
                    className="btn gradient-primary text-white border-0 rounded-pill px-4"
                    disabled={currentNumber.length !== 5}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </form>
            </div>
            <div className="col-md-4">
              <div className="text-center">
                <div className="text-white-50 small">Progreso</div>
                <div className="h4 fw-bold text-gradient">
                  {selectedNumbers.length}/{selectedPackage.count}
                </div>
                <div className="progress mt-2" style={{height: '6px'}}>
                  <div 
                    className="progress-bar gradient-primary" 
                    style={{width: `${(selectedNumbers.length / selectedPackage.count) * 100}%`}}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Números seleccionados */}
          {selectedNumbers.length > 0 && (
            <div className="mb-3">
              <div className="text-white-50 small mb-2">Números seleccionados:</div>
              <div className="d-flex flex-wrap gap-2">
                {selectedNumbers.map((number) => (
                  <div key={number} className="d-flex align-items-center gap-2 bg-warning text-dark rounded-pill px-3 py-1">
                    <span className="fw-bold font-monospace">{number}</span>
                    <button
                      type="button"
                      className="btn-close btn-close-dark btn-sm"
                      onClick={() => handleRemoveNumber(number)}
                      style={{fontSize: '0.6rem'}}
                    ></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mensaje de error */}
          {state.error && (
            <div className="alert alert-warning d-flex align-items-center justify-content-between" role="alert">
              <div>
                <i className="fas fa-exclamation-triangle me-2"></i>
                {state.error}
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={clearError}
              ></button>
            </div>
          )}

          {/* Información del paquete */}
          <div className="glass-dark rounded-3 p-3">
            <div className="row g-3 text-center">
              <div className="col-4">
                <div className="text-white-50 small">Paquete</div>
                <div className="fw-bold text-white">{selectedPackage.name}</div>
              </div>
              <div className="col-4">
                <div className="text-white-50 small">Precio Total</div>
                <div className="fw-bold text-gradient">
                  ${selectedPackage.count === 'custom' ? calculatePrice(customQuantity) : selectedPackage.price}
                </div>
              </div>
              <div className="col-4">
                <div className="text-white-50 small">Precio por Boleto</div>
                <div className="fw-bold text-white">
                  ${selectedPackage.count === 'custom' 
                    ? (calculatePrice(customQuantity) / customQuantity).toFixed(1)
                    : (selectedPackage.price / selectedPackage.count).toFixed(1)
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para números duplicados */}
      <DuplicateNumberModal
        show={!!state.duplicateNumber}
        onClose={handleCloseDuplicateModal}
        duplicateNumber={state.duplicateNumber}
        onSelectAlternative={handleAlternativeNumberSelect}
      />
    </div>
  )
}
