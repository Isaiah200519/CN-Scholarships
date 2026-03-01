# Firebase Setup Guide - Complete Walkthrough
## For China Scholarships Platform

**Don't worry - we'll go through this slowly and clearly!**

---

## What is Firebase?
Firebase is Google's cloud platform that handles:
- **Authentication** (Login/Signup system)
- **Database** (Stores user data, applications, etc.)
- **All the backend stuff** so you don't have to worry about servers

Your website will connect to Firebase to store and retrieve user information.

---

## PART 1: Create Your Firebase Project

This is where you'll set up your "database in the cloud" - think of it as your application's brain.

### Step 1: Go to Firebase
1. Open your browser and go to: **https://console.firebase.google.com/**
2. You'll see a page that looks like a dashboard. If you need to sign in with Google, do that first.

### Step 2: Create a New Project
1. Look for a button that says **"Add project"** or **"Create a project"**
2. Click it
3. A form will appear. Fill it in:
   - **Project name**: Type `China Scholarships` (or whatever you want)
   - **Analytics**: You can leave this unchecked for now
4. Click **"Create project"**
5. Wait for it to load (about 30 seconds)

### What You Just Did
✅ You've created a "container" in the cloud where all your user data will be stored

---

## PART 2: Enable Email/Password Login

This is the authentication system - what lets people login with email and password.

### Step 3: Set Up Authentication
1. In the Firebase Console, look at the left menu
2. Find **"Build"** section
3. Click on **"Authentication"**
4. You'll see a big button saying **"Get Started"** - click it
5. You'll see different **Sign-in methods** available (Google, Facebook, etc.)
6. Click on **"Email/Password"**
7. You'll see two toggles:
   - ✅ Turn ON: **"Email/Password"**
   - ✅ Turn ON: **"Email link (passwordless sign-in)"**
8. Click **"Save"**

### What You Just Did
✅ You've enabled the login system so users can create accounts and login

---

## PART 3: Create Your Database (Firestore)

The database is where ALL the information gets stored - user profiles, applications, agent info, etc. It's like a filing cabinet in the cloud.

