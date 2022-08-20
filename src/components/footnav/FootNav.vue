<template>
  <div class="foot_nav">
    <audio
      :src="$store.state.musicURL"
      autoplay="autoplay"
      ref="audio"
      @play="play()"
      @ended="ended()"
      @timeupdate="timeupdate()"
    ></audio>
    <!------------------------------ 控制按钮 ---------------------------------------------->
    <div class="control">
      <div class="back" @click="backClick()">
        <i class="el-icon-arrow-left"></i>
      </div>
      <i
        class="el-icon-video-pause play"
        @click.stop="playClick()"
        v-if="isplay"
      ></i>
      <i class="el-icon-video-play play" @click.stop="playClick()" v-else></i>

      <div class="next" @click="nextClick()">
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>
    <!-- -----------------------------------播放进度条 ---------------------------------->
    <div class="prpgress_contion">
      <div class="current_time">{{ mm }}:{{ ss }}</div>
      <el-slider
        v-model="progressTime"
        class="progress"
        :max="duration"
        :wrapperClosable="true"
        :show-tooltip="false"
        @change="sliderChange()"
      ></el-slider>

      <div class="all_time">{{ allTimeMM }}:{{ allTimeSS }}</div>
    </div>

    <!-- -------------------------------播放模式-------------------- -->
    <div class="play_mode">
      <i
        class="iconfont icon-shunxubofang"
        @click.stop="modeClisk(1)"
        v-show="currentMode == 1"
      ></i>
      <i
        class="iconfont icon-xunhuanbofang"
        @click.stop="modeClisk(2)"
        v-show="currentMode == 2"
      ></i>
      <i
        class="iconfont icon-suijibofang"
        @click.stop="modeClisk(3)"
        v-show="currentMode == 3"
      ></i>
    </div>
    <!-------------------------- 歌名和歌手---------------------- -->
    <div class="foot_song_name">
      <span>歌名:</span>
      {{ $store.state.songName }}
    </div>
    <div class="foot_singer_name">
      <span>歌手:</span> {{ $store.state.singerName }}
    </div>

    <!-- -----------------------打开关闭歌词按钮----------------------------------- -->
    <div class="btn" @click="openDrawerClick()" v-if="!openDrawer">
      打开歌词
    </div>
    <div class="btn" @click="openDrawerClick()" v-else>关闭歌词</div>

    <!-- ---------------------当前播放列表弹框----------------- -->
    <div class="open_list">
      <el-popover
        placement="top"
        width="250"
        trigger="click"
        :value="isShow"
        popper-class="list_popover"
      >
        <ul class="list_ul" ref="list">
          <li
            v-for="(item, index) in $store.state.currentList"
            :key="index"
            @click="listClick(index)"
            :class="{ active: $store.state.index == index }"
          >
            <span>{{ index + 1 }}</span
            >{{ item.name }}
          </li>
        </ul>
        <i
          class="el-icon-s-fold open_icon"
          slot="reference"
          @click="openList()"
        ></i>
      </el-popover>
    </div>
    <!-- ---------------------------歌词窗口--------------------------- -->
    <div>
      <div
        class="lyric"
        :class="{ open_drawer: openDrawer, close_drawer: closeDrawer }"
      >
        <div class="lyric_header">
          <span class="song_name">{{ $store.state.songName }}</span>
          <div class="singer_name">{{ $store.state.singerName }}</div>
          <span class="close_icon" @click="openDrawerClick()">
            <i class="el-icon-close"></i>
          </span>
        </div>
        <div calss="lyric_item">
          <div class="lyric_img">
            <img :src="$store.state.songImg + '?param=200y200'" alt="" />
          </div>
          <ul ref="lyricUL" class="lyric_ul">
            <li
              v-for="(item, i) in lyricArr"
              :style="{
                color: lyricIndex === i ? '#d71345' : '#bed742',
                fontSize: lyricIndex === i ? '22px' : '18px',
              }"
              :key="i"
              :data-index="i"
              ref="lyric"
              :class="{
                pulse: lyricIndex === i ? true : false,
                animated: lyricIndex === i ? true : false,
              }"
            >
              {{ item.lyric }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      music: {},
      // 是否正在播放
      isplay: false,
      // 歌曲的总时长
      duration: 0,
      progressTime: 0,
      // 当前播放时间
      currentTime: 0,
      mm: "00",
      ss: "00",

      // 总时长的分秒
      allTimeMM: "00",
      allTimeSS: "00",

      lyricArr: [],
      lyricIndex: "",

      openDrawer: false,
      closeDrawer: true,

      isShow: false,

      currentMode: 1,
    };
  },

  methods: {
    // 打开歌词窗口
    openDrawerClick() {
      this.openDrawer = !this.openDrawer;
      this.closeDrawer = !this.closeDrawer;
    },
    // 播放音乐是触发的事件,是绑定在audio标签上的
    play() {
      this.getLyric();
      this.isplay = true;
      this.duration = parseInt(this.$refs.audio.duration);

      this.allTimeMM =
        (this.duration / 60) % 60 < 10
          ? "0" + parseInt(this.duration / 60)
          : parseInt(this.duration / 60);

      this.allTimeSS =
        this.duration % 60 < 10 ? "0" + this.duration : this.duration % 60;
    },
    // 歌曲播放完触发的事件,是绑定在audio标签上的
    ended() {
      var songList = this.$store.state.currentList;
      if(this.currentMode==1){
        var index = this.$store.state.index + 1;
        if (index > songList.length - 1) {
        index = 0;
      }
      }else if(this.currentMode==2){
        var index = this.$store.state.index
      }else{
        var index = Math.round(Math.random() * (songList.length - 1));
      }
      

      
      this.$store.commit("changeIndex", index); //改变歌曲的索引值
      this.$store.dispatch("getUrl"); //请求歌曲路径
      this.$store.dispatch("getLyric"); //请求歌词
    },
    // 暂停播放按钮
    playClick() {
      if (this.isplay) {
        this.isplay = !this.isplay;
        this.$refs.audio.pause();
      } else {
        this.isplay = !this.isplay;
        this.$refs.audio.play();
      }
    },
    // 下一曲
    nextClick() {
      var songList = this.$store.state.currentList;
      if (this.currentMode == 1) {
        var index = this.$store.state.index + 1;
        if (index > songList.length - 1) {
          index = 0;
        }
      } else if (this.currentMode == 2) {
        var index = this.$store.state.index+1;
      } else {
        var index = Math.round(Math.random() * (songList.length - 1));
      }
      this.$store.commit("changeIndex", index); //改变歌曲的索引值
      this.$store.dispatch("getUrl"); //请求歌曲路径
      this.$store.dispatch("getLyric"); //请求歌词
    },
    // 点击上一曲
    backClick() {
      var songList = this.$store.state.currentList;
        var index = this.$store.state.index - 1;
        if (index < 0) {
          index = songList.length - 1;
        }
      this.$store.commit("changeIndex", index); //改变歌曲的索引值
      this.$store.dispatch("getUrl"); //请求歌曲路径
      this.$store.dispatch("getLyric"); //请求歌词
    },
    //打开当前播放列表弹框
    openList() {
      this.isShow = true;
      this.$refs.list.style.top = `translateY(${
        this.$store.state.index * 25
      }px)`;
    },
    // 点击当前列表里面的歌曲，播放歌曲
    listClick(index) {
      this.isShow = false;
      this.$store.commit("changeIndex", index); //改变歌曲的索引值
      this.$store.dispatch("getUrl"); //请求歌曲路径
      this.$store.dispatch("getLyric"); //请求歌词
    },
    // 播放过程中触发的事件，播放过程中一直会触发
    timeupdate() {
      var time = parseInt(this.$refs.audio.currentTime);
      this.currentTime = this.$refs.audio.currentTime;
      this.mm =
        parseInt((time / 60) % 60) < 10
          ? "0" + parseInt((time / 60) % 60)
          : parseInt((time / 60) % 60);
      this.ss = time % 60 < 10 ? "0" + (time % 60) : time % 60;
      this.progressTime = this.$refs.audio.currentTime;
      // 匹配歌this.currentTime词
      for (let i = 0; i < this.lyricArr.length; i++) {
        if (this.currentTime > parseInt(this.lyricArr[i].time)) {
          const index = this.$refs.lyric[i].dataset.index;
          if (i === parseInt(index)) {
            this.lyricIndex = i;
            this.$refs.lyricUL.style.transform = `translateY(${
              -80 - 30 * (i + 1)
            }px)`;
          }
        }
      }
    },
    // 解析歌词
    getLyric() {
      var regNewLine = /\n/;
      var regTime = /\[\d{2}:\d{2}.\d{2,3}\]/;
      var lineArr = this.$store.state.lyric.split(regNewLine);
      var lyricsObjArr = [];
      lineArr.forEach((item) => {
        if (item == "") return;
        var obj = {};
        var time = item.match(regTime);
        obj.lyric =
          item.split("]")[1].trim() === "" ? "" : item.split("]")[1].trim();
        obj.time = time
          ? this.formatLyricTime(time[0].slice(1, time[0].length - 1))
          : 0;
        obj.uid = Math.random().toString().slice(-6);
        if (obj.lyric === "") {
          // console.log("这一行没有歌词");
        } else {
          lyricsObjArr.push(obj);
        }
      });
      this.lyricArr = lyricsObjArr;
    },
    // 音乐进度条滑动触发的事件
    sliderChange() {
      this.$refs.audio.currentTime = this.progressTime;
    },

    formatLyricTime(time) {
      // 格式化歌词的时间 转换成 sss:ms
      const regMin = /.*:/;
      const regSec = /:.*\./;
      const regMs = /\./;

      const min = parseInt(time.match(regMin)[0].slice(0, 2));
      let sec = parseInt(time.match(regSec)[0].slice(1, 3));
      const ms = time.slice(
        time.match(regMs).index + 1,
        time.match(regMs).index + 3
      );
      if (min !== 0) {
        sec += min * 60;
      }
      return Number(sec + "." + ms);
    },
    // -------------------------------播放模式切换-----------
    modeClisk(index) {
      if (index == 1) {
        this.$refs.audio.loop = true;
        this.currentMode = 2;
      } else if (index == 2) {
        this.$refs.audio.loop = false;
        this.currentMode = 3;
      } else if (index == 3) {
        this.$refs.audio.loop = false;
        this.currentMode = 1;
      }
    },
  },
};
</script>
<style scoped>
.foot_nav {
  height: 50px;
  width: 1200px;
  background-color: cadetblue;
  position: fixed;
  z-index: 999;
  bottom: 0px;
  display: flex;
  align-items: center;
}

