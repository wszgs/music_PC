import {request} from 'network/request'

export function getSingerList (option){
    return request({
    url: '/artist/list',
    params:{
        area:option.area,//地区
        type:option.type,//男女
        initial:option.initial,//匹配以initial字母开头的歌手
        limit:option.limit,//返回几条  
        offset:option.offset,//第几页
    }
    })
}

// 获取歌手所有歌曲
export function getSingerAllSong (option){
    return request({
    url: '/artist/songs',
    params:{
        id:option.id,//歌手id
        order:option.order,//hot ,time 按照热门或者时间排序
        limit:option.limit,//返回几条  
        offset:option.offset,//第几页
    }
    })
}

// 获取歌手所有专辑
export function getSingerAllAlbum (option){
    return request({
    url: '/artist/album',
    params:{
        id:option.id,//歌手id
        limit:option.limit,//返回几条  
        offset:option.offset,//第几页

    }
    })
}

//获取歌手详情
export function getSingerDetail (option){
    return request({
    url: '/artist/detail',
    params:{
        id:option.id,//歌手id

    }
    })
}

//获取歌曲详情
export function getSongDetail (option){
    return request({
    url: '/song/detail',
    params:{
        ids:option.ids,//歌手id

    }
    })
}

//获取歌曲详情
export function getSongLyric(option){
    return request({
    url: '/lyric',
    params:{
        id:option.id,//歌手id

    }
    })
}
