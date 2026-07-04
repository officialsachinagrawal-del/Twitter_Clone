import React from 'react'
import {useState} from 'react'
import {Link, useNavigate, } from 'react-router-dom'
import {login as authLogin} from '../features/authSlice'

import {Input,Button,Logo} from  '../Components/Index'

import {useDispatch } from 'react-redux'
import authService from '../Services/appwrite/auth'
import { useForm} from 'react-hook-form'

function Login() {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {register, handleSubmit} = useForm();

    const [error, setError] = useState('') //! ho skata h login krne me koi error aaye 

    const login = async(data) =>{
        setError(''); //! login krte hi error ktm ho gya 
        try {
            const session = await authService.login(data);
            if(session){
                const userData = await authService.getCurrentUser();
                if(userData){
                    dispatch(authLogin(userData));
                    navigate('/') //!root pe navigate kr do 
                }
            }
        } catch (error) {
            setError(error.message);
            
        }

    }


  return (
    
    <div className='bg-green-300'>
        <div className= {``}>

            {/* //! Logo Section */}
            <div className='mb-2 flex-justify-center'>
                <span className='inline-block w-full max-w-25'>
                    <Logo width = "100%"/>
                </span>
            </div>

            <h2 className='text-center'>Sigin to your account</h2>
            <p className=''>Don&apos;t have any account?&nbsp;
                <Link
                   to ="/signup"
                   className=''
                > Sign up</Link>
            </p>
            {error && <p className="text-red-600 mt-8 text-center">{error}</p> }

            <form onSubmit={handleSubmit(login)} className=''>

                <div className='space-y-5'>
                    <Input
                      label = "Email"
                      type ="email"
                      placeholder ="enter your email"
                      
                      {...register("email",{
                        required: true,
                        validate: {
                            matchPattern: (value) =>
                                /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim.test(value) || "Enter a valid Email address"
                        }
                      })}
                      />

                      <Input
                        label = "Password"
                        type ="password"
                        placeholder ="enter your password"
                        
                        {...register("password",{
                            required : true,

                        })}
                        />

                        <Button
                          type ="Submit"
                          className ="w-full"
                          cursor ="pointer"
                          >Sign in </Button>

                </div>
            </form>


        </div>

    </div>
        
  )
}

export default Login