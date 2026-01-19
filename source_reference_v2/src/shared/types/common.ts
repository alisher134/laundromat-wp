import { FC, SVGProps } from 'react';

export interface SelectOption<T> {
  label: string;
  value: T;
}

export type IconComponent = FC<SVGProps<SVGSVGElement>>;
