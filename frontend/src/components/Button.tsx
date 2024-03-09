interface ButtonProps {
  type: "submit" | "reset" | "button" | undefined;
  label: string;
  onClick: () => void;
  fullWidth?: boolean;
  fontBold?: boolean;
  color?: "blue" | "green"
}

const Button = ({
  type,
  label,
  onClick,
  fullWidth = false,
  fontBold = false,
  color = "blue"
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={
        (fullWidth ? "w-full " : " ") +
        (fontBold ? "font-medium " : " ") +
        (color === "blue" ? "bg-primary-600 hover:bg-primary-700 " : "bg-green-500 hover:bg-green-600 ") +
        "text-white  focus:ring-4 focus:outline-none focus:ring-primary-300 rounded-lg text-sm px-5 py-2.5 text-center"
      }
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;
