(() => {
  let _data = [],
    _total = 0,
    _isHttp = false;

  //切换loading状态
  function _toggleLoading(_table) {
    if (_table.querySelector(".light-table-spin-holder")) {
      _table.querySelector(".light-table-spin-holder").parentElement.remove();
      _table
        .querySelector(".light-spin-container")
        .classList.remove("light-spin-blur");
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
      _table
        .querySelector(".light-spin-container")
        .classList.add("light-spin-blur");
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
          <p class="light-empty-description">No Data</p>
        </div>
      </div>`
    );
    if (!_table.querySelector(".light-table-placeholder")) {
      _table.querySelector(".light-table-content").appendChild(emptyElem);
      if (_table.querySelector("ul.light-table-pagination")) {
        _table.querySelector("ul.light-table-pagination").remove();
      }
      _table.querySelectorAll("tbody>tr.light-table-row").forEach(item => {
        item.remove();
      });
    }
  }

  //生成表格行内容
  function _renderBodyRow(data, columns, rowKey) {
    let rowElem = window.lightDesign.parseHTML(
      `<tr class="light-table-row light-table-row-level-0" data-row-key="${rowKey}"></tr>`
    );
    columns.forEach(column => {
      const { align = "center", className, render, field, command } = column;
      let columnElem;
      if (command && command.length > 0) {
        columnElem = window.lightDesign.parseHTML(
          `<td class="light-table-row-cell-ellipsis" style="text-align:${align}"><span></span></td>`
        );
        command.forEach((item, index, arr) => {
          const { name, click } = item;
          let commandElem = window.lightDesign.parseHTML(`<a>${name}</a>`);
          commandElem.addEventListener("click", event => {
            if (click && typeof click === "function") {
              click(data, event);
            }
          });
          columnElem.appendChild(commandElem);
          if (index + 1 < arr.length) {
            columnElem.appendChild(
              window.lightDesign.parseHTML(
                `<div class="light-divider light-divider-vertical" role="separator"></div>`
              )
            );
          }
        });
      } else {
        columnElem = window.lightDesign.parseHTML(
          `<td class="light-table-row-cell-ellipsis" style="text-align:${align};" title="${data[
            field
          ] || ""}">${
            render && typeof render === "function"
              ? render(data)
              : data[field] || ""
          }</td>`
        );
      }
      rowElem.appendChild(columnElem);
    });
    rowElem.rowData = data;
    return rowElem;
  }

  function _getTableDataHandle(dataSource, _table) {
    if (!dataSource.transforms) {
      _data = dataSource;
      _total = dataSource.length;
      _isHttp = false;
    } else {
      const {
        url,
        type = "GET",
        params,
        headers,
        data,
        total,
        requestEnd
      } = dataSource.transforms;
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
          headers: reqeustHeader
        });

        if (res.status === 200 && !res.response.isNullOrEmpty()) {
          res = JSON.parse(res.response);
        }

        if (requestEnd && typeof requestEnd === "function") {
          res = requestEnd(res);
        }

        if (data && typeof data === "function") {
          _data = data(res) || [];
        }

        if (total && typeof total === "function") {
          _total = total(res) || 0;
        }

        if (_data.length > 0 && _total === 0) {
          _total = _data.length;
        }
        _isHttp = true;
      }
    }
    _data.forEach(item => {
      item._id = window.lightDesign.guid();
    });
  }

  /**
   * 生成表体方法
   * @param {json/[json]} dataSource
   * @param {[json]]} columns
   * @param {HTMLDocument} _table
   */
  function _renderTableBody(columns, _table) {
    if (columns.length < 1) return;

    if (
      _table.querySelectorAll(".light-table-tbody>tr") &&
      _table.querySelectorAll(".light-table-tbody>tr").length > 0
    ) {
      _table.querySelectorAll(".light-table-tbody>tr").forEach(item => {
        item.remove();
      });
    }
    if (_data.length === 0) _renderEmptyDataDom(_table);

    if (_table.lightTable.pagination && !_isHttp) {
      let { pageIndex, pageSize } = _table.lightTable.pagination;

      _data.forEach((data, index) => {
        if (
          index >= pageIndex * pageSize - pageSize &&
          index < pageIndex * pageSize
        ) {
          _table
            .querySelector("tbody")
            .appendChild(_renderBodyRow(data, columns, index));
        }
      });
    } else {
      _data.forEach((data, index) => {
        _table
          .querySelector("tbody")
          .appendChild(_renderBodyRow(data, columns, index));
      });
    }
  }

  /**
   * 生成表头方法
   * @param {[JSON]} columns
   * @param {HTMLDocument} _table
   */
  function _renderTableHeader(columns, _table) {
    if (columns.length === 0) return;
    //开始添加表头
    columns.forEach(column => {
      const {
        align = "center",
        className,
        render,
        title,
        field,
        width = "auto",
        command
      } = column;
      //添加colgroup
      _table
        .querySelector("colgroup")
        .appendChild(
          window.lightDesign.parseHTML(
            `<col style="width:${width};min-width:${width}"></col>`
          )
        );
      //判断thead下有无行，没有则加上
      if (!_table.querySelector("thead>tr")) {
        _table
          .querySelector("thead")
          .appendChild(window.lightDesign.parseHTML("<tr></tr>")[0]);
      }
      _table.querySelector("thead>tr").appendChild(
        window.lightDesign.parseHTML(
          `<th class="light-table-row-cell-ellipsis ${
            width !== "auto" ? "light-table-row-cell-break-word" : ""
          }" style="text-align:${align}">
            <span class="light-table-header-column">
              <div>
                <span class="light-table-column-title">${title || ""}</span>
                <span class="light-table-column-sorter"></span>
              </div>
            </span>
          </th>`
        )
      );
    });
    //给最后一列添加Class
    _table
      .querySelector("thead>tr>th:last-child")
      .classList.add("light-table-row-cell-last");
  }

  /**
   * 生成翻页控件方法
   * @param {Boolean/JSON} pageable
   */
  function _renderTablePagiantion(pageable, _table) {
    //如果pageable为true时，使用默认配置，生成分页控件
    if (pageable && typeof pageable === "boolean") {
      _table.lightTable.pagination = {
        pageSize: 10,
        pageIndex: 1
      };
      _table.querySelector("#pageable").lightPagination({
        total: _total,
        onChange: (current, pageSize) => {
          _table.lightTable.pagination.pageIndex = current;
          _table.lightTable.pagination.pageSize = pageSize;
          _table.lightTable.event.refresh();
          return true;
        }
      });
    }
  }

  //刷新数据源
  function _refreshTableData(dataSource, _table) {
    _toggleLoading(_table);
    _getTableDataHandle(dataSource, _table);
    _renderTableBody(_table.lightTable.columns, _table);
    _toggleLoading(_table);
  }

  //新增行
  function _addNewRecord(data, _table) {
    if (_isHttp) {
      _table.lightTable.event.refresh();
      return;
    }
    data._id = window.lightDesign.guid();
    _data.splice(0, 0, data);
    _refreshTableData(_data, _table);
  }

  //编辑行
  function _editRecord(data, _table) {
    if (_isHttp) {
      _table.lightTable.event.refresh();
      return;
    }
    let fileterData = _data.filter(item => item._id === data._id);
    let index = _data.indexOf(fileterData);
    _data.splice(index, 1, data);
    _refreshTableData(_data, _table);
  }

  //删除行
  function _removeRecord(_id, _table) {
    if (_isHttp) {
      _table.lightTable.event.refresh();
      return;
    }
    let fileterData = _data.filter(item => item._id === _id);
    let index = _data.indexOf(fileterData);
    if (index > -1) {
      _data.splice(index, 1);
    }
    _refreshTableData(_data, _table);
  }

  /**
   * 生成table方法
   * @param {*} props { 
      bordered : boolean = true,是否显示分割线
      columns : [{
        align:string('left' | 'right' | 'center')='center', 设置列的对齐方式
        className:string, 样式名
        render:function(dataItem),渲染方法
        title:string, 表头名称
        field:string, 对应数据源名称
        width:string='auto', 宽度
        command:[json] //操作按钮
      }],表头配置
      dataSource:[json]/{
        transforms:{
          url:string,
          type:string,
          params:json/function(pagiantion),
          headers:json/function(params),
          data:function(res),
          total:function(res),
          requestEnd:function(res)
        }
      }, 数据源配置
      id:string, 表格id
      pageable:boolean/json = true 是否分页显示
    }
   */
  function Table(props) {
    const {
      bordered = true,
      columns = [],
      dataSource = [],
      id,
      pageable = true
    } = props;

    //生成table主体
    let _table = window.lightDesign.parseHTML(
      `<div class="light-table-wrapper">
        <div class="light-spin-nested-loading">
          <div class="light-spin-container">
            <div class="light-table light-table-default ${
              bordered ? "light-table-bordered" : ""
            } light-table-scroll-position-left light-table-layout-fixed">
              <div class="light-table-content">
                <div class="light-table-body">
                  <table>
                    <colgroup></colgroup>
                    <thead class="light-table-thead"></thead>
                    <tbody class="light-table-tbody"></tbody>
                  </table>
                </div>
              </div>
            </div>
            ${pageable ? '<div id="pageable"></div>' : ""}
          </div>
        </div>
      </div>`
    );

    _table.lightTable = {};

    if (id && !id.isNullOrEmpty()) {
      _table.id = id;
    }
    //生成表头
    _renderTableHeader(columns, _table);

    //获取数据
    _getTableDataHandle(dataSource, _table);

    //生成翻页控件
    if (pageable) {
      _renderTablePagiantion(pageable, _table);
      _table
        .querySelector("ul.light-pagination")
        .classList.add("light-table-pagination");
    }

    //生成表体
    _renderTableBody(columns, _table);

    _table.lightTable.columns = columns;

    _table.lightTable.event = {
      refresh: () => {
        _refreshTableData(dataSource, _table);
      },
      add: data => {
        _addNewRecord(data, _table);
      },
      edit: data => {
        _editRecord(data, _table);
      },
      remove: elem => {
        const _id = elem.rowData ? elem.rowData._id : "";
        _removeRecord(_id, _table);
      }
    };

    return _table;
  }

  HTMLElement.prototype.lightTable = function(props) {
    this.replaceWith(Table(props));
  };
})();
