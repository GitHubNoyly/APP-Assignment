from flask import Flask, render_template, jsonify, request, make_response
import sys, json, os

app = Flask(__name__)

# this function will be used to run the html file and view it
@app.route('/')
def displayHomepage():
    return render_template('index.html')


# this function is used to retrieve information from the json file
@app.route("/api/jokes", methods=['GET'])
def getJokes():
    site_root = os.path.realpath(os.path.dirname(__file__))
    json_url = os.path.join(site_root, "data", "jokes.json")

    # used to open the file, the with is used to handle the closing of the file as well
    with open(json_url, 'r') as openfile:
        json_object = json.load(openfile)
    return json_object


#this function is used to upload jokes to the json file
@app.route("/api/jokes", methods=['PUT'])
def uploadJokes():
    print('saving jokes')
    messageOK = jsonify(message="your jokes have been uploaded!")
    messageFail = jsonify(
        message="Uploading Jokes failed")
    if request.is_json:
        # Parse the JSON into a Python dictionary
        req = request.get_json()
        # Print the dictionary
        print(req)
        #save json to file
        site_root = os.path.realpath(os.path.dirname(__file__))
        json_url = os.path.join(site_root, "data", "jokes.json")

        # with keyword deals with closing file etc.
        with open(json_url, 'w') as openfile:
            #uploads to the json file with an indent to improve readability and easier navigating
            json.dump(req, openfile, indent = 3)

        # Return a string along with an HTTP status code
        return messageOK, 200

    else:

        # The request body wasn't JSON so return a 400 HTTP status code
        return messageFail, 400


# run app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
