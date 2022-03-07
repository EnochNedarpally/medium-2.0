import { GetStaticProps } from 'next'
import React, { useState } from 'react'
import PortableText from 'react-portable-text'
import Header from '../../components/Header'
import { sanityClient, urlFor } from '../../sanity'
import { Post } from '../../typings'
import { useForm,SubmitHandler } from 'react-hook-form'
interface Props{
    post:Post
}
interface IForms{
    _id:string,
    name:string,
    email:string,
    comment:string
}

const Post = ({post}:Props) => {
    const {register,handleSubmit,formState:{errors}} = useForm<IForms>();
    const [submitted, setSubmitted] = useState(false)

    const onSubmit:SubmitHandler<IForms>=(data)=>{
         fetch("/api/createComment",{
            method:"POST",
            body:JSON.stringify(data),
        }).then(d=>{
            console.log(d.json())
            setSubmitted(true);
        }
        ).catch(err=>console.log(err));
    }
  return (
    <div className=' max-w-7xl mx-auto '>
        <Header/>
        <img className='w-full h-56 object-cover' src={urlFor(post.mainImage).url()!} alt="" />
        <article className='max-w-3xl mx-auto mt-8 px-4'>
                <h2 className='text-3xl font-bold mb-2'>{post.title}</h2>
                <h2 className='text-xl font-light text-gray-500 mb-2'>{post.description}</h2>
                <div className='flex space-x-5 items-center mb-5'>
                    <img className='w-14 h-14 object-cover rounded-full' src={urlFor(post.author.image).url()!} alt="" />
                    <p className='font-extralight text-sm'>Published By - <span className="text-green-500" >{post.author.name}</span> </p>
                    <p className='font-extralight text-sm'>Published at {new Date(post._createdAt).toLocaleString()}</p>
                </div>
                <div>
                    <PortableText
                     dataset ={process.env.NEXT_PUBLIC_SANITY_DATASET}
                     projectId= {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
                     content={post.body}
                     serializers={{
                        h1:(props:any) => (
                            <h1 className='text-2xl font-bold my-5' {...props}/>
                        ),
                        normal:(props:any) => (
                            <p className='my-5' {...props}/>
                        ),
                        img:(props:any) => (
                            <img className='w-full h-10' {...props}/>
                        ),
                         h2:(props:any) => (
                            <h2 className='text-xl font-bold my-5' {...props}/>
                        ),
                         li:({children}:any) => (
                            <li className='ml-4 list-disc'>{children}</li>
                        ),
                         link:({href,children}:any) => (
                            <a href={href} className=' text-blue-500 hover:underline'>{children}</a>
                        ),

                     }}
                    />
                </div>
        </article>
        <hr className=' max-w-3xl h-0.5 bg-yellow-500 mx-auto mb-2 mt-4' />
        {
            submitted ?
            <div className='max-w-2xl mx-auto bg-yellow-500 py-2 px-3 text-white text-center mb-2'>
                <h1 className='text-xl font-semibold'>Thank You! for submitting your comment</h1>
                <p>Your comment will be displayed below once approved by the author</p>
            </div> :
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col max-w-3xl mx-auto mt-8 px-4' >
            <p className=' text-sm text-yellow-500'>Enjoyed this blog ?</p>
            <h2 className='text-lg font-bold mb-3'>Leave a comment below!</h2>
            <hr className="p-4"/>
            <input {...register("_id")} type="hidden" name="_id" value={post._id} />
            <label className='flex flex-col mb-2' >
                <span>Name</span>
                <input {...register("name",{required:true})} className='shadow block w-full mt-2  ring-yellow-400 rounded focus:ring-2 outline-none border p-2' type="text" placeholder='Name'/>
                {errors.name && <p className=' text-red-500'>Name Field is Required</p>}
            </label>
            <label className='flex flex-col mb-2'>
                <span>Email</span>
                <input {...register("email",{required:true})} className=' shadow block w-full mt-2  ring-yellow-400 rounded focus:ring-2 outline-none border p-2' type="email" placeholder='Email' />
                {errors.email && <p className=' text-red-500'>Email Field is Required</p>}
            </label>
            <label className='flex flex-col mb-2' >
                <span>Comment</span>
                <textarea {...register("comment",{required:true})} className='shadow block w-full mt-2 form-textarea  ring-yellow-400 rounded focus:ring-2 outline-none border p-2' rows={7} placeholder='Comment'/>
                {errors.comment && <p className=' text-red-500'>Comment Field is Required</p>}
            </label>
            <button type='submit' className='shadow bg-yellow-500 text-white font-bold py-1 mb-2 hover:bg-yellow-400'>Submit</button>
        </form>
        }
        {post.comments.length > 0 &&
        <div className=' max-w-2xl bg-white  my-3 shadow-yellow-400 shadow p-3 mx-3 md:mx-auto'>
            <h2 className='text-3xl mb-2'>Comments</h2>
            {post.comments?.map(comment=>(
                <div key={comment._id}>
                    <p className='text-sm font-semibold mb-2'> <span className='text-yellow-500 text-base'> {comment.name}:</span> {comment.comment}</p>
                </div>
            ))}
        </div>}
    </div>
  )
}

export const getStaticPaths=async()=>{
    const query=`*[_type=='post']{
        _id,
       slug{
        current
      }
      }`
      const posts = await sanityClient.fetch(query);

      const paths=posts.map((post:Post)=>({
        params:{
            slug:post.slug.current
        }
      }));
      return{
          paths,
          fallback:"blocking"
      }
}

export const getStaticProps:GetStaticProps=async({params})=>{
    const query=`*[_type == 'post' && slug.current == $slugs ][0]{
        _id,
       _createdAt,
        title,
        author->{
        name,
        image
      },
      'comments': *[
        _type == "comment" && 
        post._ref == ^._id && 
        approved == true],
      description,
      mainImage,
      slug,
      body
      }
    `
    const post=await sanityClient.fetch(query,{
        slugs:params?.slug
    })
    if(!post){
        return{
            notFound:true
        }
    }
    return{
        props:{
            post,
        },
        revalidate:60

    }
}
export default Post