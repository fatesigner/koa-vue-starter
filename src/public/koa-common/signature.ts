/**
 * signature
 */

export type MethodDecoratorType<T> = (
  target: Record<string, any>,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<T>
) => TypedPropertyDescriptor<T> | void;

export type ParameterDecoratorType = (target: any, propertyKey: string | symbol, parameterIndex: number) => void;
