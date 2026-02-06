import exp from "express"
const router = exp.Router();
import { authUser, registerUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const getUserProfile=(req,res)=>{
    res.send(
        {
            _id:req.user.id,
            name:req.user.name,
            email:req.user.email,
        }
    );
};
router.post('/',registerUser);
router.post('/login',authUser);
router.route('/profile').get(protect, getUserProfile); // 2. Add protect here
export default router;