import { useContext, useMemo, useState } from 'react'
import { AppContext } from '../App.jsx'

export default function PurchaseForm({ onCompleted }) {
  const { state, dispatch } = useContext(AppContext)
  const [fullName, setFullName] = useState('')
  const [documentId, setDocumentId] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const selectedIds = useMemo(() => state.tickets.filter(t => t.status === 'selected').map(t => t.id), [state.tickets])

  const isValid = fullName.trim() && documentId.trim() && /.+@.+\..+/.test(email) && phone.trim() && selectedIds.length >= 6

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isValid) return
    setLoading(true)
    setMessage('Procesando pago...')
    await new Promise(r => setTimeout(r, 800))
    const orderId = `ORD-${Date.now()}`
    setMessage('Pago aprobado ✅')
    const buyer = { fullName, documentId, email, phone }
    dispatch({ type: 'CONFIRM_PURCHASE', payload: { buyer, selectedIds, orderId } })
    await new Promise(r => setTimeout(r, 300))
    setLoading(false)
    if (onCompleted) onCompleted(orderId)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="position-relative">
            <label className="form-label text-white fw-semibold mb-2">
              <i className="fas fa-user me-2"></i>Nombre completo
            </label>
            <input 
              value={fullName} 
              onChange={e => setFullName(e.target.value)} 
              className="form-control form-control-lg glass-dark text-white border-0 rounded-pill px-4 py-3" 
              placeholder="Ingresa tu nombre completo"
              style={{background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)'}}
              required 
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="position-relative">
            <label className="form-label text-white fw-semibold mb-2">
              <i className="fas fa-id-card me-2"></i>Cédula/ID
            </label>
            <input 
              value={documentId} 
              onChange={e => setDocumentId(e.target.value)} 
              className="form-control form-control-lg glass-dark text-white border-0 rounded-pill px-4 py-3" 
              placeholder="Número de identificación"
              style={{background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)'}}
              required 
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="position-relative">
            <label className="form-label text-white fw-semibold mb-2">
              <i className="fas fa-envelope me-2"></i>Correo electrónico
            </label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="form-control form-control-lg glass-dark text-white border-0 rounded-pill px-4 py-3" 
              placeholder="tu@email.com"
              style={{background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)'}}
              required 
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="position-relative">
            <label className="form-label text-white fw-semibold mb-2">
              <i className="fas fa-phone me-2"></i>Teléfono
            </label>
            <input 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              className="form-control form-control-lg glass-dark text-white border-0 rounded-pill px-4 py-3" 
              placeholder="Número de teléfono"
              style={{background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)'}}
              required 
            />
          </div>
        </div>
      </div>
      
      <div className="glass-dark rounded-pill p-3 mb-4 text-center">
        <div className="text-white-50 small mb-1">Boletos seleccionados</div>
        <div className="h4 fw-bold text-gradient mb-0">{selectedIds.length} <span className="small text-white-50">/ 6 mínimo</span></div>
      </div>
      
      <button 
        disabled={!isValid || loading} 
        className={`w-100 btn btn-lg rounded-pill fw-bold py-3 ${!isValid || loading ? 'btn-secondary' : 'gradient-primary text-white border-0'} hover-lift`}
        style={{minHeight: '60px'}}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Procesando pago...
          </>
        ) : (
          <>
            <i className="fas fa-credit-card me-2"></i>
            Confirmar compra
          </>
        )}
      </button>
      
      {message && (
        <div className="mt-3 text-center">
          <div className={`badge fs-6 px-3 py-2 ${message.includes('✅') ? 'bg-success' : 'bg-info'}`}>
            {message}
          </div>
        </div>
      )}
    </form>
  )
}
