import React from "react";
import { TouchableHighlight, View, StyleSheet, Dimensions } from "react-native";

const deviceHeight = Dimensions.get('screen').height
const deviceWidth = Dimensions.get('screen').width

const Tile = ({item, addColor, active}) => {
    return (
        <TouchableHighlight
        style={{
          flexDirection: 'row',
          height: '100%',
          borderTopLeftRadius: item.color === 'red' ? 1000 : null,
          borderTopRightRadius: item.color === 'blue' ? 1000 : null,
          borderBottomLeftRadius: item.color === 'green' ? 1000 : null,
          borderBottomRightRadius: item.color === 'gold' ? 1000 : null,
          borderWidth: 3,
          borderColor: 'black'
        }}
        key={item.key}
        onPress={addColor}
        activeOpacity={0.8}
        >
        <View
        style={[styles(item).tile, active != item.color ? {opacity: 1} : {opacity: 0.8}]}
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