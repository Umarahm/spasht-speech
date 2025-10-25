# Firebase Upload Error Fix for Vercel Deployment

## Problem
Getting "Unknown error" and JSON parsing errors when uploading recordings to Firebase Storage in Vercel deployment (works fine locally).

## Root Causes Identified

1. **Error Handling**: Error messages were not being properly propagated from the backend to the frontend
2. **Firebase Storage Method**: Using `createWriteStream()` which has compatibility issues with serverless environments
3. **Vercel Configuration**: Serverless function setup needed proper configuration
4. **API Import Path**: Serverless function was importing from wrong compiled location
5. **Firebase Initialization**: Firebase initialization failures were crashing the entire serverless function

## Changes Made

### 1. Updated Error Handling
- Modified `backend/server/index.ts` uploadRecording handler
- Modified `backend/server/routes/jams.ts` uploadJamRecording handler
- Now properly logs and returns actual error messages instead of generic ones

### 2. Changed Firebase Storage Upload Method
- Switched from `file.createWriteStream()` to `file.save()` 
- Better compatibility with Vercel's serverless environment
- Follows the same pattern as the working JAM upload

### 3. Updated Vercel Configuration
- Added serverless function configuration in `vercel.json`
- Configured API rewrites to route `/api/*` to the serverless function
- Set memory limit to 1024MB and max duration to 60s
- Updated build command to ensure backend is built before frontend

### 4. Fixed API Import Path
- Updated `api/index.ts` to import from the correct compiled location (`../backend/dist/server/index.js`)
- This ensures the serverless function can properly load the Express app

### 5. Improved Firebase Initialization Error Handling
- Made Firebase Storage initialization more resilient
- Added proper error handling to prevent crashes when credentials are missing

## Required Environment Variables in Vercel

Make sure these are set in your Vercel project settings:

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com
```

**Important**: When copying `FIREBASE_PRIVATE_KEY` to Vercel, make sure to:
1. Include the entire key including BEGIN/END markers
2. Keep the `\n` characters (don't replace them with actual newlines)
3. Wrap the entire value in quotes if it contains special characters

## Deployment Steps

1. **Commit the changes**:
   ```bash
   git add .
   git commit -m "Fix Firebase upload errors in Vercel deployment"
   git push
   ```

2. **Deploy to Vercel**:
   - If auto-deploy is enabled, Vercel will deploy automatically
   - Or manually trigger deployment from Vercel dashboard

3. **Verify Environment Variables**:
   - Go to Vercel project settings
   - Check Environment Variables section
   - Ensure all Firebase variables are set correctly

4. **Test the upload**:
   - Try uploading a recording in the deployed app
   - Check the browser console for detailed error messages (if any)
   - Check Vercel function logs for backend errors

## Troubleshooting

If you still see errors after deployment:

1. **Check Vercel Logs**:
   - Go to Vercel dashboard → Your Project → Functions tab
   - Look for the `/api` function logs
   - Check for Firebase initialization errors

2. **Verify Firebase Credentials**:
   - Test Firebase connection using the debug endpoint
   - Visit: `https://your-domain.vercel.app/api/debug/firebase`

3. **Check Storage Bucket Permissions**:
   - Ensure Firebase Storage bucket has proper permissions
   - Check Firebase console → Storage → Rules

4. **Validate Environment Variables**:
   - Double-check all Firebase env vars are set correctly
   - Ensure private key is properly formatted with `\n` characters

## Additional Notes

- The fix changes the upload method to be more compatible with serverless environments
- Error messages should now be more descriptive and help identify specific issues
- The Vercel configuration properly routes API requests to the serverless function

