import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { SelectBox } from "devextreme-react/select-box";
import { FieldComponent, Weekday, baseProps, weekdays } from "./App";
import userEvent from "@testing-library/user-event";
import { FC, ReactNode, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

describe("<App />", () => {
  describe("default", () => {
    test("renders a combobox", () => {
      render(<SelectBox {...baseProps} />);

      expect(
        screen.getByRole("combobox", { name: /Weekday/ })
      ).toBeInTheDocument();
    });

    test("renders the dropdown options", async () => {
      const user = userEvent.setup();
      render(<SelectBox {...baseProps} />);

      await user.click(screen.getByLabelText(/Weekday/));

      expect(
        screen.getByRole("option", { name: /Sunday/ })
      ).toBeInTheDocument();
    });

    test("renders the dropdown options async", async () => {
      const user = userEvent.setup();
      render(
        <AsyncWrapper>
          {(items) => <SelectBox {...baseProps} items={items} />}
        </AsyncWrapper>
      );

      await user.click(screen.getByLabelText(/Weekday/));

      expect(
        screen.getByRole("option", { name: /Sunday/ })
      ).toBeInTheDocument();
    });
  });

  describe("with fieldComponent", () => {
    /**
     * Doesn't work, the textbo does not have the combobox role
     * even if we pass it to the textbox via inputAttr
     */
    test("renders a combobox", () => {
      render(
        <SelectBox
          {...baseProps}
          label="Weekday"
          fieldComponent={FieldComponent}
        />
      );

      expect(
        screen.getByRole("combobox", { name: /Weekday/ })
      ).toBeInTheDocument();
    });

    test("renders the dropdown options", async () => {
      const user = userEvent.setup();
      render(<SelectBox {...baseProps} fieldComponent={FieldComponent} />);

      await user.click(screen.getByLabelText(/Weekday/));

      expect(
        screen.getByRole("option", { name: /Sunday/ })
      ).toBeInTheDocument();
    });

    /**
     * Doesn't work, async options are not rendered.
     */
    test("renders the dropdown options async", async () => {
      const user = userEvent.setup();
      render(
        <AsyncWrapper>
          {(items) => (
            <SelectBox
              {...baseProps}
              fieldComponent={FieldComponent}
              items={items}
            />
          )}
        </AsyncWrapper>
      );

      await user.click(screen.getByLabelText(/Weekday/));

      expect(
        screen.getByRole("option", { name: /Sunday/ })
      ).toBeInTheDocument();
    });
  });
});

function useItems() {
  return useQuery({
    queryKey: ["items"],
    queryFn: async () => weekdays,
  });
}

const AsyncWrapper: FC<{ children: (items: Weekday[]) => ReactNode }> = (
  props
) => {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0,
            gcTime: 0,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
          },
        },
      })
  );
  return (
    <QueryClientProvider client={client}>
      <AsyncWrapperInner {...props} />
    </QueryClientProvider>
  );
};

const AsyncWrapperInner: FC<{ children: (items: Weekday[]) => ReactNode }> = (
  props
) => {
  const { data } = useItems();
  return <div>{props.children(data ?? [])}</div>;
};
