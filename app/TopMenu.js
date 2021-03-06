import React, { Component, } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Animated,
  ScrollView,
  Dimensions,
  PixelRatio,
  Text,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TouchableOpacity,
  ART,
  View,
  Image,
  FlatList,
} from 'react-native';

import { Badge, } from 'react-native-elements';

// const { Surface, Shape, Path, Group, } = ART;

const { width, height, } = Dimensions.get('window');

const COLOR_HIGH = '#6057CA';
const COLOR_NORMAL = '#6c6c6c';

const LINE = 1 / PixelRatio.get();


const TopMenuItem = (props) => {
  const onPress = () => {
    props.onSelect(props.index);
  };
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.item}>
        <Text style={props.selected ? styles.menuTextHigh : styles.menuText}>{props.label}</Text>
        {/* <Triangle selected={props.selected} /> */}
        <Image style={{ height: 15, width: 15, }} source={!props.selected ? require('../images/ic_triangle_down.png') : require('../images/ic_triangle_up.png')} />
      </View>
    </TouchableWithoutFeedback>
  );
};


class List extends Component {
  renderItemView = ({ item, index, }) => {
    const subindex = this.props.index; // index 为第几个菜单(subindex)
    // alert(`${subindex}`);
    const selected = this.props.subselected[subindex] === index;
    const selectStyle = selected ?
      [ styles.itemSelectH, ] :
      [ styles.itemSelect, ];
    const onPress = () => {
      this.props.onSelectMenu(this.props.selectedIndex, index, item);
    };
    return (
      <TouchableOpacity style={selectStyle} onPress={onPress}>
        <Text style={{ color: '#2d2d2d', fontSize: 15, }}>
          {item.option}
        </Text>
      </TouchableOpacity>
    );
  }
  render() {
    const d = this.props.data;
    const index = this.props.index;
    const enabled = this.props.selectedIndex == index; // || this.state.current == index;
    const key = enabled ? new Date().getTime() : index;
    return (
      <Animated.View
        key={key}
        pointerEvents={enabled ? 'auto' : 'none'}
        style={[ styles.content, { opacity: enabled ? 1 : 0, height: this.props.height[index], }, ]}
      >
        <View style={styles.scroll}>
          <FlatList
            data={d.data}
            columnWrapperStyle={styles.rowZero}
            numColumns={3}
            subindex={1}
            renderItem={this.renderItemView}
            keyExtractor={(renderItem, index) => index.toString()}
          />
        </View>
      </Animated.View>
    );
  }
}
export default class TopMenu extends Component {
  constructor(props) {
    super(props);
    const array = props.config;
    const top = [];
    const maxHeight = [];
    const subselected = [];
    const height = [];
    // const selectedList = [ 1, 2, 3, ];
    // 最大高度
    const max = parseInt((height - 80) * 0.8 / 43);
    // const dic = new Array();
    const dic = {};

    for (let i = 0, c = array.length; i < c; i++) {
      const item = array[i];
      if (item.category != null) {
        top[i] = item.category;
      } else {
        top[i] = item.data[item.selectedIndex].option;
      }
      const length = item.data.length;

      maxHeight[i] = Math.ceil(length / 3) * 60;

      if (item.selectedIndex != null) {
        subselected[i] = item.selectedIndex;
      }

      height[i] = new Animated.Value(0);
    }


    // 分析数据
    this.state = {
      array,
      dic,
      dicArr: [],
      top,
      maxHeight,
      subselected,
      height,
      fadeInOpacity: new Animated.Value(0),
      selectedIndex: null, // 被选菜单
      isSearch: true,
    };
  }


  componentDidMount() {
  }

  componentWillUnmount() {
  }

  onSelectMenu = (index, subindex, data) => {
    this.hide(index, subindex);
    this.props.onSelectMenu && this.props.onSelectMenu(index, subindex, data);
  }
  onHide = (index) => {
    Animated.parallel([ this.createAnimation(index, 0), this.createFade(0), ]).start();
  }

  onShow = (index) => {
    Animated.parallel([ this.createAnimation(index, this.state.maxHeight[index]), this.createFade(1), ]).start();
  }

  onSelect = (index) => {
    if (index === this.state.selectedIndex) {
      // 消失
      this.hide(index);
    } else {
      this.setState({ selectedIndex: index, }); // selectedIndex 赋值
      this.onShow(index);
    }
  }


  createAnimation = (index, height) => {
    // alert(`${height}`);
    return Animated.timing(
      this.state.height[index],
      {
        toValue: height,
        duration: 250,
      }
    );
  }


  createFade = (value) => {
    return Animated.timing(
      this.state.fadeInOpacity,
      {
        toValue: value,
        duration: 0,
      }
    );
  }

  hide = (index, subselected) => {
    const opts = { selectedIndex: null, };
    const isRemove = this.state.subselected[index] === subselected;
    if (subselected !== undefined && !isRemove) {
      this.state.subselected[index] = subselected;
      // const item = this.state.array[index];
      // if (item.category == null) {
      //   this.state.top[index] = this.props.config[index].data[subselected].option;
      // }
      // 指定排序的比较函数
      if (this.state.array[index].category != null) {
        this.state.dic[index] = { index, name: this.props.config[index].data[subselected].option, value: 5, m: new Date().getTime(), };
      }
      // opts = { selectedIndex: null, current: index, subselected: this.state.subselected.concat(), };
    } else if (isRemove) {
      this.cancelSelected(index);
    }
    this.setState(opts);
    this.onHide(index);
  }

