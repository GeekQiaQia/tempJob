<template>
  <div class="outgoingBill">
    <nav class="info">
      <div class="infoHead clearfix">
        <div class="fl">
          票据信息
          <i></i>
        </div>
        <!-- <div class="fr">
          <i class="el-icon-lx-piliangshangchuan"></i> 批量上传
        </div>-->
      </div>
    </nav>
    <div class="section">
      <el-table
        :data="master_user.data"
        style="width: 100%"
        highlight-current-row
        header-row-class-name="headClass"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" v-if="tab"></el-table-column>
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column
          size="medium"
          v-for="(v,i) in master_user.columns"
          :prop="v.field"
          :label="v.title"
          :min-width="v.width"
        >
          <template slot-scope="scope">
            <span v-if="v.field=='mediaType'">{{scope.row[v.field]=='11001' ? '电票' :'纸票'}}</span>
            <span v-else-if="v.field=='ticketType'">{{scope.row[v.field]=='12001' ? '银票' :'商票'}}</span>
            <span v-else>{{scope.row[v.field]}}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="deleteRow(scope.row['id'],scope.$index)"
              type="text"
              size="small"
            >移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="sum" v-if="!tab">已选择{{this.master_user.data.length}}张票据</div>
      <div class="sum" v-else>已选择{{this.multipleSelection.length}}张票据</div>
      <div class="total">
        <div class="top">
          <i class="el-icon-lx-heji"></i>
          <span style="margin-left:7px">合计</span>
        </div>
        <ul class="clearfix">
          <li>
            <div class="txt">票面金额</div>
            <div class="num">{{ticketAmounts}}</div>
          </li>
        </ul>
      </div>

      <div class="newBtn">
        <el-button @click="handleSure">确认出库</el-button>
        <el-button @click="toLink_newMoveLibrary">移库</el-button>
        <!-- <el-button>取消</el-button> -->
      </div>
    </div>
  </div>
</template>

