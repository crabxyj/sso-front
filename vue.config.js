module.exports = {
    publicPath: './',
    //生产环境是否生成 sourceMap 文件，一般情况不建议打开
    productionSourceMap: false,
    devServer: {
        host: '0.0.0.0',
        port: 8081,
        https: false, // https:{type:Boolean}
        // open:true,//配置自动启动浏览器
        proxy: {
            '/api/*': {
                target: 'http://localhost:8080', // target host
                ws: true, // proxy websockets 
                changeOrigin: true, // needed for virtual hosted sites
                secure: false,
                pathRewrite: {
                    '^/api': '' // rewrite path
                }
            }
        }
    }
}
