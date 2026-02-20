declare global {
  interface Number {
    add: (num: number) => number;
    sub: (num: number) => number;
    mul: (num: number) => number;
    div: (num: number) => number;
    mod: (num: number) => number;

    isInteger: () => boolean;
    isFloat: () => boolean;
  }

  interface String {
    getBytes: () => number;
    getStringFromByteLength: (bytes: number) => string;
  }
}

Number.prototype.add = function (num: number): number {
  return (this.valueOf() * 1000 + num * 1000) / 1000;
};

Number.prototype.sub = function (num: number): number {
  return (this.valueOf() * 1000 - num * 1000) / 1000;
};

Number.prototype.mul = function (num: number): number {
  return (this.valueOf() * 1000 * num * 1000) / 1000000;
};

Number.prototype.div = function (num: number): number {
  if (this.valueOf() === 0 || num === 0) {
    return 0;
  }

  return (this.valueOf() * 1000) / (num * 1000);
};

Number.prototype.mod = function (num: number): number {
  if (this.valueOf() === 0 || num === 0) {
    return 0;
  }

  return ((this.valueOf() * 1000) % (num * 1000)) / 1000;
};

Number.prototype.isInteger = function (): boolean {
  return this.valueOf() % 1 === 0;
};

Number.prototype.isFloat = function (): boolean {
  return this.valueOf() % 1 !== 0;
};

String.prototype.getBytes = function () {
  const contents = this;
  let str_character;
  let int_char_count = 0;
  let int_contents_length = contents.length;

  for (let k = 0; k < int_contents_length; k++) {
    str_character = contents.charAt(k);
    if (escape(str_character).length > 4) int_char_count += 2;
    else int_char_count++;
  }

  return int_char_count;
};

String.prototype.getStringFromByteLength = function (length) {
  const contents = this;
  let str_character;
  let int_char_count = 0;
  let int_contents_length = contents.length;

  let returnValue = "";

  for (let k = 0; k < int_contents_length; k++) {
    str_character = contents.charAt(k);
    if (escape(str_character).length > 4) int_char_count += 2;
    else int_char_count++;

    if (int_char_count > length) {
      break;
    }
    returnValue += str_character;
  }
  return returnValue;
};

export {};
