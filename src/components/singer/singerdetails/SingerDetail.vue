<template>
  <div class="singerdetails">
    <div class="header">
      <span class="name">
        {{ singerDateil.name }}
      </span>
    </div>

    <div class="about_singer">
      <div class="singer_img">
        <img :src="singerDateil.cover + '?param=200y200'" alt="" />
      </div>
      <div class="singer_detail">
        {{ singerDateil.briefDesc }}
      </div>
    </div>

    <div>
      <el-tabs type="border-card">
        <el-tab-pane>
          <span slot="label" @click="tabClick(0)">热门作品</span>
          <ul>
            <li
              v-for="(item, index) in songList"
              :key="index"
              class="song_item"
              @click="toSongDetail(item)"
            >
              <div class="index">
                {{ index + 1 }}
              </div>
              <div class="play_icon" @click.stop="playClick(index)">
                <i class="el-icon-video-play"></i>
              </div>
              <div class="song_name">{{ item.name }}</div>
              <div class="song_time">04:00</div>
              <div class="song_right">{{ item.al.name }}</div>
            </li>
          </ul>
        </el-tab-pane>
        <el-tab-pane>
          <span slot="label" @click="tabClick(1)">所有专辑</span>
          <div class="album">
            <div
              class="album_item"
              v-for="(item, index) in albumList"
              :key="index"
            >
              <div class="img">
                <img :src="item.picUrl + '?param=120y120'" alt="" />
              </div>
              <div class="album_name">{{ item.name }}</div>
              <div class="album_time">2021.12.26</div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane
          ><span slot="label" @click="tabClick(2)">相关MV</span>
          456
        </el-tab-pane>
        <el-tab-pane label="艺人介绍"
          ><span slot="label" @click="tabClick(3)">艺人介绍</span></el-tab-pane
        >
      </el-tabs>
    </div>

    <!-- 分页器 -->
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
</template>

<script>
import {
  getSingerAllSong,
  getSingerAllAlbum,
  getSingerDetail,
} from "network/singer.js";

export default {
  data() {
    return {
      singerId: "",
      curentType: 0,
      currentPage: 1, //分页器当前页数
      // singer: this.$route.query.singer, //跳转进这个页面传过来的歌手信息
      //   ---------------------------获取歌曲-------------------------------
      allSongRequest: {
        //请求歌曲的请求参数
        id: "", //歌手id
        order: "hot", //hot ,time 按照热门或者时间排序
        limit: 10, //返回几条
        offset: 0, //第几页
      },
      songList: [], //请求过来的歌曲
      // --------------请求专辑-----------------------------
      album: {
        id: "", //歌手id
        limit: "10", //返回几条
        offset: 0, //第几页
      },
      albumList: [],

      // -------------1请求歌手详情------------------------------
      detail: {
        id: "", //歌手id
      },
      singerDateil: "",
    };
  },
  methods: {
    //   请求歌曲
    getSingerSong() {
      getSingerAllSong(this.allSongRequest).then((res) => {
        this.songList = res.songs;
      });
    },
    //请求专辑
    getAlbum() {
      getSingerAllAlbum(this.album).then((res) => {
        this.albumList = res.hotAlbums;
      });
    },
    //请求歌手详情
    getDetail() {
      getSingerDetail(this.detail).then((res) => {
        this.singerDateil = res.data.artist;
      });
    },
    // 点击播放按钮
    playClick(index) {
      // 把当前播放列表和index传过去
      this.$store.commit("changeCurrentList", {
        currentList: this.songList,
        index: index,
      });
      this.$store.dispatch("getUrl");
      this.$store.dispatch("getLyric");
    },
    // 点击分页器触发的事件
    handleCurrentChange(val) {
      this.currentPage = val;
      if (this.curentType == 0) {
        this.allSongRequest.offset = (val - 1) * this.allSongRequest.limit;
        this.getSingerSong();
      } else if (this.curentType == 1) {
        this.album.offset = (val - 1) * this.album.limit;
        this.getAlbum();
      }
    },
    //
    tabClick(val) {
      this.curentType = val;
      this.currentPage = 1;
    },
    //-----------------------------
    toSongDetail(item) {
       this.$store.commit("changeSongDetail",item.id)
      if (this.$route.path != "/songdetail") {
        this.$router.push({
          path: "songdetail"
        });
      }
    },
  },
  created() {
    this.singerId = this.$store.state.singerId;

    this.allSongRequest.id = this.singerId;
    this.album.id = this.singerId;
    this.detail.id = this.singerId;
    this.getSingerSong();
    this.getAlbum();
    this.getDetail();
  },
};
</script>
<style scoped>
.singerdetails {
  padding: 15px 10px;
  background-color: #fff;
  margin-bottom: 60px;
}
.header .name {
  font-size: 23px;
}
.header .alias {
  font-size: 14px;
  color: rgb(170, 165, 165);
}
/* .singer_img {
  width: 100%;
  height: 200px;
} */
.singer_img img {
  border-radius: 10px;
  width: 200px;
  height: 200px;
}

.song_item {
  display: flex;
  height: 40px;
  line-height: 40px;
  padding-left: 10px;
  font-size: 14px;
  cursor: pointer;
}
.song_item:nth-child(2n-1) {
  background-color: #eee;
}
.song_item:hover {
  background-color: #ccc;
  color: #fff;
}
.song_item .index {
  width: 50px;
  margin-right: 80px;
}
.song_item .play_icon {
  font-size: 25px;
  cursor: pointer;
  margin-right: 100px;
}
.song_name {
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.song_name:hover{
  text-decoration: underline;
}
.song_time {
  margin-left: 100px;
  margin-right: 100px;
}
.song_right {
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.aaa {
  position: sticky;
  top: 0px;
}
.pagination {
  margin-top: 10px;
  margin-bottom: 60px;
}
.album {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  height: 500px;
}
.album_item {
  width: 180px;
  height: 220px;
  border: 1px dotted #ccc;
  margin-bottom: 30px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}
.album_item .img {
  width: 100%;
}
.album_item .img img {
  width: 180px;
  height: 160px;
}
.album_name {
  padding-left: 10px;
  font-size: 18px;
  width: 100%;
  height: 34px;
}
.album_time {
  padding-left: 10px;
  font-size: 12px;
}
.about_singer {
  display: flex;
}
.singer_detail {
  flex: 1;
  height: 200px;
  font-size: 16px;
  padding: 10px;
  text-indent: 2em;
  line-height: 20px;
  overflow-y: auto;
  /* text-overflow:ellipsis;
white-space: nowrap; */
}
</style>