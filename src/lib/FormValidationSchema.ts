import { z } from "zod";

export const subjectSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().min(1, { message: 'Subject name is required' }),
    teachers: z.array(z.string()), // teachers Ids
   
  });

 export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: "Subject name is required!" }),
  capacity: z.coerce.number().min(1, { message: "Capacity name is required!" }),
  gradeId: z.coerce.number().min(1, { message: "Grade name is required!" }),
  supervisorId: z.coerce.string().optional(),
    
  });

 export type ClassSchema = z.infer<typeof classSchema>;

 export const teacherSchema = z.object({
  id: z.string(),
  username: z
    .string()
    .min(3, { message: 'Username must not be less that 3 characters' })
    .max(20, { message: 'Username can not be more than 20 characters long' }),
  // email: z.string().email({ message: "invalid email address" }).optional().or(z.literal("")),
  email: z.string().email({ message: "invalid email address" }).optional().or(z.literal("")),
  password: z.string().min(8, { message: "Password must be 8 character long" }).or(z.literal("")).optional(),
  name: z.string().min(1, { message: "Name is required" }),
  surname: z.string().min(1, { message: "Surname is required" }),
  phone: z.string().optional(),
  address: z.string(),
  bloodType: z.string().min(1, { message: "Blood type is required" }),
  birthday: z.coerce.date({ message: "Birthday is required" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required" }),
  img: z.string().optional(),
  subjects: z.array(z.string()).optional(), //To store subject Ids
});

export type TeacherSchema = z.infer<typeof teacherSchema>


export const studentSchema = z.object({
  id: z.string(),
  username: z
  .string()
  .min(3, { message: 'Username must not be less that 3 characters' })
  .max(20, { message: 'Username can not be more than 20 characters long' }),
  email: z.string().email({ message: "invalid email address" }),
  password: z.string().min(8, { message: "Password must be 8 character long" }).or(z.literal("")).optional(),
  name: z.string().min(1, { message: "Name is required" }),
  surname: z.string().min(1, { message: "Surname is required" }),
  phone: z.string().min(1, { message: "Phone is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  bloodType: z.string().min(1, { message: "Blood type is required" }),
  birthday: z.coerce.date({ message: "Birthday is required" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required" }),
  img:  z.string().optional(),
  gradeId: z.coerce.number().min(1, { message: "Grade is required" }),
  classId: z.coerce.number().min(1, { message: "Class is required" }),
  parentId: z.string().min(1, { message: "Parent Id is required" }),
});

export type StudentSchema = z.infer<typeof studentSchema>

export const examSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: 'Subject name is required' }),
  startTime: z.coerce.date({ message: "Start time is required" }),
  endTime: z.coerce.date({ message: "End time is required" }),
  lessonId: z.coerce.number({ message: "Lesson is required!" }),
 
});

export type ExamSchema = z.infer<typeof examSchema>;

// ---------------------------
export const assignmentSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: 'Subject name is required' }),
  startDate: z.coerce.date({ message: "Start date is required" }),
  dueDate: z.coerce.date({ message: "End date is required" }),
  lessonId: z.coerce.number({ message: "Lesson is required!" }),
 
});

export type AssignmentSchema = z.infer<typeof assignmentSchema>;

// -----------------------------------


export const eventSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: 'Subject name is required' }),
  description: z.string().min(1, { message: 'Description name is required' }),
  startTime: z.coerce.date({ message: "Start date is required" }),
  endTime: z.coerce.date({ message: "End date is required" }),
  classId: z.coerce.number({ message: "Class is required!" }),
 
});

export type EventSchema = z.infer<typeof eventSchema>;

// -----------------------------------


export const announcementSchema = z.object({
  id: z.coerce.number().optional(),
  title: z.string().min(1, { message: 'Subject name is required' }),
  description: z.string().min(1, { message: 'Description name is required' }),
  date: z.coerce.date({ message: "Date is required" }),
  classId: z.coerce.number({ message: "Class is required!" }),
 
});

export type AnnouncementSchema = z.infer<typeof announcementSchema>;

export const lessonSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, { message: 'Subject name is required' }),
  day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],  { message: "Day is required" }),
  startTime: z.coerce.date({ message: "Start date is required" }),
  endTime: z.coerce.date({ message: "End date is required" }),
  classId: z.coerce.number({ message: "Class is required!" }),
  teacherId: z.string().min(1, { message: 'Teacher name is required' }),
  subjectId:z.coerce.number({ message: "Lesson is required!" }),
  attendance: z.boolean().optional(),
  exams: z.array(z.string()).optional(),
  assignments:z.array(z.string()).optional(),
})

export type LessonSchema = z.infer<typeof lessonSchema>;

//-------------------------------


export const attendanceSchema = z.object({
  id: z.coerce.number().optional(),
  date: z.coerce.date({ message: "Date is required" }),
  present: z.boolean(),
  lessonId: z.coerce.number({ message: "Lesson ID is required!" }),
  studentId: z.string().min(1, { message: ' Student ID is required' }),
});

export type AttendanceSchema = z.infer<typeof attendanceSchema>;


//TODO
export const resultSchema = z.object({
  id: z.coerce.number(),
  score: z.coerce.number().min(0, { message: "Score must be at least 0" }).max(100, { message: "Score must be at most 100" }),
  examId: z.coerce.number(),
  studentId: z.string().min(1, { message: ' Student ID is required' }),
  assignmentId: z.string().min(1, { message: ' Assignment ID is required' }),

  

  // attendances: z
  //   .array(
  //     z.object({
  //       id: z.number().optional(),
  //       studentId: z.number(),
  //       status: z.enum(["Present", "Absent"]),
  //     })
  //   )
  //   .optional(),


})



export type ResultSchema = z.infer<typeof resultSchema>;
