<template>
  <div class="inventoryWarehouse">
    <el-form :model="billInStockFlow" :rules="rules" ref="billInStockFlow" label-width="110px">
      <header class="clearfix">
        <div class="fl">
          <el-form-item label="出库类型：" prop="outStockType">
            <el-select v-model="billInStockFlow.outStockType" placeholder="请选择" class="width_120">
              <el-option
                v-for="item in [{label:'背书',value:'33001'},{label:'贴现',value:'33002'}]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="打款方式：" prop="payType">
            <el-select
              v-model="billInStockFlow.payType"
              placeholder="请选择"
              class="width_120"
              :disabled="billInStockFlow.outStockType=='33002'"
            >
              <el-option
                v-for="item in [{label:'先背',value:'40001'},{label:'先打',value:'40002'}]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账号：" prop="accountNo">
            <el-input v-model="billInStockFlow.accountNo" class="width_280"></el-input>
          </el-form-item>
        </div>
        <div class="fl">
          <el-form-item label="出库渠道：" prop="outChannelType">
            <el-select
              v-model="billInStockFlow.outChannelType"
              placeholder="请选择"
              class="width_120"
              @change="changeoutChannelType"
            >
              <el-option
                v-for="item in [{label:'通道',value:'31001'},{label:'单边行',value:'31002'},{label:'企业',value:'31003'}]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="对手名称：" prop="opponentCompany">
            <el-input
              v-model="billInStockFlow.opponentCompany"
              class="width_280"
              placeholder="请输入对手名称"
              maxlength="50"
              @blur="opponentName(billInStockFlow.opponentCompany)"
            ></el-input>
          </el-form-item>
          <el-form-item label="大额行号：" prop="bigLineNo">
            <el-input v-model="billInStockFlow.bigLineNo" class="width_280"></el-input>
          </el-form-item>
        </div>
        <div class="fl">
          <el-form-item label="对手类型：" prop="opponentType">
            <el-select
              v-model="billInStockFlow.opponentType"
              placeholder="请选择"
              class="width_120"
              @change="handleOpponentType"
            >
              <el-option
                v-for="item in [{label:'企业',value:'32001'},{label:'银行',value:'32002'}]"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开户行：" prop="openAccountBank">
            <el-input
              v-model.number="billInStockFlow.openAccountBank"
              placeholder="请输入开户行"
              style="width:300px;"
              :disabled="opponentType"
            ></el-input>
          </el-form-item>
          <div class="clearfix" style="min-width:450px">
            <el-form-item label="联系人：" prop="contactPerson" class="fl">
              <el-input v-model="billInStockFlow.contactPerson" class="input88" placeholder="联系人"></el-input>
            </el-form-item>
            <el-form-item label prop="contactPhone" class="fl library">
              <el-input
                v-model="billInStockFlow.contactPhone"
                placeholder="联系电话"
                maxlength="11"
                style="width:112px;margin-right:8px"
              ></el-input>
            </el-form-item>
            <el-form-item label prop="postName" class="fl library">
              <el-input
                v-model="billInStockFlow.postName"
                class="input108"
                style="margin-right:0px;width:85px"
                placeholder="职务"
              ></el-input>
            </el-form-item>
          </div>
        </div>
      </header>
      <header class="clearfix">
        <ul class="libraryUl">
          <li>
            <el-form-item label="归属人：" prop="belongNickName">
              <el-input
                v-model="billInStockFlow.belongNickName"
                class="width_280"
                placeholder="请输入姓名"
              ></el-input>
            </el-form-item>
          </li>
          <li style="min-width:390px;">
            <el-form-item label="申请人：" prop="applyUserName">
              <el-input
                v-model="billInStockFlow.applyUserName"
                class="input106"
                @blur="handleSearch(billInStockFlow.applyUserName)"
              ></el-input>
              <el-input v-model="billInStockFlow.applyDeptName" style="width:166px" disabled></el-input>
            </el-form-item>
          </li>
          <li v-for="(item,index) in applicantList" class="applyUser_">
            <el-form-item label="申请人：" prop="applyUserName_">
              <el-input
                v-model="item.applyUserName"
                class="input106"
                @blur="handleSearch(item.applyUserName,index+1)"
              ></el-input>
              <el-input v-model="item.applyDeptName" style="width:166px" disabled></el-input>
              <span class="el-icon-circle-close span" @click="handleDelUserName(index)"></span>
            </el-form-item>
          </li>
          <li>
            <p class="add_apply">
              <span @click="handleAddApply">+ 新增申请人</span>
            </p>
          </li>
        </ul>
      </header>
      <header class="clearfix">
        <div class="fl">
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="billInStockFlow.remark" class="width_280" placeholder="请输入备注"></el-input>
          </el-form-item>
        </div>
      </header>
      <nav class="info">
        <div class="infoHead clearfix">
          <div class="fl">
            票据信息
            <i></i>
          </div>
          <!-- <div class="fr">
            <i class="el-icon-lx-piliangshangchuan"></i> 批量上传
          </div> -->
        </div>
      </nav>
      <div class="section">
        <el-table
          :data="master_user.data"
          style="width: 100%"
          highlight-current-row
          header-row-class-name="headClass"
        >
          <!-- <el-table-column type="index"></el-table-column> -->
          <el-table-column
            size="medium"
            v-for="(v,i) in master_user.columns"
            :prop="v.field"
            :label="v.title"
            :width="v.width"
            align="center"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.isSet">
                <el-select
                  v-model="master_user.sel[v.field]"
                  placeholder="请选择类型"
                  v-if="v.field && v.field=='outCalInterestType'"
                >
                  <el-option
                    v-for="item in [{label:'年息%',value:'年息%'},{label:'元/每十万',value:'元/每十万'}]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-input
                  size="mini"
                  placeholder="请输入内容"
                  v-model="master_user.sel[v.field]"
                  v-else-if="v.field && v.field=='outStockPrice'"
                ></el-input>
                <el-input
                  size="mini"
                  placeholder="请输入内容"
                  v-model="master_user.sel[v.field]"
                  v-else-if="v.field && v.field=='outEleRemitCost'"
                ></el-input>
                <span v-else>
                  <span
                    v-if="v.field && v.field=='ticketType'"
                  >{{scope.row[v.field]=='12001' ? '银票':'商票'}}</span>
                  <span v-else>{{scope.row[v.field]}}</span>
                </span>
              </div>
              <div v-else>
                <span
                  v-if="v.field && v.field=='ticketType'"
                >{{scope.row[v.field]=='12001' ? '银票':'商票'}}</span>
                <span v-else>{{scope.row[v.field]}}</span>
              </div>
              <!-- </div> -->
            </template>
          </el-table-column>
          <el-table-column
            width="60"
            fixed="right"
            v-if="master_user.data.length >0 && !warehouseStatus"
          >
            <template slot-scope="scope">
              <span
                :class="scope.row.isSet?'el-icon-circle-check':'el-icon-lx-anniubianji'"
                :style="scope.row.isSet? 'cursor: pointer;margin-right:12px;color:#5376ff':'cursor: pointer;margin-right:12px'"
                @click="pwdChange(scope.row,scope.$index,true)"
              ></span>
              <span
                v-if="!scope.row.isSet"
                class="el-icon-delete"
                style="cursor: pointer;"
                @click="handle_delete(scope.row,scope.$index,true)"
              ></span>
              <span
                v-else
                class="el-icon-circle-close"
                style="cursor: pointer;color:#5376ff"
                @click="pwdChange(scope.row,scope.$index,false)"
              ></span>
            </template>
          </el-table-column>
        </el-table>
        <div class="total">
          <div class="top">
            <i class="el-icon-lx-heji"></i>
            <span style="margin-left:7px">合计</span>
          </div>
          <div class="clearfix">
            <li>
              <div class="txt">票面金额</div>
              <div class="num">{{billInStockFlow.ticketAmountTotal}}</div>
            </li>
            <li>
              <div class="txt">入库放款</div>
              <div class="num">{{billInStockFlow.inPayMoneyTotal}}</div>
            </li>
            <li>
              <div class="txt">入库利息</div>
              <div class="num">{{billInStockFlow.inInterestTotal}}</div>
            </li>
            <li>
              <div class="txt">出库收款</div>
              <div class="num">{{billInStockFlow.outReceiveMoneyTotal}}</div>
            </li>
            <li>
              <div class="txt">出库利息</div>
              <div class="num">{{billInStockFlow.outInterestTotal}}</div>
            </li>
          </div>
        </div>
        <div class="newBtn">
          <el-button @click="submitForm('billInStockFlow')">确认出库</el-button>
          <el-button @click="toLink">取消</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
