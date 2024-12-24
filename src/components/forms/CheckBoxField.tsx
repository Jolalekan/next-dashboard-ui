import { FieldError } from "react-hook-form";

type CheckboxFieldProps={
    label: string;
    type? : string;
    register: any;
    name: string;
    defaultValue?: boolean;
    error?: FieldError;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}


const CheckboxField = ({
    label,
    type="checkbox",
    register,
    name,
    defaultValue=false,
    error,
    inputProps,
}: CheckboxFieldProps) => {
  return (
    <div className="flex  gap-2  md:w-1/4">
    <label className="text-xs text-gray-500">{label}</label>
        <input
            type={type} 
            {...register(name)} 
            className=" rounded-md "
            {...inputProps}
            defaultChecked={defaultValue} 
        />
      {error?.message && <p className="text-red-600 text-xs">{error?.message.toString()}</p>}
 </div>
  )
}

export default CheckboxField