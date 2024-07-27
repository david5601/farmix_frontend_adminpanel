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
import React, { useEffect, useState, useMemo } from "react";

import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Space,
  Table,
  notification,
  Form,
  Modal,
  Select,
  Upload,
} from "antd";
import { backend_api } from "../config";
import axios from "axios";
import { render } from "@testing-library/react";
import {
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { current } from "@reduxjs/toolkit";
import TextArea from "antd/lib/input/TextArea";
import Papa from "papaparse";
import BN from "bn.js";
const Context = React.createContext({
  name: "Default",
});

function Home() {
  const history = useHistory();
  const user = useSelector((state) => state.auth.user);

  const [userData, setUserData] = useState([]);
  const [userDataLoading, setUserDataLoading] = useState(false);
  const [searchUser, setSearchLawFirm] = useState("");
  const [filteredUserData, setFilteredUserData] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  useEffect(() => {
    if (user == null) {
      history.push("/");
      return;
    }

    getUsers();
  }, []);


  const getUsers = () => {
    setUserDataLoading(true);
    axios
      .get(`${backend_api}/user`)
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data);
          if (response.data.success) {
            setUserData(response.data.message);
            setFilteredUserData(response.data.message);
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
        setUserDataLoading(false)
      });
  };


  const handleSearchUserChange = (e) => {
    setSearchLawFirm(e.target.value);
    const searchKey = e.target.value;
    filterDataAsync(userData, searchKey).then((filteredData) => {
      setFilteredUserData(filteredData);
    });
  };

  const filterDataAsync = (data, key) => {
    return new Promise((resolve) => {
      const filteredData = data.filter(
        (item) =>
          item.first_name?.toLowerCase().includes(key.toLowerCase()) ||
          item.last_name?.toLowerCase().includes(key.toLowerCase()) ||
          item.username?.toLowerCase().includes(key.toLowerCase())
      );
      resolve(filteredData);
    });
  };

  const user_columns = [
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
      render(data) {
        return <div style={{ whiteSpace: "pre-wrap" }}>{data}</div>;
      },
      textWrap: "word-break",
      ellipsis: true,
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render(data) {
        return <div style={{ whiteSpace: "pre-wrap" }}>@{data}</div>;
      },
      textWrap: "word-break",
      ellipsis: true,
    },
    {
      title: "TRX Deposit Amount",
      dataIndex: "trx_deposit_amount",
      key: "trx_deposit_amount",
      render(data) {
        return <div style={{ whiteSpace: "pre-wrap" }}>{new BN(data).toNumber() / 1000000000} trx</div>;
      },
    },
    {
      title: "BNB Deposit Amount",
      dataIndex: "bnb_deposit_amount",
      key: "bnb_deposit_amount",
      render(data) {
        return <div style={{ whiteSpace: "pre-wrap" }}>{new BN(data).toNumber() / 1000000000} bnb</div>;
      },
    },
    {
      title: "TH",
      dataIndex: "th_speed",
      key: "th_speed",
      render(data) {
        return <div style={{ whiteSpace: "pre-wrap" }}>{new BN(data).toNumber() / 1000000000}</div>;
      },
      textWrap: "word-break",
      ellipsis: true,
    },
  
    {
      title: "Referral Count",
      dataIndex: "referral_counts",
      key: "referral_counts",
      textWrap: "word-break",
      ellipsis: true,
    },
    // {
    //   title: "View",
    //   render(_, record) {
    //     return (
    //       <div>
    //         <Button type="link" onClick={(e) => handleDetailButton(record)}>
    //           Detail
    //         </Button>
    //       </div>
    //     );
    //   },
    // },
    // {
    //   title: "Delete",
    //   render(_, record) {
    //     return (
    //       <div>
    //         <Button
    //           type="link"
    //           danger
    //           onClick={(e) => handleDeleteButton(record)}
    //         >
    //           Delete
    //         </Button>
    //       </div>
    //     );
    //   },
    // },
  ];

  const contextValue = useMemo(
    () => ({
      name: "Ant Design",
    }),
    []
  );

  return (
    <Context.Provider value={contextValue}>
      {contextHolder}
      <div className="layout-content">
        <Row>
          <Col span={24}>
            <Card title="Users">
              <Row justify="space-between" style={{ marginBottom: "10px" }}>
                <Col md={6}>
                  
                </Col>
                <Col md={6}>
                  <Row style={{display: 'flex', flexDirection: 'row', flexWrap: 'nowrap'}}>
                     
                      <Input
                        prefix={<SearchOutlined />}
                        size="small"
                        placeholder="Search"
                        value={searchUser}
                        onChange={(e) => handleSearchUserChange(e)}
                      />
                  </Row>
                </Col>
              </Row>
              <Table
                columns={user_columns}
                dataSource={filteredUserData}
                scroll={{ x: true }}
                rowKey={(record) => record.id}
                loading={userDataLoading}
                pagination={true}
                bordered
                size="small"
                
              />
            </Card>
          </Col>
        </Row>
     
      </div>
    </Context.Provider>
  );
}

export default Home;
