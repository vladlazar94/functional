/* eslint-disable functional/no-this-expression */
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-class */
import { Computation, ComputationLike } from "./computation";

export class Async<Data, Err> implements Computation<Data, Err> {
  public static resolved<Data>(data: Data): Async<Data, never> {
    return Async.fromPromise(Promise.resolve(data)) as Async<Data, never>;
  }

  public static rejected<Err>(error: Err): Async<never, Err> {
    return Async.fromPromise(Promise.reject(error)) as Async<never, Err>;
  }

  public static fromPromise<Result>(
    promise: Promise<Result>
  ): Async<Result, unknown> {
    return new Async(promise);
  }

  public static execute<Data, Err>(
    executor: (
      onSuccess: (data: Data) => void,
      onFailure: (error: Err) => void
    ) => void
  ): Async<Data, Err> {
    return Async.fromPromise(new Promise(executor)) as Async<Data, Err>;
  }

  private constructor(private readonly promise: Promise<Data>) {}

  public then<MappedData, NewErr>(
    f: (result: Data) => Computation<MappedData, NewErr>
  ): Async<MappedData, Err | NewErr> {
    return Async.fromPromise(this.promise.then(f)) as Async<
      MappedData,
      Err | NewErr
    >;
  }

  public map<MappedData>(
    f: (result: Data) => Exclude<MappedData, ComputationLike>
  ): Async<MappedData, Err> {
    return Async.fromPromise(this.promise.then(f)) as Async<MappedData, Err>;
  }

  public catch<ResolvedErr>(
    f: (error: Err) => Exclude<ResolvedErr, ComputationLike>
  ): Async<Data | ResolvedErr, never> {
    return Async.fromPromise(this.promise.catch(f)) as unknown as Async<
      ResolvedErr,
      never
    >;
  }

  public mapErr<MappedErr>(
    f: (error: Err) => Exclude<MappedErr, ComputationLike>
  ): Async<Data, MappedErr> {
    return Async.fromPromise(
      this.promise.catch((err) => Promise.reject(f(err as Err)))
    ) as Async<Data, MappedErr>;
  }
}
