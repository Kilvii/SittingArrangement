import React, { useState, useEffect } from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera/next';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const QRCodeScannerScreen = () => {

    const [facing, setFacing] = useState('back');
    const [scanned, setScaned] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const [text, setText] = useState('Not yet');
    const navigation = useNavigation();

    const handleBarCodeScanned = ({ type, data }) => {
        setScaned(true);
        setText(data);
        console.log('Type: ' + type + '\nData: ' + data) // + '\nText: ' + text

        navigation.navigate('QRInfoScreen', { qrData: data });
    }

    if (!permission) {
        return (
            <View style={styles.container}>
                <Text>Requesting for camera permission</Text>
            </View>
        )
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={{ margin: 10 }}>No access to camera</Text>
                <Button title={'Allow Camera'} onPress={() => requestPermission()}></Button>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.barcodebox}>
                <CameraView onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={{ height: 400, width: 400 }}>
                </CameraView>
            </View>
            {scanned && <Button title={'Scan again'} onPress={() => setScaned(false)}></Button>}
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
    camera: {
        width: '100%',
        height: '100%',
    },
    scanningArea: {
        width: 400,
        height: 400,
        alignItems: 'center',
        justifyContent: 'center',
    },

    barcodebox: {
        // backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        height: 300,
        width: 300,
        overflow: 'hidden',
        borderRadius: 30,
        // backgroundColor: 'tomato'
    },

    maintext: {
        fontSize: 16,
        margin: 20,
    }
});

export default QRCodeScannerScreen;

