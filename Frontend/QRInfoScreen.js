import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import axios from 'axios';

const QRInfoScreen = () => {
    const route = useRoute();
    const { qrData } = route.params;
    console.log('\nData 2: ' + qrData)

    const splittedData = qrData.split('; ');
    const phoneNumber = splittedData[6];
    const cleanedPhoneNumber = "+" + phoneNumber.replace(/[\s-]/g, '');
    splittedData[6] = cleanedPhoneNumber;
    splittedData[5] = parseInt(splittedData[5])
    splittedData[10] = parseInt(splittedData[10])
    splittedData[13] = parseInt(splittedData[13])
    splittedData[14] = parseInt(splittedData[14])

    const [apiResponse, setApiResponse] = useState({});

    const makeAPICall = async () => {
        try {
            const settings = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "surname": splittedData[0],
                    "firstname": splittedData[1],
                    "patronymic": splittedData[2],
                    "gender": splittedData[3],
                    "birthdate": splittedData[4],
                    "age": splittedData[5],
                    "phone": splittedData[6],
                    "email": splittedData[7],
                    "school": splittedData[8],
                    "address": splittedData[9],
                    "classroom": splittedData[10],
                    "subject": splittedData[11],
                    "citizenship": splittedData[12],
                    "passport_series": splittedData[13],
                    "passport_number": splittedData[14]
                }),
            }
            const response = await fetch('http://5.42.220.6:3000/api/users/store', settings);
            const json = await response.json();
            return json;
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        makeAPICall().then(response => {
            setApiResponse(response);
        });
    }, [])

    return (
        <View style={styles.container}>
          {apiResponse.user ? (
            <>
              <Text style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {apiResponse.user.surname} {apiResponse.user.firstname} {apiResponse.user.patronymic}
              </Text>
              <Text style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                Садится в помещение №{apiResponse.user.room_id}
              </Text>
              <Text style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                На место под номером №{apiResponse.user.seat}
              </Text>
            </>
          ) : (
            <Text style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              Loading...
            </Text>
          )}
        </View>
      );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
export default QRInfoScreen;
