"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import InputField from "./InputField";
import Image from "next/image";
import { teacherSchema, TeacherSchema } from "@/lib/FormValidationSchema";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createTeacher, updateTeacher } from "@/lib/action";
import { CldUploadWidget } from 'next-cloudinary';
const TeacherForm = ({ 
  type, 
  data, 
  setOpen, 
  relatedData}: {
    type: "create" | "update";
    setOpen: Dispatch<SetStateAction<boolean>>;
    data?: any;
    relatedData?: any;
}) => {
  const router = useRouter()
  const [img, setImg]= useState<any>()
  
  const {  
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeacherSchema>({
    resolver: zodResolver(teacherSchema),
  });

   //AFTER REACT 19 IT WILL BE USEACTIONSTATE
   const [state, formAction] = useFormState(
    type === "create" ? createTeacher : updateTeacher,
    {
      success: false,
      error: false,
    }
  );
console.log("update",updateTeacher)
  const onSubmit = handleSubmit((data) => {
    console.log("Form data on submit", data)
    formAction({...data, img: img?.secure_url});
  });

  useEffect(() => {
    if (state.success) {
      toast(`Teacher has been ${type === "create" ? "created" : "updated"}!`);
      router.refresh();
      setOpen(false);
    }
  }, [state, router, type, setOpen]);

  const { subjects } = relatedData;


  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h2 className="text-xl font-semibold">{type === "create" ? "Create a new teacher" : "Update the teacher"}</h2>
      <span className="text-xs text-gray-600 font-medium">Authentication Information</span>
      <div className="flex justify-between flex-wrap">
      
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
        <InputField
          label="Username"
          name="username"
          defaultValue={data?.username}
          register={register}
          error={errors.username}
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          defaultValue={data?.email}
          register={register}
          error={errors.email}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          defaultValue={data?.password}
          register={register}
          error={errors.password}
        />
      </div>
      <div className="flex justify-between flex-wrap">

        <InputField
          label="Name"
          name="name"
          defaultValue={data?.name}
          register={register}
          error={errors.name}
        />
        <InputField
          label="Surname"
          name="surname"
          defaultValue={data?.surname}
          register={register}
          error={errors.surname}
        />
        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors.phone}
        />
      </div>
      <div className="flex justify-between flex-wrap">

        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors.address}
        />
        <InputField
          label="Blood Type"
          name="bloodType"
          defaultValue={data?.bloodType}
          register={register}
          error={errors.bloodType}
        />
        <InputField
          label="Birth Day"
          name="birthday"
          defaultValue={data?.birthday.toISOString().split("T")[0]}
          register={register}
          error={errors.birthday}
          type="date"
        />
      </div>
      <div className="flex justify-between flex-wrap">
      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <label className="text-xs text-gray-500">Sex</label>
          <select className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("sex")} defaultValue={data?.sex}>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
        </select>
      {errors.sex?.message && <p className="text-red-600 text-xs">{errors.sex?.message.toString()}</p>}
 </div>

      <div className="flex flex-col gap-2 w-full md:w-1/4">
        <label className="text-xs text-gray-500">Subject</label>
          <select 
            multiple
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full" {...register("subjects")} defaultValue={data?.subject}>
            {subjects.map((subject:{id:number; name:string})=>(
              <option value={subject.id} key={subject.id}>{subject.name}</option>


            ))}
        </select>
      {errors.subjects?.message && <p className="text-red-600 text-xs">{errors.subjects?.message.toString()}</p>}
 </div>
   
      {/* <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
        <label className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer" htmlFor="img">

        <Image src="/upload.png" alt="upload" width={20} height={20}/>
        <span>upload a photo</span>
        <input type="file" id="img" {...register("img")} className="hidden"/>
        </label>
      {errors.img?.message && <p className="text-red-600 text-xs">{errors.img?.message.toString()}</p>}
      </div> */}
      <CldUploadWidget  uploadPreset="school"
          onSuccess={(result, {widget}) =>{
            setImg(result.info)
            widget.close()
          }
}
      >
  {({ open }) => {
    return (
      <div className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
      onClick={()=>open()}>

      <Image src="/upload.png" alt="upload" width={20} height={20}/>
      <span>upload a photo</span>
      </div>
    );
  }}
</CldUploadWidget>
      </div>
      {state.error && (
        <span className="text-red-500">Something went wrong</span>
      )}
      <span className="text-xs text-gray-400 font-medium">Personal Information</span>
      <button className="bg-blue-400 text-white p-2 rounded-md">{type === "create" ? "Create" : "Update"}</button>
    </form>
  )
}

export default TeacherForm