import {
  getCurrentUser,
  saveInStockBusinessNo,
  listSelected,
  getDaysUrl,
  authUser_findList,
  billOutStockFlow_save
} from "@/api/api";
export default {
  name: "inventoryWarehouse",
  data() {
    var check_maxAccountNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入正确账号"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入正确账号"));
        } else {
          callback();
        }
      }, 1000);
    };
    var check_tenantName = (rule, value, callback) => {
      var reg = /^[\u2E80-\u9FFF]+$/; //Unicode编码中的汉字范围
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入中文"));
      }
    };
    return {
      opponentType: false, //对手控制银行状态
      warehouseStatus: true,
      applicantList: [],
      applicant_temp: {},
      billInStockFlow: {
        accountNo: "",
        applyDeptId: "",
        applyDeptName: "",
        applyUserId: "",
        applyUserName: "",
        belongNickName: "",
        contactPerson: "",
        contactPhone: "",
        departmentId: "",
        event: "pass",
        flowType: "",
        inInterestTotal: "",
        inPayMoneyTotal: "",
        openAccountBank: "",
        opponentCompany: "",
        opponentType: "32001",
        outChannelType: "31001",
        outInterestTotal: "",
        outReceiveMoneyTotal: "",
        outStockType: "33001",
        payType: "40001",
        postName: "",
        remark: "",
        ticketAmountTotal: ""
      },
      master_user: {
        sel: null, //选中行
        columns: [
          { field: "ticketNo", title: "票号", width: 230 },
          { field: "ticketType", title: "票据类型", width: 100 },
          { field: "ticketAmount", title: "票面金额", width: 100 },
          { field: "stockPrice", title: "入库价格", width: 100 },
          { field: "calInterestType", title: "计息方式", width: 130 },
          { field: "inDayNum", title: "入库剩余天数", width: 120 },
          { field: "stockInterest", title: "入库利息", width: 100 },
          { field: "payMoney", title: "入库放款", width: 100 },
          { field: "outStockPrice", title: "出库价格", width: 120 },
          { field: "outCalInterestType", title: "计息方式", width: 130 },
          { field: "outDayNum", title: "出库剩余天数", width: 120 },
          { field: "outStockInterest", title: "出库利息", width: 100 },
          { field: "receiveMoney", title: "出库收款", width: 120 },
          { field: "outEleRemitCost", title: "电汇费", width: 100 },
          { field: "holderTicketDays", title: "持票天数", width: 100 },
          { field: "holderCost", title: "持票成本", width: 100 },
          { field: "earn", title: "收益", width: 120 }
          // { field: "accepter", title: "承兑人", width: 100 },
          // { field: "accepterAccountNo", title: "承兑人账号", width: 100 },
          // { field: "accepterBank", title: "承兑人开户行", width: 120 },
          // { field: "accepterBankNo", title: "承兑人开户行行号", width: 140 },
          // { field: "draftDate", title: "出票日", width: 140 },
          // { field: "expireDate", title: "到期日", width: 140 },
          // { field: "plusDay", title: "加天", width: 100 },
          // { field: "canTransfer", title: "是否可转让", width: 120 },
        ],
        data: []
      },
      rules: {
        receiveCompany: [
          {
            validator: check_tenantName,
            trigger: "blur",
            required: true,
            message: "请输入正确企业名称"
          }
        ], //收款企业
        contactPhone: [
          {
            required: true,
            validator: this.checkData.check_mobile,
            trigger: "blur"
          }
        ],
        openAccountBank: [
          {
            required: true,
            validator: this.checkData.check_chinese,
            message: "请输入开户行"
          }
        ], //开户行
        contactPerson: [
          {
            required: true,
            validator: this.checkData.check_chinese,
            message: "请输入联系人"
          }
        ], //联系人
        bigLineNo: [
          {
            required: true,
            validator: this.checkData.check_zero_digit,
            message: "请输入行号"
          }
        ], //大额行号
        // accountNo: [{ required: true, message: "请输入账号" }], //账号
        accountNo: [
          {
            required: true,
            validator: this.checkData.check_zero_digit,
            trigger: "blur"
          }
        ], //账号
        ticketNo: [{ required: true, message: "请输入票号" }], //票号
        opponentCompany: [
          {
            required: true,
            validator: this.checkData.check_chinese,
            message: "请输入对手名称"
          }
        ], //对手名称
        postName: [
          { validator: this.checkData.check_chinese, message: "请输入职务" }
        ]
      }
    };
  },
  methods: {
    changeoutChannelType(value) {
      if (value == "31002") {
        this.billInStockFlow.opponentType = "32002";
        this.opponentType = true;
      } else {
      }
    },
    handleDelUserName(value) {
      let applicantList = this.applicantList;
      applicantList.splice(value, 1);
    },
    toLink() {
      this.$router.push("/inventoryManagement");
    },
    // 对手类型
    handleOpponentType(value) {
      if (value == "32002") {
        this.opponentType = true;
      } else {
        this.opponentType = false;
      }
    },
    // 对手名称
    opponentName(value) {
      var reg = /^[\u2E80-\u9FFF]+$/;
      let billInStockFlow = JSON.parse(JSON.stringify(this.billInStockFlow));
      if (reg.test(value)) {
        if (billInStockFlow.opponentType == 32002) {
          billInStockFlow.openAccountBank = value;
          this.billInStockFlow = billInStockFlow;
        }
      } else {
      }
    },
    handleAddApply() {
      let applicantList = this.applicantList;
      if (applicantList.length >= 2) {
        this.$message({
          message: "最多3个申请人！",
          type: "warning"
        });
        return;
      }
      let obj = {
        applyUserId: "",
        applyDeptId: "",
        applyDeptName: "",
        applyUserName: ""
      };
      this.applicantList.push(obj);
    },
    // 申请人搜索
    handleSearch(item, value) {
      if (item) {
        this.authUser_findList(
          {
            nickname: item,
            userStatus: 9000
          },
          value
        );
      }
    },
    // 申请人查询api
    authUser_findList(param, inx) {
      authUser_findList(param, inx).then(res => {
        if (res && res.data && res.data.CODE == "200") {
          let billInStockFlow = this.billInStockFlow;
          let applicant_temp = this.applicant_temp;
          let applicantList = JSON.parse(JSON.stringify(this.applicantList));
          if (res.data.RESULT.length == 0) {
            if (!inx) {
              billInStockFlow.applyUserName = "";
              billInStockFlow.applyDeptName = "";
              applicant_temp = {
                applyUserId: "",
                applyDeptId: "",
                applyDeptName: "",
                applyUserName: ""
              };
            } else {
              applicantList &&
                applicantList.map(function(v, i) {
                  if (inx - 1 == i) {
                    applicantList[i] = {
                      applyUserId: "",
                      applyDeptId: "",
                      applyDeptName: "",
                      applyUserName: ""
                    };
                  }
                });
              this.applicantList = applicantList;
            }
          } else {
            let datas = res.data.RESULT[0];
            if (inx) {
              applicantList &&
                applicantList.map(function(v, i) {
                  if (inx - 1 == i) {
                    applicantList[i] = {
                      applyUserId: datas.id,
                      applyDeptId: datas.departmentId,
                      applyDeptName: datas.departmentName,
                      applyUserName: datas.nickname
                    };
                  }
                });
              this.applicantList = applicantList;
            } else {
              applicant_temp = {
                applyUserId: datas.id,
                applyDeptId: datas.departmentId,
                applyDeptName: datas.departmentName,
                applyUserName: datas.nickname
              };
              this.applicant_temp = applicant_temp;
              billInStockFlow.applyDeptName = datas.departmentName;
            }
          }
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let billInStockFlow = this.billInStockFlow;
          billInStockFlow.event = "pass";
          billInStockFlow.flowType = 30003;
          let ticketData = JSON.parse(JSON.stringify(this.master_user.data));
          ticketData &&
            ticketData.map(function(v, i) {
              if (v.calInterestType == "年息%") {
                v.calInterestType = 13001;
              } else {
                v.calInterestType = 13002;
              }
              if (v.outCalInterestType == "年息%") {
                v.outCalInterestType = 13001;
              } else {
                v.outCalInterestType = 13002;
              }
            });
          billInStockFlow.ticketList = ticketData;
          let applicant_temp = this.applicant_temp;
          let applicantList = this.applicantList;
          for (var i = applicantList.length - 1; i >= 0; i--) {
            if (!applicantList[i].applyUserId) {
              applicantList.splice(i, 1);
            }
          }
          let temObj = JSON.parse(JSON.stringify(applicantList));
          if (temObj.indexOf(applicant_temp) == -1) {
            temObj.unshift(applicant_temp);
          }
          billInStockFlow = Object.assign(billInStockFlow, applicant_temp, {
            applicantList: temObj
          });
          billOutStockFlow_save(billInStockFlow).then(res => {
            if (res && res.data && res.data.CODE == "200") {
              this.$message({
                message: res && res.data && res.data.MESSAGE,
                type: "success"
              });
              this.$router.push("/outgoingApplication");
            } else {
              this.$message.error(res && res.data && res.data.MESSAGE);
            }
          });
          // this.tenantAdd();
        } else {
          return false;
        }
      });
    },
    // 28.新增入库
    saveInStockBusinessNo() {
      // saveInStockBusinessNo(param).then(res=>{
      //   debugger
      // })
    },
    //读取表格数据
    readMasterUser() {
      //根据实际情况，自己改下啊
      this.master_user.data.map(i => {
        // i.ticketNo = generateId.get(); //模拟后台插入成功后有了id
        i.isSet = false; //给后台返回数据添加`isSet`标识
        return i;
      });
    },

    //修改
    pwdChange(row, index, cg) {
      //点击修改 判断是否已经保存所有操作
      for (let i of this.master_user.data) {
        if (i.isSet && i.ticketNo != row.ticketNo) {
          this.$message.warning("请先保存当前编辑项");
          return false;
        }
      }
      //是否是取消操作
      if (!cg) {
        if (!this.master_user.sel.ticketNo)
          this.master_user.data.splice(index, 1);
        return (row.isSet = !row.isSet);
      }
      //提交数据
      if (row.isSet) {
        //项目是模拟请求操作  自己修改下
        let data = JSON.parse(JSON.stringify(this.master_user.sel));
        if (data["outStockPrice"]) {
          if (!data["outCalInterestType"]) {
            this.$message.warning("请选择计息方式");
            return false;
          }
        }
        if (data["outCalInterestType"]) {
          if (!data["outStockPrice"]) {
            this.$message.warning("请输入出库价格");
            return false;
          }
        }

        if (data["outCalInterestType"] == "元/每十万") {
          data.outStockInterest = 0;
          data.outStockInterest =
            (
              ((data.ticketAmount - 0) / 100000) *
              (data.outStockPrice - 0)
            ).toFixed(2) - 0;
        } else {
          data.outStockInterest = 0;
          data.outStockInterest =
            (
              ((data.ticketAmount - 0) *
                (data.outStockPrice - 0) *
                (data.outDayNum - 0)) /
              36000
            ).toFixed(2) - 0;
        }
        if (data.outStockInterest) {
          data.receiveMoney = 0;
          data.receiveMoney =
            (data.ticketAmount - data.outStockInterest).toFixed(2) - 0;
        }
        data.holderCost =
          (
            ((data.ticketAmount - 0) * (data.holderTicketDays - 0) * 6) /
            36000
          ).toFixed(2) - 0;
        // 收款-放款-成本
        // data.earn = (data.outStockPrice - data.stockPrice).toFixed(2)-0;
        let outReceiveMoneyTotal = 0;
        let outInterestTotal = 0;
        let datas = this.master_user.data;
        let billInStockFlow = JSON.parse(JSON.stringify(this.billInStockFlow));
        datas &&
          datas.map(function(v, i) {
            if (row.ticketNo == v.ticketNo) {
              v.receiveMoney =
                data.receiveMoney && data.receiveMoney.toFixed(2) - 0;
              v.outStockInterest =
                data.outStockInterest && data.outStockInterest.toFixed(2) - 0;
            }
            outReceiveMoneyTotal += v.receiveMoney - 0;
            outInterestTotal += v.outStockInterest - 0;
          });
        this.billInStockFlow = Object.assign(billInStockFlow, {
          outReceiveMoneyTotal,
          outInterestTotal
        });
        for (let k in data) {
          row[k] = data[k];
        }

        //然后这边重新读取表格数据
        // this.readMasterUser();
        row.isSet = false;
      } else {
        this.master_user.sel = JSON.parse(JSON.stringify(row));
        row.isSet = true;
      }
    },
    // 删除
    handle_delete(row, index, cg) {
      let datas = this.master_user.data;
      datas &&
        datas.map(function(v, i) {
          if (v.ticketNo == row.ticketNo) {
            datas.splice(index, 1);
          }
        });
    },
    listSelected(param) {
      listSelected(param).then(res => {
        if (res && res.data && res.data.CODE == "200") {
          let datas = res.data.RESULT;
          let ticketAmountTotal = 0;
          let inPayMoneyTotal = 0;
          let inInterestTotal = 0;
          let outReceiveMoneyTotal = 0;
          let outInterestTotal = 0;

          datas &&
            datas.map(function(v, i) {
              v.outDayNum;
              ticketAmountTotal += v.ticketAmount - 0;
              inPayMoneyTotal += v.payMoney - 0;
              inInterestTotal += v.stockInterest - 0;
              outReceiveMoneyTotal += v.receiveMoney - 0;
              outInterestTotal += v.outStockInterest - 0;
              v.isSet = false;
              if (v.calInterestType == "13001") {
                v.calInterestType = "年息%";
              } else {
                v.calInterestType = "元/每十万";
              }
            });
          let billInStockFlow = JSON.parse(
            JSON.stringify(this.billInStockFlow)
          );
          ticketAmountTotal=(ticketAmountTotal).toFixed(2);
          inPayMoneyTotal=(inPayMoneyTotal).toFixed(2);
          inInterestTotal=(inInterestTotal).toFixed(2);
          outReceiveMoneyTotal=(outReceiveMoneyTotal).toFixed(2);
          outInterestTotal=(outInterestTotal).toFixed(2);
          this.billInStockFlow = Object.assign(billInStockFlow, {
            ticketAmountTotal,
            inPayMoneyTotal,
            inInterestTotal,
            outReceiveMoneyTotal,
            outInterestTotal,
            ticketType: datas[0].ticketType,
            mediaType: datas[0].mediaType,
            auditStatus: 0
          });
          this.master_user.data = datas;
        } else {
          this.$message.error(res && res.data && res.data.MESSAGE);
        }
      });
    }
  },

  created() {
    let inventoryWarehouse = JSON.parse(
      sessionStorage.getItem("inventoryWarehouse")
    );
    let billInStockFlow = this.billInStockFlow;
    let ticketList = inventoryWarehouse && inventoryWarehouse.ticketList;
    let inPayMoneyTotal = 0;
    let inInterestTotal = 0;
    ticketList &&
      ticketList.map(function(v, i) {
        v.stockPrice = v.outStockPrice;
        v.calInterestType = v.outCalInterestType;
        v.inDayNum = v.outDayNum;
        if (v.receiveMoney) {
          v.payMoney = v.receiveMoney;
          inPayMoneyTotal += v.receiveMoney - 0;
        }
        if (v.outStockInterest) {
          v.stockInterest = v.outStockInterest;
          inInterestTotal += v.outStockInterest - 0;
        }
        // v.earn = (v.outStockPrice - v.stockPrice).toFixed(2);
      });
    this.billInStockFlow = Object.assign(billInStockFlow, {
      ticketAmountTotal: (inventoryWarehouse.ticketAmountTotal-0).toFixed(2),
      inPayMoneyTotal: (inPayMoneyTotal-0).toFixed(2),
      inInterestTotal: (inInterestTotal-0).toFixed(2),
      outReceiveMoneyTotal: (inventoryWarehouse.outReceiveMoneyTotal-0).toFixed(2),
      outInterestTotal: (inventoryWarehouse.outInterestTotal-0).toFixed(2),
      moveFlowId: inventoryWarehouse.moveFlowId,
      ticketType: ticketList[0].ticketType,
      mediaType: ticketList[0].mediaType,
      auditStatus: 0
    });
    ticketList &&
      ticketList.map(function(v, i) {
        if (v.calInterestType == 13001) {
          v.calInterestType = "年息%";
        } else {
          v.calInterestType = "元/每十万";
        }
        if (v.outCalInterestType == 13001) {
          v.outCalInterestType = "年息%";
        } else {
          v.outCalInterestType = "元/每十万";
        }
        v.holderTicketDays=0;
         v.holderCost =
          (
            ((v.ticketAmount - 0) * (v.holderTicketDays - 0) * 6) /
            36000
          ).toFixed(2) - 0;
        v.earn = (v.outStockPrice - v.stockPrice).toFixed(2);
      });
    this.master_user.data = ticketList;
    // if(this.$route.query.id){
    //   this.listSelected({ ticketIds: this.$route.query.id });
    // }
  }
};
</script>

