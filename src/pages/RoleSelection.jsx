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
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="text-center mb-4 mb-md-5 animate-fade-in">
              <div className="fs-1 mb-3 mb-md-4 float-animation">🎟️</div>
              <h1 className="display-3 fw-bold text-white mb-2 mb-md-3">Sistema de Rifas</h1>
              <p className="lead text-white-75 mb-4 mb-md-5">Selecciona tu rol para continuar</p>
            </div>
            
            <div className="row g-3 g-md-4">
              <div className="col-12 col-md-6">
                <div 
                  className={`glass rounded-3 rounded-md-4 p-4 p-md-5 text-center hover-lift cursor-pointer ${selectedRole === 'user' ? 'animate-glow' : ''}`}
                  onClick={() => handleRoleSelect('user')}
                  style={{ cursor: 'pointer', minHeight: window.innerWidth < 768 ? '280px' : '300px' }}
                >
                  <div className="fs-1 mb-3 mb-md-4">👤</div>
                  <h2 className="h4 h-md-3 fw-bold text-white mb-2 mb-md-3">Usuario</h2>
                  <p className="text-white-75 mb-3 mb-md-4">
                    Compra boletos, participa en rifas y gana increíbles premios
                  </p>
                  <div className="d-flex flex-column gap-1 gap-md-2 text-start mb-3 mb-md-4">
                    <div className="d-flex align-items-center gap-2 text-white-50">
                      <i className="fas fa-check-circle text-success"></i>
                      <span className="small">Comprar boletos</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 text-white-50">
                      <i className="fas fa-check-circle text-success"></i>
                      <span className="small">Pago seguro con tarjeta</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 text-white-50">
                      <i className="fas fa-check-circle text-success"></i>
                      <span className="small">Recibir boletos por email</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 text-white-50">
                      <i className="fas fa-check-circle text-success"></i>
                      <span className="small">Participar en sorteos</span>
                    </div>
                  </div>
                  <button className="btn btn-lg gradient-primary text-white border-0 rounded-pill px-3 px-md-4 py-2 py-md-3 fw-bold w-100">
                    <i className="fas fa-shopping-cart me-2 d-none d-md-inline"></i>
                    <span className="d-md-none">🛒</span>
                    Comprar Boletos
                  </button>
                </div>
              </div>
              
              <div className="col-12 col-md-6">
                <div 
                  className={`glass rounded-3 rounded-md-4 p-4 p-md-5 text-center hover-lift cursor-pointer ${selectedRole === 'admin' ? 'animate-glow' : ''}`}
                  onClick={() => handleRoleSelect('admin')}
                  style={{ cursor: 'pointer', minHeight: window.innerWidth < 768 ? '280px' : '300px' }}
                >
                  <div className="fs-1 mb-3 mb-md-4">⚙️</div>
                  <h2 className="h4 h-md-3 fw-bold text-white mb-2 mb-md-3">Administrador</h2>
                  <p className="text-white-75 mb-3 mb-md-4">
                    Gestiona rifas, controla ventas y administra el sistema
                  </p>
                  <div className="d-flex flex-column gap-1 gap-md-2 text-start mb-3 mb-md-4">
                    <div className="d-flex align-items-center gap-2 text-white-50">
                      <i className="fas fa-check-circle text-success"></i>
                      <span className="small">Crear nuevas rifas</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 text-white-50">
                      <i className="fas fa-check-circle text-success"></i>
                      <span className="small">Control de ventas</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 text-white-50">
                      <i className="fas fa-check-circle text-success"></i>
                      <span className="small">Realizar sorteos</span>
                    </div>
                    <div className="d-flex align-items-center gap-2 text-white-50">
                      <i className="fas fa-check-circle text-success"></i>
                      <span className="small">Reportes y estadísticas</span>
                    </div>
                  </div>
                  <button className="btn btn-lg btn-outline-light border-2 rounded-pill px-3 px-md-4 py-2 py-md-3 fw-bold w-100">
                    <i className="fas fa-cog me-2 d-none d-md-inline"></i>
                    <span className="d-md-none">⚙️</span>
                    Panel Admin
                  </button>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-4 mt-md-5">
              <div className="glass rounded-pill p-2 p-md-3 d-inline-block">
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
