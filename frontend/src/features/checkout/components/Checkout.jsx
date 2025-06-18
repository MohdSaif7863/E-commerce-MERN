import { Stack, TextField, Typography ,Button, Menu, MenuItem, Select, Grid, FormControl, Radio, Paper, IconButton, Box, useTheme, useMediaQuery} from '@mui/material'
import { LoadingButton } from '@mui/lab'
import React, { useEffect, useState } from 'react'
import { Cart } from '../../cart/components/Cart'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { addAddressAsync, selectAddressStatus, selectAddresses } from '../../address/AddressSlice'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { Link, useNavigate } from 'react-router-dom'
import { createOrderAsync, selectCurrentOrder, selectOrderStatus } from '../../order/OrderSlice'
import { resetCartByUserIdAsync, selectCartItems } from '../../cart/CartSlice'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SHIPPING, TAXES } from '../../../constants'
import {motion} from 'framer-motion'
// Payment Icons
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentIcon from '@mui/icons-material/Payment';
import QrCodeIcon from '@mui/icons-material/QrCode';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

export const Checkout = () => {

    const status=''
    const addresses=useSelector(selectAddresses)
    const [selectedAddress,setSelectedAddress]=useState(addresses[0])
    const [selectedPaymentMethod,setSelectedPaymentMethod]=useState('cash')
    const { register, handleSubmit, watch, reset,formState: { errors }} = useForm()
    const dispatch=useDispatch()
    const loggedInUser=useSelector(selectLoggedInUser)
    const addressStatus=useSelector(selectAddressStatus)
    const navigate=useNavigate()
    const cartItems=useSelector(selectCartItems)
    const orderStatus=useSelector(selectOrderStatus)
    const currentOrder=useSelector(selectCurrentOrder)
    const orderTotal=cartItems.reduce((acc,item)=>(item.product.price*item.quantity)+acc,0)
    const theme=useTheme()
    const is900=useMediaQuery(theme.breakpoints.down(900))
    const is480=useMediaQuery(theme.breakpoints.down(480))
    
    useEffect(()=>{
        if(addressStatus==='fulfilled'){
            reset()
        }
        else if(addressStatus==='rejected'){
            alert('Error adding your address')
        }
    },[addressStatus])

    useEffect(()=>{
        if(currentOrder && currentOrder?._id){
            dispatch(resetCartByUserIdAsync(loggedInUser?._id))
            navigate(`/order-success/${currentOrder?._id}`)
        }
    },[currentOrder])
    
    const handleAddAddress=(data)=>{
        const address={...data,user:loggedInUser._id}
        dispatch(addAddressAsync(address))
    }

    const handleCreateOrder=()=>{
        const order={user:loggedInUser._id,item:cartItems,address:selectedAddress,paymentMode:selectedPaymentMethod,total:orderTotal+SHIPPING+TAXES}
        dispatch(createOrderAsync(order))
    }

  return (
    <Stack flexDirection={'row'} p={2} rowGap={10} justifyContent={'center'} flexWrap={'wrap'} mb={'5rem'} mt={2} columnGap={4} alignItems={'flex-start'}>

        {/* left box */}
        <Stack rowGap={4}>

            {/* heading */}
            <Stack flexDirection={'row'} columnGap={is480?0.3:1} alignItems={'center'}>
                <motion.div  whileHover={{x:-5}}>
                    <IconButton component={Link} to={"/cart"}><ArrowBackIcon fontSize={is480?"medium":'large'}/></IconButton>
                </motion.div>
                <Typography variant='h4'>Shipping Information</Typography>
            </Stack>

            {/* address form */}
            <Stack component={'form'} noValidate rowGap={2} onSubmit={handleSubmit(handleAddAddress)}>
                    <Stack>
                        <Typography  gutterBottom>Type</Typography>
                        <TextField placeholder='Eg. Home, Buisness' {...register("type",{required:true})}/>
                    </Stack>


                    <Stack>
                        <Typography gutterBottom>Street</Typography>
                        <TextField {...register("street",{required:true})}/>
                    </Stack>

                    <Stack>
                        <Typography gutterBottom>Country</Typography>
                        <TextField {...register("country",{required:true})}/>
                    </Stack>

                    <Stack>
                        <Typography  gutterBottom>Phone Number</Typography>
                        <TextField type='number' {...register("phoneNumber",{required:true})}/>
                    </Stack>

                    <Stack flexDirection={'row'}>
                        <Stack width={'100%'}>
                            <Typography gutterBottom>City</Typography>
                            <TextField  {...register("city",{required:true})}/>
                        </Stack>
                        <Stack width={'100%'}>
                            <Typography gutterBottom>State</Typography>
                            <TextField  {...register("state",{required:true})}/>
                        </Stack>
                        <Stack width={'100%'}>
                            <Typography gutterBottom>Postal Code</Typography>
                            <TextField type='number' {...register("postalCode",{required:true})}/>
                        </Stack>
                    </Stack>

                    <Stack flexDirection={'row'} alignSelf={'flex-end'} columnGap={1}>
                        <LoadingButton loading={status==='pending'} type='submit' variant='contained'>add</LoadingButton>
                        <Button color='error' variant='outlined' onClick={()=>reset()}>Reset</Button>
                    </Stack>
            </Stack>

            {/* existing address */}
            <Stack rowGap={3}>

                <Stack>
                    <Typography variant='h6'>Address</Typography>
                    <Typography variant='body2' color={'text.secondary'}>Choose from existing Addresses</Typography>
                </Stack>

                <Grid container gap={2} width={is900?"auto":'50rem'} justifyContent={'flex-start'} alignContent={'flex-start'}>
                        {
                            addresses.map((address,index)=>(
                                <FormControl item >
                                    <Stack key={address._id} p={is480?2:2} width={is480?'100%':'20rem'} height={is480?'auto':'15rem'}  rowGap={2} component={is480?Paper:Paper} elevation={1}>

                                        <Stack flexDirection={'row'} alignItems={'center'}>
                                            <Radio checked={selectedAddress===address} name='addressRadioGroup' value={selectedAddress} onChange={(e)=>setSelectedAddress(addresses[index])}/>
                                            <Typography>{address.type}</Typography>
                                        </Stack>

                                        {/* details */}
                                        <Stack>
                                            <Typography>{address.street}</Typography>
                                            <Typography>{address.state}, {address.city}, {address.country}, {address.postalCode}</Typography>
                                            <Typography>{address.phoneNumber}</Typography>
                                        </Stack>
                                    </Stack>
                                </FormControl>
                            ))
                        }
                </Grid>

            </Stack>
            
            {/* payment methods */}
            <Stack rowGap={3}>

                    <Stack>
                        <Typography variant='h6'>Payment Methods</Typography>
                        <Typography variant='body2' color={'text.secondary'}>Choose your preferred payment option</Typography>
                    </Stack>
                    
                    <Stack rowGap={2}>

                        {/* Cash on Delivery */}
                        <motion.div whileHover={{scale:1.02}} whileTap={{scale:0.98}}>
                            <Stack 
                                flexDirection={'row'} 
                                justifyContent={'space-between'} 
                                alignItems={'center'}
                                p={2}
                                component={Paper}
                                elevation={selectedPaymentMethod==='COD' ? 3 : 1}
                                sx={{
                                    border: selectedPaymentMethod==='COD' ? '2px solid #1976d2' : '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    backgroundColor: selectedPaymentMethod==='COD' ? '#f3f8ff' : 'white',
                                    transition: 'all 0.3s ease'
                                }}
                                onClick={()=>setSelectedPaymentMethod('COD')}
                            >
                                <Stack flexDirection={'row'} alignItems={'center'} columnGap={2}>
                                    <Radio 
                                        value={selectedPaymentMethod} 
                                        name='paymentMethod' 
                                        checked={selectedPaymentMethod==='COD'} 
                                        onChange={()=>setSelectedPaymentMethod('COD')}
                                        sx={{color: selectedPaymentMethod==='COD' ? '#1976d2' : '#666'}}
                                    />
                                    <LocalAtmIcon sx={{color: selectedPaymentMethod==='COD' ? '#1976d2' : '#666'}} />
                                    <Stack>
                                        <Typography fontWeight={500}>Cash on Delivery</Typography>
                                        <Typography variant='body2' color={'text.secondary'}>Pay when you receive</Typography>
                                    </Stack>
                                </Stack>
                                <Typography variant='body2' color={'text.secondary'}>₹0 extra</Typography>
                            </Stack>
                        </motion.div>

                        {/* Credit/Debit Card */}
                        <motion.div whileHover={{scale:1.02}} whileTap={{scale:0.98}}>
                            <Stack 
                                flexDirection={'row'} 
                                justifyContent={'space-between'} 
                                alignItems={'center'}
                                p={2}
                                component={Paper}
                                elevation={selectedPaymentMethod==='CARD' ? 3 : 1}
                                sx={{
                                    border: selectedPaymentMethod==='CARD' ? '2px solid #1976d2' : '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    backgroundColor: selectedPaymentMethod==='CARD' ? '#f3f8ff' : 'white',
                                    transition: 'all 0.3s ease'
                                }}
                                onClick={()=>setSelectedPaymentMethod('CARD')}
                            >
                                <Stack flexDirection={'row'} alignItems={'center'} columnGap={2}>
                                    <Radio 
                                        value={selectedPaymentMethod} 
                                        name='paymentMethod' 
                                        checked={selectedPaymentMethod==='CARD'} 
                                        onChange={()=>setSelectedPaymentMethod('CARD')}
                                        sx={{color: selectedPaymentMethod==='CARD' ? '#1976d2' : '#666'}}
                                    />
                                    <CreditCardIcon sx={{color: selectedPaymentMethod==='CARD' ? '#1976d2' : '#666'}} />
                                    <Stack>
                                        <Typography fontWeight={500}>Credit/Debit Card</Typography>
                                        <Typography variant='body2' color={'text.secondary'}>Visa, Mastercard, RuPay</Typography>
                                    </Stack>
                                </Stack>
                                <Typography variant='body2' color={'text.secondary'}>Secure</Typography>
                            </Stack>
                        </motion.div>

                        {/* UPI Payment */}
                        <motion.div whileHover={{scale:1.02}} whileTap={{scale:0.98}}>
                            <Stack 
                                flexDirection={'row'} 
                                justifyContent={'space-between'} 
                                alignItems={'center'}
                                p={2}
                                component={Paper}
                                elevation={selectedPaymentMethod==='UPI' ? 3 : 1}
                                sx={{
                                    border: selectedPaymentMethod==='UPI' ? '2px solid #1976d2' : '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    backgroundColor: selectedPaymentMethod==='UPI' ? '#f3f8ff' : 'white',
                                    transition: 'all 0.3s ease'
                                }}
                                onClick={()=>setSelectedPaymentMethod('UPI')}
                            >
                                <Stack flexDirection={'row'} alignItems={'center'} columnGap={2}>
                                    <Radio 
                                        value={selectedPaymentMethod} 
                                        name='paymentMethod' 
                                        checked={selectedPaymentMethod==='UPI'} 
                                        onChange={()=>setSelectedPaymentMethod('UPI')}
                                        sx={{color: selectedPaymentMethod==='UPI' ? '#1976d2' : '#666'}}
                                    />
                                    <QrCodeIcon sx={{color: selectedPaymentMethod==='UPI' ? '#1976d2' : '#666'}} />
                                    <Stack>
                                        <Typography fontWeight={500}>UPI Payment</Typography>
                                        <Typography variant='body2' color={'text.secondary'}>Google Pay, PhonePe, Paytm</Typography>
                                    </Stack>
                                </Stack>
                                <Typography variant='body2' color={'text.secondary'}>Instant</Typography>
                            </Stack>
                        </motion.div>

                        {/* Net Banking */}
                        <motion.div whileHover={{scale:1.02}} whileTap={{scale:0.98}}>
                            <Stack 
                                flexDirection={'row'} 
                                justifyContent={'space-between'} 
                                alignItems={'center'}
                                p={2}
                                component={Paper}
                                elevation={selectedPaymentMethod==='NETBANKING' ? 3 : 1}
                                sx={{
                                    border: selectedPaymentMethod==='NETBANKING' ? '2px solid #1976d2' : '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    backgroundColor: selectedPaymentMethod==='NETBANKING' ? '#f3f8ff' : 'white',
                                    transition: 'all 0.3s ease'
                                }}
                                onClick={()=>setSelectedPaymentMethod('NETBANKING')}
                            >
                                <Stack flexDirection={'row'} alignItems={'center'} columnGap={2}>
                                    <Radio 
                                        value={selectedPaymentMethod} 
                                        name='paymentMethod' 
                                        checked={selectedPaymentMethod==='NETBANKING'} 
                                        onChange={()=>setSelectedPaymentMethod('NETBANKING')}
                                        sx={{color: selectedPaymentMethod==='NETBANKING' ? '#1976d2' : '#666'}}
                                    />
                                    <AccountBalanceIcon sx={{color: selectedPaymentMethod==='NETBANKING' ? '#1976d2' : '#666'}} />
                                    <Stack>
                                        <Typography fontWeight={500}>Net Banking</Typography>
                                        <Typography variant='body2' color={'text.secondary'}>All major banks supported</Typography>
                                    </Stack>
                                </Stack>
                                <Typography variant='body2' color={'text.secondary'}>Safe</Typography>
                            </Stack>
                        </motion.div>

                        {/* Digital Wallet */}
                        <motion.div whileHover={{scale:1.02}} whileTap={{scale:0.98}}>
                            <Stack 
                                flexDirection={'row'} 
                                justifyContent={'space-between'} 
                                alignItems={'center'}
                                p={2}
                                component={Paper}
                                elevation={selectedPaymentMethod==='WALLET' ? 3 : 1}
                                sx={{
                                    border: selectedPaymentMethod==='WALLET' ? '2px solid #1976d2' : '1px solid #e0e0e0',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    backgroundColor: selectedPaymentMethod==='WALLET' ? '#f3f8ff' : 'white',
                                    transition: 'all 0.3s ease'
                                }}
                                onClick={()=>setSelectedPaymentMethod('WALLET')}
                            >
                                <Stack flexDirection={'row'} alignItems={'center'} columnGap={2}>
                                    <Radio 
                                        value={selectedPaymentMethod} 
                                        name='paymentMethod' 
                                        checked={selectedPaymentMethod==='WALLET'} 
                                        onChange={()=>setSelectedPaymentMethod('WALLET')}
                                        sx={{color: selectedPaymentMethod==='WALLET' ? '#1976d2' : '#666'}}
                                    />
                                    <AccountBalanceWalletIcon sx={{color: selectedPaymentMethod==='WALLET' ? '#1976d2' : '#666'}} />
                                    <Stack>
                                        <Typography fontWeight={500}>Digital Wallet</Typography>
                                        <Typography variant='body2' color={'text.secondary'}>Amazon Pay, Mobikwik</Typography>
                                    </Stack>
                                </Stack>
                                <Typography variant='body2' color={'text.secondary'}>Fast</Typography>
                            </Stack>
                        </motion.div>

                    </Stack>

            </Stack>
        </Stack>

        {/* right box */}
        <Stack  width={is900?'100%':'auto'} alignItems={is900?'flex-start':''}>
            <Typography variant='h4'>Order summary</Typography>
            <Cart checkout={true}/>
            <LoadingButton fullWidth loading={orderStatus==='pending'} variant='contained' onClick={handleCreateOrder} size='large'>Pay and order</LoadingButton>
        </Stack>

    </Stack>
  )
}
