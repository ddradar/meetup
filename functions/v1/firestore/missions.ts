import type { MissionListData } from '@ddradar/meetup-core'
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

admin.initializeApp()
const db = admin.firestore()

export const onUpdate = functions
  .region('asia-northeast1')
  .firestore.document('/version/1/missions/{missionID}')
  .onUpdate(async (snapshot, context) => {
    const newData = snapshot.after.data() as MissionListData
    const missionID = context.params.missionID

    if (!newData.cleared) {
      const message = `/version/1/missions/${missionID}.cleared is false. skipped.`
      functions.logger.info(message)
      return
    }

    const users = await db
      .collection('/version/1/users')
      .where('orderedMission', '==', missionID)
      .get()
    const batch = db.batch()
    users.docs.forEach(doc => {
      functions.logger.info(`Update /version/1/users/${doc.id}`)
      batch.set(doc.ref, { orderedMission: null }, { merge: true })
    })
    await batch.commit()
  })
