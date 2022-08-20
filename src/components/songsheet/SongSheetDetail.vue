<template>
  <div class="song_sheet_detail">
    <div class="header">
      <div class="header_left">
        <img :src="aboutSheet.coverImgUrl + '?param=200y200'" alt="" />
      </div>
      <div class="header_right">
        <div class="sheet_name">
          <i class="el-icon-s-flag">歌单</i>
          <span>{{ aboutSheet.name }}</span>
        </div>

        <div class="sheet_btn">
          <div class="item" @click="playBtn()"><i class="el-icon-video-play"></i>播放</div>
          <div class="item">
            <i class="el-icon-folder-add"></i>({{
              sheetDetail.bookedCount | count
            }})
          </div>
          <div class="item">
            <i class="el-icon-share"></i>({{ aboutSheet.shareCount | count }})
          </div>
          <div class="item"><i class="el-icon-download"></i>(456)</div>
          <div class="item">
            <i class="el-icon-chat-dot-square"></i>({{
              aboutSheet.commentCount | count
            }})
          </div>
        </div>

        <div class="tage">
          标签:
          <span v-for="(item, index) in aboutSheet.tags" :key="index">{{
            item
          }}</span>
        </div>

        <div class="description">
          <h3>关于:</h3>
          {{ aboutSheet.description }}
        </div>
      </div>
    </div>

    <div class="song_box">
      <div class="body_header">
        <span class="left">歌曲列表</span>
        <span class="count">{{ allSongList.length }}首歌</span>
        <span class="play_count">播放:{{ aboutSheet.playCount  | count}} 次</span>
      </div>
    </div>

    <ul class="song_list">
      <li
        v-for="(item, index) in allSongList"
        :key="index"
        @click.stop="toSongDetail(item)"
      >
        <div class="index">{{ index + 1 }}</div>
        <div class="play" @click.stop="playClick(item.id,index)">
          <i class="el-icon-video-play"></i>
        </div>
        <div class="name">{{ item.name }}</div>
        <div class="singer_name" @click.stop="singerClick(item.ar[0].id)">{{ item.ar[0].name }}</div>
        <div class="time">04:00</div>
      </li>
    </ul>

  </div>
  
</template>

<script>
import { getSong, getSongSheetDetail } from "network/songsheet.js";

export default {
  data() {
    return {
      id: "", //歌单id
      aboutSheet: {}, //进入歌单详情页时，传给vuex关于歌单的一些数据
      songRequest: {
        cookie: "",
        id: "", //歌单 id
        limit: "500", //限制获取歌曲的数
      },
      allSongList: [], //请求回来的歌曲

      // 歌单请求参数
      sheetDetailRequest: {
        id: "",
      },

      sheetDetail: {},
    };
  },
  methods: {
    // 获取歌单歌曲
    getSongList() {
      getSong(this.songRequest).then((res) => {
        this.allSongList = res.songs;
      });
    },
    // 获取歌单的详情
    getDetail() {
      getSongSheetDetail(this.sheetDetailRequest).then((res) => {
        this.sheetDetail = res;
      });
    },
    // 点击歌曲跳转到歌曲详情页
    toSongDetail(item) {
      this.$store.commit("changeSongDetail",item.id)
      if (this.$route.path != "/songdetail") {
        this.$router.push({
          path: "songdetail"
        });
      }
    },
    // 点击播放按钮
    playClick(id,index) {
            this.$store.commit("changeCurrentList", {currentList:this.allSongList,index:index});

            this.$store.dispatch("getUrl");
            this.$store.dispatch("getLyric");
    },
    playBtn(){
      this.$store.commit("changeCurrentList", {currentList:this.allSongList,index:0});
            this.$store.dispatch("getUrl");
            this.$store.dispatch("getLyric");
    },
    singerClick(id){
      this.$store.commit('changeSingerId', id)
      this.$router.push({
        path: "singerdetails",
      });
    },
  },
  created() {
    this.aboutSheet = this.$store.state.aboutSheet;
    this.id = this.$store.state.songSheetId;
    this.songRequest.id = this.id;
    this.songRequest.cookie = this.$store.state.cookie;

    this.sheetDetailRequest.id = this.id;

    this.getSongList(); // 获取歌单歌曲
    this.getDetail();
  },

  filters: {
    // 播放量过滤器，转成一万单位
    count(val) {
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
.song_sheet_detail {
  margin-bottom: 100px;
}
.header {
  margin-top: 20px;
  margin-bottom: 10px;
  display: flex;
}
.body_header {
  position: relative;
}
.body_header .left {
  font-size: 25px;
  font-weight: bold;
  margin-left: 10px;
  margin-right: 10px;
}
.body_header .count {
  position: absolute;
  bottom: 5px;
}
.body_header .play_count {
  position: absolute;
  right: 10px;
  bottom: 5px;
}
.header_left {
  width: 300px;
  text-align: center;
}
.header_left img {
  width: 200px;
  height: 200px;
  border-radius: 8px;
}
.header_right {
  flex: 1;
}

.sheet_name i {
  font-size: 20px;
  background-color: red;
  color: #fff;
  border-radius: 8px;
  padding: 2px 8px;
}
.sheet_name span {
  font-size: 25px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sheet_btn {
  display: flex;
  align-items: center;
  margin-top: 20px;
}
.sheet_btn .item {
  margin-right: 10px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.sheet_btn .item i {
  margin-right: 5px;
  font-size: 20px;
}
.sheet_btn .item:hover,
.tage span:hover {
  background-color: aliceblue;
}
.tage {
  margin-top: 20px;
  margin-bottom: 20px;
}
.tage span {
  padding: 5px 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  cursor: pointer;
  color: chocolate;
  margin-left: 10px;
}
.description {
  height: 150px;
  overflow-y: auto;
  border-radius: 10px;
  padding: 5px;
  box-sizing: border-box;
}
.song_list {
  border: 1px solid #000;
  background-color: #fff;
}
.song_list li {
  display: flex;
  align-items: center;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
}
.song_list li.active{
  background-color: orange !important;;
  color: #fff;
}
.song_list .index {
  width: 100px;
  padding-left: 20px;
}
.song_list .play {
  width: 100px;
  font-size: 25px;
}
.song_list .name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 300px;
  margin-right: 20px;
}
.song_list .time {
  width: 100px;
}
.song_list .singer_name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 300px;
}
.song_list .name:hover,.song_list .singer_name:hover{
  text-decoration:underline;
}
.song_list li:nth-child(2n-1) {
  background-color: #eee;
}
.song_list li:hover {
  background-color: #ccc;
  color: #fff;
}
</style>