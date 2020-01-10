(function() {
  function generateOperation() {}

  //生成操作栏按钮
  function generateOperationButtons(commands) {
    let td = document.createElement("td");
    commands.forEach(function(item, index) {
      var a = document.createElement("a");
      a.classList.add("table-tbody-operation");
      a.innerHTML = `<span>${item.name}</span>`;
      a.onclick = item.onClick;
      td.appendChild(a);
      if (index + 1 !== commands.length) {
        td.appendChild(
          window.lightDesignGlobal.parseHTML(
            '<div class="divider divider-vertical"></div>'
          )[0]
        );
      }
    });
    return td;
  }

  //切换loding样式
  function toggleLoading(table, isLoading) {
    let loadingHtml = `<div>
      <div class="spin spin-spinning table-without-pagination table-spin-holder">
        <span class="spin-dot spin-dot-spin">
          <i class="spin-dot-item"></i>
          <i class="spin-dot-item"></i>
          <i class="spin-dot-item"></i>
          <i class="spin-dot-item"></i>
        </span>
      </div>
    </div>`;
    if (isLoading) {
      table
        .querySelector(".spin-container")
        .before(window.lightDesignGlobal.parseHTML(loadingHtml)[0]);
      table.querySelector(".spin-container").classList.add("spin-blur");
    } else {
      table
        .querySelector(".spin-nested-loading")
        .querySelectorAll("div")[0]
        .remove();
      table.querySelector(".spin-container").classList.remove("spin-blur");
    }
  }

  //如果data为空，页面提示
  function returnEmptyInfo() {
    return window.lightDesignGlobal.parseHTML(
      `<div class="table-placeholder">
        <div class="empty empty-normal">
          <div class="empty-image">
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
          <p class="empty-description">暂无数据</p>
        </div>
      </div>`
    )[0];
  }

  //table数据变化时事件
  function tableDataChange(table, data, columns) {
    let oldTBody = table.querySelector("tbody");
    let newTBody = document.createElement("tbody");
    newTBody.classList.add("table-tbody");

    if (!data || data.length === 0) {
      if (
        table.closest("div.table-wrapper").querySelector(".table-placeholder")
      ) {
        return;
      } else {
        table
          .querySelector(".table-tbody")
          .querySelectorAll("tr")
          .forEach(item => {
            item.remove();
          });
        table
          .closest("div.table-wrapper")
          .querySelector(".table-content")
          .appendChild(returnEmptyInfo());
        return;
      }
    }

    if (
      table.closest("div.table-wrapper").querySelector(".table-placeholder")
    ) {
      table
        .closest("div.table-wrapper")
        .querySelector(".table-placeholder")
        .remove();
    }
    //循环生成tbody节点内容
    data.forEach(function(item, index) {
      tr = document.createElement("tr");
      tr.classList.add("table-row", "table-row-level-0");
      tr.__proto__.rowData = item; //将数据绑定到行
      columns.forEach(function(column) {
        let td = document.createElement("td");
        if (column.filename === "operation") {
          tr.appendChild(generateOperationButtons(column.commands));
          return;
        }
        td.classList.add("table-row-cell-ellipsis");
        td.style = "text-align:center";
        td.appendChild(
          column.render
            ? column.render(item, index)
            : document.createTextNode(item[column.filename] || "")
        ); //如果用户有自定义输入内容，则按用户定义的输出
        tr.appendChild(td);
      });
      newTBody.appendChild(tr);
    });

    oldTBody.replaceWith(newTBody);
  }

  //生成表格
  function tableHandle(elem, proto) {
    const { columns, data, pagination } = proto;

    //判断columns必须设置，并且为Array格式，否则弹出错误，并退出
    if (!columns || !(columns instanceof Array)) {
      console.error("table must set columns!!!\ncolumns must be Array!!!");
      return;
    }

    let parentEle = window.lightDesignGlobal.parseHTML(
        `<div id="${elem.id}" class="table-wrapper">
          <div class="spin-nested-loading">
            <div class="spin-container">
              <div class="table table-default table-bordered table-scroll-position-left table-layout-fixed">
                <div class="table-content">
                  <div class="table-body"></div>
                </div>
              </div>
            </div>
          </div>
        </div>`
      ),
      grid = document.createElement("table"), //创建table节点
      colgroup = document.createElement("colgroup"), //创建colgroup节点
      thead = document.createElement("thead"), //创建thead节点
      tbody = document.createElement("tbody"), //创建tbody节点
      tr = document.createElement("tr");
    //给thead和tbody节点添加class
    thead.classList.add("table-thead");
    tbody.classList.add("table-tbody");
    //循环生成thead节点内容
    columns.forEach(function(item, index) {
      if (item.filename === "operation") {
        item.name = "Operation";
      }
      let th = window.lightDesignGlobal.parseHTML(
        `<th data-index='${index}' class='table-row-cell-ellipsis ${
          index + 1 === columns.length ? "table-row-cell-last" : ""
        }' style='width:${item.width || "auto"};text-align:center;'>
          <span class="table-header-column">
            <div>
                <span class="table-column-title">${item.name}</span>
            </div>
          </span>
        </th>`
      );
      tr.appendChild(th[0]);
      colgroup.appendChild(window.lightDesignGlobal.parseHTML("<col />")[0]);
    });
    thead.appendChild(tr);
    //循环生成tbody节点内容
    data.forEach(function(item, index) {
      tr = document.createElement("tr");
      tr.classList.add("table-row", "table-row-level-0");
      tr.__proto__.rowData = item; //将数据绑定到行
      columns.forEach(function(column) {
        let td = document.createElement("td");
        if (column.filename === "operation") {
          tr.appendChild(generateOperationButtons(column.commands));
          return;
        }
        td.classList.add("table-row-cell-ellipsis");
        td.style = "text-align:center";
        td.title = item[column.filename] || "";
        td.appendChild(
          column.render
            ? column.render(item, index)
            : document.createTextNode(item[column.filename] || "")
        ); //如果用户有自定义输入内容，则按用户定义的输出
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    grid.appendChild(colgroup);
    grid.appendChild(thead);
    grid.appendChild(tbody);
    parentEle[0].querySelector(".table-body").appendChild(grid); //将表格填充进父容器

    //如果数据为空时显示
    if (!data || data.length === 0) {
      parentEle[0]
        .querySelector(".table-content")
        .appendChild(returnEmptyInfo());
    }

    //如果需要分页，则进行处理
    if (pagination && typeof pagination === "object") {
      const { totalCount, pageIndex, pageSize, pageChange } = pagination;
      parentEle[0].querySelector(".spin-container").appendChild(
        window.lightDesignGlobal.parseHTML("<div></div>")[0].paginationHandle({
          totalCount,
          pageIndex,
          pageSize,
          pageChange
        })
      );
    }

    parentEle[0].__proto__.gridable = {
      columns,
      tableDataChange,
      toggleLoading
    };

    elem.parentElement.replaceChild(parentEle[0], elem);
  }

  // 给所有dom节点，添加tableHandle方法。传入参数为json格式
  HTMLElement.prototype.tableHandle = function(proto) {
    return tableHandle(this, proto);
  };
})();
