/* eslint-disable functional/no-class */
/* eslint-disable functional/no-this-expression */
import { Computation, ComputationLike } from "./computation";

export class Result<Data, Err> implements Computation<Data, Err> {
  public static resolved<Data, Err = never>(data: Data): Result<Data, Err> {
    return new Result({ ok: true, data });
  }

  public static rejected<Data = never, Err = unknown>(
    error: Err
  ): Result<Data, Err> {
    return new Result({ ok: false, error });
  }

  private constructor(
    public readonly status:
      | {
          readonly ok: true;
          readonly data: Data;
        }
      | {
          readonly ok: false;
          readonly error: Err;
        }
  ) {}

  public then<MappedData, NewErr>(
    f: (result: Data) => Computation<MappedData, NewErr>
  ): Computation<MappedData, Err | NewErr> {
    return this.status.ok
      ? f(this.status.data)
      : Result.rejected(this.status.error);
  }

  public map<MappedData>(
    f: (result: Data) => Exclude<MappedData, ComputationLike>
  ): Result<MappedData, Err> {
    return this.status.ok
      ? Result.resolved(f(this.status.data))
      : Result.rejected(this.status.error);
  }

  public catch<ResolvedErr>(
    f: (error: Err) => Exclude<ResolvedErr, ComputationLike>
  ): Result<Data | ResolvedErr, never> {
    return this.status.ok
      ? Result.resolved(this.status.data)
      : Result.resolved(f(this.status.error));
  }

  public mapErr<MappedErr>(
    f: (error: Err) => Exclude<MappedErr, ComputationLike>
  ): Result<Data, MappedErr> {
    return this.status.ok
      ? Result.resolved(this.status.data)
      : Result.rejected(f(this.status.error));
  }
}
