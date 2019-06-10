<template>
  <div class="businessAccount">
    <nav class="info">
      <div class="infoHead clearfix">
        <div class="fl">
          票据信息
          <i></i>
        </div>
        <div
          class="fl"
          v-on:click="handleTab(20015)"
          :class="{active:warehousingObj.inOutStockFlag==20015}"
        >
          入库
          <i></i>
        </div>
        <div
          class="fl"
          v-on:click="handleTab(50005)"
          :class="{active:warehousingObj.inOutStockFlag==50005}"
        >
          出库
          <i></i>
        </div>
      </div>
    </nav>
    <div class="nav clearfix">
      <div class="clearfix">
        <div class="tab clearfix">
          <div class="fl">票据类型：</div>
          <ul class="fl clearfix">
            <li
              v-for="(item,index) in billType"
              v-on:click="addClass_billType(index,item)"
              v-bind:class="{ischeck:index==billType_current}"
            >{{item.title}}</li>
          </ul>
        </div>
        <div class="tab clearfix">
          <div class="fl">{{warehousingObj.inOutStockFlag==20015?'入库':'出库'}}时间：</div>
          <el-date-picker
            v-model="warehousingObj.startTime"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            @change="changeDate"
          ></el-date-picker>
        </div>
      </div>
      <div class="clearfix">
        <div class="tab clearfix">
          <div class="fl">介质：</div>
          <ul class="fl clearfix">
            <li
              v-for="(item,index) in warehousingMmode"
              v-on:click="addClass_warehousingMmode(index,item)"
              v-bind:class="{ischeck:index==warehousingMmode_current}"
            >{{item.title}}</li>
          </ul>
        </div>
        <!-- <div class="tab clearfix">
          <div class="fl">到期时间：</div>
          <el-date-picker
            v-model="warehousingObj.endTime"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            @change="changeDate_"
          ></el-date-picker>
        </div> -->
      </div>
    </div>
    <div class="content_table">
      <el-table ref="multipleTable" :data="tableData3" tooltip-effect="dark" style="width: 100%">
        <el-table-column
          size="medium"
          v-for="(v,i) in columns"
          :prop="v.field"
          :label="v.title"
          :min-width="v.width"
          align="center"
        >
          <template slot-scope="scope">
            <span
              v-if="v.field=='outChannelType'"
            >{{scope.row[v.field]==31001 ? '通道':(scope.row[v.field]==31002 ?'单边行':'企业')}}</span>
            <span v-else-if="v.field=='mediaType'">{{scope.row[v.field]==11001 ? '电票':'纸票'}}</span>
            <span v-else-if="v.field=='outStockType'">{{scope.row[v.field]==33001 ? '背书':'贴现'}}</span>
            <span v-else-if="v.field=='ticketType'">{{scope.row[v.field]==12001 ? '银承':'商承'}}</span>
            <span v-else-if="v.field=='opponentType'">{{scope.row[v.field]==32001 ? '企业':'银行'}}</span>
            <span v-else-if="v.field=='remark'" style="display:-webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden" :title="scope.row[v.field]">{{scope.row[v.field]}}</span>
            <span
              v-else-if="v.field=='auditStatus'"
            >{{scope.row[v.field]==50000 ?'已拒绝':(scope.row[v.field]==50001 ?'待复核':(scope.row[v.field]==50002 ?'待审批':(scope.row[v.field]==50003 ?'待终审':'终审通过')))}}</span>
            <span v-else>{{scope.row[v.field]}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
     <div class="page" v-if="count-0>=10">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handlePage"
        :current-page.sync="currentPage"
        :page-sizes="[10, 50, 100, 200]"
        :page-size="pageSize"
        layout="sizes, prev, pager, next"
        :total="count"
      ></el-pagination>
    </div>
  </div>
  </div>
</template>
<script>
import { getTotalForm } from "@/api/api";
export default {
  name: "businessAccount",
  data() {
    return {
      billType_current: 0,
      billType: [
        { title: "全部", value: "" },
        { title: "银承", value: 12001 },
        { title: "商承", value: 12002 }
      ],
      applyStatus_current: 0,
      applyStatus: [
        { title: "全部" },
        { title: "买入" },
        { title: "纸票" },
        { title: "电票" }
      ],
      warehousingMmode_current: 0,
      warehousingMmode: [
        { title: "全部", value: "" },
        { title: "纸票", value: 11002 },
        { title: "电票", value: 11001 }
      ],
      tableData3: [{}],
      currentPage:1,
      pageSize:10,
      count:0,
      warehousingObj: { ticketType: "", mediaType: "", inOutStockFlag: 20015,startTime:'',endTime:'' },
      billInStockFlow: {
        bussinessNo: "",
        mediaType: "",
        inStockDate: "",
        inStockType: "",
        ticketType: "",
        ticketNum: "",
        ticketAmountTotal: "",
        inPayMoneyTotal: "",
        payType: "",
        receiveCompany: "",
        accountNo: "",
        openAccountBank: "",
        bigLineNo: "",
        contactPerson: "",
        postName: "",
        contactPhone: "",
        applyUserName: "",
        departmentId: "",
        departmentName: "",
        remark: ""
      },
      columns: [
        { field: "businessNo", title: "业务单号", width: 230 },
        { field: "mediaType", title: "介质", width: 100 },
        { field: "inStockDate", title: "入库时间", width: 200 },
        { field: "inStockType", title: "入库类型", width: 100 },
        { field: "ticketType", title: "票据类型", width: 100 },
        { field: "ticketNum", title: "票据数量", width: 130 },
        { field: "ticketAmountTotal", title: "票面金额总计", width: 230 },
        { field: "inPayMoneyTotal", title: "入库放款合计", width: 300 },
        { field: "payType", title: "打款方式", width: 100 },
        { field: "receiveCompany", title: "收款企业", width: 100 },
        { field: "accountNo", title: "账号", width: 130 },
        { field: "openAccountBank", title: "开户行", width: 120 },
        { field: "bigLineNo", title: "大额行号", width: 100 },
        { field: "contactPerson", title: "联系人", width: 100 },
        { field: "postName", title: "职务", width: 120 },
        { field: "contactPhone", title: "联系电话", width: 130 },
        { field: "applyUserName", title: "申请人", width: 120 },
        { field: "departmentName", title: "所属部门", width: 100 },
        { field: "remark", title: "备注", width: 160 }
      ]
    };
  },
  methods: {
      handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      let warehousingObj=this.warehousingObj;
      warehousingObj.pageSize=val;
      warehousingObj.pageNo=1;
      this.getTotalForm(warehousingObj);

    },
    handlePage(value) {
      let warehousingObj=this.warehousingObj;
      warehousingObj.pageNo=value;
      this.getTotalForm(warehousingObj);
    },
    changeDate(value) {
      if (value) {
        let startTime = value;
        this.warehousingObj.startTime =
          value.substr(0, 4) +
            value.substr(5, 2) +
            value.substr(8, 2)
      } else {
        this.warehousingObj.startTime = "";
      }
      this.getTotalForm(this.warehousingObj);
    },
    changeDate_(value) {
      if (value) {
        let endTime = value;
        this.warehousingObj.endTime =
          value.substr(0, 4) +
            value.substr(5, 2) +
            value.substr(8, 2)
      } else {
        this.warehousingObj.endTime = "";
      }
      this.getTotalForm(this.warehousingObj);
    },
    handleTab(value) {
      this.warehousingObj.inOutStockFlag = value;
      if(value==20015){
       this.columns= [
        { field: "businessNo", title: "业务单号", width: 230 },
        { field: "mediaType", title: "介质", width: 100 },
        { field: "inStockDate", title: "入库时间", width: 100 },
        { field: "inStockType", title: "入库类型", width: 100 },
        { field: "ticketType", title: "票据类型", width: 100 },
        { field: "ticketNum", title: "票据数量", width: 130 },
        { field: "ticketAmountTotal", title: "票面金额总计", width: 230 },
        { field: "inPayMoneyTotal", title: "入库放款合计", width: 100 },
        { field: "payType", title: "打款方式", width: 100 },
        { field: "receiveCompany", title: "收款企业", width: 100 },
        { field: "accountNo", title: "账号", width: 130 },
        { field: "openAccountBank", title: "开户行", width: 120 },
        { field: "bigLineNo", title: "大额行号", width: 100 },
        { field: "contactPerson", title: "联系人", width: 100 },
        { field: "postName", title: "职务", width: 120 },
        { field: "contactPhone", title: "联系电话", width: 130 },
        { field: "applyUserName", title: "申请人", width: 120 },
        { field: "departmentName", title: "所属部门", width: 100 },
        { field: "remark", title: "备注", width: 160 }
      ] 
      }else {
        this.columns= [
        { field: "businessNo", title: "业务单号", width: 230 },
        { field: "mediaType", title: "介质", width: 100 },
        { field: "outStockDate", title: "出库时间", width: 100 },
        { field: "outStockType", title: "出库类型", width: 100 },
        { field: "ticketType", title: "票据类型", width: 100 },
        { field: "ticketNum", title: "票据数量", width: 130 },
        { field: "ticketAmountTotal", title: "票面金额总计", width: 230 },
        { field: "inPayMoneyTotal", title: "入库放款合计", width: 230 },//
        { field: "outReceiveMoneyTotal", title: "出库收款合计", width: 230 },//
        { field: "inInterestTotal", title: "入库利息总计", width: 230 },//
        { field: "outInterestTotal", title: "出库利息总计", width: 230 },//
        { field: "holderCostTotal", title: "持票总成本", width: 230 },//
        { field: "earnTotal", title: "总收益", width: 230 },//
        { field: "opponentType", title: "交易对手", width: 230 },//
        { field: "opponentCompany", title: "对手名称", width: 230 },//
        { field: "accountNo", title: "账号", width: 130 },
        { field: "openAccountBank", title: "开户行", width: 120 },
        { field: "bigLineNo", title: "大额行号", width: 100 },
        { field: "contactPerson", title: "联系人", width: 100 },
        { field: "postName", title: "职务", width: 120 },
        { field: "contactPhone", title: "联系电话", width: 130 },
         { field: "applyUserName", title: "申请人", width: 120 },
        { field: "applyDeptName", title: "所属部门", width: 100 },
        { field: "belongNickName", title: "归属人", width: 100 },
        { field: "remark", title: "备注", width: 160 }
      ]
      }
      this.getTotalForm(this.warehousingObj);
    },
    addClass_billType(index, value) {
      this.billType_current = index;
      this.warehousingObj.ticketType=value.value
      this.getTotalForm(this.warehousingObj);
    },
    addClass_warehousingMmode(index,value) {
      this.warehousingMmode_current = index;
      this.warehousingObj.mediaType=value.value
      this.getTotalForm(this.warehousingObj);
    },
    getTotalForm(param) {
      getTotalForm(param).then(res => {
        if (res && res.data && res.data.CODE == "200") {
          let tableData3 = res.data.RESULT.list;
          tableData3 && tableData3.map(function(v,i) {
            if(v.payType==40001){
              v.payType='先背'
            }else {
              v.payType='先打'
            }
             if(v.inStockType==21001){
              v.inStockType='买入'
            }else {
              v.inStockType='签票'
            }
          })
          
          this.tableData3=tableData3
          this.count = res.data.RESULT.count;
        } else {
          this.$message.error(res && res.data && res.data.MESSAGE);
        }
      });
    }
  },
  created() {
    this.getTotalForm(this.warehousingObj);
  }
};
</script>

