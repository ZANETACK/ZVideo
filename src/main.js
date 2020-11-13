import {
    $,
    display,
    addClass,
    css,
    stopEvent,
    removeClass,
    realFormatSecond,
    stopMouseEvent
} from "./utils";

let vm;
class ZVideo {
    constructor(options) {
        vm = this;
        Object.assign(vm, options, {
            iconLink: '//at.alicdn.com/t/font_2197806_tdbemn1kgp.css', //图标
            isPlay: false, //是否播放
            currentItem: null,
            currentIndex: 0,
            percent: 0,
            timeStr: '00:00',
            durationStr: '00:00',
            canplay: false,
            isShowList: false,
            isError: false,
            isVoice: true,
            isFull: false,
            messageTime: 3000
        });
        if (!vm.id) {
            console.warn('请设置id')
            return;
        }
        //初始化
        this._init();
    }

    _init() {
        //保存容器元素
        vm.$el = $(this.id);
        vm.$el.classList.add('z-video');
        //创建视频元素 crossOrigin="*"
        vm.$el.innerHTML = `<div class="z-video-container">
                                <video  id="z-video" 
                                        rossOrigin="anonymous"
                                        ${vm.autoplay && 'autoplay="true"'} 
                                        ${vm.muted && 'muted="true"'}
                                        ${vm.loop && 'loop="true"'}
                                        ${vm.poster && `poster="${vm.poster}"`}
                                        style="width: ${vm.width ? vm.width + 'px' : '100%'};height: ${vm.height ? vm.height + 'px' : 'auto'}">
                                    <source class="z-video-source" type="video/mp4"/>
                                    <source class="z-video-source" type="video/ogg"/>
                                    <source class="z-video-source" type="video/webm"/>
                                </video>
                            </div>
                            <div class="z-video-no-select z-video-control" id="z-video-control">
                                <div class="z-progress">
                                  <i class="z-progress-line" id="z-progress-line"></i>
                                  <i class="z-progress-bar" id="z-progress-bar"></i>
                                  <div id="z-progress" style="position: absolute;width: 100%;z-index: 999;height: 100%;"></div>
                                </div>
                                <div class="z-video-control-item">
                                    <i id="z-play-pause" class="z-play-pause iconfont ${vm.autoplay ? 'icon-shitinghui' : 'icon-bofang'}"></i>
                                    <i id="z-video-prev" class="z-video-prev iconfont icon-shangyiji"></i>
                                    <i id="z-video-next" class="z-video-next iconfont icon-xiayiji"></i>
                                    <span class="z-video-time"><i id="z-video-time">${vm.timeStr}</i> / <i id="z-video-duration">${vm.durationStr}</i></span>
                                </div>
                                <div class="z-video-control-item"> 
                                    <i id="z-video-voice" class="z-video-voice iconfont ${vm.isVoice ? 'icon-laba' : 'icon-guanbishengyin'}"></i>
                                    <i id="z-video-full" class="z-video-full iconfont icon-quanping"></i>
                                    <i id="z-video-list" class="z-video-list iconfont icon-liebiao"></i>
                                </div>
                            </div>
                            <div class="z-video-list-content" id="z-video-list-content" style="width: 0">
                                <p class="z-video-play-title"><i style="font-size: 14px;" class="iconfont icon-dayu"></i>播放列表（<span id="z-video-play-title">0</span>）</p>
                                <div class="z-video-list-box scrollbar" id="z-video-list-box"></div>
                            </div>
                            <i class="z-video-error iconfont icon-wangluocuowu1" id="z-video-error">网路错误</i>
                            <i class="z-video-loading iconfont icon-jiazai" id="z-video-loading"></i>
                            <span class="z-video-message" id="z-video-message"></span>
                            <div class="z-video-pan"  id="z-video-audio">
                                <i class="z-video-pan-circle c-1"></i>
                                <i class="z-video-pan-circle c-2"></i>
                                <i class="z-video-pan-circle c-3"></i>
                                <i class="z-video-pan-circle c-4"></i>
                                <i class="z-video-pan-circle c-5"></i>
                                <i class="z-video-pan-circle c-6"></i>
                                <i class="z-video-pan-circle c-7"></i>
                                <i class="z-video-pan-circle c-8"></i>
                                <i class="z-video-pan-circle c-9"></i>
                                <i class="z-video-pan-circle c-10"></i>
                                <i class="z-video-pan-circle c-11"></i>
                                <i class="z-video-pan-circle c-12"></i>
                                <i class="z-video-pan-circle c-13"></i>
                                <i class="z-video-pan-circle c-14"></i>
                                <i class="z-video-pan-circle c-15"></i>
                                <i class="z-video-audio iconfont icon-yinpin1"></i>
                            </div>
                        `;

        //设置字体图标
        let link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', vm.iconLink);
        document.head.appendChild(link);

        //初始化元素
        vm.$video = $('#z-video');
        //控制条
        vm.$control = $('#z-video-control');
        //暂停播放
        vm.$play = $('#z-play-pause');
        //上一集
        vm.$prev = $('#z-video-prev');
        //下一集
        vm.$next = $('#z-video-next');
        //时间
        vm.$time = $('#z-video-time');
        //时长
        vm.$duration = $('#z-video-duration');
        //声音
        vm.$voice = $('#z-video-voice');
        //全屏
        vm.$full = $('#z-video-full');
        //列表
        vm.$list = $('#z-video-list');
        //列表个数
        vm.$count = $('#z-video-play-title');
        //列表容器
        vm.$listBox = $('#z-video-list-box');
        vm.$listView = $('#z-video-list-content');

        //加载
        vm.$loading = $('#z-video-loading');
        //进度条
        vm.$progress = $('#z-progress');
        vm.$progressLine = $('#z-progress-line');
        vm.$progressBar = $('#z-progress-bar');
        vm.$message = $('#z-video-message');
        vm.$error = $('#z-video-error');
        vm.$audio = $('#z-video-audio');


        if (!Array.isArray(vm.sources)) {
            vm.sources = [];
            if (vm.error_fn) vm.error_fn('资源列表不能为空');
            vm._message({
                type: 'error',
                message: '资源列表不能为空！'
            })
            return;
        }
        if (!navigator.onLine) {
            vm._message({
                type: 'error',
                message: '网络错误！'
            })
            if (vm.error_fn) vm.error_fn('网络错误');
            display(vm.$error, true)
        }

        vm._onChange(0);

        vm._initVideo();

        vm._control(false);
        vm._initList();

        //事件初始化
        vm._initEvent();

    }
    _initVideo() {

        //可以播放
        vm.$video.addEventListener('canplay', () => {
            vm.isError = false;
            vm.canplay = true;
            vm.durationStr = realFormatSecond(vm.$video.duration);
            vm.$duration.innerText = vm.durationStr;
            vm.isPlay ? vm._play() : vm._pause();
            vm._loading(false);
            if (!vm.is_ctrl && !vm.is_init) {
                vm.is_init = true;
                vm._control(true);
            }
            display(vm.$error, false);
        })

        //视频播放
        vm.$video.addEventListener('timeupdate', (e) => {
            vm.percent = (vm.$video.currentTime / vm.$video.duration) * 100;
            vm._setTimeStr();
            vm._setBar();
            if (vm.timeupdate_fn) {
                vm.timeupdate_fn(e)
            }
        })

        vm.$video.addEventListener('ended', () => {
            vm._pause();
        })

        vm.$video.addEventListener('error', (e) => {
            vm.isError = true;
            vm._pause();
            if (vm.error_fn) vm.error_fn('视频加载出现错误', e);
            vm._message({
                type: 'error',
                message: '视频加载出现错误！'
            })
            addClass(vm.$listItme[vm.currentIndex], 'error')
        })
    }

