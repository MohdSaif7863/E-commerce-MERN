const express=require('express')
const orderController=require("../controllers/Order")
const router=express.Router()


router
    .post("/",orderController.create)
    .get("/",orderController.getAll)
    .get("/user/:id",orderController.getByUserId)
    .patch("/:id",orderController.updateById)
    .delete("/:id",orderController.deleteById)


module.exports=router