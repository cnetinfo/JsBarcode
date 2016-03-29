var assert = require('assert');
var JsBarcode = require('../../JsBarcode.js');
var Canvas = require("canvas");

describe('Encoders', function() {
  it('should be able to include all encoders', function () {
    CODE39 = JsBarcode.getModule("CODE39");
    CODE128 = JsBarcode.getModule("CODE128");
    CODE128A = JsBarcode.getModule("CODE128A");
    CODE128B = JsBarcode.getModule("CODE128B");
    CODE128C = JsBarcode.getModule("CODE128C");
    EAN = JsBarcode.getModule("EAN");
    UPC = JsBarcode.getModule("UPC");
    EAN8 = JsBarcode.getModule("EAN8");
    EAN5 = JsBarcode.getModule("EAN5");
    EAN2 = JsBarcode.getModule("EAN2");
    ITF14 = JsBarcode.getModule("ITF14");
    ITF = JsBarcode.getModule("ITF");
    MSI = JsBarcode.getModule("MSI");
    MSI10 = JsBarcode.getModule("MSI10");
    MSI11 = JsBarcode.getModule("MSI11");
    MSI1010 = JsBarcode.getModule("MSI1010");
    MSI1110 = JsBarcode.getModule("MSI1110");
    Pharmacode = JsBarcode.getModule("pharmacode");
    GENERIC = JsBarcode.getModule("generic");
  });
});

describe('node-canvas generation', function() {
  it('should generate normal canvas', function () {
    var canvas = new Canvas();
    JsBarcode(canvas, "Hello");
  });

  it('checking width', function () {
    var canvas1 = new Canvas();
    var canvas2 = new Canvas();

    JsBarcode(canvas1, "Hello", {format: "CODE128"});
    JsBarcode(canvas2, "Hello", {format: "CODE39"});

    assert.notEqual(canvas1.width, canvas2.width);
  });

  it('should throws errors when suppose to', function () {
    var canvas = new Canvas();
    assert.throws(function(){JsBarcode(canvas, "Hello", {format: "EAN8"});});
    assert.throws(function(){JsBarcode(canvas, "Hello", {format: "DOESNOTEXIST"});}, /Module DOESNOTEXIST does not exist/i);
    assert.throws(function(){JsBarcode("Hello", "Hello", {format: "DOESNOTEXIST"});});
    assert.throws(function(){JsBarcode(123, "Hello", {format: "DOESNOTEXIST"});});
  });

  it('should use the valid callback correct', function (done) {
    var canvas = new Canvas();

    JsBarcode(canvas, "Hello", {
      format: "CODE128",
      valid: function(valid){
        if(valid){
          done();
        }
      }
    });
  });

  it('should use false valid callback correct', function (done) {
    var canvas = new Canvas();

    JsBarcode(canvas, "Hello", {
      format: "pharmacode",
      valid: function(valid){
        if(!valid){
          done();
        }
      }
    });
  });

  it('should create output with same input', function () {
    var canvas1 = new Canvas();
    var canvas2 = new Canvas();

    JsBarcode(canvas1, "Hello", {format: "CODE128"});
    JsBarcode(canvas2, "Hello", {format: "CODE128"});

    assert.equal(canvas1.toDataURL(), canvas2.toDataURL());
  });

  it('should set background', function () {
    var canvas = new Canvas();
    var ctx = canvas.getContext("2d");
    JsBarcode(canvas, "Hello", {format: "CODE128", background: "#f00"});

    var topLeft = ctx.getImageData(0,0,1,1);
    assert.equal(topLeft.data[0], 255);
    assert.equal(topLeft.data[1], 0);
    assert.equal(topLeft.data[2], 0);
  });

  it('should automatically select barcodes', function () {
    var canvas1 = new Canvas();
    var canvas2 = new Canvas();
    var ctx1 = canvas1.getContext("2d");
    var ctx2 = canvas2.getContext("2d");

    JsBarcode(canvas1, "5901234123457", {format: "EAN"});
    JsBarcode(canvas2, "5901234123457");

    assert.equal(canvas1.toDataURL(), canvas2.toDataURL());

    var canvas1 = new Canvas();
    var canvas2 = new Canvas();
    var ctx1 = canvas1.getContext("2d");
    var ctx2 = canvas2.getContext("2d");

    JsBarcode(canvas1, "HELL0", {format: "CODE39"});
    JsBarcode(canvas2, "HELL0");

    assert.equal(canvas1.toDataURL(), canvas2.toDataURL());
  });
});

