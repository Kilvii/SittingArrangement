var express = require('express');
var router = express.Router();
const pool = require('../db')

function setPerson(userToSeat, placements, users) {
  //XXX: return 2 - not avail room error
  //XXX: return 1 - not next seat error
  //XXX: return 0 - without error
  let availableRoom = null;
  let availableRoomIndex = 0;
  let roomSample = 0;
  for (room of placements) {
    if (room['available_seats'] > 0) {
      availableRoom = room;
      roomSample = room['people_at_desk'];
      break;
    }
    availableRoomIndex += 1
  }
  //XXX: Если все помещения заняты
  if (availableRoom === null) {
    pool.query('DELETE FROM participants WHERE id = $1', [userToSeat['id']], (err, res) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`User with id ${userToSeat['id']} removed from database`);
      }
    });
    return 2;
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
    pool.query('UPDATE participants SET seat = $1, room_id = $2 WHERE id = $3', [userToSeat['seat'], userToSeat['room_id'], userToSeat['id']], (err, res) => {
      if (err) {
        console.log(err);
        return;
      }
    });
    console.log(`User ${userToSeat['surname']} sits in room ${userToSeat['room_id']} in place ${userToSeat['seat']} :start: avail_seat = ${availableRoom['available_seats']} has left`);
    return 0;
  }

  //XXX: Если в помещении 1 человек на парту
  if (roomSample == 1) {
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
          pool.query('UPDATE participants SET seat = $1, room_id = $2 WHERE id = $3', [userToSeat['seat'], userToSeat['room_id'], userToSeat['id']], (err, res) => {
            if (err) {
              console.log(err);
              return;
            }
          });
          console.log(`User ${userToSeat['surname']} sits in room ${userToSeat['room_id']} in place ${userToSeat['seat']} :insert between: avail_seat = ${availableRoom['available_seats']} has left`);
          return 0;
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
      pool.query('UPDATE participants SET seat = $1, room_id = $2 WHERE id = $3', [userToSeat['seat'], userToSeat['room_id'], userToSeat['id']], (err, res) => {
        if (err) {
          console.log(err);
          return;
        }
      });
      console.log(`User ${userToSeat['surname']} sits in room ${userToSeat['room_id']} in place ${userToSeat['seat']} :insert next:  avail_seat = ${availableRoom['available_seats']} has left`);
      return 0;

    }

    //XXX: Если люди из одной школы
    else {
      userToSeat['seat'] = sortedUsers[sortedUsers.length - 1]['seat'] + 2
      //XXX: Проверка на то, нужен ли переход на другое помещение
      if (userToSeat['seat'] > availableRoom['number_of_tables']) {
        availableRoomIndex += 1
        if ((availableRoomIndex == placements.length)) {
          //XXX: Нельзя посадить сюда человека
          pool.query('DELETE FROM participants WHERE id = $1', [userToSeat['id']], (err, res) => {
            if (err) {
              console.log(err);
            } else {
              console.log(`User with id ${userToSeat['id']} removed from database`);
            }
          });
          return 1;
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
          pool.query('UPDATE participants SET seat = $1, room_id = $2 WHERE id = $3', [userToSeat['seat'], userToSeat['room_id'], userToSeat['id']], (err, res) => {
            if (err) {
              console.log(err);
              return;
            }
          });
          console.log(`User ${userToSeat['surname']} sits in room ${userToSeat['room_id']} in place ${userToSeat['seat']} :jump room start: avail_seat = ${availableRoom['available_seats']} has left`);
          return 0;
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
          pool.query('UPDATE participants SET seat = $1, room_id = $2 WHERE id = $3', [userToSeat['seat'], userToSeat['room_id'], userToSeat['id']], (err, res) => {
            if (err) {
              console.log(err);
              return;
            }
          });
          console.log(`User ${userToSeat['surname']} sits in room ${userToSeat['room_id']} in place ${userToSeat['seat']} :jums room insert: avail_seat = ${availableRoom['available_seats']} has left`);
          return 0;
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
        pool.query('UPDATE participants SET seat = $1, room_id = $2 WHERE id = $3', [userToSeat['seat'], userToSeat['room_id'], userToSeat['id']], (err, res) => {
          if (err) {
            console.log(err);
            return;
          }
        });
        console.log(`User ${userToSeat['surname']} sits in room ${userToSeat['room_id']} in place ${userToSeat['seat']} :jums insert: avail_seat = ${availableRoom['available_seats']} has left`);
        return 0;
      }
    }
  }
  //XXX: Если в помещении 2 человека на парту
  else {
    if (users.length <= 2) {
      //XXX: Если люди из разных школ
      if (userToSeat['school'] !== sortedUsers[sortedUsers.length - 1]['school']) {
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
        pool.query('UPDATE participants SET seat = $1, room_id = $2 WHERE id = $3', [userToSeat['seat'], userToSeat['room_id'], userToSeat['id']], (err, res) => {
          if (err) {
            console.log(err);
            return;
          }
        });
        console.log(`User ${userToSeat['surname']} sits in room ${userToSeat['room_id']} in place ${userToSeat['seat']} :insert next:  avail_seat = ${availableRoom['available_seats']} has left`);
        return 0;
      }
      else {
        userToSeat['seat'] = sortedUsers[sortedUsers.length - 1]['seat'] + 4;
        userToSeat['room_id'] = availableRoom['room_id']
        availableRoom['available_seats']--;
        pool.query('UPDATE placements SET available_seats = $1 WHERE room_id = $2', [availableRoom['available_seats'], availableRoom['room_id']], (err, res) => {
          if (err) {
            console.log(err);
            return;
          }
        });
        pool.query('UPDATE participants SET seat = $1, room_id = $2 WHERE id = $3', [userToSeat['seat'], userToSeat['room_id'], userToSeat['id']], (err, res) => {
          if (err) {
            console.log(err);
            return;
          }
        });
        console.log(`User ${userToSeat['surname']} sits in room ${userToSeat['room_id']} in place ${userToSeat['seat']} :jums insert: avail_seat = ${availableRoom['available_seats']} has left`);
        return 0;
      }
    }
    else {
      const parityAddition = users.length;
      //XXX: Если люди из разных школ
      if (userToSeat['school'] !== sortedUsers[sortedUsers.length - 1]['school']) {
        //XXX: Проверка на то, был ли скачок через место
        for (let i = 1; i < sortedUsers.length; i++) {
          if (sortedUsers[i]['seat'] - sortedUsers[i - 1]['seat'] !== 1) {
            const startGapElem = sortedUsers[i - 1];
            const endGapElem = sortedUsers[i];
            //XXX: Проверка: значение границ скачка совпадает ли со значением добавляемого
            if (userToSeat['school'] !== startGapElem['school'] && userToSeat['school'] !== endGapElem['school']) {
              if (parityAddition <= 3) {
                //XXX: Посадить рядом внутри скачка
                userToSeat['seat'] = startGapElem['seat'] + 1
                userToSeat['room_id'] = availableRoom['room_id']
                availableRoom['available_seats']--;
                pool.query('UPDATE placements SET available_seats = $1 WHERE room_id = $2', [availableRoom['available_seats'], availableRoom['room_id']], (err, res) => {
                  if (err) {
                    console.log(err);
                    return;
                  }
                });
                pool.query('UPDATE participants SET seat = $1, room_id = $2 WHERE id = $3', [userToSeat['seat'], userToSeat['room_id'], userToSeat['id']], (err, res) => {
                  if (err) {
                    console.log(err);
                    return;
                  }
                });
                console.log(`User ${userToSeat['surname']} sits in room ${userToSeat['room_id']} in place ${userToSeat['seat']} :insert gap next:  avail_seat = ${availableRoom['available_seats']} has left`);
                return 0;
              }
              else {
                if (userToSeat['school'] !== sortedUsers[i - 2]['school']) {
                  //XXX: Посадить рядом внутри скачка
                  userToSeat['seat'] = startGapElem['seat'] + 1
                  userToSeat['room_id'] = availableRoom['room_id']
                  availableRoom['available_seats']--;
                  pool.query('UPDATE placements SET available_seats = $1 WHERE room_id = $2', [availableRoom['available_seats'], availableRoom['room_id']], (err, res) => {
                    if (err) {
                      console.log(err);
                      return;
                    }
                  });
                  pool.query('UPDATE participants SET seat = $1, room_id = $2 WHERE id = $3', [userToSeat['seat'], userToSeat['room_id'], userToSeat['id']], (err, res) => {
                    if (err) {
                      console.log(err);
                      return;
                    }
                  });
                  console.log(`User ${userToSeat['surname']} sits in room ${userToSeat['room_id']} in place ${userToSeat['seat']} :insert gap next:  avail_seat = ${availableRoom['available_seats']} has left`);
                  return 0;
                }
                else {
                  const userWithSameSchool = sortedUsers[i - 2];
                  userToSeat['seat'] = userWithSameSchool['seat'] + 4
                  userToSeat['room_id'] = availableRoom['room_id']
                  availableRoom['available_seats']--;
                  pool.query('UPDATE placements SET available_seats = $1 WHERE room_id = $2', [availableRoom['available_seats'], availableRoom['room_id']], (err, res) => {
                    if (err) {
                      console.log(err);
                      return;
                    }
                  });
                  pool.query('UPDATE participants SET seat = $1, room_id = $2 WHERE id = $3', [userToSeat['seat'], userToSeat['room_id'], userToSeat['id']], (err, res) => {
                    if (err) {
                      console.log(err);
                      return;
                    }
                  });
                  console.log(`User ${userToSeat['surname']} sits in room ${userToSeat['room_id']} in place ${userToSeat['seat']} :insert gap jump:  avail_seat = ${availableRoom['available_seats']} has left`);
                  return 0;
                }
              }
            }
            else {
              const userWithSameSchool = sortedUsers.findLast(user => user['school'] === userToSeat['school']);
              userToSeat['seat'] = userWithSameSchool['seat'] + 4
              userToSeat['room_id'] = availableRoom['room_id']
              availableRoom['available_seats']--;
              pool.query('UPDATE placements SET available_seats = $1 WHERE room_id = $2', [availableRoom['available_seats'], availableRoom['room_id']], (err, res) => {
                if (err) {
                  console.log(err);
                  return;
                }
              });
              pool.query('UPDATE participants SET seat = $1, room_id = $2 WHERE id = $3', [userToSeat['seat'], userToSeat['room_id'], userToSeat['id']], (err, res) => {
                if (err) {
                  console.log(err);
                  return;
                }
              });
              console.log(`User ${userToSeat['surname']} sits in room ${userToSeat['room_id']} in place ${userToSeat['seat']} :insert gap jump:  avail_seat = ${availableRoom['available_seats']} has left`);
              return 0;
            }
          }
        }

        //XXX: Скачка небыло
        if (parityAddition % 2 == 0) {
          if (userToSeat['school'] !== sortedUsers[sortedUsers.length - 2]['school'] && userToSeat['school'] !== sortedUsers[sortedUsers.length - 3]['school']) {
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
            pool.query('UPDATE participants SET seat = $1, room_id = $2 WHERE id = $3', [userToSeat['seat'], userToSeat['room_id'], userToSeat['id']], (err, res) => {
              if (err) {
                console.log(err);
                return;
              }
            });
            console.log(`User ${userToSeat['surname']} sits in room ${userToSeat['room_id']} in place ${userToSeat['seat']} :insert next:  avail_seat = ${availableRoom['available_seats']} has left`);
            return 0;
          }
          else {
            //XXX: Посадить на через 2 места
            userToSeat['seat'] = sortedUsers[sortedUsers.length - 1]['seat'] + 2
            userToSeat['room_id'] = availableRoom['room_id']
            availableRoom['available_seats']--;
            pool.query('UPDATE placements SET available_seats = $1 WHERE room_id = $2', [availableRoom['available_seats'], availableRoom['room_id']], (err, res) => {
              if (err) {
                console.log(err);
                return;
              }
            });
            pool.query('UPDATE participants SET seat = $1, room_id = $2 WHERE id = $3', [userToSeat['seat'], userToSeat['room_id'], userToSeat['id']], (err, res) => {
              if (err) {
                console.log(err);
                return;
              }
            });
            console.log(`User ${userToSeat['surname']} sits in room ${userToSeat['room_id']} in place ${userToSeat['seat']} :insert create jump:  avail_seat = ${availableRoom['available_seats']} has left`);
            return 0;
          }
        }
        else {
          if (userToSeat['school'] !== sortedUsers[sortedUsers.length - 2]['school']) {
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
            pool.query('UPDATE participants SET seat = $1, room_id = $2 WHERE id = $3', [userToSeat['seat'], userToSeat['room_id'], userToSeat['id']], (err, res) => {
              if (err) {
                console.log(err);
                return;
              }
            });
            console.log(`User ${userToSeat['surname']} sits in room ${userToSeat['room_id']} in place ${userToSeat['seat']} :insert next:  avail_seat = ${availableRoom['available_seats']} has left`);
            return 0;
          }
          else {
            //XXX: Посадить на через 3 места
            userToSeat['seat'] = sortedUsers[sortedUsers.length - 1]['seat'] + 3
            userToSeat['room_id'] = availableRoom['room_id']
            availableRoom['available_seats']--;
            pool.query('UPDATE placements SET available_seats = $1 WHERE room_id = $2', [availableRoom['available_seats'], availableRoom['room_id']], (err, res) => {
              if (err) {
                console.log(err);
                return;
              }
            });
            pool.query('UPDATE participants SET seat = $1, room_id = $2 WHERE id = $3', [userToSeat['seat'], userToSeat['room_id'], userToSeat['id']], (err, res) => {
              if (err) {
                console.log(err);
                return;
              }
            });
            console.log(`User ${userToSeat['surname']} sits in room ${userToSeat['room_id']} in place ${userToSeat['seat']} :insert create jump:  avail_seat = ${availableRoom['available_seats']} has left`);
            return 0;
          }
        }
      }
      //XXX: Если люди из одной школы
      else {
        //XXX: Проверка на то, был ли скачок через место
        for (let i = 1; i < sortedUsers.length; i++) {
          if (sortedUsers[i]['seat'] - sortedUsers[i - 1]['seat'] !== 1) {
            const userWithSameSchool = sortedUsers.findLast(user => user['school'] === userToSeat['school']);
            //XXX: Посадить на через 4 места
            userToSeat['seat'] = userWithSameSchool['seat'] + 4
            userToSeat['room_id'] = availableRoom['room_id']
            availableRoom['available_seats']--;
            pool.query('UPDATE placements SET available_seats = $1 WHERE room_id = $2', [availableRoom['available_seats'], availableRoom['room_id']], (err, res) => {
              if (err) {
                console.log(err);
                return;
              }
            });
            pool.query('UPDATE participants SET seat = $1, room_id = $2 WHERE id = $3', [userToSeat['seat'], userToSeat['room_id'], userToSeat['id']], (err, res) => {
              if (err) {
                console.log(err);
                return;
              }
            });
            console.log(`User ${userToSeat['surname']} sits in room ${userToSeat['room_id']} in place ${userToSeat['seat']} :insert jump:  avail_seat = ${availableRoom['available_seats']} has left`);
            return 0;
          }
        }

        //XXX: Скачка небыло
        if (parityAddition % 2 == 0) {
          //XXX: Посадить на через 4 места
          userToSeat['seat'] = sortedUsers[sortedUsers.length - 1]['seat'] + 4
          userToSeat['room_id'] = availableRoom['room_id']
          availableRoom['available_seats']--;
          pool.query('UPDATE placements SET available_seats = $1 WHERE room_id = $2', [availableRoom['available_seats'], availableRoom['room_id']], (err, res) => {
            if (err) {
              console.log(err);
              return;
            }
          });
          pool.query('UPDATE participants SET seat = $1, room_id = $2 WHERE id = $3', [userToSeat['seat'], userToSeat['room_id'], userToSeat['id']], (err, res) => {
            if (err) {
              console.log(err);
              return;
            }
          });
          console.log(`User ${userToSeat['surname']} sits in room ${userToSeat['room_id']} in place ${userToSeat['seat']} :insert create jump:  avail_seat = ${availableRoom['available_seats']} has left`);
          return 0;

        }
        else {
          //XXX: Посадить на через 3 места
          userToSeat['seat'] = sortedUsers[sortedUsers.length - 1]['seat'] + 3
          userToSeat['room_id'] = availableRoom['room_id']
          availableRoom['available_seats']--;
          pool.query('UPDATE placements SET available_seats = $1 WHERE room_id = $2', [availableRoom['available_seats'], availableRoom['room_id']], (err, res) => {
            if (err) {
              console.log(err);
              return;
            }
          });
          pool.query('UPDATE participants SET seat = $1, room_id = $2 WHERE id = $3', [userToSeat['seat'], userToSeat['room_id'], userToSeat['id']], (err, res) => {
            if (err) {
              console.log(err);
              return;
            }
          });
          console.log(`User ${userToSeat['surname']} sits in room ${userToSeat['room_id']} in place ${userToSeat['seat']} :insert create jump:  avail_seat = ${availableRoom['available_seats']} has left`);
          return 0;

        }
      }
    }
  }
}

