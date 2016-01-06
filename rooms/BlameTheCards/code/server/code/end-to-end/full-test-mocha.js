var assert = require('assert'),
    test = require('selenium-webdriver/testing'),
    webdriver = require('selenium-webdriver');

test.describe('Google Search', function() {
    this.timeout(20000)

    test.it('should work', function() {
        var driver = new webdriver.Builder()
        .withCapabilities(webdriver.Capabilities.firefox())
		.build();
		

        driver.get('http://www.google.com');		
        var searchBox = driver.findElement(webdriver.By.name('q'));
        searchBox.sendKeys('simple programmer');

        searchBox.getAttribute('value').then(function(value) {
            assert.equal(value, 'simple programmer');
        });

        driver.quit();
    });
});

