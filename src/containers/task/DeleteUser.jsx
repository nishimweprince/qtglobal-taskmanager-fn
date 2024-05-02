import { useDispatch, useSelector } from "react-redux";
import Modal from "../../components/modals/Modal";
import { setDeleteUserModal } from "../../redux/features/accountSlice";
import Button from "../../components/inputs/Button";
import { useDeleteUserMutation } from "../../redux/api/apiSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { toastOptions } from "../../constants/toastify";
import Loader from "../../components/inputs/Loader";

const DeleteUser = () => {

    // STATE VARIABLES
    const dispatch = useDispatch();
    const { deleteUserModal, selectedUser } = useSelector((state) => state.account);

    // INITIALIZE DELETE TASK MUTATION
    const [deleteUser, {
        error: deleteUserError,
        isLoading: deleteUserIsLoading,
        isSuccess: deleteUserIsSuccess,
        isError: deleteUserIsError,
    }] = useDeleteUserMutation();

    // HANDLE DELETE TASK RESPONSE
    useEffect(() => {
        if (deleteUserIsSuccess) {
            toast.success('Task deleted successfully', toastOptions);
            dispatch(setDeleteUserModal(false));
            window.location.reload();
        }
        if (deleteUserIsError) {
            if (deleteUserError?.status === 500) {
                toast.error('Could not delete user. Please try again later.', toastOptions)
            } else {
                toast.error(deleteUserError?.data?.message, toastOptions)
            }
        }
    }, [deleteUserIsSuccess, deleteUserIsError, deleteUserError, dispatch, selectedUser?.id]);

    return (
        <Modal isOpen={deleteUserModal} onClose={() => {
            dispatch(setDeleteUserModal(false))
        }}>
            <section className="flex flex-col gap-4">
                <h1 className="uppercase text-red-600 font-medium">Delete {selectedUser?.name}</h1>
                <menu className="flex flex-col gap-4">
                    <p>Are you sure you want to delete {selectedUser?.name}? This action cannot be undone</p>
                    <ul className="flex items-center gap-3 justify-between">
                        <Button value='Cancel' onClick={(e) => {
                            e.preventDefault();
                            dispatch(setDeleteUserModal(false))
                        }} />
                        <Button value={deleteUserIsLoading ? <Loader /> : 'Delete'} className='!bg-red-600 hover:!bg-red-700 !text-white !border-none' onClick={(e) => {
                            e.preventDefault();
                            deleteUser({ id: selectedUser?.id })
                        }} />
                    </ul>
                </menu>
            </section>
        </Modal>
    )
}

export default DeleteUser;
