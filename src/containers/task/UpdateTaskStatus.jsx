import { useDispatch, useSelector } from "react-redux";
import Modal from "../../components/modals/Modal";
import { Controller, useForm } from "react-hook-form";
import { capitalizeString } from "../../helpers/words";
import Button from "../../components/inputs/Button";
import Loader from "../../components/inputs/Loader";
import { useUpdateTaskMutation } from "../../redux/api/apiSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { setUpdateTaskStatusModal } from "../../redux/features/taskSlice";

const UpdateTaskStatus = () => {

    // STATE VARIABLES
    const dispatch = useDispatch();
    const { updateTaskStatusModal, task } = useSelector((state) => state.task);

    // REACT HOOK FORM
    const { control, handleSubmit, formState: { errors } } = useForm();

    // UPDATE TASK STATUS MUTATION
    const [updateTask, {
        data: updateTaskData,
        isSuccess: isUpdateTaskSuccess,
        isError: isUpdateTaskError,
        isLoading: isUpdateTaskLoading,
        error: updateTaskError
    }] = useUpdateTaskMutation();

    // HANDLE FORM SUBMISSION
    const onSubmit = (data) => {
        updateTask({
            id: task?.id,
            status: data.status,
        })
    }

    // HANDLE UPDATE TASK RESPONSE
    useEffect(() => {
        if (isUpdateTaskError) {
            if (updateTaskError?.status === 500) {
                toast.error('Could not update task. Please try again');
            } else {
                toast.error(updateTaskError?.data?.message);
            }
        } else if (isUpdateTaskSuccess) {
            dispatch(setUpdateTaskStatusModal(false));
            window.location.reload();
            toast.success('Task status updated successfully');
        }
    }, [isUpdateTaskSuccess, isUpdateTaskError, updateTaskData, updateTaskError, dispatch, updateTaskStatusModal]);

    // TASK OPTIONS
    const taskStatuses = ['pending', 'in_progress', 'ready']

    return (
        <Modal isOpen={updateTaskStatusModal} onClose={() => {
            dispatch(setUpdateTaskStatusModal(false));
        }}>
            <h1 className="text-md text-primary uppercase font-semibold">Update {task?.title}&apos;s status</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
                <Controller control={control} name="status" rules={{ required: 'Select status' }} render={({ field }) => {
                    return (
                        <select defaultValue={task?.status} onChange={(e) => {
                            field.onChange(e.target.value);
                        }} className="border border-gray-300 p-2 rounded-md">
                            {taskStatuses.map((status, index) => {
                                return (
                                    <option key={index} value={status}>{capitalizeString(status)}</option>
                                )
                            })}
                            {errors.status && <p className="text-red-500 text-[13px]">{errors.status.message}</p>}
                        </select>
                    )
                }} />
                <menu className='flex items-center gap-3 justify-between w-full'>
                    <Button value='Cancel' onClick={(e) => {
                        e.preventDefault();
                        dispatch(setUpdateTaskStatusModal(false))
                    }} />
                    <Button value={isUpdateTaskLoading ? <Loader /> : 'Submit'} submit primary />
                </menu>
            </form>
        </Modal>
    )
}

export default UpdateTaskStatus;
