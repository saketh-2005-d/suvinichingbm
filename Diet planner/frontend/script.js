// Configuration
const API_BASE_URL = "http://localhost:5000/api";
let chatHistory = [];

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  loadDiets();
  checkAPIConnection();
});

/**
 * Check if API is available
 */
async function checkAPIConnection() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      showError("Backend API is not running. Please start the Flask server.");
    }
  } catch (error) {
    showError(
      "Cannot connect to backend API. Make sure Flask server is running on port 5000.",
    );
  }
}

/**
 * Load and display available diets
 */
async function loadDiets() {
  try {
    const response = await fetch(`${API_BASE_URL}/diets`);
    const data = await response.json();

    if (data.success) {
      displayDiets(data.diets);
    } else {
      showError("Failed to load diets");
    }
  } catch (error) {
    console.error("Error loading diets:", error);
    showError("Error loading diets: " + error.message);
  }
}

/**
 * Display diet cards
 */
function displayDiets(diets) {
  const container = document.getElementById("diets-container");
  container.innerHTML = "";

  diets.forEach((diet) => {
    const card = document.createElement("div");
    card.className = "diet-card";
    card.innerHTML = `
            <h3>${diet.name}</h3>
            <p>${diet.description}</p>
            <div>
                <span class="diet-badge">${diet.duration}</span>
                <span class="diet-badge">${diet.benefits.join(", ")}</span>
            </div>
            <div class="diet-details">
                <h4>Focus Foods:</h4>
                <ul>
                    ${diet.focus_foods.map((food) => `<li>✓ ${food}</li>`).join("")}
                </ul>
                <h4>Avoid:</h4>
                <ul>
                    ${diet.avoid_foods.map((food) => `<li>✗ ${food}</li>`).join("")}
                </ul>
                <h4>Sample Day:</h4>
                <p><strong>Breakfast:</strong> ${diet.daily_breakdown.breakfast}</p>
                <p><strong>Lunch:</strong> ${diet.daily_breakdown.lunch}</p>
                <p><strong>Dinner:</strong> ${diet.daily_breakdown.dinner}</p>
                <p><strong>Snacks:</strong> ${diet.daily_breakdown.snacks}</p>
            </div>
        `;

    card.addEventListener("click", function () {
      this.classList.toggle("expanded");
    });

    container.appendChild(card);
  });
}

/**
 * Generate mock AI chat response
 */
function generateMockChatResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();

  const responses = {
    diet: "A diet is a structured eating plan. Different diets (Mediterranean, Keto, Vegan, Paleo) offer various health benefits. The best diet is one you can sustain long-term while meeting your nutritional needs.",
    nutrition:
      "Good nutrition is key to health! Focus on: whole foods, adequate protein, vegetables, healthy fats, and hydration. Each person's nutritional needs vary based on age, activity level, and health goals.",
    weight:
      "Weight management involves balancing calories in vs calories out, along with choosing nutrient-dense foods. Combine a healthy diet with regular physical activity for best results.",
    protein:
      "Protein is essential for muscle repair and building. Good sources include chicken, fish, eggs, beans, tofu, nuts, and dairy. Aim for protein at each meal.",
    vegetarian:
      "A vegetarian diet excludes meat but includes eggs, dairy, vegetables, grains, and legumes. Ensure adequate protein, B12, iron, and other nutrients from varied sources.",
    energy:
      "Low energy can stem from poor nutrition, sleep, stress, or medical issues. Ensure balanced meals, adequate hydration, quality sleep, and regular exercise.",
    meal: "Healthy meals include: lean protein, whole grains, colorful vegetables, and healthy fats. Prep meals ahead for consistency and to avoid unhealthy choices.",
    exercise:
      "Combine nutrition with exercise for best results. Aim for 150 minutes moderate cardio + strength training 2-3x weekly. Nutrition fuels your workouts!",
    default:
      "That's a great nutrition question! Based on scientific evidence: Focus on whole foods, stay hydrated, maintain portion control, and consult healthcare providers for personalized advice. What specific aspect interests you?",
  };

  for (const [key, response] of Object.entries(responses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }

  return responses.default;
}

