const express = require('express');
const { decode } = require('jsonwebtoken');
const barlist = require('../../models/bar.model')

module.exports = ({ barsManager }) => {
    const router = express.Router();

    router.post('/', (req, res) => {
        if (!req.isLoggedIn) return res.status(401).json({ error: 'unauthorized_client' });
        
    });
}