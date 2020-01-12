window.onload = () => {
  document.querySelector("#app").lightSelect({
    id: "app",
    placeholder: "select...",
    dataSource: [
      {
        code: 1,
        name: 1
      }
    ],
    style: "width:120px;"
  });
};
