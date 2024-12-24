import FormContainer from '@/components/FormContainer'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { prisma } from '@/lib/prisma'
import { ITEM_PER_PAGE } from '@/lib/settings'
import { auth } from '@clerk/nextjs/server'
import { Class, Lesson, Prisma, Subject, Teacher } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'

type LessonList = Lesson & {subject:Subject} & {teacher:Teacher} & {class:Class};

const LessonListPage = async({
  searchParams,
}:{
  searchParams:{[key: string]: string | undefined}
}) => {
  const {userId, sessionClaims} = await auth()
  const role = (sessionClaims?.metadata as { role?: string })?.role;

const columns = [
  {
    header: "Subject", 
    accessor:"subject",

  },

  {
    header: "Class", 
    accessor:"class",
    className: "hidden md:table-cell"
  },
  {
    header: "Teacher", 
    accessor:"Teacher",
    className: "hidden md:table-cell"
  },
 ...(role === "admin"
 ? [
  {
    header: "Actions", 
    accessor:"actions"
  }] :[]),
]

const renderRow= (item:LessonList)=>(
    <tr key={item.id} className='border-b border-gray-200 even:bg-gray-50 text-sm hover:bg-efinityPurplelight'>
        
         
          
          <td className='flex items-center gap-4 p-4'>{item.subject.name}</td>
        
          <td className='hidden md:table-cell'>{item.class.name}</td>
          <td className='hidden md:table-cell'>{item.teacher.name + " " + item.teacher.surname}</td>   

        <td>
          <div className='flex items-center gap-2'>
          
            {role === "admin" && (
                <>
                <FormContainer table="lesson" type="update" data={item}/>
                <FormContainer table="lesson" type="delete" id={item.id}/>
                </>
              )
            }
          </div>
        </td>
    </tr>
)


  const {page, ...queryParams} = searchParams;

  const p = page ? parseInt(page) : 1;

  const query : Prisma.LessonWhereInput ={};

  if(queryParams){
    for(const [key, value] of Object.entries(queryParams)){
      if(value !== undefined){
        switch(key){
          case"classId":
          query.classId = parseInt( value);
          break;
          case"teacherId":
          query.teacherId = value;
          break;
          case"search":
          query.OR =[
            {subject: {name:{contains:value, mode:"insensitive"}}},
            {teacher:{ name:{contains:value, mode:"insensitive"}}}
          ]
          break;
          default:
            break;
        }
      }
    }
  }
  const [data, count] = await prisma.$transaction([
    prisma.lesson.findMany({
      where:query,
      include:{
        teacher:{select:{name:true, surname:true}},
        class:{select:{name:true}},
        subject:{select: {name:true}}
      },
      take:ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1)
    }),
    prisma.lesson.count({where:query})
  ])

  return (
    <div className='bg-white p-4 rounded-md flex-1 mt-0'>
      {/* TOP */}
      <div className='flex items-center justify-between'>
        <h2 className='hidden md:block text-lg font-semibold'>All Students</h2>
        <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
          <TableSearch/>
          <div className='flex items-center gap-2 self-end'>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-efinityYllow'><Image src="/filter.png" alt='' width={14} height={14}/></button>
            <button className='w-8 h-8 flex items-center justify-center rounded-full bg-efinityYllow'><Image src="/sort.png" alt='' width={14} height={14}/></button>
            {(role=== "admin" || role === "teacher") && (
              <FormContainer table="lesson" type="create" />
            )}
          </div>
        </div>
      </div>
         {/* LIST */}
        <Table columns={columns} renderRow={renderRow} data={data}/>

      {/* PAGINATION */}
      
        <Pagination page={p} count={count}/>
     
    </div>
  )
}

export default LessonListPage