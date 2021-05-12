const puppeteer = require('puppeteer');
const utils = require('../../test-utils');
const init = require('../../test-init');

require('should');
let browser, page;
// user credentials
const email = utils.generateRandomBusinessEmail();
const name = utils.generateRandomString();
const password = '1234567890';
const user = {
    email,
    password,
};
// smtp credential
const smtpData = { ...utils.smtpCredential };

describe('Custom SMTP Settings', () => {
    const operationTimeOut = 500000;

    beforeAll(async done => {
        jest.setTimeout(3600000);

        browser = await puppeteer.launch(utils.puppeteerLaunchConfig);
        page = await browser.newPage();
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
        );
        // user
        await init.registerUser(user, page);

        done();
    });

    afterAll(async done => {
        await browser.close();
        done();
    });

    test(
        'should create a custom smtp settings',
        async done => {
            await page.goto(utils.DASHBOARD_URL);
            await page.waitForSelector('#projectSettings', {
                visible: true,
            });
            await page.click('#projectSettings');
            await page.waitForSelector('#more', { visible: true });
            await page.click('#more');
            await page.waitForSelector('#email', { visible: true });
            await page.click('#email');
            await page.waitForSelector('#showsmtpForm', { visible: true });
            await page.click('#showsmtpForm');
            await page.waitForSelector('#user', { visible: true });
            await page.click('#user');
            await page.type('#user', smtpData.user);
            await page.click('#pass');
            await page.type('#pass', smtpData.pass);
            await page.click('#host');
            await page.type('#host', smtpData.host);
            await page.click('#port');
            await page.type('#port', smtpData.port);
            await page.click('#from');
            await page.type('#from', smtpData.from);
            await page.click('#name');
            await page.type('#name', name);
            await page.$eval('#secure', elem => (elem.checked = true));
            await page.click('#saveSmtp');
            await page.waitForTimeout(2000);
            await page.waitForSelector('.ball-beat', { hidden: true });
            await page.reload();
            await page.waitForSelector('#host', { visible: true });
            const host = await page.$eval('#host', elem => elem.value);
            expect(host).toEqual(smtpData.host);

            done();
        },
        operationTimeOut
    );

    test(
        'should update a custom smtp settings',
        async done => {
            await page.goto(utils.DASHBOARD_URL);
            await page.waitForSelector('#projectSettings', {
                visible: true,
            });
            await page.click('#projectSettings');
            await page.waitForSelector('#more', { visible: true });
            await page.click('#more');
            await page.waitForSelector('#email', { visible: true });
            await page.click('#email');
            const from = 'test@fyipe.com';
            await page.waitForSelector('#from', { visible: true });
            await page.click('#from', { clickCount: 3 });
            await page.type('#from', from);
            await page.click('#saveSmtp');
            await page.waitForSelector('.ball-beat', { visible: true });
            await page.waitForSelector('.ball-beat', { hidden: true });
            await page.reload();
            await page.waitForSelector('#from', { visible: true });
            const fromVal = await page.$eval('#from', elem => elem.value);
            expect(fromVal).toEqual(from);

            done();
        },
        operationTimeOut
    );

    test(
        'should not save a custom smtp settings if one of the input fields is missing',
        async done => {
            await page.goto(utils.DASHBOARD_URL);
            await page.waitForSelector('#projectSettings', {
                visible: true,
            });
            await page.click('#projectSettings');
            await page.waitForSelector('#more', { visible: true });
            await page.click('#more');
            await page.waitForSelector('#email', { visible: true });
            await page.click('#email');
            await page.waitForSelector('#port', { visible: true });
            const port = await page.$('#port');
            await port.click({ clickCount: 3 });
            await port.press('Backspace'); // clear out the input field
            await page.click('#saveSmtp');
            await page.waitForSelector('#field-error', {
                visible: true,
            });
            const errorMessage = await page.$eval(
                '#field-error',
                element => element.textContent
            );
            expect(errorMessage).toEqual(
                'Please input port this cannot be left blank.'
            );

            done();
        },
        operationTimeOut
    );

    test(
        'should delete custom smtp settings',
        async done => {
            await page.goto(utils.DASHBOARD_URL);
            await page.waitForSelector('#projectSettings', {
                visible: true,
            });
            await page.click('#projectSettings');
            await page.waitForSelector('#more', { visible: true });
            await page.click('#more');
            await page.waitForSelector('#email', { visible: true });
            await page.click('#email');
            await page.waitForSelector('label[id=showsmtpForm]', {
                visible: true,
            });
            await page.waitForSelector('label[id=enableSecureTransport]', {
                visible: true,
            });
            await page.waitForSelector('#saveSmtp', { visible: true });
            await page.click('label[id=enableSecureTransport]');
            await page.click('label[id=showsmtpForm]');
            await page.click('#saveSmtp');
            await page.reload();
            const username = await page.$('#user');
            expect(username).toBe(null);

            done();
        },
        operationTimeOut
    );

    test(
        'should not display any error message if custom smtp settings is already deleted and user clicks on save',
        async done => {
            await page.goto(utils.DASHBOARD_URL);
            await page.waitForSelector('#projectSettings', {
                visible: true,
            });
            await page.click('#projectSettings');
            await page.waitForSelector('#more', { visible: true });
            await page.click('#more');
            await page.waitForSelector('#email', { visible: true });
            await page.click('#email');
            await page.waitForSelector('#saveSmtp', { visible: true });
            await page.click('#saveSmtp');
            const error = await page.waitForSelector('#errorInfo', {
                hidden: true,
            });
            expect(error).toBeDefined();

            done();
        },
        operationTimeOut
    );
});