import Header from '@oc/components/Dashboard/Header'
import HeaderContainer from '@oc/components/Dashboard/HeaderContainer'
import Subtitle from '@oc/components/Dashboard/Subtitle'
import React, { Fragment } from 'react'
import Image from 'next/image';
import Chip from '@oc/components/Misc/Chip'

export default function hosting() {
  return (
    <Fragment>
      <HeaderContainer>
        <Header>🖥️ hosting</Header>
        <Subtitle>advice on where to host your website</Subtitle>
      </HeaderContainer>
      <div className='space-y-4'>
        <p className='text-base'>i'm too lazy to host your website, but here are some free options:</p>
        <div className="grid grid-cols-2 gap-4">
          <HostingProvider name="GitHub Pages" url="https://pages.github.com" logo="/logo_github.png">
            github have free static hosting through github pages.
            you can choose a repository to be hosted and it will be put onto a free <code>github.io</code> domain.
            you can connect a custom domain by following the
            steps <a className='text-blue-400 underline' href="https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site">here</a>.
          </HostingProvider>
          <HostingProvider name="Firebase" url="https://firebase.com" logo="/logo_firebase.png" chip="Best for experienced devs">
            google provides free static website hosting through firebase.
            you upload your website files using the firebase cli and it gets put on a server after pushing.
            they provide a free <code>web.app</code> subdomain but you can connect your own and it will walk you
            through setting up the dns records you need. firebase is a good option if you're familiar with typing terminal commands.
          </HostingProvider>
          <HostingProvider name="Replit" url="https://replit.com" logo="/logo_replit.png">
            replit is a free online ide (interactive development environment) which is used to code many types of applications just in a browser.
            you can use it to host a free static website 24/7 with a custom domain. unfortunately, stuff you make on replit will stay public unless
            you sign up for their paid subscription.
          </HostingProvider>
          <HostingProvider name="Glitch" url="https://glitch.com" logo="/logo_glitch.png">
            glitch is similar to replit and a custom domain can be connected for free.
          </HostingProvider>
        </div>
      </div>
    </Fragment>
  )
}

interface PHostingProvider {
  logo:  string;
  name:  string;
  url:   string;
  chip?: string;
  children: React.ReactNode | React.ReactNode[]
}

function HostingProvider(props: PHostingProvider){
  return (
    <div>
      <div className='flex items-center space-x-2'>
        <Image src={props.logo} alt="Firebase Logo" width={32} height={32}></Image>
        <div>
          <h3 className='text-xl font-bold text-purple-00'>
            {props.name.toLowerCase()}
            { (props.chip) && <Chip text={props.chip}/> }
          </h3>
          <a href={props.url}>
            <div className='flex items-center space-x-1'>
              <p className='text-sm'>{props.url}</p>
              <span className="material-symbols-outlined text-sm">arrow_outward</span>
            </div>
          </a>
        </div>
      </div>
      <p className='mt-1'>
        {props.children}
      </p>
    </div>
  )
}