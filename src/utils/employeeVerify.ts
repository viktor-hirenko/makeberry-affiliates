import type { EmployeeRecord } from '@/types/content'

export function normalize(value: string): string {
  return value.trim().toLowerCase()
}

/**
 * Для TG-ников `@name` и `name` считаются одним и тем же.
 * Email (есть `@` не в начале) не трогаем.
 */
export function tokenVariants(value: string): string[] {
  const v = normalize(value)
  if (!v) return []

  if (v.startsWith('@')) {
    return [v, v.slice(1)]
  }

  // Email: local@domain — оставляем как есть
  if (v.includes('@')) {
    return [v]
  }

  // Ник без @: принимаем и с @, и без
  return [v, `@${v}`]
}

/** Собирает Set нормализованных токенов email + telegram для verify-формы. */
export function buildEmployeeVerifyTokens(employees: EmployeeRecord[]): Set<string> {
  const set = new Set<string>()
  for (const employee of employees) {
    for (const token of [employee.email, employee.telegram]) {
      for (const variant of tokenVariants(token)) {
        set.add(variant)
      }
    }
  }
  return set
}
