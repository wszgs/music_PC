

<template>
  <div class="left_nav">
    <div class="open_menu" @click="openRadio()">
      <i class="el-icon-s-unfold" v-show="isCollapse"></i>
      <i class="el-icon-s-fold" v-show="!isCollapse"></i>
    </div>

    <el-menu class="el-menu-vertical-demo left_menu" :collapse="isCollapse">
      <el-menu-item
        v-for="(item, index) in list"
        :key="index"
        :class="{ active: $route.path == item.path }"
        v-show="item.meta.title"
        @click="itemClick(item.path, index)"
        class="nav_item"
      >
        <i :class="item.meta.iconClass"></i>
        <span slot="title"> {{ item.meta.title }}</span>
      </el-menu-item>
    </el-menu>
  </div>

  <!-- <div class="left_nav">
    <div
      v-for="(item, index) in list"
      :key="index"
      class="nav_item"
      @click="itemClick(item.path, index)"
      :class="{active:$route.path==item.path}"
      v-show="item.meta.title"
    >
      {{ item.meta.title }}
    </div>
  </div> -->
</template>

<script>
export default {
  data() {
    return {
      list: [],
      isCollapse: true,
    };
  },
  methods: {
    //   点击走左边导航栏跳转路由
    itemClick(path) {
      if (this.$route.path != path) {
        this.$router.push(path);
      }
    },
    // 收缩菜单
    openRadio() {
      this.isCollapse = !this.isCollapse;
    },
  },
  created() {
    //   从路由上面提取出出导航栏列表
    this.list = this.$router.options.routes.filter((item) => {
      return item.meta;
    });
  },
};
</script>
<style  scoped>
.open_menu {
  width: 100%;
  text-align: center;
  height: 40px;
  line-height: 40px;
  background-color: #444645;
  color: #fff;
  font-size: 25px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 150px;
  min-height: 400px;
  margin-right: 0;
}

.left_nav {
  /* height: 645px; */
  background-color: #fff;
  border-right: 2px solid #958e8e33;
  box-sizing: border-box;
}
.nav_item {
  padding-left: 20px;
  height: 60px;
  line-height: 60px;
  font-size: 16px;
  width: 100%;
  border-bottom: 1px solid #eee;
  box-sizing: border-box;
  cursor: pointer;
  color: cadetblue;
}
.nav_item.active{
  background-color: #171a191c;
  font-weight: bold;
  font-size: 18px;
  color: #c20c0c;
}
.nav_item.active i{
  font-weight: bold;
  font-size: 18px;
  color: #c20c0c;
}
</style>