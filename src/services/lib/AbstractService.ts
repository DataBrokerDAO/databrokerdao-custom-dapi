export abstract class AbstractService {
  public static init(
    ...args: unknown[]
  ): Promise<AbstractService> | AbstractService {
    return this;
  }
}
