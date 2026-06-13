export const DEFAULT_USER_TABLE = {
  columns: ["name", "age"] as const,
  captions: ["Name", "Age"],
} as const;

export const DEFAULT_USER_DATA = [
  { id: "1", name: "ali", age: 22 },
  { id: "2", name: "javad", age: 12 },
  { id: "3", name: "aydin", age: 38 },
] as const;

export const COMPOUND_BORDER_STYLE = {
  border: "1px solid #f1f1f1",
  borderRadius: "7px",
} as const;
