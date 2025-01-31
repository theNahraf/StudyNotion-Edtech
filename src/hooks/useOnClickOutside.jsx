

//this hook detects click outside of the specified 
//component and calls the provide handler fundtion 

import { useEffect } from "react";

export default function useOnClickOutside(ref, handler){
    useEffect(()=>{
        //define listener function to be called on click touch events
        const listener =(event)=>{
            //if the clikc touch event origignated inside the ref element do nothing

            if(!ref.current || ref.current.contains(event.target)){
                return;
            }

            //other wise call the provided handler fucntion 
            handler(event);
        } 

        //add the event lister for mouse down and touchstarc events on the document
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);

        // cleanup funciton to remove the evenet listener when the components
        // unmounts or when theh ref/handler  dependenchies change 
        return ()=>{
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        }

    }, [ref,handler]); //only ryn this effenct whenthe ref or handler fuctnion change 
    
}