import React, { ReactNode } from 'react'

export default function HeaderContainer(props: {children: ReactNode[] | ReactNode}) {
  return (
    <div className='pb-2'>
      {props.children}
    </div>
  )
}
