/**
 * Formata um valor numérico para o formato de moeda brasileira
 * @param valor - Valor numérico a ser formatado
 * @returns String formatada em Real brasileiro (R$)
 */
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}

/**
 * Formata uma data para o formato brasileiro
 * @param data - Data a ser formatada
 * @returns String formatada como DD/MM/YYYY
 */
export function formatarData(data: Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(data);
}

/**
 * Formata uma data para incluir também o horário
 * @param data - Data e hora a serem formatadas
 * @returns String formatada como DD/MM/YYYY HH:MM
 */
export function formatarDataHora(data: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(data);
}
