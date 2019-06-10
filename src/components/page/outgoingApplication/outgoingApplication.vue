<template>
  <div class="outgoingApplication">
    <div class="nav clearfix">
      <div class="nav_tab clearfix">
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
          <div class="fl">出库方式：</div>
          <ul class="fl clearfix">
            <li
              v-for="(item,index) in transferable"
              v-on:click="addClass_transferable(item.value,index)"
              v-bind:class="{ischeck:index==transferable_current}"
            >{{item.title}}</li>
          </ul>
        </div>
      </div>
      <div class="nav_tab clearfix">
        <div class="tab clearfix">
          <div class="fl">打款方式：</div>
          <ul class="fl clearfix">
            <li
              v-for="(item,index) in applyStatus"
              v-on:click="addClass_applyStatus(item.value,index)"
              v-bind:class="{ischeck:index==applyStatus_current}"
            >{{item.title}}</li>
          </ul>
        </div>
        <div class="tab clearfix">
          <div class="fl">申请状态：</div>
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
              <div class="apply_time fl">
                 <el-date-picker
                  size='small'
                  v-model="dateTime"
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
    </div>
    <div class="search_">
        <el-input
        placeholder="请输入内容"
        prefix-icon="el-icon-search"
        v-model="billOutSearch.keyword"
        clearable
        @keyup.enter.native="searchEnterFun"
      ></el-input>
    </div>
    <div class="content">
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
       <el-table-column
          fixed
          label="操作"
          min-width="150"
          class-name="businessNumber_"
        >
          <template slot-scope="scope">
           
            <i class="el-icon-lx-zhongshen" style="margin-right:13px;cursor:pointer" @click="toNew(scope.row['id'],scope.row['auditStatus'],scope.row['flowType'])"
            v-if="result.isCanFinal==true && scope.row['auditStatus']==50003"
            title="终审"
            >
            </i>
            <i class="el-icon-lx-shenpi" style="margin-right:13px;cursor:pointer" @click="toNew(scope.row['id'],scope.row['auditStatus'],scope.row['flowType'])"
            v-if="result.isCanApprove==true && scope.row['auditStatus']==50002"
            title="审批"
            >
            </i>
            <i class="el-icon-lx-fuhe" style="margin-right:13px;cursor:pointer" @click="toNew(scope.row['id'],scope.row['auditStatus'],scope.row['flowType'])"
            v-if="result.isCanReview==true && scope.row['auditStatus']==50001"
            title="复核"
            >
            </i>
            <i class="el-icon-lx-anniubianji" style="margin-right:13px;cursor:pointer" @click="toNew(scope.row['id'],scope.row['auditStatus'],scope.row['flowType'])"
            v-if="(result.isCanReview==true || result.isCanSubmit==true) && scope.row['auditStatus']==50000"
            title="编辑"
            >
            </i>
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
            <span style="color:#5376FF;cursor:pointer"  @click="toDetail(scope.row['id'],scope.row['flowType'])">{{scope.row['businessNo']}}</span>
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
              <span v-if="v.field=='outChannelType'">{{scope.row[v.field]==31001 ? '通道':(scope.row[v.field]==31002 ?'单边行':'企业')}}</span>
               <span v-else-if="v.field=='mediaType'">{{scope.row[v.field]==11001 ? '电票':'纸票'}}</span>
               <span v-else-if="v.field=='outStockType'">{{scope.row[v.field]==33001 ? '背书':'贴现'}}</span>
              <span v-else-if="v.field=='ticketType'">{{scope.row[v.field]==12001 ? '银承':'商承'}}</span>
              <span v-else-if="v.field=='opponentType'">{{scope.row[v.field]==32001 ? '企业':'银行'}}</span> 
              <span v-else-if="v.field=='auditStatus'">{{scope.row[v.field]==50000 ?'已拒绝':(scope.row[v.field]==50001 ?'待复核':(scope.row[v.field]==50002 ?'待审批':(scope.row[v.field]==50003 ?'待终审':'终审通过')))}}</span> 
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
        :page-size="pageSize"
        layout="sizes, prev, pager, next"
        :total="count"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { billOutStockFlow } from '@/api/api'
