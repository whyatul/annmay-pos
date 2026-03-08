import React from 'react'

const MiniCard = ({ title, icon, value, accent = "#f6b100" }) => {
  return (
    <div className='bg-[#1a1a1a] border border-[#222] py-4 px-4 rounded-xl hover:border-[#333] transition-colors'>
      <div className='flex items-center justify-between'>
        <p className='text-[#666] text-xs font-medium uppercase tracking-wider'>{title}</p>
        <div
          className='p-2 rounded-lg text-sm'
          style={{ backgroundColor: `${accent}15`, color: accent }}
        >
          {icon}
        </div>
      </div>
      <h1 className='text-[#f5f5f5] text-2xl font-bold mt-2'>{value}</h1>
    </div>
  )
}

export default MiniCard