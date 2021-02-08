export function sleep(time = 5000): Promise<void> {
  return new Promise<void>(resolve => setTimeout(() => resolve(), time))
}
