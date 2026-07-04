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
    <div className=''>
        <div className=''>
            //!logo section 
            <div className=''>
                <span className ="">
                    <Logo width = '100%'></Logo>
                </span>
            </div>

            <h2 className=''>Signup to create account</h2>

            <p className=''> already have and account?&nbsp;
                <Link
                 to = '/login'
                 className=''
                 >Login</Link>
            </p>

            {error && <p className=''>{error}</p>}

            <form onSubmit= {handleSubmit(create)}>

                <div className=''>

                    <Input
                     label = "Full Name"
                     type ="text"
                     placeholder ="enter you name"
                     {...register('name',{
                        required: true,
                     })}
                     
                    />

                    <Input
                      label ="enter your email"
                      type ="email"
                      placeholder = "enter your email"
                      {...register('email',{
                        required: true,
                        validate: {
                            matchPattern : (value) =>
                                /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim.test(value) || "Enter a valid Email address"
                        }

                      })}

                      />

                      <Input
                        label ="password"
                        placeholder ="enter your password"
                        type ="password"
                        {...register('password',{ 
                            required: true,
                        })}
                        />
                      
                      <Button type ="submit" className=''>create Account</Button>

                </div>
            </form>

        </div>
    </div>
  )
}

export default Signup