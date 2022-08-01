const express = require('express');
const { decode } = require('jsonwebtoken');
const { hasTeamCheck } = require('../middleware/pubcrawlMiddlewares');
const {
    getPlaces
} = require('../../data-access-layer/service/fetch.data.service');
const publist = require('../../business-logic-layer/models/pubcrawlFactory')
const ERROR_ENUM = require('../../business-logic-layer/models/error_enum');

module.exports = ({ pubcrawlManager, accountManager }) => {
    const router = express.Router();

    router.post('', hasTeamCheck, async (req, res) => {
        await getPlaces();
        const pubcrawl = publist.getRandom();
        const token = req.headers['authorization'].split(' ')[1];
        const { sub: userId } = decode(token);
        
        pubcrawlManager.storePubcrawl(pubcrawl, userId, (error, result) => {
            if (error) {
                if (error === ERROR_ENUM.SERVER_ERROR) {
                    return res
                            .status(500)
                            .json({ error: ERROR_ENUM.SERVER_ERROR });
                } else {
                    return res.status(400).json({ error: error });
                }
            } else {
                res.status(200).json({
                    pubcrawl: pubcrawl.list,
                    id: result.insertId
                });
            }
        });
    });

    router.delete('/:pubcrawlid', hasTeamCheck, (req, res) => {
        const { pubcrawlid: id } = req.params;
        const { account } = req;

        if (account.team_id) {
            res.status(403).send({
                error: 'has_team_error',
                error_description: "Gå till http://localhost:3000 och lämna ditt team för ta bort / skapa barrunda.",
            });
            return;
        }

        pubcrawlManager.deletePubcrawlById(id, req.account, (error, result) => {
            if (error) {
                if (error === ERROR_ENUM.SERVER_ERROR) {
                    return res.status(500).send({ error: ERROR_ENUM.SERVER_ERROR });
                }
                if (error === ERROR_ENUM.UNAUTHORIZED) {
                    return res.status(403).send({
                        error: ERROR_ENUM.UNAUTHORIZED,
                        error_description: ERROR_ENUM.NO_TEAMOWNER_MESSAGE
                    });
                }
                return res.status(400).json({ error: error });
            } else {
                res.status(204).send();
            }
        });
    });

    router.get('/:pubcrawlid', (req, res) => {
        const { pubcrawlid: id } = req.params;
        const { account } = req;
        pubcrawlManager.getPubcrawlById(account, id, (error, data) => {
            if (error) {
                if (error === ERROR_ENUM.SERVER_ERROR) {
                    res.status(500).json({ error: ERROR_ENUM.SERVER_ERROR });
                    return;
                } else {
                    res.status(400).json({ error: error });
                    return;
                }
            } else {
                if (account.pubcrawl_id !== data.raw.id){
                    res.status(403).send({ error: ERROR_ENUM.UNAUTHORIZED });
                    return;
                }
                res.status(200).json(data);
                return;
            }
        });
    });

    router.put('/:pubcrawlid', async (req, res) => {
        const { pubcrawlid: id } = req.params;
        const { account } = req;
        await getPlaces();
        const pubcrawl = publist.getRandom();
        console.log('/pubcrawl id:', id);
        pubcrawlManager.updatePubcrawl(id, account, pubcrawl, (error, data) => {
            if (error) {
                console.log('GOT ERROR: ', error);
                if (error === ERROR_ENUM.SERVER_ERROR) {
                    res.status(500).json({ error: ERROR_ENUM.SERVER_ERROR });
                    return;
                } else if(error === ERROR_ENUM.MUST_BE_OWNER) {
                    res.status(403).send({ error: error })
                    return;
                } else {
                    res.status(400).send({ error: error });
                    return;
                }
            }
            res.status(200).send({ pubcrawl: pubcrawl.list, id: data.id });
        });
        
    });
    return router;
}