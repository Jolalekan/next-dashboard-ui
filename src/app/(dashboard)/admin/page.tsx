import Announcement from '@/components/Announcement'
import AttendanceCharContainer from '@/components/AttendanceCharContainer'
import AttendantChart from '@/components/AttendantChart'
import CountChatContainer from '@/components/CountChatContainer'
import EventCalendar from '@/components/EventCalendar'
import EventCalendarContainer from '@/components/EventCalendarContainer'
import FInanceChart from '@/components/FInanceChart'
import UserCard from '@/components/UserCard'
import React from 'react'

const AdminPage = ({
  searchParams
}:{
  searchParams: {[key:string]:string | undefined}

}) => {
    
  return (
    <div className='flex flex-col p-4 gap-4 md:flex-row'>
      {/* LEFT */}
      <div className='w-full lg:w-2/3 flex flex-col gap-8'>
      {/* USER CARD */}
      <div>
        <div className='flex justify-between gap-4 flex-wrap'>
          <UserCard type="student"/>
          <UserCard type="parent"/>
          <UserCard type="teacher"/>
          <UserCard type="admin"/>
        </div>
        {/* MIDDLE CHART*/}
        <div className='flex flex-col gap-4 lg:flex-row py-4'>
          {/* COUNT CHART */}
          <div className='w-full lg:w-1/3 h-[450px] '>
          <CountChatContainer/>
          </div>
          {/* ATTENDANT CHART */}
          <div className='w-full lg:w-2/3 h-[450px] '>
          <AttendanceCharContainer/>
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className='w-full h-[500px]'>
        <FInanceChart/>
        </div>
      </div>
      </div>
      {/* RIGHT */}
      <div className='w-full lg:w-1/3 flex flex-col gap-8'>
        <EventCalendarContainer searchParams={searchParams}/>
        <Announcement/>
      </div>
      </div>
  )
}

export default AdminPage