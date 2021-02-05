import {
  apps,
  initializeAdminApp,
  initializeTestApp,
  loadFirestoreRules,
} from '@firebase/rules-unit-testing'
import type firebase from 'firebase'
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

  loadRules(): Promise<void> {
    const projectId = this.getProjectID()
    return loadFirestoreRules({ projectId, rules: this.rules })
  }

  getFirestoreWithAuth(auth?: { uid: string }): firebase.firestore.Firestore {
    const projectId = this.getProjectID()
    return initializeTestApp({ projectId, auth }).firestore()
  }

  getAdminFirestore(): firebase.firestore.Firestore {
    return initializeAdminApp({ projectId: this.getProjectID() }).firestore()
  }

  cleanup(): Promise<unknown[]> {
    return Promise.all(apps().map(app => app.delete()))
  }
}
