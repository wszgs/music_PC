
// 排行榜登录请求
import {request} from 'network/request'

// 所有排行榜分类请求
export function getAllRank(option){
    return request({
    url: '/toplist',
    })
}
//获取排行榜详情
export function getRankDetail(option){
    return request({
        url:"/playlist/detail",
        params:{
            id:option.id
        }
    })
}

// 获取排行榜歌曲
export function getAllSong(option){
    return request({
        url:"/playlist/track/all",
        params:{
            id:option.id,//歌单 id
            limit:option.limit,//限制获取歌曲的数量
        }
    })
}