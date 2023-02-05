import React, {createContext, useContext, useState, useEffect} from 'react';
import {toast} from 'react-hot-toast';
import product from 'sanity-ecommerce/schemas/product';

const Context = createContext();

export const StateContext = ({children}) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);
    const [qty, setQty] = useState(1);

    let foundProduct;
    let index;

    const onAdd = (product, quantity) => {
        const checkProductInCart = cartItems.find((item) => item._id === product._id);

        // if the product is already in the cart => increase the existing qty
        setTotalPrice((prevTotalPrice) => prevTotalPrice+product.price*quantity);
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity);

        if (checkProductInCart) {
            // create a new version of a cart => store it under this new variable
            const updatedCartItems = cartItems.map((cartProduct) => {
                if (cartProduct._id === product._id) return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity
                }
            })

            setCartItems(updatedCartItems);
        } else {
            product.quantity = quantity;
            
            setCartItems([...cartItems, {...product}]);
        } 

        toast.success(`${qty} ${product.name} added to the cart.`);
    };

    const onRemove = (product) => {
        // which product are currently updated
        foundProduct = cartItems.find((item) =>  item._id === product._id);
        const newCartItems = cartItems.filter((item) => item._id!==product._id);
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price*foundProduct.quantity);
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities - foundProduct.quantity);

        setCartItems(newCartItems);


    }

    const toggleCartItemQuantity = (id, value) => {

        foundProduct = cartItems.find((item) =>  item._id === id);
        // index is the index in the array
        index = cartItems.findIndex((product) => product._id === id);
        // console.log(cartItems)

        // remove the not-yet removed items or un-updated items
        // const newCartItems = cartItems.filter((item) => item._id!==id) this will impact the index ordering of the intitial array
        //=> to maintain the order => directly change the that element in the current array and setState it
        //slice 1 element starting from this index. splice is mutated method => it updates the state of the cartItems => use filter

        if(value === 'inc') {
            // this will directly update the current items without mutate the value       
            setCartItems(cartItems.map((item) => item._id === id ? {...foundProduct, quantity: foundProduct.quantity+1} :item ));
            // cartItems[index] = foundProduct; //break rules React
            setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
            setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1 );
        } else if (value === 'dec') {
            if (foundProduct.quantity > 1) {
                setCartItems(cartItems.map((item) => item._id === id ? {...foundProduct, quantity: foundProduct.quantity-1} :item ));
                // cartItems[index] = foundProduct; //break rules React
                setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
                setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1 )
            }
            

        }

    }
    
    // increase quantity
    const incQty = () => {
        setQty((prevQty) =>prevQty+1);
    };


    const decQty = () => {
        setQty((prevQty) =>{
            if(prevQty-1 <1) return 1;
            return prevQty-1;
        });
    }

    return  (
        // object of values we will pass  all to the entire application
        <Context.Provider
            value={{
                showCart,
                setShowCart,
                cartItems,
                totalPrice,
                totalQuantities,
                qty,
                incQty,
                decQty,
                onAdd,
                toggleCartItemQuantity,
                onRemove,
                setCartItems,
                setTotalPrice,
                setTotalQuantities
            }}
        >
            {children}
        </Context.Provider>
    )
}

// useContext is a React Hook that lets you read and subscribe to context from your component.
export const useStateContext = () => useContext(Context)