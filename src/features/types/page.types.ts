import type { Dispatch, SetStateAction } from "react";

export type UserRow = {
  id: string;
  name: string;
  age: number;
};

export type PageCompoundContextValue = {
  data: UserRow[];
  setData: Dispatch<SetStateAction<UserRow[]>>;
};

export type TableDataContextValue = PageCompoundContextValue;