async function sendChatMessage() {
  const input = document.getElementById("chat-input");
  const message = input.value.trim();

  if (!message) return;

  // Add user message to chat
  addChatMessage(message, "user");
  input.value = "";

  // Disable input while waiting
  input.disabled = true;
  const sendBtn = document.querySelector(".chat-input-area button");
  sendBtn.disabled = true;

  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        history: chatHistory,
      }),
    });

    const data = await response.json();

    if (data.success) {
      addChatMessage(data.message, "ai");
      chatHistory.push({ role: "user", content: message });
      chatHistory.push({ role: "assistant", content: data.message });
    } else {
      // Check if it's a quota error
      if (data.error.includes("quota") || data.error.includes("billing")) {
        const mockResponse = generateMockChatResponse(message);
        addChatMessage(
          mockResponse +
            "\n\n[Demo Mode - For live AI responses, check OpenAI billing]",
          "ai",
        );
        chatHistory.push({ role: "user", content: message });
        chatHistory.push({ role: "assistant", content: mockResponse });
      } else {
        addChatMessage("Error: " + data.error, "ai");
      }
    }
  } catch (error) {
    console.error("Error sending message:", error);
    // On network error, show mock response
    const mockResponse = generateMockChatResponse(message);
    addChatMessage(
      mockResponse + "\n\n[Demo Mode - Backend server not responding]",
      "ai",
    );
    chatHistory.push({ role: "user", content: message });
    chatHistory.push({ role: "assistant", content: mockResponse });
  } finally {
    input.disabled = false;
    sendBtn.disabled = false;
    input.focus();
  }
}

/**
 * Handle Enter key in chat input
 */
function handleChatKeypress(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendChatMessage();
  }
}

/**
 * Add message to chat display
 */
