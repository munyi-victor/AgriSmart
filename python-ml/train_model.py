# train_model.py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

def train_crop_recommendation_model(data_path="seasonal_crops_dataset.csv", model_path="crop_model.joblib"):
    """Trains a Random Forest Classifier for crop recommendation."""

    try:
        df = pd.read_csv(data_path)
    except FileNotFoundError:
        print(f"Error: File not found at {data_path}")
        return

    # Check for the 'Label' column (crop names)
    if 'Label' not in df.columns:
        print("Error: 'Label' column not found in the dataset.")
        return

    # Prepare features (X) and target (y)
    X = df.drop('Label', axis=1)
    y = df['Label']

    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train a Random Forest Classifier
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Save the trained model
    joblib.dump(model, model_path)
    print(f"Model trained and saved to {model_path}")

if __name__ == "__main__":
    train_crop_recommendation_model()