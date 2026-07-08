import numpy as np
import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler

def generate_synthetic_data(num_samples=5000):
    np.random.seed(42)
    
    # Generate inputs
    age = np.random.randint(13, 80, size=num_samples)
    gender_choice = np.random.choice(['Male', 'Female', 'Non-binary'], size=num_samples)
    height = np.random.randint(100, 220, size=num_samples)
    weight = np.random.randint(25, 200, size=num_samples)
    
    # BMI = weight (kg) / height (m)^2
    bmi = weight / ((height / 100.0) ** 2)
    
    workout_type_choice = np.random.choice(
        ['Cardio', 'Strength', 'HIIT Focus', 'Yoga', 'Running', 'Cycling'], 
        size=num_samples
    )
    
    workout_duration = np.random.randint(15, 181, size=num_samples)
    steps = np.random.randint(0, 15000, size=num_samples)
    heart_rate = np.random.randint(60, 180, size=num_samples)
    calories_consumed = np.random.randint(1000, 4500, size=num_samples)
    
    # Target: Calories Burned base calculation using metabolic physiological approximations
    calories_burned = []
    for i in range(num_samples):
        # Base MET estimation
        if gender_choice[i] == 'Male':
            gender_factor = 1.0
            base_burn = ((-55.0969 + (0.6309 * heart_rate[i]) + (0.1988 * weight[i]) + (0.2017 * age[i])) / 4.184) * workout_duration[i]
        elif gender_choice[i] == 'Female':
            gender_factor = 0.9
            base_burn = ((-20.4022 + (0.4472 * heart_rate[i]) - (0.1263 * weight[i]) + (0.074 * age[i])) / 4.184) * workout_duration[i]
        else: # Non-binary / other average
            gender_factor = 0.95
            base_burn = ((-37.7495 + (0.5390 * heart_rate[i]) + (0.0362 * weight[i]) + (0.1378 * age[i])) / 4.184) * workout_duration[i]
            
        # Ensure base_burn is not negative
        base_burn = max(50.0, base_burn)
            
        # Adjust based on workout type
        workout_multipliers = {
            'Cardio': 1.1,
            'Strength': 0.85,
            'HIIT Focus': 1.25,
            'Yoga': 0.4,
            'Running': 1.2,
            'Cycling': 1.05
        }
        type_multiplier = workout_multipliers[workout_type_choice[i]]
        
        # Calories burned from steps (approx 0.04 calories per step)
        step_burn = steps[i] * 0.04
        
        total_burn = (base_burn * type_multiplier) + step_burn
        
        # Add random normal variance/noise (simulating real-world measurement fluctuations)
        noise = np.random.normal(0, 15)
        total_burn = max(20.0, total_burn + noise)
        
        calories_burned.append(round(total_burn, 1))
        
    df = pd.DataFrame({
        'age': age,
        'gender': gender_choice,
        'height': height,
        'weight': weight,
        'bmi': bmi,
        'workout_type': workout_type_choice,
        'workout_duration': workout_duration,
        'steps': steps,
        'heart_rate': heart_rate,
        'calories_consumed': calories_consumed,
        'calories_burned': calories_burned
    })
    
    return df

def clean_and_prepare_data(df):
    # Handle missing values (simulate checking, though synthetic is complete)
    df = df.dropna()
    
    # Feature Engineering / Encoding
    # Map Genders
    gender_map = {'Male': 0, 'Female': 1, 'Non-binary': 2}
    df['gender_encoded'] = df['gender'].map(gender_map)
    
    # Map Workout Types
    workout_type_map = {
        'Cardio': 0, 
        'Strength': 1, 
        'HIIT Focus': 2, 
        'Yoga': 3, 
        'Running': 4, 
        'Cycling': 5
    }
    df['workout_type_encoded'] = df['workout_type'].map(workout_type_map)
    
    return df, gender_map, workout_type_map

def train_model():
    print("[ML] Generating synthetic dataset...")
    df = generate_synthetic_data()
    
    print("[ML] Cleaning and encoding features...")
    df, gender_map, workout_type_map = clean_and_prepare_data(df)
    
    # Select features
    feature_cols = [
        'age', 'gender_encoded', 'height', 'weight', 'bmi', 
        'workout_type_encoded', 'workout_duration', 'steps', 
        'heart_rate', 'calories_consumed'
    ]
    
    X = df[feature_cols]
    y = df['calories_burned']
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train Regressor
    print("[ML] Training Random Forest Regressor...")
    model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test_scaled)
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    print(f"[ML] Evaluation Results:")
    print(f"    Mean Squared Error (MSE): {mse:.2f}")
    print(f"    R-squared Score (R2): {r2:.4f} (Model explains {r2*100:.2f}% of variance)")
    
    # Save Model Artifacts
    artifacts = {
        'model': model,
        'scaler': scaler,
        'gender_map': gender_map,
        'workout_type_map': workout_type_map,
        'feature_cols': feature_cols
    }
    
    with open('calories_model.pkl', 'wb') as f:
        pickle.dump(artifacts, f)
    print("[ML] Model and preprocessing artifacts saved as 'calories_model.pkl' successfully.")

if __name__ == '__main__':
    train_model()