<style scoped>
.libraryUl li {
  float: left;
}
.libraryUl li:nth-child(3n + 1) {
  width: 33%;
}

.libraryUl li:nth-child(3n + 2) {
  width: 33%;
}
.libraryUl li:nth-child(3n + 3) {
  width: 34%;
}
.libraryUl li.applyUser_ {
  position: relative;
  min-width: 392px;
}
.libraryUl li.applyUser_ .span {
  position: absolute;
  left: 290px;
  top: 10px;
  color: #a3adc8;
  cursor: pointer;
}
.width_120 {
  width: 120px;
}
.width_280 {
  width: 280px;
}
.add_apply {
  color: #5376ff;
  line-height: 32px;
  padding: 0 32px;
  cursor: pointer;
  margin-bottom: 18px;
}
.inventoryWarehouse {
  padding: 16px 32px;
}
.inventoryWarehouse header > div {
  width: 33%;
}
.inventoryWarehouse header > div:last-child {
  width: 34%;
}
.inventoryWarehouse header div > label {
  display: block;
  margin-bottom: 24px;
}
.inventoryWarehouse header div > label > span {
  margin-right: 10px;
  font-weight: 600;
}
.inventoryWarehouse .infoHead {
  border-bottom: 2px solid #e6e9f0;
}
.inventoryWarehouse .infoHead div {
  padding-bottom: 8px;
}
.inventoryWarehouse .infoHead .fl {
  padding-left: 12px;
  position: relative;
  color: #5376ff;
}
.inventoryWarehouse .infoHead .fl i {
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 80px;
  height: 3px;
  background: #5376ff;
}
.inventoryWarehouse .info {
  margin-bottom: 25px;
}
.inventoryWarehouse .section .headClass {
  color: #a3adc8;
}
.inventoryWarehouse .section .addRow {
  margin-top: 25px;
  color: #5376ff;
  display: inline-block;
  cursor: pointer;
}
.inventoryWarehouse .section .addRow i {
  margin-right: 8px;
}
.inventoryWarehouse .section .total {
  margin-top: 27px;
}
.inventoryWarehouse .section .total .top {
  margin-bottom: 16px;
  color: #596689;
}
.inventoryWarehouse .section .total li {
  padding: 16px 16px 0 16px;
  text-align: center;
  margin-right: 24px;
  float: left;
  width: 176px;
  height: 78px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
  border-radius: 4px;
}
.inventoryWarehouse .section .total li .txt {
  line-height: 26px;
  font-size: 12px;
  color: rgba(163, 173, 200, 1);
}
.inventoryWarehouse .section .total li .num {
  line-height: 26px;
  font-size: 18px;
  font-weight: 600;
  color: rgba(50, 62, 97, 1);
}
.newBtn {
  margin-top: 40px;
}
.newBtn button {
  width: 95px;
  height: 40px;
  background: rgba(83, 118, 255, 1);
  border-radius: 4px;
  color: #fff;
}

.newBtn button:nth-child(2) {
  color: #323e61;
  background: none;
}
.input280.el-input {
  width: 280px;
}
.input348.el-input {
  width: 348px;
}
.input170.el-input {
  width: 170px;
  margin-right: 8px;
}
.input106.el-input {
  width: 106px;
  margin-right: 8px;
}
.input108.el-input {
  width: 108px;
  margin-right: 8px;
}
.input88.el-input {
  width: 88px;
  margin-right: 8px;
}
</style>
