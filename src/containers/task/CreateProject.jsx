import { useDispatch, useSelector } from "react-redux";
import Modal from "../../components/modals/Modal";
import { toggleCreateProjectModal } from "../../redux/features/projectSlice";
import { Controller, useForm } from "react-hook-form";
import Input from "../../components/inputs/Input";
import TextArea from "../../components/inputs/TextArea";
import Button from "../../components/inputs/Button";
import Loader from "../../components/inputs/Loader";
import { useCreateProjectMutation } from "../../redux/api/apiSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { toggleListProjectsModal } from "../../redux/features/taskSlice";

const CreateProject = () => {

    // STATE VARIABLES
    const dispatch = useDispatch();
    const { createProjectModal } = useSelector((state) => state.project);

    // REACT HOOK FORM
    const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm();

    // INITIALIZE CREATE PROJECT MUTATION
    const [createProject, {
        data: createProjectData,
        isSuccess: isCreateProjectSuccess,
        isError: isCreateProjectError,
        isLoading: isCreateProjectLoading,
        error: createProjectError
    }] = useCreateProjectMutation();

    // HANDLE FORM SUBMISSION
    const onSubmit = (data) => {
        createProject({
            title: data.title,
            description: data.description
        });
    }

    // HANDLE CREATE PROJECT RESPONSE
    useEffect(() => {
        if (isCreateProjectSuccess) {
            dispatch(toggleCreateProjectModal(false));
            dispatch(toggleListProjectsModal(true));
            toast.success('Project created successfully');
            reset();
            setValue('title', '');
            setValue('description', '');
        } else if (isCreateProjectError) {
            if (createProjectError?.status === 500) {
                toast.error('Could not create project. Please try again');
            } else {
                toast.error(createProjectError?.data?.message);
            }
        }
    }, [isCreateProjectSuccess, isCreateProjectError, createProjectData, createProjectError, dispatch, reset, setValue]);

    return (
        <Modal isOpen={createProjectModal} onClose={() => {
            dispatch(toggleCreateProjectModal(false));
        }}>
            <h1 className="text-md uppercase text-primary text-semibold">Add new project</h1>
            <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit(onSubmit)}>
                <Controller name="title" control={control} rules={{ required: 'Name is required' }} render={({ field }) => {
                    return (
                        <label className="flex flex-col gap-1 w-full">
                            <Input label='Title' required placeholder='Project title' {...field} />
                            {errors.title && <p className="text-[13px] text-red-500">{errors.title.message}</p>}
                        </label>
                    )
                }} />
                <Controller name="description" control={control} rules={{
                    required: 'Description is required', validate: (value) => {
                        return value.trim().length < 50 || 'Description cannot exceed 50 characters'
                    }
                }} render={({ field }) => {
                    return (
                        <label className="flex flex-col gap-1 w-full">
                            <TextArea label='Description' required placeholder='Project description' {...field} />
                            {errors.description && <p className="text-[13px] text-red-500">{errors.description.message}</p>}
                        </label>
                    )
                }} />
                <menu className='flex items-center gap-3 justify-between w-full'>
                    <Button value='Cancel' onClick={(e) => {
                        e.preventDefault();
                        dispatch(toggleCreateProjectModal(false))
                    }} />
                    <Button value={isCreateProjectLoading ? <p>Loading...</p> : 'Submit'} submit primary />
                </menu>
            </form>
        </Modal>
    )
}

export default CreateProject;
