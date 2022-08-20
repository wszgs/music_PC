<template>
  <div class="ranking">
    <!-- 左边排行榜导航栏 -->
    <div class="ranking_left">
      <ul class="all_rank_list">
        <li
          v-for="(item, index) in allRank"
          :key="index"
          :class="{ active: currentIndex == index }"
          @click="rankClick(item, index)"
        >
          <div class="ranking_img">
            <img :src="item.coverImgUrl + '?param=100y100'" alt="" />
          </div>
          <div>
            <div class="ranking_name">{{ item.name }}</div>
            <div class="update_time">
              {{ item.updateFrequency }}
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- 右边排行榜内容 -->
    <div class="ranking_right">
      <div class="rank_about">
        <div class="rank_about_left">
          <img :src="currentDetail.coverImgUrl + '?param=100y100'" alt="" />
        </div>
        <div class="rank_about_right">
          <div class="name">{{ currentDetail.name }}</div>
          <div class="time">
            最近更新:{{ currentDetail.trackUpdateTime | formatDate }}
          </div>

          <div class="sheet_btn">
            <div class="item" @click="playBtn()">
              <i class="el-icon-video-play"></i>播放
            </div>
            <div class="item">
              <i class="el-icon-folder-add"></i>({{
                currentDetail.subscribedCount |count
              }})
            </div>
            <div class="item">
              <i class="el-icon-share"></i>({{ currentDetail.shareCount |count }})
            </div>
            <div class="item"><i class="el-icon-download"></i>(456)</div>
            <div class="item">
              <i class="el-icon-chat-dot-square"></i>
              ({{ currentDetail.commentCount |count }})
            </div>
          </div>

          <div class="description">
            <h4>关于:</h4>
            {{ currentDetail.description }}
          </div>
        </div>
      </div>
      <!-- ------------------------------------- -->
      <div class="song_box">
        <div class="body_header">
          <span class="left">歌曲列表</span>
          <span class="count">{{ allSongList.length }}首歌</span>
          <span class="play_count"
            >播放:{{ currentDetail.playCount | count }} 次</span
          >
        </div>
      </div>

      <ul class="song_list">
        <li
          v-for="(item, index) in allSongList"
          :key="index"
          @click.stop="toSongDetail(item)"
        >
          <div class="index">{{ index + 1 }}</div>
          <div class="play" @click.stop="playClick(item.id, index)">
            <i class="el-icon-video-play"></i>
          </div>
          <div class="name">{{ item.name }}</div>
          <div class="singer_name" @click.stop="singerClick(item.ar[0].id)">
            {{ item.ar[0].name }}
          </div>
          <div class="time">04:00</div>
        </li>
      </ul>
      <!-- -------------------------------------------- -->
    </div>
  </div>
</template>

<script>
import { getAllRank, getRankDetail, getAllSong } from "network/ranking";
export default {
  data() {
    return {
      allRank: [],
      currentIndex: 0,
      rankDetailRequest: {
        id: "19723756",
      },
      currentDetail: {},

      allSongListRequest: {
        id: "19723756", //歌单 id
        limit: "500", //限制获取歌曲的数量
      },
      allSongList: [],
    };
  },
  methods: {
    // 获取所有排行榜分类
    getRankType() {
      getAllRank().then((res) => {
        this.allRank = res.list;
      });
    },
    // 获取排行榜详情
    getDetail() {
      getRankDetail(this.rankDetailRequest).then((res) => {
        this.currentDetail = res.playlist;
      });
    },
    // 获取排行榜歌曲
    getSongList() {
      getAllSong(this.allSongListRequest).then((res) => {
        this.allSongList = res.songs;
      });
    },
    // 左边排行帮被点击
    rankClick(item, index) {
      this.rankDetailRequest.id = item.id;
      this.allSongListRequest.id = item.id;
      this.currentIndex = index;
      this.getDetail(); // 获取排行榜详情
      this.getSongList();// 获取排行榜歌曲
    },
    // 点击播放按钮
    playClick(id, index) {
      this.$store.commit("changeCurrentList", {
        currentList: this.allSongList,
        index: index,
      });

      this.$store.dispatch("getUrl");
      this.$store.dispatch("getLyric");
    },
    // 点击歌手跳转到歌手详情页
    singerClick(id) {
      this.$store.commit("changeSingerId", id);
      this.$router.push({
        path: "singerdetails",
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
    // 点击头部播放按钮
    playBtn() {
      this.$store.commit("changeCurrentList", {
        currentList: this.allSongList,
        index: 0,
      });
      this.$store.dispatch("getUrl");
      this.$store.dispatch("getLyric");
    },
  },
  created() {
    this.getRankType();// 获取所有排行榜分类
    this.getDetail(); // 获取排行榜详情
    this.getSongList();// 获取排行榜歌曲
  },
  filters: {
    // 时间格式化
    formatDate(time) {
      let date = new Date(time);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      month = month < 10 ? "0" + month : month;
      day = day < 10 ? "0" + day : day;
      date = year + "-" + month + "-" + day;
      return date;
    },
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
.ranking {
  display: flex;
  margin-bottom: 60px;
}
.ranking_left {
  width: 200px;
  border-right: 1px solid #b6afaf;
}
.ranking_right {
  flex: 1;
}
.all_rank_list li {
  height: 60px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.all_rank_list li.active {
  background-color: #858585;
  color: #fff !important;
}

.all_rank_list .ranking_img {
  margin-left: 10px;
  margin-right: 10px;
}
.all_rank_list .ranking_img img {
  width: 40px;
  height: 40px;
}
.ranking_name {
  width: 140px;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow:ellipsis;

}
.all_rank_list .update_time {
  font-size: 12px;
  
}
.rank_about {
  display: flex;
  padding-left: 30px;
  margin-top: 20px;
}

.rank_about_left {
  width: 150px;
  text-align: center;
  margin-right: 20px;
}
.rank_about_left img {
  width: 150px;
}

.rank_about_right .name {
  font-size: 28px;
}
.rank_about_right .time {
  font-size: 14px;
  margin-top: 10px;
  color: slategrey;
}
.rank_about_right .description {
  margin-top: 20px;
  height: 100px;
  overflow-y: auto;
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
/* --------------------------------------- */

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

.song_list {
  border: 1px solid #b6afaf;
  background-color: #fff;
  margin:10px;
}
.song_list li {
  display: flex;
  align-items: center;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
}
.song_list li.active {
  background-color: orange !important;
  color: #fff;
}
.song_list .index {
  width: 50px;
  padding-left: 20px;
}
.song_list .play {
  width: 50px;
  font-size: 25px;
  margin-left: 20px;
  margin-right: 20px;
}
.song_list .name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 250px;
  margin-right: 20px;
}
.song_list .time {
  width: 100px;
}
.song_list .singer_name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 150px;
  margin-right: 20px;
}
.song_list .name:hover,
.song_list .singer_name:hover {
  text-decoration: underline;
}
.song_list li:nth-child(2n-1) {
  background-color: #eee;
}
.song_list li:hover {
  background-color: #ccc;
  color: #fff;
}
</style>