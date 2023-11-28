import PropTypes from 'prop-types';
import Button from '../../components/inputs/Button';
import { useDispatch } from 'react-redux';
import { setSelectedAssignees, toggleListUsersModal } from '../../redux/features/taskSlice';
import { useLazyListUsersQuery } from '../../redux/api/apiSlice';
import { useEffect } from 'react';
import Loading from '../../components/Loading';
import { toast } from 'react-toastify';
import { toastOptions } from '../../constants/Toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';

const ListUsersModal = ({ isOpen = false }) => {
  const dispatch = useDispatch();

  const [
    listUsers,
    {
      data: listUsersData,
      isSuccess: isListUsersSuccess,
      isError: isListUsersError,
      isLoading: isListUsersLoading,
      error: listUsersError,
    },
  ] = useLazyListUsersQuery();

  useEffect(() => {
    if (isOpen) listUsers();
  }, [listUsers, isOpen]);

  useEffect(() => {
    if (isListUsersError) {
      toast.error('Could not load users. Please try again', toastOptions);
    }
  }, [isListUsersSuccess, isListUsersError, listUsersData, listUsersError]);

  return (
    <main
      className={`${
        isOpen ? 'flex overflow-y-hidden' : 'hidden'
      } absolute items-center justify-center z-[10000] w-full h-screen bg-slate-500 bg-opacity-30 top-0 right-0 bottom-0 left-0`}
    >
      <section
        className={`w-[45%] relative h-fit px-6 py-4 flex flex-col gap-4 items-start justify-start bg-white rounded-md shadow-md`}
      >
        {isListUsersLoading ? (
          <Loading />
        ) : (
          <section className="h-full flex flex-col items-center w-full gap-6 my-4">
            <h1 className="text-primary font-medium uppercase">
              Select users to assign on this task
            </h1>
            <menu className="flex flex-col gap-2 w-full">
              {listUsersData?.data?.rows?.map((user, index) => {
                return (
                  <label
                    key={index}
                    className="flex items-center justify-between p-2 rounded-md"
                  >
                    <Button
                      key={user?.id}
                      value={
                        <span className="flex w-full items-center gap-2">
                          <p>{index + 1}</p>
                          {user?.name}
                        </span>
                      }
                      background={false}
                      className="hover:!no-underline !p-0 w-full"
                    />
                    <Button
                      value={<FontAwesomeIcon icon={faAdd} />}
                      background={false}
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(
                          setSelectedAssignees({
                            user_id: user?.id,
                            user_name: user?.name,
                            user_email: user?.email,
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
              dispatch(toggleListUsersModal(false));
            }}
          />
        </span>
      </section>
    </main>
  );
};

ListUsersModal.propTypes = {
  isOpen: PropTypes.bool,
};

export default ListUsersModal;
