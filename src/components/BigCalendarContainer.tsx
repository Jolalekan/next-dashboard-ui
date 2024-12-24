import { prisma } from '@/lib/prisma'
import React from 'react'
import BigCalendar from './BIgCalendar';
import { adjustScheduleToCurrentWeek } from '@/lib/utils';

const BigCalendarContainer = async({
    type,
    id
}:{
    type: "teacherId" | "classId",
    id: string | number,
}) => {
    const dataRes = await prisma.lesson.findMany({
        where:{
            ...(type === "teacherId"
                ? {teacherId : id as string}
                : {classId: id as number}
            )
        },
    });

    const data = dataRes.map((lesson)=>({
        title: lesson.name,
        start: lesson.startTime,
        end: lesson.endTime,
    }))

    console.log("data", data)
    
    const schedule = adjustScheduleToCurrentWeek(data)
  return <BigCalendar schedule={schedule}/>
}

export default BigCalendarContainer