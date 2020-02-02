(() => {
  "use strict";
  function _renderSelectItem(id, data, text, value, defaultValue, selectDom) {
    let inputDom = window.lightDesign
      .parseHTML(`<div class="light-select-selection__rendered">
                    <div class="light-select-selection-selected-value" title="" style="display: block; opacity: 1;"></div>
                  </div>`);

    let optionsDom = window.lightDesign.parseHTML(
      `<div class="light-select-dropdown light-select-dropdown--single light-select-dropdown-placement-bottomLeft light-select-dropdown-hidden" style="width: 100%; left: 0; top: 35px;">
        <div id="${id}" style="overflow: auto; transform: translateZ(0px);">
          <ul role="listbox" class="light-select-dropdown-menu light-select-dropdown-menu-root light-select-dropdown-menu-vertical" tabindex="0"></ul>
        </div>
      </div>`
    );

    data.forEach(item => {
      let liHtml = "<li></li>";
      if (item[value] === defaultValue) {
        liHtml = `<li role="option" unselectable="on" class="light-select-dropdown-menu-item light-select-dropdown-menu-item-selected" aria-selected="true" style="user-select: none;">${item[text]}</li>`;
        inputDom.querySelector(".light-select-selection-selected-value").title =
          item[text];
        inputDom.querySelector(
          ".light-select-selection-selected-value"
        ).innerText = item[text];
      } else {
        liHtml = `<li role="option" unselectable="on" class="light-select-dropdown-menu-item" aria-selected="false" style="user-select: none;">${item[text]}</li>`;
      }
      let liItem = window.lightDesign.parseHTML(liHtml);
      liItem.selectValue = item[value];
      liItem.selectElementId = id;
      optionsDom.querySelector("ul").appendChild(liItem);
    });
    selectDom
      .querySelector(".light-select-selection")
      .insertBefore(inputDom, selectDom.querySelector(".light-select-arrow"));
    selectDom.appendChild(optionsDom);
    selectDom.selectValue = defaultValue || "";
  }

  function _allowClear(dom) {
    let clearDom = window.lightDesign.parseHTML(
      `<span class="light-select-selection__clear" unselectable="on" style="user-select: none;"><i aria-label="icon: close-circle" class="anticon anticon-close-circle light-select-clear-icon"><svg viewBox="64 64 896 896" focusable="false" class="" data-icon="close-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path></svg></i></span>`
    );

    clearDom.addEventListener("click", event => {
      event.stopPropagation();
      let _this = event.currentTarget;
      if (dom.querySelector(".light-select-selection-selected-value")) {
        dom
          .querySelector(".light-select-selection-selected-value")
          .setAttribute("title", "");
        dom.querySelector(".light-select-selection-selected-value").innerText =
          "";
        if (dom.querySelector(".light-select-selection__placeholder")) {
          dom.querySelector(
            ".light-select-selection__placeholder"
          ).style.display = "block;";
        }
        _this.remove();
      }
    });
    dom
      .querySelector(".light-select-selection")
      .insertBefore(clearDom, dom.querySelector(".light-select-arrow"));
  }

  function _placeholder(dom, placeholder) {
    let placeholderDisplay = "block";
    if (
      dom.querySelector(".light-select-selection-selected-value").title &&
      dom
        .querySelector(".light-select-selection-selected-value")
        .title.replaceSpace() !== ""
    ) {
      placeholderDisplay = "none";
    } else {
      dom.querySelector(".light-select-selection-selected-value").remove();
    }
    let placeholderDom = window.lightDesign.parseHTML(
      `<div unselectable="on" class="light-select-selection__placeholder" style="display: ${placeholderDisplay}; user-select: none;">${placeholder}</div>`
    );
    dom
      .querySelector(".light-select-selection__rendered")
      .appendChild(placeholderDom);
  }

  function _toggleDropDownList(dom) {
    if (!dom.classList.contains("light-select-open")) {
      let blurDom = window.lightDesign.parseHTML(
        `<div id="${dom
          .querySelector(".light-select-selection")
          .getAttribute(
            "aria-controls"
          )}" style="position:absolute;top:0;left:0;width:100%;height:100%;opacity:0;z-index:0;"></div>`
      );
      blurDom.addEventListener("click", event => {
        event.stopPropagation();
        _toggleDropDownList(dom);
        event.currentTarget.remove();
      });
      document.body.appendChild(blurDom);
      dom.classList.add("light-select-open", "light-select-focused");
      dom
        .querySelector(".light-select-selection")
        .setAttribute("aria-expanded", "true");
      dom
        .querySelector(".light-select-dropdown")
        .classList.remove("light-select-dropdown-hidden");
    } else {
      dom.classList.remove("light-select-open", "light-select-focused");
      dom
        .querySelector(".light-select-selection")
        .setAttribute("aria-expanded", "false");
      dom
        .querySelector(".light-select-dropdown")
        .classList.add("light-select-dropdown-hidden");
    }
  }

  /**
   * select控件
   * @param {json} props {
      allowClear : boolean = false,
      dataSource: [json] / json{url,options,requestEnd(data)},
      onSelect : function(string)
      placeholder : string,
      style : string,
      textFileName : string = "name",
      value : string,
      valueFiledName : string = "code"
    }
   */
  function Select(props) {
    const {
      allowClear = false,
      dataSource = [],
      id,
      onSelect,
      placeholder,
      style = "",
      textFiledName = "name",
      value,
      valueFiledName = "code"
    } = props;
    const _domId = window.lightDesign.guid();

    let domData = dataSource;
    if (!dataSource.length && dataSource.url) {
      let res = window.lightDesign.httpGet(dataSource.url, dataSource.options),
        data = [];
      if (typeof dataSource.requestEnd === "function") {
        data = dataSource.requestEnd(JSON.stringify(res.responseText));
      }
      domData = data;
    }

    let selectDom = window.lightDesign.parseHTML(
      `<div id="${id}" class="light-select light-select-enabled" style="${style}">
        <div class="light-select-selection light-select-selection--single" aria-controls="${_domId}" aria-expanded="false" tabindex="0">
          <span class="light-select-arrow" unselectable="on" style="user-select: none;">
            <i aria-label="图标: down" class="anticon anticon-down light-select-arrow-icon">
              <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="down" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path>
              </svg>
            </i>
          </span>
        </div>
      </div>`
    );

    _renderSelectItem(
      _domId,
      domData,
      textFiledName,
      valueFiledName,
      value,
      selectDom
    );

    // TODO allowClear待修复
    if (allowClear) {
      selectDom.classList.add("light-select-allow-clear");
      _allowClear(selectDom);
    }

    if (typeof placeholder === "string" && placeholder.replaceSpace() !== "") {
      _placeholder(selectDom, placeholder);
    }

    selectDom.addEventListener("click", event => {
      let _this = event.currentTarget;
      _toggleDropDownList(_this);
    });

    selectDom
      .querySelectorAll("li.light-select-dropdown-menu-item")
      .forEach(item => {
        item.addEventListener("click", event => {
          event.stopPropagation();
          let _this = event.currentTarget;
          if (selectDom.querySelector(".light-select-selection__placeholder")) {
            selectDom.querySelector(
              ".light-select-selection__placeholder"
            ).style.display = "none";
          }
          if (
            !selectDom.querySelector(".light-select-selection-selected-value")
          ) {
            selectDom
              .querySelector(".light-select-selection__rendered")
              .appendChild(
                window.lightDesign.parseHTML(
                  `<div class="light-select-selection-selected-value" title="${_this.innerText}" style="display: block; opacity: 1;">${_this.innerText}</div>`
                )
              );
          } else {
            selectDom.querySelector(
              ".light-select-selection-selected-value"
            ).title = _this.innerText;
            selectDom.querySelector(
              ".light-select-selection-selected-value"
            ).innerText = _this.innerText;
          }
          selectDom.selectValue = _this.selectValue;
          _toggleDropDownList(selectDom);
          if (onSelect && typeof onSelect === "function") {
            onSelect(_this.selectValue);
          }
        });
      });

    return selectDom;
  }

  HTMLElement.prototype.lightSelect = function(props) {
    this.replaceWith(Select(props));
  };
})();
