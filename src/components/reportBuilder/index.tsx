import React, { useContext, useRef, useState } from "react";
import { styled } from "styled-components";
import Paper from "./paper";

const Wrapper = styled.div`
    .header-wrapper{
        padding: 10px;
    }

    .form-wrapper {
        display: flex;
        gap: 10px;
    }

    .form-control {
        display: flex;
        gap: 5px;
        label {
            font-size: 14px;
        }
    }
`;

type pageSizeObjectType = {
  width: string,
  height: string,
}

type pageSizeType = {
  A3: pageSizeObjectType
  A4: pageSizeObjectType
  A5: pageSizeObjectType
}

const pageSizes: pageSizeType = {
  A3: {
    width: "297mm",
    height: "420mm"
  },
  A4: {
    width: "210mm",
    height: "297mm"
  },
  A5: {
    width: "148mm",
    height: "210mm"
  },
}

const PaperContext = React.createContext({} as {
  dragElementName: string,
  setDragElementName: (val: string) => void
});

export const usePaperContext = () => {
  return useContext(PaperContext);
}

export default function ReportBuilder() {
  const paperRef = useRef<HTMLDivElement>(null);
  const [rotationType, setRotationType] = useState<string>("vert");
  const [pageType, setPageType] = useState<string>("A4");
  const [headerReport, setHeaderReport] = useState<boolean>(false);


  const pageSizeChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val: keyof pageSizeType = e.target.value as any;
    if (paperRef.current) {
      if (rotationType == "hor") {
        paperRef.current.style.width = pageSizes[val].height;
        paperRef.current.style.minWidth = pageSizes[val].height;
        paperRef.current.style.height = pageSizes[val].width;

      }
      if (rotationType == "vert") {
        paperRef.current.style.width = pageSizes[val].width;
        paperRef.current.style.minWidth = pageSizes[val].width;
        paperRef.current.style.height = pageSizes[val].height;
      }
    }
    setPageType(val)
  }

  const pageRotationChangeHandler = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val: string = e.target.value;
    const pageTypeVar = pageType as keyof pageSizeType;

    if (paperRef.current) {
      if (val == "hor") {
        paperRef.current.style.width = pageSizes[pageTypeVar].height;
        paperRef.current.style.minWidth = pageSizes[pageTypeVar].height;
        paperRef.current.style.height = pageSizes[pageTypeVar].width;
      }
      if (val == "vert") {
        paperRef.current.style.width = pageSizes[pageTypeVar].width;
        paperRef.current.style.minWidth = pageSizes[pageTypeVar].width;
        paperRef.current.style.height = pageSizes[pageTypeVar].height;
      }
    }
    setRotationType(val);
  }

  const [dragElementName, setDragElementName] = useState("")


  return <PaperContext.Provider value={{ dragElementName, setDragElementName }}>
    <Wrapper>
      {/* features and options setting panel */}
      <div className="header-wrapper">
        <div className="form-wrapper">
          <div className="form-control">
            <label htmlFor="paper">paper type:</label>
            <select name="" id="paper" onChange={pageSizeChangeHandler}>
              <option value="A3">A3</option>
              <option value="A4" selected>A4</option>
              <option value="A5">A5</option>
            </select>
          </div>

          <div className="form-control">
            <label htmlFor="paper">rotation:</label>
            <select name="" onChange={pageRotationChangeHandler}>
              <option value="hor">horizontal</option>
              <option value="vert" selected>vertical</option>
            </select>
          </div>

          <div className="form-control">
            <label htmlFor="header-repo">header-repo</label>
            <input type="checkbox" id="header-repo" name="header-rep" onChange={(e) => {
              const val: boolean = e.target.checked;
              setHeaderReport(val);
            }} />
          </div>

          <div className="form-control">
            <label htmlFor="header-page">header-page</label>
            <input type="checkbox" id="header-page" name="header-rep" />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: "center" }}>
        <Paper ref={paperRef}>
          <div className="box">
            d
          </div>
        </Paper>
      </div>
    </Wrapper>
  </PaperContext.Provider>
}