<template>
  <div class="day_song">
    <div class="header">
      <img src="~assets/img/daysong.png" alt="" />
    </div>
    <div class="body" v-show="daySongList">
      <div class="song_box">
        <div class="body_header">
          <span class="left">歌曲列表</span>
          <span class="count">{{ daySongList.length }}首歌</span>
        </div>
      </div>

      <!-- ================================= -->
      <ul class="song_list" >
        <li
          v-for="(item, index) in daySongList"
          :key="index"
          @click.stop="toSongDetail(item)"
        >
          <div class="index">{{ index + 1 }}</div>
          <div class="play" @click.stop="playClick(index)">
            <i class="el-icon-video-play"></i>
          </div>
          <div class="name">{{ item.name }}</div>
          <div class="singer_name" @click.stop="singerClick(item.ar[0].id)">
            {{ item.ar[0].name }}
          </div>
          <div class="time">04:00</div>
        </li>
      </ul>
      
    </div>
    <el-empty description="登录后才能获取音乐" v-show="!daySongList"></el-empty>
    <!-- <h1 >需要登录</h1> -->
  </div>
</template>

<script>
import { getDaySong } from "network/discovermusic.js";
export default {
  data() {
    return {
      daySongList: "",
      daySong: {
        cookie: "",
      },
    };
  },
  methods: {
    // 获取每日推荐歌曲
    getDaySongList() {
      getDaySong(this.daySong).then((res) => {
        if (res.code == 200) {
          this.daySongList = res.data.dailySongs;
          this.$store.commit("changedaySongList", res.data.dailySongs);
        }
      });
    },
    // 点击歌曲跳转到歌曲详情页
    toSongDetail(item) {
      this.$store.commit("changeSongDetail", item.id);
      if (this.$route.path != "/songdetail") {
        this.$router.push({
          path: "songdetail",
        });
      }
    },
    // 点击播放按钮
    playClick(index) {
      this.$store.commit("changeCurrentList", {
        currentList: this.daySongList,
        index: index,
      });
      this.$store.dispatch("getUrl");
      this.$store.dispatch("getLyric");
    },
    // 跳转到歌手详情页
    singerClick(id) {
      this.$store.commit("changeSingerId", id);
      this.$router.push({
        path: "singerdetails",
      });
    },
  },
  created() {
    this.daySong.cookie = this.$store.state.cookie;
    this.getDaySongList();
  },
};
</script>
<style  scoped>
.day_song {
  margin-bottom: 80px;
}
.day_song .header {
  width: 100%;

  box-sizing: border-box;
}
.day_song .header img {
  width: 100%;
}
.body {
  /* padding: 20px; */
  box-sizing: border-box;
  margin-top: 30px;
  margin-left: 20px;
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

.song_list {
    /* padding: 20px; */
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
.song_list li.active {
  background-color: orange !important;
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