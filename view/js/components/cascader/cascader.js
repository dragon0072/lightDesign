(() => {
  const _cascaderHiddenClass = "light-cascader-menus-hidden";
  const _cascaderActivedClass = "light-cascader-menu-item-active";

  //根据当前id，获取父级id
  function findParentsById(arr, id, valueFieldName, childrenFieldName) {
    var parentIds = [],
      index = 0,
      hasParentId = (function loop(arr, index) {
        return arr.some(item => {
          if (item[valueFieldName] === id) {
            parentIds = parentIds.slice(0, index);
            return true;
          } else if (Array.isArray(item[childrenFieldName])) {
            parentIds[index] = item[valueFieldName];
            return loop(item[childrenFieldName], index + 1);
          } else {
            return false;
          }
        });
      })(arr, index);
    return hasParentId ? parentIds : [];
  }

  function toggleBlur(props) {
    const { _guid, isRemove } = props;
    if (isRemove) {
      if (document.querySelector(`div[data-blurid="${_guid}"]`)) {
        document.querySelector(`div[data-blurid="${_guid}"]`).remove();
      }
      document
        .getElementById(_guid)
        .querySelector(".light-cascader-menus")
        .classList.add(_cascaderHiddenClass);
      return;
    }
    let blur = window.lightDesign.parseHTML(
      `<div data-blurid="${_guid}" style="position:fixed;top:0;left:0;width:${window.innerWidth}px;height:${window.innerHeight}px;opacity:0;z-index:1001;"></div>`
    );
    blur.addEventListener("click", event => {
      event.stopPropagation();
      document
        .getElementById(_guid)
        .querySelector(".light-cascader-menus")
        .classList.add(_cascaderHiddenClass);
      blur.remove();
    });
    document.body.appendChild(blur);
  }

  function _returnItem(props) {
    const {
      item,
      textFieldName,
      valueFieldName,
      childrenFieldName,
      onChange,
      _cascaderList,
      _cascader
    } = props;
    let liElem = window.lightDesign.parseHTML(
      `<li data-value="${
        item[valueFieldName]
      }" class="light-cascader-menu-item ${
        item[childrenFieldName] && item[childrenFieldName].length > 0
          ? "light-cascader-menu-item-expand"
          : ""
      }" title="${item[textFieldName]}" role="menuitem">${item[textFieldName]}
      ${
        item[childrenFieldName] && item[childrenFieldName].length > 0
          ? `<span class="light-cascader-menu-item-expand-icon">
              <span role="img" aria-label="right" class="anticon anticon-right">
                <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="right" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z"></path>
                </svg>
              </span>
            </span>`
          : ""
      }
      </li>`
    );

    liElem.cascaderChildData = item[childrenFieldName] || [];

    liElem.addEventListener("click", event => {
      event.stopPropagation();
      let _this = event.currentTarget;
      _this
        .closest("ul")
        .querySelectorAll("li")
        .forEach(item => {
          item.classList.remove(_cascaderActivedClass);
        });
      _this.classList.add(_cascaderActivedClass);
      if (onChange && typeof onChange === "function") {
        onChange(item[valueFieldName]);
      }
      if (_this.cascaderChildData.length === 0) {
        if (
          _this.closest("ul").nextSibling &&
          _this.closest("ul").nextSibling.nodeName.toLowerCase() === "ul"
        ) {
          _this.closest("ul").nextSibling.remove();
        }
        // _cascaderList
        //   .querySelector(".light-cascader-menus")
        //   .classList.add(_cascaderHiddenClass);
        toggleBlur({ _guid: _cascaderList.id, isRemove: true });
      }
      _cascader.selectValue = [];
      _cascaderList
        .querySelectorAll(`.${_cascaderActivedClass}`)
        .forEach(item => {
          _cascader.selectValue.push(item.getAttribute("data-value"));
        });
      _cascader.querySelector(".light-cascader-picker-label").innerText =
        item[textFieldName];

      renderNextSiblingCascaderItem({
        dataSouce: _this.cascaderChildData,
        textFieldName,
        valueFieldName,
        childrenFieldName,
        onChange,
        _cascaderList,
        _cascader,
        _this
      });
    });
    return liElem;
  }

  function renderNextSiblingCascaderItem(props) {
    const {
      dataSouce,
      textFieldName,
      valueFieldName,
      childrenFieldName,
      onChange,
      _cascaderList,
      _cascader,
      _this
    } = props;

    if (!dataSouce || dataSouce.length === 0) {
      return;
    }

    let ul = window.lightDesign.parseHTML(
      `<ul class="light-cascader-menu"></ul>`
    );
    if (
      _this.closest("ul").nextSibling &&
      _this.closest("ul").nextSibling.nodeName.toLowerCase() === "ul"
    ) {
      _this.closest("ul").nextSibling.remove();
    }

    dataSouce.forEach(item => {
      let liElem = _returnItem({
        item,
        textFieldName,
        valueFieldName,
        childrenFieldName,
        onChange,
        _cascaderList,
        _cascader
      });
      ul.appendChild(liElem);
    });
    _this.closest("div").appendChild(ul);
  }

  function renderCascaderLiItem(props) {
    const {
      dataSource,
      textFieldName,
      valueFieldName,
      childrenFieldName,
      onChange,
      _cascaderList,
      _cascader
    } = props;

    dataSource.forEach(item => {
      let liElem = _returnItem({
        item,
        textFieldName,
        valueFieldName,
        childrenFieldName,
        onChange,
        _cascaderList,
        _cascader
      });
      _cascaderList.querySelector(".light-cascader-menu").appendChild(liElem);
    });
  }

  function renderCascaderList(props) {
    const {
      dataSource,
      textFieldName,
      valueFieldName,
      childrenFieldName,
      onChange,
      _cascader,
      _guid
    } = props;

    const left = _cascader.getBoundingClientRect().left;
    const top =
      _cascader.getBoundingClientRect().top + _cascader.offsetHeight + 3;

    let _cascaderList = window.lightDesign.parseHTML(
      `<div id="${_guid}" style="position: absolute; top: 0px; left: 0px; width: 100%;">
        <div>
          <div class="light-cascader-menus light-cascader-menus-placement-bottomLeft ${_cascaderHiddenClass}" style="left: ${left}px; top: ${top}px;">
            <div><ul class="light-cascader-menu"></ul></div>
          </div>
        </div>
      </div>`
    );

    renderCascaderLiItem({
      dataSource,
      textFieldName,
      valueFieldName,
      childrenFieldName,
      onChange,
      _cascaderList,
      _cascader
    });

    document.body.appendChild(_cascaderList);
  }

  /**
   *
   * @param {*} props
   */
  function Cascader(props) {
    const {
      id,
      allowClear,
      dataSource = [],
      onChange,
      placeholder = "",
      textFieldName = "name",
      valueFieldName = "code",
      childrenFieldName = "children"
    } = props;
    const _guid = window.lightDesign.guid();
    let _cascader = window.lightDesign.parseHTML(
      `<span id="${id}" class="light-cascader-picker" tabindex="0">
          <span class="light-cascader-picker-label"></span>
          <input tabindex="-1" placeholder="${placeholder}" class="light-input light-cascader-input " readonly="" autocomplete="off" type="text" value="">
          <span role="img" aria-label="down" class="anticon anticon-down light-cascader-picker-arrow">
            <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="down" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path>
            </svg>
          </span>
        </span>`
    );
    _cascader.selectValue = [];

    _cascader.addEventListener("click", event => {
      if (!document.getElementById(_guid)) {
        renderCascaderList({
          dataSource,
          textFieldName,
          valueFieldName,
          childrenFieldName,
          onChange,
          _cascader,
          _guid
        });
        document
          .getElementById(_guid)
          .querySelector(".light-cascader-menus")
          .classList.remove(_cascaderHiddenClass);
        toggleBlur({ _guid });
        return;
      }

      toggleBlur({ _guid });

      if (
        document
          .getElementById(_guid)
          .querySelector(".light-cascader-menus")
          .classList.contains(_cascaderHiddenClass)
      ) {
        document
          .getElementById(_guid)
          .querySelector(".light-cascader-menus")
          .classList.remove(_cascaderHiddenClass);
      } else {
        document
          .getElementById(_guid)
          .querySelector(".light-cascader-menus")
          .classList.add(_cascaderHiddenClass);
      }
    });

    _cascader.lightSelect = {
      event: {
        selectValue(values) {
          if (!document.getElementById(_guid)) {
            renderCascaderList({
              dataSource,
              textFieldName,
              valueFieldName,
              childrenFieldName,
              onChange,
              _cascader,
              _guid
            });
          }
          if (values && values instanceof Array && values.length > 0) {
            values.forEach(item => {
              if (
                document
                  .getElementById(_guid)
                  .querySelector(`[data-value="${item}"]`)
              ) {
                document
                  .getElementById(_guid)
                  .querySelector(`[data-value="${item}"]`)
                  .click();
              }
            });
            _cascader.selectValue = values;
          } else if (typeof values === "string" && !values.isNullOrEmpty()) {
            let selectValue = findParentsById(
              dataSource,
              values,
              valueFieldName,
              childrenFieldName
            );
            selectValue.push(values);
            selectValue.forEach(item => {
              if (
                document
                  .getElementById(_guid)
                  .querySelector(`[data-value="${item}"]`)
              ) {
                document
                  .getElementById(_guid)
                  .querySelector(`[data-value="${item}"]`)
                  .click();
              }
            });
            _cascader.selectValue = selectValue;
          }
        }
      }
    };
    return _cascader;
  }

  HTMLElement.prototype.lightCascader = function(props) {
    //如果没有设置id，则使用当前dom的id，或者guid
    if (!props.id) {
      props.id = this.id || window.lightDesign.guid();
    }
    this.replaceWith(Cascader(props));
  };
})();
