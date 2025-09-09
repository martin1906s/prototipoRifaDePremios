// Utilidades para manejar localStorage
const STORAGE_KEY = 'raffle-tickets-data'

// Función para guardar datos en localStorage
export const saveToLocalStorage = (data) => {
  try {
    const serializedData = JSON.stringify(data)
    localStorage.setItem(STORAGE_KEY, serializedData)
    console.log('Datos guardados en localStorage:', data)
  } catch (error) {
    console.error('Error al guardar en localStorage:', error)
  }
}

// Función para cargar datos desde localStorage
export const loadFromLocalStorage = () => {
  try {
    const serializedData = localStorage.getItem(STORAGE_KEY)
    if (serializedData === null) {
      return null
    }
    const data = JSON.parse(serializedData)
    console.log('Datos cargados desde localStorage:', data)
    return data
  } catch (error) {
    console.error('Error al cargar desde localStorage:', error)
    return null
  }
}

// Función para limpiar localStorage
export const clearLocalStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
    console.log('localStorage limpiado')
  } catch (error) {
    console.error('Error al limpiar localStorage:', error)
  }
}

// Función para obtener el estado inicial con datos del localStorage
export const getInitialState = () => {
  const savedData = loadFromLocalStorage()
  
  if (savedData) {
    return savedData
  }
  
  // Estado inicial por defecto si no hay datos guardados
  return {
    tickets: [], // Ahora se crean dinámicamente cuando el usuario ingresa números
    purchases: [],
    receipts: [], // Added for advanced features
    raffles: [], // Added for advanced features
    duplicateNumber: null, // Para manejar números duplicados
    error: null, // Para mensajes de error
    economicWinners: [], // Ganadores de sorteos económicos
    majorWinners: [], // Ganadores de sorteos mayores
    // Configuraciones de la rifa
    raffleConfig: {
      ticketPrice: 10, // Precio por boleto
      totalTickets: null, // Cantidad total de boletos (null = automático 1-99999)
      minTicketNumber: 1, // Número mínimo de boleto
      maxTicketNumber: 99999 // Número máximo de boleto
    },
    ticketPackages: [
      { id: 'package-6', name: 'Paquete Básico', count: 6, price: 60, description: '6 boletos personalizados' },
      { id: 'package-10', name: 'Paquete Estándar', count: 10, price: 95, description: '10 boletos personalizados' },
      { id: 'package-15', name: 'Paquete Premium', count: 15, price: 135, description: '15 boletos personalizados' },
      { id: 'package-20', name: 'Paquete VIP', count: 20, price: 170, description: '20 boletos personalizados' },
      { id: 'package-custom', name: 'Cantidad Personalizada', count: 'custom', price: 0, description: 'Elige tu cantidad (mín. 6 boletos)' }
    ]
  }
}
