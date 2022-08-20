<template>
  <div class="carousel">
    <el-carousel
      :interval="2000"
      type="card"
      height="250px"
      indicator-position="outside"
      trigger="click"
    >
      <el-carousel-item v-for="(item,index) in banner" :key="index" @click="imgClick(item.encodeId)">
        <img :src="item.imageUrl" width="100%" height="100%" alt="" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  props: ["banner"],
  data() {
    return {};
  },
};
</script>
<style  scoped>
.carousel {
  background-color: rgb(116, 65, 65);
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>