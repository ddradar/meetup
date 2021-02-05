import type { MissionListData, User } from '@ddradar/meetup-core'
import FirestoreTestProvider from '@ddradar/meetup-core/__tests__/FirestoreTestProvider'
import * as functions from 'firebase-functions-test'

import { sleep } from '../../utils'

functions()
const testName = 'v1-firestore-missions'
const provider = new FirestoreTestProvider(testName)

describe(`Function ${testName}`, () => {
  const mission: MissionListData = {
    missionNo: 1,
    color: 'yellow',
    title: 'Mission',
    cleared: false,
  }
  const user: User = {
    name: 'Test User',
    home: 'Hamamatsu',
    description: 'Memo',
    orderedMission: null,
  }
  const userId = 'test-user'
  beforeEach(async () => {
    provider.increment()
    await provider.loadRules()
  })
  afterEach(async () => provider.cleanup())

  describe('onUpdate', () => {
    const missionId = 'mission-1'

    test.each([
      [{ cleared: false }, { cleared: false }],
      [{ cleared: true }, { cleared: false }],
    ])(
      'does not reset user.orderedMission if change from %p to %p',
      async (prevData, newData) => {
        // Arrange
        const db = provider.getAdminFirestore()
        const expected = { ...user, orderedMission: missionId }
        await db.doc(`/version/1/users/${userId}`).set(expected)
        await db
          .doc(`/version/1/missons/${missionId}`)
          .set({ ...mission, ...prevData })

        // Act
        await db
          .doc(`/version/1/missons/${missionId}`)
          .set(newData, { merge: true })
        await sleep() // Wait for Function

        // Assert
        const result = await db.doc(`/version/1/users/${userId}`).get()
        expect(result.data()).toStrictEqual(expected)
      }
    )

    test.each([
      [{ cleared: false }, { cleared: true }],
      [{ cleared: true }, { cleared: true }],
    ])(
      'resets user.orderedMission if change from %p to %p',
      async (prevData, newData) => {
        // Arrange
        const db = provider.getAdminFirestore()
        const expected = { ...user, orderedMission: missionId }
        await db.doc(`/version/1/users/${userId}`).set(expected)
        await db
          .doc(`/version/1/missons/${missionId}`)
          .set({ ...mission, ...prevData })

        // Act
        await db
          .doc(`/version/1/missons/${missionId}`)
          .set(newData, { merge: true })
        await sleep() // Wait for Function

        // Assert
        const result = await db.doc(`/version/1/users/${userId}`).get()
        expect(result.data()).toStrictEqual(user)
      }
    )

    test('does not reset user.orderedMission if other mission', async () => {
      // Arrange
      const db = provider.getAdminFirestore()
      const expected = { ...user, orderedMission: 'other-mission' }
      await db.doc(`/version/1/users/${userId}`).set(expected)
      await db.doc(`/version/1/missons/${missionId}`).set(mission)

      // Act
      await db
        .doc(`/version/1/missons/${missionId}`)
        .set({ cleared: true }, { merge: true })
      await sleep() // Wait for Function

      // Assert
      const result = await db.doc(`/version/1/users/${userId}`).get()
      expect(result.data()).toStrictEqual(user)
    })
  })
})
