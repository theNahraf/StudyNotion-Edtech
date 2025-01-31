import React from 'react'
import ContactForm from '../Components/ContactPage/ContactForm'
import ContactDetails from '../Components/ContactPage/ContactDetails'

const Contact = () => {
  return (
    <div>
        <div className='w-11/12 mx-auto flex gap-10 max-w-maxContent mt-20'>
            {/* //contact details */}
            <div className='lg:w-[40%] '>
                <ContactDetails/>
            </div>

            {/* //contact form  */}
            <div className='lg:w-[50%]'>
                <ContactForm/>
            </div>
        </div>
    </div>
  )
}

export default Contact