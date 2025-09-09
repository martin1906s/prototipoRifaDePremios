import { useContext, useMemo, useState } from 'react'
import TicketPackages from '../components/TicketPackages.jsx'
import PurchaseModal from '../components/PurchaseModal.jsx'
import WinnersView from '../components/WinnersView.jsx'
import { AppContext } from '../App.jsx'

export default function Home() {
  const { state, dispatch } = useContext(AppContext)
  const [showModal, setShowModal] = useState(false)
  const [minInvalid, setMinInvalid] = useState(true)
  const [lastOrder, setLastOrder] = useState(null)
  const [activeTab, setActiveTab] = useState('tickets') // 'tickets' o 'winners'
  const [isGenerating, setIsGenerating] = useState(false)

  const selectedNumbers = useMemo(() => state.tickets.filter(t => t.status === 'selected').map(t => t.number), [state.tickets])

  const lastPurchase = useMemo(() => state.purchases[0] || null, [state.purchases])

  // Calcular boletos disponibles para el botón de prueba
  const availableTickets = useMemo(() => 
    state.tickets.filter(ticket => ticket.status === 'available').length, 
    [state.tickets]
  )
  
  const canGenerateTestPurchases = !isGenerating && state.tickets.length < (state.raffleConfig?.totalTickets || 100)

  const handlePurchaseCompleted = (orderId) => {
    setShowModal(false)
    setLastOrder(orderId)
  }

  const generateTestPurchases = () => {
    // Función para verificar si un número de boleto está disponible
    const isTicketAvailable = (ticketNumber) => {
      // Validar formato del número (debe ser de 5 dígitos)
      if (!/^\d{5}$/.test(ticketNumber)) {
        return false
      }
      
      // Verificar que el número esté en el rango válido configurado
      const numValue = parseInt(ticketNumber)
      const minNumber = state.raffleConfig?.minTicketNumber || 1
      const maxNumber = state.raffleConfig?.maxTicketNumber || 100
      if (numValue < minNumber || numValue > maxNumber) {
        return false
      }
      
      // Verificar que no esté ocupado
      return !state.tickets.some(ticket => 
        ticket.number === ticketNumber && 
        (ticket.status === 'selected' || ticket.status === 'sold')
      )
    }

    // Obtener configuración actual
    const minNumber = state.raffleConfig?.minTicketNumber || 1
    const maxNumber = state.raffleConfig?.maxTicketNumber || 100
    const maxTickets = state.raffleConfig?.totalTickets || 100
    const ticketPrice = state.raffleConfig?.ticketPrice || 10

    // Calcular boletos disponibles
    const availableTickets = state.tickets.filter(ticket => ticket.status === 'available').length
    const selectedTickets = state.tickets.filter(ticket => ticket.status === 'selected').length
    const soldTickets = state.tickets.filter(ticket => ticket.status === 'sold').length
    const totalTicketsUsed = state.tickets.length

    // Calcular cuántos boletos se pueden generar
    const remainingSlots = maxTickets - totalTicketsUsed
    const totalAvailableSlots = maxNumber - minNumber + 1 - totalTicketsUsed

    if (remainingSlots <= 0) {
      alert('❌ No hay espacios disponibles para generar más boletos. La rifa está completa.')
      return
    }

    if (totalAvailableSlots <= 0) {
      alert('❌ No hay números disponibles en el rango configurado.')
      return
    }

    // Generar todos los números disponibles en el rango
    const allAvailableNumbers = []
    for (let i = minNumber; i <= maxNumber; i++) {
      const number = String(i).padStart(5, '0')
      if (isTicketAvailable(number)) {
        allAvailableNumbers.push(number)
      }
    }

    if (allAvailableNumbers.length === 0) {
      alert('❌ No hay números disponibles para generar compras de prueba.')
      return
    }

    // Limitar a los espacios restantes
    const numbersToUse = allAvailableNumbers.slice(0, Math.min(remainingSlots, allAvailableNumbers.length))

    // Generar compradores ficticios
    const generateBuyer = (index) => {
      const names = [
        'Ana María Rodríguez', 'Luis Carlos Pérez', 'María Elena García', 'Carlos Alberto López',
        'Patricia Isabel Torres', 'Roberto José Silva', 'Carmen Beatriz Vega', 'Diego Fernando Ruiz',
        'Isabel Cristina Morales', 'Andrés Felipe Castro', 'Lucía Esperanza Herrera', 'Miguel Ángel Torres',
        'Sofía Alejandra Jiménez', 'Sebastián David Rojas', 'Valentina Andrea Mendoza', 'Nicolás Esteban Vargas',
        'Camila Estefanía Guzmán', 'Daniel Alejandro Peña', 'Mariana Gabriela Flores', 'Javier Ignacio Ramos'
      ]
      
      const cities = [
        'Quito', 'Guayaquil', 'Cuenca', 'Ambato', 'Riobamba', 'Loja', 'Machala', 'Portoviejo',
        'Manta', 'Esmeraldas', 'Ibarra', 'Quevedo', 'Milagro', 'Santo Domingo', 'Babahoyo', 'Latacunga'
      ]

      const name = names[index % names.length]
      const city = cities[index % cities.length]
      
      return {
        fullName: name,
        documentId: String(1000000000 + index).padStart(10, '0'),
        email: `comprador${index + 1}@email.com`,
        phone: `09${String(80000000 + index).padStart(8, '0')}`,
        address: `Av. Principal ${100 + index}, ${city}`
      }
    }

    // Mezclar los números para distribución intercalada
    const shuffledNumbers = [...numbersToUse].sort(() => Math.random() - 0.5)
    
    // Dividir los números en compras de diferentes tamaños (6-20 boletos por compra)
    const purchases = []
    let currentIndex = 0
    let purchaseIndex = 0

    while (currentIndex < shuffledNumbers.length) {
      // Determinar el tamaño de esta compra (entre 6 y 20 boletos, o el resto si es menor)
      const remainingNumbers = shuffledNumbers.length - currentIndex
      const maxPurchaseSize = Math.min(20, remainingNumbers)
      const minPurchaseSize = Math.min(6, remainingNumbers)
      
      // Si quedan menos de 6 boletos, agregarlos a la compra anterior o crear una compra pequeña
      if (remainingNumbers < 6 && purchases.length > 0) {
        // Agregar los números restantes a la última compra
        purchases[purchases.length - 1].tickets.push(...shuffledNumbers.slice(currentIndex))
        break
      }
      
      const purchaseSize = remainingNumbers >= 6 ? 
        Math.floor(Math.random() * (maxPurchaseSize - minPurchaseSize + 1)) + minPurchaseSize : 
        remainingNumbers

      const purchaseNumbers = shuffledNumbers.slice(currentIndex, currentIndex + purchaseSize)
      
      purchases.push({
        buyer: generateBuyer(purchaseIndex),
        ticketCount: purchaseNumbers.length,
        tickets: purchaseNumbers
      })

      currentIndex += purchaseSize
      purchaseIndex++
    }

    // Validar que no hay duplicados
    const allTickets = purchases.flatMap(p => p.tickets)
    const uniqueTickets = new Set(allTickets)
    
    if (allTickets.length !== uniqueTickets.size) {
      console.error('Se encontraron números duplicados en las compras generadas')
      alert('❌ Error: Se detectaron números duplicados. Esto no debería suceder.')
      return
    }

    // Confirmar con el usuario
    const totalTicketsToGenerate = allTickets.length
    const totalRevenue = totalTicketsToGenerate * ticketPrice
    
    if (!confirm(`🎯 Generar compras de prueba para completar la rifa?\n\n` +
      `📊 Información:\n` +
      `• Boletos a generar: ${totalTicketsToGenerate}\n` +
      `• Compras a crear: ${purchases.length}\n` +
      `• Ingresos totales: $${totalRevenue}\n` +
      `• Rango de números: ${String(minNumber).padStart(5, '0')} - ${String(maxNumber).padStart(5, '0')}\n\n` +
      `¿Continuar?`)) {
      return
    }

    setIsGenerating(true)
    let completedPurchases = 0

    purchases.forEach((purchase, index) => {
      setTimeout(() => {
        try {
          // Crear boletos para esta compra
          purchase.tickets.forEach(ticketNumber => {
            dispatch({ 
              type: 'ADD_TICKET_NUMBER', 
              payload: { number: ticketNumber } 
            })
          })

          // Confirmar compra
          const orderId = `TEST-${Date.now()}-${index}`
          dispatch({ 
            type: 'CONFIRM_PURCHASE', 
            payload: { 
              buyer: purchase.buyer, 
              selectedNumbers: purchase.tickets, 
              orderId 
            } 
          })

          // Generar comprobante
          const receipt = {
            orderId,
            buyer: purchase.buyer,
            tickets: purchase.tickets,
            amount: purchase.tickets.length * ticketPrice,
            paymentMethod: 'Tarjeta de Crédito',
            date: new Date().toISOString(),
            status: 'Completado'
          }
          
          dispatch({ type: 'SAVE_RECEIPT', payload: receipt })
          
          console.log(`✅ Compra ${index + 1} procesada: ${purchase.buyer.fullName} - ${purchase.tickets.length} boletos`)
          
        } catch (error) {
          console.error(`Error procesando compra ${index + 1}:`, error)
        }
        
        completedPurchases++
        if (completedPurchases === purchases.length) {
          setIsGenerating(false)
          const totalTicketsSold = purchases.reduce((sum, p) => sum + p.tickets.length, 0)
          const totalRevenue = totalTicketsSold * ticketPrice
          
          alert(`🎉 ¡Rifa completada exitosamente!\n\n` +
            `📊 Resultados:\n` +
            `• Compras generadas: ${purchases.length}\n` +
            `• Boletos vendidos: ${totalTicketsSold}\n` +
            `• Ingresos totales: $${totalRevenue}\n` +
            `• Rifa: ${totalTicketsSold}/${maxTickets} boletos\n\n` +
            `¡La rifa está lista para el sorteo!`)
        }
      }, index * 1000) // Espaciar las compras por 1 segundo
    })
  }

  return (
    <div className="container-fluid px-3 px-md-4 py-3 py-md-5">
      {/* Tabs de navegación */}
      <div className="text-center mb-4 mb-md-5">
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn btn-lg rounded-pill px-4 py-3 fw-bold ${activeTab === 'tickets' ? 'gradient-primary text-white' : 'btn-outline-light'}`}
            onClick={() => setActiveTab('tickets')}
          >
            <i className="fas fa-ticket-alt me-2"></i>
            Comprar Boletos
          </button>
          <button
            type="button"
            className={`btn btn-lg rounded-pill px-4 py-3 fw-bold ${activeTab === 'winners' ? 'gradient-primary text-white' : 'btn-outline-light'}`}
            onClick={() => setActiveTab('winners')}
          >
            <i className="fas fa-trophy me-2"></i>
            Ganadores
          </button>
        </div>
      </div>

      {activeTab === 'tickets' && (
        <div className="row g-3 g-md-5">
          <div className="col-12 col-lg-8">
            <div className="mb-3 mb-md-5 animate-fade-in">
              {/* Información de la Rifa */}
              <div className="glass rounded-3 rounded-md-4 p-3 p-md-4 mb-4 hover-lift">
                <div className="row g-3 text-center">
                  <div className="col-12 col-sm-4">
                    <div className="fs-4 mb-2">💰</div>
                    <div className="text-white-50 small">Precio por Boleto</div>
                    <div className="h5 fw-bold text-white">${state.raffleConfig?.ticketPrice || 10}</div>
                    <div className="text-success small d-none d-md-block">
                      <i className="fas fa-sync-alt me-1"></i>
                      Precios actualizados automáticamente
                    </div>
                  </div>
                  <div className="col-12 col-sm-4">
                    <div className="fs-4 mb-2">🎫</div>
                    <div className="text-white-50 small">Rango de Números</div>
                    <div className="h6 fw-bold text-white">
                      {String(state.raffleConfig?.minTicketNumber || 1).padStart(5, '0')} - {String(state.raffleConfig?.maxTicketNumber || 99999).padStart(5, '0')}
                    </div>
                  </div>
                  <div className="col-12 col-sm-4">
                    <div className="fs-4 mb-2">📊</div>
                    <div className="text-white-50 small">Límite de Boletos</div>
                    <div className="h6 fw-bold text-white">
                      {state.raffleConfig?.totalTickets ? state.raffleConfig.totalTickets : 'Sin límite'}
                    </div>
                  </div>
                </div>
                <div className="text-center mt-3 d-md-none">
                  <div className="text-success small">
                    <i className="fas fa-sync-alt me-1"></i>
                    Precios actualizados automáticamente
                  </div>
                </div>
              </div>

              <div className="text-center mb-3 mb-md-4">
                <h1 className="display-4 fw-bold text-white mb-2 mb-md-3">🎯 Elige tus boletos de la suerte</h1>
                <p className="lead text-white-75 d-none d-md-block">Selecciona un paquete y escribe tus números de 5 dígitos</p>
                <p className="text-white-75 d-md-none">Selecciona un paquete y escribe tus números</p>
                <div className="mt-3">
                  <button
                    onClick={generateTestPurchases}
                    disabled={!canGenerateTestPurchases}
                    className={`btn border-2 rounded-pill px-4 py-2 fw-bold hover-lift ${
                      isGenerating 
                        ? 'btn-warning text-dark' 
                        : canGenerateTestPurchases
                        ? 'btn-outline-info'
                        : 'btn-outline-secondary'
                    }`}
                    title={
                      canGenerateTestPurchases 
                        ? "Generar compras de prueba con datos realistas" 
                        : `Se necesitan al menos 51 boletos disponibles. Actualmente hay ${availableTickets} disponibles.`
                    }
                  >
                    {isGenerating ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Completando Rifa...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-magic me-2"></i>
                        Completar Rifa Automáticamente
                      </>
                    )}
                  </button>
                  {isGenerating && (
                    <div className="mt-2">
                      <div className="text-white-50 small">
                        <i className="fas fa-info-circle me-1"></i>
                        Generando compras automáticas para completar todos los boletos disponibles...
                      </div>
                    </div>
                  )}
                  {!canGenerateTestPurchases && !isGenerating && (
                    <div className="mt-2">
                      <div className="text-warning small">
                        <i className="fas fa-exclamation-triangle me-1"></i>
                        La rifa ya está completa ({state.tickets.length}/{state.raffleConfig?.totalTickets || 100} boletos)
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="glass rounded-3 rounded-md-4 p-3 p-md-5 hover-lift">
                <TicketPackages onMinSelectionInvalid={setMinInvalid} />
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-4">
          <div className="sticky-top d-none d-lg-block" style={{top: '120px'}}>
            <div className="glass rounded-4 p-4 mb-4 hover-lift animate-slide-in">
              <div className="text-center mb-4">
                <div className="fs-1 mb-2">🎫</div>
                <h3 className="h4 fw-bold text-white mb-1">Boletos Seleccionados</h3>
                <div className="display-3 fw-bold text-gradient">{selectedNumbers.length}</div>
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
                  <div className="h4 fw-bold text-gradient mb-0">{selectedNumbers.length}/6</div>
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
      )}

      {activeTab === 'winners' && (
        <div className="row g-3 g-md-5">
          <div className="col-12">
            <WinnersView />
          </div>
        </div>
      )}
    </div>
  )
}
