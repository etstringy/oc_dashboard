import React, { ReactNode } from 'react'

export default function SectionTitle(props: {children: ReactNode}) {
  return (
    <h3 className='text-2xl font-bold mt-8 mb-2'>{props.children}</h3>
  )
}
