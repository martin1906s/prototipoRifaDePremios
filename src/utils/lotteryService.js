// Servicio simulado para consultar la Lotería Nacional
export const simulateLotteryQuery = async () => {
  // Simular delay de consulta a API externa
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Generar número ganador simulado basado en fecha actual
  const today = new Date()
  const seed = today.getDate() + today.getMonth() + today.getFullYear()
  const winningNumber = String((seed * 7 + 12345) % 100000).padStart(5, '0')
  
  return {
    winningNumber,
    drawDate: today.toISOString().split('T')[0],
    source: 'Lotería Nacional del Ecuador',
    verified: true,
    timestamp: new Date().toISOString()
  }
}

// Simular validación de número ganador
export const validateWinningNumber = (tickets, winningNumber) => {
  const exactMatch = tickets.find(t => t.id === winningNumber && t.status === 'sold')
  
  if (exactMatch) {
    return {
      type: 'exact',
      ticket: exactMatch,
      message: '¡Coincidencia exacta!'
    }
  }
  
  // Si no hay coincidencia exacta, buscar el más cercano
  const soldTickets = tickets.filter(t => t.status === 'sold')
  if (soldTickets.length === 0) {
    return {
      type: 'none',
      ticket: null,
      message: 'No hay boletos vendidos para validar'
    }
  }
  
  // Encontrar el número más cercano
  const winningNum = parseInt(winningNumber)
  let closestTicket = soldTickets[0]
  let minDifference = Math.abs(parseInt(closestTicket.id) - winningNum)
  
  for (const ticket of soldTickets) {
    const difference = Math.abs(parseInt(ticket.id) - winningNum)
    if (difference < minDifference) {
      minDifference = difference
      closestTicket = ticket
    }
  }
  
  return {
    type: 'closest',
    ticket: closestTicket,
    difference: minDifference,
    message: `Número más cercano (diferencia: ${minDifference})`
  }
}

// Simular generación de factura SRI
export const generateSRIInvoice = async (purchase) => {
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const invoiceNumber = `001-001-${String(Date.now()).slice(-9)}`
  const taxAmount = purchase.amount * 0.12 // IVA 12%
  const subtotal = purchase.amount - taxAmount
  
  return {
    invoiceNumber,
    subtotal,
    taxAmount,
    total: purchase.amount,
    status: 'AUTORIZADA',
    authorizationDate: new Date().toISOString(),
    sriCode: `SRI-${Date.now()}`,
    purchase
  }
}

// Simular envío de email
export const simulateEmailSending = async (to, subject, content) => {
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  return {
    success: true,
    messageId: `msg-${Date.now()}`,
    to,
    subject,
    sentAt: new Date().toISOString()
  }
}
