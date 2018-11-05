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

const Title = (props) => {
  const textStyle = props.selected ?
    [ styles.tableItemText, styles.highlight, styles.marginHigh, ] :
    [ styles.tableItemText, styles.margin, ];

  const rightTextStyle = props.selected ? [ styles.tableItemText, styles.highlight, ] : styles.tableItemText;


  const onPress = () => {
    props.onSelectMenu(props.index, props.subindex, props.data);
  };

  return (
    <TouchableHighlight onPress={onPress} underlayColor="#f5f5f5">
      <View style={styles.titleItem}>
        {/* {props.selected && <Check />} */}

        <Text style={textStyle}>{props.data.option}rr</Text>
      </View>
    </TouchableHighlight>
  );
};

export default class TopMenu extends Component {
  constructor(props) {
    super(props);
    const array = props.config;
    const top = [];
    const maxHeight = [];
    const subselected = [];
    const height = [];
    const selectedList = [ 1, 2, 3, ];
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
      maxHeight[i] = Math.min(item.data.length, max) * 43;
      if (item.selectedIndex != null) {
        subselected[i] = item.selectedIndex;
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
      selectedIndex: null,
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
      // 其他的设置为0
      // for (let i = 0, c = this.state.height.length; i < c; ++i) {
      //   if (index != i) {
      //     this.state.height[i].setValue(0);
      //   }
      // }
        if (index==0){

        }
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
        this.setState({ selectedIndex: index, current: index, });
        this.onShow(index);
      }
    }


    createAnimation = (index, height) => {
    alert(`${this.state.height[index].value}`);
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
      let opts = { selectedIndex: null, current: index, };
      if (subselected !== undefined) {
        this.state.subselected[index] = subselected;
        const item = this.state.array[index];
        if (item.category == null) {
          this.state.top[index] = this.props.config[index].data[subselected].option;
        }
        // 指定排序的比较函数
        if (this.state.array[index].category != null) {
          this.state.dic[index] = { name: this.props.config[index].data[subselected].option, value: 5, m: new Date().getTime(), };
        }

        opts = { selectedIndex: null, current: index, subselected: this.state.subselected.concat(), };
      }


      this.setState(opts);
      this.onHide(index);
    }

    renderSelected() {
      function compare(property) {
        return function (obj1, obj2) {
          const value1 = obj1[property];
          const value2 = obj2[property];
          return value1 - value2; // 升序
        };
      }

      const itemAry = [];
      const arr = Object.values(this.state.dic).sort(compare("m"));
      // const arr = this.state.dic.sort(compare("m"));
      arr.forEach((row, index) => {
        itemAry.push(
          <Text key={index} style={{ fontSize: 24, }}>{row.name}</Text>
        );
      });
      return itemAry;
    }

    renderSeletedSecond() {
      return (
        <View style={{ backgroundColor: 'red', height: 100, }}>
          {this.renderSelected()}

        </View>
      );
    }

    renderItemView = ({ item, }) => {
      const onPress = () => {
        props.onSelectMenu(props.index, props.subindex, props.data);
      };
      return (
        <TouchableOpacity style={styles.itemSelect} onPress={onPress}>
          <Text style={{ color: '#2d2d2d', fontSize: 15, }}>
            {item.option}
          </Text>
        </TouchableOpacity>
      );
    }
    renderTestA = (d, index) => {
      const subselected = this.state.subselected[index];
      let Comp = null;
      if (d.type == 'title') {
        Comp = Title;
      } else {
        Comp = Title;
      }

      const enabled = this.state.selectedIndex == index || this.state.current == index;
      return (
        <Animated.View
          key={index}
          // pointerEvents={enabled ? 'auto' : 'none'}
          style={[ styles.content, { opacity: enabled ? 1 : 0, height: this.state.height[index], }, ]}
        >
          <ScrollView style={styles.scrollA}>
            {d.data.map((data, subindex) => {
              return (<Comp
                onSelectMenu={this.onSelectMenu}
                index={index}
                subindex={subindex}
                data={data}
                selected={subselected == subindex}
                key={subindex}
              />);
            })}
          </ScrollView>
        </Animated.View>
      );
    }
    renderTestB = (d, index) => {
      const subselected = this.state.subselected[index];

      const enabled = this.state.selectedIndex == index || this.state.current == index;
      return (
        <Animated.View
          key={index}
          pointerEvents={enabled ? 'auto' : 'none'}
          style={[ styles.content, { opacity: enabled ? 1 : 0, height: this.state.height[index], }, ]}
        >
          <View style={styles.scroll}>
            <FlatList
              data={d.data}
              columnWrapperStyle={styles.rowZero}
              numColumns={3}
              renderItem={this.renderItemView}
              keyExtractor={(renderItem, index) => index.toString()}
            />
          </View>
        </Animated.View>
      );
    }

    renderList = (d, index) => {
      if (d.data.length > 4) {
        return (
          this.renderTestB(d, index)
        );
      }
      return (
        this.renderTestA(d, index)
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

          {Object.values(this.state.dic).length == 0 ? null : this.renderSeletedSecond() }
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

const styles = StyleSheet.create({
  itemSelect: { backgroundColor: '#f4f4f4', height: 40, width: 90, alignItems: 'center', marginTop: 10, marginLeft: 15, marginRight: 15, marginBottom: 10, justifyContent: 'center', },
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
