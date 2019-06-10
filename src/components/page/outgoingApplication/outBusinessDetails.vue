<template>
  <div class="outBusinessDetails">
    <div class="top_">
      <p>
        <span>业务单号：{{datas.businessNo}}</span>
        <i v-if="datas.auditStatus_">{{datas.auditStatus_=='复核' ?'待复核':(datas.auditStatus_=='审批' ?'待审批':(datas.auditStatus_=='终审' ?'待终审':datas.auditStatus_))}}</i> 
        <em v-if="datas.payTypeName">{{datas.payTypeName}}</em>
      </p>
      <div class="fr">
        <button @click="handleLink()" v-if="(jobType==1100 && datas.auditStatus==50001) || (jobType==1101 && datas.auditStatus==50002)|| (jobType==1102 && datas.auditStatus==50003) || datas.auditStatus==50000">
          <i class="el-icon-lx-2"></i>
          {{datas.auditStatus_ =='已拒绝' ? '编辑':datas.auditStatus_}}
        </button>
        <button style="display:none">
          <i class="el-icon-lx-2"></i>导出清单
        </button>
      </div>
    </div>
    <div class="navbar" v-if="flowType==30004">
      <div class="fl" :class="{active:status==1}" @click="handleTab(1)">移库单</div>
      <span>|</span>
      <div class="fl" :class="{active:status==2}" @click="handleTab(2)">出库单</div>
    </div>
    <div class="top_" v-if="flowType==30004">
      <p>
        <span>{{status==1?'移库单号 '+datas.businessNo+'-1':'出库单号 '+datas.businessNo+'-2'}}</span>
      </p>
    </div>
    <header class="clearfix">
      <ul class="fl navlist">
        <li>
          <span>票据类型：</span>
          <i>{{outBoundDatas.ticketType==12001 ? '银承':'商承' }}</i>
        </li>
        <li>
          <span>票据介质：</span>
          <i>{{outBoundDatas.mediaType==11001 ? '电票':'纸票' }}</i>
        </li>
        <li>
          <span>出库方式：</span>
          <i>{{outBoundDatas.outStockType==33001 ? '背书' :'贴现'}}</i>
        </li>
      </ul>
      <ul class="fl">
        <li>
          <div class="fl">
            <span>对手类型：</span>
            <i>{{outBoundDatas.opponentType == 32001? '企业':'银行'}}</i>
          </div>
          <div class="fl">
            <span>对手名称：</span>
            <i>{{outBoundDatas.opponentCompany}}</i>
          </div>
        </li>
        <li>
          <div class="fl">
            <span>开户行：</span>
            <i>{{outBoundDatas.openAccountBank}}</i>
          </div>
          <div class="fl">
            <span>账号：</span>
            <i>{{outBoundDatas.accountNo}}</i>
          </div>
        </li>
        <li>
          <div class="fl">
            <span>联系人：</span>
            <i style="margin-right:24px">{{outBoundDatas.contactPerson}}</i>
            <i style="margin-right:24px">{{outBoundDatas.contactPhone}}</i>
            <i>{{outBoundDatas.postName}}</i>
          </div>
          <div class="fl">
            <span>大额行号：</span>
            <i>{{outBoundDatas.bigLineNo}}</i>
          </div>
        </li>
      </ul>
      <ul class="fl another">
        <li>
          <span>申请人：</span>
          <i>{{outBoundDatas.applyUserName}}</i>
          <strong style="padding-left:8px;cursor:pointer" v-popover:popover4>···</strong>
        </li>
        <li>
          <span>所属部门：</span>
          <i>{{outBoundDatas.applyDeptName}}</i>
        </li>
        <li>
          <span>申请时间：</span>
          <i>{{outBoundDatas.applyDate}}</i>
        </li>
        <li>
          <span>归属人：</span>
          <i>{{outBoundDatas.belongNickName}}</i>
        </li>
      </ul>
      <el-popover ref="popover4" placement="bottom" width="224" trigger="hover">
          <div class="applicant_">
            <ul class="applicant_first clearfix"><li><p class="fl">申请人</p><p class="fl">所属部门</p></li></ul>
            <ul class="applicant_second clearfix"><li v-for="item in outBoundDatas.applicantList"><p class="fl">{{item.applyUserName}}</p><p class="fl">{{item.applyDeptName}}</p></li></ul>
          </div>
      </el-popover>
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
      <el-table :data="outBoundDatas.ticketList" style="width: 100%">
        <el-table-column
          :prop="item.field"
          :label="item.title"
          :width="item.width"
          v-for="(item,index) in tableColoumn"
        >
          <template slot-scope="scope">
            <div>
              <span v-if="item.field=='ticketType'">{{scope.row[item.field]==12001 ? '银承':'商承'}}</span>
              <span
                v-else-if="item.field=='calInterestType' || item.field=='outCalInterestType'"
              >{{scope.row[item.field]=='13001' ? '年息%':(scope.row[item.field]=='13002' ? '元/每十万':'')}}</span>
              <span v-else>{{scope.row[item.field]}}</span>
            </div>
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
            <div class="num">{{outBoundDatas.ticketAmountTotal}}</div>
          </li>
          <li>
            <div class="txt">入库放款</div>
            <div class="num">{{outBoundDatas.inPayMoneyTotal}}</div>
          </li>
          <li>
            <div class="txt">入库利息</div>
            <div class="num">{{outBoundDatas.inInterestTotal}}</div>
          </li>
          <li>
            <div class="txt">出库收款</div>
            <div class="num">{{outBoundDatas.outReceiveMoneyTotal}}</div>
          </li>
          <li>
            <div class="txt">出库利息</div>
            <div class="num">{{outBoundDatas.outInterestTotal}}</div>
          </li>
        </div>
      </div>
    </div>
    <nav class="info">
      <div class="infoHead clearfix">
        <div class="fl">
          审核信息
          <i></i>
        </div>
      </div>
    </nav>
    <ul class="option clearfix">
      <li class="list fl" v-if="outBoundDatas.operaRecordList && outBoundDatas.operaRecordList[0]">
        <div>复核意见：</div>
        <p>
          <span>复核人：</span>
          <i>{{outBoundDatas.operaRecordList && outBoundDatas.operaRecordList[0].nickname}}</i>
        </p>
        <p>
          <span>复核结果：</span>
          <i
            class="pass"
            v-if="outBoundDatas.operaRecordList && outBoundDatas.operaRecordList[0].outFlowEvent=='pass'"
          >通过</i>
          <i class="reject" v-else>拒绝</i>
          <i class="infoDetail" v-popover:popover1>信息详情</i>
          <el-popover ref="popover1" placement="bottom" width="150" trigger="hover">
            <div style="padding-left:10px">
              <div v-if="outBoundDatas.operaRecordList[0].outFlowEvent=='pass'">
                <p
                  v-for="item_ in passOperaContent_"
                >{{outBoundDatas.operaRecordList && outBoundDatas.operaRecordList[0].passOperaContent.indexOf(item_.label) !=-1 ? item_.value :''}}</p>
              </div>
              <div v-else>
                <p>{{outBoundDatas.operaRecordList && outBoundDatas.operaRecordList[0].rejectOperaContent}}</p>
              </div>
            </div>
          </el-popover>
        </p>
        <p>
          <span>复核时间：</span>
          <i>{{outBoundDatas.operaRecordList &&outBoundDatas.operaRecordList && outBoundDatas.operaRecordList[0].createTime}}</i>
        </p>
      </li>
      <li class="list fl" v-if="outBoundDatas.operaRecordList && outBoundDatas.operaRecordList[1]">
        <div>审批意见:</div>
        <p>
          <span>审批人：</span>
          <i>{{outBoundDatas.operaRecordList && outBoundDatas.operaRecordList[1].nickname}}</i>
        </p>
        <p>
          <span>审批结果：</span>
          <i
            class="pass"
            v-if="outBoundDatas.operaRecordList && outBoundDatas.operaRecordList[1].outFlowEvent=='pass'"
          >通过</i>
          <i class="reject" v-else>拒绝</i>
          <i class="infoDetail" v-popover:popover2>信息详情</i>
          <el-popover ref="popover2" placement="bottom" width="150" trigger="hover">
            <div style="padding-left:10px">
              <div v-if="outBoundDatas.operaRecordList[1].outFlowEvent=='pass'">
                <p
                  v-for="item_ in passOperaContent_"
                >{{outBoundDatas.operaRecordList && outBoundDatas.operaRecordList[1].passOperaContent && outBoundDatas.operaRecordList[1].passOperaContent.indexOf(item_.label) !=-1 ? item_.value :''}}</p>
              </div>
              <div v-else>
                <p>{{outBoundDatas.operaRecordList && outBoundDatas.operaRecordList[1].rejectOperaContent}}</p>
              </div>
            </div>
          </el-popover>
        </p>
        <p>
          <span>审批时间：</span>
          <i>{{outBoundDatas.operaRecordList && outBoundDatas.operaRecordList[1].createTime}}</i>
        </p>
      </li>
       <li class="list fl" v-if="outBoundDatas.operaRecordList && outBoundDatas.operaRecordList[2]">
        <div>终审意见:</div>
        <p>
          <span>终审人：</span>
          <i>{{outBoundDatas.operaRecordList && outBoundDatas.operaRecordList[2].nickname}}</i>
        </p>
        <p>
          <span>终审结果：</span>
          <i
            class="pass"
            v-if="outBoundDatas.operaRecordList && outBoundDatas.operaRecordList[2].outFlowEvent=='pass'"
          >通过</i>
          <i class="reject" v-else>拒绝</i>
          <i class="infoDetail" v-popover:popover3>信息详情</i>
          <el-popover ref="popover3" placement="bottom" width="150" trigger="hover">
            <div style="padding-left:10px">
              <div v-if="outBoundDatas.operaRecordList && outBoundDatas.operaRecordList[2].outFlowEvent=='pass'">
                <p
                  v-for="item_ in finalOpinions"
                >{{outBoundDatas.operaRecordList && outBoundDatas.operaRecordList[2].passOperaContent && outBoundDatas.operaRecordList[2].passOperaContent.indexOf(item_.value) !=-1 ? item_.label :''}}</p>
              </div>
              <div v-else>
                <p>{{outBoundDatas.operaRecordList && outBoundDatas.operaRecordList[2].rejectOperaContent}}</p>
              </div>
            </div>
          </el-popover>
        </p>
        <p>
          <span>终审时间：</span>
          <i>{{outBoundDatas.operaRecordList && outBoundDatas.operaRecordList[2].createTime}}</i>
        </p>
      </li>
      <!-- <li class="fl" v-if="outBoundDatas.operaRecordList && !outBoundDatas.operaRecordList[1] && datas.auditStatus_ !='已拒绝' && flowType==30001" style="background:#fff">
        <div>{{datas.auditStatus_}}意见</div>
        <div style="padding-top:2px">
          <img src="../../../assets/img/status.png" alt="" style="vertical-align:middle;margin-right:8px"><span style="display:inline-block">等待{{datas.auditStatus_}}中</span>
        </div>
      </li> -->
      <li class="fl" v-if="outBoundDatas.auditStatus !=50004 && outBoundDatas.auditStatus !=50000  && flowType==30004 || outBoundDatas.auditStatus !=50000  && flowType==30001" style="background:#fff">
        <div>{{(outBoundDatas.auditStatus==50001 ? '复核意见':(outBoundDatas.auditStatus==50002 ? '审批意见':(outBoundDatas.auditStatus==50003 ? '终审意见':'')))}}</div>
        <div style="padding-top:2px">  
          <img src="../../../assets/img/status.png" alt="" style="vertical-align:middle;margin-right:8px"><span style="display:inline-block">等待{{(outBoundDatas.auditStatus==50001 ? '复核':(outBoundDatas.auditStatus==50002 ? '审批':(outBoundDatas.auditStatus==50003 ? '终审':'')))}}中</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { billOutStockFlow_, billOutStockFlow_save } from "@/api/api";
