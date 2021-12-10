import React from "react";
import { TouchableHighlight, View, StyleSheet, Dimensions } from "react-native";

const deviceHeight = Dimensions.get('screen').height
const deviceWidth = Dimensions.get('screen').width

const Tile = ({item, addColor, active, game}) => {
    return (
        <TouchableHighlight
        style={{
          flexDirection: 'row',
          height: '100%',
          backgroundColor: 'black',
          borderTopLeftRadius: item.color === 'red' ? 1000 : null,
          borderTopRightRadius: item.color === 'blue' ? 1000 : null,
          borderBottomLeftRadius: item.color === 'green' ? 1000 : null,
          borderBottomRightRadius: item.color === 'gold' ? 1000 : null,
          borderColor: 'black',
          borderWidth: 5
          
          
        }}
        key={item.key}
        onPress={addColor}
        activeOpacity={0.7}
        underlayColor="black"
        disabled={!game.userTurn}
        >
        <View
        style={[styles(item).tile, active != item.color ? {opacity: 1} : {opacity: 0.7}]}
        />
        </TouchableHighlight>    
    )
}


export default Tile;

const styles = (item) => StyleSheet.create({
    tile : {
        height: deviceHeight / 4, 
        width:  deviceWidth / 2 - 10,  
        aspectRatio: 1,
        backgroundColor: item.color,
        borderTopLeftRadius: item.color === 'red' ? 1000 : null,
        borderTopRightRadius: item.color === 'blue' ? 1000 : null,
        borderBottomLeftRadius: item.color === 'green' ? 1000 : null,
        borderBottomRightRadius: item.color === 'gold' ? 1000 : null
    }
  });