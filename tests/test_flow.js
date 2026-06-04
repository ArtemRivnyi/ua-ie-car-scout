import { calcPriceStats, compareMarkets } from './src/services/priceService.js';


// 1. Mock AUTO.RIA response (so we don't spend API tokens)
const mockUaListings = [
  { id: 1, make: 'Toyota', model: 'RAV4', year: 2018, priceEur: 18500, mileage: 120000, county: 'Kyiv', url: 'https://auto.ria.com/1' },
  { id: 2, make: 'Toyota', model: 'RAV4', year: 2019, priceEur: 21000, mileage: 90000, county: 'Lviv', url: 'https://auto.ria.com/2' },
  { id: 3, make: 'Toyota', model: 'RAV4', year: 2018, priceEur: 17900, mileage: 145000, county: 'Odessa', url: 'https://auto.ria.com/3' },
  { id: 4, make: 'Toyota', model: 'RAV4', year: 2020, priceEur: 24500, mileage: 60000, county: 'Dnipro', url: 'https://auto.ria.com/4' },
  { id: 5, make: 'Toyota', model: 'RAV4', year: 2018, priceEur: 85000, mileage: 10000, county: 'Kyiv', url: 'https://auto.ria.com/5' }, // Outlier!
];

console.log('--- 1. Поиск на AUTO.RIA (Mock) ---');
console.log(`Найдено ${mockUaListings.length} машин Toyota RAV4.`);

// 2. Calculate Stats
const stats = calcPriceStats(mockUaListings.map(l => l.priceEur));
console.log('\n--- 2. Статистика рынка UA ---');
console.log(`Мин: €${stats.min}, Макс: €${stats.max}, Медиана: €${stats.median}`);
console.log(`Средняя цена: €${stats.avgFiltered} (Отброшено аномалий: ${stats.outliers.length})`);
if (stats.outliers.length > 0) {
  console.log(`⚠️ Исключена фейковая/ошибочная цена: €${stats.outliers[0]}`);
}

// 3. Irish Market (Mocking DoneDeal response or manual input)
const ieMarket = { min: 22000, avg: 26500, max: 31000 };
console.log('\n--- 3. Рынок Ирландии (DoneDeal) ---');
console.log(`Средняя цена в Ирландии: €${ieMarket.avg}`);

// 4. Comparison
const comparison = compareMarkets(stats, ieMarket);
console.log('\n--- 4. Сравнение (CompareBar) ---');
if (comparison.savingVsAvg > 0) {
  console.log(`✅ Выгода при покупке в UA: €${comparison.savingVsAvg} (${comparison.premiumPct}%)`);
}

// 5. Import Calculator simulation for the cheapest valid car (id: 3, €17900)
console.log('\n--- 5. Калькулятор растаможки (Import Calculator) ---');
const targetCar = mockUaListings[2]; 
console.log(`Считаем для: ${targetCar.make} ${targetCar.model} ${targetCar.year}, Цена: €${targetCar.priceEur}`);

const customs = targetCar.priceEur * 0.065; // 6.5% customs
const vat = (targetCar.priceEur + customs) * 0.23; // 23% VAT
const shipping = 1000;
const totalCost = targetCar.priceEur + customs + vat + shipping;

console.log(`- Сама машина: €${targetCar.priceEur}`);
console.log(`- Пошлина (6.5%): €${Math.round(customs)}`);
console.log(`- НДС (23%): €${Math.round(vat)}`);
console.log(`- Доставка: €${shipping}`);
console.log(`- Итоговая себестоимость (без VRT): €${Math.round(totalCost)}`);

const margin = ieMarket.avg - totalCost;
console.log(`\n💰 Потенциальная маржа при продаже в Ирландии: €${Math.round(margin)}`);
if (margin > 0) {
  console.log('Вердикт: ВЕРОЯТНО ВЫГОДНО 🟢');
} else {
  console.log('Вердикт: НЕ ВЫГОДНО 🔴');
}
