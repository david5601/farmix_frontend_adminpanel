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
  Radio,
  Table,
  Upload,
  message,
  Progress,
  Button,
  Avatar,
  Typography,
  Input,
  Tag,
  Space,
  Badge,
  notification
} from "antd";
import axios from "axios";
import React, { useEffect, useState, useMemo } from "react";
import { backend_api } from "../config";
const Context = React.createContext({
  name: 'Default',
});
const orc_history_columns = [
  {
    title: "Date",
    dataIndex: "Created_Time",
    key: "Created_Time",
    render: ((date) => {
      const newDate = new Date(date);
      const options = {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // 24-hour format
      };

      const newYorkTime = newDate.toLocaleDateString('en-US', options);
      return (
        <div>{newYorkTime}</div>
      )
    })
  },
  {
    title: "From",
    dataIndex: "Email",
    key: "Email",
  },
  {
    title: "Content",
    dataIndex: "ContentData",
    key: "ContentData",
    render: (ContentData) => {
      return (
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {ContentData}
        </div>
      );
    },
    textWrap: "word-break",
    width: '50%'
  },
  {
    title: "Extracted Data",
    dataIndex: "ExtractedData",
    key: "ExtractedData",
    render: (ExtractedData) => {
      return (
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {ExtractedData}
        </div>
      );
    },
    textWrap: "word-break",
    width: '40%'

  }
];

function OcrResult() {
  const [ocrDataLogs, setOcrDataLogsLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    setLoading(true)
    axios.get(`${backend_api}/get_ocr_data`).then((ocrdataResponse) => {
      if (ocrdataResponse.status == 200) {
          console.log("Patient",ocrdataResponse.data)
          setOcrDataLogsLogs(ocrdataResponse.data.data)
        } else {
          api.info({
            message: `Server Error`,
            description: <Context.Consumer>{({}) => `Error Occured`}</Context.Consumer>,
            placement: 'topRight'
          });
        }
      }).catch((error) => {
      console.log(error)
      }).finally(() => {
        setLoading(false)
      })
  }, [])

  const contextValue = useMemo(
    () => ({
      name: 'Ant Design',
    }),
    [],
  );

  return (
    <Context.Provider value={contextValue}>
      {contextHolder}

    <>
      <div className="layout-content">
        <Row>
          <Col span={24}>
            <Card title="Extracted Email & PDF">
              <Table
                columns={orc_history_columns}
                dataSource={ocrDataLogs}
                rowKey={(record) => record.c_id}
                loading={!ocrDataLogs?.length}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </>
    </Context.Provider>
  );
}

export default OcrResult;
