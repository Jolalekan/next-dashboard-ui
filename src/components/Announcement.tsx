import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import React from 'react'

const Announcement = async () => {
    const {userId, sessionClaims} = await auth()
    const role = (sessionClaims?.metadata as {role?:string})?.role
    const currentUserId = userId;
  
    const roleConditions = {
        teacher: { lessons: { some: { teacherId: currentUserId! } } },
        student: { students: { some: { id: currentUserId! } } },
        parent: { students: { some: { parentId: currentUserId! } } },
      };

    const data = await prisma.announcement.findMany({
        take: 3,
        orderBy: { date: "desc" },
        where: {
          ...(role !== "admin" && {
            OR: [
              { classId: null },
              { class: roleConditions[role as keyof typeof roleConditions] || {} },
            ],
          }),
        },
      });
      console.log("announce:",data)
    return (
    <div className='bg-white p-4 rounded-md'>
        <div className='flex items-center justify-between'>
            <h1 className='text-xl font-semibold'>Announcement</h1>
            <span className='text-xs gray-400'>View All</span>
        </div>
        <div className='flex flex-col gap-4 mt-4'>

      {data[0] && (
            <div className='bg-skylight rounded-md p-4'>
            <div className='flex items-center justify-between'>
                <h2 className='font-semibold'>{data[0].title}</h2>
                <span className='text-xs bg-white rounded-md px-1 py-1'>{new Intl.DateTimeFormat("en-US").format(data[0].date)}</span>
            </div>
            <p className='text-xs gray-400 mt-1'>{data[0].description}</p>
        </div>
    )}

      {data[1] && (
        <div className='bg-efinityPurplelight rounded-md p-4'>
            <div className='flex items-center justify-between'>
                <h2 className='font-semibold'>{data[1].title} </h2>
                <span className='text-xs bg-white rounded-md px-1 py-1'>{new Intl.DateTimeFormat("en-US").format(data[1].date)}</span>
            </div>
            <p className='text-xs gray-400 mt-1'>{data[1].description}</p>
        </div>
      )
      }
      {data[2] && (
        <div className='bg-efinityYellowLight rounded-md p-4'>
            <div className='flex items-center justify-between'>
                <h2 className='font-semibold'>{data[2].title}</h2>
                <span className='text-xs bg-white rounded-md px-1 py-1'>{new Intl.DateTimeFormat("en-US").format(data[1].date)}</span>
            </div>
            <p className='text-xs gray-400 mt-1'>{data[2].description}</p>
        </div>
      )
      }
        </div>
    </div>
  )
}

export default Announcement