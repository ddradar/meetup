import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing'
import type firebase from 'firebase'

import type { Mission, MissionListData } from '../../mission'
import type { User } from '../../user'
import FirestoreTestProvider from '../FirestoreTestProvider'

const testName = 'missions'
const collectionPath = 'version/1/missions'
const provider = new FirestoreTestProvider(testName)

function getMissionsRef(db: firebase.firestore.Firestore) {
  return db.collection(collectionPath)
}

describe(`Firestore /${collectionPath}`, () => {
  const clearedId = 'mission-1'
  const closedId = 'mission-2'
  const clearedDetailPath = `${clearedId}/detail/${clearedId}`
  const closedDetailPath = `${closedId}/detail/${closedId}`
  const openedUser: User = {
    name: 'Test User',
    home: 'Hamamatsu',
    description: 'Memo',
    orderedMission: closedId,
  }
  const clearedMission: MissionListData = {
    missionNo: 1,
    color: 'yellow',
    title: 'Mission 1',
    cleared: true,
  }
  const closedMission: MissionListData = {
    missionNo: 2,
    color: 'red',
    title: 'Mission 2',
    cleared: false,
  }
  const missionDetail: Omit<Mission, keyof MissionListData> = {
    songName: 'Song',
    difficulty: 'any',
    description: 'Description',
    options: ['x1', 'NOTE'],
  }

  beforeAll(async () => {
    const db = provider.getAdminFirestore()
    const missions = getMissionsRef(db)
    await missions.doc(clearedId).set(clearedMission)
    await missions.doc(closedId).set(closedMission)
    await missions.doc(clearedDetailPath).set(missionDetail)
    await missions.doc(closedDetailPath).set(missionDetail)
    await db.doc('version/1/users/opened-user').set(openedUser)
  })
  beforeEach(async () => {
    provider.increment()
    await provider.loadRules()
  })
  afterEach(async () => provider.cleanup())

  describe('Create', () => {
    test('Anonymous cannot create mission', () => {
      // Arrange
      const db = provider.getFirestoreWithAuth()
      const missions = getMissionsRef(db)

      // Act - Assert
      assertFails(missions.add(clearedMission))
    })
    test('Authed user cannot create mission', () => {
      // Arrange
      const db = provider.getFirestoreWithAuth({ uid: 'foo' })
      const missions = getMissionsRef(db)

      // Act - Assert
      assertFails(missions.add(clearedMission))
    })
    test('Anonymous cannot create mission detail', () => {
      // Arrange
      const db = provider.getFirestoreWithAuth()
      const details = getMissionsRef(db).doc(clearedId).collection('detail')

      // Act - Assert
      assertFails(details.add(missionDetail))
    })
    test('Authed user cannot create mission detail', () => {
      // Arrange
      const db = provider.getFirestoreWithAuth({ uid: 'foo' })
      const details = getMissionsRef(db).doc(clearedId).collection('detail')

      // Act - Assert
      assertFails(details.add(missionDetail))
    })
  })

  describe('Read', () => {
    test('Anyone can read mission list', () => {
      // Arrange
      const db = provider.getFirestoreWithAuth()
      const missions = getMissionsRef(db)

      // Act - Assert
      assertSucceeds(missions.get())
    })
    test('Anyone can read cleared mission detail', () => {
      // Arrange
      const db = provider.getFirestoreWithAuth()
      const missionDetail = getMissionsRef(db).doc(clearedDetailPath)

      // Act - Assert
      assertSucceeds(missionDetail.get())
    })
    test('Anonymous cannot read not cleared mission detail', () => {
      // Arrange
      const db = provider.getFirestoreWithAuth()
      const missionDetail = getMissionsRef(db).doc(clearedDetailPath)

      // Act - Assert
      assertFails(missionDetail.get())
    })
    test('Authed user cannot read not cleared mission detail', () => {
      // Arrange
      const db = provider.getFirestoreWithAuth({ uid: 'foo' })
      const missionDetail = getMissionsRef(db).doc(closedDetailPath)

      // Act - Assert
      assertFails(missionDetail.get())
    })
    test('Authed user can read opened mission detail', () => {
      // Arrange
      const db = provider.getFirestoreWithAuth({ uid: 'opened-user' })
      const missionDetail = getMissionsRef(db).doc(closedDetailPath)

      // Act - Assert
      assertSucceeds(missionDetail.get())
    })
  })

  describe('Update', () => {
    test('Anonymous cannot update mission', () => {
      // Arrange
      const db = provider.getFirestoreWithAuth()
      const missionRef = getMissionsRef(db).doc(closedId)

      // Act - Assert
      assertFails(missionRef.set(clearedMission))
    })
    test('Authed user cannot update mission', () => {
      // Arrange
      const db = provider.getFirestoreWithAuth({ uid: 'foo' })
      const missionRef = getMissionsRef(db).doc(closedId)

      // Act - Assert
      assertFails(missionRef.set(clearedMission))
    })
    test('Anonymous cannot update mission detail', () => {
      // Arrange
      const db = provider.getFirestoreWithAuth()
      const missionRef = getMissionsRef(db).doc(closedDetailPath)

      // Act - Assert
      assertFails(missionRef.set(clearedMission))
    })
    test('Authed user cannot update mission detail', () => {
      // Arrange
      const db = provider.getFirestoreWithAuth({ uid: 'foo' })
      const missionRef = getMissionsRef(db).doc(closedDetailPath)

      // Act - Assert
      assertFails(missionRef.set(clearedMission))
    })
  })

  describe('Delete', () => {
    test('Anonymous cannot delete mission', () => {
      // Arrange
      const db = provider.getFirestoreWithAuth()
      const missionRef = getMissionsRef(db).doc(closedId)

      // Act - Assert
      assertFails(missionRef.delete())
    })
    test('Authed user cannot delete mission', () => {
      // Arrange
      const db = provider.getFirestoreWithAuth({ uid: 'foo' })
      const missionRef = getMissionsRef(db).doc(closedId)

      // Act - Assert
      assertFails(missionRef.delete())
    })
    test('Anonymous cannot delete mission detail', () => {
      // Arrange
      const db = provider.getFirestoreWithAuth()
      const missionRef = getMissionsRef(db).doc(closedDetailPath)

      // Act - Assert
      assertFails(missionRef.delete())
    })
    test('Authed user cannot delete mission detail', () => {
      // Arrange
      const db = provider.getFirestoreWithAuth({ uid: 'foo' })
      const missionRef = getMissionsRef(db).doc(closedDetailPath)

      // Act - Assert
      assertFails(missionRef.delete())
    })
  })
})
