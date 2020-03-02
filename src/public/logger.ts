/**
 *
 */

export function Consolelog(message: string, name = '') {
  const data = new Date();
  console.log('__________________________________________');
  console.log(`[LOG]${data.getHours()}:${data.getMinutes()}:${data.getSeconds()}：${name} ${message}`);
  console.log('__________________________________________');
}
