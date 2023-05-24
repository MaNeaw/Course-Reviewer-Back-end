import firebaseAdmin from 'firebase-admin'

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert('./keys/firebase-adminsdk.json'),
})

export default firebaseAdmin
