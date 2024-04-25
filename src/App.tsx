import "devextreme/dist/css/dx.light.css";
import { SelectBox, TextBox } from "devextreme-react";
import { FC, useLayoutEffect } from "react";
import { RequiredRule, Validator } from "devextreme-react/validator";

function App() {
  return (
    <>
      <SelectBox {...baseProps} label="Weekday (default)" />
      <SelectBox
        {...baseProps}
        label="Weekday (with custom component)"
        fieldComponent={FieldComponent}
      />
    </>
  );
}

export type Weekday = { id: string; name: string };

export const weekdays: Weekday[] = [
  { id: "mon", name: "Monday" },
  { id: "tue", name: "Tuesday" },
  { id: "wed", name: "Wednesday" },
  { id: "thu", name: "Thursday" },
  { id: "fri", name: "Friday" },
  { id: "sat", name: "Saturday" },
  { id: "sun", name: "Sunday" },
];

export const baseProps = {
  label: "Weekday",
  items: weekdays,
  displayExpr: "name",
  valueExpr: "id",
  searchEnabled: true,
  searchExpr: "name",
  searchMode: "contains",
  children: (
    <Validator>
      <RequiredRule />
    </Validator>
  ),
} as const;

export const inputAttrs = {
  role: "combobox",
  id: "workaround",
};

export const FieldComponent: FC<{
  data: Weekday | null;
  onRendered: () => void;
}> = (props) => {
  const { data, onRendered } = props;

  useLayoutEffect(() => onRendered(), [onRendered]);

  return (
    <>
      <label
        style={{ position: "absolute", top: -100, left: -100 }}
        htmlFor="workaround"
      >
        Weekday
      </label>
      <TextBox value={data?.name ?? ""} inputAttr={inputAttrs} />
    </>
  );
};

export default App;
