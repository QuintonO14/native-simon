import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import { AntDesign } from '@expo/vector-icons'
import Tile from './components/Tile';
import timer from './utils/timer';
import Sound from 'react-native-sound'

const deviceHeight = Dimensions.get('screen').height
const deviceWidth = Dimensions.get('screen').width

export default function App() {
  const gameProps = {
    isRunning: false,
    colors: [],
    score: 0,
    userTurn: false,
    userColors: []
  }
  Sound.setCategory("Playback")
  const redSound = new Sound("simonSound1.mp3", Sound.MAIN_BUNDLE, (err) => {
    if(err) {
      console.log('Error')
      return;
    }
  })
  const gameTiles = [
    {key: 0, color: 'red'},
    {key: 1, color: 'blue'},
    {key: 2, color: 'green'},
    {key: 3, color: 'gold'}
  ]
  const [game, setGame] = useState(gameProps)
  const [message, setMessage] = useState("")
  const [started, setStarted] = useState(false)
  const [active, setActive] = useState("")

  const fade = useRef(new Animated.Value(0)).current
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

  const createPattern = async() => {
    await timer(500);
    for (let i = 0; i < game.colors.length; i++) {
      setActive(game.colors[i])
      await timer(500)
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
  
  const addColor = async color => {
    if (!game.isRunning && game.userTurn) {
      const copyUserColors = [...game.userColors];
      const lastColor = copyUserColors.pop();

      if (color === lastColor) {
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
        setGame({ ...gameProps });
        setStarted(false)
        setMessage("Try Again!")
        fadeIn()
        await timer(1000)
        fadeOut()
        await timer(1000)
        setMessage("")
      }
      await timer(500);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={{
        backgroundColor:'black',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        flex: 1,
        width: '100%'
      }}>
      <Animated.Text style={{color:'white', textAlign: 'center', fontSize: 40, opacity: fade}}>{message ? message : null}</Animated.Text>
      <Text style={{color:'white'}}>{deviceWidth}</Text>
      <Text style={{color:'white'}}>{deviceHeight}</Text>
      </TouchableOpacity>
      <FlatList
      contentContainerStyle={{
       alignItems:'center',
       backgroundColor: 'black',
       justifyContent: 'center',
       position: 'relative',
       width: deviceWidth 
      }}
      numColumns={2}
      data={gameTiles}
      renderItem={({item}) => {
        return (
           <Tile addColor={() => addColor(item.color)} active={active} item={item} />
        )
      }}
      />  
      <StatusBar style="auto" hidden={true} />
      <TouchableOpacity activeOpacity={1} onPress={() => setStarted(true)} style={styles.button} disabled={started}>
        <Text style={{fontSize: 100, color:'white'}}>
          {started ? game.score : <AntDesign name="caretright" size={100} color="white"/>}
        </Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    position: 'absolute',
    backgroundColor: 'black'
  },
  button: {
    backgroundColor:'black',
    borderRadius: deviceWidth / 2,
    position:'absolute',
    color: 'white',
    height: "20%",
    width: deviceWidth <= 500 ? "40%" : deviceWidth <= 900 ? "30%" : deviceWidth <= 1200 ? "30%" : "25%",
    zIndex: 1,
    borderWidth: 1,
    alignItems:'center',
    justifyContent:'center',
    borderStyle: 'solid',
    borderColor: 'black',
  }, 
});
