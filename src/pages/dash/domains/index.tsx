import Header from '@oc/components/Dashboard/Header'
import HeaderContainer from '@oc/components/Dashboard/HeaderContainer'
import Subtitle from '@oc/components/Dashboard/Subtitle'
import LoadingSpinner from '@oc/components/LoadingSpinner'
import fetch from '@oc/misc/httpApi'
import { AxiosError } from 'axios'
import React, { Fragment } from 'react'
import { useQuery } from 'react-query'
import Link from 'next/link';

export default function domains() {
  const domains = useQuery<any, AxiosError>("domains", async () => {
    const res = await fetch('/@me/domains')
    return res.data
  })

  return (
    <Fragment>
      <HeaderContainer>
        <Header>🌍 my domains</Header>
        <Subtitle>manage your assigned domains here</Subtitle>
      </HeaderContainer>

      <table className='border-collapse w-full'>
        <thead>
          <tr>
            <th>Domain</th>
            <th className='text-right'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            (domains.isLoading)
            ? <LoadingSpinner fill="#fff" className='w-4'></LoadingSpinner>
            : domains.data.domains.map((i: any) => (
              <tr key={i.id}>
                <td>{i.name}.{i.domain}</td>
                <td className='text-right'>
                  <Link href={"/dash/domains/" + i.id + "/dns"}>
                    <button>DNS</button>
                  </Link>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </Fragment>
  )
}
