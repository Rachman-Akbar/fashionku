import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InlineActiveSwitch } from "@/shared/components/form/InlineActiveSwitch";

describe("InlineActiveSwitch", () => {
  it("renders as a switch with the checked state", () => {
    render(<InlineActiveSwitch checked onChange={() => {}} />);
    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(toggle).toHaveTextContent("Active");
  });

  it("renders the inactive state and label", () => {
    render(<InlineActiveSwitch checked={false} onChange={() => {}} />);
    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(toggle).toHaveTextContent("Non-Active");
  });

  it("supports custom active and inactive labels", () => {
    render(
      <InlineActiveSwitch
        checked={false}
        onChange={() => {}}
        activeLabel="Aktif"
        inactiveLabel="Nonaktif"
      />,
    );
    expect(screen.getByRole("switch")).toHaveTextContent("Nonaktif");
  });

  it("toggles the value on click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<InlineActiveSwitch checked={false} onChange={onChange} />);

    await user.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("toggles from true to false", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<InlineActiveSwitch checked={true} onChange={onChange} />);

    await user.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("does not fire onChange when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<InlineActiveSwitch checked disabled onChange={onChange} />);

    await user.click(screen.getByRole("switch"));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("switch")).toBeDisabled();
  });

  it("exposes the pending state via aria-busy", () => {
    render(<InlineActiveSwitch checked pending onChange={() => {}} />);
    expect(screen.getByRole("switch")).toHaveAttribute("aria-busy", "true");
  });

  it("describes the action it will perform", () => {
    render(<InlineActiveSwitch checked onChange={() => {}} />);
    expect(screen.getByRole("switch")).toHaveAccessibleName("Ubah status menjadi Non-Active");
  });
});