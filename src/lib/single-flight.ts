/** Share concurrent work only; settled results/errors are never cached. */
export function singleFlight<T>(work: () => Promise<T>) {
  let pending: Promise<T> | undefined;
  return (): Promise<T> => {
    if (pending) return pending;
    const request = Promise.resolve().then(work);
    pending = request;
    const clear = () => { if (pending === request) pending = undefined; };
    void request.then(clear, clear);
    return request;
  };
}
