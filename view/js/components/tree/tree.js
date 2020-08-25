(() => {
  //获取树的数据源
  function getTreeData(treeData) {
    if (treeData.transforms) {
      let { type, url, params, headers } = treeData.transforms;
      let query = "",
        requestHeaders = {};
      if (params && params instanceof String) {
        query = params;
      } else if (params && params instanceof Object) {
        let arrQuery = [];
        for (const key in params) {
          if (params.hasOwnProperty(key)) {
            arrQuery.push(`${key}=${params[key]}`);
          }
        }
        query = arrQuery.join("&");
      }

      if (headers && headers instanceof Function) {
        requestHeaders = headers(query);
      }

      let res = window.lightDesign.httpGet(url, {
        params: query,
        headers: requestHeaders,
      });
      if (res.status === 200 && res.readyState === 4) {
        let resData = JSON.parse(res.responseText);
        return resData;
      }
      return [];
    } else {
      return treeData instanceof Array && treeData.length > 0 ? treeData : [];
    }
  }

  //向上轮询事件
  function prevCheckboxHandle(params) {
    let {
      element,
      checked = "checked",
      childFieldName,
      valueFieldName,
    } = params;
    let treeList = element.closest("div.light-tree-list-holder-inner");
    let treeNode = element.closest("div.light-tree-treenode");
    if (checked === "checked") {
      element.classList.add("light-tree-checkbox-checked");
      treeNode.classList.add("light-tree-treenode-checkbox-checked");
      if (treeNode.querySelector(".light-tree-indent")) {
        //如果存在父级，则向上轮询
        let parentTreeNode = treeList.querySelector(
          `div[data-value="${treeNode.getAttribute("data-parentvalue")}"]`
        );
        if (parentTreeNode) {
          parentTreeNode.treeCheckedChild += 1;
          prevCheckboxHandle({
            element: parentTreeNode.querySelector(".light-tree-checkbox"),
            checked: "indeterminate",
            childFieldName,
            valueFieldName,
          });
        }
      }
    } else if (checked === "inchecked") {
      element.classList.remove("light-tree-checkbox-checked");
      treeNode.classList.remove("light-tree-treenode-checkbox-checked");
      treeNode.treeCheckedChild = 0;
      if (treeNode.querySelector(".light-tree-indent")) {
        //如果存在父级，则向上轮询
        let parentTreeNode = treeList.querySelector(
          `div[data-value="${treeNode.getAttribute("data-parentvalue")}"]`
        );
        if (parentTreeNode) {
          if (parentTreeNode.treeCheckedChild > 0)
            parentTreeNode.treeCheckedChild -= 1;
          prevCheckboxHandle({
            element: parentTreeNode.querySelector(".light-tree-checkbox"),
            checked: "inchecked",
            childFieldName,
            valueFieldName,
          });
        }
      }
    } else {
      //判断子集是否全部选中
      if (treeNode.treeCheckedChild === treeNode.treeChildCount) {
        element.classList.add("light-tree-checkbox-checked");
        treeNode.classList.add("light-tree-treenode-checkbox-checked");
        element.classList.remove("light-tree-checkbox-indeterminate");
        treeNode.classList.remove("light-tree-treenode-checkbox-indeterminate");
        if (treeNode.querySelector(".light-tree-indent")) {
          //如果存在父级，则向上轮询
          let parentTreeNode = treeList.querySelector(
            `div[data-value="${treeNode.getAttribute("data-parentvalue")}"]`
          );
          if (parentTreeNode) {
            parentTreeNode.treeCheckedChild += 1;
            prevCheckboxHandle({
              element: parentTreeNode.querySelector(".light-tree-checkbox"),
              checked: "indeterminate",
              childFieldName,
              valueFieldName,
            });
          }
        }
      } else if (treeNode.treeCheckedChild === 0) {
        element.classList.remove("light-tree-checkbox-checked");
        treeNode.classList.remove("light-tree-treenode-checkbox-checked");
        element.classList.remove("light-tree-checkbox-indeterminate");
        treeNode.classList.remove("light-tree-treenode-checkbox-indeterminate");
        if (treeNode.querySelector(".light-tree-indent")) {
          //如果存在父级，则向上轮询
          let parentTreeNode = treeList.querySelector(
            `div[data-value="${treeNode.getAttribute("data-parentvalue")}"]`
          );
          if (parentTreeNode) {
            if (parentTreeNode.treeCheckedChild > 0)
              parentTreeNode.treeCheckedChild -= 1;
            prevCheckboxHandle({
              element: parentTreeNode.querySelector(".light-tree-checkbox"),
              checked: "indeterminate",
              childFieldName,
              valueFieldName,
            });
          }
        }
      } else {
        element.classList.remove("light-tree-checkbox-checked");
        treeNode.classList.remove("light-tree-treenode-checkbox-checked");
        element.classList.add("light-tree-checkbox-indeterminate");
        treeNode.classList.add("light-tree-treenode-checkbox-indeterminate");
        if (treeNode.querySelector(".light-tree-indent")) {
          //如果存在父级，则向上轮询
          let parentTreeNode = treeList.querySelector(
            `div[data-value="${treeNode.getAttribute("data-parentvalue")}"]`
          );
          if (parentTreeNode) {
            parentTreeNode.treeCheckedChild += 1;
            prevCheckboxHandle({
              element: parentTreeNode.querySelector(".light-tree-checkbox"),
              checked: "indeterminate",
              childFieldName,
              valueFieldName,
            });
          }
        }
      }
    }
  }

  //向下轮询事件
  function nextCheckboxHandle(params) {
    let {
      element,
      checked = "checked",
      childFieldName,
      valueFieldName,
    } = params;
    let tree = element.closest("div.light-tree");
    let treeList = element.closest("div.light-tree-list-holder-inner");
    let treeNode = element.closest("div.light-tree-treenode");
    element.classList.remove("light-tree-checkbox-indeterminate");
    treeNode.classList.remove("light-tree-treenode-checkbox-indeterminate");
    if (checked === "checked") {
      element.classList.add("light-tree-checkbox-checked");
      treeNode.classList.add("light-tree-treenode-checkbox-checked");
      let checkedKeys = tree.querySelector('div[role="tree"] input')
        .checkedKeys;
      if (checkedKeys instanceof Array) {
        let findData = checkedKeys.find(
          (key) => key[valueFieldName] === treeNode.treeNodeData[valueFieldName]
        );
        if (!findData) checkedKeys.push(treeNode.treeNodeData);
      } else {
        checkedKeys = [treeNode.treeNodeData];
      }
      tree.querySelector('div[role="tree"] input').checkedKeys = checkedKeys;
      //如果存在子集，则向下轮询
      let childData = treeNode.treeNodeData[childFieldName] || [];
      childData.forEach((item) => {
        let node = treeList.querySelector(
          `span.light-tree-checkbox[data-value="${item[valueFieldName]}"]`
        );
        if (node) {
          nextCheckboxHandle({
            element: node,
            checked: "checked",
            childFieldName,
            valueFieldName,
          });
        }
      });
      treeNode.treeCheckedChild = childData.length;
    } else if (checked === "inchecked") {
      element.classList.remove("light-tree-checkbox-checked");
      treeNode.classList.remove("light-tree-treenode-checkbox-checked");
      treeNode.treeCheckedChild = 0;
      let checkedKeys = tree.querySelector('div[role="tree"] input')
        .checkedKeys;
      if (checkedKeys instanceof Array) {
        checkedKeys.forEach((item, index) => {
          if (item[valueFieldName] === treeNode.treeNodeData[valueFieldName]) {
            checkedKeys.splice(index, 1);
          }
        });
      } else {
        checkedKeys = [];
      }
      tree.querySelector('div[role="tree"] input').checkedKeys = checkedKeys;
      //如果存在子集，则向下轮询
      let childData = treeNode.treeNodeData[childFieldName] || [];
      childData.forEach((item) => {
        let node = treeList.querySelector(
          `span.light-tree-checkbox[data-value="${item[valueFieldName]}"]`
        );
        if (node) {
          nextCheckboxHandle({
            element: node,
            checked: "inchecked",
            childFieldName,
            valueFieldName,
          });
        }
      });
    }
  }

  //checkbox 选中事件
  //checked 有三种选项 checked inchecked indeterminate
  function checkboxHandle(params) {
    let {
      element,
      checked = "checked",
      childFieldName,
      valueFieldName,
      checkedChild,
    } = params;
    let tree = element.closest("div.light-tree");
    let treeList = element.closest("div.light-tree-list-holder-inner");
    let treeNode = element.closest("div.light-tree-treenode");
    element.classList.remove("light-tree-checkbox-indeterminate");
    treeNode.classList.remove("light-tree-treenode-checkbox-indeterminate");
    let checkedKeys = tree.querySelector('div[role="tree"] input').checkedKeys;
    if (checked === "checked") {
      element.classList.add("light-tree-checkbox-checked");
      treeNode.classList.add("light-tree-treenode-checkbox-checked");
      if (checkedKeys instanceof Array) {
        let findData = checkedKeys.find(
          (key) => key[valueFieldName] === treeNode.treeNodeData[valueFieldName]
        );
        if (!findData) checkedKeys.push(treeNode.treeNodeData);
      } else {
        checkedKeys = [treeNode.treeNodeData];
      }
      tree.querySelector('div[role="tree"] input').checkedKeys = checkedKeys;
      // if (treeNode.querySelector(".light-tree-indent")) {
      //   //如果存在父级，则向上轮询
      //   let parentTreeNode = treeList.querySelector(
      //     `div[data-value="${treeNode.getAttribute("data-parentvalue")}"]`
      //   );
      //   if (parentTreeNode) {
      //     parentTreeNode.treeCheckedChild += 1;
      //     prevCheckboxHandle({
      //       element: parentTreeNode.querySelector(".light-tree-checkbox"),
      //       checked: "indeterminate",
      //       childFieldName,
      //       valueFieldName
      //     });
      //   }
      // }
      //如果存在子集，则向下轮询
      if (checkedChild) {
        let childData = treeNode.treeNodeData[childFieldName] || [];
        childData.forEach((item) => {
          let node = treeList.querySelector(
            `span.light-tree-checkbox[data-value="${item[valueFieldName]}"]`
          );
          if (node) {
            nextCheckboxHandle({
              element: node,
              checked: "checked",
              childFieldName,
              valueFieldName,
            });
          }
        });
        treeNode.treeCheckedChild = childData.length;
      }
    } else if (checked === "inchecked") {
      element.classList.remove("light-tree-checkbox-checked");
      treeNode.classList.remove("light-tree-treenode-checkbox-checked");
      treeNode.treeCheckedChild = 0;
      if (checkedKeys instanceof Array) {
        checkedKeys.forEach((item, index) => {
          if (item[valueFieldName] === treeNode.treeNodeData[valueFieldName]) {
            checkedKeys.splice(index, 1);
          }
        });
      } else {
        checkedKeys = [];
      }
      tree.querySelector('div[role="tree"] input').checkedKeys = checkedKeys;
      if (treeNode.querySelector(".light-tree-indent") && checkedChild) {
        //如果存在父级，则向上轮询
        let parentTreeNode = treeList.querySelector(
          `div[data-value="${treeNode.getAttribute("data-parentvalue")}"]`
        );
        if (parentTreeNode) {
          if (parentTreeNode.treeCheckedChild > 0)
            parentTreeNode.treeCheckedChild -= 1;
          prevCheckboxHandle({
            element: parentTreeNode.querySelector(".light-tree-checkbox"),
            checked: "inchecked",
            childFieldName,
            valueFieldName,
          });
        }
      }
      //如果存在子集，则向下轮询
      if (checkedChild) {
        let childData = treeNode.treeNodeData[childFieldName] || [];
        childData.forEach((item) => {
          let node = treeList.querySelector(
            `span.light-tree-checkbox[data-value="${item[valueFieldName]}"]`
          );
          if (node) {
            nextCheckboxHandle({
              element: node,
              checked: "inchecked",
              childFieldName,
              valueFieldName,
            });
          }
        });
      }
    } else {
      //判断子集是否全部选中
      if (treeNode.treeCheckedChild === treeNode.treeChildCount) {
        element.classList.add("light-tree-checkbox-checked");
        treeNode.classList.add("light-tree-treenode-checkbox-checked");
        if (treeNode.querySelector(".light-tree-indent")) {
          //如果存在父级，则向上轮询
          let parentTreeNode = treeList.querySelector(
            `div[data-value="${treeNode.getAttribute("data-parentvalue")}"]`
          );
          if (parentTreeNode) {
            parentTreeNode.treeCheckedChild += 1;
            prevCheckboxHandle({
              element: parentTreeNode.querySelector(".light-tree-checkbox"),
              checked: "indeterminate",
              childFieldName,
              valueFieldName,
            });
          }
        }
      } else if (treeNode.treeCheckedChild === 0) {
        element.classList.remove("light-tree-checkbox-checked");
        treeNode.classList.remove("light-tree-treenode-checkbox-checked");
        element.classList.remove("light-tree-checkbox-indeterminate");
        treeNode.classList.remove("light-tree-treenode-checkbox-indeterminate");
        if (treeNode.querySelector(".light-tree-indent")) {
          //如果存在父级，则向上轮询
          let parentTreeNode = treeList.querySelector(
            `span.light-tree-checkbox[data-value="${treeNode.getAttribute(
              "data-parentvalue"
            )}"]`
          );
          if (parentTreeNode) {
            if (parentTreeNode.treeCheckedChild > 0)
              parentTreeNode.treeCheckedChild -= 1;
            prevCheckboxHandle({
              element: parentTreeNode.querySelector(".light-tree-checkbox"),
              checked: "indeterminate",
              childFieldName,
              valueFieldName,
            });
          }
        }
      } else {
        element.classList.add("light-tree-checkbox-indeterminate");
        treeNode.classList.add("light-tree-treenode-checkbox-indeterminate");
        if (treeNode.querySelector(".light-tree-indent")) {
          //如果存在父级，则向上轮询
          let parentTreeNode = treeList.querySelector(
            `div[data-value="${treeNode.getAttribute("data-parentvalue")}"]`
          );
          if (parentTreeNode) {
            prevCheckboxHandle({
              element: parentTreeNode.querySelector(".light-tree-checkbox"),
              checked: "indeterminate",
              childFieldName,
              valueFieldName,
            });
          }
        }
      }
    }
  }

  function deleteElementHandle(params) {
    let { data, valueFieldName, childFieldName, _tree } = params;
    if (data.length > 0) {
      data.forEach((item) => {
        if (
          _tree.querySelector(
            `div.light-tree-treenode[data-value="${item[valueFieldName]}"]`
          )
        ) {
          _tree
            .querySelector(
              `div.light-tree-treenode[data-value="${item[valueFieldName]}"]`
            )
            .remove();
        }
        if (item[childFieldName] && item[childFieldName].length > 0) {
          deleteElementHandle({
            data: item[childFieldName],
            valueFieldName,
            childFieldName,
            _tree,
          });
        }
      });
    }
  }

  function _returnTreeNodeElement(params) {
    let {
      item,
      checkable, //是否显示多选框
      checkedKeys, //默认选中的值
      onExpand, //节点展开事件
      onSelect, //节点选中事件
      onChecked, //多选框选中事件
      textFieldName, //界面展示的字段
      valueFieldName, //code映射的字段
      childFieldName, //子集映射的字段
      checkedFieldName,
      checkboxDisableFieldName,
      checkedChild,
      expandFieldName,
      parentNode,
      _tree,
    } = params;

    let indentHtml = "";
    let parentValue = "";
    //如果存在父节点时，增加缩进
    if (parentNode && parentNode instanceof HTMLElement) {
      let indentArr = [];
      let count =
        parentNode.querySelectorAll(".light-tree-indent-unit").length + 1;
      for (let i = 0; i < count; i++) {
        if (i + 1 === count) {
          indentArr.push(
            '<span class="light-tree-indent-unit light-tree-indent-unit-start"></span>'
          );
        } else {
          indentArr.push('<span class="light-tree-indent-unit"></span>');
        }
      }
      indentHtml = `<span aria-hidden="true" class="light-tree-indent">${indentArr.join(
        ""
      )}</span>`;
      parentValue = parentNode.treeNodeData[valueFieldName];
    }

    let _treeNode = window.lightDesign.parseHTML(
      `<div data-value="${
        item[valueFieldName]
      }" data-parentvalue="${parentValue}" class="light-tree-treenode light-tree-treenode-switcher-close">
        ${indentHtml}
        <span class="light-tree-switcher light-tree-switcher_close">
          <span role="img" aria-label="caret-down" class="anticon anticon-caret-down light-tree-switcher-icon">
            <svg viewBox="0 0 1024 1024" focusable="false" class="" data-icon="caret-down" width="1em" height="1em" fill="currentColor" aria-hidden="true">
              <path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"></path>
            </svg>
          </span>
        </span>
        ${
          checkable
            ? `<span data-value="${item[valueFieldName]}" class="light-tree-checkbox">
                <span class="light-tree-checkbox-inner"></span>
              </span>`
            : ""
        }
        <span title="${
          item[textFieldName]
        }" class="light-tree-node-content-wrapper light-tree-node-content-wrapper-close">
          <span class="light-tree-title">${item[textFieldName]}</span>
        </span>
      </div>`
    );

    if (item[checkboxDisableFieldName]) {
      _treeNode
        .querySelector(".light-tree-checkbox")
        .classList.add("light-tree-checkbox-disabled");
    }

    if (item[checkedFieldName]) {
      _treeNode
        .querySelector(".light-tree-checkbox")
        .classList.add("light-tree-checkbox-checked");
      if (_tree.querySelector('div[role="tree"] input').checkedKeys) {
        let findData = _tree
          .querySelector('div[role="tree"] input')
          .checkedKeys.find(
            (data) => data[valueFieldName] === item[valueFieldName]
          );
        if (!findData) {
          _tree.querySelector('div[role="tree"] input').checkedKeys.push(item);
        }
      } else {
        _tree.querySelector('div[role="tree"] input').checkedKeys = [item];
      }
    }

    //将节点数据，绑定到树节点上
    _treeNode.treeNodeData = item;
    /* 将子集数量，及子集选中数量，绑定到dom */
    if (checkable) {
      _treeNode.treeChildCount = _treeNode.treeNodeData[childFieldName]
        ? _treeNode.treeNodeData[childFieldName].length
        : 0;
      _treeNode.treeCheckedChild = 0;
    }

    //展开，或关闭节点操作
    _treeNode
      .querySelector("span.light-tree-switcher")
      .addEventListener("click", (event) => {
        event.stopPropagation();
        let _this = event.currentTarget;
        //如果当前是关闭时，操作
        if (_this.classList.contains("light-tree-switcher_close")) {
          if (onExpand && onExpand instanceof Function) {
            onExpand(_treeNode);
          }
          let childData = _treeNode.treeNodeData[childFieldName] || [];
          let childNode = [];
          //如果存在子节点时
          if (childData && childData.length > 0) {
            childData.forEach((item) => {
              childNode.push(
                _returnTreeNodeElement({
                  item,
                  checkable, //是否显示多选框
                  checkedKeys, //默认选中的值
                  onExpand, //节点展开事件
                  onSelect, //节点选中事件
                  onChecked, //多选框选中事件
                  textFieldName, //界面展示的字段
                  valueFieldName, //code映射的字段
                  childFieldName, //子集映射的字段
                  checkedFieldName,
                  checkedChild,
                  checkboxDisableFieldName,
                  expandFieldName,
                  parentNode: _treeNode,
                  _tree,
                })
              );
            });

            let refElement = _treeNode.nextSibling;
            childNode.forEach((item) => {
              if (refElement) {
                _tree
                  .querySelector(".light-tree-list-holder-inner")
                  .insertBefore(item, refElement);
              } else {
                _tree
                  .querySelector(".light-tree-list-holder-inner")
                  .appendChild(item);
              }
              if (item.treeNodeData[expandFieldName]) {
                item.querySelector(".light-tree-switcher").click();
              }
            });
            /* 切换展开样式 */
            _treeNode.classList.add("light-tree-treenode-switcher-open");
            _treeNode.classList.remove("light-tree-treenode-switcher-close");
            _treeNode
              .querySelector(".light-tree-switcher")
              .classList.add("light-tree-switcher_open");
            _treeNode
              .querySelector(".light-tree-switcher")
              .classList.remove("light-tree-switcher_close");
            _treeNode
              .querySelector(".light-tree-switcher")
              .classList.add("light-tree-node-content-wrapper-open");
            _treeNode
              .querySelector(".light-tree-switcher")
              .classList.remove("light-tree-node-content-wrapper-close");
          } else {
            if (_treeNode.querySelector(".light-tree-indent")) {
              _treeNode.querySelector(".light-tree-switcher").remove();
              _treeNode
                .querySelector(".light-tree-indent-unit-start")
                .classList.remove("light-tree-indent-unit-start");
              _treeNode
                .querySelector(".light-tree-indent")
                .appendChild(
                  window.lightDesign.parseHTML(
                    '<span class="light-tree-indent-unit light-tree-indent-unit-start"></span>'
                  )
                );
            } else {
              _treeNode.querySelector(".light-tree-switcher").replaceWith(
                window.lightDesign.parseHTML(
                  `<span aria-hidden="true" class="light-tree-indent">
                      <span class="light-tree-indent-unit light-tree-indent-unit-start"></span>
                    </span>`
                )
              );
            }
          }
        } else {
          /* 切换展开样式 */
          _treeNode.classList.add("light-tree-treenode-switcher-close");
          _treeNode.classList.remove("light-tree-treenode-switcher-open");
          _treeNode
            .querySelector(".light-tree-switcher")
            .classList.add("light-tree-switcher_close");
          _treeNode
            .querySelector(".light-tree-switcher")
            .classList.remove("light-tree-switcher_open");
          _treeNode
            .querySelector(".light-tree-switcher")
            .classList.add("light-tree-node-content-wrapper-close");
          _treeNode
            .querySelector(".light-tree-switcher")
            .classList.remove("light-tree-node-content-wrapper-open");
          /* 删除子节点 */
          let childData = _treeNode.treeNodeData[childFieldName] || [];
          deleteElementHandle({
            data: childData,
            valueFieldName,
            childFieldName,
            _tree,
          });
        }
      });

    //select事件
    _treeNode
      .querySelector("span.light-tree-node-content-wrapper")
      .addEventListener("click", (event) => {
        event.stopPropagation();
        let _this = event.currentTarget;
        if (_this.classList.contains("light-tree-node-selected")) {
          _this.classList.remove("light-tree-node-selected");
          _this
            .closest("div.light-tree-treenode")
            .classList.remove("light-tree-treenode-selected");
          if (onSelect && onSelect instanceof Function) {
            onSelect(_treeNode, false);
          }
          return;
        }

        let selectElems = _tree.querySelectorAll(
          ".light-tree-treenode-selected"
        );
        selectElems.forEach((item) => {
          item.classList.remove("light-tree-treenode-selected");
          item
            .querySelector(".light-tree-node-content-wrapper")
            .classList.remove("light-tree-node-selected");
        });
        _this.classList.add("light-tree-node-selected");
        _this
          .closest("div.light-tree-treenode")
          .classList.add("light-tree-treenode-selected");
        if (onSelect && onSelect instanceof Function) {
          onSelect(_treeNode, true);
        }
      });

    //checkbox事件
    if (_treeNode.querySelector(".light-tree-checkbox")) {
      _treeNode
        .querySelector(".light-tree-checkbox")
        .addEventListener("click", (event) => {
          event.stopPropagation();
          let _this = event.currentTarget;
          if (_this.classList.contains("light-tree-checkbox-disabled")) {
            return false;
          }
          if (_this.classList.contains("light-tree-checkbox-checked")) {
            checkboxHandle({
              element: _this,
              checked: "inchecked",
              childFieldName,
              valueFieldName,
              checkedChild,
            });
          } else {
            if (onChecked && onChecked instanceof Function) {
              onChecked(_treeNode);
            }
            checkboxHandle({
              element: _this,
              checked: "checked",
              childFieldName,
              valueFieldName,
              checkedChild,
            });
          }
        });
    }

    //如果存在上级节点时，需要判断当前节点是否被选中
    if (
      parentNode &&
      parentNode instanceof HTMLElement &&
      _treeNode.querySelector(".light-tree-checkbox")
    ) {
      if (parentNode.treeCheckedChild === parentNode.treeChildCount) {
        _treeNode
          .querySelector(".light-tree-checkbox")
          .classList.add("light-tree-checkbox-checked");
        _treeNode.classList.add("light-tree-treenode-checkbox-checked");
        _treeNode.treeCheckedChild = _treeNode.treeNodeData[childFieldName]
          ? _treeNode.treeNodeData[childFieldName].length
          : 0;
      }
    }
    return _treeNode;
  }

  //生成树的节点
  function _renderTreeNode(params) {
    let {
      checkable, //是否显示多选框
      checkedKeys, //默认选中的值
      onExpand, //节点展开事件
      onSelect, //节点选中事件
      onChecked, //多选框选中事件
      treeData, //数据源
      textFieldName, //界面展示的字段
      valueFieldName, //code映射的字段,
      childFieldName, //子集映射的字段
      checkedFieldName, //是否选中映射的字段
      checkedChild,
      checkboxDisableFieldName,
      expandFieldName, //是否展开映射的字段
      _tree, //树dom
    } = params;

    if (treeData.length === 0) {
      return false;
    }

    //将数据源绑定在树上
    _tree.treeData = treeData;

    //开始循环生成树
    treeData.forEach((item) => {
      let treeNode = _returnTreeNodeElement({
        item,
        checkable, //是否显示多选框
        checkedKeys, //默认选中的值
        onExpand, //节点展开事件
        onSelect, //节点选中事件
        onChecked, //多选框选中事件
        textFieldName, //界面展示的字段
        valueFieldName, //code映射的字段
        childFieldName, //子集映射的字段
        checkedFieldName, //是否选中映射的字段
        checkedChild,
        checkboxDisableFieldName, //checkbox是否可选映射字段
        expandFieldName, //是否展开映射的字段
        _tree,
      });
      _tree
        .querySelector(".light-tree-list-holder-inner")
        .appendChild(treeNode);
      if (
        item[checkedFieldName] &&
        !treeNode.querySelector(".light-tree-checkbox-checked")
      ) {
        treeNode.querySelector(".light-tree-checkbox").click();
      }

      if (item[expandFieldName]) {
        treeNode.querySelector(".light-tree-switcher").click();
      }
    });
  }

  //生成树
  function _renderTree(params) {
    let {
      checkable, //是否显示多选框
      checkedKeys, //默认选中的值
      onExpand, //节点展开事件
      onSelect, //节点选中事件
      onChecked, //多选框选中事件
      treeData, //数据源
      textFieldName, //界面展示的字段
      valueFieldName, //code映射的字段
      childFieldName, //子集映射的字段
      checkedFieldName, //是否选中映射的字段
      checkedChild,
      checkboxDisableFieldName,
      expandFieldName, //是否展开映射的字段
      _tree, //树dom
    } = params;

    treeData = getTreeData(treeData);

    _renderTreeNode({
      checkable, //是否显示多选框
      checkedKeys, //默认选中的值
      onExpand, //节点展开事件
      onSelect, //节点选中事件
      onChecked, //多选框选中事件
      treeData, //数据源
      textFieldName, //界面展示的字段
      valueFieldName, //code映射的字段
      childFieldName, //子集映射的字段
      checkedFieldName, //是否选中映射的字段
      checkedChild,
      checkboxDisableFieldName,
      expandFieldName, //是否展开映射的字段
      _tree, //树dom
    });
  }

  /**
   *
   * @param {*} props {
                        id:string = '',
                        checkable:boolean = false(是否启用多选框),
                        checkedKeys:[string](选中的节点),
                        onExpand:function(dataItem,event),
                        onSelect:function(dataItem,event),
                        onChecked:function(dataItem,event),
                        treeData:[{}],
                        textFieldName = "code",
                        valueFieldName = "name",
                        childFieldName = "childs"
                        }
   */
  function Tree(props) {
    const {
      id = "",
      checkable = false,
      checkedKeys = [],
      onExpand,
      onSelect,
      onChecked,
      treeData = [],
      textFieldName = "code",
      valueFieldName = "name",
      childFieldName = "childs",
      checkedFieldName = "checked",
      checkedChild = true,
      checkboxDisableFieldName = "checkDisabled",
      expandFieldName = "isExpand",
    } = props;

    let _tree = window.lightDesign.parseHTML(
      `<div id="${id}" class="light-tree light-tree-icon-hide">
        <div role="tree"><input tabindex="0" value="" style="width: 0px; height: 0px; display: flex; overflow: hidden; opacity: 0; border: 0px; padding: 0px; margin: 0px;"></div>
        <div class="light-tree-list">
          <div>
            <div class="light-tree-list-holder-inner" style="display: flex; flex-direction: column;"></div>
          </div>
        </div>
      </div>`
    );

    _renderTree({
      checkable,
      checkedKeys,
      onExpand,
      onSelect,
      onChecked,
      treeData,
      textFieldName,
      valueFieldName,
      childFieldName,
      checkedFieldName,
      checkedChild,
      expandFieldName,
      checkboxDisableFieldName,
      _tree,
    });

    _tree.lightTree = {
      event: {
        add: (element, data) => {
          if (!element.treeNodeData[childFieldName]) {
            element.treeNodeData[childFieldName] = [];
          }
          element.treeNodeData[childFieldName].push(data);
          if (
            element.classList.contains("light-tree-treenode-checkbox-checked")
          ) {
            element.treeCheckedChild =
              element.treeNodeData[childFieldName].length;
          }
          element.treeChildCount = element.treeNodeData[childFieldName].length;
          //如果当前节点时展开状态
          if (element.classList.contains("light-tree-treenode-switcher-open")) {
            let newElement = _returnTreeNodeElement({
              item: data,
              checkable, //是否显示多选框
              checkedKeys, //默认选中的值
              onExpand, //节点展开事件
              onSelect, //节点选中事件
              onChecked, //多选框选中事件
              textFieldName, //界面展示的字段
              valueFieldName, //code映射的字段
              childFieldName, //子集映射的字段
              checkedFieldName, //是否选中映射的字段
              checkboxDisableFieldName,
              checkedChild,
              expandFieldName, //是否展开映射的字段
              parentNode: element,
              _tree,
            });
            let refElement = element.nextSibling;
            if (refElement) {
              _tree
                .querySelector(".light-tree-list-holder-inner")
                .insertBefore(newElement, refElement);
            } else {
              _tree
                .querySelector(".light-tree-list-holder-inner")
                .appendChild(newElement);
            }
          }
        },
      },
    };

    return _tree;
  }

  HTMLElement.prototype.lightTree = function (props) {
    //如果没有设置id，则使用当前dom的id，或者guid
    if (!props.id) {
      props.id = this.id || window.lightDesign.guid();
    }
    this.replaceWith(Tree(props));
  };
})();
