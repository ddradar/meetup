import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing'
import type firebase from 'firebase'

import type { User } from '../../user'
import FirestoreTestProvider from '../FirestoreTestProvider'
import { describeIf, runEmulator } from '../utils'

const testName = 'users'
const collectionPath = 'version/1/users'
const provider = new FirestoreTestProvider(testName)

function getUsersRef(db: firebase.firestore.Firestore) {
  return db.collection(collectionPath)
}

describeIf(runEmulator)(`Firestore /${collectionPath}`, () => {
  const userData: User = {
    name: 'Test User',
    home: 'Hamamatsu',
    description: 'Memo',
    orderedMission: null,
  }

  beforeEach(async () => {
    provider.increment()
    await provider.loadRules()
  })
  afterEach(async () => provider.cleanup())

  describe('Create', () => {
    test('Anonymous cannot create document', () => {
      // Arrange
      const db = provider.getFirestoreWithAuth()
      const userDoc = getUsersRef(db).doc('foo')

      // Act - Assert
      assertFails(userDoc.set(userData))
    })
    test('Authed user can create own document', () => {
      // Arrange
      const uid = 'foo'
      const db = provider.getFirestoreWithAuth({ uid })
      const userDoc = getUsersRef(db).doc(uid)

      // Act - Assert
      assertSucceeds(userDoc.set(userData))
    })
    test('Authed user cannot create other document', () => {
      // Arrange
      const db = provider.getFirestoreWithAuth({ uid: 'foo' })
      const userDoc = getUsersRef(db).doc('bar')

      // Act - Assert
      assertFails(userDoc.set(userData))
    })
  })

  describe('Read', () => {
    test('anonymous cannot read User document', () => {
      // Arrange
      const db = provider.getFirestoreWithAuth()
      const users = getUsersRef(db)

      // Act - Assert
      assertFails(users.get())
    })
    test('Authed user can read User documents', () => {
      // Arrange
      const db = provider.getFirestoreWithAuth({ uid: 'foo' })
      const users = getUsersRef(db)

      // Act - Assert
      assertSucceeds(users.get())
    })
  })

  describe('Update', () => {
    beforeEach(async () => {
      const db = provider.getAdminFirestore()
      const userDoc = getUsersRef(db).doc('foo')
      await userDoc.set(userData)
    })

    test('Anonymous cannot update document', () => {
      // Arrange
      const updatedData: User = { ...userData, home: 'Aichi' }
      const db = provider.getFirestoreWithAuth()
      const userDoc = getUsersRef(db).doc('foo')

      // Act - Assert
      assertFails(userDoc.set(updatedData))
    })
    test('Authed user can update User.name, home and description', () => {
      // Arrange
      const updatedData: User = {
        ...userData,
        name: 'Test 2',
        home: 'Aichi',
        description: 'Description',
      }
      const uid = 'foo'
      const db = provider.getFirestoreWithAuth({ uid })
      const userDoc = getUsersRef(db).doc(uid)

      // Act - Assert
      assertSucceeds(userDoc.set(updatedData))
    })
    test('Authed user cannot update other document', () => {
      // Arrange
      const updatedData: User = { ...userData, home: 'Aichi' }
      const db = provider.getFirestoreWithAuth({ uid: 'foo' })
      const userDoc = getUsersRef(db).doc('bar')

      // Act - Assert
      assertFails(userDoc.set(updatedData))
    })
    test.each([
      [null, 'mission-1'],
      ['mission-1', 'mission-1'],
    ])(
      'Authed user can update User.orderedMission from %s to %s',
      async (before, after) => {
        // Arrange
        const uid = 'foo'
        const adminDb = provider.getAdminFirestore()
        const doc = getUsersRef(adminDb).doc(uid)
        await doc.set({ ...userData, orderedMission: before })

        const updatedData: User = { ...userData, orderedMission: after }
        const db = provider.getFirestoreWithAuth({ uid })
        const userDoc = getUsersRef(db).doc(uid)

        // Act - Assert
        assertSucceeds(userDoc.set(updatedData))
      }
    )
    test.each([
      ['mission-1', 'mission-2'],
      ['mission-1', null],
    ])(
      'Authed user cannot update User.orderedMission from %s to %s',
      async (before, after) => {
        // Arrange
        const uid = 'foo'
        const adminDb = provider.getAdminFirestore()
        const doc = getUsersRef(adminDb).doc(uid)
        await doc.set({ ...userData, orderedMission: before })

        const updatedData: User = { ...userData, orderedMission: after }
        const db = provider.getFirestoreWithAuth({ uid })
        const userDoc = getUsersRef(db).doc(uid)

        // Act - Assert
        assertFails(userDoc.set(updatedData))
      }
    )
  })

  describe('Delete', () => {
    beforeEach(async () => {
      const db = provider.getAdminFirestore()
      const userDoc = getUsersRef(db).doc('foo')
      await userDoc.set(userData)
    })

    test('Anonymous cannot delete document', () => {
      // Arrange
      const db = provider.getFirestoreWithAuth()
      const userDoc = getUsersRef(db).doc('foo')

      // Act - Assert
      assertFails(userDoc.delete())
    })
    test('Authed user cannot delete own document', () => {
      // Arrange
      const uid = 'foo'
      const db = provider.getFirestoreWithAuth({ uid })
      const userDoc = getUsersRef(db).doc(uid)

      // Act - Assert
      assertFails(userDoc.delete())
    })
  })
})
