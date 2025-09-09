import { useContext, useState } from 'react'
import { AppContext } from '../App.jsx'

export default function DuplicateNumberModal({ show, onClose, duplicateNumber, onSelectAlternative }) {
  const { state } = useContext(AppContext)
  
  const [selectedOption, setSelectedOption] = useState(null)
  
  // Generar números disponibles (números que no están en el sistema)
  const generateAvailableNumbers = () => {
    const usedNumbers = state.tickets.map(t => t.number)
    const availableNumbers = []
    
    // Generar números del 00001 al 99999 que no estén usados
    for (let i = 1; i < 100000; i++) {
      const number = String(i).padStart(5, '0')
      if (!usedNumbers.includes(number)) {
        availableNumbers.push(number)
      }
    }
    
    return availableNumbers
  }
  
  const availableNumbers = generateAvailableNumbers()
  
  // Debug: mostrar información
  console.log('Modal abierto:', show)
  console.log('Número duplicado:', duplicateNumber)
  console.log('Números disponibles:', availableNumbers.length)
  console.log('Números usados:', state.tickets.map(t => t.number))
  
  // Encontrar el primer número disponible
  const firstAvailable = availableNumbers[0]
  
  // Generar número aleatorio disponible
  const randomAvailable = availableNumbers[Math.floor(Math.random() * availableNumbers.length)]
  
  // Encontrar números cercanos al número duplicado
  const findNearbyNumbers = (targetNumber) => {
    const target = parseInt(targetNumber)
    const nearby = availableNumbers
      .map(num => ({
        number: num,
        difference: Math.abs(parseInt(num) - target)
      }))
      .sort((a, b) => a.difference - b.difference)
      .slice(0, 3) // Los 3 más cercanos
    
    return nearby
  }
  
  const nearbyNumbers = findNearbyNumbers(duplicateNumber)
  
  const handleOptionSelect = (option, number) => {
    setSelectedOption(option)
    onSelectAlternative(number)
    onClose()
  }
  
  if (!show) return null
  
  return (
    <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.8)'}} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content glass border-0">
          <div className="modal-header border-0">
            <h5 className="modal-title text-white fw-bold">
              <i className="fas fa-exclamation-triangle text-warning me-2"></i>
              Número ya registrado
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
            ></button>
          </div>
          
          <div className="modal-body">
            <div className="text-center mb-4">
              <div className="fs-1 mb-3">⚠️</div>
              <p className="text-white mb-2">
                El número <strong className="text-warning">{duplicateNumber}</strong> ya está registrado.
              </p>
              <p className="text-white-50 small">
                Te ofrecemos las siguientes opciones:
              </p>
            </div>
            
            <div className="row g-3">
              {/* Opción 1: Primer número disponible */}
              {firstAvailable && (
                <div className="col-12">
                  <div 
                    className={`glass-dark rounded-3 p-3 cursor-pointer hover-lift ${selectedOption === 'first' ? 'animate-glow' : ''}`}
                    onClick={() => handleOptionSelect('first', firstAvailable)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <h6 className="text-white fw-bold mb-1">
                          <i className="fas fa-arrow-right text-success me-2"></i>
                          Primer número disponible
                        </h6>
                        <p className="text-white-50 small mb-0">
                          Selecciona el primer número que esté disponible
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="fs-4 fw-bold text-success">{firstAvailable}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Opción 2: Número aleatorio */}
              {randomAvailable && (
                <div className="col-12">
                  <div 
                    className={`glass-dark rounded-3 p-3 cursor-pointer hover-lift ${selectedOption === 'random' ? 'animate-glow' : ''}`}
                    onClick={() => handleOptionSelect('random', randomAvailable)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <h6 className="text-white fw-bold mb-1">
                          <i className="fas fa-dice text-primary me-2"></i>
                          Número al azar
                        </h6>
                        <p className="text-white-50 small mb-0">
                          Te asignamos un número aleatorio disponible
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="fs-4 fw-bold text-primary">{randomAvailable}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Opción 3: Números cercanos */}
              {nearbyNumbers.length > 0 && (
                <div className="col-12">
                  <h6 className="text-white fw-bold mb-3">
                    <i className="fas fa-search text-info me-2"></i>
                    Números cercanos a {duplicateNumber}
                  </h6>
                  <div className="row g-2">
                    {nearbyNumbers.map((nearby, index) => (
                      <div key={nearby.number} className="col-4">
                        <div 
                          className={`glass-dark rounded-3 p-3 text-center cursor-pointer hover-lift ${selectedOption === `nearby-${index}` ? 'animate-glow' : ''}`}
                          onClick={() => handleOptionSelect(`nearby-${index}`, nearby.number)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="fs-5 fw-bold text-info">{nearby.number}</div>
                          <div className="text-white-50 small">
                            Diferencia: {nearby.difference}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="modal-footer border-0">
            <button 
              type="button" 
              className="btn btn-outline-light"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
