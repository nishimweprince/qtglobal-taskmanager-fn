import PropTypes from 'prop-types';
import Button from '../../components/inputs/Button';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedAssignees, toggleListUsersModal } from '../../redux/features/taskSlice';
import { useLazyListUsersQuery } from '../../redux/api/apiSlice';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { toastOptions } from '../../constants/toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toggleCreateAssigneeModal } from '../../redux/features/assigneeSlice';
import CreateAssignee from '../task/CreateAssignee'
import { setDeleteUserModal, setSelectedUser } from '../../redux/features/accountSlice';
import DeleteUser from './DeleteUser';
import Modal from '../../components/modals/Modal';

const ListUsersModal = ({ isOpen = false }) => {

  // STATE VARIABLES
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.account);

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
    <Modal isOpen={isOpen} onClose={() => dispatch(toggleListUsersModal(false))}>
        {isListUsersLoading ? (
          <span className='w-full flex items-center justify-center h-[10vh]'>
            <p>Loading...</p>
          </span>
        ) : (
          <section className="h-full flex flex-col items-center w-full gap-6 mt-8">
            <menu className='flex items-center gap-3 justify-between w-full'>
              <h1 className="text-primary font-medium uppercase">
                Select users to assign on this task
              </h1>
              <Button primary value='Add new user' onClick={(e) => {
                e.preventDefault();
                dispatch(toggleCreateAssigneeModal(true))
                dispatch(toggleListUsersModal(false))
              }} />
            </menu>
            <menu className="flex flex-col gap-2 w-full">
              {listUsersData?.data?.rows?.filter(u => u?.id !== user?.id)?.map((user, index) => {
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
                    <menu className='flex items-center gap-2'>
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
                      <FontAwesomeIcon icon={faTrash} className="bg-red-600 text-white p-2 text-[12px] rounded-full cursor-pointer transition-all duration-200 hover:scale-[1.02]" onClick={(e) => {
                        e.preventDefault();
                        dispatch(setSelectedUser(user));
                        dispatch(toggleListUsersModal(false));
                        dispatch(setDeleteUserModal(true));
                      }} />
                    </menu>
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
      <CreateAssignee />
      <DeleteUser />
    </Modal>
  );
};

ListUsersModal.propTypes = {
  isOpen: PropTypes.bool,
};

export default ListUsersModal;
