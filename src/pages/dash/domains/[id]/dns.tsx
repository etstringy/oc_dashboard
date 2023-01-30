import Header from '@oc/components/Dashboard/Header'
import HeaderContainer from '@oc/components/Dashboard/HeaderContainer'
import Subtitle from '@oc/components/Dashboard/Subtitle'
import LoadingSpinner from '@oc/components/LoadingSpinner'
import fetch from '@oc/misc/httpApi'
import { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import React, { Fragment } from 'react'
import { useQuery } from 'react-query'

export default function dns() {
  const router = useRouter()
  const records = useQuery<any, AxiosError>(`dns.${router.query.id}`, async () => {
    const res = await fetch(`/domain/${router.query.id}/dns`)
    return res.data
  })

  return (
    <Fragment>
      <HeaderContainer>
        <Header>🏷️ dns</Header>
        <Subtitle>manage your subdomain's dns records</Subtitle>
      </HeaderContainer>

      <p className='text-sm py-2'>DNS name must end with your subdomain (ex: <code>meow.onlineconfine.lol</code>)</p>
      <form className='flex items-center my-4 space-x-2' onSubmit={async (e) => {
        e.preventDefault()
        fetch.put(`/domain/${router.query.id}/dns`, {
          type: (e.target as any).type.value,
          name: (e.target as any).name.value,
          content: (e.target as any).content.value
        })
        .then(res => {
          records.refetch()
        })
        .catch((err) => {
          console.log(err)
          alert(err.response.data)
        })
      }}>
        <select name="type" required>
          <option value="A">A</option>
          <option value="CNAME">CNAME</option>
          <option value="MX">MX</option>
          <option value="TXT">TXT</option>
        </select>
        <input type="text" placeholder="Name" name="name" required></input>
        <input type="text" placeholder="Content" name="content" required></input>
        <button formAction='submit'>Create</button>
      </form>

      <table className='border-collapse w-full'>
        <thead>
          <tr>
            <th>Type</th>
            <th>Name</th>
            <th>Content</th>
            <th className='text-right'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            (records.isLoading)
            ? <LoadingSpinner fill="#fff" className='w-4'></LoadingSpinner>
            : records.data.map((i: any) => (
              <tr key={i.id}>
                <td>{i.type}</td>
                <td>{i.name}</td>
                <td>{i.content}</td>
                <td className='text-right'>
                  <button className="bg-red-500" onClick={() => {
                    fetch.delete(`/domain/${router.query.id}/dns`, {
                      data: {
                        id:  i.id
                      }
                    })
                    .then(res => {
                      records.refetch()
                    })
                    .catch((err) => {
                      console.log(err)
                      alert(err.response.data)
                    }) 
                  }}>Remove</button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </Fragment>
  )
}
