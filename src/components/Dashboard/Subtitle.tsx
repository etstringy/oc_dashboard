import React, { ReactNode } from 'react'

export default function Subtitle(props: {children: ReactNode}) {
  return (
    <h3 className='text-sm my-2'>{props.children}</h3>
  )
}
