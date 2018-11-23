import React, { Component, } from 'react';
import {
  AppRegistry,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
  View,
} from 'react-native';
import { SearchBar, } from 'react-native-elements';

import { SearchInput, } from 'teaset';
import Search from 'react-native-search-box';
// import { SearchBar, } from 'react-native-elements';
import TopMenu from "./TopMenu";


const { width, height, } = Dimensions.get('window');


const CONFIG = [
  {
    type: 'title',
    category: '排序',
    // selectedIndex: 0,
    data: [ {
      option: '综合',
    }, {
      option: '离我最近',
    }, {
      option: '好评优先',
    }, {
      option: '人气最高',
    }, ],
  },
  {
    type: 'Subtitle',
    category: '不能收回',
    data: [ {
      option: '不限',
    }, {
      option: '4-8k',
    }, {
      option: '8-12k',
    },
    {
      option: 'AAAAAAA',
    }, {
      option: '4-8k',
    }, {
      option: '8-12k',
    },
    {
      option: '8-12k',
    }, ],
  },
  {
    type: 'title',
    category: '价格2',
    data: [ {
      option: '不限',
    }, {
      option: '4-8k',
    }, {
      option: '8-12k',
    },
    {
      option: '0-4k',
    }, {
      option: '4-8k',
    }, {
      option: '8-12k',
    }, ],
  },
];


export default class FoodView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }

    // onSelectMenuTQ=(index, subindex, data) => {
    //   this.setState({ index, subindex, data, });
    // };

    renderContent=() => {
      const indexA = this.state.index;
      return (
        <View style={{ marginTop: 0, }}>
          <TouchableOpacity>
            <Text
              style={styles.text}
            >index:{this.state.index} subindex:{this.state.subindex} title:{ this.state.data.option}</Text>
          </TouchableOpacity>
        </View>
      );
      // alert(this.state.data.title)
    };

    onSelectMenu=(index, subindex, data) => {
      this.setState({ index, subindex, data, });
    };

    render() {
      return (
        <View style={styles.container}>
          <SearchInput
            style={{ height: 40, backgroundColor: '#fcf8e3', borderColor: '#8a6d3b', marginTop: 50, }}
            inputStyle={{ color: '#8a6d3b', fontSize: 18, }}
            iconSize={15}
            value={this.state.valueCustom}
            placeholder="Custom"
            placeholderTextColor="#aaa"
            onChangeText={text => this.setState({ valueCustom: text, })}
          />
          <Search
            ref="search_box"
            /**
            * There many props that can customizable
            * Please scroll down to Props section
            */
          />
          <SearchBar
            lightTheme
            placeholder="请输入您要搜索的号码"
          />
          <TopMenu style={styles.container} config={CONFIG} onSelectMenu={this.onSelectMenu} renderContent={this.renderContent} />
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    // backgroundColor: '#F5FCFF',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 20,
    marginTop: 0,
    justifyContent: 'center',
    alignItems: 'center',

  },

});
