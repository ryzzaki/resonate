export default (func: (...params: any[]) => any, delay: number) => {
  let timer: any | undefined = undefined;
  return function (this: any, ...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
};
