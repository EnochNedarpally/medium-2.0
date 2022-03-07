export default {
    name: 'comment',
    title: 'Comment',
    type: 'document',
    fields: [
      {
        name: 'name',
        type: 'string',
      },
      {
        name: 'approved',
        title: 'Approved',
        type: 'boolean',
        description:"Comments won't show on site without approval"
      },

      {
        name: 'email',
        title: 'Email',
        type: 'string',
       
      },
      {
        name: 'comment',
        type: 'text'
      },
      {
        name: 'post',
        type: 'reference',
        to:[{type:"post"}]
      }
    ]
  }
  