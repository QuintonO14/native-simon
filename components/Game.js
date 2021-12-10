import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View, Animated, ImageBackground } from 'react-native';
import { AntDesign } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import moment from 'moment';
import { Audio } from 'expo-av';
import Tile from './Tile';
import timer from '../utils/timer';
import AsyncStorageLib from '@react-native-async-storage/async-storage';

const deviceWidth = Dimensions.get('screen').width
const deviceHeight = Dimensions.get('screen').height


const Game = ({navigation}) => {
      const gameProps = {
        isRunning: false,
        colors: [],
        score: 0,
        userTurn: false,
        userColors: []
      }

      const [game, setGame] = useState(gameProps)
      const [message, setMessage] = useState("")
      const [started, setStarted] = useState(null)
      const [active, setActive] = useState("")
      const [userScores, setScores] = useState([])
      const redSound = require('../assets/simonSound1.mp3')
      const blueSound = require('../assets/simonSound2.mp3')
      const greenSound = require('../assets/simonSound3.mp3')
      const goldSound = require('../assets/simonSound4.mp3')
      const background = require('../assets/background.jpg')
      const fade = useRef(new Animated.Value(0)).current
      const gameTiles = [
        {key: 0, color: 'red', sound: redSound},
        {key: 1, color: 'blue', sound: blueSound},
        {key: 2, color: 'green', sound: greenSound},
        {key: 3, color: 'gold', sound: goldSound}
      ]
      useEffect(async() => {
        let scores = await AsyncStorageLib.getItem("@user_scores")
          if(scores != null) {
            await AsyncStorageLib.removeItem('@user_scores')
          }
            await AsyncStorageLib.setItem('@user_scores', JSON.stringify(userScores))
      }, [userScores])
    
      useEffect(() => {
        if(started) {
          setGame({...gameProps, isRunning: true})
        } else {
          setGame(gameProps)
        }
      }, [started])
    
      useEffect(() => {
        if(started && game.isRunning) {
          let randomColor = gameTiles[Math.floor(Math.random() * 4)].color
          const copiedArr = [...game.colors];
          copiedArr.push(randomColor)
          setGame({...game, colors: copiedArr})
        }
      }, [started, game.isRunning])
    
      useEffect(() => {
        if(started && game.isRunning && game.colors.length) {
          createPattern()
        }
      }, [started, game.isRunning, game.colors.length])
      
      useEffect(async() => {
          const scores = await AsyncStorageLib.getItem("@user_scores")
          if(scores != null) {
          setScores(JSON.parse(scores))
          } 
      }, [])
      const fadeIn = () => {
        Animated.timing(fade, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true
        }).start()
      }
    
      const fadeOut = () => {
        Animated.timing(fade, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true
        }).start()
      }
      const createPattern = async() => {
        await timer(500);
        for (let i = 0; i < game.colors.length; i++) {
          setActive(game.colors[i])
          let colorSound = gameTiles.find(c => c.color === game.colors[i]).sound
          const {sound} = await Audio.Sound.createAsync(
            colorSound
          )
          await sound.playAsync()  
          await timer(500)
          sound.unloadAsync()
          setActive("")
          await timer(500)
          if (i === game.colors.length - 1) {
            const copyColors = [...game.colors];
            setGame({
              ...game,
              isRunning: false,
              userTurn: true,
              userColors: copyColors.reverse(),
            });
          }
        }
      }
      const addColor = async (color, colorSound) => {
        if (!game.isRunning && game.userTurn) {
          const copyUserColors = [...game.userColors];
          const lastColor = copyUserColors.pop();
          if (color === lastColor) {
            const {sound} = await Audio.Sound.createAsync(
              colorSound
            )
            await sound.playAsync();
            await timer(500)
            sound.unloadAsync();
            if (copyUserColors.length) {
              setGame({ ...game, userColors: copyUserColors });
            } else {
              await timer(500);
              setGame({
                ...game,
                isRunning: true,
                userTurn: false,
                score: game.colors.length,
                userColors: [],
              });
            }
          } else {
            await timer(500);
            setStarted(false)
            const { sound } = await Audio.Sound.createAsync(
              require('../assets/error.wav')
            )
            await sound.playAsync()
            await timer(500)
            sound.unloadAsync()
            if(game.score > 0) {
                try {
                    if(userScores) {
                    const date = moment().format('MMM do YY')
                    const scoreObj = {score: game.score, date: date }
                    setScores((prev) => [...prev, scoreObj])
                    } 
                } catch (e) {
                    console.log(e)
                }
            }
            setMessage("Try Again!")
            fadeIn()
            await timer(2000)
            fadeOut()
            await timer(1000)
            setMessage("")
            setGame({ ...gameProps });
          }
          await timer(500);
        }
      }      

      return (
        <View style={styles.container}>
          <ImageBackground source={background} resizeMode="cover" style={{height:'100%'}}>
          <TouchableOpacity style={{
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            alignSelf:'center',
            flex: 1,
            width: '100%'
          }}>
          <Animated.Text style={{color:'white', fontSize: 40, opacity: fade}}>{message ? message : null}</Animated.Text>
          </TouchableOpacity>
          <FlatList
          contentContainerStyle={{
           alignItems:'center',
           justifyContent: 'center',
           position: 'relative',
           width: deviceWidth 
          }}
          numColumns={2}
          data={gameTiles}
          renderItem={({item}) => {
            return (
               <Tile game={game} addColor={() => addColor(item.color, item.sound)} active={active} item={item} />
            )
          }}
          />  
          <TouchableOpacity activeOpacity={1} onPress={() => setStarted(true)} style={styles.button} disabled={started}>
            <Text style={{fontSize: 100, color:'white'}}>
              {started === true ? game.score : 
              started === false ? <MaterialIcons name="replay" size={100} color="white" /> :
              <AntDesign name="caretright" size={100} color="white"/>}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.scores} onPress={() => navigation.navigate('Scores')}>
                  <MaterialIcons name="leaderboard" size={40} color="black" 
                  style={styles.icon} />
          </TouchableOpacity>
          <StatusBar style="auto" hidden={true} />
          </ImageBackground>
        </View>
      );
    }
    
    
    const styles = StyleSheet.create({
      container: {
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
      },
      button: {
        backgroundColor:'black',
        borderRadius: deviceWidth / 2,
        position:'absolute',
        color: 'white',
        height: "20%",
        width: deviceWidth <= 500 ? "40%" : deviceWidth <= 900 ? "30%" : deviceWidth <= 1200 ? "30%" : "25%",
        top: deviceHeight / 2.8,
        zIndex: 1,
        borderWidth: 1,
        alignItems:'center',
        justifyContent:'center',
        alignSelf:'center',
        borderStyle: 'solid',
        borderColor: 'black',
      },
      scores : {
          bottom: 50,
          zIndex: 1,
          alignSelf: 'center'
      },
      icon : {
        backgroundColor:'white', 
        padding: 10, 
        borderRadius: 10
      }
    });

export default Game