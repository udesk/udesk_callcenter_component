export function isFunction(fun) {
    return typeof fun === 'function';
}

export function isArray(ary) {
    return ary instanceof Array;
}

export function humanizeTime(seconds) {
    var hours = parseInt(seconds / 3600);
    var minutes = parseInt(seconds % 3600 / 60);
    var scons = parseInt(seconds % 60);
    hours = hours < 10 ? ('0' + hours) : hours;
    minutes = minutes < 10 ? ('0' + minutes) : minutes;
    scons = scons < 10 ? ('0' + scons) : scons;

    return hours + ':' + minutes + ':' + scons;
}

export function find(ary, callback) {
    for (var i = 0, len = ary.length; i < len; i++) {
        var item = ary[i];
        var isOk = callback(item);
        if (isOk) {
            return item;
        }
    }
}


