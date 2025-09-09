import { useContext, useMemo, useState } from 'react'
import { AppContext } from '../App.jsx'

export default function PurchaseModal({ show, onClose, onCompleted }) {
  const { state, dispatch } = useContext(AppContext)
  const [step, setStep] = useState(1) // 1: Datos, 2: Pago, 3: Confirmación
  const [formData, setFormData] = useState({
    fullName: '',
    documentId: '',
    email: '',
    phone: '',
    address: ''
  })
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const selectedIds = useMemo(() => 
    state.tickets.filter(t => t.status === 'selected').map(t => t.id), 
    [state.tickets]
  )

  const isValidForm = formData.fullName.trim() && 
                     formData.documentId.trim() && 
                     /.+@.+\..+/.test(formData.email) && 
                     formData.phone.trim() && 
                     formData.address.trim() && 
                     selectedIds.length >= 6

  const isValidPayment = paymentData.cardNumber.replace(/\s/g, '').length === 16 &&
                        paymentData.expiryDate.length === 5 &&
                        paymentData.cvv.length === 3 &&
                        paymentData.cardholderName.trim()

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePaymentChange = (field, value) => {
    setPaymentData(prev => ({ ...prev, [field]: value }))
  }

  const autoCompletePersonalData = () => {
    setFormData({
      fullName: 'Juan Carlos Pérez García',
      documentId: '1234567890',
      email: 'juan.perez@email.com',
      phone: '0987654321',
      address: 'Av. Amazonas 1234, Quito, Ecuador'
    })
  }

  const autoCompletePaymentData = () => {
    setPaymentData({
      cardNumber: '4532 1234 5678 9012',
      expiryDate: '12/25',
      cvv: '123',
      cardholderName: 'JUAN CARLOS PEREZ GARCIA'
    })
  }

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpiryDate = (value) => {
    return value.replace(/\D/g, '').replace(/(.{2})/, '$1/')
  }

  const simulatePayment = async () => {
    setLoading(true)
    setMessage('Procesando pago...')
    
    // Simular validación de tarjeta
    await new Promise(r => setTimeout(r, 1500))
    
    // Simular verificación con banco
    setMessage('Verificando con el banco...')
    await new Promise(r => setTimeout(r, 2000))
    
    // Simular autorización
    setMessage('Autorizando transacción...')
    await new Promise(r => setTimeout(r, 1000))
    
    setMessage('Pago aprobado ✅')
    await new Promise(r => setTimeout(r, 500))
    
    setLoading(false)
    setStep(3)
  }

  const simulateEmailSending = async () => {
    setLoading(true)
    setMessage('Enviando boletos por correo...')
    
    await new Promise(r => setTimeout(r, 2000))
    
    setMessage('Correo enviado exitosamente ✅')
    await new Promise(r => setTimeout(r, 1000))
    
    setLoading(false)
  }

  const handleCompletePurchase = async () => {
    const orderId = `ORD-${Date.now()}`
    const buyer = { ...formData }
    
    // Confirmar compra
    dispatch({ type: 'CONFIRM_PURCHASE', payload: { buyer, selectedIds, orderId } })
    
    // Simular envío de email
    await simulateEmailSending()
    
    // Generar comprobante
    const receipt = {
      orderId,
      buyer,
      tickets: selectedIds,
      amount: selectedIds.length * 10, // $10 por boleto
      paymentMethod: 'Tarjeta de Crédito',
      date: new Date().toISOString(),
      status: 'Completado'
    }
    
    // Guardar comprobante
    dispatch({ type: 'SAVE_RECEIPT', payload: receipt })
    
    if (onCompleted) onCompleted(orderId)
    onClose()
  }

  const handleClose = () => {
    setStep(1)
    setFormData({
      fullName: '',
      documentId: '',
      email: '',
      phone: '',
      address: ''
    })
    setPaymentData({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    })
    setMessage('')
    onClose()
  }

  if (!show) return null

  return (
    <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.8)'}}>
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content glass border-0">
          <div className="modal-header border-0 p-3 p-md-4">
            <h5 className="modal-title text-white fw-bold h6 h-md-5">
              <i className="fas fa-shopping-cart me-2 d-none d-md-inline"></i>
              <span className="d-md-none">🛒</span>
              Proceso de Compra
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={handleClose}
            ></button>
          </div>
          
          <div className="modal-body p-3 p-md-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="d-flex justify-content-between mb-2">
                <span className={`small ${step >= 1 ? 'text-white' : 'text-white-50'}`}>
                  <i className="fas fa-user me-1"></i>Datos Personales
                </span>
                <span className={`small ${step >= 2 ? 'text-white' : 'text-white-50'}`}>
                  <i className="fas fa-credit-card me-1"></i>Pago
                </span>
                <span className={`small ${step >= 3 ? 'text-white' : 'text-white-50'}`}>
                  <i className="fas fa-check me-1"></i>Confirmación
                </span>
              </div>
              <div className="progress" style={{height: '4px'}}>
                <div 
                  className="progress-bar gradient-primary" 
                  style={{width: `${(step / 3) * 100}%`}}
                ></div>
              </div>
            </div>

            {/* Step 1: Datos Personales */}
            {step === 1 && (
              <div className="animate-fade-in">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="text-white mb-0">
                    <i className="fas fa-user me-2"></i>Información del Comprador
                  </h6>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light rounded-pill px-3 py-1"
                    onClick={autoCompletePersonalData}
                    title="Autocompletar con datos de ejemplo"
                  >
                    <i className="fas fa-magic me-1"></i>
                    <span className="d-none d-sm-inline">Autocompletar</span>
                    <span className="d-sm-none">Auto</span>
                  </button>
                </div>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label text-white fw-semibold mb-2">Nombre completo</label>
                    <input 
                      type="text"
                      className="form-control border-0 rounded-pill px-4 py-3"
                      style={{background: 'rgba(255,255,255,0.9)', color: '#333'}}
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Ingresa tu nombre completo"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-white fw-semibold mb-2">Cédula/ID</label>
                    <input 
                      type="text"
                      className="form-control border-0 rounded-pill px-4 py-3"
                      style={{background: 'rgba(255,255,255,0.9)', color: '#333'}}
                      value={formData.documentId}
                      onChange={(e) => handleInputChange('documentId', e.target.value)}
                      placeholder="Número de identificación"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-white fw-semibold mb-2">Correo electrónico</label>
                    <input 
                      type="email"
                      className="form-control border-0 rounded-pill px-4 py-3"
                      style={{background: 'rgba(255,255,255,0.9)', color: '#333'}}
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-white fw-semibold mb-2">Teléfono</label>
                    <input 
                      type="tel"
                      className="form-control border-0 rounded-pill px-4 py-3"
                      style={{background: 'rgba(255,255,255,0.9)', color: '#333'}}
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Número de teléfono"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label text-white fw-semibold mb-2">Dirección</label>
                    <textarea 
                      className="form-control border-0 rounded-3 px-4 py-3"
                      rows="3"
                      style={{background: 'rgba(255,255,255,0.9)', color: '#333'}}
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Dirección completa"
                    ></textarea>
                  </div>
                </div>
                
                <div className="glass-dark rounded-3 p-3 mt-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="text-white-50 small">Boletos seleccionados</div>
                      <div className="h5 fw-bold text-white">{selectedIds.length} boletos</div>
                    </div>
                    <div className="text-end">
                      <div className="text-white-50 small">Total</div>
                      <div className="h5 fw-bold text-gradient">${selectedIds.length * 10}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Pago */}
            {step === 2 && (
              <div className="animate-fade-in">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="text-white mb-0">
                    <i className="fas fa-credit-card me-2"></i>Información de Pago
                  </h6>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light rounded-pill px-3 py-1"
                    onClick={autoCompletePaymentData}
                    title="Autocompletar con datos de tarjeta de ejemplo"
                  >
                    <i className="fas fa-magic me-1"></i>
                    <span className="d-none d-sm-inline">Autocompletar</span>
                    <span className="d-sm-none">Auto</span>
                  </button>
                </div>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label text-white fw-semibold mb-2">Número de tarjeta</label>
                    <input 
                      type="text"
                      className="form-control border-0 rounded-pill px-4 py-3"
                      style={{background: 'rgba(255,255,255,0.9)', color: '#333'}}
                      value={paymentData.cardNumber}
                      onChange={(e) => handlePaymentChange('cardNumber', formatCardNumber(e.target.value))}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-white fw-semibold mb-2">Fecha de vencimiento</label>
                    <input 
                      type="text"
                      className="form-control border-0 rounded-pill px-4 py-3"
                      style={{background: 'rgba(255,255,255,0.9)', color: '#333'}}
                      value={paymentData.expiryDate}
                      onChange={(e) => handlePaymentChange('expiryDate', formatExpiryDate(e.target.value))}
                      placeholder="MM/AA"
                      maxLength="5"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label text-white fw-semibold mb-2">CVV</label>
                    <input 
                      type="text"
                      className="form-control border-0 rounded-pill px-4 py-3"
                      style={{background: 'rgba(255,255,255,0.9)', color: '#333'}}
                      value={paymentData.cvv}
                      onChange={(e) => handlePaymentChange('cvv', e.target.value.replace(/\D/g, ''))}
                      placeholder="123"
                      maxLength="3"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label text-white fw-semibold mb-2">Nombre en la tarjeta</label>
                    <input 
                      type="text"
                      className="form-control border-0 rounded-pill px-4 py-3"
                      style={{background: 'rgba(255,255,255,0.9)', color: '#333'}}
                      value={paymentData.cardholderName}
                      onChange={(e) => handlePaymentChange('cardholderName', e.target.value)}
                      placeholder="Nombre como aparece en la tarjeta"
                    />
                  </div>
                </div>
                
                <div className="glass-dark rounded-3 p-3 mt-4">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <i className="fas fa-shield-alt text-success"></i>
                    <span className="text-white fw-semibold">Pago Seguro</span>
                  </div>
                  <div className="text-white-50 small">
                    Tu información está protegida con encriptación SSL de 256 bits
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Confirmación */}
            {step === 3 && (
              <div className="animate-fade-in text-center">
                <div className="fs-1 mb-3">🎉</div>
                <h5 className="text-white fw-bold mb-3">¡Compra Exitosa!</h5>
                <div className="glass-dark rounded-3 p-4 mb-4">
                  <div className="row g-3 text-start">
                    <div className="col-6">
                      <div className="text-white-50 small">Orden</div>
                      <div className="text-white fw-semibold">ORD-{Date.now()}</div>
                    </div>
                    <div className="col-6">
                      <div className="text-white-50 small">Total</div>
                      <div className="text-white fw-semibold">${selectedIds.length * 10}</div>
                    </div>
                    <div className="col-12">
                      <div className="text-white-50 small">Boletos</div>
                      <div className="text-white fw-semibold font-monospace">
                        {selectedIds.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="d-flex flex-column gap-2 text-start">
                  <div className="d-flex align-items-center gap-2 text-white-50">
                    <i className="fas fa-check-circle text-success"></i>
                    <span>Pago procesado exitosamente</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-white-50">
                    <i className="fas fa-check-circle text-success"></i>
                    <span>Comprobante generado</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 text-white-50">
                    <i className="fas fa-check-circle text-success"></i>
                    <span>Boletos enviados por email</span>
                  </div>
                </div>
              </div>
            )}

            {message && (
              <div className="mt-3 text-center">
                <div className={`badge fs-6 px-3 py-2 ${message.includes('✅') ? 'bg-success' : 'bg-info'}`}>
                  {loading && <span className="spinner-border spinner-border-sm me-2"></span>}
                  {message}
                </div>
              </div>
            )}
          </div>
          
          <div className="modal-footer border-0">
            {step === 1 && (
              <div className="w-100 d-flex justify-content-between">
                <button 
                  type="button" 
                  className="btn btn-outline-light" 
                  onClick={handleClose}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn gradient-primary text-white border-0"
                  disabled={!isValidForm}
                  onClick={() => setStep(2)}
                >
                  Continuar al Pago
                </button>
              </div>
            )}
            
            {step === 2 && (
              <div className="w-100 d-flex justify-content-between">
                <button 
                  type="button" 
                  className="btn btn-outline-light" 
                  onClick={() => setStep(1)}
                >
                  Atrás
                </button>
                <button 
                  type="button" 
                  className="btn gradient-primary text-white border-0"
                  disabled={!isValidPayment || loading}
                  onClick={simulatePayment}
                >
                  {loading ? 'Procesando...' : 'Procesar Pago'}
                </button>
              </div>
            )}
            
            {step === 3 && (
              <div className="w-100">
                <button 
                  type="button" 
                  className="btn gradient-primary text-white border-0 w-100"
                  onClick={handleCompletePurchase}
                >
                  Finalizar Compra
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
