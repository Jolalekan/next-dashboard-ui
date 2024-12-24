"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "./InputField";
import { classSchema, ClassSchema} from "@/lib/FormValidationSchema";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createClass, updateClass } from "@/lib/action";

const ClassForm = ({
  type,
  setOpen,
  data,
  relatedData,
}: {
  type: "create" | "update";
  setOpen: Dispatch<SetStateAction<boolean>>;
  data?: any;
  relatedData?: any;
}) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClassSchema>({
    resolver: zodResolver(classSchema),
  });

  //AFTER REACT 19 IT WILL BE USEACTIONSTATE
  const [state, formAction] = useFormState(
    type === "create" ? createClass : updateClass,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    formAction(data);
  });

  useEffect(() => {
    if (state.success) {
      toast(`Class has been ${type === "create" ? "created" : "updated"}!`);
      router.refresh();
      setOpen(false);
    }
  }, [[state, router,type, setOpen]]);

  const {teachers, grades } = relatedData;
  // if(!teachers){
  //   return <p>Loading...</p>
  // }
  // console.log("teacher:", teachers);
  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h2 className="text-xl font-semibold"> Create a new Class</h2>
      <span className="text-xs text-gray-600 font-medium">
        {type === "create" ? "Create a new class" : "Update the class"}
      </span>
      <div className="flex justify-between flex-wrap">
        <InputField
          label="Class name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <InputField
          label="Capacity"
          name="capacity"
          defaultValue={data?.capacity}
          register={register}
          error={errors?.capacity}
        />

        {data && (
          <InputField
            label="id"
            name="id"
            defaultValue={data?.id}
            register={register}
            error={errors?.id}
            hidden
          />
        )}

        {/* <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Teachers</label>
          <select
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("teachers")}
            defaultValue={data?.teachers }
          >
            {teachers.map(
              (teacher: { id: string; name: string; surname: string }) => (
                <option value={teacher.id} key={teacher.id}>
                  {teacher?.name + " " + teacher?.surname}
                </option>
              )
            )}
          </select>
          {errors.teachers?.message && (
            <p className="text-red-600 text-xs">
              {errors.teachers?.message.toString()}
            </p>
          )}
        </div> */}
         <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="teachers" className="text-xs text-gray-500">
            Assign Grade
          </label>
          <select
            // id="teachers"
            // name="teachers"
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("supervisorId")}
            defaultValue={data?.teachers || []}
          >
            {teachers.map((teacher: { id: string; name: string; surname: string }) => (
              <option value={teacher.id} key={teacher.id} selected={data && teacher.id === data.supervisorId}>
                {teacher.name} {teacher.surname}
              </option>
            ))}
          </select>
          {errors.supervisorId?.message && (
            <p className="text-red-600 text-xs">
              {errors.supervisorId?.message.toString()}
            </p>
          )}
        </div>
       


      </div>
       
         <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="grade" className="text-xs text-gray-500">
            Grade
          </label>
          <select
            // id="teachers"
            // name="teachers"
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("gradeId")}
            defaultValue={data?.gradeId || []}
          >
            {grades.map((grade: { id: string; level:number }) => (
              <option 
              value={grade.id} 
              key={grade.id} 
              selected={data && grade.id === data.gradeId}>
                {grade.level} 
              </option>
            ))}
          </select>
          {errors.gradeId?.message && (
            <p className="text-red-600 text-xs">
              {errors.gradeId?.message.toString()}
            </p>
          )}
        </div>
      {state.error && (
        <span className="text-red-500">Something went wrong</span>
      )}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ClassForm;
