"use server";

import { revalidatePath } from "next/cache";
import { SubjectSchema, ClassSchema, TeacherSchema, StudentSchema, ExamSchema, AssignmentSchema, EventSchema, AnnouncementSchema, LessonSchema, ResultSchema, AttendanceSchema } from "./FormValidationSchema";
import { prisma } from "./prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
type currentState= {success: boolean; error:boolean;}

export const createSubject=async ( 
    currentState: currentState,
    data:SubjectSchema
)=>{
    try {
        console.log("Current State:", currentState);
        console.log("Incoming subject:", data.name);
        console.log("Incoming teacher:", data.teachers);

        await prisma.subject.create({
          data: {
            name: data.name,
            teachers: {
              connect: data.teachers.map((teacherId) => ({ id: teacherId })),
            },
          },
            })   

        // revalidatePath("/list/subject") 
       return {success:true, error:false}

   } catch (error) {
        console.log(error)
       return {success:false, error:true}
   }

};

export const updateSubject=async ( 
    currentState: currentState,
    data:SubjectSchema)=>{
   try {
    await prisma.subject.update({
        where:{
            id:data.id
        },
        data:{
            name:data.name,
            teachers:{
                set:data.teachers.map((teacherId)=>({id:teacherId}))
            }
        }
    })   
        // revalidatePath("/list/subject") 
       return {success:true, error:false}

   } catch (error) {
        console.error(error)
       return {success:false, error:true}
   }

};

export const deleteSubject = async (
    currentState: currentState,
    data: FormData
  ) => {
      
      const id = data.get("id") as string | null;
      if(!id){
          console.error("No ID provided in the form data.");
          return {success: false, error:true, message:"ID is required"}
        }
        try {
     const response = await prisma.subject.delete({
        where: {
          id: parseInt(id),
        },
      });
      console.log("res", response)
      // revalidatePath("/list/subjects");
      return { success: true, error: false };
    } catch (err) {
      console.error(err);
      return { success: false, error: true };
    }
};


export const createClass=async ( 
    currentState: currentState,
    data:ClassSchema
)=>{
    try {
     
        await prisma.class.create({
          data,
            })   

        // revalidatePath("/list/subject") 
       return {success:true, error:false}

   } catch (error) {
        console.log(error)
       return {success:false, error:true}
   }

};

export const updateClass=async ( 
    currentState: currentState,
    data:ClassSchema)=>{
   try {
    await prisma.class.update({
        where:{
            id:data.id
        },
        data,
        
    })   
        // revalidatePath("/list/subject") 
       return {success:true, error:false}

   } catch (error) {
        console.error(error)
       return {success:false, error:true}
   }

};

export const deleteClass = async (
    currentState: currentState,
    data: FormData
  ) => {
      
      const id = data.get("id") as string | null;
      if(!id){
          console.error("No ID provided in the form data.");
          return {success: false, error:true, message:"ID is required"}
        }
        try {
     const response = await prisma.subject.delete({
        where: {
          id: parseInt(id),
        },
      });
      console.log("res", response)
      // revalidatePath("/list/subjects");
      return { success: true, error: false };
    } catch (err) {
      console.error(err);
      return { success: false, error: true };
    }
};



export const createTeacher = async ( 
    currentState: currentState,
    data:TeacherSchema
)=>{
    try {
      const clerk = await clerkClient();
      const user = await clerk.users.createUser({
        username: data.username,
        emailAddress:["admin1a@gmail.com"],
        password: data.password,
        firstName: data.name,
        lastName: data.surname,
        publicMetadata:{role:"teacher"}
      });
      await prisma.teacher.create({
        data:{
          id:user.id,
          username: data.username,
          name: data.name,
          surname: data.surname,
          email: data.email,
          phone: data.phone,
          address: data.address,
          img: data.img,
          bloodType: data.bloodType,
          sex: data.sex,
          birthday: data.birthday,
          subjects: {
            connect: data.subjects?.map((subjectId: string) => ({
              id: parseInt(subjectId),
            })),
          },
        }
      });

        // revalidatePath("/list/Teacher") 
       return {success:true, error:false}
   } catch (error) {
        console.log(error)
       return {success:false, error:true}
   }
};

