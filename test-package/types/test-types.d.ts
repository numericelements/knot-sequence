// This file resolves conflicts between Jest and Mocha type definitions
declare namespace NodeJS {
    interface Global {
      // Use Jest's types for these globals
      beforeEach: jest.Lifecycle;
      afterEach: jest.Lifecycle;
      describe: jest.Describe;
      xdescribe: jest.Describe;
      it: jest.It;
      test: jest.It;
      xit: jest.It;
    }
  }