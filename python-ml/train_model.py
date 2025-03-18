import tensorflow as tf
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

# Load dataset
df = pd.read_csv("seasonal_crops_kenya.csv")  # Ensure this file is in the same directory

# Features and labels
X = df[['Rainfall', 'Humidity', 'Temperature']].values
y = df['Label'].values  # Crop labels

# Encode crop labels into numerical values
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# One-hot encode labels
y_one_hot = tf.keras.utils.to_categorical(y_encoded)

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X, y_one_hot, test_size=0.2, random_state=42)

# Normalize features
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Build the model
model = Sequential([
    Dense(64, activation='relu', input_shape=(3,)),  
    Dense(64, activation='relu'),
    Dense(len(label_encoder.classes_), activation='softmax')  # Multi-class classification
])

# Compile the model
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(X_train, y_train, epochs=100, batch_size=32, validation_data=(X_test, y_test))

# Save the trained model
model.save("crop_recommendation_model.h5")
np.save("label_classes.npy", label_encoder.classes_)  # Save label encoder
np.save("scaler.npy", scaler.mean_)  # Save scaler

print("Model training complete. Saved as 'crop_recommendation_model.h5'")
