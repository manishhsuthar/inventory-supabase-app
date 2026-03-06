import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import productsRoutes from './routes/products.js';  
import dealersRoutes from './routes/dealers.js';
import purchasesRoutes from './routes/purchases.js';
import salesRoutes from './routes/sales.js';
import dealerPaymentsRoutes from './routes/dealerPayments.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/products', productsRoutes); 
app.use('/api/dealers', dealersRoutes);
app.use('/api/purchases', purchasesRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/dealer-payments', dealerPaymentsRoutes);

app.get('/', (req, res) => {
    res.send('app is running');
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
