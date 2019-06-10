<template>
  <div class="warehousingApplication">
    <div class="nav clearfix">
      <div class="nav_section">
        <div class="tab clearfix">
          <div class="fl">票据类型：</div>
          <ul class="fl clearfix">
            <li
              v-for="(item,index) in billType"
              v-on:click="addClass_billType(item.value,index)"
              v-bind:class="{ischeck:index==billType_current}"
            >{{item.title}}</li>
          </ul>
        </div>
        <div class="tab clearfix">
          <div class="fl">打款方式：</div>
          <ul class="fl clearfix">
            <li
              v-for="(item,index) in payTypes"
              v-on:click="handle_payTypes(item.value,index)"
              v-bind:class="{ischeck:index==payType_current}"
            >{{item.title}}</li>
          </ul>
        </div>
      </div>
      <div class="nav_section">
        <div class="tab clearfix">
          <div class="fl">介质：</div>
          <ul class="fl clearfix">
            <li
              v-for="(item,index) in medium"
              v-on:click="addClass_medium(item.value,index)"
              v-bind:class="{ischeck:index==medium_current}"
            >{{item.title}}</li>
          </ul>
        </div>
        <div class="tab clearfix">
          <div class="fl">申请状态：</div>
          <ul class="fl clearfix">
            <li
              v-for="(item,index) in applyStatus"
              v-on:click="addClass_applyStatus(item.value,index)"
              v-bind:class="{ischeck:index==applyStatus_current}"
            >{{item.title}}</li>
          </ul>
        </div>
      </div>
      <div class="nav_section">
        <div class="tab clearfix">
          <div class="fl">入库方式：</div>
          <ul class="fl clearfix">
            <li
              v-for="(item,index) in warehousingMmode"
              v-on:click="addClass_warehousingMmode(item.value,index)"
              v-bind:class="{ischeck:index==warehousingMmode_current}"
            >{{item.title}}</li>
          </ul>
        </div>
        <div class="tab clearfix">
          <div class="fl">申请时间：</div>
          <el-date-picker
            v-model="timeDate"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions2"
            value-format="yyyy-MM-dd"
            @change="changeDate"
          ></el-date-picker>
        </div>
      </div>
    </div>
    <div class="search_">
      <!-- <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="BillInStockFlow.keyword" clearable></el-input> -->
      <el-input
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        v-model="BillInStockFlow.keyword"
        clearable
        @keyup.enter.native="searchEnterFun"
      ></el-input>
    </div>
    <div class="con">
      <ul v-popover:popover4>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <el-table
        ref="multipleTable"
        :data="tableData3"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column fixed label="操作" min-width="50" class-name="businessNumber_">
          <template slot-scope="scope">
            <i
              class="el-icon-lx-fuhe"
              style="cursor:pointer;padding:8px;"
              @click="toNew(scope.row['id'],scope.row['jobType'],scope.row['auditFlag'],scope.row['auditStatus'])"
              v-if="(scope.row['jobType']==1100 && scope.row['auditStatus']==20001)"
              title="复核"
            ></i>
            <i
              class="el-icon-lx-anniubianji"
              style="cursor:pointer;padding:8px;"
              @click="toNew(scope.row['id'],scope.row['jobType'],scope.row['auditFlag'],scope.row['auditStatus'])"
              v-if="(scope.row['jobType']==1103 || scope.row['jobType']==1100 ) && scope.row['auditStatus']==20000"
              title="编辑"
            ></i>
            <i
              class="el-icon-lx-shenpi"
              style="cursor:pointer;padding:8px;"
              @click="toNew(scope.row['id'],scope.row['jobType'],scope.row['auditFlag'],scope.row['auditStatus'])"
              v-if="scope.row['jobType']==1101 && scope.row['auditStatus']==20002"
              title="审核"
            ></i>
            <i
              class="el-icon-lx-zhongshen"
              style="cursor:pointer;padding:8px;"
              @click="toNew(scope.row['id'],scope.row['jobType'],scope.row['auditFlag'],scope.row['auditStatus'])"
              v-if="scope.row['jobType']==1102 && scope.row['auditStatus']==20003"
              title="终审"
            ></i>
          </template>
        </el-table-column>
        <el-table-column 
          fixed
          prop="businessNo"
          label="业务单号"
          min-width="180"
          class-name="businessNumber_"
        >
          <template slot-scope="scope">
            <router-link
              :to="'/businessDetails?id='+scope.row['id']"
            >{{scope.row['businessNo']}}</router-link>
            </template>
        </el-table-column>
        <el-table-column
          size="medium"
          v-for="(v,i) in columns"
          :prop="v.field"
          :label="v.label"
          :width="v.width"
          align="center"
        >
          <template slot-scope="scope">
              <span v-if="v.field=='ticketType'">{{scope.row[v.field]==12001 ? '银承':'商承'}}</span>
              <span v-else-if="v.field=='payType'">{{scope.row[v.field]==40001 ? '先背':'先打'}}</span>
              <span v-else-if="v.field=='mediaType'">{{scope.row[v.field]==11001 ? '电票':'纸票'}}</span>
              <span v-else-if="v.field=='inStockType'">{{scope.row[v.field]==21001 ? '买入':'签票'}}</span>
              <span v-else>{{scope.row[v.field]}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-popover ref="popover4" placement="bottom-end" width="502" trigger="click">
      <el-checkbox-group v-model="checkList" @change="handleCheckList">
        <el-checkbox :label="item.label" v-for="item in columns_"></el-checkbox>
      </el-checkbox-group>
    </el-popover>
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
</template>
<script>
import { queryInStockFlowBussiness } from "@/api/api";
export default {
  name: "warehousingApplication",
  data() {
    return {
      // 可选导航
      columns: [
        // { field: "businessNo", label: "业务单号", width: 180 },
        { field: "ticketAmountTotal", label: "票面金额合计", width: 180 },
        { field: "inPayMoneyTotal", label: "入库放款合计", width: 100 },
        { field: "receiveCompany", label: "收款企业", width: 100 },
        { field: "openAccountBank", label: "开户行", width: 100 },
        { field: "accountNo", label: "账号", width: 100 },
        { field: "bigLineNo", label: "大额行号", width: 100 },
        { field: "contactPerson", label: "联系人", width: 100 },
        { field: "contactPhone", label: "联系电话", width: 100 },
        { field: "applyUserName", label: "申请人", width: 100 },
        { field: "departmentName", label: "所属部门", width: 100 },
        { field: "auditStatusName", label: "申请状态", width: 100 },
        { field: "createDate", label: "申请日期", width: 100 }
      ],
      columns_: [
        // { field: "businessNo", label: "业务单号", width: 180 },
        { field: "ticketType", label: "票据类型", width: 180 },
        { field: "ticketAmountTotal", label: "票面金额合计", width: 180 },
        { field: "inPayMoneyTotal", label: "入库放款合计", width: 100 },
        { field: "payType", label: "打款方式", width: 100 },
        { field: "receiveCompany", label: "收款企业", width: 100 },
        { field: "openAccountBank", label: "开户行", width: 100 },
        { field: "accountNo", label: "账号", width: 100 },
        { field: "contactPerson", label: "联系人", width: 100 },
        { field: "postName", label: "职务", width: 100 },
        { field: "bigLineNo", label: "大额行号", width: 100 },
        { field: "contactPhone", label: "联系电话", width: 100 },
        { field: "applyUserName", label: "申请人", width: 100 },
        { field: "departmentName", label: "所属部门", width: 100 },
        { field: "mediaType", label: "介质", width: 100 },
        { field: "auditStatusName", label: "申请状态", width: 100 },
        { field: "inStockType", label: "入库类型", width: 100 },
        { field: "eleRemitCostTotal", label: "电汇费合计", width: 100 },
        { field: "createDate", label: "申请日期", width: 100 },
        { field: "reviewDate", label: "复核日期", width: 100 },
        { field: "approvalLDate", label: "审批日期", width: 100 },
      ],
      pageSize: 10,
      timeDate: "",
      billType_current: 0,
      billType: [
        { title: "全部", value: "" },
        { title: "银承", value: "12001" },
        { title: "商承", value: "12002" }
      ],
      applyStatus_current: 0,
      checkList: [
      ],
      applyStatus: [
        { title: "全部", value: "" },
        { title: "已拒绝", value: "20000" },
        { title: "待复核", value: "20001" },
        { title: "待审批", value: "20002" },
        { title: "待终审", value: "20003" }
      ],
      medium_current: 0,
      medium: [
        { title: "全部", value: "" },
        { title: "电票", value: "11001" },
        { title: "纸票", value: "11002" }
      ],
      warehousingMmode_current: 0,
      warehousingMmode: [
        { title: "全部", value: "" },
        { title: "买入", value: "21001" },
        { title: "签票", value: "21002" }
      ],
      payType_current: 0,
      payTypes: [
        { title: "全部", value: "" },
        { title: "先背", value: "40001" },
        { title: "先打", value: "40002" }
      ],
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      tableData3: [],
      multipleSelection: [],
      currentPage: 1,
      count: 1,
      BillInStockFlow: {
        ticketType: "",
        mediaType: "",
        inStockType: "",
        payType: "",
        auditStatus: "",
        startTime: "",
        endTime: "",
        keyword: ""
      }
    };
  },
  methods: {
    handleCheckList(value) {
      let columns_temp=[];
      let columns_=JSON.parse(JSON.stringify(this.columns_));
         columns_ && columns_.map(function(v,i) {
          value && value.map(function(val,inx) {
            if(v.label==val){
              columns_temp.push(v);
            }
          })
        })
        this.columns=columns_temp;
    },
    changeDate(value) {
      if (value) {
        let startTime = value[0];
        let endTime = value[1];
        this.BillInStockFlow.startTime =
          startTime &&
          startTime.substr(0, 4) +
            startTime.substr(5, 2) +
            startTime.substr(8, 2);
        this.BillInStockFlow.endTime =
          endTime &&
          endTime.substr(0, 4) + endTime.substr(5, 2) + endTime.substr(8, 2);
      } else {
        this.BillInStockFlow.startTime = "";
        this.BillInStockFlow.endTime = "";
      }
      this.queryInStockFlowBussiness(this.BillInStockFlow);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      let BillInStockFlow = this.BillInStockFlow;
      BillInStockFlow.pageSize = val;
      BillInStockFlow.pageNo = 1;
      this.queryInStockFlowBussiness(BillInStockFlow);
    },
    handlePage(value) {
      let BillInStockFlow = this.BillInStockFlow;
      BillInStockFlow.pageNo = value;
      this.queryInStockFlowBussiness(BillInStockFlow);
    },
    queryInStockFlowBussiness(param) {
      queryInStockFlowBussiness(param).then(res => {
        if (res && res.data && res.data.CODE == "200") {
          this.tableData3 = res.data.RESULT.list;
          this.count = res.data.RESULT.count;
          let columns=this.columns;
          let checkList=[]
          columns && columns.map(function(v,i) {
            checkList.push(v.label)
          })
          this.checkList=checkList;
        } else {
          this.$message.error(res && res.data && res.data.MESSAGE);
        }
      });
    },
    searchEnterFun(e) {
      var keyCode = window.event ? e.keyCode : e.which;
      if (keyCode == 13) {
        this.queryInStockFlowBussiness(this.BillInStockFlow);
      }
    },
    toNew(id, jobType, auditFlag, auditStatus) {
      // if(value1==1103 && value2){
      //   this.$router.push({ path: "/warehousingReview",query:{id:id}});
      // }
      // 当前岗位id:1100:待审核,1101:待审批,1102:待终审,1103:业务岗
      // 审核状态(已拒绝:20000,待复核:20001,待审批:20002,待终审:20003)
      if (jobType == 1103) {
        if (auditStatus == 20001) {
          this.$router.push({
            path: "/warehousingReview",
            query: { id: id, edit: true, auditFlag: auditFlag }
          });
        }
        if (auditStatus == 20003) {
          this.$router.push({
            path: "/finalAppeal",
            query: { id: id, edit: true, auditFlag: auditFlag }
          });
        }
        if (auditStatus == 20002) {
          this.$router.push({
            path: "/warehousingApproval",
            query: { id: id, edit: true, auditFlag: auditFlag }
          });
        }
        if (auditStatus == 20000) {
          this.$router.push({
            path: "/editWarehousing",
            query: { id: id, edit: true, auditFlag: auditFlag }
          });
        }
      }
      if (jobType == 1100) {
        if (auditStatus == 20001) {
          this.$router.push({
            path: "/warehousingReview",
            query: { id: id, auditFlag: auditFlag }
          });
        }
        if (auditStatus == 20004) {
          this.$router.push({
            path: "/finalAppeal",
            query: { id: id, edit: true, auditFlag: auditFlag }
          });
        }
        if (auditStatus == 20000) {
          this.$router.push({
            path: "/editWarehousing",
            query: { id: id, edit: true, auditFlag: auditFlag }
          });
        }
      }
      if (jobType == 1100 && auditStatus == 20001) {
        this.$router.push({
          path: "/warehousingReview",
          query: { id: id, auditFlag: auditFlag }
        });
      }
      if (jobType == 1101 && auditFlag) {
        this.$router.push({ path: "/warehousingApproval", query: { id: id } });
      }
      if (jobType == 1102 && auditFlag) {
        this.$router.push({ path: "/finalAppeal", query: { id: id } });
      }
    },
    addClass_billType(value, index) {
      this.billType_current = index;
      this.BillInStockFlow.ticketType = value;
      this.queryInStockFlowBussiness(this.BillInStockFlow);
    },
    addClass_applyStatus(value, index) {
      this.applyStatus_current = index;
      this.BillInStockFlow.auditStatus = value;
      this.queryInStockFlowBussiness(this.BillInStockFlow);
    },
    addClass_medium(value, index) {
      this.medium_current = index;
      this.BillInStockFlow.mediaType = value;
      this.queryInStockFlowBussiness(this.BillInStockFlow);
    },
    addClass_warehousingMmode(value, index) {
      this.warehousingMmode_current = index;
      this.BillInStockFlow.inStockType = value;
      this.queryInStockFlowBussiness(this.BillInStockFlow);
    },
    handle_payTypes(value, index) {
      this.payType_current = index;
      this.BillInStockFlow.payType = value;
      this.queryInStockFlowBussiness(this.BillInStockFlow);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  },
  created() {
    this.queryInStockFlowBussiness(this.BillInStockFlow);
  }
};
</script>

<style scoped>
.search_ {
  margin-bottom: 10px;
  padding-right: 42px;
}
.warehousingApplication {
  font-size: 14px;
  padding: 21px 0px 0 32px;
}
.warehousingApplication .nav {
  color: #596689;
}
.warehousingApplication .nav .nav_section {
  float: left;
}
.warehousingApplication .nav .nav_section:nth-child(1) {
  margin-right: 45px;
}
.warehousingApplication .nav .nav_section:nth-child(2) {
  margin-right: 12px;
}
.warehousingApplication .nav .tab {
  line-height: 30px;
  height: 30px;
}
.warehousingApplication .nav .tab > div:nth-child(1) {
  width: 78px;
  font-weight: 600;
}
.warehousingApplication .nav .tab {
  margin-bottom: 24px;
}
.warehousingApplication .nav ul li {
  float: left;
  padding: 0 12px;
  margin-left: 8px;
  cursor: pointer;
}
.warehousingApplication .nav ul li:nth-child(1) {
  margin-left: 0;
}
.warehousingApplication .nav ul li.ischeck {
  background: rgba(229, 237, 255, 1);
  border-radius: 2px;
  color: #5376ff;
}
.warehousingApplication .banner {
  margin-bottom: 24px;
}
.warehousingApplication .banner li {
  float: left;
  margin-right: 5px;
  text-align: center;
  width: 78px;
  height: 32px;
  line-height: 32px;
  background: rgba(83, 118, 255, 1);
  border-radius: 2px;
}
.warehousingApplication .banner li a {
  display: block;
  width: 100%;
  height: 100%;
  color: #fff;
}
.warehousingApplication .banner li span {
  margin-left: 5px;
}
.warehousingApplication .con {
  position: relative;
  min-height: 440px;
  padding-right: 42px;
}
.warehousingApplication .con > ul {
  position: absolute;
  right: 34px;
  top: 9px;
  z-index: 1000;
  padding: 5px;
  cursor: pointer;
  background: #fff;
}
.warehousingApplication .con > ul li {
  width: 3px;
  height: 3px;
  margin-bottom: 2px;
  border-radius: 50%;
  background: rgba(163, 173, 200, 1);
}
.warehousingApplication .con .businessNumber_ a {
  color: rgba(83, 118, 255, 1);
}
.warehousingApplication .page {
  margin-top: 24px;
  text-align: right;
}
.el-range-editor--small.el-input__inner {
  width: 437px;
}
.el-checkbox {
  padding-left: 35px;
  width: 33%;
  margin-right: 0;
  margin-bottom: 20px;
  box-sizing: border-box;
}
.el-checkbox:last-child {
  margin-bottom: 0px;
}
</style>
