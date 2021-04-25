module.exports = {
    lintOnSave: false,
    //vue-cli3里的配置文件
    css: {
        loaderOptions: {
            stylus: {
                "resolve url": true,
                import: ["./src/theme"]
            }
        }
    },
    pluginOptions: {
        "cube-ui": {
            postCompile: true,
            theme: true
        }
    }
};