import express from "express"
import authValidation from "../../validations/user.validation.js"
import validate from "../../middlewares/validate.js"
import controllers from "./controllers.js"
import authenticate from "../../middlewares/authenticate.js"

const router = express.Router();

router.post("/login", validate(authValidation.login), controllers.login);
router.post("/register", validate(authValidation.register), controllers.register);
router.get("/profile", authenticate, controllers.userProfile);
router.patch("/profile/update", authenticate, validate(authValidation.update), controllers.update);
router.patch("/update/:id", controllers.updateAdmin);
router.post("/mealGen", controllers.generateMealPlan);
router.post("/recipe", controllers.getRecipeRecommendations);
router.post("/grocery", controllers.generateGroceryList);
router.get("/all", controllers.getAll);
router.get("/:id", controllers.getById);
router.delete("/:id", controllers.delete);



export default router;
