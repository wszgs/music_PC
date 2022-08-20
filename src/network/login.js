import {request} from 'network/request'
// ----------------------邮箱登录------------------------------
export function login(option){
    return request({
    url: '/login',
    params:{
        email:option.email,
        password:option.password
    }
    })
}

// =====================二维码登录=====================
export function QRcodeKey(option){
    return request({
    url: '/login/qr/key',
    params:{
        time:Date.parse(new Date()),
    }
    })
}

// 二维码生成接口let time1 = Date.parse(new Date())
export function QRcodeImg(option){
    return request({
    url: '/login/qr/create',
    params:{
        key:option.key,
        qrimg:"base64"
    }
    })
}

// ----------3. 二维码检测扫码状态接口----
export function QRcodeLoginCheck(option){
    return request({
    url: '/login/qr/check',
    params:{
        key:option.key,
        time:Date.parse(new Date())
    }
    })
}


// -----------------------------手机验证码登录登录------------

export function phoneCaptcha(option){
    return request({
    url: '/login/cellphone',
    params:{
        phone:option.phone,
        captcha:option.captcha
    }
    })
}
// 获取验证码
export function getCaptcha(option){
    return request({
    url: '/captcha/sent',
    params:{
        phone:option.phone,
    }
    })
}

// ------------------------手机密码登录---------------
export function phonePassword(option){
    return request({
    url: '/login/cellphone',
    params:{
        phone:option.phone,
        password:option.password
    }
    })
}



export function loginCheck(option){
    return request({
    url: '/login/status',
    params:{
        cookie:option.cookie,
        time:Date.parse(new Date()),
    }
    })
}

// ----------退出登录----
export function logout(option){
    return request({
    url: '/logout',
    params:{
        cookie:option.cookie,
        time:Date.parse(new Date()),
    }
    })
}