import { describe, expect, it, vi } from "vitest";

import PageCompoundHeader from "../components/pageCompound/components/header";
import PageCompoundBody from "../components/pageCompound/components/body";
import PageCompoundFooter from "../components/pageCompound/components/footer";
import {
  getComponentDisplayName,
  resolveCompoundSlots,
} from "./resolveCompoundSlots";

const PAGE_PREFIX = "compound-page-";
const PAGE_SLOTS = ["header", "body", "footer"] as const;

const pageDefaults = [
  <PageCompoundHeader key="header" />,
  <PageCompoundBody key="body" />,
  <PageCompoundFooter key="footer" />,
];

const baseParams = {
  checkDisplayName: PAGE_PREFIX,
  defaultsDisplayNames: [...PAGE_SLOTS],
  defaultComponents: pageDefaults,
};

describe("resolveCompoundSlots", () => {
  it("renders all default slot components when no children are provided", () => {
    const result = resolveCompoundSlots({ ...baseParams, children: undefined });

    expect(result.hasAllSlots).toBe(false);
    expect(result.finalChildren).toEqual(pageDefaults);
  });

  it("uses provided children when all default slots are supplied", () => {
    const children = (
      <>
        <PageCompoundHeader />
        <PageCompoundBody />
        <PageCompoundFooter />
      </>
    );

    const result = resolveCompoundSlots({ ...baseParams, children });

    expect(result.hasAllSlots).toBe(true);
    expect(result.finalChildren).toBe(children);
  });

  it("merges partial custom slots with default components", () => {
    const result = resolveCompoundSlots({
      ...baseParams,
      children: <PageCompoundHeader />,
    });

    expect(result.hasAllSlots).toBe(false);
    expect(Array.isArray(result.finalChildren)).toBe(true);

    const resolved = result.finalChildren as JSX.Element[];
    expect(getComponentDisplayName(resolved[0].type)).toBe("compound-page-header");
    expect(getComponentDisplayName(resolved[1].type)).toBe("compound-page-body");
    expect(getComponentDisplayName(resolved[2].type)).toBe("compound-page-footer");
  });

  it("collects custom non-slot children separately", () => {
    const result = resolveCompoundSlots({
      ...baseParams,
      children: (
        <>
          <span>plain</span>
          <PageCompoundHeader />
        </>
      ),
    });

    expect(result.customChildren).toHaveLength(1);
    expect(result.customChildren[0].type).toBe("span");
  });

  it("requires each slot name to be present, not just a matching count", () => {
    const result = resolveCompoundSlots({
      ...baseParams,
      children: (
        <>
          <PageCompoundHeader />
          <PageCompoundHeader />
          <PageCompoundHeader />
        </>
      ),
    });

    expect(result.hasAllSlots).toBe(false);
  });

  it("ignores slot components whose displayName does not match the prefix", () => {
    function WrongHeader() {
      return <span>wrong</span>;
    }
    WrongHeader.displayName = "other-prefix-header";

    const result = resolveCompoundSlots({
      ...baseParams,
      children: <WrongHeader />,
    });

    expect(result.hasAllSlots).toBe(false);
    expect(Array.isArray(result.finalChildren)).toBe(true);
  });
});

describe("useFilterNodeChildren warning behavior", () => {
  it("warns when custom non-slot children exist without all slots", async () => {
    const { default: useFilterNodeChildren } = await import("./useFilterNodeChildren");
    const { renderHook } = await import("@testing-library/react");
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    renderHook(() =>
      useFilterNodeChildren({
        ...baseParams,
        children: (
          <>
            <span>extra</span>
            <PageCompoundHeader />
          </>
        ),
      }),
    );

    expect(warnSpy).toHaveBeenCalledWith(
      "To render custom elements inside a compound section, provide all default slot components to the parent.",
    );

    warnSpy.mockRestore();
  });

  it("does not warn when all slots are provided even with extra custom children", async () => {
    const { default: useFilterNodeChildren } = await import("./useFilterNodeChildren");
    const { renderHook } = await import("@testing-library/react");
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    renderHook(() =>
      useFilterNodeChildren({
        ...baseParams,
        children: (
          <>
            <span>extra</span>
            <PageCompoundHeader />
            <PageCompoundBody />
            <PageCompoundFooter />
          </>
        ),
      }),
    );

    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
