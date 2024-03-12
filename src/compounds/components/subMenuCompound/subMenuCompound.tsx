import React from "react"

import styles from "./styles/Table.module.css"
// import useFetchPagedData from "@hooks/useFetchPagedData"

interface IProps {
  children?: React.ReactNode
  columns?: string[]
  captions?: string[]
  schema: string,
  controller?: string,
  trClickHandler: (args?: any) => void
}

const SubMenuCompoundContext = React.createContext({});
export function useSubMenuCompoundContext() {
  return React.useContext(SubMenuCompoundContext);
}

const data = [
  { name: "ali", desc: "this is shit", test: "ok" },
  { name: "reza", desc: "this is shit", test: "not" },
  { name: "jvd", desc: "this is shit", test: "ok" },
  { name: "k1", desc: "this is shit", test: "not" },
  { name: "mmd", desc: "this is shit", test: "not" }
]

const SubMenuCompound = ({
  children,
  captions, columns,
  schema, controller,
  trClickHandler
}: IProps) => {
  console.log(columns, children, captions, schema, controller, trClickHandler)
  // const {  } = useFetchPagedData()
  // const fetchData = useCallback(async () =>
  // {
  //   try {

  //   } catch (error) {
  //     console.log("first")
  //   } finally {
  //     console.log("first")
  //   }
  // }, [])
  // useEffect(() =>
  // {
  //   fetchData();
  // }, [])

  return <SubMenuCompoundContext.Provider value={{}}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th></th>
          <th>کد</th>
          <th>حکم</th>
          <th>درسته</th>
        </tr>
      </thead>

      <tbody>
        {
          data.map((_row: any, idx) => {
            return <tr 
              onClick={() => trClickHandler({ id: 1 })} 
              className={`cursor-pointer ${idx % 2 === 0 ? "!bg-slate-200" : ""}`}
            >
              <td>
                <div className="flex  gap-2 pr-2 items-center">
                  <input type="checkbox" />
                  <span className={`${styles.separator} mb-[2px]`}></span>
                </div>
              </td>
              {
                columns?.map((_col: any, _index) => {
                  if(_row[_col] == null) return
                  return <td key={_col}>
                    <div className="">
                      {_row[_col]}
                      {_index >= columns.length - 1 ? null :
                      (
                        <span className={`${styles.separator} mb-[2px]`}></span>
                      )}
                    </div>
                  </td>
                })
              }
            </tr>
          })
        }

      </tbody>
    </table>
  </SubMenuCompoundContext.Provider>
}


export default SubMenuCompound