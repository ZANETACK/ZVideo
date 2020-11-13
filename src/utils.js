export function $(id) {
    return document.querySelector(id)
}
export function display(el, bool) {
    el.style.display = bool ? 'inline-block' : 'none';
}
export function addClass(el, cls) {
    el.classList.add(cls);
}
export function removeClass(el, cls) {
    el.classList.remove(cls);
}
export function css(el, key, val) {
    el.style[key] = val;
}
export function stopEvent(e) {
    if (e && e.stopPropagation) {
        e.stopPropagation();
        e.stopImmediatePropagation()
    } else {
        window.event.cancelBubble = true;
    }
}

export function stopClick(el) {
    el.onclick = function (e) {
        stopEvent(e);
        return false
    }
}

export function stopMouseEvent(el) {
    el.onmousedown = function (e) {
        stopEvent(e);
        return false
    }
    el.onmouseup = function (e) {
        stopEvent(e);
        return false
    }
}
let curr_time = '00:00';
export function realFormatSecond(second) {
    let secondType = typeof second;
    let time = '00:00';
    if (secondType === 'number' || secondType === 'string') {
        second = parseInt(second);

        let hours = Math.floor(second / 3600);
        second = second - hours * 3600;
        let mimute = Math.floor(second / 60);
        second = second - mimute * 60;

        time = ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
    } else {
        time = '00:00'
    }
    if (curr_time === time) {
        return null
    } else {
        curr_time = time;
        return curr_time;
    }
}