export default {
  "swagger": "2.0",
  "info": {
    "version": "3.0.0",
    "title": "Json-Patch-Microservice",
    "description": "This provides an appropriate documentation on how to consume the api.",
    "license": {
      "name": "MIT",
      "url": "https://opensource.org/licenses/MIT"
    }
  },
  "host": "localhost:1337",
  "basePath": "/",
  "tags": [
    {
      "name": "Public Endpoints",
      "description": "All Public Endpoints"
    },
    {
      "name": "Private Endpoints",
      "description": "All Private Endpoints"
    }
  ],
  "schemes": ["http", "https"],
  "consumes": ["application/json"],
  "produces": ["application/json"],
  "paths": {
    "/api/v1/health": {
      "get": {
        "tags": ["Public Endpoints"],
        "summary": "A public endpoint to check the server running health",
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/health-response"
            }
          }
        }
      }
    },
    "/api/v1/login": {
      "post": {
        "tags": ["Public Endpoints"],
        "description": "Login a user and returns token",
        "summary": "A Login Request Endpoints that returns a signed Json Web Token",
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "description": "Login request body",
            "required": false,
            "schema": {
              "$ref": "#/definitions/login"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/token"
            }
          }
        }
      }
    },
    "/api/v1/jsonpatch": {
      "post": {
        "tags": ["Private Endpoints"],
        "description": "Apply Json Patch",
        "summary": "Request body contains a JSON object and a JSON patch object",
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "description": "service applies the json patch to the json object, and returns the resulting json object.",
            "required": true,
            "schema": {
              "$ref": "#/definitions/json-patch"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/json-patch-response"
            }
          }
        }
      }
    },
    "/api/v1/image": {
      "post": {
        "tags": ["Private Endpoints"],
        "description": "Create Thumbnail",
        "summary": "Request contains a public image URL",
        "parameters": [
          {
            "name": "body",
            "in": "body",
            "description": "Service downloads the image, resize to 50x50 pixels, and store the resulting thumbnail in thumbnails folder",
            "required": true,
            "schema": {
              "$ref": "#/definitions/image"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "$ref": "#/definitions/image-response"
            }
          }
        }
      }
    }
  },
  "definitions": {
    "health-response": {
      "type": "object",
      "required": ["message"],
      "properties": {
        "message": {
          "type": "string"
        }
      }
    },
    "login": {
      "type": "object",
      "required": ["username", "password"],
      "properties": {
        "username": {
          "type": "string"
        },
        "password": {
          "type": "string"
        }
      }
    },
    "token": {
      "type": "object",
      "required": ["accessToken"],
      "properties": {
        "accessToken": {
          "type": "string"
        }
      }
    },
    "json-patch": {
      "type": "object",
      "required": ["jsonObject", "jsonPatch"],
      "properties": {
        "jsonObject": {
          "type": "object"
        },
        "jsonPatch": {
          "type": "object"
        }
      }
    },
    "json-patch-response": {
      "type": "object",
      "required": ["Patch"],
      "properties": {
        "Patch": {
          "type": "object"
        }
      }
    },
    "image": {
      "type": "string",
      "required": ["url"],
      "properties": {
        "url": {
          "type": "string"
        }
      }
    },
    "image-response": {
      "type": "object",
      "required": ["message"],
      "properties": {
        "message": {
          "type": "string"
        }
      }
    }
  }
}