export default {
  name: "outBusinessDetails",
  data() {
    return {
      options:[{label:50000,value:'已拒绝'},{label:50001,value:'待复核'},{label:50002,value:'待审批'},{label:50003,value:'待终审'},{label:50004,value:'终审通过'}],
      edit: false,
      auditStatus: "",
      step: 1,
      passOperaContent_: [
        { label: 60001, value: "交易对手信息正确" },
        { label: 60002, value: "实际出口费率-原计划出口费率" },
        { label: 60003, value: "出口核算正确" },
        { label: 60004, value: "预计回款时间" }
      ],
      input: "",
      input1: "",
      radio: "1",
      refuseReason: "",
      reviewOpinion: [],
      payTypeName: "",
      status: 1,
      outBoundDatas: {},
      flowType: "",
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
      reviewOpinions: [
        {
          value: "60001",
          label: "交易对手信息正确"
        },
        {
          value: "60002",
          label: "实际出口费率-原计划出口费率"
        },
        {
          value: "60003",
          label: "出口核算正确"
        },
        {
          value: "60004",
          label: "预计回款时间"
        }
      ],
      finalOpinions: [
        {
          value: "60005",
          label: "复核交易资料"
        },
        {
          value: "60006",
          label: "复核收款金额正确"
        },
        {
          value: "60007",
          label: "复核出库票据"
        }
      ],
      value: "",
      tableColoumn: [
        {
          field: "ticketNo",
          title: "票号",
          width: "150"
        },
        {
          field: "ticketType",
          title: "票据类型",
          width: "200"
        },
        {
          field: "ticketAmount",
          title: "票面金额",
          width: "120"
        },
        {
          field: "stockPrice",
          title: "入库价格",
          width: "200"
        },
        {
          field: "calInterestType",
          title: "计息方式",
          width: "300"
        },
        {
          field: "inDayNum",
          title: "入库剩余天数",
          width: "150"
        },
        {
          field: "stockInterest",
          title: "入库利息",
          width: "200"
        },
        {
          field: "payMoney",
          title: "入库放款",
          width: "200"
        },
        {
          field: "outStockPrice",
          title: "出库价格",
          width: "300"
        },
        {
          field: "outCalInterestType",
          title: "计息方式",
          width: "150"
        },
        {
          field: "outDayNum",
          title: "出库剩余天数",
          width: "200"
        },
        {
          field: "outStockInterest",
          title: "出库利息",
          width: "300"
        },
        {
          field: "receiveMoney",
          title: "出库收款",
          width: "200"
        },
        {
          field: "outEleRemitCost",
          title: "电汇费",
          width: "300"
        },
        {
          field: "holderTicketDays",
          title: "持票天数",
          width: "150"
        },
        {
          field: "holderCost",
          title: "持票成本",
          width: "200"
        },
        {
          field: "earn",
          title: "收益",
          width: "100"
        }
      ],
      datas: {},
      ticketList: []
    };
  },
  methods: {
    handleLink() { 
      let id = this.$route.query.id;
      let jobType = this.$route.query.jobType;
      let flowType = this.flowType;
      if (this.datas.auditStatus == 50001) {
        this.$router.push("/outboundReview?id=" + id + "&flowType=" + flowType+"&jobType="+jobType);
        if(flowType==30004){
        }
      } else if (this.datas.auditStatus == 50002) {
        this.$router.push(
          "/outboundApproval?id=" + id + "&flowType=" + flowType+"&jobType="+jobType
        );
      } else if (this.datas.auditStatus == 50003) {
        this.$router.push(
          "/deliveryFinalAppeal?id=" + id + "&flowType=" + flowType+"&jobType="+jobType
        );
      } else if (this.datas.auditStatus == 50000) {
        if(flowType==30004){
          this.$router.push(
          "/modifyMoveLibrary?id=" + id + "&flowType=" + flowType+"&jobType="+jobType
        );
        }else if(flowType==30001){
          this.$router.push(
          "/modifyTheOutbound?id=" + id + "&flowType=" + flowType+"&jobType="+jobType
        );
        }
        
      }
    },
    handleTab(value) {
      if (value == 1) {
        this.status = 1;
      } else {
        this.status = 2;
      }
    },
    handleBack() {
      this.$router.push("/outgoingApplication");
    },
    next_step() {
      this.status = 2;
      this.outBoundDatas = this.datas.moveOutFlow;
      this.step = 1;
    },
    handleTab(value) {
      this.status = value;
      if (this.status == 1) {
        this.outBoundDatas = this.datas.moveFlow;
      } else if (this.status == 2) {
        this.outBoundDatas = this.datas.moveOutFlow;
      } else {
        this.outBoundDatas = this.datas;
      }
    },
    billOutStockFlow_save(param) {
      billOutStockFlow_save(param).then(res => {
        if (res && res.data && res.data.CODE == "200") {
          this.$message({
            message: res.data.MESSAGE,
            type: "success"
          });

          if (param.event == "pass") {
            if (this.status == 1) {
              this.status = 2;
              this.reviewOpinion = [];
            } else if (this.status == 2) {
              this.$router.push("/outgoingApplication");
            }
          } else {
            if (this.status == 1) {
              this.$router.push("/outgoingApplication");
            }
          }
        } else {
          this.$message.error(res && res.data && res.data.MESSAGE);
        }
      });
    },
    handle() {
      let param;
      let id = this.datas.id;
      let flowType;
      let auditStatus;
      if (this.status == 1) {
        flowType = this.datas.moveFlow.flowType;
        auditStatus = this.datas.moveFlow.auditStatus;
      } else if (this.status == 2) {
        flowType = this.datas.moveOutFlow.flowType;
        auditStatus = this.datas.moveOutFlow.auditStatus;
      } else {
        flowType = this.datas.flowType;
        auditStatus = this.datas.auditStatus;
      }
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
          flowType: flowType,
          passOperaContent: operaContent,
          outFlowEvent: "pass",
          auditStatus: auditStatus
        };
        if (this.status == 1) {
          param.moveFlowId = this.datas.moveFlowId;
          param.id = this.datas.moveFlow.id;
          param.parentFlowId = this.datas.id;
          param.moveOutFlowId = this.datas.moveOutFlowId;
        } else if (this.status == 2) {
          param.moveFlowId = this.datas.moveFlowId;
          param.moveOutFlowId = this.datas.moveOutFlowId;
          param.id = this.datas.moveOutFlow.id;
          param.parentFlowId = this.datas.id;
        } else {
          param.id = this.datas.id;
        }
      } else {
        if (!this.refuseReason) {
          this.$message({
            message: "请输入拒绝原因",
            type: "warning"
          });
          return;
        }
        param = {
          flowType: flowType,
          rejectOperaContent: this.refuseReason,
          outFlowEvent: "reject",
          auditStatus: auditStatus
        };
        if (this.status == 1) {
          param.moveFlowId = this.datas.moveFlowId;
          param.moveOutFlowId = this.datas.moveOutFlowId;
          param.id = this.datas.moveFlow.id;
          param.parentFlowId = this.datas.id;
        } else if (this.status == 2) {
          param.moveFlowId = this.datas.moveFlowId;
          param.moveOutFlowId = this.datas.moveOutFlowId;
          param.id = this.datas.moveOutFlow.id;
          param.parentFlowId = this.datas.id;
        } else {
          param.id = this.datas.id;
        }
      }
      this.billOutStockFlow_save(param);
    },
    billOutStockFlow_(param) {
      billOutStockFlow_(param).then(res => {
        if (res && res.data && res.data.CODE == "200") {
          let datas = res.data.RESULT;
          if (datas.auditStatus == 50000) {
            datas.auditStatus_ = "已拒绝";
          } else if (datas.auditStatus == 50001) {
            datas.auditStatus_ = "复核";
          } else if (datas.auditStatus == 50002) {
            datas.auditStatus_ = "审批";
          } else if (datas.auditStatus == 50003) {
            datas.auditStatus_ = "终审";
          }
          if(this.flowType==30004){
            datas.moveOutFlow &&  datas.moveOutFlow.ticketList.map(function(v,i){
              v.holderTicketDays=0;
            })
          }

          if (datas.payType == 40001) {
            datas.payTypeName = "先背";
          } else {
            datas.payTypeName = "先打";
          }
          this.datas = datas;
          if (this.status == 1) {
            this.outBoundDatas = datas.moveFlow;
            if (datas.auditStatus < datas.moveFlow.auditStatus) {
              this.step = 2;
            } else {
            }
          } else if (this.status == 2) {
            this.outBoundDatas = datas.moveOutFlow;
            if (datas.auditStatus < datas.moveOutFlow.auditStatus) {
              this.$router.push("/outgoingApplication");
            } else {
            }
          } else {
            this.outBoundDatas = datas;
          }
        } else {
          this.$message.error(res && res.data && res.data.MESSAGE);
        }
      });
    }
  },
  created() {
    if (this.$route.query.id) {
      this.billOutStockFlow_({ id: this.$route.query.id });
      let flowType = this.$route.query.flowType;
      if (flowType == 30001) {
        this.status = 0;
      } else if (flowType == 30004) {
        this.status = 1;
      }
      this.flowType = flowType;
      this.edit = this.$route.query.edit;
      if(this.$route.query.jobType){
        this.jobType=this.$route.query.jobType
      }
    }
  },
  mounted() {}
};
</script>

