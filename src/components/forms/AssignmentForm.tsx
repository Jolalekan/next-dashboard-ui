"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "./InputField";
import { assignmentSchema, AssignmentSchema  } from "@/lib/FormValidationSchema";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createAssignment, updateAssignment } from "@/lib/action";

const AssignmentForm = ({
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
  } = useForm<AssignmentSchema>({
    resolver: zodResolver(assignmentSchema),
  });

  //AFTER REACT 19 IT WILL BE USEACTIONSTATE
  const [state, formAction] = useFormState(
    type === "create" ? createAssignment : updateAssignment,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    console.log("Form data on submit", data)
    formAction(data);
  });

  useEffect(() => {
    if (state.success) {
      toast(`Assignment has been ${type === "create" ? "created" : "updated"}!`);
      router.refresh();
      setOpen(false);
    }
  }, [[state, router, type, setOpen]]);

  const { lessons } = relatedData;

  if(!lessons){
    return <p>Loading...</p>
  }
 
  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h2 className="text-xl font-semibold"> Create a new Assignment</h2>
      <span className="text-xs text-gray-600 font-medium">
        {type === "create" ? "Create a new Assignment" : "Update the Assignment"}
      </span>
      <div className="flex justify-between flex-wrap">
        <InputField
          label="Assignment title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />
        <InputField
          label="Start date"
          name="startDate"
          defaultValue={data?.startDate}
          register={register}
          error={errors?.startDate}
          type="datetime-local"
        />
        <InputField
          label="End date"
          name="dueDate"
          defaultValue={data?.dueDate}
          register={register}
          error={errors?.dueDate}
          type="datetime-local"
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


      </div>
         <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="teachers" className="text-xs text-gray-500">
            Lesson
          </label>
          <select
            // id="teachers"
            // name="teachers"
            multiple
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("lessonId")}
            defaultValue={data?.teachers || []}
          >
            {lessons.map((lesson: { id: number; name: string; }) => (
              <option value={lesson.id} key={lesson.id}>
                {lesson.name}
              </option>
            ))}
          </select>
          {errors.lessonId?.message && (
            <p className="text-red-600 text-xs">
              {errors.lessonId?.message.toString()}
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

export default AssignmentForm;