function addChatMessage(text, sender) {
  const messagesContainer = document.getElementById("chat-messages");
  const messageEl = document.createElement("div");
  messageEl.className = `message ${sender}-message`;
  messageEl.innerHTML = `<span>${escapeHtml(text)}</span>`;
  messagesContainer.appendChild(messageEl);

  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Get AI-powered diet suggestion
 */
/**
 * Generate mock AI suggestion for offline/fallback use
 */
function generateMockSuggestion(preferences, restrictions, goals) {
  const mockSuggestions = [
    `Based on your preferences for ${preferences}, dietary needs (${restrictions}), and goal to ${goals}:

PERSONALIZED DIET RECOMMENDATION:

🎯 Recommended Plan: Balanced Nutrition Diet
Duration: Long-term sustainable approach

Key Principles:
• Include whole grains and lean proteins in every meal
• Focus on colorful vegetables for micronutrients
• Stay hydrated with 8-10 glasses of water daily
• Practice portion control and mindful eating

Sample Daily Breakdown:
Breakfast: Oatmeal with fresh fruits and nuts
Lunch: Grilled chicken with quinoa and roasted vegetables
Dinner: Baked fish with sweet potato and steamed broccoli
Snacks: Greek yogurt, almonds, or fruit

Foods to Include:
✓ Lean proteins (chicken, fish, beans)
✓ Whole grains (brown rice, quinoa, oats)
✓ Fresh vegetables (broccoli, spinach, carrots)
✓ Healthy fats (olive oil, nuts, avocado)

Foods to Avoid:
✗ Processed foods and refined sugars
✗ Excessive salt and fried foods
✗ High-fat dairy products
✗ Sugary beverages

Key Nutrients to Monitor:
• Protein: 25-30% of daily calories
• Carbohydrates: 40-45% of daily calories
• Healthy Fats: 25-30% of daily calories

Success Tips:
1. Plan meals ahead of time
2. Track your progress weekly
3. Stay consistent with meal times
4. Incorporate regular physical activity
5. Consult with a healthcare provider if needed`,

    `Your Customized Nutrition Plan for ${goals}:

Based on your interest in ${preferences} cuisine and requirements (${restrictions}), here's a science-backed approach:

PERSONALIZED APPROACH:

✓ Caloric Intake: Moderate and sustainable
✓ Macronutrient Balance: Balanced approach
✓ Meal Frequency: 3 meals + 2 snacks daily

Weekly Meal Structure:
Monday: Mediterranean-inspired meals
Tuesday-Thursday: Mix of ${preferences} cuisine options
Friday-Saturday: Flexible meal choices
Sunday: Meal prep day

Nutritional Priority:
• Ensure adequate micronutrient intake
• Balance blood sugar levels
• Support energy throughout the day
• Promote long-term health

Foods That Work Best:
✓ Legumes and pulses for protein
✓ Seasonal vegetables
✓ Whole grains and seeds
✓ Herbs and spices for flavor

Practical Implementation:
1. Start with small dietary changes
2. Build sustainable eating habits
3. Monitor how you feel
4. Adjust portions as needed
5. Stay flexible and forgiving

Expected Timeline:
• Week 1-2: Adjustment period
• Week 3-4: Notable energy improvement
• Month 2-3: Visible health benefits

Remember: This is general guidance. For medical conditions, consult a healthcare professional.`,
  ];

  return mockSuggestions[Math.floor(Math.random() * mockSuggestions.length)];
}

async function getAISuggestion() {
  const preferences = document.getElementById("preferences").value;
  const restrictions = document.getElementById("restrictions").value;
  const goals = document.getElementById("goals").value;

  if (!preferences && !restrictions && !goals) {
    showError("Please fill in at least one field");
    return;
  }

  const resultDiv = document.getElementById("suggestion-result");
  resultDiv.innerHTML =
    '<div class="loading">Getting personalized suggestion</div>';
  resultDiv.classList.add("active");

  try {
    const response = await fetch(`${API_BASE_URL}/ai-suggestion`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        preferences: preferences,
        restrictions: restrictions,
        goals: goals,
      }),
    });

    const data = await response.json();

    if (data.success) {
      resultDiv.innerHTML = `<div class="success-message">✓ Personalized Suggestion:</div>${escapeHtml(data.suggestion).replace(/\n/g, "<br>")}`;
    } else {
      // Check if it's a quota error
      if (data.error.includes("quota") || data.error.includes("billing")) {
        const mockSuggestion = generateMockSuggestion(
          preferences,
          restrictions,
          goals,
        );
        resultDiv.innerHTML = `<div class="success-message">✓ Personalized Suggestion (Demo Mode):</div>${escapeHtml(mockSuggestion).replace(/\n/g, "<br>")}<br><br><p style="color: #f59e0b; font-size: 0.9rem; margin-top: 1rem;"><strong>Note:</strong> Demo response shown. To get live AI responses, please check your OpenAI account billing at <a href="https://platform.openai.com/account/billing/overview" target="_blank">platform.openai.com/account/billing</a></p>`;
      } else {
        resultDiv.innerHTML = `<div class="error-message">Error: ${data.error}</div>`;
      }
    }
  } catch (error) {
    console.error("Error getting suggestion:", error);
    // On network error, show mock response
    const mockSuggestion = generateMockSuggestion(
      preferences,
      restrictions,
      goals,
    );
    resultDiv.innerHTML = `<div class="success-message">✓ Personalized Suggestion (Demo Mode):</div>${escapeHtml(mockSuggestion).replace(/\n/g, "<br>")}<br><br><p style="color: #f59e0b; font-size: 0.9rem; margin-top: 1rem;"><strong>Note:</strong> Demo response shown. Please ensure backend server is running on http://127.0.0.1:5000</p>`;
  }
}

/**
 * Generate a meal plan
 */
/**
 * Generate mock meal plan for offline/fallback use
 */