    _initEvent() {
        //监听鼠标移出视频容器
        function videoover() {
            if (vm.canplay && !vm.is_ctrl) vm._control(true);
        }
        function videoleave() {
            vm.$video.mousetimer = setTimeout(() => {
                vm._control(false);
                vm._closeList();
            }, 2200)
        }
        vm.$video.onmouseover = () => { videoover() }
        vm.$video.onmouseleave = () => { videoleave() }
        vm.$control.onmouseover = () => { videoover() }
        vm.$control.onmouseleave = () => { videoleave() }
        vm.$listView.onmouseover = () => { videoover() }
        vm.$listView.onmouseleave = () => { videoleave() }
        //播放暂停按钮
        stopMouseEvent(vm.$play);
        vm.$play.onclick = e => {
            stopEvent(e);
            vm.isPlay ? vm._pause() : vm._play();
        }

        stopMouseEvent(vm.$list);
        vm.$list.onclick = e => {
            stopEvent(e);
            vm.isShowList ? vm._closeList() : vm._openList();
        }
        stopMouseEvent(vm.$voice);
        vm.$voice.onclick = e => {
            vm.isVoice ? vm._closeVoice() : vm._openVoice();
        }
        stopMouseEvent(vm.$full);
        vm.$full.onclick = e => {
            stopEvent(e);
            vm.isFull ? vm._exitFull() : vm._full();
        }
        vm.$video.onclick = e => {
            stopEvent(e);
            vm._closeList();
        }
        stopMouseEvent(vm.$prev);
        vm.$prev.onclick = e => {
            stopEvent(e);
            vm._prev()
        }
        stopMouseEvent(vm.$next);
        vm.$next.onclick = e => {
            stopEvent(e);
            vm._next();
        }



        function onmousedown() {
            vm.mouseDown = true;
            addClass(vm.$progressBar, 'active')
            addClass(vm.$progressBar, 'no');
            vm.$video.pause();
        }
        function onmouseup(offsetX) {
            if (vm.mouseDown) {
                removeClass(vm.$progressBar, 'active');
                removeClass(vm.$progressBar, 'no');
                vm._setSliderPointerValue(offsetX);
                vm._setVideoTime();
                if (vm.isPlay) {
                    vm.$video.play();
                }
                vm.mouseDown = false;
            }
        }
        function onmousemove(offsetX) {
            if (vm.mouseDown) {
                vm._setSliderPointerValue(offsetX)
            }
        }

        //鼠标按下
        vm.$progress.onmousedown = () => {
            onmousedown();
        }
        //鼠标抬起
        vm.$progress.onmouseup = e => {
            onmouseup(e.offsetX)
        }

        vm.$progress.onmousemove = e => {
            onmousemove(e.offsetX)
        }

        vm.$progress.onmouseleave = e => {
            onmouseup(e.offsetX)
        }


        vm.$progress.addEventListener('touchstart', () => {
            onmousedown();
        })
        vm.$progress.addEventListener('touchend', e => {
            onmouseup(e.changedTouches[0].clientX)
        })
        vm.$progress.addEventListener('touchmove', e => {
            onmousemove(e.changedTouches[0].clientX)
        })

        window.addEventListener('online', () => {
            vm._message({
                type: 'success',
                message: '网路已连接！'
            })
            display(vm.$error, false)
        });

        window.addEventListener('offline', () => {
            vm._message({
                type: 'error',
                message: '网路已断开！'
            })
            display(vm.$error, true)
        });

        window.addEventListener('resize', () => {
            console.log('vm.isFull', vm.isFull);
            if (vm.isFull) {
                vm._exitFull_fn();
            }
        });

        window.addEventListener('keyup', e => {
            if (e.keyCode === 32) {
                vm.isPlay ? vm._pause() : vm._play();
            }
            if (e.keyCode === 39 || e.keyCode === 37) {
                vm.$video.play();
            }
        })
        window.addEventListener('keydown', e => {
            if (e.keyCode === 39) {
                vm.$video.pause();
                vm.$video.currentTime += 5;
            }
            if (e.keyCode === 37) {
                vm.$video.pause();
                vm.$video.currentTime -= 5;
            }
        })

    }
    _message(options) {
        if (options.type === 'success') {
            removeClass(vm.$message, 'error')
            addClass(vm.$message, 'success');
        }
        if (options.type === 'error') {
            removeClass(vm.$message, 'success')
            addClass(vm.$message, 'error');
        }
        vm.$message.innerText = options.message;
        setTimeout(() => {
            removeClass(vm.$message, 'success');
            removeClass(vm.$message, 'error');
            vm.$message.innerText = '';
        }, vm.messageTime)
    }
    /** 控制事件   */
    //隐藏列表图标
    _setListIcon(bool) {
        display(vm.$list, bool);
    }
    //显示控制条
    _control(bool) {
        bool ? addClass(vm.$control, 'active') : removeClass(vm.$control, 'active');
        if (bool && vm.$video && vm.$video.mousetimer) {
            clearTimeout(vm.$video.mousetimer)
        }
        if (vm.ctrl_fn) vm.ctrl_fn(bool, vm)
    }
    //设置播放图标
    _setPlayIcon() {
        if (vm.canplay && vm.isPlay) {
            removeClass(vm.$play, 'icon-bofang');
            addClass(vm.$play, 'icon-shitinghui');
        } else {
            removeClass(vm.$play, 'icon-shitinghui');
            addClass(vm.$play, 'icon-bofang');
        }
    }
    //列表
    _closeList() {
        css(vm.$listView, 'width', '0');
        vm.isShowList = false;
        if (vm.list_fn) vm.list_fn(vm, false);
    }
    _openList() {
        css(vm.$listView, 'width', '245px');
        vm.isShowList = true;
        if (vm.list_fn) vm.list_fn(vm, true);
    }

