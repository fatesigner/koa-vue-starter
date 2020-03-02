/**
 * decorators
 */

import { MethodDecoratorType, ParameterDecoratorType } from './signature';

// 存放路由信息
export const GlobalRoutes: {
  targets: {
    target: any;
    path: string;
  }[];
  methods: {
    target: any;
    type: 'get' | 'post';
    name: string;
    path: string;
    ctrl: any;
  }[];
  params: {
    target: any;
    name: string;
    key: string;
    index: number;
    pos: string;
  }[];
} = {
  targets: [],
  methods: [],
  params: []
};

export const routerList = [];
export const controllerList = [];
export const parseList = [];
export const paramList = [];

// 先注册 Class
export function Route(path = ''): ClassDecorator {
  return constrcutor => {
    GlobalRoutes.targets.push({
      target: constrcutor,
      path
    });
  };
}

// 注册 method
export function Method(type) {
  return (path = ''): MethodDecorator => (target: any, name: string, descriptor: any) => {
    GlobalRoutes.methods.push({
      target,
      type,
      name,
      path,
      ctrl: descriptor.value
    });
  };
}

// 注册 param
export function Param(pos: string) {
  return (key?: string): ParameterDecorator => (target: any, propertyKey: string, parameterIndex: number) => {
    GlobalRoutes.params.push({
      target,
      name: propertyKey,
      key,
      index: parameterIndex,
      pos
    });
  };
}

// 注册 ctx
export const Ctx: ParameterDecorator = (target: any, propertyKey: string, parameterIndex: number) => {
  GlobalRoutes.params.push({
    target,
    name: propertyKey,
    key: '',
    index: parameterIndex,
    pos: 'ctx'
  });
};

export const Get = Method('get');
export const Post = Method('post');
export const FromQuery = Param('query');
export const FromBody = Param('body');
