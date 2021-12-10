import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import Game from './components/Game';
import Scores from './components/Scores';


const deviceHeight = Dimensions.get('screen').height
const deviceWidth = Dimensions.get('screen').width
const Stack = createNativeStackNavigator()

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          options={{headerShown: false}}
          component={Game}
        />
        <Stack.Screen name="Scores" component={Scores} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  )  
}

export default App
