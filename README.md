# MDG_Hackathon
This is our submission for MERGE CONFLICT 2026.
Our Team - Gauransh, Gaurav, Parth & Arjun.

---

## Creating a test issue (developer helper)

A helper script is included to insert a test issue into Firestore:

- Script: `scripts/create_test_issue.js`
- Run via npm: `npm run create:issue` or customize arguments:
  - `node scripts/create_test_issue.js --title "Test title" --description "Test desc" --category pothole`

Requirements:
- Provide a Firebase service account JSON by setting `GOOGLE_APPLICATION_CREDENTIALS` to its path or placing `serviceAccountKey.json` in the project root.
- Alternatively, run the Firestore emulator and set `FIRESTORE_EMULATOR_HOST`.

Example:

1. Set env var (PowerShell): `$Env:GOOGLE_APPLICATION_CREDENTIALS = "C:\\path\\to\\key.json"`
2. `npm run create:issue`

The script will print the created document ID on success.
