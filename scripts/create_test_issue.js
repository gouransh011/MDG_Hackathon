#!/usr/bin/env node
/**
 * create_test_issue.js
 *
 * Usage:
 *   node scripts/create_test_issue.js --title "Pothole" --description "Near main gate" --category pothole
 *
 * Requirements:
 * - Provide service account via GOOGLE_APPLICATION_CREDENTIALS env var pointing to a JSON key file
 *   OR run Firestore emulator and set FIRESTORE_EMULATOR_HOST (no credentials needed)
 */

import fs from 'fs'
import path from 'path'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

function parseArgs() {
  const args = process.argv.slice(2)
  const out = {}
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2)
      const val = args[i+1] && !args[i+1].startsWith('--') ? args[++i] : true
      out[key] = val
    }
  }
  return out
}

async function main() {
  const args = parseArgs()
  const title = args.title || 'Test issue — Pothole near library'
  const description = args.description || 'This is an automatically created test issue.'
  const category = args.category || 'pothole'

  // Initialize admin SDK
  try {
    if (!getApps().length) {
      const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(process.cwd(), 'serviceAccountKey.json')
      if (process.env.FIRESTORE_EMULATOR_HOST) {
        // Running against emulator - no credential needed
        initializeApp()
        console.log('Initialized Firebase Admin using emulator (FIRESTORE_EMULATOR_HOST detected).')
      } else if (fs.existsSync(credPath)) {
        const key = JSON.parse(fs.readFileSync(credPath, 'utf8'))
        initializeApp({ credential: cert(key) })
        console.log('Initialized Firebase Admin using service account:', credPath)
      } else {
        console.error('Service account not found. Set GOOGLE_APPLICATION_CREDENTIALS or place serviceAccountKey.json in the project root, or run Firestore emulator and set FIRESTORE_EMULATOR_HOST.')
        process.exit(1)
      }
    }

    const db = getFirestore()
    const docRef = await db.collection('issues').add({
      title,
      description,
      category,
      photoURL: '',
      location: { lat: 28.6139, lng: 77.2090 },
      status: 'reported',
      reporterUid: 'test-user',
      createdAt: FieldValue.serverTimestamp(),
      test: true
    })

    console.log('Test issue created with ID:', docRef.id)
    process.exit(0)
  } catch (err) {
    console.error('Error creating test issue:', err.message || err)
    process.exit(1)
  }
}

main()
