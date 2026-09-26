export { cn } from "cn"

export function toFieldErrors(errors?: string[] | string) {
  if (!errors) return undefined
  if (typeof errors === "string") return [{ message: errors }]
  return errors.map((msg) => ({ message: msg }))
}
