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
    test('Anonymous cannot create document', () => {
      // Arrange
      const db = provider.getFirestoreWithAuth()
      const userDoc = getUsersRef(db).doc('foo')

      // Act - Assert
      expect(userDoc.set(userData)).rejects.toThrowError()
    })
    test('Authed user can create own document', () => {
      // Arrange
      const uid = 'foo'
      const db = provider.getFirestoreWithAuth({ uid })
      const userDoc = getUsersRef(db).doc(uid)

      // Act - Assert
      expect(userDoc.set(userData)).rejects.not.toThrowError()
    })
    test('Authed user cannot create other document', () => {
      // Arrange
      const db = provider.getFirestoreWithAuth({ uid: 'foo' })
      const userDoc = getUsersRef(db).doc('bar')

      // Act - Assert
      expect(userDoc.set(userData)).rejects.toThrowError()
    })
  })

  describe('Read', () => {
    test('anonymous cannot read User document', () => {
      // Arrange
      const db = provider.getFirestoreWithAuth()
      const users = getUsersRef(db)

      // Act - Assert
      expect(users.get()).rejects.toThrowError()
    })
    test('Authed user can read User documents', () => {
      // Arrange
      const db = provider.getFirestoreWithAuth({ uid: 'foo' })
      const users = getUsersRef(db)

      // Act - Assert
      expect(users.get()).rejects.not.toThrowError()
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
      expect(userDoc.set(updatedData)).rejects.toThrowError()
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
      expect(userDoc.set(updatedData)).rejects.not.toThrowError()
    })
    test('Authed user cannot update other document', () => {
      // Arrange
      const updatedData: User = { ...userData, home: 'Aichi' }
      const db = provider.getFirestoreWithAuth({ uid: 'foo' })
      const userDoc = getUsersRef(db).doc('bar')

      // Act - Assert
      expect(userDoc.set(updatedData)).rejects.toThrowError()
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
        expect(userDoc.set(updatedData)).rejects.toThrowError()
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
