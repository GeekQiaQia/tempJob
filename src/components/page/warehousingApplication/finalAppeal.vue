<template>
  <div class="finalAppeal">
    <div class="top_">
      <p>
        <span>业务单号：{{datas.businessNo}}</span>
        <i v-for="item in auditStatuss" v-if="item.value==datas.auditStatus">{{item.label}}</i>
        <em>{{datas.payTypeName}}</em>
      </p>
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
        <el-table-column
            type="index"
            label="序号"
            width="50"
            align="center"
          >
        </el-table-column>
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
      <li class="fl">
        <div>复核意见</div>
        <p>
          <span>复核人：</span>
          <i>{{datas.reviewUserName}}</i>
        </p>
        <p>
          <span>复核结果：</span>
          <i class="pass">{{datas.reviewResult}}</i>
          <i class="infoDetail" v-popover:popover1>信息详情</i>
          <el-popover ref="popover1" placement="bottom" width="150" trigger="hover">
            <div style="padding-left:10px">
              <p
                v-for="item_ in reviewOpinions"
                v-if="datas.reviewResult=='通过'"
              >{{datas.reviewDetail.indexOf(item_.value) !=-1 ? item_.label :''}}</p>
              <p v-else>{{datas.reviewDetail}}</p>
            </div>
          </el-popover>
        </p>
        <p>
          <span>复核时间：</span>
          <i>{{datas.reviewDate && datas.reviewDate.substr(0,10)}}</i>
        </p>
      </li>
      <li class="fl">
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
              <p
                v-for="item_ in reviewOpinions"
                v-if="datas.approvalResult=='通过'"
              >{{datas.approvalDetail.indexOf(item_.value) !=-1 ? item_.label :''}}</p>
              <p v-else>{{datas.approvalDetail}}</p>
            </div>
          </el-popover>
        </p>
        <p>
          <span>审批时间：</span>
          <i>{{datas.approvalLDate && datas.approvalLDate.substr(0,10)}}</i>
        </p>
      </li>
      <li class="fl" v-if="edit && datas.toFinalResult">
        <div>终审意见</div>
        <p>
          <span>终审人：</span>
          <i>{{datas.ticketTypeName}}</i>
        </p>
        <p>
          <span>终审结果：</span>
          <i class="pass" v-if="datas.toFinalResult=='通过'">{{datas.toFinalResult}}</i>
          <i class="reject" v-else>{{datas.toFinalResult}}</i>
          <i class="infoDetail" v-popover:popover2>信息详情</i>
          <el-popover ref="popover2" placement="bottom" width="150" trigger="hover">
            <div style="padding-left:10px">
              <p
                v-for="item_ in reviewOpinions"
                v-if="datas.toFinalResult=='通过'"
              >{{datas.toFinalDetail.indexOf(item_.value) !=-1 ? item_.label :''}}</p>
              <p v-else>{{datas.toFinalDetail}}</p>
            </div>
          </el-popover>
        </p>
        <p>
          <span>审批时间：</span>
          <i>{{datas.approvalLDate && datas.approvalLDate.substr(0,10)}}</i>
        </p>
      </li>
      <li class="fl" v-if="!edit && !datas.toFinalResult">
        <div>终审意见</div>
        <p>
          <el-radio v-model="radio" label="1">通过</el-radio>
          <el-radio v-model="radio" label="2">拒绝</el-radio>
        </p>
        <p v-if="radio=='1'">
          <el-checkbox-group v-model="reviewOpinion">
            <el-checkbox
              v-for="city in reviewOpinions_"
              :label="city"
              :key="city.value"
            >{{city.label}}</el-checkbox>
          </el-checkbox-group>
        </p>
        <p v-else>
          <el-input placeholder="详细原因" class="input382" v-model="refuseReason"></el-input>
        </p>
      </li>
    </ul>
    <div class="newBtn" v-if="!edit">
      <el-button @click="handle">确认</el-button>
      <el-button @click="handleBack">取消</el-button>
    </div>
  </div>
</template>

