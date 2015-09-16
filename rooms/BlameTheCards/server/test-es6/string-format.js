var expect    = require("chai").expect;
var stringFormat = require("../btc/lib/string-format");

describe("stringFormat Gizmo", function() {
	
  var expectedResult = "Hello world";
  
  describe("Basic substitution Tests", function() {
    it("One Parameter", function() {
		var str = "Hello {0}";
		var result = stringFormat(str, "world");
		expect(result).to.equal(expectedResult);		
    });
	

    it("One element array", function() {
		var str = "Hello {0}";
		var result = stringFormat(str, ["world"]);
		expect(result).to.equal(expectedResult);		
    });

    it("Two parameters", function() {
		var str = "{0} {1}";
		var result = stringFormat(str, "Hello", "world");
		expect(result).to.equal(expectedResult);		
    });

    it("Two element array", function() {
		var str = "{0} {1}";
		var result = stringFormat(str, ["Hello", "world"]);
		expect(result).to.equal(expectedResult);		
    });
			
    it("Three element array (one extra)", function() {
		var str = "{0} {1}";
		var result = stringFormat(str, ["Hello", "world", "extra!"]);
		expect(result).to.equal(expectedResult);		
    });
	
  });

  describe("Brace substitution Tests", function() {
    it("Double Braces in source", function() {
		var str = "Hello {{0}}";
		var result = stringFormat(str, "world");		
		expect(result).to.equal("Hello {0}");
    });

    it("Double Braces in replacement", function() {
		var str = "{0} {1} {2}";
		var result = stringFormat(str, "a", "{0}", "b");
		expect(result).to.equal("a {0} b");
    });
	
		
    it("One Key/Value substitution", function() {
		var str = "Hello {key}";
		var result = stringFormat(str, {
			"key": "world"
		});
		expect(result).to.equal(expectedResult);
    });

    it("Two Key/Value substitution", function() {
		var str = "{key2} {key}";

		var result = 		result = stringFormat(str, {
			"key": "world",
			"key2": "Hello"
		});

		expect(result).to.equal(expectedResult);
    });
	
  });
    
});

