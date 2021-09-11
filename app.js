const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { getDistance } = require('./Controllers/distanceController');
const fetch = require('node-fetch');

dotenv.config({ path: './config.env' });

//To add CORS Headers 
app.use(cors());

//To avoid DDOS type of attack this will allow 100 request per IP for 30 minutes
const limiter=rateLimit({
    max:100,
    windowMs:30*60*1000,
    message:'too many requests from this ip,please try again in an hour'
})
app.use('/api', limiter);

const swaggerConfig = {
    swaggerDefinition: {
      info: {
        version: "1.0.0",
        title: "Location API",
        description: "API to get distance between two locations",
        contact: {
          name: "Ranjeet Patil"
        },
        servers: ["http://localhost:8000","https://location-app-backend.herokuapp.com/"]
      }
    },
    apis: ["app.js"]
};
  
const specs = swaggerJsDoc(swaggerConfig);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

//To prevent http parameter pollution we will only allow source and destination in query string
app.use(hpp({whitelist:[
    'source',
    'destination'
]
}));

/**
 * @swagger
 * /api/distance:
 *   get:
 *     description: Returns source,destination cordinates and distance in KM,duration in hours between two locations
 *     parameters:
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *         description: Source Location
 *       - in: query
 *         name: destination
 *         schema:
 *           type: string
 *         description: Destination Location
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: object with source,source_coordinates[long,lat],destination,destination_coordinates[long,lat],distance(KM),duration(hours).
 *       400:
 *         description: Error if source,destination or both are invalid.
 *       500:
 *         description: Error due to issue on Backend.
 *         
 */
app.get("/api/distance", getDistance);


app.get("/node-fetch", async (req, res) => {
  const url = `${process.env.GEOCODING_API}/delhi.json?access_token=${process.env.FETCH_TOKEN}`;
  console.log(url);
  const resp = await fetch(url);
  const data = await resp.json();//assuming data is json
  console.log(data);
  res.json({ data });
})


app.listen(port, () => {
    console.log(`listening on port ${port}`)
})