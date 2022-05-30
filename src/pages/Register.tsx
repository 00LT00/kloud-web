import { Button, Input, Link, Text, useInput, useToasts } from '@geist-ui/core';
import { useRequest } from 'ahooks';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '../models/useUser';

export default function Register() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { setToast } = useToasts();
  const { state: username, bindings: usernameBindings } = useInput('');
  const { state: password, bindings: passwordBindings } = useInput('');
  const { run: register, loading } = useRequest(
    () =>
      axios.post('/register', {
        username,
        password,
      }),
    {
      manual: true,
      onSuccess() {
        setToast({ type: 'success', text: '注册成功，请登录' });
        navigate('/login');
      },
      onError() {
        setToast({ type: 'error', text: '操作失败' });
      },
    },
  );

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  return (
    <section className="py-10 px-8">
      <div className="mb-6">
        <Text className="mt-6 text-center" h2>
          现在注册
        </Text>
      </div>
      <div className="mx-auto max-w-128 p-8 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            register();
          }}
          className="space-y-6"
          action="#"
          method="POST"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              用户名
            </label>
            <div className="mt-1">
              <Input width="100%" {...usernameBindings} />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              密码
            </label>
            <div className="mt-1">
              <Input width="100%" htmlType="password" {...passwordBindings} />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                记住密码
              </label>
            </div>

            <div className="text-sm">
              <Link onClick={() => navigate('/login')}>返回登录</Link>
            </div>
          </div>

          <div>
            <Button loading={loading} type="secondary" width="100%" htmlType="submit">
              现在注册
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
