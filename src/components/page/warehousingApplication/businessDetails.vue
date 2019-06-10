<template>
  <div class="businessDetails">
    <div class="top_">
      <p>
        <span>业务单号：{{datas.businessNo}}</span>
        <i>{{datas.auditStatus_}}</i>
        <em>{{datas.payTypeName}}</em>
      </p>
      <div class="fr">
        <!-- {{datas.auditStatus__ =='已拒绝' ? '编辑':(datas.auditStatus__=='成功入库' ? '出库':datas.auditStatus__)}} -->
        <button
          @click="handleLink()"
          v-if="datas.auditStatus == 20000 && (datas.jobType==1103 || datas.jobType==1100)"
        >
          <i class="el-icon-lx-anniubianji"></i>
           编辑
        </button>
        <button @click="handleLink()" v-if="datas.auditStatus == 20001 && datas.jobType==1100">
          <i class="el-icon-lx-fuhe"></i>
          复核
        </button>
        <button @click="handleLink()" v-if="datas.auditStatus == 20002 && datas.jobType==1101">
          <i class="el-icon-lx-shenpi"></i>
          审批
        </button>
        <button @click="handleLink()" v-if="datas.auditStatus == 20003 && datas.jobType==1102">
          <i class="el-icon-lx-zhongshen"></i>
          终审
        </button>
        <button @click="handleLink()" v-if="datas.auditStatus == 20004">
          <i class="el-icon-lx-chuku"></i>
          出库
        </button>

        <button style="display:none">
          <i class="el-icon-lx-2"></i>导出清单
        </button>
      </div>
    </div>
    <header class="clearfix">
      <ul class="fl">
        <li>
          <span>票据类型：</span>
          <i>{{datas.ticketTypeName}}</i>
        </li>
        <li>
          <span>票据介质：</span>
          <i>{{datas.mediaTypeName}}</i>
        </li>
        <li>
          <span>入库方式：</span>
          <i>{{datas.inStockTypeName}}</i>
        </li>
      </ul>
      <ul class="fl">
        <li>
          <div class="fl">
            <span>收款企业：</span>
            <i>{{datas.receiveCompany}}</i>
          </div>
          <div class="fl">
            <span>账号：</span>
            <i>{{datas.accountNo}}</i>
          </div>
        </li>
        <li>
          <div class="fl">
            <span>开户行：</span>
            <i>{{datas.openAccountBank}}</i>
          </div>
          <div class="fl">
            <span>大额行号：</span>
            <i>{{datas.bigLineNo}}</i>
          </div>
        </li>
        <li>
          <div class="fl">
            <span>联系人：</span>
            <i style="margin-right:24px">{{datas.contactPerson}}</i>
            <i style="margin-right:24px">{{datas.contactPhone}}</i>
            <i>{{datas.postName}}</i>
          </div>
        </li>
      </ul>
      <ul class="fl">
        <li>
          <span>申请人：</span>
          <i>{{datas.applyUserName}}</i>
        </li>
        <li>
          <span>所属部门：</span>
          <i>{{datas.departmentName}}</i>
        </li>
        <li>
          <span>申请时间：</span>
          <i>{{datas.createDate}}</i>
        </li>
      </ul>
    </header>
    <nav class="info">
      <div class="infoHead clearfix">
        <div class="fl">
          票据信息
          <i></i>
        </div>
        <!-- <div class="fr">批量上传</div> -->
      </div>
    </nav>
    <div class="section">
      <el-table :data="ticketList" style="width: 100%">
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column
          :prop="item.field"
          :label="item.title"
          :width="item.width"
          v-for="(item,index) in tableColoumn"
        ></el-table-column>
      </el-table>
      <div class="total">
        <div class="top">
          <i class="el-icon-lx-heji"></i>
          <span>合计</span>
        </div>
        <ul class="clearfix">
          <li>
            <div class="txt">票面金额</div>
            <div class="num">{{datas.ticketAmountTotal}}</div>
          </li>
          <li>
            <div class="txt">入库放款</div>
            <div class="num">{{datas.inPayMoneyTotal}}</div>
          </li>
        </ul>
      </div>
    </div>
    <nav class="info">
      <div class="infoHead clearfix">
        <div class="fl">
          审核信息
          <i></i>
        </div>
        <!-- <div class="fr">批量上传</div> -->
      </div>
    </nav>
    <ul class="option clearfix">
      <li class="fl" v-if="datas.reviewUserName">
        <div>复核意见</div>
        <p>
          <span>复核人：</span>
          <i>{{datas.reviewUserName}}</i>
        </p>
        <p>
          <span>复核结果：</span>
          <i class="pass" v-if="datas.reviewResult=='通过'">{{datas.reviewResult}}</i>
          <i class="reject" v-else>{{datas.reviewResult}}</i>
          <i class="infoDetail" v-popover:popover1>信息详情</i>
          <el-popover ref="popover1" placement="bottom" width="150" trigger="hover">
            <div style="padding-left:10px">
              <div v-if="datas.reviewResult=='通过'">
                <p
                  v-for="item_ in reviewOpinions"
                >{{datas.reviewDetail.indexOf(item_.value) !=-1 ? item_.label :''}}</p>
              </div>
              <div v-else>
                <p>{{datas.reviewDetail}}</p>
              </div>
            </div>
          </el-popover>
        </p>
        <p>
          <span>复核时间：</span>
          <i>{{datas.reviewDate && datas.reviewDate.substr(0,10)}}</i>
        </p>
      </li>
      <li class="fl" v-if="datas.approvalUserName">
        <div>审批意见</div>
        <p>
          <span>审批人：</span>
          <i>{{datas.approvalUserName}}</i>
        </p>
        <p>
          <span>审批结果：</span>
          <i class="pass" v-if="datas.approvalResult=='通过'">{{datas.approvalResult}}</i>
          <i class="reject" v-else>{{datas.approvalResult}}</i>
          <i class="infoDetail" v-popover:popover2>信息详情</i>
          <el-popover ref="popover2" placement="bottom" width="150" trigger="hover">
            <div style="padding-left:10px">
              <div v-if="datas.approvalResult=='通过'">
                <p
                  v-for="item_ in reviewOpinions"
                  v-if="datas.approvalResult=='通过'"
                >{{datas.approvalDetail.indexOf(item_.value) !=-1 ? item_.label :''}}</p>
              </div>
              <div v-else>
                <p>{{datas.approvalDetail}}</p>
              </div>
            </div>
          </el-popover>
        </p>
        <p>
          <span>审批时间：</span>
          <i>{{datas.approvalLDate && datas.approvalLDate.substr(0,10)}}</i>
        </p>
      </li>
      <li class="fl" v-if="datas.toFinalUserName">
        <div>终审意见</div>
        <p>
          <span>终审人：</span>
          <i>{{datas.toFinalUserName}}</i>
        </p>
        <p>
          <span>终审结果：</span>
          <i class="pass" v-if="datas.toFinalResult=='通过'">{{datas.toFinalResult}}</i>
          <i class="reject" v-else>{{datas.toFinalResult}}</i>
          <i class="infoDetail" v-popover:popover3>信息详情</i>
          <el-popover ref="popover3" placement="bottom" width="150" trigger="hover">
            <div style="padding-left:10px">
              <div v-if="datas.toFinalResult=='通过'">
                <p v-if="datas.toFinalResult=='通过'">{{datas.toFinalDetail=='20016'? '同意放款':''}}</p>
              </div>
              <di v-else>
                <p>{{datas.toFinalDetail}}</p>
              </di>
            </div>
          </el-popover>
        </p>
        <p>
          <span>终审时间：</span>
          <i>{{datas.toFinalDate && datas.toFinalDate.substr(0,10)}}</i>
        </p>
      </li>
      <!-- {{datas.jobType}}{{datas.auditStatus__}} -->
      <li class="fl"  style="background:#fff" v-if=" datas.auditStatus__ !='已拒绝' && datas.auditStatus__!=''">
        <div>{{datas.auditStatus__}}意见</div>
        <div style="padding-top:2px">
          <img src="../../../assets/img/status.png" alt="" style="vertical-align:middle;margin-right:8px"><span style="display:inline-block">等待{{datas.auditStatus__}}中</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { getBussinessDetail, saveReviewStatus } from "@/api/api";
