const express = require('express');
const crypto = require('crypto');
const router = express.Router();
module.exports = router;
const pool = require('../api/databasepuller.js');


router.get('/:id', async function(req,res){
    try {
        const sqlQuery = 'SELECT id, passcode FROM user WHERE id=?';
        const rows = await pool.query(sqlQuery, req.params.id);
            res.status(200).json(rows);
    } catch (error) {
        res.status(500).send(error.message)
    }
});
