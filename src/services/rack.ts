import { PassThrough, pipeline } from "stream";

import Processor from "./processor";

/**
 * Class that organizes working with CSV streams through processors
 * 
 * Each processor transofrms CSV data and passes it to next processor
 * @category Service
 */
export default class Rack {
  protected processors;
  constructor(...processors: Processor[]) {
    this.processors = processors;
  }

  /** 
   * Get processor by class name 
   * @param {string} className - name of processor class
   * @return {Processor} - instance of processor class
   */
  public getProcessor(className: string): Processor {
    const processorsNames: string[] = this.processors.map(processor => processor.constructor.name);
    const index: number = processorsNames.indexOf(className);
    if (index === -1) {
      throw new Error("Incorrect class name passed to setOption");
    }
    return this.processors[index];
  }

  /** 
   * Set options to processor by its class name
   * @param {string} className - name of processor class
   * @param {object} options - options for processor
   */
  public setOptions(className: string, options: object) {
    this.getProcessor(className).setOptions(options);
  }

  /** 
   * Process stream through pipeline and executes each processor logic
   * @param {NodeJS.ReadableStream} inStream 
   * @param {NodeJS.WritableStream} outStream 
   * @return {any} 
   */
  public process(inStream: NodeJS.ReadableStream, outStream: NodeJS.WritableStream): Promise<void> {
    const puller = new PassThrough({ objectMode: true });
    const promise: Promise<void> = new Promise((resolve, reject) => {
      pipeline([inStream, ...this.processors, puller, outStream], (e: any) => {
        if (e) {
          reject((e instanceof Error) ? e : new Error(e.message));
        } else {
          resolve();
        }
      });
    });
    return promise;
  }
}

