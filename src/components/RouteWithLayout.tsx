import React from "react";
import type { ComponentType, ReactNode } from "react";
import { Route } from "wouter";

type LayoutProps = {
  children: ReactNode;
};

type RouteWithLayoutProps = {
  path: string;
  layout: ComponentType<LayoutProps>;
  component: ComponentType;
};

const RouteWithLayout: React.FC<RouteWithLayoutProps> = ({
  path,
  layout: Layout,
  component: Component,
}) => {
  return (
    <Route path={path}>
      <Layout>
        <Component />
      </Layout>
    </Route>
  );
};

export default RouteWithLayout;
