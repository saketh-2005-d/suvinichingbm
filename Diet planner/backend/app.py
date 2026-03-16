"""
Diet Planner Backend API
Integrates with OpenAI for AI-powered diet suggestions
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime
import json
import openai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# OpenAI API Key (set this as environment variable)
openai.api_key = os.getenv('OPENAI_API_KEY')

# Load diet database
with open('../data/diets_database.json', 'r') as f:
    DIET_DATABASE = json.load(f)


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'message': 'Diet Planner API is running'})


@app.route('/api/diets', methods=['GET'])
def get_available_diets():
    """Get list of available diet plans"""
    return jsonify({
        'success': True,
        'diets': DIET_DATABASE['diets']
    })


@app.route('/api/diet/<diet_id>', methods=['GET'])
def get_diet_details(diet_id):
    """Get detailed diet plan"""
    for diet in DIET_DATABASE['diets']:
        if diet['id'] == diet_id:
            return jsonify({'success': True, 'diet': diet})
    return jsonify({'success': False, 'error': 'Diet not found'}), 404


@app.route('/api/ai-suggestion', methods=['POST'])
def get_ai_suggestion():
    """Get AI-powered diet suggestion based on user input"""
    try:
        data = request.json
        user_preferences = data.get('preferences', '')
        dietary_restrictions = data.get('restrictions', '')
        health_goals = data.get('goals', '')
        
        # Build prompt for AI
        prompt = f"""You are an expert nutritionist and diet planner. 
        
Based on the following information, provide a personalized diet recommendation:

Dietary Preferences: {user_preferences}
Dietary Restrictions: {dietary_restrictions}
Health Goals: {health_goals}

Please provide:
1. A personalized diet plan recommendation
2. Suggested daily meal breakdown (breakfast, lunch, dinner, snacks)
3. Key nutrients to focus on
4. Tips for success
5. Foods to include and avoid

Keep the response concise and practical."""

        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful nutritionist and diet expert."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        suggestion = response['choices'][0]['message']['content']
        
        return jsonify({
            'success': True,
            'suggestion': suggestion,
            'timestamp': datetime.now().isoformat()
        })
    
    except openai.error.AuthenticationError:
        return jsonify({
            'success': False,
            'error': 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.'
        }), 401
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/chat', methods=['POST'])
def chat_with_ai():
    """Chat endpoint for continuous conversation with AI bot"""
    try:
        data = request.json
        message = data.get('message', '')
        conversation_history = data.get('history', [])
        
        # Add user message to history
        conversation_history.append({
            'role': 'user',
            'content': message
        })
        
        # Get AI response
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful diet and nutrition expert. Answer questions about diet, nutrition, meal planning, and health. Be concise and practical in your responses."},
                *conversation_history
            ],
            temperature=0.7,
            max_tokens=500
        )
        
        ai_message = response['choices'][0]['message']['content']
        
        return jsonify({
            'success': True,
            'message': ai_message,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/generate-meal-plan', methods=['POST'])
def generate_meal_plan():
    """Generate a complete meal plan using AI"""
    try:
        data = request.json
        days = data.get('days', 7)
        restrictions = data.get('restrictions', '')
        preferences = data.get('preferences', '')
        calories = data.get('calories', 2000)
        
        prompt = f"""Create a {days}-day meal plan with the following specifications:
        
Daily Calorie Target: {calories}
Dietary Restrictions: {restrictions if restrictions else 'None'}
Food Preferences: {preferences if preferences else 'None'}

Provide the meal plan in a structured format with:
- Each day clearly labeled
- Breakfast, lunch, dinner, and snacks for each day
- Approximate calories per meal
- Simple recipes for complex meals
- Shopping list items

Make it practical and easy to follow."""

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert diet planner. Create practical, balanced meal plans."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2000
        )
        
        meal_plan = response['choices'][0]['message']['content']
        
        return jsonify({
            'success': True,
            'meal_plan': meal_plan,
            'days': days,
            'timestamp': datetime.now().isoformat()
        })
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.errorhandler(404)
def not_found(error):
    return jsonify({'success': False, 'error': 'Endpoint not found'}), 404


if __name__ == '__main__':
    app.run(debug=True, port=5000)
