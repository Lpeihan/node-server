const methods = ['get', 'post', 'put', 'delete'];

function transformQuery(args) {
  return Object.keys(args)
    .sort()
    .map(key => `${key}=${encodeURIComponent(args[key])}`)
    .join('&');
}

function http(method, url, data, success, error) {
  let xhr;

  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else {
    xhr = new ActiveXObject('Microsoft.XMLHTTP');
  }

  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4 && xhr.status == 200) {
      success(xhr.responseText);
    }
  }
  xhr.open(method, url, true);

  if (data) {
    data = transformQuery(data);
  }
  xhr.send(data);
}

function resource(url) {
  const fns = {};
  methods.forEach((method) => {
    fns[method] = function(data, success, error) {
      if (typeof data == 'function') {
        success = data;
        error = success;
        data = undefined;
      }
      http(method, url, data, success, error);
    }
  });
  return fns;
}

const apiV1 = {
  hello: resource('/hello'),
  search: resource('/search')
};
