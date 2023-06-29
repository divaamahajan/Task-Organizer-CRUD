import Head from 'next/head'
import Image from 'next/image'
import Login from '../components/Login'
import UserDashboard from '../components/UserDashboard'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { currentUser } = useAuth()

  return (
    < >
      <Head>
        <title>Taskify: Task Organizer</title>
        <meta name="description" content="Efficient Task Organizer: Stay Organized!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {!currentUser && <Login />}
      {currentUser && <UserDashboard/>}
    </>
  )
}