### Step 4: Create Firestore Database
1. In the left menu, still under **"Build"**, click **"Firestore Database"**
2. Click **"Create Database"** button
3. A dialog will appear asking for settings:
   - **Start in**: Choose **"Test mode"** (we'll use this for development)
     - This means anyone can read/write (don't use in production)
   - **Location**: Choose the region closest to where your users are
     - If unsure, choose **"us-central1"** (good default)
4. Click **"Enable"**
5. Wait for it to create (about 1 minute)

### What You Just Did
✅ You've created a cloud database to store all your application data

---

## PART 4: Get Your Firebase Credentials

**Credentials** = Secret codes that let your website talk to Firebase. It's like a password for your application.

### Step 5: Find Your Credentials
1. Look at the top-right of Firebase Console
2. Click the **gear icon ⚙️** (Settings/Project Settings)
3. Click on the tab that says **"Your apps"**
4. You should see an empty section (no apps yet)
5. Look for a button with a **"</ >"** symbol and text saying **"Add app"** or similar
6. Click it
7. Select **"Web"** (not iOS or Android)
8. Copy the app nickname: **"China Scholarships Web"** and click through

### Step 6: Copy Your Keys
After completing Step 5, you'll see a code block that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDxxx...",
  authDomain: "chinascho-xyz.firebaseapp.com",
  projectId: "chinascho-xyz",
  storageBucket: "chinascho-xyz.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xyz"
};
```

**Important**: Copy the ENTIRE code block (you'll need it in the next step)

### What These Keys Mean
- **apiKey**: Password to use Firebase services
- **authDomain**: Where authentication happens
- **projectId**: Your project's unique name
- **storageBucket**: Where files are stored
- **messagingSenderId** & **appId**: Identifiers for your app

---

## PART 5: Add Your Keys to Your Website

Now you tell your website how to connect to Firebase using those keys.

### Step 7: Update the Configuration File
1. Open your website files in VS Code
2. Find the file: **`js/firebase-config.js`**
3. Open it
4. You'll see something like:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

5. **Replace each `"YOUR_..."` with your actual values** from Step 6
   - For example, replace `"YOUR_API_KEY"` with `"AIzaSyDxxx..."`
6. Save the file (Ctrl+S)

**Example of what it should look like after:**

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyDxxx123xyz",
    authDomain: "chinascho-xyz.firebaseapp.com",
    projectId: "chinascho-xyz",
    storageBucket: "chinascho-xyz.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
};
```

### What You Just Did
✅ Your website now knows HOW to connect to your Firebase project

---

## PART 6: Create Your Database Collections

**Collections** = Like tables in Excel. Each collection holds a specific type of data.

You need to create **3 collections** to store different types of information:

### Step 8: Create Collection 1 - Users
This stores information about every person who registers (students, agents, admins)

1. Go back to **Firestore Database** in Firebase Console
2. Click **"Start Collection"** button
3. **Collection ID**: Type `users` (lowercase)
4. Click **"Next"**
5. Click **"Auto ID"** to create a sample document
6. Click **"Save"**

### Step 9: Create Collection 2 - Agents
This stores special information about people who want to be agents

1. In Firestore Database, click **"+ Start Collection"** button again
2. **Collection ID**: Type `agents` (lowercase)
3. Click **"Next"**
4. Click **"Auto ID"**
5. Click **"Save"**

### Step 10: Create Collection 3 - Applications
This stores scholarship applications from students

1. In Firestore Database, click **"+ Start Collection"** button again
2. **Collection ID**: Type `applications` (lowercase)
3. Click **"Next"**
4. Click **"Auto ID"**
5. Click **"Save"**

### What You Just Did
✅ You've created 3 "filing cabinets" where different types of data will be stored

---

## PART 7: Test Your Setup

Let's make sure everything is working!

### Step 11: Test Login
1. In your browser, open: `http://localhost:8000/login.html` or `file:///C:/Users/savie/OneDrive/Desktop/CN Scholarships-version 001/login.html`
2. Try to login with any email
3. Check your browser console for errors:
   - Press **F12** on keyboard
   - Look for red error messages
4. If you see Firebase successfully loaded - ✅ Great!
5. If you see errors - check your firebase-config.js file

### Step 12: Test Registration
1. Open: `register.html`
2. Try to register with:
   - Email: `test@example.com`
   - Password: `123456`
   - Any name and country
3. Click Register
4. Go to Firebase Console > Authentication
5. You should see a new user in the list!

### What You Just Did
✅ You've confirmed Firebase is connected and working!

---

## Summary of What You've Set Up

| What | Where |
|------|-------|
| **Login System** | Firebase Authentication |
| **User Database** | Firestore Collection: `users` |
| **Agent Info** | Firestore Collection: `agents` |
| **Applications** | Firestore Collection: `applications` |
| **Connection Code** | Your website's `firebase-config.js` |

---

## Common Issues & Fixes

### ❌ "Firebase is not defined"
**Problem**: Your firebase-config.js file isn't being loaded
**Fix**: 
1. Check that your HTML files have this line:
   ```html
   <script src="js/firebase-config.js"></script>
   ```
2. Make sure it comes BEFORE other JS files that use Firebase

### ❌ "Cannot read property 'auth' of undefined"
**Problem**: Firebase credentials are wrong
**Fix**:
1. Double-check your apiKey, projectId, etc. in firebase-config.js
2. Go back to Firebase Console > Settings > Your Apps and copy the keys again

### ❌ "Permission denied"
**Problem**: Security rules are too strict
**Fix**: Go to Firestore Database > Rules and make sure you're in **Test Mode**

### ❌ Users not appearing in Firebase Console
**Problem**: Registration didn't work
**Fix**:
1. Check browser console (F12) for error messages
2. Verify email is valid format (example@example.com)
3. Password is at least 6 characters

---

## Your Three User Types

Once setup is complete, your system will have:

### 👤 Students
- Register on `register.html`
- Login to view dashboard
- Manage scholarship applications
- Access: `student-dashboard.html` (after login)

### 👔 Agents
- Register on `register.html?role=agent`
- Application goes to Pending status
- Admin must approve them
- Once approved, access: `agent-dashboard.html`

### 🔐 Administrator
- Must be created by admin in admin dashboard
- Login via: `admin-login.html`
- Can approve/reject agents
- Can view all users
- Access: `admin-dashboard.html`

---

## Next Steps (In Order)

1. ✅ **Complete the 12 steps above**
2. ✅ **Test login/registration** - Make sure users appear in Firebase
3. ✅ **Create your first admin user**
   - Register as student first
   - Then use admin dashboard to create admin account
4. ✅ **Test agent approval**
   - Register as agent
   - Login to admin dashboard
   - Approve the agent application
   - Agent can now login to agent dashboard

---

## Getting Help

If something doesn't work:
1. Check browser console (F12) for error messages
2. Copy-paste the error into Google
3. Check your firebase-config.js is updated correctly
4. Make sure you're in Firestore "Test Mode"
5. Verify all 3 collections exist (users, agents, applications)

---

**You're all set! Your Firebase is ready to use!** 🎉
