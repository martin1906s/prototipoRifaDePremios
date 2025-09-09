import AdminPanel from '../components/AdminPanel.jsx'

export default function Admin() {
  return (
    <div className="container-fluid px-3 px-md-4 py-3 py-md-5">
      <div className="text-center mb-3 mb-md-5 animate-fade-in">
        <div className="fs-1 mb-2 mb-md-3">⚙️</div>
        <h1 className="display-4 fw-bold text-white mb-2 mb-md-3">Panel de Administración</h1>
        <p className="lead text-white-75 d-none d-md-block">Gestiona la rifa y realiza sorteos</p>
        <p className="text-white-75 d-md-none">Gestiona la rifa y realiza sorteos</p>
      </div>
      <AdminPanel />
    </div>
  )
}
