import type { MissionListData, User } from '@ddradar/meetup-core'
import * as functions from 'firebase-functions-test'

import FirestoreTestProvider from '../../FirestoreTestProvider'
import { sleep } from '../../utils'

functions()
const provider = new FirestoreTestProvider()

describe('Function v1-firestore-missions', () => {
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

  describe('onUpdate', () => {
    const missionId = 'mission-1'
    afterEach(async () => {
      const db = provider.getAdminFirestore()
      await db.doc(`/version/1/missions/${missionId}`).delete()
      await db.doc(`/version/1/users/${userId}`).delete()
    })

    test.each([
      [{ cleared: false }, { cleared: false }],
      [{ cleared: true }, { cleared: false }],
    ])(
      'does not reset user.orderedMission if change from %p to %p',
      async (prevData, newData) => {
        // Arrange
        const db = provider.getAdminFirestore()
        const expected = { ...user, orderedMission: missionId }
        await db
          .doc(`/version/1/missions/${missionId}`)
          .set({ ...mission, ...prevData })
        await db.doc(`/version/1/users/${userId}`).set(expected)

        // Act
        await db
          .doc(`/version/1/missions/${missionId}`)
          .set(newData, { merge: true })
        await sleep() // Wait for Function

        // Assert
        const result = await db.doc(`/version/1/users/${userId}`).get()
        expect(result.data()).toStrictEqual(expected)
      }
    )

    test('resets user.orderedMission if change from {cleared: false} to {cleared: true}', async () => {
      // Arrange
      const db = provider.getAdminFirestore()
      const expected = { ...user, orderedMission: missionId }
      await db.doc(`/version/1/missions/${missionId}`).set({ ...mission })
      await db.doc(`/version/1/users/${userId}`).set(expected)

      // Act
      await db
        .doc(`/version/1/missions/${missionId}`)
        .set({ ...mission, cleared: true }, { merge: true })
      await sleep() // Wait for Function

      // Assert
      const result = await db.doc(`/version/1/users/${userId}`).get()
      expect(result.data()).toStrictEqual(user)
    })

    test('does not reset user.orderedMission if other mission', async () => {
      // Arrange
      const db = provider.getAdminFirestore()
      const expected = { ...user, orderedMission: 'other-mission' }
      await db.doc(`/version/1/missions/${missionId}`).set(mission)
      await db.doc(`/version/1/users/${userId}`).set(expected)

      // Act
      await db
        .doc(`/version/1/missions/${missionId}`)
        .set({ cleared: true }, { merge: true })
      await sleep() // Wait for Function

      // Assert
      const result = await db.doc(`/version/1/users/${userId}`).get()
      expect(result.data()).toStrictEqual(expected)
    })
  })
})