export const updateTeacher=async ( 
    currentState: currentState,
    data:TeacherSchema)=>{
   if(!data){
    return {success:false, error:true}
   }
      try {
    const clerk = await clerkClient();
    const user = await clerk.users.updateUser(data.id, {
      username: data.username,
      ...(data.password !== "" &&{password:data.password}),
      firstName: data.name,
      lastName: data.surname,
    });
  const response=  await prisma.teacher.update({
      where:{
        id:data.id
      },
      data:{
        ...(data.password !== "" &&{password:data.password}),
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address ,
        img: data.img || null,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        subjects: {
          set: data.subjects?.map((subjectId: string) => ({
            id: parseInt(subjectId),
          })),
        },
      }
    });
        // revalidatePath("/list/subject") 
        console.log("response", response)
       return {success:true, error:false}

   } catch (error) {
        console.error(error)
       return {success:false, error:true}
   }

};

export const deleteTeacher = async (
    currentState: currentState,
    data: FormData
  ) => {
      
      const id = data.get("id") as string | null;
      if(!id){
          console.error("No ID provided in the form data.");
          return {success: false, error:true, message:"ID is required"}
        }
        try {
          const clerk = await clerkClient();
          await clerk.users.deleteUser(id)
          
     const response = await prisma.teacher.delete({
        where: {
          id:id ,
        },
      });
      console.log("res", response)
      // revalidatePath("/list/subjects");
      return { success: true, error: false };
    } catch (err) {
      console.error(err);
      return { success: false, error: true };
    }
};

// --------------------------------------

export const createStudent = async ( 
  currentState: currentState,
  data:StudentSchema
)=>{
  try {
const classItem = await prisma.class.findUnique({
  where:{id:data.classId},
  include:{_count:{select:{students:true}}}
})

if(classItem && classItem.capacity === classItem._count.students){
  return {success:false, error:false }
}

    const clerk = await clerkClient();
    const user = await clerk.users.createUser({
      username: data.username,
      emailAddress:["studen34t1@gmail.com"],
      password: data.password,
      firstName: data.name,
      lastName: data.surname,
      publicMetadata:{role:"teacher"}
    });
    await prisma.student.create({
      data:{
        id:user.id,
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        img: data.img,
        bloodType: data.bloodType,
        sex: data.sex,
        birthday: data.birthday,
        gradeId: data.gradeId,
        classId: data.classId,
        parentId:data.parentId
      }
    });

      // revalidatePath("/list/Teacher") 
     return {success:true, error:false}
 } catch (error) {
      console.log(error)
     return {success:false, error:true}
 }
};

export const updateStudent=async ( 
  currentState: currentState,
  data:StudentSchema)=>{
 if(!data){
  return {success:false, error:true}
 }
    try {
  const clerk = await clerkClient();
  const user = await clerk.users.updateUser(data.id, {
    username: data.username,
    ...(data.password !== "" &&{password:data.password}),
    firstName: data.name,
    lastName: data.surname,
  });
const response=  await prisma.student.update({
    where:{
      id:data.id
    },
    data:{
      ...(data.password !== "" &&{password:data.password}),
      username: data.username,
      name: data.name,
      surname: data.surname,
      email: data.email || null,
      phone: data.phone || null,
      address: data.address ,
      img: data.img || null,
      bloodType: data.bloodType,
      sex: data.sex,
      birthday: data.birthday,
      gradeId: data.gradeId,
      classId: data.classId,
      parentId:data.parentId
    }
  });
      // revalidatePath("/list/subject") 
      console.log("response", response)
     return {success:true, error:false}

 } catch (error) {
      console.error(error)
     return {success:false, error:true}
 }

};

