/** react 组建的引用 */
import React, {Component} from "react";
import {StyleSheet, Text, Image, View, ScrollView, Dimensions, TouchableWithoutFeedback} from "react-native";

/** 全局样式的引用 */
import {Layout} from "../../styles/layout";

/** 工具方法的引用 */
import {Util} from "../../utils/util";
import {bouncedUtils} from "../../utils/bouncedUtils";
import StorageData from "../../store/storageData";

/** 第三方依赖库的引用 */
import {withNavigation} from "react-navigation";

/** 一些常量的声明 */
const {width, height} = Dimensions.get("window"); //屏幕宽度

/** 自定义组建的引用 */
import BXTextInput from "../../components/CTextInput";
import BottomText from "../../components/BottomText/BottomText";
import StaticPages from "../../utils/staticPage";
import CGradientButton from "../../components/CGradientButton";
import CNavigation from "../../components/CNavigation";

class Login extends Component {
  constructor(props) {
    super(props);
    this.isShowIcon = false;
    this.state = {
      secureTextEntry: true,
      telephoneNumber: "",
      passWord: "",
      disabled: true
    };
  }

  componentDidMount() {
  }

  componentWillMount() {
  }

  componentWillUnmount() {
  }

  componentWillReceiveProps(nextProps, nextState) {
  }

  /** 输入手机号 */
  _getTel = val => {
    const {passWord} = this.state;
    this.state.telephoneNumber = val;
    if (passWord.length >= 6 && val.length >= 11) {
      this.setState({disabled: false});
    } else if (passWord.length < 6 || val.length < 11) {
      this.setState({disabled: true});
    }
  };

  /** 输入密码 */
  _getPassword = val => {
    const {telephoneNumber} = this.state;
    this.state.passWord = val;
    if (telephoneNumber.length >= 11 && val.length >= 6) {
      this.setState({disabled: false});
    } else if (telephoneNumber.length < 11 || val.length < 6) {
      this.setState({disabled: true});
    }
  };

  /** 清空数据 */
  _clearData = () => {
    this.setState({
      secureTextEntry: true,
      disabled: true
    });
    this.state.telephoneNumber = "";
    this.state.passWord = "";
    this.isShowIcon = false;
    this._telInputInstance._clear();
    this._passWordInputInstance._clear();
  };

  /** 输入验证 */
  _validation = () => {
    /** 获取本地的用户信息进行验证 */
    StorageData.getData("registerInfo")
      .then(res => {
        let {phoneNumber, password} = res;
        let {passWord, telephoneNumber} = this.state;
        if (passWord === password && telephoneNumber === phoneNumber) {
          this.props.navigation.navigate("MainStack");
          StorageData.mergeData('userInfo', {
            phoneNumber: telephoneNumber
          })
          this._clearData();
          return;
        }

        if (passWord !== password || telephoneNumber !== phoneNumber) {
          bouncedUtils.notices.show({
            type: "warning",
            content: "手机号或邀请码错误，请重新输入"
          });
        }
      })
      .catch(error => {
        /** 捕获错误信息以及 reject 返回的 信息 */
        console.log(`获取信息---【${key}】----失败，失败信息为【${error}】!!!!!!`);
      });
  };

  _onPress = () => {
    this.props.navigation.navigate("ValidationTelephone")
  }

  render() {
    return (
      <CNavigation
        isNavContent={false}
        isPaddingTop={false}
      >
        <ScrollView style={styles.scrollViewStyle}
                    keyboardDismissMode={"on-drag"}
                    keyboardShouldPersistTaps={"handled"}
                    showsVerticalScrollIndicator={false}>

          {StaticPages.LoginAndRegisterHeader("欢迎回来")}

          <BXTextInput
            getRef={ref => (this._telInputInstance = ref)}
            placeholder={"请输入手机号"}
            keyboardType={"numeric"}
            maxLength={11}
            handle={this._getTel}
            clearInputValue={() => this.setState({telephoneNumber: "", disabled: true})}
          />

          <BXTextInput
            getRef={ref => (this._passWordInputInstance = ref)}
            placeholder={"请输入密码"}
            keyboardType={"default"}
            maxLength={16}
            isShowPasswordIcon={true}
            secureTextEntry={this.state.secureTextEntry} fegn
            changeSecureTextEntry={() => this.setState({secureTextEntry: !this.state.secureTextEntry})}
            clearInputValue={() => this.setState({passWord: "", disabled: true})}
            handle={this._getPassword}
          />

          <TouchableWithoutFeedback
            onPress={this._onPress}>
            <View style={styles.invitationCodeWrapper}>
              <Text style={styles.invitationCode}>{"忘记密码？"}</Text>
            </View>
          </TouchableWithoutFeedback>

          <CGradientButton disabled={this.state.disabled}
                           gradientType={"btn_l"}
                           contentText={"登陆"}
                           textStyle={{
                             fontSize: 17,
                             color: "#FFFFFF",
                             letterSpacing: 0,
                             textAlign: "center",
                           }}
                           onPress={this._validation}/>
        </ScrollView>

        <BottomText normalText={"还没有账号？"} clickText={"注册"} handle={this.props.switchToRegister}/>
      </CNavigation>
    );
  }
}


export default withNavigation(Login);

const styles = StyleSheet.create({
  scrollViewStyle: {
    flex: 1,
    width: width,
    paddingHorizontal: Layout.gap.gap_edge,
  },
  invitationCodeWrapper: {
    marginTop: 16,
    marginBottom: 30,
    flex: 1,
    ...Layout.layout.rfefe
  },
  invitationCode: {
    fontSize: 14,
    color: Layout.color.worange
  },

  linearGradient: {
    borderRadius: 22,
    flex: 1,
    height: 44,
    ...Layout.layout.rcc
  },
});
