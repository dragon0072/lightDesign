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
  //   style: "width:120px;",
  //   value: 1
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
  //           },
  //           isVisible: dataItem => {
  //             return false;
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
  // document.querySelector("#app").lightCheckbox({
  //   label: "ceshi"
  // });
  document.querySelector("#app").lightTree({
    treeData: [
      {
        IsCheck: true,
        isExpand: true,
        Children: [
          {
            IsCheck: false,
            Children: [],
            UG_Code: "PM",
            UG_Name: "PM",
            UG_PCode: "0",
            UG_Description: "",
            UG_Status: "1",
            Sort_Number: 0
          },
          {
            IsCheck: false,
            Children: [],
            UG_Code: "FF",
            UG_Name: "FF",
            UG_PCode: "0",
            UG_Description: "",
            UG_Status: "1",
            Sort_Number: 0
          },
          {
            IsCheck: false,
            Children: [],
            UG_Code: "Dealer",
            UG_Name: "Dealer",
            UG_PCode: "0",
            UG_Description: "",
            UG_Status: "1",
            Sort_Number: 0
          },
          {
            IsCheck: false,
            Children: [],
            UG_Code: "Supervisor",
            UG_Name: "Supervisor",
            UG_PCode: "0",
            UG_Description: "",
            UG_Status: "1",
            Sort_Number: 0
          },
          {
            IsCheck: false,
            Children: [
              {
                IsCheck: false,
                Children: [
                  {
                    IsCheck: false,
                    Children: [],
                    UG_Code: "UUU1",
                    UG_Name: "UUU1Name",
                    UG_PCode: "UU1",
                    UG_Description: "UUU1Name",
                    UG_Status: "1",
                    Sort_Number: 0
                  }
                ],
                UG_Code: "UU1",
                UG_Name: "UU1Name",
                UG_PCode: "U1",
                UG_Description: "UU1Name",
                UG_Status: "1",
                Sort_Number: 0
              }
            ],
            UG_Code: "U1",
            UG_Name: "UName",
            UG_PCode: "0",
            UG_Description: "",
            UG_Status: "1",
            Sort_Number: 4
          },
          {
            IsCheck: true,
            Children: [
              {
                IsCheck: false,
                Children: [],
                UG_Code: "adminUg1",
                UG_Name: "管理员二组",
                UG_PCode: "adminUg",
                UG_Description: "qwe",
                UG_Status: "1",
                Sort_Number: 0
              },
              {
                IsCheck: false,
                Children: [],
                UG_Code: "adminUg3",
                UG_Name: "管理员三组",
                UG_PCode: "adminUg",
                UG_Description: "qwe",
                UG_Status: "1",
                Sort_Number: 0
              }
            ],
            UG_Code: "adminUg",
            UG_Name: "管理员组",
            UG_PCode: "0",
            UG_Description: null,
            UG_Status: "1",
            Sort_Number: 0
          }
        ],
        UG_Code: "0",
        UG_Name: "Root",
        UG_PCode: "",
        UG_Description: null,
        UG_Status: "1",
        Sort_Number: 0
      }
    ],
    textFieldName: "UG_Name",
    valueFieldName: "UG_Code",
    childFieldName: "Children",
    checkedFieldName: "IsCheck",
    checkable: true
  });
};
