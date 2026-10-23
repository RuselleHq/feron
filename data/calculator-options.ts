import type { CalculatorOption } from '@/types'

/**
 * ВНИМАНИЕ: суммы ниже взяты из дизайн-референса и являются ЗАГЛУШКАМИ.
 * Подтвердите их у мастерской перед продакшеном или очистите массив —
 * при пустом списке блок «Дополнительные опции» не отображается.
 */
export const CALCULATOR_OPTIONS: Record<string, CalculatorOption[]> = {
  gates: [
    { id: 'wicket', name: { ru: 'Калитка', kz: 'Қалқа есік' }, price: 35000, icon: 'wicket', defaultOn: true },
    { id: 'automation', name: { ru: 'Автоматика', kz: 'Автоматика' }, price: 120000, icon: 'automation', defaultOn: true },
    { id: 'coating', name: { ru: 'Порошковое покрытие', kz: 'Ұнтақты бояу' }, price: 15000, icon: 'coating' },
    { id: 'decor', name: { ru: 'Декоративные элементы', kz: 'Декоративті элементтер' }, price: 25000, icon: 'decor', defaultOn: true },
  ],
}

export function optionsForCategory(categoryId: string): CalculatorOption[] {
  return CALCULATOR_OPTIONS[categoryId] ?? []
}
