(() => {
  "use strict";

  //生成图标
  function _renderIcon(type) {
    if (type === "success") {
      return window.lightDesign.parseHTML(
        `<i aria-label="icon: check-circle" class="anticon anticon-check-circle light-alert-icon"><svg viewBox="64 64 896 896" focusable="false" class="" data-icon="check-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path></svg></i>`
      );
    } else if (type === "error") {
      return window.lightDesign.parseHTML(
        `<i aria-label="icon: close-circle" class="anticon anticon-close-circle light-alert-icon"><svg viewBox="64 64 896 896" focusable="false" class="" data-icon="close-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path></svg></i>`
      );
    } else if (type === "warning") {
      return window.lightDesign.parseHTML(
        `<i aria-label="icon: exclamation-circle" class="anticon anticon-exclamation-circle light-alert-icon"><svg viewBox="64 64 896 896" focusable="false" class="" data-icon="exclamation-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z"></path></svg></i>`
      );
    } else {
      return window.lightDesign.parseHTML(
        `<i aria-label="icon: info-circle" class="anticon anticon-info-circle light-alert-icon"><svg viewBox="64 64 896 896" focusable="false" class="" data-icon="info-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm32 664c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V456c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272zm-32-344a48.01 48.01 0 0 1 0-96 48.01 48.01 0 0 1 0 96z"></path></svg></i>`
      );
    }
  }

  //生成成功提示
  function _renderAlert(
    type,
    message,
    description,
    banner,
    closable,
    showIcon
  ) {
    let dom = window.lightDesign.parseHTML(
      `<div data-show="true" class="light-alert light-alert-${type} light-alert-no-icon"><span class="light-alert-message"></span><span class="light-alert-description"></span></div>`
    );

    if (!message.isNullOrEmpty()) {
      dom.querySelector(".light-alert-message").innerText = message;
    }

    if (!description.isNullOrEmpty()) {
      dom.classList.add("light-alert-with-description");
      dom.querySelector(".light-alert-description").innerText = description;
    }

    if (banner) {
      dom.classList.add("light-alert-banner");
      if (dom.classList.contains("light-alert-no-icon")) {
        dom.classList.remove("light-alert-no-icon");
      }
      if (!dom.querySelector(".anticon")) {
        dom.insertBefore(
          _renderIcon(type),
          dom.querySelector(".light-alert-message")
        );
      }
    }

    if (showIcon) {
      if (dom.classList.contains("light-alert-no-icon")) {
        dom.classList.remove("light-alert-no-icon");
      }
      if (!dom.querySelector(".anticon")) {
        dom.insertBefore(
          _renderIcon(type),
          dom.querySelector(".light-alert-message")
        );
      }
    }

    if (closable) {
      let closeDom = window.lightDesign.parseHTML(
        `<button type="button" class="light-alert-close-icon" tabindex="0"><i aria-label="icon: close" class="anticon anticon-close"><svg viewBox="64 64 896 896" focusable="false" class="" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path></svg></i></button>`
      );
      closeDom.addEventListener("click", event => {
        dom.remove();
      });
      dom.appendChild(closeDom);
    }

    return dom;
  }

  //修改显示信息
  function _modifyMessage(message = "", description = "", dom) {
    dom.querySelector(".light-alert-message").innerText = message;
    dom.querySelector(".light-alert-description").innerText = description;
  }

  /**
   * 警告提示，展现需要关注的信息。
   * @param {*} props {
      banner : boolean = false,
      closable : boolean = false,
      description : string,
      message : string,
      type : string (指定警告提示的样式，有四种选择 success、info、warning、error),
      showIcon = boolean
    }
   */
  function Alert(props) {
    const {
      banner = false,
      closable = false,
      description = "",
      message = "",
      type = "info",
      showIcon = false
    } = props;

    let alertDom = _renderAlert(
      type,
      message,
      description,
      banner,
      closable,
      showIcon
    );

    alertDom.lightAlert.modifyMessage = (message, description) => {
      _modifyMessage(message, description);
    };
    return alertDom;
  }

  HTMLElement.prototype.lightAlert = function(props) {
    this.replaceWith(Alert(props));
  };
})();
