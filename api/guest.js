const express = require('express');
const router = express.Router();
module.exports = router;
const pool = require('../api/databasepuller.js');
const {json} = require("express");
const selfService = require('../api/services/guest.js')


// router.get('/:id', async function(req,res){
//     try {
//         const sqlQuery = 'SELECT id, passcode FROM guest WHERE id=?';
//         const rows = await pool.query(sqlQuery, req.params.id);
//         res.status(200).json(rows);
//     } catch (error) {
//         res.status(500).send(error.message)
//     }
// });

router.post('/register', async function(req,res) {
  let conn
  try {
    conn = await pool.getConnection()
    const data = await selfService.register(conn)
    res.json(data)
  } catch (err) {
    res.status(500).send(err.message)
  } finally {
    if (conn) conn.release()
  }
    // try {
    //     const passcode = crypto.randomUUID();
    //     // console.log(passcode);
    //     const sqlQuery = 'INSERT INTO guest (passcode) VALUES (?)';
    //     const result = await pool.query(sqlQuery, [passcode]);
    //
    //     res.status(200).json({passcode: passcode});
    // } catch (error) {
    //     res.status(500).send(error.message)
    // }
})

router.post('/get-list', async (req, res, next) => {
  let conn
  try {
    conn = await pool.getConnection()
    const data = await selfService.getList(conn, req.body)
    res.json(data)
  } catch (err) {
    res.status(err.statusCode).send({
      message: err.message
    })
  } finally {
    if (conn) conn.release()
  }
})
// old get-list function
// router.post('/get-list', async function(req,res) {
//     try {
//         const {passcode} = req.body;
//         const id = 'SELECT id FROM guest WHERE passcode=?';
//         const resultId = await pool.query(id, [passcode]);
//         const sqlGetToDo = 'SELECT id,title,status FROM guest_todo_list WHERE owner=?';
//         const result = await pool.query(sqlGetToDo, [resultId[0].id]);
//
//         console.log(json(resultId));
//       res.status(200).json(result);
//
//     } catch (error) {
//         res.status(500).send(error.message)
//     }
// })

// List to do ----------------------------------------------------------------------------
router.post('/list/add', async (req, res, next) => {
  let conn
  try {
    conn = await pool.getConnection()
    const data = await selfService.addToDo(conn, req.body)
    res.json(data)
  } catch (err) {
    res.status(err.statusCode).send({
      message: err.message
    })
  } finally {
    if (conn) conn.release()
  }
})

router.post('/list/delete', async (req, res, next) => {
  let conn
  try {
    conn = await pool.getConnection()
    await selfService.delToDo(conn, req.body)
    res.json({
      success: true
    })
  } catch (err) {
    res.status(500).send({
      message: err.message
    })
  } finally {
    if (conn) conn.release()
  }
})

router.post('/list/update/status', async (req, res, next) => {
  let conn
  try {
    conn = await pool.getConnection()
    const data = await selfService.updateStatus(conn, req.body)
    res.json(data)
  } catch (err) {
    res.status(500).send({
      message: err.message
    })
  } finally {
    if (conn) conn.release()
  }
})
