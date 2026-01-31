import "./Slider.css";

export const Slider = ({
  checked,
  onChange,
  disabled,
}: {
  checked?: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
}) => {
  return (
    <label className="switch">
      <input
        type="checkbox"
        disabled={disabled}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span className="slider" />
    </label>
  );
};
