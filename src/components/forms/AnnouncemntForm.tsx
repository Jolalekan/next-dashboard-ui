"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import InputField from "./InputField";
import {
  announcementSchema,
  AnnouncementSchema,
} from "@/lib/FormValidationSchema";
import { useFormState } from "react-dom";
import { Dispatch, SetStateAction, useEffect } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createAnnouncement, updateAnnouncement } from "@/lib/action";
import TextField from "./TextField";

const AnnouncementForm = ({
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
  console.log("relatedIn", relatedData);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnnouncementSchema>({
    resolver: zodResolver(announcementSchema),
  });

  //AFTER REACT 19 IT WILL BE USEACTIONSTATE
  const [state, formAction] = useFormState(
    type === "create" ? createAnnouncement : updateAnnouncement,
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
      toast(`Event has been ${type === "create" ? "created" : "updated"}!`);
      router.refresh();
      setOpen(false);
    }
  }, [[state, router, type, setOpen]]);

  const { classes } = relatedData;
  console.log("classes", classes);
  if (!classes) {
    return <p>Loading...</p>;
  }

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h2 className="text-xl font-semibold"> Create a new Announcement</h2>
      <span className="text-xs text-gray-600 font-medium">
        {type === "create"
          ? "Create a new Announcement"
          : "Update the Announcement"}
      </span>
      <div className="flex justify-between flex-wrap">
        <InputField
          label="Announcement title"
          name="title"
          defaultValue={data?.title}
          register={register}
          error={errors?.title}
        />

        {/* <InputField
          label="Start date"
          name="startTime"
          defaultValue={data?.startTime}
          register={register}
          error={errors?.startTime}
          type="datetime-local"
        /> */}

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
          Class
        </label>
        <select
          multiple
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
          {...register("classId")}
          defaultValue={data?.classId || []}
        >
          {/* {classes.map((classlist: { id: number; name: string; }) => (
              <option value={classlist.id} key={classlist.id}>
                {classlist.name}
              </option>
            ))} */}
        </select>
        {errors.classId?.message && (
          <p className="text-red-600 text-xs">
            {errors.classId?.message.toString()}
          </p>
        )}
      </div>
      <TextField
        label="Description"
        name="description"
        defaultValue={data?.description}
        register={register}
        error={errors?.description}
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

export default AnnouncementForm;
