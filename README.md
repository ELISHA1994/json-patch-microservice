# Json-Patch-Microservice
This is a simple stateless microservice in Nodejs, with three major functionalities -
- Authentication
- JSON patching
- Image Thumbnail Generation

### Public Endpoints
**Login**<br>
Request body contains an arbitrary username/password pair. (accepts any username/password)
A signed Json Web Token (https://jwt.io/) will be returned which can be used to validate future requests.

### Private Endpoints
**Apply Json Patch**<br>
Request body contains a JSON object and a JSON patch object (http://jsonpatch.com/).
service applies the json patch to the json object, and returns the resulting json object.
The service must be provided with a JWT authorization token to be used.

**Create Thumbnail**<br>
Request contains a public image URL.
Service downloads the image, resize to 50x50 pixels, and store the resulting thumbnail in thumbnails folder.
The service must be provided with a JWT authorization token to be used.

### Setting up
- use **npm install** for installing dependencies
- use **npm start** for starting server
- use **npm run test** for running all tests and returning coverage as report

### Usage
- **Login**
    - Request Body -> { "username":"YOUR_USERNAME", "password":"YOUR_PASSWORD" }
    - Returned -> { "token":"YOUR_TOKEN" }
- **JSON Patch**
    - Header -> Authorization : "Bearer YOUR_TOKEN"
    - Request Body -> { "jsonObject": {JSON_OBJECT} , "jsonPatch": [{JSON_PATCH}] }
    - Returned -> { "Patched":"JSON_OBJECT_WITH_PATCH" }
- **Thumbnail Creation**
    - Header -> Authorization : "Bearer YOUR_TOKEN"
    - Request Body -> { "url":"IMAGE_URL" }
    - Returned -> { "message":"RESPECTIVE_MESSAGE" }
    - Thumbnail stored in /public/images/thumbnail

### Testing
Testing is done with **Jest** and **Supertest**.
And Jest --coverage cli option (https://jestjs.io/docs/cli#--coverageboolean) is used to generate code test coverage reports.
