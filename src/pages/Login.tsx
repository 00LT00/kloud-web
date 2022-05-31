import { Button, Input, Link, Text, useInput, useToasts } from '@geist-ui/core';
import { useRequest } from 'ahooks';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useUser from '../models/useUser';

export default function Login() {
  const navigate = useNavigate();
  const { refreshUserAsync, user } = useUser();
  const { setToast } = useToasts();
  const { state: username, bindings: usernameBindings } = useInput('');
  const { state: password, bindings: passwordBindings } = useInput('');
  const { run: login, loading } = useRequest(
    () => {
      return axios.put<{ Role: string; Token: string }>('/login', {
        username,
        password,
      });
    },
    {
      manual: true,
      async onSuccess({ data, status }) {
        if (status !== 200) {
          setToast({ type: 'error', text: '登录失败' });
          return;
        }
        localStorage.setItem('token', data.Token);
        await refreshUserAsync();
        setToast({ type: 'success', text: '登录成功' });
        navigate('/apps');
        
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
          现在登录
        </Text>
      </div>
      <div className="mx-auto max-w-128 p-8 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            login();
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
              <Link onClick={() => navigate('/register')}>尚未注册？</Link>
            </div>
          </div>

          <div>
            <Button loading={loading} type="secondary" width="100%" htmlType="submit">
              现在登录
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
