import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../components/inputs/Button';
import {
  faAdd,
  faFloppyDisk,
  faPaperclip,
  faX,
} from '@fortawesome/free-solid-svg-icons';
import { Controller, useForm } from 'react-hook-form';
import Input from '../components/inputs/Input';
import DatePicker from '../components/inputs/DatePicker';
import { useDispatch, useSelector } from 'react-redux';
import TextArea from '../components/inputs/TextArea';
import { useState } from 'react';
import ListProjectsModal from '../containers/task/ListProjectsModal';
import ListUsersModal from '../containers/task/ListUsersModal';
import {
  removeSelectedAssignee,
  removeSelectedProject,
  setTask,
  toggleListProjectsModal,
  toggleListUsersModal,
} from '../redux/features/taskSlice';
import axios from 'axios';
import { toast } from 'react-toastify';
import { toastOptions } from '../constants/toastify';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const CreateTask = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch
  } = useForm();

  // STATE VARIABLES
  const dispatch = useDispatch();

  // NAVIGATE
  const navigate = useNavigate();

  const [attachmentFiles, setAttachmentFiles] = useState([]);

  const [isLoading, setIsLoading] = useState(false)

  const { selectedAssignees, selectedProjects, listUsersModal, listProjectsModal } = useSelector(
    (state) => state.task
  );

  const { token } = useSelector((state) => state.account);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append('title', data?.title);
      formData.append('start_date', data?.start_date);
      formData.append('end_date', data?.end_date);
      formData.append('description', data?.description);
      formData.append('priority', data?.priority);
      selectedAssignees.forEach((assignee, index) => {
        formData.append(`task_assignees[${index}]`, assignee?.user_id);
      });

      selectedProjects.forEach((project, index) => {
        formData.append(`task_projects[${index}]`, project?.project_id);
      });
      attachmentFiles?.forEach((file) => formData.append('files', file));

      setIsLoading(true)
      const response = await axios.post(`https://qtglobal-taskmanager-bn.onrender.com/api/tasks`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        }
      });

      setIsLoading(false)
      toast.success('Task created successfully', toastOptions)
      dispatch(setTask(response?.data))
      navigate('/tasks')
    } catch (error) {
      setIsLoading(false)
      toast.error('Could not create task. Please check your information and try again.', toastOptions)
    }
  };

  return (
    <main className="w-[50%] mx-auto py-8 px-6 flex flex-col items-center gap-4 shadow-md rounded-md min-h-[80vh] max-[1000px]:w-[55%] max-[900px]:w-[60%] max-[800px]:w-[65%] max-[700px]:w-[70%] max-[600px]:w-[75%] max-[500px]:w-[85%] max-[400px]:w-[90%]">
      <ListProjectsModal isOpen={listProjectsModal} />
      <ListUsersModal isOpen={listUsersModal} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-6"
      >
        <section className="flex items-center justify-between gap-8 w-full">
          <h1 className="font-semibold text-[18px] uppercase">Create Task</h1>
          <span className="flex items-center gap-3">
            <Button
              route="/tasks"
              background={false}
              value={<FontAwesomeIcon icon={faX} />}
            />
          </span>
        </section>
        <Controller
          name="title"
          rules={{ required: 'Task title is required' }}
          control={control}
          render={({ field }) => {
            return (
              <label className="flex flex-col gap-2 w-full">
                <Input required label="Name" placeholder="Task Name" {...field} />
                {errors?.title && (
                  <span className="text-red-500 text-[14px]">
                    {errors?.title?.message}
                  </span>
                )}
              </label>
            );
          }}
        />
        <span className="flex items-start justify-between gap-6">
          <Controller
            name="start_date"
            rules={{ required: 'Start date is required' }}
            control={control}
            render={({ field }) => {
              return (
                <label className="flex flex-col gap-2 w-full">
                  <DatePicker label="Start Date" required {...field} />
                  {errors?.start_date && (
                    <span className="text-red-500 text-[14px]">
                      {errors?.start_date?.message}
                    </span>
                  )}
                </label>
              );
            }}
          />
          <Controller
            name="end_date"
            rules={{
              required: 'End date is required', validate: (value) => {
                if (watch('start_date') && moment(value).format() < moment(watch('start_date')).format()) {
                  return 'End date cannot be less than start date'
                }
              }
            }}
            control={control}
            render={({ field }) => {
              return (
                <label className='w-full flex flex-col gap-2'>
                  <DatePicker required label="End Date" {...field} />
                  {errors?.end_date && (
                    <span className="text-red-500 text-[14px]">
                      {errors?.end_date?.message}
                    </span>
                  )}
                </label>
              );
            }}
          />
        </span>
        <span className="flex flex-col gap-2">
          <h4 className="text-[18px] font-medium">Assignee</h4>
          <menu className="flex items-center gap-3 w-full flex-wrap">
            {selectedAssignees?.length > 0 &&
              selectedAssignees?.map((assignee, index) => {
                return (
                  <li key={index} className="flex items-center gap-2">
                    <p className="text-[14px] font-medium">
                      {assignee?.user_name}
                    </p>
                    <Button
                      background={false}
                      value={
                        <FontAwesomeIcon icon={faX} className="text-red-500" />
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(
                          removeSelectedAssignee(
                            selectedAssignees?.filter(
                              (user) => user?.user_id !== assignee?.user_id
                            )
                          )
                        );
                      }}
                    />
                  </li>
                );
              })}
            <Button
              value={<FontAwesomeIcon icon={faAdd} />}
              background={false}
              onClick={(e) => {
                e.preventDefault();
                dispatch(toggleListUsersModal(true));
              }}
            />
          </menu>
        </span>
        <span className="flex flex-col gap-2">
          <h4 className="font-medium text-[18px]">Projects</h4>
          <menu className="w-full min-h-[7vh] p-2 px-4 border-[.5px] border-slate-400 relative flex gap-3 items-center rounded-md">
            {selectedProjects?.length > 0 ? (
              selectedProjects?.map((project, index) => {
                return (
                  <li
                    key={index}
                    className="flex items-center gap-2 border-[.5px] border-slate-200 hover:bg-slate-100 p-[4px] px-3 rounded-md"
                  >
                    <p className="text-[14px] font-medium">
                      {project?.project_title}
                    </p>
                    <Button
                      background={false}
                      value={
                        <FontAwesomeIcon icon={faX} className="text-red-500" />
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(
                          removeSelectedProject(
                            selectedProjects?.filter(
                              (selectedProject) =>
                                selectedProject?.project_id !==
                                project?.project_id
                            )
                          )
                        );
                      }}
                    />
                  </li>
                );
              })
            ) : (
              <h4 className="text-slate-500">Project Name</h4>
            )}
            <Button
              className="absolute right-0"
              value={<FontAwesomeIcon icon={faAdd} />}
              background={false}
              onClick={(e) => {
                e.preventDefault();
                dispatch(toggleListProjectsModal(true));
              }}
            />
          </menu>
        </span>
        <Controller
          name="description"
          rules={{
            required: 'Description is required',
            validate: (value) => {
              return value?.trim()?.length < 50 || 'Description cannot exceed 50 characters';
            },
          }}
          control={control}
          render={({ field }) => {
            return (
              <label className="flex flex-col gap-2 w-full">
                <TextArea
                  className={`${errors?.description ? '!border-red-600' : 'ring-gray-300'
                    }`}
                  label="Description"
                  placeholder="Add more details about this task"
                  {...field}
                />
                {errors?.description && (
                  <span className="text-red-500 text-[14px]">
                    {errors?.description?.message}
                  </span>
                )}
              </label>
            );
          }}
        />
        <span className="flex flex-col gap-2">
          <h4 className="font-medium text-[17px]">Priority</h4>
          <fieldset className="flex items-center gap-6">
            {['low', 'normal', 'high']?.map((priority, index) => {
              return (
                <Controller
                  name="priority"
                  key={index}
                  defaultValue="high"
                  control={control}
                  render={({ field }) => {
                    return (
                      <label
                        onClick={() => {
                          setValue('priority', priority);
                        }}
                      >
                        <Input
                          name="priority"
                          type="radio"
                          placeholder={priority?.replace(/\b\w/g, (l) =>
                            l.toUpperCase()
                          )}
                          defaultValue={priority}
                          onChange={(e) => {
                            field.onChange(e);
                            setValue('priority', priority);
                          }}
                        />
                      </label>
                    );
                  }}
                />
              );
            })}
          </fieldset>
        </span>
        <section className="flex items-center justify-between gap-6">
          <span>
            <Controller
              name="task_files"
              control={control}
              render={() => {
                return (
                  <label className="flex items-center gap-[3px] cursor-pointer">
                    <input
                      type="file"
                      name="files"
                      multiple
                      style={{ display: 'none' }}
                      onChange={(e) => {
                        e.preventDefault();
                        const newAttachments = [...attachmentFiles];
                        Array.from(e.target.files)?.forEach((file) =>
                          newAttachments.push(file)
                        );
                        setAttachmentFiles(newAttachments);
                        setValue('task_files', attachmentFiles);
                      }}
                    />
                    <FontAwesomeIcon icon={faPaperclip} /> Attach
                    <span className='mx-4'>
                      <FontAwesomeIcon icon={faAdd} />
                    </span>
                  </label>
                );
              }}
            />
          </span>
          <span className="flex items-center gap-4">
            <Button value="Cancel" route="/" />
            <Controller
              name="submit"
              control={control}
              render={() => {
                return (
                  <Button
                    value={isLoading ? 'Creating Task...' : 'Submit'}
                    primary
                    submit
                  />
                );
              }}
            />
          </span>
        </section>
        <menu className="flex flex-col gap-2">
          {attachmentFiles?.length > 0 &&
            attachmentFiles?.map((file, index) => {
              return (
                <li
                  className="p-2 shadow-md rounded-md flex items-center justify-between"
                  key={index}
                >
                  {file?.name}
                  <Button
                    background={false}
                    value={
                      <FontAwesomeIcon icon={faX} className="text-red-500" />
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      const newArray = attachmentFiles?.filter(
                        (attachemnt) => attachemnt?.name !== file?.name
                      );
                      setAttachmentFiles(newArray);
                      setValue('task_files', attachmentFiles);
                    }}
                  />
                </li>
              );
            })}
        </menu>
      </form>
    </main>
  );
};

export default CreateTask;
