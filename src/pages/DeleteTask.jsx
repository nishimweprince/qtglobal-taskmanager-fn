import { useDispatch, useSelector } from "react-redux";
import Modal from "../components/modals/Modal";
import { removeTask, setDeleteTaskModal } from "../redux/features/taskSlice";
import Button from "../components/inputs/Button";
import { useDeleteTaskMutation } from "../redux/api/apiSlice";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { toastOptions } from "../constants/toastify";
import Loader from "../components/inputs/Loader";

const DeleteTask = () => {

  // STATE VARIABLES
  const dispatch = useDispatch();
  const { deleteTaskModal, task } = useSelector((state) => state.task);

  // INITIALIZE DELETE TASK MUTATION
  const [deleteTask, {
    error: deleteTaskError,
    isLoading: deleteTaskIsLoading,
    isSuccess: deleteTaskIsSuccess,
    isError: deleteTaskIsError,
  }] = useDeleteTaskMutation();

  // HANDLE DELETE TASK RESPONSE
  useEffect(() => {
    if (deleteTaskIsSuccess) {
      toast.success('Task deleted successfully', toastOptions);
      dispatch(setDeleteTaskModal(false));
      dispatch(removeTask(task?.id));
      window.location.reload();
    }
    if (deleteTaskIsError) {
      if (deleteTaskError?.status === 500) {
        toast.error('Could not delete task. Please try again later.', toastOptions)
      } else {
        toast.error(deleteTaskError?.data?.message, toastOptions)
      }
    }
  }, [deleteTaskIsSuccess, deleteTaskIsError, deleteTaskError, dispatch, task?.id]);

  return (
    <Modal isOpen={deleteTaskModal} onClose={() => {
      dispatch(setDeleteTaskModal(false))
    }}>
      <section className="flex flex-col gap-4">
        <h1 className="uppercase text-red-600 font-medium">Delete {task?.title}</h1>
        <menu className="flex flex-col gap-4">
          <p>Are you sure you want to delete {task?.title}? This action cannot be undone</p>
          <ul className="flex items-center gap-3 justify-between">
            <Button value='Cancel' onClick={(e) => {
              e.preventDefault();
              dispatch(setDeleteTaskModal(false))
            }} />
            <Button value={deleteTaskIsLoading ? <p>Loading...</p> : 'Delete'} className='!bg-red-600 hover:!bg-red-700 !text-white !border-none' onClick={(e) => {
              e.preventDefault();
              deleteTask({ id: task?.id })
            }} />
          </ul>
        </menu>
      </section>
    </Modal>
  )
}

export default DeleteTask;
