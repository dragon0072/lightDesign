(() => {
  "use strict";
  /**
   * 分页控件
   * @param {json} props {
      current:number = 1,
      hideOnSinglePage:boolean = false,
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
      hideOnSinglePage = false,
      pageSize = 10,
      pageSizeOptions = ["10", "20", "30", "40"],
      showQuickJumper = false,
      showSizeChanger = false,
      showTotal,
      simple = false,
      total = 0,
      onChange,
      onShowSizeChange
    } = props;
  }
})();
