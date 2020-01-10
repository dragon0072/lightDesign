(function() {
  const rsingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i,
    rhtml = /<|&#?\w+;/,
    rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,
    rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i,
    wrapMap = {
      option: [1, "<select multiple='multiple'>", "</select>"],
      thead: [1, "<table>", "</table>"],
      col: [2, "<table><colgroup>", "</colgroup></table>"],
      tr: [2, "<table><tbody>", "</tbody></table>"],
      td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
      _default: [0, "", ""]
    };
  wrapMap.optgroup = wrapMap.option;
  wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption =
    wrapMap.thead;
  wrapMap.th = wrapMap.td;

  function buildFragment(elems) {
    let elem,
      tmp,
      tag,
      wrap,
      j,
      fragment = document.createDocumentFragment(),
      nodes = [],
      i = 0,
      l = elems.length;

    for (; i < l; i++) {
      elem = elems[i];

      if (elem || elem === 0) {
        // Add nodes directly
        if (!rhtml.test(elem)) {
          nodes.push(document.createTextNode(elem));

          // Convert html into DOM nodes
        } else {
          tmp = tmp || fragment.appendChild(document.createElement("div"));

          // Deserialize a standard representation
          tag = (rtagName.exec(elem) || ["", ""])[1].toLowerCase();
          wrap = wrapMap[tag] || wrapMap._default;
          tmp.innerHTML = wrap[1] + htmlPrefilter(elem) + wrap[2];

          // Descend through wrappers to the right content
          j = wrap[0];
          while (j--) {
            tmp = tmp.lastChild;
          }

          // Support: Android <=4.0 only, PhantomJS 1 only
          // push.apply(_, arraylike) throws on ancient WebKit
          merge(nodes, tmp.childNodes);

          // Remember the top-level container
          tmp = fragment.firstChild;

          // Ensure the created nodes are orphaned (#12392)
          tmp.textContent = "";
        }
      }
    }

    // Remove wrapper from fragment
    fragment.textContent = "";

    i = 0;
    while ((elem = nodes[i++])) {
      fragment.appendChild(elem);
    }
    return fragment;
  }

  function merge(first, second) {
    let len = +second.length,
      j = 0,
      i = first.length;

    for (; j < len; j++) {
      first[i++] = second[j];
    }

    first.length = i;

    return first;
  }

  function htmlPrefilter(html) {
    return html.replace(rxhtmlTag, "<$1></$2>");
  }

  /**
   * 将json格式的请求参数，转成string格式
   * @param {json} params
   */
  function urlJsonToString(params) {
    let strParams = [];
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        strParams.push(`${key}=${params[key] || ""}`);
      }
    }
    return strParams.join("&");
  }

  /**
   * 设置请求头
   * @param {XMLHttpRequest} xhr
   * @param {json} headers
   */
  function setRequestHeader(xhr, headers) {
    for (const key in headers) {
      if (headers.hasOwnProperty(key)) {
        xhr.setRequestHeader(key, headers[key]);
      }
    }
  }

  /**
   * Object判断是否为空
   * @param {object} data
   */
  function objectIsNotEmpty(data) {
    return typeof data === "object" && data !== null && data !== undefined;
  }

  const lightDesignGlobal = {
    /**
     * 根据字符串，生成dom元素
     * @param {string} data
     */
    parseHTML: function(data) {
      if (typeof data !== "string") {
        return [];
      }
      let parsed = rsingleTag.exec(data);

      // Single tag
      if (parsed) {
        return [document.createElement(parsed[1])];
      }

      parsed = buildFragment([data]);

      return merge([], parsed.childNodes);
    },
    httpGet: (url, options) => {
      const { params, headers, async } = options;
      let xhr = null;
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
      } else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
      }
      var query = "";
      if (objectIsNotEmpty(params)) {
        query = urlJsonToString(params);
        url += "?" + query;
      }
      if (xhr != null) {
        xhr.open("GET", url, false);
        if (objectIsNotEmpty(headers)) {
          setRequestHeader(xhr, headers);
        }
        xhr.send(null);
        if (!async) {
          return xhr.responseText;
        }
      } else {
        alert("Your browser does not support XMLHTTP.");
      }
    },
    httpPost: (url, options) => {
      const { params, headers, async } = options;
      let xhr = null;
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
      } else {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
      }
      if (xhr != null) {
        xhr.open("POST", url, false);
        if (objectIsNotEmpty(headers)) {
          setRequestHeader(xhr, headers);
        }
        xhr.send(params);
        if (!async) {
          return xhr.responseText;
        }
      } else {
        alert("Your browser does not support XMLHTTP.");
      }
    }
  };
  window.lightDesign = lightDesignGlobal;

  //字符串去除空格
  String.prototype.replaceSpace = function() {
    return this.replace(/\ +/g, "");
  };

  //字符串去除回车和空格
  String.prototype.replaceEnter = function() {
    return this.replace(/[\r\n]\ +/g, "");
  };

  //日期格式化
  Date.prototype.toStringFormat = function(str) {
    let strDate = "";
    let year = this.getFullYear(),
      month = this.getMonth() + 1,
      day = this.getDate(),
      hours = this.getHours(),
      minutes = this.getMinutes(),
      seconds = this.getSeconds();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    if (hours < 10) {
      hours = "0" + hours;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    switch (str) {
      case "yyyy-MM-dd HH:mm:ss":
        strDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        break;
      default:
        strDate = this.toString();
        break;
    }
    return strDate;
  };
})();
