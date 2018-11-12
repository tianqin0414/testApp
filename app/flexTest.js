import React, { Component, } from 'react';
import { StyleSheet, Text, SafeAreaView, TextInput, TouchableOpacity, Image, ScrollView, View, } from 'react-native';

export default class ExampleScreen extends Component {
  render() {
    return (
      <SafeAreaView>
        <View style={{ height: 2, }} />
        <View style={[ styles.list, { }, ]}>
          <View style={{ marginLeft: 10, flex: 1, backgroundColor: 'red', width: 20, height: 20, }} />
          <View style={{ textAlign: 'center', backgroundColor: 'yellow', width: 20, height: 20, justifyContent: 'center',flexDirection: 'row', }}>
            <Text style={{ }}>111</Text>
          </View>

          <View style={{ marginRight: 10, flex: 1, backgroundColor: 'blue', width: 20, height: 50, }} />
        </View>


        <View style={{ height: 2, }} />
        <View style={[ styles.list, { }, ]}>
          <Text style={{ marginLeft: 10, flex: 1, fontSize: 18, color: 'red', width: 100, }}>¥0</Text>
          <View style={{ textAlign: 'center', }} />

          <View style={{ justifyContent: 'flex-end', flex: 1, }}><Text style={{ marginRight: 10, fontSize: 18, }}>号码保护/月</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    height: 120,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
