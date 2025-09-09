import { useContext, useMemo, useState } from 'react'
import TicketGrid from '../components/TicketGrid.jsx'
import PurchaseModal from '../components/PurchaseModal.jsx'
import { AppContext } from '../App.jsx'

export default function Home() {
  const { state } = useContext(AppContext)
  const [showModal, setShowModal] = useState(false)
  const [minInvalid, setMinInvalid] = useState(true)
  const [lastOrder, setLastOrder] = useState(null)

  const selectedIds = useMemo(() => state.tickets.filter(t => t.status === 'selected').map(t => t.id), [state.tickets])

  const lastPurchase = useMemo(() => state.purchases[0] || null, [state.purchases])

  const handlePurchaseCompleted = (orderId) => {
    setShowModal(false)
    setLastOrder(orderId)
  }

  return (
    <div className="container-fluid px-3 px-md-4 py-3 py-md-5">
      <div className="row g-3 g-md-5">
        <div className="col-12 col-lg-8">
          <div className="mb-3 mb-md-5 animate-fade-in">
            <div className="text-center mb-3 mb-md-4">
              <h1 className="display-4 fw-bold text-white mb-2 mb-md-3">🎯 Elige tus boletos de la suerte</h1>
              <p className="lead text-white-75 d-none d-md-block">Selecciona mínimo 6 boletos para participar en esta increíble rifa</p>
              <p className="text-white-75 d-md-none">Selecciona mínimo 6 boletos</p>
            </div>
            <div className="glass rounded-3 rounded-md-4 p-3 p-md-5 hover-lift">
              <TicketGrid onMinSelectionInvalid={setMinInvalid} />
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="sticky-top d-none d-lg-block" style={{top: '120px'}}>
            <div className="glass rounded-4 p-4 mb-4 hover-lift animate-slide-in">
              <div className="text-center mb-4">
                <div className="fs-1 mb-2">🎫</div>
                <h3 className="h4 fw-bold text-white mb-1">Boletos Seleccionados</h3>
                <div className="display-3 fw-bold text-gradient">{selectedIds.length}</div>
                <small className="text-white-50">de 6 mínimo requeridos</small>
              </div>
              <button
                disabled={minInvalid}
                onClick={() => setShowModal(true)}
                className={`w-100 btn btn-lg rounded-pill fw-bold py-3 ${minInvalid ? 'btn-secondary' : 'gradient-primary text-white border-0'} hover-lift`}
                style={{minHeight: '60px'}}
              >
                {minInvalid ? 'Selecciona más boletos' : '🚀 Comprar boletos'}
              </button>
              <div className="text-center mt-3">
                <small className="text-white-50">Mínimo 6 boletos para participar</small>
              </div>
            </div>
          </div>
          
          {/* Panel móvil fijo en la parte inferior */}
          <div className="d-lg-none position-fixed bottom-0 start-0 end-0 p-3" style={{zIndex: 1000}}>
            <div className="glass rounded-3 p-3 hover-lift">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <div className="text-white-50 small">Boletos Seleccionados</div>
                  <div className="h4 fw-bold text-gradient mb-0">{selectedIds.length}/6</div>
                </div>
                <div className="fs-3">🎫</div>
              </div>
              <button
                disabled={minInvalid}
                onClick={() => setShowModal(true)}
                className={`w-100 btn rounded-pill fw-bold py-2 ${minInvalid ? 'btn-secondary' : 'gradient-primary text-white border-0'} hover-lift`}
              >
                {minInvalid ? 'Selecciona más boletos' : '🚀 Comprar boletos'}
              </button>
            </div>
          </div>
          
          <PurchaseModal 
            show={showModal}
            onClose={() => setShowModal(false)}
            onCompleted={handlePurchaseCompleted}
          />
          
          {lastOrder && lastPurchase && (
            <div className="glass rounded-3 rounded-md-4 p-3 p-md-4 hover-lift animate-fade-in mb-3 mb-md-0">
              <div className="text-center mb-3 mb-md-4">
                <div className="fs-1 mb-2">🎉</div>
                <h3 className="h5 h-md-4 fw-bold text-white">¡Compra Exitosa!</h3>
                <div className="badge bg-success fs-6 px-3 py-2">Pago Aprobado ✅</div>
              </div>
              <div className="glass-dark rounded-3 p-3">
                <div className="row g-2 small">
                  <div className="col-4 text-white-50">Orden:</div>
                  <div className="col-8 text-white fw-semibold font-monospace">{lastPurchase.orderId}</div>
                  <div className="col-4 text-white-50">Nombre:</div>
                  <div className="col-8 text-white fw-semibold">{lastPurchase.buyer.fullName}</div>
                  <div className="col-4 text-white-50">Boletos:</div>
                  <div className="col-8 text-white fw-semibold font-monospace">{lastPurchase.tickets.join(', ')}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
