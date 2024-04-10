import { React } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import  QRCodeScannerScreen  from './QRCodeScannerScreen';
import  QRInfoScreen  from './QRInfoScreen';
import 'react-native-gesture-handler';

const Stack = createStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="QRCodeScannerScreen" component={QRCodeScannerScreen} />
        <Stack.Screen name="QRInfoScreen" component={QRInfoScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
