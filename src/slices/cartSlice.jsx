import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const initialState = {
    total : localStorage.getItem("total") 
            ? JSON.parse(localStorage.getItem("total"))
            :  0,

    cart : localStorage.getItem("cart")
            ? JSON.parse(localStorage.getItem("cart"))
            : [],

    totalItems  : localStorage.getItem("totalItems") ? JSON.parse(localStorage.getItem("totalItems")) : 0
}

const cartSlice = createSlice({
    name: 'cart',
    initialState : initialState,

    reducers : {
        //add to cart

        addToCart: (state, action) =>{
            const course = action.payload
            const index = state.cart.findIndex((item)=> item._id === course._id)
            if(index >= 0){
                toast.error("Course is already in Cart")
                return 
            }
            
            //if the ccourse is not added , then add to cart
            state.cart.push(course)

            //update the total quantity and price
            state.totalItems++
            state.total += course.price

            //update local starage
            localStorage.setItem("cart" , JSON.stringify(state.cart))
            localStorage.setItem("total" , JSON.stringify(state.total))
            localStorage.setItem("totalItems" , JSON.stringify(state.totalItems))

            //show toast
            toast.success("Course added to Cart")
        },

       
        //remove from cart

        removeFromCart : (state, action) =>{
            const courseId = action.payload
            const index = state.cart.findIndex((item)=> item._id === courseId)

            if(index>=0){
                //if the course is found in the cart remove it 
                state.totalItems--
                state.total -= state.cart[index].price
                state.cart.splice(index, 1)

                //update to local storage

                localStorage.setItem("cart" , JSON.stringify(state.cart))
                localStorage.setItem("total" , JSON.stringify(state.total))
                localStorage.setItem("totalItems" , JSON.stringify(state.totalItems))

                //show taoast

                toast.success("Course removed From cart")
            }
        },
        //resetcart
        resetCart : (state, action) =>{
            state.cart = []
            state.total = 0
            state.totalItems = 0

            //update to localstorage

            localStorage.removeItem("cart") 
            localStorage.removeItem("total") 
            localStorage.removeItem("totalItems") 
        }
    }



})

export const{setTotalItems, addToCart, removeFromCart, resetCart} = cartSlice.actions;
export default cartSlice.reducer;
