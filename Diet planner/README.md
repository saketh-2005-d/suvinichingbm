# 🥗 Diet Planner Pro - AI-Powered Nutrition Guide

A modern web application that provides personalized diet recommendations with an AI chatbot for nutrition advice. Built with Python Flask backend and a responsive HTML/CSS/JS frontend.

## Features

✨ **AI-Powered Recommendations**

- Get personalized diet suggestions based on your preferences, restrictions, and health goals
- Interactive AI chat for real-time nutrition advice
- Generate complete meal plans for 3, 7, 14, or 30 days

📚 **Pre-built Diet Plans**

- Mediterranean Diet
- Ketogenic (Keto) Diet
- Vegan Diet
- Paleo Diet
- Intermittent Fasting

🤖 **AI Assistant**

- Chat with an intelligent nutrition expert
- Ask questions about diet, nutrition, and meal planning
- Get science-backed answers powered by OpenAI's GPT-3.5 Turbo

📋 **Meal Planning**

- Generate customized meal plans
- Specify dietary restrictions and preferences
- Set daily calorie targets
- Get detailed meal breakdowns

## Project Structure

```
Diet planner/
├── backend/
│   ├── app.py                 # Flask application with API endpoints
│   ├── requirements.txt        # Python dependencies
│   └── .env.example           # Environment variables template
├── frontend/
│   ├── index.html             # Main HTML structure
│   ├── styles.css             # Styling and responsive design
│   └── script.js              # Frontend interactivity
└── data/
    └── diets_database.json    # Pre-built diet plans database
```

## Prerequisites

- **Python 3.8+**
- **OpenAI API Key** (Get from: https://platform.openai.com/api-keys)
- **Modern web browser**

## Installation

### 1. Clone/Extract the Project

Navigate to the project directory:

```bash
cd "Diet planner"
```

### 2. Set Up Backend

#### Install Python Dependencies:

```bash
cd backend
pip install -r requirements.txt
```

#### Create Environment File:

Copy `.env.example` to `.env` and add your OpenAI API key:

```bash
copy .env.example .env
# Edit .env and add your OpenAI API key
```

**On Linux/Mac:**

```bash
cp .env.example .env
# Edit .env and add your OpenAI API key
```

### 3. Start Backend Server

```bash
cd backend
python app.py
```

The API will be available at: `http://localhost:5000`

You should see output like:

```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

### 4. Open Frontend

Open `frontend/index.html` in your web browser:

- **Windows:** Double-click `index.html`
- **Or** Open in VS Code and use Live Server extension
- **Or** Use Python's built-in server:
  ```bash
  cd frontend
  python -m http.server 8000
  # Then open: http://localhost:8000
  ```

## Usage

### 1. **Browse Diet Plans**

- Scroll to "Popular Diet Plans" section
- Click any diet card to expand and see detailed information
- View focus foods, foods to avoid, and sample daily meals

### 2. **Get AI Suggestions**

- Fill in your food preferences (e.g., "Mediterranean", "vegetarian")
- Enter dietary restrictions (e.g., "gluten-free", "dairy-free")
- Specify health goals (e.g., "lose weight", "build muscle")
- Click "Get AI Suggestion" for personalized recommendations

### 3. **Chat with AI Assistant**

- Use the chat interface to ask nutrition questions
- Get instant responses from the AI expert
- Ask about specific foods, meal planning, or dietary concerns
- Chat history is maintained during your session

### 4. **Generate Meal Plans**

- Select the number of days (3, 7, 14, or 30)
- Set your daily calorie target
- Add dietary restrictions (optional)
- Specify food preferences (optional)
- Click "Generate Meal Plan" for a complete customized plan

## API Endpoints

### Health Check

```
GET /api/health
```

Returns API status.

### Get Available Diets

```
GET /api/diets
```

Returns list of all available diet plans.

### Get Diet Details

```
GET /api/diet/<diet_id>
```

Returns detailed information about a specific diet.

### Get AI Suggestion

```
POST /api/ai-suggestion
Content-Type: application/json

{
  "preferences": "Mediterranean",
  "restrictions": "gluten-free",
  "goals": "lose weight"
}
```

### Chat with AI

```
POST /api/chat
Content-Type: application/json

{
  "message": "What should I eat for breakfast?",
  "history": []
}
```

### Generate Meal Plan

```
POST /api/generate-meal-plan
Content-Type: application/json

{
  "days": 7,
  "calories": 2000,
  "restrictions": "vegetarian",
  "preferences": "Asian"
}
```

## Environment Variables

Create a `.env` file in the `backend/` directory:

```
OPENAI_API_KEY=your_actual_api_key_here
FLASK_ENV=development
FLASK_DEBUG=True
```

### Getting Your OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and paste it in `.env`
5. Keep your key private - never commit it to version control

## Requirements

Python packages (see `requirements.txt`):

- **Flask** - Web framework
- **Flask-CORS** - Cross-origin requests
- **openai** - OpenAI API client
- **python-dotenv** - Environment variable management
- **Werkzeug** - WSGI utilities

## Troubleshooting

### "Cannot connect to backend API"

- Ensure the Flask server is running on port 5000
- Check that Python and Flask are properly installed
- Run: `python -m pip install -r requirements.txt`

### "OpenAI API key not configured"

- Create `.env` file in the backend directory
- Add your actual OpenAI API key
- Restart the Flask server

### "CORS error in browser"

- Flask-CORS is already configured
- Ensure backend is running
- Try clearing browser cache

### "ModuleNotFoundError"

- Install requirements: `pip install -r requirements.txt`
- Use Python 3.8 or higher
- Use a virtual environment (recommended)

## Setting Up a Virtual Environment (Recommended)

**Windows:**

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

**Linux/Mac:**

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Security Notes

⚠️ **Important:**

- Never commit your `.env` file with your API key
- Add `.env` to `.gitignore`
- Rotate your API keys if you suspect compromise
- The OpenAI API charges per token usage - monitor your usage on the dashboard

## Cost Consideration

Using this application will consume OpenAI API credits:

- **GPT-3.5-Turbo** is affordable and fast
- Monitor your usage at: https://platform.openai.com/account/usage/overview
- Set usage limits in your OpenAI account settings

## Browser Compatibility

Works on:

- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## Future Enhancements

- [ ] User authentication and profiles
- [ ] Save favorite meal plans
- [ ] Nutrition tracking and logging
- [ ] Integration with fitness apps
- [ ] Recipe database with instructions
- [ ] Grocery list generator
- [ ] Mobile app version
- [ ] Database integration for persistence
- [ ] Advanced filtering and search
- [ ] Nutritional analysis and charts

## Disclaimer

This application provides general nutritional information and suggestions. It is not a substitute for professional medical or dietary advice. Always consult with healthcare professionals before making significant dietary changes, especially if you have existing health conditions.

## License

This project is open-source and available for personal and educational use.

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review the API endpoints documentation
3. Verify your OpenAI API key configuration
4. Check browser console for error messages

## Developer Notes

The application uses:

- **Flask** for lightweight REST API
- **OpenAI GPT-3.5-Turbo** for AI suggestions
- **Vanilla JavaScript** for frontend (no heavy dependencies)
- **Responsive CSS Grid** for modern layouts
- **JSON** for data storage (easily upgradeable to a database)

Enjoy your personalized diet planning experience! 🥗✨
