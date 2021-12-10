import React, { useEffect, useState } from "react"
import { FlatList, Text, View, TouchableOpacity, StyleSheet } from "react-native"
import AsyncStorageLib from "@react-native-async-storage/async-storage"
import { AntDesign } from '@expo/vector-icons'

const Scores = ({navigation}) => {
    const [userScore, setScores] = useState([])
    const getData= async () => {
        try {
            const scores = await AsyncStorageLib.getItem('@user_scores')
            if(scores !== null) {
                setScores(JSON.parse(scores))
            }
        } catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        getData()
    }, [])
    userScore.sort((a, b) => b.score - a.score)
    userScore.length = userScore.length <= 10 ? userScore.length : 10
    return (
        <View style={{backgroundColor: 'rgb(180, 180, 180)', flex: 1}}>
          <TouchableOpacity style={{margin: 10}} onPress={() => navigation.navigate('Home')}>
                  <AntDesign name="back" size={40} color="black" />
          </TouchableOpacity>
           <Text style={styles.header}>Scores</Text>
           {userScore.length ? (
                <FlatList
                contentContainerStyle={{
                    alignItems: 'center',
                }}
                data={userScore}
                renderItem={({item, index}) => {
                    return (
                    <View style={styles.score}>
                       <Text style={{fontSize: 24}}>{index + 1 + ") "}</Text>
                       <Text style={{fontSize: 24, fontWeight:'bold'}}>{item.score + " "}</Text>
                       <Text style={{fontSize: 24}}>{item.date}</Text>
                    </View>
                    )
                  }}
                keyExtractor={(item, index) => index.toString()}
                />
           ) : (
               <Text style={{
                   textAlign: 'center',
                   fontSize: 52
               }}>No Scores Yet</Text>
           )}
        </View>
    )
}

const styles = StyleSheet.create({
    header : {
        textAlign: 'center',
        fontSize: 64, 
        paddingBottom: 20
    },
    score : {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: '100%',
        marginBottom: 10,
        marginTop: 10
    }
});


export default Scores