<script>
import { listSelected } from "@/api/api";
export default {
  name: "outgoingBill",
  data() {
    return {
      input: "",
      id_: "",
      tab: false,
      input1: "",
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value: "",
      radio: "40001",
      billInStockFlow: {
        inStockType: "21001",
        payType: "40001",
        accountNo: ""
      },
      ticketAmounts: 0,
      multipleSelection: [], //选中票据
      department_nickName: {},
      master_user: {
        columns: [
          { field: "ticketStatusName", title: "在库状态", width: 100 },
          { field: "mediaType", title: "介质", width: 100 },
          { field: "ticketNo", title: "票号", width: 230 },
          { field: "ticketType", title: "票据类型", width: 100 },
          { field: "drawer", title: "出票人", width: 100 },
          { field: "drawerAccountNo", title: "出票人账号", width: 100 },
          { field: "accepter", title: "承兑人", width: 100 },
          { field: "ticketAmount", title: "票面金额", width: 100 },
          { field: "draftDate", title: "出票日", width: 140 },
          { field: "expireDate", title: "到期日", width: 140 },
          { field: "plusDay", title: "加天", width: 100 },
          { field: "dayNum", title: "剩余天数", width: 120 }
        ],
        data: []
      }
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
      if(this.tab){
         let multipleSelection = this.multipleSelection;
         let ticketAmounts=0;
        multipleSelection &&
          multipleSelection.map(function(v, i) {
          if (v.ticketAmount) {
              ticketAmounts = ticketAmounts + v.ticketAmount;
            }
          });
          this.ticketAmounts=ticketAmounts;
      }
    },
    toLink_newMoveLibrary() {
      let id = "";
      if (this.tab) {
        let multipleSelection = this.multipleSelection;
        multipleSelection &&
          multipleSelection.map(function(v, i) {
            if (v.id) {
              id += v.id + ",";
            }
          });
      } else {
        let data = this.master_user.data;
        data &&
          data.map(function(v, i) {
            if (v.id) {
              id += v.id + ",";
            }
          });
      }
      id = id.slice(0, id.length - 1);
      this.id_ = id;
      if (id) {
        this.$router.push({
          path: "/newMoveLibrary",
          query: {
            id: id
          }
        });
      }
    },
    handleSure() {
      if (this.tab) {
        let id = "";
        let multipleSelection = this.multipleSelection;
        let arr = [];
        multipleSelection &&
          multipleSelection.map(function(v, i) {
            if (v.id) {
              arr.push(v.id);
            }
          });
        id = arr.join();
        if (id) {
          this.$router.push({
            path: "/theNewOutbound",
            query: { id: id }
          });
        }
      } else {
        let id = "";
        let data = this.master_user.data;
        data &&
          data.map(function(v, i) {
            if (v.id) {
              id += v.id + ",";
            }
          });
        id = id.slice(0, id.length - 1);
        this.$router.push({
          path: "/theNewOutbound",
          query: { id: id }
        });
      }
    }, 
    deleteRow(id,index_) {
      
      let data = this.master_user.data;
      let ticketAmounts = JSON.parse(JSON.stringify(this.ticketAmounts));
      if(this.tab){
        debugger
        let multipleSelection=this.multipleSelection;
        multipleSelection && multipleSelection.map(function(v,i) {
          if(v.id==id){
            multipleSelection.splice(i,1)
              ticketAmounts = ticketAmounts - v.ticketAmount;
          }
        })
       data.splice(index_,1)
      }else {
      data &&
        data.map(function(v, i) {
          if (v.id == id) {
            if (v.ticketAmount) {
              ticketAmounts = ticketAmounts - v.ticketAmount;
            }
            data.splice(i, 1);
          }
        });
      }
      this.ticketAmounts=parseFloat(ticketAmounts).toFixed(2);
    },
    listSelected(param) {
      let that=this;
      listSelected(param).then(res => {
        if (res && res.data && res.data.CODE == "200") {
          let datas = res.data.RESULT;
          if (!this.tab) {
            let ticketAmounts = 0;
            datas &&
              datas.map(function(v, i) {
                ticketAmounts += v.ticketAmount - 0;
                v.dayNum=that.checkData.DateCalculate(v.expireDate,v.plusDay)
              });
            this.ticketAmounts = ticketAmounts;
          }
          // this.count = res.data.RESULT.count;

          this.master_user.data = datas;
        } else {
          this.$message.error(res && res.data && res.data.MESSAGE);
        }
      });
    }
  },
  created() {
    // this.listSelected({ticketIds:this.$route.query.id})
    if (this.$route.query.id) {
      this.listSelected({ ticketIds: this.$route.query.id });
      this.tab = this.$route.query.tab;
    }
  }
};
</script>

<style scoped>
.sum {
  margin-top: 24px;
  color: #5376ff;
}
.outgoingBill {
  padding: 16px 32px;
}
.outgoingBill header > ul:nth-child(1) {
  margin-right: 174px;
  /* width: 50%; */
}
.outgoingBill header ul > label {
  display: block;
  margin-bottom: 24px;
}
.outgoingBill header ul > label > span {
  margin-right: 10px;
  font-weight: 600;
}
.outgoingBill .infoHead {
  border-bottom: 2px solid #e6e9f0;
}
.outgoingBill .infoHead div {
  padding-bottom: 8px;
}
.outgoingBill .infoHead .fl {
  padding-left: 12px;
  position: relative;
  color: #5376ff;
}
.outgoingBill .infoHead .fl i {
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 80px;
  height: 3px;
  background: #5376ff;
}
.outgoingBill .info {
  margin-bottom: 25px;
}
.outgoingBill .section .headClass {
  color: #a3adc8;
}
.outgoingBill .section .addRow {
  margin-top: 25px;
  color: #5376ff;
  display: inline-block;
  cursor: pointer;
}
.outgoingBill .section .addRow i {
  margin-right: 8px;
}
.outgoingBill .section .total {
  margin-top: 27px;
}
.outgoingBill .section .total .top {
  margin-bottom: 16px;
  color: #596689;
}
.outgoingBill .section .total li {
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
.outgoingBill .section .total li .txt {
  line-height: 26px;
  font-size: 12px;
  color: rgba(163, 173, 200, 1);
}
.outgoingBill .section .total li .num {
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
  background: rgba(229, 237, 255, 1);
  border: 1px solid rgba(83, 118, 255, 1);
  color: #5376ff;
}
.newBtn button:nth-child(3) {
  background: #fff;
  color: #323e61;
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
</style>
