export function describeIf(condition: boolean): jest.Describe {
  return condition ? describe : describe.skip
}

// eslint-disable-next-line node/no-process-env
export const runEmulator = !!process.env.FIRESTORE_EMULATOR_HOST
