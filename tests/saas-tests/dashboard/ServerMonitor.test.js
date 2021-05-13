const puppeteer = require('puppeteer');
const utils = require('../../test-utils');
const init = require('../../test-init');

const axios = require('axios');
axios.defaults.adapter = require('axios/lib/adapters/http');
let serverMonitor;
try {
    // try to use local package (with recent changes)
    serverMonitor = require('../../../../js-sdk/src/cli/server-monitor/lib/api');
} catch (error) {
    const fyipe = require('fyipe');
    serverMonitor = fyipe.ServerMonitor;
}

require('should');

// user credentials
const email = utils.generateRandomBusinessEmail();
const password = '1234567890';

describe('Server Monitor API', () => {
    const operationTimeOut = init.timeout;

    

    beforeAll(async () => {
        jest.setTimeout(init.timeout);

        cluster = await Cluster.launch({
            concurrency: Cluster.CONCURRENCY_PAGE,
            puppeteerOptions: utils.puppeteerLaunchConfig,
            puppeteer,
            timeout: init.timeout,
        });

        cluster.on('taskerror', err => {
            throw err;
        });

        return await cluster.execute(null, async ({ page }) => {
            const user = {
                email,
                password,
            };
            await init.registerUser(user, page);
            await init.loginUser(user, page);
        });
    });

    afterAll(async done => {
        await cluster.idle();
        await cluster.close();
        done();
    });

    const componentName = utils.generateRandomString();
    const monitorName = utils.generateRandomString();

    test(
        'should create offline incident if no data is uploaded in 3 minutes after creating server monitor',
        async () => {
            return await cluster.execute(null, async ({ page }) => {
                // Create Component first
                // Redirects automatically component to details page
                await init.addComponent(componentName, page);

                await page.waitForSelector('#form-new-monitor');
                await init.pageClick(page, 'input[id=name]');
                await init.pageType(page, 'input[id=name]', monitorName);
                await init.selectByText('#type', 'server-monitor', page);
                await init.pageClick(page, 'button[type=submit]');

                let spanElement = await page.waitForSelector(
                    `#monitor-title-${monitorName}`
                );
                spanElement = await spanElement.getProperty('innerText');
                spanElement = await spanElement.jsonValue();
                spanElement.should.be.exactly(monitorName);

                await page.waitForSelector('span#activeIncidentsText', {
                    visible: true,
                });
                let activeIncidents = await page.$('span#activeIncidentsText');
                activeIncidents = await activeIncidents.getProperty(
                    'innerText'
                );
                activeIncidents = await activeIncidents.jsonValue();
                expect(activeIncidents).toEqual('1 Incident Currently Active');
            });
        },
        operationTimeOut
    );

    test(
        'should auto acknowledge and resolve offline incident',
        async () => {
            return await cluster.execute(null, async ({ page }) => {
                await page.goto(utils.DASHBOARD_URL, {
                    waitUntil: 'networkidle0',
                });

                await page.waitForSelector('#projectSettings');
                await init.pageClick(page, '#projectSettings');
                await page.waitForSelector('#api');
                await init.pageClick(page, '#api a');

                let projectId = await page.$('#projectId', { visible: true });
                projectId = await projectId.getProperty('innerText');
                projectId = await projectId.jsonValue();

                let apiUrl = await page.$('#apiUrl', { visible: true });
                apiUrl = await apiUrl.getProperty('innerText');
                apiUrl = await apiUrl.jsonValue();

                await init.pageClick(page, '#apiKey');
                let apiKey = await page.$('#apiKey', { visible: true });
                apiKey = await apiKey.getProperty('innerText');
                apiKey = await apiKey.jsonValue();

                // Navigate to Monitor details
                await init.navigateToMonitorDetails(
                    componentName,
                    monitorName,
                    page
                );

                let monitorId = await page.waitForSelector('#monitorId', {
                    visible: true,
                    timeout: operationTimeOut,
                });
                monitorId = await monitorId.getProperty('innerText');
                monitorId = await monitorId.jsonValue();

                const monitor = serverMonitor({
                    simulate: 'online',
                    projectId,
                    apiUrl,
                    apiKey,
                    monitorId,
                });

                monitor.start();

               

                await page.waitForSelector('span#activeIncidentsText', {
                    visible: true,
                });
                let activeIncidents = await page.$('span#activeIncidentsText');
                activeIncidents = await activeIncidents.getProperty(
                    'innerText'
                );
                activeIncidents = await activeIncidents.jsonValue();
                expect(activeIncidents).toEqual(
                    'No incidents currently active.'
                );

                monitor.stop();
            });
        },
        operationTimeOut
    );

    test(
        'should create degraded incident',
        async () => {
            return await cluster.execute(null, async ({ page }) => {
                await page.goto(utils.DASHBOARD_URL, {
                    waitUntil: 'networkidle0',
                });

                await page.waitForSelector('#projectSettings');
                await init.pageClick(page, '#projectSettings');
                await page.waitForSelector('#api');
                await init.pageClick(page, '#api a');

                let projectId = await page.$('#projectId', { visible: true });
                projectId = await projectId.getProperty('innerText');
                projectId = await projectId.jsonValue();

                let apiUrl = await page.$('#apiUrl', { visible: true });
                apiUrl = await apiUrl.getProperty('innerText');
                apiUrl = await apiUrl.jsonValue();

                await init.pageClick(page, '#apiKey');
                let apiKey = await page.$('#apiKey', { visible: true });
                apiKey = await apiKey.getProperty('innerText');
                apiKey = await apiKey.jsonValue();

                // Navigate to Monitor details
                await init.navigateToMonitorDetails(
                    componentName,
                    monitorName,
                    page
                );

                let monitorId = await page.waitForSelector('#monitorId', {
                    visible: true,
                    timeout: operationTimeOut,
                });
                monitorId = await monitorId.getProperty('innerText');
                monitorId = await monitorId.jsonValue();

                const monitor = serverMonitor({
                    simulate: 'degraded',
                    projectId,
                    apiUrl,
                    apiKey,
                    monitorId,
                });

                monitor.start();

               

                // check status
                const element = await page.waitForSelector(
                    `#${monitorName}-degraded`
                );
                expect(element).toBeDefined();

                monitor.stop();
            });
        },
        operationTimeOut
    );

    test(
        'should create offline incident',
        async () => {
            return await cluster.execute(null, async ({ page }) => {
                await page.goto(utils.DASHBOARD_URL, {
                    waitUntil: 'networkidle0',
                });

                await page.waitForSelector('#projectSettings');
                await init.pageClick(page, '#projectSettings');
                await page.waitForSelector('#api');
                await init.pageClick(page, '#api a');

                let projectId = await page.$('#projectId', { visible: true });
                projectId = await projectId.getProperty('innerText');
                projectId = await projectId.jsonValue();

                let apiUrl = await page.$('#apiUrl', { visible: true });
                apiUrl = await apiUrl.getProperty('innerText');
                apiUrl = await apiUrl.jsonValue();

                await init.pageClick(page, '#apiKey');
                let apiKey = await page.$('#apiKey', { visible: true });
                apiKey = await apiKey.getProperty('innerText');
                apiKey = await apiKey.jsonValue();

                // Navigate to Monitor details
                await init.navigateToMonitorDetails(
                    componentName,
                    monitorName,
                    page
                );

                let monitorId = await page.waitForSelector('#monitorId', {
                    visible: true,
                    timeout: operationTimeOut,
                });
                monitorId = await monitorId.getProperty('innerText');
                monitorId = await monitorId.jsonValue();

                const monitor = serverMonitor({
                    simulate: 'offline',
                    projectId,
                    apiUrl,
                    apiKey,
                    monitorId,
                });

                monitor.start();

               

                // check status
                const element = await page.waitForSelector(
                    `#${monitorName}-offline`
                );
                expect(element).toBeDefined();

                monitor.stop();
            });
        },
        operationTimeOut
    );

    test(
        'should create offline incident 3 minutes after daemon is turned off',
        async () => {
            return await cluster.execute(null, async ({ page }) => {
                await page.goto(utils.DASHBOARD_URL, {
                    waitUntil: 'networkidle0',
                });

                await page.waitForSelector('#projectSettings');
                await init.pageClick(page, '#projectSettings');
                await page.waitForSelector('#api');
                await init.pageClick(page, '#api a');

                let projectId = await page.$('#projectId', { visible: true });
                projectId = await projectId.getProperty('innerText');
                projectId = await projectId.jsonValue();

                let apiUrl = await page.$('#apiUrl', { visible: true });
                apiUrl = await apiUrl.getProperty('innerText');
                apiUrl = await apiUrl.jsonValue();

                await init.pageClick(page, '#apiKey');
                let apiKey = await page.$('#apiKey', { visible: true });
                apiKey = await apiKey.getProperty('innerText');
                apiKey = await apiKey.jsonValue();

                // Navigate to Monitor details
                await init.navigateToMonitorDetails(
                    componentName,
                    monitorName,
                    page
                );

                let monitorId = await page.waitForSelector('#monitorId', {
                    visible: true,
                    timeout: operationTimeOut,
                });
                monitorId = await monitorId.getProperty('innerText');
                monitorId = await monitorId.jsonValue();

                const monitor = serverMonitor({
                    simulate: 'online',
                    projectId,
                    apiUrl,
                    apiKey,
                    monitorId,
                });

                monitor.start();

                monitor.stop();

                await page.waitForSelector('span#activeIncidentsText', {
                    visible: true,
                });
                let activeIncidents = await page.$('span#activeIncidentsText');
                activeIncidents = await activeIncidents.getProperty(
                    'innerText'
                );
                activeIncidents = await activeIncidents.jsonValue();
                expect(activeIncidents).toEqual('1 Incident Currently Active');
            });
        },
        operationTimeOut
    );

    test(
        'should create offline incident 3 minutes after manually resolving incident and daemon is turned off',
        async () => {
            return await cluster.execute(null, async ({ page }) => {
                // Navigate to details page of component created
                await init.navigateToComponentDetails(componentName, page);

                await page.waitForSelector(
                    `#${monitorName}_EditIncidentDetails_0`
                );
                await page.$eval(`#${monitorName}_EditIncidentDetails_0`, e =>
                    e.click()
                );
                
                await page.$eval(`#${monitorName}_EditIncidentDetails_0`, e =>
                    e.click()
                );
                

                await page.waitForSelector('span#activeIncidentsText', {
                    visible: true,
                });
                let activeIncidents = await page.$('span#activeIncidentsText');
                activeIncidents = await activeIncidents.getProperty(
                    'innerText'
                );
                activeIncidents = await activeIncidents.jsonValue();
                expect(activeIncidents).toEqual(
                    'No incidents currently active.'
                );

                await page.waitForSelector('span#activeIncidentsText', {
                    visible: true,
                });
                activeIncidents = await page.$('span#activeIncidentsText');
                activeIncidents = await activeIncidents.getProperty(
                    'innerText'
                );
                activeIncidents = await activeIncidents.jsonValue();
                expect(activeIncidents).toEqual('1 Incident Currently Active');
            });
        },
        operationTimeOut
    );
});