const express = require('express');
const { decode } = require('jsonwebtoken');
const barlist = require('../../models/bar.model')
const ERROR_ENUM = require('../../models/error.enum');

module.exports = ({ barsManager }) => {
    const router = express.Router();

    router.post('/', (req, res) => {
        if (!req.isLoggedIn) return res.status(401).json({ error: 'unauthorized_client' }); 
    });

    router.get('/new', (req, res) => {
        if (!req.isLoggedIn) return res.status(401).json( {error: ERROR_ENUM.UNAUTHORIZED });
        const barRunda = barlist.getRandom();
        const token = req.headers['authorization'].split(' ')[1];
        const { account } = decode(token);

        barsManager.storeBarRunda(barRunda, account, (error, result) => {
            if (error) {
                if (error === ERROR_ENUM.SERVER_ERROR) return res.status(500).json({ error: ERROR_ENUM.SERVER_ERROR });
                else {
                    return res.status(400).json({ error: error });
                }
            } else {
                res.status(200).json({ barrunda: barRunda.list });
            }
        });
    });

    router.get('/:id', (req, res) => {
        const { id } = req.params;
        if (!req.isLoggedIn) {
            res.status(401).json({ error: 'unauthorized_client' });
            return;
        }
        barsManager.getBarrundaById(id, (error, data) => {
            if (error) {
                if (error === ERROR_ENUM.SERVER_ERROR) {
                    res.status(500).json({ error: ERROR_ENUM.SERVER_ERROR });
                    return;
                } else {
                    res.status(400).json({ error: error });
                }
            } else {
                console.log('Barrunda by id: ', data);
                res.status(200).json(data);
            }
        });
    });
    return router;
}