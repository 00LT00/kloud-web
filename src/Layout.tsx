import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Button, Popover, User } from '@geist-ui/core';
import useUser from './models/useUser';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

function HeaderNavLink({ children, to }: { children: ReactNode; to: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? 'min-w-16 text-center text-black border-b-2 border-black px-0.5 py-3'
          : 'min-w-16 text-center border-b-2 border-transparent px-0.5 py-3 text-gray-500 hover:text-black transition ease-in-out duration-150'
      }
    >
      {children}
    </NavLink>
  );
}

export default function Layout() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  return (
    <div>
      <div className="bg-white">
        <header className="border-b border-gray-200 space-y-2">
          <nav className="max-w-5xl px-6 mx-auto pt-4 flex items-center justify-between">
            <div
              onClick={() => navigate('/')}
              className="flex items-center space-x-3 hover:cursor-pointer"
            >
              <span className="text-base leading-5 font-medium">kcloud</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <Button scale={0.8} auto>
                  问题反馈
                </Button>
                {user ? (
                  <>
                    <Popover
                      className="hover:cursor-pointer"
                      content={
                        <div className="min-w-20 px-4">
                          <button
                            onClick={logout}
                            className="inline-block text-sm leading-5 text-gray-500 hover:text-black transition ease-in-out duration-150"
                          >
                            退出登录
                          </button>
                        </div>
                      }
                    >
                      <User src="https://unix.bio/assets/avatar.png" name={user.username}>
                        {{ user: '普通用户', admin: '管理员', root: '根账户' }[user.role]}
                      </User>
                    </Popover>
                  </>
                ) : (
                  <Button scale={0.8} onClick={() => navigate('/login')} type="secondary" auto>
                    登录 & 注册
                  </Button>
                )}
              </div>
            </div>
          </nav>
          <div className="max-w-5xl mx-auto px-6">
            <nav className="flex space-x-5 text-sm leading-5">
              <HeaderNavLink to="/apps">应用</HeaderNavLink>
              <HeaderNavLink to="/resources">资源</HeaderNavLink>
              <HeaderNavLink to="/workflows">审批</HeaderNavLink>
              <HeaderNavLink to="/settings">设置</HeaderNavLink>
            </nav>
          </div>
        </header>
      </div>
      <Outlet />
      <div>
        <div className="max-w-5xl px-6 pt-9 pb-8 mx-auto ">
          <div>
            <footer aria-labelledby="footerHeading">
              <div className="py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm leading-5 text-gray-500">
                      Copyright © 2022 杭州电子科技大学 计算机学院（软件学院） 王紫麟 毕业设计{' '}
                    </p>
                  </div>
                  <div className="inline-flex space-x-4" />
                  <div>
                    <button
                      type="button"
                      className="border border-gray-200 rounded px-3 py-1.5 text-sm leading-5 text-black hover:border-black transition ease-in-out duration-150"
                    >
                      <div className="inline-flex items-center">
                        <span>系统状态：</span>
                        <div className="relative inline-block h-3 w-3 mx-2 rounded-full bg-blue-500 z-2" />
                        <span className="text-blue-600 font-medium">运行正常</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
