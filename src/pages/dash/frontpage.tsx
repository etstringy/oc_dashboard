import Header from '@oc/components/Dashboard/Header'
import HeaderContainer from '@oc/components/Dashboard/HeaderContainer'
import Subtitle from '@oc/components/Dashboard/Subtitle'
import React, { Fragment } from 'react'
import { useQuery } from 'react-query'
import fetch from '@oc/misc/httpApi';
import { AxiosError } from 'axios'
import LoadingSpinner from '@oc/components/LoadingSpinner'

export default function frontpage() {
  const domains = useQuery<any, AxiosError>("domains", async () => {
    const res = await fetch('/@me/domains')
    return res.data
  })

  const frontpage = useQuery<any, AxiosError>("frontpage", async () => {
    const res = await fetch('/@me/frontpage')
    return res.data
  })
  
  return (
    <Fragment>
      <HeaderContainer>
        <Header>🖥️ frontpage</Header>
        <Subtitle>configure your link on the front page</Subtitle>
      </HeaderContainer>
      <form className='flex items-center my-4 space-x-2' onSubmit={async (e) => {
        e.preventDefault()
        fetch.patch('/@me/frontpage', {
          domainId: (e.target as any).domain.value,
          text: (e.target as any).name.value,
          color: (e.target as any).color.value.replace("#", "")
        })
        .then(res => {
          alert("success")
        })
        .catch((err) => {
          console.log(err)
          alert(err.response.data)
        })
      }}>
        
      {
        (frontpage.isLoading || domains.isLoading)
        ? <LoadingSpinner fill='#fff' className='w-12'></LoadingSpinner>
        : <div className="flex flex-col space-y-2">
            <div className='flex items-center space-x-2'>
              <label>displayed name: </label>
              <input type="text" placeholder="gayperson2000" name="name" required defaultValue={frontpage.data.frontpageName}></input>
            </div>
            <div className='flex items-center space-x-2'>
              <label>subdomain: </label>
              <select name="domain" className='w-48' placeholder='domain' defaultValue={frontpage.data.frontpageDomain} required>
                <option value="hide">none (hide me)</option>
                {
                  (domains.isLoading)
                  ? <option value="" disabled>Loading</option>
                  : domains.data.domains.map((z: any) => (
                    <option key={z.id} value={z.id}>{z.name}.{z.domain}</option>
                  ))
                }
              </select>
            </div>
            <div className='flex items-center space-x-2'>
              <label>text color: </label>
              <input type="color" name="color" required defaultValue={'#' + frontpage.data.frontpageColor}></input>
            </div>
            <button formAction='submit'>Update</button>
          </div>
      }
      </form>
    </Fragment>
  )
}
