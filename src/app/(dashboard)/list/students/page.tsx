import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import Image from 'next/image'
import Link from 'next/link'
import { Student, Class, Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { ITEM_PER_PAGE } from '@/lib/settings'
import { auth } from '@clerk/nextjs/server'
import FormContainer from '@/components/FormContainer'

type StudentList = Student &  { class:Class}

const StudentListPage = async({
  searchParams
}:{
  searchParams: {[key: string]:string | undefined}
}) => {

  const {sessionClaims} = await auth();

const role = (sessionClaims?.metadata as {role:string}).role;

const columns = [
  {
    header: "Info", 
    accessor:"info"
  },
  {
    header: "Student ID", 
    accessor:"studentId",
    className: "hidden md:table-cell"
  },
  {
    header: "Grade", 
    accessor:"grade",
    className: "hidden md:table-cell"
  },
  {
    header: "Phone", 
    accessor:"phone",
    className: "hidden lg:table-cell"
  },
  {
    header: "Address", 
    accessor:"address",
    className: "hidden lg:table-cell"
  },
  ...(role === "admin" ?

  [
  {
    header: "Actions", 
    accessor:"actions"
  }]: [])
]

const renderRow= (item:StudentList)=>(
    <tr key={item.id} className='border-b border-gray-200 even:bg-gray-50 text-sm hover:bg-efinityPurplelight'>
        <td className='flex items-center gap-4 p-4'>
          <Image 
            src={item.img || "/noAvatar.png"} 
            alt="photo" 
            height={40} 
            width={40} 
            className='md:hidden xl:block w-10 h-10 rounded-full object-cover'
          />
          <div className='flex flex-col'>
            <h3 className='font-semibold'>{item.name}</h3>
            <p className='text-xs text-gray-500'>{item.class.name}</p>
          </div>
        </td>
        <td className='hidden md:table-cell'>{item.username}</td>
        <td className='hidden md:table-cell'>{item?.class?.name}</td>
        <td className='hidden md:table-cell'>{item.phone}</td>
        <td className='hidden md:table-cell'>{item.address}</td>
        <td>
          <div className='flex items-center gap-2'>
            <Link href={`/list/students/${item.id}`}>
              <button className="w-7 h-7 flex items-center justify-center rounded-full bg-sky">
                <Image src="/view.png" width={16} height={16} alt=""/>
              </button>
            </Link>
            {role === "admin" && (
              // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-efinityPurple">
              //   <Image src="/delete.png" width={16} height={16} alt=""/>
              // </button>
              <FormContainer table="student" type="delete" id={item.id}/>
              )
            }
          </div>
        </td>
    </tr>
)


  const {page, ...queryParams} = searchParams
  const p = page ? parseInt(page) : 1;

   //URL PARAMS CONDITION AND PROTECT THE URL
   const query: Prisma.StudentWhereInput={}

   if(queryParams){
      for(const[key, value] of Object.entries(queryParams)){
        if(value !== undefined){
          switch(key){
            case"teacherId":
            query.class={
              lessons:{
                some:{
                  teacherId:value
                }
                }
              }
              break;
              case"search":
              query.name={contains:value, mode:"insensitive"};
              break;
              default:
                break;
            }
        }
      }
   }

  const [data, count] = await prisma.$transaction([
       prisma.student.findMany({
        where:query,
      include:{
        class:true
      },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1)
      
    }),
    prisma.student.count({where:query})
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
            {role=== "admin" && (
                // <button className='w-8 h-8 flex items-center justify-center rounded-full bg-efinityYllow'><Image src="/plus.png" alt='' width={14} height={14}/></button>
                <FormContainer table="student" type="create"/>
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

export default StudentListPage