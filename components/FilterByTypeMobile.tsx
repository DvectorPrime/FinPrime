export default function FilterByTypeMobile(){
    return (
        <div className="grid grid-cols-3 col-span-2 h-full bg-neutral-200 rounded-2xl lg:hidden">
            <button className="w-full h-10 px-3
              flex items-center justify-center
              font-sans text-sm font-semibold text-white leading-[22px]
              bg-[#0079BF] border-none rounded-2xl shadow-xs
              transition-colors duration-200
              hover:bg-[#006CAB]
              active:bg-[#005586]
              disabled:opacity-40 disabled:cursor-not-allowed">All</button>
            <button className="w-full h-10 px-3
              flex items-center justify-center
              font-sans text-sm leading-[22px] font-medium text-neutral-600
              bg-transparent border-none rounded-2xl
              transition-colors
              hover:bg-black/5
              disabled:opacity-40 disabled:cursor-not-allowed">Income</button>
            <button className="w-fullh-10 px-3
              flex items-center justify-center
              font-sans text-sm leading-[22px] font-medium text-neutral-600
              bg-transparent border-none rounded-2xl
              transition-colors
              hover:bg-black/5
              disabled:opacity-40 disabled:cursor-not-allowed">Expenditure</button>
          </div>
    )
}