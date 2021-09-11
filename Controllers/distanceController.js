const { getCordinates, getDirections } = require('../utils/Api');


exports.getDistance = async (req, res) => {
    
    const { source, destination } = req.query;
    //validating if both source and destination is present in query string 
    if (!source || !destination) {
        res.status(400).json({ message: "Invalid Input Please check your source and destination" });
        return;
    }

    let source_cordinates = undefined;
    let destination_cordinates = undefined;
    let direction = undefined;

    try {
        //fetching cordinates of source
        source_cordinates = await getCordinates(source);
        //fetching cordinates of destination
        destination_cordinates = await getCordinates(destination);

        if (!source_cordinates || !destination_cordinates) {
            //if given source or destination does not exists returns 400 with error
            res.status(400).json({ message: "Invalid Input Please check your source and destination" });
            return;
        }

        //fetching direction for source and destination provided
        direction = await getDirections(source_cordinates, destination_cordinates);
        
    } catch (err) {
        //if any of above API calls of MAPBOX returns error,log them to console and return 500 server error response
        console.log(err)
        res.status(500).json({ message: "Server Error 😥!! try again after sometime" });
    }
    
    //returing distance with other METADATA 
    res.status(200).json({source,source_cordinates,destination,destination_cordinates,direction})
}