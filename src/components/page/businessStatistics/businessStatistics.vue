<template>
  <div class="businessStatistics">
    <div class="nav clearfix">
        <div class="clearfix">
            <div class="tab clearfix">
                <div class="fl">票据类型：</div>
                <ul class="fl clearfix">
                    <li v-for="(item,index) in billType" v-on:click="addClass_billType(index)" v-bind:class="{ischeck:index==billType_current}">{{item.title}}</li>
                </ul>
            </div>
            <div class="tab clearfix">
                <div class="fl">申请状态：</div>
                <ul class="fl clearfix">
                    <li v-for="(item,index) in applyStatus" v-on:click="addClass_applyStatus(index)" v-bind:class="{ischeck:index==applyStatus_current}">{{item.title}}</li>
                </ul>
            </div>
        </div>
         <div class="clearfix">
            <div class="tab clearfix">
                <div class="fl">介 质：</div>
                <ul class="fl clearfix">
                    <li v-for="(item,index) in medium" v-on:click="addClass_medium(index)" v-bind:class="{ischeck:index==medium_current}">{{item.title}}</li>
                </ul>
            </div>
            <div class="tab clearfix">
                <div class="fl">入库方式：</div>
                <ul class="fl clearfix">
                    <li v-for="(item,index) in warehousingMmode" v-on:click="addClass_warehousingMmode(index)" v-bind:class="{ischeck:index==warehousingMmode_current}">{{item.title}}</li>
                </ul>
            </div>
        </div>
        <div class="clearfix">
            <div class="tab clearfix">
                <div class="fl">可 转 让：</div>
                <ul class="fl clearfix">
                    <li v-for="(item,index) in transferable" v-on:click="addClass_transferable(index)" v-bind:class="{ischeck:index==transferable_current}">{{item.title}}</li>
                </ul>
            </div>
               <div class="tab clearfix">
                <div class="fl">申请时间：</div>
                <el-date-picker
                    v-model="value1"
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "businessStatistics",
  data() {
    return {
        value1: '',
        billType_current:0,
        billType: [{ title: "全部" }, { title: "银承" }, { title: "商承" }],
        applyStatus_current:0,
        applyStatus: [{ title: "全部" }, { title: "待审核" }, { title: "已拒绝" }],
        medium_current:0,
        medium: [{ title: "全部" }, { title: "银承" }, { title: "商承" }],
        warehousingMmode_current:0,
        warehousingMmode: [{ title: "全部" }, { title: "签票" }, { title: "买入" }],
        transferable_current:0,
        transferable: [{ title: "全部" }, { title: "签票" }, { title: "买入" }]
    };
  },
  methods: {
      addClass_billType(index){
          this.billType_current=index
      },
       addClass_applyStatus(index){
          this.applyStatus_current=index
      },
        addClass_medium(index){
          this.medium_current=index
      },
       addClass_transferable(index){
          this.transferable_current=index
      }
  },
};
</script>

<style scoped>
    .businessStatistics{
        padding:21px 32px 0 32px
    }
      .businessStatistics .nav{
          color: #596689;
          line-height: 38px;
          height: 38px;
      }
     .businessStatistics .nav >div{
         width: 33%;
         float: left;
     }
     .businessStatistics .nav >div .tab{
         margin-bottom: 24px;
     }
     .businessStatistics .nav ul li{
        float: left;
        padding:0 12px;
        margin-left: 8px;
        cursor: pointer;
     }
    .businessStatistics .nav ul li.ischeck{
        background:rgba(229,237,255,1);
        border-radius:2px;
    }
</style>
