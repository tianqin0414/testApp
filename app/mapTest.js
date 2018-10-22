import React, { Component, } from 'react';
import { StyleSheet, Text, SafeAreaView, TextInput, TouchableOpacity, Image, ScrollView, View, } from 'react-native';

const CONFIG = [
  {
    type: 'title',
    selectedIndex: 0,
    data: [
      { title: '全部', subtitle: '1200m', },
      { title: '自助餐', subtitle: '300m', },
      { title: '自助餐', subtitle: '200m', },
    ],
  },
  {
    type: 'title',
    selectedIndex: 0,
    data: [ {
      title: '智能排序',
    }, {
      title: '离我最近',
    }, {
      title: '好评优先',
    }, {
      title: '人气最高',
    }, ],
  },
  {
    type: 'title',
    selectedIndex: 0,
    data: [ {
      title: '价格',
    }, {
      title: '0-4k',
    }, {
      title: '4-8k',
    }, {
      title: '8-12k',
    }, ],
  },
];

const arrNum = [ 1, 2, 3, 4, 7, 8, ];
arrNum.push(5);
arrNum.push(6);
arrNum.splice(0, 1);
export default class ExampleScreen extends Component {
  renderItem() {
    const itemAry = [];
    // 遍历
    for (let i = 0; i < CONFIG[1].data.length; i++) {
      itemAry.push(
        <Text key={i}>{CONFIG[1].data[i].title}</Text>
      );
    }
    return itemAry;
  }
  render() {
    return (
      <View>
        <ScrollView>
          {CONFIG[0].data.map((data, index) => {
            return (<Text key={index}>{data.title}</Text>);
          })}
        </ScrollView>
      </View>
    );
  }
}
