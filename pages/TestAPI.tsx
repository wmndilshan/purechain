import { useState } from 'react';
import { api } from '../services/googleSheetAPI';

export default function TestAPI() {
    const [output, setOutput] = useState('Click a button to test the API...');
    const [loading, setLoading] = useState(false);

    const log = (message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setOutput(`[${timestamp}] ${message}\n\n`);
    };

    const appendLog = (message: string) => {
        setOutput(prev => prev + message + '\n');
    };

    const testGetAllProducts = async () => {
        log('🔄 Testing getAllProducts()...');
        setLoading(true);

        try {
            const products = await api.getAllProducts();
            appendLog(`✅ SUCCESS! Found ${products.length} products`);
            appendLog('\nProducts:');
            appendLog(JSON.stringify(products, null, 2));
        } catch (error: any) {
            appendLog(`❌ ERROR: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const testGetAllFarmers = async () => {
        log('🔄 Testing getAllFarmers()...');
        setLoading(true);

        try {
            const farmers = await api.getAllFarmers();
            appendLog(`✅ SUCCESS! Found ${farmers.length} farmers`);
            appendLog('\nFarmers:');
            appendLog(JSON.stringify(farmers, null, 2));
        } catch (error: any) {
            appendLog(`❌ ERROR: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const testGetAllOrders = async () => {
        log('🔄 Testing getAllOrders()...');
        setLoading(true);

        try {
            const orders = await api.getAllOrders();
            appendLog(`✅ SUCCESS! Found ${orders.length} orders`);
            appendLog('\nOrders:');
            appendLog(JSON.stringify(orders, null, 2));
        } catch (error: any) {
            appendLog(`❌ ERROR: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const testCreateProduct = async () => {
        log('🔄 Testing createProduct()...');
        setLoading(true);

        try {
            const result = await api.createProduct({
                name: 'Test Organic Carrots',
                price: 180,
                stock: 25,
                image: 'https://example.com/carrots.jpg',
                category: 'vegetables',
                farmer_id: 'FARMER-TEST-001'
            });
            appendLog(`✅ SUCCESS! Created product with ID: ${result.id}`);
        } catch (error: any) {
            appendLog(`❌ ERROR: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>🌿 PureChain API Test</h1>

            <div style={styles.panel}>
                <h2 style={styles.subtitle}>Connection Tests</h2>

                <div style={styles.buttonGroup}>
                    <button
                        onClick={testGetAllProducts}
                        disabled={loading}
                        style={styles.button}
                    >
                        Test Get Products
                    </button>

                    <button
                        onClick={testGetAllFarmers}
                        disabled={loading}
                        style={styles.button}
                    >
                        Test Get Farmers
                    </button>

                    <button
                        onClick={testGetAllOrders}
                        disabled={loading}
                        style={styles.button}
                    >
                        Test Get Orders
                    </button>

                    <button
                        onClick={testCreateProduct}
                        disabled={loading}
                        style={styles.button}
                    >
                        Test Create Product
                    </button>
                </div>

                <div style={styles.output}>
                    <pre>{output}</pre>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '30px',
    },
    panel: {
        background: 'white',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    subtitle: {
        color: '#667eea',
        marginBottom: '20px',
    },
    buttonGroup: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px',
        marginBottom: '20px',
    },
    button: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        padding: '12px 20px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'transform 0.2s',
    },
    output: {
        background: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '6px',
        padding: '16px',
        minHeight: '200px',
        maxHeight: '500px',
        overflow: 'auto',
        fontFamily: 'monospace',
        fontSize: '13px',
    },
};
