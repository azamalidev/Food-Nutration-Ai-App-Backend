import DishService from "../../services/dishes.js";
import MealService from "../../services/meal.js";
import UserService from "../../services/user.js";
import httpResponse from "../../utils/httpResponse.js";

const controller = {

  register: async (req, res) => {
    const addResponse = await UserService.add(req.body);
    if (addResponse.message === "success") {
      return httpResponse.CREATED(res, addResponse.data);
    } else if (addResponse.message === "failed") {
      return httpResponse.CONFLICT(res, addResponse.data);
    } else {
      return httpResponse.INTERNAL_SERVER(res, addResponse.data);
    }
  },


  login: async (req, res) => {
    const data = await UserService.login(req.body);
    if (data.message === "success") {
      return httpResponse.SUCCESS(res, data.data);
    } else {
      return httpResponse.NOT_FOUND(res, data.data, data.data);
    }
  },


  userProfile: async (req, res) => {
    try {
      const data = await UserService.UserProfile(req.user._id);
      const meals = await MealService.getUserMeals(req.user._id);
      const dish = await DishService.getUserDish(req.user._id);

      return httpResponse.SUCCESS(res, {
        data,
        meals,
        dish
      });
    } catch (error) {
      return httpResponse.INTERNAL_SERVER(res, error);
    }
  },


  update: async (req, res) => {

    req.body.id = req.user._id;

    const updateResponse = await UserService.update(req.body);
    if (updateResponse) {
      return httpResponse.SUCCESS(res, updateResponse);
    } else {
      return httpResponse.INTERNAL_SERVER(res, updateResponse);
    }
  },

  updateAdmin: async (req, res) => {
    console.log("gggzsxdcfvg", req.body)
    req.body.id = req.params.id;

    const updateResponse = await UserService.update(req.body);
    console.log("updateResponse", updateResponse)
    if (updateResponse) {
      return httpResponse.SUCCESS(res, updateResponse);
    } else {
      return httpResponse.INTERNAL_SERVER(res, updateResponse);
    }
  },

  delete: async (req, res) => {
    try {
      const data = await UserService.delete(req.params.id);
      if (data.message === "success") {
        return httpResponse.SUCCESS(res, data.data);
      } else {
        return httpResponse.NOT_FOUND(res, data.data);
      }
    } catch (error) {
      return httpResponse.INTERNAL_SERVER(res, error.message);
    }
  },

  getAll: async (req, res) => {
    try {
      const data = await UserService.getAll();
      if (data.message === "success") {
        return httpResponse.SUCCESS(res, data.data);
      } else {
        return httpResponse.INTERNAL_SERVER(res, data.data);
      }
    } catch (error) {
      return httpResponse.INTERNAL_SERVER(res, error.message);
    }
  },


  // Get user by ID
  getById: async (req, res) => {
    try {
      const data = await UserService.getById(req.params.id);
      if (data.message === "success") {
        return httpResponse.SUCCESS(res, data.data);
      } else {
        return httpResponse.NOT_FOUND(res, data.data);
      }
    } catch (error) {
      return httpResponse.INTERNAL_SERVER(res, error.message);
    }
  },


  generateMealPlan: async (req, res) => {
    try {
      const userProfile = req.body;
      console.log("req.body", req.body)

      const systemPrompt = `You are a certified nutritionist AI. Generate a personalized daily meal plan based on the user's profile.
      
      User Profile:
      - Age: ${userProfile.age || 'not specified'}
      - Gender: ${userProfile.gender || 'not specified'}
      - Weight: ${userProfile.weight || 'not specified'} kg
      - Height: ${userProfile.height || 'not specified'} cm
      - Activity Level: ${userProfile.activityLevel || 'moderate'}
      - Dietary Preferences: ${userProfile.dietaryPreferance || 'none'}
      - Health Goals: ${userProfile.healthGoal || 'maintain health'}
    
      
      Create a balanced meal plan that meets their nutritional needs and preferences.
      Ensure meals are practical, delicious, and nutritionally balanced.
      Include accurate nutritional information for each meal.
      
      Respond with JSON in this exact format:`;

      const apiKey = process.env.GEMINI_API_KEY || "AIzaSyADAuBQ6GEFPOf6Dep1Gvm9joYTDFU2oN8";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`;

      const requestBody = {
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              date: { type: "string" },
              breakfast: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  ingredients: { type: "array", items: { type: "string" } },
                  instructions: { type: "array", items: { type: "string" } },
                  prepTime: { type: "number" },
                  calories: { type: "number" },
                  protein: { type: "number" },
                  carbs: { type: "number" },
                  fat: { type: "number" },
                  servings: { type: "number" }
                },
                required: ["name", "description", "ingredients", "instructions", "prepTime", "calories", "protein", "carbs", "fat", "servings"]
              },
              lunch: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  ingredients: { type: "array", items: { type: "string" } },
                  instructions: { type: "array", items: { type: "string" } },
                  prepTime: { type: "number" },
                  calories: { type: "number" },
                  protein: { type: "number" },
                  carbs: { type: "number" },
                  fat: { type: "number" },
                  servings: { type: "number" }
                },
                required: ["name", "description", "ingredients", "instructions", "prepTime", "calories", "protein", "carbs", "fat", "servings"]
              },
              dinner: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  ingredients: { type: "array", items: { type: "string" } },
                  instructions: { type: "array", items: { type: "string" } },
                  prepTime: { type: "number" },
                  calories: { type: "number" },
                  protein: { type: "number" },
                  carbs: { type: "number" },
                  fat: { type: "number" },
                  servings: { type: "number" }
                },
                required: ["name", "description", "ingredients", "instructions", "prepTime", "calories", "protein", "carbs", "fat", "servings"]
              },
              totalCalories: { type: "number" },
              totalProtein: { type: "number" },
              totalCarbs: { type: "number" },
              totalFat: { type: "number" }
            },
            required: ["date", "breakfast", "lunch", "dinner", "totalCalories", "totalProtein", "totalCarbs", "totalFat"]
          }
        },
        contents: [
          {
            parts: [
              {
                text: "Generate a personalized meal plan for today based on the user profile provided."
              }
            ]
          }
        ]
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        console.error(`Error response from API: ${response.status}`);
        return httpResponse.INTERNAL_SERVER(res, {
          error: "Failed to generate meal plan. Please try again later."
        });
      }

      const data = await response.json();
      const rawJson = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawJson) {
        return httpResponse.INTERNAL_SERVER(res, {
          error: "No valid meal plan received from the API."
        });
      }

      const mealPlan = JSON.parse(rawJson);
      return httpResponse.SUCCESS(res, mealPlan);

    } catch (error) {
      console.error("Error generating meal plan:", error);
      return httpResponse.INTERNAL_SERVER(res, {
        error: `Failed to generate meal plan: ${error.message}`
      });
    }
  },




  getRecipeRecommendations: async (req, res) => {
    try {
      const {
        availableIngredients = [],
        dietaryPreferences = [],
        maxPrepTime,
        cuisineType
      } = req.body;

      // Validate input
      if (!availableIngredients || !Array.isArray(availableIngredients) || availableIngredients.length === 0) {
        return httpResponse.BAD_REQUEST(res, {
          error: "Please provide at least one available ingredient"
        });
      }

      const systemPrompt = `You are a professional chef AI. Create recipe recommendations based on available ingredients and preferences.
      
      Available Ingredients: ${availableIngredients.join(', ')}
      Dietary Preferences: ${dietaryPreferences.join(', ') || 'none'}
      Max Prep Time: ${maxPrepTime || 'no limit'} minutes
      Cuisine Type: ${cuisineType || 'any'}
      
      Generate 3-5 recipe recommendations that make good use of the available ingredients.
      Provide detailed, easy-to-follow instructions.
      Include accurate nutritional estimates and cooking tags.
      
      Respond with JSON in this exact format:`;

      const apiKey = process.env.GEMINI_API_KEY || "AIzaSyADAuBQ6GEFPOf6Dep1Gvm9joYTDFU2oN8";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      const requestBody = {
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                ingredients: { type: "array", items: { type: "string" } },
                instructions: { type: "array", items: { type: "string" } },
                prepTime: { type: "number" },
                cookTime: { type: "number" },
                servings: { type: "number" },
                calories: { type: "number" },
                protein: { type: "number" },
                tags: { type: "array", items: { type: "string" } },
                difficulty: { type: "string", enum: ["easy", "medium", "hard"] }
              },
              required: ["name", "description", "ingredients", "instructions", "prepTime", "cookTime", "servings", "calories", "protein", "tags", "difficulty"]
            }
          }
        },
        contents: [
          {
            parts: [
              {
                text: "Generate recipe recommendations based on the provided ingredients and preferences."
              }
            ]
          }
        ]
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        console.error(`Error response from API: ${response.status}`);
        return httpResponse.INTERNAL_SERVER(res, {
          error: "Failed to generate recipe recommendations. Please try again later."
        });
      }

      const data = await response.json();
      const rawJson = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawJson) {
        return httpResponse.INTERNAL_SERVER(res, {
          error: "No valid recipe recommendations received from the API."
        });
      }

      const recipes = JSON.parse(rawJson);
      return httpResponse.SUCCESS(res, recipes);

    } catch (error) {
      console.error("Error getting recipe recommendations:", error);
      return httpResponse.INTERNAL_SERVER(res, {
        error: `Failed to get recipe recommendations: ${error.message}`
      });
    }
  },

  generateGroceryList: async (req, res) => {
    try {
      const { mealPlan } = req.body;

      // Validate input
      if (!mealPlan) {
        return httpResponse.BAD_REQUEST(res, {
          error: "Please provide a meal plan to generate grocery list"
        });
      }

      const systemPrompt = `You are a meal planning assistant. Generate a comprehensive grocery list from the provided meal plan.
      
      Organize ingredients by category (produce, proteins, dairy, pantry, etc.).
      Estimate appropriate quantities for the number of servings.
      Group similar items together and avoid duplicates.
      
      Respond with JSON in this exact format:`;

      const apiKey = process.env.GEMINI_API_KEY || "AIzaSyADAuBQ6GEFPOf6Dep1Gvm9joYTDFU2oN8";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      const requestBody = {
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                quantity: { type: "string" },
                category: { type: "string" }
              },
              required: ["name", "quantity", "category"]
            }
          }
        },
        contents: [
          {
            parts: [
              {
                text: `Generate a grocery list for this meal plan: ${JSON.stringify(mealPlan)}`
              }
            ]
          }
        ]
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        console.error(`Error response from API: ${response.status}`);
        return httpResponse.INTERNAL_SERVER(res, {
          error: "Failed to generate grocery list. Please try again later."
        });
      }

      const data = await response.json();
      const rawJson = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawJson) {
        return httpResponse.INTERNAL_SERVER(res, {
          error: "No valid grocery list received from the API."
        });
      }

      const groceryList = JSON.parse(rawJson);
      return httpResponse.SUCCESS(res, groceryList);

    } catch (error) {
      console.error("Error generating grocery list:", error);
      return httpResponse.INTERNAL_SERVER(res, {
        error: `Failed to generate grocery list: ${error.message}`
      });
    }
  }
}

export default controller;
