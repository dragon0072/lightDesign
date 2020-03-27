(() => {
  const _successIcon = `<span role="img" aria-label="check-circle" class="anticon anticon-check-circle light-notification-notice-icon light-notification-notice-icon-success">
        <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="check-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
            <path d="M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8a31.8 31.8 0 0051.7 0l210.6-292c3.9-5.3.1-12.7-6.4-12.7z"></path>
            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
        </svg>
    </span>`;
  const _errorIcon = `<span role="img" aria-label="close-circle" class="anticon anticon-close-circle light-notification-notice-icon light-notification-notice-icon-error">
        <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="close-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
            <path d="M685.4 354.8c0-4.4-3.6-8-8-8l-66 .3L512 465.6l-99.3-118.4-66.1-.3c-4.4 0-8 3.5-8 8 0 1.9.7 3.7 1.9 5.2l130.1 155L340.5 670a8.32 8.32 0 00-1.9 5.2c0 4.4 3.6 8 8 8l66.1-.3L512 564.4l99.3 118.4 66 .3c4.4 0 8-3.5 8-8 0-1.9-.7-3.7-1.9-5.2L553.5 515l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z"></path>
            <path d="M512 65C264.6 65 64 265.6 64 513s200.6 448 448 448 448-200.6 448-448S759.4 65 512 65zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
        </svg>
    </span>`;
  const _infoIcon = `<span role="img" aria-label="info-circle" class="anticon anticon-info-circle light-notification-notice-icon light-notification-notice-icon-info">
        <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="info-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
            <path d="M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"></path>
        </svg>
    </span>`;
  const _warningIcon = `<span role="img" aria-label="exclamation-circle" class="anticon anticon-exclamation-circle light-notification-notice-icon light-notification-notice-icon-warning">
        <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="exclamation-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
            <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
            <path d="M464 688a48 48 0 1096 0 48 48 0 10-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z"></path>
        </svg>
    </span>`;
  /**
   * 返回提示图标
   * @param {string} type 类型（默认：info,可选：success,error,warning）
   */
  function _returnNoticIcon(type = "info") {
    switch (type.toLowerCase()) {
      case "success":
        return _successIcon;
        break;
      case "error":
        return _errorIcon;
        break;
      case "warning":
        return _warningIcon;
        break;
      default:
        return _infoIcon;
        break;
    }
  }

  function lightNotification(props) {
    const {
      type = "",
      message = !type.isNullOrEmpty()
        ? window.lightDesign.formatMessage(
            `notification-message-${type.toLowerCase()}`
          )
        : "",
      description,
      onClose,
      placement = "topRight",
      duration = 3
    } = props;

    if (!document.querySelector(".light-notification")) {
      document.body.appendChild(
        window.lightDesign.parseHTML(
          `<div>
                <div class="light-notification light-notification-topRight" style="right: 0px; top: 24px; bottom: auto;">
                    <span>
                    </span>
                </div>
              </div>`
        )
      );
    }

    let _notification = window.lightDesign.parseHTML(
      `<div class="light-notification-notice light-notification-notice-closable">
        <div class="light-notification-notice-content">
            <div class="${
              !type.isNullOrEmpty() ? "light-notification-notice-with-icon" : ""
            }">
            ${!type.isNullOrEmpty() ? _returnNoticIcon(type) : ""}
                <div class="light-notification-notice-message">
                    ${message || ""}
                </div>
                <div class="light-notification-notice-description">
                    ${description || ""}
                </div>
            </div>
        </div>
        <a tabindex="0" class="light-notification-notice-close">
            <span class="light-notification-close-x">
                <span role="img" aria-label="close" class="anticon anticon-close light-notification-close-icon">
                    <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                        <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
                    </svg>
                </span>
            </span>
        </a>
       </div>`
    );

    _notification
      .querySelector(".light-notification-notice-close")
      .addEventListener("click", event => {
        let isSuccess = true;
        if (onClose && typeof onClose === "function") {
          isSuccess = onClose();
        }
        if (isSuccess === undefined || isSuccess) {
          _notification.classList.add("light-notification-fade-leave");
          _notification.classList.add("light-notification-fade-leave-active");
          setTimeout(() => {
            _notification.remove();
          }, 200);
        }
      });

    if (
      document.querySelector(".light-notification span").childElementCount > 0
    ) {
      document
        .querySelector(".light-notification span")
        .insertBefore(
          _notification,
          document.querySelector(".light-notification span div:first-child")
        );
    } else {
      document
        .querySelector(".light-notification span")
        .appendChild(_notification);
    }

    if (duration > 0) {
      setTimeout(() => {
        let isSuccess = true;
        if (onClose && typeof onClose === "function") {
          isSuccess = onClose();
        }
        if (isSuccess === undefined || isSuccess) {
          _notification.classList.add("light-notification-fade-leave");
          _notification.classList.add("light-notification-fade-leave-active");
          setTimeout(() => {
            _notification.remove();
          }, 200);
        }
      }, duration * 1000);
    }
  }

  window.lightNotification = lightNotification;
})();
