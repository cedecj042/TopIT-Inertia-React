import { forwardRef, useEffect,useRef } from "react";

export default forwardRef(function TextInput({type = 'text',className='',isFocused= false,...props},ref){

    const input = ref ? ref : useRef();

    useEffect(()=>{
        if (isFocused){
            input.current.focus();
        }
    },[]);

    return (
        <input
            {...props}
            type = {type}
            className={
                'form-control border focus:border-primary focus:ring-0 rounded shadow-sm' +
                className
            }
            ref = {input}
        />
        );
});
