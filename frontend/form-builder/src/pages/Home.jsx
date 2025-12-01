import React from 'react'

const HomePage = () => {

    const onSubmit = ()=>
    {
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/airtable/login`
    }
  return (
    <div>
        <h2>Welcome</h2>
        <button onClick={onSubmit}>
            Login with Airtable
        </button>
    </div>
  )
}

export default HomePage