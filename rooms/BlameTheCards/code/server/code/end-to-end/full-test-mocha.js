'use strict';
/* globals before: true, after: true  */

const assert = require('assert');
const test = require('selenium-webdriver/testing');
const webdriver = require('selenium-webdriver');

function waitForGameRunning(driver) {
    return new Promise((resolve, reject) => {
        void(reject);

        function t() {
            driver.findElements(webdriver.By.className('answer-card-text')).then((els) => {
                if (els.length === 1) {
                    resolve(true);
                    return;
                }
                setTimeout(t, 100);
            });
        }

        t();
    });

}




test.describe('BtC Main Room', function() {
    this.timeout(30 * 1000);
    let driver;

    before(function() {
        driver = new webdriver.Builder()
            .withCapabilities(webdriver.Capabilities.firefox())
            .build();
    });

    after(function() {
        driver.quit();
    });

    test.it('should work', function() {
        const url = 'http://127.0.0.1:4241/SoiWidgets/fakesoi.php?' +
            'roomsite=priv&vqxsq=Unused&vqxha=btcautomatictest&' +
            'vqxti=14520921&vqxus=btcautomatictest%40priv&vqxro=BlameTheCards&on_auto=off';

        //let gameRunning = false;
        driver.get(url);

        driver.wait(function() {
            return waitForGameRunning(driver).then((data) => {
				return true;
			});
        });

		const card = driver.findElement(webdriver.By.className('answer-card-text'));
		assert.notEqual(card, undefined);

        //driver.wait(driver.until.elementLocated(By.name('username')), 10 * 1000).then(function(elm) {
        //	elm.sendKeys(username);
        //});

        //let searchBox = driver.findElement(webdriver.By.name('q'));
        //searchBox.sendKeys('simple programmer');

        //searchBox.getAttribute('value').then(function(value) {
        //assert.equal(value, 'simple programmer');
        //});
    });
});
