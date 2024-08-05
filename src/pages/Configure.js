/*!
  =========================================================
  * Muse Ant Design Dashboard - v1.0.0
  =========================================================
  * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
  * Copyright 2021 Creative Tim (https://www.creative-tim.com)
  * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
  * Coded by Creative Tim
  =========================================================
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import React, { useState, useEffect, useMemo, useRef } from "react";

import {
  Card,
  Col,
  Row,
  Input,
  Typography,
  Button,
  Select,
  notification,
  Modal
} from "antd";
import axios from "axios";
import { backend_api } from "../config";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { BigNumber } from "bignumber.js";

const { TextArea } = Input;

const Context = React.createContext({
  name: 'Default',
});
function Mail() {
  const history = useHistory();
  const user = useSelector((state) => state.auth.user);

  const [api, contextHolder] = notification.useNotification();

  const [trxAddress, setTrxAddress] = useState('');
  const [bnbAddress, setBnbAddress] = useState('');
  const [trxWithdrawAmount, setTrxWithdrawAmount] = useState('');
  const [bnbWithdrawAmount, setBnbWithdrawAmount] = useState('');
  const [isSaveButtonLoading, setIsSaveButtonLoading] = useState(false);
  const mailFromServer = useRef('');

  useEffect(() => {
    if (user == null) {
      history.push("/");
      return;
    }
    getAdminData()
  }, [])

  const getAdminData = () => {
    axios.get(`${backend_api}/admin?id=${user.id}`).then(res => {
      console.log(res);
      if(res.status === 200) {
        setBnbAddress(res.data.bnb_address)
        setTrxAddress(res.data.trx_address)
        setBnbWithdrawAmount((new BigNumber(res.data.bnb_withdraw_amount)).div(new BigNumber("1000000000")).toString())
        setTrxWithdrawAmount((new BigNumber(res.data.trx_withdraw_amount)).div(new BigNumber("1000000000")).toString())
      }
    }).catch(err => {
      console.log(err)
      notification.error({
        message: 'Error',
        description: 'Error Occurred'
      })

    }).finally(() => {
      setIsSaveButtonLoading(false)
    })
  }

  const handleTrxAddressChange = (e) => {
    setTrxAddress(e.target.value)
  }
  const handleBnbAddressChange = (e) => {
    setBnbAddress(e.target.value)
  }
  const handleTrxWithdrawAmountChange = (e) => {
    setTrxWithdrawAmount(e.target.value)
  }
  const handleBnbWithdrawAmountChange = (e) => {
    setBnbWithdrawAmount(e.target.value)
  }
  const handleSaveButtonClick = () => {
    if(trxAddress === '' || bnbAddress === '' || trxWithdrawAmount === '' || bnbWithdrawAmount === '') {
      notification.info({
        message: 'Input Error',
        description: 'Some fields are missing'
      })
      return;
    }
    setIsSaveButtonLoading(true)
    axios.put(`${backend_api}/admin/${user.id}`, { trxAddress, bnbAddress, trxWithdrawAmount, bnbWithdrawAmount}).then(res => {
      console.log(res);
      notification.success({
        message: 'success',
        description: 'Updated successfully'
      })
    }).catch(err => {
      notification.error({
        message: 'Error',
        description: 'Error Occurred'
      })

    }).finally(() => {
      setIsSaveButtonLoading(false)
    })
  }
  const contextValue = useMemo(
    () => ({
      name: 'Ant Design',
    }),
    [],
  );

  return (
    <Context.Provider value={contextValue}>
      {contextHolder}
      <div className="layout-content">
        <Row>
          <Col span={24}>
            <Card title="Configure">
              <Row gutter={10} style={{marginBottom: '20px'}}>
                <Col span={12}>
                  <Typography.Title level={5}>TRX Admin Address</Typography.Title>
                  <Input placeholder="TAuXaGAamhrgYqWuGHeh2SEf2QjDZZZwaa" value={trxAddress} onChange={handleTrxAddressChange} />
                </Col>
                <Col span={12}>
                  <Typography.Title level={5}>BNB Admin Address</Typography.Title>
                  <Input placeholder="0x0b331664485f6522d06295ad9e2470CeFF1692d4" value={bnbAddress} onChange={handleBnbAddressChange} />
                </Col>
              </Row>
              <Row gutter={10} style={{marginBottom: '20px'}}>
                <Col span={12}>
                  <Typography.Title level={5}>TRX Withdraw Amount</Typography.Title>
                  <Input placeholder="100" value={trxWithdrawAmount} onChange={handleTrxWithdrawAmountChange} />
                </Col>
                <Col span={12}>
                  <Typography.Title level={5}>BNB Withdraw Amount</Typography.Title>
                  <Input placeholder="0.27" value={bnbWithdrawAmount} onChange={handleBnbWithdrawAmountChange} />
                </Col>
              </Row>
              <Row gutter={10} style={{marginBottom: '20px'}} justify="end">
                <Button type="primary" onClick={handleSaveButtonClick} loading={isSaveButtonLoading}>Save</Button>
              </Row>

            </Card>
          </Col>
        </Row>
  
      </div>
    </Context.Provider>
  );
}

export default Mail;
