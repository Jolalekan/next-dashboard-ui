import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { prisma } from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { auth } from "@clerk/nextjs/server";
import {
  Attendance,
  Prisma,
  Student,
  Lesson
} from "@prisma/client";
import Image from "next/image";


type AttendanceList = Attendance & {lesson:Lesson; student:Student};


const AttendanceListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role: string }).role;
  const currentUserId = userId;
  console.log(currentUserId)
  const columns = [
    {
      header: "Present",
      accessor: "present",
    },
    {
      header: "Student",
      accessor: "student",
      className: "hidden md:table-cell",
    },

    {
      header: "Lesson",
      accessor: "lesson",
      className: "hidden md:table-cell",
    },
    {
      header: "Date",
      accessor: "date",
      className: "hidden md:table-cell",
    },
    
    ...(role === "admin" || role === "teacher"
      ? [
          {
            header: "Actions",
            accessor: "actions",
          },
        ]
      : []),
  ];

  const renderRow = (item: AttendanceList) =>{
    return(
      
      <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-gray-50 text-sm hover:bg-efinityPurplelight"
      >
      <td className="flex items-center gap-4 p-4">
        {item.present ? "Present" : "Absent"}
      </td>
      <td className="hidden md:table-cell">{item.student.name + " " + item.student.surname}</td>
      <td className="hidden md:table-cell">
        {item.lesson.name}
      </td>
      <td className="hidden md:table-cell">
        {new Date(item.date).toLocaleDateString()} {/* Format the date */}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "teacher") && (
            <>
              <FormContainer table="attendance" type="update" data={item} />
              <FormContainer table="attendance" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
}
  
  const { page, ...queryParams } = searchParams;

  const p = page ? parseInt(page) : 1;

  const query: Prisma.AttendanceWhereInput = {};

  query.lesson = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "lessonId":
            query.lesson.name = value;
            break;
          
          case "search":
            query.student = {
              name: { contains: value, mode: "insensitive" },
            };
            break;
          default:
            break;
        }
      }
    }
  }

  //ROLES PARAMS CONDITIONS;
  switch (role) {
    case "admin":
      break;
    case "teacher":
      query.lesson.teacherId = currentUserId!;
      break;
      case"student":
      query.lesson.class={
        students:{
          some:{
            id:currentUserId!
          }
        }
      }
      break;
      case"parents":
      query.lesson.class={
        students:{
          some:{
            parentId:currentUserId!
          }
        }
      }
      break;
    default:
      break;
  }

  const [data, count] = await prisma.$transaction([
    prisma.attendance.findMany({
      include: {
        lesson: {
          select: {
            name: true,
           
          },
        },
        student: {
          select: {
            name: true,
            surname:true
          },
        },
      },
      
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.attendance.count({ where: query }),
  ]);
  console.log("Attendance data:", data);
  return (
    <div className="bg-white p-4 rounded-md flex-1 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h2 className="hidden md:block text-lg font-semibold">All Attendance</h2>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-2 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-efinityYllow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-efinityYllow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {(role === "admin" || role === "teacher")&& (
              // <button className="w-8 h-8 flex items-center justify-center rounded-full bg-efinityYllow">
              //   <Image src="/plus.png" alt="" width={14} height={14} />
              // </button>
              <FormContainer table='assignment' type='create'/>
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* PAGINATION */}

      <Pagination page={p} count={count} />
    </div>
  );
};

export default AttendanceListPage;
