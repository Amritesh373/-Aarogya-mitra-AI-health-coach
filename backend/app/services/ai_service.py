from typing import Dict, Any, List, Optional

class AIService:
    def generate_workout_plan(self, user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a workout plan based on user profile"""
        return {
            "weekly_schedule": {
                "monday": {
                    "focus": "Full Body",
                    "exercises": [
                        {"name": "Push-ups", "sets": 3, "reps": "10-12", "rest": "60 sec"},
                        {"name": "Squats", "sets": 3, "reps": "15", "rest": "60 sec"},
                        {"name": "Planks", "sets": 3, "reps": "30 seconds", "rest": "30 sec"}
                    ],
                    "calories_burned": 250
                },
                "tuesday": {
                    "focus": "Cardio",
                    "exercises": [
                        {"name": "Jumping Jacks", "sets": 3, "reps": "30", "rest": "30 sec"},
                        {"name": "High Knees", "sets": 3, "reps": "30", "rest": "30 sec"},
                        {"name": "Burpees", "sets": 3, "reps": "10", "rest": "60 sec"}
                    ],
                    "calories_burned": 300
                },
                "wednesday": {
                    "focus": "Rest Day",
                    "exercises": [],
                    "calories_burned": 0
                },
                "thursday": {
                    "focus": "Upper Body",
                    "exercises": [
                        {"name": "Push-ups", "sets": 3, "reps": "12-15", "rest": "60 sec"},
                        {"name": "Tricep Dips", "sets": 3, "reps": "10-12", "rest": "60 sec"},
                        {"name": "Shoulder Taps", "sets": 3, "reps": "20", "rest": "45 sec"}
                    ],
                    "calories_burned": 280
                },
                "friday": {
                    "focus": "Lower Body",
                    "exercises": [
                        {"name": "Squats", "sets": 3, "reps": "15-20", "rest": "60 sec"},
                        {"name": "Lunges", "sets": 3, "reps": "12 each leg", "rest": "60 sec"},
                        {"name": "Calf Raises", "sets": 3, "reps": "20", "rest": "45 sec"}
                    ],
                    "calories_burned": 290
                },
                "saturday": {
                    "focus": "Full Body",
                    "exercises": [
                        {"name": "Mountain Climbers", "sets": 3, "reps": "30", "rest": "45 sec"},
                        {"name": "Push-ups", "sets": 3, "reps": "10-12", "rest": "60 sec"},
                        {"name": "Squats", "sets": 3, "reps": "15", "rest": "60 sec"}
                    ],
                    "calories_burned": 270
                },
                "sunday": {
                    "focus": "Rest Day",
                    "exercises": [],
                    "calories_burned": 0
                }
            },
            "tips": [
                "Stay hydrated before, during, and after workouts",
                "Focus on proper form rather than speed",
                "Rest at least 48 hours between strength training same muscle groups",
                "Listen to your body - don't push through pain"
            ],
            "progression_guide": "Increase reps or sets each week. Add weight when you can complete all reps with good form.",
            "safety_notes": [
                "Consult a doctor before starting any exercise program",
                "Stop immediately if you feel sharp pain",
                "Warm up properly before each session",
                "Cool down and stretch after workouts"
            ]
        }
    
    def generate_nutrition_plan(self, user_profile: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a nutrition plan based on user profile"""
        return {
            "calories": 2000,
            "macros": {
                "protein": 150,
                "carbs": 200,
                "fats": 65
            },
            "meal_plan": {
                "breakfast": "Oatmeal with berries and nuts",
                "lunch": "Grilled chicken breast with quinoa and vegetables",
                "dinner": "Baked salmon with sweet potato and broccoli",
                "snacks": [
                    "Greek yogurt with honey",
                    "Apple with peanut butter",
                    "Protein shake"
                ]
            },
            "hydration": "Drink 2-3 liters of water daily",
            "tips": [
                "Eat protein with every meal",
                "Include vegetables in lunch and dinner",
                "Plan meals ahead to avoid unhealthy choices",
                "Don't skip breakfast"
            ]
        }
    
    def get_coaching_response(self, user_query: str, user_context: Dict[str, Any]) -> str:
        """Get AI coaching response based on user query and context"""
        
        # Simple keyword-based responses (in real app, this would use AI)
        query_lower = user_query.lower()
        
        if "workout" in query_lower:
            return "For an effective workout, focus on compound exercises like squats, push-ups, and rows. Aim for 3-4 sessions per week with proper rest between."
        
        elif "diet" in query_lower or "food" in query_lower or "eat" in query_lower:
            return "A balanced diet includes lean protein, complex carbs, healthy fats, and plenty of vegetables. Stay consistent with your meals and avoid processed foods."
        
        elif "motivation" in query_lower:
            return "You're doing great! Remember why you started. Every workout brings you closer to your goals. Stay consistent and celebrate small victories!"
        
        elif "weight loss" in query_lower:
            return "Weight loss is about consistency. Focus on a slight calorie deficit, increase protein intake, and combine strength training with cardio. Be patient - sustainable results take time."
        
        elif "muscle" in query_lower:
            return "To build muscle, prioritize progressive overload in your workouts, eat enough protein (1.6-2.2g per kg bodyweight), and ensure adequate recovery between sessions."
        
        else:
            return "I'm here to help with your fitness journey! Whether you need workout advice, nutrition tips, or motivation, just ask. What specific area would you like guidance on?"