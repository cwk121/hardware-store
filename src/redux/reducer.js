const initialState = {
	api: 'http://localhost:1337',
	loading: false,
	cart: [],
	jwt: '',
	user: {},
	cartOverlay: false,
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
		case "set_loading":
			return { ...state, loading: action.payload }
		case "login":
			return { ...state, user: action.payload.user, jwt: action.payload.jwt }
		case "logout":
			return { ...state, jwt: '', user: {} }
		case "update_cart":
			const newItem = action.payload;
			let cart = [...state.cart];
			let updated = false;
			// If item already exist, replace with new data
			cart.forEach((item, index) => {
				if (item.id === newItem.id) {
					cart[index] = newItem;
					updated = true;
				}
			})
			// Else, add new item
			if (!updated) {
				cart.push(newItem);
			}
			// Limit quantity not larger than stock, and Remove item with quantity <= 0
			let index = cart.length;
			while (index--) {
				if (cart[index].quantity > cart[index].stock) {
					cart[index].quantity = cart[index].stock;
				} else if (cart[index].quantity <= 0) {
					cart.splice(index, 1);
				}
			}
			return { ...state, cart: cart };
		case "set_cart":
			return { ...state, cart: action.payload };
		case "clear_cart":
			return { ...state, cart: [] };
		case "set_cart_overlay":
			return { ...state, cartOverlay: action.payload };
		default:
			return state;
	}
}
