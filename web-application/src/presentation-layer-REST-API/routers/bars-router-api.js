const express = require('express');
const { decode } = require('jsonwebtoken');
const { getPlaces } = require('../../../data-access-layer/service/fetch.data.service');
const barlist = require('../../../business-logic-layer/models/pubcrawlFactory')
const ERROR_ENUM = require('../../../business-logic-layer/models/error_enum');

module.exports = ({ barsManager, accountManager }) => {
    const router = express.Router();

    router.get('/new', accountManager.hasTeamCheck, async (req, res) => {
        if (!req.isLoggedIn) return res.status(401).json( {error: ERROR_ENUM.UNAUTHORIZED });
        await getPlaces();
        const pubcrawl = barlist.getRandom();
        const token = req.headers['authorization'].split(' ')[1];
        const { username, sub: userId } = decode(token);
        
        barsManager.storePubcrawl(pubcrawl, userId, (error, result) => {
            if (error) {
                if (error === ERROR_ENUM.SERVER_ERROR) return res.status(500).json({ error: ERROR_ENUM.SERVER_ERROR });
                else {
                    return res.status(400).json({ error: error });
                }
            } else {
                res.status(200).json({ pubcrawl: pubcrawl.list, id: result.insertId });
            }
        });
    });

    router.delete('/:id', accountManager.hasTeamCheck, (req, res) => {
        const { id } = req.params;
        const { account } = req;
        barsManager.deletePubcrawlById(id, req.account, (error, result) => {
            if (error) {
                if (error === ERROR_ENUM.SERVER_ERROR) return res.status(500).send({ error: ERROR_ENUM.SERVER_ERROR });
                if (error === ERROR_ENUM.UNAUTHORIZED) {
                    return res.status(403).send({ error: ERROR_ENUM.UNAUTHORIZED, error_description: ERROR_ENUM.NO_TEAMOWNER_MESSAGE });
                }
                return res.status(400).json({ error: error });
            } else {
                res.status(204).send();
            }
        });
    });

    router.get('/:id', (req, res) => {
        const { id } = req.params;
        const { account } = req;
        barsManager.getPubcrawlById(id, (error, data) => {
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