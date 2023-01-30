import React from 'react'
import Image from 'next/image';
import { useRouter } from 'next/router';

interface PSidebarButton {
  text: string;
  href: string;
}

export default function SidebarButton(props: PSidebarButton) {
  const router = useRouter()
  return (
    <button 
    onClick={() => { router.push(props.href) }}
    className='py-3 w-full rounded-lg bg-[#000000a0] border-[#00000030] border-2 flex justify-center backdrop-blur-lg transition-all hover:scale-105 active:scale-90'>
      {props.text || "Button"}
    </button>
    // <div className='mx-4 my-2 rounded-lg bg-[#33333360] border-[#000000ff] border-2 flex justify-center backdrop-blur-lg'>
    //   <div className='py-3'>
    //     <span>Button</span>
    //   </div>
    // </div>
  )
}
