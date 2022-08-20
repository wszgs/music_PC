<template>
  <div class="discovermusic">
    <!-- -----------------轮播图 --------------------->
    <banner :banner="banner"></banner>

<!-- -------------------个性化推荐-------------------------------- -->
    <div class="individualization">
      <div class="individualization_header">个性化推荐</div>
      <div class="individualization_box">
        <div
          class="individualization_item"
          v-for="(item, index) in iconList"
          :key="index"
          @click.stop="itemClick(index)"
        >
          <img :src="item.iconUrl + '?param=250y250'" alt="" />
          <div class="individualization_name">{{ item.name }}</div>
        </div>
      </div>
    </div>

    <!-- -------------热门歌单推荐----------------- -->
    <div class="hot_sheet">
      <div class="hot_sheet_header">
        热门歌单推荐
        <div class="more_sheet" @click.stop="moreheetClick()">全部歌单>></div>
      </div>
      <div class="sheet_box">
        <div
          class="sheet_item"
          v-for="(item, index) in hotSheetList"
          :key="index"
          @click="songSheetItemCick(item)"
        >
          <img :src="item.coverImgUrl + '?param=400y400'" alt="" />
          <div class="about_sheet">{{ item.name }}</div>
          <div class="sheet_playcount">
            <i class="el-icon-service"></i>{{ item.playCount | playCount }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getbanner,
  getDaySong,
  getHotSheet,
  getPersonalityIcon,
} from "network/discovermusic.js";
import Banner from "components/discovermusic/banner/Banner.vue";
export default {
  data() {
    return {
      banner: [],
      hotSheetList: [],
      iconList: [],
    };
  },
  components: {
    Banner,
  },
  methods: {
    // 获取轮播图
    getbannerList() {
      getbanner().then((res) => {
        this.banner = res.banners;
      });
    },
    // 获取热门歌单
    getHotSheetList() {
      getHotSheet({ cookie: this.$store.state.cookie }).then((res) => {
        this.hotSheetList = res.playlists;
      });
    },
    // 歌单被点击
    songSheetItemCick(item) {
      this.$store.commit("changeSongSheetId", item);
      this.$router.push({
        path: "songsheetdetail",
        query: {
          item: item,
        },
      });
    },
    moreheetClick() {
      this.$router.push({
        path: "songsheet",
      });
    },
    //获取人性化推荐图标
    getIconList() {
      getPersonalityIcon().then((res) => {
        for (let index = 0; index < 4; index++) {
          this.iconList.push(res.data[index]);
        }
      });
    },
    itemClick(index) {
      if (index == 0) {    
        this.$router.push({
          path: "daysong"
        });
      } else if (index == 1) {

      } else if (index == 2) {
        this.$router.push({
          path: "songsheet",
        });
      } else if (index == 3) {
        this.$router.push({
          path: "ranking",
        });
      }
    },
  },
  created() {
    this.getbannerList();
    this.getHotSheetList();
    this.getIconList();
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
.discovermusic {
  width: 100%;
  margin-bottom: 80px;
}
.individualization_header {
  font-size: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  border-bottom: 2px solid red;
  padding-bottom: 10px;
  font-weight: bold;
  padding-left: 20px;
  position: relative;
}
.individualization_box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.individualization_item {
  width: 230px;
  margin-bottom: 20px;
  background-color: #fff;
  font-size: 16px;
  position: relative;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-align: center;
  cursor: pointer;
}
.individualization_item img {
  background-color: brown;
  width: 230px;
}
.individualization_name{
  height: 40px;
  line-height: 40px;
  font-size: 18px;
}
.hot_sheet_header {
  font-size: 20px;
  margin-top: 20px;
  margin-bottom: 20px;
  border-bottom: 2px solid red;
  padding-bottom: 10px;
  font-weight: bold;
  padding-left: 20px;
  position: relative;
}
.hot_sheet_header .more_sheet {
  font-size: 12px;
  cursor: pointer;
  position: absolute;
  font-weight: normal;
  right: 10px;
  top: 10px;
  color: blue;
}
.sheet_box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.sheet_item {
  width: 200px;
  margin-bottom: 20px;
  background-color: #fff;
  font-size: 16px;
  position: relative;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  cursor: pointer;
}
.about_sheet{
  padding: 5px;
}
.sheet_item img {
  width: 200px;
}
.sheet_playcount {
  width: 100%;
  height: 30px;
  position: absolute;
  top: 170px;
  background-color: #00000047;
  color: #f1e4e4;
  font-size: 14px;
  line-height: 30px;
}
.sheet_playcount i {
  font-size: 12px;
  margin-left: 10px;
  margin-right: 5px;
}
</style>