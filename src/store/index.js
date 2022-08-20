import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import { getMusicUrl } from "network/discovermusic.js";
import { getSongLyric,getSongDetail } from "network/singer.js";

const store = new Vuex.Store({
	state: {
        // 当前播放音乐id、音乐路径、歌曲图片、歌曲名、歌词
        musicId: '',
        musicURL:'',
        lyric:"",
        songName:"",
        songImg:"",
        singerName:"",

        // ------------当前的歌手前倾页面的歌手id---------------------------
        singerId:"",
        // // ----------------存放当前播放列表--------------------
        // songListId:[],

        songDetail:"",

        // 当前歌单详情页的歌单id
        songSheetId:"",
        aboutSheet:{},//当前歌单详情页的歌单

        cookie:"",//cookie

        //当前播放列表和当前播放的索引值index
        currentList:[],
        index:"",

        daySongList:[],//每日推荐歌曲列表

        // 用户信息
        userInfo:{}

      },
    mutations:{
        changeMusicID(state,id){
            state.musicId = id
        },
        changeUrl(state,url){
            state.musicURL=url
        },
        changeLyric(state,lyric){
            state.lyric=lyric
        },
        changeSingerId(state,singerId){
            state.singerId=singerId
        },
        changeSongName(state,songName){
            state.songName=songName
        },
        changeSongImg(state,songImg){
            state.songImg=songImg
        },
        changeSongListId(state,songList){
            state.songListId=songList
        },
        changeSongSheetId(state,item){
            state.songSheetId=item.id
            state.aboutSheet=item
        },
        // cookie
        changeCookie(state,cookie){
            state.cookie=cookie
        },

        changeCurrentList(state,obj){
            state.currentList=obj.currentList
            state.index=obj.index
            state.musicId=state.currentList[state.index].id
        },
        changeIndex(state,index){
            state.index=index
            state.musicId=state.currentList[state.index].id
        },
        changeSingerName(state,singerName){
            state.singerName=singerName
        },
        changeSongDetail(state,id){
            state.songDetail=id
        },
        changedaySongList(state,daySongList){
            state.daySongList=daySongList
        },
        changedayUserInfo(state,userInfo){
            state.userInfo=userInfo
        },




    },
    actions:{
        getUrl(store){
            getMusicUrl(store.state.musicId).then(res=>{
                if(res.data[0].url){
                    store.commit('changeUrl', res.data[0].url);
                }
                
            })
        },
        getLyric(store){
            // 获取歌词
            getSongLyric({id:store.state.musicId}).then(res=>{
                store.commit('changeLyric', res.lrc.lyric);
            })

            getSongDetail({ids:store.state.musicId}).then(res=>{
                //获取当前播放歌曲的歌名、歌图片、歌手
                store.commit('changeSongName', res.songs[0].name);
                store.commit('changeSongImg', res.songs[0].al.picUrl);
                store.commit('changeSingerName', res.songs[0].ar[0].name);
            })
        },       
    }
})

export default store