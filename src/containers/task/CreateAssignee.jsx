import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../components/modals/Modal';
import { toggleCreateAssigneeModal } from '../../redux/features/assigneeSlice';
import { Controller, useForm } from 'react-hook-form';
import Input from '../../components/inputs/Input';
import validateInputs from '../../helpers/validations';
import Button from '../../components/inputs/Button';
import { useRegisterMutation } from '../../redux/api/apiSlice';
import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import Loader from '../../components/inputs/Loader';
import { toggleListUsersModal } from '../../redux/features/taskSlice';

const CreateAssignee = () => {

    // STATE VARIABLES
    const dispatch = useDispatch();
    const { createAssigneeModal } = useSelector((state) => state.assignee);

    // REACT HOOK FORM
    const { handleSubmit, control, formState: { errors }, reset, setValue } = useForm();

    // INITIALIZE REGISTER USER MUTATION
    const [register, {
        isLoading: registerIsLoading,
        isError: registerIsError,
        error: registerError,
        isSuccess: registerIsSuccess,
        data: registerData
    }] = useRegisterMutation();

    const inputRefs = {
        name: useRef(),
        email: useRef(),
        phone: useRef()
    }

    // HANDLE FORM SUBMISSION
    const onSubmit = (data) => {
        register({
            email: data.email,
            name: data.name,
            phone: data?.phone
        });
    }

    // HANDLE REGISTER USER RESPONSE
    useEffect(() => {
        if (registerIsError) {
            if (registerError?.status === 500) {
                toast.error('Could not create assignee. Try again later');
            } else {
                toast.error(registerError?.data?.message);
            }
        } else if (registerIsSuccess) {
            toast.success('Assignee created successfully');
            dispatch(toggleCreateAssigneeModal(false));
            dispatch(toggleListUsersModal(true));
            reset();
            setValue('name', '');
            setValue('email', '');
            setValue('phone', '');
            if (inputRefs.name.current) {
                inputRefs.name.current.value = '';
            }
            if (inputRefs.email.current) {
                inputRefs.email.current.value = '';
            }
            if (inputRefs.phone.current) {
                inputRefs.phone.current.value = '';
            }
        }
    }, [registerIsSuccess, registerIsError, registerError, registerData, dispatch, reset, setValue, inputRefs.name, inputRefs.email, inputRefs.phone]);

    return (
        <Modal isOpen={createAssigneeModal} onClose={() => {
            dispatch(toggleCreateAssigneeModal(false))
        }}>
            <h1 className='uppercase text-primary text-md font-semibold'>Add new user</h1>
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                <Controller name='name' control={control} rules={{ required: 'Name is required' }} render={({ field }) => {
                    return (
                        <label className='flex flex-col gap-1'>
                            <Input ref={inputRefs?.name} label='Full names' placeholder='Enter user full names' required {...field} />
                            {errors?.name && (
                                <p className='text-red-600 text-[13px]'>
                                    {errors?.name?.message}
                                </p>
                            )}
                        </label>
                    )
                }} />
                <Controller name='email' control={control} rules={{
                    required: 'Email is required', validate: (value) => {
                        return validateInputs(value, 'email') || 'Invalid email'
                    }
                }} render={({ field }) => {
                    return (
                        <label className='flex flex-col gap-1'>
                            <Input ref={inputRefs?.email} label='Email address' placeholder='Enter user email address' required {...field} />
                            {errors?.email && (
                                <p className='text-red-600 text-[13px]'>
                                    {errors?.email?.message}
                                </p>
                            )}
                        </label>
                    )
                }} />
                <Controller name='phone' control={control} render={({ field }) => {
                    return (
                        <label className='flex flex-col gap-1'>
                            <Input ref={inputRefs?.phone} label='Phone number' placeholder='Enter user phone number' {...field} />
                        </label>
                    )
                }} />
                <menu className='flex items-center gap-3 justify-between w-full'>
                    <Button value='Cancel' onClick={(e) => {
                        e.preventDefault();
                        dispatch(toggleCreateAssigneeModal(false))
                    }} />
                    <Button value={registerIsLoading ? <Loader /> : 'Submit'} submit primary />
                </menu>
            </form>
        </Modal>
    )
}

export default CreateAssignee;
