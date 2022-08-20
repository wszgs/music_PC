import {request} from 'network/request'

//请求首页轮播图和轮播图下面的
export function getbanner(){
   return request({
        url:"/banner"
    })
}

//搜索框关键字请求keywords关键字，limit返回几条
export function getSearch (keywords){
    return request({
    url: '/cloudsearch',
    params:{
        keywords:keywords,
        limit:15
    }
    })
}

// 获取音乐链接
export function getMusicUrl (id){
    return request({
    url: '/song/url',
    params:{
        id:id
    }
    })
}

// 获取每日推荐歌曲
export function getDaySong (option){
    return request({
    url: '/recommend/songs',
    params:{
        cookie:option.cookie,
    }
    })
}

// 获取推荐热门歌单
export function getHotSheet (option){
    return request({
    url: '/top/playlist',
    params:{
        cookie:option.cookie,
        limit:10,
    }
    })
}

// 个性化推荐图标请求
export function getPersonalityIcon(){
    return request({
    url: '/homepage/dragon/ball'
    })
}