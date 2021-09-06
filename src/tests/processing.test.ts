import fs from "fs";
import { expect } from 'chai';
import sinon, { SinonSandbox } from 'sinon';
import { Writable } from "stream";

import {
  Filter,
  Reader,
  Writer
} from "../services/processors";
import Rack from "../services/rack";

describe("File processing tests", () => {
  let sandbox: SinonSandbox;
  let rack: Rack;
  let reader: Reader, filter: Filter, writer: Writer;
  let resultedFile: string;
  let writableStrem: Writable;

  before(() => {
    sandbox = sinon.createSandbox();
  });

  beforeEach(() => {
    resultedFile = "";
    writableStrem = new Writable({
      write(chunk, _encoding, done) {
        resultedFile += chunk.toString();
        done();
      }
    });
    reader = new Reader();
    filter = new Filter({ splitKey: " - ", filterKey: "error" });
    writer = new Writer({ splitKey: " - "});
    rack = new Rack(reader, filter, writer);
  });

  afterEach(() => {
    resultedFile = "";
  });

  describe("Rack service tests", () => {
    it("should sucessful process file through processors", async () => {
      const inputFile = fs.createReadStream("./fixtures/app.log");
      const expectedFile = fs.readFileSync("./fixtures/errors.json", "utf-8");
      const promise = rack.process(inputFile, writableStrem);
      await Promise.all([promise]);
      expect(resultedFile).to.be.deep.equal(expectedFile);
    });

    it("should throw error during processing file", async () => {
      let errorMessage;
      const inputFile = fs.createReadStream("./fixtures/app.log");
      sandbox.stub(reader, 'filterData').throws(new Error("Mock error"));
      try {
        const promise = rack.process(inputFile, writableStrem);
        await Promise.all([promise]);
      } catch (err) {
        errorMessage = (err as Error).message;
      }
      expect(errorMessage).to.equal("Mock error");
    });

    it("should pass new options to Processor", async () => {
      const inputFile = fs.createReadStream("./fixtures/app.log");
      const expectedFile = fs.readFileSync("./fixtures/filter.json", "utf-8");
      rack.setOptions("Filter", { filterKey: "info", splitKey: " - " });
      const promise = rack.process(inputFile, writableStrem);
      await Promise.all([promise]);
      expect(resultedFile).to.be.deep.equal(expectedFile);
    });
  });

  describe("Reader processor tests", () => {
    it("should success with low highWatermark", async () => {
      const inputFile = fs.createReadStream("./fixtures/app.log", { highWaterMark: 3 });
      const expectedFile = fs.readFileSync("./fixtures/errors.json", "utf-8");
      const promise = rack.process(inputFile, writableStrem);
      await Promise.all([promise]);
      expect(resultedFile).to.be.deep.equal(expectedFile);
    });

    it("should success with middle highWatermark", async () => {
      const inputFile = fs.createReadStream("./fixtures/app.log", { highWaterMark: 3000 });
      const expectedFile = fs.readFileSync("./fixtures/errors.json", "utf-8");
      const promise = rack.process(inputFile, writableStrem);
      await Promise.all([promise]);
      expect(resultedFile).to.be.deep.equal(expectedFile);
    });

    it("should success with high highWatermark", async () => {
      const inputFile = fs.createReadStream("./fixtures/app.log", { highWaterMark: 60000 });
      const expectedFile = fs.readFileSync("./fixtures/errors.json", "utf-8");
      const promise = rack.process(inputFile, writableStrem);
      await Promise.all([promise]);
      expect(resultedFile).to.be.deep.equal(expectedFile);
    });
  });

});