import { Button, Code, Loading, Table, Text, useToasts } from '@geist-ui/core';
import { useRequest } from 'ahooks';
import axios from 'axios';
import Headline from '../components/Headline';

export default function Workflows() {
  const { setToast } = useToasts();
  const { run: moderate, loading: moderateLoading } = useRequest(
    (id: string, reason: string, status: 'pass' | 'fail') =>
      axios.put(`/flow/${id}`, {
        reason,
        status,
      }),
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
  const { data: flowsData, loading } = useRequest(() => axios.get<IFlow[]>('/flow/pending'), {
    refreshDeps: [moderateLoading],
  });

  // const {
  //   data: resourceDetailData,
  //   loading: resourceDetailLoading,
  //   runAsync: getResourceDetailData,
  // } = useRequest((id: string) => axios.get<IResource>(`/resource/${id}`), {
  //   manual: true,
  // });

  return (
      <div>
          <Headline title="审批">
          </Headline>
          <div className="border-t border-gray-200 py-10">
              <section className="max-w-5xl mx-auto">
                  {loading ? (
                      <Loading />
                  ) : (
                      <Table
                          data={flowsData?.data.map((d) => ({
                              ...d,
                              action: (
                                  <div className="space-x-2">
                                      <Button
                                          scale={0.75}
                                          onClick={() =>
                                              moderate(d.FlowID, "通过", "pass")
                                          }
                                          type="success"
                                          loading={moderateLoading}
                                          auto
                                      >
                                          通过
                                      </Button>
                                      <Button
                                          scale={0.75}
                                          onClick={() =>
                                              moderate(d.FlowID, "驳回", "fail")
                                          }
                                          type="error"
                                          loading={moderateLoading}
                                          auto
                                      >
                                          驳回
                                      </Button>
                                  </div>
                              ),
                          }))}
                      >
                          <Table.Column prop="ApplicantID" label="申请人ID" />
                          <Table.Column prop="CreatedAt" label="申请时间" />
                          <Table.Column prop="ResourceID" label="资源ID" />
                          <Table.Column prop="action" label="操作" />
                      </Table>
                  )}
              </section>
          </div>
      </div>
  );
}
