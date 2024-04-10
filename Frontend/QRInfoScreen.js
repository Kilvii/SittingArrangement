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
    const cleanedPhoneNumber = phoneNumber.replace(/[\s-]/g, '');
    splittedData[6] = cleanedPhoneNumber;

    console.log('\nSplitted Data:', splittedData);

    // axios.post('http://localhost:3000/api/placements/store', {
    // "room_id": 1488,
    // "number_of_seats": 25,
    // "available_seats": 25
    // }).then(response => {
    //     console.log(response.data);
    // }).catch(error => {
    //     console.error(error);
    // });

    const makeAPICall = async () => {
        try {
            fetch('https://jsonplaceholder.typicode.com/todos/1')
                .then(response => response.json())
                .then(json => console.log(json))
            // const settings = {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify({
            //         "room_id": 1488,
            //         "number_of_seats": 25,
            //         "available_seats": 25
            //     }),
            // }
            // const response = await fetch('http://localhost:3000/api/placements/store', settings);
            // const data = await response.json();
            // console.log({ response });
            // console.log({ data });
        } catch (e) {
            console.log(e);
        }
    }
    useEffect(() => {
        makeAPICall();
    }, [])

    // const handleAddUser = async () => {
    //     try {
    //         const response = await axios.post('http://localhost:3000/api/placements/store', {
    //             "room_id": 1488,
    //             "number_of_seats": 25,
    //             "available_seats": 25
    //         });
    //         console.log(response.data.message);
    //     } catch (error) {
    //         console.error('Error inserting user:', error.response.data.error);
    //     }
    // };
    // handleAddUser()

    return (
        <View style={styles.container}>
            <Text style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {qrData}
            </Text>
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
