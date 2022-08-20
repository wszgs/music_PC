<template>
  <div class="singer">
    <div class="singer_type">
      <div
        class="singer_type_item"
        v-for="(item, index) in singer_type"
        :key="index"
      >
        <div class="text">{{ item.name }}</div>
        <ul>
          <li
            v-for="(type, typeIndex) in item.type"
            :key="typeIndex"
            @click="itemClick(index, typeIndex, type, item.area)"
            :class="{
              singerTypeActive:
                index == singerTypeIndex && typeIndex == curTypeIndex,
            }"
          >
            {{ type == "1" ? item.name + "男歌手" : item.name + "女歌手" }}
          </li>
        </ul>
      </div>
      <router-view />
    </div>

    <div class="singer_itmes">
      <div class="letter">
        <span
          class="letter_item"
          v-for="(item, index) in A_Z"
          :key="index"
          @click="letterItemClick(index, item)"
          :class="{ letterActive: index == letterIndex }"
          >{{ item == "-1" ? "热门" : item }}</span
        >
      </div>

      <div class="singer_all">
        <div
          class="singer_all_item"
          v-for="(item, index) in siggerList"
          :key="index"
          @click="singerClick(item)"
        >
          <div class="img">
            <img :src="item.img1v1Url+'?param=160y160'" alt="" />
          </div>
          <div class="text">{{ item.name }}</div>
        </div>
      </div>

      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="1000"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getSingerList } from "network/singer.js";

export default {
  data() {
    return {
      currentPage: 1,
      siggerList: "", // 歌手列表
      letterIndex: 0, //当前点击字母的索引值
      singerTypeIndex: 0, //当前点击歌手地区的索引值
      curTypeIndex: "", //当前点击男女歌手的索引值
      request: {
        //请求歌手数据
        area: "7", //地区
        type: "1", //男女
        initial: "-1", //匹配以initial字母开头的歌手
        limit: "20", //返回几条
        offset: 0,
      },
      //歌手类型
      singer_type: [
        {
          name: "华语",
          area: "7",
          type: ["1", "2"],
        },
        {
          name: "欧美",
          area: "96",
          type: ["1", "2"],
        },
        {
          name: "日语",
          area: "8",
          type: ["1", "2"],
        },
        {
          name: "韩国",
          area: "16",
          type: ["1", "2"],
        },
        {
          name: "其他",
          area: "0",
          type: ["1", "2"],
        },
      ],
      A_Z: [
        "-1",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "X",
        "Y",
        "Z",
      ],
    };
  },
  methods: {
    // 获取歌手列表
    getSingerList() {
      getSingerList(this.request).then((res) => {
        this.siggerList = res.artists;
      });
    },
    // 点击左边导航栏歌手类型出发的事件
    itemClick(index, typeIndex, type, area) {
      this.request.area = area;
      this.request.type = type;
      this.request.initial = "-1";
      this.letterIndex = 0; //重新设置A-Z字母的索引值为0
      this.singerTypeIndex = index; //设置歌手地区的索引值
      this.curTypeIndex = typeIndex; //设置歌手男女类型的索引值
      this.currentPage = 1; //重新设置分液器页数为第一页
      this.request.offset = (this.currentPage - 1) * this.request.limit;
      this.getSingerList(); //获取歌手列表
    },
    //点击A-Z字母触发的事件
    letterItemClick(index, item) {
      this.letterIndex = index; //重新设置A-Z字母的索引值
      this.request.initial = item; //item为传过来的字母
      this.currentPage = 1; //重新设置分液器页数为第一页
      this.request.offset = (this.currentPage - 1) * this.request.limit;
      this.getSingerList(); //获取歌手列表
    },
    handleCurrentChange(val) {
      this.request.offset = (val - 1) * this.request.limit;
      this.currentPage = val;
      this.getSingerList();
    },

    singerClick(item) {
      this.$store.commit('changeSingerId', item.id);

      this.$router.push({
        path: "singerdetails",
      });
    },
  },
  created() {
    this.getSingerList();
  },
};
</script>
<style scoped>
.singer {
  display: flex;
  justify-self: start;
}
.singer_type {
  width: 200px;
  background-color: azure;
  padding-top: 50px;
}

.singer_type_item .text {
  padding-left: 5px;
  font-size: 18px;
  margin-bottom: 5px;
}
.singer_type_item ul {
  margin-bottom: 20px;
}
.singer_type_item ul li {
  padding-left: 20px;
  height: 30px;
  line-height: 30px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
  font-size: 14px;
}
.singer_type_item ul li.singerTypeActive {
  background-color: orange;
}
.singer_type_item ul li:hover {
  background-color: #ccc;
}

/* 右边歌手列表 */
.singer_itmes {
  flex: 1;
  background-color: #fff;
}
.letter {
  margin-top: 20px;
  margin-left: 20px;
  display: flex;
  flex-wrap: wrap;
  border-bottom: 1px dotted #ccc;
}
.letter_item {
  height: 25px;
  line-height: 25px;
  text-align: center;
  width: 40px;
  margin-bottom: 10px;
  cursor: pointer;
  margin-right: 10px;
}
.letter_item.letterActive {
  background-color: orange;
}

.singer_all {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.singer_all_item {
  width: 160px;
  /* height: 140px; */
  cursor: pointer;
  margin-bottom: 20px;
  /* border: 1px dotted #ccc; */
}
.singer_all_item .img{
  height: 160px;
}
.singer_all_item .img img {
  width: 100%;
  height: 100%;
}

.singer_all_item .text {
  height: 30px;
  text-align: center;
  line-height: 30px;
  font-weight: bold;
  background-color: cadetblue;
  color:#fff ;
  white-space: nowrap;
  overflow: hidden;
  text-overflow:ellipsis;
}

/* 分页器 */
.pagination {
  margin-bottom: 60px;
}
</style>