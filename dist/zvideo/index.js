(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ZVideo = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function $(id) {
    return document.querySelector(id);
  }
  function display(el, bool) {
    el.style.display = bool ? 'inline-block' : 'none';
  }
  function addClass(el, cls) {
    el.classList.add(cls);
  }
  function removeClass(el, cls) {
    el.classList.remove(cls);
  }
  function css(el, key, val) {
    el.style[key] = val;
  }
  function stopEvent(e) {
    if (e && e.stopPropagation) {
      e.stopPropagation();
      e.stopImmediatePropagation();
    } else {
      window.event.cancelBubble = true;
    }
  }
  function stopMouseEvent(el) {
    el.onmousedown = function (e) {
      stopEvent(e);
      return false;
    };

    el.onmouseup = function (e) {
      stopEvent(e);
      return false;
    };
  }
  var curr_time = '00:00';
  function realFormatSecond(second) {
    var secondType = _typeof(second);

    var time = '00:00';

    if (secondType === 'number' || secondType === 'string') {
      second = parseInt(second);
      var hours = Math.floor(second / 3600);
      second = second - hours * 3600;
      var mimute = Math.floor(second / 60);
      second = second - mimute * 60;
      time = ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2);
    } else {
      time = '00:00';
    }

    if (curr_time === time) {
      return null;
    } else {
      curr_time = time;
      return curr_time;
    }
  }

  var vm;

  var ZVideo = /*#__PURE__*/function () {
    function ZVideo(options) {
      _classCallCheck(this, ZVideo);

      vm = this;
      Object.assign(vm, options, {
        iconLink: '//at.alicdn.com/t/font_2197806_tdbemn1kgp.css',
        //图标
        isPlay: false,
        //是否播放
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
        console.warn('请设置id');
        return;
      } //初始化


      this._init();
    }

    _createClass(ZVideo, [{
      key: "_init",
      value: function _init() {
        //保存容器元素
        vm.$el = $(this.id);
        vm.$el.classList.add('z-video'); //创建视频元素 crossOrigin="*"

        vm.$el.innerHTML = "<div class=\"z-video-container\">\n                                <video  id=\"z-video\"\n                                        rossOrigin=\"anonymous\"\n                                        ".concat(vm.autoplay && 'autoplay="true"', "\n                                        ").concat(vm.muted && 'muted="true"', "\n                                        ").concat(vm.loop && 'loop="true"', "\n                                        ").concat(vm.poster && "poster=\"".concat(vm.poster, "\""), "\n                                        style=\"width: ").concat(vm.width ? vm.width + 'px' : '100%', ";height: ").concat(vm.height ? vm.height + 'px' : 'auto', "\">\n                                    <source class=\"z-video-source\" type=\"video/mp4\"/>\n                                    <source class=\"z-video-source\" type=\"video/ogg\"/>\n                                    <source class=\"z-video-source\" type=\"video/webm\"/>\n                                </video>\n                            </div>\n                            <div class=\"z-video-no-select z-video-control\" id=\"z-video-control\">\n                                <div class=\"z-progress\">\n                                  <i class=\"z-progress-line\" id=\"z-progress-line\"></i>\n                                  <i class=\"z-progress-bar\" id=\"z-progress-bar\"></i>\n                                  <div id=\"z-progress\" style=\"position: absolute;width: 100%;z-index: 999;height: 100%;\"></div>\n                                </div>\n                                <div class=\"z-video-control-item\">\n                                    <i id=\"z-play-pause\" class=\"z-play-pause iconfont ").concat(vm.autoplay ? 'icon-shitinghui' : 'icon-bofang', "\"></i>\n                                    <i id=\"z-video-prev\" class=\"z-video-prev iconfont icon-shangyiji\"></i>\n                                    <i id=\"z-video-next\" class=\"z-video-next iconfont icon-xiayiji\"></i>\n                                    <span class=\"z-video-time\"><i id=\"z-video-time\">").concat(vm.timeStr, "</i> / <i id=\"z-video-duration\">").concat(vm.durationStr, "</i></span>\n                                </div>\n                                <div class=\"z-video-control-item\">\n                                    <i id=\"z-video-voice\" class=\"z-video-voice iconfont ").concat(vm.isVoice ? 'icon-laba' : 'icon-guanbishengyin', "\"></i>\n                                    <i id=\"z-video-full\" class=\"z-video-full iconfont icon-quanping\"></i>\n                                    <i id=\"z-video-list\" class=\"z-video-list iconfont icon-liebiao\"></i>\n                                </div>\n                            </div>\n                            <div class=\"z-video-list-content\" id=\"z-video-list-content\" style=\"width: 0\">\n                                <p class=\"z-video-play-title\"><i style=\"font-size: 14px;\" class=\"iconfont icon-dayu\"></i>\u64AD\u653E\u5217\u8868\uFF08<span id=\"z-video-play-title\">0</span>\uFF09</p>\n                                <div class=\"z-video-list-box scrollbar\" id=\"z-video-list-box\"></div>\n                            </div>\n                            <i class=\"z-video-error iconfont icon-wangluocuowu1\" id=\"z-video-error\">\u7F51\u8DEF\u9519\u8BEF</i>\n                            <i class=\"z-video-loading iconfont icon-jiazai\" id=\"z-video-loading\"></i>\n                            <span class=\"z-video-message\" id=\"z-video-message\"></span>\n                            <div class=\"z-video-pan\"  id=\"z-video-audio\">\n                                <i class=\"z-video-pan-circle c-1\"></i>\n                                <i class=\"z-video-pan-circle c-2\"></i>\n                                <i class=\"z-video-pan-circle c-3\"></i>\n                                <i class=\"z-video-pan-circle c-4\"></i>\n                                <i class=\"z-video-pan-circle c-5\"></i>\n                                <i class=\"z-video-pan-circle c-6\"></i>\n                                <i class=\"z-video-pan-circle c-7\"></i>\n                                <i class=\"z-video-pan-circle c-8\"></i>\n                                <i class=\"z-video-pan-circle c-9\"></i>\n                                <i class=\"z-video-pan-circle c-10\"></i>\n                                <i class=\"z-video-pan-circle c-11\"></i>\n                                <i class=\"z-video-pan-circle c-12\"></i>\n                                <i class=\"z-video-pan-circle c-13\"></i>\n                                <i class=\"z-video-pan-circle c-14\"></i>\n                                <i class=\"z-video-pan-circle c-15\"></i>\n                                <i class=\"z-video-audio iconfont icon-yinpin1\"></i>\n                            </div>\n                        "); //设置字体图标

        var link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', vm.iconLink);
        document.head.appendChild(link); //初始化元素

        vm.$video = $('#z-video'); //控制条

        vm.$control = $('#z-video-control'); //暂停播放

        vm.$play = $('#z-play-pause'); //上一集

        vm.$prev = $('#z-video-prev'); //下一集

        vm.$next = $('#z-video-next'); //时间

        vm.$time = $('#z-video-time'); //时长

        vm.$duration = $('#z-video-duration'); //声音

        vm.$voice = $('#z-video-voice'); //全屏

        vm.$full = $('#z-video-full'); //列表

        vm.$list = $('#z-video-list'); //列表个数

        vm.$count = $('#z-video-play-title'); //列表容器

        vm.$listBox = $('#z-video-list-box');
        vm.$listView = $('#z-video-list-content'); //加载

        vm.$loading = $('#z-video-loading'); //进度条

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
          });

          return;
        }

        if (!navigator.onLine) {
          vm._message({
            type: 'error',
            message: '网络错误！'
          });

          if (vm.error_fn) vm.error_fn('网络错误');
          display(vm.$error, true);
        }

        vm._onChange(0);

        vm._initVideo();

        vm._control(false);

        vm._initList(); //事件初始化


        vm._initEvent();
      }
    }, {
      key: "_initVideo",
      value: function _initVideo() {
        //可以播放
        vm.$video.addEventListener('canplay', function () {
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
        }); //视频播放

        vm.$video.addEventListener('timeupdate', function (e) {
          vm.percent = vm.$video.currentTime / vm.$video.duration * 100;

          vm._setTimeStr();

          vm._setBar();

          if (vm.timeupdate_fn) {
            vm.timeupdate_fn(e);
          }
        });
        vm.$video.addEventListener('ended', function () {
          vm._pause();
        });
        vm.$video.addEventListener('error', function (e) {
          vm.isError = true;

          vm._pause();

          if (vm.error_fn) vm.error_fn('视频加载出现错误', e);

          vm._message({
            type: 'error',
            message: '视频加载出现错误！'
          });

          addClass(vm.$listItme[vm.currentIndex], 'error');
        });
      }
    }, {
      key: "_initEvent",
      value: function _initEvent() {
        //监听鼠标移出视频容器
        function videoover() {
          if (vm.canplay && !vm.is_ctrl) vm._control(true);
        }

        function videoleave() {
          vm.$video.mousetimer = setTimeout(function () {
            vm._control(false);

            vm._closeList();
          }, 2200);
        }

        vm.$video.onmouseover = function () {
          videoover();
        };

        vm.$video.onmouseleave = function () {
          videoleave();
        };

        vm.$control.onmouseover = function () {
          videoover();
        };

        vm.$control.onmouseleave = function () {
          videoleave();
        };

        vm.$listView.onmouseover = function () {
          videoover();
        };

        vm.$listView.onmouseleave = function () {
          videoleave();
        }; //播放暂停按钮


        stopMouseEvent(vm.$play);

        vm.$play.onclick = function (e) {
          stopEvent(e);
          vm.isPlay ? vm._pause() : vm._play();
        };

        stopMouseEvent(vm.$list);

        vm.$list.onclick = function (e) {
          stopEvent(e);
          vm.isShowList ? vm._closeList() : vm._openList();
        };

        stopMouseEvent(vm.$voice);

        vm.$voice.onclick = function (e) {
          vm.isVoice ? vm._closeVoice() : vm._openVoice();
        };

        stopMouseEvent(vm.$full);

        vm.$full.onclick = function (e) {
          stopEvent(e);
          vm.isFull ? vm._exitFull() : vm._full();
        };

        vm.$video.onclick = function (e) {
          stopEvent(e);

          vm._closeList();
        };

        stopMouseEvent(vm.$prev);

        vm.$prev.onclick = function (e) {
          stopEvent(e);

          vm._prev();
        };

        stopMouseEvent(vm.$next);

        vm.$next.onclick = function (e) {
          stopEvent(e);

          vm._next();
        };

        function onmousedown() {
          vm.mouseDown = true;
          addClass(vm.$progressBar, 'active');
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
            vm._setSliderPointerValue(offsetX);
          }
        } //鼠标按下


        vm.$progress.onmousedown = function () {
          onmousedown();
        }; //鼠标抬起


        vm.$progress.onmouseup = function (e) {
          onmouseup(e.offsetX);
        };

        vm.$progress.onmousemove = function (e) {
          onmousemove(e.offsetX);
        };

        vm.$progress.onmouseleave = function (e) {
          onmouseup(e.offsetX);
        };

        vm.$progress.addEventListener('touchstart', function () {
          onmousedown();
        });
        vm.$progress.addEventListener('touchend', function (e) {
          onmouseup(e.changedTouches[0].clientX);
        });
        vm.$progress.addEventListener('touchmove', function (e) {
          onmousemove(e.changedTouches[0].clientX);
        });
        window.addEventListener('online', function () {
          vm._message({
            type: 'success',
            message: '网路已连接！'
          });

          display(vm.$error, false);
        });
        window.addEventListener('offline', function () {
          vm._message({
            type: 'error',
            message: '网路已断开！'
          });

          display(vm.$error, true);
        });
        window.addEventListener('resize', function () {
          if (vm.isFull) {
            vm._exitFull_fn();
          }
        });
        window.addEventListener('keyup', function (e) {
          if (e.keyCode === 32) {
            vm.isPlay ? vm._pause() : vm._play();
          }

          if (e.keyCode === 39 || e.keyCode === 37) {
            vm.$video.play();
          }
        });
        window.addEventListener('keydown', function (e) {
          if (e.keyCode === 39) {
            vm.$video.pause();
            vm.$video.currentTime += 5;
          }

          if (e.keyCode === 37) {
            vm.$video.pause();
            vm.$video.currentTime -= 5;
          }
        });
      }
    }, {
      key: "_message",
      value: function _message(options) {
        if (options.type === 'success') {
          removeClass(vm.$message, 'error');
          addClass(vm.$message, 'success');
        }

        if (options.type === 'error') {
          removeClass(vm.$message, 'success');
          addClass(vm.$message, 'error');
        }

        vm.$message.innerText = options.message;
        setTimeout(function () {
          removeClass(vm.$message, 'success');
          removeClass(vm.$message, 'error');
          vm.$message.innerText = '';
        }, vm.messageTime);
      }
      /** 控制事件   */
      //隐藏列表图标

    }, {
      key: "_setListIcon",
      value: function _setListIcon(bool) {
        display(vm.$list, bool);
      } //显示控制条

    }, {
      key: "_control",
      value: function _control(bool) {
        bool ? addClass(vm.$control, 'active') : removeClass(vm.$control, 'active');

        if (bool && vm.$video && vm.$video.mousetimer) {
          clearTimeout(vm.$video.mousetimer);
        }

        if (vm.ctrl_fn) vm.ctrl_fn(bool, vm);
      } //设置播放图标

    }, {
      key: "_setPlayIcon",
      value: function _setPlayIcon() {
        if (vm.canplay && vm.isPlay) {
          removeClass(vm.$play, 'icon-bofang');
          addClass(vm.$play, 'icon-shitinghui');
        } else {
          removeClass(vm.$play, 'icon-shitinghui');
          addClass(vm.$play, 'icon-bofang');
        }
      } //列表

    }, {
      key: "_closeList",
      value: function _closeList() {
        css(vm.$listView, 'width', '0');
        vm.isShowList = false;
        if (vm.list_fn) vm.list_fn(vm, false);
      }
    }, {
      key: "_openList",
      value: function _openList() {
        css(vm.$listView, 'width', '245px');
        vm.isShowList = true;
        if (vm.list_fn) vm.list_fn(vm, true);
      } //声音

    }, {
      key: "_closeVoice",
      value: function _closeVoice() {
        removeClass(vm.$voice, 'icon-laba');
        addClass(vm.$voice, 'icon-guanbishengyin');
        vm.isVoice = false;
        vm.$video.muted = true;
        if (vm.voice_fn) vm.voice_fn(vm, false);
      }
    }, {
      key: "_openVoice",
      value: function _openVoice() {
        removeClass(vm.$voice, 'icon-guanbishengyin');
        addClass(vm.$voice, 'icon-laba');
        vm.isVoice = true;
        vm.$video.muted = false;
        if (vm.voice_fn) vm.voice_fn(vm, true);
      } //播放器

    }, {
      key: "_pause",
      value: function _pause() {
        vm.isPlay = false;
        vm.$video.pause();

        vm._setPlayIcon();

        removeClass(vm.$audio, 'play');

        if (vm.pause_fn) {
          vm.pause_fn(vm);
        }
      }
    }, {
      key: "_play",
      value: function _play() {
        vm.isPlay = true;
        vm.$video.play();

        vm._setPlayIcon();

        addClass(vm.$audio, 'play');

        if (vm.play_fn) {
          vm.play_fn(vm);
        }
      } //从新加载

    }, {
      key: "_load",
      value: function _load() {
        vm.$video.load();

        vm._setPlayIcon();

        if (vm.load_fn) vm.load_fn(vm);
      }
    }, {
      key: "_prev",
      value: function _prev() {
        vm.percent = 0;

        vm._setBar();

        vm.currentIndex--;

        if (vm.currentIndex < 0) {
          vm.currentIndex = vm.sources.length - 1;
        }

        vm._onChange(vm.currentIndex);

        if (vm.$currentItem) removeClass(vm.$currentItem, 'active');
        vm.$currentItem = vm.$listItme[vm.currentIndex];
        addClass(vm.$currentItem, 'active');
        if (vm.prev_fn) vm.prev_fn(vm);
      }
    }, {
      key: "_next",
      value: function _next() {
        vm.percent = 0;

        vm._setBar();

        vm.currentIndex++;

        if (vm.currentIndex > vm.sources.length - 1) {
          vm.currentIndex = 0;
        }

        vm._onChange(vm.currentIndex);

        if (vm.$currentItem) removeClass(vm.$currentItem, 'active');
        vm.$currentItem = vm.$listItme[vm.currentIndex];
        addClass(vm.$currentItem, 'active');
        if (vm.next_fn) vm.next_fn(vm);
      }
    }, {
      key: "_setVideoTime",
      value: function _setVideoTime() {
        vm.$video.currentTime = vm.$video.duration * (vm.percent / 100);
      }
    }, {
      key: "_setTimeStr",
      value: function _setTimeStr() {
        vm.timeStr = realFormatSecond(vm.$video.currentTime);

        if (vm.timeStr) {
          vm.$time.innerText = vm.timeStr;

          vm._statisticsDuration(); //已秒计时

        }
      } //全屏

    }, {
      key: "_full",
      value: function _full() {
        if (vm.full_fn) vm.full_fn(vm, true);
        addClass(vm.$video, 'full');
        removeClass(vm.$full, 'icon-quanping');
        addClass(vm.$full, 'icon-eLongVideoPlayer_fullRecover');

        if (vm.$el.requestFullscreen) {
          vm.$el.requestFullscreen();
        } else if (vm.$el.webkitRequestFullScreen) {
          vm.$el.webkitRequestFullScreen();
        } else if (vm.$el.mozRequestFullScreen) {
          vm.$el.mozRequestFullScreen();
        } else {
          vm.$el.msRequestFullscreen();
        }

        setTimeout(function () {
          vm.isFull = true;
        }, 300);
      }
    }, {
      key: "_exitFull",
      value: function _exitFull() {
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
    }, {
      key: "_exitFull_fn",
      value: function _exitFull_fn() {
        vm.isFull = false;
        if (vm.full_fn) vm.full_fn(vm, false);
        removeClass(vm.$video, 'full');
        removeClass(vm.$full, 'icon-eLongVideoPlayer_fullRecover');
        addClass(vm.$full, 'icon-quanping');
      }
    }, {
      key: "_setSliderPointerValue",
      value: function _setSliderPointerValue(offsetX) {
        var width = vm.$progress.clientWidth;
        var barWidth = vm.$progressBar.clientWidth;
        var left = 0;
        var x = offsetX - left - barWidth / 2;
        var sw = width - barWidth;

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

    }, {
      key: "_setBar",
      value: function _setBar() {
        css(vm.$progressBar, 'left', vm.percent + '%');
        css(vm.$progressLine, 'width', vm.percent + '%');
      }
    }, {
      key: "_initList",
      value: function _initList() {
        if (vm.sources.length === 1) {
          //不显示列表图标
          this._setListIcon(false);

          css(vm.$full, 'marginRight', '0');
          display(vm.$prev, false);
          display(vm.$next, false);
          return;
        }

        var html = '';
        vm.sources.map(function (item, i) {
          html += "<div  class=\"z-video-item\" title=\"".concat(item.title, "\">").concat(item.title, "</div>");
        });
        vm.$listBox.innerHTML = html;
        vm.$count.innerText = vm.sources.length;
        vm.$listItme = document.getElementsByClassName('z-video-item');
        vm.$currentItem = null;

        for (var i in vm.$listItme) {
          if (vm.$listItme[i] && vm.$listItme[i].nodeType === 1) {
            (function ($item, i) {
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
              };
            })(vm.$listItme[i], i);
          }
        }
      }
    }, {
      key: "_onChange",
      value: function _onChange(i) {
        vm._loading(true);

        vm.percent = 0;

        vm._setBar();

        vm.currentIndex = i;
        vm.currentItem = vm.sources[vm.currentIndex];

        vm._setUrl(vm.currentItem.url);

        vm._load();

        display(vm.$audio, vm.currentItem.type === 'audio');
      } //设置视频地址

    }, {
      key: "_setUrl",
      value: function _setUrl(url) {
        //缓存元素节流
        if (!vm.sourceList) vm.sourceList = document.querySelectorAll('.z-video-source');

        for (var i in vm.sourceList) {
          var item = vm.sourceList[i];

          if (item && item.nodeType === 1) {
            item.setAttribute('src', url);
          }
        }
      }
    }, {
      key: "_loading",
      value: function _loading(bool) {
        display(vm.$loading, bool);
      } //统计时长

    }, {
      key: "_statisticsDuration",
      value: function _statisticsDuration() {
        var timeLength = vm.sources[vm.currentIndex].timeLength;

        if (timeLength === undefined || timeLength === null) {
          timeLength = -1;
        }

        timeLength++;
        vm.sources[vm.currentIndex].timeLength = timeLength;
      }
      /***********外包API*************/

    }, {
      key: "play",
      value: function play() {
        vm._play();
      }
    }, {
      key: "pause",
      value: function pause() {
        vm._pause();
      }
    }, {
      key: "prev",
      value: function prev() {
        vm._prev();
      }
    }, {
      key: "next",
      value: function next() {
        vm._next();
      }
    }, {
      key: "openControl",
      value: function openControl() {
        vm._control(true);

        vm.is_ctrl = false;
      }
    }, {
      key: "closeControl",
      value: function closeControl() {
        vm._control(false);

        vm.is_ctrl = true;
      }
    }, {
      key: "openList",
      value: function openList() {
        vm._openList();
      }
    }, {
      key: "closeList",
      value: function closeList() {
        vm._closeList();
      }
    }, {
      key: "openVoice",
      value: function openVoice() {
        vm._openVoice();
      }
    }, {
      key: "closeVoice",
      value: function closeVoice() {
        vm._closeVoice();
      }
    }, {
      key: "openFull",
      value: function openFull() {
        vm._full();
      }
    }, {
      key: "closeFull",
      value: function closeFull() {
        vm._exitFull();
      }
    }, {
      key: "load",
      value: function load() {
        vm._load();
      } ///设置音频， 0 关闭音频, 大于 0 打开音频

    }, {
      key: "setVoice",
      value: function setVoice(n) {
        vm.$voice.volume = n;
      } //事件监听： play, pause, prev, next, ctrl, list, voice, full, load error timeupdate

    }, {
      key: "addEventListener",
      value: function addEventListener(type, fn) {
        vm[type + '_fn'] = fn;
      } //获取所有视频的播放时长

    }, {
      key: "timeLength",
      value: function timeLength() {
        return _toConsumableArray(vm.sources);
      }
    }]);

    return ZVideo;
  }();

  return ZVideo;

})));
//# sourceMappingURL=index.js.map
