import Link from 'next/link'
import React from 'react'

const Header = () => {
    return (
        <header className='flex justify-between px-5 py-1 max-w-7xl mx-auto sticky top-0 left-0 z-20 bg-white'>
            <div className='flex items-center space-x-5'>
                <Link href="/" >
                    <img className='w-44 object-contain cursor-pointer' src="https://links.papareact.com/yvf" alt="" />
                </Link>
                <div className='hidden md:flex space-x-5 items-center'>
                    <h3>Home</h3>
                    <h3>About</h3>
                    <h3 className=' bg-green-400 rounded-full px-3 py-1 text-white cursor-pointer'>Follow</h3>
                </div>
            </div>
            <div className='flex items-center space-x-4'>
                <h3 className='text-green-500  cursor-pointer'>Sign In</h3>
                <h3 className='text-green-500 bg-white  border-2 rounded-full px-3 py-1 cursor-pointer'>Get Started</h3>
            </div>
        </header>
    )
}

export default Header