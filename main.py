from flask import Flask, render_template, jsonify, request, make_response
import sys, json, os

app = Flask(__name__)

@app.route('/')
def display_homepage():
    return render_template('index.html')

@app.route("/api/jokes", methods=['GET'])
def joke():
  site_root = os.path.realpath(os.path.dirname(__file__))
  json_url = os.path.join(site_root, "data", "jokes.json")
  file = open(json_url, "r")
  
  return file.read()


if __name__ == "__main__":
  app.run(host='0.0.0.0', port=8080)



