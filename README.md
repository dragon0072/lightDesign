纯 js 编写的组件，使用 webpack 打包。
一、发布
  1.首先打开控制台
  2.运行`npm run build`(首次发布前，需先运行`npm install`安装必要依赖)
  3.打开项目目录的`dist`文件夹，里面生成的文件，为通用组件js代码
  4.打开项目目录的`view/css`，里面的`index.css`文件，为通用组件的css文件
二、目录结构
  |- dist js打包生成目录，打包好的js文件，放在当前文件夹下
  |- src
  |  |- index.js 打包的入口文件，新编写的组件，需要引入到当前文件中
  |- view 存放组件代码
  |  |- css 组件样式
  |  |- js 组件js代码
  |  |  |- components 组件js代码，一个文件夹下，是一个组件
  |  |  |- locales 组件通用多语言配置
  |- .babelrc es6解析配置文件
  |- package.json 项目依赖配置文件
  |- webpack.config.js 项目打包配置文件