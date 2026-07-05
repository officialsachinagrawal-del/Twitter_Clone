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
        <div className='auth-grid'>
                <section className='auth-hero'>
                    <div className='relative z-10 flex h-full flex-col justify-between gap-8'>
                        <Logo />
                        <div className='max-w-xl space-y-5'>
                            <span className='stat-chip border border-white/10 bg-white/10 text-white'>Fast feed, clean visuals</span>
                            <h1 className='text-5xl font-black leading-tight'>A Twitter-style product that feels sharper, calmer, and more premium.</h1>
                            <p className='max-w-lg text-base leading-7 text-slate-200'>Sign in to get back into your timeline, open conversations, and post with a polished composer that looks designed, not generated.</p>
                        </div>
                        <div className='grid max-w-lg grid-cols-3 gap-3 text-sm text-slate-200'>
                            <div className='rounded-3xl border border-white/10 bg-white/8 p-4'>
                                <p className='text-2xl font-bold text-white'>01</p>
                                <p className='mt-2'>Visual hierarchy</p>
                            </div>
                            <div className='rounded-3xl border border-white/10 bg-white/8 p-4'>
                                <p className='text-2xl font-bold text-white'>02</p>
                                <p className='mt-2'>Comfort spacing</p>
                            </div>
                            <div className='rounded-3xl border border-white/10 bg-white/8 p-4'>
                                <p className='text-2xl font-bold text-white'>03</p>
                                <p className='mt-2'>Soft glass panels</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className='auth-panel'>
                    <div className='auth-card space-y-6'>
                        <div className='space-y-3'>
                            <div className='flex items-center justify-between gap-3'>
                                <Logo />
                                <span className='stat-chip'>Welcome back</span>
                            </div>
                            <h2 className='text-3xl font-bold text-slate-900'>Sign in to your account</h2>
                            <p className='text-sm text-slate-500'>Don&apos;t have an account? <Link to="/signup" className='font-semibold text-sky-600 hover:text-sky-700'>Create one</Link></p>
                        </div>

                        {error && <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> }

                        <form onSubmit={handleSubmit(login)} className='surface rounded-[2rem] p-6'>
                                <div className='space-y-5'>
                                        <Input
                                            label = "Email"
                                            type ="email"
                                            placeholder ="enter your email"
                                            className='soft-input'
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
                                                className='soft-input'
                                                {...register("password",{
                                                        required : true,

                                                })}
                                                />

                                                <Button
                                                    type ="Submit"
                                                    className ="mt-2 w-full"
                                                    cursor ="pointer"
                                                    >Sign in </Button>

                                </div>
                        </form>
                    </div>
                </section>
        </div>
    )
}

export default Login