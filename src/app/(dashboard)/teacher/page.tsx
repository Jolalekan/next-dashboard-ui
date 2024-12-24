import Announcement from '@/components/Announcement'
import BigCalendarContainer from '@/components/BigCalendarContainer'
import EventCalendarContainer from '@/components/EventCalendarContainer'
import { auth } from '@clerk/nextjs/server'


const TeacherPage = async({
  searchParams
}:{
  searchParams:{[key:string]:string | undefined}
}) => {

  const {userId} = await auth()

  return (
    <div className='flex-1 flex p-4 gap-4 flex-col xl:flex-row'>
     {/* LEFT */}
      <div className='w-full xl:w-2/3'>
      <div className='h-full bg-white rounded-md'>
        <h1 className='text-xl font-semibold'>Schedule</h1>
        <BigCalendarContainer type="teacherId" id={userId!}/>
      </div>
      </div>
      {/* RIGHT */}
      <div className='w-full xl:w-1/3 flex flex-col gap-8'>
        <EventCalendarContainer searchParams={searchParams}/>
        <Announcement/>
      </div>
      </div>
  )
}

export default TeacherPage