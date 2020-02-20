(() => {
  function _toggleChecked(checked, _checkbox) {
    if (checked) {
      _checkbox.querySelector("input").checked = true;
      _checkbox.classList.add("light-checkbox-wrapper-checked");
      _checkbox
        .querySelector(".light-checkbox")
        .classList.add("light-checkbox-checked");
    } else {
      _checkbox.querySelector("input").checked = false;
      _checkbox.classList.remove("light-checkbox-wrapper-checked");
      _checkbox
        .querySelector(".light-checkbox")
        .classList.remove("light-checkbox-checked");
    }
  }

  function Checkbox(props) {
    const { id, checked = false, label = "", onClick } = props;

    let _checkbox = window.lightDesign.parseHTML(
      `<label class="light-checkbox-wrapper">
            <span class="light-checkbox">
                <input id="${id}" type="checkbox" class="light-checkbox-input" value="" />
                <span class="light-checkbox-inner"></span>
            </span>
            <span>${label}</span>
        </label>`
    );

    _toggleChecked(checked, _checkbox);

    _checkbox.addEventListener("click", event => {
      let parentElem = event.currentTarget;
      let isChecked = parentElem.querySelector("input").checked;
      _toggleChecked(isChecked, parentElem);
      if (onClick && typeof onClick === "function") {
        onClick(parentElem.querySelector("input").checked, parentElem);
      }
    });

    return _checkbox;
  }

  HTMLElement.prototype.lightCheckbox = function(props) {
    //如果没有设置id，则使用当前dom的id，或者guid
    if (!props.id) {
      props.id = this.id || window.lightDesign.guid();
    }
    this.replaceWith(Checkbox(props));
  };

  HTMLElement.prototype.lightReturnCheckbox = function(props) {
    //如果没有设置id，则使用当前dom的id，或者guid
    if (!props.id) {
      props.id = this.id || window.lightDesign.guid();
    }
    return Checkbox(props);
  };
})();
