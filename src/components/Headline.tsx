import { Breadcrumbs, Text } from '@geist-ui/core';
import type { ReactNode } from 'react';

export default function Headline({ children, title }: { children?: ReactNode; title?: string }) {
  return (
    <section className="bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start justify-between py-10">
          <div className="flex space-x-8">
            <div className="flex items-center space-x-3">
              {title && (
                <Text h2 className="leading-10">
                  {title}
                </Text>
              )}
            </div>
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
