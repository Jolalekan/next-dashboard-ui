import { prisma } from '@/lib/prisma'
import Image from 'next/image'

const UserCard = async({
  type
}:{
  type: "admin" | "student" | "parent" | "teacher";
}) => {
  
  const modelMap : Record<typeof type, any >  = {
    admin:    prisma.admin,
    teacher:  prisma.teacher,
    student:  prisma.student,
    parent:   prisma.parent,
  }
  const data = await modelMap[type].count()

  return (
    <div className='rounded-2xl odd:bg-efinityPurple even:bg-efinityYllow p-4 flex-1 min-w-[136px]'>
        <div className='flex justify-between items-center'>
            <span className='text-[10px] bg-white px-2 py-1  rounded-full text-green-600'>2024/25</span>
            <Image src="/more.png" width={20} height={20} alt='cardIcon'/>
        </div>
        <h1 className='text-2xl my-4 font-semibold'>{data}</h1>
        <h2 className='capitalize text-sm font-medium'>{type}</h2>
        </div>
  )
}

export default UserCard