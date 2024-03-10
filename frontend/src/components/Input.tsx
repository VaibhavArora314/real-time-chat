import { InputField } from "../helper/types";

interface InputProps extends InputField {
    error: string
  }

const Input = ({id,label,type,placeholder,error,handleOnChange,required=false}:InputProps) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-900"
      >
        {label}
      </label>
      <input
        type={type}
        name={id}
        id={id}
        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
        placeholder={placeholder}
        onChange={e => handleOnChange(e.target)}
        required={required}
      />
      {error && <p className="block my-2 text-sm font-medium text-red-400">
        {error}
      </p>}
    </div>
  );
};

export default Input;
