import React from 'react'
import Image from 'next/image';

export default function UserChip(props: {pfp: string; username: string;}) {
  return (
    <div className='flex items-center space-x-2'>
      <Image src={props.pfp} alt="PFP" width={32} height={32} className="inline rounded-full"/>
      <span>{props.username}</span>
    </div>
  )
}
