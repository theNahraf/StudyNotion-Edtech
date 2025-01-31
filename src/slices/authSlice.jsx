import { createSlice } from "@reduxjs/toolkit";

const getTokenFromLocalStorage = () => {
    const token = localStorage.getItem("token"); // Get the token from localStorage
    // console.log("token from local storage...... ", token)
    if (token) {
        try {
            return token; // Attempt to parse the token if it exists
        } catch (error) {
            console.error("Failed to parse token:", error); // Log parsing errors
            return null; // Return null if parsing fails
        }
    }
    console.log("i am return null")
    return null; // Return null if token is undefined or doesn't exist
};


const initialState = {
    loading: false,
    signupData: null,
    token: getTokenFromLocalStorage(), // Use the function to safely get token
};


const authSlice = createSlice({
    name: "auth",
    initialState : initialState,
    reducers:{
        setToken(state, value){
            state.token = value.payload;
            localStorage.setItem("token", value.payload); // Save token to localStorage

        },
        setLoading(state, value){
            state.loading =value.payload
        },
        setSignupData(state, value){
            state.signupData = value.payload;
        }

    },
});

export const {setToken, setLoading, setSignupData} = authSlice.actions;
export default authSlice.reducer;