const puppeteer = require('puppeteer');
const utils = require('../../test-utils');
const init = require('../../test-init');


require('should');

// user credentials
const email = 'masteradmin@hackerbay.io';
const password = '1234567890';
const phoneNumber = '+19173976235';

describe('Twilio Settings API', () => {
    const operationTimeOut = init.timeout;

    

    beforeAll(async () => {
        jest.setTimeout(init.timeout);

        cluster = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_PAGE,
            puppeteerOptions: utils.puppeteerLaunchConfig,
            puppeteer,
            timeout: 120000,
        });

        cluster.on('taskerror', err => {
            throw err;
        });

        // Register user
        await cluster.execute({ email, password }, async ({ page, data }) => {
            const user = {
                email: data.email,
                password: data.password,
            };
            // user
            await init.registerEnterpriseUser(user, page, false);
        });
    });

    afterAll(async done => {
        await cluster.idle();
        await cluster.close();
        done();
    });

    test(
        'Should not submit empty fields',
        async done => {
            await cluster.execute(null, async ({ page }) => {
                await page.goto(utils.ADMIN_DASHBOARD_URL);
                await page.waitForSelector('#settings');
                await init.pageClick(page, '#settings a');

                await page.waitForSelector('#twilio');
                await init.pageClick(page, '#twilio a');
                await page.waitForSelector('#twilio-form');

                await init.pageClick(page, 'button[type=submit]');
                const error = await page.waitForSelector('.field-error', {
                    visible: true,
                });
                expect(error).toBeDefined();
            });
            done();
        },
        operationTimeOut
    );

    test(
        'Should show error message if an invalid account-sid is used.',
        async done => {
            await cluster.execute(null, async ({ page }) => {
                await page.goto(utils.ADMIN_DASHBOARD_URL);
                await page.waitForSelector('#settings');
                await init.pageClick(page, '#settings a');

                await page.waitForSelector('#twilio');
                await init.pageClick(page, '#twilio a');
                await page.waitForSelector('#twilio-form');

                await init.pageClick(page, 'input[name=account-sid]');
                await init.pageType(page, 
                    'input[name=account-sid]',
                    '3ee3290aia22s1i9290qw9'
                );
                await init.pageClick(page, 'input[name=authentication-token]');
                await init.pageType(page, 
                    'input[name=authentication-token]',
                    process.env.TEST_TWILIO_ACCOUNT_AUTH_TOKEN
                );
                await init.pageClick(page, 'input[name=phone]');
                await init.pageType(page, 
                    'input[name=phone]',
                    process.env.TEST_TWILIO_PHONE
                );

                await init.pageClick(page, 'input[name=alert-limit]');
                await init.pageType(page, 'input[name=alert-limit]', '5');

                await init.pageClick(page, 'button[type=submit]');
                await page.waitForSelector('#errors', { visible: true });
                const errorMessage = await page.$eval(
                    '#errors',
                    element => element.textContent
                );
                expect(errorMessage).toEqual('accountSid must start with AC');
                await page.reload();

                await page.waitForSelector('input[name=account-sid]', {
                    visible: true,
                });
                const value = await page.$eval(
                    'input[name=account-sid]',
                    e => e.value
                );
                expect(value).toEqual('');
            });
            done();
        },
        operationTimeOut
    );

    test(
        'Should show error if an invalid phone number is used.',
        async done => {
            await cluster.execute(null, async ({ page }) => {
                await page.goto(utils.ADMIN_DASHBOARD_URL);
                await page.waitForSelector('#settings');
                await init.pageClick(page, '#settings a');

                await page.waitForSelector('#twilio');
                await init.pageClick(page, '#twilio a');
                await page.waitForSelector('#twilio-form');

                await init.pageClick(page, 'input[name=account-sid]');
                await init.pageType(page, 
                    'input[name=account-sid]',
                    process.env.TEST_TWILIO_ACCOUNT_SID
                );
                await init.pageClick(page, 'input[name=authentication-token]');
                await init.pageType(page, 
                    'input[name=authentication-token]',
                    process.env.TEST_TWILIO_ACCOUNT_AUTH_TOKEN
                );
                await init.pageClick(page, 'input[name=phone]');
                await init.pageType(page, 'input[name=phone]', '+123');

                await init.pageClick(page, 'input[name=alert-limit]');
                await init.pageType(page, 'input[name=alert-limit]', '5');

                await init.pageClick(page, 'button[type=submit]');

                await page.waitForSelector('#errors', { visible: true });
                const errorMessage = await page.$eval(
                    '#errors',
                    element => element.textContent
                );
                expect(errorMessage).toEqual(
                    'The From phone number +123 is not a valid, SMS-capable inbound phone number or short code for your account.'
                );
                await page.reload();

                await page.waitForSelector('input[name=account-sid]', {
                    visible: true,
                });
                const value = await page.$eval(
                    'input[name=account-sid]',
                    e => e.value
                );
                expect(value).toEqual('');
            });
            done();
        },
        operationTimeOut
    );

    test(
        'Should save valid form data',
        async done => {
            await cluster.execute(null, async ({ page }) => {
                await page.goto(utils.ADMIN_DASHBOARD_URL);
                await page.waitForSelector('#settings');
                await init.pageClick(page, '#settings a');

                await page.waitForSelector('#twilio');
                await init.pageClick(page, '#twilio a');
                await page.waitForSelector('#twilio-form');

                await page.$eval('#sms-enabled', e => e.click());

                await init.pageClick(page, 'input[name=account-sid]');
                await init.pageType(page, 
                    'input[name=account-sid]',
                    process.env.TEST_TWILIO_ACCOUNT_SID
                );
                await init.pageClick(page, 'input[name=authentication-token]');
                await init.pageType(page, 
                    'input[name=authentication-token]',
                    process.env.TEST_TWILIO_ACCOUNT_AUTH_TOKEN
                );
                await init.pageClick(page, 'input[name=phone]');
                await init.pageType(page, 
                    'input[name=phone]',
                    process.env.TEST_TWILIO_PHONE
                );

                await init.pageClick(page, 'input[name=alert-limit]');
                await init.pageType(page, 'input[name=alert-limit]', '5');

                await init.pageClick(page, 'button[type=submit]');
                await page.waitForSelector('.ball-beat', { visible: true });
                await page.waitForSelector('.ball-beat', { hidden: true });
                await page.reload();

                await page.waitForSelector('input[name=account-sid]', {
                    visible: true,
                });
                const value = await page.$eval(
                    'input[name=account-sid]',
                    e => e.value
                );

                expect(value).toEqual(process.env.TEST_TWILIO_ACCOUNT_SID);
            });
            done();
        },
        operationTimeOut
    );

    test(
        'should render an error message if the user try to update his alert phone number without typing the right verification code.',
        async done => {
            await cluster.execute(null, async ({ page }) => {
                await page.goto(utils.ADMIN_DASHBOARD_URL);
                await page.waitForSelector('#goToUserDashboard');
                await init.pageClick(page, '#goToUserDashboard');
                await page.waitForSelector('#profile-menu');
                await init.pageClick(page, '#profile-menu');
                await page.waitForSelector('#userProfile');
                await init.pageClick(page, '#userProfile');
                await page.waitForSelector('input[type=tel]');
                await init.pageType(page, 'input[type=tel]', phoneNumber);
                await init.pageClick(page, '#sendVerificationSMS');
                await page.waitForSelector('#otp');
                await init.pageType(page, '#otp', '654321');
                await init.pageClick(page, '#verify');
                await page.waitForSelector('#smsVerificationErrors', {
                    visible: true,
                });
                const message = await page.$eval(
                    '#smsVerificationErrors',
                    e => e.textContent
                );
                expect(message).toEqual('Invalid code !');
            });
            done();
        },
        operationTimeOut
    );

    test(
        'should set the alert phone number if the user types the right verification code.',
        async done => {
            await cluster.execute(null, async ({ page }) => {
                await page.goto(utils.ADMIN_DASHBOARD_URL);
                await page.waitForSelector('#goToUserDashboard');
                await init.pageClick(page, '#goToUserDashboard');
                await page.waitForSelector('#profile-menu');
                await init.pageClick(page, '#profile-menu');
                await page.waitForSelector('#userProfile');
                await init.pageClick(page, '#userProfile');
                await page.waitForSelector('input[type=tel]');
                await init.pageClick(page, 'input[type=tel]', { clickCount: 3 });
                await init.pageType(page, 'input[type=tel]', phoneNumber);
                await page.waitForSelector('#sendVerificationSMS', {
                    visible: true,
                });
                await init.pageClick(page, '#sendVerificationSMS');
                await page.waitForSelector('#otp');
                await init.pageType(page, '#otp', '123456');
                await init.pageClick(page, '#verify');
                await page.waitForSelector('#successMessage', {
                    visible: true,
                });
                const message = await page.$eval(
                    '#successMessage',
                    e => e.textContent
                );
                expect(message).toEqual(
                    'Verification successful, this number has been updated.'
                );
            });
            done();
        },
        operationTimeOut
    );

    test(
        'should update alert phone number if user types the right verification code.',
        async done => {
            await cluster.execute(null, async ({ page }) => {
                await page.goto(utils.ADMIN_DASHBOARD_URL);
                await page.waitForSelector('#goToUserDashboard');
                await init.pageClick(page, '#goToUserDashboard');
                await page.waitForSelector('#profile-menu');
                await init.pageClick(page, '#profile-menu');
                await page.waitForSelector('#userProfile');
                await init.pageClick(page, '#userProfile');

                await page.reload({ waitUntil: 'networkidle0' });
                await page.waitForSelector('input[type=tel]');
                await init.pageClick(page, 'input[type=tel]');
                await page.keyboard.press('Backspace');
                await init.pageType(page, 'input[type=tel]', '1', {
                    delay: 150,
                });
                await page.waitForSelector('#sendVerificationSMS', {
                    visible: true,
                });
                await init.pageClick(page, '#sendVerificationSMS');
                await page.waitForSelector('#otp');
                await init.pageType(page, '#otp', '123456');
                await init.pageClick(page, '#verify');
                await page.waitForSelector('#successMessage', {
                    visible: true,
                });
                const message = await page.$eval(
                    '#successMessage',
                    e => e.textContent
                );
                expect(message).toEqual(
                    'Verification successful, this number has been updated.'
                );
            });
            done();
        },
        operationTimeOut
    );
});