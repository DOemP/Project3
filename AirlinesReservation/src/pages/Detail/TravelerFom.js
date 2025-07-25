import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TravelerForm.css';
import { Link } from 'react-router-dom';
import {
    Button,
    InputNumber,
    DatePicker,
    Form,
    Input,
    Select,
    Space,
    Row,
    Col,
} from 'antd';

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 6,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 14,
        },
    },
};

const TravelerForm = ({ tickets }) => {
    const { Option } = Select;

    const [user, setUser] = useState({
        gender: null,
        firstName: null,
        lastName: null,
        dob: null,
        passportNumber: null,
        email: null,
        phone: null,
    });

    const handleInputChange = (e) => {
        setUser((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }));
    }

    const handleDateChange = (date, dateString) => {
        setUser((prevState) => ({
            ...prevState,
            dob: dateString
        }));
    }

    const handleChangeGender = (value) => {
        setUser((prevState) => ({
            ...prevState,
            gender: value
        }));
    };

    const handleSubmit = async () => {
        const params = {
            user: user,
            amount: tickets.reduce((total, ticket) => total + ticket.details.price, 0),
            totalQuantity: tickets.reduce((total, ticket) => total + ticket.details.quantity, 0),
            paymentDetails: tickets.map(ticket => ({
                ticketId: ticket.details.id,
                quantity: ticket.details.quantity,
                position_seat: ticket.position_seat
            }))
        }

        try {
            const response = await axios.post('http://localhost:5223/api/Payments/getUrl', params);
            console.log(response);
            if (response.status === 200) {
                window.location.href = response.data;
            }
        } catch (err) {
            console.log(err);
        }
    }
    return (
        <Form
            className='traveler_form'
            {...formItemLayout}
            style={{
                maxWidth: '100%',
            }}
            size="large"
            layout="vertical"
            onFinish={handleSubmit}
        >
            <Row >
                <Col span={7} >
                    <Form.Item
                        label="Gender"
                        name="Gender"
                        style={{ minWidth: '430px' }}
                        rules={[{ required: true, message: 'Please select Gender' }]}
                    >
                        <Select placeholder="Select Gender" style={{ width: '100%' }} onChange={(value) => handleChangeGender(value)}>
                            <Option value="Male">Male</Option>
                            <Option value="Female">FeMale</Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={17}>
                    <Form.Item
                        label="Full name"
                        name="Full name"
                    >
                        <Space.Compact>
                            <Form.Item
                                name={['Full name', 'First Name']}
                                noStyle
                            // rules={[
                            //     { required: true, message: 'Please enter your first name' },
                            //     {
                            //         pattern: /^[a-zA-Z0-9\s]*$/,
                            //         message: 'First name must not contain special symbols'
                            //     }
                            // ]}
                            >
                                <Input
                                    name='firstName'
                                    style={{
                                        width: '310px',
                                    }}
                                    placeholder="First Name"
                                    onChange={handleInputChange}
                                />
                            </Form.Item>
                            <Form.Item
                                name={['Full name', 'Last Name']}
                                noStyle
                            // rules={[
                            //     { required: true, message: 'Please enter your last name' },
                            //     {
                            //         pattern: /^[a-zA-Z0-9\s]*$/,
                            //         message: 'Last name must not contain special symbols'
                            //     }
                            // ]}
                            >
                                <Input
                                    style={{
                                        width: '310px',
                                    }}
                                    placeholder="Last Name"
                                    name='lastName'
                                    onChange={handleInputChange}
                                />
                            </Form.Item>
                        </Space.Compact>
                    </Form.Item>
                </Col>
            </Row>

            <Row >
                <Col span={12} >
                    <Form.Item
                        label="Date Of Birth"
                        name="DOB"
                        style={{ minWidth: '750px' }}
                        rules={[{ required: true, message: 'Please select your date of birth' }]}
                    >
                        <DatePicker placeholder='Date Of Birth' style={{ width: "100%" }} onChange={(date, dateString) => handleDateChange(date, dateString)} />
                    </Form.Item>
                </Col>

                <Col span={12} >
                    <Form.Item
                        label="Passport Number"
                        name="PassportNumber"
                        style={{ minWidth: '744px' }}
                        rules={[{ required: true, message: 'Please enter your passport number' }]}
                    >
                        <Input type='number' placeholder='Enter passport number' style={{ width: '100%' }} name='passportNumber' onChange={handleInputChange} />
                    </Form.Item>
                </Col>
            </Row>

            {/* <Row >
                <Col span={12} >
                    <Form.Item
                        label="Passport Issuing Country"
                        name="PassportCountry"
                        style={{ minWidth: '744px' }}
                    >
                        <Select placeholder="Select Country" style={{ width: '100%' }}>
                            <Option value="VietNam">VietNam</Option>
                            <Option value="Japan">Japan</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row> */}

            {/* <Row >
                <Col span={12} >
                    <Form.Item
                        label="Passport Expiry"
                        name="PE"
                        style={{ minWidth: '750px' }}
                    >
                        <DatePicker placeholder='Select Passport Expiry' style={{ width: "100%" }} />
                    </Form.Item>
                </Col>

            </Row> */}

            <div className='traveler_booking_detail' style={{ paddingBottom: "15px" }}>
                <div className='Title' style={{ fontWeight: 700, fontSize: "23px", paddingBottom: "10px", lineHeight: 1.25, color: "#fff" }}>
                    Booking detail will be sent to
                </div>
                <Row >

                    <Col span={12} >
                        <Form.Item
                            label="Mobile Number"
                            name="MobileNumber"
                            style={{ minWidth: '750px' }}
                            rules={[{ required: true, message: 'Please enter your mobile number' }]}
                        >
                            <Input type='number' placeholder='Enter you mobile number' style={{ width: '100%' }} name='phone' onChange={handleInputChange} />
                        </Form.Item>
                    </Col>

                    <Col span={12} >
                        <Form.Item
                            label="Email"
                            name="Email"
                            style={{ minWidth: '750px' }}
                            rules={[
                                { required: true, message: 'Please enter your email address' },
                                {
                                    type: 'email',
                                    message: 'Please enter a valid email address'
                                }
                            ]}
                        >
                            <Input placeholder='Enter your email address' style={{ width: '100%' }} name='email' onChange={handleInputChange} />
                        </Form.Item>
                    </Col>


                    <Col span={12} >
                        <Link to={'/:flightId'} className='select_position'>Select Position</Link>
                    </Col>

                </Row>
            </div>

            <Row>
                <Col span={24} className='btn_col'>
                    <Form.Item
                    >
                        <Button type="primary" htmlType="submit" >
                            Payment Via VnPay
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};
export default TravelerForm;