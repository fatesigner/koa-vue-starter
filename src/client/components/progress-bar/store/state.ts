/**
 * state
 */

export interface StateType {
  percent: number;
  show: boolean;
  canSuccess: boolean;
  duration: number;
  height: string;
  color: string;
  failedColor: string;
}

export const State: StateType = {
  percent: 0,
  show: false,
  canSuccess: true,
  duration: 3000,
  height: '2px',
  color: '#ffca2b',
  failedColor: '#ff0000'
};
