import Header from '@oc/components/Dashboard/Header'
import HeaderContainer from '@oc/components/Dashboard/HeaderContainer'
import Subtitle from '@oc/components/Dashboard/Subtitle'
import React, { Fragment, useEffect, useState } from 'react'
import Image from 'next/image';
import fetch from '@oc/misc/httpApi';
import { useQuery } from 'react-query'
import { AxiosError } from 'axios';
import LoadingSpinner from '@oc/components/LoadingSpinner';
import SectionTitle from '@oc/components/Dashboard/SectionTitle';
import { useRouter } from 'next/router';
import UserChip from '@oc/components/Misc/UserChip';

export default function subdomaindetail() {
  const router = useRouter()
  const subdomain = useQuery<any, AxiosError>("admin.subdomains", async () => {
    const submissiveDomains = await fetch('/admin/subdomain/list')
    console.log(submissiveDomains.data)
    return await submissiveDomains.data.find((f: any) => f.id == router.query.id)
  })
  const [targetUser, setTarget] = useState("");
  let lastFetchedSuggestion = "";
  const [searchSuggestions, setSuggestions] = useState<any>([])

  useEffect(() => {
    if(targetUser.length < 3) return;
    if(targetUser == lastFetchedSuggestion) return
    lastFetchedSuggestion = targetUser
    fetch.post('/admin/users/search', {
      query: targetUser
    })
    .then(res => {
      setSuggestions(res.data);
    })
  }, [lastFetchedSuggestion, targetUser])

  if(!subdomain.isFetched) {
    return (
      <LoadingSpinner fill='#fff' className='w-12'></LoadingSpinner>
    )
  }

  return (
    <Fragment>
      <HeaderContainer>
        <Header>🔧 {subdomain.data.name}.{subdomain.data.domain}</Header>
        <Subtitle>configure the subdomain</Subtitle>
      </HeaderContainer>

      <SectionTitle>Assigned Users</SectionTitle>

      <form className='flex items-center my-4 space-x-2'>
        <input type="text" placeholder="Search users" name="user" onChange={(e) => setTarget(e.target.value)} required></input>
      </form>
      <div className='flex'>
        {
          searchSuggestions.map((s: any) => (
            <div onClick={() => {
              fetch.patch(`/admin/subdomain/${subdomain.data.id}/assign`, {
                userId: s.id,
              })
              .then(res => {
                subdomain.refetch()
              })
              .catch((err) => {
                console.log(err)
                alert(err.response.data)
              })
            }} className="bg-[#ffffff20] p-2 rounded-md">
              <UserChip pfp={s.pfp} username={s.username + '#' + s.tag}></UserChip>
            </div>
          ))
        }
      </div>


      <table className='border-collapse w-full my-2'>
        <thead>
          <tr>
            <th>
              User
            </th>
            <th className='text-right'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            (subdomain.isLoading)
            ? <LoadingSpinner fill="#fff" className='w-4'></LoadingSpinner>
            : subdomain.data.ownedBy.map((i: any) => (
              <tr>
                <td><UserChip pfp={i.pfp} username={i.username + '#' + i.tag}></UserChip></td>
                <td className='text-right'>
                  <button className="bg-red-500" onClick={() => {
                    fetch.patch(`/admin/subdomain/${subdomain.data.id}/unassign`, {
                      userId: i.id,
                    })
                    .then(res => {
                      subdomain.refetch()
                    })
                    .catch((err) => {
                      console.log(err)
                      alert(err.response.data)
                    })
                  }}>Unassign</button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>

    </Fragment>
  )
}

