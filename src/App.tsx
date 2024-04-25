import "devextreme/dist/css/dx.light.css";
import { Button, SelectBox, TextBox } from "devextreme-react";
import { FC } from "react";
import { RequiredRule, Validator } from "devextreme-react/validator";

function App() {
  return (
    <>
      <Button text="Test" />
      <SelectBox {...baseProps} label="Weekday (default)" />
      <hr />
      <SelectBox
        {...baseProps}
        label="Weekday (with custom component)"
        fieldComponent={FieldComponent}
      />
    </>
  );
}

type Weekday = { id: string; name: string };

const weekdays: Weekday[] = [
  { id: "mon", name: "Monday" },
  { id: "tue", name: "Tuesday" },
  { id: "wed", name: "Wednesday" },
  { id: "thu", name: "Thursday" },
  { id: "fri", name: "Friday" },
  { id: "sat", name: "Saturday" },
  { id: "sun", name: "Sunday" },
];

const baseProps = {
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

const inputAttrs = {
  role: "combobox",
};

const FieldComponent: FC<{ data: Weekday | null }> = (props) => {
  const { data } = props;
  return <TextBox value={data?.name ?? ""} inputAttr={inputAttrs} />;
};

export default App;