  cancelSelected = (rowIndex) => {
    this.state.subselected[rowIndex] = null;
    delete this.state.dic[rowIndex];
    this.setState({ renderAG: null, }); // 重新render
  };

  cancelSeacrh = () => {
    this.props.cancelSeacrh();
  };

  renderSelected() {
    function compare(property) {
      return function (obj1, obj2) {
        const value1 = obj1[property];
        const value2 = obj2[property];
        return value1 - value2; // 升序
      };
    }
    const textStyle = this.props.numSubmit === null ? badgeStyles.textStyle : badgeStyles.textGreyStyle;
    const itemAry = [];
    const arr = Object.values(this.state.dic).sort(compare("m"));
    arr.forEach((row, index) => {
      itemAry.push(
        <Badge key={index} wrapperStyle={badgeStyles.wrapperStyle} containerStyle={badgeStyles.containerStyle} onPress={() => this.cancelSelected(row.index)} >
          <Text style={textStyle}>{row.name}   </Text>
          <Text style={textStyle}>×</Text>
        </Badge>
      );
    });
    return itemAry;
  }

  renderSeletedSecond() {
    return (
      <View>
        <View style={{ flexDirection: 'row', }}>
          {this.renderSelected()}
        </View>
        {this.props.numSubmit === null ? null :
        <View style={{ flexDirection: 'row', }}>
            <Badge
            key={99}
            wrapperStyle={badgeStyles.wrapperStyle}
            containerStyle={badgeStyles.containerStyle}
            onPress={() => this.cancelSeacrh()}
          >
            <Text style={badgeStyles.textStyle}>搜索:{this.props.numSubmit}   </Text>
            <Text style={badgeStyles.textStyle}>×</Text>
          </Badge>
          </View>
        }
      </View>
    );
  }


  renderList = (d, index) => { // index 为第几个菜单
    // const subselected = this.state.subselected[index];
    return (
      <List
        data={d}
        key={index}
        index={index}
        height={this.state.height}
        subselected={this.state.subselected}
        selectedIndex={this.state.selectedIndex}
        onSelectMenu={this.onSelectMenu}
      />
    );
  }


  render() {
    let list = null;
    if (this.state.selectedIndex !== null) {
      list = this.props.config[this.state.selectedIndex].data;
    }
    console.log(list);
    return (
      <View style={{ flex: 1, }}>
        <View style={styles.topMenu}>
          {this.state.top.map((t, index) => {
            return (<TopMenuItem
              key={index}
              index={index}
              onSelect={this.onSelect}
              label={t}
              selected={this.state.selectedIndex === index}
            />);
          })}
        </View>

        {Object.values(this.state.dic) == 0 && this.props.numSubmit == null ? null : this.renderSeletedSecond() }
        {this.props.renderContent()}
        <View style={styles.bgContainer} pointerEvents={this.state.selectedIndex !== null ? "auto" : "none"}>
          {/* <TouchableHighlight> */}
          <Animated.View style={[ styles.bg, { opacity: this.state.fadeInOpacity, }, ]} />
          {/* </TouchableHighlight> */}
          {this.props.config.map((d, index) => {
            return this.renderList(d, index);
          })}
        </View>
      </View>
    );
  }
}

const badgeStyles = StyleSheet.create({
  wrapperStyle: { marginLeft: 15, marginTop: 5, },
  containerStyle: { flexDirection: 'row', backgroundColor: 'violet', borderRadius: 0, justifyContent: 'space-between', },
  textStyle: { flex: 0, marginLeft: -5, },
  textGreyStyle: { flex: 0, marginLeft: -5, color: 'grey', },
});

const styles = StyleSheet.create({
  itemSelect: { backgroundColor: '#f4f4f4', height: 40, width: 90, alignItems: 'center', marginTop: 10, marginLeft: 15, marginRight: 15, marginBottom: 10, justifyContent: 'center', },
  itemSelectH: { backgroundColor: '#ff4012', height: 40, width: 90, alignItems: 'center', marginTop: 10, marginLeft: 15, marginRight: 15, marginBottom: 10, justifyContent: 'center', },
  rowZero: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scrollA: { flex: 1, backgroundColor: '#fff', },
  scroll: { flex: 1, backgroundColor: '#fff', justifyContent: 'space-around', },
  bgContainer: { position: 'absolute', top: 40, width, height, },
  bg: {
    flex: 1,
    backgroundColor: 'rgba(50,50,50,0.2)',
  },
  content: {
    position: 'absolute',
    width,
  },

  highlight: {
    color: COLOR_HIGH,
  },

  marginHigh: { },
  margin: { },


  titleItem: {
    height: 43,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: LINE,
    borderBottomColor: '#eee',
    flexDirection: 'row',
  },

  tableItem: {
    height: 43,
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: LINE,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tableItemText: { fontWeight: '300', fontSize: 14, },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTextHigh: {
    marginRight: 3,
    fontSize: 20,
    color: COLOR_HIGH,
  },
  menuText: {
    marginRight: 3,
    fontSize: 20,
    color: 'black',
  },
  topMenu: {
    flexDirection: 'row',
    height: 40,
    borderTopWidth: LINE,
    borderTopColor: '#bdbdbd',
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },

});
