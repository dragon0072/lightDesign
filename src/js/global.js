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

  const lightDesignGlobal = {
    // Argument "data" should be string of html
    // context (optional): If specified, the fragment will be created in this context,
    // defaults to document
    // keepScripts (optional): If true, will include scripts passed in the html string
    parseHTML: function(data) {
      if (typeof data !== "string") {
        return [];
      }
      let parsed = rsingleTag.exec(data);

      // Single tag
      if (parsed) {
        return [document.createElement(parsed[1])];
      }

      parsed = this.buildFragment([data]);

      return this.merge([], parsed.childNodes);
    },

    buildFragment: function(elems) {
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
            tmp.innerHTML = wrap[1] + this.htmlPrefilter(elem) + wrap[2];

            // Descend through wrappers to the right content
            j = wrap[0];
            while (j--) {
              tmp = tmp.lastChild;
            }

            // Support: Android <=4.0 only, PhantomJS 1 only
            // push.apply(_, arraylike) throws on ancient WebKit
            this.merge(nodes, tmp.childNodes);

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
    },
    merge: function(first, second) {
      let len = +second.length,
        j = 0,
        i = first.length;

      for (; j < len; j++) {
        first[i++] = second[j];
      }

      first.length = i;

      return first;
    },
    htmlPrefilter: function(html) {
      return html.replace(rxhtmlTag, "<$1></$2>");
    }
  };
  window.lightDesignGlobal = lightDesignGlobal;

  //字符串去除空格
  String.prototype.replaceSpace = function() {
    return this.replace(/\ +/g, "");
  };

  //字符串去除回车和空格
  String.prototype.replaceEnter = function() {
    return this.replace(/[\r\n]\ +/g, "");
  };

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

require("./components/pagination");
require("./components/table");
