<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <template>
        <el-menu-item style="text-align:center;padding-top:10px" class="top_nav" index="newWarehousing"
                    key="newWarehousing">
          <div>
            <i class="el-icon-lx-ruku"></i>
            <span slot="title">快速入库</span>
          </div>
        </el-menu-item>
      </template>
      <template v-for="item in RESULT">
        <template v-if="item.childrenResourceSet">
          <el-submenu :index="item.resourceNameEn+''" :key="item.resourceNameEn">
            <template slot="title">
              <i :class="item.emId"></i>
              <span slot="title">{{ item.resourceName }}</span>
            </template>
            <template v-for="subItem in item.childrenResourceSet">
              <el-submenu
                v-if="subItem.childrenResourceSet"
                :index="subItem.resourceNameEn+''"
                :key="subItem.resourceNameEn"
              >
                <template slot="title">{{ subItem.resourceName }}</template>
                <template v-for="Item in subItem.childrenResourceSet">
                  <el-submenu
                    v-if="Item.childrenResourceSet"
                    :index="Item.resourceNameEn+''"
                    :key="Item.resourceNameEn"
                  >
                    <template slot="title">{{ Item.resourceName }}</template>
                    <el-menu-item
                      v-for="(threeItem,i) in Item.childrenResourceSet"
                      :key="i"
                      :index="threeItem.resourceNameEn+''"
                    >{{ threeItem.title }}</el-menu-item>
                  </el-submenu>
                  <el-menu-item
                    v-else
                    :index="Item.resourceNameEn+''"
                    :key="Item.resourceNameEn"
                  >{{ Item.resourceName }}</el-menu-item>
                </template>
              </el-submenu>
              <el-menu-item
                v-else
                :index="subItem.resourceNameEn+''"
                :key="subItem.resourceNameEn"
              >{{ subItem.resourceName }}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.resourceNameEn+''" :key="item.resourceNameEn">
            <i :class="item.emId"></i>
            <span slot="title">{{ item.resourceName }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
    <div class="img" @click="collapseChage"><img src="../../assets/img/collapse.png" alt></div>
  </div>
</template>

<script>
import bus from "../common/bus";
import { sidebarList } from "@/api/api";

export default {
  data() {
    return {
      collapse: false,
      // RESULT: [
      //   {
      //     icon: "el-icon-lx-1",
      //     id: "warehousingApplication",
      //     resourceName: "入库申请"
      //   },
      //   {
      //     icon: "el-icon-lx-2",
      //     id: "outgoingApplication",
      //     resourceName: "出库申请"
      //   },
      //   {
      //     icon: "el-icon-lx-3",
      //     id: "inventoryManagement",
      //     resourceName: "库存管理"
      //   },
      //   {
      //     icon: "el-icon-lx-daohang-yewutongji-moren",
      //     resourceName: "业务统计",
      //     id: "businessStatistics",
      //     childrenResourceSet: [
      //       {
      //         id: "businessAccount",
      //         resourceName: "业务台账"
      //       }
      //     ]
      //   },
      //   {
      //     icon: "el-icon-lx-daohang-yewutongji-moren",
      //     id: "system",
      //     resourceName: "系统配置",
      //     childrenResourceSet: [
      //       {
      //         id: "organizeStructure",
      //         resourceName: "组织架构"
      //       },
      //       {
      //         id: "roleManage",
      //         resourceName: "角色管理"
      //       }
      //     ]
      //   },
      //   {
      //     icon: "el-icon-lx-daohang-yewutongji-moren",
      //     resourceName: "控台侧",
      //     id: "18",
      //     childrenResourceSet: [
      //       {
      //         id: "tenantManage",
      //         resourceName: "租户管理"
      //       },
      //     ]
      //   },
      //   {
      //     icon: "el-icon-lx-warn",
      //     id: "7",
      //     title: "错误处理",
      //     childrenResourceSet: [
      //       {
      //         id: "permission",
      //         title: "权限测试"
      //       },
      //       {
      //         id: "404",
      //         title: "404页面"
      //       }
      //     ]
      //   }
      // ],
      RESULT: []
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  },
  methods:{
   // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      bus.$emit("collapse", this.collapse);
    },
  },
  mounted() {
    if (document.body.clientWidth < 1500) {
      this.collapseChage();
    }
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });
    bus.$on("RESULT", msg => {
      this.RESULT = msg;
    });
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.img{
  position: absolute;
  left:20px;
  bottom: 10%;
  width: 24px;
  height: 20px;
  text-align: center;
  cursor:pointer;
}
img{
  width:16px;
  height:12px;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 200px;
}
.el-menu--collapse li > div {
  background: #f5f6fa !important;
  width: 100% !important;
}
.sidebar .el-menu--collapse li > div i.el-icon-lx-ruku {
  color: #a2acc7 !important;
}
.el-menu--collapse .el-menu-item {
  color: #a3adc8 !important;
}
.sidebar > ul {
  background: #f5f6fa !important;
  height: 100%;
}

.top_nav {
  background: #5376ff !important;
}
.top_nav div {
  text-align: center;
  margin: 0px auto;
  width: 168px;
  height: 36px;
  line-height: 36px;
  /* background: #5376ff; */
  background:linear-gradient(131deg,rgba(83,118,255,1) 0%,rgba(125,135,255,1) 100%);
  border-radius: 4px;
  color: #fff;
}
.el-submenu  .el-menu-item {
  padding-left:48px !important;
}
.el-menu-item {
  font-weight: 600;
  background-color: #f5f6fa !important;
  color: #a3adc8 !important;
}
.el-menu-item.is-active {
  color: #5376ff !important;
  font-weight: 600;
}
.el-menu-item.is-active i {
  color: #5376ff !important;
}
.sidebar .top_nav div i {
  color: #fff !important;
}
.el-submenu{
  font-weight: 600;
}
</style>
