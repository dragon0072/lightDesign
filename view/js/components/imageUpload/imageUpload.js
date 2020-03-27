(() => {
  function _setDefaultFileList(fileList, _imageUpoad) {
    fileList.forEach(file => {
      _imageUpoad.uploadFilesName[file.name] = true;
      renderThumbImg(_imageUpoad, file);
    });
  }

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

    let res = window.lightDesign.httpUpload(action, {
      params: formData,
      headers
    });

    if (afterUpload && typeof afterUpload === "function") {
      isSuccess = afterUpload(res);
    }
    return res.status === 200 && isSuccess;
  }

  function renderThumbImg(_imageUpoad, file) {
    let _thumbImg = window.lightDesign.parseHTML(
      `<div class="light-upload-list-picture-card-container">
        <span>
            <div class="light-upload-list-item light-upload-list-item-done light-upload-list-item-list-type-picture-card">
                <div class="light-upload-list-item-info">
                    <span>
                        <a class="light-upload-list-item-thumbnail" href="javascript:void(0)" rel="noopener noreferrer">
                            <img src="${
                              file instanceof File ? "" : file.thumbSrc
                            }" alt="image.png" class="light-upload-list-item-image">
                        </a>
                    </span>
                </div>
                <span class="light-upload-list-item-actions">
                    <a href="javascript:void(0)" rel="noopener noreferrer" 
                        title="${window.lightDesign.formatMessage(
                          "upload-preview-file"
                        )}" role="previewImg">
                        <span role="img" aria-label="eye" class="anticon anticon-eye">
                            <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="eye" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path>
                            </svg>
                        </span>
                    </a>
                </span>
            </div>
        </span>
      </div>`
    );

    if (file instanceof File) {
      let reader = new FileReader(file);
      reader.onload = e => {
        _thumbImg.querySelector("img").src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    _thumbImg
      .querySelector('a[role="previewImg"]')
      .addEventListener("click", event => {
        event.stopPropagation();
        let _id = window.lightDesign.guid();
        document.body.appendChild(
          window.lightDesign.parseHTML(
            `<div id="${_id}" style="position: fixed;top:0;left:0;width:${window.innerWidth}px;height:${window.innerHeight}px;line-height:${window.innerHeight}px;
                                        background-color:rgba(0, 0, 0, 0.45);text-align:center;z-index:1050;">
                    <img src="" />
            </div>`
          )
        );
        if (file instanceof File) {
          let reader = new FileReader(file);
          reader.onload = e => {
            document
              .getElementById(_id)
              .querySelector("img")
              .setAttribute("src", e.target.result);
          };
          reader.readAsDataURL(file);
        } else {
          document
            .getElementById(_id)
            .querySelector("img")
            .setAttribute("src", file.src);
        }

        document.getElementById(_id).querySelector("img").onload = function() {
          var windowW = window.innerWidth; //获取当前窗口宽度
          var windowH = window.innerHeight; //获取当前窗口高度
          var realWidth = this.width; //获取图片真实宽度
          var realHeight = this.height; //获取图片真实高度
          var imgWidth, imgHeight;
          var scale = 0.8; //缩放尺寸，当图片真实宽度和高度大于窗口宽度和高度时进行缩放
          if (realHeight > windowH * scale) {
            //判断图片高度
            imgHeight = windowH * scale; //如大于窗口高度，图片高度进行缩放
            imgWidth = (imgHeight / realHeight) * realWidth; //等比例缩放宽度
            if (imgWidth > windowW * scale) {
              //如宽度扔大于窗口宽度
              imgWidth = windowW * scale; //再对宽度进行缩放
            }
          } else if (realWidth > windowW * scale) {
            //如图片高度合适，判断图片宽度
            imgWidth = windowW * scale; //如大于窗口宽度，图片宽度进行缩放
            imgHeight = (imgWidth / realWidth) * realHeight; //等比例缩放高度
          } else {
            //如果图片真实高度和宽度都符合要求，高宽不变
            imgWidth = realWidth;
            imgHeight = realHeight;
          }
          this.width = imgWidth; //以最终的宽度对图片缩放
        };
        document.getElementById(_id).addEventListener("click", event => {
          event.stopPropagation();
          document.getElementById(_id).remove();
        });
      });

    if (
      !_imageUpoad.querySelector(
        ".light-upload-list.light-upload-list-picture-card"
      )
    ) {
      _imageUpoad
        .querySelector(".light-upload-picture-card-wrapper")
        .insertBefore(
          window.lightDesign.parseHTML(
            `<div class="light-upload-list light-upload-list-picture-card"></div>`
          ),
          _imageUpoad.querySelector(
            ".light-upload-picture-card-wrapper .light-upload.light-upload-select"
          )
        );
    }

    _imageUpoad.querySelector(".light-upload-list").appendChild(_thumbImg);
  }

  function _changeHandle(props) {
    const {
      event,
      _imageUpoad,
      action,
      data,
      headers,
      afterUpload,
      beforeUpload,
      multiple
    } = props;

    let _this = event.currentTarget;
    [..._this.files].forEach(item => {
      if (!_imageUpoad.uploadFilesName[item.name]) {
        if (action) {
          if (
            _uploadFile(item, action, headers, data, beforeUpload, afterUpload)
          ) {
            if (!multiple) {
              _imageUpoad.uploadFilesName = {};
              _imageUpoad.uploadFiles = [];
              if (_imageUpoad.querySelector(".light-upload-list"))
                _imageUpoad.querySelector(".light-upload-list").remove();
            }
            _imageUpoad.uploadFilesName[item.name] = true;
            _imageUpoad.uploadFiles.push(item);
            renderThumbImg(_imageUpoad, item);
          }
        } else {
          if (!multiple) {
            _imageUpoad.uploadFilesName = {};
            _imageUpoad.uploadFiles = [];
            if (_imageUpoad.querySelector(".light-upload-list"))
              _imageUpoad.querySelector(".light-upload-list").remove();
          }
          _imageUpoad.uploadFilesName[item.name] = true;
          _imageUpoad.uploadFiles.push(item);
          renderThumbImg(_imageUpoad, item);
        }
      } else {
        let id = window.lightDesign.guid();
        document.body.appendChild(
          window.lightDesign.parseHTML(`<div id="${id}"></div>`)
        );
        document.getElementById(`${id}`).lightModal({
          title: window.lightDesign.formatMessage("modal-tips-tittle"),
          content: window.lightDesign.formatMessage("upload-duplica-file-error")
        });
      }
    });
    _this.value = "";
  }

  function ImageUpload(props) {
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
      name = window.lightDesign.formatMessage("upload-button-name")
    } = props;

    let _imageUpoad = window.lightDesign.parseHTML(
      `<div id="${id}" class="clearfix">
        <span class="light-upload-picture-card-wrapper">
            <div class="light-upload-list light-upload-list-picture-card"></div>
            <div class="light-upload light-upload-select light-upload-select-picture-card">
                <span tabindex="0" class="light-upload" role="button">
                    <input type="file"  
                        accept="${accept || ""}" 
                         ${multiple ? "multiple" : ""} style="display: none;"
                    >
                    <div>
                        <span role="img" aria-label="plus" class="anticon anticon-plus">
                            <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="plus" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                                <defs><style></style></defs>
                                <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z"></path><path d="M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z"></path>
                            </svg>
                        </span>
                        <div class="light-upload-text">${name}</div>
                    </div>
                </span>
            </div>
        </span>
      </div>`
    );

    _imageUpoad.uploadFiles = [];
    _imageUpoad.uploadFilesName = {};
    _imageUpoad.setDefaultFileList = fileList => {
      _setDefaultFileList(fileList, _imageUpoad);
    };

    _imageUpoad
      .querySelector('.light-upload[role="button"]')
      .addEventListener("click", event => {
        event.stopPropagation();
        _imageUpoad.querySelector('input[type="file"]').click();
      });

    _imageUpoad
      .querySelector('input[type="file"]')
      .addEventListener("change", event => {
        _changeHandle({
          event,
          _imageUpoad,
          action,
          data,
          headers,
          afterUpload,
          beforeUpload,
          multiple
        });
      });
    return _imageUpoad;
  }

  HTMLElement.prototype.lightImageUpload = function(props) {
    //如果没有设置id，则使用当前dom的id，或者guid
    if (!props.id) {
      props.id = this.id || window.lightDesign.guid();
    }
    this.replaceWith(ImageUpload(props));
  };
})();
