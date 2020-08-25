(function () {
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
      _default: [0, "", ""],
    };
  wrapMap.optgroup = wrapMap.option;
  wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption =
    wrapMap.thead;
  wrapMap.th = wrapMap.td;

  let xhrProto = XMLHttpRequest.prototype,
    origOpen = xhrProto.open,
    origSend = xhrProto.send;

  xhrProto.open = function (method = "", url = "") {
    this._url = url;
    this._method = method;
    this._params = null;
    //如果是get请求时，将请求参数，转换为Object格式保存
    if (method.toLowerCase() === "get") {
      let temp = url.split("?"),
        query = "",
        arrQuery = [],
        params = {};
      if (temp.length > 1) {
        query = temp[1];
        arrQuery = query.split("&");
        Object.keys(arrQuery).forEach((item) => {
          const result = arrQuery[item].split("=");
          const key = result[0];
          const value = result[1];
          params[key] = decodeURI(value);
        });
        this._params = params;
      }
    }
    return origOpen.apply(this, arguments);
  };

  xhrProto.send = function (body) {
    if (
      this._method.toLowerCase() !== "get" &&
      this._method.toLowerCase() !== "delete" &&
      body !== null
      // typeof body === "object"
    ) {
      try {
        const params = JSON.parse(body);
        this._params = params;
      } catch (error) {
        this._params = body;
      }
    }
    return origSend.apply(this, arguments);
  };

  //定义统一的xmlhttp请求
  window.lightDesignXhr = null;
  if (window.XMLHttpRequest) {
    window.lightDesignXhr = new XMLHttpRequest();
  } else {
    window.lightDesignXhr = new ActiveXObject("Microsoft.XMLHTTP");
  }

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
     * @returns {HTMLElement}
     */
    parseHTML: function (data) {
      if (typeof data !== "string") {
        return [];
      }
      let parsed = rsingleTag.exec(data);

      // Single tag
      if (parsed) {
        return [document.createElement(parsed[1])];
      }

      parsed = buildFragment([data]);

      return merge([], parsed.childNodes)[0];
    },
    httpGet: (url, options) => {
      const { params, headers, async = false } = options;
      var query = "";
      if (objectIsNotEmpty(params)) {
        query = urlJsonToString(params);
        url += "?" + query;
      }
      if (window.lightDesignXhr != null) {
        window.lightDesignXhr.open("GET", url, false);
        if (objectIsNotEmpty(headers)) {
          setRequestHeader(window.lightDesignXhr, headers);
        }
        window.lightDesignXhr.send(null);
        if (!async) {
          return window.lightDesignXhr;
        }
      } else {
        alert("Your browser does not support XMLHTTP.");
      }
    },
    httpPost: (url, options) => {
      const { params, headers, async = false } = options;
      if (window.lightDesignXhr != null) {
        window.lightDesignXhr.open("POST", url, false);
        window.lightDesignXhr.setRequestHeader(
          "Content-Type",
          "application/json"
        );
        if (objectIsNotEmpty(headers)) {
          setRequestHeader(window.lightDesignXhr, headers);
        }
        window.lightDesignXhr.send(JSON.stringify(params));
        if (!async) {
          return window.lightDesignXhr;
        }
      } else {
        alert("Your browser does not support XMLHTTP.");
      }
    },
    httpUpload: function (url, options) {
      const { params, headers, async = false } = options;
      if (window.lightDesignXhr != null) {
        window.lightDesignXhr.open("POST", url, false);
        if (objectIsNotEmpty(headers)) {
          setRequestHeader(window.lightDesignXhr, headers);
        }
        window.lightDesignXhr.send(params);
        if (!async) {
          return window.lightDesignXhr;
        }
      } else {
        alert("Your browser does not support XMLHTTP.");
      }
    },
    httpDownload: function (url, options) {
      const { params, headers, filename } = options;
      //拼接url加query
      var query = "",
        arrQuery = [];
      if (objectIsNotEmpty(params)) {
        for (var key in params) {
          arrQuery.push(key + "=" + params[key]);
        }
        query = arrQuery.join("&");
        url += "?" + query;
      }
      if (window.lightDesignXhr != null) {
        window.lightDesignXhr.open("GET", url, true);
        window.lightDesignXhr.responseType = "blob";
        if (objectIsNotEmpty(headers)) {
          setRequestHeader(window.lightDesignXhr, headers);
        }
        window.lightDesignXhr.send(null);
        window.lightDesignXhr.onreadystatechange = () => {
          if (
            window.lightDesignXhr.status === 200 &&
            window.lightDesignXhr.readyState === 4
          ) {
            let blob = window.lightDesignXhr.response;
            if (window.navigator.msSaveOrOpenBlob) {
              navigator.msSaveBlob(blob, filename);
            } else {
              var link = document.createElement("a");
              link.target = "_blank";
              link.href = window.URL.createObjectURL(blob);
              link.download = filename;
              link.click();
              window.URL.revokeObjectURL(link.href);
            }
          }
        };
      } else {
        alert("Your browser does not support XMLHTTP.");
      }
    },
    guid: () => {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
        c
      ) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    },
    /**
     * 根据多语言key值，生成字符串
     * @param {string} id key值
     * @param {string/json} params 参数
     */
    formatMessage: (id, params) => {
      let lngType = localStorage.getItem("light-design-lng");
      //如果没有key值，则返回空
      if (!id || id.isNullOrEmpty()) return "";
      let lngData = window.lightDesign.languageData[lngType];
      if (
        lngData instanceof Object &&
        lngData !== undefined &&
        lngData !== null
      ) {
        let str = "";
        for (const key in lngData) {
          if (lngData.hasOwnProperty(key)) {
            if (id === key) {
              str = lngData[id];
            }
          }
        }
        if (!str.isNullOrEmpty() && params) {
          str.format(params);
        }
        return str;
      } else {
        return "";
      }
    },
    /**
     * 获取当前dom在页面中的距离左侧多少像素点
     */
    getElementLeft: (element) => {
      var actualLeft = element.offsetLeft;
      var current = element.offsetParent;

      while (current !== null) {
        actualLeft += current.offsetLeft;
        current = current.offsetParent;
      }

      return actualLeft;
    },
    /**
     * 获取当前dom在页面中的距离顶部多少像素点
     */
    getElementTop: (element) => {
      var actualTop = element.offsetTop;
      var current = element.offsetParent;

      while (current !== null) {
        actualTop += current.offsetTop;
        current = current.offsetParent;
      }

      return actualTop;
    },
  };
  window.lightDesign = window.lightDesign
    ? { ...window.lightDesign, ...lightDesignGlobal }
    : lightDesignGlobal;

  //字符串去除空格
  String.prototype.replaceSpace = function () {
    return this.replace(/\ +/g, "");
  };

  //字符串去除回车和空格
  String.prototype.replaceEnter = function () {
    return this.replace(/[\r\n]\ +/g, "");
  };

  //字符串判断是否为空
  String.prototype.isNullOrEmpty = function () {
    if (
      this == null ||
      this == undefined ||
      this.replace(/(^\s*)|(\s*$)/g, "") == ""
    ) {
      return true;
    } else {
      return false;
    }
  };

  String.prototype.format = function (args) {
    if (arguments.length > 0 && args !== undefined && args !== null) {
      let result = this;
      if (arguments.length == 1 && typeof args == "object") {
        for (let key in args) {
          let reg = new RegExp("({" + key + "})", "g");
          result = result.replace(reg, args[key]);
        }
      } else {
        for (let i = 0; i < arguments.length; i++) {
          if (arguments[i] == undefined) {
            return "";
          } else {
            let reg = new RegExp("({[" + i + "]})", "g");
            result = result.replace(reg, arguments[i]);
          }
        }
      }
      return result.toString();
    } else {
      return this.toString();
    }
  };

  //日期格式化
  Date.prototype.toStringFormat = function (str = "yyyy-MM-dd HH:mm:ss") {
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
      case "yyyy-MM-ddThh:mm":
        strDate = `${year}-${month}-${day}T${hours}:${minutes}`;
        break;
      case "yyyy-MM-dd":
        strDate = `${year}-${month}-${day}`;
        break;
      default:
        strDate = this.toString();
        break;
    }
    return strDate;
  };
})();
