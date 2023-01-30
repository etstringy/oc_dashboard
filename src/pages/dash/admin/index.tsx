import Header from '@oc/components/Dashboard/Header'
import HeaderContainer from '@oc/components/Dashboard/HeaderContainer'
import Subtitle from '@oc/components/Dashboard/Subtitle'
import React, { Fragment } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import fetch from '@oc/misc/httpApi';
import { useQuery } from 'react-query'
import { AxiosError } from 'axios';
import LoadingSpinner from '@oc/components/LoadingSpinner';
import SectionTitle from '@oc/components/Dashboard/SectionTitle';
import UserChip from '@oc/components/Misc/UserChip';

export default function admin() {
  const subdomainList = useQuery<any, AxiosError>("admin.subdomains", async () => {
    const submissiveDomains = await fetch('/admin/subdomain/list')
    return submissiveDomains.data
  })

  const allowlistedUsers = useQuery<any, AxiosError>("admin.allowlist", async () => {
    const allowlist = await fetch('/admin/allowlist')
    return allowlist.data
  })

  const zones = useQuery<any, AxiosError>("admin.cfzones", async () => {
    const res = await fetch('/admin/cfzones')
    return res.data
  })

  return (
    <Fragment>
      <HeaderContainer>
        <Header>🔧 admin</Header>
        <Subtitle>go crazy</Subtitle>
      </HeaderContainer>

      <SectionTitle>Subdomains</SectionTitle>

      <form className='flex items-center my-4 space-x-2' onSubmit={async (e) => {
        e.preventDefault()
        fetch.put('/admin/subdomain', {
          name: (e.target as any).name.value,
          cfZoneId: (e.target as any).cfZoneId.value.split(";")[1],
          domain: (e.target as any).cfZoneId.value.split(";")[0]
        })
        .then(res => {
          subdomainList.refetch()
        })
        .catch((err) => {
          console.log(err)
          alert(err.response.data)
        })
      }}>
        <input type="text" placeholder="name" name="name" required></input>
        <select name="cfZoneId" className='w-48' placeholder='domain' required>
          <option disabled selected hidden>select domain</option>
          {
            (zones.isLoading)
            ? <option value="" disabled>Loading</option> 
            : zones.data.map((z: any) => (
              <option key={z.id} value={z.name + ";" + z.id}>{z.name}</option> 
            ))
          }
        </select>
        <button formAction='submit'>Create</button>
      </form>

      <table className='border-collapse w-full my-2'>
        <thead>
          <tr>
            <th>Subdomain</th>
            <th>Domain</th>
            <th>Cloudflare Zone ID</th>
            <th>Assigned to</th>
            <th className='text-right'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            (subdomainList.isLoading)
            ? <LoadingSpinner fill="#fff" className='w-4'></LoadingSpinner>
            : subdomainList.data.map((i: any) => (
              <tr key={i.id}>
                <td>{i.name}.{i.domain}</td>
                <td>{i.domain}</td>
                <td>{i.cfZoneId}</td>
                <td>{(i.ownedBy) ? i.ownedBy.length : 0} users</td>
                <td className='text-right space-x-2'>
                  <Link href={"/dash/admin/subdomain/" + i.id}>
                    <button>Details</button>
                  </Link>
                  <button className="bg-red-500" onClick={() => {
                    fetch.delete(`/admin/subdomain/${i.id}`)
                    .then(res => {
                      subdomainList.refetch()
                    })
                    .catch((err) => {
                      console.log(err)
                      alert(err.response.data)
                    })
                  }}>Delete</button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>

      <SectionTitle>User Allowlist</SectionTitle>

      <form className='flex items-center my-4 space-x-2' onSubmit={async (e) => {
        e.preventDefault()
        fetch.put('/admin/allowlist', {
          discordId: (e.target as any).discordId.value,
        })
        .then(res => {
          allowlistedUsers.refetch()
        })
        .catch((err) => {
          console.log(err)
          alert(err.response.data)
        })
      }}>
        <input type="text" placeholder="Discord ID" name="discordId" required></input>
        <button formAction='submit'>Add to Allowlist</button>
      </form>

      <table className='border-collapse w-full my-2'>
        <thead>
          <tr>
            <th>Discord ID</th>
            <th>Last Known As</th>
            <th className='text-right'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            (allowlistedUsers.isLoading)
            ? <LoadingSpinner fill="#fff" className='w-4'></LoadingSpinner>
            : allowlistedUsers.data.map((i: any) => (
              <tr key={i.discordId}>
                <td>{i.discordId}</td>
                <td>
                  {
                    (i.known)
                    ? <UserChip pfp={i.known.pfp} username={i.known.username + '#' + i.known.tag}/>
                    : ""
                  }
                </td>
                <td className='text-right'>
                  <button className="bg-red-500" onClick={() => {
                    fetch.delete(`/admin/allowlist/`, {
                      data: {
                        id: i.id
                      }
                    })
                    .then(res => {
                      allowlistedUsers.refetch()
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

