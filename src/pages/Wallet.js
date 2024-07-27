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
  Input,
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

function Amount({ address, is_bnb }) {
  const [withdrawAmount, setWithdrawAmount] = useState();
  const [error, setError] = useState();
 
  const tronWeb = new TronWeb({
    fullHost: process.env.REACT_APP_TRON_NET_ENDPOINT,
    privateKey: process.env.REACT_APP_TRON_KEY,
  });

  useEffect(() => {
    const fetchBSCBalance = async () => {
      try {
        // Create a new ethers provider
        const provider = new ethers.providers.JsonRpcProvider(
          process.env.REACT_APP_BSC_NET_ENDPOINT
        );
        console.log({ provider });
        // Get the balance of the address
        const balanceBigNumber = await provider.getBalance(address);
        // Update the state with the balance
        setWithdrawAmount(
          new BigNumber(balanceBigNumber.toString())
            .div(new BigNumber("1000000000000000000"))
            .toString()
        );
      } catch (err) {
        // Handle errors
        setError(err.message);
        console.log(err);
      }
    };
    const getTronBalance = async () => {
      try {
        // Get account information
        const account = await tronWeb.trx.getAccount(address);
        // Balance is returned in SUN (1 TRX = 1,000,000 SUN)
        const balanceInSun = account.balance || 0;
        const balanceInTrx = tronWeb.fromSun(balanceInSun);
        console.log(`Balance for address ${address}: ${balanceInTrx} TRX`);
        setWithdrawAmount(balanceInTrx)
      } catch (error) {
        console.error("Error fetching balance:", error);
        getTronBalance()
      }
    };

    if (is_bnb) {
      fetchBSCBalance();
    } else {
      getTronBalance();
    }
  }, [address]);

  const removeTrailingZeros = (num) => {
    // Convert the number to a string
    let numStr = num.toString();

    // Use a regular expression to remove trailing zeros
    numStr = numStr.replace(/(\.\d*?[1-9])0+$/g, "$1"); // remove trailing zeros after decimal point
    numStr = numStr.replace(/\.0+$/, ""); // remove decimal point if there are only zeros after it

    return numStr;
  };

  return (
    <Space size="small">
      <div>
        {!withdrawAmount
          ? "loading"
          : `${removeTrailingZeros(Number(withdrawAmount).toFixed(18))} ${
              is_bnb ? " bnb" : " trx"
            }`}
      </div>
    </Space>
  );
}

function WalletPage() {
  const history = useHistory();
  const user = useSelector((state) => state.auth.user);

  const [withdrawList, setWithdrawList] = useState([]);
  const [filteredWithdrawList, setFilteredWithdrawList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isApproveLoading, setIsApproveLoading] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [currentSelectedItem, setCurrentSelectedItem] = useState({});
  const [searchWithdraw, setSearchWithdraw] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const withdraw_columns = [
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (address, record) => (
        <Space size="small">
          <div style={{ whiteSpace: "wrap" }}>{address}</div>
        </Space>
      ),
    },
    {
      title: "Amount",
      dataIndex: "withdraw_amount",
      key: "withdraw_amount",
      render: (_, record) => (
        <Amount address={record.address} is_bnb={record.is_bnb} />
      ),
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
    getWalletlist();
  }, []);

  const getWalletlist = () => {
    setLoading(true);
    axios
      .get(`${backend_api}/wallet`)
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data);
          if (response.data.success) {
            setWithdrawList(response.data.message);
            setFilteredWithdrawList(response.data.message);
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

  const handleApproveClick = () => {
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
              getWalletlist();
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
        getWalletlist();
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
    setSearchWithdraw(e.target.value);
    const searchKey = e.target.value;
    filterDataAsync(withdrawList, searchKey).then((filteredData) => {
      setFilteredWithdrawList(filteredData);
    });
  };

  const filterDataAsync = (data, key) => {
    return new Promise((resolve) => {
      const filteredData = data.filter((item) =>
        item.address?.toLowerCase().includes(key.toLowerCase())
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
              <Card title="Wallet List">
                <Row justify="space-between" style={{ marginBottom: "10px" }}>
                  <Col md={6}>
                  <Button size="small" onClick={() => handleApproveClick()}>
                    Transfer All
                  </Button>
                  </Col>
                  <Col md={6}>
                    <Row
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "nowrap",
                      }}
                    >
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
        title="Transfer to my wallet"
        visible={openConfirmModal}
        onOk={handleApproveOk}
        confirmLoading={isApproveLoading}
        onCancel={handleCancel}
      >
        <h3>Confirm your wallet address again.</h3>
      </Modal>
    </Context.Provider>
  );
}

export default WalletPage;
