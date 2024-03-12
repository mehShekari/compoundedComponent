export interface PageCompoundTypes {
    schema?: any,
    controller?: any,
  
    createInputs: JSX.ElementType, // @pages/[pageName]/forms create
    editInputs: JSX.ElementType, // @pages/[pageName]/forms edit
    multiSearchInputs?: JSX.ElementType, // @pages/[pageName]/forms multiSearch
    editInputProps?: any
    createInputProps?: any
  
    requestDataType?: any,
    modalTitleName?: string,
  
    multiSearchProps?: object
  
    GetPageAndRecordCountPath?: string,
    GetListByPagingPropsPath?: string,
  
    params?: any
  
    className?: string,
  
    customModalWidth?: string
  
    pin?: boolean
  }
  