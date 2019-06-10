<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn">
      <!-- <i class="el-icon-lx-logo"></i> -->
      <!-- <div v-if="!collapse" class="collapse-btn_first"><img src="../../assets/img/logo_.png" alt></div>
      <div v-else class="collapse-btn_second"><img src="../../assets/img/logo__.png" alt></div> -->
          <el-menu
              class="sidebar-el-menu"
              :collapse="collapse"
              unique-opened
            >
              <template>
                <el-menu-item index="newWarehousing"
                            key="newWarehousing">
                  <div>
                    <i ><img src="../../assets/img/logo__.png" alt></i>
                    <span slot="title"><img style=" margin-top: 10px;" src="../../assets/img/ticketPlus.png" alt></span>
                  </div>
                </el-menu-item>
              </template>
            </el-menu>
    </div>
    <!-- <div class="logo"><img src="../../assets/img/logo_.png" alt></div> -->
    <v-tags></v-tags>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 全屏显示 -->
        <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
        <!-- 工具选项 -->
        <div >
          <el-dropdown  @command="handleCommand" trigger="click">
            <el-button class="btn-tool ">
              <i class="el-icon-lx-xiaogongju"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="calculator">贴现计算器</el-dropdown-item>
              <el-dropdown-item command="calendar" >贴现日历</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- 消息中心 -->
        <!-- <div class="btn-bell">
          <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
            <router-link to="/tabs">
              <i class="el-icon-bell"></i>
            </router-link>
          </el-tooltip>
          <span class="btn-bell-badge" v-if="message"></span>
        </div>-->
        <!-- 用户头像 -->
        <div class="user-avator">
          <img src="../../assets/img/img.jpg">
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{datas.nickname}}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item v-if="datas.nickname">{{datas.nickname}}</el-dropdown-item> -->
            <el-dropdown-item v-if="datas.mobile" command="mobile">{{datas.mobile}}</el-dropdown-item>
            <el-dropdown-item v-if="datas.email">{{datas.email}}</el-dropdown-item>
            <el-dropdown-item divided command="personalCenter">个人中心</el-dropdown-item>
            <el-dropdown-item divided command="changePassword">修改密码</el-dropdown-item>
            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <div id="changePwd">
      <el-dialog
        title="修改密码"
        :visible.sync="dialogVisible"
        width="373px"
        top="12.11%"
        class="pwdDialog"
        :close-on-click-modal="false"
      >

        <div class="content_dialog clearfix">
          <el-form :model="ruleForm" :rules="rules" status-icon ref="ruleForm" label-width="10.78%">
            <el-form-item
              label="原密码:"
              :label-width="formLabelWidth"
              prop="oldPassword"
              class="letter-space pwd-label pwd-input"
            >
              <el-input v-model="ruleForm.oldPassword" autocomplete="off" class="pwdInput"></el-input>
            </el-form-item>
            <el-form-item
              label="新密码:"
              :label-width="formLabelWidth"
              prop="newPassword"
              class="letter-space pwd-label pwd-input"
            >
              <el-input v-model="ruleForm.newPassword" autocomplete="off" class="pwdInput"></el-input>
            </el-form-item>
            <el-form-item
              label="确认密码:"
              :label-width="formLabelWidth"
              prop="checkPassword"
              class="pwd-input"
            >
              <el-input v-model="ruleForm.checkPassword" autocomplete="off" class="pwdInput"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveChangedPwd('ruleForm')">保存</el-button>
          <el-button @click="dialogVisible = false;resetForm('ruleForm')">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="toolsCalculator">
      <el-dialog
        title="计算器"
        :visible.sync="dialogVisible_"
        width="716px"
        :close-on-click-modal="false"
      >
        <div class="toolsCalculator_con">
          <el-form :model="ruleForm_" :rules="rules_" ref="ruleForm_">
            <el-form-item label="票面金额：" prop="parValue" label-width="100px">
              <el-input
                v-model="ruleForm_.parValue"
                class="input210"
                placeholder="请输入票面金额"
                @blur="handleticketAmount(ruleForm_.parValue)"
              ></el-input>
            </el-form-item>
            <el-form-item label="到  期  日：" prop="maturityDate" label-width="100px">
              <el-date-picker
                v-model="ruleForm_.maturityDate"
                align="right"
                type="date"
                placeholder="选择日期"
                @change="handleMaturityDate"
                value-format="yyyy-MM-dd"
                class="input210"
              ></el-date-picker>
            </el-form-item>
            <p>交易 1</p>
            <ul class="clearfix">
              <li class="fl" style="width:330px">
                <el-form-item label="交 易 日 1：" prop="tradingDayFirst" label-width="100px">
                  <el-date-picker
                    v-model="ruleForm_.tradingDayFirst"
                    align="right"
                    type="date"
                    placeholder="选择日期"
                    @change="handleTradingDay_one"
                    value-format="yyyy-MM-dd"
                    class="input210"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="调整天数：" prop="adjustDay" label-width="100px">
                  <el-input
                    v-model="ruleForm_.adjustDay"
                    class="input210"
                    placeholder="节假日加天需自行调整"
                    @blur="handleAdjustDay(ruleForm_.adjustDay,1)"
                  ></el-input>
                </el-form-item>
                <el-form-item label="利 率 1：" prop="interestRateFirst" label-width="100px">
                  <el-input
                    v-model="ruleForm_.interestRateFirst"
                    class="input210"
                    placeholder="请输入利率"
                    @blur="handleinterestRate(ruleForm_.interestRateFirst,1)"
                    suffix-icon="el-icon-zoom-out"
                  ></el-input>
                </el-form-item>
              </li>
              <li class="toolsCalculator_li">
                <div>
                  <el-form-item label="计息天数（天）：" prop="calculateDayFirst" class="li_item">
                    <span style="color:#5376FF;font-size:16px">{{ruleForm_.calculateDayFirst}}</span>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item label="贴现利息（元）：" prop="discountInterestFirst" class="li_item">
                    <span style="color:#5376FF;font-size:16px">{{ruleForm_.discountInterestFirst}}</span>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item label="贴现金额（元）：" prop="discountAmountFirst" class="li_item">
                    <span style="color:#5376FF;font-size:16px">{{ruleForm_.discountAmountFirst}}</span>
                  </el-form-item>
                </div>
              </li>
            </ul>
            <p>交易 2</p>
            <ul class="clearfix">
              <li class="fl" style="width:330px">
                <el-form-item label="交 易 日 2：" prop="tradingDaySecond" label-width="100px">
                  <el-date-picker
                    v-model="ruleForm_.tradingDaySecond"
                    align="right"
                    type="date"
                    placeholder="选择日期"
                    class="input210"
                    @change="handleTradingDay_Two"
                    value-format="yyyy-MM-dd"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="调整天数：" prop="adjustDay_" label-width="100px">
                  <el-input
                    v-model="ruleForm_.adjustDay_"
                    class="input210"
                    placeholder="节假日加天需自行调整"
                    @blur="handleAdjustDay(ruleForm_.adjustDay_,2)"
                  ></el-input>
                </el-form-item>
                <el-form-item label="利 率 2：" prop="interestRateSecond" label-width="100px">
                  <el-input
                    v-model="ruleForm_.interestRateSecond"
                    class="input210"
                    placeholder="请输入利率"
                    @blur="handleinterestRate(ruleForm_.interestRateSecond,2)"
                    suffix-icon="el-icon-zoom-out"
                  ></el-input>
                </el-form-item>
              </li>
              <li class="toolsCalculator_li">
                <div>
                  <el-form-item label="计息天数（天）：" prop="calculateDaySecond" class="li_item">
                    <span style="color:#5376FF;font-size:16px">{{ruleForm_.calculateDaySecond}}</span>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item label="贴现利息（元）：" prop="discountInterestSecond" class="li_item">
                    <span style="color:#5376FF;font-size:16px">{{ruleForm_.discountInterestSecond}}</span>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item label="贴现金额（元）：" prop="discountAmountSecond" class="li_item">
                    <span style="color:#5376FF;font-size:16px">{{ruleForm_.discountAmountSecond}}</span>
                  </el-form-item>
                </div>
              </li>
            </ul>
            <ul class="clearfix">
              <li class="fl" style="width:330px"></li>
              <li class="toolsCalculator_li">
                <div>
                  <el-form-item label="点差（BP）：" prop="BP" class="li_item">
                    <span style="color:#FA5555;font-size:16px">{{ruleForm_.BP}}</span>
                  </el-form-item>
                </div>
                <div>
                  <el-form-item label="交易差额（元）：" prop="tradeBalance" class="li_item">
                    <span style="color:#FA5555;font-size:16px">{{ruleForm_.tradeBalance}}</span>
                  </el-form-item>
                </div>
              </li>
            </ul>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer" style="text-align:center;">
          <el-button type="primary" @click="submitCalculater('ruleForm_')">关 闭</el-button>
          <el-button @click="handleReset('ruleForm_')">重 置</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { restLogout, userInfoDetail, userUpdatePassword } from "@/api/api";