<style scoped>
.navlist li span{
  color:#A3ADC8
}
.applicant_{
  padding:8px 20px 20px;
}
.applicant_ ul:nth-child(1){
  color: #A3ADC8;
  font-size:12px;
}

.applicant_ li{
  float: left;
  line-height: 32px;
  height: 32px;
}
.applicant_ li p:nth-child(1){
  width: 80px
}
.outBusinessDetails .top_ {
  padding-top: 16px;
  height: 64px;
}
.top_ button {
  color: #fff;
  width: 78px;
  height: 32px;
  background: rgba(83, 118, 255, 1);
  border-radius: 2px;
  border: #5376ff;
  cursor: pointer;
  margin-right: 20px;
}
.top_ button:last-child {
  margin-right: 0px;
}
.outBusinessDetails .top_ span {
  font-size: 18px;
  font-weight: 600;
  margin-right: 16px;
}
.outBusinessDetails .top_ p {
  padding-top: 3px;
  float: left;
}
.outBusinessDetails .top_ p > i {
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
}
.outBusinessDetails .top_ em {
  background: linear-gradient(
    303deg,
    rgba(42, 133, 255, 1) 0%,
    rgba(0, 226, 220, 1) 100%
  );
  border-radius: 2px;
}
.navbar .active {
  font-weight: 600;
  color: rgba(83, 118, 255, 1);
}
.navbar {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: rgba(245, 247, 250, 1);
  border-radius: 4px;
}
.navbar span {
  position: absolute;
  left: 50%;
  top: 0px;
}
.navbar .fl {
  text-align: center;
  width: 50%;
  cursor: pointer;
}
.outBusinessDetails {
  padding: 0 32px 16px;
}
.outBusinessDetails header > ul {
  margin-bottom: 24px;
  margin-right: 24px;
}
.outBusinessDetails header > ul:nth-child(1),
.outBusinessDetails header > ul:nth-child(3) {
  width: 255px;
  /* height: 176px; */
  border-radius: 4px;
  border: 1px solid rgba(236, 239, 245, 1);
}
.outBusinessDetails header > ul:nth-child(3) {
  margin-right: 0px;
}
.outBusinessDetails header > ul:nth-child(2) {
  /* margin-left: 280px; */
  /* height: 176px; */
  /* width: 612px; */
  border-radius: 4px;
  border: 1px solid rgba(236, 239, 245, 1);
}
.outBusinessDetails header > ul:nth-child(2) li > div:nth-child(1) {
  width: 356px;
}
.outBusinessDetails header ul > li {
  padding:0 16px;
  line-height: 58px;
  height: 58px;
}
.outBusinessDetails header .another li {
  line-height: 44px;
  height: 44px;
}
.outBusinessDetails header ul > li > span {
  margin-right: 10px;
}
.outBusinessDetails .infoHead {
  border-bottom: 2px solid #e6e9f0;
}
.outBusinessDetails .infoHead div {
  padding-bottom: 8px;
}
.outBusinessDetails .infoHead .fl {
  padding-left: 12px;
  position: relative;
  color: #5376ff;
}
.outBusinessDetails .infoHead .fl i {
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 80px;
  height: 3px;
  background: #5376ff;
}
.outBusinessDetails .info {
  margin-bottom: 25px;
}
.outBusinessDetails .section {
  margin-bottom: 24px;
}
.outBusinessDetails .section .headClass {
  color: #a3adc8;
}
.outBusinessDetails .section .addRow {
  margin-top: 25px;
  color: #5376ff;
}
.outBusinessDetails .section .addRow i {
  margin-right: 8px;
}
.outBusinessDetails .section .total {
  margin-top: 27px;
}
.outBusinessDetails .section .total .top {
  margin-bottom: 16px;
  color: #596689;
}
.outBusinessDetails .section .total .top i {
  margin-right: 6px;
}
.outBusinessDetails .section .total li {
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
.outBusinessDetails .section .total li .txt {
  line-height: 26px;
  font-size: 12px;
  color: rgba(163, 173, 200, 1);
}
.outBusinessDetails .section .total li .num {
  line-height: 26px;
  font-size: 18px;
  font-weight: 500;
  color: rgba(50, 62, 97, 1);
}
.outBusinessDetails .section .headerClass {
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
  padding: 16px 16px;
  height: 170px;
  background: rgba(245, 246, 250, 1);
  border-radius: 4px;
  border: 1px solid rgba(236, 239, 245, 1);
  margin-right: 24px;
}
.option li.list {
  /* width: 240px; */
}
.hide {
  display: none;
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
