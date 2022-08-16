
import axios from 'axios'
import qs from 'qs'
let url = 'https://api.battlemetrics.com'


/* let BaseUrl = process.env.VUE_APP_BASE_URL
let Assets = process.env.VUE_APP_ASSETS_URL
let OrderProvider = process.env.VUE_APP_ORDER_PROVIDER_URL
let PermissionService = process.env.VUE_APP_PERMISSION_SERVER_URL
let consumerGoodsService = process.env.VUE_APP_CONSUMER_GOODS_URL
let zoworldSearch = process.env.VUE_APP_ZOWORLD_SEARCH_URL
let deliver = process.env.VUE_APP_DELIVER_URL
let wxFile = process.env.VUE_APP_WXFILE_URL
let file = process.env.VUE_APP_FILE_URL */
const service = axios.create({
    baseURL: url, // api的base_url（基本地址）
    timeout: 20000, // 请求超时时间
    headers: {
        'Content-Type': 'application/json;charset=utf-8',//跨域
        Accept: 'application/json'
        // "Access-Control-Allow-Origin": "*"
    },
    // Access-Control-Allow-Origin
    isFile: false,
    noToken: false,//true:不携带Token； 不写或者false就是默认携带Token
    withCredentials: false, // 允许携带cookie
    dataType: 'jsonp',  //数据格式设置为jsonp
    jsonp: 'callback',  //Jquery生成验证参数的名称
    path: '',
    isParams: false
})

// request拦截器(请求拦截器)
service.interceptors.request.use(
    //发送请求前的配置
    config => {

        // 处理请求参数
        handleParams(config)
        
        // config.baseURL = handlePrefixUrl(config)
        // 是否要更改header内容 上传文件
        if (config.isFile) {
            config.headers['Content-Type'] = 'multipart/form-data'
        }


        // 删除多余的参数isHideLoading
        if (config.data.isHideLoading) {
            delete config.data.isHideLoading
        }

        if (config.method === 'post') {
            // 设置参数拼接方式
            if (config.data && config.headers['Content-Type'] === 'application/json') {//普通json的post请求
                config.data = qs.stringify(config.data)
            } else if (config.data && config.headers['Content-Type'] === 'multipart/form-data') {//文件上传时
                let newParams = new FormData()
                for (let key in config.data) {
                    newParams.append(key, config.data[key])
                }
                config.data = newParams
            }
            if (config.isParams && config.data && JSON.stringify(config.data) != '{}') {
                config.url = config.url + '?' + qs.stringify(config.data)
            }
        } else {
            if (config.data && JSON.stringify(config.data) != '{}') {
                config.url = config.url + '?' + qs.stringify(config.data)
            }
        }
        // 开启loading

        return config
    },
    //在请求错误的时候
    error => {
        Promise.reject(error)
    }
)

// respone拦截器(响应拦截器)
service.interceptors.response.use(
    //请求成功对响应数据做处理
    response => {
        // code为非0是抛错 可结合自己业务进行修改
        if (response.status === 200) {
            const res = response.data
            if(response.config.isAutoDownloadFile){
              const link = document.createElement('a')
              let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
              link.style.display = 'none'
              link.href = URL.createObjectURL(blob)
              // 因为无法获取到Content-Disposition 所以写死
              let filename = response.config.filename ? response.config.filename : '表格';
              let dd = new Date()
              let Month = `${dd.getMonth() + 1 < 10 ? '0'+ dd.getMonth() + 1 : dd.getMonth() + 1}`
              let time = `${dd.getFullYear()}${Month}${(dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate())}`;
              let suffix = response.config.suffix ? response.config.suffix : '.xls'
              let downloadFileName = filename + suffix  //下载的文件名 xx.xx
              link.download =  downloadFileName
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }
            if (res.code !== '0') {
                let message = res.msg
            }
            if (response.config.returnRes == 'all') {
              return response
            }
            return res
        } else {
            // 隐藏loading
            ElMessage('请求失败，请检查网络是否连接正常')
            return Promise.reject('networkRequestError')

        }
    },
    //响应错误
    error => {
      
        // 断网 或者 请求超时 状态
        if (!error.response) {
            // 请求超时状态
            if (error.message.includes('timeout')) {
                // console.log('超时了')
                ElMessage('请求超时，请检查网络是否连接正常')
            } else {
                // 可以展示断网组件
                // console.log('断网了')
                ElMessage('请求失败，请检查网络是否已连接')
            }
            return
        }
        return Promise.reject(error)
    }
)

//处理http请求接口前缀
function handlePrefixUrl(config) {
    // return config.BaseURL;
    switch (config.path) {
        case 'assets':
            return Assets
        case 'order-provider':
            return OrderProvider
        case 'permission-service':
            return PermissionService
        case 'consumer-goods':
            return consumerGoodsService
        case 'zoworld-search':
            return zoworldSearch
        case 'baidu-map':
            return ''
        case 'deliver':
            return deliver
        case 'wxFile':
            return wxFile
        case 'file':
            return file
        default:
            return BaseUrl
    }
}

// 处理请求参数
function handleParams(config) {
    
    if (!config.data) {
        // 防止不传参数的情况下，config中没有data属性
        config['data'] = {}
    }

    // 登录不要token
    if (!config.noToken) {
        // 接口调试的时候，向后台索取TokenKey，给 config.data['TokenKey'] 赋值
        config.headers['Authorization'] = localStorage.getItem('TokenKey')
    }

    // 合并请求参数
    if (config.params) {
        config.data = {...config.data, ...config.params}
    }
}



export default service
