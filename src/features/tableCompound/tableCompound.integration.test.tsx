import React, { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom/vitest'

import { describe, expect, it, vi } from "vitest";

import TableCompound, { TableDataContext } from "./tableCompound";
import { useTableData } from "./context/tableDataContext";
import type { UserRow } from "../../types/page.types";

const INITIAL_DATA: UserRow[] = [
  { id: "1", name: "sara", age: 30 },
  { id: "2", name: "reza", age: 25 },
];

function TableDataProvider({
  initialData,
  children,
}: {
  initialData: UserRow[];
  children: React.ReactNode;
}) {
  const [data, setData] = useState(initialData);

  return (
    <TableDataContext.Provider value={{ data, setData }}>
      {children}
    </TableDataContext.Provider>
  );
}

describe("TableCompound integration", () => {
  it("renders table with columns and data when wrapped in TableDataContext", () => {
    render(
      <TableDataProvider initialData={INITIAL_DATA}>
        <TableCompound columns={["name", "age"]} captions={["Name", "Age"]}>
          <TableCompound.Header />
          <TableCompound.Body />
          <TableCompound.Footer />
        </TableCompound>
      </TableDataProvider>,
    );

    expect(screen.getByText("sara")).toBeInTheDocument();
    expect(screen.getByText("reza")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("2 rows")).toBeInTheDocument();
  });

  it("deletes a row independently of PageCompound", async () => {
    const user = userEvent.setup();

    render(
      <TableDataProvider initialData={INITIAL_DATA}>
        <TableCompound columns={["name", "age"]} captions={["Name", "Age"]}>
          <TableCompound.Header />
          <TableCompound.Body />
          <TableCompound.Footer />
        </TableCompound>
      </TableDataProvider>,
    );

    const table = screen.getByRole("table");
    await user.click(within(table).getByRole("button", { name: /delete row sara/i }));

    expect(screen.queryByText("sara")).not.toBeInTheDocument();
    expect(screen.getByText("reza")).toBeInTheDocument();
    expect(screen.getByText("1 rows")).toBeInTheDocument();
  });

  it("supports custom body render prop", () => {
    render(
      <TableDataProvider initialData={INITIAL_DATA}>
        <TableCompound columns={["name", "age"]} captions={["Name", "Age"]}>
          <TableCompound.Header />
          <TableCompound.Body>
            {({ item }) => (
              <tr data-testid={`row-${item.id}`}>
                <td>{item.name}</td>
              </tr>
            )}
          </TableCompound.Body>
        </TableCompound>
      </TableDataProvider>,
    );

    expect(screen.getByTestId("row-1")).toHaveTextContent("sara");
    expect(screen.getByTestId("row-2")).toHaveTextContent("reza");
  });

  it("filters rows when filter prop is provided", () => {
    render(
      <TableDataProvider initialData={INITIAL_DATA}>
        <TableCompound columns={["name", "age"]} captions={["Name", "Age"]}>
          <TableCompound.Header />
          <TableCompound.Body filter={(item) => item.age >= 30} />
          <TableCompound.Footer />
        </TableCompound>
      </TableDataProvider>,
    );

    const table = screen.getByRole("table");
    expect(within(table).getByText("sara")).toBeInTheDocument();
    expect(within(table).queryByText("reza")).not.toBeInTheDocument();
    expect(screen.getByText("2 rows")).toBeInTheDocument();
  });

  it("throws when useTableData is used outside provider", () => {
    function OutsideConsumer() {
      useTableData();
      return null;
    }

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<OutsideConsumer />)).toThrow(
      "useTableData must be used within TableDataContext.Provider",
    );

    consoleSpy.mockRestore();
  });
});
