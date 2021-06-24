export type Computation<Data, Err> = {
  readonly then: <MappedData, NewErr>(
    f: (result: Data) => Computation<MappedData, NewErr>
  ) => Computation<MappedData, Err | NewErr>;

  readonly map: <MappedData>(
    f: (result: Data) => Exclude<MappedData, ComputationLike>
  ) => Computation<MappedData, Err>;

  readonly catch: <ResolvedErr>(
    f: (error: Err) => Exclude<ResolvedErr, ComputationLike>
  ) => Computation<Data | ResolvedErr, never>;

  readonly mapErr: <MappedErr>(
    f: (error: Err) => Exclude<MappedErr, ComputationLike>
  ) => Computation<Data, MappedErr>;
};

export type ComputationLike = {
  readonly then: any;
};
