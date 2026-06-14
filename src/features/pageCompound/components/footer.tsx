import { COMPOUND_BORDER_STYLE } from "../../constants/defaultTableConfig";

const PageCompoundFooter = () => (
  <div
    style={{
      ...COMPOUND_BORDER_STYLE,
      padding: "5px",
      marginTop: "5px",
    }}
  >
    page-Footer
  </div>
);

PageCompoundFooter.displayName = "compound-page-footer";
export default PageCompoundFooter;
