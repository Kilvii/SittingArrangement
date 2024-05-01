var express = require('express');
var router = express.Router();
const pool = require('../db')

function setPerson(newUser, placements, users) {
  let currentRoom = null;
  let currentRoomIndex = 0;
  for (room of placements) {
    if (room['available_seats'] > 0) {
      currentRoom = room;
      break;
    }
    currentRoomIndex += 1
  }
  if (currentRoom === null) {
    console.log('All rooms occupied')
    pool.query('DELETE FROM users WHERE id = $1', [newUser['id']], (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`User with id ${newUser['id']} removed from database`);
      }
    });
    return
  }

  const filteredUsers = users.filter(user => user['room_id'] === currentRoom['room_id']);
  const sortedUsers = filteredUsers.sort((a, b) => a['seat'] - b['seat']);

  if (users.length == 1 || sortedUsers.length == 0) {
    currentRoom['available_seats']--;
    newUser['seat'] = 1;
    newUser['room_id'] = currentRoom['room_id']
    pool.query('UPDATE placements SET available_seats = $1 WHERE room_id = $2', [currentRoom['available_seats'], currentRoom['room_id']], (err, res) => {
      if (err) {
        console.log(err);
        return;
      }
    });
    pool.query('UPDATE users SET seat = $1, room_id = $2 WHERE id = $3', [newUser['seat'], newUser['room_id'], newUser['id']], (err, res) => {
      if (err) {
        console.log(err);
        return;
      }
    });
    console.log(`User ${newUser['surname']} sits in room ${newUser['room_id']} in place ${newUser['seat']} :start: avail_seat = ${currentRoom['available_seats']} has left`);
    return;
  }

  if (newUser['school'] !== sortedUsers[sortedUsers.length - 1]['school']) {
    for (let i = 1; i < sortedUsers.length; i++) {
      if (sortedUsers[i]['seat'] - sortedUsers[i - 1]['seat'] !== 1) {
        newUser['seat'] = (sortedUsers[i]['seat'] + sortedUsers[i - 1]['seat']) / 2;
        newUser['room_id'] = currentRoom['room_id']
        currentRoom['available_seats']--;
        pool.query('UPDATE placements SET available_seats = $1 WHERE room_id = $2', [currentRoom['available_seats'], currentRoom['room_id']], (err, res) => {
          if (err) {
            console.log(err);
            return;
          }
        });
        pool.query('UPDATE users SET seat = $1, room_id = $2 WHERE id = $3', [newUser['seat'], newUser['room_id'], newUser['id']], (err, res) => {
          if (err) {
            console.log(err);
            return;
          }
        });
        console.log(`User ${newUser['surname']} sits in room ${newUser['room_id']} in place ${newUser['seat']} :insert between: avail_seat = ${currentRoom['available_seats']} has left`);
        return;
      }
    }

    newUser['seat'] = sortedUsers[sortedUsers.length - 1]['seat'] + 1
    newUser['room_id'] = currentRoom['room_id']
    currentRoom['available_seats']--;
    pool.query('UPDATE placements SET available_seats = $1 WHERE room_id = $2', [currentRoom['available_seats'], currentRoom['room_id']], (err, res) => {
      if (err) {
        console.log(err);
        return;
      }
    });
    pool.query('UPDATE users SET seat = $1, room_id = $2 WHERE id = $3', [newUser['seat'], newUser['room_id'], newUser['id']], (err, res) => {
      if (err) {
        console.log(err);
        return;
      }
    });
    console.log(`User ${newUser['surname']} sits in room ${newUser['room_id']} in place ${newUser['seat']} :insert next:  avail_seat = ${currentRoom['available_seats']} has left`);
    return;

  }
  else {
    newUser['seat'] = sortedUsers[sortedUsers.length - 1]['seat'] + 2
    if (newUser['seat'] > currentRoom['number_of_seats']) {
      currentRoomIndex += 1
      if ((currentRoomIndex == placements.length)) {
        console.log('All rooms occupied')
        pool.query('DELETE FROM users WHERE id = $1', [newUser['id']], (err, res) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`User with id ${newUser['id']} removed from database`);
          }
        });
        return
      }
      currentRoom = placements[currentRoomIndex]
      const newFilteredUsers = users.filter(user => user['room_id'] === currentRoom['room_id']);
      const newSortedUsers = newFilteredUsers.sort((a, b) => a['seat'] - b['seat']);

      if (newSortedUsers.length == 0) {
        currentRoom['available_seats']--;
        newUser['seat'] = 1;
        newUser['room_id'] = currentRoom['room_id']
        pool.query('UPDATE placements SET available_seats = $1 WHERE room_id = $2', [currentRoom['available_seats'], currentRoom['room_id']], (err, res) => {
          if (err) {
            console.log(err);
            return;
          }
        });
        pool.query('UPDATE users SET seat = $1, room_id = $2 WHERE id = $3', [newUser['seat'], newUser['room_id'], newUser['id']], (err, res) => {
          if (err) {
            console.log(err);
            return;
          }
        });
        console.log(`User ${newUser['surname']} sits in room ${newUser['room_id']} in place ${newUser['seat']} :jump room start: avail_seat = ${currentRoom['available_seats']} has left`);
        return;
      }
      else {
        newUser['seat'] = newSortedUsers[newSortedUsers.length - 1]['seat'] + 2
        newUser['room_id'] = currentRoom['room_id']
        currentRoom['available_seats']--;
        pool.query('UPDATE placements SET available_seats = $1 WHERE room_id = $2', [currentRoom['available_seats'], currentRoom['room_id']], (err, res) => {
          if (err) {
            console.log(err);
            return;
          }
        });
        pool.query('UPDATE users SET seat = $1, room_id = $2 WHERE id = $3', [newUser['seat'], newUser['room_id'], newUser['id']], (err, res) => {
          if (err) {
            console.log(err);
            return;
          }
        });
        console.log(`User ${newUser['surname']} sits in room ${newUser['room_id']} in place ${newUser['seat']} :jums room insert: avail_seat = ${currentRoom['available_seats']} has left`);
        return;
      }
    }
    else {
      newUser['room_id'] = currentRoom['room_id']
      currentRoom['available_seats']--;
      pool.query('UPDATE placements SET available_seats = $1 WHERE room_id = $2', [currentRoom['available_seats'], currentRoom['room_id']], (err, res) => {
        if (err) {
          console.log(err);
          return;
        }
      });
      pool.query('UPDATE users SET seat = $1, room_id = $2 WHERE id = $3', [newUser['seat'], newUser['room_id'], newUser['id']], (err, res) => {
        if (err) {
          console.log(err);
          return;
        }
      });
      console.log(`User ${newUser['surname']} sits in room ${newUser['room_id']} in place ${newUser['seat']} :jums insert: avail_seat = ${currentRoom['available_seats']} has left`);
      return;
    }

  }
}

