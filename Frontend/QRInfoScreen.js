import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
// import axios from 'axios';

const QRInfoScreen = () => {
    const route = useRoute();
    const { qrData } = route.params;
    console.log('\nData 2: ' + qrData)

    const splittedData = qrData.split('; ');
    const phoneNumber = splittedData[6];
    const cleanedPhoneNumber = phoneNumber.replace(/[\s-]/g, '');
    splittedData[6] = cleanedPhoneNumber;

    console.log('\nSplitted Data:', splittedData);

    // const handleAddUser = async () => {
    //     try {
    //         const response = await axios.post('http://localhost:8081/api/addUser', { data: splittedData });
    //         console.log(response.data.message);
    //         // Handle success response
    //     } catch (error) {
    //         console.error('Error inserting user:', error.response.data.error);
    //         // Handle error
    //     }
    // };
    // handleAddUser

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
