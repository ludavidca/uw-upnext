"use client"

import Navbar from './components/Navbar'

export default function Home() {
  // const getMessages = async (e) => {
  //   e.preventDefault()
  //   try {
  //     const res = await fetch("/api/getMessages")
  //     const data = await res.json()
  //     console.log(data)
  //     
  //   } catch(error) {
  //     console.log(error)
  //   }
  // }

  return (
    
    <div>
      <Navbar></Navbar>
    </div>
  );
} 
