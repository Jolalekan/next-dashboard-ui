import Announcement from '@/components/Announcement'
import BigCalendarContainer from '@/components/BigCalendarContainer'
import { prisma } from '@/lib/prisma'

import { auth } from '@clerk/nextjs/server'

import React from 'react'

const ParentPage = async() => {
  const {userId} = await auth()

  const currentUserId = userId;
  const students = await prisma.student.findMany({
    where: {
      parentId: currentUserId!,
    },
  });
  console.log("student",students)
  return (
    <div className='flex-1 flex p-4 gap-4 flex-col xl:flex-row'>
     {/* LEFT */}
      <div className='w-full xl:w-2/3'>
      {students.map((student)=>(

        <div className='h-full bg-white rounded-md'>
        <h1 className='text-xl font-semibold'>Schedule ({student.name + " " +student.surname})</h1> 
        <BigCalendarContainer type='classId' id={student.classId}/>
      </div>
      ))}
      </div>
      {/* RIGHT */}
      <div className='w-full xl:w-1/3 flex flex-col gap-8'>
      
        <Announcement/>
      </div>
      </div>
  )
 }

export default ParentPage