router.get('/', async (req, res) => {
  try {
    const data = await pool.query('SELECT * FROM participants')
    res.status(200).send({
      message: "Successfully get all participants",
      children: data.rows
    })
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const user_id = req.params.id
    const data = await pool.query('SELECT * FROM participants WHERE id=$1', [user_id])
    res.status(200).send({
      message: "Successfully get participant",
      children: data.rows
    })
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

router.post('/create', async (req, res) => {
  try {
    await pool.query("CREATE TABLE participants (id SERIAL PRIMARY KEY, surname TEXT, firstname TEXT, patronymic TEXT, gender TEXT, birthdate DATE, age INT, phone TEXT, email TEXT, school TEXT, address TEXT, classroom INT, subject TEXT, citizenship TEXT, passport_series INT, passport_number INT, venue TEXT DEFAULT 'Не указано', room_id INT DEFAULT 0, seat INT DEFAULT 0);");

    res.sendStatus(201)
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post('/store', async (req, res) => {
  try {
    const { surname, firstname, patronymic, gender, birthdate, age, phone, email, school, address, classroom, subject, citizenship, passport_series, passport_number } = req.body
    const result = await pool.query('INSERT INTO participants (surname, firstname, patronymic, gender, birthdate, age, phone, email, school, address, classroom, subject, citizenship, passport_series, passport_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id',
      [surname, firstname, patronymic, gender, birthdate, age, phone, email, school, address, classroom, subject, citizenship, passport_series, passport_number])

    const userId = result.rows[0].id
    const userData = await pool.query('SELECT * FROM participants WHERE id = $1', [userId])
    const placements = await pool.query('SELECT * FROM placements ORDER BY room_id')
    const users = await pool.query('SELECT * FROM participants')
    const userToSeat = userData.rows[0]
    const resCode = setPerson(userToSeat, placements.rows, users.rows)

    if (resCode === 2) {
      res.status(200).send({
        message: `All rooms are occupied`,
      })
    }
    else if (resCode === 1) {
      res.status(200).send({
        message: `Students from the same school will be sitting next to each other`,
      })
    }
    else {
      res.status(200).send({
        message: `Successfully added participants`,
        user: userData.rows[0]
      })
    }
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

router.post('/drop', async (req, res) => {
  try {
    await pool.query("DROP TABLE IF EXISTS participants;");

    res.sendStatus(204)
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { surname, firstname, patronymic, gender, birthdate, age, phone, email, school, address, classroom, subject, citizenship, passport_series, passport_number, venue } = req.body
    const id = req.params.id
    await pool.query('UPDATE participants SET surname = $1, firstname = $2, patronymic = $3, gender = $4, birthdate = $5, age = $6, phone = $7, email = $8, school = $9, address = $10, classroom = $11, subject = $12, citizenship = $13, passport_series = $14, passport_number = $15, venue = $16 WHERE id = $17',
      [surname, firstname, patronymic, gender, birthdate, age, phone, email, school, address, classroom, subject, citizenship, passport_series, passport_number, venue, id])
    res.status(200).send({
      message: `Successfully updated participant with id ${id}`
    })
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const roomId = (await pool.query('SELECT room_id FROM participants WHERE id = $1', [id])).rows[0].room_id;
    await pool.query('UPDATE placements SET available_seats = available_seats + 1 WHERE room_id = $1', [roomId]);
    await pool.query('DELETE FROM participants WHERE id = $1',
      [id])

    res.sendStatus(204)
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;
