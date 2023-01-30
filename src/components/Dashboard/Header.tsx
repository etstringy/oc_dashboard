import React, { ReactNode } from 'react'

export default function Header(props: {children: ReactNode}) {
  return (
    <h1 className='text-4xl font-bold my-2'>{props.children}</h1>
  )
}
