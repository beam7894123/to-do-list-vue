const {empty} = require("../../global-util");
const SqlString = require('sqlstring');
const crypto = require('crypto');
const {json} = require("express");
const pool = require("../databasepuller");


async function isUUIDUnique(uuid) {
  const sqlQuery = 'SELECT COUNT(*) AS countPasscode FROM guest WHERE passcode= ?';
  const result = await pool.query(sqlQuery, [uuid]);
  console.log(result[0].countPasscode.toString());
  if (result[0].countPasscode.toString() !== '0'){
    await generateUniqueUUID()
  }
  return true
  // return json(rows);
}
async function generateUniqueUUID() {
  let uuid;
  let isUnique = false;

  while (!isUnique) {
    // uuid = "test";
    uuid = crypto.randomUUID();
    isUnique = await isUUIDUnique(uuid);
  }

  return uuid;
}
const register = async (conn) => {
  const passcode = await generateUniqueUUID();
  // console.log(passcode);
  const sqlQuery = 'INSERT INTO guest (passcode) VALUES (?)';
  const result = await conn.query(sqlQuery, [passcode]);
  return {passcode: passcode};
}

const getList = async (conn, body) => {
  // console.log(body.passcode)
  let where = ``
  where += !empty(body.passcode)
    ? SqlString.format(`${body.passcode}`)
    : ``

  const resultId = await conn.query(
    ` SELECT id FROM guest WHERE passcode="${where}" `
  )
  if (resultId.length === 0) {
    const error = new Error('Requested user not found!');
    error.statusCode = 404;
    throw error;
  }

  // result id is not empty continue to get the list
  const result = await conn.query(
    ` SELECT id,title,status FROM guest_todo_list WHERE owner="${resultId[0].id}" `
  )
  const promotionResult = result
  if (promotionResult.length === 0) {
    const error = new Error('Requested list data not found!');
    error.statusCode = 404;
    throw error;
  }
  return promotionResult
}

const addToDo = async (conn, body) => {
let where = ``
  where += !empty(body.passcode)
    ? SqlString.format(`${body.passcode}`)
    : ``

  const resultUserId = await conn.query(
    ` SELECT id FROM guest WHERE passcode="${where}" `
  )
  if (resultUserId.length === 0) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  const result = await conn.query(
    ` INSERT INTO guest_todo_list (owner, title) VALUES ("${resultUserId[0].id}", "${body.title}") `
  )

  const resultID = result.insertId.toString()

  return {
    id: resultID,
    title: body.title,
    status: 0

  }
}

const delToDo = async (conn, body) => {
  let passcode = ``
  passcode += !empty(body.passcode)
    ? SqlString.format(`${body.passcode}`)
    : ``
  let toDoId = ``
  toDoId += !empty(body.toDoId)
    ? SqlString.format(`${body.toDoId}`)
    : ``

  // console.log(body.toDoId)
  const resultId = await conn.query(
    ` SELECT id FROM guest WHERE passcode="${passcode}" `
  )
  if (resultId.length === 0) {
    throw new Error('Unauthorized! (User not found)')
  }

  // // check if the user is the owner of that to do

  // const resultIdToDoCheck = await conn.query(
  //   ` SELECT id FROM guest_todo_list WHERE OWNER="${resultId}" && id="${toDoId}" `
  // )
  // console.log(resultIdToDoCheck.id.toString());
  const resultIdToDoCheck = ' SELECT id FROM guest_todo_list WHERE OWNER=? && id=? ';
  const [resultIdToDoCheckDone] = await pool.query(resultIdToDoCheck, [resultId[0].id, body.toDoId]);
  // console.log(resultId[0].id);
  // console.log(body.toDoId);
  // console.log(resultIdToDoCheckDone.id.toString());
  if (resultIdToDoCheckDone === undefined){
    throw new Error('Unauthorized! (Not found)')
  }

  // Delete the to do
  await conn.query(
    ` DELETE FROM guest_todo_list WHERE owner=? AND id=?
  `,
    [resultId[0].id, body.toDoId]
  )
}

const updateStatus = async (conn, body) => {
  let where = ``
  where += !empty(body.passcode)
      ? SqlString.format(`${body.passcode}`)
      : ``

  const resultId = await conn.query(
      ` SELECT id FROM guest WHERE passcode="${where}" `
  )
  if (resultId.length === 0) {
    throw new Error('User not found')
  }
  const resultIdToDoCheck = ' SELECT id FROM guest_todo_list WHERE OWNER=? && id=? ';
  const [resultIdToDoCheckDone] = await pool.query(resultIdToDoCheck, [resultId[0].id, body.toDoId]);
  // console.log(resultId[0].id);
  // console.log(body.toDoId);
  // console.log(resultIdToDoCheckDone.id.toString());
  if (resultIdToDoCheckDone === undefined){
    throw new Error('Unauthorized! (Not found)')
  }

  const result = await conn.query(
      ` UPDATE guest_todo_list SET status="${body.status}" WHERE  owner="${resultId[0].id}" AND id="${body.toDoId}"  `
  )
  // console.log(result);
  return {message: 'Update todo check successfully!'}
}

module.exports = {
  getList,
  register,
  addToDo,
  delToDo,
  updateStatus,
};

