var express = require('express');
var router = express.Router();
const pool = require('../db')

function handleUserSeatingError(user) {
  throw new Error(`Cannot seat user ${user.surname}`);
}

function setPerson(userToSeat, placements, users) {
  let availableRoom = null;
  let availableRoomIndex = 0;
  for (room of placements) {
    if (room['available_seats'] > 0) {
      availableRoom = room;
      break;
    }
    availableRoomIndex += 1
  }
  //XXX: Если все помещения заняты
  if (availableRoom === null) {
    // console.log('All rooms occupied')
    pool.query('DELETE FROM users WHERE id = $1', [userToSeat['id']], (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`User with id ${userToSeat['id']} removed from database`);
      }
    });
    handleUserSeatingError(userToSeat)
    return
  }

  const filteredUsers = users.filter(user => user['room_id'] === availableRoom['room_id']);
  const sortedUsers = filteredUsers.sort((a, b) => a['seat'] - b['seat']);

  //XXX: Если это первый добавляемый объект в помещение
  if (users.length == 1 || sortedUsers.length == 0) {
    availableRoom['available_seats']--;
    userToSeat['seat'] = 1;
    userToSeat['room_id'] = availableRoom['room_id']
    pool.query('UPDATE placements SET available_seats = $1 WHERE room_id = $2', [availableRoom['available_seats'], availableRoom['room_id']], (err, res) => {
      if (err) {
        console.log(err);
        return;
      }
    });
    pool.query('UPDATE users SET seat = $1, room_id = $2 WHERE id = $3', [userToSeat['seat'], userToSeat['room_id'], userToSeat['id']], (err, res) => {
      if (err) {
        console.log(err);
        return;
      }
    });
    console.log(`User ${userToSeat['surname']} sits in room ${userToSeat['room_id']} in place ${userToSeat['seat']} :start: avail_seat = ${availableRoom['available_seats']} has left`);
    return;
  }

  //XXX: Если люди из разных школ
  if (userToSeat['school'] !== sortedUsers[sortedUsers.length - 1]['school']) {
    //XXX: Проверка на то, был ли скачок через место
    for (let i = 1; i < sortedUsers.length; i++) {
      if (sortedUsers[i]['seat'] - sortedUsers[i - 1]['seat'] !== 1) {
        userToSeat['seat'] = (sortedUsers[i]['seat'] + sortedUsers[i - 1]['seat']) / 2;
        userToSeat['room_id'] = availableRoom['room_id']
        availableRoom['available_seats']--;
        pool.query('UPDATE placements SET available_seats = $1 WHERE room_id = $2', [availableRoom['available_seats'], availableRoom['room_id']], (err, res) => {
          if (err) {
            console.log(err);
            return;
          }
        });
        pool.query('UPDATE users SET seat = $1, room_id = $2 WHERE id = $3', [userToSeat['seat'], userToSeat['room_id'], userToSeat['id']], (err, res) => {
          if (err) {
            console.log(err);
            return;
          }
        });
        console.log(`User ${userToSeat['surname']} sits in room ${userToSeat['room_id']} in place ${userToSeat['seat']} :insert between: avail_seat = ${availableRoom['available_seats']} has left`);
        return;
      }
    }

    //XXX: Посадить на следующее место
    userToSeat['seat'] = sortedUsers[sortedUsers.length - 1]['seat'] + 1
    userToSeat['room_id'] = availableRoom['room_id']
    availableRoom['available_seats']--;
    pool.query('UPDATE placements SET available_seats = $1 WHERE room_id = $2', [availableRoom['available_seats'], availableRoom['room_id']], (err, res) => {
      if (err) {
        console.log(err);
        return;
      }
    });
    pool.query('UPDATE users SET seat = $1, room_id = $2 WHERE id = $3', [userToSeat['seat'], userToSeat['room_id'], userToSeat['id']], (err, res) => {
      if (err) {
        console.log(err);
        return;
      }
    });
    console.log(`User ${userToSeat['surname']} sits in room ${userToSeat['room_id']} in place ${userToSeat['seat']} :insert next:  avail_seat = ${availableRoom['available_seats']} has left`);
    return;

  }

  //XXX: Если люди из одной школы
  else {
    userToSeat['seat'] = sortedUsers[sortedUsers.length - 1]['seat'] + 2
    //XXX: Проверка на то, нужен ли переход на другое помещение
    if (userToSeat['seat'] > availableRoom['number_of_seats']) {
      availableRoomIndex += 1
      if ((availableRoomIndex == placements.length)) {
        // console.log('Cant set this person here')
        pool.query('DELETE FROM users WHERE id = $1', [userToSeat['id']], (err, res) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`User with id ${userToSeat['id']} removed from database`);
          }
        });
        handleUserSeatingError(userToSeat)
        return
      }
      availableRoom = placements[availableRoomIndex]
      const newFilteredUsers = users.filter(user => user['room_id'] === availableRoom['room_id']);
      const newSortedUsers = newFilteredUsers.sort((a, b) => a['seat'] - b['seat']);

      //XXX: Проверка на то, первый ли это объект после перемещения помещения
      if (newSortedUsers.length == 0) {
        availableRoom['available_seats']--;
        userToSeat['seat'] = 1;
        userToSeat['room_id'] = availableRoom['room_id']
        pool.query('UPDATE placements SET available_seats = $1 WHERE room_id = $2', [availableRoom['available_seats'], availableRoom['room_id']], (err, res) => {
          if (err) {
            console.log(err);
            return;
          }
        });
        pool.query('UPDATE users SET seat = $1, room_id = $2 WHERE id = $3', [userToSeat['seat'], userToSeat['room_id'], userToSeat['id']], (err, res) => {
          if (err) {
            console.log(err);
            return;
          }
        });
        console.log(`User ${userToSeat['surname']} sits in room ${userToSeat['room_id']} in place ${userToSeat['seat']} :jump room start: avail_seat = ${availableRoom['available_seats']} has left`);
        return;
      }
      //XXX: Если после перемещения добавляемый объект не первый
      else {
        userToSeat['seat'] = newSortedUsers[newSortedUsers.length - 1]['seat'] + 2
        userToSeat['room_id'] = availableRoom['room_id']
        availableRoom['available_seats']--;
        pool.query('UPDATE placements SET available_seats = $1 WHERE room_id = $2', [availableRoom['available_seats'], availableRoom['room_id']], (err, res) => {
          if (err) {
            console.log(err);
            return;
          }
        });
        pool.query('UPDATE users SET seat = $1, room_id = $2 WHERE id = $3', [userToSeat['seat'], userToSeat['room_id'], userToSeat['id']], (err, res) => {
          if (err) {
            console.log(err);
            return;
          }
        });
        console.log(`User ${userToSeat['surname']} sits in room ${userToSeat['room_id']} in place ${userToSeat['seat']} :jums room insert: avail_seat = ${availableRoom['available_seats']} has left`);
        return;
      }
    }
    //XXX: Переход на другое помещение не нужен
    else {
      userToSeat['room_id'] = availableRoom['room_id']
      availableRoom['available_seats']--;
      pool.query('UPDATE placements SET available_seats = $1 WHERE room_id = $2', [availableRoom['available_seats'], availableRoom['room_id']], (err, res) => {
        if (err) {
          console.log(err);
          return;
        }
      });
      pool.query('UPDATE users SET seat = $1, room_id = $2 WHERE id = $3', [userToSeat['seat'], userToSeat['room_id'], userToSeat['id']], (err, res) => {
        if (err) {
          console.log(err);
          return;
        }
      });
      console.log(`User ${userToSeat['surname']} sits in room ${userToSeat['room_id']} in place ${userToSeat['seat']} :jums insert: avail_seat = ${availableRoom['available_seats']} has left`);
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
    const userToSeat = userData.rows[0]
    setPerson(userToSeat, placements.rows, users.rows)
    // console.log(userToSeat)

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
