//!Flow => CreateAccount -> createProfile -> login -> getCurentUser -> dispatch(login) -> navigate to home
import React, {useState} from 'react'
import authService from '../Services/appwrite/auth.js'
import {Link , useNavigate} from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {Button,Input,Logo} from '../Components/Index.js'
import { useForm } from 'react-hook-form'
import userProfileServices from '../Services/appwrite/user.js'
import { login } from '../features/authSlice.js'


function Signup() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {register, handleSubmit} = useForm();
    const [error , setError] = useState('');

    const create = async(data) =>{
        setError('');
        try {
            const userData = await authService.CreateAccount(data);
            console.log(userData);
            

            if(userData){
                console.log("hey are you ready")
                //! user profile ko create krne ke lie 
                const profile = await userProfileServices.createProfile({

                    userId: userData.$id, //! user collection documet ki id 
                    name: data.name,
                    username: data.name.toLowerCase().replace(/\s+/g, "_")
                });
                console.log(profile)
                //!login ke lie login function me data pass kra h 
                await authService.login({
                    email: data.email,
                    password: data.password,
                });

                 const userDataInfo = await authService.getCurrentUser();
                if(userDataInfo){
                    
                    dispatch(login(userDataInfo));
                    navigate('/') ///! root pe navigate kr de 
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
                            <span className='stat-chip border border-white/10 bg-white/10 text-white'>Create your social identity</span>
                            <h1 className='text-5xl font-black leading-tight'>Build a profile that feels designed for a modern feed.</h1>
                            <p className='max-w-lg text-base leading-7 text-slate-200'>Join the app, pick a name, and start posting with a UI that feels closer to a polished product than a starter template.</p>
                        </div>
                    </div>
                </section>

                <section className='auth-panel'>
                    <div className='auth-card space-y-6'>
                        <div className='space-y-3'>
                            <Logo />
                            <h2 className='text-3xl font-bold text-slate-900'>Create your account</h2>
                            <p className='text-sm text-slate-500'>Already have an account? <Link to = '/login' className='font-semibold text-sky-600 hover:text-sky-700'>Login</Link></p>
                        </div>

                        {error && <p className='rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700'>{error}</p>}

                        <form onSubmit= {handleSubmit(create)} className='surface rounded-4xl p-6'>

                                <div className='space-y-5'>

                                        <Input
                                         label = "Full Name"
                                         type ="text"
                                         placeholder ="enter you name"
                                         className='soft-input'
                                         {...register('name',{
                                                required: true,
                                         })}
                                        />

                                        <Input
                                            label ="Email"
                                            type ="email"
                                            placeholder = "enter your email"
                                            className='soft-input'
                                            {...register('email',{
                                                required: true,
                                                validate: {
                                                        matchPattern : (value) =>
                                                                /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim.test(value) || "Enter a valid Email address"
                                                }

                                            })}
                                        />

                                            <Input
                                                label ="Password"
                                                placeholder ="enter your password"
                                                type ="password"
                                                className='soft-input'
                                                {...register('password',{ 
                                                        required: true,
                                                })}
                                            />
                      
                                            <Button type ="submit" className='mt-2 w-full'>create Account</Button>

                                </div>
                        </form>

                    </div>
                </section>
        </div>
    )
}

export default Signup