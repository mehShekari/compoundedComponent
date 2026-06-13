import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import PageCompound from "./pageCompound";
import { usePageCompoundContext } from "./context/pageCompoundContext";
import type { UserRow } from "../../types/page.types";

const TEST_DATA: UserRow[] = [
  { id: "1", name: "ali", age: 22 },
  { id: "2", name: "javad", age: 12 },
];

describe("PageCompound integration", () => {
  it("renders default layout with table data from initialData", () => {
    render(<PageCompound initialData={TEST_DATA} />);

    expect(screen.getByText("ali")).toBeInTheDocument();
    expect(screen.getByText("javad")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("2 rows")).toBeInTheDocument();
    expect(screen.getByText("page-Footer")).toBeInTheDocument();
  });

  it("renders default header actions and search controls", () => {
    render(<PageCompound initialData={TEST_DATA} />);

    expect(screen.getByRole("button", { name: /add row/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /export to excel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /print/i })).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: /search records/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /open advanced search/i })).toBeInTheDocument();
  });

  it("adds a row when Add is clicked", async () => {
    const user = userEvent.setup();

    render(<PageCompound initialData={TEST_DATA} />);

    await user.click(screen.getByRole("button", { name: /add row/i }));

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("3 rows")).toBeInTheDocument();
  });

  it("deletes a row when Delete is clicked", async () => {
    const user = userEvent.setup();

    render(<PageCompound initialData={TEST_DATA} />);

    const table = screen.getByRole("table");
    await user.click(within(table).getByRole("button", { name: /delete row ali/i }));

    expect(screen.queryByText("ali")).not.toBeInTheDocument();
    expect(screen.getByText("javad")).toBeInTheDocument();
    expect(screen.getByText("1 rows")).toBeInTheDocument();
  });

  it("supports custom slot composition", () => {
    render(
      <PageCompound initialData={TEST_DATA}>
        <PageCompound.Header />
        <PageCompound.Body />
        <PageCompound.Footer />
      </PageCompound>,
    );

    expect(screen.getByText("ali")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add row/i })).toBeInTheDocument();
  });

  it("throws when usePageCompoundContext is used outside provider", () => {
    function OutsideConsumer() {
      usePageCompoundContext();
      return null;
    }

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<OutsideConsumer />)).toThrow(
      "usePageCompoundContext must be used within PageCompound",
    );

    consoleSpy.mockRestore();
  });

  it("exposes data through context inside PageCompound", () => {
    function DataConsumer() {
      const { data } = usePageCompoundContext();
      return <span data-testid="context-count">{data.length}</span>;
    }

    render(
      <PageCompound initialData={TEST_DATA}>
        <PageCompound.Header />
        <PageCompound.Body>
          <DataConsumer />
        </PageCompound.Body>
        <PageCompound.Footer />
      </PageCompound>,
    );

    expect(screen.getByTestId("context-count")).toHaveTextContent("2");
  });

  it("renders one table row per data item with action buttons", () => {
    render(<PageCompound initialData={TEST_DATA} />);

    const table = screen.getByRole("table");
    const rows = within(table).getAllByRole("row");

    expect(rows.length).toBeGreaterThanOrEqual(4);
    expect(within(table).getAllByRole("button", { name: /edit row/i })).toHaveLength(2);
    expect(within(table).getAllByRole("button", { name: /delete row/i })).toHaveLength(2);
  });
});
