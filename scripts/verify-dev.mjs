import {chromium} from '@playwright/test'
const browser=await chromium.launch({channel:'msedge',headless:true})
try{const page=await browser.newPage({viewport:{width:1440,height:1000}});await page.goto('http://localhost:5173/#Button',{timeout:45000});await page.locator('main h1').waitFor();console.log(await page.locator('main h1').textContent());await page.screenshot({path:'test-results/dev-preview.png'})}finally{await browser.close()}
