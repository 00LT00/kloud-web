import {
  Button,
  Code,
  Input,
  Loading,
  Modal,
  Select,
  Table,
  useInput,
  useModal,
  useToasts,
} from '@geist-ui/core';
import { useRequest } from 'ahooks';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Headline from '../components/Headline';

export default function Resources() {
  const { setVisible, bindings } = useModal(false);
  const { setToast } = useToasts();
  const [dataConfig, setDataConfig] = useState<any>({}); // 存放config数据用于渲染到弹窗
  const [type, setResourceType] = useState('k8s');

  const { state: name, bindings: nameBindings, reset: nameReset } = useInput('');
  const { state: maxNum, bindings: maxNumBindings, reset: maxNumReset } = useInput('');
  const { state: folder, bindings: folderBindings, reset: folderReset } = useInput('');
  const { state: flowName, bindings: flowNameBindings, reset: flowNameReset } = useInput('');

  const { loading: createResourceLoading, run: createResource } = useRequest(
    () => axios.post<IResource[]>('/resource', { name, folder, type, max_num: +maxNum }),
    {
      manual: true,
      onSuccess() {
        setVisible(false);
      },
    },
  );

  useEffect(() => {
    nameReset();
    folderReset();
    maxNumReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createResourceLoading]);

  const {
    data: resourceDetailData,
    loading: resourceDetailLoading,
    runAsync: getResourceDetailData,
  } = useRequest((id: string) => axios.get<IResource>(`/resource/${id}`), {
    manual: true,
    onError() {
      setToast({ type: 'error', text: '操作失败' });
    },
  });
  const { loading: deleteResourceLoading, run: deleteResource } = useRequest(
    (id: string) => axios.delete<IResource>(`/resource/${id}`),
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
  const { setVisible: setCreateFlowVisible, bindings: createFlowBindings } = useModal(false);
  const { run: createFlow, loading: createFlowLoading } = useRequest(
    () =>
      axios.post<IResource>(`/flow`, {
        resource_id: resourceDetailData?.data.resource_id,
        name: flowName,
        config: dataConfig,
      }),
    {
      manual: true,
      onSuccess() {
        setToast({ type: 'success', text: '操作成功' });
        flowNameReset();
        setCreateFlowVisible(false);
      },
      ready: !!resourceDetailData,
    },
  );

  const { data: resourcesData } = useRequest(() => axios.get<IResource[]>('/resource'), {
    refreshDeps: [createResourceLoading, deleteResourceLoading, createFlowLoading],
  });

  useEffect(() => {
    if (!resourceDetailData?.data?.config) return;
    const config = resourceDetailData?.data.config;
    setDataConfig(config);
  }, [resourceDetailData]);

  return (
    <div>
      <Headline title="资源">
        <Button onClick={() => setVisible(true)} type="secondary">
          新建资源
        </Button>
      </Headline>
      <div className="border-t border-gray-200 py-10">
        <section className="max-w-5xl mx-auto">
          {resourcesData ? (
            <Table
              data={resourcesData.data.map((d) => ({ ...d, folder: <Code>{d.folder}</Code> }))}
            >
              <Table.Column prop="resource_id" label="资源ID" />
              <Table.Column prop="name" label="名称" />
              <Table.Column prop="max_num" label="最大数量" />
              <Table.Column prop="folder" label="目录" />
              <Table.Column prop="type" label="类型" />
              <Table.Column
                prop="action"
                render={(value, rowData: any) => (
                  <div className="space-x-2">
                    <Button
                      type="success"
                      auto
                      scale={1 / 3}
                      font="12px"
                      loading={createFlowLoading || resourceDetailLoading}
                      onClick={async () => {
                        await getResourceDetailData(rowData.resource_id);
                        setCreateFlowVisible(true);
                      }}
                    >
                      申请
                    </Button>
                    <Button
                      type="error"
                      auto
                      scale={1 / 3}
                      font="12px"
                      loading={deleteResourceLoading}
                      onClick={() => {
                        // eslint-disable-next-line no-alert
                        if (window.confirm('此操作不可逆，是否继续？')) {
                          deleteResource(rowData.resource_id);
                        }
                      }}
                    >
                      删除
                    </Button>
                  </div>
                )}
                label="操作"
              />
            </Table>
          ) : (
            <Loading />
          )}
        </section>
      </div>
      <Modal {...bindings}>
        <Modal.Title>新建资源</Modal.Title>
        <Modal.Content className="space-y-4">
          <Input width="100%" {...nameBindings} placeholder="资源名称" />
          <Select
            placeholder="选择资源类型"
            onChange={(e: any) => {
              setResourceType(e);
            }}
            width="100%"
          >
            <Select.Option value="k8s">k8s</Select.Option>
            <Select.Option value="helm">helm</Select.Option>
          </Select>
          <Input width="100%" {...folderBindings} placeholder="配置文件的绝对目录" />
          <Input width="100%" {...maxNumBindings} placeholder="最大数量" />
        </Modal.Content>
        <Modal.Action passive onClick={() => setVisible(false)}>
          取消
        </Modal.Action>
        <Modal.Action onClick={createResource} loading={createResourceLoading}>
          提交
        </Modal.Action>
      </Modal>
      <Modal {...createFlowBindings}>
        <Modal.Title>申请应用</Modal.Title>
        <Modal.Content className="space-y-4">
          <Input width="100%" {...flowNameBindings} placeholder="名称" />
          {Object.keys(dataConfig).map((key: string) => {
            return (
              <Input
                key={key}
                label={key}
                value={dataConfig[key]}
                width="100%"
                onChange={(e) => {
                  const { value } = e.target;
                  setDataConfig({ ...dataConfig, [key]: value });
                }}
              />
            );
          })}
        </Modal.Content>
        <Modal.Action passive onClick={() => setCreateFlowVisible(false)}>
          取消
        </Modal.Action>
        <Modal.Action onClick={createFlow} loading={createFlowLoading}>
          提交
        </Modal.Action>
      </Modal>
    </div>
  );
}
