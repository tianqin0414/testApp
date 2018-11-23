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
        <Text style={props.selected ? styles.menuTextHigh : styles.menuText}>{props.label}22</Text>
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
      const subselected = this.props.subselected[subindex] ? this.props.subselected[subindex] : 0;
      const selected = subselected === index;
      const selectStyle = selected ?
        [ styles.itemSelectH, ] :
        [ styles.itemSelect, ];
      const onPress = () => {
        this.props.onSelectMenu(this.props.menuIndex, index, item);
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
      const enabled = this.props.menuIndex == index; // || this.state.current == index;
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
      top[i] = item.category;

      const length = item.data.length;

      maxHeight[i] = Math.ceil(length / 3) * 60;

      if (item.menuIndex != null) {
        subselected[i] = item.menuIndex;
      }

      height[i] = new Animated.Value(0);
    }


    // 分析数据
    this.state = {
      array,
      dic,
      top,
      maxHeight,
      subselected,
      height,
      fadeInOpacity: new Animated.Value(0),
      menuIndex: null, // 被选菜单
    };
  }


  componentDidMount() {
  }

  componentWillUnmount() {
  }

    onSelectMenu = (menuIndex, index, data) => {
      this.hide(menuIndex, index);
      this.props.onSelectMenu && this.props.onSelectMenu(menuIndex, index, data);
    }
    onHide = (menuIndex) => {
      Animated.parallel([ this.createAnimation(menuIndex, 0), this.createFade(0), ]).start();
    }

    onShow = (menuIndex) => {
      Animated.parallel([ this.createAnimation(menuIndex, this.state.maxHeight[menuIndex]), this.createFade(1), ]).start();
    }

    onSelect = (menuIndex) => {
      if (menuIndex === this.state.menuIndex) {
        // 消失
        this.hide(menuIndex);
      } else {
        this.setState({ menuIndex, }); // menuIndex 赋值
        this.onShow(menuIndex);
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

    hide = (menuIndex, subselected) => {
      const opts = { menuIndex: null, current: menuIndex, };
      const isRemove = this.state.subselected[menuIndex] == subselected;
      if (subselected !== undefined && !isRemove) {
        this.state.subselected[menuIndex] = subselected;
        if (subselected !== 0) {
          this.state.top[menuIndex] = this.props.config[menuIndex].data[subselected].option;
        }else {
            this.state.top[menuIndex] = this.props.config[menuIndex].category;
        }
        this.state.dic[menuIndex] = { name: this.props.config[menuIndex].data[subselected].option, m: new Date().getTime(), };

        // opts = { menuIndex: null, current: menuIndex, subselected: this.state.subselected.concat(), };
      } else if (isRemove) {
        this.state.subselected[menuIndex] = null;
        // this.state.dic[menuIndex]=null;// arr.splice(1,2)
        delete this.state.dic[menuIndex];
        this.state.top[menuIndex] = this.props.config[menuIndex].category;
      }


      this.setState(opts);
      this.onHide(menuIndex);
    }

    // renderSelected() {
    //   function compare(property) {
    //     return function (obj1, obj2) {
    //       const value1 = obj1[property];
    //       const value2 = obj2[property];
    //       return value1 - value2; // 升序
    //     };
    //   }
    //
    //   const itemAry = [];
    //   const arr = Object.values(this.state.dic).sort(compare("m"));
    //   const key = new Date().getTime();
    //   // const arr = this.state.dic.sort(compare("m"));
    //   arr.forEach((row, index) => {
    //     itemAry.push(
    //       <TouchableOpacity onPress={() => this.hideA(0)} key={key}>
    //         <Text style={{ fontSize: 24, }}>{row.name}1</Text>
    //       </TouchableOpacity>
    //     );
    //   });
    //   return itemAry;
    // }

    // renderSeletedSecond() {
    //   return (
    //     <View style={{ backgroundColor: 'red', height: 100, }}>
    //       {this.renderSelected()}
    //
    //     </View>
    //   );
    // }


    renderList = (d, index) => { // index 为第几个菜单
      // const subselected = this.state.subselected[index];
      return (
        <List
          data={d}
          key={index}
          index={index}
          height={this.state.height}
          subselected={this.state.subselected}
          menuIndex={this.state.menuIndex}
          onSelectMenu={this.onSelectMenu}
        />
      );
    }


    render() {
      let list = null;
      if (this.state.menuIndex !== null) {
        list = this.props.config[this.state.menuIndex].data;
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
                selected={this.state.menuIndex === index}
              />);
            })}
          </View>

          {/* {Object.values(this.state.dic).length == 0 ? null : this.renderSeletedSecond() } */}
          {this.props.renderContent()}
          <View style={styles.bgContainer} pointerEvents={this.state.menuIndex !== null ? "auto" : "none"}>
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
