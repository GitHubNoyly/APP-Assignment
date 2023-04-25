from flask import Flask, render_template, jsonify, request, make_response
import sys, json, os

app = Flask(__name__)

@app.route('/')
def display_homepage():
    return render_template('index.html')

@app.route("/api/journal", methods=['GET'])
def journal():
  site_root = os.path.realpath(os.path.dirname(__file__))
  json_url = os.path.join(site_root, "data", "jokes.json")
  # with keyword deals with closing file etc.
  with open(json_url, 'r') as openfile:
    # Reading from json file
    json_object = json.load(openfile)
  return json_object

@app.route("/api/journal", methods=['PUT'])
def upload():
  messageOK = jsonify(message="Journals uploaded!")
  messageFail = jsonify(message="Uploading Journals failed as dats not in JSON format!")
  if request.is_json:
    req = request.get_json() # Parse the JSON into a Python dictionary
    site_root = os.path.realpath(os.path.dirname(__file__))
    #save json to file
    json_url = os.path.join(site_root, "data", "jokes.json")
    with open(json_url, 'w') as openfile: # with keyword deals with closing file
      json.dump(req, openfile)
      # Return a string along with an HTTP status code
    return messageOK, 200
  else:
    # The request body wasn't JSON so return a 400 HTTP status code
    return messageFail, 400

if __name__ == "__main__":
  app.run(host='0.0.0.0', port=8080)



