import {
  Button,
  Card,
  Code,
  Description,
  Fieldset,
  Input,
  Loading,
  Modal,
  Table,
  Text,
  useInput,
  useModal,
  useToasts,
} from '@geist-ui/core';
import { useRequest } from 'ahooks';
import axios from 'axios';
import dayjs from 'dayjs';
import { useNavigate, useParams } from 'react-router-dom';
import Headline from '../components/Headline';

export default function AppDetail() {
  const params = useParams();
  const { setToast } = useToasts();
  const { setVisible, bindings } = useModal(false);

  const { bindings: fromBindings, reset: fromReset, state: fromPort } = useInput('');
  const { bindings: toBindings, reset: toReset, state: toPort } = useInput('');
  const { run: createPort, loading: createPortLoading } = useRequest(
    () =>
      axios.put(`/app/${params.id}/port`, {
        port: +fromPort,
        targetPort: +toPort,
      }),
    {
      onSuccess() {
        fromReset();
        toReset();
        setVisible(false);
        setToast({ type: 'success', text: '操作成功' });
      },
      onError() {
        setToast({ type: 'error', text: '操作失败' });
      },
      manual: true,
      ready: !!params.id,
    },
  );
  const { run: deletePort, loading: deletePortLoading } = useRequest(
    (port: string) => axios.delete(`/app/${params.id}/port/${port}`),
    {
      onSuccess() {
        setToast({ type: 'success', text: '操作成功' });
      },
      onError() {
        setToast({ type: 'error', text: '操作失败' });
      },
      manual: true,
      ready: !!params.id,
    },
  );

  const navigate = useNavigate();
  const { run: deleteApp, loading: deleteAppLoading } = useRequest(
    () => axios.delete(`/app/${params.id}`),
    {
      onSuccess() {
        navigate('/apps');
        setToast({ type: 'success', text: '操作成功' });
      },
      onError() {
        setToast({ type: 'error', text: '操作失败' });
      },
      manual: true,
      ready: !!params.id,
    },
  );

  const { data, loading, refresh } = useRequest(
    () => axios.get<{ App: IApp; ports: [] }>(`/app/${params.id}`),
    {
      ready: !!params.id,
      refreshDeps: [deletePortLoading, createPortLoading],
    },
  );
  const app = data?.data;
  return (
    <div>
      <Headline title={app?.App.Name}>
        <div className="flex space-x-2">
          <Button onClick={() => setVisible(true)} type="secondary">
            添加端口映射
          </Button>
          <Button
            loading={deleteAppLoading}
            onClick={async () => {
              // eslint-disable-next-line no-alert
              if (window.confirm('此操作不可逆，是否继续？')) {
                deleteApp();
              }
            }}
            type="error"
          >
            删除应用
          </Button>
        </div>
      </Headline>
      <div className="border-b border-t border-gray-200 bg-gray-50 py-10">
        <section className="max-w-3xl mx-auto space-y-6">
          {loading ? (
            <Loading />
          ) : (
            <>
              <Card className="hover:cursor-pointer" shadow>
                <Text h4 className="mb-4">
                  基本信息
                </Text>
                <div className="space-y-4">
                  <Description title="应用名称" content={app?.App.Name} />
                  <Description title="资源 ID" content={app?.App.ResourceID} />
                  {app?.App.Config &&
                    Object.entries(app?.App.Config).map(([key, value]) => (
                      <Description title={key} content={value} key={key} />
                    ))}
                  <Description
                    title="创建于"
                    content={<span>{dayjs(app?.App.CreatedAt).fromNow()}</span>}
                  />
                </div>
              </Card>
              <Card shadow>
                <Text h4 className="mb-4">
                  端口映射
                </Text>
                <Table
                  data={app?.ports.map((d: any) => ({
                    ...d,
                    action: (
                      <div className="space-x-2">
                        <Button
                          scale={0.75}
                          onClick={() => deletePort(d.Port)}
                          type="error"
                          loading={deletePortLoading}
                          auto
                        >
                          删除
                        </Button>
                      </div>
                    ),
                  }))}
                >
                  <Table.Column prop="Port" label="源端口" />
                  <Table.Column prop="targetPort" label="目标端口" />
                  <Table.Column prop="action" label="操作" width={150} />
                </Table>
              </Card>
            </>
          )}
        </section>
      </div>
      <Modal {...bindings}>
        <Modal.Title>添加端口映射</Modal.Title>
        <Modal.Content className="space-y-4">
          <div className="flex space-x-2">
            <Input placeholder="源端口" {...fromBindings} htmlType="number" width="100%" />
            <Input placeholder="目标端口" {...toBindings} htmlType="number" width="100%" />
          </div>
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)}>
          取消
        </Modal.Action>
        <Modal.Action loading={createPortLoading} onClick={createPort}>
          提交
        </Modal.Action>
      </Modal>
    </div>
  );
}
