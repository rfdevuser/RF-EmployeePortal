import React from 'react'

const page =({ params }: { params: { id: string } }) =>{
  return (
    <div>
      hello {params.id}
    </div>
  )
}

export default page
