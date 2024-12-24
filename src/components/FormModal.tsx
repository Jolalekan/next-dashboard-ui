"use client";

import { deleteAnnouncement, deleteAssignment, deleteAttendance, deleteClass, deleteEvent, deleteExam, deleteStudent, deleteSubject, deleteTeacher } from "@/lib/action";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
} from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import { FormContainerProps } from "./FormContainer";


const deleteActionMap = {
  subject: deleteSubject,
  class: deleteClass,
  teacher: deleteTeacher,
  student: deleteStudent,
  exam: deleteExam,
  parent: deleteSubject,
  lesson: deleteSubject,
  assignment: deleteAssignment,
  result: deleteSubject,
  attendance: deleteAttendance,
  event: deleteEvent,
  announcement: deleteAnnouncement,
};
// import TeacherForm from './forms/TeacherForm';
// import StudentForm from './forms/StudentForm';

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ClassForm = dynamic(() => import("./forms/ClassForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ExamForm = dynamic(() => import("./forms/ExamForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AssignmentForm = dynamic(() => import("./forms/AssignmentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const EventForm = dynamic(() => import("./forms/EventForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AnnouncementForm = dynamic(() => import("./forms/AnnouncemntForm"), {
  loading: () => <h1>Loading...</h1>,
});
const LessonForm = dynamic(() => import("./forms/LessonForm"), {
  loading: () => <h1>Loading...</h1>,
});
const AttendanceForm = dynamic(() => import("./forms/AttendanceForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (
    type: "create" | "update",
    setOpen: Dispatch<SetStateAction<boolean>>,
    data?: any,
    relatedData?: any
  ) => JSX.Element;
} = {
  subject: (type, setOpen, data, relatedData) =>{
    return(
    <SubjectForm
      type={type}
      setOpen={setOpen}
      data={data}
      relatedData={relatedData}
    />
  )},
  class: (type, setOpen, data, relatedData) => (
    <ClassForm
      type={type}
      setOpen={setOpen}
      data={data}
      relatedData={relatedData}
    />
  ),
  teacher: (type, setOpen, data, relatedData) => (
    <TeacherForm
      type={type}
      setOpen={setOpen}
      data={data}
      relatedData={relatedData}
    />
  ),
  student: (type, setOpen, data,  relatedData) => (
    <StudentForm
      type={type}
      setOpen={setOpen}
      data={data}
      relatedData={relatedData}
    />
  ),
  exam: (type, setOpen, data,  relatedData) => (
    <ExamForm
      type={type}
      setOpen={setOpen}
      data={data}
      relatedData={relatedData}
    />
  ),
  assignment: (type, setOpen, data,  relatedData) => (
    <AssignmentForm
      type={type}
      setOpen={setOpen}
      data={data}
      relatedData={relatedData}
    />
  ),
  event: (type, setOpen, data,  relatedData) => (
    <EventForm
      type={type}
      setOpen={setOpen}
      data={data}
      relatedData={relatedData}
    />
  ),
  announcement: (type, setOpen, data,  relatedData) => (
    <AnnouncementForm
      type={type}
      setOpen={setOpen}
      data={data}
      relatedData={relatedData}
    />
  ),
  lesson: (type, setOpen, data,  relatedData) => (
    <LessonForm
      type={type}
      setOpen={setOpen}
      data={data}
      relatedData={relatedData}
    />
  ),
  attendance: (type, setOpen, data,  relatedData) => (
    <AttendanceForm
      type={type}
      setOpen={setOpen}
      data={data}
      relatedData={relatedData}
    />
  ),
};

const FormModal = ({
  table,
  type,
  data,
  id,
  relatedData,
}: FormContainerProps & { relatedData?: any }) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-efinityYllow"
      : type === "update"
      ? "bg-efinityYllow"
      : "bg-efinityPurple";

  const [open, setOpen] = useState(false);

  const Form = () => {
    const router = useRouter();
    const [state, formAction] = useFormState(deleteActionMap[table], {
      success: false,
      error: false,
    });

    useEffect(() => {
      if (state.success) {
        toast(`${table} has been been deleted`!);
        router.refresh();
        setOpen(false);
      }
    }, [state, setOpen, table, router]);
    return type === "delete" && id ? (
      <form action={formAction} className="p-4 flex flex-col gap-4">
        <input type="text | number" name="id" value={id} hidden />
        <span className="text-center font-medium">
          All data will be lost. Are you sure you want to delete this {table}
        </span>
        <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
          Delete
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table](type, setOpen, data, relatedData )
    ) : (
      "Form not found!"
    );
  };
  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
      >
        <Image
          src={`/${type}.png`}
          alt=""
          width={16}
          height={16}
          onClick={() => setOpen(true)}
        />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 h-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image alt="close" src="/close.png" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
