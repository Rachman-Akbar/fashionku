import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchableSelect } from "@/shared/components/form/SearchableSelect";

const OPTIONS = [
  { value: "1", label: "Apple" },
  { value: "2", label: "Banana" },
  { value: "3", label: "Avocado" },
];

describe("SearchableSelect", () => {
  it("shows the placeholder when nothing is selected", () => {
    render(<SearchableSelect options={OPTIONS} onChange={() => {}} placeholder="Pilih buah" />);
    expect(screen.getByRole("button", { name: "Pilih buah" })).toBeInTheDocument();
  });

  it("opens the dropdown and filters options by the query", async () => {
    const user = userEvent.setup();
    render(<SearchableSelect options={OPTIONS} onChange={() => {}} />);

    await user.click(screen.getByRole("button", { name: "Pilih data" }));
    await user.type(screen.getByPlaceholderText("Cari data"), "app");

    expect(screen.getByRole("option", { name: "Apple" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Banana" })).not.toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Avocado" })).not.toBeInTheDocument();
  });

  it("selects an option and calls onChange with its value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchableSelect options={OPTIONS} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Pilih data" }));
    await user.click(screen.getByRole("option", { name: "Banana" }));

    expect(onChange).toHaveBeenCalledWith("2", expect.objectContaining({ label: "Banana" }));
  });

  it("displays the selected option label", () => {
    render(<SearchableSelect options={OPTIONS} value="2" onChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Banana" })).toBeInTheDocument();
  });

  it("clears the selection via the clear button", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<SearchableSelect options={OPTIONS} value="2" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Hapus pilihan" }));
    expect(onChange).toHaveBeenCalledWith("", null);
  });

  it("does not render clear button for a non-clearable select", () => {
    render(<SearchableSelect options={OPTIONS} value="2" clearable={false} onChange={() => {}} />);
    expect(screen.queryByRole("button", { name: "Hapus pilihan" })).not.toBeInTheDocument();
  });

  it("marks the selected option as active", async () => {
    const user = userEvent.setup();
    render(<SearchableSelect options={OPTIONS} value="1" onChange={() => {}} />);

    await user.click(screen.getByRole("button", { name: "Apple" }));
    expect(screen.getByRole("option", { name: "Apple" })).toHaveAttribute("aria-selected", "true");
  });

  it("skips disabled options", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const options = [
      { value: "1", label: "Layak", disabled: false },
      { value: "2", label: "Dilarang", disabled: true },
    ];
    render(<SearchableSelect options={options} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Pilih data" }));
    const disabled = screen.getByRole("option", { name: "Dilarang" });
    await user.click(disabled);

    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders the empty state when no option matches", async () => {
    const user = userEvent.setup();
    render(<SearchableSelect options={OPTIONS} onChange={() => {}} emptyText="Tidak ada buah" />);

    await user.click(screen.getByRole("button", { name: "Pilih data" }));
    await user.type(screen.getByPlaceholderText("Cari data"), "zzz");

    expect(screen.getByText("Tidak ada buah")).toBeInTheDocument();
  });

  it("creates a new option through the onCreate handler", async () => {
    const user = userEvent.setup();
    const onCreate = vi.fn(async (label) => ({ value: "new", label }));
    const onChange = vi.fn();
    render(
      <SearchableSelect
        options={OPTIONS}
        onCreate={onCreate}
        onChange={onChange}
        createLabel={(label) => `Tambahkan "${label}"`}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Pilih data" }));
    await user.type(screen.getByPlaceholderText("Cari data"), "Durian");
    await user.click(screen.getByRole("button", { name: 'Tambahkan "Durian"' }));

    expect(onCreate).toHaveBeenCalledWith("Durian");
    expect(onChange).toHaveBeenCalledWith("new", expect.objectContaining({ label: "Durian" }));
  });
});