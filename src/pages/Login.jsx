import { Controller, useForm } from 'react-hook-form';
import Input from '../components/inputs/Input';
import Button from '../components/inputs/Button';
import Loading from '../components/Loading';
import { useLoginMutation } from '../redux/api/apiSlice';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../redux/features/accountSlice';
import { toastOptions } from '../constants/toastify';
import validateInputs from '../helpers/validations';

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [
    login,
    {
      isLoading: isLoginLoading,
      isSuccess: isLoginSuccess,
      isError: isLoginError,
      error: loginError,
      data: loginData,
    },
  ] = useLoginMutation();

  const onSubmit = (data) => {
    login({
      email: data.email,
      password: data.password,
    });
  };

  useEffect(() => {
    if (isLoginSuccess) {
      toast.success('Login successful. Redirecting to homepage', toastOptions);
      dispatch(setUser(loginData?.data?.user));
      dispatch(setToken(loginData?.data?.token));
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else if (isLoginError) {
      if (loginError?.status === 500) {
        toast.error('Server error. Please try again later', toastOptions);
      } else {
        toast.error(loginError?.data?.message, toastOptions);
    }
  }
  }, [isLoginSuccess, isLoginError, loginData, dispatch, navigate, loginError?.status, loginError?.data?.message]);

  return (
    <main className="w-full h-screen mx-auto p-8 bg-primary flex items-center justify-center">
      <section className="w-[40%] bg-white shadow-lg rounded-md p-8">
        <article className="w-full flex flex-col gap-[4px] items-center">
          <h1 className="text-[20px] text-primary text-center font-semibold uppercase">
            Task Manager
          </h1>
          <h1 className="text-[18px] text-center font-semibold uppercase">
            Login
          </h1>
        </article>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-4 w-[90%] mx-auto p-8"
        >
          <span className="w-full flex flex-col gap-4">
            <Controller
              name="email"
              rules={{ required: 'Email is required', validate: (value) => {
                return validateInputs(value, 'email') || 'Invalid email address';
              } }}
              control={control}
              render={({ field }) => {
                return (
                  <label className="w-full flex flex-col gap-[6px]">
                    <p>
                      Email address <span className="text-red-600">*</span>
                    </p>
                    <Input {...field} />
                    {errors.email && (
                      <span className="text-red-600 text-[13px]">
                        {errors.email.message}
                      </span>
                    )}
                  </label>
                );
              }}
            />
            <Controller
              name="password"
              control={control}
              rules={{ required: 'Password is required' }}
              render={({ field }) => {
                return (
                  <label className="w-full flex flex-col gap-[6px]">
                    <p>
                      Password <span className="text-red-600">*</span>
                    </p>
                    <Input type="password" {...field} />
                    {errors.password && (
                      <span className="text-red-600 text-[13px]">
                        {errors.password.message}
                      </span>
                    )}
                  </label>
                );
              }}
            />
          </span>
          <span className="flex flex-col gap-2 items-center w-full">
            <span className="flex items-center gap-2">
              <p>Forgot Password? </p>
              <Button value="Reset here" background={false} className="!p-0" />
            </span>
            <Controller
              name="submit"
              control={control}
              render={() => {
                return (
                  <Button
                    name="submit"
                    value={isLoginLoading ? <p>Loading...</p> : 'Submit'}
                    submit
                    primary
                    className="w-full"
                  />
                );
              }}
            />
          </span>
          <span className="flex items-center gap-2">
            <p>Don&apos;t have an account?</p>
            <Button
              value="Register here"
              background={false}
              className="!p-0"
              route="/auth/register"
            />
          </span>
        </form>
      </section>
    </main>
  );
};

export default Login;
