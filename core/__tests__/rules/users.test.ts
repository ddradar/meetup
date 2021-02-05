import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing'

import type { User } from '../../user'
import FirestoreTestProvider from '../FirestoreTestProvider'

const testName = 'users'
const collectionPath = 'version/1/users'
const provider = new FirestoreTestProvider(testName)

function getUsersRef(db: firebase.firestore.Firestore) {
  return db.collection(collectionPath)
}

describe(`Firestore /${collectionPath}`, () => {
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
    test('Anonymous cannot create document', async () => {
      // Arrange
      const db = provider.getFirestoreWithAuth()
      const userDoc = getUsersRef(db).doc('foo')

      // Act - Assert
      await assertFails(userDoc.set(userData))
    })
    test('Authed user can create own document', async () => {
      // Arrange
      const uid = 'foo'
      const db = provider.getFirestoreWithAuth({ uid })
      const userDoc = getUsersRef(db).doc(uid)

      // Act - Assert
      await assertSucceeds(userDoc.set(userData))
    })
    test('Authed user cannot create other document', async () => {
      // Arrange
      const db = provider.getFirestoreWithAuth({ uid: 'foo' })
      const userDoc = getUsersRef(db).doc('bar')

      // Act - Assert
      await assertFails(userDoc.set(userData))
    })
  })

  describe('Read', () => {
    test('anonymous cannot read User document', async () => {
      // Arrange
      const db = provider.getFirestoreWithAuth()
      const users = getUsersRef(db)

      // Act - Assert
      await assertFails(users.get())
    })
    test('Authed user can read User documents', async () => {
      // Arrange
      const db = provider.getFirestoreWithAuth({ uid: 'foo' })
      const users = getUsersRef(db)

      // Act - Assert
      await assertSucceeds(users.get())
    })
  })

  describe('Update', () => {
    beforeEach(async () => {
      const db = provider.getAdminFirestore()
      const userDoc = getUsersRef(db).doc('foo')
      await userDoc.set(userData)
    })

    test('Anonymous cannot update document', async () => {
      // Arrange
      const updatedData: User = { ...userData, home: 'Aichi' }
      const db = provider.getFirestoreWithAuth()
      const userDoc = getUsersRef(db).doc('foo')

      // Act - Assert
      await assertFails(userDoc.set(updatedData))
    })
    test('Authed user can update User.name, home and description', async () => {
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
      await assertSucceeds(userDoc.set(updatedData))
    })
    test('Authed user cannot update other document', async () => {
      // Arrange
      const updatedData: User = { ...userData, home: 'Aichi' }
      const db = provider.getFirestoreWithAuth({ uid: 'foo' })
      const userDoc = getUsersRef(db).doc('bar')

      // Act - Assert
      await assertFails(userDoc.set(updatedData))
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
        await assertFails(userDoc.set(updatedData))
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
        expect(userDoc.set(updatedData)).rejects.not.toThrowError()
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
      expect(userDoc.delete()).rejects.toThrowError()
    })
    test('Authed user cannot delete own document', () => {
      // Arrange
      const uid = 'foo'
      const db = provider.getFirestoreWithAuth({ uid })
      const userDoc = getUsersRef(db).doc(uid)

      // Act - Assert
      expect(userDoc.delete()).rejects.toThrowError()
    })
  })
})