describe('Text printing', function() {
  it('should produce different output when displaying value', function () {
    var canvas1 = new Canvas();
    var canvas2 = new Canvas();

    JsBarcode(canvas1, "Hello", {format: "CODE128", displayValue: false});
    JsBarcode(canvas2, "Hello", {format: "CODE128"});

    assert.notEqual(canvas1.toDataURL(), canvas2.toDataURL());
  });

  it('should produce different output when having different textAlign', function () {
    var canvas1 = new Canvas();
    var canvas2 = new Canvas();
    var canvas3 = new Canvas();

    JsBarcode(canvas1, "Hello", {format: "CODE128", displayValue: true, textAlign: "center"});
    JsBarcode(canvas2, "Hello", {format: "CODE128", displayValue: true, textAlign: "left"});
    JsBarcode(canvas3, "Hello", {format: "CODE128", displayValue: true, textAlign: "right"});

    assert.notEqual(canvas1.toDataURL(), canvas2.toDataURL());
    assert.notEqual(canvas2.toDataURL(), canvas3.toDataURL());
    assert.notEqual(canvas1.toDataURL(), canvas3.toDataURL());
  });
});

describe('CODE39', function() {
  it('should be able to encode normal text', function () {
    var enc = new CODE39("AB12");
    assert.equal(enc.encoded(), "100010111011101011101010001011101011101000101110111010001010111010111000101011101000101110111010");
  });

  it('should warn with invalid text', function () {
    var enc = new CODE39("AB!12");
    assert.equal(false, enc.valid());
  });

  it('should make lowercase to uppercase', function () {
    var enc = new CODE39("abc123ABC");
    assert.equal("ABC123ABC", enc.getText());
  });
});

describe('CODE128', function() {
  it('should encode CODE128A', function () {
    var enc = new CODE128A("ABC" + String.fromCharCode(25));
    assert.equal("1101000010010100011000100010110001000100011011011011110100011101101100011101011", enc.encoded());
  });

  it('should encode CODE128B', function () {
    var enc = new CODE128B("a@B=1");
    assert.equal(enc.encoded(), "110100100001001011000011000110110100010110001110011001010011100110110111001001100011101011");
  });

  it('should encode CODE128C', function () {
    var enc = new CODE128C("123456");
    assert.equal("11010011100101100111001000101100011100010110100011011101100011101011", enc.encoded());
  });

  it('should encode CODE128 (auto)', function () {
    var enc = new CODE128("12345Hejsan123456\tA");
    assert.equal("110100111001011001110010001011000101111011101101110010011000101000101100100001000011001010111100100100101100001100001010010111011110101100111001000101100011100010110111010111101000011010010100011000111011110101100011101011", enc.encoded());

    var enc = new CODE128("Hi\n12345");
    assert.equal("110100100001100010100010000110100111010111101000011001010011100110101110111101110110111010111011000111001100101100011101011", enc.encoded());

    var enc = new CODE128("HI\nHi");
    assert.equal("11010000100110001010001100010001010000110010110001010001011110111010000110100110110011001100011101011", enc.encoded());

    var enc = new CODE128("HI\n" + String.fromCharCode(201) + "Hi" + String.fromCharCode(202) + "123456" + String.fromCharCode(207));
    assert.equal("1101000010011000101000110001000101000011001010111100010110001010001011110111010000110100111101010001011101111010110011100100010110001110001011011110101110110011100101100011101011", enc.encoded());

    var enc = new CODE128(String.fromCharCode(207) + "42184020500");
    assert.equal("110100111001111010111010110111000110011100101100010100011001001110110001011101110101111010011101100101011110001100011101011", enc.encoded());

    var enc = new CODE128("Should\nshift");
    assert.equal("1101001000011011101000100110000101000111101010011110010110010100001000010011011110100010100001100101011110010010011000010100001101001011000010010011110100100011010001100011101011", enc.encoded());

    var enc = new CODE128("\tHi\nHI");
    assert.equal("1101000010010000110100110001010001111010001010000110100100001100101100010100011000100010111101101101100011101011", enc.encoded());


  });

  it('should warn with invalid text', function () {
    var enc = new CODE128("ABC" + String.fromCharCode(500));
    assert.equal(false, enc.valid());

    var enc = new CODE128A("Abc");
    assert.equal(false, enc.valid());

    var enc = new CODE128B("Abc\t123");
    assert.equal(false, enc.valid());

    var enc = new CODE128C("1234ab56");
    assert.equal(false, enc.valid());

    var enc = new CODE128C("12345");
    assert.equal(false, enc.valid());
  });

  it('should pass valid text', function () {
    var enc = new CODE128("ABC" + String.fromCharCode(207));
    assert.equal(true, enc.valid());

    var enc = new CODE128A("ABC\t\n123");
    assert.equal(true, enc.valid());

    var enc = new CODE128B("Abc123" + String.fromCharCode(202));
    assert.equal(true, enc.valid());

    var enc = new CODE128C("123456");
    assert.equal(true, enc.valid());
  });
});

