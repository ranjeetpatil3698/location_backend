const axios = require("axios");

exports.getCordinates = async (location) => {

  //if location is empty return null
  if (location.length === 0) {
    return null;
    }
    
  //fetching cordinates from MAPBOX GEOCODING API  
  let location_data = await axios.get(
    `${process.env.GEOCODING_API}/${location}.json?access_token=${process.env.ACCESS_TOKEN}`
    );
    
   //extracting [longitude,latitude] from center property of response 
  let cordinates = location_data.data.features[0].center;
  return cordinates;
};

exports.getDirections = async (source_cordinates, destination_cordinates) => {
    
  //fetching distance from MAPBOX DIRECTION API
  let directions = await axios.get(
    `${process.env.DRIVING_API}/${source_cordinates[0]},${source_cordinates[1]};${destination_cordinates[0]},${destination_cordinates[1]}?access_token=${process.env.ACCESS_TOKEN}`
    );

    //rounding of distance to 2 decimals after converting it to KM
    let distance = (directions.data.routes[0].distance / 1000).toFixed(2);

    //rounding of duration to 2 decimals after converting it to Hours
    let duration = (directions.data.routes[0].duration / 60 / 60).toFixed(2);

    return {
        distance: distance,
        duration: duration
    }
};
