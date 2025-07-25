import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

const PaymentError = () => {
    return (
        <section style={{ color: "white", height: "907px", display: "flex", justifyContent: "center", alignItems: "center", padding: "90px 0" }}>
            <div style={{ textAlign: "center" }}>
                <h1>Payment Failed</h1>
                <p>Unfortunately, your payment could not be processed. Please try again.</p>
                <Link to="/">
                    <Button type="primary" htmlType="submit">
                        Return to Home
                    </Button>
                </Link>
            </div>
        </section>
    );
}

export default PaymentError;