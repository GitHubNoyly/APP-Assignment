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

@app.route("/api/jokes", methods=['PUT'])
def uploadjoke():
    print('saving joke')
    messageOK = jsonify(message="Jokes Successfully uploaded!")
    messageFail = jsonify(message="Uploading jokes failed")
    if request.is_json:
        # Parse the JSON into a Python dictionary
        req = request.get_json()
        # Print the dictionary
        print(req)
        #save json to file
        # file_name = "data/journal_test.json"
        site_root = os.path.realpath(os.path.dirname(__file__))
        json_url = os.path.join(site_root, "data", "jokes.json")

        # with keyword deals with closing file etc.
        with open(json_url, 'w') as openfile:
            json.dump(req, openfile)

        # Return a string along with an HTTP status code
        return messageOK, 200

    else:

        # The request body wasn't JSON so return a 400 HTTP status code
        return messageFail, 400

if __name__ == "__main__":
  app.run(host='0.0.0.0', port=8080)
