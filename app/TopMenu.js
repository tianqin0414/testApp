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
} from 'react-native';

// const { Surface, Shape, Path, Group, } = ART;

const { width, height, } = Dimensions.get('window');

const T_WIDTH = 7;
const T_HEIGHT = 4;

const COLOR_HIGH = '#6057CA';
const COLOR_NORMAL = '#6c6c6c';

const LINE = 1 / PixelRatio.get();

// class Triangle extends React.Component {
//   render() {
//     let path;
//     let fill;
//     if (this.props.selected) {
//       fill = COLOR_HIGH;
//       path = new Path()
//         .moveTo(T_WIDTH / 2, 0)
//         .lineTo(0, T_HEIGHT)
//         .lineTo(T_WIDTH, T_HEIGHT)
//         .close();
//     } else {
//       fill = COLOR_NORMAL;
//       path = new Path()
//         .moveTo(0, 0)
//         .lineTo(T_WIDTH, 0)
//         .lineTo(T_WIDTH / 2, T_HEIGHT)
//         .close();
//     }
//
//     return (
//       <Surface width={T_WIDTH} height={T_HEIGHT}>
//         <Shape d={path} stroke="#00000000" fill={fill} strokeWidth={0} />
//       </Surface>
//     );
//   }
// }

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

const Subtitle = (props) => {
  const textStyle = props.selected ?
    [ styles.tableItemText, styles.highlight, styles.marginHigh, ] :
    [ styles.tableItemText, styles.margin, ];

  const rightTextStyle = props.selected ? [ styles.tableItemText, styles.highlight, ] : styles.tableItemText;

  const onPress = () => {
    props.onSelectMenu(props.index, props.subindex, props.data);
  };

  return (
    <TouchableHighlight onPress={onPress} underlayColor="#f5f5f5">
      <View style={styles.tableItem}>
        <View style={styles.row}>
          {/* {props.selected && <Check />} */}
          <Text style={textStyle}>{props.data.title}</Text>
        </View>
        <Text style={rightTextStyle}>{props.data.subtitle}</Text>
      </View>
    </TouchableHighlight>
  );
};

const Title = (props) => {
  const textStyle = props.selected ?
    [ styles.tableItemText, styles.highlight, styles.marginHigh, ] :
    [ styles.tableItemText, styles.margin, ];

    // const rightTextStyle = props.selected ? [ styles.tableItemText, styles.highlight, ] : styles.tableItemText;


  const onPress = () => {
    props.onSelectMenu(props.index, props.subindex, props.data);
  };

  return (
    <TouchableHighlight onPress={onPress} underlayColor="#f5f5f5">
      <View style={styles.titleItem}>
        {/* {props.selected && <Check />} */}

        <Text style={textStyle}>{props.data.title}rr</Text>
      </View>
    </TouchableHighlight>
  );
};

// const Check = () => {
//   return (
//     <Surface
//       width={18}
//       height={12}
//     >
//       <Group scale={0.03}>
//         <Shape
//           fill={COLOR_HIGH}
//           d={`M494,52c-13-13-33-13-46,0L176,324L62,211c-13-13-33-13-46,0s-13,33,0,46l137,136c6,6,15,10,23,10s17-4,23-10L494,99
//       C507,86,507,65,494,52z`}
//         />
//       </Group>
//     </Surface>
//   );
// };


export default class TopMenu extends Component {
  constructor(props) {
    super(props);
    const array = props.config;
    const top = [];
    const maxHeight = [];
    const subselected = [];
    const height = [];
    const selectedList = [ 1, 2, 3, ];
    const test = new Array();
    // 最大高度
    const max = parseInt((height - 80) * 0.8 / 43);
    const dic = new Array();

    for (let i = 0, c = array.length; i < c; i++) {
      const item = array[i];
      top[i] = item.data[item.selectedIndex].title;
      maxHeight[i] = Math.min(item.data.length, max) * 43;
      subselected[i] = item.selectedIndex;
      height[i] = new Animated.Value(0);
    }


    // 分析数据
    this.state = {
      dic,
      test,
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
    onSelectMenu = (index, subindex, data) => {
      this.hide(index, subindex);
      // this.props.onSelectMenu && this.props.onSelectMenu(index, subindex, data);
      this.props.onSelectMenu(index, subindex, data);
    }

    onSelectMenuTQ = (index) => {
      this.hide(index, 0);
      this.state.test.splice(index, 1);
    }

    TQTest = () => {
      alert('111');
    }
    onHide = (index) => {
      // 其他的设置为0
      for (let i = 0, c = this.state.height.length; i < c; ++i) {
        if (index != i) {
          this.state.height[i].setValue(0);
        }
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
        this.state.top[index] = this.props.config[index].data[subselected].title;
        const arr = this.state.test;
        if (subselected != 0) {
          // this.state.dic[index] = this.props.config[index].data[subselected].title;
          // this.state.test.push({`${index}`:this.props.config[index].data[subselected].titl,});
          if (1 === 1) {
            // this.state.test.push({ key: `${index}`, value: `${this.props.config[index].data[subselected].title}`, });
            this.state.test = [ { key: 1, value: '22', }, { key: 2, value: '32', }, { key: 2, value: '44', }, ];
            // this.state.dic = { aa: 11, bb: 22, };
          }
          // this.state.dic.aa = 133;
        }
        // this.state.dic.index = this.props.config[index].data[subselected].title;
        this.state.dic.tt = '1';
        this.state.dic.ppp = '2';
        this.state.dic.s = '3';
          this.state.dic.stt = '4';
        // this.state.dic['dd'] = '22';
        for (var key in this.state.dic) {
          alert(`${this.state.dic[key]}`);
        }
        // alert(`${this.state.dic.ppp}`);

        opts = { selectedIndex: null, current: index, subselected: this.state.subselected.concat(), };
      }
      this.setState(opts);
      this.onHide(index);
    }


    renderSeleted() {
      return (
        <TouchableOpacity>
          <View >
            <Text>重置</Text>
            {this.props.renderContent()}
          </View>
        </TouchableOpacity>
      );
    }


    renderSeletedSecond() {
      return (
        <View style={{ backgroundColor: 'red', height: 100, }}>
          {this.state.test.map((data, index) => {
            return (<Text key={index} onPress={() => this.onSelectMenuTQ(index)}>{data.value}{index}</Text>);
          })}

        </View>
      );
    }

    renderList = (d, index) => {
      const subselected = this.state.subselected[index];
      let Comp = null;
      if (d.type == 'title') {
        Comp = Title;
      } else {
        Comp = Subtitle;
      }

      const enabled = this.state.selectedIndex == index || this.state.current == index;

      return (
        <Animated.View
          key={index}
          pointerEvents={enabled ? 'auto' : 'none'}
          style={[ styles.content, { opacity: enabled ? 1 : 0, height: this.state.height[index], }, ]}
        >
          <ScrollView style={styles.scroll}>
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

          {/* {this.renderSeleted()} */}
          {/* onSelectMenuTQ =(index)=>{ */}
          {/* {this.state.num === 0 ? this.renderSeletedSecond() : null} */}

          {this.state.test.length == 0 ? null : this.renderSeletedSecond() }
          {/* } */}
          {this.props.renderContent()}

          {/* if(1===1){ */}
          {/* {this.renderSeleted()} */}
          {/* } */}
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

  scroll: { flex: 1, backgroundColor: '#fff', },
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
    fontSize: 13,
    color: COLOR_HIGH,
  },
  menuText: {
    marginRight: 3,
    fontSize: 13,
    color: COLOR_NORMAL,
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
