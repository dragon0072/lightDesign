window.onload = () => {
  // document.querySelector("#app").lightSelect({
  //   id: "app",
  //   placeholder: "select...",
  //   dataSource: [
  //     {
  //       code: 1,
  //       name: 1
  //     },
  //     {
  //       code: 2,
  //       name: 2
  //     }
  //   ],
  //   style: "width:120px;"
  // });
  // document.querySelector("#upload").lightUpload({
  //   accept: ".xlsx",
  //   multiple: true
  // });
  // document.querySelector("#alert").lightAlert({
  //   type: "success",
  //   message: "success",
  //   showIcon: true,
  //   closable: true
  // });
  // document.querySelector("#pagination").lightPagination({
  //   total: 100
  // });
  // document.querySelector("#app").lightTable({
  //   id: "app",
  //   columns: [
  //     {
  //       field: "index",
  //       title: "index",
  //       render: dataItem => {
  //         return "<a>123</a>";
  //       }
  //     },
  //     {
  //       field: "name",
  //       title: "name"
  //     },
  //     {
  //       field: "sex",
  //       title: "sex"
  //     },
  //     {
  //       command: [
  //         {
  //           name: "edit",
  //           click: (dataItem, event) => {
  //             console.log(dataItem);
  //           }
  //         }
  //       ]
  //     }
  //   ],
  //   // dataSource: {
  //   //   transforms: {
  //   //     type: "get",
  //   //     url: "../../data/table.json",
  //   //     data: res => {
  //   //       return res.data.dataList;
  //   //     },
  //   //     total: res => {
  //   //       return res.data.total;
  //   //     }
  //   //   }
  //   // }
  //   dataSource: [
  //     {
  //       index: 1,
  //       name: "张三",
  //       sex: "男"
  //     },
  //     {
  //       index: 2,
  //       name: "张三2",
  //       sex: "男"
  //     },
  //     {
  //       index: 3,
  //       name: "张三3",
  //       sex: "男"
  //     },
  //     {
  //       index: 4,
  //       name: "张三4",
  //       sex: "男"
  //     },
  //     {
  //       index: 5,
  //       name: "张三5",
  //       sex: "男"
  //     },
  //     {
  //       index: 6,
  //       name: "张三6",
  //       sex: "男"
  //     },
  //     {
  //       index: 7,
  //       name: "张三7",
  //       sex: "男"
  //     },
  //     {
  //       index: 8,
  //       name: "张三8",
  //       sex: "男"
  //     },
  //     {
  //       index: 9,
  //       name: "张三9",
  //       sex: "男"
  //     },
  //     {
  //       index: 10,
  //       name: "张三10",
  //       sex: "男"
  //     },
  //     {
  //       index: 11,
  //       name: "张三11",
  //       sex: "男"
  //     }
  //   ]
  // });
  // document.querySelector("#app").lightModal({
  //   id: "app",
  //   title: "提示",
  //   content: "显示信息"
  // });
  // document.querySelector("#app").lightTabs({
  //   tabs: [
  //     "test111111111111111111111111111111111111111111111111111111111111",
  //     "test2"
  //   ],
  //   tabPanels: ["123", "123"]
  // });
  document.querySelector("#app").lightCheckbox({
    label: "ceshi"
  });
};
