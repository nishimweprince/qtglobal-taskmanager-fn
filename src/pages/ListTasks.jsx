import { useEffect } from "react";
import { useLazyListUserTasksQuery } from "../redux/api/apiSlice";
import Button from "../components/inputs/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import Table from "../components/table/Table";
import moment from "moment";
import { capitalizeString } from "../helpers/words";
import { toast } from "react-toastify";
import { toastOptions } from "../constants/toastify";
import { useDispatch, useSelector } from "react-redux";
import UpdateTaskStatus from "../containers/task/UpdateTaskStatus";
import { setDeleteTaskModal, setTask, setUpdateTaskStatusModal } from "../redux/features/taskSlice";
import DeleteTask from "./DeleteTask";

const ListTasks = () => {

  // STATE VARIABLES
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.account);

  const [listUserTasks, {
    data: listUserTasksData,
    error: listUserTasksError,
    isLoading: listUserTasksIsLoading,
    isSuccess: listUserTasksIsSuccess,
    isError: listUserTasksIsError,
  }] = useLazyListUserTasksQuery();

  useEffect(() => {
    listUserTasks({ assignee_id: user?.id });
  }, [listUserTasks, user?.id])

  useEffect(() => {
    if (listUserTasksIsError) {
      toast.error('Could not load tasks. Please try again later.', toastOptions)
    }
  }, [listUserTasksError, listUserTasksIsError, listUserTasksIsSuccess]);

  // TASK COLUMNS
  const columns = [
    {
      id: 'no',
      name: 'no',
      Header: 'No.',
      accessor: 'no',
    },
    {
      id: 'title',
      name: 'title',
      Header: 'Title',
      accessor: 'title',
    },
    {
      id: 'priority',
      name: 'priority',
      Header: 'Priority',
      accessor: 'priority',
      filter: true,
    },
    {
      id: 'status',
      name: 'status',
      Header: 'Status',
      accessor: 'status',
      filter: true,
      Cell: ({ row }) => {
        return (
          <menu className="flex items-center gap-2">
            <p className="text-[14px]">{row?.original?.status}</p>
            <FontAwesomeIcon onClick={(e) => {
              e.preventDefault();
              dispatch(setTask(row?.original));
              dispatch(setUpdateTaskStatusModal(true));
            }} icon={faPenToSquare} className="text-primary transition-all duration-200 hover:scale-[1.02] cursor-pointer" />
          </menu>
        )
      }
    },
    {
      id: 'draft',
      name: 'draft',
      Header: 'Draft',
      accessor: 'draft',
    },
    {
      id: 'added_by',
      name: 'added_by',
      Header: 'Added By',
      accessor: 'added_by',
      filter: true,
    },
    {
      id: 'start_date',
      name: 'start_date',
      Header: 'Start Date',
      accessor: 'start_date',
      filter: true,
    },
    {
      id: 'end_date',
      name: 'end_date',
      Header: 'End Date',
      accessor: 'end_date',
    },
    {
      id: 'created_at',
      name: 'created_at',
      Header: 'Date Added',
      accessor: 'created_at',
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }) => (
        <article className="flex w-full items-center gap-[5px]">
          <Button value='Details' primary route={`/tasks/${row?.original?.id}`} />
          <FontAwesomeIcon onClick={(e) => {
            e.preventDefault();
            dispatch(setTask(row?.original));
            dispatch(setDeleteTaskModal(true));
          }} icon={faTrash} className="bg-red-600 text-white p-2 rounded-full cursor-pointer transition-all duration-200 hover:scale-[1.02]" />
        </article>
      ),
    },
  ];



  return (
    <main className="flex w-[90%] mx-auto flex-col gap-6 p-4">
      <section className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-primary uppercase">
          Available Tasks
        </h1>
        <Button
          value={
            <span className="flex items-center gap-2">
              <FontAwesomeIcon icon={faAdd} />
              Add Task
            </span>
          }
          route="/tasks/create"
          primary
        />
      </section>
      {listUserTasksIsLoading && (
        <span className="min-h-[60vh] flex items-center justify-center">
          <p>Loading...</p>
        </span>
      )}
      <section
        className={`${listUserTasksIsSuccess ? 'flex' : 'hidden'
          } w-full flex flex-col gap-6`}
      >
        {listUserTasksIsSuccess && (
          <Table
            columns={columns}
            data={listUserTasksData?.data?.rows
              ?.slice()
              ?.sort((a, b) => moment(b?.createdAt).format() - moment(a?.createdAt).format())
              ?.map((task, index) => {
                return {
                  no: index + 1,
                  id: task?.id,
                  title: task?.title,
                  start_date: moment(task?.start_date).format('YYYY-MM-DD'),
                  end_date: moment(task?.end_date).format('YYYY-MM-DD'),
                  priority: capitalizeString(task?.priority),
                  status: capitalizeString(task?.status),
                  draft: task?.draft ? 'Yes' : 'No',
                  added_by: task?.user?.name,
                  created_at: moment(task?.createdAt).format('YYYY-MM-DD'),
                };
              })}
          />
        )}
      </section>
      <UpdateTaskStatus />
      <DeleteTask />
    </main>
  );
}

export default ListTasks;
