import os
import pickle
import numpy as np
from flask import Flask, request, jsonify

app = Flask(__name__)

# Manual CORS implementation to avoid flask-cors package dependencies
@app.after_request
def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Global variable for model artifacts
artifacts = None

def load_model():
    global artifacts
    model_path = 'calories_model.pkl'
    if os.path.exists(model_path):
        print(f"[API] Loading model from {model_path}...")
        with open(model_path, 'rb') as f:
            artifacts = pickle.load(f)
        print("[API] Model loaded successfully.")
    else:
        print(f"[API] Model file {model_path} not found. Please run 'train_model.py' first.")

@app.route('/predict-calories', methods=['POST', 'OPTIONS'])
def predict_calories():
    if request.method == 'OPTIONS':
        return jsonify({'status': 'ok'}), 200

    global artifacts
    if artifacts is None:
        load_model()
        if artifacts is None:
            return jsonify({'error': 'ML Model not trained. Run train_model.py first.'}), 500

    try:
        data = request.json
        if not data:
            return jsonify({'error': 'Missing request body'}), 400

        # Required fields check
        required_fields = [
            'age', 'gender', 'height', 'weight', 'bmi', 
            'workout_type', 'workout_duration', 'steps', 
            'heart_rate', 'calories_consumed'
        ]
        
        missing = [f for f in required_fields if f not in data]
        if missing:
            return jsonify({'error': f'Missing inputs: {", ".join(missing)}'}), 400

        # Extract and encode variables
        age = float(data['age'])
        gender = str(data['gender'])
        height = float(data['height'])
        weight = float(data['weight'])
        bmi = float(data['bmi'])
        workout_type = str(data['workout_type'])
        workout_duration = float(data['workout_duration'])
        steps = float(data['steps'])
        heart_rate = float(data['heart_rate'])
        calories_consumed = float(data['calories_consumed'])

        # Preprocessing encoding
        gender_encoded = artifacts['gender_map'].get(gender, 2) # fallback to Non-binary
        workout_type_encoded = artifacts['workout_type_map'].get(workout_type, 0) # fallback to Cardio

        # Feature Vector
        feature_vector = np.array([[
            age, gender_encoded, height, weight, bmi,
            workout_type_encoded, workout_duration, steps,
            heart_rate, calories_consumed
        ]])

        # Scale features
        scaler = artifacts['scaler']
        feature_vector_scaled = scaler.transform(feature_vector)

        # Run Prediction
        model = artifacts['model']
        prediction = model.predict(feature_vector_scaled)[0]

        # Calculate Confidence Score based on Decision Tree prediction variance
        # Standard error / standard deviation of predictions from all forest trees
        tree_predictions = [tree.predict(feature_vector_scaled)[0] for tree in model.estimators_]
        std_dev = np.std(tree_predictions)
        
        # Confidence score represented as a percentage of consistency:
        # A higher standard deviation relative to prediction means lower confidence.
        # Scale between 75% and 99% for a robust, clean user score representation
        rel_std = std_dev / max(1.0, prediction)
        confidence = 1.0 - rel_std
        confidence = float(np.clip(confidence, 0.75, 0.99))

        return jsonify({
            'caloriesBurned': round(prediction, 1),
            'confidence': round(confidence, 2)
        }), 200

    except Exception as e:
        print("[API] Exception during prediction:", str(e))
        return jsonify({'error': f'Internal Server Error: {str(e)}'}), 500

if __name__ == '__main__':
    load_model()
    app.run(host='0.0.0.0', port=5000, debug=True)
