import { Button, Card, Code, Input, Loading, Table, Text } from '@geist-ui/core';
import { SearchIcon } from '@heroicons/react/outline';
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
          <div className="flex space-x-4">
            <Input
              width="100%"
              className="bg-white"
              scale={1.25}
              icon={<SearchIcon />}
              placeholder="搜索..."
            />
            <Button type="secondary">新建应用审批</Button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {loading ? (
              <Loading />
            ) : (
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
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
