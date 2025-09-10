import { useContext } from 'react'
import { AppContext } from '../App.jsx'

export default function ProgressBar() {
  const { state } = useContext(AppContext)
  
  const soldTickets = state.tickets.filter(t => t.status === 'sold').length
  const totalTickets = 100 // Límite fijo de 100 boletos para la rifa
  const percentage = Math.min(Math.round((soldTickets / totalTickets) * 100), 100) // Limitar a 100%
  
  return (
    <div className="d-flex align-items-center gap-2 gap-md-3">
      <div className="flex-grow-1 position-relative" style={{ maxWidth: '200px' }}>
        <div className="progress" style={{ height: '8px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
          <div 
            className="progress-bar bg-gradient-primary" 
            role="progressbar" 
            style={{ 
              width: `${percentage}%`,
              borderRadius: '4px',
              transition: 'width 0.5s ease-in-out'
            }}
          >
          </div>
        </div>
        <div className="text-center mt-1">
          <small className="text-white fw-bold">
            {soldTickets >= totalTickets ? '100% vendido' : `${percentage}% vendido`}
          </small>
        </div>
      </div>
      
    </div>
  )
}