export default {
  name: "businessDetails",
  data() {
    return {
      input: "",
      input1: "",
      radio: "1",
      refuseReason: "",
      reviewOpinion: [],
      reviewOpinions: [
        {
          value: "20004",
          label: "复核进口费率"
        },
        {
          value: "20005",
          label: "出口费率和类型真实"
        },
        {
          value: "20006",
          label: "票面信息真实"
        },
        {
          value: "20007",
          label: "汇款信息正确"
        },
        {
          value: "20008",
          label: "核算内容正确"
        },
        {
          value: "20009",
          label: "票据签收"
        }
      ],
      value: "",
      tableColoumn: [
        { field: "ticketStatus", title: "在库状态", width: "80" },
        { field: "ticketNo", title: "票号", width: "250" },
        { field: "drawer", title: "出票人", width: "120" },
        { field: "drawerAccountNo", title: "出票人账号", width: "200" },
        { field: "drawerBank", title: "出票人开户行", width: "300" },
        { field: "receiver", title: "收款人", width: "150" },
        { field: "receiverAccountNo", title: "收款人账号", width: "200" },
        { field: "receiverBank", title: "收款人开户行", width: "200" },
        { field: "accepter", title: "承兑人", width: "100" },
        { field: "accepterAccountNo", title: "承兑人账号", width: "200" },
        { field: "accepterBank", title: "承兑人开户行", width: "200" },
        { field: "accepterBankNo", title: "承兑人开户行行号", width: "200" },
        { field: "ticketAmount", title: "票面金额", width: "200" },
        { field: "draftDate", title: "出票日", width: "100" },
        { field: "expireDate", title: "到期日", width: "100" },
        { field: "plusDay", title: "加天", width: "50" },
        { field: "dayNum", title: "入库剩余天数", width: "120" },
        { field: "canTransfer", title: "是否可转让", width: "120" },
        { field: "stockPrice", title: "入库价格", width: "100" },
        { field: "calInterestTypeName", title: "计息方式", width: "100" },
        { field: "stockInterest", title: "入库利息", width: "100" },
        { field: "eleRemitCost", title: "电汇费", width: "100" },
        { field: "payMoney", title: "入库放款", width: "200" }
      ],
      datas: {},
      ticketList: [],
      ids: "",
      ids_:''
    };
  },
  methods: {
    cancle() {
      this.$router.push("/warehousingApplication");
    },
    handleLink() {
      // 当前岗位id:待审核:1100,待审批:1101,待终审:1102,业务岗:1103
      // 审核状态(已拒绝:20000,待复核:20001,待审批:20002,待终审:20003)
      this.datas.auditStatus;
      if (this.datas.auditStatus == 20001) {
        let id = this.$route.query.id;
        if (this.datas.jobType == 1100) {
          this.$router.push("/warehousingReview?id=" + id);
        } else {
          this.$router.push("/warehousingReview?id=" + id + "&edit=" + true);
        }
      } else if (this.datas.auditStatus == 20002) {
        let id = this.$route.query.id;
        if (this.datas.jobType == 1101) {
          this.$router.push("/warehousingApproval?id=" + id);
        } else {
          this.$router.push("/warehousingApproval?id=" + id + "&edit=" + true);
        }
      } else if (this.datas.auditStatus == 20003) {
        let id = this.$route.query.id;
        if (this.datas.jobType == 1102) {
          this.$router.push("/finalAppeal?id=" + id);
        } else {
          this.$router.push("/finalAppeal?id=" + id + "&edit=" + true);
        }
      } else if (this.datas.auditStatus == 20000) {
        let id = this.$route.query.id;
        this.$router.push("/editWarehousing?id=" + id);
      } else if (this.datas.auditStatus == 20004) {
        this.$router.push("/outgoingBill?id=" + this.ids_ + "&tab=" + true);
      }
    },
    saveReviewStatus(param) {
      saveReviewStatus(param).then(res => {
        if (res && res.data && res.data.CODE == "200") {
          this.$message({
            message: res.data.MESSAGE,
            type: "success"
          });
        } else {
          this.$message.error(res && res.data && res.data.MESSAGE);
        }
      });
    },
    handle() {
      let param;
      let id = this.datas.id;
      if (this.radio == 1) {
        let reviewOpinion = this.reviewOpinion;
        let arr = [];
        if (reviewOpinion.length == 0) {
          this.$message({
            message: "请勾选通过原因",
            type: "warning"
          });
          return false;
        }
        reviewOpinion &&
          reviewOpinion.map(function(v, i) {
            arr.push(v.value);
          });
        let operaContent = arr.join(",");
        param = {
          id: id,
          auditStatus: 20001,
          operaContent: operaContent
        };
      } else {
        if (!this.refuseReason) {
          this.$message({
            message: "请输入拒绝原因",
            type: "warning"
          });
          return;
        }
        param = {
          id: id,
          auditStatus: 20001,
          refuseReason: this.refuseReason,
          refuseStatus: 20000
        };
      }
      this.saveReviewStatus(param);
    },
    getBussinessDetail(param) {
      getBussinessDetail(param).then(res => {
        //20005:复核进口费率,20006:出口费率和类型真实,20007:票面信息真实,20008:汇款信息正确,20009:核算内容正确.20010:票据签收,
        if (res && res.data && res.data.CODE == "200") {
          let datas = res.data.RESULT;
          if (datas.auditStatus == 20000) {
            datas.auditStatus_ = "已拒绝";
            datas.auditStatus__ = "已拒绝";
          } else if (datas.auditStatus == 20001) {
            datas.auditStatus_ = "待复核";
            datas.auditStatus__ = "复核";
          } else if (datas.auditStatus == 20002) {
            datas.auditStatus_ = "待审批";
            datas.auditStatus__ = "审批";
          } else if (datas.auditStatus == 20003) {
            datas.auditStatus_ = "待终审";
            datas.auditStatus__ = "终审";
          } else if (datas.auditStatus == 20004) {
            datas.auditStatus_ = "成功入库";
            datas.auditStatus__ = "";
          }else {
            datas.auditStatus__ = "";
          }
          datas.ticketList &&
            datas.ticketList.map(function(v, i) {
              if (v.ticketStatus == 10000) {
                v.ticketStatus = "入库中";
              } else if (v.ticketStatus == 10001) {
                v.ticketStatus = "已入库";
              } else if (v.ticketStatus == 10002) {
                v.ticketStatus = "出库中";
              } else if (v.ticketStatus == 10003) {
                v.ticketStatus = "已出库";
              }
              if (v.canTransfer == 1) {
                v.canTransfer = "可转让";
              } else {
                v.canTransfer = "不可转让";
              }
            });

          this.datas = datas;
          let arr = [];
          let arr_ = [];
          let ticketList = res.data.RESULT.ticketList;
          ticketList &&
            ticketList.map(function(v, i) {
              arr.push(v.id + "");
              if(v.ticketStatus == '已入库'){
              arr_.push(v.id + "");
              }
            });
          this.ids = arr.join(",");
          this.ids_ = arr_.join(",");
          this.ticketList = ticketList;
        } else {
          this.$message.error(res && res.data && res.data.MESSAGE);
        }
      });
    }
  },
  created() {
    if (this.$route.query.id) {
      this.getBussinessDetail({ id: this.$route.query.id });
    }
  }
};
</script>

