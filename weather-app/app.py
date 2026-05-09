from flask import Flask, render_template, request
from weather import main as get_weather

app = Flask(__name__)

#rotas
@app.route('/', methods=['GET', 'POST'])
def index():
    data = None
    error = None

    if request.method == 'POST':
        city = request.form['cityName']
        state = request.form['stateName']
        country = request.form['countryName']

        data = get_weather(city, state, country)
        
        if data is None:
            error = 'City not found. Please try again.'

    return render_template('index.html', data=data, error=error)

if __name__ == "__main__":
    app.run(debug=True)