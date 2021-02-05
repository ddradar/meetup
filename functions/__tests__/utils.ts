export function sleep(time = 3000): Promise<void> {
  return new Promise<void>(resolve => setTimeout(() => resolve(), time))
}
