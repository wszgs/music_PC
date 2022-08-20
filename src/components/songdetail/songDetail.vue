<template>
  <div class="song_detail">
    <div class="left_img">
      <img :src="songDetail.picUrl + '?param=200y200'" alt="" />
    </div>
    <div class="right_detail">
      <div class="about_singer">
        <p class="song_name">
          <i class="el-icon-s-flag"></i>
          <span>{{ songDetail.name }}</span>
        </p>
        <p class="singer_name">
          <span class="singer_name_left">歌手:</span>
          <span class="singer_name_right">{{ songDetail.singerName }}</span>
        </p>
        <p class="album_name">
          <span class="album_name_left">所属专辑:</span>
          <span class="album_name_right">{{ songDetail.albumName }}</span>
        </p>

        <p class="other">
          <button class="play" @click.stop="playClick()">
            <i class="el-icon-video-play"></i>播放
          </button>
          <button class="cang"><i class="el-icon-folder-add"></i>收藏</button>
          <button class="share"><i class="el-icon-share"></i>分享</button>
          <button class="download"><i class="el-icon-download"></i>下载</button>
          <button class="square">
            <i class="el-icon-chat-dot-square"></i>({{ songDetail.dt }})
          </button>
        </p>
      </div>

      <div class="lyric">
        <p class="lyric_item" v-for="(item, index) in lyricArr" :key="index">
          {{ item }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { getSongDetail, getSongLyric } from "network/singer.js";

export default {
  data() {
    return {
      songId: this.$store.state.songDetail,

      songRequest: {
        //歌曲详情请求参数
        ids: this.$store.state.songDetail, //歌曲id
      },

      songLsit: [],
      songDetail: {
        //请求回来的歌曲详情
        name: "",
        singerName: "",
        albumName: "",
        picUrl: "",
      },

      lyricRequest: {
        //歌词请求参数
        id: this.$store.state.songDetail,
      },
      lyricArr: [], //在vuex取出来经过处理的歌词
      lyricsObjArr: [],
    };
  },
  created() {
    this.songId = this.$store.state.songDetail;
    this.songRequest.ids = this.songId;
    this.lyricRequest.id = this.songId;
    this.getSong(); //获去歌曲详情
    this.getLyric(); // 解析歌词
    
  },
  methods: {
    //获去歌曲详情
    getSong() {
      getSongDetail(this.songRequest).then((res) => {
        this.songLsit = res.songs;

        this.songDetail.name = res.songs[0].name;
        this.songDetail.picUrl = res.songs[0].al.picUrl;
        this.songDetail.singerName = res.songs[0].ar[0].name;
        this.songDetail.albumName = res.songs[0].al.name;
      });
    },
    // 解析歌词
    getLyric() {
      getSongLyric(this.lyricRequest).then((res) => {
        this.lyricaaa = res.lrc.lyric;
        var aa = [];
        var lyric = res.lrc.lyric.split("[");
        lyric.forEach((item) => {
          var index = item.indexOf("]") + 1;
          aa.push(item.slice(index));
        });
        this.lyricArr = aa;
      });
    },
    // 点击播放按钮播放音乐
    playClick() {
      this.$store.commit("changeCurrentList", {
        currentList: this.songLsit,
        index: 0,
      });
      this.$store.dispatch("getUrl");
      this.$store.dispatch("getLyric");
    },
  },


};
</script>
<style  scoped>
.song_detail {
  display: flex;
}
.song_detail .left_img {
  width: 300px;
  text-align: center;
  margin-top: 20px;
}
.left_img img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
}
.right_detail {
  flex: 1;
  margin-top: 20px;
}

.song_name {
  margin-bottom: 10px;
}
.song_name i {
  font-size: 30px;
  color: crimson;
}
.song_name span {
  font-size: 25px;
}
.singer_name {
  line-height: 20px;
  margin-bottom: 5px;
}
.singer_name_left,
.album_name_left {
  font-size: 14px;
  margin-right: 10px;
  color: rgb(116, 111, 111);
}
.singer_name_right,
.album_name_right {
  color: #0c73c2;
}
.other {
  margin-top: 5px;
  display: flex;
  align-items: center;
}
.other .play {
  display: flex;
  align-items: center;
  color: #ffffff;
  padding: 5px 6px;
  font-size: 13px;
  margin-right: 5px;
  cursor: pointer;
  background-color: dodgerblue;
  border: none;
}
.other .play i {
  font-size: 20px;
  margin-right: 5px;
}
.other .cang,
.share,
.download,
.square {
  display: flex;
  align-items: center;
  font-size: 12px;
  padding: 5px;
  cursor: pointer;
  margin-right: 10px;
}

.other .cang i,
.share i,
.download i,
.square i {
  font-size: 18px;

  margin-right: 5px;
}
.lyric {
  margin-top: 10px;
  margin-bottom: 100px;
}
.lyric_item {
  font-size: 14px;
  margin-bottom: 5px;
  color: #006c54;
}
</style>