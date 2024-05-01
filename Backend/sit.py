def setPerson(new_user, placements, users):
  
  sorted_users = sorted(users, key=lambda x: x['seat'])
  current_room = None
  for room in placements:
    if room['available_seats'] > 0:
      current_room = room
      break
    else:
      return "All rooms are occupied"

  if not users:
    users.append(new_user)
    current_room["available_seats"] -= 1
    new_user["seat"] = 1
    print(f"User {new_user['surname']} sits in room {current_room['room_id']} in place {new_user['seat']}")
    return

  if new_user["school"] != sorted_users[-1]["school"]:
    users.append(new_user)
    current_room["available_seats"] -= 1
    for i in range(1, len(sorted_users)):
      if (sorted_users[i]["seat"] - sorted_users[i-1]["seat"]) != 1:
        new_user["seat"] = int((sorted_users[i]["seat"]  + sorted_users[i-1]["seat"]) / 2)
        print(f"User {new_user['surname']} sits in room {current_room['room_id']} in place {new_user['seat']} - 1")
        return

    new_user["seat"] = current_room["number_of_seats"] - current_room["available_seats"]
    print(f"User {new_user['surname']} sits in room {current_room['room_id']} in place {new_user['seat']} - 2")
    return
  else:
    users.append(new_user)
    if current_room["available_seats"] == 1:
      for room in placements:
        if room["available_seats"] > 1:
          current_room = room
          break

    if (current_room["number_of_seats"] - current_room["available_seats"]) == 0:
      current_room["available_seats"] -= 1
      new_user["seat"] = current_room["number_of_seats"] - current_room["available_seats"]
      print(f"User {new_user['surname']} sits in room {current_room['room_id']} in place {new_user['seat']} - 3")
      return
    else:
      current_room["available_seats"] -= 1
      new_user["seat"] = current_room["number_of_seats"] - current_room["available_seats"] + 1
      print(f"User {new_user['surname']} sits in room {current_room['room_id']} in place {new_user['seat']} - 3")
      return



person =  {
    "surname": "righar",
    "firstname": "Мария",
    "patronymic": "Амеговная",
    "gender": "Женский",
    "birthdate": "2002-11-11",
    "age": 18,
    "phone": "+79273408180",
    "email": "beautygirl@gmail.com",
    "school": "Школа №13",
    "address": "Саранск",
    "classroom": 11,
    "subject": "Химия",
    "citizenship": "Россия",
    "passport_series": 1234,
    "passport_number": 123456,
    'seat': 0
}

rooms = [
    {"id": 1, "room_id": 220, "number_of_seats": 30, "available_seats": 1},
    {"id": 2, "room_id": 212, "number_of_seats": 50, "available_seats": 50},
    {"id": 3, "room_id": 309, "number_of_seats": 34, "available_seats": 34}
]

users = [{
    "surname": "Рябикин",
    "firstname": "Кирилл",
    "patronymic": "Сергеевич",
    "gender": "Мужской",
    "birthdate": "2002-04-04",
    "age": 22,
    "phone": "+79277773180",
    "email": "kirill@gmail.com",
    "school": "Школа №13",
    "address": "Тольятти",
    "classroom": 11,
    "subject": "Математика",
    "citizenship": "Россия",
    "passport_series": 1234,
    "passport_number": 123456,
    "seat": 1
    },
         {
    "surname": "Жаба",
    "firstname": "Кирилл",
    "patronymic": "Сергеевич",
    "gender": "Мужской",
    "birthdate": "2002-04-04",
    "age": 22,
    "phone": "+79277773180",
    "email": "kirill@gmail.com",
    "school": "Школа №13",
    "address": "Тольятти",
    "classroom": 11,
    "subject": "Математика",
    "citizenship": "Россия",
    "passport_series": 1234,
    "passport_number": 123456,
    "seat": 3
    },
         {
         "surname": "Мариева",
    "firstname": "Мария",
    "patronymic": "Амеговная",
    "gender": "Женский",
    "birthdate": "2002-11-11",
    "age": 18,
    "phone": "+79273408180",
    "email": "beautygirl@gmail.com",
    "school": "Школа №45",
    "address": "Саранск",
    "classroom": 11,
    "subject": "Химия",
    "citizenship": "Россия",
    "passport_series": 1234,
    "passport_number": 123456,
    'seat': 2
         },
         {
    "surname": "Кирамика",
    "firstname": "Мария",
    "patronymic": "Амеговная",
    "gender": "Женский",
    "birthdate": "2002-11-11",
    "age": 18,
    "phone": "+79273408180",
    "email": "beautygirl@gmail.com",
    "school": "Школа №13",
    "address": "Саранск",
    "classroom": 11,
    "subject": "Химия",
    "citizenship": "Россия",
    "passport_series": 1234,
    "passport_number": 123456,
    'seat': 5
},
         {
    "surname": "Fuckter",
    "firstname": "Мария",
    "patronymic": "Амеговная",
    "gender": "Женский",
    "birthdate": "2002-11-11",
    "age": 18,
    "phone": "+79273408180",
    "email": "beautygirl@gmail.com",
    "school": "Школа №13",
    "address": "Саранск",
    "classroom": 11,
    "subject": "Химия",
    "citizenship": "Россия",
    "passport_series": 1234,
    "passport_number": 123456,
    'seat': 6
}
]

setPerson(person, rooms, users)