function generateMockMealPlan(days, calories, restrictions, preferences) {
  const basePlan = `${days}-DAY MEAL PLAN (${calories} calories/day)
Preferences: ${preferences || "Balanced"}
Restrictions: ${restrictions || "None"}

`;

  const mealOptions = {
    breakfast: [
      "Oatmeal with berries and almonds",
      "Eggs with whole wheat toast and avocado",
      "Greek yogurt with granola and honey",
      "Smoothie bowl with fruits and nuts",
      "Whole grain pancakes with fresh fruit",
    ],
    lunch: [
      "Grilled chicken with quinoa and roasted vegetables",
      "Salmon with brown rice and steamed broccoli",
      "Vegetable stir-fry with tofu over rice",
      "Turkey sandwich on whole wheat with salad",
      "Lentil soup with whole grain bread",
    ],
    dinner: [
      "Baked chicken breast with sweet potato and green beans",
      "Spaghetti squash with marinara and lean meat",
      "Fish tacos with cabbage slaw",
      "Vegetable curry with basmati rice",
      "Grilled steak with roasted root vegetables",
    ],
    snacks: [
      "Greek yogurt with berries",
      "Almonds and dried fruit",
      "Apple with almond butter",
      "Carrot sticks with hummus",
      "String cheese and whole grain crackers",
    ],
  };

  let plan = basePlan;
  for (let day = 1; day <= parseInt(days); day++) {
    plan += `\nDAY ${day}:\n`;
    plan += `Breakfast: ${mealOptions.breakfast[Math.floor(Math.random() * mealOptions.breakfast.length)]}\n`;
    plan += `Lunch: ${mealOptions.lunch[Math.floor(Math.random() * mealOptions.lunch.length)]}\n`;
    plan += `Dinner: ${mealOptions.dinner[Math.floor(Math.random() * mealOptions.dinner.length)]}\n`;
    plan += `Snack: ${mealOptions.snacks[Math.floor(Math.random() * mealOptions.snacks.length)]}\n`;
    plan += `Daily Calories: ~${calories}\n`;
  }

  plan += `\nNUTRITIONAL GUIDELINES:
• Protein: 25-30% of daily calories
• Carbohydrates: 40-45% of daily calories  
• Healthy Fats: 25-30% of daily calories

MEAL PREP TIPS:
1. Prepare ingredients on Sunday
2. Cook proteins in batch for the week
3. Store meals in airtight containers
4. Keep everything organized and labeled
5. Stay flexible - swap meals as needed

SHOPPING LIST ESSENTIALS:
Proteins: Chicken, fish, eggs, beans, tofu
Grains: Brown rice, quinoa, oats, whole wheat bread
Vegetables: Broccoli, spinach, carrots, peppers, tomatoes
Fruits: Apples, berries, bananas, oranges
Healthy Fats: Olive oil, nuts, avocado, seeds

Stay hydrated with 8-10 glasses of water daily!`;

  return plan;
}

async function generateMealPlan() {
  const days = document.getElementById("plan-days").value;
  const calories = document.getElementById("plan-calories").value;
  const restrictions = document.getElementById("plan-restrictions").value;
  const preferences = document.getElementById("plan-preferences").value;

  const resultDiv = document.getElementById("meal-plan-result");
  resultDiv.innerHTML =
    '<div class="loading">Generating your personalized meal plan</div>';
  resultDiv.classList.add("active");

  try {
    const response = await fetch(`${API_BASE_URL}/generate-meal-plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        days: parseInt(days),
        calories: parseInt(calories),
        restrictions: restrictions,
        preferences: preferences,
      }),
    });

    const data = await response.json();

    if (data.success) {
      resultDiv.innerHTML = `<div class="success-message">✓ ${days}-Day Meal Plan Created:</div>${escapeHtml(data.meal_plan).replace(/\n/g, "<br>")}`;
    } else {
      // Check if it's a quota error
      if (data.error.includes("quota") || data.error.includes("billing")) {
        const mockPlan = generateMockMealPlan(
          days,
          calories,
          restrictions,
          preferences,
        );
        resultDiv.innerHTML = `<div class="success-message">✓ ${days}-Day Meal Plan (Demo Mode):</div>${escapeHtml(mockPlan).replace(/\n/g, "<br>")}<br><br><p style="color: #f59e0b; font-size: 0.9rem; margin-top: 1rem;"><strong>Note:</strong> Demo meal plan shown. To get personalized AI-generated meal plans, please check your OpenAI account billing at <a href="https://platform.openai.com/account/billing/overview" target="_blank">platform.openai.com/account/billing</a></p>`;
      } else {
        resultDiv.innerHTML = `<div class="error-message">Error: ${data.error}</div>`;
      }
    }
  } catch (error) {
    console.error("Error generating meal plan:", error);
    // On network error, show mock response
    const mockPlan = generateMockMealPlan(
      days,
      calories,
      restrictions,
      preferences,
    );
    resultDiv.innerHTML = `<div class="success-message">✓ ${days}-Day Meal Plan (Demo Mode):</div>${escapeHtml(mockPlan).replace(/\n/g, "<br>")}<br><br><p style="color: #f59e0b; font-size: 0.9rem; margin-top: 1rem;"><strong>Note:</strong> Demo meal plan shown. Please ensure backend server is running on http://127.0.0.1:5000</p>`;
  }
}

/**
 * Scroll to a specific section
 */
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}

