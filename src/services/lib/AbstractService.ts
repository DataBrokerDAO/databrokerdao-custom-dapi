export abstract class AbstractService {
  public static init(
    ...args: Array<unknown>
  ): Promise<AbstractService> | AbstractService {
    return this;
  }
}
