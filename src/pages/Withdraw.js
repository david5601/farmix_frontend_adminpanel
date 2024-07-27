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
import { render } from "@testing-library/react";
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Tag,
  Space,
  notification,
  Modal,
  Input
} from "antd";
import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { backend_api } from "../config";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import BigNumber from "bignumber.js";
import TronWeb from "tronweb";
import { ethers } from "ethers";
import { SearchOutlined } from "@ant-design/icons";
const Context = React.createContext({
  name: "Default",
});

function Withdraw() {
  const history = useHistory();
  const user = useSelector((state) => state.auth.user);

  const [withdrawList, setWithdrawList] = useState([]);
  const [filteredWithdrawList, setFilteredWithdrawList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isApproveLoading, setIsApproveLoading] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [currentSelectedItem, setCurrentSelectedItem] = useState({});
  const [searchWithdraw, setSearchWithdraw] = useState('')
  const [api, contextHolder] = notification.useNotification();
  const withdraw_columns = [
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => {
        const newDate = new Date(date);
        const options = {
          timeZone: "America/New_York",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false, // 24-hour format
        };

        const newYorkTime = newDate.toLocaleDateString("en-US", options);
        return <div>{newYorkTime}</div>;
      },
    },
    {
      title: "User Name",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "TRX Deposit",
      dataIndex: "trx_deposit",
      key: "trx_deposit",
      render: (_, record) => (
        <Space size="small">
          <div style={{ whiteSpace: "wrap", width: "100px" }}>
            {new BigNumber(record.trx_deposit)
              .div(new BigNumber(1000000000))
              .toString()}{" "}
            trx
          </div>
        </Space>
      ),
    },
    {
      title: "BNB Deposit",
      dataIndex: "bnb_deposit",
      key: "bnb_deposit",
      render: (_, record) => (
        <Space size="small">
          <div style={{ whiteSpace: "wrap", width: "100px" }}>
            {new BigNumber(record.bnb_deposit)
              .div(new BigNumber(1000000000))
              .toString()}{" "}
            bnb
          </div>
        </Space>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address, record) => (
        <Space size="small">
          <div style={{ whiteSpace: "wrap", width: "180px" }}>{address}</div>
        </Space>
      ),
      width: "200px",
    },
    {
      title: "Amount",
      dataIndex: "withdraw_amount",
      key: "withdraw_amount",
      render: (_, record) => (
        <Space size="small">
          <div style={{ whiteSpace: "wrap", width: "100px" }}>
            {new BigNumber(record.withdraw_amount)
              .div(new BigNumber(1000000000))
              .toString()}{" "}
            {record.is_bnb ? "bnb" : "trx"}
          </div>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "is_approved",
      key: "is_approved",
      render: (isApproved, record) => (
        <Space size="small">
          <Tag color={isApproved ? "red" : "geekblue"} key={record.id}>
            {isApproved ? "APPROVED" : "PENDING"}
          </Tag>
        </Space>
      ),
    },
    {
      title: "Approve / txID",
      key: "status",
      dataIndex: "status",
      render: (_, record) => {
        return record.is_approved ? (
          <Space size="small">
            <a style={{ whiteSpace: "wrap", width: "160px" }} target="_blank" href={record.is_bnb ? process.env.REACT_APP_BSC_EXPLORER + record.txID : `${process.env.REACT_APP_TRX_EXPLORER}#/transaction/` + record.txID}>
              {`${record.txID?.slice(0, 6)}...${record.txID?.slice(-4)}`}
            </a>
          </Space>
        ) : (
          <Button
            size="small"
            onClick={() => handleApproveClick(record)}
            disabled={record.is_approved}
          >
            Approve
          </Button>
        );
      },
    },
  ];

  const provider = new ethers.providers.JsonRpcProvider(
    process.env.REACT_APP_BSC_NET_ENDPOINT
  );
  const wallet = new ethers.Wallet(process.env.REACT_APP_BNB_KEY, provider);

  const tronWeb = new TronWeb({
    fullHost: process.env.REACT_APP_TRON_NET_ENDPOINT,
    privateKey: process.env.REACT_APP_TRON_KEY,
  });

  useEffect(() => {
    if (user == null) {
      history.push("/");
      return;
    }
    getWithdrawList();
  }, []);

  const getWithdrawList = () => {
    setLoading(true);
    axios
      .get(`${backend_api}/withdraw`)
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data);
          if (response.data.success) {
            setWithdrawList(response.data.message);
            setFilteredWithdrawList(response.data.message)
          } else {
            notification.error({
              message: "Error",
              description: response.data.message,
            });
          }
        } else {
          notification.error({ message: "Error", description: "Server Error" });
        }
      })
      .catch((error) => {
        notification.error({ message: "Error", description: "Server Error" });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleApproveClick = (data) => {
    setCurrentSelectedItem(data);
    setOpenConfirmModal(true);
  };

  const handleApproveOk = async () => {
    setIsApproveLoading(true);
    if (!currentSelectedItem.is_bnb) {
      try {
        const amountInSun = tronWeb.toSun(
          new BigNumber(currentSelectedItem.withdraw_amount).div(
            new BigNumber(1000000000)
          )
        ); // Convert amount to Sun
        const transaction = await tronWeb.transactionBuilder.sendTrx(
          currentSelectedItem.address,
          amountInSun
        );
        const signedTransaction = await tronWeb.trx.sign(transaction);
        const result = await tronWeb.trx.sendRawTransaction(signedTransaction);
        if (result.result) {
          axios
            .put(`${backend_api}/withdraw/${currentSelectedItem.id}`, {
              txID: result.txid,
              from: tronWeb.address.fromPrivateKey(
                process.env.REACT_APP_TRON_KEY
              ),
              to: currentSelectedItem.address,
              amount: currentSelectedItem.withdraw_amount,
              token_type: 0,
              user_id: currentSelectedItem.telegram_id,
              status: 1,
            })
            .then((res) => {
              console.log(res);
              notification.success({
                message: "success",
                description: "Withdraw Approved",
              });
              getWithdrawList();
            })
            .catch((err) => {
              console.log(err);
              notification.error({
                message: "error",
                description: "Withdraw Approved Faile",
              });
            })
            .finally(() => {});
        } else {
          notification.error({
            message: "error",
            description: "Withdraw Approved Faile",
          });
        }
        setIsApproveLoading(false);
        setOpenConfirmModal(false);
      } catch (err) {
        notification.error({
          message: "error",
          description: "Withdraw Approved Faile",
        });
        setIsApproveLoading(false);
        setOpenConfirmModal(false);
      }
    } else {
      // bnb handle
      try {
        // Convert amount to wei
        const amountInWei = ethers.utils.parseUnits(
          new BigNumber(currentSelectedItem.withdraw_amount)
            .div(new BigNumber(1000000000))
            .toString(),
          "ether"
        );
        const gasPrice = await provider.getGasPrice();

        // Create transaction object
        const tx = {
          to: currentSelectedItem.address,
          value: amountInWei,
          gasLimit: 21000, // Standard gas limit for simple transfers
          gasPrice: await provider.getGasPrice(), // Fetch current gas price
        };

        // Send transaction
        const txResponse = await wallet.sendTransaction(tx);
        await txResponse.wait(); // Wait for transaction confirmation
        // Update the backend with transaction details
        await axios.put(`${backend_api}/withdraw/${currentSelectedItem.id}`, {
          txID: txResponse.hash,
          from: wallet.address,
          to: currentSelectedItem.address,
          amount: currentSelectedItem.withdraw_amount,
          token_type: 1,
          user_id: currentSelectedItem.telegram_id,
          status: 1,
        });

        notification.success({
          message: "Success",
          description: "Withdraw Approved",
        });
        getWithdrawList();
      } catch (err) {
        console.error(err);
        notification.error({
          message: "Error",
          description: "Withdraw Approved Failed",
        });
      } finally {
        setIsApproveLoading(false);
        setOpenConfirmModal(false);
      }
    }
  };
  const handleCancel = () => {
    setOpenConfirmModal(false);
  };

  const handleSearchWithdraw = (e) => {
    setSearchWithdraw(e.target.value)
    const searchKey = e.target.value;
    filterDataAsync(withdrawList, searchKey).then((filteredData) => {
      setFilteredWithdrawList(filteredData);
    });
  }

  const filterDataAsync = (data, key) => {
    return new Promise((resolve) => {
      const filteredData = data.filter(
        (item) =>
          item.txID?.toLowerCase().includes(key.toLowerCase()) ||
          item.address?.toLowerCase().includes(key.toLowerCase()) ||
          item.username?.toLowerCase().includes(key.toLowerCase())
      );
      resolve(filteredData);
    });
  };

  const contextValue = useMemo(
    () => ({
      name: "Ant Design",
    }),
    []
  );

  return (
    <Context.Provider value={contextValue}>
      {contextHolder}

      <>
        <div className="layout-content">
          <Row>
            <Col span={24}>
              <Card title="Withdraw Request List">
              <Row justify="space-between" style={{ marginBottom: "10px" }}>
                <Col md={6}>
                  
                </Col>
                <Col md={6}>
                  <Row style={{display: 'flex', flexDirection: 'row', flexWrap: 'nowrap'}}>
                     
                      <Input
                        prefix={<SearchOutlined />}
                        size="small"
                        placeholder="Search"
                        value={searchWithdraw}
                        onChange={(e) => handleSearchWithdraw(e)}
                      />
                  </Row>
                </Col>
              </Row>
                <Table
                  columns={withdraw_columns}
                  dataSource={filteredWithdrawList}
                  rowKey={(record) => record.id}
                  loading={loading}
                  pagination={true}
                  bordered
                  size="small"
                  scroll={{ y: 500 }}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </>
      <Modal
        title="Delete Script"
        visible={openConfirmModal}
        onOk={handleApproveOk}
        confirmLoading={isApproveLoading}
        onCancel={handleCancel}
      >
        <h3>Are you sure?</h3>
      </Modal>
    </Context.Provider>
  );
}

export default Withdraw;
