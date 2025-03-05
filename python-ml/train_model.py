import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

data = pd.read_csv('crop_data.csv')

x = data[['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']]
y = data['label']

clf = RandomForestClassifier()
clf.fit(x, y)

joblib.dump(clf, 'crop_recommendation_model.pkl')
print('Model trained successfully')