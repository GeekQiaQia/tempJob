<template>
  <div class="tags" v-if="showTags">
    <ul>
      <li
        class="tags-li"
        v-for="(item,index) in tagsList"
        :class="{'active': isActive(item.path)}"
        :key="index"
      >
       <div class="tags-li-con">
          <router-link :to="item.path" class="tags-li-title">{{item.resourceName}}</router-link>
        <span :class="{'tags-li-icon':true,'active':isActive(item.path)}" @click="closeTags(index)" style="cursor:pointer">
          <i class="el-icon-close"></i>
        </span>
       </div>
      </li>
    </ul>
    <!-- <div class="tags-close-box">
      <el-dropdown @command="handleTags">
        <el-button size="mini" type="primary">
          标签选项
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu size="small" slot="dropdown">
          <el-dropdown-item command="other">关闭其他</el-dropdown-item>
          <el-dropdown-item command="all">关闭所有</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>-->
  </div>
</template>

<script>
import bus from "./bus";
import { sidebarList } from "@/api/api";
export default {
  data() {
    return {
      tagsList: [],
      RESULT: []
    };
  },
  methods: {
    isActive(path) {
      return path.indexOf(this.$route.path)>=0;
    },
    // 关闭单个标签
    closeTags(index) {
      if (this.tagsList.length > 1) {
        const delItem = this.tagsList.splice(index, 1)[0];
        const item = this.tagsList[index]
          ? this.tagsList[index]
          : this.tagsList[index - 1];
        if (item) {
          delItem.path.indexOf(this.$route.path)>=0 && this.$router.push(item.path);
        } else {
          this.$router.push("/");
        }
      }
    },
    // 关闭全部标签
    closeAll() {
      this.tagsList = [];
      this.$router.push("/");
    },
    // 关闭其他标签
    closeOther() {
      const curItem = this.tagsList.filter(item => {
        return item.path.indexOf(this.$route.path)>=0;
      });
      this.tagsList = curItem;
    },
    // 设置标签
    setTags(route) {
      const isExist = this.tagsList.some(item => {
        return item.path.indexOf(route.path) >= 0;
      });
      if (!isExist) {
        if (this.tagsList.length >= 8) {
          this.tagsList.shift();
        }
        let resourceName;
        this.RESULT &&
          this.RESULT.map(function(item, index) {
            if (route.path.indexOf(item.resourceNameEn) > 0) {
              resourceName = item.resourceName;
            }
            item.childrenResourceSet &&
              item.childrenResourceSet.map(function(item, inx) {
                if (route.path.indexOf(item.resourceNameEn) > 0) {
                  resourceName = item.resourceName;
                }
              });
          });
        if (!resourceName && route.meta.title) {
          resourceName = route.meta.resourceName;
        }
        this.tagsList.push({
          resourceName: resourceName,
          path: route.fullPath,
          name: route.matched[1].components.default.name
        });
      }
      bus.$emit("tags", this.tagsList);

    },
    handleTags(command) {
      command === "other" ? this.closeOther() : this.closeAll();
    }
  },
  computed: {
    showTags() {
      return this.tagsList.length > 0;
    }
  },
  watch: {
    $route(newValue, oldValue) {
      this.setTags(newValue);
    }
  },
  created() {
    this.$route;
    sidebarList({ reqType: 1 }).then(res => {
      if (res && res.data && res.data.CODE == "200") {
        this.RESULT = res.data.RESULT;
        this.setTags(this.$route);
        bus.$emit("RESULT", res.data.RESULT);
        // 监听关闭当前页面的标签页
        bus.$on("close_current_tags", () => {
          for (let i = 0, len = this.tagsList.length; i < len; i++) {
            const item = this.tagsList[i];
            if (item.path === this.$route.path) {
              if (i < len - 1) {
                this.$router.push(this.tagsList[i + 1].path);
              } else if (i > 0) {
                this.$router.push(this.tagsList[i - 1].path);
              } else {
                this.$router.push("/");
              }
              this.tagsList.splice(i, 1);
            }
          }
        });
      } else {
        this.$message.error(res && res.data && res.data.MESSAGE);
      }
    });
  }
};
</script>


<style>
.tags {
  position: relative;
  height: 45px;
  overflow: hidden;
  background: #f5f6fa;
  padding-right: 120px;
  float: left;
  margin-top: 25px;
}

.tags ul {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}

.tags-li {
  float: left;
  /* margin: 3px 5px 2px 3px; */
  border-radius: 10px;
  font-size: 12px;
  overflow: hidden;
  cursor: pointer;
  height: 45px;
  /* border: 1px solid #e9eaec; */
  /* background: #fff; */
  /* padding: 0 15px; */
  vertical-align: middle;
  color: #a3adc8;
  -webkit-transition: all 0.3s ease-in;
  -moz-transition: all 0.3s ease-in;
  transition: all 0.3s ease-in;
}

.tags-li:not(.active):hover {
  background: #f8f8f8;
}

.tags-li.active {
  color: #596689;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.tags-li-title {
  float: left;
  max-width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #a3adc8;
}
.tags-li a{
  line-height: 45px;
  padding:0 30px;
  width: 100%;
}

.tags-li.active .tags-li-title {
  color: #596689;
  font-weight: 600;
}

.tags-close-box {
  position: absolute;
  right: 0;
  top: 0;
  box-sizing: border-box;
  padding-top: 1px;
  text-align: center;
  width: 110px;
  height: 30px;
  background: #fff;
  box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
}
.tags-li-con{
  height: 100%;
  position: relative;
}
.tags-li-icon{
  display: none;
}

.tags-li-icon.active{
  display: inline-block;
  position: absolute;
  cursor: pointer;
  right: 9px;
  top: 9px;
}
</style>
