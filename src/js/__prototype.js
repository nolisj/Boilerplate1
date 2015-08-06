String.prototype.IsNullOrEmpty = function () {
    if (typeof (this) == 'undefined') {
        return true;
    }
    if (this == null) {
        return true;
    }
    if (this == '') {
        return true;
    }
    if (this.length == 0) {
        return true;
    }
    return false;
}