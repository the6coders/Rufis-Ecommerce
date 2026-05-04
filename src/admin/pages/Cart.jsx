async function Cart() {
    // get cart items for merchant
    // export const getCart = async (userId) =>
    //   await api.get(`/carts?user_id=${userId}`);


    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCart = async () => {
            setLoading(true);
            try {
                const cart = await getCartItemsForMerchant(merchantId); // Replace with actual merchant ID retrieval logic
                setCartItems(cart);
            } catch (err) {
                setError("Failed to fetch cart items.");
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

  return (
    <div>
     
     
    </div>
  );
}

export default Cart;