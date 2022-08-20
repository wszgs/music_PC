<template>
  <div class="song_sheet">
    <!-- ----------------------头部跟单分类------------------- -->
    <div class="categorie">
      <div class="header">
        <div class="current">
          {{ current }}
        </div>
        <el-popover
          placement="bottom-start"
          width="800"
          trigger="click"
          class="popover"
          :value="isShow"
        >
          <div class="btn" slot="reference" @click="btnClick()">选择分类</div>
          <div
            class="popover_category"
            v-for="(value, key) in categories"
            :key="key"
          >
            <div class="popover_left">{{ value }}:</div>
            <div class="popover_right">
              <span
                :class="{
                  has: item.category == key,
                  active: current == item.name,
                }"
                v-for="(item, index) in sub"
                :key="index"
                @click="categoryItemClick(item.name)"
              >
                {{ item.category == key ? item.name : "" }}
              </span>
            </div>
          </div>
        </el-popover>
        <div
          @click="hotClick('全部')"
          class="hot"
          :class="{ active: current == '全部' }"
        >
          全部
        </div>
      </div>
    </div>

<!-- -----------------------歌单item----------------------- -->
    <div class="all_song_sheet">
      <div
        class="song_sheet_item"
        v-for="(item, index) in songSheetList"
        :key="index"
        @click="songSheetItemCick(item)"
      >
        <img :src="item.coverImgUrl + '?param=200y200'" alt="" />
        <div class="song_sheet_name">{{ item.name }}</div>
        <div class="play_count">
          <i class="el-icon-service"></i>{{ item.playCount | playCount }}
        </div>
      </div>
    </div>
    <!--------------------------- 分页器----------------------------------- -->
    <div>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="1000"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getCatList, getOneCategorie } from "network/songsheet.js";

export default {
  data() {
    return { 
      categories: {},//歌单类别  0: "语种" 1: "风格" 2: "场景" 3: "情感" 4: "主题"
      sub: [],//所有歌单分类
      isShow: false,// 是否显示选择跟单弹框
      current: "流行",// 当前选择的歌单
      categorieRequest: {
        cat: "", //tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部",
        limit: 20, //取出歌单数量 , 默认为 50
        offset: "", //( 评论页数 -1)*50, 其中 50 为 limit 的值
      },
      songSheetList: [],//请求回来的歌单
      currentPage: 1,//分页器当前页面
    };
  },
  methods: {
    //请求所有歌单分类
    getCategories() {
      getCatList().then((res) => {
        this.categories = res.categories;
        this.sub = res.sub;
      });
    },
    //请求歌单
    getCategorieList() {
      getOneCategorie(this.categorieRequest).then((res) => {
        this.songSheetList = res.playlists;
        // console.log(this.songSheetList);
      });
    },
    // 歌单被点击触发的事件
    categoryItemClick(name) {
      this.categorieRequest.cat = name;
      this.current = name;
      this.isShow = false;
      this.getCategorieList();
      this.currentPage = 1;
    },
    // 右上角最热按钮被点击触发的事件
    hotClick(name) {
      this.categorieRequest.cat = "";
      this.current = name;
      this.getCategorieList();
    },
    // 点击选择分类按钮，打开分类弹框
    btnClick() {
      this.isShow = true;
    },
    // 分页器被点击触发的事件
    handleCurrentChange(page) {
      this.currentPage = page;
      this.categorieRequest.offset = (page - 1) * this.categorieRequest.limit;
      this.getCategorieList();
    },
    // 歌单被点击
    songSheetItemCick(item) {
      this.$store.commit("changeSongSheetId",item)

       this.$router.push({
        path: "songsheetdetail",
        query: {
            item: item
          }
      });
    },


  },
  created() {
    this.categorieRequest.cat = this.current;
    this.getCategories();//请求歌单分类
    this.getCategorieList();//请求歌单

  },
  filters: {
    // 播放量过滤器
    playCount(val) {
      if (val > 10000) {
        return parseInt(val / 10000) + "w";
      } else {
        return val;
      }
    },
  },
};
</script>
<style  scoped>
.song_sheet {
  margin-bottom: 80px;
}
.btn {
  background-color: chocolate;
  /* width: 80px; */
  color: #fff;
  padding: 8px 10px;
  cursor: pointer;
  border-radius: 8px;
}
.popover_category {
  display: flex;
  margin-top: 10px;
  border-bottom: 1px dotted #000;
}
.popover_left {
  width: 50px;
  font-size: 16px;
  font-weight: bold;
  line-height: 25px;
}
.popover_right {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
}
.popover_right span.has {
  padding: 5px 10px;
  margin-right: 10px;
  background-color: #ccc;
  border: 1px dotted #eee;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 10px;
}
span.has.active,
.popover_right span.has:hover,
.hot.active {
  background-color: chocolate;
  color: #fff;
}
.header {
  height: 60px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #000;
}
.current {
  width: 100px;
  margin-left: 20px;
  margin-right: 20px;
  font-size: 25px;
  text-align: center;
}
.hot {
  border-radius: 5px;
  padding: 5px 10px;
  margin-left: 720px;
  margin-right: 10px;
  background-color: #ccc;
  border: 1px dotted #eee;
  cursor: pointer;
}
.all_song_sheet {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.song_sheet_item {
  position: relative;
  width: 200px;
  /* margin-right: 10px; */
  cursor: pointer;
  margin-bottom: 20px;
  background-color: #fff;
}
.song_sheet_item img {
  width: 100%;
}
.song_sheet_name {
  height: 30px;
  padding: 0px 5px;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.play_count {
  width: 100%;
  height: 30px;
  font-size: 12px;
  position: absolute;
  top: 170px;
  background-color: #000;
  opacity: 0.8;
  color: #fff;
  line-height: 30px;
  padding-left: 5px;
  box-sizing: border-box;
}
.play_count i {
  margin-right: 3px;
}
</style>