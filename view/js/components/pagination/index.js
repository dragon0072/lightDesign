(() => {
  "use strict";
  const paginationHandle = {
    getPageIndex: event => {
      let elem = event.target.closest("ul");
      return elem.pageable.pageIndex;
    },
    buttonToggleDiabled: (parentElem, index) => {
      if (
        index === 1 &&
        parentElem.querySelectorAll(".pagination-item").length !== 1
      ) {
        parentElem
          .querySelector(".pagination-prev")
          .classList.add("pagination-disabled");
        parentElem
          .querySelector(".pagination-next")
          .classList.remove("pagination-disabled");
      } else if (index === parentElem.pageable.pageTotal) {
        parentElem
          .querySelector(".pagination-prev")
          .classList.remove("pagination-disabled");
        parentElem
          .querySelector(".pagination-next")
          .classList.add("pagination-disabled");
      } else if (index > 1 && index < parentElem.pageable.pageTotal) {
        parentElem
          .querySelector(".pagination-prev")
          .classList.remove("pagination-disabled");
        parentElem
          .querySelector(".pagination-next")
          .classList.remove("pagination-disabled");
      }
    },
    //页码变换时的事件
    pageChangeHandle: (event, currentIndex, newIndex) => {
      let parentElem = event.target.closest("ul");
      const { totalCount, pageSize, pageChange } = parentElem.pageable;
      document
        .querySelector(`.pagination-item-${currentIndex}`)
        .classList.remove("pagination-item-active");

      let newActiveDom = document.querySelector(`.pagination-item-${newIndex}`);
      if (
        newActiveDom &&
        newIndex !== 1 &&
        newIndex !== parentElem.pageable.pageTotal
      ) {
        parentElem.pageable.pageIndex = newIndex;
        newActiveDom.classList.add("pagination-item-active");
      } else {
        parentElem.pageable.pageIndex = newIndex;
        let newPageNumHtml = paginationHandle.pageNumberRender(
          totalCount,
          newIndex,
          pageSize
        );

        let dom = window.lightDesignGlobal.parseHTML(
          newPageNumHtml.replaceEnter()
        );

        //删除原有页码
        document
          .querySelectorAll(
            ".pagination-item,.pagination-jump-next,.pagination-jump-prev"
          )
          .forEach(item => {
            item.remove();
          });

        //将新的dom插入到父节点
        dom.forEach(item => {
          parentElem.insertBefore(
            item,
            parentElem.querySelector(".pagination-next")
          );
        });

        //给按钮加上事件
        if (parentElem.querySelector(".pagination-jump-prev")) {
          parentElem.querySelector(".pagination-jump-prev").onclick = function(
            event
          ) {
            paginationHandle.jumpPrevHandle(event);
          };
        }

        if (parentElem.querySelector(".pagination-jump-next")) {
          parentElem.querySelector(".pagination-jump-next").onclick = function(
            event
          ) {
            paginationHandle.jumpNextHandle(event);
          };
        }

        parentElem.querySelectorAll(".pagination-item").forEach(item => {
          item.onclick = function(event) {
            paginationHandle.jumpPageHandle(event);
          };
        });
      }

      if (pageChange && typeof pageChange === "function") {
        pageChange(newIndex);
      }

      paginationHandle.buttonToggleDiabled(parentElem, newIndex);
    },
    prevPageHandle: event => {
      if (event.currentTarget.className.indexOf("pagination-disabled") > -1) {
        return;
      }
      let currentPageIndex = paginationHandle.getPageIndex(event);
      paginationHandle.pageChangeHandle(
        event,
        currentPageIndex,
        currentPageIndex - 1
      );
    },
    nextPageHandle: event => {
      if (event.currentTarget.className.indexOf("pagination-disabled") > -1) {
        return;
      }
      let currentPageIndex = paginationHandle.getPageIndex(event);
      paginationHandle.pageChangeHandle(
        event,
        currentPageIndex,
        currentPageIndex + 1
      );
    },
    jumpPageHandle: event => {
      paginationHandle.pageChangeHandle(
        event,
        paginationHandle.getPageIndex(event),
        parseInt(event.currentTarget.title)
      );
    },
    jumpPrevHandle: event => {
      let currentPageIndex = paginationHandle.getPageIndex(event);
      let newPageIndex = currentPageIndex - 5 < 1 ? 1 : currentPageIndex - 5;
      paginationHandle.pageChangeHandle(event, currentPageIndex, newPageIndex);
    },
    jumpNextHandle: event => {
      let currentPageIndex = paginationHandle.getPageIndex(event);
      let newPageIndex =
        currentPageIndex + 5 > event.target.closest("ul").pageable.pageTotal
          ? event.target.closest("ul").pageable.pageTotal
          : currentPageIndex + 5;
      paginationHandle.pageChangeHandle(event, currentPageIndex, newPageIndex);
    },
    //返回页面html
    returnPageNumHtml: (start, end, pageIndex) => {
      var html = [];
      for (let i = start; i <= end; i++) {
        html.push(
          `<li title='${i}' class='pagination-item pagination-item-${i} ${
            i === pageIndex ? "pagination-item-active" : ""
          }'><a>${i}</a></li>`
        );
      }
      return html.join("").trim();
    },
    //渲染页码
    pageNumberRender: (totalCount, pageIndex, pageSize) => {
      let pageNumber = [],
        pageTotal = Math.ceil(totalCount / pageSize) || 1,
        prevHtml = `<li title="向前 5 页" tabindex="0" class="pagination-jump-prev pagination-jump-prev-custom-icon">
            <a class="pagination-item-link">
              <div class="pagination-item-container">
                <i aria-label="图标: double-left" class="anticon anticon-double-left pagination-item-link-icon">
                  <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="double-left" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                    <path d="M272.9 512l265.4-339.1c4.1-5.2.4-12.9-6.3-12.9h-77.3c-4.9 0-9.6 2.3-12.6 6.1L186.8 492.3a31.99 31.99 0 0 0 0 39.5l255.3 326.1c3 3.9 7.7 6.1 12.6 6.1H532c6.7 0 10.4-7.7 6.3-12.9L272.9 512zm304 0l265.4-339.1c4.1-5.2.4-12.9-6.3-12.9h-77.3c-4.9 0-9.6 2.3-12.6 6.1L490.8 492.3a31.99 31.99 0 0 0 0 39.5l255.3 326.1c3 3.9 7.7 6.1 12.6 6.1H836c6.7 0 10.4-7.7 6.3-12.9L576.9 512z"></path>
                  </svg>
                </i>
                <span class="pagination-item-ellipsis">•••</span>
              </div>
            </a>
          </li>`,
        nextHtml = `<li title="向后 5 页" tabindex="0" class="pagination-jump-next pagination-jump-next-custom-icon">
          <a class="pagination-item-link">
              <div class="pagination-item-container">
                  <i aria-label="图标: double-right" class="anticon anticon-double-right pagination-item-link-icon">
                      <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="double-right" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                          <path d="M533.2 492.3L277.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H188c-6.7 0-10.4 7.7-6.3 12.9L447.1 512 181.7 851.1A7.98 7.98 0 0 0 188 864h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5zm304 0L581.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H492c-6.7 0-10.4 7.7-6.3 12.9L751.1 512 485.7 851.1A7.98 7.98 0 0 0 492 864h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5z"></path>
                      </svg>
                  </i>
                  <span class="pagination-item-ellipsis">•••</span>
              </div>
          </a>
        </li>`;
      //如果当前页码小于5时，输出pageTotal数量的页码。否则，按需要输出
      if (pageTotal <= 6) {
        pageNumber.push(
          paginationHandle.returnPageNumHtml(1, pageTotal, pageIndex)
        );
      } else {
        if (pageIndex < 5) {
          pageNumber.push(
            paginationHandle.returnPageNumHtml(1, 5, pageIndex),
            nextHtml,
            paginationHandle.returnPageNumHtml(pageTotal, pageTotal, pageIndex)
          );
        } else if (pageIndex > 4 && pageIndex < pageTotal - 3) {
          pageNumber.push(
            paginationHandle.returnPageNumHtml(1, 1, pageIndex),
            prevHtml,
            paginationHandle.returnPageNumHtml(
              pageIndex - 2,
              pageIndex + 2,
              pageIndex
            ),
            nextHtml,
            paginationHandle.returnPageNumHtml(pageTotal, pageTotal, pageIndex)
          );
        } else if (pageIndex > pageTotal - 5) {
          pageNumber.push(
            paginationHandle.returnPageNumHtml(1, 1, pageIndex),
            prevHtml,
            paginationHandle.returnPageNumHtml(
              pageTotal - 4,
              pageTotal,
              pageIndex
            )
          );
        } else {
          pageNumber.push(
            paginationHandle.returnPageNumHtml(1, pageTotal, pageIndex)
          );
        }
      }
      return pageNumber.join("").trim();
    },
    render: (elem, props) => {
      const { totalCount, pageIndex = 1, pageSize = 10, pageChange } = props;

      let paginationHtml = `
          <ul class='pagination table-pagination'>
              <li class='pagination-total-text'>Total ${totalCount} items</li>
              <li title="上一页" class="pagination-prev ${
                pageIndex === 1 ? "pagination-disabled" : ""
              }" aria-disabled="true">
                  <a class="pagination-item-link">
                      <i aria-label="图标: left" class="anticon anticon-left">
                      <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="left" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 0 0 0 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path></svg>
                      </i>
                  </a>
              </li>
              ${paginationHandle.pageNumberRender(
                totalCount,
                pageIndex,
                pageSize
              )}
              <li title="下一页" tabindex="0" class="pagination-next ${
                pageIndex === Math.ceil(totalCount / pageSize) ||
                Math.ceil(totalCount / pageSize) + 1 === 1
                  ? "pagination-disabled"
                  : ""
              }" aria-disabled="false">
                  <a class="pagination-item-link">
                      <i aria-label="图标: right" class="anticon anticon-right">
                          <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="right" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                            <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path>
                          </svg>
                      </i>
                  </a>
              </li>
          </ul>
        `;
      var dom = window.lightDesignGlobal.parseHTML(
        paginationHtml.replaceEnter()
      )[0];

      dom.__proto__.pageable = {
        pageIndex,
        pageSize,
        pageTotal: Math.ceil(totalCount / pageSize),
        totalCount,
        pageChange
      };

      //上一页事件
      dom.querySelector(".pagination-prev").onclick = event => {
        paginationHandle.prevPageHandle(event);
      };

      //下一页事件
      dom.querySelector(".pagination-next").onclick = event => {
        paginationHandle.nextPageHandle(event);
      };

      //前跳5页事件
      if (dom.querySelector(".pagination-jump-prev")) {
        dom.querySelector(".pagination-jump-prev").onclick = event => {
          paginationHandle.jumpPrevHandle(event);
        };
      }

      //后跳5页事件
      if (dom.querySelector(".pagination-jump-next")) {
        dom.querySelector(".pagination-jump-next").onclick = event => {
          paginationHandle.jumpNextHandle(event);
        };
      }

      dom.querySelectorAll(".pagination-item").forEach(item => {
        item.onclick = function(event) {
          paginationHandle.jumpPageHandle(event);
        };
      });

      return dom;
    }
  };

  HTMLElement.prototype.paginationHandle = props => {
    return paginationHandle.render(this, props);
  };
})();
