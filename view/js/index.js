window.onload = () => {
  document.querySelector("#app").lightSelect({
    id: "app",
    placeholder: "select...",
    dataSource: [
      {
        code: 1,
        name: 1
      },
      {
        code: 2,
        name: 2
      }
    ],
    style: "width:120px;"
  });

  document.querySelector("#upload").lightUpload({
    accept: ".xlsx",
    multiple: true
  });
};
