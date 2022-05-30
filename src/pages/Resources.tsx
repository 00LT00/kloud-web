import {
  Button,
  Code,
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
import { memo, useEffect, useState } from 'react';
import Headline from '../components/Headline';

export default function Resources() {
  const { setVisible, bindings } = useModal(false);
  const { setToast } = useToasts();
  const [dataConfig, setDataConfig] = useState<any>({}); // 存放config数据用于渲染到弹窗

  const { state: name, bindings: nameBindings, reset: nameReset } = useInput('');
  const { state: folder, bindings: folderBindings, reset: folderReset } = useInput('');
  const { state: type, bindings: typeBindings, reset: typeReset } = useInput('');

  const { loading: createResourceLoading, run: createResource } = useRequest(
    () => axios.post<IResource[]>('/resource', { name, folder, type }),
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
    typeReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createResourceLoading]);

  const { data: resourcesData } = useRequest(() => axios.get<IResource[]>('/resource'), {
    refreshDeps: [createResourceLoading],
  });

  const {
    data: resourceDetailData,
    loading: resourceDetailLoading,
    runAsync: getResourceDetailData,
  } = useRequest((id: string) => axios.get<IResource>(`/resource/${id}`), {
    manual: true,
    onSuccess() {
      setToast({ type: 'success', text: '操作成功' });
    },
    onError() {
      setToast({ type: 'error', text: '操作失败' });
    },
  });
  const { setVisible: setCreateFlowVisible, bindings: createFlowBindings } = useModal(false);

  const { run: createFlow, loading: createFlowLoading } = useRequest(
    () =>
      axios.post<IResource>(`/flow`, {
        resource_id: resourceDetailData?.data.resource_id,
        config: JSON.stringify(dataConfig),
      }),
    {
      manual: true,
      onSuccess() {
        setCreateFlowVisible(false);
      },
      ready: !!resourceDetailData,
    },
  );

  // useEffect(() => {
  //   cpuReset();
  //   memoryReset();
  //   detailNameReset();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [createResourceLoading]);

  useEffect(() => {
    console.log(resourceDetailData);
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
              <Table.Column prop="resource_id" label="ID" />
              <Table.Column prop="name" label="名称" />
              <Table.Column prop="folder" label="目录" />
              <Table.Column prop="type" label="类型" />
              <Table.Column
                prop="action"
                render={(value, rowData: any, index) => (
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
          <Input width="100%" {...typeBindings} placeholder="资源类型，k8s / helm 可选" />
          <Input width="100%" {...folderBindings} placeholder="配置文件的绝对目录" />
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
          {/* <Input width="100%" {...detailNameBindings} placeholder="名称" />
          <Input width="100%" {...cpuBindings} placeholder="CPU" />
          <Input width="100%" {...memoryBindings} placeholder="内存" /> */}
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
