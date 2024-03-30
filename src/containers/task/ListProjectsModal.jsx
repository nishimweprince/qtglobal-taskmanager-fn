import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import Button from '../../components/inputs/Button';
import { setSelectedProjects, toggleListProjectsModal } from '../../redux/features/taskSlice';
import Loading from '../../components/Loading';
import { useLazyListUserProjectsQuery } from '../../redux/api/apiSlice';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { toastOptions } from '../../constants/Toastify';
import { toggleCreateProjectModal } from '../../redux/features/projectSlice';
import CreateProject from './CreateProject';

const ListProjectsModal = ({ isOpen = false }) => {
  const dispatch = useDispatch();

  const [listUserProjects, {
    data: listUserProjectsData,
    isLoading: isListUserProjectsLoading,
    isError: isListUserProjectsError,
    isSuccess: isListUserProjectsSuccess,
  }] = useLazyListUserProjectsQuery();

  useEffect(() => {
    if (isOpen) listUserProjects();
  }, [listUserProjects, isOpen]);

  useEffect(() => {
    if (isListUserProjectsError) {
      toast.error('Could not load projects. Please try again', toastOptions);
    }
  }, [isListUserProjectsSuccess, isListUserProjectsError, listUserProjectsData]);

  return (
    <main
      className={`${
        isOpen ? 'flex overflow-y-hidden' : 'hidden'
      } absolute items-center justify-center z-[10000] w-full h-screen bg-gray bg-opacity-30 top-0 right-0 bottom-0 left-0`}
    >
      <section
        className={`w-[45%] relative h-fit px-6 py-4 flex flex-col gap-4 items-start justify-start bg-white rounded-md shadow-md`}
      >
        {isListUserProjectsLoading ? (
          <Loading />
        ) : (
          <section className="h-full flex flex-col items-center w-full gap-6 my-4">
            <menu className='flex items-center w-full gap-3 justify-between'>
              <h1 className="text-primary font-medium uppercase">
                Select projects to associate with this task
              </h1>
              <Button value='Add project' primary onClick={(e) => {
                e.preventDefault();
                dispatch(toggleListProjectsModal(false));
                dispatch(toggleCreateProjectModal(true));
              }} />
            </menu>
            <menu className="flex flex-col gap-2 w-full">
              {listUserProjectsData?.data?.rows?.map((project, index) => {
                return (
                  <label
                    key={index}
                    className="flex items-center justify-between p-2 rounded-md"
                  >
                    <Button
                      key={project?.id}
                      value={
                        <span className="flex w-full items-center gap-3">
                          <p>{index + 1}</p>
                          <article>
                          {project?.title}
                          <legend className="text-sm text-gray-500">
                            {project?.description}
                          </legend>
                          </article>
                        </span>
                      }
                      background={false}
                      className="hover:!no-underline !p-0 w-full hover:!scale-[.99]"
                    />
                    <Button
                      value={<FontAwesomeIcon icon={faAdd} />}
                      background={false}
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(
                          setSelectedProjects({
                            project_id: project?.id,
                            project_title: project?.title,
                            project_description: project?.description,
                          })
                        );
                      }}
                    />
                  </label>
                );
              })}
            </menu>
          </section>
        )}
        <span>
          <Button
            value="Close"
            className="absolute bottom-2 right-4 mt-4"
            onClick={(e) => {
              e.preventDefault();
              dispatch(toggleListProjectsModal(false));
            }}
          />
        </span>
      </section>
      <CreateProject />
    </main>
  );
};

ListProjectsModal.propTypes = {
  isOpen: PropTypes.bool,
};

export default ListProjectsModal;