describe('UPC', function() {
  it('should be able to encode normal text', function () {
    var enc = new UPC("123456789999");
    assert.equal(enc.encoded(), "10100110010010011011110101000110110001010111101010100010010010001110100111010011101001110100101");
  });

  it('should warn with invalid text', function () {
    var enc = new UPC("12345");
    assert.equal(false, enc.valid());
  });

  it('should auto include the checksum if missing', function () {
    var enc = new UPC("12345678999");
    assert.equal("123456789999", enc.getText());
  });
});

describe('EAN', function() {
  it('should be able to encode normal text', function () {
    var enc = new EAN("5901234123457");
    assert.equal(true, enc.valid());
    assert.equal(enc.encoded(), "10100010110100111011001100100110111101001110101010110011011011001000010101110010011101000100101");
  });

  it('should warn with invalid text', function () {
    var enc = new EAN("12345");
    assert.equal(false, enc.valid());

    var enc = new EAN("5901234123456  ");
    assert.equal(false, enc.valid());
  });

  it('should auto include the checksum if missing', function () {
    var enc = new EAN("590123412345");
    assert.equal("5901234123457", enc.getText());
  });
});

describe('EAN-8', function() {
  it('should be able to encode normal text', function () {
    var enc = new EAN8("96385074");
    assert.equal(true, enc.valid());
    assert.equal(enc.encoded(), "1010001011010111101111010110111010101001110111001010001001011100101");
  });

  it('should auto include the checksum if missing', function () {
    var enc = new EAN8("9638507");

    assert.equal(true, enc.valid());
    assert.equal("96385074", enc.getText());
    assert.equal(enc.encoded(), "1010001011010111101111010110111010101001110111001010001001011100101");
  });

  it('should warn with invalid text', function () {
    var enc = new EAN8("12345");
    assert.equal(false, enc.valid());

    var enc = new EAN8("96385073");
    assert.equal(false, enc.valid());
  });
});

describe('EAN-5', function() {
  it('should be able to encode normal text', function () {
    var enc = new EAN5("54495");
    assert.equal(true, enc.valid());
    assert.equal(enc.encoded(), "10110110001010100011010011101010001011010111001");

    var enc = new EAN5("12345");
    assert.equal(true, enc.valid());
    assert.equal(enc.encoded(), "10110110011010010011010100001010100011010110001");
  });

  it('should warn with invalid text', function () {
    var enc = new EAN5("1234");
    assert.equal(false, enc.valid());

    var enc = new EAN5("123a5");
    assert.equal(false, enc.valid());
  });
});

describe('EAN-2', function() {
  it('should be able to encode normal text', function () {
    var enc = new EAN2("53");
    assert.equal(true, enc.valid());
    assert.equal(enc.encoded(), "10110110001010100001");

    var enc = new EAN2("12");
    assert.equal(true, enc.valid());
    assert.equal(enc.encoded(), "10110011001010010011");
  });

  it('should warn with invalid text', function () {
    var enc = new EAN2("1");
    assert.equal(false, enc.valid());

    var enc = new EAN2("a2");
    assert.equal(false, enc.valid());
  });
});

