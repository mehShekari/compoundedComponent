import { createContext, useContext, useState } from "react";

import TableCompound from "../../tableCompound/tableCompound";
import { DEFAULT_USER_TABLE } from "../../constants/defaultTableConfig";

type BodyPageCompoundContextValue = {
  bodyState1: string;
  setBodyState1: React.Dispatch<React.SetStateAction<string>>;
};

const BodyPageCompoundContext = createContext<BodyPageCompoundContextValue | null>(null);

export function useBodyPageCompoundContext(): BodyPageCompoundContextValue {
  const context = useContext(BodyPageCompoundContext);
  if (!context) {
    throw new Error("useBodyPageCompoundContext must be used within PageCompound.Body");
  }
  return context;
}

const PageCompoundBody = ({ children }: { children?: React.ReactNode }) => {
  const [bodyState1, setBodyState1] = useState("");

  const contextValue = { bodyState1, setBodyState1 };

  return (
    <BodyPageCompoundContext.Provider value={contextValue}>
      {children ?? (
        <TableCompound
          columns={[...DEFAULT_USER_TABLE.columns]}
          captions={[...DEFAULT_USER_TABLE.captions]}
        >
          <TableCompound.Header />
          <TableCompound.Body />
          <TableCompound.Footer />
        </TableCompound>
      )}
    </BodyPageCompoundContext.Provider>
  );
};

PageCompoundBody.displayName = "compound-page-body";
export default PageCompoundBody;
