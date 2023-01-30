import React, { useContext } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import SidebarButton from '@oc/components/Sidebar/SidebarButton';
import AuthContext from '@oc/context/AuthContext';

export default function Sidebar() {
  const auth = useContext(AuthContext)

  return (
    <div className="min-h-screen max-h-screen flex flex-col py-4 ml-4">
      {/* bg-[#00000040] border-[#00000040] border-2 */}
      <div className='m-6 rounded-lg w-64 flex justify-center'>
        <div className='py-6'>
          <Image src="/oc_logo.svg" alt="OC" height={2000} width={64}></Image>
        </div>
      </div>
      <div className='space-y-2'>
        <SidebarButton text="Home" href="/dash/me"/>
        <SidebarButton text="My Domains" href="/dash/domains"/>
        <SidebarButton text="Front Page" href="/dash/frontpage"/>
        <SidebarButton text="Hosting" href="/dash/hosting"/>
        {
          (auth.user.admin) && <SidebarButton text="Administration" href="/dash/admin"/>
        }
      </div>

      <div className='mt-auto bg-[#00000080] backdrop-blur-xl flex items-center rounded-lg overflow-hidden shadow-lg'>
        <img src={auth.user.pfp} height={48} width={48}></img>
        <div className='flex justify-center items-center'>
          <h1 className='px-4 py-2'><b>{auth.user.username}#{auth.user.tag}</b></h1>
        </div>
        <div className='ml-auto px-3 flex items-center h-full'>
            <Link href="/auth/logout">
              <button className='bg-red-500 flex items-center hover:scale-110 hover:rotate-6 transition-all active:scale-90 active:-rotate-6'>
                <span className="material-symbols-outlined">
                  logout
                </span>
              </button>
            </Link>
        </div>
      </div>
    </div>
  )
}
