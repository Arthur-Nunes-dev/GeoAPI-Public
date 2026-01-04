export class ErrorValidation extends Error {
  code: number;
  constructor (message: string) {
    super(message);
    this.code = 400;
  };

  name = "ErrorValidation";
};

export class ErrorNotFound extends Error {
  code: number;
  constructor (message: string) {
    super(message);
    this.code = 404;
  };

  name = "ErrorNotFound";
};

export class ErrorDataBase extends Error {
  code: number;
  constructor (message: string) {
    super(message);
    this.code = 500;
  };
  
  name = "ErrorDataBase";
};

export class ErrorServer extends Error {
  code: number;
  constructor (message: string) {
    super(message);
    this.code = 500;
  };
  
  name = "ErrorServer";
};