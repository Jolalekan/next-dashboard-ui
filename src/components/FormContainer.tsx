import { prisma } from "@/lib/prisma";
import FormModal from "./FormModal";
import { auth } from "@clerk/nextjs/server";

export type FormContainerProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number | string;
};

const FormContainer = async ({ table, type, data, id }: FormContainerProps) => {
  let relatedData = {};

  console.log("initial related",relatedData)
  try{
    let sharedClass :{id:number; name:string}[]=[];
    if(table === "event" || table === "announcement"){
      sharedClass = await prisma.class.findMany({
        select:{
          id:true,
          name:true
        }
      })
    }   
    
    if (type !== "delete") {
      const {userId, sessionClaims} = await auth();
      const role = (sessionClaims?.metadata as {role? :"amdin" | "teacher" | "student" |"parent"}).role

         
      switch (table) {
        case "subject":
          const subjectTeachers = await prisma.teacher.findMany({
            select: { id: true, name: true, surname: true },
          });
          relatedData = { teachers: subjectTeachers };
          
          break;
        case "class":
          const classGrades = await prisma.grade.findMany({
            select: { id: true, level: true },
          });
          const classTeachers = await prisma.teacher.findMany({
            select: { id: true, name: true, surname:true },
          });
          relatedData = { teachers: classTeachers, grades:classGrades };
          break;

        case "teacher":
          const teacherSubject = await prisma.subject.findMany({
            select: { id: true, name: true },
          });
          relatedData = { subjects: teacherSubject };
          break;
        case "student":
          const studentGrades = await prisma.grade.findMany({
            select: { id: true, level: true },
          });
          const studentClasses = await prisma.class.findMany({
            include:{_count:{select:{students:true}}}
          });
          relatedData = { grades: studentGrades, classes: studentClasses };
          break;
        case "exam":      
          const examLesson = await prisma.lesson.findMany({
            where:{
              ...(role === "teacher" ? {teacherId:userId!} : {})
            }
          });
          relatedData = { lessons:examLesson };
          break;

        case "assignment":
          const assginmentLesson = await prisma.lesson.findMany({
            where:{
              ...(role === "teacher" ? {teacherId:userId!} : {})
            }
          });
          relatedData = { lessons:assginmentLesson };
          break;

        // case "event":
          // const eventClass = await prisma.class.findMany({
        //     select:{
        //       id:true,
        //       name:true
        //     }
        //   });
          // relatedData = { classes:eventClass };
        //   break;
        case"event":
        relatedData={classes:sharedClass}
          break;
          
          case "announcement":
          // const announcementClass = await prisma.class.findMany({
          //   select:{
          //     id:true,
          //     name:true
          //   }
          // });
          // console.log("announce: ",announcementClass)
          relatedData = {classes:sharedClass };
          break;

          case "lesson":      
          const lessons = await prisma.lesson.findMany({
            where:{
              ...(role === "teacher" ? {teacherId:userId!} : {})
            },
          });
          const lessonSubjects = await prisma.subject.findMany({
            select: { id: true, name: true },
          });
          const lessonClass = await prisma.class.findMany({
            select:{
              id:true,
              name:true
            }
          })
          const lessonTeacher = await prisma.teacher.findMany({
            select: { id: true, name: true, surname:true },
          });
          const lessonAttendance = await prisma.attendance.findMany({
            select: { id: true, present: true, date:true },
          });
          const lessonExams = await prisma.exam.findMany({
            select: { id: true, title: true},
          });
          const lessonAssignment = await prisma.assignment.findMany({
            select: { id: true, title: true },
          });
          relatedData = {exams:lessonExams, assignments:lessonAssignment, attendance:lessonAttendance, teachers:lessonTeacher,  lessons:lessons, subjects:lessonSubjects, classes:lessonClass };
          break;
          
          case "result":      
          const lessons = await prisma.lesson.findMany({
            where:{
              ...(role === "teacher" ? {teacherId:userId!} : {})
            },
          });
          const lessonSubjects = await prisma.subject.findMany({
            select: { id: true, name: true },
          });
          const lessonClass = await prisma.class.findMany({
            select:{
              id:true,
              name:true
            }
          })
          const lessonTeacher = await prisma.teacher.findMany({
            select: { id: true, name: true, surname:true },
          });
          const lessonAttendance = await prisma.attendance.findMany({
            select: { id: true, present: true, date:true },
          });
          const lessonExams = await prisma.exam.findMany({
            select: { id: true, title: true},
          });
          const lessonAssignment = await prisma.assignment.findMany({
            select: { id: true, title: true },
          });
          relatedData = {exams:lessonExams, assignments:lessonAssignment, attendance:lessonAttendance, teachers:lessonTeacher,  lessons:lessons, subjects:lessonSubjects, classes:lessonClass };
          break;
          

          default:
        break;
    }
  }
}catch(error:any){
  return <div>Error:{error.message}</div>
}
  return (
    <div className="">
      <FormModal
        table={table}
        type={type}
        data={data}
        id={id}
        relatedData={relatedData}
      />
    </div>
  );
};

export default FormContainer;
