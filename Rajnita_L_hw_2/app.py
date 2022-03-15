import joblib
import pandas as pd
from flask import Flask, render_template, request

app = Flask(__name__)


@app.route('/')
def load():
    return render_template("index.html")


@app.route('/', methods=['POST', 'GET'])
def predict_blood_pressure():
    age = request.form['age']
    weight = request.form['weight']
    prediction = predict(age, weight)
    return render_template('index.html', info=prediction)


def predict(age, weight):
    clf = joblib.load("machine-learning/regr.pkl")
    x = pd.DataFrame([[age, weight]], columns=["Age", "Weight"])
    prediction = clf.predict(x)[0]
    print(prediction)
    return prediction


if __name__ == '__main__':
    app.run()
