import { useEffect } from "react";
import { useLazyListUserTasksQuery } from "../redux/api/apiSlice";
import Button from "../components/inputs/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import Table from "../components/table/Table";
import { columns } from "../constants/TasksColumns";
import moment from "moment";
import { capitalizeWords } from "../helpers/Words";
import { toast } from "react-toastify";
import { toastOptions } from "../constants/Toastify";
import Loading from "../components/Loading";

const ListTasks = () => {

    const [listUserTasks, {
        data: listUserTasksData,
        error: listUserTasksError,
        isLoading: listUserTasksIsLoading,
        isSuccess: listUserTasksIsSuccess,
        isError: listUserTasksIsError,
    }] = useLazyListUserTasksQuery();

    useEffect(() => {
        listUserTasks();
    }, [listUserTasks])

    useEffect(() => {
        if (listUserTasksIsError) {
          toast.error('Could not load tasks. Please try again later.', toastOptions)
        }
    }, [listUserTasksError, listUserTasksIsError, listUserTasksIsSuccess]);

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
          <Loading />
        </span>
      )}
      <section
        className={`${
          listUserTasksIsSuccess ? 'flex' : 'hidden'
        } w-full flex flex-col gap-6`}
      >
        {listUserTasksIsSuccess && (
          <Table
            columns={columns}
            data={listUserTasksData?.data?.rows
              ?.slice()
              ?.sort((a, b) => b?.createdAt - a?.createdAt)
              ?.map((task, index) => {
                return {
                  no: index + 1,
                  id: task?.id,
                  title: task?.title,
                  start_date: moment(task?.start_date).format('YYYY-MM-DD'),
                  end_date: moment(task?.end_date).format('YYYY-MM-DD'),
                  priority: capitalizeWords(task?.priority),
                  draft: task?.draft ? 'Yes' : 'No',
                  added_by: task?.user?.name,
                  created_at: moment(task?.createdAt).format('YYYY-MM-DD'),
                };
              })}
          />
        )}
      </section>
    </main>
  );
}

export default ListTasks;
