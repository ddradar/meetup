import * as firebase from '@firebase/testing'
import { readFileSync } from 'fs'

export default class FirestoreTestProvider {
  private testNumber = 0
  private projectName: string
  private rules: string

  constructor(projectName: string) {
    this.projectName = projectName + '-' + Date.now()
    this.rules = readFileSync('../firestore.rules', 'utf8')
  }

  increment(): void {
    this.testNumber++
  }

  private getProjectID() {
    return `${this.projectName}-${this.testNumber}`
  }

  async loadRules(): Promise<void> {
    return firebase.loadFirestoreRules({
      projectId: this.getProjectID(),
      rules: this.rules,
    })
  }

  getFirestoreWithAuth(auth?: { uid: string }): firebase.firestore.Firestore {
    return firebase
      .initializeTestApp({
        projectId: this.getProjectID(),
        auth,
      })
      .firestore()
  }

  getAdminFirestore(): firebase.firestore.Firestore {
    return firebase
      .initializeAdminApp({ projectId: this.getProjectID() })
      .firestore()
  }

  async cleanup(): Promise<unknown[]> {
    return Promise.all(firebase.apps().map(app => app.delete()))
  }
}
