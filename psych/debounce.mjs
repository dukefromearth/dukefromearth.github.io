export default function debounce(cb, interval, immediate) {
  var timeout;
Í
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) cb.apply(context, args);
    };          

    var callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, interval);

    if (callNow) cb.apply(context, args);
  };
};