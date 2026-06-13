# Audit Report: `pageCompound` & `tableCompound`

> **Scope:** `src/components/pageCompound/`, `src/components/tableCompound/`, `src/hooks/useFilterNodeChildren.ts`, و utilityهای وابسته (`errorBoundary`, `fallback`)  
> **Date:** 2026-06-13  
> **Reviewer role:** Senior Software Architect / Staff Engineer

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Prioritized Action Plan](#prioritized-action-plan)
3. [Architecture](#architecture)
4. [Clean Code & SOLID](#clean-code--solid)
5. [Code Quality & Anti-patterns](#code-quality--anti-patterns)
6. [React / Frontend Best Practices](#react--frontend-best-practices)
7. [TypeScript](#typescript)
8. [Performance](#performance)
9. [Security](#security)
10. [Maintainability](#maintainability)
11. [Project Structure](#project-structure)
12. [Testing](#testing)
13. [Accessibility](#accessibility)
14. [Documentation](#documentation)

---

## Executive Summary

این پروژه الگوی **Compound Components** را با Context API و hook سفارشی `useFilterNodeChildren` پیاده کرده است. ایده معماری خوب است، اما در لایه implementation چند **باگ runtime**، **coupling شدید** بین `tableCompound` و `pageCompound`، **mutation در render**، و **type safety ضعیف** وجود دارد که scalability و testability را محدود می‌کند.

### Top 10 Most Important Improvements

| # | Improvement | Severity |
|---|-------------|----------|
| 1 | Refactor `useFilterNodeChildren` — حذف mutation در render و fix منطق slot resolution | Critical |
| 2 | Fix باگ `DeleteHandler` — mismatch تعداد argumentها | Critical |
| 3 | Pass کردن `index` به `TableCompoundRow` در body map | Critical |
| 4 | Decouple `tableCompound` از `pageCompound` — data از props/context injectable | High |
| 5 | Break circular dependency: `actions.tsx` → `pageCompound.tsx` | High |
| 6 | Fix `ErrorBoundary` — استفاده از `setState` به‌جای mutate مستقیم state | High |
| 7 | Memoize کردن Context values (`useMemo`) برای جلوگیری از re-render زنجیره‌ای | High |
| 8 | تعریف generic types برای row data به‌جای `any` | High |
| 9 | حذف Contextهای خالی و dead code | Medium |
| 10 | افزودن unit/integration tests برای compound slot logic | Medium |

### Scores (0–10)

| Category | Score | Rationale |
|----------|-------|-----------|
| **Architecture** | 5/10 | الگوی compound خوب است؛ coupling، circular deps، و hardcoded data scalability را پایین می‌آورد |
| **Code Quality** | 4/10 | mutation در render، dead code، console.log، handlerهای ناقص |
| **TypeScript** | 3/10 | `any` گسترده، contextهای fake-typed با `{} as`، genericهای استفاده‌نشده |
| **Performance** | 5/10 | Context بدون memoization؛ inline JSX در hook args؛ re-render غیرضروری |
| **Security** | 7/10 | React escaping پیش‌فرض؛ ریسک XSS پایین؛ input validation ندارد |
| **Maintainability** | 4/10 | naming ناهمگون، duplication در Actions pattern، بدون tests/docs |

---

## Prioritized Action Plan

### Phase 1 — Critical Fixes (هفته 1)
1. Rewrite `useFilterNodeChildren` با pure computation در `useMemo`
2. Fix `DeleteHandler` call signature در `delete.tsx`
3. Pass `index={_index}` به `TableCompoundRow`
4. Fix `addHandler` stale closure با functional update
5. Fix `ErrorBoundary.componentDidCatch` با `setState`

### Phase 2 — Architecture (هفته 2–3)
6. Extract `TableDataContext` مستقل — `tableCompound` فقط از آن بخواند
7. Extract `usePageCompoundContext` به فایل جدا (`context.ts`) برای break circular deps
8. Props-driven data: `PageCompound` داده mock را از props بگیرد
9. Shared `CompoundActions` abstraction برای DRY بین page/table actions

### Phase 3 — Quality & DX (هفته 4)
10. Type definitions مرکزی (`types/page.types.ts`, `types/table.types.ts`)
11. Memoize همه Context provider values
12. حذف dead code، unused imports، console.log
13. Constants file برای columns/captions پیش‌فرض

### Phase 4 — Testing & A11y (هفته 5)
14. Unit tests برای `useFilterNodeChildren`
15. Integration tests برای compound composition
16. ARIA labels، semantic HTML، keyboard navigation

---

## Architecture

---

### ARCH-01: Tight Coupling — `tableCompound` وابسته مستقیم به `pageCompound`

**Severity:** High

**Why it's a problem:**  
`TableCompoundBody` و `TableCompoundFooter` مستقیماً `usePageCompoundContext()` را import می‌کنند. جدول بدون PageCompound قابل استفاده نیست.

**Impact:**  
- نقض Separation of Concerns  
- غیرقابل reuse در صفحات دیگر  
- تست unit جدول بدون mount کل PageCompound  

**Current code:**

```tsx
// src/components/tableCompound/components/body.tsx
import { usePageCompoundContext } from "../../pageCompound/pageCompound";

const TableCompoundBody = ({ filter = () => true, children }: MyComponentProps) => {
    const { data } = usePageCompoundContext()
    // ...
}
```

**Improved version:**

```tsx
// src/components/tableCompound/context/tableDataContext.ts
export const TableDataContext = createContext<TableDataContextValue | null>(null);

export function useTableData() {
  const ctx = useContext(TableDataContext);
  if (!ctx) throw new Error("useTableData must be used within TableDataProvider");
  return ctx;
}

// src/components/pageCompound/pageCompound.tsx
<PageCompoundContext.Provider value={pageValue}>
  <TableDataContext.Provider value={{ data, setData }}>
    {FinalChildren}
  </TableDataContext.Provider>
</PageCompoundContext.Provider>

// src/components/tableCompound/components/body.tsx
const { data } = useTableData();
```

**Why better:**  
جدول به abstraction مستقل وابسته می‌شود. PageCompound فقط provider را inject می‌کند. OCP رعایت می‌شود.

---

### ARCH-02: Circular Dependency

**Severity:** High

**Why it's a problem:**  
زنجیره import: `pageCompound.tsx` → `header.tsx` → `actions.tsx` → `pageCompound.tsx`

**Impact:**  
- bundler warnings  
- undefined exports در edge cases  
- refactor و tree-shaking سخت‌تر  

**Current code:**

```tsx
// src/components/pageCompound/components/actions.tsx
import { usePageCompoundContext } from "../pageCompound";
```

**Improved version:**

```tsx
// src/components/pageCompound/context/pageCompoundContext.ts
export const PageCompoundContext = createContext<PageCompoundContextValue | null>(null);
export function usePageCompoundContext() {
  const ctx = useContext(PageCompoundContext);
  if (!ctx) throw new Error("usePageCompoundContext must be used within PageCompound");
  return ctx;
}

// actions.tsx
import { usePageCompoundContext } from "../context/pageCompoundContext";
```

**Why better:**  
Context از root component جدا می‌شود. هیچ sub-component مستقیماً root را import نمی‌کند.

---

### ARCH-03: Hardcoded Business Data در Root Component

**Severity:** Medium

**Why it's a problem:**  
`PageCompound` هم layout provider است هم owner داده mock.

**Impact:**  
- نقض SRP  
- component غیرقابل استفاده در production بدون fork  
- تست با data مختلف سخت  

**Current code:**

```tsx
// src/components/pageCompound/pageCompound.tsx
function PageCompound({ children }: { children?: React.ReactNode }) {
    const [data, setData] = useState([
        { name: "ali", age: 22 },
        { name: "javad", age: 12 },
        { name: "aydin", age: 38 }
    ])
```

**Improved version:**

```tsx
type PageCompoundProps<T extends Record<string, unknown>> = {
  children?: React.ReactNode;
  initialData?: T[];
  onDataChange?: (data: T[]) => void;
};

function PageCompound<T extends Record<string, unknown>>({
  children,
  initialData = [],
  onDataChange,
}: PageCompoundProps<T>) {
  const [data, setData] = useState(initialData);
  // optionally sync with onDataChange via useEffect
}
```

**Why better:**  
Container/Presentational separation. داده از بیرون inject می‌شود.

---

### ARCH-04: Hardcoded Table Config در Body

**Severity:** Medium

**Why it's a problem:**  
columns/captions در Body hardcode شده؛ Body نباید schema جدول را بشناسد.

**Impact:**  
- هر entity جدید نیاز به edit Body دارد  
- OCP نقض می‌شود  

**Current code:**

```tsx
// src/components/pageCompound/components/body.tsx
<TableCompound columns={["name", "age"]} captions={["name", "age"]}>
```

**Improved version:**

```tsx
// constants/defaultTableConfig.ts
export const DEFAULT_USER_TABLE = {
  columns: ["name", "age"] as const,
  captions: ["Name", "Age"],
};

// body.tsx — or pass via PageCompound props
<TableCompound {...DEFAULT_USER_TABLE}>
```

**Why better:**  
Configuration متمرکز و قابل override از props.

---

### ARCH-05: Empty Context Providers (Architecture Smell)

**Severity:** Medium

**Why it's a problem:**  
چند Context با value خ `{}` تعریف شده بدون استفاده واقعی.

**Impact:**  
- cognitive overhead  
- false promise of extensibility  
- re-render بدون benefit  

**Current code:**

```tsx
// header.tsx
const PageCompoundHeaderContext = createContext({});
// ...
<PageCompoundHeaderContext.Provider value={{}}>

// body.tsx — TableCompoundBodyContext
<TableCompoundBodyContext.Provider value={{  }}>

// row.tsx — TableCompoundRowContext
<TableCompoundRowContext.Provider value={{}}>
```

**Improved version:**

```tsx
// Remove until actually needed (YAGNI)
// OR define meaningful shape:
type PageCompoundHeaderContextValue = {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
};
```

**Why better:**  
فقط Contextهایی که value واقعی دارند باقی می‌مانند.

---

## Clean Code & SOLID

---

### SOLID-01: SRP Violation — `PageCompound` چند مسئولیت

**Severity:** Medium

**Why:** Root هم state، هم slot orchestration، هم ErrorBoundary، هم default children.

**Impact:** فایل root بزرگ می‌شود؛ تغییر data logic روی layout اثر می‌گذارد.

**Improved:** Split به:
- `PageCompoundProvider` (state + context)
- `PageCompoundLayout` (slot rendering)
- `PageCompound` (composition export)

---

### SOLID-02: OCP Violation — Slot Matching با String `displayName`

**Severity:** Medium

**Why:** افزودن slot جدید = edit hook + edit defaultsDisplayNames + edit displayName strings.

**Current code:**

```tsx
checkDisplayName: "compound-page-",
defaultsDisplayNames: ['header', 'body', 'footer'],
// ...
if ((_node as any).type.displayName === `${checkDisplayName}${name}`)
```

**Improved version:**

```tsx
// Use Symbol or static slot marker
const PAGE_SLOTS = {
  header: PageCompoundHeader,
  body: PageCompoundBody,
  footer: PageCompoundFooter,
} as const;

function resolveSlots(children: ReactNode, slots: typeof PAGE_SLOTS) {
  const childMap = new Map(
    Children.toArray(children)
      .filter(isValidElement)
      .map(child => [child.type, child])
  );
  return Object.entries(slots).map(([key, Default]) =>
    childMap.get(Default) ?? <Default key={key} />
  );
}
```

**Why better:** Type-safe، بدون magic string، refactor-friendly.

---

### CLEAN-01: Inconsistent Naming Conventions

**Severity:** Low

| Current | Issue | Suggested |
|---------|-------|-----------|
| `CompoundPageBody` | برعکس prefix | `PageCompoundBody` |
| `ExcelHandler` vs `addHandler` | casing ناهمگون | `excelHandler` |
| `getTest` | نام مبهم | حذف یا rename به `logDebug` |
| `IProps`, `MyComponentProps` | generic names | `TableCompoundProps`, `TableBodyProps` |
| `_row`, `_index`, `_cap` | underscore prefix بی‌فایده | `row`, `index`, `caption` |

---

### CLEAN-02: Misleading UI — Add Button با Emoji سطل زباله

**Severity:** Low

**Current code:**

```tsx
// src/components/pageCompound/components/btns/add.tsx
<button onClick={...}>🗑</button>
```

**Improved:**

```tsx
<button type="button" aria-label="Add row" onClick={...}>+ Add</button>
```

---

## Code Quality & Anti-patterns

---

### QUAL-01: Mutation During Render در `useFilterNodeChildren`

**Severity:** Critical

**Why it's a problem:**  
Hook در هر render:
1. `FinalChildren.current` را mutate می‌کند
2. `defaultComponentsState` (خروجی useMemo) را mutate می‌کند
3. side effect در render phase دارد

**Impact:**  
- رفتار non-deterministic  
- با Strict Mode React double-render مشکل‌ساز  
- slot resolution اشتباه بعد از re-render  

**Current code:**

```tsx
// src/hooks/useFilterNodeChildren.ts
const defaultComponentsState = useMemo(() => [...defaultComponents], [defaultComponents]);
const FinalChildren = useRef<ReactElement[]>(Array(defaultComponentsState.length).fill(null));

const RenderResult = (_node: any, _index: number) => {
  defaultsDisplayNames.map((name, _iName) => {
    if ((_node as any).type.displayName === `${checkDisplayName}${name}`) {
      if (getTableCompoundDefaultComponents.length === defaultsDisplayNames.length) {
        FinalChildren.current[_index] = _node;
      } else {
        defaultComponentsState[_iName] = _node; // MUTATION!
      }
    }
  })
};
getTableCompoundDefaultComponents.map(RenderResult);
const result = FinalChildren.current.every(...) ? children : defaultComponentsState;
```

**Improved version:**

```tsx
export function useFilterNodeChildren({
  children,
  checkDisplayName,
  defaultsDisplayNames,
  defaultComponents,
}: UseFilterNodeChildrenParams) {
  return useMemo(() => {
    const childArray = Children.toArray(children).filter(isValidElement) as ReactElement[];

    const matchedSlots = childArray.filter(
      (child) =>
        typeof (child.type as { displayName?: string }).displayName === "string" &&
        (child.type as { displayName: string }).displayName.startsWith(checkDisplayName)
    );

    const hasAllSlots = matchedSlots.length === defaultsDisplayNames.length;

    if (hasAllSlots) {
      return { finalChildren: children, customChildren: [] as ReactElement[] };
    }

    const slotMap = new Map<string, ReactElement>();
    matchedSlots.forEach((node) => {
      const name = (node.type as { displayName: string }).displayName;
      defaultsDisplayNames.forEach((slot) => {
        if (name === `${checkDisplayName}${slot}`) slotMap.set(slot, node);
      });
    });

    const finalChildren = defaultsDisplayNames.map((slot, i) =>
      slotMap.get(slot) ?? (defaultComponents[i] as ReactElement)
    );

    const customChildren = childArray.filter(
      (child) => !(child.type as { displayName?: string }).displayName
    );

    return { finalChildren, customChildren };
  }, [children, checkDisplayName, defaultsDisplayNames, defaultComponents]);
}
```

**Why better:** Pure computation، idempotent، testable، بدون ref mutation.

---

### QUAL-02: `DeleteHandler` Signature Mismatch — Runtime Bug

**Severity:** Critical

**Why:** Handler دو parameter می‌خواهد؛ caller فقط یکی می‌فرستد.

**Impact:**  
`DeleteHandler(row)` → `e` برابر row object، `_row` برابر `undefined`. delete عملاً کار نمی‌کند.

**Current code:**

```tsx
// actions.tsx
const DeleteHandler = (e: React.MouseEvent<HTMLElement>, _row: any) => { console.log(e); }

// btns/delete.tsx
return <button onClick={() => onClick ? onClick(row) : DeleteHandler(row)}>delete</button>
```

**Improved version:**

```tsx
// actions.tsx
const deleteHandler = (row: RowData, event?: React.MouseEvent<HTMLElement>) => {
  event?.stopPropagation();
  // actual delete logic with setData
};

// delete.tsx
<button onClick={(e) => onClick ? onClick(row) : deleteHandler(row, e)}>Delete</button>
```

**Why better:** Signature consistent؛ event و row هر دو در دسترس.

---

### QUAL-03: Missing `index` Prop در Row Map — TypeScript/runtime gap

**Severity:** Critical

**Why:** `TableCompoundRow` نیاز به `index: number` دارد؛ در map پاس داده نمی‌شود.

**Current code:**

```tsx
// tableCompound/components/body.tsx
<TableCompoundRow key={_index} row={_row} />
// index prop missing!
```

**Improved version:**

```tsx
<TableCompoundRow key={row.id ?? index} row={row} index={index} />
```

**Why better:** Actions و future features به index نیاز دارند؛ TypeScript error هم باید catch کند (با strict props).

---

### QUAL-04: Stale Closure در `addHandler`

**Severity:** High

**Why:** `setData(() => [...data, newItem])` از closure stale `data` استفاده می‌کند.

**Current code:**

```tsx
const addHandler = () => {
    setData(() => {
        return [...data, { name: "John", age: 55 }]
    })
}
```

**Improved version:**

```tsx
const addHandler = useCallback(() => {
  setData((prev) => [...prev, { name: "John", age: 55 }]);
}, [setData]);
```

**Why better:** Functional update همیشه latest state را می‌گیرد.

---

### QUAL-05: ErrorBoundary Mutates State Directly

**Severity:** High

**Why:** `this.state.errorMessage = error.message` در `componentDidCatch` anti-pattern است.

**Impact:** ممکن است re-render با message قدیمی یا null رخ دهد.

**Current code:**

```tsx
componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(error)
    this.state.errorMessage = error.message  // WRONG
}
```

**Improved version:**

```tsx
componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
  console.error(error, errorInfo);
  this.setState({ errorMessage: error.message });
}

static getDerivedStateFromError(error: Error) {
  return { hasError: true, errorMessage: error.message };
}
```

---

### QUAL-06: Dead Code & Unused Imports

**Severity:** Medium

| Location | Issue |
|----------|-------|
| `pageCompound.tsx` | `getTest` — فقط console.log |
| `body.tsx` | commented imports (`ReactElement`, duplicate TableCompound import) |
| `body.tsx` | `bodyState1` set but never read |
| `tableCompound/body.tsx` | `useState`, `SetStateAction` imported unused |
| `tableCompound/body.tsx` | `data?: any[]` prop defined but never used |
| `pageCompound.tsx`, `tableCompound.tsx` | `{/* {CustomChildren} */}` dead comments |
| `tableCompound.tsx` | `console.log("re-render")` |
| `ExcelComponent`, `PrintComponent` | handlers در Actions خالی؛ buttons به context وصل نیستند |

---

### QUAL-07: Fragile `displayName.includes()` Matching

**Severity:** Medium

**Current code:**

```tsx
(_childNode as any).type.displayName.includes(checkDisplayName)
```

**Why problematic:** `"compound-page-"` داخل `"not-compound-page-header"` هم match می‌شود (edge case). بهتر: `startsWith` یا equality.

---

### QUAL-08: Duplicate Actions Pattern (DRY Violation)

**Severity:** Medium

**Why:** `pageCompound/components/actions.tsx` و `tableCompound/components/actions.tsx` تقریباً identical structure دارند (context + render prop + default buttons).

**Improved:** Extract generic `createActionsCompound()` factory یا shared `CompoundActions` base.

---

### QUAL-09: `useEffect` Dependency Anti-pattern

**Severity:** Medium

**Current code:**

```tsx
useEffect(() => {
  if (getCustomChildren().length > 0) { console.warn(...) }
}, [getCustomChildren().length])  // function call in deps — wrong
```

**Improved:**

```tsx
const customChildren = useMemo(() => getCustomChildren(), [children]);
useEffect(() => {
  if (customChildren.length > 0) console.warn(...);
}, [customChildren.length]);
```

---

### QUAL-10: Wrong Table Footer Semantics

**Severity:** Low

**Current code:**

```tsx
<tfoot>
  <tr>
    <th scope="row">Totals</th>
    <td>{data.length} length</td>  // colspan mismatch with multi-column table
  </tr>
</tfoot>
```

**Improved:**

```tsx
<tfoot>
  <tr>
    <td colSpan={columns.length + 1}>{data.length} rows</td>
  </tr>
</tfoot>
```

---

## React / Frontend Best Practices

---

### REACT-01: Context Values Not Memoized

**Severity:** High

**Why:** هر render object جدید `{ data, setData, getTest }` ساخته می‌شود → همه consumers re-render.

**Current code:**

```tsx
<PageCompoundContext.Provider value={{
    data, setData,
    getTest
}}>
```

**Improved version:**

```tsx
const contextValue = useMemo(
  () => ({ data, setData }),
  [data, setData]
);
<PageCompoundContext.Provider value={contextValue}>
```

همین pattern برای `TableCompoundContext`, `PageCompoundActionsContext`, `TableCompoundActionContext`.

---

### REACT-02: Inline JSX در Hook Arguments — Unstable References

**Severity:** Medium

**Current code:**

```tsx
defaultComponents: [
    <PageCompoundHeader key={"header"} />,
    <PageCompoundBody key={"body"} />,
    <PageCompoundFooter key={"footer"} />,
]
```

**Why:** Array JSX هر render reference جدید → useMemo deps بی‌فایده.

**Improved:** Define defaults outside component or with stable module-level constants.

---

### REACT-03: Missing `useCallback` برای Handlers در Context

**Severity:** Medium

Handlers مثل `addHandler`, `DeleteHandler` هر render جدید ساخته می‌شوند → consumers re-render.

---

### REACT-04: Key={index} در List Rendering

**Severity:** Medium

**Current code:**

```tsx
data.filter(filter).map((_row, _index) =>
  <TableCompoundRow key={_index} row={_row} />
)
```

**Improved:** `key={row.id}` یا composite stable key.

---

### REACT-05: Redux Installed but Unused

**Severity:** Low

`@reduxjs/toolkit` و `react-redux` در package.json هستند ولی در compoundها استفاده نشده. یا حذف شوند یا برای server state استفاده شوند — dependency bloat.

---

### REACT-06: Component Composition — Good Patterns Present

**Positive notes (برای حفظ):**
- Static sub-component assignment (`PageCompound.Header = ...`)
- Render prop pattern در Actions
- ErrorBoundary wrapper در root compounds
- Optional children override در Header/Body

---

## TypeScript

---

### TS-01: Widespread `any` Abuse

**Severity:** High

**Examples:**

```tsx
setData: React.Dispatch<SetStateAction<any>>
addHandler: (args?: any) => any
filter?: (item: any) => boolean | any
row: any
(_node as any).type.displayName
```

**Improved:**

```tsx
// types/user.types.ts
export type UserRow = { id: string; name: string; age: number };

export type PageCompoundContextValue = {
  data: UserRow[];
  setData: React.Dispatch<React.SetStateAction<UserRow[]>>;
};
```

---

### TS-02: Fake Context Typing با `{} as`

**Severity:** High

**Current:**

```tsx
const PageCompoundContext = createContext({} as { data: ..., setData: ... });
```

**Improved:**

```tsx
const PageCompoundContext = createContext<PageCompoundContextValue | null>(null);

export function usePageCompoundContext() {
  const ctx = useContext(PageCompoundContext);
  if (!ctx) throw new Error("...");
  return ctx;
}
```

---

### TS-03: Wrong Filter Return Type

**Severity:** Medium

```tsx
filter?: (item: any) => boolean | any;
```

Filter باید `(item: T) => boolean` باشد — `| any` type safety را از بین می‌برد.

---

### TS-04: Discriminated Union در Row — Good but Incomplete

**Severity:** Low

`Optional | Required` union در `row.tsx` خوب است ولی `index` در Optional branch required است در حالی که usage بدون index وجود دارد.

---

### TS-05: Missing Generic Inference Opportunities

**Severity:** Medium

`PageCompound` و `TableCompound` می‌توانند generic `<T extends Record<string, unknown>>` باشند تا columns با keyof T type-safe شوند:

```tsx
columns: (keyof T & string)[]
```

---

## Performance

---

### PERF-01: Unnecessary Re-renders از Context (see REACT-01)

**Severity:** High

---

### PERF-02: `console.log("re-render")` در Production Path

**Severity:** Low

```tsx
// tableCompound.tsx
console.log("re-render")
```

---

### PERF-03: Memoization Opportunities

**Severity:** Medium

| Component | Suggestion |
|-----------|------------|
| `TableCompoundRow` | `React.memo` اگر parent часто re-render |
| `Td` | memoize column cells |
| `filter` callback | consumer باید `useCallback` کند |

---

### PERF-04: Lazy Loading / Code Splitting

**Severity:** Low

Button handlers (Excel export, Print) می‌توانند lazy load شوند چون heavy خواهند شد:

```tsx
const ExcelExport = lazy(() => import('./btns/excel'));
```

---

### PERF-05: Bundle Size — styled-components + tailwind هر دو present

**Severity:** Low  
Compound components فقط inline style و tailwind class استفاده می‌کنند — inconsistency بدون benefit.

---

## Security

---

### SEC-01: XSS — Low Risk (React Default Escaping)

**Severity:** Low

`{row[_col]}` توسط React escape می‌شود. اگر در آینده `dangerouslySetInnerHTML` اضافه شود، risk بالا می‌رود.

---

### SEC-02: No Input Validation on Search

**Severity:** Low

```tsx
<input type="search" placeholder="search" />
```

Search value به filter/logic وصل نیست. وقتی وصل شود، sanitize/limit length لازم است.

---

### SEC-03: No Sensitive Data in localStorage

**Severity:** N/A (not present)

---

### SEC-04: Console Logging User Data

**Severity:** Low

`console.log(_row)`, `console.log(args)` — در production data leakage به DevTools.

---

## Maintainability

---

### MAINT-01: No Shared Design Tokens / Styles

**Severity:** Medium

Border styles تکراری:

```tsx
border: "1px solid #f1f1f1", borderRadius: "7px"
```

**Improved:** Shared `compoundStyles.ts` یا Tailwind component classes.

---

### MAINT-02: No Barrel Exports

**Severity:** Low

Import paths عمیق:

```tsx
import { usePageCompoundContext } from "../../pageCompound/pageCompound";
```

**Improved:**

```tsx
// pageCompound/index.ts
export { default as PageCompound, usePageCompoundContext } from './pageCompound';
```

---

### MAINT-03: No Constants Management

**Severity:** Medium

Magic strings everywhere: `"compound-page-"`, `"header-"`, `"John"`, `55`.

---

### MAINT-04: Reusable Abstractions Missing

**Severity:** Medium

`useFilterNodeChildren` خوب است ولی باید generic typed slot resolver شود — reusable across future compounds (ModalCompound, FormCompound).

---

## Project Structure

---

### STRUCT-01: Folder Naming Inconsistency

**Severity:** Low

| Path | Issue |
|------|-------|
| `pageCompound/` | camelCase |
| `tableCompound/` | camelCase |
| `btns/` | abbreviation — prefer `buttons/` |
| `component.test.tsx` | outside `__tests__/` |

---

### STRUCT-02: Missing Feature Index Structure

**Severity:** Medium

Suggested structure:

```
pageCompound/
├── index.ts
├── PageCompound.tsx
├── context/
├── components/
├── hooks/
└── types/
```

---

### STRUCT-03: Import Organization Inconsistent

**Severity:** Low

بعضی فایل‌ها React default import دارند، بعضی named-only. ESLint `import/order` پیشنهاد می‌شود.

---

## Testing

---

### TEST-01: Zero Test Coverage for Core Logic

**Severity:** High

**Impact:** `useFilterNodeChildren` — پیچیده‌ترین logic — بدون test. refactor = high regression risk.

**Suggested Unit Tests:**

```tsx
describe('useFilterNodeChildren', () => {
  it('renders all defaults when no children provided');
  it('uses custom children when all slots provided');
  it('merges partial custom slots with defaults');
  it('warns when custom non-slot children exist without full slots');
});
```

**Suggested Integration Tests:**

```tsx
describe('PageCompound + TableCompound', () => {
  it('renders default table with mock data');
  it('addHandler adds row to table body');
  it('throws when usePageCompoundContext outside provider');
});
```

---

### TEST-02: Untestable Code — Tight Coupling

**Severity:** High

Table body بدون PageCompound provider crash می‌کند — integration test اجباری.

---

### TEST-03: Existing Test File Superficial

**Severity:** Medium

```tsx
// component.test.tsx
<PageCompound><>sdafads</></PageCompound>
```

No assertions. No testing library. Not runnable structure.

---

## Accessibility

---

### A11Y-01: Buttons Without Accessible Labels

**Severity:** Medium

**Current:**

```tsx
<button>🗑</button>   // add.tsx
<button>🕸</button>   // excel.tsx
<button>👑</button>   // print.tsx
```

**Improved:**

```tsx
<button type="button" aria-label="Add new row">Add</button>
```

---

### A11Y-02: Search Input Without Label

**Severity:** Medium

```tsx
<input type="search" placeholder="search" />
```

**Improved:**

```tsx
<label htmlFor="page-search" className="sr-only">Search</label>
<input id="page-search" type="search" aria-label="Search records" />
```

---

### A11Y-03: Clickable Row Without Keyboard Support

**Severity:** Medium

```tsx
<tr onClick={() => console.log("click")}>
```

**Impact:** keyboard/screen reader users cannot activate row.

**Improved:** Remove onClick or add `tabIndex={0}`, `onKeyDown`, `role="button"`, `aria-label`.

---

### A11Y-04: Table Header Missing `scope`

**Severity:** Low

```tsx
<th style={{ textAlign: "left" }} key={_cap}>
```

**Improved:** `<th scope="col">`

---

### A11Y-05: Action Column Hardcoded English

**Severity:** Low

`<th>action</th>` — i18n و accessibility name needs consideration.

---

## Documentation

---

### DOC-01: Missing README for Compound Pattern

**Severity:** Medium

README پروژه هنوز Vite template default است. باید شامل:
- Compound component usage examples
- Slot override rules
- Context hierarchy diagram
- Customization guide

---

### DOC-02: Misleading Comments

**Severity:** Low

```tsx
/**
 * * PAGE_COMPOUND 
*/
```

JSDoc بی‌فایده. بهتر: `@example` با JSX usage.

---

### DOC-03: TODO Left in Production Code

**Severity:** Low

```tsx
// row.tsx
// todo i have to map on columns and rows here because i need id from each rows
```

---

## Appendix: Full Issue Index

| ID | Title | Severity |
|----|-------|----------|
| ARCH-01 | Tight coupling table → page | High |
| ARCH-02 | Circular dependency | High |
| ARCH-03 | Hardcoded data in root | Medium |
| ARCH-04 | Hardcoded table config in body | Medium |
| ARCH-05 | Empty context providers | Medium |
| SOLID-01 | SRP violation PageCompound | Medium |
| SOLID-02 | OCP violation displayName slots | Medium |
| CLEAN-01 | Inconsistent naming | Low |
| CLEAN-02 | Misleading add button emoji | Low |
| QUAL-01 | Mutation during render in hook | **Critical** |
| QUAL-02 | DeleteHandler signature bug | **Critical** |
| QUAL-03 | Missing index prop on Row | **Critical** |
| QUAL-04 | Stale closure addHandler | High |
| QUAL-05 | ErrorBoundary state mutation | High |
| QUAL-06 | Dead code & unused imports | Medium |
| QUAL-07 | Fragile displayName.includes | Medium |
| QUAL-08 | Duplicate Actions pattern | Medium |
| QUAL-09 | useEffect deps anti-pattern | Medium |
| QUAL-10 | Wrong tfoot colspan | Low |
| REACT-01 | Context not memoized | High |
| REACT-02 | Inline JSX unstable refs | Medium |
| REACT-03 | Missing useCallback handlers | Medium |
| REACT-04 | key={index} | Medium |
| REACT-05 | Redux unused | Low |
| TS-01 | any abuse | High |
| TS-02 | Fake context typing | High |
| TS-03 | Wrong filter type | Medium |
| TS-04 | Incomplete discriminated union | Low |
| TS-05 | Missing generics | Medium |
| PERF-01 | Context re-renders | High |
| PERF-02 | console.log re-render | Low |
| PERF-03 | Memoization opportunities | Medium |
| PERF-04 | Lazy loading | Low |
| PERF-05 | Dual CSS systems | Low |
| SEC-01 | XSS low risk | Low |
| SEC-02 | No search validation | Low |
| SEC-04 | Console data logging | Low |
| MAINT-01 | No design tokens | Medium |
| MAINT-02 | No barrel exports | Low |
| MAINT-03 | No constants file | Medium |
| MAINT-04 | Missing reusable abstractions | Medium |
| STRUCT-01 | Folder naming | Low |
| STRUCT-02 | Missing feature structure | Medium |
| STRUCT-03 | Import organization | Low |
| TEST-01 | Zero coverage hook logic | High |
| TEST-02 | Untestable coupling | High |
| TEST-03 | Superficial test file | Medium |
| A11Y-01 | Button labels | Medium |
| A11Y-02 | Search label | Medium |
| A11Y-03 | Row keyboard | Medium |
| A11Y-04 | th scope | Low |
| A11Y-05 | Hardcoded action column | Low |
| DOC-01 | Missing README | Medium |
| DOC-02 | Misleading comments | Low |
| DOC-03 | TODO in code | Low |

---

*End of audit report.*
