import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { SelectBox } from "devextreme-react/select-box";
import { FieldComponent, Weekday, baseProps, weekdays } from "./App";
import userEvent from "@testing-library/user-event";
import { FC, PropsWithChildren, ReactNode, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { Button } from "devextreme-react";

describe("<App />", () => {
  describe("default", () => {
    test("renders a combobox", () => {
      render(<SelectBox {...baseProps} />);

      expect(
        screen.getByRole("combobox", { name: /Weekday/ })
      ).toBeInTheDocument();
    });

    test("adds the aria attributes on the combobox", () => {
      render(<SelectBox {...baseProps} />);

      const input = screen.getByLabelText(/Weekday/);

      expect(input).toHaveAttribute("aria-expanded", "false");
      expect(input).toHaveAttribute("aria-haspopup", "listbox");
      expect(input).toHaveAttribute("aria-autocomplete", "list");
    });

    test("marks the combobox as readOnly", () => {
      render(<SelectBox {...baseProps} readOnly />);
      expect(screen.getByLabelText(/Weekday/)).toHaveAttribute("readonly");
    });

    test("marks the combobox as required", () => {
      render(<SelectBox {...baseProps} />);
      expect(screen.getByLabelText(/Weekday/)).toBeRequired();
    });

    test("marks the combobox as invalid on submit", async () => {
      const user = userEvent.setup();

      render(
        <FormWrapper>
          <SelectBox {...baseProps} />
        </FormWrapper>
      );

      await user.click(screen.getByText(/Submit/));

      expect(screen.getByLabelText(/Weekday/)).toBeInvalid();
    });

    test("marks the combobox when clearing the value", async () => {
      const user = userEvent.setup();

      render(<SelectBox {...baseProps} />);

      await user.click(screen.getByLabelText(/Weekday/));
      await user.click(screen.getByRole("option", { name: /Monday/ }));
      await user.clear(screen.getByLabelText(/Weekday/));
      await user.tab();

      expect(screen.getByLabelText(/Weekday/)).toBeInvalid();
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

    /**
     * Doesn't work, some of the attributes are missing
     */
    test("adds the aria attributes on the combobox", () => {
      render(<SelectBox {...baseProps} fieldComponent={FieldComponent} />);

      const input = screen.getByLabelText(/Weekday/);

      expect(input).toHaveAttribute("aria-expanded", "false");
      expect(input).toHaveAttribute("aria-haspopup", "listbox");
      expect(input).toHaveAttribute("aria-autocomplete", "list");
    });

    test("marks the combobox as readOnly", () => {
      render(
        <SelectBox {...baseProps} fieldComponent={FieldComponent} readOnly />
      );
      expect(screen.getByLabelText(/Weekday/)).toHaveAttribute("readonly");
    });

    test("marks the combobox as required", () => {
      render(<SelectBox {...baseProps} fieldComponent={FieldComponent} />);
      expect(screen.getByLabelText(/Weekday/)).toBeRequired();
    });

    test("marks the combobox as invalid on submit", async () => {
      const user = userEvent.setup();

      render(
        <FormWrapper>
          <SelectBox {...baseProps} fieldComponent={FieldComponent} />
        </FormWrapper>
      );

      await user.click(screen.getByText(/Submit/));

      expect(screen.getByLabelText(/Weekday/)).toBeInvalid();
    });

    test("marks the combobox when clearing the value", async () => {
      const user = userEvent.setup();

      render(<SelectBox {...baseProps} fieldComponent={FieldComponent} />);

      await user.click(screen.getByLabelText(/Weekday/));
      await user.click(screen.getByRole("option", { name: /Monday/ }));
      await user.clear(screen.getByLabelText(/Weekday/));
      await user.tab();

      expect(screen.getByLabelText(/Weekday/)).toBeInvalid();
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

const FormWrapper: FC<PropsWithChildren> = (props) => {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      {props.children}
      <Button useSubmitBehavior text="Submit" />
    </form>
  );
};
