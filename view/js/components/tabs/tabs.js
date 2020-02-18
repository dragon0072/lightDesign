(() => {
  const activeTabClass = "light-tabs-tab-active";
  const activeTabPanelClass = "light-tabs-tabpane-active";
  const inactiveTabPanelClass = "light-tabs-tabpane-inactive";

  //生成tabs头
  function _renderTabs(tabs, activeKey, _tabs) {
    tabs.forEach((item, index) => {
      _tabs
        .querySelector(".light-tabs-nav>div")
        .appendChild(
          window.lightDesign.parseHTML(
            `<div role="tab" aria-key='${index}' aria-disabled="false" aria-selected="${
              activeKey === index ? "true" : "false"
            }" class="${
              activeKey === index ? activeTabClass : ""
            } light-tabs-tab">${item}</div>`
          )
        );
    });
  }
  //生成tabs panel
  function _renderTabsPanel(tabPanels, activeKey, _tabs) {
    tabPanels.forEach((item, index) => {
      _tabs.querySelector(".light-tabs-content").appendChild(
        window.lightDesign.parseHTML(
          `<div role="tabpanel" aria-hidden="${
            index === activeKey ? "false" : "true"
          }" class="light-tabs-tabpane ${
            index === activeKey ? activeTabPanelClass : inactiveTabPanelClass
          }">
              <div tabindex="0" role="presentation" style="width: 0px; height: 0px; overflow: hidden; position: absolute;"></div>
                  ${item}
              <div tabindex="0" role="presentation" style="width: 0px; height: 0px; overflow: hidden; position: absolute;"></div>
          </div>`
        )
      );
    });
  }

  function _bindTabsClickHandle(onChange, _tabs) {
    _tabs.querySelectorAll('div[role="tab"]').forEach(item => {
      item.addEventListener("click", event => {
        let _this = event.currentTarget;
        let tabInkBar = _tabs.querySelector(".light-tabs-ink-bar");
        _tabs.querySelectorAll('div[role="tab"]').forEach((item, index) => {
          if (index === parseInt(_this.getAttribute("aria-key"))) {
            item.setAttribute("aria-selected", true);
            item.classList.add(activeTabClass);
          } else {
            item.setAttribute("aria-selected", true);
            item.classList.remove(activeTabClass);
          }
        });
        _tabs
          .querySelectorAll('div[role="tabpanel"]')
          .forEach((item, index) => {
            if (index === parseInt(_this.getAttribute("aria-key"))) {
              item.setAttribute("aria-hidden", false);
              item.classList.remove(inactiveTabPanelClass);
              item.classList.add(activeTabPanelClass);
            } else {
              item.setAttribute("aria-hidden", true);
              item.classList.add(inactiveTabPanelClass);
              item.classList.remove(activeTabPanelClass);
            }
          });
        tabInkBar.style.transform = `translate3d(${_this.offsetLeft}px, 0px, 0px)`;
        tabInkBar.style.width = `${_this.offsetWidth}px`;
        _tabs.querySelector(
          ".light-tabs-content"
        ).style.marginLeft = `-${_this.getAttribute("aria-key")}00%`;

        if (onChange && typeof onChange === "function") {
          onChange(_this, _tabs);
        }
      });
    });
  }

  /**
   * 生成tabs控件
   * @param {*} props  { 
                         activeKey:int , 默认激活的元素
                         onChange:function(), 激活页发生变化时事件
                         tabs:[string], 页签
                         tabPanels:[string] tabs页内容
                        }
   */
  function Tabs(props) {
    const { id, activeKey = 0, onChange, tabs, tabPanels } = props;

    let _tabs = window.lightDesign.parseHTML(
      `<div id="${id}" class="light-tabs light-tabs-top light-tabs-line">
          <div role="tablist" class="light-tabs-bar light-tabs-top-bar" tabindex="0">
              <div class="light-tabs-nav-container">
                  <div class="light-tabs-nav-wrap">
                      <div class="light-tabs-nav-scroll">
                          <div class="light-tabs-nav light-tabs-nav-animated">
                              <div>
                              </div>
                              <div class="light-tabs-ink-bar light-tabs-ink-bar-animated" style="display: block; transform: translate3d(0px, 0px, 0px); width: 66px;"></div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div tabindex="0" role="presentation" style="width: 0px; height: 0px; overflow: hidden; position: absolute;"></div>
          <div class="light-tabs-content light-tabs-content-animated light-tabs-top-content" style="margin-left: 0%;">
          </div>
          <div tabindex="0" role="presentation" style="width: 0px; height: 0px; overflow: hidden; position: absolute;"></div>
      </div>`
    );

    //生成Tabs
    _renderTabs(tabs, activeKey, _tabs);

    //render tab panels
    _renderTabsPanel(tabPanels, activeKey, _tabs);

    //bind tabs click handle
    _bindTabsClickHandle(onChange, _tabs);

    return _tabs;
  }

  HTMLElement.prototype.lightTabs = function(props) {
    //如果没有设置id，则使用当前dom的id，或者guid
    if (!props.id) {
      props.id = this.id || window.lightDesign.guid();
    }

    this.replaceWith(Tabs(props));

    let _tabs = document.querySelector(`#${props.id}`);
    _tabs.querySelector(".light-tabs-ink-bar").style.width = `${
      _tabs.querySelector(`.${activeTabClass}`).offsetWidth
    }px`;
  };
})();
