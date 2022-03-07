import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header'
import { Post } from '../typings'
import {sanityClient, urlFor} from '../sanity'
import Link from 'next/link'

type Props={
  posts:[Post]
}
const Home = ({posts}:Props) => {
  return (
    <div className='max-w-7xl mx-auto' >
      <Head>
        <title>Medium 2</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header/>
      <div className='flex items-center justify-between bg-yellow-400 border-y border-black  py-14 px-10 lg:py-0'>
        <div className="space-y-4">
          <h1 className='text-3xl md:text-7xl'> <span className='underline decoration-4'> Medium</span> is the place to write,read,and connect</h1>
          <h2>It's easy and free to post you thinking on any topic and connect with millions of readers</h2>
        </div>
        <img className='hidden md:flex h-32  lg:h-full' src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png" alt=""/>
      </div>
      <div className='grid sm:grid-cols-1 md:grid-cols-3 gap-6 px-2 py-2 lg:gap-2 ' >
          {posts.map(post=>(
            <Link key={post._id} href={`/post/${post.slug.current}`}>
                <div className='group cursor-pointer overflow-hidden border rounded-lg shadow-lg'>
                  <img className="w-full group-hover:scale-105  transition-all duration-200 ease-in-out" src={urlFor(post.mainImage).url()!} alt="" />
                  <div className='flex justify-between items-center py-1 px-2'>
                    <div className='space-y-2'>
                      <p className='text-lg font-bold'>{post.title}</p>
                      <p className='text-sm'>{post.description} by {post.author.name}</p>
                    </div>
                    <img className='h-11 w-11 rounded-full ml-3' src={urlFor(post.author.image).url()!} alt="" />
                  </div>
                </div>
            </Link>
          ))}
      </div>
    </div>
  )
}

export const getServerSideProps=async()=>{
  const query=`*[_type=='post']{
    _id,
    title,
    author->{
    name,
    image
  },
  description,
  mainImage,
  slug
  }`
  const posts=await sanityClient.fetch(query);
  return {
    props:{
      posts,
    }
  }
}
export default Home
