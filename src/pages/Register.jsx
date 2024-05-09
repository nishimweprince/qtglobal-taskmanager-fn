import { Controller, useForm } from 'react-hook-form';
import Button from '../components/inputs/Button';
import Input from '../components/inputs/Input';
import { useRegisterMutation } from '../redux/api/apiSlice';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import Loading from '../components/Loading';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../redux/features/accountSlice';
import { useNavigate } from 'react-router-dom';
import { toastOptions } from '../constants/toastify'

const Register = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [
    register,
    {
      data: registerData,
      isLoading: isRegisterLoading,
      error: registerError,
      isSuccess: isRegisterSuccess,
      isError: isRegisterError,
    },
  ] = useRegisterMutation();

  const onSubmit = (data) => {
    register({
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      password: data.password,
    });
  };

  useEffect(() => {
    if (isRegisterSuccess) {
      toast.success('Account created successfully. Redirecting to homepage', toastOptions);
      dispatch(setUser(registerData?.data?.user));
      dispatch(setToken(registerData?.data?.token));
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
    if (isRegisterError) {
      if (registerError?.status == 500) {
        toast.error('Could not create account, please try again later');
      }
      else {
        toast.error(registerError?.data?.message);
      }
    }
  }, [registerData, registerError, isRegisterSuccess, isRegisterError, isRegisterLoading, dispatch, navigate]);

  return (
    <main className="w-full h-screen mx-auto p-8 bg-primary flex items-center justify-center">
      <section className="w-[60%] bg-white shadow-lg rounded-md p-2 py-8">
        <article className="w-full flex flex-col gap-[4px] items-center">
          <h1 className="text-[20px] text-primary text-center font-semibold uppercase">
            Task Manager
          </h1>
          <h1 className="text-[18px] text-center font-semibold uppercase">
            Create Account
          </h1>
        </article>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-6 w-[90%] mx-auto p-8"
        >
          <section className="w-full flex flex-col gap-4">
            <span className="w-full flex items-center gap-6">
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Name is required' }}
                render={({ field }) => {
                  return (
                    <label className="w-full flex flex-col gap-[6px]">
                      <p>
                        Name <span className="text-red-600">*</span>
                      </p>
                      <Input placeholder="Manzi Smith" {...field} />
                      {errors.name && (
                        <p className="text-red-600 text-[12px]">
                          {errors.name.message}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
              <Controller
                name="email"
                control={control}
                rules={{ required: 'Email is required' }}
                render={({ field }) => {
                  return (
                    <label className="w-full flex flex-col gap-[6px]">
                      <p>
                        Email address <span className="text-red-600">*</span>
                      </p>
                      <Input placeholder="manzi@qtglobal.rw" {...field} />
                      {errors.email && (
                        <p className="text-red-600 text-[12px]">
                          {errors.email.message}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
            </span>
            <span className="w-full flex items-center gap-6">
              <Controller
                name="phone"
                control={control}
                render={({ field }) => {
                  return (
                    <label className="w-full flex flex-col gap-[6px]">
                      <p>Telephone</p>
                      <Input type="tel" {...field} placeholder="07XX XXX XXX" />
                    </label>
                  );
                }}
              />
              <Controller
                name="address"
                control={control}
                render={({ field }) => {
                  return (
                    <label className="w-full flex flex-col gap-[6px]">
                      <p>Physical Address</p>
                      <Input {...field} placeholder="Street No." />
                    </label>
                  );
                }}
              />
            </span>
            <span className="flex items-center gap-6 w-full">
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
                        <p className="text-red-600 text-[12px]">
                          {errors.password.message}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: 'Passwords do not match',
                  validate: (value) =>
                    value === watch('password') || 'Passwords do not match',
                }}
                render={({ field }) => {
                  return (
                    <label className="w-full flex flex-col gap-[6px]">
                      <p>
                        Confirm password <span className="text-red-600">*</span>
                      </p>
                      <Input type="password" {...field} />
                      {errors.confirmPassword && (
                        <p className="text-red-600 text-[12px]">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </label>
                  );
                }}
              />
            </span>
          </section>
          <span className="flex flex-col gap-2 items-center w-full">
            <Controller
              name="submit"
              control={control}
              render={() => {
                return (
                  <Button
                    name="submit"
                    value={isRegisterLoading ? <p>Loading...</p> : 'Submit'}
                    submit
                    primary
                    className="w-full"
                  />
                );
              }}
            />
          </span>
          <span className="flex items-center gap-2">
            <p>Already have an account?</p>
            <Button
              value="Login here"
              background={false}
              className="!p-0"
              route="/auth/login"
            />
          </span>
        </form>
      </section>
    </main>
  );
};

export default Register;
