const { Router } = require('express');
const { Theaters } = require('../models/theaters');

const router = Router();

router.get("/theaters", async (req, res) => { 
    const {city, zipcode, latitude, longtitude, theaterId} = req.query;
    const queryDb = {};

    if (city) {
        queryDb['location.address.city'] = {$regex: city};
    }

    if (zipcode) {
        queryDb['location.address.zipcode'] = {$regex: zipcode};
    }

    if (latitude) {
        queryDb['location.geo.coordinates.0'] = latitude;
    }

    if (longtitude) {
        queryDb['location.geo.coordinates.1'] = longtitude;
    }

    if (theaterId) {
        queryDb.theaterId = theaterId;
    }

    const docs = await Theaters.find(queryDb);

    return res.status(200).send(docs);
});

module.exports = { router };