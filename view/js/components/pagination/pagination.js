(() => {
  "use strict";
  const pageItemActiveClass = "light-pagination-item-active";
  const pageDisabledClass = "light-pagination-disabled";
  const pagePrevClass = "light-pagination-prev";
  const pageNextClass = "light-pagination-next";
  const pageJumpPrevClass = "light-pagination-jump-prev";
  const pageJumpNextClass = "light-pagination-jump-next";
  const pageBeforeJumpNextClass = "light-pagination-item-before-jump-next";
  const pageAfterJumpPrevClass = "light-pagination-item-after-jump-prev";

  //切换按钮是否禁用
  function _toggleDomDisable(dom, pageCount) {
    let activeDom = dom.querySelector(`.${pageItemActiveClass}`);
    if (activeDom.title === "1") {
      dom.querySelector(`.${pagePrevClass}`).classList.add(pageDisabledClass);
    } else {
      dom
        .querySelector(`.${pagePrevClass}`)
        .classList.remove(pageDisabledClass);
    }

    if (parseInt(activeDom.title) === pageCount) {
      dom.querySelector(`.${pageNextClass}`).classList.add(pageDisabledClass);
    } else {
      dom
        .querySelector(`.${pageNextClass}`)
        .classList.remove(pageDisabledClass);
    }
  }

  //刷新页码列表
  function _refreshPaginationHandler(
    event,
    oldIndex,
    newIndex,
    onChange,
    onShowSizeChange
  ) {
    let parentElem = event.currentTarget.closest("ul");
    let isRefreshSuccess = true;
    if (
      parentElem.querySelector(`.light-pagination-item-${newIndex}`) &&
      !parentElem.querySelector(`.${pageJumpNextClass}`) &&
      !parentElem.querySelector(`.${pageJumpPrevClass}`)
    ) {
      if (onChange && typeof onChange === "function") {
        isRefreshSuccess = onChange(newIndex, parentElem.pagination.pageSize);
        if (!isRefreshSuccess) return isRefreshSuccess;
      }
      parentElem
        .querySelector(`.light-pagination-item-${oldIndex}`)
        .classList.remove(pageItemActiveClass);
      parentElem
        .querySelector(`.light-pagination-item-${newIndex}`)
        .classList.add(pageItemActiveClass);
      parentElem.pagination.index = newIndex;
      return isRefreshSuccess;
    } else {
      //如果存在跳转五页，则进行处理
      if (
        parentElem.querySelector(`.${pageJumpPrevClass}`) ||
        parentElem.querySelector(`.${pageJumpNextClass}`)
      ) {
        if (onChange && typeof onChange === "function") {
          isRefreshSuccess = onChange(newIndex, parentElem.pagination.pageSize);
          if (!isRefreshSuccess) return isRefreshSuccess;
        }
        let elems = parentElem.querySelectorAll(".light-pagination-item");
        let pageCount = parseInt(elems[elems.length - 1].title);
        parentElem
          .querySelector(`.light-pagination-item-${oldIndex}`)
          .classList.remove(pageItemActiveClass);
        elems.forEach((item) => {
          if (item.title !== "1" && parseInt(item.title) !== pageCount) {
            item.remove();
          }
        });
        parentElem.querySelector(`.${pageJumpPrevClass}`)
          ? parentElem.querySelector(`.${pageJumpPrevClass}`).remove()
          : "";
        parentElem.querySelector(`.${pageJumpNextClass}`)
          ? parentElem.querySelector(`.${pageJumpNextClass}`).remove()
          : "";

        let refDom = parentElem.querySelector(
          `.light-pagination-item-${pageCount}`
        );

        if (
          !parentElem.querySelector(`.${pageJumpPrevClass}`) &&
          newIndex - 3 > 1
        ) {
          parentElem.insertBefore(_returnJumpPageDom("prev"), refDom);
        }
        if (
          newIndex === pageCount ||
          newIndex > pageCount ||
          newIndex === pageCount - 1
        ) {
          for (let i = pageCount - 4; i < pageCount; i++) {
            parentElem.insertBefore(
              _returnPageNumDom(i, pageCount, onChange),
              refDom
            );
          }
          parentElem
            .querySelector(
              `.light-pagination-item-${
                newIndex === pageCount || newIndex > pageCount
                  ? pageCount
                  : pageCount - 1
              }`
            )
            .classList.add(pageItemActiveClass);
        } else if (newIndex === 1 || newIndex < 1 || newIndex === 2) {
          for (let i = 2; i < 6; i++) {
            parentElem.insertBefore(
              _returnPageNumDom(i, newIndex, onChange),
              refDom
            );
          }
          parentElem
            .querySelector(`.light-pagination-item-${newIndex || 1}`)
            .classList.add(pageItemActiveClass);
        } else {
          for (let i = newIndex - 2; i <= newIndex + 2; i++) {
            //如果当前页前数三页为首页时，或后数三页为末页时，不用做任何操作
            if (i < 1 || i === 1 || i === pageCount || i > pageCount) {
              continue;
            }
            parentElem.insertBefore(
              _returnPageNumDom(i, newIndex, onChange),
              refDom
            );
          }
        }
        if (
          !parentElem.querySelector(`.${pageJumpNextClass}`) &&
          newIndex + 3 < pageCount
        ) {
          parentElem.insertBefore(_returnJumpPageDom("next"), refDom);
        }
        parentElem.pagination.index = newIndex;
        return isRefreshSuccess;
      }
      return false;
    }
  }

  /**
   * 生成页码控件
   * @param {number} page
   * @param {number} current
   */
  function _returnPageNumDom(page, current, onChange) {
    let pageNumDom = window.lightDesign.parseHTML(
      `<li title="${page}" class="light-pagination-item light-pagination-item-${page} ${
        page === current ? pageItemActiveClass : ""
      }" tabindex="0"><a>${page}</a></li>`
    );

    pageNumDom.addEventListener("click", (event) => {
      let parentElem = event.currentTarget.closest("ul");
      let currentElem = parentElem.querySelector(`.${pageItemActiveClass}`);
      if (
        _refreshPaginationHandler(
          event,
          parseInt(currentElem.title),
          parseInt(event.currentTarget.title),
          onChange
        )
      ) {
        _toggleDomDisable(parentElem, parentElem.pagination.pageCount);
      }
    });
    return pageNumDom;
  }

  /**
   * 生成跳转五页控件
   * @param {string} type 'next'或'prev'
   */
  function _returnJumpPageDom(type) {
    let jumpDom;
    if (type === "next") {
      jumpDom = window.lightDesign.parseHTML(
        `<li title="${window.lightDesign.formatMessage(
          "pagination-jumpNext"
        )}" tabindex="0" class="light-pagination-jump-next light-pagination-jump-next-custom-icon">
          <a class="light-pagination-item-link">
            <div class="light-pagination-item-container">
              <i aria-label="icon: double-right" class="anticon anticon-double-right light-pagination-item-link-icon">
                <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="double-right" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M533.2 492.3L277.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H188c-6.7 0-10.4 7.7-6.3 12.9L447.1 512 181.7 851.1A7.98 7.98 0 0 0 188 864h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5zm304 0L581.9 166.1c-3-3.9-7.7-6.1-12.6-6.1H492c-6.7 0-10.4 7.7-6.3 12.9L751.1 512 485.7 851.1A7.98 7.98 0 0 0 492 864h77.3c4.9 0 9.6-2.3 12.6-6.1l255.3-326.1c9.1-11.7 9.1-27.9 0-39.5z"></path>
                </svg>
              </i>
              <span class="light-pagination-item-ellipsis">•••</span>
            </div>
          </a>
        </li>`
      );
    } else {
      jumpDom = window.lightDesign.parseHTML(
        `<li title="${window.lightDesign.formatMessage(
          "pagination-jumpPrev"
        )}" tabindex="0" class="light-pagination-jump-prev light-pagination-jump-prev-custom-icon">
          <a class="light-pagination-item-link">
            <div class="light-pagination-item-container">
              <i aria-label="icon: double-left" class="anticon anticon-double-left light-pagination-item-link-icon">
                <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="double-left" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M272.9 512l265.4-339.1c4.1-5.2.4-12.9-6.3-12.9h-77.3c-4.9 0-9.6 2.3-12.6 6.1L186.8 492.3a31.99 31.99 0 0 0 0 39.5l255.3 326.1c3 3.9 7.7 6.1 12.6 6.1H532c6.7 0 10.4-7.7 6.3-12.9L272.9 512zm304 0l265.4-339.1c4.1-5.2.4-12.9-6.3-12.9h-77.3c-4.9 0-9.6 2.3-12.6 6.1L490.8 492.3a31.99 31.99 0 0 0 0 39.5l255.3 326.1c3 3.9 7.7 6.1 12.6 6.1H836c6.7 0 10.4-7.7 6.3-12.9L576.9 512z"></path>
                </svg>
              </i>
              <span class="light-pagination-item-ellipsis">•••</span>
            </div>
          </a>
        </li>`
      );
    }
    jumpDom.addEventListener("click", (event) => {
      let elem = event.currentTarget;
      let parentElem = elem.closest("ul");
      let isJumpSuccess = true;
      let currentIndex = parseInt(
        parentElem.querySelector(`.${pageItemActiveClass}`).title
      );
      if (elem.classList.contains(pageJumpNextClass)) {
        _refreshPaginationHandler(event, currentIndex, currentIndex + 5);
      } else {
        _refreshPaginationHandler(event, currentIndex, currentIndex - 5);
      }
      if (isJumpSuccess) {
        _toggleDomDisable(parentElem, parentElem.pagination.pageCount);
      }
    });
    return jumpDom;
  }

  //生成页码列表
  function _renderPageNumber(
    dom,
    current,
    pageSize,
    simple,
    total,
    onChange,
    onShowSizeChange
  ) {
    let pageCount = Math.ceil(total / pageSize) || 1;

    let prevDom = window.lightDesign.parseHTML(
      `<li title="${window.lightDesign.formatMessage(
        "pagination-prev"
      )}" class="light-pagination-prev ${pageDisabledClass}" aria-disabled="true">
        <a class="light-pagination-item-link">
          <i aria-label="icon: left" class="anticon anticon-left">
            <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="left" width="1em" height="1em" fill="currentColor" aria-hidden="true">
              <path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 0 0 0 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path>
            </svg>
          </i>
        </a>
      </li>`
    );

    let nextDom = window.lightDesign.parseHTML(
      `<li title="${window.lightDesign.formatMessage(
        "pagination-next"
      )}" tabindex="0" class="light-pagination-next ${
        current === pageCount ? pageDisabledClass : ""
      }" aria-disabled="${current === pageCount ? true : false}">
        <a class="light-pagination-item-link">
          <i aria-label="icon: right" class="anticon anticon-right">
            <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="right" width="1em" height="1em" fill="currentColor" aria-hidden="true">
              <path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path>
            </svg>
          </i>
        </a>
      </li>`
    );

    for (let i = 1; i <= pageCount; i++) {
      let pageDom = _returnPageNumDom(i, current, onChange);
      dom.appendChild(pageDom);
      if (pageCount > 9) {
        if (i === 5) {
          pageDom.classList.add(pageBeforeJumpNextClass);
          dom.appendChild(_returnJumpPageDom("next"));
        } else if (i > 5 && i !== pageCount) {
          pageDom.remove();
        }
      }
    }

    nextDom.addEventListener("click", (event) => {
      if (event.currentTarget.classList.contains(pageDisabledClass)) {
        return false;
      }
      let index = parseInt(
        dom.closest("ul").querySelector(`.${pageItemActiveClass}`).title || 1
      );
      if (
        _refreshPaginationHandler(
          event,
          index,
          index + 1,
          onChange,
          onShowSizeChange
        )
      ) {
        _toggleDomDisable(dom, pageCount);
      }
    });

    prevDom.addEventListener("click", (event) => {
      if (event.currentTarget.classList.contains(pageDisabledClass)) {
        return false;
      }

      let index = parseInt(
        dom.closest("ul").querySelector(`.${pageItemActiveClass}`).title
      );
      if (
        _refreshPaginationHandler(
          event,
          index,
          index - 1,
          onChange,
          onShowSizeChange
        )
      ) {
        _toggleDomDisable(dom, pageCount);
      }
    });

    dom.insertBefore(prevDom, dom.querySelector(".light-pagination-item-1"));
    dom.appendChild(nextDom);

    dom.pagination = {
      pageCount,
      pageSize,
      index: current,
    };
  }

  /**
   * 分页控件
   * @param {json} props {
      current:number = 1,//当前页
      pageSize:numner = 10,
      pageSizeOptions:string[] = ["10", "20", "30", "40"],
      showQuickJumper:boolean = false,
      showSizeChanger:boolean = false,
      showTotal:function(total,range),
      simple:boolean = false,
      total:number = 0,
      onChange:function(page,pageSize),
      onShowSizeChange:function(current,size)
    }
   */
  function Pagination(props) {
    const {
      current = 1,
      pageSize = 10,
      pageSizeOptions = ["10", "20", "30", "40"],
      showQuickJumper = false,
      showSizeChanger = false,
      showTotal,
      simple = false,
      total = 0,
      onChange,
      onShowSizeChange,
    } = props;

    let paginationDom = window.lightDesign.parseHTML(
      `<ul class="light-pagination" unselectable="unselectable">
      </ul>`
    );

    _renderPageNumber(
      paginationDom,
      current,
      pageSize,
      simple,
      total,
      onChange,
      onShowSizeChange
    );

    return paginationDom;
  }

  HTMLElement.prototype.lightPagination = function (props) {
    this.replaceWith(Pagination(props));
  };
})();
