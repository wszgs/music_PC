import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
  {
    path: '/',
    redirect: '/discovermusic'
  },
  {
    name: 'discovermusic',
    path: '/discovermusic',
    component: () => import('pages/discovermusic/DiscoverMusic.vue'),
    meta: {
      title: '发现音乐',
      keep: true,
      iconClass:"el-icon-s-home"
    }
  },
  {
    name: 'ranking',
    path: '/ranking',
    component: () => import('pages/ranking/Ranking.vue'),
    meta: {
      title: '排行榜',
      keep: true,
      iconClass:"el-icon-s-data"
    }
  },
  {
    name: 'singer',
    path: '/singer',
    component: () => import('pages/singer/Singer.vue'),
    meta: {
      title: '歌手',
      keep: true,
      iconClass:"el-icon-s-custom"
    },

  },
  {
    name: 'songsheet',
    path: '/songsheet',
    component: () => import('pages/songsheet/SongSheet.vue'),
    meta: {
      title: '歌单',
      keep: true,
      iconClass:"el-icon-tickets"
    },

  },
  {
    name: "singerdetails",
    path: "/singerdetails",
    component: () => import('components/singer/singerdetails/SingerDetail.vue'),
    meta: {
      keep: false,

    },
  },
  {
    name: "songdetail",
    path: "/songdetail",
    component: () => import('components/songdetail/songDetail.vue'),
    meta: {

      keep: false
    },
  },
  {
    name: "songsheetdetail",
    path: "/songsheetdetail",
    component: () => import('components/songsheet/SongSheetDetail.vue'),
    meta: {
      keep: false,
    },
  },
  {
    name: "daysong",
    path: "/daysong",
    component: () => import('components/discovermusic/daySong/daysong.vue'),
    meta: {
      keep: false,
    },
  }
]

const router = new Router({
  routes,
  mode: "history"
})

export default router

