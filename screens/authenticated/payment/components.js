import { useActionSheet } from "@expo/react-native-action-sheet";
import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { TextField } from "@ubaids/react-native-material-textfield";
import "intl";
import 'intl/locale-data/jsonp/en';
import moment from 'moment';
import React, { useCallback, useContext, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Modal, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/native";
import Confirm from "../../../components/confirm";
import { GlobalContext } from "../../../components/context";
import Text from "../../../components/text";
import { makePayment } from "../../../controllers/PaymentController";


export const CARD_ICON = {
    amex: (props) => <FontAwesome name='cc-amex' {...props} />,
    diners: (props) => <FontAwesome name='cc-diners-club' {...props} />,
    discover: (props) => <FontAwesome name='cc-discover' {...props} />,
    jcb: (props) => <FontAwesome name='cc-jcb' {...props} />,
    mastercard: (props) => <FontAwesome name='cc-mastercard' {...props} />,
    unionpay: (props) => <FontAwesome name='credit-card-alt' {...props} />,
    visa: (props) => <FontAwesome name='cc-visa' {...props} />,
    unknown: (props) => <FontAwesome name='credit-card' {...props} />
}
export const getTransactionStatus = (status) => {
    switch (status) {
        case 0:
            return 'pending'
        case 1:
            return 'successful'
        case 2:
            return 'failed'
        case 3:
            return 'declined'
        case 4:
            return 'uncaptured'
        default:
            return 'unknown'
    }
}
export const getTransactionStatusColor = (status) => {
    switch (status) {
        case 0:
            return '#ffa500'
        case 1:
            return '#4f8c4f'
        case 2:
            return '#f08080'
        case 3:
        case 4:
            return '#4682b4'
        default:
            return 'white'
    }
}
export const CurrencyFormatter = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
export const NumberFormatter = Intl.NumberFormat()

export function MethodView({ method, onPress }) {
    return (
        <PaymentItemRow key={method.id}>
            <PaymentItemRowLink onPress={onPress}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                    {CARD_ICON[method.brand]({ size: 20 })}
                    <Text small weight="700" style={{ marginStart: 4 }} textTransform='uppercase' color="#4a4a4a"> ****{method.mask}</Text>
                </View>

                <Text small weight="700" color="#4a4a4a">EXP: {`${method.month.padStart(2, '0')}/${method.year}`}</Text>
            </PaymentItemRowLink>
        </PaymentItemRow>
    )
}

export function TransactionRecord({ transaction: txn, onPress }) {
    return (
        <PaymentItemRow key={txn.id} style={{ borderLeftWidth: 8, borderLeftColor: getTransactionStatusColor(txn.status) }} >
            <PaymentItemRowLink onPress={onPress}>
                <View style={{ flex: 1, justifyContent: 'space-between', alignItems: 'stretch' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            {CARD_ICON[txn.brand]({ size: 20 })}
                            <Text small weight="600" style={{ marginStart: 4 }} textTransform='uppercase' color="#4a4a4a">****{txn.mask}</Text>
                        </View>

                        <Text small weight="600" color="#4a4a4a">EXP: {`${txn.month.padStart(2, '0')}/${txn.year}`}</Text>
                    </View>
                    <View style={{ margin: 12, alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text align='center' title weight="700" color="#444">{CurrencyFormatter.format(txn.amount / 100)}</Text>
                        <Text align='center' small weight="500" color="#6a6a6a">{txn.description}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text small weight="500" textTransform='uppercase' color="#888">{getTransactionStatus(txn.status)}</Text>
                        <Text small weight="500" color="#8888">{moment(txn.dateCreated).calendar()}</Text>
                    </View>
                </View>
            </PaymentItemRowLink>
        </PaymentItemRow>
    )
}

export function PreferredMethodView({ method }) {
    return (
        <PaymentSection>
            <SectionTitle>
                <View style={{ margin: 10 }}>
                    <Text small bold color="#474747">PREFERRED METHODS</Text>
                </View>
            </SectionTitle>

            <PrefferedPaymentItemRow>
                <Column creditCardIcon>
                    {CARD_ICON[method.brand]({ color: '#3869f3', size: 70 })}
                </Column>
                <Column creditCardIconDescription>
                    <Text textTransform='uppercase' medium bold color="#474747">{method.brand} ****{method.mask}</Text>
                    <Text medium color="#474747">{`${method.month}/${method.year}`}</Text>
                </Column>
            </PrefferedPaymentItemRow>
        </PaymentSection>
    )
}

export function AccountView({
    refreshing, balance = 0,
    hasActiveAccount, getDashboardLink,
    setup,
}) {
    return (
        <AccountSection>
            {hasActiveAccount &&
                <TouchableOpacity onPress={getDashboardLink} style={{ position: "absolute", top: 4, right: 4 }}>
                    <FontAwesome size={24} color="#3869f8" name="external-link-square" />
                </TouchableOpacity>
            }

            <View style={{ margin: 10, padding: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name="ios-wallet" size={60} />
                <Text small light>ACCOUNT</Text>
                {!refreshing && <Text title bold color="#474747">{CurrencyFormatter.format(balance / 100)}</Text>}
            </View>

            {refreshing ?
                <View style={{ padding: 20 }} >
                    <ActivityIndicator color='#3869f3' size='small' />
                </View>
                :
                <TouchableOpacity style={{ backgroundColor: '#3869f3', marginBottom: 12, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => {
                        if (hasActiveAccount) {
                            // TODO: fix payout
                            Alert.alert('Working on this', 'Will be out soon')
                        } else {
                            setup()
                        }
                    }}>
                    <Text small bold color='#fff' >{hasActiveAccount ? "PAYOUT" : "SETUP PAYOUT"}</Text>
                </TouchableOpacity>
            }
        </AccountSection>
    )
}

export function PaymentMethodSelector({ jobID, recipient, description, onClose, onSuccess, onError }) {
    const { authState } = useContext(GlobalContext);
    const [selectMethod, setSelectMethod] = useState(false)
    const [amount, setAmount] = useState('')
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()
    const payments = useSelector((state) => state.payment)
    const actionSheet = useActionSheet()

    const onSubmit = useCallback(async () => {
        Confirm({
            title: 'Confirm payment',
            message: 'Do you want to continue with payment?',
            options: ['Yes', 'No'],
            destructiveButtonIndex: 1,
            onPress: async (i) => {
                switch (i) {
                    case 0:
                        try {
                            setLoading(true)
                            const value = parseInt(amount, 10)
                            if (Number.isNaN(value) || !value || value <= 0) {
                                throw new Error('Invalid payment amount specified')
                            }

                            await makePayment({
                                amount: value * 100,
                                description,
                                jobID,
                                method: selectMethod,
                                recipient
                            }, authState, dispatch)

                            setLoading(false)
                            onSuccess(value)
                            Alert.alert('Payment Successful', 'Your money is on its way!')
                        } catch (e) {
                            console.log(e)
                            setLoading(false)
                            Alert.alert('Payment Failed', e.message)
                            // onError(e)
                        }
                        break
                }
            }
        })
    }, [authState, amount, selectMethod])

    return (
        <Modal
            animationType="fade"
            transparent
            visible
            onRequestClose={onClose}
            onDismiss={onClose}
            style={{ height: "100%", backgroundColor: "#0004", justifyContent: "center" }}
        >
            <ScrollView bounces={false} contentContainerStyle={{ justifyContent: "center", flexGrow: 1, backgroundColor: "#0004" }}>
                <SafeAreaView style={{ marginHorizontal: 8, marginVertical: 120 }}>
                    <KeyboardAvoidingView behavior="padding" style={{ justifyContent: "center", margin: 8, flex: 1 }}>
                        <View style={{ flexGrow: 1, padding: 8, paddingVertical: 16, backgroundColor: '#fff', borderRadius: 8, alignItems: "stretch", }}>
                            {loading ?
                                <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
                                    <ActivityIndicator />
                                </View>
                                :
                                !selectMethod ?
                                    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
                                        {payments.methods.map(m => <MethodView key={m.id} method={m} onPress={() => setSelectMethod(m)} />)}
                                    </View>
                                    :
                                    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
                                        <Text>Enter mount You Intend To Pay</Text>
                                        <TextField
                                            disabled={loading}
                                            editable={!loading}
                                            label="PAY"
                                            prefix="$"
                                            labelFontSize={14}
                                            placeholder="0.00"
                                            labelTextStyle={{ color: "grey", fontWeight: "700" }}
                                            keyboardType="numeric"
                                            onChangeText={(text) => {
                                                setAmount(text);
                                            }}
                                            value={amount}
                                        />
                                        <TouchableOpacity style={{ backgroundColor: '#3869f3', marginTop: 8, borderRadius: 20, paddingHorizontal: 20, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' }}
                                            onPress={onSubmit}>
                                            <Text small bold color='#fff' >PAY</Text>
                                        </TouchableOpacity>
                                    </View>
                            }
                            <TouchableOpacity onPress={onClose} style={{ position: "absolute", top: 4, left: 4 }}>
                                <MaterialCommunityIcons size={24} color="red" name="close-circle" />
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </ScrollView>
        </Modal>
    )
}

export const PayoutSelector = ({ job_data, deployee, onCancel, onSubmit }) => {
    const [loading, setLoading] = useState(false);
    const [salary, setSalary] = useState("");
    const [unit, setUnit] = useState(job_data.wage || 'deployment')

    const { showActionSheetWithOptions } = useActionSheet()

    const onSubmitOffer = useCallback(async () => {
        if (salary) {
            setLoading(true);

            const offer = parseFloat(salary).toFixed(2);
            if (Number.isNaN(offer) || isNaN(offer)) {
                return;
            }
            await new Promise(async (res) => {
                Confirm({
                    title: "Confirm Offer",
                    message: `Suggest offer of $${offer}/${unit} to deployer to complete this job?`,
                    options: ["Yes", "No"],
                    cancelButtonIndex: 1,
                    onPress: async (number) => {
                        if (number === 0) {
                            // Save offer
                            try {
                                const offer_received = await JobsController.sendOffer(job_data._id, deployee, offer, unit);
                                job_data.offer_received = offer_received;
                                onSubmit(job_data);
                            } catch (e) {
                                console.log(e, "negotiation send failed");
                                Alert.alert("Failed to confirm offer");
                            }
                        }
                        res();
                    },
                    onCancel: res,
                });
            });

            setLoading(false);
        }
    }, [loading, deployee, job_data, salary, unit]);

    return (
        <Modal coverScreen avoidKeyboard swipeDirection='down' onSwipeComplete={onCancel} isVisible>
            <View style={{ backgroundColor: "#fff", borderRadius: 40, paddingVertical: 16 }}>
                <Row>
                    <JobDescriptionRow>
                        <JobDescription>
                            <Text small light marginBottom="5px">
                                Current Offer
                </Text>
                            <Text small marginBottom="5px">
                                ${job_data.salary}/{job_data.wage}
                            </Text>
                        </JobDescription>

                        <Text small style={{ textTransform: "uppercase", marginVertical: 16, textAlign: "center" }} bold>
                            What offer would you complete this job for?
              </Text>

                        <View style={{ marginVertical: 10, alignItems: 'stretch', justifyContent: 'center', }}>
                            <WageInput style={{ alignItems: 'stretch' }}>
                                <SalaryField style={{ alignItems: 'stretch' }}>
                                    <TextField
                                        disabled={loading}
                                        label="PAY"
                                        prefix="$"
                                        suffix={`/${unit}`}
                                        labelFontSize={14}
                                        placeholder="0.00"
                                        labelTextStyle={{ color: "grey", fontWeight: "700" }}
                                        keyboardType="numeric"
                                        onChangeText={(text) => {
                                            setSalary(text);
                                        }}
                                        value={salary}
                                        onSubmitEditing={onSubmitOffer}
                                    />
                                </SalaryField>
                            </WageInput>
                        </View>
                    </JobDescriptionRow>
                </Row>

                <Row last>
                    <Column style={{ alignItems: "center" }}>
                        <Button disabled={loading} decline onPress={onCancel}>
                            <Text style={{ color: "red" }} medium>
                                Cancel
                </Text>
                        </Button>
                    </Column>
                    <Column>
                        <Button disabled={loading} style={{ flexDirection: "row" }} accept onPress={onSubmitOffer}>
                            {loading ? <ActivityIndicator animating style={{ marginEnd: 4 }} color="white" /> : null}
                            <Text style={{ color: "white" }} medium>
                                Save
                </Text>
                        </Button>
                    </Column>
                </Row>
            </View>
        </Modal>
    );
};

const SectionTitle = styled.View`
  width: 100%;
  padding: 0 5%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const AccountSectionTitle = styled.View`
  width: 100%;
  padding: 0 5%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const PaymentSection = styled.View`
  justify-content: center;
  align-items: center;
  margin: 20px 0 0 0;
`;

const AccountSection = styled.View`
  justify-content: center;
  align-items: center;
  border-width: ${StyleSheet.hairlineWidth / 2}px;
  border-color: #3869f3;
  margin: 20px;
  border-radius: 8px;
  padding: 4px;
  background-color: white;
`;

const PaymentItemRow = styled.View`
  background: white;
  padding: 20px 10px;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
  border: 1px solid #f5f5f5;
`;

const PaymentItemRowLink = styled.TouchableOpacity`
  width: 100%;
  padding: 0 5%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

// Preferred Section

const PrefferedPaymentItemRow = styled.View`
  background: white;
  padding: 0 5%;
  flex-direction: row;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid #f5f5f5;
`;

const Column = styled.View`
  padding: 10px;
  ${({ creditCardIcon, creditCardIconDescription }) => {
        if (creditCardIcon) return "flex: 1";
        if (creditCardIconDescription) return "flex: 3";
    }}
`;