<style scoped>
.businessAccount {
  font-size: 14px;
  padding: 21px 32px 0 32px;
}
.info {
  margin-bottom: 25px;
}
.info .infoHead {
  border-bottom: 2px solid #e6e9f0;
}
.info .infoHead div {
  cursor: pointer;
  text-align: center;
  width: 80px;
  padding-bottom: 8px;
}
.info .infoHead .fl.active {
  position: relative;
  color: #5376ff;
}
.info .infoHead .fl.active i {
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 80px;
  height: 3px;
  background: #5376ff;
}
.businessAccount .nav {
  color: #596689;
}
.businessAccount .nav > div {
  float: left;
  margin-right: 225px;
}
.businessAccount .nav .tab {
  line-height: 32px;
  height: 32px;
}
.businessAccount .nav .tab > div.fl {
  width: 78px;
}
.businessAccount .nav > div .tab {
  margin-bottom: 24px;
}
.businessAccount .nav ul li {
  float: left;
  padding: 0 12px;
  margin-left: 8px;
  cursor: pointer;
}
.businessAccount .nav ul li:nth-child(1) {
  margin-left: 0;
}
.businessAccount .nav ul li.ischeck {
  background: rgba(229, 237, 255, 1);
  border-radius: 2px;
  color: #5376ff;
}
.businessAccount .banner {
  margin-bottom: 24px;
}

.businessAccount .banner li {
  float: left;
  margin-right: 5px;
  text-align: center;
  width: 78px;
  height: 32px;
  line-height: 32px;
  background: rgba(83, 118, 255, 1);
  border-radius: 2px;
}
.businessAccount .banner li a {
  display: block;
  width: 100%;
  height: 100%;
  color: #fff;
}
.businessAccount .banner li span {
  margin-left: 5px;
}
.businessAccount .content_table {
  color: #323e61;
  min-height: 440px;
}

.businessAccount .page {
  margin-top: 24px;
  text-align: right;
}
</style>
