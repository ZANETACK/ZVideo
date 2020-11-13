# ZVideo
播放器

# 使用
```html
 <div id="video"></div>
<script>
      let zv = new ZVideo({
            id: '#video',
            //width: 500, //视频宽度
            //height: 500, //视频高度
            playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度, 暂时没开发
            autoplay: false, //如果true,浏览器准备好时开始回放。
            muted: false, // 默认情况下将会消除任何音频。
            loop: false, // 导致视频一结束就重新开始。
            poster: null, //封面
            sources: [
                {
                    title: '视频-1',
                    url: 'https://www.runoob.com/try/demo_source/movie.mp4'
                }
            ]
        })

        //事件监听： play, pause, prev, next, ctrl, list, voice, full, load error timeupdate
        zv.addEventListener('play', () => {
            console.log('播放*****');
        })
  
</script>
```
# 方法
```js
    play: Function 播放
    pause: 暂停
    prev: 上一集
    next: 下一集
    openControl: 打开控制器
    closeControl: 关闭控制器
    openList: 打开列表
    closeList: 关闭列表
    openVoice: 打开声音
    closeVoice: 关闭声音
    openFull: 打开全屏
    closeFull: 关闭全屏
    load: 从新加载
    setVoice: 设置音频， 0 关闭音频, 大于 0 打开音频
    timeLength: 获取视频的播放时长
```

