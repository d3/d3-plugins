d3.jsonp = function (url, callback) {
  url = String(url);

  function rand() {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
      c = '', i = -1;
    while (++i < 15) c += chars.charAt(Math.floor(Math.random() * 52));
    return c;
  }

  function create() {
    var c = rand();

    window[c] = function(data) {
      callback(data);
      delete window[c];
      script.remove();
    };

    if (url.indexOf('?') === -1) {
      url += '?';
    } else {
      url += '&';
    }

    url += 'callback=';
    url += c;
  }

  var url = create(url),
    script = d3.select('head')
    .append('script')
    .attr('type', 'text/javascript')
    .attr('src', url);
};
