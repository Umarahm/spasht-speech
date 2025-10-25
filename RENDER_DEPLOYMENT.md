# Deploy Backend to Render

## Step-by-Step Deployment Guide

### 1. Prepare Your Backend

The backend is already configured in the `backend/` directory with:
- ✅ `render.yaml` configuration file
- ✅ Updated `package.json` with production start script
- ✅ Ping service to prevent sleep

### 2. Deploy to Render

#### Option A: Using Render Dashboard (Recommended)

1. **Sign up/Login to Render**
   - Go to https://render.com
   - Sign up or login with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `Umarahm/spasht-speech`
   - Select the repository

3. **Configure the Service**
   - **Name**: `spasht-speech-backend`
   - **Environment**: `Node`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free tier is fine for now

4. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable" and add all these:
   
   ```
   NODE_ENV=production
   PORT=10000
   FRONTEND_URL=https://spasht.netlify.app
   
   # Firebase Config
   FIREBASE_TYPE=service_account
   FIREBASE_PROJECT_ID=<your-project-id>
   FIREBASE_PRIVATE_KEY_ID=<your-private-key-id>
   FIREBASE_PRIVATE_KEY=<your-private-key>
   FIREBASE_CLIENT_EMAIL=<your-client-email>
   FIREBASE_CLIENT_ID=<your-client-id>
   FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
   FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
   FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
   FIREBASE_CLIENT_X509_CERT_URL=<your-cert-url>
   FIREBASE_STORAGE_BUCKET=<your-storage-bucket>
   
   # API Keys
   GEMINI_API_KEY=<your-gemini-key>
   GOOGLE_SPEECH_API_KEY=<your-speech-key>
   OPENAI_API_KEY=<your-openai-key>
   NGROK_URL=<your-ngrok-url>
   
   # Limits
   MAX_ANALYSIS_FILES=10
   MAX_AUDIO_FILES=10
   ```

5. **Create Manual Deploy**
   - Click "Create Web Service"
   - Wait for build to complete (3-5 minutes)

6. **Get Your Backend URL**
   - Once deployed, you'll get a URL like: `https://spasht-speech-backend.onrender.com`
   - Copy this URL!

#### Option B: Using Render CLI

```bash
# Install Render CLI
npm install -g render-cli

# Login
render login

# Deploy backend service
cd backend
render deploy
```

### 3. Set Up Ping Service (Keep Backend Awake)

1. **Create Cron Job in Render**
   - Go to Render Dashboard
   - Click "New +" → "Cron Job"
   - Configure:
     - **Name**: `render-ping-service`
     - **Schedule**: `*/5 * * * *` (every 5 minutes)
     - **Command**: `curl https://spasht-speech-backend.onrender.com/api/health`
     - **Plan**: Free

2. **Alternative: Use External Ping Service**
   - Sign up for https://cron-job.org (free)
   - Create a new cron job:
     - URL: `https://spasht-speech-backend.onrender.com/api/health`
     - Schedule: Every 5 minutes
     - Method: GET

### 4. Update Frontend to Use Backend URL

Once your backend is deployed, update Netlify environment variables:

1. Go to Netlify Dashboard → Your Site → Site Settings → Environment Variables
2. Add/Update:
   ```
   VITE_API_URL=https://spasht-speech-backend.onrender.com
   ```
3. Redeploy your site

### 5. Test the Backend

Test your backend URL:
```bash
curl https://spasht-speech-backend.onrender.com/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "Speech App Backend is running",
  "timestamp": "2025-01-XX..."
}
```

## Important Notes

### Render Free Tier Limitations
- **Sleep**: Backend sleeps after 15 minutes of inactivity
- **Solution**: Use ping service (cron job or external service)
- **Cold Start**: First request after sleep takes 30-60 seconds
- **Bandwidth**: 100GB/month limit on free tier

### Environment Variables Security
- Never commit `.env` files to Git
- Use Render's environment variable UI
- Keep API keys secret

### Backend URL Structure
- Your backend will be available at: `https://spasht-speech-backend.onrender.com`
- API endpoints: `https://spasht-speech-backend.onrender.com/api/*`
- Health check: `https://spasht-speech-backend.onrender.com/api/health`

## Troubleshooting

### Backend Won't Start
- Check Render logs for errors
- Verify all environment variables are set
- Ensure `npm run build` completes successfully

### CORS Errors
- Add your frontend URL to `FRONTEND_URL` environment variable
- Backend already configured to allow Netlify origins

### Ping Service Not Working
- Use external cron service like cron-job.org
- Or use Render's built-in cron jobs
- Verify the backend URL is correct

## Next Steps

After successful deployment:
1. Update Netlify with `VITE_API_URL`
2. Test API calls from your frontend
3. Monitor Render logs for any issues
4. Set up monitoring/alerts if needed

