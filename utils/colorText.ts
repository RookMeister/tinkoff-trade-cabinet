export function colorText(price: number) {
  if (price > 0)
    return '#00a127'
  if (price < 0)
    return '#e31c1c'
}