router.get('/', async (req, res) => {
  try {
    const data = await pool.query('SELECT * FROM users')
    res.status(200).send({
      message: "Successfully get all users",
      children: data.rows
    })
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

router.post('/store', async (req, res) => {
  try {
    const { surname, firstname, patronymic, gender, birthdate, age, phone, email, school, address, classroom, subject, citizenship, passport_series, passport_number } = req.body
    const result = await pool.query('INSERT INTO users (surname, firstname, patronymic, gender, birthdate, age, phone, email, school, address, classroom, subject, citizenship, passport_series, passport_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id',
      [surname, firstname, patronymic, gender, birthdate, age, phone, email, school, address, classroom, subject, citizenship, passport_series, passport_number])

    const userId = result.rows[0].id
    const userData = await pool.query('SELECT * FROM users WHERE id = $1', [userId])
    const placements = await pool.query('SELECT * FROM placements ORDER BY room_id')
    const users = await pool.query('SELECT * FROM users')
    const newUser = userData.rows[0]
    setPerson(newUser, placements.rows, users.rows)

    res.status(200).send({
      message: `Successfully added user`,
      user: userData.rows[0]
    })
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const user_id = req.params.id
    const data = await pool.query('SELECT * FROM users WHERE id=$1', [user_id])
    res.status(200).send({
      message: "Successfully get user",
      children: data.rows
    })
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

module.exports = router;
