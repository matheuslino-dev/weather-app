from flask import Flask, render_template, jsonify
import requests

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/color/<hexcolor>")
def get_color_info(hexcolor):

    url = f"https://www.thecolorapi.com/id?hex={hexcolor}"

    response = requests.get(url)
    data = response.json()

    return jsonify({
        "hex": data["hex"]["value"],
        "rgb": data["rgb"]["value"],
        "name": data["name"]["value"],
        "hsl": data["hsl"]["value"],
        "hsv": data["hsv"]["value"],
        "xyz": {
            "X": data["XYZ"]["X"],
            "Y": data["XYZ"]["Y"],
            "Z": data["XYZ"]["Z"]
        }
    })


if __name__ == "__main__":
    app.run(debug=True)