import {
  apps,
  initializeAdminApp,
  loadFirestoreRules,
} from '@firebase/rules-unit-testing'
import type firebase from 'firebase'
import { readFileSync } from 'fs'

const projectId = 'ddradar-meetup'

export default class FirestoreTestProvider {
  private rules: string

  constructor() {
    this.rules = readFileSync('../firestore.rules', 'utf8')
  }

  loadRules(): Promise<void> {
    return loadFirestoreRules({ projectId, rules: this.rules })
  }

  getAdminFirestore(): firebase.firestore.Firestore {
    return initializeAdminApp({ projectId }).firestore()
  }

  cleanup(): Promise<unknown[]> {
    return Promise.all(apps().map(app => app.delete()))
  }
}
