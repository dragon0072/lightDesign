(() => {
  function scrollToY(rightELe, toY, step = 10) {
    let diff = rightELe.scrollTop - toY;
    let realStep = diff > 0 ? -step : step;
    if (Math.abs(diff) > step) {
      rightELe.scrollTop = rightELe.scrollTop + realStep;
      requestAnimationFrame(() => {
        scrollToY(rightELe, toY, step);
      });
    } else {
      rightELe.scrollTop = toY;
    }
  }

  function syncScroller() {
    let nodes = Array.prototype.filter.call(arguments, item => item instanceof HTMLElement);
    let max = nodes.length;
    if (!max || max === 1) return;
    let sign = 0; // 用于标注
    nodes.forEach((ele, index) => {
      ele.addEventListener("scroll", function () {
        // 给每一个节点绑定 scroll 事件
        if (!sign) {
          // 标注为 0 时 表示滚动起源
          sign = max - 1;
          let top = this.scrollTop;
          let left = this.scrollLeft;
          for (node of nodes) {
            // 同步所有除自己以外节点
            if (node == this) continue;
            node.scrollTo(left, top);
          }
        } else --sign; // 其他节点滚动时 标注减一
      });
    });
  }

  //切换loading状态
  function _toggleLoading(_table) {
    if (_table.querySelector(".light-table-spin-holder")) {
      _table.querySelector(".light-table-spin-holder").parentElement.remove();
      _table.querySelector(".light-spin-container").classList.remove("light-spin-blur");
    } else {
      _table.querySelector(".light-spin-nested-loading").insertBefore(
        window.lightDesign.parseHTML(
          `<div>
          <div class="light-spin light-spin-spinning light-table-with-pagination light-table-spin-holder">
            <span class="light-spin-dot light-spin-dot-spin">
              <i class="light-spin-dot-item"></i>
              <i class="light-spin-dot-item"></i>
              <i class="light-spin-dot-item"></i>
              <i class="light-spin-dot-item"></i>
            </span>
          </div>
        </div>`
        ),
        _table.querySelector(".light-spin-container")
      );
      _table.querySelector(".light-spin-container").classList.add("light-spin-blur");
    }
  }

  //生成无数据提醒
  function _renderEmptyDataDom(_table) {
    let emptyElem = window.lightDesign.parseHTML(
      `<div class="light-table-placeholder">
          <div class="light-empty light-empty-normal">
            <div class="light-empty-image">
              <svg width="64" height="41" viewBox="0 0 64 41" xmlns="http://www.w3.org/2000/svg">
                <g transform="translate(0 1)" fill="none" fill-rule="evenodd">
                  <ellipse fill="#F5F5F5" cx="32" cy="33" rx="32" ry="7"></ellipse>
                  <g fill-rule="nonzero" stroke="#D9D9D9">
                    <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"></path>
                    <path d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z" fill="#FAFAFA"></path>
                  </g>
                </g>
              </svg>
            </div>
            <p class="light-empty-description">${window.lightDesign.formatMessage("common-noData")}</p>
          </div>
        </div>`
    );
    if (!_table.querySelector(".light-table-placeholder")) {
      _table.querySelector(".light-table-content").appendChild(emptyElem);
      if (_table.querySelector("ul.light-table-pagination")) {
        _table.querySelector("ul.light-table-pagination").replaceWith(window.lightDesign.parseHTML(`<div id="pageable"></div>`));
      }
      _table.querySelectorAll("tbody>tr.light-table-row").forEach(item => {
        item.remove();
      });
    }
  }

  /**
   * 返回表格的colspan
   * @param {json} columns
   */
  function returnColspan(columns, tableWidth) {
    let colspan = ["<colgroup>"];
    columns.forEach(item => {
      const { width = "auto" } = item;
      let w = isNaN(width) ? width : width + "px";
      if (!isNaN(width)) {
        tableWidth += width;
      } else if (width.indexOf("px")) {
        tableWidth += parseInt(width.replace("px", ""));
      } else {
        tableWidth += 300;
      }
      colspan.push(`<col style="width: ${w}; min-width: ${w};">`);
    });
    colspan.push("</colgroup>");
    return colspan.join("");
  }

  /**
   * 返回表格的表头
   * @param {*} columns
   */
  function returnTHeader(columns) {
    let tHeader = window.lightDesign.parseHTML(`<thead class="light-table-thead"><tr></tr></thead>`);
    columns.forEach((item, index) => {
      const { ellipsis = false, title, align = "center" } = item;
      tHeader.querySelector("tr").appendChild(
        window.lightDesign.parseHTML(
          `<th class="${ellipsis ? "light-table-row-cell-ellipsis" : ""} light-table-row-cell-break-word ${
            index === columns.length - 1 ? "" : "light-table-row-cell-last"
          }" style="text-align: ${align};">
            <span class="light-table-header-column">
                <div>
                    <span class="light-table-column-title">${title}</span>
                    <span class="light-table-column-sorter"></span>
                </div>
            </span>
          </th>`
        )
      );
    });
    return tHeader;
  }

  /**
   * 返回固定列
   * @param {*} columns
   */
  function renderFixedColumn(columns, height, _table) {
    if (columns.length <= 0) {
      return;
    }
    //添加固定列表格
    if (height > 0) {
      let fixTable = window.lightDesign.parseHTML(
        `<div class="light-table-fixed-left">
          <div class="light-table-header light-table-hide-scrollbar">
              <table class="light-table-fixed">
                  <colgroup>
                  </colgroup>
                  <thead class="light-table-thead">
                    <tr></tr>
                  </thead>
              </table>
          </div>
          <div class="light-table-body-outer" style="margin-bottom: -17px; padding-bottom: 0px;">
              <div class="light-table-body-inner" style="max-height: ${height}px; overflow-y: scroll;" >
                  <table class="light-table-fixed">
                      <colgroup>
                      </colgroup>
                      <tbody class="light-table-tbody">
                      </tbody>
                  </table>
              </div>
          </div>
      </div>`
      );
      _table.querySelector(".light-table-content").appendChild(fixTable);
      fixTable.classList.remove("light-table-fixed-left");
      fixTable.classList.add("light-table-fixed-right");
      _table.querySelector(".light-table-content").appendChild(fixTable);
    } else {
      let fixTable = window.lightDesign.parseHTML(
        `<div class="light-table-fixed-left">
          <div class="light-table-body-outer">
            <div class="light-table-body-inner">
              <table class="light-table-fixed">
                <colgroup>
                </colgroup>
                <thead class="light-table-thead">
                  <tr></tr>
                </thead>
                <tbody class="light-table-tbody">
                </tbody>
              </table>
            </div>
          </div>
        </div>`
      );
      _table.querySelector(".light-table-content").appendChild(fixTable);
      fixTable.classList.remove("light-table-fixed-left");
      fixTable.classList.add("light-table-fixed-right");
      _table.querySelector(".light-table-content").appendChild(fixTable);
    }

    columns.forEach(item => {
      const { fixed = "right", ellipsis = false, title, width = "auto", align = "center" } = item;
      let w = isNaN(width) ? width : width + "px";
      _table.querySelectorAll(`.light-table-fixed-${fixed.toLowerCase()} colgroup`).forEach(item => {
        item.appendChild(window.lightDesign.parseHTML(`<col style="width: ${w}; min-width: ${w};">`));
      });
      _table.querySelector(`.light-table-fixed-${fixed.toLowerCase()} thead tr`).appendChild(
        window.lightDesign.parseHTML(
          `<th class="${ellipsis ? "light-table-row-cell-ellipsis" : ""} light-table-row-cell-break-word" style="text-align: ${align};">
                <span class="light-table-header-column">
                    <div>
                        <span class="light-table-column-title">${title}</span>
                        <span class="light-table-column-sorter"></span>
                    </div>
                </span>
            </th>`
        )
      );
    });

    syncScroller(_table.querySelector("div.light-table-body"), ..._table.querySelectorAll(".light-table-body-inner"));
  }

  /**
   * 生成翻页控件方法
   * @param {Boolean/JSON} pageable
   */
  function _renderTablePagiantion(pageable, _table) {
    if (_table.querySelector("ul.light-pagination.light-table-pagination")) {
      return;
    }
    if (pageable && typeof pageable === "boolean") {
      //如果pageable为true时，使用默认配置，生成分页控件
      _table.lightTable.pagination = {
        pageSize: 10,
        pageIndex: 1,
      };
      _table.querySelector("#pageable").lightPagination({
        total: _table.lightTable.data.total,
        onChange: (current, pageSize) => {
          _table.lightTable.pagination.pageIndex = current;
          _table.lightTable.pagination.pageSize = pageSize;
          _table.lightTable.event.refresh();
          return true;
        },
      });
      _table.querySelector("ul.light-pagination").classList.add("light-table-pagination");
    }
  }

  function _renderBodyRow(props) {
    const { dataSource, columns, _table } = props;
    _table.querySelectorAll(".light-table-scroll tbody tr,.light-table-fixed-left tbody tr,.light-table-fixed-right tbody tr").forEach(item => {
      item.remove();
    });
    if (dataSource.length > 0) {
      if (_table.querySelector(".light-table-placeholder")) {
        _table.querySelector(".light-table-placeholder").remove();
      }
    } else {
      _renderEmptyDataDom(_table);
    }

    let isFixed = false;
    dataSource.forEach((data, index) => {
      let tr = window.lightDesign.parseHTML(
        `<tr id="${data._id}" class="light-table-row light-table-row-level-0" data-row-key="${index}">
        </tr>`
      );
      let fixLeftTr = window.lightDesign.parseHTML(
        `<tr id="${data._id}" class="light-table-row light-table-row-level-0" data-row-key="${index}">
        </tr>`
      );
      let fixRightTr = window.lightDesign.parseHTML(
        `<tr id="${data._id}" class="light-table-row light-table-row-level-0" data-row-key="${index}">
        </tr>`
      );
      columns.forEach(column => {
        const { field, fixed, align = "center", ellipsis = false, render, command } = column;
        let columnElem;
        if (command && command.length > 0) {
          columnElem = window.lightDesign.parseHTML(`<td class="light-table-row-cell-ellipsis" style="text-align:${align}"><span></span></td>`);
          command.forEach((item, index, arr) => {
            const { name, click, isVisible } = item;
            let disable = true;
            if (isVisible && typeof isVisible === "function") {
              disable = isVisible(data);
            }
            if (disable) {
              let commandElem = window.lightDesign.parseHTML(`<a>${name}</a>`);
              commandElem.addEventListener("click", event => {
                if (click && typeof click === "function") {
                  click(data, event);
                }
              });
              columnElem.appendChild(commandElem);
              if (index + 1 < arr.length) {
                columnElem.appendChild(window.lightDesign.parseHTML(`<div class="light-divider light-divider-vertical" role="separator"></div>`));
              }
            }
          });
        } else {
          let tdData = !data[field] || data[field].toString().isNullOrEmpty() ? "" : data[field];
          if (render && typeof render === "function") {
            tdData = render(data);
          }
          if (tdData instanceof HTMLElement || tdData instanceof Text) {
            if (tdData.nodeName.toLowerCase() === "td") {
              columnElem = tdData;
              if (ellipsis) {
                columnElem.classList.add("light-table-row-cell-break-ellipsis");
              }
              columnElem.classList.add("light-table-row-cell-break-word");
              columnElem.title = data[field] || "";
              columnElem.style.textAlign = align;
            } else {
              columnElem = window.lightDesign.parseHTML(
                `<td class="${ellipsis ? "light-table-row-cell-ellipsis" : ""} light-table-row-cell-break-word" style="text-align:${align};"
               title="${data[field] || ""}"></td>`
              );
              columnElem.appendChild(tdData);
            }
          } else {
            columnElem = window.lightDesign.parseHTML(
              `<td class="${
                ellipsis ? "light-table-row-cell-ellipsis" : ""
              } light-table-row-cell-break-word" style="text-align:${align};" title="${tdData.toString().replace(/<\/?.+?\/?>/g, "")}">${tdData}</td>`
            );
          }
        }
        tr.appendChild(columnElem);
        tr.rowData = data;
        if (fixed && fixed.toLowerCase() === "left") {
          isFixed = true;
          fixLeftTr.appendChild(columnElem);
          fixLeftTr.rowData = data;
        } else if (fixed && fixed.toLowerCase() === "right") {
          isFixed = true;
          fixRightTr.appendChild(columnElem);
          fixRightTr.rowData = data;
        }
      });
      if (isFixed) {
        _table.querySelector(".light-table-scroll tbody").appendChild(tr);
        if (_table.querySelector(".light-table-fixed-left tbody")) {
          _table.querySelector(".light-table-fixed-left tbody").appendChild(fixLeftTr);
        }
        if (_table.querySelector(".light-table-fixed-right tbody")) {
          _table.querySelector(".light-table-fixed-right tbody").appendChild(fixRightTr);
        }
      } else {
        _table.querySelector("tbody").appendChild(tr);
      }
    });
  }

  /**
   * 生成表体
   * @param {*} props
   */
  function _renderBody(props) {
    const { columns, _table } = props;
    const { dataSource, isHttp } = _table.lightTable.data;
    if (_table.lightTable.pagination) {
      const { pageIndex, pageSize } = _table.lightTable.pagination;
      let filterData = [];
      if (!isHttp) {
        filterData = dataSource.filter((item, index) => index >= pageIndex * pageSize - pageSize && index < pageIndex * pageSize);
      } else {
        filterData = dataSource;
      }

      _table.querySelectorAll("tbody").forEach(body => {
        body.querySelectorAll("tr").forEach(tr => {
          tr.remove();
        });
      });

      _renderBodyRow({
        dataSource: filterData,
        columns,
        _table,
      });
    } else {
      _renderBodyRow({
        dataSource,
        columns,
        _table,
      });
    }
  }

  /**
   * 生成表格
   * @param {json} props
   */
  function _renderTable(props) {
    const { columns, scroll, _table } = props;

    let tableWidth = 0;
    let colspan = returnColspan(columns, tableWidth);

    if (scroll) {
      const { x = tableWidth, y = 0 } = scroll;

      _table.querySelector(".light-table-content").appendChild(window.lightDesign.parseHTML(`<div class="light-table-scroll"></div>`));

      if (y > 0) {
        _table.querySelector(".light-table").classList.add("light-table-fixed-header");
        //生成表头
        _table.querySelector(".light-table-scroll").appendChild(
          window.lightDesign.parseHTML(
            `<div class="light-table-header light-table-hide-scrollbar" style="margin-bottom: -17px; padding-bottom: 0px; min-width: 17px; overflow: scroll;">
              <table class="light-table-fixed" style="width: ${x}px;">${colspan}</table>
            </div>`
          )
        );
        //生成表头
        _table.querySelector(".light-table-header table").appendChild(returnTHeader(columns));
        //生成表体
        _table.querySelector(".light-table-scroll").appendChild(
          window.lightDesign.parseHTML(
            `<div tabindex="-1" class="light-table-body" style="overflow: scroll; max-height: ${y}px;">
                <table class="light-table-fixed" style="width: ${x}px;">${colspan}</table>
              </div>`
          )
        );
        _table.querySelector(".light-table-body table").appendChild(window.lightDesign.parseHTML(`<tbody class="light-table-tbody"></tbody>`));

        //判断，是否有需要固定的列
        let fixColumns = columns.filter(item => item.fixed);
        renderFixedColumn(fixColumns, y, _table);
      } else {
        _table.querySelector(".light-table-scroll").appendChild(
          window.lightDesign.parseHTML(
            `<div tabindex="-1" class="light-table-body" style="overflow-x: scroll;">
                <table class="light-table-fixed" style="width: ${x}px;">${colspan}</table>
            </div>`
          )
        );

        //生成表头
        _table.querySelector("table").appendChild(returnTHeader(columns));

        //生成表体
        _table.querySelector("table").appendChild(window.lightDesign.parseHTML(`<tbody class="light-table-tbody"></tbody>`));
      }

      _table.querySelector("div.light-table-body").addEventListener("scroll", event => {
        event.stopPropagation();
        //表头随表体滚动
        _table.querySelector("div.light-table-header").scrollLeft = event.currentTarget.scrollLeft;

        if (0 < event.currentTarget.scrollLeft < event.currentTarget.scrollWidth) {
          _table.querySelector(".light-table").classList.remove("light-table-scroll-position-left");
          _table.querySelector(".light-table").classList.remove("light-table-scroll-position-right");
          _table.querySelector(".light-table").classList.add("light-table-scroll-position-middle");
        } else if (event.currentTarget.scrollLeft === event.currentTarget.scrollWidth) {
          _table.querySelector(".light-table").classList.remove("light-table-scroll-position-left");
          _table.querySelector(".light-table").classList.add("light-table-scroll-position-right");
          _table.querySelector(".light-table").classList.remove("light-table-scroll-position-middle");
        } else {
          _table.querySelector(".light-table").classList.add("light-table-scroll-position-left");
          _table.querySelector(".light-table").classList.remove("light-table-scroll-position-right");
          _table.querySelector(".light-table").classList.remove("light-table-scroll-position-middle");
        }
      });
    } else {
      _table.querySelector(".light-table-content").appendChild(
        window.lightDesign.parseHTML(
          `<div class="light-table-body">
            <table>
            ${colspan}
            </table>
          </div>`
        )
      );
      _table.querySelector(".light-table-body table").appendChild(returnTHeader(columns));
      _table.querySelector(".light-table-body table").appendChild(window.lightDesign.parseHTML(`<tbody class="light-table-tbody"></tbody>`));
    }
    // _renderEmptyDataDom(_table);
  }

  /**
   * 获取table数据
   * @param {json} dataSource
   * @param {HTMLElement} _table
   */
  function _getTableDataHandle(dataSource, _table) {
    if (!dataSource.transforms) {
      _table.lightTable.data.dataSource = dataSource;
      _table.lightTable.data.total = dataSource.length;
      _table.lightTable.data.isHttp = false;
    } else {
      const { url, type = "GET", params, headers, data, total, requestEnd } = dataSource.transforms;
      let query = params,
        reqeustHeader = headers;
      if (params && typeof params === "function") {
        const { pagination } = _table.lightTable;
        query = params(pagination || { pageIndex: 1, pageSize: 10 });
      }

      if (headers && typeof headers === "function") {
        reqeustHeader = headers(query);
      }

      if (type.toUpperCase() === "GET") {
        let res = window.lightDesign.httpGet(url, {
          params: query,
          headers: reqeustHeader,
        });

        if (res.status === 200 && !res.response.isNullOrEmpty()) {
          res = JSON.parse(res.response);
        }

        if (requestEnd && typeof requestEnd === "function") {
          res = requestEnd(res);
        }

        if (data && typeof data === "function") {
          _table.lightTable.data.dataSource = data(res) || [];
        }

        if (total && typeof total === "function") {
          _table.lightTable.data.total = total(res) || 0;
        }

        if (_table.lightTable.data.dataSource.length > 0 && _table.lightTable.data.total === 0) {
          _table.lightTable.data.total = _table.lightTable.data.dataSource.length;
        }
        _table.lightTable.data.isHttp = true;
      }
    }
    _table.lightTable.data.dataSource.forEach(item => {
      item._id = window.lightDesign.guid();
    });
  }

  //刷新数据源
  function _refreshTableData(dataSource, columns, _table) {
    _toggleLoading(_table);
    _getTableDataHandle(dataSource, _table);
    _renderBody({ columns, _table });
    _toggleLoading(_table);
  }

  //新增行
  function _addNewRecord(data, columns, _table) {
    if (_table.lightTable.data.isHttp) {
      _table.lightTable.event.refresh();
      return;
    }
    data._id = window.lightDesign.guid();
    _table.lightTable.data.dataSource.splice(0, 0, data);
    _refreshTableData(_table.lightTable.data.dataSource, columns, _table);
  }

  //编辑行
  function _editRecord(data, columns, _table) {
    if (_table.lightTable.data.isHttp) {
      _table.lightTable.event.refresh();
      return;
    }
    let fileterData = _table.lightTable.data.dataSource.filter(item => item._id === data._id);
    let index = _table.lightTable.data.dataSource.indexOf(fileterData);
    _table.lightTable.data.dataSource.splice(index, 1, data);
    _refreshTableData(_table.lightTable.data.dataSource, columns, _table);
  }

  //删除行
  function _removeRecord(_id, _table) {
    if (_table.lightTable.data.isHttp) {
      _table.lightTable.event.refresh();
      return;
    }
    _table.lightTable.data.dataSource.forEach((item, index, arr) => {
      if (item._id === _id) {
        arr.splice(index, 1);
      }
    });
    // let fileterData =  _table.lightTable.data.dataSource.filter(item => item._id === _id);
    // let index =  _table.lightTable.data.dataSource.indexOf(fileterData);
    // if (index > -1) {
    //    _table.lightTable.data.dataSource.splice(index, 1);
    // }
    _refreshTableData(_table.lightTable.data.dataSource, columns, _table);
  }

  /**
   * 生成Table
   * @param {json} props 
   * {
        bordered = true, //是否显示分割线
        columns = [], //列
        id,
        pageable = true, //是否分页
        scroll //是否滚动
    }
   */
  function Table(props) {
    const { bordered = true, columns = [], id, pageable = true, scroll } = props;
    let { dataSource = [] } = props;

    //生成table主体
    let _table = window.lightDesign.parseHTML(
      `<div class="light-table-wrapper">
          <div class="light-spin-nested-loading">
            <div class="light-spin-container">
              <div class="light-table light-table-default light-table-scroll-position-left light-table-layout-fixed">
                <div class="light-table-content">
                </div>
              </div>
              ${pageable ? '<div id="pageable"></div>' : ""}
            </div>
          </div>
        </div>`
    );

    //判断，是否需要添加 border
    if (bordered) {
      _table.querySelector(".light-table").classList.add("light-table-bordered");
    }

    //将数据信息，绑定到dom
    _table.lightTable = {
      data: {
        dataSource: [],
        total: 0,
        isHttp: false,
      },
    };

    //dom绑定ID
    if (id && !id.isNullOrEmpty()) {
      _table.id = id;
    }

    //生成表格
    _renderTable({ columns, scroll, _table });

    _toggleLoading(_table);

    //获取数据
    _getTableDataHandle(dataSource, _table);

    //生成翻页控件
    if (pageable) {
      _renderTablePagiantion(pageable, _table);
    }

    _renderBody({ columns, _table });

    _toggleLoading(_table);

    _table.lightTable.columns = columns;

    _table.lightTable.event = {
      refresh: () => {
        _refreshTableData(dataSource, columns, _table);
      },
      add: data => {
        _addNewRecord(data, columns, _table);
      },
      edit: data => {
        _editRecord(data, columns, _table);
      },
      remove: elem => {
        const _id = elem.rowData ? elem.rowData._id : "";
        _removeRecord(_id, columns, _table);
      },
      setDataSource: data => {
        dataSource = data;
        _refreshTableData(dataSource, columns, _table);
        if (pageable) {
          if (_table.querySelector(".light-table-pagination")) {
            _table.querySelector(".light-table-pagination").replaceWith(window.lightDesign.parseHTML('<div id="pageable"></div>'));
          }
          _renderTablePagiantion(pageable, _table);
          _table.querySelector("ul.light-pagination").classList.add("light-table-pagination");
        }
      },
    };

    return _table;
  }

  HTMLElement.prototype.lightTable = function (props) {
    //如果没有设置id，则使用当前dom的id，或者guid
    if (!props.id) {
      props.id = this.id || window.lightDesign.guid();
    }

    this.replaceWith(Table(props));
  };
})();
