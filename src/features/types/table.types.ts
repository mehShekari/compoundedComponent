export type TableCompoundContextValue = {
  columns: string[];
  captions: string[];
};

export type TableRowFilter<T> = (item: T) => boolean;
