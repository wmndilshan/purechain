// Simple Node.js test script for Google Sheets API
// Run with: node test-api.js

const API_URL = 'https://script.google.com/macros/s/AKfycbxoeBdoG7YZ1g5ePzaCQLqGBwXc2BhDFC1AKowlGWFTZzumef5SPA2ZpJIyXsoNAIS7Mg/exec';

console.log('🌿 PureChain API Test Suite\n');
console.log('API URL:', API_URL);
console.log('=' + '='.repeat(60) + '\n');

// Test 1: Get All Products
async function testGetProducts() {
    console.log('📦 Test 1: Get All Products');
    console.log('-'.repeat(60));

    try {
        const url = `${API_URL}?action=getAll&sheet=products`;
        console.log('Request URL:', url);

        const response = await fetch(url);
        console.log('Status:', response.status, response.statusText);

        const data = await response.json();

        if (data.success) {
            console.log('✅ SUCCESS!');
            console.log(`Found ${data.data?.length || 0} products`);
            console.log('\nResponse:');
            console.log(JSON.stringify(data, null, 2));
        } else {
            console.log('❌ FAILED!');
            console.log('Error:', data.message);
            console.log('\nResponse:');
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.log('❌ ERROR!');
        console.log('Error message:', error.message);
        console.log('\nFull error:');
        console.error(error);
    }

    console.log('\n');
}

// Test 2: Get All Farmers
async function testGetFarmers() {
    console.log('👨‍🌾 Test 2: Get All Farmers');
    console.log('-'.repeat(60));

    try {
        const url = `${API_URL}?action=getAll&sheet=farmers`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            console.log('✅ SUCCESS!');
            console.log(`Found ${data.data?.length || 0} farmers`);
            console.log(JSON.stringify(data, null, 2));
        } else {
            console.log('❌ FAILED!');
            console.log('Error:', data.message);
        }
    } catch (error) {
        console.log('❌ ERROR!');
        console.log(error.message);
    }

    console.log('\n');
}

// Test 3: Get All Orders
async function testGetOrders() {
    console.log('📋 Test 3: Get All Orders');
    console.log('-'.repeat(60));

    try {
        const url = `${API_URL}?action=getAll&sheet=orders`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            console.log('✅ SUCCESS!');
            console.log(`Found ${data.data?.length || 0} orders`);
            console.log(JSON.stringify(data, null, 2));
        } else {
            console.log('❌ FAILED!');
            console.log('Error:', data.message);
        }
    } catch (error) {
        console.log('❌ ERROR!');
        console.log(error.message);
    }

    console.log('\n');
}

// Test 4: Create a Product (POST)
async function testCreateProduct() {
    console.log('➕ Test 4: Create Product');
    console.log('-'.repeat(60));

    try {
        const productData = {
            name: 'Test Organic Carrots',
            price: 180,
            stock: 25,
            image: 'https://example.com/carrots.jpg',
            category: 'vegetables',
            farmer_id: 'FARMER-TEST-001'
        };

        console.log('Product data:');
        console.log(JSON.stringify(productData, null, 2));

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'create',
                sheet: 'products',
                data: productData
            })
        });

        const data = await response.json();

        if (data.success) {
            console.log('✅ SUCCESS!');
            console.log('Created product with ID:', data.data?.id);
            console.log(JSON.stringify(data, null, 2));
        } else {
            console.log('❌ FAILED!');
            console.log('Error:', data.message);
        }
    } catch (error) {
        console.log('❌ ERROR!');
        console.log(error.message);
    }

    console.log('\n');
}

// Run all tests
async function runTests() {
    console.log('Starting tests...\n');

    await testGetProducts();
    await testGetFarmers();
    await testGetOrders();
    // await testCreateProduct(); // Uncomment to test creating a product

    console.log('=' + '='.repeat(60));
    console.log('All tests completed!');
}

// Execute tests
runTests().catch(error => {
    console.error('Test suite failed:', error);
    process.exit(1);
});
