(() => {
  //modal关闭动作
  function _modalCloseHandle(params, _modal) {
    const { destroyOnClose, afterClose } = params;
    if (destroyOnClose) {
      let _id = _modal.id;
      _modal.replaceWith(
        window.lightDesign.parseHTML(`<div id="${_id}"></div>`)
      );
    } else {
      _modal
        .querySelector(".light-modal-mask")
        .classList.add(".light-modal-mask-hidden");
      _modal.querySelector(".light-modal-wrap").style.display = "none";
    }

    if (afterClose && typeof afterClose === "function") {
      afterClose(_modal);
    }
  }

  //生成标题
  function _renderTitle(title, _modal) {
    if (typeof title === "string" && !title.isNullOrEmpty()) {
      _modal.querySelector(
        ".light-modal-header"
      ).innerHTML = `<div class="light-modal-title">${title}</div>`;
    } else {
      _modal.querySelector(".light-modal-header").remove();
    }
  }

  //生成底部按钮
  function _renderFooter(params, _modal) {
    const {
      footer,
      okText,
      onOk,
      cancelText,
      onCancel,
      destroyOnClose,
      afterClose,
    } = params;
    if (typeof footer === "boolean" && !footer) {
      _modal.querySelector(".light-modal-footer").remove();
      return;
    } else if (typeof footer === "boolean" && footer) {
      let elems = _modal.querySelector(".light-modal-footer");
      elems.appendChild(
        window.lightDesign.parseHTML(
          `<div>
              <button type="button" class="light-btn btn-cancel"><span>${cancelText}</span></button>
              <button type="button" class="light-btn light-btn-primary btn-Ok"><span>${okText}</span></button>
          </div>`
        )
      );
      elems.querySelector(".btn-cancel").addEventListener("click", (event) => {
        let closeSuccess = true;
        if (onCancel && typeof onCancel === "function") {
          closeSuccess = onCancel(_modal);
          closeSuccess = closeSuccess === undefined ? true : closeSuccess;
        }
        if (closeSuccess)
          _modalCloseHandle({ destroyOnClose, afterClose }, _modal);
      });
      elems
        .querySelector(".btn-Ok")
        .addEventListener("click", async (event) => {
          let okSuccess = true;
          if (onOk && typeof onOk === "function") {
            if (onOk[Symbol.toStringTag] === "AsyncFunction") {
              okSuccess = await onOk(_modal);
            } else {
              okSuccess = onOk(_modal);
            }
            okSuccess = okSuccess === undefined ? true : okSuccess;
          }
          if (okSuccess)
            _modalCloseHandle({ destroyOnClose, afterClose }, _modal);
        });
    } else if (typeof footer === "object" && footer instanceof HTMLElement) {
      _modal.querySelector(".light-modal-footer").appendChild(footer);
    }
  }

  //生成弹窗主体内容
  function _renderContent(content, _modal) {
    if (typeof content === "string") {
      _modal.querySelector(".light-modal-body").innerHTML = content;
    } else {
      _modal.querySelector(".light-modal-body").appendChild(content);
    }
  }

  function Modal(props) {
    const {
      id = "",
      afterClose,
      bodyStyle = {},
      centered = true,
      destroyOnClose = true,
      footer = true,
      title = "",
      content = "",
      okText = window.lightDesign.formatMessage("modal-button-success"),
      cancelText = window.lightDesign.formatMessage("modal-button-cancel"),
      onOk,
      onCancel,
      width = "520px",
    } = props;

    let _modal = window.lightDesign.parseHTML(
      `<div id="${id}">
          <div class="light-modal-root">
              <div class="light-modal-mask"></div>
              <div tabindex="-1" class="light-modal-wrap ${
                centered ? "light-modal-centered" : ""
              }" role="dialog" aria-labelledby="rcDialogTitle1">
                  <div role="document" class="light-modal" style="width: ${width}; transform-origin: -428px -13px;">
                      <div tabindex="0" aria-hidden="true" style="width: 0px; height: 0px; overflow: hidden;"></div>
                      <div class="light-modal-content">
                          <button type="button" aria-label="Close" class="light-modal-close">
                              <span class="light-modal-close-x">
                                  <i aria-label="图标: close" class="anticon anticon-close light-modal-close-icon">
                                      <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                          <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z">
                                          </path>
                                      </svg>
                                  </i>
                              </span>
                          </button>
                          <div class="light-modal-header">
                          </div>
                          <div class="light-modal-body">
                          </div>
                          <div class="light-modal-footer">
                          </div>
                      </div>
                      <div tabindex="0" aria-hidden="true" style="width: 0px; height: 0px; overflow: hidden;"></div>
                  </div>
              </div>
          </div>
      </div>`
    );

    //生成标题
    _renderTitle(title, _modal);

    //生成底部按钮
    _renderFooter(
      {
        footer,
        okText,
        onOk,
        cancelText,
        onCancel,
        destroyOnClose,
        afterClose,
      },
      _modal
    );

    //生成弹窗主体内容
    _renderContent(content, _modal);

    _modal
      .querySelector(".light-modal-close")
      .addEventListener("click", (event) => {
        _modalCloseHandle({ destroyOnClose, afterClose }, _modal);
      });

    _modal.lightModal = {
      event: {
        close: () => {
          _modalCloseHandle({ destroyOnClose, afterClose }, _modal);
        },
      },
    };

    return _modal;
  }

  HTMLElement.prototype.lightModal = function (props) {
    this.replaceWith(Modal(props));
  };
})();
