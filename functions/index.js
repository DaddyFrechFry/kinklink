// functions/index.js
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const admin = require('firebase-admin');
admin.initializeApp();

exports.mirrorBlock = onDocumentCreated(
  'users/{blockerUid}/blocks/{blockedUid}',
  async (event) => {
    const { blockerUid, blockedUid } = event.params;
    await admin.firestore()
      .doc(`users/${blockedUid}/blockedBy/${blockerUid}`)
      .set({ blockedAt: admin.firestore.FieldValue.serverTimestamp() });
  }
);