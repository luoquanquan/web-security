// 最简单的三方库, 如果有疑问就得学习下 node 基础了
const Koa = require('koa')
const KoaRouter = require('koa-router')
const path = require('path')
const koaBody = require('koa-body')
const koaStatic = require('koa-static')

// 自己实现的一些小工具
const { db, getReqData } = require('./utils')

const PORT = 2333

const app = new Koa()
const router = new KoaRouter()

// 路由表配置, 这里致敬了我们的后端, 所有的接口都是所有 http 方法一把梭
// 有技术追求的小伙伴可以了解下 RESTful 接口风格
/**
 * 登录接口
 * 从数据库里边找前端传来的用户名
 * 如果有登录成功
 * 如果没有登录失败
 */
router.all('/api/login', ctx => {
  const { body: { id } } = getReqData(ctx)
  if (db[id]) {
    ctx.cookies.set('userid', id)
    ctx.redirect('/')
  } else {
    ctx.redirect('/login.html')
  }
})

/**
 * 获取初始化用户信息
 * 致敬我们项目中的接口路径
 */
router.all('/api/appinfo', ctx => {
  const { id } = getReqData(ctx)
  if (db[id]) {
    ctx.body = {
      errno: 0,
      data: {
        money: db[id],
        userName: id
      }
    }
  } else {
    ctx.body = { errno: 666 }
  }
})

// 转账, 余额不足之类的异常情况统统不考虑
router.all('/api/transfer', ctx => {
  const { query: { toUser, money }, id } = getReqData(ctx)
  if (!id) {
    ctx.body = { errno: 666, errmsg: '您尚未登录请登录' }
    return
  }
  db[toUser] += (+money)
  db[id] -= (+money)
  ctx.body = { errno: 0 }
})

// 处理 post 数据, 详情请刷面试题: get/post 的区别
app.use(koaBody())

// 路由绑定
app.use(router.routes(), router.allowedMethods())

// 前端静态文件托管
app.use(koaStatic(path.resolve(__dirname, '../frond-end')))

app.listen(PORT, () => {
  console.log(`the server is running in ${PORT}`)
})
