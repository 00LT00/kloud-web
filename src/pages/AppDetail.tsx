import {
  Button,
  Card,
  Code,
  Description,
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
import { useParams } from 'react-router-dom';
import Headline from '../components/Headline';

export default function AppDetail() {
  const params = useParams();
  const { setToast } = useToasts();
  const { setVisible, bindings } = useModal(false);
  const { data, loading, refresh } = useRequest(
    () => axios.get<{ App: IApp; ports: [] }>(`/app/${params.id}`),
    {
      ready: !!params.id,
    },
  );

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
        refresh();
        setToast({ type: 'success', text: '操作成功' });
      },
      onError() {
        setToast({ type: 'error', text: '操作失败' });
      },
      manual: true,
      ready: !!params.id,
    },
  );
  const app = data?.data;
  return (
    <div>
      <Headline title={app?.App.Name}>
        <Button onClick={() => setVisible(true)} type="secondary">
          添加端口映射
        </Button>
      </Headline>
      <div className="border-b border-t border-gray-200 bg-gray-50 py-10">
        <section className="max-w-3xl mx-auto space-y-6">
          {loading ? (
            <Loading />
          ) : (
            <Card className="hover:cursor-pointer" shadow>
              <div className="space-y-4">
                <Description title="应用名称" content={app?.App.Name} />
                <Description title="资源 ID" content={app?.App.ResourceID} />
                <Description title="配置项（JSON）" content={<Code>{app?.App.Config}</Code>} />
                <Description
                  title="创建于"
                  content={<span>{dayjs(app?.App.CreatedAt).fromNow()}</span>}
                />
                <Description
                  title="端口映射"
                  content={
                    <div className="space-y-2">
                      {app?.ports.map((e: any) => (
                        <div>
                          <Code>{e.Port}</Code> {'->'} <Code>{e.targetPort}</Code>
                        </div>
                      ))}
                    </div>
                  }
                />
              </div>
            </Card>
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