    //声音
    _closeVoice() {
        removeClass(vm.$voice, 'icon-laba')
        addClass(vm.$voice, 'icon-guanbishengyin');
        vm.isVoice = false;
        vm.$video.muted = true;
        if (vm.voice_fn) vm.voice_fn(vm, false);
    }
    _openVoice() {
        removeClass(vm.$voice, 'icon-guanbishengyin')
        addClass(vm.$voice, 'icon-laba')
        vm.isVoice = true;
        vm.$video.muted = false;
        if (vm.voice_fn) vm.voice_fn(vm, true);
    }
    //播放器
    _pause() {
        vm.isPlay = false;
        vm.$video.pause();
        vm._setPlayIcon();
        removeClass(vm.$audio, 'play')
        if (vm.pause_fn) {
            vm.pause_fn(vm)
        }
    }
    _play() {
        vm.isPlay = true;
        vm.$video.play();
        vm._setPlayIcon();
        addClass(vm.$audio, 'play')
        if (vm.play_fn) {
            vm.play_fn(vm)
        }
    }
    //从新加载
    _load() {
        vm.$video.load();
        vm._setPlayIcon();
        if (vm.load_fn) vm.load_fn(vm);
    }
    _prev() {
        vm.percent = 0;
        vm._setBar();
        vm.currentIndex--;
        if (vm.currentIndex < 0) {
            vm.currentIndex = vm.sources.length - 1;
        }
        vm._onChange(vm.currentIndex);
        if (vm.$currentItem) removeClass(vm.$currentItem, 'active');
        vm.$currentItem = vm.$listItme[vm.currentIndex]
        addClass(vm.$currentItem, 'active');
        if (vm.prev_fn) vm.prev_fn(vm)
    }
    _next() {
        vm.percent = 0;
        vm._setBar();
        vm.currentIndex++;
        if (vm.currentIndex > vm.sources.length - 1) {
            vm.currentIndex = 0;
        }
        vm._onChange(vm.currentIndex);
        if (vm.$currentItem) removeClass(vm.$currentItem, 'active');
        vm.$currentItem = vm.$listItme[vm.currentIndex]
        addClass(vm.$currentItem, 'active');
        if (vm.next_fn) vm.next_fn(vm)
    }
    _setVideoTime() {
        vm.$video.currentTime = vm.$video.duration * (vm.percent / 100);
    }
    _setTimeStr() {
        vm.timeStr = realFormatSecond(vm.$video.currentTime);
        if (vm.timeStr) {
            vm.$time.innerText = vm.timeStr;
            vm._statisticsDuration();//已秒计时
        }
    }

