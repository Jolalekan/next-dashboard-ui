"use client"

import { ITEM_PER_PAGE } from '@/lib/settings';
import { useRouter } from 'next/navigation';

const Pagination = ({page, count}:{page:number, count:number}) => {
  const router = useRouter();
  const hasPrevious = ITEM_PER_PAGE * ( page - 1) > 0;
  const hasNext = ITEM_PER_PAGE * (page - 1) + ITEM_PER_PAGE < count;

  const totalPages = Math.ceil(count/ITEM_PER_PAGE);


  const changePage =(newPage : number)=>{
    const params = new URLSearchParams(window.location.search)
      params.set("page", newPage.toString())
      router.push(`${window.location.pathname}?${params}`);
  }

  return (
    <div className='flex p-4 items-center justify-between to-gray-500'>
        <button 
          disabled = {!hasPrevious} 
          className='py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50'
          onClick={()=>changePage(page - 1)}
          >
            Prev
            </button>
        
        <div className=' flex gap-2 text-sm'>
        {Array.from({ length: totalPages }, (_, index) => {
          const pageIndex = index + 1;
          return (
            <button
              key={pageIndex}
              className={`px-2 rounded-sm ${
               page === pageIndex ? "bg-efinityPurple" :""
              }`}
              onClick={()=>{changePage(pageIndex)}}
            >
              {pageIndex}
            </button>
          );
        })}
        
        </div>

        <button className='py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50'
        disabled={!hasNext}
        onClick={()=>{changePage(page + 1)}}
        >Next</button>
    </div>
  )
}

export default Pagination