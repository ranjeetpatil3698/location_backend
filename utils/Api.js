const axios = require("axios");

exports.getCordinates = async (location) => {
    let cordinates = undefined;
    let location_data = undefined;
    
    const geocoding_endpoint = `${process.env.GEOCODING_API}/${location}.json?access_token=${process.env.FETCH_TOKEN}`;
    
    //if location is empty return null
    if (location.length === 0) {
        return null;
        }

    try {
        //fetching cordinates from MAPBOX GEOCODING API  
    location_data = await axios.get(geocoding_endpoint);
    } catch (err) {
        console.log(err);
        return null;
    }
  
    
   //extracting [longitude,latitude] from center property of response 
   cordinates = location_data.data.features[0].center;
  return cordinates;
};

exports.getDirections = async (source_cordinates, destination_cordinates) => {
    let directions = undefined;
    let distance = undefined;
    let duration = undefined;
    const direction_endpoint = `${process.env.DRIVING_API}/${source_cordinates[0]},${source_cordinates[1]};${destination_cordinates[0]},${destination_cordinates[1]}?access_token=${process.env.FETCH_TOKEN}`;
    //console.log({direction_endpoint})
    try {
        //fetching distance from MAPBOX DIRECTION API
        directions = await axios.get(direction_endpoint);
        //rounding of distance to 2 decimals after converting it to KM
        distance = (directions.data.routes[0].distance / 1000).toFixed(2);

        //rounding of duration to 2 decimals after converting it to Hours
        duration = (directions.data.routes[0].duration / 60 / 60).toFixed(2);

    } catch (err) {
        console.log(err);
        return null;
    }
  
    
    return {
        distance: distance,
        duration: duration
    }
};
