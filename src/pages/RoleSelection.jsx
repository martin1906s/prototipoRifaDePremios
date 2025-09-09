import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState(null)
  const navigate = useNavigate()

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    setTimeout(() => {
      if (role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/user')
      }
    }, 500)
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center mb-5 animate-fade-in">
              <div className="fs-1 mb-4 float-animation">🎟️</div>
              <h1 className="display-3 fw-bold text-white mb-3">Sistema de Rifas</h1>
              <p className="lead text-white-75 mb-5">Selecciona tu rol para continuar</p>
            </div>
            
            <div className="row g-4">
              <div className="col-md-6">
                <div 
                  className={`glass rounded-4 p-5 text-center hover-lift cursor-pointer ${selectedRole === 'user' ? 'animate-glow' : ''}`}
                  onClick={() => handleRoleSelect('user')}
                  style={{ cursor: 'pointer', minHeight: '300px' }}
                >
                  <div className="fs-1 mb-4">👤</div>
                  <h2 className="h3 fw-bold text-white mb-3">Usuario</h2>
                  <p className="text-white-75 mb-4">
                    Compra boletos, participa en rifas y gana increíbles premios
                  </p>
                  <div className="d-flex flex-column gap-2 text-start">
                    <div className="d-flex align-items-center gap-2 text-white-50">
                      <i className="fas fa-check-circle text-success"></i>
                      <span>Comprar boletos</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 text-white-50">
                      <i className="fas fa-check-circle text-success"></i>
                      <span>Pago seguro con tarjeta</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 text-white-50">
                      <i className="fas fa-check-circle text-success"></i>
                      <span>Recibir boletos por email</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 text-white-50">
                      <i className="fas fa-check-circle text-success"></i>
                      <span>Participar en sorteos</span>
                    </div>
                  </div>
                  <button className="btn btn-lg gradient-primary text-white border-0 rounded-pill px-4 py-3 fw-bold mt-4 w-100">
                    <i className="fas fa-shopping-cart me-2"></i>
                    Comprar Boletos
                  </button>
                </div>
              </div>
              
              <div className="col-md-6">
                <div 
                  className={`glass rounded-4 p-5 text-center hover-lift cursor-pointer ${selectedRole === 'admin' ? 'animate-glow' : ''}`}
                  onClick={() => handleRoleSelect('admin')}
                  style={{ cursor: 'pointer', minHeight: '300px' }}
                >
                  <div className="fs-1 mb-4">⚙️</div>
                  <h2 className="h3 fw-bold text-white mb-3">Administrador</h2>
                  <p className="text-white-75 mb-4">
                    Gestiona rifas, controla ventas y administra el sistema
                  </p>
                  <div className="d-flex flex-column gap-2 text-start">
                    <div className="d-flex align-items-center gap-2 text-white-50">
                      <i className="fas fa-check-circle text-success"></i>
                      <span>Crear nuevas rifas</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 text-white-50">
                      <i className="fas fa-check-circle text-success"></i>
                      <span>Control de ventas</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 text-white-50">
                      <i className="fas fa-check-circle text-success"></i>
                      <span>Realizar sorteos</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 text-white-50">
                      <i className="fas fa-check-circle text-success"></i>
                      <span>Reportes y estadísticas</span>
                    </div>
                  </div>
                  <button className="btn btn-lg btn-outline-light border-2 rounded-pill px-4 py-3 fw-bold mt-4 w-100">
                    <i className="fas fa-cog me-2"></i>
                    Panel Admin
                  </button>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-5">
              <div className="glass rounded-pill p-3 d-inline-block">
                <small className="text-white-50">
                  <i className="fas fa-shield-alt me-2"></i>
                  Sistema seguro y confiable
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
