const startDateVar = new Date(); // Obtém a data e hora atuais
const validityDateVar = new Date(startDateVar); // Clona a data inicial

validityDateVar.setDate(startDateVar.getDate() + 1); // Adiciona 1 dia

// Converte para o formato ISO 8601 (padrão esperado)
const startDate = startDateVar.toISOString();
const validity = validityDateVar.toISOString();

console.log({ startDate, validity });