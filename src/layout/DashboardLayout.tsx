import Sidebar from '@oc/components/Sidebar/Sidebar'
import React, { Fragment, ReactPropTypes, useContext, useState } from 'react'
import Image from 'next/image';
import { useRouter } from 'next/router';
import AuthContext, { IAuthUser } from '@oc/context/AuthContext';
import { useQuery } from 'react-query'
import fetch from '@oc/misc/httpApi';
import LoadingSpinner from '@oc/components/LoadingSpinner';

interface PDashboardLayout {
  children: React.ReactNode[] | React.ReactNode
}

export default function DashboardLayout(props: PDashboardLayout) {
  const [user, setUser] = useState<IAuthUser>({loading: true, loggedIn: false})
  let authCtx = {user, setUser};

  const router = useRouter()

  const q = useQuery("user", async () => {
    const me = await fetch('/@me')
    setUser({loading: false, ...me.data})
  })  
  

  if(q.error) {
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={authCtx}>
      <div className='relative flex min-h-screen center justify-center z-20'>
        <Sidebar/>
        <div className="w-2/3 max-h-screen">
          <div className='m-4 bg-[#000000a0] rounded-lg backdrop-blur-3xl p-8 overflow-scroll h-full'>
            {
              (authCtx.user.loading)
              ? <div className='flex items-center justify-center w-full h-full'><LoadingSpinner fill='#fff' className='w-12'></LoadingSpinner></div>
              : props.children
            }
          </div>
        </div>
      </div>
      <div className='absolute w-full h-full bg-[#00000020] top-0 left-0 z-10'/>
      <Image src="/blob_wallpaper.jpg" fill={true} className='z-0 object-center object-cover' alt="wallpaper"></Image>
    </AuthContext.Provider>
  )
}
