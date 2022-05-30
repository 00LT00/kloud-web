import { Button, Code, Fieldset, Loading, Table, Text, useToasts } from '@geist-ui/core';
import { useRequest } from 'ahooks';
import axios from 'axios';
import classNames from 'classnames';
import Headline from '../components/Headline';
import useUser from '../models/useUser';

export default function Settings() {
  const { logout } = useUser();
  const { setToast } = useToasts();
  const { data: allAdminsData } = useRequest(() => axios.get<IUser[]>('/user/admin'));
  const { run: setAsAdmin, loading: setAsAdminLoading } = useRequest(
    (id: string) => axios.patch(`/user/admin/${id}`),
    {
      manual: true,
      onSuccess() {
        setToast({ type: 'success', text: '操作成功' });
      },
      onError() {
        setToast({ type: 'error', text: '操作失败' });
      },
    },
  );
  const { run: setAsUser, loading: setAsUserLoaing } = useRequest(
    (id: string) => axios.delete(`/user/admin/${id}`),
    {
      manual: true,
      onSuccess() {
        setToast({ type: 'success', text: '操作成功' });
      },
      onError() {
        setToast({ type: 'error', text: '操作失败' });
      },
    },
  );
  const { data: allUsersData } = useRequest(() => axios.get<IUser[]>('/user/all'), {
    refreshDeps: [setAsAdminLoading, setAsUserLoaing],
  });

  return (
    <div>
      <Headline title="设置" />
      <div className="border-t border-gray-200 py-10">
        <main className="max-w-5xl mx-auto px-6 grid grid-cols-12 gap-x-20">
          <div className="col-span-3">
            <button className="w-full text-left text-sm font-bold text-gray-800 hover:bg-gray-200 transition-all rounded-md py-3 px-4">
              用户
            </button>
            <button
              onClick={logout}
              className="w-full text-left text-sm text-gray-800 hover:bg-gray-200 transition-all rounded-md py-3 px-4"
            >
              退出登录
            </button>
          </div>
          <div className="space-y-9 col-span-9 pt-1 space-y-4">
            <Fieldset className="box-border">
              <Fieldset.Title className="mb-4">管理员</Fieldset.Title>
              {allAdminsData ? (
                <Table data={allAdminsData.data}>
                  <Table.Column prop="id" label="ID" />
                  <Table.Column prop="username" label="用户名" />
                  <Table.Column
                    prop="action"
                    render={(value, rowData: any, index) => (
                      <Button
                        type="success"
                        auto
                        scale={1 / 3}
                        font="12px"
                        onClick={() => setAsUser(rowData.id)}
                      >
                        删除管理权限
                      </Button>
                    )}
                    label="操作"
                  />
                </Table>
              ) : (
                <Loading />
              )}
              <Fieldset.Footer>您可以取消部分管理员的权限</Fieldset.Footer>
            </Fieldset>
            <Fieldset className="box-border">
              <Fieldset.Title className="mb-4">普通用户</Fieldset.Title>
              {allUsersData ? (
                <Table data={allUsersData.data}>
                  <Table.Column prop="id" label="ID" />
                  <Table.Column prop="username" label="用户名" />
                  <Table.Column
                    prop="action"
                    render={(value, rowData: any, index) => (
                      <Button
                        type="success"
                        auto
                        scale={1 / 3}
                        font="12px"
                        onClick={() => setAsAdmin(rowData.id)}
                      >
                        设为管理员
                      </Button>
                    )}
                    label="操作"
                  />
                </Table>
              ) : (
                <Loading />
              )}
              <Fieldset.Footer>您可以为普通用户赋予管理员权限</Fieldset.Footer>
            </Fieldset>
          </div>
        </main>
      </div>
    </div>
  );
}
