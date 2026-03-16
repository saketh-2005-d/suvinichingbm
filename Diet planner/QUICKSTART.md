# 🚀 Quick Start Guide - Diet Planner Pro

## 5-Minute Setup

### Step 1: Get Your API Key (2 minutes)

1. Open https://platform.openai.com/api-keys
2. Sign up or log in
3. Click "Create new secret key"
4. Copy the key to your clipboard

### Step 2: Configure the Backend (2 minutes)

**On Windows:**

```bash
cd backend
copy .env.example .env
# Edit .env and paste your API key on the line: OPENAI_API_KEY=
```

**On Mac/Linux:**

```bash
cd backend
cp .env.example .env
# Edit .env and paste your API key
```

### Step 3: Start the Server (1 minute)

```bash
cd backend
python -m pip install -r requirements.txt
python app.py
```

You should see:

```
 * Running on http://127.0.0.1:5000
```

### Step 4: Open the App

Open `frontend/index.html` in your web browser!

---

## Using the App

### 🥗 Browse Diets

Click on any diet card to see details about:

- Foods to focus on
- Foods to avoid
- Sample daily meals

### 🤖 Chat with AI

Type any nutrition question:

- "What should I eat for breakfast?"
- "Is avocado good for weight loss?"
- "Can I have gluten-free pasta?"

### 🎯 Get Personalized Suggestion

Fill in:

- Food preferences (Mediterranean, Asian, etc.)
- Dietary restrictions (gluten-free, vegan, etc.)
- Health goals (lose weight, build muscle, etc.)

Click "Get AI Suggestion" for personalized advice!

### 📋 Generate Meal Plan

Select:

- Number of days (3, 7, 14, or 30)
- Daily calorie target
- Any restrictions or preferences

Click "Generate Meal Plan" for a complete plan!

---

## Troubleshooting

**Error: "Cannot connect to backend API"**

- Make sure Flask is running in terminal
- Check you're at http://localhost:5000

**Error: "OpenAI API key not configured"**

- Check your `.env` file exists in `backend/` folder
- Verify your API key is correct
- Restart the Flask server

**Error: "ModuleNotFoundError"**

```bash
cd backend
pip install -r requirements.txt
```

---

## Need Help?

See detailed instructions in: **README.md**

---

## What Happens Next?

1. The app loads available diet plans
2. You can explore different diet options
3. Chat with the AI about your nutritional goals
4. Get personalized recommendations
5. Generate custom meal plans

Enjoy! 🥗✨
