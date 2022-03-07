import type { NextApiRequest, NextApiResponse } from 'next'
import sanityClient from '@sanity/client' 

const config={
     token:'skPcUyNXOApALfM66e0PhfrzBvFuESUu6H88dSloXOtCS4jVbCfVK2kyMu6eCUQZfp4tKiTkvdCeRYVUMuLuIn9xDDZ6TbeHMhf0Fn4krJU1CAxaI4vFNNX4GmY7isl3iD8Bhro8pUFRpsub8dnxBK2FwoeH2ooeMigJH0FuFYusyHtfr23j',
     dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
     projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
     useCdn: process.env.NODE_ENV === "production"
}

const client=sanityClient(config);

// type Data = {
//   name: string
// }

export  default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse
){
    const {_id,name,email,comment} = JSON.parse(req.body)
    try {
        await client.create({
            _type:"comment",
            post:{
                _type:"reference",
                _ref:_id
            },
            name,
            email,
            comment
        })
    } catch (error) {
        res.status(500).json({message:"Couldn't submit comment",error})
    }
    res.status(200).json({message:"Comment submitted successfully"})
}