<script>
import { getBussinessDetail, saveReviewStatus } from "@/api/api";
export default {
  name: "finalAppeal",
  data() {
    return {
      edit: false,
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
      reviewOpinions_: [{ value: "20016", label: "同意放款" }],
      value: "",
     tableColoumn: [
        {
          field: "ticketNo",
          title: "票号",
          width: "250"
        },
        {
          field: "drawer",
          title: "出票人",
          width: "120"
        },
        {
          field: "drawerAccountNo",
          title: "出票人账号",
          width: "200"
        },
        {
          field: "drawerBank",
          title: "出票人开户行",
          width: "300"
        },
        {
          field: "receiver",
          title: "收款人",
          width: "150"
        },
        {
          field: "receiverAccountNo",
          title: "收款人账号",
          width: "200"
        },
        {
          field: "receiverBank",
          title: "收款人开户行",
          width: "200"
        },
        {
          field: "accepter",
          title: "承兑人",
          width: "100"
        },
        {
          field: "accepterAccountNo",
          title: "承兑人账号",
          width: "200"
        },
        {
          field: "accepterBank",
          title: "承兑人开户行",
          width: "200"
        },
        {
          field: "accepterBankNo",
          title: "承兑人开户行行号",
          width: "200"
        },
        {
          field: "ticketAmount",
          title: "票面金额",
          width: "200"
        },
        {
          field: "draftDate",
          title: "出票日",
          width: "100"
        },
        {
          field: "expireDate",
          title: "到期日",
          width: "100"
        },
        {
          field: "plusDay",
          title: "加天",
          width: "50"
        },
        {
          field: "dayNum",
          title: "入库剩余天数",
          width: "120"
        },
        {
          field: "canTransfer",
          title: "是否可转让",
          width: "120"
        },
        {
          field: "stockPrice",
          title: "入库价格",
          width: "100"
        },
        {
          field: "calInterestTypeName",
          title: "计息方式",
          width: "100"
        },
        {
          field: "stockInterest",
          title: "入库利息",
          width: "100"
        },
        {
          field: "eleRemitCost",
          title: "电汇费",
          width: "100"
        },
        {
          field: "payMoney",
          title: "入库放款",
          width: "200"
        }
      ],
      auditStatuss: [
        { label: "已拒绝", value: 20000 },
        { label: "待复核", value: 20001 },
        { label: "待审批", value: 20002 },
        { label: "待终审", value: 20003 },
        { label: "通过", value: 20004 }
      ],
      datas: {},
      ticketList: []
    };
  },
  methods: {
    handleBack() {
      this.$router.push("/warehousingApplication");
    },
    saveReviewStatus(param) {
      saveReviewStatus(param).then(res => {
        if (res && res.data && res.data.CODE == "200") {
          this.$message({
            message: res.data.MESSAGE,
            type: "success"
          });
          this.$router.push("/warehousingApplication");
        } else {
          this.$message.error(res && res.data && res.data.MESSAGE);
        }
      });
    },
    handle() {
      // 终审通过:{"id":-7678772313444110814,"auditStatus":20003,"operaContent":"20004,20005"}
      // 终审拒绝:{"id":-6572900626459412680,"auditStatus":20003,"refuseReason":"信息不合法!",”refuseStatus”:20000}
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
          auditStatus: 20003,
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
          auditStatus: 20003,
          refuseReason: this.refuseReason,
          refuseStatus: 20000
        };
      }

      this.saveReviewStatus(param);
    },
    getBussinessDetail(param) {
      getBussinessDetail(param).then(res => {
        if (res && res.data && res.data.CODE == "200") {
          this.datas = res.data.RESULT;
          this.ticketList = res.data.RESULT.ticketList;
        } else {
          this.$message.error(res && res.data && res.data.MESSAGE);
        }
      });
    }
  },
  created() {
    this.getBussinessDetail({ id: this.$route.query.id });
    this.edit = this.$route.query.edit;
  }
};
</script>

<style scoped>
.finalAppeal {
  padding: 0 32px 16px;
}
.finalAppeal .top_ {
  padding-top: 22px;
  height: 64px;
}
.finalAppeal .top_ span {
  font-size: 18px;
  font-weight: 600;
  margin-right: 16px;
}
.finalAppeal .top_ i {
  background: rgba(83, 118, 255, 1)
    linear-gradient(
      127deg,
      rgba(119, 133, 255, 1) 0%,
      rgba(97, 124, 255, 1) 100%
    );
  border-radius: 2px;
  margin-right: 5px;
}
.top_ i,
em {
  padding: 2px 5px;
  display: inline-block;
  color: #fff;
  text-align: center;
}
.finalAppeal .top_ em {
  background: linear-gradient(
    303deg,
    rgba(42, 133, 255, 1) 0%,
    rgba(0, 226, 220, 1) 100%
  );
  border-radius: 2px;
}
.finalAppeal header > ul {
  margin-bottom: 24px;
  margin-right: 24px;
}
.finalAppeal header > ul:nth-child(1),
.finalAppeal header > ul:nth-child(3) {
  width: 255px;
  /* height: 176px; */
  border-radius: 4px;
  border: 1px solid rgba(236, 239, 245, 1);
}
.finalAppeal header > ul:nth-child(3) {
  margin-right: 0px;
}
.finalAppeal header > ul:nth-child(2) {
  /* margin-left: 280px; */
  /* height: 176px; */
  width: 612px;
  border-radius: 4px;
  border: 1px solid rgba(236, 239, 245, 1);
}
.finalAppeal header > ul:nth-child(2) li > div:nth-child(1) {
  width: 356px;
}
.finalAppeal header ul > li {
  padding-left: 16px;
  line-height: 58px;
  height: 58px;
}
.finalAppeal header ul > li > span {
  margin-right: 10px;
}
.finalAppeal .infoHead {
  border-bottom: 2px solid #e6e9f0;
}
.finalAppeal .infoHead div {
  padding-bottom: 8px;
}
.finalAppeal .infoHead .fl {
  padding-left: 12px;
  position: relative;
  color: #5376ff;
}
.finalAppeal .infoHead .fl i {
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 80px;
  height: 3px;
  background: #5376ff;
}
.finalAppeal .info {
  margin-bottom: 25px;
}
.finalAppeal .section {
  margin-bottom: 24px;
}
.finalAppeal .section .headClass {
  color: #a3adc8;
}
.finalAppeal .section .addRow {
  margin-top: 25px;
  color: #5376ff;
}
.finalAppeal .section .addRow i {
  margin-right: 8px;
}
.finalAppeal .section .total {
  margin-top: 27px;
}
.finalAppeal .section .total .top {
  margin-bottom: 16px;
  color: #596689;
}
.finalAppeal .section .total .top i {
  margin-right: 6px;
}
.finalAppeal .section .total li {
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
.finalAppeal .section .total li .txt {
  line-height: 26px;
  font-size: 12px;
  color: rgba(163, 173, 200, 1);
}
.finalAppeal .section .total li .num {
  line-height: 26px;
  font-size: 18px;
  font-weight: 500;
  color: rgba(50, 62, 97, 1);
}
.finalAppeal .section .headerClass {
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
  padding: 16px;
  height: 170px;
  background: rgba(245, 246, 250, 1);
  border-radius: 4px;
  border: 1px solid rgba(236, 239, 245, 1);
  margin-right: 24px;
}

.option li > div {
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
