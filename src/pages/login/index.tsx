import { useRouter } from 'next/router'
import React, { Fragment } from 'react'

export default function login() {
  const router = useRouter()
  return (
    <Fragment>
      <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-green-600 to-cyan-800'>
        <div className='rounded-lg p-4 border-2 border-[rgba(0,0,0,0.2)] w-96 backdrop-blur-2xl shadow-lg bg-[rgba(0,0,0,0.3)]'>
          <h1 className='text-3xl font-bold'>👋 welcome back.</h1>
          <h2 className='text-sm'>choose a provider to login with</h2>
          <a href="/auth">
            <button className='mt-8 bg-white text-black px-6 py-2 rounded-lg w-full hover:scale-105 active:scale-95 transition-all'>Login with Discord</button>
          </a>
          {
            (router.query.youfuckedup) && <p className="text-xs pt-2 text-red-300">we couldn't log you in. perhaps you're not on the allowlist :3</p>
          }
        </div>
      </div>
      <div className='absolute bottom-4 left-4'>
        <p>Online Confine</p>
      </div>
    </Fragment>
  )
}