export default {
  name: "outgoingApplication",
  data() {
    return {
      checkList:[],
        columns: [
          { field: "mediaType", label: "介质", width: 230 },
          { field: "ticketType", label: "票据类型", width: 100 },
          { field: "ticketAmountTotal", label: "票面金额合计", width: 130 },
          { field: "inPayMoneyTotal", label: "入库放款合计", width: 230 },
          { field: "outReceiveMoneyTotal", label: "出库收款合计", width: 100 },
          { field: "earnTotal", label: "总收益", width: 100 },
          { field: "opponentCompany", label: "对手名称", width: 120 },
          { field: "contactPerson", label: "联系人", width: 120 },
          { field: "contactPhone", label: "联系电话", width: 100 },
          { field: "applyUserName", label: "申请人", width: 100 },
          { field: "applyDeptName", label: "所属部门", width: 120 },
          { field: "auditStatus", label: "状态", width: 100 },
          { field: "applyDate", label: "申请日期", width: 120 },
        ],
        columns_: [
          { field: "mediaType", label: "介质", width: 230 },
          { field: "outStockType", label: "出库类型", width: 100 },
          { field: "outChannelType", label: "出库渠道", width: 100 },
          { field: "ticketType", label: "票据类型", width: 100 },
          { field: "ticketNum", label: "票据数量", width: 100 },
          { field: "ticketAmountTotal", label: "票面金额合计", width: 130 },
          { field: "inPayMoneyTotal", label: "入库放款合计", width: 230 },
          { field: "outReceiveMoneyTotal", label: "出库金额合计", width: 100 },
          { field: "inInterestTotal", label: "入库利息合计", width: 100 },
          { field: "outInterestTotal", label: "出库利息合计", width: 100 },
          { field: "outReceiveMoneyTotal", label: "出库收款合计", width: 130 },
          { field: "holderCostTotal", label: "持票总成本", width: 120 },
          { field: "earnTotal", label: "总收益", width: 100 },
          { field: "opponentType", label: "交易对手", width: 100 },
          { field: "opponentCompany", label: "对手名称", width: 120 },
          { field: "accountNo", label: "账号", width: 130 },
          { field: "openAccountBank", label: "开户行", width: 120 },
          { field: "bigLineNo", label: "大额行号", width: 100 },
          { field: "contactPerson", label: "联系人", width: 120 },
          { field: "postName", label: "职务", width: 100 },
          { field: "contactPhone", label: "联系电话", width: 100 },
          { field: "applyUserName", label: "申请人", width: 100 },
          { field: "applyDeptName", label: "所属部门", width: 120 },
          { field: "belongNickName", label: "归属人", width: 100 },
          { field: "auditStatus", label: "状态", width: 100 },
          { field: "applyDate", label: "申请日期", width: 120 },
        ],
      dateTime: "",
      input21:'',
      billType_current: 0,
      billType: [{ title: "全部" }, { title: "银承",value:'12001' }, { title: "商承" ,value:'12002'}],
      applyStatus_current: 0,
      applyStatus: [
        { title: "全部",value:'' },
        { title: "先打",value:'40002' },
        { title: "先背",value:'40001' }
      ],
      medium_current: 0,
      medium: [{ title: "全部" ,value:''}, { title: "电票",value:'11001' }, { title: "纸票" ,value:'11002'}],
      warehousingMmode_current: 0,
      warehousingMmode: [
        { title: "全部",value:'' },
        { title: "待复核" ,value:'50001'},
        { title: "待审批",value:'50002' },
        { title: "待终审" ,value:'50003'},
        { title: "已拒绝" ,value:'50000'},
      ],
      transferable_current: 0,
      transferable: [
        { title: "全部",value:'' },
        { title: "背书" ,value:'33001'},
        { title: "贴现" ,value:'33002'}
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
      tableData3: [
        
      ],
      result:{},
      count:0,
      pageSize:10,
      currentPage:1,
      multipleSelection: [],
      billOutSearch:{
        ticketType:'',
        mediaType:'',	
        payType:'',
        auditStatus:'',
        outStockType:'',
        applyStartDate:'',
        applyEndDate:'',
        keyword:''
      }
    };
  },
  methods: {
    toDetail(id,flowType){
      let isCanSubmit=this.result.isCanSubmit;
      let isCanReview=this.result.isCanReview;
      let isCanApprove=this.result.isCanApprove;
      let isCanFinal=this.result.isCanFinal;
      let jobType;
      if(isCanSubmit){
        jobType= '1103'
      }
      if(isCanReview){
        jobType= '1100'
      }
      if(isCanApprove){
        jobType= '1101'
      }
      if(isCanFinal){
        jobType= '1102'
      }
      this.$router.push({ path: "/outBusinessDetails",query:{id:id,flowType:flowType,edit:true,jobType:jobType}});
    },
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
     // 日期插件
    changeDate(value) {
      if(value){
      let applyStartDate = value[0];
      this.billOutSearch.applyStartDate =
        applyStartDate &&
        applyStartDate.substr(0, 4) +
          applyStartDate.substr(5, 2) +
          applyStartDate.substr(8, 2);
      let applyEndDate = value[1];
      this.billOutSearch.applyEndDate =
        applyEndDate &&
        applyEndDate.substr(0, 4) +
          applyEndDate.substr(5, 2) +
          applyEndDate.substr(8, 2);
      }else {
      this.billOutSearch.applyStartDate='';
      this.billOutSearch.applyEndDate='';
      }
     
      this.billOutStockFlow(this.billOutSearch);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      let billOutSearch=this.billOutSearch;
      billOutSearch.pageSize=val;
      billOutSearch.pageNo=1;
      this.billOutStockFlow(billOutSearch);
    },
    handlePage(value) {
      let billOutSearch=this.billOutSearch;
      billOutSearch.pageNo=value;
      this.billOutStockFlow(billOutSearch);
    },
    handleBackJobType(){
      let isCanSubmit=this.result.isCanSubmit;
      let isCanReview=this.result.isCanReview;
      let isCanApprove=this.result.isCanApprove;
      let isCanFinal=this.result.isCanFinal;
      if(isCanSubmit){
        return '1103'
      }
      if(isCanReview){
        return '1100'
      }
      if(isCanApprove){
        return '1101'
      }
      if(isCanFinal){
        return '1102'
      }
    },
    toNew(id,auditStatus,flowType) {
      let isCanSubmit=this.result.isCanSubmit;
      let isCanReview=this.result.isCanReview;
      let isCanApprove=this.result.isCanApprove;
      let isCanFinal=this.result.isCanFinal;
      // 当前岗位id:1100:待审核,1101:待审批,1102:待终审,1103:业务岗
      // 审核状态(已拒绝:50000,待复核:50001,待审批:50002,待终审:50003)
      if((isCanSubmit && auditStatus==5000) || (isCanReview && (auditStatus==5000 || auditStatus==5001)) || (isCanApprove && auditStatus==5002) || (isCanFinal && auditStatus==5003)) {
      
      }
      if(isCanSubmit){
        // this.$router.push({ path: "/outboundReview",query:{id:id,flowType:flowType}});
        if(auditStatus==50001){
          this.$router.push({ path: "/outboundReview",query:{id:id,flowType:flowType,edit:true,jobType:1103}});
        }
        if(auditStatus==50002){
          this.$router.push({ path: "/outboundApproval",query:{id:id,flowType:flowType,edit:true,jobType:1103}});
        }
         if(auditStatus==50003){
          this.$router.push({ path: "/deliveryFinalAppeal",query:{id:id,flowType:flowType,edit:true,jobType:1103}});
        }
        if(auditStatus==50000 && flowType==30001){
          this.$router.push({ path: "/modifyTheOutbound",query:{id:id,flowType:flowType,edit:true}});
        }
        if(auditStatus==50000 && flowType==30004){
          this.$router.push({ path: "/modifyMoveLibrary",query:{id:id,flowType:flowType}});
        }
        
      }
      if(isCanReview){
        if(auditStatus==50001){
          this.$router.push({ path: "/outboundReview",query:{id:id,flowType:flowType,jobType:1100}});
        }
         if(auditStatus==50000){
           if(flowType==30004){
            this.$router.push({ path: "/modifyMoveLibrary",query:{id:id,flowType:flowType,edit:true,jobType:1100}});
           }else if(flowType==30001){
            this.$router.push({ path: "/modifyTheOutbound",query:{id:id,flowType:flowType,edit:true,jobType:1100}});
           }
        }
      }
      if(isCanApprove){
        this.$router.push({ path: "/outboundApproval",query:{id:id,flowType:flowType,jobType:1101}});
      }
      if(isCanFinal){
        this.$router.push({ path: "/deliveryFinalAppeal",query:{id:id,flowType:flowType,jobType:1102}});
      }
      if(auditStatus==5000){
          this.$router.push({ path: "/businessDetails",query:{id:id,flowType:flowType}});
      }
      // this.$router.push({ path: "/deliveryFinalAppeal",query:{id:id,flowType:flowType}});
        // this.$router.push({ path: "/outboundApproval",query:{id:id,flowType:flowType}});

      // if(value1==1100 && value2){
      // }
      // if(value1==1101 && value2){
      //   this.$router.push({ path: "/warehousingApproval",query:{id:id}});
      // }
      // if(value1==1102 && value2){
      //   this.$router.push({ path: "/finalAppeal",query:{id:id}});
      // }
    },
    billOutStockFlow(param){
      billOutStockFlow(param).then(res=>{
         if (res && res.data && res.data.CODE == "200") {
            this.tableData3=res.data.RESULT.list;
            this.count = res.data.RESULT.count;
            this.result=res.data.RESULT;
            let columns=this.columns;
            let checkList=[]
            columns && columns.map(function(v,i) {
              checkList.push(v.label)
            })
            this.checkList=checkList;
        } else {
          this.$message.error(res && res.data && res.data.MESSAGE);
        }
      })
    },
    searchEnterFun(e) {
      var keyCode = window.event ? e.keyCode : e.which;
      if (keyCode == 13) {
        this.billOutStockFlow(this.billOutSearch)
      }
    },
    addClass_billType(value,index) {
      this.billType_current = index;
      this.billOutSearch.ticketType = value;
      this.billOutStockFlow(this.billOutSearch);
    },
    addClass_applyStatus(value,index) {
      this.applyStatus_current = index;
      this.billOutSearch.payType = value;
      this.billOutStockFlow(this.billOutSearch);
    },
    addClass_medium(value,index) {
      this.medium_current = index;
      this.billOutSearch.mediaType = value;
      this.billOutStockFlow(this.billOutSearch);
    },
    addClass_warehousingMmode(value,index) {
      this.warehousingMmode_current = index;
      this.billOutSearch.auditStatus = value;
      this.billOutStockFlow(this.billOutSearch);
    },
    addClass_transferable(value,index) {
      this.transferable_current = index;
      this.billOutSearch.outStockType = value;
      this.billOutStockFlow(this.billOutSearch);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  },
  created(){
    this.billOutStockFlow(this.billOutSearch)
  }
};
</script>

<style scoped>
.outgoingApplication .content {
  position: relative;
  min-height: 440px;
  padding-right: 42px;
}
.outgoingApplication .content > ul {
  position: absolute;
  right: 34px;
  top: 9px;
  z-index: 1000;
  padding: 5px;
  cursor: pointer;
  background: #fff;
}
.outgoingApplication .content > ul li {
  width: 3px;
  height: 3px;
  margin-bottom: 2px;
  border-radius: 50%;
  background: rgba(163, 173, 200, 1);
}
.outgoingApplication {
  font-size: 14px;
  padding: 21px 32px 0 32px;
}
.outgoingApplication .nav {
  color: #596689;
}
.outgoingApplication .nav .tab {
  float: left;
}
.outgoingApplication .nav .tab:nth-child(1),
.outgoingApplication .nav .tab:nth-child(4) {
  width: 290px;
}
.outgoingApplication .nav .tab:nth-child(2),
.outgoingApplication .nav .tab:nth-child(5) {
  width: 466px;
}

.outgoingApplication .nav .tab {
  line-height: 30px;
  height: 30px;
  margin-bottom: 24px;
}
.nav .tab > div:nth-child(1) {
  width: 78px;
  font-weight: 600;
}

.outgoingApplication .nav ul li {
  float: left;
  padding: 0 12px;
  margin-left: 8px;
  cursor: pointer;
}
.outgoingApplication .nav ul li.ischeck {
  background: rgba(229, 237, 255, 1);
  border-radius: 2px;
  color:#5376FF;
}
.outgoingApplication .banner {
  margin-bottom: 24px;
}

.outgoingApplication .banner li {
  float: left;
  margin-right: 5px;
  text-align: center;
  width: 78px;
  height: 32px;
  line-height: 32px;
  background: rgba(83, 118, 255, 1);
  border-radius: 2px;
}
.outgoingApplication .banner li a {
  display: block;
  width: 100%;
  height: 100%;
  color: #fff;
}
.outgoingApplication .banner li span {
  margin-left: 5px;
}
.outgoingApplication .content {
  min-height: 440px;
}
.outgoingApplication .page {
  margin-top: 24px;
  text-align: right;
}
.search_ {
  margin-bottom: 10px;
}
.el-range-editor--small.el-input__inner {
  width: 380px;
}
.el-checkbox {
  padding-left: 14px;
  width: 25%;
  margin-right: 0;
  margin-bottom: 20px;
  box-sizing: border-box;
}
.el-checkbox:last-child {
  margin-bottom: 0px;
}
</style>
