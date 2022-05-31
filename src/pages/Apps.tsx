import { Button, Card, Loading, Text } from '@geist-ui/core';
import { ArrowRightIcon } from '@heroicons/react/outline';
import { useRequest } from 'ahooks';
import axios from 'axios';
import * as dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNavigate } from 'react-router-dom';

dayjs.extend(relativeTime);

export default function Apps() {
  const { data, loading } = useRequest(() => axios.get<IApp[]>('/app/user'));
  const navigate = useNavigate();
  return (
    <div>
      <div className="border-b border-gray-200 bg-gray-50 py-10">
        <section className="max-w-5xl mx-auto space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {loading ? (
              <Loading />
            ) : data?.data?.length && data?.data?.length > 0 ? (
              data?.data.map((p) => (
                <Card
                  className="hover:cursor-pointer"
                  key={p.AppID}
                  onClick={() => navigate(`/apps/${p.AppID}`)}
                  shadow
                >
                  <Text h4>{p.Name}</Text>
                  <Text className="text-sm" p>
                    创建于 {dayjs(p.CreatedAt).fromNow()}
                  </Text>
                </Card>
              ))
            ) : (
              <>
                <div />
                <Card className="mx-auto">
                  <p className="text-center">当前暂无应用，请去资源页面申请</p>
                  <p className="text-center">
                    <Button
                      type="success"
                      onClick={() => navigate('/resources')}
                      scale={0.75}
                      auto
                      iconRight={<ArrowRightIcon />}
                    >
                      资源页面
                    </Button>
                  </p>
                </Card>
                <div />
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