export const deleteStudent = async (
  currentState: currentState,
  data: FormData
) => {
    
    const id = data.get("id") as string | null;
    if(!id){
        console.error("No ID provided in the form data.");
        return {success: false, error:true, message:"ID is required"}
      }
      try {
        const clerk = await clerkClient();
         await clerk.users.deleteUser(id)
   const response = await prisma.student.delete({
      where: {
        id:id ,
      },
    });
    console.log("res", response)
    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};


// --------------------------------------


export const createExam=async ( 
  currentState: currentState,
  data:ExamSchema
)=>{
  const {userId, sessionClaims} = await auth();
  const role = (sessionClaims?.metadata as {role? :string}).role;

  try {
 
      // const teacherLesson = await prisma.lesson.findFirst({
      //   where:{
      //     teacherId:userId!,
      //     id:data.lessonId,
      //   }
      // })
      
      // if(!teacherLesson){
      //   return{success:false, error:true}
      // }
      
      await prisma.exam.create({
        data: {
          title: data.title,
          startTime: data.startTime,
          endTime:data.endTime,
          lessonId:data.lessonId
          
        }
      })
      // revalidatePath("/list/subject") 
      return {success:true, error:false}
    

 } catch (error) {
      console.log(error)
     return {success:false, error:true}
 }

};

export const updateExam=async ( 
  currentState: currentState,
  data:ExamSchema
)=>{
  //const {userId, sessionClaims} = await auth();
  //const role = (sessionClaims?.metadata as {role? :string}).role;

  try {


 // const teacherLesson=  await prisma.lesson.findFirst({
 //   where:{
  //     teacherId:userId!,
  //     id:data.lessonId
  //   }
  // })
  //     if(!teacherLesson){
  //       return {success:false, error:true}
  //     }
      await prisma.exam.update({
        where:{
          id:data.id
        },
      data: {
        title: data.title,
        startTime: data.startTime,
        endTime:data.endTime,
        lessonId:data.lessonId  
      }
  })   
      // revalidatePath("/list/subject") 
     return {success:true, error:false}
  
 } catch (error) {
      console.error(error)
     return {success:false, error:true}
 }

};

export const deleteExam = async (
  currentState: currentState,
  data: FormData
) => {
    
    const id = data.get("id") as string | null;
    const {userId, sessionClaims} = await auth();
    const role = (sessionClaims?.metadata as {role? :string}).role

    if(!id){
        console.error("No ID provided in the form data.");
        return {success: false, error:true, message:"ID is required"}
      }
      try {
   const response = await prisma.subject.delete({
      where: {
        id: parseInt(id),
        ...(role === "teacher" ? {lesson:{teacher:userId!}}: {}),
      },
    });
    console.log("res", response)
    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};


// --------------------------------------


export const createAssignment=async ( 
  currentState: currentState,
  data:AssignmentSchema
)=>{
  const {userId, sessionClaims} = await auth();
  const role = (sessionClaims?.metadata as {role? :string}).role;

  try {
 
      // const teacherLesson = await prisma.lesson.findFirst({
      //   where:{
      //     teacherId:userId!,
      //     id:data.lessonId,
      //   }
      // })
      
      // if(!teacherLesson){
      //   return{success:false, error:true}
      // }
      
      await prisma.assignment.create({
        data: {
          title: data.title,
          startDate: data.startDate,
          dueDate:data.dueDate,
          lessonId:data.lessonId
          
        }
      })
      // revalidatePath("/list/subject") 
      return {success:true, error:false}
    

 } catch (error) {
      console.log(error)
     return {success:false, error:true}
 }

};

export const updateAssignment=async ( 
  currentState: currentState,
  data:AssignmentSchema
)=>{
  //const {userId, sessionClaims} = await auth();
  //const role = (sessionClaims?.metadata as {role? :string}).role;

  try {


 // const teacherLesson=  await prisma.lesson.findFirst({
 //   where:{
  //     teacherId:userId!,
  //     id:data.lessonId
  //   }
  // })
  //     if(!teacherLesson){
  //       return {success:false, error:true}
  //     }
      await prisma.assignment.update({
        where:{
          id:data.id
        },
        data: {
          title: data.title,
          startDate: data.startDate,
          dueDate:data.dueDate,
          lessonId:data.lessonId
          
        }
  })   
      // revalidatePath("/list/subject") 
     return {success:true, error:false}
  
 } catch (error) {
      console.error(error)
     return {success:false, error:true}
 }

};

export const deleteAssignment = async (
  currentState: currentState,
  data: FormData
) => {
    
    const id = data.get("id") as string | null;
    const {userId, sessionClaims} = await auth();
    const role = (sessionClaims?.metadata as {role? :string}).role

    if(!id){
        console.error("No ID provided in the form data.");
        return {success: false, error:true, message:"ID is required"}
      }
      try {
   const response = await prisma.subject.delete({
      where: {
        id: parseInt(id),
        ...(role === "teacher" ? {lesson:{teacher:userId!}}: {}),
      },
    });
    console.log("res", response)
    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

// --------------------------------------


export const createEvent=async ( 
  currentState: currentState,
  data:EventSchema
)=>{
  const {userId, sessionClaims} = await auth();
  const role = (sessionClaims?.metadata as {role? :string}).role;

  try {
 
      // const teacherLesson = await prisma.lesson.findFirst({
      //   where:{
      //     teacherId:userId!,
      //     id:data.lessonId,
      //   }
      // })
      
      // if(!teacherLesson){
      //   return{success:false, error:true}
      // }
      
      await prisma.event.create({
        data: {
          title: data.title,
          description: data.description,
          startTime: data.startTime,
          endTime:data.endTime,
          classId:data.classId
          
        }
      })
      // revalidatePath("/list/subject") 
      return {success:true, error:false}
    

 } catch (error) {
      console.log(error)
     return {success:false, error:true}
 }

};

export const updateEvent=async ( 
  currentState: currentState,
  data:EventSchema
)=>{
  //const {userId, sessionClaims} = await auth();
  //const role = (sessionClaims?.metadata as {role? :string}).role;

  try {


 // const teacherLesson=  await prisma.lesson.findFirst({
 //   where:{
  //     teacherId:userId!,
  //     id:data.lessonId
  //   }
  // })
  //     if(!teacherLesson){
  //       return {success:false, error:true}
  //     }
      await prisma.event.update({
        where:{
          id:data.id
        },
        data: {
          title: data.title,
          description: data.description,
          startTime: data.startTime,
          endTime:data.endTime,
          classId:data.classId
        }
  })   
      // revalidatePath("/list/subject") 
     return {success:true, error:false}
  
 } catch (error) {
      console.error(error)
     return {success:false, error:true}
 }

};

export const deleteEvent = async (
  currentState: currentState,
  data: FormData
) => {
    
    const id = data.get("id") as string | null;
    const {userId, sessionClaims} = await auth();
    const role = (sessionClaims?.metadata as {role? :string}).role

    if(!id){
        console.error("No ID provided in the form data.");
        return {success: false, error:true, message:"ID is required"}
      }
      try {
   const response = await prisma.subject.delete({
      where: {
        id: parseInt(id),
        ...(role === "teacher" ? {lesson:{teacher:userId!}}: {}),
      },
    });
    console.log("res", response)
    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};
// --------------------------------------

export const createAnnouncement=async ( 
  currentState: currentState,
  data:AnnouncementSchema
)=>{

  try {
      await prisma.announcement.create({
        data: {
          title: data.title,
          description: data.description,
          date:data.date,
          classId:data.classId
          
        }
      })
      // revalidatePath("/list/subject") 
      return {success:true, error:false}
    

 } catch (error) {
      console.log(error)
     return {success:false, error:true}
 }

};

export const updateAnnouncement=async ( 
  currentState: currentState,
  data:AnnouncementSchema
)=>{
  //const {userId, sessionClaims} = await auth();
  //const role = (sessionClaims?.metadata as {role? :string}).role;

  try {


 // const teacherLesson=  await prisma.lesson.findFirst({
 //   where:{
  //     teacherId:userId!,
  //     id:data.lessonId
  //   }
  // })
  //     if(!teacherLesson){
  //       return {success:false, error:true}
  //     }
      await prisma.announcement.update({
        where:{
          id:data.id
        },
        data: {
          title: data.title,
          description: data.description,
          date:data.date,
          classId:data.classId       
        }
  })   
      // revalidatePath("/list/subject") 
     return {success:true, error:false}
  
 } catch (error) {
      console.error(error)
     return {success:false, error:true}
 }

};

export const deleteAnnouncement = async (
  currentState: currentState,
  data: FormData
) => {
    
    const id = data.get("id") as string | null;
    const {userId, sessionClaims} = await auth();
    const role = (sessionClaims?.metadata as {role? :string}).role

    if(!id){
        console.error("No ID provided in the form data.");
        return {success: false, error:true, message:"ID is required"}
      }
      try {
   const response = await prisma.subject.delete({
      where: {
        id: parseInt(id),
        ...(role === "teacher" ? {lesson:{teacher:userId!}}: {}),
      },
    });
    console.log("res", response)
    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};

// --------------------------------------

export const createLesson=async ( 
  currentState: currentState,
  data:LessonSchema
)=>{

  try {
      await prisma.lesson.create({
        data: {
          name: data.name,
          day:data.day,
          startTime:data.startTime,
          endTime:data.endTime,
          classId:data.classId,
          teacherId:data.teacherId,
          subjectId:data.subjectId,
          
        }
      })
      // revalidatePath("/list/subject") 
      return {success:true, error:false}
    

 } catch (error) {
      console.log(error)
     return {success:false, error:true}
 }

};

export const updateLesson=async ( 
  currentState: currentState,
  data:LessonSchema
)=>{
  //const {userId, sessionClaims} = await auth();
  //const role = (sessionClaims?.metadata as {role? :string}).role;

  try {


 // const teacherLesson=  await prisma.lesson.findFirst({
 //   where:{
  //     teacherId:userId!,
  //     id:data.lessonId
  //   }
  // })
  //     if(!teacherLesson){
  //       return {success:false, error:true}
  //     }
      await prisma.lesson.update({
        where:{
          id:data.id
        },
        data: {
          name: data.name,
          day:data.day,
          startTime:data.startTime,
          endTime:data.endTime,
          classId:data.classId,
          teacherId:data.teacherId,
          subjectId:data.subjectId, 
        }
  })   
      // revalidatePath("/list/subject") 
     return {success:true, error:false}
  
 } catch (error) {
      console.error(error)
     return {success:false, error:true}
 }

};

export const deleteLesson = async (
  currentState: currentState,
  data: FormData
) => {
    
    const id = data.get("id") as string | null;
    const {userId, sessionClaims} = await auth();
    const role = (sessionClaims?.metadata as {role? :string}).role

    if(!id){
        console.error("No ID provided in the form data.");
        return {success: false, error:true, message:"ID is required"}
      }
      try {
   const response = await prisma.subject.delete({
      where: {
        id: parseInt(id),
        ...(role === "teacher" ? {lesson:{teacher:userId!}}: {}),
      },
    });
    console.log("res", response)
    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};
//-------------------------------
export const createAttendance=async ( 
  currentState: currentState,
  data:AttendanceSchema
)=>{

  try {
      await prisma.attendance.create({
        data: {
          date:data.date,
          present:data.present,
          studentId:data.studentId,
          lessonId:data.lessonId,
          
        }
      })
      // revalidatePath("/list/subject") 
      return {success:true, error:false}
    

 } catch (error) {
      console.log(error)
     return {success:false, error:true}
 }

};

export const updateAttendance=async ( 
  currentState: currentState,
  data:AttendanceSchema
)=>{
  //const {userId, sessionClaims} = await auth();
  //const role = (sessionClaims?.metadata as {role? :string}).role;

  try {


 // const teacherLesson=  await prisma.lesson.findFirst({
 //   where:{
  //     teacherId:userId!,
  //     id:data.lessonId
  //   }
  // })
  //     if(!teacherLesson){
  //       return {success:false, error:true}
  //     }
      await prisma.attendance.update({
        where:{
          id:data.id
        },
        data: {
          date:data.date,
          present:data.present,
          studentId:data.studentId,
          lessonId:data.lessonId,
        }
  })   
      // revalidatePath("/list/subject") 
     return {success:true, error:false}
  
 } catch (error) {
      console.error(error)
     return {success:false, error:true}
 }

};

export const deleteAttendance = async (
  currentState: currentState,
  data: FormData
) => {
    
    const id = data.get("id") as string | null;
    const {userId, sessionClaims} = await auth();
    const role = (sessionClaims?.metadata as {role? :string}).role

    if(!id){
        console.error("No ID provided in the form data.");
        return {success: false, error:true, message:"ID is required"}
      }
      try {
   const response = await prisma.subject.delete({
      where: {
        id: parseInt(id),
        ...(role === "teacher" ? {lesson:{teacher:userId!}}: {}),
      },
    });
    console.log("res", response)
    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};
// --------------------------------------

export const createResult=async ( 
  currentState: currentState,
  data:ResultSchema
)=>{

  try {
      await prisma.result.create({
        data: {
          score:data.score,
          examId:data.examId
          // day:data.day,
          // startTime:data.startTime,
          // endTime:data.endTime,
          // classId:data.classId,
          // teacherId:data.teacherId,
          // subjectId:data.subjectId,
          
        }
      })
      // revalidatePath("/list/subject") 
      return {success:true, error:false}
    

 } catch (error) {
      console.log(error)
     return {success:false, error:true}
 }

};

export const updateResult=async ( 
  currentState: currentState,
  data:LessonSchema
)=>{
  //const {userId, sessionClaims} = await auth();
  //const role = (sessionClaims?.metadata as {role? :string}).role;

  try {


 // const teacherLesson=  await prisma.lesson.findFirst({
 //   where:{
  //     teacherId:userId!,
  //     id:data.lessonId
  //   }
  // })
  //     if(!teacherLesson){
  //       return {success:false, error:true}
  //     }
      await prisma.lesson.update({
        where:{
          id:data.id
        },
        data: {
          name: data.name,
          day:data.day,
          startTime:data.startTime,
          endTime:data.endTime,
          classId:data.classId,
          teacherId:data.teacherId,
          subjectId:data.subjectId, 
        }
  })   
      // revalidatePath("/list/subject") 
     return {success:true, error:false}
  
 } catch (error) {
      console.error(error)
     return {success:false, error:true}
 }

};

export const deleteResult = async (
  currentState: currentState,
  data: FormData
) => {
    
    const id = data.get("id") as string | null;
    const {userId, sessionClaims} = await auth();
    const role = (sessionClaims?.metadata as {role? :string}).role

    if(!id){
        console.error("No ID provided in the form data.");
        return {success: false, error:true, message:"ID is required"}
      }
      try {
   const response = await prisma.subject.delete({
      where: {
        id: parseInt(id),
        ...(role === "teacher" ? {lesson:{teacher:userId!}}: {}),
      },
    });
    console.log("res", response)
    // revalidatePath("/list/subjects");
    return { success: true, error: false };
  } catch (err) {
    console.error(err);
    return { success: false, error: true };
  }
};