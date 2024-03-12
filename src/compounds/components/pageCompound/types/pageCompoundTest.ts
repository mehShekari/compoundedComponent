export interface PageCompoundTypes {
    children?: React.ReactNode,

    schema?: any,
    controller?: any,

    createInputs?: JSX.ElementType, // @pages/[pageName]/forms create
    editInputs?: JSX.ElementType, // @pages/[pageName]/forms edit
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

export interface PageCompoundContextTypes {
    data: any[] | null,
    pageCount: number,
    totalRecords: number,
    EditInputs?: JSX.ElementType,
    CreateInputs?: JSX.ElementType,
    MultiSearchInputs?: JSX.ElementType,
    editInputProps: any
    createInputProps: any
    schema: string,
    controller: string,
    page: number,
    setPage: React.Dispatch<React.SetStateAction<number>>
    pageSize: number,
    setPageSize: React.Dispatch<React.SetStateAction<number>>,
    singleSearch: string,
    setSingleSearch: React.Dispatch<React.SetStateAction<string>>,
    setSort: React.Dispatch<React.SetStateAction<{ asc: boolean, sortOrder: string }>>,
    sort: { asc: boolean, sortOrder: string },
    loader: boolean,
    headerEnData: any,
    headerData: any,
    fetchData: () => any,
    modalTitle?: string,
    setData: React.Dispatch<React.SetStateAction<any>>,
    multipleSearch: any,
    setMultipleSearch: React.Dispatch<React.SetStateAction<any>>
    toggleCollapse: '' | 'MultiSearch' | 'Add' | 'Edit'
    setToggleCollapse: React.Dispatch<React.SetStateAction<'' | 'MultiSearch' | 'Add' | 'Edit'>>,
    customModalWidth?: string
    pinCreate?: boolean
}
