import '../styles/globals.css'
import '../styles/others.css';
import { Cabin } from '@next/font/google'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useRouter } from 'next/router'
import DashboardLayout from '@oc/layout/DashboardLayout'

const font = Cabin({ subsets: ['latin'] })

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false
    }
  }
})

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <div className={font.className + ' bg-neutral-900 text-white min-h-screen'}>
      <QueryClientProvider client={queryClient}>
        {
          (router.pathname.includes("/dash"))
          ? <DashboardLayout><Component {...pageProps} /></DashboardLayout>
          : <Component {...pageProps} />
        }
      </QueryClientProvider>
    </div>
  )
}
