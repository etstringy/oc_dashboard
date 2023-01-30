import React from 'react'

interface PChip {
  text: string;
}

export default function Chip(props: PChip) {
  return (
    <div className='inline px-2 py-1 bg-blue-600 font-normal text-sm rounded-full mx-2'>
      {props.text}
    </div>
  )
}
