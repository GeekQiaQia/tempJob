<template>
  <div class="inventoryManagement">
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
          <div class="fl">在库状态：</div>
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
          <div class="fl">入库方式：</div>
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
          <div class="fl">可转让：</div>
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
      <!-- <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="ticketListSearch.keyword" clearable></el-input> -->
      <el-input
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        v-model="ticketListSearch.keyword"
        clearable
        @keyup.enter.native="searchEnterFun"
      ></el-input>
    </div>
    <div class="banner">
      <ul class="clearfix">
        <li>
          <!-- <router-link to="/outgoingBill">
            <i class="el-icon-lx-shenpi"></i>
            <span>出库</span>
          </router-link>-->

          <button @click="handleOutGoingBill">
            <i class="el-icon-lx-shenpi"></i>
            <span>出库</span>
          </button>
        </li>
        <!-- <li>
          <button>
            <i class="el-icon-lx-shenpi"></i>
            <span>导出</span>
          </button>
        </li>-->
      </ul>
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
        <el-table-column type="selection" width="55" disabled fixed></el-table-column>
        <el-table-column prop="ticketNo" label="票号" min-width="120" width="200" fixed></el-table-column>
        <el-table-column
          fixed
          prop="businessNo"
          label="业务单号"
          min-width="180"
          class-name="businessNumber_"
        >
          <template slot-scope="scope">
            <router-link
              :to="'/businessDetails?id='+scope.row['latestInFlowId']"
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
            <span
              v-if="v.field=='outChannelType'"
            >{{scope.row[v.field]==31001 ? '通道':(scope.row[v.field]==31002 ?'单边行':(scope.row[v.field]==31003 ?'企业':''))}}</span>
            <span
              v-else-if="v.field=='mediaType'"
            >{{scope.row[v.field]==11001 ? '电票':(scope.row[v.field]==11002 ? '纸票':'')}}</span>
            <span
              v-else-if="v.field=='calInterestType' || v.field=='outCalInterestType'"
            >{{scope.row[v.field]=='13001' ? '年息%':'元/每十万'}}</span>
            <span
              v-else-if="v.field=='inStockType'"
            >{{scope.row[v.field]==21001 ? '买入':(scope.row[v.field]==21002 ? '签票':'')}}</span>
            <span
              v-else-if="v.field=='canTransfer'"
            >{{scope.row[v.field]==0? '不可转让':scope.row[v.field]==1 ? '可转让':''}}</span>
            <span
              v-else-if="v.field=='ticketType'"
            >{{scope.row[v.field]==12001 ? '银承':(scope.row[v.field]==12002 ?'商承':'')}}</span>
            <span
              v-else-if="v.field=='ticketStatus'"
            >{{scope.row[v.field]==10001 ? '在库':(scope.row[v.field]==10002 ? '待出库':'')}}</span>
            <span v-else>{{scope.row[v.field]}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-popover ref="popover4" placement="bottom-end" width="562" trigger="click">
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
        :page-size="ticketListSearch.pageSize"
        layout="sizes, prev, pager, next"
        :total="count"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { ticket_list } from "@/api/api";
export default {
  name: "inventoryManagement",
  data() {
    return {
      columns: [
        { field: "ticketType", label: "票据类型", width: 100 },
        { field: "ticketAmount", label: "票面金额", width: 130 },
        { field: "drawer", label: "出票人", width: 120 },
        { field: "receiver", label: "收款人", width: 120 },
        { field: "accepter", label: "承兑人", width: 120 },
        { field: "draftDate", label: "出票日", width: 120 },
        { field: "expireDate", label: "到期日", width: 120 },
        { field: "dayNum", label: "剩余天数", width: 120 },
        { field: "inStockType", label: "入库方式", width: 120 },
        { field: "holderTicketDays", label: "持票天数", width: 120 }
      ],
      columns_: [
        { field: "mediaType", label: "介质", width: 100 },
        { field: "ticketType", label: "票据类型", width: 100 },
        { field: "inStockType", label: "入库方式", width: 120 },
        { field: "holderTicketDays", label: "持票天数", width: 120 },
        { field: "ticketAmount", label: "票面金额", width: 130 },
        { field: "draftDate", label: "出票日", width: 120 },
        { field: "expireDate", label: "到期日", width: 120 },
        { field: "drawer", label: "出票人", width: 120 },
        { field: "drawerAccountNo", label: "出票人账号", width: 120 },
        { field: "drawerBank", label: "出票人开户行", width: 120 },
        { field: "receiver", label: "收款人", width: 120 },
        { field: "receiverAccountNo", label: "收款人账号", width: 120 },
        { field: "receiverBank", label: "收款人开户行", width: 120 },
        { field: "accepter", label: "承兑人", width: 120 },
        { field: "accepterAccountNo", label: "承兑人账号", width: 120 },
        { field: "accepterBank", label: "承兑人开户行", width: 120 },
        { field: "accepterBankNo", label: "承兑人开户行行号", width: 120 },
        { field: "canTransfer", label: "是否可转让", width: 120 },
        { field: "plusDay", label: "加天", width: 120 },
        { field: "dayNum", label: "剩余天数", width: 120 },
        { field: "stockPrice", label: "入库价格", width: 120 },
        { field: "calInterestType", label: "计息方式", width: 120 },
        { field: "ticketStatus", label: "在库状态", width: 120 },
        { field: "inStockDate", label: "入库日期", width: 120 }
      ],
      timeDate: "",
      billType_current: 0,
      billType: [
        { title: "全部", value: "" },
        { title: "银承", value: 12001 },
        { title: "商承", value: 12002 }
      ],
      applyStatus_current: 0,
      checkList: [],
      applyStatus: [
        { title: "全部", value: "" },
        { title: "签票", value: 21002 },
        { title: "买入", value: 21001 }
      ],
      medium_current: 0,
      medium: [
        { title: "全部", value: "" },
        { title: "纸票", value: 11002 },
        { title: "电票", value: 11001 }
      ],
      warehousingMmode_current: 0,
      warehousingMmode: [
        { title: "全部", value: "" },
        { title: "可转让", value: 1 },
        { title: "不可转让", value: 0 }
      ],
      payType_current: 0,
      payTypes: [
        { title: "全部", value: "" },
        { title: "在库", value: 10001 },
        { title: "待出库", value: 10002 }
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
      resultData: {},
      tableData3: [],
      multipleSelection: [],
      currentPage: 1,
      count: 1,
      ticketListSearch: {
        ticketType: "",
        mediaType: "",
        canTransfer: "",
        ticketStatus: "",
        inStockType: "",
        applyStartDate: "",
        applyEndDate: "",
        keyword: "",
        pageSize: 10,
        pageNo: 1
      }
    };
  },
  methods: {
    handleCheckList(value) {
      let columns_temp = [];
      let columns_ = JSON.parse(JSON.stringify(this.columns_));
      columns_ &&
        columns_.map(function(v, i) {
          value &&
            value.map(function(val, inx) {
              if (v.label == val) {
                columns_temp.push(v);
              }
            });
        });
      this.columns = columns_temp;
    },
    // 日期插件
    changeDate(value) {
      let applyStartDate = value[0];
      this.ticketListSearch.applyStartDate =
        applyStartDate &&
        applyStartDate.substr(0, 4) +
          applyStartDate.substr(5, 2) +
          applyStartDate.substr(8, 2);
      let applyEndDate = value[1];
      this.ticketListSearch.applyEndDate =
        applyEndDate &&
        applyEndDate.substr(0, 4) +
          applyEndDate.substr(5, 2) +
          applyEndDate.substr(8, 2);
      this.ticket_list();
    },
    handleOutGoingBill() {
      let that = this;
      if (
        this.resultData.isCanReview ||
        this.resultData.isCanApprove ||
        this.resultData.isCanFinal
      ) {
        this.$message({
          message: "只有业务岗才能出库操作",
          type: "warning"
        });
        return;
      }
      let multipleSelection = this.multipleSelection;
      if (multipleSelection.length == 0) {
        this.$message({
          message: "请先选中再出库",
          type: "warning"
        });
        return false;
      }
      let id = "";
      let flag = false;
      let flagT = true;
      multipleSelection &&
        multipleSelection.map(function(v, i) {
          if (
            v.mediaType != multipleSelection[0].mediaType ||
            v.ticketType != multipleSelection[0].ticketType
          ) {
            flagT = false;
            return false;
          }
          if (v.id) {
            id += v.id + ",";
          }
          if (v.ticketStatus != 10001) {
            flag = true;
          }
        });
      if (!flagT) {
        this.$message.error("票据介质和票据类型必须保持一致！");
        return;
      }
      if (flag) {
        that.$message({
          message: "只能选择在库状态票据出库！",
          type: "warning"
        });
        return;
      }

      id = id.slice(0, id.length - 1);
      this.$router.push({
        path: "/outgoingBill",
        query: {
          id: id
        }
      });
    },
    handleSelectionChange(val) {
      let flag = true;
      let mediaType_init = val[0].mediaType;
      let ticketType_init = val[0].ticketType;
      val &&
        val.map(function(v, i) {
          if (
            v.mediaType != mediaType_init ||
            v.ticketType != ticketType_init
          ) {
            flag = false;
            return false;
          }
        });
      this.multipleSelection = val;
      if (!flag) {
        this.$message.error("票据介质和票据类型必须保持一致！");
      }
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      let ticketListSearch = this.ticketListSearch;
      ticketListSearch.pageSize = val;
      ticketListSearch.pageNo = 1;
      this.ticket_list();
    },
    handlePage(value) {
      let ticketListSearch = this.ticketListSearch;
      ticketListSearch.pageNo = value;
      this.ticket_list();
    },
    
    ticket_list() {
      let that=this;
      let param = {
        applyEndDate: this.ticketListSearch.applyEndDate,
        applyStartDate: this.ticketListSearch.applyStartDate,
        canTransfer: this.ticketListSearch.canTransfer,
        inStockType: this.ticketListSearch.inStockType,
        keyword: this.ticketListSearch.keyword,
        mediaType: this.ticketListSearch.mediaType,
        pageNo: this.ticketListSearch.pageNo || 1,
        pageSize: this.ticketListSearch.pageSize,
        ticketStatus: this.ticketListSearch.ticketStatus,
        ticketType: this.ticketListSearch.ticketType
      };
      ticket_list(param).then(res => {
        if (res && res.data && res.data.CODE == "200") {
          let tableData3 = res.data.RESULT.list;
          tableData3 && tableData3.map(function(v,i) {
            v.dayNum=that.checkData.DateCalculate(v.expireDate,v.plusDay)
          })
          this.tableData3 = tableData3;
          this.count = res.data.RESULT.count;
          this.resultData = res.data.RESULT;
          let columns = this.columns;
          let checkList = [];
          columns &&
            columns.map(function(v, i) {
              checkList.push(v.label);
            });
          this.checkList = checkList;
        } else {
          this.$message.error(res && res.data && res.data.MESSAGE);
        }
      });
    },
    searchEnterFun(e) {
      var keyCode = window.event ? e.keyCode : e.which;
      if (keyCode == 13) {
        this.ticket_list();
      }
    },
    toNew(id, value) {
      if (value == "20003") {
        this.$router.push({ path: "/warehousingReview", query: { id: id } });
      }
    },
    addClass_billType(value, index) {
      this.billType_current = index;
      this.ticketListSearch.ticketType = value;
      this.ticket_list();
    },
    addClass_applyStatus(value, index) {
      this.applyStatus_current = index;
      this.ticketListSearch.inStockType = value;
      this.ticket_list();
    },
    addClass_medium(value, index) {
      this.medium_current = index;
      this.ticketListSearch.mediaType = value;
      this.ticket_list();
    },
    addClass_warehousingMmode(value, index) {
      this.warehousingMmode_current = index;
      this.ticketListSearch.canTransfer = value;
      this.ticket_list();
    },
    handle_payTypes(value, index) {
      this.payType_current = index;
      this.ticketListSearch.ticketStatus = value;
      this.ticket_list();
    }
  },
  created() {
    this.ticket_list({});
  }
};
</script>

<style scoped>
.search_ {
  margin-bottom: 10px;
  padding-right: 42px;
}
.inventoryManagement {
  font-size: 14px;
  padding: 21px 0px 0 32px;
}
.inventoryManagement .nav {
  color: #596689;
}
.inventoryManagement .nav .nav_section {
  float: left;
}
.inventoryManagement .nav .nav_section:nth-child(1),
.inventoryManagement .nav .nav_section:nth-child(2) {
  margin-right: 45px;
}
.inventoryManagement .nav .tab {
  line-height: 30px;
  height: 30px;
}
.inventoryManagement .nav .tab > div:nth-child(1) {
  width: 78px;
  font-weight: 600;
}
.inventoryManagement .nav .tab {
  margin-bottom: 24px;
}
.inventoryManagement .nav ul li {
  float: left;
  padding: 0 12px;
  margin-left: 8px;
  cursor: pointer;
}
.inventoryManagement .nav ul li:nth-child(1) {
  margin-left: 0;
}
.inventoryManagement .nav ul li.ischeck {
  background: rgba(229, 237, 255, 1);
  border-radius: 2px;
  color: #5376ff;
}
.inventoryManagement .banner {
  margin-bottom: 24px;
}
.inventoryManagement .banner li {
  float: left;
  margin-right: 5px;
  text-align: center;
  width: 78px;
  height: 32px;
  line-height: 32px;
  border-radius: 2px;
}
.inventoryManagement .banner li button {
  background: rgba(83, 118, 255, 1);
  cursor: pointer;
  width: 100%;
  height: 100%;
  color: #fff;
  border: 0;
}
.inventoryManagement .banner li span {
  margin-left: 5px;
}
.inventoryManagement .con {
  position: relative;
  min-height: 440px;
  padding-right: 42px;
}
.inventoryManagement .con > ul {
  position: absolute;
  right: 34px;
  top: 9px;
  z-index: 1000;
  padding: 5px;
  cursor: pointer;
  background: #fff;
}
.inventoryManagement .con > ul li {
  width: 3px;
  height: 3px;
  margin-bottom: 2px;
  border-radius: 50%;
  background: rgba(163, 173, 200, 1);
}
.inventoryManagement .con .businessNumber_ a {
  color: rgba(83, 118, 255, 1);
}
.inventoryManagement .page {
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