/* 播放器控制  */
.control {
  display: flex;
  align-items: center;
  margin-left: 20px;
}
.control .back {
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  border-radius: 50%;
  background-color: rgba(20, 19, 19, 0.205);
  color: #ccc;
  margin-right: 10px;
  cursor: pointer;
}
.control .next {
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  border-radius: 50%;
  background-color: rgba(20, 19, 19, 0.205);
  color: #ccc;
  cursor: pointer;
}
.control .play {
  font-size: 30px;
  text-align: center;
  color: #ccc;
  margin-right: 10px;
  cursor: pointer;
}

.control .back:active,
.control .next:active {
  background-color: #ccc;
}

/* 进度条 */
.prpgress_contion {
  width: 400px;
  margin-left: 20px;
  display: flex;
  align-items: center;
  justify-self: start;
  margin-right: 20px;
}

.progress {
  margin-left: 10px;
  margin-right: 10px;
  width: 300px;
}

.foot_song_name {
  width: 165px;
  margin-right: 10px;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.foot_song_name span {
  color: chocolate;
}

.foot_singer_name {
  width: 150px;
  color: #fff;
  margin-right: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.foot_singer_name span {
  color: chocolate;
}
/* ----------------滚动歌词歌词页面--------------------------- */
.lyric_item {
  width: 1200px;
  display: flex;
}
.lyric_img {
  text-align: right;
  width: 350px;
  padding-right: 30px;
}
.lyric_img img {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  animation: songprc linear 20s infinite;
}
/* 歌词窗口图片旋转动画 */
@keyframes songprc {
  100% {
    transform: rotate(360deg);
  }
}
.lyric_ul {
  width: 1200px;
  flex: 1;
  cursor: pointer;
}
.lyric_ul li {
  text-align: center !important;
  width: 100%;
}
.btn {
  cursor: pointer;
  color: #fff;
}
.lyric_header {
  position: relative;
  height: 50px;
  background-color: #5e7c85;
  z-index: 999;
  padding-top: 30px;
  padding-bottom: 40px;
}
.song_name {
  font-weight: bold;
  color: #fff;
  font-size: 25px;
}
.singer_name {
  font-size: 14px;
  color: #ccc;
}
.close_icon {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
  height: 30px;
  width: 30px;
  font-size: 23px;
  z-index: 999;
  border-radius: 50%;
  line-height: 30px;
  color: aliceblue;
}
.close_icon:hover {
  background-color: #eee;
  color: #000;
}
.lyric {
  transform-origin: left bottom;
  background-color: #5e7c85;
  position: absolute;
  left: 0px;
  bottom: 50px;
  height: 675px;
  width: 1200px;
  transform: rotate(90deg);
  overflow: hidden;
  text-align: center;
  line-height: 30px;
  font-size: 18px;
}
.open_drawer {
  animation: open linear 0.5s forwards;
}
.close_drawer {
  animation: close linear 0.5s forwards;
}
@keyframes open {
  0% {
    bottom: 50px;
    transform-origin: left, bottom;
    transform: rotate(90deg);
  }
  100% {
    bottom: 50px;
    animation-fill-mode: forwards;
    transform-origin: left, bottom;
    transform: rotate(0deg);
  }
}
@keyframes close {
  0% {
    bottom: 0px;
    transform-origin: left, bottom;
    transform: rotate(0deg);
  }
  100% {
    bottom: 0px;
    animation-fill-mode: forwards;
    transform-origin: left, bottom;
    transform: rotate(90deg);
  }
}
.el-popover {
  background-color: slategray !important;
}
.open_list {
  margin-left: 20px;
}
.open_icon {
  color: #fff;
  font-size: 25px;
  cursor: pointer;
}
.list_ul {
  height: 400px;
  /* overflow:hidden; */
  overflow-y: auto;
}
.list_ul li {
  height: 25px;
  line-height: 25px;
  color: #000;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-bottom: 3px;
}

.list_ul li:nth-child(2n-1) {
  background-color: #c9b0c9;
}
.list_ul li:hover {
  background-color: #ccc;
  color: #fff;
}
.list_ul li span {
  display: inline-block;
  width: 30px;
  margin-left: 10px;
}
.list_ul li.active {
  background-color: orange;
  color: #fff;
}

/*--------------- 播放模式-------------------- */
.play_mode {
  width: 50px;
  color: #fff;
  cursor: pointer;
}
.play_mode i {
  font-size: 25px;
}
</style>