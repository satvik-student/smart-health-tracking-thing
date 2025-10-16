# Test Backend Registration

## Quick Test Command

Run this in Git Bash or PowerShell:

```bash
curl -X POST http://localhost:4000/api/patients/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"phone\":\"1234567890\",\"password\":\"test123\",\"age\":25,\"gender\":\"Male\"}"
```

## Expected Response:

```json
{
  "message": "Patient registered successfully",
  "patient": {
    "patientId": "P002",
    "name": "Test User",
    "phone": "1234567890",
    "age": 25,
    "gender": "Male"
  }
}
```

## What Was Fixed:

### Problem:
- ❌ `patientId` was marked as `required: true`
- ❌ Pre-save hook ran AFTER validation
- ❌ Validation failed because patientId was undefined

### Solution:
✅ Changed `patientId` to not be required (removed `required: true`)
✅ Added `sparse: true` to allow null/undefined values temporarily
✅ Changed hook from `pre('save')` to `pre('validate')` 
✅ Now patientId is generated BEFORE validation runs

## Try Registration from Mobile App Now!

The schema changes are live. Try registering again from your mobile app:

1. Fill in the registration form
2. Click "Register Now"
3. You should see success! 🎉

Patient ID will auto-generate: **P002, P003, P004...**
