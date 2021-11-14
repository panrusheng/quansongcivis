## 项目相关
项目启动：
```
npm start
如果初次启动项目或他人使用了新的库，需在此步之前执行 npm i
```

项目代码地址：
```
HTTP: http://10.76.0.186/gitlab/panrusheng/qscVis.git
SSH: git@10.76.0.186:panrusheng/qscVis.git
```

## 代码命名规则
组件：驼峰式，例如：YixiangView
css(类名)：-，例如：yixiang-view
类名命名逻辑：[父元素类名]-[元素类型]-[元素作用]，例如 y-view-btn-run


## git相关
一般流程：
```
                          //开始修改
git checkout -b branchA
                          //修改中……
                          //修改完毕
git status                //查看修改状态
git add fileName          //add文件
git commit -m "log"       //在branchA中commit 
git checkout branchB      //切换回BranchA父分支branchB
git pull                  //从远程数据库拉取代码
git merge branchA         //合并分支
git push                  //将修改提交到远程数据库
git branch -d branchA     //将branchA删除
```

## notes:
- 为了支持词云支持自定义导入图片设置形状，需要修改词云库的源代码。修改方式如下：找到文件`node_modules\js2wordcloud\dist\js2wordcloud.min.js`，搜索`&&/\.(jpg|png)$/.test(this._option.imageShape)`，将其删除即可。