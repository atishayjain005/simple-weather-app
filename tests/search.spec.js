import { test, expect } from '@playwright/test';
const weather = { name:'London', dt:1704151800, timezone:19800, main:{temp:273.15, feels_like:272.15, temp_max:275.15, temp_min:270.15, humidity:70}, weather:[{main:'Clouds',description:'overcast clouds'}], wind:{speed:3}, sys:{sunrise:1704151800,sunset:1704195000} };
test('failed initial search recovers, and a failed later search preserves the previous result', async ({page}) => {
  await page.route('https://api.openweathermap.org/**', route => {
    return new URL(route.request().url()).searchParams.get('q') === 'London,GB' ? route.fulfill({json:weather}) : route.fulfill({status:404,json:{message:'not found'}});
  });
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('City not found');
  await page.getByPlaceholder('Enter city name').fill('London,GB');
  await page.getByPlaceholder('Enter city name').press('Enter');
  await expect(page.getByRole('heading',{name:'London',exact:true})).toBeVisible();
  await expect(page.getByText('05:00',{exact:true})).toBeVisible();
  await page.getByPlaceholder('Enter city name').fill('missing city');
  await page.getByPlaceholder('Enter city name').press('Enter');
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page.getByText('Showing the previous result for London.')).toBeVisible();
  await expect(page.getByRole('status')).toHaveCount(0);
});
test('blank input makes no request and malformed response does not crash', async ({page}) => {
  let calls=0;
  await page.route('https://api.openweathermap.org/**', route => { calls++; return route.fulfill({json:{}}); });
  await page.goto('/');
  await expect(page.getByRole('alert')).toContainText('Unable to load weather');
  const previous=calls;
  await page.getByPlaceholder('Enter city name').fill('   ');
  await page.getByPlaceholder('Enter city name').press('Enter');
  await expect(page.getByRole('alert')).toHaveText('Enter a city name to search.');
  expect(calls).toBe(previous);
});
test('latest request wins when responses arrive out of order', async ({page}) => {
  let release;
  const gate=new Promise(resolve=>{release=resolve;});
  await page.route('https://api.openweathermap.org/**', async route => {
    const city=new URL(route.request().url()).searchParams.get('q');
    if(city==='Slow') await gate;
    await route.fulfill({json:{...weather,name:city}}).catch(()=>{});
  });
  await page.goto('/');
  await expect(page.getByRole('heading',{name:'London',exact:true})).toBeVisible();
  await page.getByPlaceholder('Enter city name').fill('Slow');
  const slow=page.waitForRequest(request=>new URL(request.url()).searchParams.get('q')==='Slow');
  await page.getByPlaceholder('Enter city name').press('Enter');
  await slow;
  await page.getByPlaceholder('Enter city name').fill('Paris');
  await page.getByPlaceholder('Enter city name').press('Enter');
  await expect(page.getByRole('heading',{name:'Paris',exact:true})).toBeVisible();
  release();
  await expect(page.getByRole('heading',{name:'Slow',exact:true})).toHaveCount(0);
});

test('unit controls support keyboard selection without toggling the current unit', async ({page}) => {
  await page.route('https://api.openweathermap.org/**', route => route.fulfill({json:weather}));
  await page.goto('/');
  await expect(page.getByLabel('Temperature 0 degrees Celsius', {exact:true})).toBeVisible();
  const celsius=page.getByRole('button',{name:'Celsius',exact:true});
  const fahrenheit=page.getByRole('button',{name:'Fahrenheit',exact:true});
  await celsius.press('Enter');
  await expect(celsius).toHaveAttribute('aria-pressed','true');
  await fahrenheit.press('Space');
  await expect(page.getByLabel('Temperature 32 degrees Fahrenheit',{exact:true})).toBeVisible();
  await expect(fahrenheit).toHaveAttribute('aria-pressed','true');
  await expect(page.getByRole('textbox',{name:'City name'})).toBeVisible();
});