/**
 * Show error message
 */
function showError(message) {
  console.error(message);
  // Optional: Display error in a toast or modal
  alert(message);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Calculate BMI based on user input
 */
function calculateBMI() {
  const heightInput = parseFloat(document.getElementById("height").value);
  const weightInput = parseFloat(document.getElementById("weight").value);
  const heightUnit = document.getElementById("height-unit").value;
  const weightUnit = document.getElementById("weight-unit").value;

  if (!heightInput || !weightInput) {
    showError("Please enter both height and weight");
    return;
  }

  // Convert to metric (cm and kg)
  let heightCm = heightInput;
  if (heightUnit === "m") {
    heightCm = heightInput * 100;
  } else if (heightUnit === "ft") {
    heightCm = heightInput * 30.48;
  } else if (heightUnit === "in") {
    heightCm = heightInput * 2.54;
  }

  let weightKg = weightInput;
  if (weightUnit === "lb") {
    weightKg = weightInput / 2.205;
  }

  // Calculate BMI
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  // Get category and recommendations
  const { category, color, description, suggestions } = getBMICategory(bmi);

  // Display results
  displayBMIResult(bmi, category, color, description, suggestions);
}

/**
 * Get BMI category and recommendations
 */
function getBMICategory(bmi) {
  let category, color, description, suggestions;

  if (bmi < 18.5) {
    category = "Underweight";
    color = "#3498db";
    description =
      "Your BMI indicates that you are underweight. Focus on nutrient-dense foods and gaining healthy weight through a balanced diet.";
    suggestions = [
      "Increase daily calorie intake gradually",
      "Include healthy fats (avocados, nuts, olive oil)",
      "Eat protein-rich foods at every meal",
      "Have frequent, nutritious snacks",
      "Consult a healthcare provider for personalized advice",
    ];
  } else if (bmi < 25) {
    category = "Normal Weight";
    color = "#27ae60";
    description =
      "Your BMI indicates a healthy weight range. Maintain this through balanced nutrition and regular physical activity.";
    suggestions = [
      "Continue balanced diet with all food groups",
      "Stay hydrated with sufficient water intake",
      "Maintain regular physical activity",
      "Get adequate sleep and manage stress",
      "Schedule regular health check-ups",
    ];
  } else if (bmi < 30) {
    category = "Overweight";
    color = "#f39c12";
    description =
      "Your BMI indicates overweight. Consider lifestyle modifications to reach a healthier weight range.";
    suggestions = [
      "Create a moderate calorie deficit",
      "Increase physical activity gradually",
      "Eat more vegetables and whole grains",
      "Reduce sugary drinks and processed foods",
      "Consult a nutritionist for a personalized plan",
    ];
  } else {
    category = "Obese";
    color = "#e74c3c";
    description =
      "Your BMI indicates obesity. It's important to work with healthcare professionals to develop a safe weight loss plan.";
    suggestions = [
      "Consult with a healthcare provider immediately",
      "Work with a registered dietitian",
      "Start with gradual lifestyle changes",
      "Increase physical activity as approved by doctor",
      "Consider behavioral support or counseling",
    ];
  }

  return { category, color, description, suggestions };
}

/**
 * Display BMI calculation results
 */
function displayBMIResult(bmi, category, color, description, suggestions) {
  const resultDiv = document.getElementById("bmi-result");

  // Update BMI number and category
  document.getElementById("bmi-number").textContent = bmi.toFixed(1);
  document.getElementById("bmi-category").textContent = category;
  document.getElementById("bmi-description").textContent = description;

  // Update suggestions list
  const suggestionsList = document.getElementById("bmi-suggestions");
  suggestionsList.innerHTML = suggestions
    .map((suggestion) => `<li>${suggestion}</li>`)
    .join("");

  // Set color based on category
  const categorySpan = document.getElementById("bmi-category");
  categorySpan.style.color = color;

  // Show result
  resultDiv.style.display = "grid";

  // Scroll to result
  resultDiv.scrollIntoView({ behavior: "smooth" });
}
