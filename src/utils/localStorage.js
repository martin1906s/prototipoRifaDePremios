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
    tickets: Array.from({ length: 100 }, (_, i) => {
      const number = String(i + 1).padStart(5, '0')
      return { id: number, number, status: 'available' }
    }),
    purchases: [],
  }
}
