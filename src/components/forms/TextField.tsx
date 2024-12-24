import { FieldError } from "react-hook-form";

type TextFieldProps={
    label: string;
    register: any;
    name: string;
    defaultValue?: string;
    error?: FieldError;
    hidden?:boolean,
    textAreaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
}


const TextField = ({
    label,
    register,
    name,
    defaultValue,
    error,
    textAreaProps,
    hidden
}: TextFieldProps) => {
  return (
    <div className={ hidden ? "hidden" :"flex flex-col gap-2 w-full md:w-full"}>
    <label className="text-xs text-gray-500">{label}</label>
        <textarea
            {...register(name)} 
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...textAreaProps}
            defaultValue={defaultValue} 
        />
      {error?.message && <p className="text-red-600 text-xs">{error?.message.toString()}</p>}
 </div>
  )
}

export default TextField