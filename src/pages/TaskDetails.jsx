import { useParams } from "react-router-dom";
import { useLazyGetTaskDetailsQuery } from "../redux/api/apiSlice";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { toastOptions } from "../constants/toastify";
import { capitalizeString } from "../helpers/words";
import moment from "moment";
import Button from "../components/inputs/Button";
import Loading from "../components/Loading";

const TaskDetails = () => {

    const { id } = useParams();

    const [task, setTask] = useState(null);

    const [getTaskDetails, {
        data: taskData,
        isLoading,
        isSuccess,
        isError,
        error,
    }] = useLazyGetTaskDetailsQuery();

    useEffect(() => {
        getTaskDetails({ id });
    }, [id, getTaskDetails]);

    useEffect(() => {
        if (isSuccess) setTask(taskData?.data)
        if (isError) {
            toast.error('Could not fetch task details. Please try again', toastOptions);
        }
    }, [taskData, isLoading, isSuccess, isError, error]);

  return (
    <main className="flex flex-col gap-6 w-[90%] mx-auto p-4">
      {isSuccess && (
        <section className="flex flex-col gap-6">
          <span className="w-full flex flex-col gap-4 items-start">
            <h1 className="text-center text-xl uppercase text-primary font-semibold">
              Title: {task?.title}
            </h1>
            <p>Description: {task?.description}</p>
            <p>Priority: {task?.priority && capitalizeString(task?.priority)}</p>
            <p>Added by: {task?.user?.name}</p>
            <p>date Added: {moment(task?.createAt).format('YYYY-MM-DD')}</p>
          </span>
          <span className={`flex flex-col gap-4`}>
          <h4 className="uppercase font-semibold text-primary text-lg">Attachments:</h4>
            <menu
              className={`${
                task?.files?.length > 0 ? 'flex' : 'hidden'
              } flex flex-col gap-2`}
            >
              {task?.files?.length > 0 &&
                task?.files?.map((file, index) => {
                  return (
                    <article
                      key={index}
                      className="flex gap-2 items-center p-2 rounded-md shadow-md w-fit"
                    >
                      <p className="text-[15px]">{file?.name}</p>
                      <Button
                        className="!text-[13px] !p-2 !py-2"
                        value={'Download'}
                        onClick={(e) => {
                          e.preventDefault();
                          window.open(file?.url, '_blank');
                        }}
                      />
                    </article>
                  );
                })}
            </menu>
          </span>
          <span className="flex flex-col gap-4">
            <h4 className="uppercase font-semibold text-primary text-lg">Associated Projects</h4>
            <menu>
                {task?.projects?.length && (
                    task?.projects?.map((project, index) => {
                        return (
                            <article key={index} className="flex flex-col gap-[6px] items-start p-2 w-fit">
                                <h3 className="text-[16px]">{project?.title}</h3>
                                <p className="text-gray-700 text-[13px]">{project?.description}</p>
                            </article>
                        )
                    })
                )}
            </menu>
          </span>
          <span>
          <h4 className="uppercase font-semibold text-primary text-lg">Assigned Users</h4>
            <menu>
                {task?.assignees?.length && (
                    task?.assignees?.map((assignee, index) => {
                        return (
                            <article key={index} className="flex flex-col gap-[6px] items-start p-2 w-fit">
                                <h3 className="text-[16px]">{assignee?.name}</h3>
                                <p className="text-gray-700 text-[13px]">{assignee?.phone}</p>
                            </article>
                        )
                    } )
                )}
            </menu>
          </span>
        </section>
      )}
      {isLoading && (
        <span className="flex items-center justify-center min-h-[60vh] w-full">
            <Loading />
        </span>
      )}
    </main>
  );
}

export default TaskDetails;
