# Deployment Guide for Desi Owl

## Prerequisites

1. Firebase project set up with:
   - Authentication enabled (Email/Password)
   - Firestore Database created
   - Storage enabled
   - Security rules configured

2. Vercel account

3. GitHub repository with the code

## Step 1: Firebase Configuration

### 1.1 Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Follow the setup wizard
4. Once created, go to Project Settings

### 1.2 Get Firebase Credentials

1. In Project Settings > General
2. Scroll to "Your apps" section
3. Click the web icon (</>)
4. Register your app
5. Copy the configuration values

### 1.3 Enable Authentication

1. Go to Authentication > Sign-in method
2. Enable "Email/Password"
3. Save

### 1.4 Create Firestore Database

1. Go to Firestore Database
2. Click "Create database"
3. Choose "Start in production mode"
4. Select a location
5. Click "Enable"

### 1.5 Set Firestore Security Rules

Go to Firestore Database > Rules and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### 1.6 Enable Storage

1. Go to Storage
2. Click "Get started"
3. Use default security rules for now
4. Click "Done"

### 1.7 Set Storage Security Rules

Go to Storage > Rules and paste:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{productId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /categories/{categoryId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 1.8 Create Admin User

1. Go to Authentication > Users
2. Click "Add user"
3. Enter email: `admin@desiowl.com` (or your preferred email)
4. Enter a secure password
5. Click "Add user"
6. Copy the User UID

7. Go to Firestore Database
8. Create a new collection called `users`
9. Add a document with the User UID as the document ID
10. Add fields:
   - `email`: (string) admin@desiowl.com
   - `role`: (string) admin
   - `createdAt`: (timestamp) now

## Step 2: Deploy to Vercel

### 2.1 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Desi Owl luxury fashion catalog"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2.2 Import to Vercel

1. Go to https://vercel.com
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: .next

### 2.3 Add Environment Variables

In Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=<your_api_key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your_project_id>.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your_project_id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your_project_id>.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your_sender_id>
NEXT_PUBLIC_FIREBASE_APP_ID=<your_app_id>
```

### 2.4 Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Visit your deployed site

## Step 3: Post-Deployment Setup

### 3.1 Update Firebase Authorized Domains

1. Go to Firebase Console > Authentication > Settings
2. Under "Authorized domains", add your Vercel domain
3. Example: `desi-owl.vercel.app`

### 3.2 Test Admin Login

1. Visit `https://your-domain.vercel.app/admin/login`
2. Login with admin credentials
3. Verify access to dashboard

### 3.3 Add Sample Categories

1. Go to Admin Dashboard
2. Navigate to Categories
3. Add categories like:
   - Sarees
   - Kurta Sets
   - Lehengas
   - Coord Sets
   - Dupattas

### 3.4 Add Sample Products

1. Go to Products
2. Click "Add Product"
3. Fill in details and upload images
4. Test the product appears on the shop page

### 3.5 Update WhatsApp Number

Update the WhatsApp number in:
- `src/components/product/ProductDetailContent.tsx` (line with `wa.me/`)
- `src/components/layout/Footer.tsx` (WhatsApp link)

Replace `919876543210` with your actual WhatsApp number (with country code, no + or spaces).

## Step 4: Custom Domain (Optional)

### 4.1 Add Domain in Vercel

1. Go to Project Settings > Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### 4.2 Update Firebase

1. Add custom domain to Firebase authorized domains
2. Update any hardcoded URLs if necessary

## Troubleshooting

### Build Fails

- Check all environment variables are set correctly
- Ensure no TypeScript errors: `npm run build` locally
- Check Vercel build logs for specific errors

### Authentication Not Working

- Verify Firebase credentials in environment variables
- Check authorized domains in Firebase Console
- Ensure admin user document exists in Firestore

### Images Not Uploading

- Check Storage security rules
- Verify Storage is enabled in Firebase
- Check browser console for errors

### Products Not Showing

- Verify Firestore security rules
- Check that products collection exists
- Ensure products have all required fields

## Maintenance

### Regular Tasks

1. **Monitor Storage Usage**: Check Firebase Storage usage monthly
2. **Backup Data**: Export Firestore data regularly
3. **Update Dependencies**: Run `npm update` monthly
4. **Check Analytics**: Monitor product views and orders

### Updating Content

- Products: Use admin dashboard
- Categories: Use admin dashboard
- Static content: Update components and redeploy

## Security Checklist

- [ ] Firebase security rules configured
- [ ] Admin user created with strong password
- [ ] Environment variables set in Vercel
- [ ] `.env.local` not committed to Git
- [ ] Authorized domains configured in Firebase
- [ ] Storage rules prevent unauthorized uploads
- [ ] Admin routes protected with authentication

## Support

For deployment issues:
- Check Vercel documentation: https://vercel.com/docs
- Check Firebase documentation: https://firebase.google.com/docs
- Review build logs in Vercel dashboard

---

**Deployment Complete!** 🎉

Your Desi Owl luxury fashion catalog is now live and ready to showcase your beautiful ethnic wear collection.
