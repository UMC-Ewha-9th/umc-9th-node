export class CustomError extends Error {
    constructor(errorCode, reason, data = null) {
      super(reason);  // 부모 Error 클래스의 message 필드 설정
      this.name = "CustomError"; 
      this.errorCode = errorCode;
      this.reason = reason;
      this.data = data;
    }
  }
  