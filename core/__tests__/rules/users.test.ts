import FirestoreTestProvider from '../FirestoreTestProvider'

const testName = 'users'
const collectionPath = 'version/1/users'
const provider = new FirestoreTestProvider(testName)

function getUsersRef(db: firebase.firestore.Firestore) {
  return db.collection(collectionPath)
}

describe(`Firestore /${collectionPath}`, () => {
  beforeEach(async () => {
    provider.increment()
    await provider.loadRules()
  })
  afterEach(async () => provider.cleanup())

  describe('read', () => {
    test('anonymous cannot read User document', () => {
      // Arrange
      const db = provider.getFirestoreWithAuth()
      const users = getUsersRef(db)

      // Act - Assert
      expect(users.get()).rejects.toThrowError()
    })
  })
})
