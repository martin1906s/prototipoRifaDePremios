import AdminPanel from '../components/AdminPanel.jsx'

export default function Admin() {
  return (
    <div className="container-fluid px-4 py-5">
      <div className="text-center mb-5 animate-fade-in">
        <div className="fs-1 mb-3">⚙️</div>
        <h1 className="display-4 fw-bold text-white mb-3">Panel de Administración</h1>
        <p className="lead text-white-75">Gestiona la rifa y realiza sorteos</p>
      </div>
      <AdminPanel />
    </div>
  )
}
