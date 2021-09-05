export default class Args {
  private params: {[key:string]: any} = {};
  private arguments: string[] = [];

  public args() {
    this.arguments = process.argv.slice(2);
    if(this.isNPMArgs(this.arguments)) {
      this.arguments = this.arguments.slice(1);
    }
    return this.arguments;
  }

  private isNPMArgs(args: string[]): boolean {
    if(args.includes("--")) {
      return true;
    }
    return false;
  }

  public keys() {
    const kwargs = this.kwargs();
    return Object.keys(kwargs);
  }

  public values() {
    const kwargs = this.kwargs();
    return Object.values(kwargs);
  }
 
  public kwargs() {
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
