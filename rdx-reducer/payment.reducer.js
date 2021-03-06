const initialState = {
    methods: [],
    balance: 0,
    defaultMethod: null,
    hasActiveAccount: false,
    hasAccount: false,
    suspended: false,
    transactions: [],
    externalAccounts: []
}

export const PaymentReducer = (prevState = initialState, action) => {
    switch (action.type) {
        case "SET_ACCOUNT":
            return { ...prevState, externalAccounts: action.data }

        case "REMOVE_PAYMENT_METHOD":
            const { methods: existing } = prevState
            return { ...prevState, methods: [...existing.filter(v => v.id !== action.data.id)] }

        case "ADD_PAYMENT_METHOD":
            const { methods } = prevState
            return { ...prevState, methods: [...methods.filter(v => v.id !== action.data.id), action.data] }

        case "SET_PAYMENT_METHOD":
            return { ...prevState, methods: action.data }

        case "SET_BALANCE":
            return {
                ...prevState, balance: action.data.balance || 0,
                hasActiveAccount: action.data.hasActiveAccount,
                hasAccount: action.data.hasAccount,
                suspended: action.data.suspended
            }

        case "SET_DEFAULT_METHOD":
            return { ...prevState, defaultMethod: action.data }

        case "SET_TRANSACTION":
            return { ...prevState, transactions: action.data }

        case "UPDATE_TRANSACTION":
            const { transactions } = prevState
            return { ...prevState, transactions: [...transactions.filter(v => v.id !== action.data.id), action.data] }

        case "CLEAR_PAYMENTS":
            return { ...initialState }

        default:
            return { ...prevState };
    }
};
