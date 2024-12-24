"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "./InputField";
import { lessonSchema, LessonSchema } from "@/lib/FormValidationSchema";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createLesson, updateLesson } from "@/lib/action";
import CheckboxField from "./CheckBoxField";

const LessonForm = ({
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
  } = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema),
  });

  //AFTER REACT 19 IT WILL BE USEACTIONSTATE
  const [state, formAction] = useFormState(
    type === "create" ? createLesson : updateLesson,
    {
      success: false,
      error: false,
    }
  );

  const onSubmit = handleSubmit((data) => {
    console.log("Form data on submit", data);
    formAction(data);
  });

  useEffect(() => {
    if (state.success) {
      toast(`Lesson has been ${type === "create" ? "created" : "updated"}!`);
      router.refresh();
      setOpen(false);
    }
  }, [[state, router, type, setOpen]]);

  const { lessons, classes, subjects, teachers, exams, assignments } = relatedData;
  console.log(relatedData)
  if (!lessons) {
    return <p>Loading...</p>;
  }

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h2 className="text-xl font-semibold"> Create a new lesson</h2>
      <span className="text-xs text-gray-600 font-medium">
        {type === "create" ? "Create a new lesson" : "Update lesson"}
      </span>
      <div className="flex justify-between flex-wrap">
        <InputField
          label="Lesson Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors?.name}
        />
        <InputField
          label="Start date"
          name="startTime"
          defaultValue={data?.startTime}
          register={register}
          error={errors?.startTime}
          type="datetime-local"
        />
        <InputField
          label="End date"
          name="endTime"
          defaultValue={data?.endTime}
          register={register}
          error={errors?.endTime}
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

      <div className="flex justify-between flex-wrap">
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Day</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("day")}
            defaultValue={data?.day}
          >
            <option value="MONDAY">Monday</option>
            <option value="TUESDAY">Tuesday</option>
            <option value="WEDNESDAY">Wednesday</option>
            <option value="THURSDAY">Thursday</option>
            <option value="FRIDAY">Friday</option>
          </select>
          {errors.day?.message && (
            <p className="text-red-600 text-xs">
              {errors.day?.message.toString()}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="teachers" className="text-xs text-gray-500">
            Teacher
          </label>
          <select
            // id="teachers"
            // name="teachers"

            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("teacherId")}
            defaultValue={data?.teacherId || []}
          >
            {teachers.map((teacher: { id: number; name: string }) => (
              <option value={teacher.id} key={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
          {errors.teacherId?.message && (
            <p className="text-red-600 text-xs">
              {errors.teacherId?.message.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label htmlFor="class" className="text-xs text-gray-500">
            class
          </label>
          <select
            // id="teachers"
            // name="teachers"

            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("classId")}
            defaultValue={data?.classId || []}
          >
            {classes.map((classList: { id: number; name: string }) => (
              <option value={classList.id} key={classList.id}>
                {classList.name}
              </option>
            ))}
          </select>
          {errors.classId?.message && (
            <p className="text-red-600 text-xs">
              {errors.classId?.message.toString()}
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-between flex-wrap">

    
      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <label htmlFor="subject" className="text-xs text-gray-500">
          Subject
        </label>
        <select
          // id="teachers"
          // name="teachers"

          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...register("subjectId")}
          defaultValue={data?.subjectId || []}
        >
          {subjects.map((subject: { id: number; name: string }) => (
            <option value={subject.id} key={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
        {errors.subjectId?.message && (
          <p className="text-red-600 text-xs">
            {errors.subjectId?.message.toString()}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <label htmlFor="exams" className="text-xs text-gray-500">
          Exams
        </label>
        <select
        multiple
          // id="teachers"
          // name="teachers"

          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...register("exams")}
          defaultValue={data?.exams || []}
        >
          {exams.map((exam: { id: number; title: string }) => (
            <option value={exam.id} key={exam.id}>
              {exam.title}
            </option>
          ))}
        </select>
        {errors.exams?.message && (
          <p className="text-red-600 text-xs">
            {errors.exams?.message.toString()}
          </p>
        )}
      </div>

     <div className="flex flex-col gap-2 w-full md:w-1/4">
        <label htmlFor="assignment" className="text-xs text-gray-500">
          Assignment
        </label>
        <select
        multiple
          // id="teachers"
          // name="teachers"

          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...register("assignments")}
          defaultValue={data?.assignments || []}
        >
          {assignments.map((assignment: { id: number; title: string }) => (
            <option value={assignment.id} key={assignment.id}>
              {assignment.title}
            </option>
          ))}
        </select>
        {errors.assignments?.message && (
          <p className="text-red-600 text-xs">
            {errors.assignments?.message.toString()}
          </p>
        )}
      </div>
      </div>
      <CheckboxField
            label="Attendance"
            name="attendance"
            defaultValue={data?.attendance}
            register={register}
            error={errors?.attendance}
          />
     
  

      {state.error && (
        <span className="text-red-500">Something went wrong</span>
      )}
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default LessonForm;
