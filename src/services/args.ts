/**
 * Class that parse Command line arguments
 * 
 * @category Service
 */
export default class Args {
  private params: Record<string, string> = {};
  private arguments: string[] = [];

  /** 
   * Get arguments from process
   * @return {string[]} - array of passed arguments
   */
  public args(): string[] {
    this.arguments = process.argv.slice(2);
    if(this.isNPMArgs(this.arguments)) {
      this.arguments = this.arguments.slice(1);
    }
    return this.arguments;
  }

  /** 
   * Check wheter arguments comes from npm
   * @param {string[]} args - array of passed arguments
   * @return {boolean}
   */
  private isNPMArgs(args: string[]): boolean {
    if(args.includes("--")) {
      return true;
    }
    return false;
  }

  /** 
   * Get only keys
   * @return {string[]} - array of argument keys
   */
  public keys(): string[] {
    const kwargs = this.kwargs();
    return Object.keys(kwargs);
  }

  /** 
   * Get only values
   * @return {string[]} - array of argument values
   */
  public values(): string[] {
    const kwargs = this.kwargs();
    return Object.values(kwargs);
  }
 
  /** 
   * Key and values pairs of arguments
   * @return {Record<string, string>} - object with key value pairs
   */
  public kwargs(): Record<string, string> {
    const args = this.args();
    let lastKey;
    for (let index = 0; index < args.length; index++) {
      const arg = args[index];
      if(arg.indexOf("--") !== -1) {
        const key: string = arg.replace("--", "");
        this.params[key] = "";
        lastKey = key;
      } else if(lastKey) {
        this.params[lastKey] = arg;
      }
    }
    return this.params;
  }
}
