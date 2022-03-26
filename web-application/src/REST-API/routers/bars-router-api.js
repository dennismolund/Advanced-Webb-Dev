const express = require('express');
const { decode } = require('jsonwebtoken');
const { getPlaces } = require('../../service/fetch.data.service');
const barlist = require('../../models/bar.model')
const ERROR_ENUM = require('../../models/error.enum');

module.exports = ({ barsManager }) => {
    const router = express.Router();

    router.post('/', (req, res) => {
        if (!req.isLoggedIn) return res.status(401).json({ error: 'unauthorized_client' }); 
    });

    router.get('/new', async (req, res) => {
        if (!req.isLoggedIn) return res.status(401).json( {error: ERROR_ENUM.UNAUTHORIZED });
        await getPlaces();
        const barRunda = barlist.getRandom();
        const token = req.headers['authorization'].split(' ')[1];
        const { username, sub: userId } = decode(token);
        console.log('Generated barrunda: ', barRunda);
        barsManager.storeBarRunda(barRunda, userId, (error, result) => {
            if (error) {
                if (error === ERROR_ENUM.SERVER_ERROR) return res.status(500).json({ error: ERROR_ENUM.SERVER_ERROR });
                else {
                    return res.status(400).json({ error: error });
                }
            } else {
                res.status(200).json({ barrunda: barRunda.list, id: result.insertId });
            }
        });
    });

    router.get('/delete/:id', (req, res) => {
        const { id } = req.params;
        barsManager.deleteBarrundaById(id, req.account, (error, result) => {
            if (error) {
                if (error === ERROR_ENUM.SERVER_ERROR) return res.status(500).json({ error: ERROR_ENUM.SERVER_ERROR });
                else {
                    return res.status(400).json({ error: error });
                }
            } else {
                res.status(204).send();
            }
        });
    });

    router.get('/:id', (req, res) => {
        const { id } = req.params;
        barsManager.getBarrundaById(id, (error, data) => {
            if (error) {
                if (error === ERROR_ENUM.SERVER_ERROR) {
                    res.status(500).json({ error: ERROR_ENUM.SERVER_ERROR });
                    return;
                } else {
                    res.status(400).json({ error: error });
                    return;
                }
            } else {
                res.status(200).json(data);
                return;
            }
        });
    });
    return router;
}