import bus from "../common/bus";
import vTags from "./Tags.vue";

export default {
  data() {
    let validateOldPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.newPassword !== "") {
          this.$refs.ruleForm.validateField("newPassword");
        }
        callback();
      }
    };
    let validateNewPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else if (value === this.ruleForm.oldPassword) {
        callback(new Error("新旧密码不能相同哦"));
      } else {
        callback();
      }
    };
    let validateCheckPwd = (rule, value, callback) => {
      if (value === "") {
        callback("请再次输入密码");
      } else if (value !== this.ruleForm.newPassword) {
        callback(new Error("两次密码输入不一致"));
      } else if (value === this.ruleForm.userPassword) {
        callback(new Error("新密码不能与旧密码相同哦"));
      } else {
        callback();
      }
    };
    var check_ticketAmount = (rule, value, callback) => {
      var reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/;
      if (value == null || value == 0) {
        callback(new Error("请输入正确金额"));
        return;
      }
      if (reg.test(value)) {
        let value_ = parseFloat(value);
        if (value_ > 0.01 && value_ < 10000000000) {
          callback();
        } else {
          callback(new Error("请输入正确金额"));
        }
      } else {
        callback(new Error("请输入正确金额"));
      }
    };
    // 校验正整数
    var check_Num = (rule, value, callback) => {
      var reg = /^[0-9]*[1-9][0-9]*$/;
      if (value == null || value == 0) {
        callback();
        return;
      }
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确天数"));
      }
    };
    // 校验小数必填
    var check_float = (rule, value, callback) => {
      // 当计息方式是 元/每十万，范围：0.01-99999.99
      var reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确利率"));
      }
    };
    // 校验小数
    var check_float_not = (rule, value, callback) => {
      // 当计息方式是 元/每十万，范围：0.01-99999.99
      var reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/;
      if (value == null || value == 0) {
        callback();
        return;
      }
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确利率"));
      }
    };
    return {
      collapse: false,
      fullscreen: false,
      name: "linxin",
      message: 2,
      datas: {},
      dialogVisible_: false,
      dialogVisible: false,
      formLabelWidth: "34.84%",
      ruleForm: {
        oldPassword: "",
        newPassword: "",
        checkPassword: "",
        calculateDayFirst: "",
        discountInterestFirst: "",
        discountAmountFirst: "",
        calculateDaySecond: "",
        discountInterestSecond: "",
        discountAmountSecond: "",
        BP: "",
        tradeBalance: ""
      },
      ruleForm_: {},
      rules_: {
        parValue: [
          { required: true, validator: check_ticketAmount, trigger: "blur" }
        ],
        maturityDate: [
          { required: true, trigger: "blur", message: "请选择日期" }
        ],
        tradingDayFirst: [
          { required: true, trigger: "blur", message: "请选择日期" }
        ],
        tradingDaySecond: [{ trigger: "blur", message: "请选择日期" }],
        interestRateFirst: [
          {
            required: true,
            trigger: "blur",
            message: "请输入正确利率",
            validator: check_float
          }
        ],
        interestRateSecond: [
          {
            trigger: "blur",
            message: "请输入正确利率",
            validator: check_float_not
          }
        ],
        adjustDay: [{ trigger: "blur", validator: check_Num }],
        adjustDay_: [{ trigger: "blur", validator: check_Num }]
      },
      rules: {
        oldPassword: [{ validator: validateOldPwd, trigger: "blur" }],
        newPassword: [{ validator: validateNewPwd, trigger: "blur" }],
        checkPassword: [{ validator: validateCheckPwd, trigger: "blur" }]
      },
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      }
    };
  },
  components: {
    vTags
  },
  computed: {
    username() {
      let username = localStorage.getItem("ms_username");
      return username ? username : this.name;
    }
  },
  methods: {

    submitCalculater(formName) {
      this.resetForm(formName)
      this.dialogVisible_=false;
      this.ruleForm= {
        oldPassword: "",
        newPassword: "",
        checkPassword: "",
        calculateDayFirst: "",
        discountInterestFirst: "",
        discountAmountFirst: "",
        calculateDaySecond: "",
        discountInterestSecond: "",
        discountAmountSecond: "",
        BP: "",
        tradeBalance: ""
      }
      // this.$refs[formName].validate(valid => {
      //   if (valid) {
      //   } else {
      //     return false;
      //   }
      // });
    },
    handleReset(formName){
      this.resetForm(formName);
       this.ruleForm= {
        oldPassword: "",
        newPassword: "",
        checkPassword: "",
        calculateDayFirst: "",
        discountInterestFirst: "",
        discountAmountFirst: "",
        calculateDaySecond: "",
        discountInterestSecond: "",
        discountAmountSecond: "",
        BP: "",
        tradeBalance: ""
      }
    },
    // 调整天数
    handleAdjustDay(value, tab) {
      if (tab == 1) {
        this.changeDate(1);
      } else if (tab == 2) {
        this.changeDate(2);
      }
    },
    // 到  期  日
    handleMaturityDate(value) {
      if (value) {
        this.ruleForm_.maturityDate = value;
        if (this.ruleForm_.tradingDayFirst) {
          this.changeDate(1);
        } 
        if (this.ruleForm_.tradingDaySecond) {
          this.changeDate(2);
        }
      } else {
        this.$set(this.ruleForm_,'calculateDayFirst','')
        this.$set(this.ruleForm_,'discountInterestFirst','')
        this.$set(this.ruleForm_,'discountAmountFirst','')
        this.$set(this.ruleForm_,'calculateDaySecond','')
        this.$set(this.ruleForm_,'discountInterestSecond','')
        this.$set(this.ruleForm_,'discountAmountSecond','')
      }
    },
    // 交 易 日 1
    handleTradingDay_one(value) {
      if (value) {
        this.ruleForm_.tradingDayFirst = value;
        this.changeDate(1);
      } else {
        this.$set(this.ruleForm_,'calculateDayFirst','')
        this.$set(this.ruleForm_,'discountInterestFirst','')
        this.$set(this.ruleForm_,'discountAmountFirst','')
      }
    },
    // 交 易 日 2
    handleTradingDay_Two(value) {
      if (value) {
        this.ruleForm_.tradingDaySecond = value;
        this.changeDate(2);
      } else {
        this.$set(this.ruleForm_,'calculateDaySecond','')
        this.$set(this.ruleForm_,'discountInterestSecond','')
        this.$set(this.ruleForm_,'discountAmountSecond','')
      }
    },
    // 计息天数
    changeDate(value) {
      var reg = /^[0-9]*[1-9][0-9]*$/;
      let ruleForm_ = JSON.parse(JSON.stringify(this.ruleForm_));
      let adjustDay = ruleForm_.adjustDay;
      let adjustDay_ = ruleForm_.adjustDay_;
      let maturityDate = ruleForm_.maturityDate;
      let tradingDayFirst = ruleForm_.tradingDayFirst;
      let tradingDaySecond = ruleForm_.tradingDaySecond;
      if (reg.test(adjustDay)) {
      } else {
        adjustDay = 0;
      }
      if (reg.test(adjustDay_)) {
      } else {
        adjustDay_ = 0;
      }
      if (value == 1 && maturityDate && tradingDayFirst) {
        let day =
          Math.ceil(
            (new Date(maturityDate + "") - new Date(tradingDayFirst + "")) /
              (3600 * 1000 * 24)
          ) +
          (adjustDay - 0);
        if (day < 0) {
          day = 0;
        } else {
        }
        this.$set(this.ruleForm_, "calculateDayFirst", day);
        this.discountInterest(1);
      } else if (value == 2 && maturityDate && tradingDaySecond) {
        let day =
          Math.ceil(
            (new Date(maturityDate + "") - new Date(tradingDaySecond + "")) /
              (3600 * 1000 * 24)
          ) +
          (adjustDay_ - 0);
        if (day < 0) {
          day = 0;
        } else {
        }
        this.$set(this.ruleForm_, "calculateDaySecond", day);
        this.discountInterest(2);
      }
    },
    // 贴现利息
    // 贴现利息=票面金额*利率％*计息天数÷360
    // 贴现利息=票面金额*利率‰*12*计息天数÷360
    discountInterest(tab) {
      let parValue = this.ruleForm_.parValue;
      var reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/;
      if (tab == 1) {
        let interestRateFirst = this.ruleForm_.interestRateFirst;
        let calculateDayFirst = this.ruleForm_.calculateDayFirst;
        if (!calculateDayFirst) {
          calculateDayFirst = 0;
        }
        if (
          reg.test(parValue) &&
          (parseFloat(parValue) > 0.01 && parseFloat(parValue) < 10000000000) &&
          reg.test(interestRateFirst)
        ) {
          let discountInterestFirst =
            ((((parValue - 0) * (interestRateFirst - 0)) / 100) *
              (calculateDayFirst - 0)) /
            360;
          discountInterestFirst = parseFloat(discountInterestFirst).toFixed(2);
          this.$set(
            this.ruleForm_,
            "discountInterestFirst",
            discountInterestFirst
          );
          this.discountInteres(1);
        } else {
          return;
        }
      } else if (tab == 2) {
        let ruleForm_ = JSON.parse(JSON.stringify(this.ruleForm_));
        let interestRateSecond = ruleForm_.interestRateSecond;
        let calculateDaySecond = ruleForm_.calculateDaySecond;
        if (!calculateDaySecond) {
          calculateDaySecond = 0;
        }
        if (
          reg.test(parValue) &&
          (parseFloat(parValue) > 0.01 && parseFloat(parValue) < 10000000000) &&
          reg.test(interestRateSecond)
        ) {
          let discountInterestSecond =
            ((((parValue - 0) * (interestRateSecond - 0)) / 100) *
              (calculateDaySecond - 0)) /
            360;
          discountInterestSecond = parseFloat(discountInterestSecond).toFixed(
            2
          );
          this.$set(
            this.ruleForm_,
            "discountInterestSecond",
            discountInterestSecond
          );
          this.discountInteres(2);
        } else {
          return;
        }
      }
    },
    // 利率
    handleinterestRate(value, tab) {
      let interestRateFirst = this.ruleForm_.interestRateFirst;
      let interestRateSecond = this.ruleForm_.interestRateSecond;
      var reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/;
      if (reg.test(value)) {
        let val = value && parseFloat(value).toFixed(3);
        if (tab == 1) {
          this.ruleForm_.interestRateFirst = val;
          this.discountInterest(1);
          if (interestRateSecond) {
            this.$set(this.ruleForm_, "BP", ((interestRateSecond - val) * 100).toFixed(2));
          }
        } else if (tab == 2) {
          this.ruleForm_.interestRateSecond = val;
          this.discountInterest(2);
          if (interestRateFirst) {
            this.$set(this.ruleForm_, "BP", ((interestRateFirst - val) * 100).toFixed(2));
          }
        }
      } else {
        if (tab == 2) {
          // this.ruleForm_.discountInterestSecond = "";
          // this.ruleForm_.discountAmountSecond = "";
          // this.ruleForm_.BP = "";
          this.$set(this.ruleForm_, "discountInterestSecond", "");
          this.$set(this.ruleForm_, "discountAmountSecond", "");
          this.$set(this.ruleForm_, "BP", "");
        } else if (tab == 1) {
          return;
        }
      }


      // this.ruleForm_.interestRateFirst
    },
    // 贴现金额
    discountInteres(tab) {
      if (tab == 1) {
        let discountInterestFirst = this.ruleForm_.discountInterestFirst;
        if (discountInterestFirst == "" || discountInterestFirst == undefined) {
          return;
        }
        let discountAmountFirst =
          this.ruleForm_.parValue - discountInterestFirst;
        discountAmountFirst = parseFloat(discountAmountFirst).toFixed(2);
        this.$set(this.ruleForm_, "discountAmountFirst", discountAmountFirst);
        let discountAmountSecond = this.ruleForm_.discountAmountSecond;
        if (discountAmountSecond) {
          let tradeBalance = discountAmountFirst  - discountAmountSecond;
          this.$set(this.ruleForm_, "tradeBalance", (tradeBalance).toFixed(2));
        }
      } else if (tab == 2) {
        let discountInterestSecond = this.ruleForm_.discountInterestSecond;
        if (
          discountInterestSecond == "" ||
          discountInterestSecond == undefined
        ) {
          return;
        }
        let discountAmountSecond =
          this.ruleForm_.parValue - discountInterestSecond;
        discountAmountSecond = parseFloat(discountAmountSecond).toFixed(2);
        this.$set(this.ruleForm_, "discountAmountSecond", discountAmountSecond);
        let discountAmountFirst = this.ruleForm_.discountAmountFirst;
        if (discountAmountFirst) {
          let tradeBalance = discountAmountFirst  - discountAmountSecond;
          this.$set(this.ruleForm_, "tradeBalance", (tradeBalance).toFixed(2));
        }
      }
    },
    // 票面金额
    handleticketAmount(value) {
      var reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/;
      if (value == null || value == 0) {
        return;
      }
      if (reg.test(value)) {
        let parValue = value && parseFloat(value).toFixed(2);
        this.ruleForm_.parValue = parValue;
        this.discountInterest(1);
        this.discountInterest(2);
        this.discountInteres(1);
        this.discountInteres(2);
        // this.handleChangeTicket()
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    saveChangedPwd(forName) {
      let that = this;
      this.$refs[forName].validate(valid => {
        if (valid) {
          userUpdatePassword({
            userPassword: that.ruleForm.oldPassword,
            passwordOne: that.ruleForm.newPassword,
            passwordTwo: that.ruleForm.checkPassword
          }).then(res => {
            if (res.data && res.data.CODE == 200) {
              that.dialogVisible = false;
              this.$refs["ruleForm"].resetFields();
              that.$router.push("/warehousingApplication");
              this.$message({
                message: "恭喜您，密码修改成功",
                type: "success"
              });
            } else {
              this.$refs["ruleForm"].resetFields();
              this.$message({
                message: res.data.MESSAGE,
                type: "error"
              });
            }
          });
        } else {
          return false;
        }
      });
    },

    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == "loginout") {
        localStorage.removeItem("ms_username");
        localStorage.removeItem("status_");
        restLogout({}).then(res => {
          this.$router.push("/login");
        });
      } else if (command == "personalCenter") {
        this.$router.push("/personalCenter");
      } else if (command == "changePassword") {
        // 打开模态框
        this.openPwdDialog();

      } else if(command== "calculator"){
        this.dialogVisible_=true
      }else if(command=="calendar"){
        this.$router.push("/calendar");
      }
    },
    // 打开修改密码模态框
    openPwdDialog() {
      this.dialogVisible = true;
    },
    // 侧边栏折叠
    // collapseChage() {
    //   this.collapse = !this.collapse;
    //   bus.$emit("collapse", this.collapse);
    // },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    }
  },
  wathch: {},
  mounted() {
    // if (document.body.clientWidth < 1500) {
    //   this.collapseChage();
    // }
    bus.$on("collapse", msg=>{
      this.collapse=msg;
    });
  },

  created() {
    userInfoDetail({}).then(res => {
      if (res && res.data && res.data.CODE == 200) {
        this.datas = res.data.RESULT;
      } else {
      }
    });
  }
};
</script>
<style scoped lang="less" rel="stylesheet/less">
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 200px;
}
/deep/ .sidebar-el-menu{
  .el-menu-item{
    padding-left: 10px !important;
  }
}
.el-menu{
  background:transparent;
}
  .btn-tool{
    width: 36px;
    height: 36px;
    border-radius: 25px;
    background: #e8eaeb;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  /*change passworddialog css */
  #changePwd{
    /deep/.pwdDialog .el-dialog{
      margin-left: 27.71% !important;

      & .el-dialog__body{
        & .el-form{

          .letter-space{
            letter-spacing: 3px;
          }
          .pwd-label{
            font-family:PingFangSC-Medium;
            font-weight:500;
            color:rgba(89,102,137,1);
            line-height:16px;

          }
          & .el-form-item__content{
            width:100%;
            & .pwdInput{
              width:42.9%;
              height:32px;

            }
          }

        }
      }
      & .dialog-footer{
        text-align: center;
        button {
          width: 95px;
          height: 40px;
          &:nth-child(1){
            background: rgba(83, 118, 255, 1);
          }
        }
      }
    }

  }
