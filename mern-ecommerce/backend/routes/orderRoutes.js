import express from 'express';
const router = express.Router();
import { addOrderItems, getMyOrders, getOrders, updateOrderToDelivered, updateOrderToPaid,getOrderById } from '../controllers/orderController.js';
import { protect ,admin} from '../middleware/authMiddleware.js';
import { getProducts } from '../controllers/productController.js';


//user
router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect,getMyOrders);
router.route('/:id').get(protect, getOrderById);

//admin
router.route('/getproducts').get(protect, admin ,getProducts);
router.route('/getorders').get(protect,getOrders);

router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect,updateOrderToDelivered)

export default router;