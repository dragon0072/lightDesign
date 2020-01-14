(() => {
  "use strict";

  function _uploadFile(file, action, headers, data, beforeUpload, afterUpload) {
    let isSuccess = true;
    let formData = new FormData();
    formData.append("file", file);
    if (data) {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          formData.append(key, data[key]);
        }
      }
    }
    if (beforeUpload && typeof beforeUpload === "function") {
      isSuccess = beforeUpload(file);
    }

    if (!isSuccess) return false;

    let res = window.lightDesign.httpPost(action, {
      params: formData,
      headers
    });

    if (afterUpload && typeof afterUpload === "function") {
      isSuccess = afterUpload(res);
    }
    return res.status === 200 && isSuccess;
  }

  function _uploadSuccess(uploadDom, file, onDownload, onRemove) {
    let fileDom = window.lightDesign.parseHTML(
      `<div class="">
        <span>
          <div class="light-upload-list-item light-upload-list-item-error light-upload-list-item-list-type-text">
            <div class="light-upload-list-item-info">
              <span>
                <i aria-label="图标: paper-clip" class="anticon anticon-paper-clip">
                  <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="paper-clip" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                    <path d="M779.3 196.6c-94.2-94.2-247.6-94.2-341.7 0l-261 260.8c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0 0 12.7 0l261-260.8c32.4-32.4 75.5-50.2 121.3-50.2s88.9 17.8 121.2 50.2c32.4 32.4 50.2 75.5 50.2 121.2 0 45.8-17.8 88.8-50.2 121.2l-266 265.9-43.1 43.1c-40.3 40.3-105.8 40.3-146.1 0-19.5-19.5-30.2-45.4-30.2-73s10.7-53.5 30.2-73l263.9-263.8c6.7-6.6 15.5-10.3 24.9-10.3h.1c9.4 0 18.1 3.7 24.7 10.3 6.7 6.7 10.3 15.5 10.3 24.9 0 9.3-3.7 18.1-10.3 24.7L372.4 653c-1.7 1.7-2.6 4-2.6 6.4s.9 4.7 2.6 6.4l36.9 36.9a9 9 0 0 0 12.7 0l215.6-215.6c19.9-19.9 30.8-46.3 30.8-74.4s-11-54.6-30.8-74.4c-41.1-41.1-107.9-41-149 0L463 364 224.8 602.1A172.22 172.22 0 0 0 174 724.8c0 46.3 18.1 89.8 50.8 122.5 33.9 33.8 78.3 50.7 122.7 50.7 44.4 0 88.8-16.9 122.6-50.7l309.2-309C824.8 492.7 850 432 850 367.5c.1-64.6-25.1-125.3-70.7-170.9z"></path>
                  </svg>
                </i>
                <a rel="noopener noreferrer" class="light-upload-list-item-name light-upload-list-item-name-icon-count-2" title="${file.name}" href="javascrip:void(0)">${file.name}</a>
                <span class="light-upload-list-item-card-actions ">
                  <a aria-id="download" title="下载文件">
                    <i aria-label="图标: download" title="下载文件" tabindex="-1" class="anticon anticon-download">
                      <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="download" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                        <path d="M505.7 661a8 8 0 0 0 12.6 0l112-141.7c4.1-5.2.4-12.9-6.3-12.9h-74.1V168c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v338.3H400c-6.7 0-10.4 7.7-6.3 12.9l112 141.8zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"></path>
                      </svg>
                    </i>
                  </a>
                  <a aria-id="delete" title="删除文件">
                    <i aria-label="图标: delete" title="删除文件" tabindex="-1" class="anticon anticon-delete">
                      <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="delete" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                        <path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path>
                      </svg>
                    </i>
                  </a>
                </span>
              </span>
            </div>
          </div>
        </span>
      </div>`
    );

    fileDom
      .querySelector('a[aria-id="download"]')
      .addEventListener("click", event => {
        event.stopPropagation();
        if (onDownload && typeof onDownload === "function") {
          onDownload(file);
        }
      });

    fileDom
      .querySelector('a[aria-id="delete"]')
      .addEventListener("click", event => {
        event.stopPropagation();
        _deleteFileHandle(event, uploadDom, fileDom, file, onRemove);
      });

    uploadDom.querySelector(".light-upload-list").appendChild(fileDom);
  }

  function _deleteFileHandle(event, uploadDom, fileDom, file, onRemove) {
    let _this = event.currentTarget;
    if (onRemove && typeof onRemove === "function") {
      onRemove(file);
    }

    uploadDom.uploadFiles.forEach((item, index) => {
      if (item.name === file.name) {
        uploadDom.uploadFilesName[file.name] = false;
        uploadDom.uploadFiles.splice(index, 1);
      }
    });
    fileDom.remove();
  }

  function _changeHandle(
    event,
    uploadDom,
    action,
    data,
    headers,
    afterUpload,
    beforeUpload,
    onDownload,
    onRemove
  ) {
    let _this = event.currentTarget;
    [..._this.files].forEach(item => {
      if (!uploadDom.uploadFilesName[item.name]) {
        if (action) {
          if (
            _uploadFile(item, action, headers, data, beforeUpload, afterUpload)
          ) {
            uploadDom.uploadFilesName[item.name] = true;
            uploadDom.uploadFiles.push(item);
            _uploadSuccess(uploadDom, item, onDownload, onRemove);
          }
        } else {
          uploadDom.uploadFilesName[item.name] = true;
          uploadDom.uploadFiles.push(item);
          _uploadSuccess(uploadDom, item, onDownload, onRemove);
        }
      }
    });
  }

  /**
   * 生成Upload控件3
   * @param {json} props {
      accept : string,
      action : sring,
      afterUpload : function(response) return boolean;
      beforeUpload : function(file, fileList),
      className : string,
      data : json,
      headers : json,
      id : string,
      multiple : boolean = false,
      name : string = "Upload",
      onRemove : function(file),
      onDownload : function(file)
    }
   */
  function Upload(props) {
    const {
      accept,
      action,
      afterUpload,
      beforeUpload,
      className,
      data,
      headers,
      id,
      multiple = false,
      name = "Upload",
      onRemove,
      onDownload
    } = props;

    let uploadDom = window.lightDesign.parseHTML(`<span id="${id ||
      ""}" class="${className || ""}">
        <div class="light-upload light-upload-select light-upload-select-text">
            <span tabindex="0" class="light-upload" role="button">
                <input type="file" accept="${accept || ""}" ${
      multiple ? "multiple" : ""
    } style="display: none;">
                <button type="button" class="light-btn">
                    <i aria-label="图标: upload" class="anticon anticon-upload">
                        <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="upload" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                            <path d="M400 317.7h73.9V656c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V317.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 163a8 8 0 0 0-12.6 0l-112 141.7c-4.1 5.3-.4 13 6.3 13zM878 626h-60c-4.4 0-8 3.6-8 8v154H214V634c0-4.4-3.6-8-8-8h-60c-4.4 0-8 3.6-8 8v198c0 17.7 14.3 32 32 32h684c17.7 0 32-14.3 32-32V634c0-4.4-3.6-8-8-8z"></path>
                        </svg>
                    </i>
                    <span> ${name} </span>
                </button>
            </span>
        </div>
        <div class="light-upload-list light-upload-list-text"></div>
    </span>`);

    uploadDom.__proto__.uploadFiles = [];
    uploadDom.__proto__.uploadFilesName = {};

    uploadDom.querySelector("button").addEventListener("click", event => {
      uploadDom.querySelector('input[type="file"]').click();
    });

    uploadDom
      .querySelector('input[type="file"]')
      .addEventListener("change", event => {
        _changeHandle(
          event,
          uploadDom,
          action,
          data,
          headers,
          afterUpload,
          beforeUpload,
          onDownload,
          onRemove
        );
      });

    return uploadDom;
  }

  HTMLElement.prototype.lightUpload = function(props) {
    this.replaceWith(Upload(props));
  };
})();