    //全屏
    _full() {
        if (vm.full_fn) vm.full_fn(vm, true);
        addClass(vm.$video, 'full')
        removeClass(vm.$full, 'icon-quanping');
        addClass(vm.$full, 'icon-eLongVideoPlayer_fullRecover');
        if (vm.$el.requestFullscreen) {
            vm.$el.requestFullscreen()
        }
        else if (vm.$el.webkitRequestFullScreen) {
            vm.$el.webkitRequestFullScreen();
        }
        else if (vm.$el.mozRequestFullScreen) {
            vm.$el.mozRequestFullScreen();
        }
        else {
            vm.$el.msRequestFullscreen();
        }

        setTimeout(() => {
            vm.isFull = true;
        }, 300)
    }
    _exitFull() {
        vm._exitFull_fn();
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }

    }

    _exitFull_fn() {
        vm.isFull = false;
        if (vm.full_fn) vm.full_fn(vm, false);
        removeClass(vm.$video, 'full');
        removeClass(vm.$full, 'icon-eLongVideoPlayer_fullRecover');
        addClass(vm.$full, 'icon-quanping');
    }

    _setSliderPointerValue(offsetX) {
        let width = vm.$progress.clientWidth;
        let barWidth = vm.$progressBar.clientWidth;
        let left = 0;
        let x = offsetX - left - barWidth / 2;
        let sw = width - barWidth;
        if (x <= 0) {
            x = 0;
        } else if (x >= sw) {
            x = sw;
        }

        vm.percent = x / sw * 100;
        vm.left = x;
        vm._setBar();
    }


    /********工具函数*******/
    //初始化播放列表
    _setBar() {
        css(vm.$progressBar, 'left', vm.percent + '%');
        css(vm.$progressLine, 'width', vm.percent + '%')
    }
    _initList() {
        if (vm.sources.length === 1) {
            //不显示列表图标
            this._setListIcon(false);
            css(vm.$full, 'marginRight', '0');
            display(vm.$prev, false);
            display(vm.$next, false);
            return;
        }
        let html = '';
        vm.sources.map((item, i) => {
            html += `<div  class="z-video-item" title="${item.title}">${item.title}</div>`
        })
        vm.$listBox.innerHTML = html;
        vm.$count.innerText = vm.sources.length;

        vm.$listItme = document.getElementsByClassName('z-video-item');
        vm.$currentItem = null;
        for (let i in vm.$listItme) {
            if (vm.$listItme[i] && vm.$listItme[i].nodeType === 1) {
                (($item, i) => {
                    if (!vm.$currentItem && i == vm.currentIndex) {
                        addClass($item, 'active');
                        vm.$currentItem = $item;
                    }
                    $item.onclick = function (e) {
                        if (vm.$currentItem) {
                            removeClass(vm.$currentItem, 'active');
                        }
                        addClass($item, 'active');
                        vm.$currentItem = $item;
                        vm._onChange(i);
                    }
                })(vm.$listItme[i], i)
            }
        }
    }
    _onChange(i) {
        vm._loading(true);
        vm.percent = 0;
        vm._setBar();
        vm.currentIndex = i;
        vm.currentItem = vm.sources[vm.currentIndex];
        vm._setUrl(vm.currentItem.url);
        vm._load();
        display(vm.$audio, vm.currentItem.type === 'audio')
    }

    //设置视频地址
    _setUrl(url) {
        //缓存元素节流
        if (!vm.sourceList) vm.sourceList = document.querySelectorAll('.z-video-source');
        for (let i in vm.sourceList) {
            let item = vm.sourceList[i];
            if (item && item.nodeType === 1) {
                item.setAttribute('src', url);
            }
        }
    }
    _loading(bool) {
        display(vm.$loading, bool)
    }
    //统计时长
    _statisticsDuration() {
        let timeLength = vm.sources[vm.currentIndex].timeLength;
        if (timeLength === undefined || timeLength === null) {
            timeLength = -1
        }
        timeLength++;
        vm.sources[vm.currentIndex].timeLength = timeLength;
    }


    /***********外包API*************/
    play() { vm._play() }
    pause() { vm._pause() }
    prev() { vm._prev() }
    next() { vm._next() }
    openControl() { vm._control(true); vm.is_ctrl = false }
    closeControl() { vm._control(false); vm.is_ctrl = true }
    openList() { vm._openList() }
    closeList() { vm._closeList() }
    openVoice() { vm._openVoice() }
    closeVoice() { vm._closeVoice() }
    openFull() { vm._full() }
    closeFull() { vm._exitFull() }
    load() { vm._load() }
    ///设置音频， 0 关闭音频, 大于 0 打开音频
    setVoice(n) { vm.$voice.volume = n }
    //事件监听： play, pause, prev, next, ctrl, list, voice, full, load error timeupdate
    addEventListener(type, fn) {
        vm[type + '_fn'] = fn;
    }
    //获取所有视频的播放时长
    timeLength() {
        return [...vm.sources];
    }
}

export default ZVideo