.toolsCalculator_con .input210 {
  width: 210px;
}
.toolsCalculator_li .li_item {
  height: 33.64px;
  margin-left: 330px;
}

.toolsCalculator_con .el-form-item__label {
  color: #596689;
}
.toolsCalculator_con p {
  font-weight: 600;
  color: rgba(83, 118, 255, 1);
  border-left: 2px solid #5376ff;
  line-height: 14px;
  padding-left: 8px;
  margin-bottom: 12px;
}
.toolsCalculator_con {
  padding-left: 21px;
  padding-right: 21px;
}
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  /* color: #fff; */
}
.collapse-btn {
    float: left;
    padding-top:15px;
    text-align:center;
}
.collapse-btn_first{
    padding-top: 21px;
    padding-left: 48px;
    padding-right: 47px;
    width:200px;
    // transition: width 0.2s linear;
}
.collapse-btn_second{
  padding: 21px 9px 0;
    // width:64px;
  transition: padding 0.35s linear;
    // transition: width 0.2s linear;
}
.collapse-btn_first img {
  width: 105px;
  height: 43px;
  /* width: 22px;
  height: 22px; */
  vertical-align: middle;
}
.header .logo {
  float: left;
  width: 136px;
  line-height: 70px;
  color: #434967;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  /* color: #fff; */
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}

</style>
