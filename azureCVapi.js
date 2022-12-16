const express = require('express');
const request = require('request');

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi  = require('swagger-ui-express');

const config = require("dotenv").config();
const ACCESS_KEY = process.env.KEY;
const ENDPOINT = process.env.ENDPOINT;

/**
 * @swagger
 * components:
 *     schemas:
 *         VisionPost:
 *             type: object
 *             properties:
 *                  imageurl:
 *                       required: true
 *                       type: string
 */

 const options={
    swaggerDefinition:{
        openapi: '3.0.0',
            components: {},
        info: {
            title: 'AzureCompVisionAPI',
            version: '1.0.0',
            description: 'Using swagger for REST-like API'
        },
        host:'162.243.174.82:3000',
        basePath: '/',
    },
    apis: ['./azureCVapi.js'],

};

const specs = swaggerJsDoc(options);
const app = express();
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

const bodyParser = require("body-parser");
const cors = require('cors');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const callAzureComputerVisionApi = (imageUrl, apiKey) => {
  return new Promise((resolve, reject) => {
    // Set the request options
    const options = {
      url: 'https://sahanascognitiveresource.cognitiveservices.azure.com/vision/v3.0/analyze',
      //url: 'https://eastus.api.cognitive.microsoft.com/vision/v3.0/analyze',
      //url: ENDPOINT,

      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
        'Content-Type': 'application/json'
      },
      json: {
        url: imageUrl
      }
    };

    // Make the request
    request(options, (err, response, body) => {
      if (err) {
        reject(err);
        return;
      }

      // If the request was successful, resolve the promise with the response body
      resolve(body);
    });
  });
};

app.get('/', (req, res) => {
res.send('Hello! This API helps you to use the features of Microsoft Azure Computer Vision API using Image Analysis');
});

/**
 * @swagger
 * /analyze:
 *    post:
 *       description: Insert a image url to analyze
 *       requestBody:
 *             required: true
 *             content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#components/schemas/VisionPost'
 *       responses:
 *          200:
 *              description: An image was analyzed
 *          422:
 *              description: validation error!
 *          500:
 *              description: invalid image
 */
// This endpoint will be used to analyze an image
app.post('/analyze', async (req, res) => {
    try {
      // Get the URL of the image to analyze from the request body
      const { imageUrl } = req.body;
  
      // TODO: Call the Azure Computer Vision API and get the image analysis result
      const analysisResult = await callAzureComputerVisionApi(imageUrl, ACCESS_KEY);
  
      // Return the analysis result to the client
      res.setHeader('Content-Type', 'application/json');
      res.json(analysisResult);
    } catch (err) {
      // Handle the error and return a appropriate response to the client
      res.status(500).json({ error: err.message });
    }
  });
  
  // Start the server on port 3000
  app.listen(3000, () => {
    console.log('Server listening on port 3000');
  });
  