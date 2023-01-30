import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import axios from 'axios'
import { useQuery } from 'react-query';
import LoadingSpinner from '@oc/components/LoadingSpinner';

// Index.getInitialProps = async () => {
//   const data = await axios.get(process.env.NEXT_DOMAIN + '/api/frontpage')
//   return {
//     pages: data.data
//   }
// }

export default function Index(props: {pages: any;}) {
  const pages = useQuery("frontpage", async () => {
    const data = await axios.get('/api/frontpage')
    return data.data
  })  
  
  return (
    <div className='flex items-center flex-col pt-12'>
      <div className='flex items-center space-x-8 py-6  '>
        <Image src="/oc_logo.svg" alt="OC" height={2000} width={64}></Image>
        <h1 className='text-2xl font-bold'>Online Confine</h1>
      </div>
      <div className='py-8 flex-col items-center grid grid-cols-3 gap-4'>
        {
          (pages.isLoading)
          ? <LoadingSpinner fill="#fff" className='w-12'></LoadingSpinner>
          : pages.data.map((p: any) => (
            <a href={'https://' + p.domain}>
              <div className="flex items-center justify-center h-40 w-40 rounded-md text-3xl shadow-lg hover:-translate-y-1 transition-all duration-75" style={{backgroundColor: '#' + p.color}}>
                <h1>{p.name}</h1>
              </div>
            </a>
            // <span className='text-xs'>({p.domain})</span>
          ))
        }
      </div>
      {/* <p className='pb-24'>coming soon</p> */}
      <div className='flex items-center text-sm space-x-8 py-8'>
        <p>
          made with 💜 by mae
        </p>
        <Link className='text-purple-300 underline decoration-wavy underline-offset-4' href="/login">
          <p>login</p>
        </Link>
      </div>
    </div>
  )
}