<style scoped>
.businessDetails {
  padding: 0 32px 16px;
}
.businessDetails .top_ {
  padding-top: 16px;
  height: 64px;
}
.top_ .fr button {
  color: #fff;
  height: 32px;
  background: rgba(83, 118, 255, 1);
  border-radius: 2px;
  border: #5376ff;
  cursor: pointer;
  margin-right: 20px;
  padding:0 14px;

}
.top_ .fr button i{
  margin-right:8px;
}
.businessDetails .top_ span {
  font-size: 18px;
  font-weight: 600;
  margin-right: 16px;
}
.businessDetails .top_ p {
  padding-top: 3px;
  float: left;
}
.businessDetails .top_ p > i {
  background: rgba(83, 118, 255, 1)
    linear-gradient(
      127deg,
      rgba(119, 133, 255, 1) 0%,
      rgba(97, 124, 255, 1) 100%
    );
  border-radius: 2px;
  margin-right: 5px;
}
.top_ p > i,
em {
  padding: 2px 5px;
  display: inline-block;
  color: #fff;
  text-align: center;
  font-size:12px;
}
.businessDetails .top_ em {
  background: linear-gradient(
    303deg,
    rgba(42, 133, 255, 1) 0%,
    rgba(0, 226, 220, 1) 100%
  );
  border-radius: 2px;
}
.businessDetails header > ul {
  margin-bottom: 24px;
  margin-right: 24px;
}
.businessDetails header > ul:nth-child(1),
.businessDetails header > ul:nth-child(3) {
  width: 255px;
  /* height: 176px; */
  border-radius: 4px;
  border: 1px solid rgba(236, 239, 245, 1);
}
.businessDetails header > ul:nth-child(3) {
  margin-right: 0px;
}
.businessDetails header > ul:nth-child(2) {
  /* margin-left: 280px; */
  /* height: 176px; */
  width: 612px;
  border-radius: 4px;
  border: 1px solid rgba(236, 239, 245, 1);
}
.businessDetails header > ul:nth-child(2) li > div:nth-child(1) {
  width: 356px;
}
.businessDetails header ul > li {
  padding-left: 16px;
  line-height: 58px;
  height: 58px;
}
.businessDetails header ul > li > span {
  margin-right: 10px;
}
.businessDetails header span {
  color: #a3adc8;
}
.businessDetails header i {
  font-weight: 600;
  color: #596689;
}
.businessDetails .infoHead {
  border-bottom: 2px solid #e6e9f0;
}
.businessDetails .infoHead div {
  padding-bottom: 8px;
}
.businessDetails .infoHead .fl {
  padding-left: 12px;
  position: relative;
  color: #5376ff;
}
.businessDetails .infoHead .fl i {
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 80px;
  height: 3px;
  background: #5376ff;
}
.businessDetails .info {
  margin-bottom: 25px;
}
.businessDetails .section {
  margin-bottom: 24px;
}
.businessDetails .section .headClass {
  color: #a3adc8;
}
.businessDetails .section .addRow {
  margin-top: 25px;
  color: #5376ff;
}
.businessDetails .section .addRow i {
  margin-right: 8px;
}
.businessDetails .section .total {
  margin-top: 27px;
}
.businessDetails .section .total .top {
  margin-bottom: 16px;
  color: #596689;
}
.businessDetails .section .total .top i {
  margin-right: 6px;
}
.businessDetails .section .total li {
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
.businessDetails .section .total li .txt {
  line-height: 26px;
  font-size: 12px;
  color: rgba(163, 173, 200, 1);
}
.businessDetails .section .total li .num {
  line-height: 26px;
  font-size: 18px;
  font-weight: 500;
  color: rgba(50, 62, 97, 1);
}
.businessDetails .section .headerClass {
  color: #a3adc8;
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
.option li {
  width: 240px;
  padding: 16px  16px;
  height: 170px;
  background: rgba(245, 246, 250, 1);
  border-radius: 4px;
  border: 1px solid rgba(236, 239, 245, 1);
  margin-right: 24px;
}
.option li > div:nth-child(1) {
  margin-bottom: 24px;
  height: 26px;
  line-height: 26px;
  font-weight: 600;
  color: rgba(50, 62, 97, 1);
}
.option li > p {
  margin-bottom: 16px;
  font-weight: 600;
  color: rgba(163, 173, 200, 1);
}
.option li > p i {
  margin-right: 16px;
}
.option .pass {
  font-weight: 600;
  color: rgba(103, 194, 58, 1);
}

.option .reject {
  font-weight: 600;
  color: rgba(250, 85, 85, 1);
}
.option .infoDetail {
  font-weight: 400;
  color: #5376ff;
}
.input382.el-input {
  width: 280px;
  /* margin-left: 8px; */
}
.input280.el-input {
  width: 280px;
}
.input348.el-input {
  width: 348px;
}
.input106.el-input {
  width: 106px;
  margin-right: 8px;
}
</style>
