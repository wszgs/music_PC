import {request} from 'network/request'
// 获取所有歌单分类
export function getCatList (option){
    return request({
    url: '/playlist/catlist'
    })
}

// 获取某个类型的歌单
export function getOneCategorie(option){
    return request({
    url: '/top/playlist',
    params:{
        cat:option.cat,//tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部",
        limit:option.limit,//取出歌单数量 , 默认为 20
        offset:option.offset//偏移数量 , 用于分页 , 如 :( 评论页数 -1)*50, 其中 50 为 limit 的值
    }
    })
}

// 获取歌单歌曲
export function getSong(option){
    return request({
    url: '/playlist/track/all',
    params:{
        cookie:option.cookie,
        id:option.id,//歌单 id
        limit:option.limit,//限制获取歌曲的数   
    }
    })
}

export function getSongSheetDetail(option){
    return request({
    url: '/playlist/detail/dynamic',
    params:{
        cookie:option.cookie,
        id:option.id,//歌单 id
    }
    })
}