describe('ITF-14', function() {
  it('should be able to encode normal text', function () {
    var enc = new ITF14("98765432109213");
    assert.equal(enc.encoded(), "101010001110101110001010100010001110111011101011100010100011101110001010100011101010001000111010111000101110100011100010001010111011101");
  });

  it('should be able to add checksum if needed', function () {
    var enc = new ITF14("9876543210921");
    assert.equal(enc.encoded(), "101010001110101110001010100010001110111011101011100010100011101110001010100011101010001000111010111000101110100011100010001010111011101");
  });

  it('should return getText correct', function () {
    var enc = new ITF14("9876543210921");
    assert.equal(enc.getText(), "9876543210921");
  });

  it('should warn with invalid text and not when valid', function () {
    var enc = new ITF14("987654321092");
    assert.equal(false, enc.valid());

    var enc = new ITF14("98765432109212");
    assert.equal(false, enc.valid());

    var enc = new ITF14("98765432109213");
    assert.equal(true, enc.valid());

    var enc = new ITF14("9876543210921");
    assert.equal(true, enc.valid());
  });
});

describe('ITF', function() {
  it('should be able to encode normal text', function () {
    var enc = new ITF("123456");
    assert.equal(enc.encoded(), "101011101000101011100011101110100010100011101000111000101011101");
  });

  it('should return getText correct', function () {
    var enc = new ITF("123456");
    assert.equal(enc.getText(), "123456");
  });

  it('should warn with invalid text', function () {
    var enc = new ITF("12345");
    assert.equal(false, enc.valid());

    var enc = new ITF("1234AB");
    assert.equal(false, enc.valid());
  });
});

describe('MSI', function() {
  it('should be able to encode normal text', function () {
    var enc = new MSI10("1234567");
    assert.equal(enc.valid(), true);
    assert.equal(enc.getText(), "12345674");
    assert.equal(enc.encoded(), "1101001001001101001001101001001001101101001101001001001101001101001101101001001101101101001101001001001");

    var enc = new MSI("12345674");
    assert.equal(enc.encoded(), "1101001001001101001001101001001001101101001101001001001101001101001101101001001101101101001101001001001");

    var enc = new MSI10("17345");
    assert.equal(enc.valid(), true);
    assert.equal(enc.getText(), "173450");

    var enc = new MSI10("1234");
    assert.equal(enc.valid(), true);
    assert.equal(enc.getText(), "12344");
  });

  it('should encode MSI11', function () {
    var enc = new MSI11("123456");
    assert.equal("1234560", enc.getText());

    var enc = new MSI11("12345678");
    assert.equal("123456785", enc.getText());

    var enc = new MSI11("1234567891011");
    assert.equal("12345678910115", enc.getText());

    var enc = new MSI11("1134567");
    assert.equal("11345670", enc.getText());
  });

  it('should encode MSI1010', function () {
    var enc = new MSI1010("1234567");
    assert.equal("123456741", enc.getText());

    var enc = new MSI1010("1337");
    assert.equal("133751", enc.getText());
  });

  it('should encode MSI1110', function () {
    var enc = new MSI1110("12345678");
    assert.equal("1234567855", enc.getText());

    var enc = new MSI1110("1337");
    assert.equal("133744", enc.getText());
  });

  it('should warn with invalid text', function () {
    var enc = new MSI("12345ABC");
    assert.equal(false, enc.valid());

    var enc = new MSI("12345AB675");
    assert.equal(false, enc.valid());
  });
});

describe('Pharmacode', function() {
  it('should be able to encode normal text', function () {
    var enc = new Pharmacode("1234");
    assert.equal(enc.encoded(), "10010011100111001001110010010011100111");

    var enc = new Pharmacode("4567");
    assert.equal(enc.encoded(), "10010010011100111001110010011100111001001001");

    var enc = new Pharmacode("12");
    assert.equal(enc.encoded(), "11100100111");
  });

  it('should return getText correct', function () {
    var enc = new Pharmacode("1234");
    assert.equal(enc.getText(), "1234");
  });

  it('should warn with invalid text', function () {
    var enc = new Pharmacode("12345678");
    assert.equal(false, enc.valid());
  });
});

describe('Generic barcode', function() {
  it('should not fail generic barcode', function () {
    var enc = new GENERIC("1234");
    assert.equal(enc.valid(), true);
    assert.equal(enc.getText(), "1234");
  });
});
